import express from 'express';
import cors from 'cors';
import path from 'path';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set('trust proxy', 1);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(express.static(__dirname));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BOT_TOKEN = process.env.BOT_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

const requestCooldown = new Map();
const notifiedUsers = new Set();
const getUserCache = new Map();
const withdrawLocks = new Map();
const taskCompletionLocks = new Map();
const promoCodeLocks = new Map();
const adCooldowns = new Map();

function logFailure(endpoint, userId, ip, error, extra = {}) {
    console.error(`❌ [${endpoint}] FAILED`, JSON.stringify({ userId: userId || 'unknown', ip: ip || 'unknown', error: error?.message || error, ...extra }));
}

const generalLimiter = rateLimit({ windowMs: 60 * 1000, max: 120, keyGenerator: (req) => req._userId?.toString() || req.ip, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many requests.' } });
const strictLimiter = rateLimit({ windowMs: 60 * 1000, max: 30, keyGenerator: (req) => req._userId?.toString() || req.ip, standardHeaders: true, legacyHeaders: false, message: { error: 'Please wait.' } });
const veryStrictLimiter = rateLimit({ windowMs: 60 * 1000, max: 5, keyGenerator: (req) => req._userId?.toString() || req.ip, standardHeaders: true, legacyHeaders: false, message: { error: 'Please wait longer.' } });

app.use('/api/', generalLimiter);

function checkCooldown(userId, endpoint, cooldownMs = 1500) {
    const now = Date.now();
    const key = `${userId}_${endpoint}`;
    const lastCall = requestCooldown.get(key) || 0;
    if (now - lastCall < cooldownMs) return false;
    requestCooldown.set(key, now);
    return true;
}

function checkTaskCompletionCooldown(userId) {
    const now = Date.now();
    const key = `task_completion_${userId}`;
    const lastCompletion = taskCompletionLocks.get(key) || 0;
    const cooldownMs = 10000;
    if (now - lastCompletion < cooldownMs) return { allowed: false, remaining: Math.ceil((cooldownMs - (now - lastCompletion)) / 1000) };
    return { allowed: true, remaining: 0 };
}

function setTaskCompletionCooldown(userId) { taskCompletionLocks.set(`task_completion_${userId}`, Date.now()); }

function checkPromoCooldown(userId) {
    const now = Date.now();
    const key = `promo_${userId}`;
    const lastPromo = promoCodeLocks.get(key) || 0;
    const cooldownMs = 5000;
    if (now - lastPromo < cooldownMs) return { allowed: false, remaining: Math.ceil((cooldownMs - (now - lastPromo)) / 1000) };
    return { allowed: true, remaining: 0 };
}

function setPromoCooldown(userId) { promoCodeLocks.set(`promo_${userId}`, Date.now()); }

function checkAdCooldown(userId, adType) {
    const now = Date.now();
    const key = `ad_${adType}_${userId}`;
    const lastWatch = adCooldowns.get(key) || 0;
    const cooldownMs = 3 * 60 * 1000;
    if (now - lastWatch < cooldownMs) return { allowed: false, remaining: Math.ceil((cooldownMs - (now - lastWatch)) / 1000) };
    return { allowed: true, remaining: 0 };
}

function setAdCooldown(userId, adType) { adCooldowns.set(`ad_${adType}_${userId}`, Date.now()); }

function validateTelegramInitData(initData, botToken) {
    if (!initData || !botToken) return { valid: false, error: 'Missing data' };
    try {
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get('hash');
        if (!hash) return { valid: false, error: 'Missing hash' };
        urlParams.delete('hash');
        const dataCheckString = Array.from(urlParams.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join('\n');
        const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
        const calculatedHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
        if (calculatedHash !== hash) return { valid: false, error: 'Invalid hash' };
        const authDate = parseInt(urlParams.get('auth_date'));
        if (Math.floor(Date.now() / 1000) - authDate > 86400) return { valid: false, error: 'Expired' };
        const userJson = urlParams.get('user');
        let user = null;
        if (userJson) { try { user = JSON.parse(userJson); } catch (e) { return { valid: false, error: 'Invalid user' }; } }
        return { valid: true, user, authDate, queryId: urlParams.get('query_id') };
    } catch (error) { return { valid: false, error: error.message }; }
}

function generateJWT(userId, telegramId) { return jwt.sign({ userId, telegramId, iat: Math.floor(Date.now() / 1000) }, JWT_SECRET, { expiresIn: '7d' }); }
function verifyJWT(token) { try { return jwt.verify(token, JWT_SECRET); } catch (error) { return null; } }

function authenticate(req, res, next) {
    let token = req.cookies?.token;
    if (!token) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.split(' ')[1];
    }
    if (!token) return res.status(401).json({ error: 'No token provided' });
    const decoded = verifyJWT(token);
    if (!decoded) return res.status(401).json({ error: 'Invalid or expired token' });
    req._userId = decoded.userId;
    req._telegramId = decoded.telegramId;
    next();
}

async function checkBotIsAdminInChannel(channelUsername) {
    if (!BOT_TOKEN) return false;
    try {
        const botInfo = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`).then(r => r.json());
        if (!botInfo.ok) return false;
        const botId = botInfo.result.id;
        const botMember = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=@${channelUsername}&user_id=${botId}`).then(r => r.json());
        if (!botMember.ok) return false;
        return ['administrator', 'creator'].includes(botMember.result?.status);
    } catch (error) { return false; }
}

async function checkUserInChannel(userId, channelUsername) {
    if (!BOT_TOKEN || !channelUsername) return true;
    try {
        const chatMember = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=@${channelUsername}&user_id=${userId}`).then(r => r.json());
        return chatMember.ok && ['member', 'administrator', 'creator'].includes(chatMember.result?.status);
    } catch (error) { return false; }
}

const APP_CONFIG = {
    APP_NAME: "GRAM HUNTERS 🎯",
    BOT_USERNAME: "GramHunterBot",
    MINIMUM_WITHDRAW: 10000,
    MAXIMUM_WITHDRAW: 1000000,
    WITHDRAWAL_FEES: 0,
    REFERRAL_PERCENTAGE: 10,
    MINING_SESSION_HOURS: 12,
    MINING_CLAIM_HOURS: 1,
    DAILY_MINING_LIMIT: 3,
    MINING_COOLDOWN_SECONDS: 60,
    TASK_VERIFICATION_DELAY: 10,
    DEFAULT_USER_AVATAR: "https://slho.shop/i/8067",
    TON_WALLET_ADDRESS: "UQAWoiLpbPqpHjpteK2CHGizA6OimyPXZBWsx9Nw1IMPyUrm",
    PAYMENT_WALLET: "UQAWoiLpbPqpHjpteK2CHGizA6OimyPXZBWsx9Nw1IMPyUrm",
    INTERSTITIAL_AD_BLOCK_ID: "int-55880",
    REWARD_AD_BLOCK_ID: "55881",
    ADEXORA_ZONE_ID: "2221",
    BOT_LINK: "https://t.me/GramHtrsbot?start=",
    TASK_REWARD: 100,
    TASK_IMAGE: "https://slho.shop/i/8067",
    GRAM_ICON: "https://i.ibb.co/Q3LyfHL6/file-00000000aec481f4a4599f4c3a9fee9a.png",
    COIN_ICON: "https://slho.shop/i/8124",
    MINING_ICON: "https://slho.shop/i/8067",
    APP_LOGO: "https://slho.shop/i/8067",
    COIN_TO_GRAM_RATE: 1000000,
    POWER_BONUS_PERCENTAGE: 10,
    REFERRAL_TASKS_PERCENTAGE: 20,
    REFERRAL_PROMO_PERCENTAGE: 20,
    REFERRAL_MINING_PERCENTAGE: 10,
    REFERRAL_MAX_PERCENTAGE: 50,
    REFERRAL_MAX_COMMISSION_COIN: 20,
    REFERRAL_MAX_COMMISSION_POWER: 100,
    REFERRAL_BONUS_POWER: 100,
    AD_REWARD_POWER: 50,
    AD_REWARD_COIN: 20,
    AD_DAILY_LIMIT: 5,
    AD_COOLDOWN_MINUTES: 3,
    MIN_CLAIM_COIN: 1,
    PRICE_PER_100: 0.10,
    COMMUNITY_COIN_REWARD: 50,
    COMMUNITY_POWER_REWARD: 50,
    DAILY_BONUS_COIN: 100,
    LARGE_TRANSACTION_THRESHOLD: 50000,
    TASK_COMPLETION_COOLDOWN_SECONDS: 10,
    PROMO_CODE_COOLDOWN_SECONDS: 5,
    PROMO_CODE_POWER_PRICE_PER_1000: 0.05,
    PROMO_CODE_COIN_PRICE_PER_1000: 0.10,
    PROMO_CODE_MIN_TOTAL: 50,
    PROMO_CODE_MAX_TOTAL: 5000,
    PROMO_CODES_CHANNEL: "https://t.me/GramHunters_Codes",
    PROMO_CODES_CHANNEL_USERNAME: "GramHunters_Codes",
    NOTIFICATIONS_CHANNEL: "@GramHunters_Notifications",
    TASKS_CHANNEL: "@GHT_TASKS",
    PAYMENTS_CHANNEL: "https://t.me/Hunters_Proof",
    LIVE_PAYMENTS_CHANNEL: "https://t.me/Hunters_Proof",
    QUESTS: {
        miner_quests: [
            { miner_id: "bronze", reward: 100 },
            { miner_id: "silver", reward: 500 },
            { miner_id: "gold", reward: 1000 },
            { miner_id: "diamond", reward: 3000 },
            { miner_id: "master", reward: 5000 },
            { miner_id: "hunters", reward: 10000 }
        ],
        task_quests: [
            { target_tasks: 10, reward: 500 },
            { target_tasks: 50, reward: 1000 },
            { target_tasks: 100, reward: 2000 },
            { target_tasks: 500, reward: 3000 },
            { target_tasks: 1000, reward: 5000 }
        ],
        referral_quests: [
            { target_referrals: 5, reward: 1000 },
            { target_referrals: 10, reward: 2000 },
            { target_referrals: 25, reward: 4000 },
            { target_referrals: 50, reward: 7000 },
            { target_referrals: 100, reward: 10000 },
            { target_referrals: 250, reward: 15000 },
            { target_referrals: 500, reward: 20000 },
            { target_referrals: 1000, reward: 30000 }
        ]
    },
    MINERS: [
        { id: "bronze", name: "Bronze", speed_per_hour: 10, duration_days: 0, price_power: 0, color: "#CD7F32", gradient: "linear-gradient(135deg, #B87333, #8B4513, #6B3A1F)", logo: "https://slho.shop/i/8098", bg_icon: "🥉" },
        { id: "silver", name: "Silver", speed_per_hour: 20, duration_days: 30, price_power: 10000, color: "#C0C0C0", gradient: "linear-gradient(135deg, #A8A8A8, #7A7A7A, #4A4A4A)", logo: "https://slho.shop/i/8097", bg_icon: "🥈" },
        { id: "gold", name: "Gold", speed_per_hour: 100, duration_days: 30, price_power: 50000, color: "#FFD700", gradient: "linear-gradient(135deg, #B8860B, #8B6508, #5C4A05)", logo: "https://slho.shop/i/8096", bg_icon: "🥇" },
        { id: "diamond", name: "Diamond", speed_per_hour: 200, duration_days: 30, price_power: 100000, color: "#00CED1", gradient: "linear-gradient(135deg, #008B8B, #005F5F, #003D3D)", logo: "https://slho.shop/i/8094", bg_icon: "💎" },
        { id: "master", name: "Master", speed_per_hour: 1000, duration_days: 30, price_power: 500000, color: "#9400D3", gradient: "linear-gradient(135deg, #5B0087, #3D0059, #24003A)", logo: "https://slho.shop/i/8093", bg_icon: "⚡" },
        { id: "hunters", name: "Hunters", speed_per_hour: 3000, duration_days: 30, price_power: 1000000, color: "#4A90D9", gradient: "linear-gradient(135deg, #2563EB, #1D4ED8, #0F2E7A)", logo: "https://slho.shop/i/8099", bg_icon: "🎯" }
    ]
};

function getUserActiveMiner(user) {
    if (!user.miner_id) return APP_CONFIG.MINERS.find(m => m.id === 'bronze');
    const miner = APP_CONFIG.MINERS.find(m => m.id === user.miner_id);
    if (!miner) return APP_CONFIG.MINERS.find(m => m.id === 'bronze');
    if (miner.duration_days === 0) return miner;
    if (user.miner_expires_at && Date.now() > user.miner_expires_at) return APP_CONFIG.MINERS.find(m => m.id === 'bronze');
    return miner;
}

async function updateUserLevel(userId) {
    const user = await getUser(userId);
    if (!user) return;
    const power = user.power_balance || 0;
    let newLevel = 1;
    if (power >= 1000000) newLevel = 10;
    else if (power >= 500000) newLevel = 9;
    else if (power >= 250000) newLevel = 8;
    else if (power >= 100000) newLevel = 7;
    else if (power >= 50000) newLevel = 6;
    else if (power >= 20000) newLevel = 5;
    else if (power >= 10000) newLevel = 4;
    else if (power >= 5000) newLevel = 3;
    else if (power >= 1000) newLevel = 2;
    if (user.level !== newLevel) await updateUser(userId, { level: newLevel });
    return newLevel;
}

function getCurrentTime() { return Date.now(); }

function getTodayString() {
    const d = new Date();
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

function calculateMiningReward(user, startTime, endTime) {
    const activeMiner = getUserActiveMiner(user);
    const sessionHours = Math.min((endTime - startTime) / 3600000, APP_CONFIG.MINING_SESSION_HOURS);
    return activeMiner.speed_per_hour * sessionHours;
}

async function addReferralCommission(referrerId, amount, type) {
    if (!referrerId || amount <= 0) return;
    const referrer = await getUser(referrerId);
    if (!referrer || referrer.state === 'ban') return;
    const MAX_COIN = APP_CONFIG.REFERRAL_MAX_COMMISSION_COIN || 20;
    const MAX_POWER = APP_CONFIG.REFERRAL_MAX_COMMISSION_POWER || 100;
    let updates = {};
    if (type === 'coin') {
        const actualAmount = Math.min(amount, MAX_COIN);
        updates.referral_coin_earnings = (referrer.referral_coin_earnings || 0) + actualAmount;
    } else if (type === 'power') {
        const actualAmount = Math.min(amount, MAX_POWER);
        updates.referral_power_earnings = (referrer.referral_power_earnings || 0) + actualAmount;
    }
    if (Object.keys(updates).length > 0) await updateUser(referrerId, updates);
}

async function checkLargeTransaction(userId, amount, source) {
    if (amount >= (APP_CONFIG.LARGE_TRANSACTION_THRESHOLD || 50000)) {
        const user = await getUser(userId);
        const adminId = process.env.ADMIN_USER_ID;
        if (adminId) {
            await sendTelegramNotification(adminId, '💰 LARGE TRANSACTION!',
                `<b>⚠️ Large Transaction Alert</b>\n\n<b>👤 User:</b> ${user.first_name} (${userId})\n<b>💎 Amount:</b> +${amount.toFixed(3)} ${source.includes('COIN') ? 'COIN' : 'Power'}\n<b>📌 Source:</b> ${source}`);
        }
    }
}

async function getUser(userId) {
    try {
        const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    } catch (error) { return null; }
}

async function createUser(userData) {
    try {
        const { data, error } = await supabase.from('users').insert([userData]).select().single();
        if (error) throw error;
        return data;
    } catch (error) { throw error; }
}

async function updateUser(userId, updates) {
    try {
        const { data, error } = await supabase.from('users').update(updates).eq('id', userId).select().single();
        if (error) throw error;
        getUserCache.delete(`getUser_${userId}`);
        return data;
    } catch (error) { throw error; }
}

async function getTasks(category, userId) {
    try {
        let query = supabase.from('tasks').select('*');
        if (category) query = query.eq('category', category);
        const { data: tasks, error } = await query;
        if (error) throw error;
        const { data: completed } = await supabase.from('user_completed_tasks').select('task_id').eq('user_id', userId);
        const completedIds = new Set(completed?.map(t => t.task_id) || []);
        return tasks.filter(task => !completedIds.has(task.id) && (task.total_completed || 0) < task.total) || [];
    } catch (error) { return []; }
}

async function getCompletedTasks(userId) {
    try {
        const { data, error } = await supabase.from('user_completed_tasks').select('task_id').eq('user_id', userId);
        if (error) throw error;
        return data ? data.map(t => t.task_id) : [];
    } catch (error) { return []; }
}

async function getWithdrawals(userId) {
    try {
        const { data, error } = await supabase.from('withdrawals').select('*').eq('user_id', userId).order('timestamp', { ascending: false }).limit(20);
        if (error) throw error;
        return data || [];
    } catch (error) { return []; }
}

async function getLiveWithdrawals() {
    try {
        const { data, error } = await supabase.from('withdrawals').select('*').order('timestamp', { ascending: false }).limit(20);
        if (error) throw error;
        return (data || []).map(w => ({
            ...w,
            wallet_masked: w.wallet ? w.wallet.substring(0, 5) + '***' + w.wallet.substring(w.wallet.length - 5) : '***'
        }));
    } catch (error) { return []; }
}

async function getPromoCode(code) {
    try {
        const { data, error } = await supabase.from('promo_codes').select('*').eq('code', code).single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    } catch (error) { return null; }
}

async function getActivePromoCodes(userId) {
    try {
        const { data: codes, error } = await supabase.from('promo_codes').select('*').eq('status', 'active').gt('max_uses', 0);
        if (error) throw error;
        const { data: used } = await supabase.from('used_promo_codes').select('code').eq('user_id', userId);
        const usedCodes = new Set(used?.map(u => u.code) || []);
        return (codes || []).filter(c => !usedCodes.has(c.code) && (c.total_uses || 0) < c.max_uses && c.owner !== userId).map(c => ({ ...c, is_used: false }));
    } catch (error) { return []; }
}

async function usePromoCode(userId, code) {
    try {
        const { data, error } = await supabase.from('used_promo_codes').insert([{ user_id: userId, code, used_at: getCurrentTime() }]).select().single();
        if (error) throw error;
        return data;
    } catch (error) { throw error; }
}

async function incrementPromoUses(code) {
    try {
        const { data: promo } = await supabase.from('promo_codes').select('total_uses').eq('code', code).single();
        const newTotal = (promo?.total_uses || 0) + 1;
        const { data, error } = await supabase.from('promo_codes').update({ total_uses: newTotal }).eq('code', code).select().single();
        if (error) throw error;
        return data;
    } catch (error) { throw error; }
}

async function createWithdrawal(withdrawalData) {
    try {
        const { data, error } = await supabase.from('withdrawals').insert([withdrawalData]).select().single();
        if (error) throw error;
        return data;
    } catch (error) { throw error; }
}

async function sendTelegramNotification(userId, title, message, inlineButton = null) {
    if (!BOT_TOKEN || !userId) return;
    try {
        const payload = { chat_id: userId, text: message, parse_mode: 'HTML', disable_web_page_preview: true };
        if (inlineButton) payload.reply_markup = { inline_keyboard: [[{ text: inlineButton.text, url: inlineButton.url }]] };
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } catch (error) {}
}

async function sendChannelNotification(channelId, message, inlineButton = null) {
    if (!BOT_TOKEN || !channelId) return;
    try {
        const payload = { chat_id: channelId, text: message, parse_mode: 'HTML', disable_web_page_preview: true };
        if (inlineButton) payload.reply_markup = { inline_keyboard: [[{ text: inlineButton.text, url: inlineButton.url }]] };
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } catch (error) {}
}

async function sendWithdrawalProof(userId, wallet, gramAmount, coinAmount) {
    try {
        const channelId = APP_CONFIG.PAYMENTS_CHANNEL;
        if (!channelId) return;
        const channelMatch = channelId.match(/t\.me\/([^\/\?]+)/);
        if (!channelMatch) return;
        const maskedWallet = wallet.substring(0, 5) + '****' + wallet.substring(wallet.length - 5);
        const message = `<b>🆕 New Withdrawal Requested!</b>\n\n<b>👤 User:</b> ${userId.toString().slice(0, -3)}***\n<b>💰 Amount:</b> ${gramAmount.toFixed(5)} GRAM\n<b>🪙 COIN:</b> ${coinAmount.toFixed(0)} COIN\n<b>📭 Wallet:</b> ${maskedWallet}\n<b>⏳ Status:</b> Processing\n\n<b>🎯 HUNT & EARN FREE GRAM</b>`;
        await sendChannelNotification('@' + channelMatch[1], message, { text: '🎯 Launch Now', url: 'https://t.me/GramHunterBot?start=start' });
    } catch (error) {}
}

class OxaPay {
    constructor(config) {
        this.apiKey = config.apiKey;
        this.sandbox = config.sandbox || false;
        this.baseUrl = this.sandbox ? 'https://sandbox.oxapay.com/v1' : 'https://api.oxapay.com/v1';
    }
    async request(endpoint, data) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = { 'Content-Type': 'application/json', 'payout_api_key': this.apiKey };
        try {
            const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(data) });
            const responseText = await response.text();
            let result;
            try { result = JSON.parse(responseText); } catch (e) { throw new Error('Invalid response'); }
            if (!response.ok || result.status !== 200) throw new Error(result.message || result.error || `HTTP ${response.status}`);
            return result;
        } catch (error) { throw error; }
    }
    async createPayout(data) {
        try {
            const payload = { address: data.toAddress, amount: data.amount, currency: data.currency || 'GRAM', network: data.network || 'TON', description: data.description || 'Withdrawal' };
            const result = await this.request('/payout', payload);
            return { ...result, trackId: result?.data?.track_id || result?.track_id || 'N/A', status: result?.data?.status || result?.status || 'processing', txHash: result?.data?.tx_hash || result?.tx_hash || null, success: true };
        } catch (error) { throw error; }
    }
    async getPayoutStatus(trackId) {
        const url = `${this.baseUrl}/payout/${trackId}`;
        const headers = { 'payout_api_key': this.apiKey, 'Content-Type': 'application/json' };
        try {
            const response = await fetch(url, { method: 'GET', headers });
            const responseText = await response.text();
            let result;
            try { result = JSON.parse(responseText); } catch (e) { throw new Error('Invalid response'); }
            if (!response.ok || result.status !== 200) throw new Error(result.message || result.error || `HTTP ${response.status}`);
            return result;
        } catch (error) { throw error; }
    }
}

async function checkPendingWithdrawals() {
    try {
        const { data: withdrawals, error } = await supabase.from('withdrawals').select('*').in('status', ['pending', 'processing']).limit(50);
        if (error || !withdrawals || withdrawals.length === 0) return;
        const oxapay = new OxaPay({ apiKey: process.env.OXAPAY_API_KEY, sandbox: process.env.NODE_ENV !== 'production' });
        for (const withdrawal of withdrawals) {
            try {
                if (!withdrawal.tx_id || withdrawal.tx_id === 'N/A' || withdrawal.tx_id === 'manual') continue;
                const statusResult = await oxapay.getPayoutStatus(withdrawal.tx_id);
                if (statusResult && statusResult.data) {
                    const oxaPayStatus = statusResult.data.status;
                    if (oxaPayStatus === 'confirmed' || oxaPayStatus === 'completed') {
                        await supabase.from('withdrawals').update({ status: 'completed', tx_hash: statusResult.data.tx_hash || withdrawal.tx_hash }).eq('id', withdrawal.id);
                        const txHash = statusResult.data.tx_hash || withdrawal.tx_hash;
                        const explorerUrl = txHash ? `https://tonscan.org/tx/${txHash}` : '#';
                        await sendTelegramNotification(withdrawal.user_id, '✅ Withdrawal Completed', `<b>✅ Confirmed!</b>\n\n💸 <code>${withdrawal.gram_amount.toFixed(5)}</code> <b>GRAM sent</b>\n\n<a href="${explorerUrl}">🔘 View</a>`);
                        const adminId = process.env.ADMIN_USER_ID;
                        if (adminId) {
                            const user = await getUser(withdrawal.user_id);
                            await sendTelegramNotification(adminId, '✅ Withdrawal Completed', `<b>✅ Completed!</b>\n\n<b>👤 User:</b> ${withdrawal.user_id} (@${user?.username || 'N/A'})\n<b>💰 Amount:</b> ${withdrawal.gram_amount.toFixed(5)} GRAM\n<b>📭 Wallet:</b> ${withdrawal.wallet}\n<b>🔗 TX:</b> <a href="${explorerUrl}">View</a>`);
                        }
                        await sendWithdrawalProof(withdrawal.user_id, withdrawal.wallet, withdrawal.gram_amount, withdrawal.amount);
                    } else if (oxaPayStatus === 'failed' || oxaPayStatus === 'rejected') {
                        const user = await getUser(withdrawal.user_id);
                        if (user) await updateUser(withdrawal.user_id, { coin_balance: (user.coin_balance || 0) + withdrawal.amount, last_withdraw_time: 0 });
                        await supabase.from('withdrawals').update({ status: 'failed' }).eq('id', withdrawal.id);
                        await sendTelegramNotification(withdrawal.user_id, '❌ Withdrawal Failed', `<b>❌ Failed</b>\n\n${withdrawal.amount} COIN refunded.`);
                    }
                }
            } catch (error) { logFailure('checkPendingWithdrawals', withdrawal.user_id, null, error); }
        }
    } catch (error) { logFailure('checkPendingWithdrawals', null, null, error); }
}

setInterval(async () => { await checkPendingWithdrawals(); }, 60000);
setTimeout(() => { checkPendingWithdrawals(); }, 10000);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: getCurrentTime() }));
app.get('/api/config', (req, res) => res.json(APP_CONFIG));
app.get('/api/current-time', (req, res) => res.json({ serverTime: getCurrentTime() }));

app.post('/api/check-bot-admin', authenticate, async (req, res) => {
    try {
        const { channel } = req.body;
        if (!channel) return res.status(400).json({ error: 'Channel required' });
        res.json({ isAdmin: await checkBotIsAdminInChannel(channel) });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/check-membership', authenticate, async (req, res) => {
    try {
        const userId = req._userId;
        const { channel } = req.body;
        if (!channel) return res.status(400).json({ error: 'Channel required' });
        if (!BOT_TOKEN) return res.json({ isMember: true, error: 'bot_not_configured' });
        const isAdmin = await checkBotIsAdminInChannel(channel);
        if (!isAdmin) return res.json({ isMember: true, error: 'bot_not_admin' });
        res.json({ isMember: await checkUserInChannel(userId, channel) });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/auth', strictLimiter, async (req, res) => {
    try {
        const { initData, userId, username, firstName, photoUrl } = req.body;
        if (!initData) return res.status(400).json({ error: 'Missing initData' });
        const validation = validateTelegramInitData(initData, BOT_TOKEN);
        if (!validation.valid) return res.status(403).json({ error: 'Invalid data' });
        const telegramUser = validation.user;
        if (!telegramUser || !telegramUser.id) return res.status(403).json({ error: 'No user' });

        let user = await getUser(telegramUser.id);
        if (!user) {
            const userData = {
                id: telegramUser.id, username: telegramUser.username || '', first_name: telegramUser.first_name || 'User',
                photo_url: photoUrl || telegramUser.photo_url || APP_CONFIG.DEFAULT_USER_AVATAR,
                created_at: getCurrentTime(),
                power_balance: 0, coin_balance: 0, gram_balance: 0,
                referral_power_earnings: 0, referral_coin_earnings: 0,
                level: 1, total_tasks_completed: 0, total_mining_starts: 0,
                daily_mining_starts: 0, last_mining_date: '', last_mining_end_time: 0,
                referral_reward_given: false, state: 'active', verified: true,
                miner_id: null, miner_expires_at: null, owned_miners: [],
                quests: { current_miner_quest_index: 0, current_task_quest_index: 0, current_referral_quest_index: 0 },
                mining_active: false, mining_start_time: null, mining_end_time: null, pending_coin_reward: 0,
                total_referrals: 0, referral_power: 0,
                ad_watch_count: 0, ad_last_watch: 0, adexium_ad_last_watch: 0,
                ad1_daily_count: 0, ad2_daily_count: 0, ad_daily_date: '',
                last_withdraw_time: 0, referred_by_verified: false, wallet: null,
                task_count: 0, promo_codes_created: 0, daily_bonus_last_claim: 0
            };
            try { user = await createUser(userData); } catch (e) { user = await getUser(telegramUser.id); if (!user) return res.status(500).json({ error: 'Failed' }); }
        } else {
            const updates = {};
            if (telegramUser.username && telegramUser.username !== user.username) updates.username = telegramUser.username;
            if (telegramUser.first_name && telegramUser.first_name !== user.first_name) updates.first_name = telegramUser.first_name;
            if (photoUrl && photoUrl !== user.photo_url) updates.photo_url = photoUrl;
            if (Object.keys(updates).length > 0) user = await updateUser(telegramUser.id, updates);
        }
        if (user.state === 'ban') return res.status(403).json({ error: 'Account banned' });
        const token = generateJWT(user.id, user.id);
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ success: true, user, token, authenticated: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/refresh', authenticate, async (req, res) => {
    try {
        const user = await getUser(req._userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.state === 'ban') return res.status(403).json({ error: 'Banned' });
        const token = generateJWT(req._userId, req._userId);
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });
        res.json({ success: true, token });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/get-user', authenticate, async (req, res) => {
    try {
        const userId = req._userId;
        let user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.state === 'ban') return res.status(403).json({ error: 'Account banned', banned: true });

        const activeMiner = getUserActiveMiner(user);
        if (activeMiner && activeMiner.id !== user.miner_id && user.miner_id) {
            user = await updateUser(userId, { miner_id: activeMiner.id, miner_expires_at: null });
        }

        const [completedTasks, withdrawals] = await Promise.all([getCompletedTasks(userId), getWithdrawals(userId)]);
        await updateUserLevel(userId);
        user = await getUser(userId);
        res.json({ user, completedTasks, withdrawals, serverTime: getCurrentTime() });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/get-live-withdrawals', authenticate, async (req, res) => {
    try {
        const withdrawals = await getLiveWithdrawals();
        res.json({ withdrawals });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/start-mining', authenticate, strictLimiter, async (req, res) => {
    try {
        const userId = req._userId;
        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!user.miner_id) return res.status(400).json({ error: 'Buy a miner first' });
        if (user.mining_active) return res.status(400).json({ error: 'Already active' });

        const now = getCurrentTime();
        const today = getTodayString();
        const dailyStarts = (user.last_mining_date === today) ? (user.daily_mining_starts || 0) : 0;
        if (dailyStarts >= APP_CONFIG.DAILY_MINING_LIMIT) return res.status(400).json({ error: 'Daily limit reached' });
        if (user.last_mining_end_time && (now - user.last_mining_end_time) < (APP_CONFIG.MINING_COOLDOWN_SECONDS * 1000)) {
            return res.status(400).json({ error: `Wait ${Math.ceil((APP_CONFIG.MINING_COOLDOWN_SECONDS * 1000 - (now - user.last_mining_end_time)) / 1000)}s` });
        }

        const miningEndTime = now + (APP_CONFIG.MINING_SESSION_HOURS * 3600000);
        notifiedUsers.delete(userId);

        const updatedUser = await updateUser(userId, {
            mining_active: true, mining_start_time: now, mining_end_time: miningEndTime,
            pending_coin_reward: 0, total_mining_starts: (user.total_mining_starts || 0) + 1,
            daily_mining_starts: dailyStarts + 1, last_mining_date: today
        });

        if (!user.referred_by_verified && user.referred_by) {
            const referrer = await getUser(user.referred_by);
            if (referrer) {
                const bonusPower = APP_CONFIG.REFERRAL_BONUS_POWER || 100;
                await updateUser(user.referred_by, { total_referrals: (referrer.total_referrals || 0) + 1, power_balance: (referrer.power_balance || 0) + bonusPower, referral_power_earnings: (referrer.referral_power_earnings || 0) + bonusPower });
                await updateUser(userId, { referred_by_verified: true });
                await sendTelegramNotification(user.referred_by, '🎉 New Referral!', `You received +${bonusPower} Power!`);
            }
        }

        await updateUserLevel(userId);
        res.json({ success: true, user: updatedUser, serverTime: getCurrentTime() });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/stop-mining', authenticate, strictLimiter, async (req, res) => {
    try {
        const userId = req._userId;
        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!user.mining_active) return res.status(400).json({ error: 'No active session' });

        const currentTime = getCurrentTime();
        const rewardAmount = calculateMiningReward(user, user.mining_start_time, user.mining_end_time || currentTime);
        const updatedUser = await updateUser(userId, { mining_active: false, mining_start_time: null, mining_end_time: null, pending_coin_reward: rewardAmount, last_mining_end_time: currentTime });
        res.json({ success: true, user: updatedUser, reward: rewardAmount, serverTime: currentTime });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/claim-mining', authenticate, strictLimiter, async (req, res) => {
    try {
        const userId = req._userId;
        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.mining_active) return res.status(400).json({ error: 'Mining active' });

        const currentTime = getCurrentTime();
        if (user.mining_end_time && currentTime < user.mining_end_time) {
            const remaining = Math.ceil((user.mining_end_time - currentTime) / 1000);
            return res.status(400).json({ error: `Session not ended. Wait ${remaining}s` });
        }

        const rewardAmount = user.pending_coin_reward || 0;
        if (rewardAmount <= 0) return res.status(400).json({ error: 'No rewards' });

        const updatedUser = await updateUser(userId, { coin_balance: (user.coin_balance || 0) + rewardAmount, pending_coin_reward: 0, mining_start_time: null, mining_end_time: null, mining_active: false });
        notifiedUsers.delete(userId);
        await checkLargeTransaction(userId, rewardAmount, 'Mining COIN');

        if (user.referred_by) {
            const referralEarning = rewardAmount * (APP_CONFIG.REFERRAL_MINING_PERCENTAGE / 100);
            await addReferralCommission(user.referred_by, referralEarning, 'coin');
        }
        await updateUserLevel(userId);
        res.json({ success: true, user: updatedUser, claimed: rewardAmount, serverTime: currentTime });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/buy-miner', authenticate, strictLimiter, async (req, res) => {
    try {
        const userId = req._userId;
        const { minerId } = req.body;
        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const miner = APP_CONFIG.MINERS.find(m => m.id === minerId);
        if (!miner) return res.status(400).json({ error: 'Invalid miner' });

        if (miner.price_power === 0) {
            const ownedMiners = user.owned_miners || [];
            if (!ownedMiners.includes(miner.id)) await updateUser(userId, { owned_miners: [...ownedMiners, miner.id] });
            const updatedUser = await updateUser(userId, { miner_id: miner.id, miner_expires_at: null });

            if (!user.referred_by_verified && user.referred_by) {
                const referrer = await getUser(user.referred_by);
                if (referrer) {
                    const bonusPower = APP_CONFIG.REFERRAL_BONUS_POWER || 100;
                    await updateUser(user.referred_by, { total_referrals: (referrer.total_referrals || 0) + 1, power_balance: (referrer.power_balance || 0) + bonusPower, referral_power_earnings: (referrer.referral_power_earnings || 0) + bonusPower });
                    await updateUser(userId, { referred_by_verified: true });
                    await sendTelegramNotification(user.referred_by, '🎉 New Referral!', `+${bonusPower} Power!`);
                }
            }
            return res.json({ success: true, user: updatedUser, miner });
        }

        const ownedMiners = user.owned_miners || [];
        if (ownedMiners.includes(minerId)) {
            const expiresAt = miner.duration_days > 0 ? Date.now() + (miner.duration_days * 24 * 3600000) : null;
            const updatedUser = await updateUser(userId, { miner_id: miner.id, miner_expires_at: expiresAt });
            return res.json({ success: true, user: updatedUser, miner });
        }

        if ((user.power_balance || 0) < miner.price_power) return res.status(400).json({ error: 'Insufficient Power' });

        const expiresAt = miner.duration_days > 0 ? Date.now() + (miner.duration_days * 24 * 3600000) : null;
        const updatedUser = await updateUser(userId, { power_balance: (user.power_balance || 0) - miner.price_power, miner_id: miner.id, miner_expires_at: expiresAt, owned_miners: [...ownedMiners, minerId] });
        await updateUserLevel(userId);
        res.json({ success: true, user: updatedUser, miner });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/activate-miner', authenticate, strictLimiter, async (req, res) => {
    try {
        const userId = req._userId;
        const { minerId } = req.body;
        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const ownedMiners = user.owned_miners || [];
        if (!ownedMiners.includes(minerId)) return res.status(400).json({ error: 'Not owned' });
        const miner = APP_CONFIG.MINERS.find(m => m.id === minerId);
        if (!miner) return res.status(400).json({ error: 'Invalid' });
        const expiresAt = miner.duration_days > 0 ? Date.now() + (miner.duration_days * 24 * 3600000) : null;
        const updatedUser = await updateUser(userId, { miner_id: miner.id, miner_expires_at: expiresAt });
        res.json({ success: true, user: updatedUser, miner });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/claim-quest', authenticate, strictLimiter, async (req, res) => {
    try {
        const userId = req._userId;
        const { questType } = req.body;
        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        let reward = 0, newIndex = 0;
        let quests = { ...user.quests };

        if (questType === 'miner') {
            const index = user.quests?.current_miner_quest_index || 0;
            const quest = APP_CONFIG.QUESTS.miner_quests[index];
            if (!quest) return res.status(400).json({ error: 'No quest' });
            if (!(user.owned_miners || []).includes(quest.miner_id)) return res.status(400).json({ error: 'Not met' });
            reward = quest.reward; newIndex = index + 1; quests.current_miner_quest_index = newIndex;
        } else if (questType === 'task') {
            const index = user.quests?.current_task_quest_index || 0;
            const quest = APP_CONFIG.QUESTS.task_quests[index];
            if (!quest) return res.status(400).json({ error: 'No quest' });
            if (user.total_tasks_completed < quest.target_tasks) return res.status(400).json({ error: 'Not met' });
            reward = quest.reward; newIndex = index + 1; quests.current_task_quest_index = newIndex;
        } else if (questType === 'referral') {
            const index = user.quests?.current_referral_quest_index || 0;
            const quest = APP_CONFIG.QUESTS.referral_quests[index];
            if (!quest) return res.status(400).json({ error: 'No quest' });
            if (user.total_referrals < quest.target_referrals) return res.status(400).json({ error: 'Not met' });
            reward = quest.reward; newIndex = index + 1; quests.current_referral_quest_index = newIndex;
        } else return res.status(400).json({ error: 'Invalid type' });

        const updatedUser = await updateUser(userId, { power_balance: (user.power_balance || 0) + reward, quests });
        await updateUserLevel(userId);
        await checkLargeTransaction(userId, reward, 'Quest Power');
        res.json({ success: true, user: updatedUser, reward, questType, questIndex: newIndex });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/complete-task', authenticate, strictLimiter, async (req, res) => {
    try {
        const userId = req._userId;
        const { taskId } = req.body;
        const cooldownCheck = checkTaskCompletionCooldown(userId);
        if (!cooldownCheck.allowed) return res.status(429).json({ error: `Wait ${cooldownCheck.remaining}s` });

        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const { data: task, error: taskError } = await supabase.from('tasks').select('*').eq('id', taskId).single();
        if (taskError || !task) return res.status(404).json({ error: 'Task not found' });

        if (task.verification && task.url) {
            const chatId = task.url.match(/t\.me\/([^\/\?]+)/)?.[1];
            if (chatId) {
                const isMember = await checkUserInChannel(userId, chatId);
                if (!isMember) return res.status(400).json({ error: 'Join channel first' });
            }
        }
        if ((task.total_completed || 0) >= task.total) return res.status(400).json({ error: 'Full' });
        const { data: completed } = await supabase.from('user_completed_tasks').select('task_id').eq('user_id', userId).eq('task_id', taskId).single();
        if (completed) return res.status(400).json({ error: 'Already done' });

        setTaskCompletionCooldown(userId);
        await supabase.from('tasks').update({ total_completed: (task.total_completed || 0) + 1 }).eq('id', taskId);
        await supabase.from('user_completed_tasks').insert([{ user_id: userId, task_id: taskId, completed_at: getCurrentTime() }]);

        const isCommunity = task.category === 'community';
        const coinReward = isCommunity ? (APP_CONFIG.COMMUNITY_COIN_REWARD || 50) : 0;
        const powerReward = task.reward || APP_CONFIG.COMMUNITY_POWER_REWARD || 50;

        const updatedUser = await updateUser(userId, {
            power_balance: (user.power_balance || 0) + powerReward,
            coin_balance: (user.coin_balance || 0) + coinReward,
            total_tasks_completed: (user.total_tasks_completed || 0) + 1,
            last_task_completion_time: getCurrentTime()
        });

        await checkLargeTransaction(userId, powerReward, 'Task Power');
        if (coinReward > 0) await checkLargeTransaction(userId, coinReward, 'Task COIN');

        if (user.referred_by) {
            const rp = powerReward * (APP_CONFIG.REFERRAL_TASKS_PERCENTAGE / 100);
            const rc = coinReward * (APP_CONFIG.REFERRAL_TASKS_PERCENTAGE / 100);
            await addReferralCommission(user.referred_by, rp, 'power');
            if (rc > 0) await addReferralCommission(user.referred_by, rc, 'coin');
        }

        await updateUserLevel(userId);
        res.json({ success: true, user: updatedUser, reward: powerReward });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/watch-ad-1', authenticate, strictLimiter, async (req, res) => {
    try {
        const userId = req._userId;
        const { requestTime } = req.body;
        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const now = getCurrentTime();
        if (!requestTime || (now - requestTime) < 10000) return res.status(400).json({ error: 'Ad not completed' });

        const cooldownCheck = checkAdCooldown(userId, 'ad1');
        if (!cooldownCheck.allowed) return res.status(400).json({ error: `Cooldown: ${cooldownCheck.remaining}s` });

        const today = getTodayString();
        let dailyCount = user.ad1_daily_count || 0;
        if (user.ad_daily_date !== today) { dailyCount = 0; }

        if (dailyCount >= APP_CONFIG.AD_DAILY_LIMIT) return res.status(400).json({ error: 'Daily limit reached' });

        const powerReward = APP_CONFIG.AD_REWARD_POWER || 50;
        const coinReward = APP_CONFIG.AD_REWARD_COIN || 20;

        const updatedUser = await updateUser(userId, {
            power_balance: (user.power_balance || 0) + powerReward,
            coin_balance: (user.coin_balance || 0) + coinReward,
            ad_watch_count: (user.ad_watch_count || 0) + 1,
            ad_last_watch: now,
            ad1_daily_count: dailyCount + 1,
            ad_daily_date: today
        });

        setAdCooldown(userId, 'ad1');
        await checkLargeTransaction(userId, powerReward, 'Ad Power');
        await checkLargeTransaction(userId, coinReward, 'Ad COIN');

        if (user.referred_by) {
            const rp = powerReward * (APP_CONFIG.REFERRAL_TASKS_PERCENTAGE / 100);
            const rc = coinReward * (APP_CONFIG.REFERRAL_TASKS_PERCENTAGE / 100);
            await addReferralCommission(user.referred_by, rp, 'power');
            await addReferralCommission(user.referred_by, rc, 'coin');
        }

        await updateUserLevel(userId);
        res.json({ success: true, user: updatedUser, powerReward, coinReward, dailyCount: dailyCount + 1 });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/watch-ad-2', authenticate, strictLimiter, async (req, res) => {
    try {
        const userId = req._userId;
        const { requestTime } = req.body;
        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const now = getCurrentTime();
        if (!requestTime || (now - requestTime) < 10000) return res.status(400).json({ error: 'Ad not completed' });

        const cooldownCheck = checkAdCooldown(userId, 'ad2');
        if (!cooldownCheck.allowed) return res.status(400).json({ error: `Cooldown: ${cooldownCheck.remaining}s` });

        const today = getTodayString();
        let dailyCount = user.ad2_daily_count || 0;
        if (user.ad_daily_date !== today) { dailyCount = 0; }

        if (dailyCount >= APP_CONFIG.AD_DAILY_LIMIT) return res.status(400).json({ error: 'Daily limit reached' });

        const powerReward = APP_CONFIG.AD_REWARD_POWER || 50;
        const coinReward = APP_CONFIG.AD_REWARD_COIN || 20;

        const updatedUser = await updateUser(userId, {
            power_balance: (user.power_balance || 0) + powerReward,
            coin_balance: (user.coin_balance || 0) + coinReward,
            adexium_ad_last_watch: now,
            ad2_daily_count: dailyCount + 1,
            ad_daily_date: today
        });

        setAdCooldown(userId, 'ad2');
        await checkLargeTransaction(userId, powerReward, 'Ad Power');
        await checkLargeTransaction(userId, coinReward, 'Ad COIN');

        if (user.referred_by) {
            const rp = powerReward * (APP_CONFIG.REFERRAL_TASKS_PERCENTAGE / 100);
            const rc = coinReward * (APP_CONFIG.REFERRAL_TASKS_PERCENTAGE / 100);
            await addReferralCommission(user.referred_by, rp, 'power');
            await addReferralCommission(user.referred_by, rc, 'coin');
        }

        await updateUserLevel(userId);
        res.json({ success: true, user: updatedUser, powerReward, coinReward, dailyCount: dailyCount + 1 });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/claim-daily-bonus', authenticate, strictLimiter, async (req, res) => {
    try {
        const userId = req._userId;
        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        const now = getCurrentTime();
        const today = getTodayString();
        const lastClaim = user.daily_bonus_last_claim || 0;
        const lastClaimDate = lastClaim ? new Date(lastClaim).toISOString().split('T')[0] : '';
        if (lastClaimDate === today) return res.status(400).json({ error: 'Already claimed today' });

        const coinReward = APP_CONFIG.DAILY_BONUS_COIN || 100;
        const updatedUser = await updateUser(userId, { coin_balance: (user.coin_balance || 0) + coinReward, daily_bonus_last_claim: now });
        await checkLargeTransaction(userId, coinReward, 'Daily Bonus COIN');
        res.json({ success: true, user: updatedUser, coinReward });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/tasks/:category', authenticate, async (req, res) => {
    try { res.json({ tasks: await getTasks(req.params.category, req._userId) }); }
    catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/promo-codes', authenticate, async (req, res) => {
    try { res.json({ codes: await getActivePromoCodes(req._userId) }); }
    catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/claim-promo-code', authenticate, strictLimiter, async (req, res) => {
    try {
        const userId = req._userId;
        const { code } = req.body;
        const promoCheck = checkPromoCooldown(userId);
        if (!promoCheck.allowed) return res.status(429).json({ error: `Wait ${promoCheck.remaining}s` });

        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const promo = await getPromoCode(code);
        if (!promo || promo.status !== 'active') return res.status(400).json({ error: 'Invalid code' });
        if ((promo.total_uses || 0) >= promo.max_uses) return res.status(400).json({ error: 'Expired' });
        if (promo.owner === userId) return res.status(400).json({ error: 'Cannot use own code' });

        const { data: usedData } = await supabase.from('used_promo_codes').select('*').eq('user_id', userId).eq('code', code).single();
        if (usedData) return res.status(400).json({ error: 'Already used' });

        if (promo.required_channel) {
            const isMember = await checkUserInChannel(userId, promo.required_channel);
            if (!isMember) return res.status(400).json({ error: 'Join channel', requiredChannel: promo.required_channel });
        }

        setPromoCooldown(userId);
        await usePromoCode(userId, code);
        await incrementPromoUses(code);

        let updates = {}, rewardMessage = '';
        if (promo.reward_type === 'power') {
            updates.power_balance = (user.power_balance || 0) + promo.reward_amount;
            rewardMessage = `+${promo.reward_amount} Power`;
            await checkLargeTransaction(userId, promo.reward_amount, 'Promo Power');
        } else if (promo.reward_type === 'coin') {
            updates.coin_balance = (user.coin_balance || 0) + promo.reward_amount;
            rewardMessage = `+${promo.reward_amount} COIN`;
            await checkLargeTransaction(userId, promo.reward_amount, 'Promo COIN');
        }

        const updatedUser = await updateUser(userId, { ...updates, last_promo_time: getCurrentTime() });

        if (user.referred_by) {
            const referralEarning = promo.reward_amount * (APP_CONFIG.REFERRAL_PROMO_PERCENTAGE / 100);
            await addReferralCommission(user.referred_by, referralEarning, promo.reward_type);
        }

        await updateUserLevel(userId);
        res.json({ success: true, user: updatedUser, reward: rewardMessage, rewardType: promo.reward_type, rewardAmount: promo.reward_amount });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/claim-referral-earnings', authenticate, strictLimiter, async (req, res) => {
    try {
        const userId = req._userId;
        const { type } = req.body;
        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        let amount = 0, updates = {};
        if (type === 'power') {
            amount = user.referral_power_earnings || 0;
            if (amount < APP_CONFIG.MIN_CLAIM_COIN) return res.status(400).json({ error: 'Minimum 1 Power' });
            updates = { power_balance: (user.power_balance || 0) + amount, referral_power_earnings: 0 };
        } else if (type === 'coin') {
            amount = user.referral_coin_earnings || 0;
            if (amount < APP_CONFIG.MIN_CLAIM_COIN) return res.status(400).json({ error: 'Minimum 1 COIN' });
            updates = { coin_balance: (user.coin_balance || 0) + amount, referral_coin_earnings: 0 };
        } else return res.status(400).json({ error: 'Invalid type' });

        if (amount <= 0) return res.status(400).json({ error: 'No earnings' });

        const updatedUser = await updateUser(userId, updates);
        await updateUserLevel(userId);
        await checkLargeTransaction(userId, amount, `Referral ${type}`);
        res.json({ success: true, user: updatedUser, claimed: amount, type });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/my-tasks', authenticate, async (req, res) => {
    try {
        const { data: tasks, error } = await supabase.from('tasks').select('*').eq('owner', req._userId).eq('category', 'community').order('created_at', { ascending: false });
        if (error) throw error;
        res.json({ tasks: tasks || [] });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/delete-task', authenticate, async (req, res) => {
    try {
        const userId = req._userId;
        const { taskId } = req.body;
        const { data: task } = await supabase.from('tasks').select('owner, total, total_completed').eq('id', taskId).single();
        if (!task) return res.status(404).json({ error: 'Not found' });
        if (task.owner !== userId) return res.status(403).json({ error: 'Not authorized' });
        if ((task.total_completed || 0) < task.total) return res.status(400).json({ error: 'Not completed' });
        await supabase.from('tasks').delete().eq('id', taskId);
        await supabase.from('user_completed_tasks').delete().eq('task_id', taskId);
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/check-payment', authenticate, async (req, res) => {
    try {
        const userId = req._userId;
        const { memo, amount, taskData } = req.body;
        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const address = APP_CONFIG.PAYMENT_WALLET;
        if (!address) return res.status(500).json({ error: 'Wallet not configured' });

        const { data: usedMemo } = await supabase.from('confirmed_memos').select('memo').eq('memo', memo).maybeSingle();
        if (usedMemo) return res.json({ success: false, error: 'Used' });

        const response = await fetch(`https://toncenter.com/api/v2/getTransactions?address=${address}&limit=3`);
        const data = await response.json();
        if (!data.ok) return res.status(500).json({ error: 'API error' });

        let foundTx = null;
        if (data.result && data.result.length > 0) foundTx = data.result.find(tx => tx.in_msg?.message?.includes(memo));
        if (!foundTx) return res.json({ success: false, error: 'Not found' });

        if (foundTx.in_msg?.message !== memo) return res.json({ success: false, error: 'Invalid memo' });

        const txAmount = parseFloat(foundTx.in_msg?.value) / 1000000000 || 0;
        const totalNum = parseInt(taskData.total);

        if (totalNum < 100 || totalNum > 5000) return res.json({ success: false, error: 'Invalid' });

        const requiredAmount = (taskData.total * 50 / 1000) * (APP_CONFIG.PRICE_PER_100 || 0.10);
        if (txAmount < requiredAmount * 0.98) return res.json({ success: false, error: 'Insufficient' });

        let verification = taskData.verification || false;
        if (verification && taskData.link) {
            const channelMatch = taskData.link.match(/t\.me\/([^\/\?]+)/);
            if (channelMatch) {
                const isAdmin = await checkBotIsAdminInChannel(channelMatch[1]);
                if (!isAdmin) return res.json({ success: false, error: 'Bot not admin' });
            }
        }

        const { data: existingTask } = await supabase.from('tasks').select('id').eq('id', memo).maybeSingle();
        if (existingTask) return res.json({ success: false, error: 'Exists' });

        const taskToAdd = {
            id: memo, name: taskData.name, url: taskData.link,
            category: 'community', reward: APP_CONFIG.COMMUNITY_POWER_REWARD || 50,
            total: taskData.total, verification: verification, owner: userId,
            status: 'active', created_at: getCurrentTime(), total_completed: 0, notified: false
        };

        const { data: taskResult, error: taskError } = await supabase.from('tasks').insert([taskToAdd]).select().single();
        if (taskError) return res.status(500).json({ error: 'Failed' });

        await updateUser(userId, { task_count: (user.task_count || 0) + 1 });
        await supabase.from('confirmed_memos').insert([{ memo, user_id: userId, used_at: getCurrentTime() }]);

        await sendChannelNotification(APP_CONFIG.TASKS_CHANNEL,
            `<b>⚡ NEW TASK!</b>\n\n<b>📋 ${taskData.name}</b>\n<b>👷 Target: ${taskData.total}</b>\n<b>🎁 Reward: ${APP_CONFIG.COMMUNITY_POWER_REWARD} POWER + ${APP_CONFIG.COMMUNITY_COIN_REWARD} COIN</b>`,
            { text: '✅ COMPLETE NOW', url: 'https://t.me/GramHunterBot?start=start' });

        res.json({ success: true, task: taskResult, message: 'Task added' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/withdraw-gram', authenticate, veryStrictLimiter, async (req, res) => {
    const userId = req._userId;
    if (withdrawLocks.has(userId)) return res.status(429).json({ error: 'In progress' });
    withdrawLocks.set(userId, Date.now());

    try {
        const { coinAmount, walletAddress } = req.body;
        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const now = Date.now();
        const cooldownMs = 6 * 3600000;
        if (user.last_withdraw_time && (now - user.last_withdraw_time) < cooldownMs) {
            const remaining = Math.ceil((cooldownMs - (now - user.last_withdraw_time)) / 3600000);
            return res.status(400).json({ error: `Wait ${remaining}h` });
        }

        if (!walletAddress || !walletAddress.startsWith('UQ') || walletAddress.length < 20) return res.status(400).json({ error: 'Invalid wallet' });

        const coin = parseFloat(coinAmount);
        if (isNaN(coin) || coin <= 0) return res.status(400).json({ error: 'Invalid amount' });

        if (coin < APP_CONFIG.MINIMUM_WITHDRAW) return res.status(400).json({ error: `Min ${APP_CONFIG.MINIMUM_WITHDRAW} COIN` });
        if (coin > APP_CONFIG.MAXIMUM_WITHDRAW) return res.status(400).json({ error: `Max ${APP_CONFIG.MAXIMUM_WITHDRAW} COIN` });

        if ((user.power_balance || 0) < 2001) return res.status(400).json({ error: 'Power low. Need 2001+' });
        const accountAge = (Date.now() - user.created_at) / 86400000;
        if (accountAge < 2) return res.status(400).json({ error: 'Account 2+ days required' });
        if ((user.total_mining_starts || 0) < 3) return res.status(400).json({ error: 'Need 3+ mining sessions' });
        if ((user.coin_balance || 0) < coin) return res.status(400).json({ error: 'Insufficient COIN' });

        const BLOCKED_WALLETS = ['UQCmCv32lwvOZPtYmxoGu3e-k0MLlbkIJ4gaCFYYYLbkAfGP'];
        if (BLOCKED_WALLETS.includes(walletAddress)) return res.status(403).json({ error: 'Failed' });

        if (coin > 1000 && (user.total_referrals || 0) <= 3) return res.status(400).json({ error: 'Need 4+ referrals for >1000 COIN' });

        const gramAmount = coin / (APP_CONFIG.COIN_TO_GRAM_RATE || 1000000);

        const { data: lockResult, error: lockError } = await supabase
            .from('users')
            .update({ coin_balance: (user.coin_balance || 0) - coin, last_withdraw_time: now })
            .eq('id', userId)
            .eq('coin_balance', user.coin_balance)
            .select()
            .single();

        if (lockError || !lockResult) return res.status(429).json({ error: 'Try again' });

        await checkLargeTransaction(userId, coin, 'Withdrawal COIN');

        const oxapay = new OxaPay({ apiKey: process.env.OXAPAY_API_KEY, sandbox: process.env.NODE_ENV !== 'production' });

        try {
            const payout = await oxapay.createPayout({ toAddress: walletAddress, amount: gramAmount, currency: 'GRAM', network: 'TON', description: `Withdraw ${gramAmount} GRAM for user ${userId}` });
            if (!payout || !payout.success) {
                await supabase.from('users').update({ coin_balance: user.coin_balance, last_withdraw_time: user.last_withdraw_time || 0 }).eq('id', userId);
                return res.status(500).json({ error: payout?.message || 'Failed' });
            }

            const withdrawal = await createWithdrawal({ user_id: userId, amount: coin, fees: 0, gram_amount: gramAmount, wallet: walletAddress, status: 'processing', timestamp: now, tx_id: payout.trackId, tx_hash: payout.txHash });

            const adminId = process.env.ADMIN_USER_ID;
            if (adminId) await sendTelegramNotification(adminId, '💸 New Withdrawal', `<b>💸 Withdrawal</b>\n\n<b>👤 User:</b> ${user.first_name} (${userId})\n<b>💰 Amount:</b> ${gramAmount.toFixed(5)} GRAM\n<b>📭 Wallet:</b> ${walletAddress}\n<b>🔗 Track:</b> ${payout.trackId}`);

            await sendWithdrawalProof(userId, walletAddress, gramAmount, coin);
            await sendTelegramNotification(userId, '⏳ Pending', `<b>⏳ Request Submitted</b>\n\n${coin} COIN (${gramAmount.toFixed(5)} GRAM) will be processed in 24-48h.`);

            res.json({ success: true, user: lockResult, withdrawal, gramAmount, trackId: payout.trackId, status: 'processing' });
        } catch (payoutError) {
            await supabase.from('users').update({ coin_balance: user.coin_balance, last_withdraw_time: user.last_withdraw_time || 0 }).eq('id', userId);
            return res.status(500).json({ error: 'Error: ' + payoutError.message });
        }
    } catch (error) { res.status(500).json({ error: 'Failed: ' + error.message }); }
    finally { setTimeout(() => withdrawLocks.delete(userId), 3000); }
});

app.post('/api/get-withdrawals', authenticate, async (req, res) => {
    try { res.json({ withdrawals: await getWithdrawals(req._userId) }); }
    catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const secretToken = req.headers['x-telegram-bot-api-secret-token'];
    if (!WEBHOOK_SECRET || secretToken !== WEBHOOK_SECRET) return res.sendStatus(403);
    try {
        const update = req.body;
        if (update.message && update.message.chat && update.message.chat.type === 'private') {
            const chatId = update.message.chat.id;
            const username = update.message.chat.username || '';
            const firstName = update.message.chat.first_name || 'User';
            const text = update.message.text;
            let referrerId = null;
            if (text && text.startsWith('/start')) {
                const parts = text.split(' ');
                if (parts.length > 1 && !isNaN(parts[1])) referrerId = parseInt(parts[1]);
            }
            const appLink = referrerId ? `https://t.me/GramHunterBot/app?startapp=${referrerId}` : `https://t.me/GramHunterBot/app`;
            const existingUser = await getUser(chatId);
            if (!existingUser) {
                const userData = {
                    id: chatId, username: username || '', first_name: firstName || 'User',
                    photo_url: update.message.chat.photo_url || APP_CONFIG.DEFAULT_USER_AVATAR,
                    created_at: getCurrentTime(),
                    power_balance: 0, coin_balance: 0, gram_balance: 0,
                    referral_power_earnings: 0, referral_coin_earnings: 0,
                    level: 1, total_tasks_completed: 0, total_mining_starts: 0,
                    daily_mining_starts: 0, last_mining_date: '', last_mining_end_time: 0,
                    referral_reward_given: false, state: 'active', verified: true,
                    miner_id: null, miner_expires_at: null, owned_miners: [],
                    quests: { current_miner_quest_index: 0, current_task_quest_index: 0, current_referral_quest_index: 0 },
                    mining_active: false, mining_start_time: null, mining_end_time: null, pending_coin_reward: 0,
                    total_referrals: 0, referral_power: 0,
                    ad_watch_count: 0, ad_last_watch: 0, adexium_ad_last_watch: 0,
                    ad1_daily_count: 0, ad2_daily_count: 0, ad_daily_date: '',
                    last_withdraw_time: 0, referred_by_verified: false, wallet: null,
                    task_count: 0, promo_codes_created: 0, daily_bonus_last_claim: 0
                };
                if (referrerId && referrerId !== chatId) userData.referred_by = referrerId;
                try { await createUser(userData); } catch (e) {}
            }
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId, photo: APP_CONFIG.APP_LOGO,
                    caption: `<b>🎯 Welcome to GRAM HUNTERS!</b>\n\n⛏️ Mine and earn <b>free GRAM!</b>\n\n📋 Complete tasks\n👷‍♂️ Invite friends\n🎟 Claim promo codes\n\n💰 Withdraw your funds <b>for free</b>\n⚡ Up to <b>50%</b> from referrals`,
                    parse_mode: 'HTML',
                    reply_markup: { inline_keyboard: [[{ text: '🎯 Start App', url: appLink }], [{ text: '📋 TASKS', url: 'https://t.me/GHT_TASKS' }, { text: '💸 PAYOUTS', url: 'https://t.me/Hunters_Proof' }], [{ text: '📰 Official', url: 'https://t.me/GramHunters' }]] }
                })
            });
        }
        res.sendStatus(200);
    } catch (error) { res.sendStatus(500); }
});

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, '0.0.0.0', () => console.log(`🎯 GRAM HUNTERS on port ${PORT}`));
server.on('error', (error) => console.error('Server error:', error));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
