const translations = {
    en: {
        gram: "GRAM", claim: "Claim",
        loading: "Loading", start: "Start", done: "Done", delete: "Delete",
        copy: "Copy", copy_success: "Copied!", link_copied: "Link copied",
        no_tasks: "No tasks", no_tasks_available: "No tasks available",
        all_tasks_completed: "All tasks completed!", no_withdrawals: "No payments created",
        no_my_tasks: "No tasks yet.", confirm_delete: "Are you sure?", deleted: "Deleted",
        busy: "Busy", complete_current_task: "Complete current task first",
        join_required: "Join Required", join_channel_first: "Please join channel first",
        earn: "Earn", home: "Home", team: "Team", wallet_page: "Withdraw",
        no_miner: "No Miner", gram_mined: "GRAM MINED", ready_to_claim: "READY TO CLAIM",
        not_active: "Not Active", start_mining: "START MINING",
        claim_reward: "CLAIM {amount} GRAM", mining_active: "MINING ACTIVE",
        claim_quest: "Claim",
        main_tasks: "Main", partner_tasks: "Partner", community_tasks: "Community",
        promo_code: "Promo Code", enter_code: "Enter code",
        welcome_bonus: "Welcome Bonus",
        invite_earn: "Build Your Team", invite_earn_sub: "Invite and earn generous rewards",
        referral_link_title: "Referral Link:", copy_link: "Copy Link",
        gram_earnings: "GRAM Earnings",
        total_referrals: "Total Referrals", verified_referrals: "Verified Referrals",
        earn_referral_each_label: "Referral Reward", earn_referral_each: "Earn {amount} GRAM per referral",
        earn_referral_tasks_label: "Tasks commission", earn_referral_tasks: "Earn 10% from referrals earnings",
        earn_referral_mining_label: "Mining Commission", earn_referral_mining: "Earn 10% from mining earnings",
        withdraw_gram: "Withdraw GRAM", withdrawal_amount: "Withdrawal Amount", gram_wallet: "GRAM Wallet",
        confirm_withdrawal: "Confirm Withdrawal", payments_history: "Payments History",
        my_payments: "My Payments", live_payments: "Live Payments",
        pending: "PENDING", completed: "PAID", processing: "PROCESSING", failed: "FAILED",
        min_withdraw_note: "Minimum Withdrawal: {amount} GRAM",
        invalid_amount: "Invalid amount", wallet_invalid: "Invalid wallet. Must start with UQ and be 20+ chars.",
        insufficient_balance: "Insufficient balance",
        live_channel_title: "Live Payments Channel",
        live_channel_desc: "Get live payouts notifications in real-time",
        join_channel: "Join Channel",
        no_live_payments: "No payments created",
        not_registered_title: "Not Registered", not_registered_message: "Start the bot first to register.",
        register_now: "Register Now",
        task_added: "Task Added!", task_added_success: "Community task added.",
        name_required: "Name 5-20 chars", link_required: "Valid https:// link required",
        invalid_total: "Total 100-5000", payment_verified: "Payment verified!",
        payment_failed: "Payment failed", payment_checking: "Checking...", payment_error: "Payment error",
        my_tasks: "My Tasks",
        join_channel_btn: "Join Channel", watch_ad_requirement: "Watch Ad",
        join_first: "Join channel first", language_changed: "Language Changed!",
        task_cooldown: "Wait {s}s", promo_code_cooldown: "Wait {s}s",
        quests_title: "Quests", reward_claimed: "Reward Claimed",
        daily_limit_reached: "Daily limit reached",
        view_on_explorer: "View", just_now: "Just now", time_ago: "{time} ago",
        quest_complete_tasks: "COMPLETE TASKS", quest_invite: "INVITE HUNTERS",
        hot: "HOT", available_tasks: "AVAILABLE TASKS", add_task: "Add Task",
        hourly: "Hourly", daily: "Daily", monthly: "Monthly",
        withdrawable_balance: "Withdrawable Balance",
        mining_balance: "Mining Balance",
        withdrawal_conditions: "Withdrawal Conditions",
        get_x_referrals: "Get {x} Referrals",
        complete_x_tasks: "Complete {x} Tasks",
        start_miner_x_times: "Start Miner {x} Times",
        not_verified: "Not Verified",
        mining_status_active: "ACTIVE",
        mining_status_inactive: "NOT ACTIVE",
        welcome_bonus_claimed: "Welcome bonus already claimed",
        welcome_bonus_success: "Welcome Bonus Claimed!",
        device_locked_title: "Device Locked",
        device_locked_message: "This device is already linked to another account. Only one account per device is allowed.",
        account_banned_title: "Account Banned",
        account_banned_message: "Your account has been banned. Contact support for more information.",
        close: "Close",
        share_friends: "Share with Friends"
    },
    ar: {
        gram: "جرام", claim: "استلام",
        loading: "جار التحميل", start: "ابدأ", done: "تم", delete: "حذف",
        copy: "نسخ", copy_success: "تم النسخ!", link_copied: "تم نسخ الرابط",
        no_tasks: "لا مهام", no_tasks_available: "لا مهام متاحة",
        all_tasks_completed: "تم إكمال الجميع!", no_withdrawals: "لا مدفوعات",
        no_my_tasks: "لا مهام.", confirm_delete: "متأكد؟", deleted: "تم الحذف",
        busy: "مشغول", complete_current_task: "أكمل المهمة الحالية",
        join_required: "الانضمام مطلوب", join_channel_first: "انضم للقناة أولاً",
        earn: "ربح", home: "الرئيسية", team: "الفريق", wallet_page: "السحب",
        no_miner: "لا منجم", gram_mined: "جرام معدني", ready_to_claim: "جاهز",
        not_active: "غير نشط", start_mining: "بدء التعدين",
        claim_reward: "استلام {amount} جرام", mining_active: "التعدين نشط",
        claim_quest: "استلام",
        main_tasks: "الرئيسية", partner_tasks: "الشركاء", community_tasks: "المجتمعية",
        promo_code: "رمز ترويجي", enter_code: "أدخل الرمز",
        welcome_bonus: "مكافأة الترحيب",
        invite_earn: "ابني فريقك", invite_earn_sub: "ادعُ واربح مكافآت سخية",
        referral_link_title: "رابط الإحالة:", copy_link: "نسخ الرابط",
        gram_earnings: "أرباح الجرام",
        total_referrals: "إجمالي الإحالات", verified_referrals: "الإحالات المؤكدة",
        earn_referral_each_label: "مكافأة الإحالة", earn_referral_each: "اربح {amount} جرام لكل إحالة",
        earn_referral_tasks_label: "عمولة المهام", earn_referral_tasks: "اربح 10% من أرباح الإحالات",
        earn_referral_mining_label: "عمولة التعدين", earn_referral_mining: "اربح 10% من أرباح التعدين",
        withdraw_gram: "سحب جرام", withdrawal_amount: "مبلغ السحب", gram_wallet: "محفظة جرام",
        confirm_withdrawal: "تأكيد السحب", payments_history: "سجل المدفوعات",
        my_payments: "مدفوعاتي", live_payments: "المدفوعات الحية",
        pending: "قيد الانتظار", completed: "مدفوع", processing: "قيد المعالجة", failed: "فشل",
        min_withdraw_note: "الحد الأدنى للسحب: {amount} جرام",
        invalid_amount: "مبلغ غير صالح", wallet_invalid: "محفظة غير صالحة. يجب أن تبدأ بـ UQ و20+ حرف.",
        insufficient_balance: "رصيد غير كافٍ",
        live_channel_title: "قناة المدفوعات الحية",
        live_channel_desc: "احصل على إشعارات المدفوعات في الوقت الفعلي",
        join_channel: "انضم للقناة",
        no_live_payments: "لا مدفوعات",
        not_registered_title: "غير مسجل", not_registered_message: "ابدأ البوت أولاً.",
        register_now: "سجل الآن",
        task_added: "تمت الإضافة!", task_added_success: "تمت إضافة المهمة.",
        name_required: "الاسم 5-20 حرف", link_required: "رابط https:// صحيح",
        invalid_total: "الإجمالي 100-5000", payment_verified: "تم التحقق!",
        payment_failed: "فشل الدفع", payment_checking: "جارٍ التحقق...", payment_error: "خطأ دفع",
        my_tasks: "مهامي",
        join_channel_btn: "انضم", watch_ad_requirement: "شاهد الإعلان",
        join_first: "انضم أولاً", language_changed: "تم تغيير اللغة!",
        task_cooldown: "انتظر {s}ث", promo_code_cooldown: "انتظر {s}ث",
        quests_title: "المهام", reward_claimed: "تم الاستلام",
        daily_limit_reached: "تم بلوغ الحد اليومي",
        view_on_explorer: "عرض", just_now: "الآن", time_ago: "منذ {time}",
        quest_complete_tasks: "أكمل المهام", quest_invite: "ادعُ الصيادين",
        hot: "ساخن", available_tasks: "المهام المتاحة", add_task: "إضافة مهمة",
        hourly: "ساعي", daily: "يومي", monthly: "شهري",
        withdrawable_balance: "الرصيد القابل للسحب",
        mining_balance: "رصيد التعدين",
        withdrawal_conditions: "شروط السحب",
        get_x_referrals: "احصل على {x} إحالة",
        complete_x_tasks: "أكمل {x} مهمة",
        start_miner_x_times: "ابدأ التعدين {x} مرات",
        not_verified: "غير مؤكد",
        mining_status_active: "نشط",
        mining_status_inactive: "غير نشط",
        welcome_bonus_claimed: "تم استلام مكافأة الترحيب مسبقاً",
        welcome_bonus_success: "تم استلام مكافأة الترحيب!",
        device_locked_title: "الجهاز مقفل",
        device_locked_message: "هذا الجهاز مرتبط بالفعل بحساب آخر. يُسمح بحساب واحد فقط لكل جهاز.",
        account_banned_title: "الحساب محظور",
        account_banned_message: "تم حظر حسابك. اتصل بالدعم لمزيد من المعلومات.",
        close: "إغلاق",
        share_friends: "شارك مع الأصدقاء"
    },
    ru: {
        gram: "GRAM", claim: "Забрать",
        loading: "Загрузка", start: "Начать", done: "Готово", delete: "Удалить",
        copy: "Копировать", copy_success: "Скопировано!", link_copied: "Ссылка скопирована",
        no_tasks: "Нет заданий", no_tasks_available: "Заданий нет",
        all_tasks_completed: "Все выполнены!", no_withdrawals: "Платежей нет",
        no_my_tasks: "Заданий нет.", confirm_delete: "Уверены?", deleted: "Удалено",
        busy: "Занято", complete_current_task: "Завершите задание",
        join_required: "Нужна подписка", join_channel_first: "Подпишитесь на канал",
        earn: "Заработать", home: "Главная", team: "Команда", wallet_page: "Вывод",
        no_miner: "Нет майнера", gram_mined: "GRAM", ready_to_claim: "ГОТОВО",
        not_active: "Не активно", start_mining: "НАЧАТЬ",
        claim_reward: "ЗАБРАТЬ {amount}", mining_active: "АКТИВЕН",
        claim_quest: "Забрать",
        main_tasks: "Главная", partner_tasks: "Партнёры", community_tasks: "Сообщества",
        promo_code: "Промокод", enter_code: "Введите код",
        welcome_bonus: "Приветственный бонус",
        invite_earn: "Построй команду", invite_earn_sub: "Приглашай и зарабатывай",
        referral_link_title: "Реф. ссылка:", copy_link: "Копировать",
        gram_earnings: "Заработок GRAM",
        total_referrals: "Всего рефералов", verified_referrals: "Подтверждённые рефералы",
        earn_referral_each_label: "Награда за реферала", earn_referral_each: "{amount} GRAM за реферала",
        earn_referral_tasks_label: "Комиссия с задач", earn_referral_tasks: "10% от рефералов",
        earn_referral_mining_label: "Комиссия с майнинга", earn_referral_mining: "10% от майнинга",
        withdraw_gram: "Вывод GRAM", withdrawal_amount: "Сумма вывода", gram_wallet: "GRAM Кошелёк",
        confirm_withdrawal: "Подтвердить", payments_history: "История платежей",
        my_payments: "Мои платежи", live_payments: "Живые платежи",
        pending: "ОЖИДАНИЕ", completed: "ОПЛАЧЕНО", processing: "ОБРАБОТКА", failed: "ОШИБКА",
        min_withdraw_note: "Минимум: {amount} GRAM",
        invalid_amount: "Неверная сумма", wallet_invalid: "Неверный кошелёк. UQ + 20+ символов.",
        insufficient_balance: "Недостаточно",
        live_channel_title: "Канал живых платежей",
        live_channel_desc: "Получайте уведомления о выплатах в реальном времени",
        join_channel: "Присоединиться",
        no_live_payments: "Платежей нет",
        not_registered_title: "Не зарегистрирован", not_registered_message: "Запустите бота.",
        register_now: "Регистрация",
        task_added: "Добавлено!", task_added_success: "Задание добавлено.",
        name_required: "Имя 5-20 символов", link_required: "Ссылка https://",
        invalid_total: "Всего 100-5000", payment_verified: "Оплата принята!",
        payment_failed: "Ошибка", payment_checking: "Проверка...", payment_error: "Ошибка оплаты",
        my_tasks: "Мои задания",
        join_channel_btn: "Подписаться", watch_ad_requirement: "Смотреть рекламу",
        join_first: "Сначала подписка", language_changed: "Язык изменён!",
        task_cooldown: "Ждите {s}с", promo_code_cooldown: "Ждите {s}с",
        quests_title: "Задания", reward_claimed: "Награда получена",
        daily_limit_reached: "Дневной лимит",
        view_on_explorer: "Открыть", just_now: "Только что", time_ago: "{time} назад",
        quest_complete_tasks: "ВЫПОЛНИТЬ", quest_invite: "ПРИГЛАСИТЬ",
        hot: "ХОТ", available_tasks: "ДОСТУПНЫЕ ЗАДАНИЯ", add_task: "Добавить",
        hourly: "Час", daily: "День", monthly: "Месяц",
        withdrawable_balance: "Доступно к выводу",
        mining_balance: "Баланс майнинга",
        withdrawal_conditions: "Условия вывода",
        get_x_referrals: "Получите {x} рефералов",
        complete_x_tasks: "Выполните {x} задач",
        start_miner_x_times: "Запустите майнер {x} раз",
        not_verified: "Не подтверждено",
        mining_status_active: "АКТИВЕН",
        mining_status_inactive: "НЕ АКТИВЕН",
        welcome_bonus_claimed: "Бонус уже получен",
        welcome_bonus_success: "Бонус получен!",
        device_locked_title: "Устройство заблокировано",
        device_locked_message: "Это устройство уже привязано к другому аккаунту. Разрешён только один аккаунт на устройство.",
        account_banned_title: "Аккаунт заблокирован",
        account_banned_message: "Ваш аккаунт заблокирован. Свяжитесь с поддержкой.",
        close: "Закрыть",
        share_friends: "Поделиться"
    },
    fa: {
        gram: "گرم", claim: "دریافت",
        loading: "بارگذاری", start: "شروع", done: "انجام", delete: "حذف",
        copy: "کپی", copy_success: "کپی شد!", link_copied: "لینک کپی شد",
        no_tasks: "وظیفه‌ای نیست", no_tasks_available: "وظیفه‌ای نیست",
        all_tasks_completed: "همه تکمیل شد!", no_withdrawals: "پرداختی نیست",
        no_my_tasks: "وظیفه‌ای نیست.", confirm_delete: "مطمئنید؟", deleted: "حذف شد",
        busy: "مشغول", complete_current_task: "ابتدا وظیفه فعلی",
        join_required: "نیاز به عضویت", join_channel_first: "ابتدا عضو شوید",
        earn: "درآمد", home: "خانه", team: "تیم", wallet_page: "برداشت",
        no_miner: "بدون ماینر", gram_mined: "گرم معدنی", ready_to_claim: "آماده",
        not_active: "غیرفعال", start_mining: "شروع استخراج",
        claim_reward: "دریافت {amount} گرم", mining_active: "فعال",
        claim_quest: "دریافت",
        main_tasks: "خانه", partner_tasks: "شرکا", community_tasks: "اجتماعی",
        promo_code: "کد", enter_code: "کد را وارد کنید",
        welcome_bonus: "پاداش خوش‌آمدگویی",
        invite_earn: "تیم خود را بسازید", invite_earn_sub: "دعوت کنید و پاداش بگیرید",
        referral_link_title: "لینک معرفی:", copy_link: "کپی لینک",
        gram_earnings: "درآمد گرم",
        total_referrals: "کل معرفی‌ها", verified_referrals: "معرفی‌های تأیید شده",
        earn_referral_each_label: "پاداش معرفی", earn_referral_each: "{amount} گرم برای هر معرفی",
        earn_referral_tasks_label: "کمیسیون وظایف", earn_referral_tasks: "۱۰٪ از معرفی‌ها",
        earn_referral_mining_label: "کمیسیون استخراج", earn_referral_mining: "۱۰٪ از استخراج",
        withdraw_gram: "برداشت GRAM", withdrawal_amount: "مبلغ برداشت", gram_wallet: "کیف GRAM",
        confirm_withdrawal: "تأیید", payments_history: "تاریخچه پرداخت‌ها",
        my_payments: "پرداخت‌های من", live_payments: "پرداخت‌های زنده",
        pending: "در انتظار", completed: "پرداخت شده", processing: "در حال پردازش", failed: "ناموفق",
        min_withdraw_note: "حداقل برداشت: {amount} گرم",
        invalid_amount: "مبلغ نامعتبر", wallet_invalid: "کیف پول نامعتبر. UQ + ۲۰+ کاراکتر.",
        insufficient_balance: "موجودی ناکافی",
        live_channel_title: "کانال پرداخت‌های زنده",
        live_channel_desc: "اعلان‌های پرداخت را در زمان واقعی دریافت کنید",
        join_channel: "پیوستن",
        no_live_payments: "پرداختی نیست",
        not_registered_title: "ثبت نشده", not_registered_message: "ربات را استارت کنید.",
        register_now: "ثبت نام",
        task_added: "اضافه شد!", task_added_success: "وظیفه اضافه شد.",
        name_required: "نام ۵-۲۰ کاراکتر", link_required: "لینک https://",
        invalid_total: "کل ۱۰۰-۵۰۰۰", payment_verified: "پرداخت تأیید شد!",
        payment_failed: "ناموفق", payment_checking: "بررسی...", payment_error: "خطای پرداخت",
        my_tasks: "وظایف من",
        join_channel_btn: "پیوستن", watch_ad_requirement: "تماشای تبلیغ",
        join_first: "ابتدا عضو شوید", language_changed: "زبان تغییر کرد!",
        task_cooldown: "{s}ثانیه صبر", promo_code_cooldown: "{s}ثانیه صبر",
        quests_title: "وظایف", reward_claimed: "پاداش دریافت شد",
        daily_limit_reached: "حد روزانه",
        view_on_explorer: "مشاهده", just_now: "همین حالا", time_ago: "{time} پیش",
        quest_complete_tasks: "تکمیل وظایف", quest_invite: "دعوت شکارچیان",
        hot: "داغ", available_tasks: "وظایف موجود", add_task: "افزودن",
        hourly: "ساعتی", daily: "روزانه", monthly: "ماهانه",
        withdrawable_balance: "موجودی قابل برداشت",
        mining_balance: "موجودی استخراج",
        withdrawal_conditions: "شرایط برداشت",
        get_x_referrals: "دریافت {x} معرفی",
        complete_x_tasks: "تکمیل {x} وظیفه",
        start_miner_x_times: "شروع استخراج {x} بار",
        not_verified: "تأیید نشده",
        mining_status_active: "فعال",
        mining_status_inactive: "غیرفعال",
        welcome_bonus_claimed: "پاداش خوش‌آمدگویی قبلاً دریافت شده",
        welcome_bonus_success: "پاداش خوش‌آمدگویی دریافت شد!",
        device_locked_title: "دستگاه قفل شده",
        device_locked_message: "این دستگاه قبلاً به حساب دیگری متصل شده است. فقط یک حساب در هر دستگاه مجاز است.",
        account_banned_title: "حساب مسدود شده",
        account_banned_message: "حساب شما مسدود شده است. برای اطلاعات بیشتر با پشتیبانی تماس بگیرید.",
        close: "بستن",
        share_friends: "اشتراک با دوستان"
    }
};

class App {
    constructor() {
        this.tg = null;
        this.tgUser = null;
        this.serverUrl = '';
        this.jwtToken = null;
        this.isAuthenticated = false;
        this.taskCache = {
            main: { data: [], timestamp: 0 },
            partner: { data: [], timestamp: 0 },
            community: { data: [], timestamp: 0 }
        };
        this.CACHE_DURATION = 300000;

        this.gramBalance = 0;
        this.withdrawableBalance = 0;
        this.miningBalance = 0;
        this.referralGramEarnings = 0;
        this.userLevel = 1;
        this.userCompletedTasks = new Set();
        this.miningActive = false;
        this.miningStartTime = null;
        this.miningEndTime = null;
        this.miningInterval = null;
        this.uiUpdateInterval = null;
        this.pendingGramReward = 0;
        this.miningSessionHours = 12;
        this.withdrawals = [];
        this.liveWithdrawals = [];
        this.totalReferrals = 0;
        this.verifiedReferrals = 0;
        this.isTaskRunning = false;
        this.userState = null;
        this.totalMiningStarts = 0;

        this.lang = 'en';
        this.referredBy = null;
        this.totalTasksCompleted = 0;
        this.serverTimeOffset = 0;

        this._userDataLoaded = false;
        this._earnLoaded = false;
        this._teamLoaded = false;
        this._walletLoaded = false;
        this._withdrawLock = false;
        this._historyTab = 'my';
        this._lastRealNow = 0;
        this._serverTimeSyncInterval = null;

        this.membershipCache = new Map();
        this._lastFetchTime = new Map();
        this._promoCooldown = 0;
        this.visitorId = null;

        this.quests = { currentTaskQuestIndex: 0, currentReferralQuestIndex: 0 };

        this.config = {};
        this.mainTasks = [];
        this.partnerTasks = [];
        this.communityTasks = [];
        this.myCommunityTasks = [];
        this.promoCodes = [];
        this._activeTaskTab = 'community';

        this.pendingTaskData = null;

        this.welcomeBonusClaimed = false;

        this.loadSettings();
    }

    copyToClipboard(text) {
        if (!text || text === '-') return;
        navigator.clipboard.writeText(text).then(() => {
            this.showNotification(this.t('copy_success'), this.t('link_copied'), 'success');
            this.vibrate('success');
        }).catch(() => {});
    }

    vibrate(type) {
        try {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                if (type === 'success') window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                else if (type === 'error') window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
                else if (type === 'warning') window.Telegram.WebApp.HapticFeedback.notificationOccurred('warning');
                else window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }
        } catch (e) {}
    }

    truncateName(name, maxLength = 15) {
        if (!name) return 'User';
        if (name.length <= maxLength) return name;
        return name.substring(0, maxLength) + '...';
    }

    truncateName20(name) {
        if (!name) return 'User';
        if (name.length <= 20) return name;
        return name.substring(0, 20);
    }

    t(key, params = {}) {
        let text = translations[this.lang]?.[key] || translations.en[key] || key;
        for (const [k, v] of Object.entries(params)) text = text.replace(`{${k}}`, v);
        return text;
    }

    formatGram4(num) {
        return (num || 0).toFixed(4);
    }

    formatGram8(num) {
        return (num || 0).toFixed(8);
    }

    formatGram6(num) {
        return (num || 0).toFixed(6);
    }

    formatGram5(num) {
        return (num || 0).toFixed(5);
    }

    formatGram3(num) {
        return (num || 0).toFixed(3);
    }

    formatGram2(num) {
        return (num || 0).toFixed(2);
    }

    formatBalance4(num) {
        return (num || 0).toFixed(4);
    }

    maskWallet(wallet) {
        if (!wallet || wallet.length < 10) return wallet || '';
        return wallet.substring(0, 5) + '*****' + wallet.substring(wallet.length - 5);
    }

    getMiningRate() {
        return (this.miningBalance || 0) * (this.config.MINING_RATE_PERCENTAGE / 100 || 0.05);
    }

    getHourlyRate() {
        return this.getMiningRate();
    }

    getDailyRate() {
        return this.getMiningRate() * 24;
    }

    getMonthlyRate() {
        return this.getMiningRate() * 24 * 30;
    }

    updateHeaderBalances() {
        const miningEl = document.getElementById('header-mining-balance');
        const withdrawableEl = document.getElementById('header-withdrawable-balance');
        if (miningEl) miningEl.innerText = this.formatBalance4(this.miningBalance);
        if (withdrawableEl) withdrawableEl.innerText = this.formatBalance4(this.withdrawableBalance);
    }

    updateHeaderMiner() {}

    checkCooldown(endpoint) {
        const now = Date.now();
        const key = `${endpoint}_${this.tgUser?.id || 'user'}`;
        const lastCall = this._lastFetchTime.get(key) || 0;
        if (now - lastCall < 1000) return false;
        this._lastFetchTime.set(key, now);
        return true;
    }

    canUsePromo() {
        const now = Date.now();
        const cooldownMs = 5000;
        if (this._promoCooldown && (now - this._promoCooldown) < cooldownMs) {
            return { allowed: false, remaining: Math.ceil((cooldownMs - (now - this._promoCooldown)) / 1000) };
        }
        return { allowed: true, remaining: 0 };
    }

    setPromoCooldown() { this._promoCooldown = Date.now(); }

    async fetchFromServer(endpoint, data = {}) {
        const now = Date.now();
        const key = `${endpoint}_${this.tgUser?.id || 'user'}`;
        const lastCall = this._lastFetchTime.get(key) || 0;
        if (now - lastCall < 1000) {
            await new Promise(r => setTimeout(r, 1000 - (now - lastCall)));
        }
        this._lastFetchTime.set(key, Date.now());
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000);
            const headers = { 'Content-Type': 'application/json' };
            if (this.jwtToken) headers['Authorization'] = `Bearer ${this.jwtToken}`;
            const payload = { ...data, userId: this.tgUser?.id, username: this.tgUser?.username || '', firstName: this.tgUser?.first_name || 'User', photoUrl: this.tgUser?.photo_url || this.config.DEFAULT_USER_AVATAR };
            const response = await fetch(`${this.serverUrl}${endpoint}`, { method: 'POST', headers, body: JSON.stringify(payload), signal: controller.signal });
            clearTimeout(timeoutId);
            const result = await response.json();
            if (result.error === 'Invalid token' || result.error === 'Token expired' || result.error === 'No token provided') {
                const refreshed = await this.refreshToken();
                if (refreshed) return this.fetchFromServer(endpoint, data);
                this.isAuthenticated = false;
                throw new Error('Auth required');
            }
            if (result.error === 'user_not_registered') { this.showNotRegisteredPage(); throw new Error('Not registered'); }
            if (result.error === 'Account banned') { this.showBanModal(); throw new Error('Banned'); }
            if (result.error === 'device_already_linked' || result.error === 'ip_already_linked') { this.showDeviceLock(); throw new Error('Device locked'); }
            if (result.error === 'Too many requests') throw new Error('Cooldown');
            if (result.serverTime) this.serverTimeOffset = result.serverTime - Date.now();
            return result;
        } catch (error) { throw error; }
    }

    async getFromServer(endpoint) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 20000);
            const response = await fetch(`${this.serverUrl}${endpoint}`, { signal: controller.signal });
            clearTimeout(timeoutId);
            return await response.json();
        } catch (error) { throw error; }
    }

    async getConfig() {
        try {
            const config = await this.getFromServer('/api/config');
            this.config = config;
            this.miningSessionHours = config.MINING_SESSION_HOURS || 12;
            return config;
        } catch (error) { return this.config; }
    }

    async getServerTime() {
        try {
            const data = await this.getFromServer('/api/current-time');
            this.serverTimeOffset = data.serverTime - Date.now();
            return data.serverTime;
        } catch (error) { return Date.now(); }
    }

    getCurrentTime() {
        const realNow = Date.now() + this.serverTimeOffset;
        if (this._lastRealNow && realNow > this._lastRealNow + 60000) {
            return this._lastRealNow;
        }
        this._lastRealNow = realNow;
        return realNow;
    }

    async refreshToken() {
        try {
            const result = await this.fetchFromServer('/api/refresh', {});
            if (result.token) {
                this.jwtToken = result.token;
                localStorage.setItem('hunter_jwt', result.token);
                this.isAuthenticated = true;
                return true;
            }
            return false;
        } catch (error) { return false; }
    }

    async authenticate() {
        if (this.jwtToken && this.isAuthenticated) return true;
        try {
            const initData = this.tg?.initData;
            if (!initData) return false;
            const storedJwt = localStorage.getItem('hunter_jwt');
            if (storedJwt) {
                this.jwtToken = storedJwt;
                const result = await this.fetchFromServer('/api/refresh', {});
                if (result.token) {
                    this.jwtToken = result.token;
                    localStorage.setItem('hunter_jwt', result.token);
                    this.isAuthenticated = true;
                    return true;
                }
            }
            const result = await this.fetchFromServer('/api/auth', { initData, userId: this.tgUser?.id, username: this.tgUser?.username || '', firstName: this.tgUser?.first_name || 'User', photoUrl: this.tgUser?.photo_url || this.config.DEFAULT_USER_AVATAR, visitorId: this.visitorId });
            if (result.error === 'device_already_linked' || result.error === 'ip_already_linked') {
                this.showDeviceLock();
                return false;
            }
            if (result.token) {
                this.jwtToken = result.token;
                localStorage.setItem('hunter_jwt', result.token);
                this.isAuthenticated = true;
                return true;
            }
            return false;
        } catch (error) { return false; }
    }

    showNotRegisteredPage() {
        if (document.getElementById('not-registered-page')) return;
        const page = document.createElement('div');
        page.id = 'not-registered-page';
        page.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:#020824;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:99999;padding:20px;text-align:center;gap:20px;`;
        page.innerHTML = `
            <div style="font-size:80px;margin-bottom:10px;">🎯</div>
            <h2 style="color:#00E5FF;font-size:1.5rem;font-weight:700;margin:0;">${this.t('not_registered_title')}</h2>
            <p style="color:#91B8D9;font-size:0.9rem;max-width:300px;line-height:1.6;margin:0;">${this.t('not_registered_message')}</p>
            <a href="https://t.me/GramHtrsbot/app?startapp=start" target="_blank" style="display:inline-flex;align-items:center;gap:10px;padding:14px 32px;background:linear-gradient(135deg,#064BFF,#008CFF);border-radius:60px;color:#fff;font-weight:700;font-size:1rem;text-decoration:none;margin-top:10px;">
                <i class="fas fa-rocket"></i> ${this.t('register_now')}
            </a>
        `;
        document.body.appendChild(page);
        document.getElementById('app').style.display = 'none';
        document.getElementById('app-loader').style.display = 'none';
    }

    showDeviceLock() {
        if (document.getElementById('device-lock-page')) return;
        const page = document.createElement('div');
        page.id = 'device-lock-page';
        page.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;background:#020824;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:99999;padding:20px;text-align:center;gap:20px;`;
        page.innerHTML = `
            <div style="font-size:80px;">🚫</div>
            <h2 style="color:#FF4444;font-size:1.5rem;font-weight:700;margin:0;">${this.t('device_locked_title')}</h2>
            <p style="color:#91B8D9;font-size:0.9rem;max-width:300px;line-height:1.6;margin:0;">
                ${this.t('device_locked_message')}
            </p>
            <button onclick="if(window.Telegram?.WebApp) window.Telegram.WebApp.close(); else window.close();"
                style="padding:14px 32px;background:linear-gradient(135deg,#064BFF,#008CFF);border:none;border-radius:60px;color:#fff;font-weight:700;font-size:1rem;cursor:pointer;">
                ${this.t('close')}
            </button>
        `;
        document.body.appendChild(page);
        document.getElementById('app').style.display = 'none';
        document.getElementById('app-loader').style.display = 'none';
    }

    async loadUserData() {
        if (this._userDataLoaded) return;
        try {
            const authenticated = await this.authenticate();
            if (!authenticated) return;
            const result = await this.fetchFromServer('/api/get-user', {});
            if (result.error) {
                if (result.error === 'Account banned') { this.showBanModal(); return; }
                return;
            }
            const user = result.user;
            this.gramBalance = user.gram_balance || 0;
            this.withdrawableBalance = user.withdrawable_balance || 0;
            this.miningBalance = user.mining_balance || 0;
            this.referralGramEarnings = user.referral_gram_earnings || 0;
            this.userLevel = user.level || 1;
            this.miningActive = user.mining_active || false;
            this.miningStartTime = user.mining_start_time || null;
            this.miningEndTime = user.mining_end_time || null;
            this.pendingGramReward = user.pending_gram_reward || 0;
            this.referredBy = user.referred_by || null;
            this.totalReferrals = user.total_referrals || 0;
            this.verifiedReferrals = user.verified_referrals || 0;
            this.totalTasksCompleted = user.total_tasks_completed || 0;
            this.totalMiningStarts = user.total_mining_starts || 0;
            this.userState = user.state || 'active';
            this.isAuthenticated = true;
            this.welcomeBonusClaimed = user.welcome_bonus_claimed || false;

            if (user.quests) {
                this.quests = user.quests;
                this.quests.currentTaskQuestIndex = user.quests.current_task_quest_index || 0;
                this.quests.currentReferralQuestIndex = user.quests.current_referral_quest_index || 0;
            }

            if (result.completedTasks) this.userCompletedTasks = new Set(result.completedTasks);
            if (result.withdrawals) this.withdrawals = result.withdrawals;

            this._userDataLoaded = true;

            const nameSpan = document.getElementById('user-name');
            if (nameSpan) nameSpan.innerText = this.truncateName(this.tgUser.first_name || 'User');
            const photoImg = document.getElementById('user-photo');
            if (photoImg) photoImg.src = this.tgUser.photo_url || this.config.DEFAULT_USER_AVATAR;

            this.updateHeaderBalances();

            document.getElementById('app-loader').style.display = 'none';
            document.getElementById('app').style.display = 'block';
        } catch (error) {}
    }

    getMiningProgressPercent() {
        if (!this.miningActive || !this.miningStartTime || !this.miningEndTime) return 0;
        const totalDuration = this.miningSessionHours * 3600000;
        const elapsed = Math.min(totalDuration, this.getCurrentTime() - this.miningStartTime);
        return (elapsed / totalDuration) * 100;
    }

    getMinedAmount() {
        if (!this.miningActive || !this.miningStartTime) return 0;
        const rate = this.getMiningRate();
        const elapsed = Math.min((this.getCurrentTime() - this.miningStartTime) / 3600000, this.miningSessionHours);
        return rate * elapsed;
    }

    startServerTimeSync() {
        if (this._serverTimeSyncInterval) clearInterval(this._serverTimeSyncInterval);
        this._serverTimeSyncInterval = setInterval(async () => {
            try {
                const data = await this.getFromServer('/api/current-time');
                if (data?.serverTime) this.serverTimeOffset = data.serverTime - Date.now();
            } catch (e) {}
        }, 30000);
    }

    async startMining() {
        const serverTime = await this.getServerTime();
        const result = await this.fetchFromServer('/api/start-mining', { serverTime });
        if (result.error) { this.showNotification('Error', result.error, 'error'); this.vibrate('error'); return; }
        if (result.user) {
            this.miningActive = result.user.mining_active || false;
            this.miningStartTime = result.user.mining_start_time || null;
            this.miningEndTime = result.user.mining_end_time || null;
            this.pendingGramReward = result.user.pending_gram_reward || 0;
            this.totalReferrals = result.user.total_referrals || 0;
            this.verifiedReferrals = result.user.verified_referrals || 0;
            this.totalMiningStarts = result.user.total_mining_starts || 0;
            this.renderMining();
            this.startMiningLoop();
            this.showNotification('Mining Started', 'Your rig is mining GRAM', 'success');
            this.vibrate('success');
        }
    }

    async stopMining() {
        if (!this.miningActive) return;
        const result = await this.fetchFromServer('/api/stop-mining', {});
        if (result.error) return;
        if (result.user) {
            this.miningActive = result.user.mining_active || false;
            this.miningStartTime = result.user.mining_start_time || null;
            this.miningEndTime = result.user.mining_end_time || null;
            this.pendingGramReward = result.user.pending_gram_reward || 0;
            this.renderMining();
            if (this.miningInterval) clearInterval(this.miningInterval);
            if (this.uiUpdateInterval) clearInterval(this.uiUpdateInterval);
        }
    }

    async claimMiningRewards() {
        if (this.pendingGramReward <= 0) { this.showNotification('Error', 'No rewards', 'error'); this.vibrate('error'); return; }
        try { await this.showAdsgramInterstitial(); } catch (e) {}
        const result = await this.fetchFromServer('/api/claim-mining', {});
        if (result.error) { this.showNotification('Error', result.error, 'error'); this.vibrate('error'); return; }
        if (result.user) {
            this.gramBalance = result.user.gram_balance || 0;
            this.withdrawableBalance = result.user.withdrawable_balance || 0;
            this.pendingGramReward = result.user.pending_gram_reward || 0;
            this.miningActive = result.user.mining_active || false;
            this.miningStartTime = result.user.mining_start_time || null;
            this.miningEndTime = result.user.mining_end_time || null;
            this.updateHeaderBalances();
            this.renderMining();
            this.showNotification('Reward Claimed', `+${this.formatGram8(result.claimed)} GRAM`, 'success');
            this.vibrate('success');
        }
    }

    async claimWelcomeBonus() {
        const result = await this.fetchFromServer('/api/claim-welcome-bonus', {});
        if (result.error) { this.showNotification('Error', result.error, 'error'); this.vibrate('error'); return; }
        if (result.user) {
            this.miningBalance = result.user.mining_balance || 0;
            this.welcomeBonusClaimed = true;
            this.updateHeaderBalances();
            this.renderMining();
            this.showNotification(this.t('welcome_bonus_success'), `+${this.formatGram8(result.bonus)} GRAM`, 'success');
            this.vibrate('success');
        }
    }

    startMiningLoop() {
        if (this.miningInterval) clearInterval(this.miningInterval);
        if (this.uiUpdateInterval) clearInterval(this.uiUpdateInterval);
        this.miningInterval = setInterval(async () => {
            if (!this.miningActive) return;
            const currentTime = this.getCurrentTime();
            if (this.miningEndTime && currentTime >= this.miningEndTime) await this.stopMining();
        }, 60000);
        this.uiUpdateInterval = setInterval(() => {
            if (this.miningActive) { this.updateMiningTimerDisplay(); this.updateMiningProgressDisplay(); }
        }, 1000);
    }

    updateMiningTimerDisplay() {
        if (!this.miningEndTime) return;
        const currentTime = this.getCurrentTime();
        const remaining = Math.max(0, (this.miningEndTime - currentTime) / 1000);
        if (remaining <= 0 && this.miningActive) { this.stopMining(); this.renderMining(); return; }
        const hours = Math.floor(remaining / 3600);
        const minutes = Math.floor((remaining % 3600) / 60);
        const seconds = Math.floor(remaining % 60);
        const timerEl = document.querySelector('.mining-timer');
        if (timerEl) timerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateMiningProgressDisplay() {
        if (!this.miningActive) return;
        const progressPercent = this.getMiningProgressPercent();
        const minedAmount = this.getMinedAmount();
        const progressFill = document.querySelector('.mining-progress-fill');
        if (progressFill) progressFill.style.width = progressPercent + '%';
        const progressText = document.querySelector('.mining-progress-text .percent');
        if (progressText) progressText.innerText = Math.floor(progressPercent) + '%';
        const amountEl = document.querySelector('.mining-status .amount');
        if (amountEl) amountEl.innerText = this.formatGram6(minedAmount);
    }

    async applyPromoCode(code) {
        if (!this.tgUser) return false;
        const promoCheck = this.canUsePromo();
        if (!promoCheck.allowed) { this.showNotification('Cooldown', this.t('promo_code_cooldown', { s: promoCheck.remaining }), 'warning'); this.vibrate('warning'); return false; }
        try {
            const result = await this.fetchFromServer('/api/claim-promo-code', { code });
            if (result.error) { this.showNotification('Error', result.error, 'error'); this.vibrate('error'); return false; }
            if (result.user) {
                this.gramBalance = result.user.gram_balance || 0;
                this.miningBalance = result.user.mining_balance || 0;
                this.updateHeaderBalances();
                this.setPromoCooldown();
            }
            this.showNotification('Reward Claimed', `You received ${result.reward}`, 'success');
            this.vibrate('success');
            return true;
        } catch (error) { return false; }
    }

    async claimReferralEarnings() {
        try {
            await this.showAdsgramInterstitial();
        } catch (e) {
            this.showNotification('No Ads', 'No ads available', 'warning'); this.vibrate('warning'); return false;
        }
        try {
            const result = await this.fetchFromServer('/api/claim-referral-earnings', {});
            if (result.error) { this.showNotification('Error', result.error, 'error'); this.vibrate('error'); return false; }
            if (result.user) {
                this.miningBalance = result.user.mining_balance || 0;
                this.referralGramEarnings = result.user.referral_gram_earnings || 0;
                this.updateHeaderBalances();
                this.showNotification('Reward Claimed', `+${this.formatGram8(result.claimed)} GRAM`, 'success');
                this.vibrate('success');
                if (this._teamLoaded) this.renderTeam();
                return true;
            }
            return false;
        } catch (error) { return false; }
    }

    async loadTasks(category) {
        try {
            const result = await this.fetchFromServer(`/api/tasks/${category}`, {});
            const tasks = result.tasks;
            if (tasks) tasks.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            return tasks || [];
        } catch (error) { return []; }
    }

    async loadTasksWithCache(category) {
        const now = Date.now();
        const cache = this.taskCache[category];
        if (cache && (now - cache.timestamp) < this.CACHE_DURATION) return cache.data;
        const tasks = await this.loadTasks(category);
        this.taskCache[category] = { data: tasks, timestamp: now };
        return tasks;
    }

    async loadMyTasks() {
        try {
            const result = await this.fetchFromServer('/api/my-tasks', {});
            this.myCommunityTasks = result.tasks || [];
            return this.myCommunityTasks;
        } catch (error) { return []; }
    }

    async deleteMyTask(taskId) {
        try {
            const result = await this.fetchFromServer('/api/delete-task', { taskId });
            if (result.success) {
                this.myCommunityTasks = this.myCommunityTasks.filter(t => t.id !== taskId);
                this.showNotification('Success', this.t('deleted'), 'success');
                this.vibrate('success');
                return true;
            }
            return false;
        } catch (error) { return false; }
    }

    async checkMembership(channel) {
        if (!this.tgUser) return false;
        const cacheKey = `membership_${channel}_${this.tgUser.id}`;
        const cached = this.membershipCache.get(cacheKey);
        const now = Date.now();
        if (cached && (now - cached.timestamp) < 1800000) return cached.isMember;
        try {
            const result = await this.fetchFromServer('/api/check-membership', { channel });
            if (result.error === 'bot_not_admin') return true;
            const isMember = result.isMember === true;
            this.membershipCache.set(cacheKey, { isMember, timestamp: now });
            return isMember;
        } catch (e) { return false; }
    }

    extractChatId(url) {
        const match = url.match(/t\.me\/([^\/\?]+)/);
        return match ? match[1] : null;
    }

    async completeTask(taskId) {
        try {
            const result = await this.fetchFromServer('/api/complete-task', { taskId });
            if (result.error) { this.showNotification('Error', result.error, 'error'); return false; }
            if (result.user) {
                this.gramBalance = result.user.gram_balance || 0;
                this.miningBalance = result.user.mining_balance || 0;
                this.totalTasksCompleted = result.user.total_tasks_completed || 0;
                this.updateHeaderBalances();
            }
            return true;
        } catch (error) { return false; }
    }

    disableAllTaskButtons(disable) {
        document.querySelectorAll('.task-btn').forEach(btn => {
            if (!btn.classList.contains('done') && !btn.classList.contains('go')) btn.disabled = disable;
        });
    }

    generateShortMemo(prefix, userId) {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let random8 = '';
        for (let i = 0; i < 8; i++) random8 += chars[Math.floor(Math.random() * chars.length)];
        return `${prefix}_${userId}_${random8}`;
    }

    showNotification(title, message, type) {
        const el = document.createElement('div');
        el.className = `notif ${type}`;
        const icon = type === 'success' ? 'fa-check-circle' : (type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle');
        el.innerHTML = `<i class="fas ${icon}"></i><div><strong>${title}</strong><br><small>${message}</small></div>`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 3000);
    }

    loadSettings() {
        const saved = localStorage.getItem('hunter_settings');
        if (saved) {
            try { this.lang = JSON.parse(saved).lang || 'en'; } catch (e) { this.lang = 'en'; }
        }
        this.updateLangFlag();
    }

    updateLangFlag() {
        const flagMap = { 'en': 'https://flagcdn.com/w40/gb.png', 'ar': 'https://flagcdn.com/w40/sa.png', 'ru': 'https://flagcdn.com/w40/ru.png', 'fa': 'https://flagcdn.com/w40/ir.png' };
        const flag = document.getElementById('current-flag');
        if (flag) flag.src = flagMap[this.lang] || flagMap['en'];
    }

    showBanModal() {
        const modal = document.getElementById('ban-modal');
        if (modal) {
            modal.style.display = 'flex';
            document.getElementById('app').style.display = 'none';
            document.getElementById('app-loader').style.display = 'none';
        }
        document.getElementById('close-app-btn')?.addEventListener('click', () => {
            if (window.Telegram?.WebApp) window.Telegram.WebApp.close();
            else window.close();
        });
    }

    formatTimeAgo(timestamp) {
        const diff = Date.now() - timestamp;
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return this.t('just_now');
        if (mins < 60) return this.t('time_ago', { time: `${mins}m` });
        const hours = Math.floor(mins / 60);
        if (hours < 24) return this.t('time_ago', { time: `${hours}h` });
        const days = Math.floor(hours / 24);
        return this.t('time_ago', { time: `${days}d` });
    }

    async showAdsgramInterstitial() {
        let retries = 0;
        while (typeof window.Adsgram?.init !== 'function' && retries < 20) {
            await new Promise(r => setTimeout(r, 250));
            retries++;
        }
        if (typeof window.Adsgram?.init !== 'function') throw new Error('Adsgram not loaded');
        const controller = window.Adsgram.init({ blockId: 'int-57442' });
        await controller.show();
    }

    async shareGramHunters() {
        if (!window.Telegram?.WebApp) return;
        try {
            const result = await this.fetchFromServer('/api/prepare-share', {});
            if (result.error) throw new Error(result.error);
            window.Telegram.WebApp.shareMessage(result.msg_id);
        } catch (e) {
            this.showNotification('Error', 'Could not share. Try again.', 'error');
        }
    }

    renderMining() {
        const el = document.getElementById('mining-page');
        if (!el) return;

        const hourlyRate = this.getHourlyRate();
        const dailyRate = this.getDailyRate();
        const monthlyRate = this.getMonthlyRate();
        const progressPercent = this.getMiningProgressPercent();

        let bodyHtml = '';
        let actionHtml = '';

        if (!this.welcomeBonusClaimed) {
            bodyHtml = `
                <div class="welcome-card">
                    <span class="welcome-gift-icon">🎁</span>
                    <div class="welcome-title">${this.t('welcome_bonus')}</div>
                    <div class="welcome-amount">${this.formatGram2(this.config.WELCOME_BONUS_GRAM || 0.20)} GRAM</div>
                    <button id="claim-welcome-btn" class="welcome-claim-btn">${this.t('claim')}</button>
                </div>
            `;
            el.innerHTML = `
                ${bodyHtml}
                <div class="section-header blue-header"><h3><i class="fas fa-trophy"></i> ${this.t('quests_title')}</h3></div>
                <div id="task-quests-container"></div>
                <div id="referral-quests-container"></div>
            `;
            this.renderQuests();
            document.getElementById('claim-welcome-btn')?.addEventListener('click', () => this.claimWelcomeBonus());
            return;
        }

        if (this.miningActive) {
            const minedAmount = this.getMinedAmount();
            bodyHtml = `
                <div class="mining-status active"><span class="amount">${this.formatGram6(minedAmount)}</span></div>
                <div class="mining-status-row">
                    <span class="mining-status-label active"><span class="live-dot"></span> ${this.t('mining_status_active')}</span>
                </div>
            `;
            actionHtml = `
                <div class="mining-progress-container">
                    <div class="mining-progress-bar"><div class="mining-progress-fill" style="width: ${progressPercent}%"></div></div>
                    <div class="mining-progress-text"><span class="timer-only mining-timer">00:00:00</span><span class="percent">${Math.floor(progressPercent)}%</span></div>
                </div>
            `;
        } else if (this.pendingGramReward > 0) {
            bodyHtml = `
                <div class="mining-status active"><span class="amount">${this.formatGram6(this.pendingGramReward)}</span><span class="label">${this.t('ready_to_claim')}</span></div>
                <div class="mining-status-row">
                    <span class="mining-status-label inactive"><span class="live-dot"></span> ${this.t('mining_status_inactive')}</span>
                </div>
            `;
            actionHtml = `<button id="claim-mining-btn" class="mining-claim-btn"><img src="${this.config.GRAM_ICON}" class="claim-coin-icon"> ${this.t('claim_reward', { amount: this.formatGram6(this.pendingGramReward) })}</button>`;
        } else {
            bodyHtml = `
                <div class="mining-status not-active">${this.formatGram6(0)}</div>
                <div class="mining-status-row">
                    <span class="mining-status-label inactive"><span class="live-dot"></span> ${this.t('mining_status_inactive')}</span>
                </div>
            `;
            actionHtml = `<button id="start-mining-btn" class="mining-action-btn"><i class="fas fa-play"></i> ${this.t('start_mining')}</button>`;
        }

        el.innerHTML = `
            <div class="mining-card">
                <div class="mining-logo-wrapper ${this.miningActive ? 'active' : 'inactive'}">
                    <img src="${this.config.APP_LOGO}" class="mining-logo" alt="GRAM">
                </div>
                ${bodyHtml}
                <div class="speed-card">
                    <div class="speed-item"><div class="speed-label">${this.t('hourly')}</div><div class="speed-value">${this.formatGram5(hourlyRate)}</div></div>
                    <div class="speed-item"><div class="speed-label">${this.t('daily')}</div><div class="speed-value">${this.formatGram3(dailyRate)}</div></div>
                    <div class="speed-item"><div class="speed-label">${this.t('monthly')}</div><div class="speed-value">${this.formatGram2(monthlyRate)}</div></div>
                </div>
                ${actionHtml}
            </div>

            <div class="section-header blue-header"><h3><i class="fas fa-trophy"></i> ${this.t('quests_title')}</h3></div>
            <div id="task-quests-container"></div>
            <div id="referral-quests-container"></div>
        `;

        this.renderQuests();

        document.getElementById('start-mining-btn')?.addEventListener('click', () => this.startMining());
        document.getElementById('claim-mining-btn')?.addEventListener('click', () => this.claimMiningRewards());

        if (this.miningActive) this.updateMiningTimerDisplay();
    }

    renderQuests() {
        const taskQuestsContainer = document.getElementById('task-quests-container');
        const referralQuestsContainer = document.getElementById('referral-quests-container');

        const taskQuests = this.config?.QUESTS?.task_quests || [];
        const taskIndex = this.quests.currentTaskQuestIndex || 0;
        const currentTaskQuest = taskIndex < taskQuests.length ? taskQuests[taskIndex] : null;

        if (currentTaskQuest && taskQuestsContainer) {
            const taskQuestComplete = this.totalTasksCompleted >= currentTaskQuest.target_tasks;
            const taskProgress = Math.min(100, (this.totalTasksCompleted / currentTaskQuest.target_tasks) * 100);
            taskQuestsContainer.innerHTML = `
                <div class="quest-card blue-quest">
                    <div class="quest-header">
                        <div class="quest-icon blue-icon"><i class="fas fa-clipboard-list"></i></div>
                        <div class="quest-info">
                            <h4>${this.t('quest_complete_tasks')} - ${currentTaskQuest.target_tasks}</h4>
                            <div class="quest-rewards-row">
                                <span class="quest-reward-badge"><img src="${this.config.GRAM_ICON}"> ${this.formatGram3(currentTaskQuest.reward)}</span>
                            </div>
                            <div class="quest-progress-bar"><div class="quest-progress-fill" style="width: ${taskProgress}%"></div></div>
                            <div style="font-size:0.55rem;color:#91B8D9;margin-top:2px;">${Math.floor(taskProgress)}%</div>
                        </div>
                        ${taskQuestComplete ? `<button id="claim-task-quest" class="quest-claim-btn">${this.t('claim_quest')}</button>` : `<button class="quest-claim-btn locked" disabled><i class="fas fa-lock"></i></button>`}
                    </div>
                </div>
            `;
            document.getElementById('claim-task-quest')?.addEventListener('click', async () => {
                const btn = document.getElementById('claim-task-quest');
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i>';
                try { await this.showAdsgramInterstitial(); } catch (e) {}
                const success = await this.claimQuest('task');
                if (success) this.renderQuests();
                else { btn.disabled = false; btn.innerHTML = this.t('claim_quest'); }
            });
        } else if (taskQuestsContainer) taskQuestsContainer.innerHTML = '';

        const referralQuests = this.config?.QUESTS?.referral_quests || [];
        const referralIndex = this.quests.currentReferralQuestIndex || 0;
        const currentReferralQuest = referralIndex < referralQuests.length ? referralQuests[referralIndex] : null;

        if (currentReferralQuest && referralQuestsContainer) {
            const referralQuestComplete = this.totalReferrals >= currentReferralQuest.target_referrals;
            const referralProgress = Math.min(100, (this.totalReferrals / currentReferralQuest.target_referrals) * 100);
            referralQuestsContainer.innerHTML = `
                <div class="quest-card blue-quest">
                    <div class="quest-header">
                        <div class="quest-icon blue-icon"><i class="fas fa-users"></i></div>
                        <div class="quest-info">
                            <h4>${this.t('quest_invite')} - ${currentReferralQuest.target_referrals}</h4>
                            <div class="quest-rewards-row">
                                <span class="quest-reward-badge"><img src="${this.config.GRAM_ICON}"> ${this.formatGram3(currentReferralQuest.reward)}</span>
                            </div>
                            <div class="quest-progress-bar"><div class="quest-progress-fill" style="width: ${referralProgress}%"></div></div>
                            <div style="font-size:0.55rem;color:#91B8D9;margin-top:2px;">${Math.floor(referralProgress)}%</div>
                        </div>
                        ${referralQuestComplete ? `<button id="claim-referral-quest" class="quest-claim-btn">${this.t('claim_quest')}</button>` : `<button class="quest-claim-btn locked" disabled><i class="fas fa-lock"></i></button>`}
                    </div>
                </div>
            `;
            document.getElementById('claim-referral-quest')?.addEventListener('click', async () => {
                const btn = document.getElementById('claim-referral-quest');
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i>';
                try { await this.showAdsgramInterstitial(); } catch (e) {}
                const success = await this.claimQuest('referral');
                if (success) this.renderQuests();
                else { btn.disabled = false; btn.innerHTML = this.t('claim_quest'); }
            });
        } else if (referralQuestsContainer) referralQuestsContainer.innerHTML = '';
    }

    async claimQuest(questType) {
        try {
            const result = await this.fetchFromServer('/api/claim-quest', { questType });
            if (result.error) { this.showNotification('Error', result.error, 'error'); this.vibrate('error'); return false; }
            if (result.user) {
                this.miningBalance = result.user.mining_balance || 0;
                if (result.user.quests) {
                    this.quests = result.user.quests;
                    this.quests.currentTaskQuestIndex = result.user.quests.current_task_quest_index || 0;
                    this.quests.currentReferralQuestIndex = result.user.quests.current_referral_quest_index || 0;
                }
                if (result.questIndex !== undefined) {
                    if (questType === 'task') this.quests.currentTaskQuestIndex = result.questIndex;
                    else if (questType === 'referral') this.quests.currentReferralQuestIndex = result.questIndex;
                }
                this.updateHeaderBalances();
                this.showNotification('Reward Claimed', `+${this.formatGram8(result.reward)} GRAM`, 'success');
                this.vibrate('success');
                return true;
            }
            return false;
        } catch (error) { return false; }
    }

    renderEarn() {
        const el = document.getElementById('earn-page');
        if (!el) return;

        el.innerHTML = `
            <div class="promo-card blue-card">
                <div class="promo-title"><i class="fas fa-ticket-alt"></i> ${this.t('promo_code')}</div>
                <div class="promo-input-group">
                    <input type="text" id="promo-input" class="form-input blue-input" placeholder="${this.t('enter_code')}" autocomplete="off">
                    <button id="promo-submit" class="promo-submit-btn" disabled>${this.t('claim')}</button>
                </div>
            </div>

            <div class="section-header blue-header">
            <h3><i class="fas fa-clipboard-list"></i> ${this.t('available_tasks')}</h3>
            </div>

            <div class="task-tabs" id="task-tabs">
                <button class="task-tab ${this._activeTaskTab === 'main' ? 'active' : ''}" data-tab="main">
                    <span>${this.t('main_tasks')}</span>
                    <span class="task-tab-badge" id="tab-badge-main">0</span>
                </button>
                <button class="task-tab ${this._activeTaskTab === 'partner' ? 'active' : ''}" data-tab="partner">
                    <span>${this.t('partner_tasks')}</span>
                    <span class="task-tab-badge" id="tab-badge-partner">0</span>
                </button>
                <button class="task-tab ${this._activeTaskTab === 'community' ? 'active' : ''}" data-tab="community">
                    <span>${this.t('community_tasks')}</span>
                    <span class="task-tab-badge" id="tab-badge-community">0</span>
                </button>
            </div>

            <div id="tasks-container" class="tasks-list">
                <div class="task-loading"><i class="fas fa-spinner fa-pulse"></i><p>${this.t('loading')}...</p></div>
            </div>
        `;

        this.attachEarnHandlers();
        this.attachTaskTabHandlers();
        this.loadTasksForActiveTab();
    }

    attachTaskTabHandlers() {
        document.querySelectorAll('.task-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.task-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this._activeTaskTab = tab.dataset.tab;
                this.loadTasksForActiveTab();
            });
        });
    }

    async loadTasksForActiveTab() {
        const container = document.getElementById('tasks-container');
        if (!container) return;

        const tab = this._activeTaskTab;

        container.innerHTML = '';

        if (tab === 'community') {
            container.insertAdjacentHTML('beforeend', `
                <div class="task-action-row">
                    <button id="add-community-task-btn" class="task-action-btn">
                        <i class="fas fa-plus"></i> ${this.t('add_task')}
                    </button>
                    <button id="my-community-tasks-btn" class="task-action-btn secondary">
                        <i class="fas fa-list"></i> ${this.t('my_tasks')}
                    </button>
                </div>
                <div id="tasks-inner"></div>
            `);
            document.getElementById('add-community-task-btn')?.addEventListener('click', () => this.showAddCommunityTaskModal());
            document.getElementById('my-community-tasks-btn')?.addEventListener('click', () => this.showMyTasksModal());
        } else {
            container.insertAdjacentHTML('beforeend', `<div id="tasks-inner"></div>`);
        }

        const inner = document.getElementById('tasks-inner');
        inner.innerHTML = `<div class="task-loading"><i class="fas fa-spinner fa-pulse"></i><p>${this.t('loading')}...</p></div>`;

        try {
            const tasks = await this.loadTasksWithCache(tab);
            const availableTasks = tasks.filter(task => {
                if (this.userCompletedTasks.has(task.id)) return false;
                if ((task.total_completed || 0) >= (task.total || 0)) return false;
                if (tab === 'community' && task.owner === this.tgUser?.id) return false;
                return true;
            });

            const counts = { main: 0, partner: 0, community: 0 };
            for (const cat of ['main', 'partner', 'community']) {
                try {
                    const c = await this.loadTasksWithCache(cat);
                    counts[cat] = c.filter(t => {
                        if (this.userCompletedTasks.has(t.id)) return false;
                        if ((t.total_completed || 0) >= (t.total || 0)) return false;
                        if (cat === 'community' && t.owner === this.tgUser?.id) return false;
                        return true;
                    }).length;
                } catch (e) {}
            }
            const bm = document.getElementById('tab-badge-main');
            const bp = document.getElementById('tab-badge-partner');
            const bc = document.getElementById('tab-badge-community');
            if (bm) bm.textContent = counts.main;
            if (bp) bp.textContent = counts.partner;
            if (bc) bc.textContent = counts.community;

            if (tab === 'main') this.mainTasks = availableTasks;
            else if (tab === 'partner') this.partnerTasks = availableTasks;
            else this.communityTasks = availableTasks;

            if (availableTasks.length === 0) {
                inner.innerHTML = `<div class="no-data"><i class="fas fa-tasks"></i><p>${this.t('all_tasks_completed')}</p></div>`;
                return;
            }

            const rewards = this.config.TASK_REWARDS || {};
            inner.innerHTML = availableTasks.map(task => {
                const cat = task.category || tab;
                const rewardConf = rewards[cat] || {};
                const gramReward = rewardConf.gram || 0;
                return `
                    <div class="task-card blue-card">
                        <div class="task-header">
                            <div class="task-icon blue-icon" style="width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.2rem;"><i class="fas fa-clipboard-list"></i></div>
                            <div class="task-info">
                                <h4>${task.name}</h4>
                                <div class="task-reward">
                                    ${gramReward > 0 ? `<span class="reward-badge"><img src="${this.config.GRAM_ICON}"> ${this.formatGram3(gramReward)}</span>` : ''}
                                </div>
                            </div>
                            <button class="task-btn start" data-id="${task.id}" data-url="${task.url || ''}" data-verify="${task.verification || false}">${this.t('start')}</button>
                        </div>
                    </div>
                `;
            }).join('');

            this.attachTaskHandlers(inner, availableTasks, tab);
        } catch (error) {
            inner.innerHTML = `<div class="no-data"><i class="fas fa-exclamation-triangle"></i><p>${this.t('no_tasks')}</p></div>`;
        }
    }

    attachTaskHandlers(container, tasksArray, category) {
        container.querySelectorAll('.task-btn.start').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (this.isTaskRunning) {
                    this.showNotification(this.t('busy'), this.t('complete_current_task'), 'warning');
                    this.vibrate('warning');
                    return;
                }
                const taskId = btn.dataset.id;
                const task = tasksArray.find(t => t.id === taskId);
                if (!task) return;
                this.isTaskRunning = true;
                this.disableAllTaskButtons(true);
                btn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i>';
                btn.disabled = true;
                if (task.url) window.open(task.url, '_blank');
                let seconds = this.config.TASK_VERIFICATION_DELAY || 10;
                const interval = setInterval(() => {
                    seconds--;
                    if (seconds <= 0) {
                        clearInterval(interval);
                        btn.innerHTML = this.t('claim');
                        btn.disabled = false;
                        btn.classList.remove('start');
                        btn.classList.add('claim-btn');
                        const newBtn = btn.cloneNode(true);
                        btn.parentNode.replaceChild(newBtn, btn);
                        newBtn.addEventListener('click', async (e) => {
                            e.stopPropagation();
                            newBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i>';
                            newBtn.disabled = true;
                            let isMember = true;
                            if (task.verification && task.url) {
                                const chatId = this.extractChatId(task.url);
                                if (chatId) isMember = await this.checkMembership(chatId);
                            }
                            if (isMember) {
                                const success = await this.completeTask(taskId);
                                if (success) {
                                    newBtn.innerHTML = '✓ ' + this.t('done');
                                    newBtn.classList.add('done');
                                    newBtn.classList.remove('claim-btn');
                                    this.userCompletedTasks.add(taskId);
                                    const rewards = this.config.TASK_REWARDS || {};
                                    const r = rewards[category] || {};
                                    const reward = `+${this.formatGram3(r.gram || 0)} GRAM`;
                                    this.showNotification('Reward Claimed', reward, 'success');
                                    this.vibrate('success');
                                    this.isTaskRunning = false;
                                    this.disableAllTaskButtons(false);
                                    setTimeout(() => this.loadTasksForActiveTab(), 1000);
                                    return;
                                }
                            } else {
                                this.showNotification(this.t('join_required'), this.t('join_channel_first'), 'warning');
                                this.vibrate('warning');
                                newBtn.innerHTML = this.t('start');
                                newBtn.disabled = false;
                                newBtn.classList.remove('claim-btn');
                                newBtn.classList.add('start');
                            }
                            this.isTaskRunning = false;
                            this.disableAllTaskButtons(false);
                        });
                    }
                }, 1000);
            });
        });
    }

    attachEarnHandlers() {
        const promoInput = document.getElementById('promo-input');
        const promoSubmit = document.getElementById('promo-submit');
        if (promoInput && promoSubmit) {
            promoInput.addEventListener('input', () => {
                promoSubmit.disabled = promoInput.value.trim() === '';
                promoSubmit.classList.toggle('active', !promoSubmit.disabled);
            });
            promoSubmit.addEventListener('click', async () => {
                const code = promoInput.value.trim();
                if (!code) return;
                promoSubmit.disabled = true;
                promoSubmit.innerHTML = '<i class="fas fa-spinner fa-pulse"></i>';
                try { await this.showAdsgramInterstitial(); } catch (e) {}
                try {
                    const r = await this.fetchFromServer('/api/claim-promo-code', { code: code.toUpperCase() });
                    if (!r.error && r.user) {
                        this.gramBalance = r.user.gram_balance || 0;
                        this.miningBalance = r.user.mining_balance || 0;
                        this.updateHeaderBalances();
                        this.setPromoCooldown();
                        this.showNotification('Reward Claimed', r.reward, 'success');
                        this.vibrate('success');
                        promoInput.value = '';
                    } else {
                        this.showNotification('Error', r.error || 'Failed', 'error');
                        this.vibrate('error');
                    }
                } catch (e) {
                    this.showNotification('Error', 'Network error', 'error');
                }
                promoSubmit.disabled = true;
                promoSubmit.classList.remove('active');
                promoSubmit.innerHTML = this.t('claim');
            });
        }
    }

    showAddCommunityTaskModal() {
        const modal = document.getElementById('add-community-task-modal');
        if (!modal) return;
        modal.style.display = 'flex';

        const nameInput = document.getElementById('community-task-name');
        const linkInput = document.getElementById('community-task-link');
        const totalCustom = document.getElementById('community-task-total-custom');
        const verificationNote = document.getElementById('community-verification-note');
        const totalCostDisplay = document.getElementById('community-total-cost-display');

        let selectedTotal = 100;
        let selectedVerification = 'no';

        const updateTotalCost = () => {
            const pricePer100 = this.config.PRICE_PER_100 || 0.10;
            const cost = (selectedTotal / 100) * pricePer100;
            if (totalCostDisplay) totalCostDisplay.textContent = cost.toFixed(2) + ' GRAM';
        };

        document.querySelectorAll('#add-community-task-modal .total-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#add-community-task-modal .total-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                if (btn.dataset.value === 'custom') {
                    totalCustom.style.display = 'block';
                    totalCustom.value = '';
                    selectedTotal = parseInt(totalCustom.value) || 0;
                } else {
                    totalCustom.style.display = 'none';
                    selectedTotal = parseInt(btn.dataset.value);
                }
                updateTotalCost();
            });
        });

        totalCustom.addEventListener('input', () => {
            selectedTotal = parseInt(totalCustom.value) || 0;
            updateTotalCost();
        });

        document.querySelectorAll('#add-community-task-modal .verif-option').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('#add-community-task-modal .verif-option').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedVerification = btn.dataset.value;
                if (selectedVerification === 'yes' && linkInput.value.trim().startsWith('https://t.me/')) verificationNote.style.display = 'inline';
                else verificationNote.style.display = 'none';
            });
        });

        linkInput.addEventListener('input', () => {
            const val = linkInput.value.trim();
            if (val.startsWith('https://') && !val.startsWith('https://t.me/')) {
                selectedVerification = 'no';
                document.querySelectorAll('#add-community-task-modal .verif-option').forEach(b => b.classList.remove('active'));
                document.querySelector('#add-community-task-modal .verif-option[data-value="no"]')?.classList.add('active');
                verificationNote.style.display = 'none';
            }
        });

        document.querySelector('#add-community-task-modal .total-option[data-value="100"]')?.classList.add('active');
        document.querySelector('#add-community-task-modal .verif-option[data-value="no"]')?.classList.add('active');
        updateTotalCost();

        const payBtn = document.getElementById('pay-add-community-task-btn');
        if (payBtn) {
            payBtn.replaceWith(payBtn.cloneNode(true));
            const newPayBtn = document.getElementById('pay-add-community-task-btn');
            newPayBtn.addEventListener('click', async () => {
                const name = nameInput.value.trim();
                const link = linkInput.value.trim();
                if (name.length < 5 || name.length > 20) { this.showNotification('Error', this.t('name_required'), 'error'); this.vibrate('error'); return; }
                if (!link.startsWith('https://')) { this.showNotification('Error', this.t('link_required'), 'error'); this.vibrate('error'); return; }
                if (selectedTotal < 100 || selectedTotal > 5000) { this.showNotification('Error', this.t('invalid_total'), 'error'); this.vibrate('error'); return; }
                if (selectedVerification === 'yes' && link.startsWith('https://t.me/')) {
                    const channelMatch = link.match(/t\.me\/([^\/\?]+)/);
                    if (channelMatch) {
                        try {
                            const checkResult = await this.fetchFromServer('/api/check-bot-admin', { channel: channelMatch[1] });
                            if (!checkResult.isAdmin) { this.showNotification('Error', 'Bot not admin', 'error'); this.vibrate('error'); return; }
                        } catch (error) { return; }
                    }
                }
                this.pendingTaskData = { name, link, total: selectedTotal, reward: 0.002, verification: selectedVerification === 'yes' };
                modal.style.display = 'none';
                this.showPaymentModal();
            });
        }
    }

    showPaymentModal() {
        const modal = document.getElementById('payment-modal');
        if (!modal || !this.pendingTaskData) return;
        const userId = this.tgUser.id;
        const wallet = this.config.PAYMENT_WALLET || this.config.TON_WALLET_ADDRESS;
        const walletDisplay = wallet.length > 12 ? wallet.substring(0, 10) + '.....' + wallet.substring(wallet.length - 10) : wallet;
        const storageKey = 'pending_memo_community';
        let memo = localStorage.getItem(storageKey);
        if (!memo) { memo = this.generateShortMemo('task', userId); localStorage.setItem(storageKey, memo); }
        const amount = (this.pendingTaskData.total / 100) * (this.config.PRICE_PER_100 || 0.10);

        const walletDisplayEl = document.getElementById('payment-wallet-display');
        const memoDisplay = document.getElementById('payment-memo-display');
        const amountDisplay = document.getElementById('payment-amount-display');
        const tonkeeperLink = document.getElementById('tonkeeper-link');
        const statusEl = document.getElementById('payment-status');

        if (walletDisplayEl) { walletDisplayEl.querySelector('span').textContent = walletDisplay; walletDisplayEl.onclick = () => this.copyToClipboard(wallet); }
        if (memoDisplay) { memoDisplay.querySelector('span').textContent = memo; memoDisplay.onclick = () => this.copyToClipboard(memo); }
        if (amountDisplay) { amountDisplay.querySelector('span').textContent = amount.toFixed(2) + ' GRAM'; amountDisplay.onclick = () => this.copyToClipboard(amount.toFixed(2) + ' GRAM'); }
        if (tonkeeperLink) tonkeeperLink.href = `https://app.tonkeeper.com/transfer/${wallet}?text=${encodeURIComponent(memo)}`;
        if (statusEl) statusEl.textContent = '';
        modal.style.display = 'flex';

        const checkBtn = document.getElementById('check-payment-btn');
        if (checkBtn) {
            checkBtn.replaceWith(checkBtn.cloneNode(true));
            const newCheckBtn = document.getElementById('check-payment-btn');
            newCheckBtn.addEventListener('click', async () => {
                if (statusEl) { statusEl.textContent = this.t('payment_checking'); statusEl.style.color = '#00AFFF'; }
                try {
                    const result = await this.fetchFromServer('/api/check-payment', { memo, amount, taskData: this.pendingTaskData });
                    if (result.success) {
                        localStorage.removeItem('pending_memo_community');
                        if (statusEl) { statusEl.textContent = this.t('payment_verified'); statusEl.style.color = '#2ecc71'; }
                        this.showNotification(this.t('task_added'), this.t('task_added_success'), 'success');
                        this.vibrate('success');
                        this.pendingTaskData = null;
                        setTimeout(() => { modal.style.display = 'none'; this.renderEarn(); }, 1500);
                    } else {
                        if (statusEl) { statusEl.textContent = result.error || this.t('payment_failed'); statusEl.style.color = '#e74c3c'; }
                        this.vibrate('error');
                    }
                } catch (error) {
                    if (statusEl) { statusEl.textContent = this.t('payment_error'); statusEl.style.color = '#e74c3c'; }
                    this.vibrate('error');
                }
            });
        }
    }

    showMyTasksModal() {
        const modal = document.getElementById('my-tasks-modal');
        if (!modal) return;
        modal.style.display = 'flex';
        this.renderMyTasks();
        this.loadMyTasks().then(() => this.renderMyTasks());
    }

    renderMyTasks() {
        const container = document.getElementById('my-tasks-container');
        if (!container) return;
        if (this.myCommunityTasks.length === 0) {
            container.innerHTML = `<div class="no-data"><i class="fas fa-tasks"></i><p>${this.t('no_my_tasks')}</p></div>`;
            return;
        }
        container.innerHTML = this.myCommunityTasks.map(task => {
            const statusText = task.status === 'active' ? 'Active' : 'Completed';
            const statusClass = task.status === 'active' ? 'active' : 'completed';
            return `
                <div class="my-task-item">
                    <h4 class="my-task-name">${task.name}</h4>
                    <div class="my-task-info">
                        <div class="my-task-stat"><i class="fas fa-check-circle"></i> ${task.total_completed || 0}/${task.total}</div>
                        <span class="task-status ${statusClass}">${statusText}</span>
                    </div>
                    <button class="my-task-delete" data-id="${task.id}"><i class="fas fa-trash"></i> ${this.t('delete')}</button>
                </div>
            `;
        }).join('');
        container.querySelectorAll('.my-task-delete').forEach(btn => {
            btn.addEventListener('click', async () => {
                if (confirm(this.t('confirm_delete'))) {
                    const success = await this.deleteMyTask(btn.dataset.id);
                    if (success) this.renderMyTasks();
                }
            });
        });
    }

    renderTeam() {
        const el = document.getElementById('team-page');
        if (!el) return;
        const link = (this.config.BOT_LINK || 'https://t.me/GramHtrsbot/app?startapp=') + this.tgUser.id;
        const referralAmount = this.config.REFERRAL_REWARD_GRAM || 0.05;

        el.innerHTML = `
            <div class="page-title">
                <h2>${this.t('invite_earn')}</h2>
                <p>${this.t('invite_earn_sub')}</p>
            </div>

            <div class="team-card blue-card">
                <div class="referral-rows">
                    <div class="referral-row">
                        <div class="referral-row-icon"><i class="fas fa-user-plus"></i></div>
                        <div class="referral-row-info">
                            <div class="referral-row-label">${this.t('earn_referral_each_label')}</div>
                            <div class="referral-row-value">${this.t('earn_referral_each', { amount: this.formatGram2(referralAmount) })}</div>
                        </div>
                    </div>
                    <div class="referral-row">
                        <div class="referral-row-icon"><i class="fas fa-tasks"></i></div>
                        <div class="referral-row-info">
                            <div class="referral-row-label">${this.t('earn_referral_tasks_label')}</div>
                            <div class="referral-row-value">${this.t('earn_referral_tasks')}</div>
                        </div>
                    </div>
                    <div class="referral-row">
                        <div class="referral-row-icon"><i class="fas fa-hard-hat"></i></div>
                        <div class="referral-row-info">
                            <div class="referral-row-label">${this.t('earn_referral_mining_label')}</div>
                            <div class="referral-row-value">${this.t('earn_referral_mining')}</div>
                        </div>
                    </div>
                </div>

                <div class="referral-link-section">
                    <div class="referral-link-title"><i class="fas fa-link"></i> ${this.t('referral_link_title')}</div>
                    <div class="team-link-box">${link}</div>
                    <button id="copyLink" class="copy-btn"><i class="fas fa-copy"></i> ${this.t('copy_link')}</button>
                    <button id="share-btn" class="copy-btn" style="margin-top:10px;">
                    <i class="fas fa-share-alt"></i> ${this.t('share_friends')}</button>
                </div>
            </div>

            <div class="earning-card">
                <div class="earning-left">
                    <div class="earning-icon"><img src="${this.config.MINING_BALANCE_ICON}"></div>
                    <div class="earning-value-container">
                        <span class="earning-label-small">${this.t('gram_earnings')}</span>
                        <span class="earning-value">${this.formatGram8(this.referralGramEarnings)}</span>
                    </div>
                </div>
                <button id="claim-gram-earnings" class="claim-btn" ${this.referralGramEarnings < 0.001 ? 'disabled' : ''}>${this.t('claim')}</button>
            </div>

            <div class="team-stats-grid">
                <div class="team-stat-card">
                    <div class="stat-number">${this.totalReferrals}</div>
                    <div class="stat-label">${this.t('total_referrals')}</div>
                </div>
                <div class="team-stat-card">
                    <div class="stat-number">${this.verifiedReferrals}</div>
                    <div class="stat-label">${this.t('verified_referrals')}</div>
                </div>
            </div>
        `;

        document.getElementById('copyLink')?.addEventListener('click', () => {
            navigator.clipboard.writeText(link);
            this.showNotification(this.t('copy_success'), this.t('link_copied'), 'success');
            this.vibrate('success');
        });
        document.getElementById('share-btn')?.addEventListener('click', () => this.shareGramHunters());
        document.getElementById('claim-gram-earnings')?.addEventListener('click', async () => {
            await this.claimReferralEarnings();
            this.renderTeam();
        });
    }

    renderWallet() {
        const el = document.getElementById('wallet-page');
        if (!el) return;
        const minWithdrawGram = this.config.MINIMUM_WITHDRAW || 0.5;
        const conditions = this.config.WITHDRAW_CONDITIONS || {};

        let conditionsHtml = '';
        const conditionItems = [];
        if (conditions.min_referrals > 0) {
            const met = (this.verifiedReferrals || 0) >= conditions.min_referrals;
            conditionItems.push(`<div class="condition-item"><i class="fas ${met ? 'fa-check-circle' : 'fa-times-circle'}"></i><span class="condition-text ${met ? 'met' : ''}">${this.t('get_x_referrals', { x: conditions.min_referrals })} (${this.verifiedReferrals || 0}/${conditions.min_referrals})</span></div>`);
        }
        if (conditions.min_tasks > 0) {
            const met = (this.totalTasksCompleted || 0) >= conditions.min_tasks;
            conditionItems.push(`<div class="condition-item"><i class="fas ${met ? 'fa-check-circle' : 'fa-times-circle'}"></i><span class="condition-text ${met ? 'met' : ''}">${this.t('complete_x_tasks', { x: conditions.min_tasks })} (${this.totalTasksCompleted || 0}/${conditions.min_tasks})</span></div>`);
        }
        if (conditions.min_mining_starts > 0) {
            const met = (this.totalMiningStarts || 0) >= conditions.min_mining_starts;
            conditionItems.push(`<div class="condition-item"><i class="fas ${met ? 'fa-check-circle' : 'fa-times-circle'}"></i><span class="condition-text ${met ? 'met' : ''}">${this.t('start_miner_x_times', { x: conditions.min_mining_starts })} (${this.totalMiningStarts || 0}/${conditions.min_mining_starts})</span></div>`);
        }
        if (conditionItems.length > 0) {
            conditionsHtml = `
                <div class="conditions-card">
                    <h4><i class="fas fa-shield-alt"></i> ${this.t('withdrawal_conditions')}</h4>
                    ${conditionItems.join('')}
                </div>
            `;
        }

        el.innerHTML = `
            <div class="live-channel-card blue-card">
                <div class="live-channel-title"><i class="fas fa-bullhorn"></i> ${this.t('live_channel_title')}</div>
                <div class="live-channel-desc">${this.t('live_channel_desc')}</div>
                <a href="${this.config.LIVE_PAYMENTS_CHANNEL || 'https://t.me/Hunters_Proof'}" target="_blank" class="live-channel-btn">
                    <i class="fab fa-telegram"></i> ${this.t('join_channel')}
                </a>
            </div>

            <div class="stat-card">
                <div class="stat-card-icon"><img src="${this.config.MINING_BALANCE_ICON}"></div>
                <div class="stat-card-info">
                    <div class="stat-card-label">${this.t('withdrawable_balance')}</div>
                    <div class="stat-card-value">${this.formatGram8(this.withdrawableBalance)}</div>
                </div>
            </div>

            <div class="stat-card">
                <div class="stat-card-icon"><img src="${this.config.GRAM_ICON}"></div>
                <div class="stat-card-info">
                    <div class="stat-card-label">${this.t('mining_balance')}</div>
                    <div class="stat-card-value">${this.formatGram8(this.miningBalance)}</div>
                </div>
            </div>

            ${conditionsHtml}

            <div class="withdraw-card blue-card">
                <h4 style="text-align:center; color:var(--neon-cyan); margin-bottom:14px; font-weight:800;">
                    <i class="fas fa-arrow-up"></i> ${this.t('withdraw_gram')}
                </h4>
                <div class="form-group">
                    <label class="form-label"><i class="fas fa-coins"></i> ${this.t('withdrawal_amount')}</label>
                    <div class="input-wrapper">
                        <input type="number" id="withdraw-amount" class="form-input blue-input" placeholder="${this.t('withdrawal_amount')}" step="0.00000001">
                        <button id="max-amount" class="action-btn">MAX</button>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label"><i class="fas fa-wallet"></i> ${this.t('gram_wallet')}</label>
                    <input type="text" id="withdraw-wallet" class="form-input blue-input" placeholder="${this.t('gram_wallet')}" autocomplete="off">
                </div>
                <button id="withdraw-btn" class="withdraw-confirm-btn" disabled>${this.t('confirm_withdrawal')}</button>
                <div class="withdraw-note">
                    <i class="fas fa-info-circle"></i> ${this.t('min_withdraw_note', { amount: minWithdrawGram })}
                </div>
            </div>

            <div class="section-header blue-header"><h3><i class="fas fa-history"></i> ${this.t('payments_history')}</h3></div>

            <div class="history-tabs">
                <button class="history-tab active" data-tab="my">${this.t('my_payments')}</button>
                <button class="history-tab" data-tab="live">${this.t('live_payments')}</button>
            </div>

            <div id="history-content"></div>
        `;

        this._historyTab = 'my';
        this.renderHistoryContent();
        this.attachWithdrawHandlers();

        document.querySelectorAll('.history-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this._historyTab = tab.dataset.tab;
                if (this._historyTab === 'live') this.loadLivePayments();
                else this.renderHistoryContent();
            });
        });
    }

    renderHistoryContent() {
        const container = document.getElementById('history-content');
        if (!container) return;

        if (this._historyTab === 'my') {
            if (!this.withdrawals || !this.withdrawals.length) {
                container.innerHTML = `<div class="no-data">${this.t('no_withdrawals')}</div>`;
                return;
            }
            container.innerHTML = this.withdrawals.slice(0, 20).map(w => {
                const statusClass = w.status || 'pending';
                const statusText = statusClass === 'completed' ? this.t('completed') : (statusClass === 'processing' ? this.t('processing') : (statusClass === 'failed' ? this.t('failed') : this.t('pending')));
                const explorerLink = w.tx_hash ? `<a href="https://tonscan.org/tx/${w.tx_hash}" target="_blank" class="history-card-view"><i class="fas fa-arrow-up-right-from-square"></i> ${this.t('view_on_explorer')}</a>` : '';
                return `
                    <div class="history-card">
                        <div class="history-card-body">
                            <div class="history-card-header">
                                <div class="history-card-amount">${this.formatGram4(w.gram_amount || 0)}</div>
                                <span class="history-card-status ${statusClass}">${statusText}</span>
                            </div>
                            <div class="history-card-wallet">${this.maskWallet(w.wallet)}</div>
                            <div class="history-card-date">${this.formatTimeAgo(w.timestamp)}</div>
                        </div>
                        ${explorerLink}
                    </div>
                `;
            }).join('');
        } else {
            if (!this.liveWithdrawals || !this.liveWithdrawals.length) {
                container.innerHTML = `<div class="no-data"><i class="fas fa-inbox"></i><p>${this.t('no_live_payments')}</p></div>`;
                return;
            }
            container.innerHTML = this.liveWithdrawals.map(w => {
                const statusClass = w.status || 'pending';
                const statusText = statusClass === 'completed' ? this.t('completed') : (statusClass === 'processing' ? this.t('processing') : (statusClass === 'failed' ? this.t('failed') : this.t('pending')));
                const explorerLink = w.tx_hash ? `<a href="https://tonscan.org/tx/${w.tx_hash}" target="_blank" class="history-card-view"><i class="fas fa-arrow-up-right-from-square"></i> ${this.t('view_on_explorer')}</a>` : '';
                const avatar = w.user_photo || this.config.DEFAULT_USER_AVATAR;
                const displayName = this.truncateName20(w.user_name || 'User');
                return `
                    <div class="history-card">
                        <img src="${avatar}" class="history-card-avatar" onerror="this.src='${this.config.DEFAULT_USER_AVATAR}'">
                        <div class="history-card-body">
                            <div class="history-card-header">
                                <div class="history-card-name">${displayName}</div>
                                <div class="history-card-amount">(${this.formatGram3(w.gram_amount || 0)})</div>
                            </div>
                            <div class="history-card-wallet">${this.maskWallet(w.wallet)}</div>
                            <div class="history-card-date">${this.formatTimeAgo(w.timestamp)}</div>
                        </div>
                        ${explorerLink}
                    </div>
                `;
            }).join('');
        }
    }

    async loadLivePayments() {
        const container = document.getElementById('history-content');
        if (container) container.innerHTML = '<div class="task-loading"><i class="fas fa-spinner fa-pulse"></i><p>Loading...</p></div>';
        try {
            const result = await this.fetchFromServer('/api/get-live-withdrawals', {});
            if (result.withdrawals) {
                this.liveWithdrawals = result.withdrawals;
                this.renderHistoryContent();
            } else {
                this.liveWithdrawals = [];
                this.renderHistoryContent();
            }
        } catch (error) {
            this.liveWithdrawals = [];
            this.renderHistoryContent();
        }
    }

    attachWithdrawHandlers() {
        const amountInput = document.getElementById('withdraw-amount');
        const walletInput = document.getElementById('withdraw-wallet');
        const withdrawBtn = document.getElementById('withdraw-btn');
        const maxBtn = document.getElementById('max-amount');

        const updateBtnState = () => {
            const amount = parseFloat(amountInput?.value);
            const wallet = walletInput?.value.trim();
            const isValid = amount > 0 && wallet && wallet.startsWith('UQ') && wallet.length >= 20;
            if (withdrawBtn) withdrawBtn.disabled = !isValid;
        };

        maxBtn?.addEventListener('click', () => {
            if (amountInput) {
                amountInput.value = this.withdrawableBalance.toFixed(8);
                updateBtnState();
            }
        });
        amountInput?.addEventListener('input', updateBtnState);
        walletInput?.addEventListener('input', updateBtnState);

        withdrawBtn?.addEventListener('click', async () => {
            const amount = parseFloat(amountInput.value);
            const wallet = walletInput.value.trim();

            if (!amount || amount <= 0) { this.showNotification('Error', this.t('invalid_amount'), 'error'); this.vibrate('error'); return; }
            if (!wallet || !wallet.startsWith('UQ') || wallet.length < 20) { this.showNotification('Error', this.t('wallet_invalid'), 'error'); this.vibrate('error'); return; }
            if (amount > this.withdrawableBalance) { this.showNotification('Error', this.t('insufficient_balance'), 'error'); this.vibrate('error'); return; }
            if (amount < (this.config.MINIMUM_WITHDRAW || 0.5)) { this.showNotification('Error', this.t('min_withdraw_note', { amount: this.config.MINIMUM_WITHDRAW || 0.5 }), 'error'); this.vibrate('error'); return; }

            await this.processWithdrawal(amount, wallet);
        });
    }

    async processWithdrawal(coinAmount, wallet) {
        if (this._withdrawLock) { this.showNotification('Please wait', 'Try again in 10s', 'warning'); this.vibrate('warning'); return; }
        this._withdrawLock = true;
        setTimeout(() => { this._withdrawLock = false; }, 10000);

        const withdrawBtn = document.getElementById('withdraw-btn');
        if (withdrawBtn) { withdrawBtn.disabled = true; withdrawBtn.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Sending...'; }

        try {
            const result = await this.fetchFromServer('/api/withdraw-gram', { coinAmount, walletAddress: wallet });
            if (result.error) {
                this.showNotification('Error', result.error, 'error');
                this.vibrate('error');
                if (withdrawBtn) { withdrawBtn.disabled = false; withdrawBtn.innerHTML = this.t('confirm_withdrawal'); }
                this._withdrawLock = false;
                return;
            }
            if (result.user) {
                this.gramBalance = result.user.gram_balance || 0;
                this.withdrawableBalance = result.user.withdrawable_balance || 0;
                this.updateHeaderBalances();
            }
            this.showNotification('Withdrawn!', `${this.formatGram4(result.gramAmount)} GRAM sent`, 'success');
            this.vibrate('success');
            this.withdrawals.unshift(result.withdrawal);
            if (this._walletLoaded) this.renderWallet();
            this._withdrawLock = false;
        } catch (error) {
            if (withdrawBtn) { withdrawBtn.disabled = false; withdrawBtn.innerHTML = this.t('confirm_withdrawal'); }
            this._withdrawLock = false;
        }
    }

    setupNavigation() {
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
                const id = btn.dataset.page;
                document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.getElementById(id)?.classList.add('active');

                if (id === 'mining-page') this.renderMining();
                else if (id === 'earn-page') { this._earnLoaded = true; this._activeTaskTab = 'community'; this.renderEarn(); }
                else if (id === 'team-page') { this._teamLoaded = true; this.renderTeam(); }
                else if (id === 'wallet-page') { this._walletLoaded = true; this.renderWallet(); }
            });
        });
    }

    setupEventListeners() {
        const langBtn = document.getElementById('lang-btn');
        const langModal = document.getElementById('lang-modal');

        langBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            langModal.style.display = 'flex';
        });

        langModal?.addEventListener('click', (e) => {
            if (e.target === langModal) langModal.style.display = 'none';
        });

        document.querySelectorAll('.lang-option').forEach(opt => {
            opt.addEventListener('click', () => {
                this.lang = opt.dataset.lang;
                const settings = JSON.parse(localStorage.getItem('hunter_settings') || '{}');
                settings.lang = this.lang;
                localStorage.setItem('hunter_settings', JSON.stringify(settings));
                langModal.style.display = 'none';
                this.updateLangFlag();
                this.renderMining();
                if (this._earnLoaded) this.renderEarn();
                if (this._teamLoaded) this.renderTeam();
                if (this._walletLoaded) this.renderWallet();
                this.updateHeaderBalances();
                this.showNotification(this.t('language_changed'), '', 'success');
                this.vibrate('success');
            });
        });
    }

    async initialize() {
        try {
            if (!window.Telegram?.WebApp) {
                document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#020824;color:#00AFFF;font-family:sans-serif;text-align:center;padding:20px;">Open from Telegram only</div>';
                return;
            }
            this.tg = window.Telegram.WebApp;

            if (!this.tg.initData) {
                document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#020824;color:#00AFFF;font-family:sans-serif;text-align:center;padding:20px;">Invalid session.<br>Please open from Telegram.</div>';
                return;
            }

            this.tgUser = this.tg.initDataUnsafe?.user;
            if (!this.tgUser) {
                document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#020824;color:#00AFFF;font-family:sans-serif;text-align:center;padding:20px;">Invalid session.<br>Please open from Telegram.</div>';
                return;
            }

            try {
                const fp = await FingerprintJS.load();
                const result = await fp.get();
                this.visitorId = result.visitorId;
            } catch (e) {
                this.visitorId = null;
            }

            this.tg.ready();
            this.tg.expand();

            const startParam = this.tg.initDataUnsafe?.start_param;
            if (startParam && !isNaN(startParam) && parseInt(startParam) !== this.tgUser.id) this.referredBy = parseInt(startParam);

            try { await this.getConfig(); } catch (e) { console.error('Config error:', e); }
            try { await this.getServerTime(); } catch (e) { console.error('ServerTime error:', e); }
            try { await this.loadUserData(); } catch (e) { console.error('UserData error:', e); }
            this.startServerTimeSync();

            if (this.userState === 'ban') { this.showBanModal(); return; }
            if (!this.isAuthenticated) return;

            try { this.setupEventListeners(); } catch (e) { console.error('EventListeners error:', e); }
            try { this.renderMining(); } catch (e) { console.error('RenderMining error:', e); }
            try { this.setupNavigation(); } catch (e) { console.error('Navigation error:', e); }

            if (this.miningActive && this.miningEndTime) {
                const currentTime = this.getCurrentTime();
                if (currentTime >= this.miningEndTime) await this.stopMining();
                else this.startMiningLoop();
            }

            this.startAdCycle();
            
        } catch (err) {
            console.error('Init error:', err);
            try { this.setupEventListeners(); } catch (e) {}
            try { this.setupNavigation(); } catch (e) {}
            try { this.renderMining(); } catch (e) {}
            document.getElementById('app-loader').style.display = 'none';
            document.getElementById('app').style.display = 'block';
        }
    }
    
    startAdCycle() {
        if (this._adCycleInterval) clearInterval(this._adCycleInterval);
        setTimeout(async () => {
            if (typeof window.Adsgram?.init !== 'function') return;
            try { await this.showAdsgramInterstitial(); } catch (e) {}
        }, 5000);
        this._adCycleInterval = setInterval(async () => {
            if (document.hidden) return;
            if (typeof window.Adsgram?.init !== 'function') return;
            try { await this.showAdsgramInterstitial(); } catch (e) {}
        }, 120000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (!window.Telegram?.WebApp) {
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#020824;color:#00AFFF;font-family:sans-serif;">Open from Telegram Mini App</div>';
        return;
    }
    window.app = new App();
    window.app.initialize();
});
