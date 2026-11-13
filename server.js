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

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const BOT_TOKEN = process.env.BOT_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

const DEVICE_LOCK_WHITELIST = (process.env.DEVICE_LOCK_WHITELIST || '')
    .split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

const withdrawLocks = new Map();
const taskCompletionLocks = new Map();
const promoCodeLocks = new Map();

const tasksCache = {
    main: { data: null, loadedAt: 0 },
    partner: { data: null, loadedAt: 0 },
    community: { data: null, loadedAt: 0 }
};
const TASKS_CACHE_TTL = 15 * 60 * 1000;

const GRAM_ICON = "https://i.postimg.cc/Xqq4bZ1b/file-00000000d368821093a299693a488ea9.png";
const APP_LOGO = "https://i.postimg.cc/prSFdkdj/IMG-20261113-185332-424.jpg";
const MINING_BALANCE_ICON = "https://i.postimg.cc/MpSZcGvb/IMG-20261111-053642-213.jpg";

function logFailure(endpoint, userId, ip, error, extra = {}) {
    console.error(`❌ [${endpoint}] FAILED`, JSON.stringify({ userId: userId || 'unknown', ip: ip || 'unknown', error: error?.message || error, ...extra }));
}

const generalLimiter = rateLimit({ windowMs: 60 * 1000, max: 120, keyGenerator: (req) => req._userId?.toString() || req.ip, standardHeaders: true, legacyHeaders: false, message: { error: 'Too many requests.' } });
const strictLimiter = rateLimit({ windowMs: 60 * 1000, max: 60, keyGenerator: (req) => req._userId?.toString() || req.ip, standardHeaders: true, legacyHeaders: false, message: { error: 'Please wait.' } });
const veryStrictLimiter = rateLimit({ windowMs: 60 * 1000, max: 5, keyGenerator: (req) => req._userId?.toString() || req.ip, standardHeaders: true, legacyHeaders: false, message: { error: 'Please wait longer.' } });

app.use('/api/', generalLimiter);

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
        if (Math.floor(Date.now() / 1000) - authDate > 3600) return { valid: false, error: 'Expired' };
        const userJson = urlParams.get('user');
        let user = null;
        if (userJson) { try { user = JSON.parse(userJson); } catch (e) { return { valid: false, error: 'Invalid user' }; } }
        const startParam = urlParams.get('start_param');
        return { valid: true, user, authDate, queryId: urlParams.get('query_id'), startParam };
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
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getChatMember?chat_id=@${channelUsername}&user_id=${userId}`);
        const data = await res.json();
        if (!data.ok) {
            const desc = (data.description || '').toLowerCase();
            if (desc.includes('chat not found') || desc.includes('user not found') || desc.includes('bot is not a member') || desc.includes('not enough rights')) return true;
            return false;
        }
        return ['member', 'administrator', 'creator'].includes(data.result?.status);
    } catch (e) { return true; }
}

function getClientIp(req) {
    const xff = req.headers['x-forwarded-for'];
    if (xff) return String(xff).split(',')[0].trim();
    return req.ip || req.socket?.remoteAddress || 'unknown';
}

const APP_CONFIG = {
    MINING_SESSION_HOURS: 12,
    DAILY_MINING_LIMIT: 3,
    TASK_VERIFICATION_DELAY: 10,
    TASK_COMPLETION_COOLDOWN_SECONDS: 10,
    PROMO_CODE_COOLDOWN_SECONDS: 5,
    DEFAULT_USER_AVATAR: APP_LOGO,
    TON_WALLET_ADDRESS: "UQBLZ57z1Aok3DmrW3oEfJvUSW1ZNKZkT0j8rFtjIzPfSQMy",
    PAYMENT_WALLET: "UQBLZ57z1Aok3DmrW3oEfJvUSW1ZNKZkT0j8rFtjIzPfSQMy",
    BOT_USERNAME: "GramHtrsbot",
    BOT_LINK: "https://t.me/GramHtrsbot/app?startapp=",
    APP_LOGO: APP_LOGO,
    GRAM_ICON: GRAM_ICON,
    MINING_BALANCE_ICON: MINING_BALANCE_ICON,
    MINIMUM_WITHDRAW: 0.05,
    MAXIMUM_WITHDRAW: 100,
    MIN_CLAIM_GRAM: 0.001,
    PRICE_PER_100: 0.20,
    COMMUNITY_GRAM_REWARD: 0.002,
    LARGE_TRANSACTION_THRESHOLD: 0.5,
    REFERRAL_REWARD_GRAM: 0.05,
    REFERRAL_TASKS_PERCENTAGE: 10,
    REFERRAL_MINING_PERCENTAGE: 10,
    REFERRAL_MAX_COMMISSION_GRAM: 0.05,
    TASKS_CHANNEL: "@GHT_TASKS",
    PAYMENTS_CHANNEL: "https://t.me/Hunters_Proof",
    LIVE_PAYMENTS_CHANNEL: "https://t.me/Hunters_Proof",
    WELCOME_BONUS_GRAM: 0.20,
    MINING_RATE_PERCENTAGE: 5,
    TASK_REWARDS: {
        main:      { gram: 0.002 },
        partner:   { gram: 0.001 },
        community: { gram: 0.002 }
    },
    WITHDRAW_CONDITIONS: {
        min_referrals: 0,
        min_tasks: 0,
        min_mining_starts: 0
    },
    QUESTS: {
        task_quests: [
            { target_tasks: 10, reward: 0.01 },
            { target_tasks: 50, reward: 0.03 },
            { target_tasks: 100, reward: 0.05 },
            { target_tasks: 500, reward: 0.10 },
            { target_tasks: 1000, reward: 0.25 }
        ],
        referral_quests: [
            { target_referrals: 5, reward: 0.05 },
            { target_referrals: 10, reward: 0.10 },
            { target_referrals: 25, reward: 0.15 },
            { target_referrals: 50, reward: 0.20 },
            { target_referrals: 100, reward: 0.25 },
            { target_referrals: 250, reward: 0.30 },
            { target_referrals: 500, reward: 0.35 },
            { target_referrals: 1000, reward: 0.50 }
        ]
    }
};

async function getTasksFromCache(category) {
    const cache = tasksCache[category];
    const now = Date.now();
    if (cache.data && (now - cache.loadedAt) < TASKS_CACHE_TTL) return cache.data;
    try {
        const { data, error } = await supabase
            .from('tasks')
            .select('id, name, url, category, total, total_completed, verification, created_at, owner')
            .eq('category', category)
            .eq('status', 'active')
            .order('created_at', { ascending: category !== 'community' })
            .limit(500);
        if (error) throw error;
        const filtered = (data || []).filter(t => (t.total_completed || 0) < t.total);
        tasksCache[category] = { data: filtered, loadedAt: now };
        return filtered;
    } catch (e) {
        if (cache.data) return cache.data;
        return [];
    }
}

function invalidateTasksCache(category = null) {
    if (category) tasksCache[category] = { data: null, loadedAt: 0 };
    else Object.keys(tasksCache).forEach(k => tasksCache[k] = { data: null, loadedAt: 0 });
}

function getMiningRate(user) {
    const miningBalance = user.mining_balance || 0;
    return miningBalance * (APP_CONFIG.MINING_RATE_PERCENTAGE / 100) / 24;
}

function calculateMiningReward(user, startTime, endTime) {
    const sessionHours = Math.min((endTime - startTime) / 3600000, APP_CONFIG.MINING_SESSION_HOURS);
    const hourlyRate = getMiningRate(user);
    return hourlyRate * sessionHours;
}

async function addReferralCommission(referrerId, amount) {
    if (!referrerId || amount <= 0) return;
    const referrer = await getUser(referrerId);
    if (!referrer || referrer.state === 'ban') return;
    const actualAmount = Math.min(amount, APP_CONFIG.REFERRAL_MAX_COMMISSION_GRAM);
    await updateUser(referrerId, {
        referral_gram_earnings: (referrer.referral_gram_earnings || 0) + actualAmount
    });
}

async function checkLargeTransaction(userId, amount, source) {
    if (amount >= (APP_CONFIG.LARGE_TRANSACTION_THRESHOLD || 0.1)) {
        const user = await getUser(userId);
        const adminId = process.env.ADMIN_USER_ID;
        if (adminId) {
            await sendTelegramNotification(adminId, '💰 LARGE TRANSACTION!',
                `<b>⚠️ Large Transaction Alert</b>\n\n<b>👤 User:</b> ${user.first_name} (${userId})\n<b>💎 Amount:</b> ${amount.toFixed(8)} GRAM\n<b>📌 Source:</b> ${source}`);
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
        const { error } = await supabase.from('users').update(updates).eq('id', userId);
        if (error) throw error;
        return { id: userId, ...updates };
    } catch (error) { throw error; }
}

async function getTasks(category, userId) {
    try {
        const allTasks = await getTasksFromCache(category);
        const { data: completed } = await supabase.from('user_completed_tasks').select('task_id').eq('user_id', userId);
        const completedIds = new Set(completed?.map(t => t.task_id) || []);
        return allTasks.filter(task => !completedIds.has(task.id));
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
        const { data, error } = await supabase.from('withdrawals').select('id, amount, gram_amount, wallet, status, timestamp, tx_hash').eq('user_id', userId).order('timestamp', { ascending: false }).limit(20);
        if (error) throw error;
        return data || [];
    } catch (error) { return []; }
}

async function getLiveWithdrawals() {
    try {
        const { data, error } = await supabase.from('withdrawals').select('id, user_id, amount, gram_amount, wallet, status, timestamp, tx_hash').order('timestamp', { ascending: false }).limit(20);
        if (error) throw error;
        if (!data || data.length === 0) return [];
        const userIds = [...new Set(data.map(w => w.user_id))];
        const { data: users } = await supabase.from('users').select('id, first_name, photo_url').in('id', userIds);
        const userMap = new Map((users || []).map(u => [u.id, u]));
        return data.map(w => ({
            ...w,
            user_photo: userMap.get(w.user_id)?.photo_url || null,
            user_name: userMap.get(w.user_id)?.first_name || 'User'
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
        const { data: codes, error } = await supabase.from('promo_codes').select('code, reward_amount, reward_type, max_uses, total_uses, owner, required_channel').eq('status', 'active').gt('max_uses', 0).limit(50);
        if (error) throw error;
        const { data: used } = await supabase.from('used_promo_codes').select('code').eq('user_id', userId);
        const usedCodes = new Set(used?.map(u => u.code) || []);
        return (codes || []).filter(c => !usedCodes.has(c.code) && (c.total_uses || 0) < c.max_uses && c.owner !== userId).map(c => ({ ...c, is_used: false }));
    } catch (error) { return []; }
}

async function usePromoCode(userId, code) {
    try {
        const { data, error } = await supabase.from('used_promo_codes').insert([{ user_id: userId, code, used_at: Date.now() }]).select().single();
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
    if (!BOT_TOKEN || !userId) return { ok: false, reason: 'no_token_or_user' };
    try {
        const payload = { chat_id: userId, text: message, parse_mode: 'HTML', disable_web_page_preview: true };
        if (inlineButton) payload.reply_markup = { inline_keyboard: [[{ text: inlineButton.text, url: inlineButton.url }]] };
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.ok) return { ok: true };
        const desc = data.description || 'unknown';
        if (desc.includes('bot was blocked')) return { ok: false, reason: 'blocked' };
        if (desc.includes('chat not found')) return { ok: false, reason: 'deleted' };
        if (desc.includes('user is deactivated')) return { ok: false, reason: 'deactivated' };
        if (desc.includes('Too Many Requests')) return { ok: false, reason: 'rate_limit' };
        return { ok: false, reason: desc };
    } catch (e) {
        return { ok: false, reason: 'network' };
    }
}

async function sendChannelNotification(channelId, message, inlineButton = null) {
    if (!BOT_TOKEN || !channelId) return;
    try {
        const payload = { chat_id: channelId, text: message, parse_mode: 'HTML', disable_web_page_preview: true };
        if (inlineButton) payload.reply_markup = { inline_keyboard: [[{ text: inlineButton.text, url: inlineButton.url }]] };
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } catch (error) {}
}

async function sendWithdrawalProof(userId, wallet, gramAmount, txHash = null, withdrawalId = null) {
    try {
        const channelId = APP_CONFIG.PAYMENTS_CHANNEL;
        if (!channelId) return;
        const channelMatch = channelId.match(/t\.me\/([^\/\?]+)/);
        if (!channelMatch) return;
        const message = `<b>💸 New Payment Sent!</b>\n\n` +
            `<b>✦ Hunter ID:</b> <code>${userId}</code>\n` +
            `<b>✦ Amount:</b> <code>${gramAmount.toFixed(4)}</code> GRAM\n` +
            `<b>✦ Status:</b> ${txHash ? 'Completed' : 'Processing'}\n` +
            `<b>✦ Request Number</b> <code>#${withdrawalId}</code>`;
        const buttons = [];
        if (txHash) buttons.push({ text: '🔗 View', url: `https://tonscan.org/tx/${txHash}` });
        buttons.push({ text: '🥷 Launch', url: 'https://t.me/GramHtrsbot/app' });
        const payload = {
            chat_id: '@' + channelMatch[1],
            text: message,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            reply_markup: { inline_keyboard: [buttons] }
        };
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
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
        const { data: withdrawals, error } = await supabase.from('withdrawals').select('id, user_id, amount, gram_amount, wallet, status, tx_id, tx_hash').in('status', ['pending', 'processing']).limit(50);
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
                        await sendTelegramNotification(withdrawal.user_id, '✅ Withdrawal Completed!', `<b>✅ Your payment has been sent!</b>\n\n💸 You have received <code>${withdrawal.gram_amount.toFixed(4)}</code> <b>GRAM</b>\n\n<a href="${explorerUrl}">🌐 View on explorer</a>`);
                        const adminId = process.env.ADMIN_USER_ID;
                        if (adminId) {
                            const user = await getUser(withdrawal.user_id);
                            await sendTelegramNotification(adminId, '✅ Withdrawal Completed', `<b>✅ Completed!</b>\n\n<b>👤 User:</b> ${withdrawal.user_id} (@${user?.username || 'N/A'})\n<b>💰 Amount:</b> ${withdrawal.gram_amount.toFixed(4)} GRAM\n<b>📭 Wallet:</b> ${withdrawal.wallet}\n<b>🔗 TX:</b> <a href="${explorerUrl}">View</a>`);
                        }
                        await sendWithdrawalProof(withdrawal.user_id, withdrawal.wallet, withdrawal.gram_amount, txHash, withdrawal.id);
                    } else if (oxaPayStatus === 'failed' || oxaPayStatus === 'rejected') {
                        const user = await getUser(withdrawal.user_id);
                        if (user) await updateUser(withdrawal.user_id, { withdrawable_balance: (user.withdrawable_balance || 0) + withdrawal.amount, last_withdraw_time: 0 });
                        await supabase.from('withdrawals').update({ status: 'failed' }).eq('id', withdrawal.id);
                        await sendTelegramNotification(withdrawal.user_id, '❌ Withdrawal Failed', `<b>❌ Failed</b>\n\n${withdrawal.amount} GRAM refunded.`);
                    }
                }
            } catch (error) { logFailure('checkPendingWithdrawals', withdrawal.user_id, null, error); }
        }
    } catch (error) { logFailure('checkPendingWithdrawals', null, null, error); }
}

async function sendMiningEndNotifications() {
    try {
        const now = Date.now();
        const oneHourAgo = now - 3600000;
        const { data: users, error } = await supabase
            .from('users')
            .select('id, mining_end_time, last_mining_notif')
            .eq('mining_active', true)
            .eq('bot_blocked', false)
            .lte('mining_end_time', now)
            .limit(500);
        if (error || !users || users.length === 0) return;
        let success = 0, blocked = 0, deleted = 0, other = 0, skipped = 0;
        for (const u of users) {
            if (u.last_mining_notif && (now - u.last_mining_notif) < 28800000) {
                skipped++;
                continue;
            }
            const { data: claimed } = await supabase
                .from('users')
                .update({ last_mining_notif: now })
                .eq('id', u.id)
                .lte('last_mining_notif', oneHourAgo)
                .select('id');
            if (!claimed || claimed.length === 0) { skipped++; continue; }
            const result = await sendTelegramNotification(
                u.id,
                '<tg-emoji emoji-id="5197371802136892976">⛏️</tg-emoji> Mining Ended',
                `<tg-emoji emoji-id="5865994057167146921">⛏️</tg-emoji><b> Your Mining Session Ended!</b>\n\n<tg-emoji emoji-id="5310278924616356636">💰</tg-emoji> Your GRAM is ready to claim\n<tg-emoji emoji-id="5278467510604160626">🔥</tg-emoji> Don't lose them — claim now`,
                { text: '👀 Claim Now', url: 'https://t.me/GramHtrsbot/app' }
            );
            if (result.ok) success++;
            else if (result.reason === 'blocked') { blocked++; await updateUser(u.id, { bot_blocked: true }); }
            else if (result.reason === 'deleted' || result.reason === 'deactivated') deleted++;
            else other++;
            await new Promise(r => setTimeout(r, 40));
        }
        console.log(`⛏️ Mining end sent: ${success} ok, ${blocked} blocked, ${deleted} deleted, ${other} other, ${skipped} skipped`);
    } catch (e) {
        logFailure('miningEndNotif', null, null, e);
    }
}

app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const secretToken = req.headers['x-telegram-bot-api-secret-token'];
    if (!WEBHOOK_SECRET || secretToken !== WEBHOOK_SECRET) return res.sendStatus(403);
    try {
        const update = JSON.parse(req.body.toString('utf8'));
        if (update.my_chat_member) {
            return res.sendStatus(200);
        }
        if (update.inline_query) {
            return res.sendStatus(200);
        }
        if (update.message && update.message.chat && update.message.chat.type === 'private') {
            const chatId = update.message.chat.id;
            const text = update.message.text;
            let referrerId = null;
            if (text && text.startsWith('/start')) {
                const parts = text.split(' ');
                if (parts.length > 1 && !isNaN(parts[1])) referrerId = parseInt(parts[1]);
            }
            const appLink = referrerId ? `https://t.me/GramHtrsbot/app?startapp=${referrerId}` : `https://t.me/GramHtrsbot/app`;
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: chatId, photo: APP_CONFIG.APP_LOGO,
                    caption: `<tg-emoji emoji-id="5197371802136892976">⛏️</tg-emoji><b> Welcome to Hunter Miner</b>\n\n<tg-emoji emoji-id="5865994057167146921">💰</tg-emoji> <b>Join and get 0.20 GRAM Bonus</b>\n<tg-emoji emoji-id="5865994057167146921">👤</tg-emoji> <b>Invite friends, complete tasks</b>\n<tg-emoji emoji-id="5865994057167146921">💰</tg-emoji> <b>Mine and earn free GRAM</b>\n<tg-emoji emoji-id="5865994057167146921">💸</tg-emoji> <b>Withdraw anytime</b>\n\n<tg-emoji emoji-id="5445284980978621387">🚀</tg-emoji> <b>Start earning now 👇</b>`,
                    parse_mode: 'HTML',
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: '🚀 Start App', url: appLink }, { text: '🥷 Get News', url: 'https://t.me/GRAM_Huntrs' }],
                            [{ text: '🔔 TASKS', url: 'https://t.me/GHT_TASKS' }, { text: '🔔 PAYOUTS', url: 'https://t.me/Hunters_Proof' }]
                        ]
                    }
                })
            });
        }
        res.sendStatus(200);
    } catch (error) { res.sendStatus(500); }
});

app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(express.static(__dirname));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
});

app.post('/api/prepare-share', authenticate, async (req, res) => {
    try {
        const userId = req._userId;
        const botUsername = (process.env.BOT_USERNAME || 'GramHtrsbot').replace('@', '');
        const appShortName = process.env.APP_SHORT_NAME || 'app';
        const promoImage = "https://i.postimg.cc/c4MybBLc/IMG-20261111-053610-514.jpg";
        const miniAppUrl = `https://t.me/${botUsername}/${appShortName}?startapp=${userId}`;

        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/savePreparedInlineMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                allow_user_chats: true,
                allow_group_chats: true,
                allow_channel_chats: true,
                result: {
                    type: "photo",
                    id: `share_${userId}_${Date.now()}`,
                    photo_url: promoImage,
                    thumbnail_url: promoImage,
                    photo_width: 1200,
                    photo_height: 675,
                    title: "Hunter Miner",
                    description: "Mine. Collect. Level Up. Withdraw!",
                    caption: "🎁 <b>Join & get 0.20 GRAM!</b>\n\n⛏️ Mine, Collect and Withdraw\n\n💰 Complete tasks and earn GRAM\n\n🥷 Join me and start hunting!",
                    parse_mode: "HTML",
                    reply_markup: {
                        inline_keyboard: [[{ text: "🥷 Start Hunting", url: miniAppUrl }]]
                    }
                }
            })
        });

        const data = await response.json();
        if (!data.ok) throw new Error(data.description || 'Failed to prepare');
        res.json({ success: true, msg_id: data.result.id });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/health', (req, res) => res.status(200).send('OK'));
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: Date.now() }));
app.get('/api/config', (req, res) => res.json(APP_CONFIG));
app.get('/api/current-time', (req, res) => res.json({ serverTime: Date.now() }));

app.post('/api/auth', strictLimiter, async (req, res) => {
    try {
        const { initData, userId, username, firstName, photoUrl, visitorId } = req.body;
        if (!initData) return res.status(400).json({ error: 'Missing initData' });
        const validation = validateTelegramInitData(initData, BOT_TOKEN);
        if (!validation.valid) return res.status(403).json({ error: 'Invalid data' });
        const telegramUser = validation.user;
        if (!telegramUser || !telegramUser.id) return res.status(403).json({ error: 'No user' });

        if (validation.queryId) {
            const { data: usedQuery } = await supabase.from('used_query_ids').select('query_id').eq('query_id', validation.queryId).maybeSingle();
            if (usedQuery) return res.status(403).json({ error: 'Session already used' });
            try { await supabase.from('used_query_ids').insert([{ query_id: validation.queryId, used_at: Date.now() }]); } catch (e) {}
        }

        const isWhitelisted = DEVICE_LOCK_WHITELIST.includes(telegramUser.id);
        const clientIp = getClientIp(req);

        if (!isWhitelisted) {
            if (visitorId) {
                const { data: dev } = await supabase
                    .from('device_locks')
                    .select('user_id')
                    .eq('visitor_id', visitorId)
                    .maybeSingle();
                if (dev && Number(dev.user_id) !== Number(telegramUser.id)) {
                    logFailure('auth_device_lock', telegramUser.id, clientIp, new Error('device_already_linked'), { visitorId });
                    return res.status(403).json({ error: 'device_already_linked' });
                }
            }

            if (clientIp && clientIp !== 'unknown') {
                const { data: ipLock } = await supabase
                    .from('ip_locks')
                    .select('user_id')
                    .eq('ip', clientIp)
                    .maybeSingle();
                if (ipLock && Number(ipLock.user_id) !== Number(telegramUser.id)) {
                    logFailure('auth_ip_lock', telegramUser.id, clientIp, new Error('ip_already_linked'));
                    return res.status(403).json({ error: 'ip_already_linked' });
                }
            }
        }

        let user = await getUser(telegramUser.id);

        if (!user) {
            const userData = {
                id: telegramUser.id,
                username: telegramUser.username || '',
                first_name: telegramUser.first_name || 'User',
                photo_url: photoUrl || telegramUser.photo_url || APP_CONFIG.DEFAULT_USER_AVATAR,
                created_at: Date.now(),
                gram_balance: 0,
                withdrawable_balance: 0,
                mining_balance: 0,
                referral_gram_earnings: 0,
                level: 1,
                total_tasks_completed: 0,
                total_mining_starts: 0,
                daily_mining_starts: 0,
                last_mining_date: '',
                last_mining_end_time: 0,
                referral_reward_given: false,
                state: 'active',
                verified: true,
                quests: { current_miner_quest_index: 0, current_task_quest_index: 0, current_referral_quest_index: 0 },
                mining_active: false,
                mining_start_time: null,
                mining_end_time: null,
                pending_gram_reward: 0,
                total_referrals: 0,
                verified_referrals: 0,
                last_withdraw_time: 0,
                last_promo_time: 0,
                last_task_completion_time: 0,
                wallet: null,
                task_count: 0,
                welcome_bonus_claimed: false,
                visitor_ids: visitorId ? [visitorId] : [],
                bot_blocked: false
            };
            if (validation.startParam && !isNaN(validation.startParam) && parseInt(validation.startParam) !== telegramUser.id) {
                userData.referred_by = parseInt(validation.startParam);
            }
            try { user = await createUser(userData); } catch (e) { user = await getUser(telegramUser.id); if (!user) return res.status(500).json({ error: 'Failed' }); }
            
            if (userData.referred_by) {
                const referrer = await getUser(userData.referred_by);
                if (referrer && referrer.state === 'active') {
                    await updateUser(userData.referred_by, { total_referrals: (referrer.total_referrals || 0) + 1 });
                }
            }
        } else {
            const updates = {};
            if (telegramUser.username && telegramUser.username !== user.username) updates.username = telegramUser.username;
            if (telegramUser.first_name && telegramUser.first_name !== user.first_name) updates.first_name = telegramUser.first_name;
            if (photoUrl && photoUrl !== user.photo_url) updates.photo_url = photoUrl;
            if (Object.keys(updates).length > 0) {
                await updateUser(telegramUser.id, updates);
                Object.assign(user, updates);
            }
        }

        if (visitorId && user) {
            const existing = Array.isArray(user.visitor_ids) ? user.visitor_ids : [];
            if (!existing.includes(visitorId)) {
                const newVisitorIds = [...existing, visitorId];
                await updateUser(user.id, { visitor_ids: newVisitorIds });
                user.visitor_ids = newVisitorIds;
            }
        }

        if (!isWhitelisted) {
            const now = Date.now();
            if (visitorId) {
                try {
                    await supabase.from('device_locks').upsert({
                        visitor_id: visitorId,
                        user_id: telegramUser.id,
                        ip: clientIp,
                        first_seen: now,
                        last_seen: now
                    }, { onConflict: 'visitor_id' });
                } catch (e) {}
            }
            if (clientIp && clientIp !== 'unknown') {
                try {
                    await supabase.from('ip_locks').upsert({
                        ip: clientIp,
                        user_id: telegramUser.id,
                        first_seen: now,
                        last_seen: now
                    }, { onConflict: 'ip' });
                } catch (e) {}
            }
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

        const [completedTasks, withdrawals] = await Promise.all([
            getCompletedTasks(userId),
            getWithdrawals(userId)
        ]);
        res.json({ user, completedTasks, withdrawals, serverTime: Date.now() });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

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
        if (!BOT_TOKEN) return res.json({ isMember: true });
        const isAdmin = await checkBotIsAdminInChannel(channel);
        if (!isAdmin) return res.json({ isMember: true, error: 'bot_not_admin' });
        const isMember = await checkUserInChannel(userId, channel);
        return res.json({ isMember });
    } catch (error) {
        return res.json({ isMember: true });
    }
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
        if (user.mining_active) return res.status(400).json({ error: 'Already active' });

        const now = Date.now();
        const today = new Date().toISOString().split('T')[0];
        const dailyStarts = (user.last_mining_date === today) ? (user.daily_mining_starts || 0) : 0;
        if (dailyStarts >= APP_CONFIG.DAILY_MINING_LIMIT) return res.status(400).json({ error: 'Daily limit reached' });

        const miningEndTime = now + (APP_CONFIG.MINING_SESSION_HOURS * 3600000);

        const updatedUser = await updateUser(userId, {
            mining_active: true, mining_start_time: now, mining_end_time: miningEndTime,
            pending_gram_reward: 0, total_mining_starts: (user.total_mining_starts || 0) + 1,
            daily_mining_starts: dailyStarts + 1, last_mining_date: today
        });

        const qualifiesForReferral = (updatedUser.total_mining_starts || 0) >= 2;
        if (!user.referred_by_verified && user.referred_by && qualifiesForReferral) {
            const referrer = await getUser(user.referred_by);
            if (referrer) {
                const bonusGram = APP_CONFIG.REFERRAL_REWARD_GRAM || 0.05;
                await updateUser(user.referred_by, {
                    verified_referrals: (referrer.verified_referrals || 0) + 1,
                    referral_gram_earnings: (referrer.referral_gram_earnings || 0) + bonusGram
                });
                await updateUser(userId, { referred_by_verified: true });
                await sendTelegramNotification(
                    user.referred_by, '✅ New Referral Verified!',
                    `<tg-emoji emoji-id="5310278924616356636">⛏️</tg-emoji><b> New Referral Verified!</b>\n\n<tg-emoji emoji-id="5377620962390857342">💎</tg-emoji> <b>${bonusGram.toFixed(2)} GRAM added to your earnings</b>`,
                    { text: '🥷 Check it now', url: 'https://t.me/GramHtrsbot/app' }
                );
            }
        }

        res.json({ success: true, user: updatedUser, serverTime: Date.now() });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/stop-mining', authenticate, strictLimiter, async (req, res) => {
    try {
        const userId = req._userId;
        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (!user.mining_active) return res.status(400).json({ error: 'No active session' });

        const serverNow = Date.now();
        if (!user.mining_end_time || serverNow < user.mining_end_time) {
            return res.status(400).json({ error: `Session not ended!` });
        }

        const rewardAmount = calculateMiningReward(user, user.mining_start_time, user.mining_end_time);
        const updatedUser = await updateUser(userId, {
            mining_active: false, mining_start_time: null, mining_end_time: null,
            pending_gram_reward: rewardAmount, last_mining_end_time: serverNow
        });
        res.json({ success: true, user: updatedUser, reward: rewardAmount, serverTime: serverNow });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/claim-mining', authenticate, strictLimiter, async (req, res) => {
    try {
        const userId = req._userId;
        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.mining_active) return res.status(400).json({ error: 'Mining active' });

        const currentTime = Date.now();
        if (user.mining_end_time && currentTime < user.mining_end_time) {
            const remaining = Math.ceil((user.mining_end_time - currentTime) / 1000);
            return res.status(400).json({ error: `Session not ended. Wait ${remaining}s` });
        }

        const rewardAmount = user.pending_gram_reward || 0;
        if (rewardAmount <= 0) return res.status(400).json({ error: 'No rewards' });

        const updatedUser = await updateUser(userId, {
            withdrawable_balance: (user.withdrawable_balance || 0) + rewardAmount,
            pending_gram_reward: 0,
            mining_start_time: null,
            mining_end_time: null,
            mining_active: false
        });
        await checkLargeTransaction(userId, rewardAmount, 'Mining GRAM');

        if (user.referred_by) {
            const referralEarning = rewardAmount * (APP_CONFIG.REFERRAL_MINING_PERCENTAGE / 100);
            await addReferralCommission(user.referred_by, referralEarning);
        }
        
        res.json({ success: true, user: updatedUser, claimed: rewardAmount, serverTime: currentTime });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/claim-welcome-bonus', authenticate, strictLimiter, async (req, res) => {
    try {
        const userId = req._userId;
        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });
        if (user.welcome_bonus_claimed) return res.status(400).json({ error: 'Already claimed' });

        const bonus = APP_CONFIG.WELCOME_BONUS_GRAM || 0.20;
        const updatedUser = await updateUser(userId, {
            mining_balance: (user.mining_balance || 0) + bonus,
            welcome_bonus_claimed: true
        });
        res.json({ success: true, user: updatedUser, bonus });
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

        if (questType === 'task') {
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

        const updatedUser = await updateUser(userId, { mining_balance: (user.mining_balance || 0) + reward, quests });
        await checkLargeTransaction(userId, reward, 'Quest GRAM');
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
            const chatId = task.url.match(/t\.me\/([^\/\?\+]+)/)?.[1];
            const isPrivate = task.url.includes('t.me/+') || task.url.includes('/joinchat/');
            if (chatId && !isPrivate) {
                const isMember = await checkUserInChannel(userId, chatId);
                if (!isMember) return res.status(400).json({ error: 'Join channel first' });
            }
        }
        if ((task.total_completed || 0) >= task.total) return res.status(400).json({ error: 'Full' });
        const { data: completed } = await supabase.from('user_completed_tasks').select('task_id').eq('user_id', userId).eq('task_id', taskId).single();
        if (completed) return res.status(400).json({ error: 'Already done' });

        setTaskCompletionCooldown(userId);
        
        const newCompleted = (task.total_completed || 0) + 1;
        const taskUpdates = { total_completed: newCompleted };
        const taskJustCompleted = newCompleted >= task.total && task.status !== 'completed';
        if (taskJustCompleted) {
            taskUpdates.status = 'completed';
        }
        await supabase.from('tasks').update(taskUpdates).eq('id', taskId);
        if (taskJustCompleted && task.owner && task.owner !== 0) {
        await sendTelegramNotification(
                task.owner,
                '<tg-emoji emoji-id="5920365070369427908">✅</tg-emoji> Task Completed!',
                `<b><tg-emoji emoji-id="5310278924616356636">✅</tg-emoji> Your task has been fully completed!</b>\n\n` +
                `<b>- Task Name:</b> ${task.name}\n` +
                `<b>- Total Completions:</b> ${newCompleted}/${task.total}\n` +
                `<b>- Total Paid:</b> ${(newCompleted * (APP_CONFIG.TASK_REWARDS.community.gram || 0.002) * 100 / 100).toFixed(4)} GRAM\n\n`,
                { text: '🥷 Check on app', url: 'https://t.me/GramHtrsbot/app' }
            );
        }
        await supabase.from('user_completed_tasks').insert([{ user_id: userId, task_id: taskId, completed_at: Date.now() }]);
        invalidateTasksCache(task.category);

        const category = task.category || 'main';
        const rewardConf = APP_CONFIG.TASK_REWARDS[category] || { gram: 0 };
        const gramReward = rewardConf.gram || 0;

        const updatedUser = await updateUser(userId, {
            mining_balance: (user.mining_balance || 0) + gramReward,
            total_tasks_completed: (user.total_tasks_completed || 0) + 1,
            last_task_completion_time: Date.now()
        });

        const qualifiesForReferral = (updatedUser.total_tasks_completed || 0) >= 5;
        if (!user.referred_by_verified && user.referred_by && qualifiesForReferral) {
            const referrer = await getUser(user.referred_by);
            if (referrer) {
                const bonusGram = APP_CONFIG.REFERRAL_REWARD_GRAM || 0.05;
                await updateUser(user.referred_by, {
                    verified_referrals: (referrer.verified_referrals || 0) + 1,
                    referral_gram_earnings: (referrer.referral_gram_earnings || 0) + bonusGram
                });
                await updateUser(userId, { referred_by_verified: true });
                await sendTelegramNotification(
                    user.referred_by, '✅ New Referral Verified!',
                    `<tg-emoji emoji-id="5310278924616356636">⛏️</tg-emoji><b> New Referral Verified!</b>\n\n<tg-emoji emoji-id="5377620962390857342">💎</tg-emoji> <b>${bonusGram.toFixed(2)} GRAM added to your earnings</b>`,
                    { text: '🥷 Check it now', url: 'https://t.me/GramHtrsbot/app' }
                );
            }
        }

        if (gramReward > 0) await checkLargeTransaction(userId, gramReward, 'Task GRAM');

        if (user.referred_by) {
            const rc = gramReward * (APP_CONFIG.REFERRAL_TASKS_PERCENTAGE / 100);
            if (rc > 0) await addReferralCommission(user.referred_by, rc);
        }

        res.json({ success: true, user: updatedUser, reward: gramReward });
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
        if (promo.reward_type === 'gram') {
            updates.mining_balance = (user.mining_balance || 0) + promo.reward_amount;
            rewardMessage = `+${promo.reward_amount.toFixed(8)} GRAM`;
            await checkLargeTransaction(userId, promo.reward_amount, 'Promo GRAM');
        }

        const updatedUser = await updateUser(userId, { ...updates, last_promo_time: Date.now() });

        res.json({ success: true, user: updatedUser, reward: rewardMessage, rewardType: 'gram', rewardAmount: promo.reward_amount });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/claim-referral-earnings', authenticate, strictLimiter, async (req, res) => {
    try {
        const userId = req._userId;
        const user = await getUser(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const amount = user.referral_gram_earnings || 0;
        if (amount < APP_CONFIG.MIN_CLAIM_GRAM) return res.status(400).json({ error: `Minimum ${APP_CONFIG.MIN_CLAIM_GRAM} GRAM` });
        if (amount <= 0) return res.status(400).json({ error: 'No earnings' });

        const updatedUser = await updateUser(userId, {
            mining_balance: (user.mining_balance || 0) + amount,
            referral_gram_earnings: 0
        });
        await checkLargeTransaction(userId, amount, 'Referral GRAM');
        res.json({ success: true, user: updatedUser, claimed: amount });
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
        const { data: task } = await supabase.from('tasks').select('owner, total, total_completed, category').eq('id', taskId).single();
        if (!task) return res.status(404).json({ error: 'Not found' });
        if (task.owner !== userId) return res.status(403).json({ error: 'Not authorized' });
        if ((task.total_completed || 0) < task.total) return res.status(400).json({ error: 'Not completed' });
        await supabase.from('tasks').delete().eq('id', taskId);
        await supabase.from('user_completed_tasks').delete().eq('task_id', taskId);
        invalidateTasksCache(task.category);
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

        const totalNum = parseInt(taskData.total);
        if (totalNum < 100 || totalNum > 5000) return res.json({ success: false, error: 'Invalid total' });

        const requiredAmount = (taskData.total / 100) * (APP_CONFIG.PRICE_PER_100 || 0.10);

        const response = await fetch(`https://toncenter.com/api/v2/getTransactions?address=${address}&limit=30`);
        const data = await response.json();
        if (!data.ok) return res.status(500).json({ error: 'API error' });

        const now = Date.now() / 1000;
        const thirtyMinAgo = now - 3000;

        const foundTx = (data.result || []).find(tx => {
            const txTime = tx.utime;
            const txAmount = parseFloat(tx.in_msg?.value) / 1e9 || 0;
            const txMemo = tx.in_msg?.message || '';

            if (txTime < thirtyMinAgo) return false;
            if (Math.abs(txAmount - requiredAmount) > requiredAmount * 0.02) return false;
            if (txMemo && !txMemo.includes(String(userId)) && txMemo !== memo) return false;

            return true;
        });

        if (!foundTx) return res.json({ success: false, error: 'Payment not found (wait 1-2 min and retry)' });

        const txHash = foundTx.transaction_id?.hash || foundTx.in_msg?.hash || `tx_${foundTx.utime}_${userId}`;
        const { data: usedTx } = await supabase
            .from('confirmed_memos')
            .select('memo')
            .eq('memo', txHash)
            .maybeSingle();
        if (usedTx) return res.json({ success: false, error: 'This payment already used' });

        let verification = taskData.verification || false;
        if (verification && taskData.link) {
            const channelMatch = taskData.link.match(/t\.me\/([^\/\?]+)/);
            if (channelMatch) {
                const isAdmin = await checkBotIsAdminInChannel(channelMatch[1]);
                if (!isAdmin) return res.json({ success: false, error: 'Bot not admin' });
            }
        }

        const taskId = `task_${userId}_${Date.now()}`;
        const { data: existingTask } = await supabase.from('tasks').select('id').eq('id', taskId).maybeSingle();
        if (existingTask) return res.json({ success: false, error: 'Exists' });

        const taskToAdd = {
            id: taskId,
            name: taskData.name,
            url: taskData.link,
            category: 'community',
            reward: APP_CONFIG.TASK_REWARDS.community.gram || 0.002,
            total: taskData.total,
            verification: verification,
            owner: userId,
            status: 'active',
            created_at: Date.now(),
            total_completed: 0,
            notified: false
        };

        const { data: taskResult, error: taskError } = await supabase.from('tasks').insert([taskToAdd]).select().single();
        if (taskError) return res.status(500).json({ error: 'Failed to add task' });

        invalidateTasksCache('community');
        await updateUser(userId, { task_count: (user.task_count || 0) + 1 });

        await supabase.from('confirmed_memos').insert([{ memo: txHash, user_id: userId, used_at: Date.now() }]);

        const taskChannelMsg = `⚡ <b>NEW TASK AVAILABLE</b>\n\n` +
            `📋 <b>Name: ${taskData.name}</b>\n` +
            `ℹ️ <b>Category: Community</b>\n` +
            `🥷 <b>Target: ${taskData.total} completion</b>`;
        await sendChannelNotification(APP_CONFIG.TASKS_CHANNEL, taskChannelMsg, { text: '⚡ Complete Now', url: 'https://t.me/GramHtrsbot/app' });

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

        if (coin < APP_CONFIG.MINIMUM_WITHDRAW) return res.status(400).json({ error: `Min ${APP_CONFIG.MINIMUM_WITHDRAW} GRAM` });
        if (coin > APP_CONFIG.MAXIMUM_WITHDRAW) return res.status(400).json({ error: `Max ${APP_CONFIG.MAXIMUM_WITHDRAW} GRAM` });

        if ((user.withdrawable_balance || 0) < coin) return res.status(400).json({ error: 'Insufficient GRAM' });
        
        const conditions = APP_CONFIG.WITHDRAW_CONDITIONS;
        if (conditions.min_referrals > 0 && (user.verified_referrals || 0) < conditions.min_referrals) {
            return res.status(400).json({ error: `Need ${conditions.min_referrals} referrals` });
        }
        if (conditions.min_tasks > 0 && (user.total_tasks_completed || 0) < conditions.min_tasks) {
            return res.status(400).json({ error: `Need ${conditions.min_tasks} tasks` });
        }
        if (conditions.min_mining_starts > 0 && (user.total_mining_starts || 0) < conditions.min_mining_starts) {
            return res.status(400).json({ error: `Need ${conditions.min_mining_starts} mining sessions` });
        }

        const BLOCKED_WALLETS = ['UQCmCv32lwvOZPtYmxoGu3e-k0MLlbkIJ4gaCFYYYLbkAfGP'];
        if (BLOCKED_WALLETS.includes(walletAddress)) return res.status(403).json({ error: 'Failed' });

        const { data: lockResult, error: lockError } = await supabase
            .from('users')
            .update({ withdrawable_balance: (user.withdrawable_balance || 0) - coin, last_withdraw_time: now })
            .eq('id', userId)
            .eq('withdrawable_balance', user.withdrawable_balance)
            .select()
            .single();

        if (lockError || !lockResult) return res.status(429).json({ error: 'Try again' });

        await checkLargeTransaction(userId, coin, 'Withdrawal GRAM');

        const oxapay = new OxaPay({ apiKey: process.env.OXAPAY_API_KEY, sandbox: process.env.NODE_ENV !== 'production' });

        try {
            const payout = await oxapay.createPayout({ toAddress: walletAddress, amount: coin, currency: 'GRAM', network: 'TON', description: `Withdraw ${coin} GRAM for user ${userId}` });
            if (!payout || !payout.success) {
                await supabase.from('users').update({ withdrawable_balance: user.withdrawable_balance, last_withdraw_time: user.last_withdraw_time || 0 }).eq('id', userId);
                return res.status(500).json({ error: payout?.message || 'Failed' });
            }

            const withdrawal = await createWithdrawal({ user_id: userId, amount: coin, fees: 0, gram_amount: coin, wallet: walletAddress, status: 'processing', timestamp: now, tx_id: payout.trackId, tx_hash: payout.txHash });

            await sendTelegramNotification(userId, '⏳ Pending', `<b>⏳ Withdrawal Request Submitted!</b>`);

            res.json({ success: true, user: lockResult, withdrawal, gramAmount: coin, trackId: payout.trackId, status: 'processing' });
        } catch (payoutError) {
            await supabase.from('users').update({ withdrawable_balance: user.withdrawable_balance, last_withdraw_time: user.last_withdraw_time || 0 }).eq('id', userId);
            return res.status(500).json({ error: 'Error: ' + payoutError.message });
        }
    } catch (error) { res.status(500).json({ error: 'Failed: ' + error.message }); }
    finally { setTimeout(() => withdrawLocks.delete(userId), 3000); }
});

app.post('/api/get-withdrawals', authenticate, async (req, res) => {
    try { res.json({ withdrawals: await getWithdrawals(req._userId) }); }
    catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/dev-create-user', async (req, res) => {
    try {
        const { key, id, username } = req.query;

        if (key !== process.env.ADMIN_BYPASS_KEY) return res.status(403).json({ error: 'Forbidden' });
        if (!id || isNaN(id)) return res.status(400).json({ error: 'id required' });

        const userId = parseInt(id);
        const existing = await getUser(userId);
        if (existing) {
            const token = generateJWT(userId, userId);
            return res.json({ success: true, exists: true, user_id: userId, token });
        }

        const userData = {
            id: userId,
            username: username || 'user_' + userId,
            first_name: 'User ' + userId,
            photo_url: APP_CONFIG.DEFAULT_USER_AVATAR,
            created_at: Date.now(),
            gram_balance: 0,
            withdrawable_balance: 0,
            mining_balance: 0,
            referral_gram_earnings: 0,
            total_referrals: 0,
            verified_referrals: 0,
            referred_by: null,
            referred_by_verified: false
        };

        await createUser(userData);
        const token = generateJWT(userId, userId);
        res.json({ success: true, created: true, user_id: userId, token });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

setInterval(async () => { await checkPendingWithdrawals(); }, 300000);
setTimeout(() => { checkPendingWithdrawals(); }, 30000);
setInterval(sendMiningEndNotifications, 900000);

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, '0.0.0.0', () => console.log(`🎯 GRAM HUNTERS on port ${PORT}`));
server.on('error', (error) => console.error('Server error:', error));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
