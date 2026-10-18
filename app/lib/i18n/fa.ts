/**
 * Persian (fa) UI strings.
 *
 * The site is being migrated to Persian one feature at a time, so every
 * translation lives here instead of inline literals — later phases just append
 * their own section to this object. Keep values as literal strings (`as const`)
 * so they stay usable directly as React children.
 *
 * Strings containing a runtime value use a `{placeholder}` token and are
 * substituted at render time (see the `replace` calls in the components).
 *
 * NOTE: some Persian words use a ZWNJ (U+200C) for correct joining
 * (e.g. "ثبت‌نام"). Keep it — a hyphen or plain space changes the rendering.
 * This file must stay UTF-8 encoded.
 */

import type { Permission } from "@/app/lib/permissions"
import type { OrderStatus, TradeOfferStatus } from "@/app/contracts/panel"

/**
 * Category directory name -> the word users see, in both the singular form a
 * filter chip needs ("چاقو") and nothing else.
 *
 * Keys are the directory names under public/images/weapons-real/skins, so they
 * must stay in sync with GET /api/categories. This is a module-level const
 * rather than a key inside `fa` so that the home page, the info pages and the
 * footer can all reference one map - nesting it under `fa.home` forced every
 * other surface to reach into the home namespace for a shared word.
 */
export const CATEGORY_LABELS: Record<string, string> = {
   knife: "چاقو",
   gloves: "دستکش",
   pistol: "کلت",
   rifle: "تفنگ",
   sniper: "تیرانداز",
   smg: "تفنگ کوتاه",
   shotgun: "شاتگان",
   machinegun: "مسلسل سنگین",
   agent: "ایجنت",
   case: "کیس",
   music_kit: "کیت موزیک",
   other: "سایر",
}

/**
 * The four brand promises: authenticity, honest pricing, fast delivery, real
 * support.
 *
 * Module-level for the same reason as CATEGORY_LABELS. These used to live only
 * at `fa.home.features`, which meant any other page that wanted to state the
 * same promises had to either reach into the home namespace or write a second
 * copy of the paragraphs and let the two drift.
 */
const FEATURE_ITEMS = {
   authentic: {
      title: "اصالت تضمین‌شده",
      body: "هر اسکین پیش از انتشار توسط کارشناسان بررسی و تأیید اصالت می‌شود.",
   },
   fairPrice: {
      title: "قیمت منصفانه",
      body: "نرخ‌ها شفاف و بدون کارمزد پنهان است؛ همان چیزی که در صفحه محصول می‌بینید.",
   },
   instantDelivery: {
      title: "تحویل آنی",
      body: "پس از پرداخت، اسکین در کمترین زمان به حساب شما منتقل می‌شود.",
   },
   support: {
      title: "پشتیبانی ۲۴ ساعته",
      body: "تیم پشتیبانی همیشه آماده پاسخ‌گویی به پرسش‌های شماست.",
   },
}

export const fa = {
   /** 404 pages — rendered by not-found.tsx and global-not-found.tsx. */
   notFound: {
      code: "خطای ۴۰۴",
      title: "صفحه مورد نظر پیدا نشد",
      description: "ممکن است آدرس را اشتباه وارد کرده باشید یا این صفحه جابه‌جا شده باشد. از اینجا می‌توانید به خانه یا فروشگاه برگردید.",
      backHome: "بازگشت به خانه",
      browseShop: "مشاهده فروشگاه",
      metaTitle: "صفحه پیدا نشد",
      metaDescription: "صفحه‌ای که به دنبال آن بودید وجود ندارد یا جابه‌جا شده است.",
   },

   nav: {
      home: "صفحه اصلی",
      products: "محصولات",
      Tf2Keys: "کلید TF2",
      prime: "پرایم Cs2",
      panel: "پنل",
      myPanel: "پنل من",
      admin: "مدیریت",
      adminDashboard: "داشبورد مدیریت",
      about: "درباره ما",
      contact: "تماس با ما",
   },
   header: {
      brand: "بیا استور",
      openMenu: "باز کردن منو",
      closeMenu: "بستن منو",
      openUserMenu: "باز کردن منوی کاربر",
      fallbackUserName: "کاربر",
      /** The cart badge in the header. */
      openCart: "سبد خرید",
      /** `{count}` is filled with how many units are in the cart. */
      cartCount: "{count} قلم در سبد خرید",
      cartEmpty: "سبد خرید خالی است",
   },
   /** Shared auth button labels used by the header and the user menu. */
   auth: {
      login: "ورود",
      signup: "ثبت‌نام",
      logout: "خروج",
   },
   /** The header's two shop links. Both are real routes now. */
   links: {
      orders: "سفارش‌ها",
      cart: "سبد خرید",
   },

   /**
    * Auth pages: /login, /register and /login/verify.
    * Mirrors the strings in app/(myPages)/(auth) and app/components/auth.
    */
   authPages: {
      /**
       * The Steam hand-off. Shown instead of the phone form once the backend
       * reports AUTH_PROVIDER=steam.
       *
       * There is deliberately no error copy here: Steam reports its own
       * refusals on its own screen, and this page only has two jobs - offer the
       * button, and be honest about what happens when they press it.
       */
      steam: {
         subtitle: "برای ورود، با حساب استیم خود ادامه دهید.",
         signupSubtitle: "حساب شما در اولین ورود با استیم، خودکار ساخته می‌شود.",
         signInCta: "ورود با استیم",
         linkCta: "اتصال حساب استیم",
         linkIntro: "حساب {name} به استیم متصل می‌شود و سفارش‌ها و موجودی شما دست‌نخورده می‌ماند.",
         notReady: "ورود با استیم هنوز پیکربندی نشده است. لطفاً کمی بعد دوباره تلاش کنید.",
         points: [
            "هیچ رمز عبوری وارد نمی‌کنید؛ تأیید روی صفحه خود استیم انجام می‌شود.",
            "اگر قبلاً اینجا عضو شده‌اید، همان حساب شما بازیابی می‌شود.",
            "در اولین ورود، حساب شما به‌صورت خودکار ساخته می‌شود.",
         ],
      },

      // --- <title> / meta description ---
      loginMetaTitle: "ورود",
      loginMetaDescription: "برای ادامه خرید وارد شوید.",
      signupMetaTitle: "ثبت‌نام",
      signupMetaDescription: "حساب بیااستور خود را بسازید.",
      verifyMetaTitle: "تایید شماره موبایل",
      verifyMetaDescription: "کد تایید ارسال‌شده به موبایل خود را وارد کنید.",

      // --- Headings ---
      loginHeading: "خوش آمدید",
      signupHeading: "ایجاد حساب کاربری",
      verifyHeading: "تایید شماره موبایل",

      // --- Subtitles ---
      loginSubtitle: "برای ادامه خرید وارد شوید.",
      signupSubtitle: "در کمترین زمان خرید را شروع کنید.",
      verifySentTo: "کد تایید به {phone} ارسال شد.",
      verifySentHint: "کد تایید ارسال‌شده به موبایل خود را وارد کنید.",

      // --- Already-logged-in state (AuthForm) ---
      welcomeUser: "خوش آمدید، {name}! 🎉",
      loggedInAs: "شما با {phone} وارد شده‌اید",
      logout: "خروج از حساب",

      // --- Form fields (FormBase) ---
      name: "نام",
      namePlaceholder: "مثلاً علی رضایی",
      phone: "شماره موبایل",
      phonePlaceholder: "۰۹۱۲۳۴۵۶۷۸۹",
      submitLogin: "ورود",
      submitSignup: "ثبت‌نام",
      pleaseWait: "لطفاً کمی صبر کنید...",

      // --- Email/password flow (prepared for the commented-out fields in FormBase) ---
      email: "ایمیل",
      emailPlaceholder: "you@example.com",
      password: "گذرواژه",
      passwordPlaceholder: "••••••••",
      confirmPassword: "تکرار گذرواژه",

      // --- Validation messages (Yup schemas) ---
      nameRequired: "نام را وارد کنید",
      nameMin: "نام باید حداقل ۲ نویسه باشد",
      phoneRequired: "شماره موبایل را وارد کنید",
      phoneInvalid: "شماره موبایل نامعتبر است",

      // --- Password flow (prepared for the commented-out fields in FormBase) ---
      passwordMin: "گذرواژه باید حداقل ۸ نویسه باشد",
      passwordUpper: "گذرواژه باید حداقل یک حرف بزرگ داشته باشد",
      passwordNumber: "گذرواژه باید حداقل یک عدد داشته باشد",
      passwordRequired: "گذرواژه را وارد کنید",
      passwordMismatch: "گذرواژه‌ها یکسان نیستند",
      confirmPasswordRequired: "گذرواژه را مجدداً تأیید کنید",

      // --- Request failures ---
      invalidCredentials: "اطلاعات وارد‌شده نامعتبر است. لطفاً دوباره بررسی کنید.",
      genericError: "مشکلی پیش آمده است. لطفاً دوباره تلاش کنید.",

      // --- Verify form (VerifyForm) ---
      verifySubmit: "تایید",
      verifying: "در حال بررسی...",
      digitLabel: "رقم {index}",
      codeRequired: "کد تایید را وارد کنید",
      codeLength: "کد باید ۶ رقم باشد",
      codeDigits: "کد فقط باید شامل ارقام باشد",
      resendPrompt: "کد را دریافت نکردید؟",
      resend: "ارسال مجدد کد",
      sending: "در حال ارسال...",
      backToLogin: "→ بازگشت به ورود",
   },

   /**
    * /panel — the signed-in user's account panel.
    * The welcome card reuses `authPages.welcomeUser` / `loggedInAs` / `logout`,
    * because it renders the same UI as the one in AuthForm.
    */
   panel: {
      metaTitle: "پنل من",
      metaDescription: "پنل شخصی حساب کاربری شما — پروفایل و سفارش‌های خود را مدیریت کنید.",
      loadingTitle: "در حال بارگذاری پنل شما",
      loadingHint: "لطفاً کمی صبر کنید",
      /** «{greeting}، {name}» — resolved on the client after mount. */
      greetingLine: "{greeting}، {name}",
      greeting: {
         morning: "صبح بخیر",
         noon: "ظهر بخیر",
         afternoon: "عصر بخیر",
         evening: "شب بخیر",
      },

      /** Human role for each backend permission enum, shown as the user's identity. */
      roles: {
         FullAcc: "مدیر",
         WriteDeleteEditSelfAdds: "کاربر ویرایشگر",
         ReadOnly: "کاربر مشاهده‌گر",
         NoAccess: "کاربر عادی",
      } satisfies Record<Permission, string>,

      stats: {
         title: "در یک نگاه",
         subtitle: "خلاصه‌ای از وضعیت حساب و فروشگاه",
         ordersLabel: "سفارش",
         ordersHint: "سفارش‌های ثبت‌شده شما",
         balanceLabel: "موجودی",
         balanceHint: "موجودی کیف پول",
         offersLabel: "پیشنهاد معامله",
         offersHint: "در انتظار پاسخ شما",
         categoriesLabel: "دسته‌بندی",
         categoriesHint: "دسته‌بندی فعال",
      },

      actions: {
         title: "دسترسی سریع",
         subtitle: "میان‌برهای پرکاربرد شما",
         comingSoonBadge: "به‌زودی",
         browse: {
            title: "مرور فروشگاه",
            body: "همه پوسته‌ها و محصولات موجود را ببینید و انتخاب کنید.",
            cta: "مشاهده محصولات",
         },
         admin: {
            title: "پنل مدیریت",
            bodyAllowed: "مدیریت محصولات، دسته‌بندی‌ها و کاربران فروشگاه.",
            ctaAllowed: "ورود به مدیریت",
         },
         cart: {
            title: "سبد خرید",
            body: "اقلام انتخابی خود را ببینید و از کیف پول تومانی پرداخت کنید.",
            cta: "مشاهده سبد خرید",
         },
         orders: {
            title: "سفارش‌ها",
            body: "تاریخچه سفارش‌ها، وضعیت تحویل و اقلام هر سفارش.",
            cta: "مشاهده سفارش‌ها",
         },
      },

      profile: {
         title: "اطلاعات حساب",
         subtitle: "این اطلاعات از سرویس حساب کاربری شما خوانده می‌شود.",
         name: "نام و نام خانوادگی",
         phone: "شماره موبایل",
         userId: "شناسه کاربری",
         permission: "سطح دسترسی",
         unknown: "ثبت نشده",
      },

      /** Tab bar labels. */
      tabs: {
         label: "بخش‌های پنل کاربری",
         overview: "نمای کلی",
         orders: "سفارش‌ها",
         offers: "پیشنهادهای معامله",
         wallet: "کیف پول",
         wishlist: "علاقه‌مندی‌ها",
         inventory: "آیتم های من",
         profile: "اطلاعات حساب",
         tickets: "پشتیبانی",
      },

      /** Trade lifecycle, not shipping states. */
      orderStatus: {
         pending_payment: "در انتظار پرداخت",
         in_escrow: "در امانت فروشگاه",
         trade_sent: "پیشنهاد معامله ارسال شد",
         completed: "تکمیل شده",
         disputed: "در حال بررسی",
         refunded: "بازگشت وجه",
         cancelled: "لغو شده",
      } satisfies Record<OrderStatus, string>,

      offerStatus: {
         pending: "در انتظار پاسخ شما",
         accepted: "پذیرفته شده",
         declined: "رد شده",
         cancelled: "لغو شده",
      } satisfies Record<TradeOfferStatus, string>,

      orders: {
         title: "سفارش‌های من",
         subtitle: "سفارش‌های شما به همراه وضعیت معامله و اقلام خریداری‌شده",
         emptyTitle: "هنوز سفارشی ثبت نکرده‌اید",
         emptyBody: "هر زمان خرید کنید، سفارش‌ها و وضعیت معامله‌های شما اینجا نمایش داده می‌شود.",
         emptyCta: "مرور فروشگاه",
         orderNumber: "شماره سفارش",
         placedAt: "تاریخ ثبت",
         total: "مبلغ کل (تومان)",
         items: "اقلام سفارش",
         itemsCount: "{count} قلم",
         allStatuses: "همه سفارش ها",
         status: "وضعیت",
         view: "جزئیات سفارش",

         // --- One order, on its own page ---
         backToOrders: "بازگشت به سفارش‌ها",
         notFoundTitle: "سفارش پیدا نشد",
         notFoundBody: "این سفارش وجود ندارد یا به حساب شما تعلق ندارد.",
         notFoundCta: "مرور سفارش‌ها",
         loadingOrder: "در حال خواندن سفارش…",
         summaryTitle: "خلاصه پرداخت",
         paidFromWallet: "پرداخت از کیف پول",
         deliveryTitle: "تحویل",
         deliveryBody: "تحویل از طریق پیشنهاد معامله استیم انجام می‌شود. پس از ارسال پیشنهاد، وضعیت این سفارش به‌روز می‌شود و می‌توانید آن را در بخش پیشنهادهای معامله بپذیرید.",
         /** `{quantity}` is filled with the multiplier on a service line. */
         quantityBadge: "× {quantity}",
         placedTitle: "سفارش شما ثبت شد",
         placedBody: "مبلغ از کیف پول شما کم شد و سفارش در صف تحویل قرار گرفت. وضعیت را از همین صفحه پیگیری کنید.",
         unitPriceEach: "قیمت واحد",
         itemsTotal: "جمع اقلام",

         /**
          * The customer-facing order tracker: placed -> trade request sent ->
          * delivered. Exception states come as a banner, not a progress step.
          */
         timeline: {
            placed: {
               label: "ثبت سفارش",
               hint: "سفارش شما ثبت شد و در صف تحویل قرار گرفت.",
            },
            tradeSent: {
               label: "ارسال پیشنهاد معامله",
               hint: "فروشگاه پیشنهاد معامله استیم را برای شما فرستاد؛ آن را در بخش «پیشنهادهای معامله» بپذیرید.",
            },
            delivered: {
               label: "تحویل شد",
               hint: "اقلام به حساب شما رسیدند و سفارش تکمیل شد.",
            },
            disputed: {
               title: "سفارش در حال بررسی است",
               body: "پیشنهاد معامله را رد کرده‌اید یا اختلافی ثبت شده است. کارشناسان فروشگاه سفارش شما را بررسی می‌کنند.",
            },
            refunded: {
               title: "وجه سفارش بازگشت داده شد",
               body: "مبلغ این سفارش به کیف پول شما برگشت خورد و سفارش بسته شد.",
            },
            cancelled: {
               title: "سفارش لغو شد",
               body: "این سفارش لغو شد؛ مبلغ پرداختی به کیف پول شما بازگشت و اقلام به فروشگاه بازگشتند.",
            },
         },
      },

      offers: {
         title: "پیشنهادهای معامله",
         subtitle: "پیشنهادهای استیم که باید بپذیرید یا رد کنید",
         incoming: "دریافتی",
         outgoing: "ارسالی",
         accept: "پذیرش",
         decline: "رد کن",
         emptyTitle: "پیشنهاد معامله‌ای ندارید",
         emptyBody: "وقتی فروشگاه برای سفارش شما پیشنهاد معامله استیم بفرستد، اینجا نمایش داده می‌شود.",
         acceptedHint: "پیشنهاد پذیرفته شد و سفارش به‌روزرسانی شد.",
         declinedHint: "پیشنهاد رد شد و سفارش به بررسی رفت.",
         alreadyAnswered: "این پیشنهاد قبلاً پاسخ داده شده است.",
         directionIncoming: "دریافتی از فروشگاه",
         directionOutgoing: "ارسالی توسط شما",
      },

      wallet: {
         title: "کیف پول",
         subtitle: "موجودی و تراکنش‌های حساب شما",
         balance: "موجودی فعلی (تومان)",
         topup: "افزایش موجودی",
         topupDemoHint: "در نسخه نمایشی، افزایش موجودی مستقیماً ثبت می‌شود.",
         topupAmount: "مبلغ افزایش",
         topupSubmit: "ثبت افزایش",
         topupDone: "موجودی به‌روزرسانی شد",
         history: "تاریخچه تراکنش‌ها",
         emptyTitle: "هنوز تراکنشی ندارید",
         emptyBody: "پس از اولین افزایش موجودی یا خرید، تراکنش‌ها اینجا نمایش داده می‌شوند.",
         type: {
            topup: "افزایش موجودی",
            purchase: "خرید",
            refund: "بازگشت وجه",
         },

         // --- Gateway state ---
         gatewayTitle: "درگاه پرداخت",
         gatewayPending: "درگاه پرداخت هنوز متصل نشده است",
         gatewayPendingBody:
            "کد اتصال درگاه نوشته شده اما کلیدهای آن خالی است، پس شارژ مستقیم از درگاه هنوز کار نمی‌کند. تا آن زمان از افزایش موجودی نمایشی استفاده کنید؛ پرداخت سفارش‌ها از کیف پول از همین حالا کار می‌کند.",
         gatewayConnected: "درگاه پرداخت متصل است",
         gatewaySandbox: "درگاه در حالت آزمایشی است",
         gatewayCta: "شارژ از درگاه",
         gatewayRedirecting: "در حال انتقال به درگاه…",
         gatewayFailed: "انتقال به درگاه انجام نشد. لطفاً بعداً دوباره تلاش کنید.",
      },

      wishlist: {
         title: "علاقه‌مندی‌ها",
         subtitle: "محصولات ذخیره‌شده و هشدار کاهش قیمت",
         emptyTitle: "هنوز محصولی ذخیره نکرده‌اید",
         emptyBody: "محصولات را ذخیره کنید تا قیمتشان را دنبال کنید و از کاهش قیمت باخبر شوید.",
         emptyCta: "مرور فروشگاه",
         targetPrice: "قیمت هشدار",
         currentPrice: "قیمت فعلی",
         priceDrop: "کاهش قیمت",
         reached: "به قیمت هدف رسید",
      },

      inventory: {
         title: "آیتم ها",
         subtitle: "اسکین‌ها و آیتم‌های خریداری‌شده شما",
         emptyTitle: "موجودی شما خالی است",
         emptyBody: "پس از تکمیل یک معامله، اقلام خریداری‌شده اینجا نمایش داده می‌شوند.",
         emptyCta: "مرور فروشگاه",
         acquiredAt: "تاریخ دریافت",
         fromOrder: "سفارش #{id}",
         unavailable: "این محصول دیگر در فروشگاه موجود نیست",
      },

      profileEdit: {
         title: "ویرایش اطلاعات حساب",
         subtitle: "برای دریافت اسکین، آدرس معامله استیم باید صحیح باشد.",
         identityTitle: "اطلاعات شخصی",
         steamTitle: "اطلاعات استیم",
         phoneTitle: "شماره موبایل",
         /** The panel's "attach a Steam login to this account" action. */
         steamLinkTitle: "اتصال حساب استیم",
         steamLinkBody: "با اتصال استیم، می‌توانید از این پس با حساب استیم خود وارد شوید. سفارش‌ها و موجودی شما دست‌نخورده باقی می‌ماند.",
         name: "نام و نام خانوادگی",
         namePlaceholder: "نام شما",
         email: "ایمیل",
         emailPlaceholder: "you@example.com",
         emailHint: "برای دریافت اطلاعیه‌های سفارش",
         steamId: "Steam ID",
         steamIdPlaceholder: "STEAM_0:1:12345678",
         tradeUrl: "آدرس معامله استیم",
         tradeUrlPlaceholder: "https://steamcommunity.com/tradeoffer/new/?partner=123456789&token=AbCdEfGh",
         tradeUrlHint: "اسکین‌ها از طریق این آدرس به شما تحویل داده می‌شوند.",
         save: "ذخیره تغییرات",
         identitySave: "ذخیره اطلاعات شخصی",
         steamSave: "ذخیره اطلاعات استیم",
         saving: "در حال ذخیره…",
         saved: "ذخیره شد",
         failed: "ذخیره ناموفق بود",
         invalidField: "مقدار وارد شده معتبر نیست",
         memberSince: "عضو از",
         refresh: "به‌روزرسانی اطلاعات",
         steamReady: "اطلاعات استیم شما کامل است.",
         steamMissing: "اطلاعات استیم ناقص است — دریافت اسکین ممکن نیست.",

         phoneFixedHint: "شماره فعلی حساب شما",
         phoneChange: "تغییر شماره",
         phoneNew: "شماره موبایل جدید",
         phoneNewPlaceholder: "09121234567",
         phoneSendCode: "ارسال کد تأیید",
         phoneSendingCode: "در حال ارسال…",
         phoneCode: "کد تأیید",
         phoneCodePlaceholder: "۶ رقم",
         phoneCodeSent: "کد تأیید ارسال شد — آن را وارد کنید",
         phoneConfirm: "تأیید و تغییر",
         phoneCancel: "انصراف",
         phoneChanged: "شماره موبایل با موفقیت تغییر کرد",
         phoneCodeWrong: "کد تأیید نادرست یا منقضی شده است",
         phoneInUse: "این شماره قبلاً برای حساب دیگری ثبت شده است",
         phoneSame: "این شماره هم‌اکنون شماره حساب شماست",
         phoneInvalid: "شماره موبایل معتبر نیست",
         networkError: "ارتباط با سرور برقرار نشد؛ لطفاً یک بار دیگر تلاش کنید",
      },

      /** Slim identity strip shown on the panel overview. */
      summary: {
         title: "اطلاعات حساب",
         editProfile: "ویرایش پروفایل",
      },

      tickets: {
         title: "پشتیبانی",
         subtitle: "ثبت تیکت و پیگیری درخواست‌ها",
         emptyTitle: "سیستم تیکت به‌زودی راه‌اندازی می‌شود",
         emptyBody: "توسعه سیستم تیکتینگ فعلا زوده، تا آن زمان می‌توانید از طریق پشتیبانی شبکه‌های اجتماعی فروشگاه با ما در تماس باشید.",
      },
   },

   /**
    * /cart — the review-and-pay page.
    *
    * The cart is the mutable, unpaid half of buying: it carries no status and
    * every price on it is read live from the catalogue. The frozen half is an
    * order, which lives under `panel.orders`.
    *
    * A service line carries machine values only (`prime` + `argentina`), so its
    * Persian label comes from `faServiceLabels` at the bottom of this file.
    */
   cart: {
      metaTitle: "سبد خرید",
      metaDescription: "اقلام سبد خرید خود را ببینید، تعداد را تغییر دهید و از کیف پول تومانی پرداخت کنید.",
      title: "سبد خرید",
      subtitle: "پیش از پرداخت، اقلام و مبلغ نهایی را بررسی کنید.",
      loading: "در حال خواندن سبد خرید…",

      emptyTitle: "سبد خرید شما خالی است",
      emptyBody: "هر پوسته یا خدمتی که به سبد اضافه کنید، اینجا برای بررسی و پرداخت نمایش داده می‌شود.",
      emptyCta: "مرور فروشگاه",

      // --- One line ---
      unitPrice: "قیمت واحد",
      lineTotal: "جمع این قلم",
      quantity: "تعداد",
      quantityDecrease: "کاهش تعداد",
      quantityIncrease: "افزایش تعداد",
      quantityInput: "تعداد این قلم",
      /** `{limit}` is filled with the service's own per-order cap. */
      limitHint: "حداکثر {limit} عدد در هر سفارش",
      skinSingleHint: "این پوسته تک‌نسخه است، پس در هر سفارش فقط یک عدد قابل خرید است.",
      /** `{count}` is how many units of this line are still buyable. */
      stockRemaining: "{count} عدد از این مورد باقی مانده",
      remove: "حذف از سبد",
      clearAll: "خالی کردن سبد",

      // --- Counts ---
      linesCount: "{count} قلم",
      unitsSummary: "{count} عدد",

      // --- A line that can no longer be bought ---
      unavailable: {
         sold: "به خریدار دیگری فروخته شد",
         missing: "دیگر در فروشگاه نیست",
         out_of_stock: "موجودی تمام شد",
         hint: "این قلم در مبلغ قابل پرداخت حساب نشده است.",
         /** `{count}` is filled with how many lines are affected. */
         banner: "{count} قلم از سبد شما قابل خرید نیست. برای ادامه، آن‌ها را حذف کنید.",
      },

      // --- Summary ---
      summaryTitle: "صورت‌حساب",
      subtotal: "جمع اقلام",
      payable: "مبلغ قابل پرداخت",
      walletBalance: "موجودی کیف پول",
      balanceAfter: "موجودی پس از پرداخت",
      /** `{amount}` is filled with what is missing. */
      balanceShortfall: "کمبود {amount}",
      balanceInsufficient: "موجودی کافی نیست",

      checkoutCta: "پرداخت از کیف پول",
      checkoutProcessing: "در حال ثبت سفارش…",
      topupCta: "شارژ کیف پول",

      // --- Checkout answers, one per machine code the backend can return ---
      noTradeUrlTitle: "لینک ترید استیم ثبت نشده است",
      noTradeUrlBody: "برای تحویل پوسته و کلید، اول لینک ترید استیم خود را در پنل کاربری ذخیره کنید.",
      noTradeUrlCta: "ثبت لینک ترید",
      phoneRequiredTitle: "شماره موبایل تأیید نشده است",
      phoneRequiredBody: "برای پرداخت، اول شماره موبایل خود را در پنل کاربری ثبت و تأیید کنید.",
      phoneRequiredCta: "ثبت شماره موبایل",
      loginTitle: "برای دیدن سبد خرید وارد شوید",
      loginBody: "سبد خرید به حساب شما گره خورده است، پس بدون ورود قابل نمایش نیست.",
      loginCta: "ورود به حساب",
      /**
       * The signed-out answer of the three add-to-cart buttons. Only the backend can
       * tell whether a customer is signed in - the token sits in an HttpOnly cookie
       * - so this is what a 403 turns into: an invitation, never a redirect. See
       * helpers/cartIntent for the remembered pick these two describe.
       */
      signInToAddHint: "این مورد برای شما نگه داشته شد؛ بعد از ورود، خودکار به سبد خرید اضافه می‌شود.",
      intentRestored: "موردی که انتخاب کرده بودید به سبد خرید اضافه شد.",
      /** `{need}` and `{balance}` are Toman figures. */
      insufficientTitle: "موجودی کیف پول کافی نیست",
      insufficientBody: "برای این سفارش {need} تومان لازم است و موجودی شما {balance} تومان است.",
      soldTitle: "یکی از اقلام فروخته شد",
      soldBody: "یک پوسته از سبد شما به خریدار دیگری فروخته شد. آن را حذف کنید و پرداخت را دوباره انجام دهید.",
      soldOutTitle: "یکی از خدمات تمام شد",
      soldOutBody: "موجودی یکی از خدمات سبد شما در همین فاصله تمام شد. تعداد را کم کنید یا آن قلم را حذف کنید.",
      failedTitle: "پرداخت انجام نشد",
      failedBody: "سفارش ثبت نشد و مبلغی از کیف پول شما کم نشد. می‌توانید دوباره تلاش کنید.",
      netError: "ارتباط با فروشگاه برقرار نشد. اتصال خود را بررسی کنید و دوباره تلاش کنید.",

      /** Payment gateway state, shown beside the wallet balance. */
      gatewayTitle: "درگاه پرداخت",
      gatewayPendingBody: "درگاه پرداخت هنوز متصل نشده است؛ پرداخت سفارش‌ها از کیف پول انجام می‌شود و افزودن موجودی از مسیر آزمایشی فعال است.",
   },

   /**
    * /products and /products/[id] — the storefront catalog.
    * Product titles, descriptions and category names come from the backend and
    * are therefore NOT translated here; only the UI chrome around them is.
    */
   products: {
      metaTitle: "محصولات",
      metaDescription: "کاتالوگ محصولات ما را مرور کنید.",
      detailMetaTitle: "محصول",
      detailMetaDescription: "جزئیات محصول",
      heading: "محصولات",
      heroBadge: "فروشگاه اسکین",
      noProductsFound: "محصولی یافت نشد.",
      emptyHint: "با فیلترهای فعلی محصولی مطابقت ندارد. برای دیدن همه محصولات فیلترها را پاک کنید.",
      emptyClearFilters: "پاک کردن فیلترها",
      /** Fallback when a product has no category assigned. */
      generalCategory: "عمومی",
      view: "مشاهده",
      /** The unit lives in the label so it is not repeated on every card. */
      priceLabel: "تومان",
      relatedTitle: "محصولات پیشنهادی",
      relatedSubtitle: "سایر محصولات همین دسته‌بندی که شاید بپسندید",

      // --- Filter / pagination chrome (split across ProductCategoryFilter and
      // --- ProductPriceFilter; both accept a Partial of this block) ---
      filter: {
         title: "فیلتر محصولات",
         clearAll: "پاک کردن همه",
         selectAll: "انتخاب همه",
         allCategories: "همه",
         minPrice: "از",
         maxPrice: "تا",
         minPricePlaceholder: "مثلاً 100",
         maxPricePlaceholder: "مثلاً 5000",
         search: "جستجو",
         searchPlaceholder: "جستجوی محصول…",
         clearSearch: "پاک کردن جستجو",
         sort: "مرتب‌سازی",
         sortDefault: "پیش‌فرض",
         sortPriceAsc: "ارزان‌ترین",
         sortPriceDesc: "گران‌ترین",
         sortBestSelling: "پرفروش‌ترین",
      },
      pagination: {
         ariaLabel: "صفحه‌بندی",
         showing: "نمایش {start}–{end} از {total} مورد",
         goToPage: "رفتن به صفحه",
         go: "برو",
      },

      // --- Detail page ---
      backToProducts: "بازگشت به محصولات",
      quantity: "تعداد",
      quantityDecrease: "کاهش تعداد",
      quantityIncrease: "افزایش تعداد",
      addToCart: "افزودن به سبد خرید",
      addedToCart: "به سبد خرید اضافه شد!",
      addingToCart: "در حال افزودن…",
      cartCta: "مشاهده سبد خرید",
      addFailed: "افزودن به سبد خرید انجام نشد. لطفاً دوباره تلاش کنید.",
      soldOut: "این پوسته فروخته شده است",
      /** A skin listing is one physical item, so there is no quantity to pick. */
      singleCopy: "تک‌نسخه",
      singleCopyHint: "این پوسته فقط یک نسخه دارد؛ در هر سفارش یک عدد قابل خرید است.",
      /** `{count}` is how many copies of this listing are still buyable. */
      stockRemaining: "{count} عدد موجود",
      /** Shown under the stepper once more than one has been chosen. `{total}` is Toman. */
      lineTotalHint: "جمع {count} عدد: {total} تومان",
      freeShipping: "ارسال رایگان برای سفارش‌های بالای ۵۰ دلار",
      returnPolicy: "سیاست بازگشت ۳۰ روزه",
      /** Heading above the specification blocks on the product page. */
      specsPanelTitle: "مشخصات کامل آیتم",
      specsEyebrow: "برگه اطلاعات",

      /**
       * The specifications panel.
       *
       * Every label here is chosen by `lib/productSpecs.ts` from what the item
       * actually has, so a case shows a collection and a release date and no
       * float meter, while a weapon skin shows all of it. The strings therefore
       * have to stand alone - none of them is written as part of a fixed block.
       */
      specs: {
         identityTitle: "مشخصات آیتم",
         wearTitle: "وضعیت ظاهری",
         provenanceTitle: "نگهداری و منشأ",
         availabilityTitle: "وضعیت فروش",
         /** `{count}` is the figure itself, already Persian-digit by the caller's helper. */
         stock: "موجودی",

         itemNumber: "کد آیتم",
         itemName: "نام آیتم",
         category: "دسته‌بندی",
         subcategory: "زیردسته",

         exterior: "وضعیت",
         floatRange: "بازه فلوت",
         floatValue: "فلوت این نسخه",
         floatHint: "هرچه فلوت کمترتر باشد، ظاهر آیتم نو‌تر است.",

         rarity: "کمیابی",
         collection: "کالکشن",
         releaseDate: "تاریخ انتشار",

         availability: "قابل خرید",
         available: "موجود",
         availableHint: "این نسخه هنوز فروخته نشده است.",
         sold: "فروخته شده",
         soldHint: "این نسخه به سفارش دیگری رسیده و دیگر قابل خرید نیست.",

         stattrak: "استت‌ترک",
         souvenir: "سوتیور",
         stattrakHint: "با قابلیت شمارنده کشتن.",
         souvenirHint: "همراه با مهر یادبود مسابقه.",
      },

      // --- Detail tabs ---
      tabs: {
         description: "توضیحات",
         specifications: "مشخصات",
         shipping: "ارسال",
      },
      descriptionBlurb:
         "این محصول بخشی از مجموعه پریمیوم ماست. با مواد اولیه باکیفیت ساخته شده و برای استفاده روزمره طراحی شده است.",
      detailsLabels: {
         productNumber: "شماره محصول",
         sku: "کد محصول",
         category: "دسته‌بندی",
         price: "تومان",
         created: "تاریخ ایجاد",
      },
      /** Shown when a product has no creation date. */
      noDate: "—",

      // --- Shipping tab ---
      shipping: {
         infoTitle: "اطلاعات ارسال",
         infoBody: "ارسال رایگان برای همه سفارش‌های بالای ۵۰ دلار. سفارش‌ها طی ۱ تا ۲ روز کاری پردازش می‌شوند.",
         estimateTitle: "زمان تحویل تخمینی",
         estimateBody: "۵ تا ۷ روز کاری برای ارسال استاندارد. ارسال اکسپرس هنگام ثبت سفارش در دسترس است.",
         returnsTitle: "بازگشت کالا",
         returnsBody: "سیاست بازگشت ۳۰ روزه. کالا باید در وضعیت اولیه و با برچسب‌های متصل باشد.",
      },
   },

   /** / — the public landing page. */
   home: {
      heroBadge: "بازار اسکین CS:GO",
      heroTitle: "اسکین‌های افسانه‌ای را با اطمینان معامله کنید",
      heroDescription:
         "مجموعه‌ای منتخب از اسکین‌های AK-47، AWP و سایر اسکین‌های افسانه‌ای CS:GO را مرور کنید. کاتالوگ تمیز، نرخ‌های منصفانه و تصاویر واقعی برای هر محصول.",
      /** Shown instead of the badge once the visitor is signed in. */
      heroGreeting: "خوش آمدید، {name}",
      heroSignedInHint: "برای مشاهده سفارش‌های خود وارد پنل کاربری شوید.",
      stats: {
         items: "محصول",
         categories: "دسته‌بندی",
         weapons: "سلاح",
      },
      metrics: {
         liveCatalog: "کاتالوگ فعال",
         fairRates: "نرخ منصفانه",
      },
      cta: {
         browseProducts: "مشاهده محصولات",
         createAccount: "ایجاد حساب کاربری",
         goToPanel: "پنل کاربری من",
      },

      /** Marquee of weapon classes. */
      marquee: {
         label: "دسته‌بندی سلاح‌ها",
      },

      /** Weapon-class showcase grid. */
      categories: {
         title: "مرور بر اساس دسته‌بندی",
         subtitle: "از تفنگ‌های سوزنی تا اسنایپر و کلت‌های کلاسیک، دسته مورد نظر خود را انتخاب کنید.",
         cta: "مشاهده همه محصولات",
         /**
          * Shared with the info pages and every other surface that names a
          * category - see CATEGORY_LABELS at the top of this file.
          */
         labels: CATEGORY_LABELS,
          /**
           * Shown when there are no *categories* to browse, which is what this
           * section tiles. It used to say "no products in the catalogue yet",
           * which is wrong for this section and actively misleading when it does
           * appear: a shop with 82 products and a broken category list rendered
           * exactly this sentence, and it read as though the whole catalogue were
           * empty. It pointed the search at the wrong table entirely.
           */
          empty: "هنوز دسته‌بندی‌ای برای نمایش وجود ندارد.",
      },

      /** Newest arrivals, straight from the live catalogue. */
      featured: {
         title: "پوسته‌های منتخب",
         subtitle: "تازه‌ترین اسکین‌های اضافه‌شده به فروشگاه",
         cta: "مشاهده همه محصولات",
         priceLabel: "قیمت (تومان)",
         newestTag: "جدید",
         empty: "هنوز محصولی برای نمایش وجود ندارد.",
      },

      /**
       * Shared carousel chrome. prev/next are labelled for screen readers.
       */
      carousel: {
         prev: "قبلی",
         next: "بعدی",
         label: "پیمایش",
         /** Hero 3D slider. The pause control is what keeps auto-advance inside WCAG 2.2.2. */
         heroLabel: "محصولات منتخب",
         pause: "توقف پخش خودکار",
         play: "ادامه پخش خودکار",
         slide: "{index} از {total}",
      },

      /** Hero: the headline item plus two smaller companions. */
      heroShowcase: {
         eyebrow: "تازه رسیده",
         viewProduct: "مشاهده محصول",
         browseAll: "همه محصولات",
      },
/** Three-step explainer. */
      howItWorks: {
         title: "خرید در سه قدم",
         subtitle: "فرآیند خرید در فروشگاه ما ساده و سریع است.",
         steps: {
            register: {
               title: "ثبت‌نام و ورود",
               body: "با شماره موبایل خود حساب بسازید و وارد شوید.",
            },
            choose: {
               title: "انتخاب اسکین",
               body: "از میان هزاران اسکین، مورد دلخواهتان را با تصاویر واقعی انتخاب کنید.",
            },
            receive: {
               title: "پرداخت و تحویل",
               body: "پرداخت امن انجام دهید؛ اسکین به‌سرعت به حساب شما منتقل می‌شود.",
            },
         },
      },

      /** FAQ accordion (Headless UI Disclosure). */
      faq: {
         title: "پرسش‌های پرتکرار",
         subtitle: "پاسخ سؤالات رایج درباره خرید، پرداخت و تحویل اسکین.",
         items: {
            authenticity: {
               q: "چطور از اصالت اسکین‌ها مطمئن شوم؟",
               a: "تمام اسکین‌ها پیش از انتشار توسط تیم کارشناسان بررسی می‌شوند و همراه با تصاویر واقعی ارائه می‌گردند.",
            },
            payment: {
               q: "پرداخت چگونه انجام می‌شود؟",
               a: "پرداخت از طریق درگاه بانکی امن انجام می‌شود و پس از تأیید، سفارش به‌سرعت پردازش می‌گردد.",
            },
            delivery: {
               q: "تحویل اسکین چقدر طول می‌کشد؟",
               a: "در بیشتر موارد تحویل چند دقیقه بیشتر طول نمی‌کشد. در صورت بروز مشکل، تیم پشتیبانی پیگیری می‌کند.",
            },
            refund: {
               q: "امکان بازگشت وجه وجود دارد؟",
               a: "در صورتی که اسکین مطابق توضیحات و بدون ایراد باشد، امکان بازگشت وجه وجود دارد.",
            },
         },
      },

      /** Closing call-to-action band. */
      finalCta: {
         title: "آماده‌اید شروع کنید؟",
         subtitle: "همین حالا حساب کاربری بسازید و به مجموعه اسکین‌های ما دسترسی پیدا کنید.",
         primary: "مشاهده محصولات",
         secondary: "ایجاد حساب کاربری",
         panel: "ورود به پنل کاربری",
      },
   },

   /**
    * /admin — the admin workspace (dashboard, users, products).
    *
    * Permission enum values (NoAccess / ReadOnly / FullAcc / …) are rendered
    * raw on purpose: they mirror backend values and stay useful for debugging.
    * Likewise, the long "backend not running" errors on the admin pages stay
    * in English — they are developer diagnostics, not end-user copy.
    */
   admin: {
      shellTitle: "بیا استور Admin",
      /** /admin — the dashboard landing page. */
      dashboard: {
         metaTitle: "داشبورد",
         metaDescription: "داشبورد مدیریت — مدیریت فروشگاه، محصولات و کاربران.",
         title: "داشبورد",
         subtitle: "به فضای کاری مدیریت خوش آمدید. یک بخش را از نوار کناری انتخاب کنید.",
         quickActionsTitle: "دسترسی سریع",
         quickActionsSubtitle: "میانبر به پرکاربرد‌ترین بخش‌های پنل مدیریت.",
         quickActions: {
            orders: {
               title: "مدیریت سفارش‌ها",
               body: "پیگیری پرداخت‌ها، ثبت پیشنهاد معامله و تحویل یا بازگشت سفارش‌ها.",
            },
            users: {
               title: "مدیریت کاربران",
               body: "مشاهده کاربران ثبت‌نام‌شده و بررسی سطح دسترسی آن‌ها.",
            },
            products: {
               title: "مدیریت محصولات",
               body: "افزودن، ویرایش و سازماندهی محصولات فروشگاه.",
            },
         },
      },
      /** Sidebar labels, keyed by href to match lib/adminNavigation.ts. */
      nav: {
         "/admin": "داشبورد",
         "/admin/orders": "سفارش‌ها",
         "/admin/user": "کاربران",
         "/admin/products": "محصولات",
         "/admin/documents": "اسناد",
         "/admin/reports": "گزارش‌ها",
      },
      sidebar: {
         workspaceTitle: "فضای کاری مدیریت",
         workspaceBody: "فروشگاه، تیم و گزارش‌های خود را از یکجا مدیریت کنید.",
      },
      header: {
         openSidebar: "باز کردن نوار کناری",
         closeSidebar: "بستن نوار کناری",
         search: "جستجو",
         searchPlaceholder: "جستجو…",
         notifications: "مشاهده اعلان‌ها",
         openUserMenu: "باز کردن منوی کاربر",
         yourProfile: "پروفایل شما",
         signOut: "خروج",
         fallbackName: "مدیر",
         fallbackRole: "مدیر سیستم",
      },
      accessDenied: {
         title: "دسترسی مجاز نیست",
         body: "سطح دسترسی شما اجازه مشاهده این بخش از مدیریت را نمی‌دهد.",
      },
      /** Headings for the developer-facing "backend unreachable" errors. */
      usersLoadError: { title: "بارگذاری کاربران ناموفق بود" },
      ordersLoadError: { title: "بارگذاری سفارش‌ها ناموفق بود" },
      productsLoadError: { title: "بارگذاری محصولات ناموفق بود" },

      // --- Users ---
      users: {
         metaTitle: "کاربران",
         metaDescription: "مدیریت کاربران — مشاهده، ویرایش و کنترل حساب‌های کاربری.",
         title: "کاربران",
         subtitle: "همه افراد ثبت‌نام‌شده در فروشگاه شما.",
         total: "{count} کاربر",
         headers: {
            user: "کاربر",
            contact: "تماس",
            steam: "استیم",
            tradeLink: "لینک معامله",
            joined: "تاریخ عضویت",
            lastLogin: "آخرین ورود",
            balance: "موجودی (تومان)",
            permission: "سطح دسترسی",
         },
         idLabel: "شناسه",
         tradeUrlPresent: "ثبت شده",
         tradeUrlMissing: "ثبت نشده",
         editPermissionAria: "تغییر سطح دسترسی {name}",
         permissionDialogTitle: "سطح دسترسی کاربر",
         permissionDialogFor: "سطح دسترسی {name} را تعیین کنید. تغییر بلافاصله اعمال می‌شود.",
         /** What each level may do, keyed by the machine value. */
         permissionDescriptions: {
            NoAccess: "بدون دسترسی به بخش مدیریت",
            ReadOnly: "مشاهده کاربران و محصولات، بدون تغییر",
            WriteDeleteEditSelfAdds: "افزودن محصول و ویرایش/حذف مواردی که خودش ساخته است",
            FullAcc: "دسترسی کامل؛ مدیریت دسترسی بقیه و مدیریت سفارش‌ها",
         },
         permissionSave: "ثبت سطح دسترسی",
         permissionSaving: "در حال ثبت…",
         permissionSaved: "سطح دسترسی به‌روزرسانی شد.",
         permissionSaveFailed: "ثبت سطح دسترسی ناموفق بود: {reason}",
      },
      usersEmpty: {
         outOfRangeTitle: "در این صفحه کاربری وجود ندارد",
         outOfRangeBody: "صفحه‌ای که درخواست کردید وجود ندارد.",
         goToFirstPage: "رفتن به صفحه ۱",
         noUsersTitle: "هنوز کاربری وجود ندارد",
         noUsersBody: "کاربران جدید پس از ثبت‌نام، اینجا نمایش داده می‌شوند.",
      },

      // --- Orders (back office) ---
      orders: {
         metaTitle: "سفارش‌ها",
         metaDescription: "مدیریت سفارش‌ها — پیگیری پرداخت، ارسال پیشنهاد معامله و ثبت تحویل یا بازگشت وجه.",
         title: "سفارش‌ها",
         subtitle: "همه سفارش‌های ثبت‌شده در فروشگاه، به همراه خریدار و وضعیت هر سفارش.",
         total: "{count} سفارش",
         loadingTitle: "در حال بارگذاری سفارش‌ها…",
         emptyTitle: "هنوز سفارشی ثبت نشده است",
         emptyBody: "به‌محض نخستین خرید، سفارش‌ها با خریدار و وضعیت تحویل اینجا نمایش داده می‌شوند.",
         filteredTitle: "سفارشی با این وضعیت پیدا نشد",
         filteredBody: "فیلتر وضعیت را عوض کنید یا «همه سفارش‌ها» را انتخاب کنید.",

         headers: {
            order: "سفارش",
            customer: "خریدار",
            items: "اقلام",
            total: "مبلغ کل (تومان)",
            placedAt: "تاریخ ثبت",
            status: "وضعیت",
            details: "جزئیات",
         },
         detailsAria: "جزئیات سفارش {id}",

         summary: {
            awaiting: "در انتظار اقدام",
            awaitingHint: "پرداخت‌شده یا در امانت؛ تحویل باید ثبت شود.",
            tradeSent: "پیشنهاد ارسال‌شده",
            tradeSentHint: "پیشنهاد معامله استیم فرستاده شده و منتظر پاسخ خریدار است.",
            delivered: "تکمیل‌شده",
            deliveredHint: "اقلام تحویل داده شدند.",
            disputed: "در حال بررسی",
            disputedHint: "اختلاف ثبت شده و باید بررسی شود.",
         },

         // -- Detail dialog --
         detail: {
            orderLabel: "سفارش",
            placedLabel: "تاریخ ثبت",
            updatedLabel: "آخرین به‌روزرسانی",
            statusLabel: "وضعیت",
            totalLabel: "مبلغ کل",
            customerTitle: "خریدار",
            customerName: "نام",
            customerPhone: "شماره تماس",
            customerEmail: "ایمیل",
            steamId: "شناسه استیم",
            tradeUrl: "لینک معامله استیم",
            tradeUrlOpen: "باز کردن لینک",
            tradeUrlMissing: "خریدار هنوز لینک معامله ثبت نکرده است.",
            itemsTitle: "اقلام سفارش",
            terminalNote: "این سفارش در وضعیت نهایی است و دیگر قابل تغییر نیست.",
            noTradeStepNote: "این سفارش کالای غیر اسکین دارد؛ بدون پیشنهاد معامله، تحویل را ثبت کنید.",
         },

         actions: {
            sendTradeOffer: "ثبت پیشنهاد معامله",
            markDelivered: "ثبت تحویل",
            refund: "بازگشت وجه",
            cancel: "لغو سفارش",
            working: "در حال انجام…",
         },

         tradeOffer: {
            title: "ثبت پیشنهاد معامله استیم",
            body: "پیشنهاد را از حساب استیم خود برای خریدار بفرستید، سپس لینک اشتراک‌گذاری پیشنهاد را اینجا ثبت کنید تا خریدار آن را در پنل خود ببیند.",
            urlLabel: "لینک پیشنهاد",
            urlPlaceholder: "https://steamcommunity.com/tradeoffer/1234567890/",
            urlHint: "لینک اشتراکی پیشنهاد، مثل https://steamcommunity.com/tradeoffer/1234567890/ — لینک «Make an Offer» حساب کاربری این نیست.",
            submit: "ثبت پیشنهاد",
            submitting: "در حال ثبت…",
         },

         confirm: {
            delivered: {
               title: "ثبت تحویل",
               body: "سفارش #{id} تکمیل شود؟ این تغییر برگشت‌پذیر نیست.",
            },
            refund: {
               title: "بازگشت وجه",
               body: "برای سفارش #{id}، مبلغ به کیف پول خریدار برگشت می‌خورد و اقلام به انبار بازگشت داده می‌شوند. این عمل یک‌بار انجام می‌شود.",
            },
            cancel: {
               title: "لغو سفارش",
               body: "سفارش #{id} لغو شود؟ مبلغ به کیف پول خریدار برگشت می‌خورد و موجودی آزاد می‌شود.",
            },
            yes: "بله، ادامه",
         },

         toast: {
            statusUpdated: "وضعیت سفارش به‌روزرسانی شد.",
            statusFailed: "تغییر وضعیت ناموفق بود: {reason}",
            tradeOfferSent: "پیشنهاد معامله ثبت شد و سفارش به «پیشنهاد معامله ارسال شد» تغییر کرد.",
            tradeOfferFailed: "ثبت پیشنهاد معامله ناموفق بود: {reason}",
            loadFailed: "بارگذاری سفارش‌ها ناموفق بود.",
         },

         /** The backend's OrderAdminError codes, in Persian the operator can act on. */
         errors: {
            ALREADY_REFUNDED: "این سفارش قبلاً بازگشت وجه شده است؛ یک سفارش فقط یک‌بار بازگشت می‌خورد.",
            ORDER_TERMINAL: "این سفارش در وضعیت نهایی است و دیگر قابل تغییر نیست.",
            ILLEGAL_TRANSITION: "این تغییر وضعیت برای سفارش مجاز نیست؛ صفحه را به‌روزرسانی کنید و دوباره تلاش کنید.",
            TRADE_ALREADY_PENDING: "برای این سفارش پیشنهاد معامله‌ای در انتظار پاسخ خریدار وجود دارد.",
            INVALID_OFFER_URL: "لینک واردشده لینک اشتراک پیشنهاد استیم نیست.",
            UNKNOWN: "خطای غیرمنتظره؛ دوباره تلاش کنید.",
         },
      },

      // --- Products ---
      products: {
         metaTitle: "محصولات",
         metaDescription: "مدیریت محصولات — افزودن، ویرایش و سازماندهی موجودی فروشگاه.",
         title: "محصولات",
         subtitle: "کاتالوگ خود را مدیریت کنید. محصولات در بکند ذخیره می‌شوند.",
         total: "{count} محصول",
         addProduct: "افزودن محصول",
         loadingFiltered: "در حال بارگذاری محصولات فیلترشده…",
         headers: {
            productNumber: "شماره محصول",
            title: "عنوان",
            description: "توضیحات",
            category: "دسته‌بندی",
            image: "تصویر",
            price: "قیمت (تومان)",
            stock: "موجودی",
            specs: "مشخصات",
            edit: "ویرایش",
            delete: "حذف",
         },
         editAria: "ویرایش {title}",
         deleteAria: "حذف {title}",
      },
      productsEmpty: {
         outOfRangeTitle: "در این صفحه محصولی وجود ندارد",
         outOfRangeBody: "صفحه‌ای که درخواست کردید وجود ندارد.",
         goToFirstPage: "رفتن به صفحه ۱",
         noProductsTitle: "هنوز محصولی ثبت نشده است",
         noProductsBody: "برای ایجاد نخستین محصول از دکمه «افزودن محصول» استفاده کنید. محصولات در بکند ذخیره می‌شوند.",
      },

      // --- Product form dialog (create / edit) ---
      dialog: {
         addTitle: "افزودن محصول",
         editTitle: "ویرایش محصول",
         addSubtitle: "محصولات در حال حاضر فقط در حافظه نگهداری می‌شوند — چیزی به بکند ارسال نمی‌شود.",
         editSubtitle: "جزئیات محصول را در ادامه به‌روزرسانی کنید.",
         close: "بستن پنجره",
         labels: {
            productNumber: "شماره محصول",
            title: "عنوان",
            description: "توضیحات",
            category: "دسته‌بندی",
            price: "قیمت",
            imageUrl: "آدرس تصویر",
         },
         placeholders: {
            title: "مثلاً تی‌شرت سفید کلاسیک",
            description: "محصول را توصیف کنید...",
            category: "انتخاب دسته‌بندی",
            price: "مثلاً 29.99",
            imageUrl: "https://example.com/image.jpg",
         },
         titleRequired: "عنوان الزامی است.",
         charCount: "{count}/200",
         count: "موجودی انبار",
         countHint: "چند نسخه از این آیتم موجود است. خالی یعنی یک نسخه.",
         imageHint: "خالی بگذارید تا تصویر بر اساس دسته‌بندی و عنوان انتخاب شود؛ آدرس واردشده همیشه ارجح است.",
         /** `{count}` is how many have already been sold. */
         soldHint: "{count} عدد از این آیتم فروخته شده است؛ موجودی قابل فروش برابر تعداد کل منهای آن است.",

         /** The optional CS2 specification columns, collapsed by default. */
         specs: {
            title: "مشخصات (بخش CS2)",
            noValue: "بدون مقدار",
            exterior: "میزان فرسودگی",
            pattern: "شماره الگوی نقش",
            patternPlaceholder: "مثلاً ۶۶۱",
            floatRange: "بازه شناوری (Float)",
            floatMin: "مثلاً 0.07",
            floatMax: "مثلاً 0.15",
            /** `{min}`/`{max}` are the band Valve ties to the chosen exterior. */
            floatHint: "بازه استاندارد این میزان فرسودگی: از {min} تا {max}.",
            floatHintGeneric: "مقدار بین 0 و 1؛ کمترین تا بیشترین شناوری این نسخه.",
            rarity: "سطح کمیابی",
            collection: "مجموعه",
            collectionPlaceholder: "مثلاً The Fever Collection",
            release: "تاریخ عرضه",
            stattrak: "StatTrak™",
            souvenir: "نسخه سوغاتی (Souvenir)",
         },

         cancel: "انصراف",
         save: "ذخیره تغییرات",
         saving: "در حال ذخیره...",
         submitAdd: "افزودن محصول",
      },

      // --- Delete confirmation + toasts ---
      confirm: {
         deleteTitle: "حذف محصول",
         deleteMessage: "محصول «{title}» حذف شود؟ این کار به‌طور دائمی آن را حذف می‌کند.",
         deleteLabel: "حذف",
         deleting: "در حال حذف...",
      },
      toast: {
         added: "محصول با موفقیت اضافه شد.",
         updated: "محصول با موفقیت به‌روزرسانی شد.",
         deleted: "محصول با موفقیت حذف شد.",
         saveFailed: "ذخیره محصول ناموفق بود: {reason}",
         deleteFailed: "حذف محصول ناموفق بود: {reason}",
      },
   },
/** Light/dark/system theme switcher in the header. */
   theme: {
      toggle: "تغییر پوسته",
      light: "روشن",
      dark: "تاریک",
      system: "سیستم",
   },
   /**
    * Site footer — shown on the home page and /products.
    *
    * The brand name is not repeated here: the footer reads `header.brand` so a
    * rename stays a single edit. The copyright line is composed from
    * `copyrightPrefix` + `header.brand` + `copyrightYear`.
    */
   footer: {
      trustTitle: "خرید مطمئن، تحویل سریع",

      /** Short reassurance row across the top of the footer. */
      trust: {
         bestPrice: {
            title: "بهترین قیمت بازار",
            body: "منصفانه‌ترین قیمت‌ها را در ایران ارائه می‌دهیم.",
         },
         instantDelivery: {
            title: "تحویل آنی اسکین‌های موجود",
            body: "اسکین‌های موجود در ربات بلافاصله تحویل داده می‌شوند. کلید و پرایم پس از تأیید.",
         },
         supportHours: {
            title: "پشتیبانی ۸ صبح تا ۱۰ شب",
            body: "تیم پشتیبانی در این ساعت‌ها به درخواست شما پاسخ می‌دهد.",
         },
         security: {
            title: "تضمین امنیت و اعتماد",
            body: "همه تراکنش‌ها با بالاترین سطح امنیتی محافظت می‌شوند.",
         },
      },

      brand: {
         tagline: "بازار امن اسکین CS2",
         description:
            "بازار ایرانی اسکین‌های CS2 و کلیدهای TF2؛ با کیف پول تومانی، قیمت‌گذاری لحظه‌ای و تحویل مستقیم به لینک ترید شما.",
      },

      /** Column headings. */
      groups: {
         buySell: "خرید و فروش",
         account: "حساب کاربری",
         support: "پشتیبانی",
         about: "درباره ما",
      },

      /**
       * Labels for the nav columns. The hrefs live in the component beside their
       * external/internal flag, so it is obvious at a glance which links leave
       * the site.
       */
      links: {
         buySkins: "خرید اسکین CS2",
         sellSkins: "فروش اسکین CS2",
         tf2Keys: "کلید TF2",
         buyPrime: "خرید پرایم CS2",
         knives: "چاقوها",
         gloves: "دستکش‌ها",

         profile: "پروفایل",
         wallet: "کیف پول",
         withdrawals: "برداشت وجه",
         orders: "سفارش‌ها",
         tradeLink: "لینک ترید",
         verification: "احراز هویت",

         contact: "تماس با ما",
         faq: "سوالات متداول",
         rules: "قوانین و مقررات",
         telegram: "پشتیبانی تلگرام",
         whatIsTradeLink: "لینک ترید چیست؟",

         aboutUs: "درباره ما",
         blog: "بلاگ",
         whyVerification: "چرا احراز هویت؟",
      },

      badges: {
         title: "مجوزها و درگاه‌های پرداخت",
         enamadLabel: "نماد اعتماد الکترونیکی",
         zibalLabel: "درگاه پرداخت زیبال",
      },

      /** Announced by screen readers on links that open a new tab. */
      opensInNewTab: "در صفحه جدید باز می‌شود",

      /** The heart is rendered separately so it can animate — see SiteFooter. */
      madeWithBefore: "ساخته شده با",
      madeWithAfter: "توسط smy_shadow",
      copyrightPrefix: "تمامی حقوق محفوظ است.",
      /**
       * Hardcoded on purpose. Deriving the Persian year from `Intl` would make
       * the server and the client disagree and re-introduce the hydration
       * mismatch fixed in SiteHeader. Bump it each Nowruz.
       */
      copyrightYear: "۱۴۰۵",
   },
   /**
    * The four brand promises, shared by the home page and the category landing
    * pages. The items themselves live in FEATURE_ITEMS at the top of this file.
    */
   features: {
      title: "چرا فروشگاه ما؟",
      subtitle: "هر چیزی که برای یک خرید امن و بی‌دردسر لازم دارید.",
      items: FEATURE_ITEMS,
   },

   /**
    * Placeholder copy for routes that the footer links to but that are not
    * built yet. Each one renders a real page rather than a 404, so the footer
    * never dead-ends.
    *
    * The nine pages that have graduated to real content - about, contact,
    * rules, trade-link, verify, knives, gloves, prime and tf2-keys - now live
    * under `info` below. These three are the ones still blocked on backend work.
    */
   comingSoon: {
      /** Heading on the placeholder panel. The page title is already in PageHero. */
      heading: "به‌زودی",
      blog: {
         title: "بلاگ",
         subtitle: "راهنماها، اخبار و نکات دنیای CS2.",
         body: "اولین مطلب‌های بلاگ در حال آماده‌سازی است.",
      },
      sell: {
         title: "فروش اسکین CS2",
         subtitle: "اسکین‌های خود را به ما بفروشید.",
         body: "فرم ثبت درخواست فروش به‌زودی راه‌اندازی می‌شود.",
      },
      withdrawals: {
         title: "برداشت وجه",
         subtitle: "برداشت موجودی کیف پول.",
         body: "درخواست‌های برداشت به‌زودی فعال می‌شوند.",
      },
   },
   /**
    * Public info pages — app/(myPages)/(info). One sub-object per page.
    *
    * These replaced the `comingSoon` placeholders once each page had something
    * real to say. Prime and TF2 keys joined them once their prices moved into the
    * `service_prices` table; sell, blog and withdrawals are still in
    * `comingSoon`.
    */
   info: {
      /** /about */
      about: {
         metaTitle: "درباره ما",
         metaDescription: "بیااستور، بازار ایرانی خرید و فروش اسکین‌های CS2: داستان ما، ارزش‌ها و اعداد واقعی فروشگاه.",
         badge: "درباره ما",
         heroTitle: "بازار ایرانی اسکین‌های CS2",
         heroSubtitle:
            "از یک ایده ساده شروع کردیم: خریدن اسکین باید به سادگی خریدن از یک فروشگاه معتبر باشد — با قیمت شفاف، اصالت مشخص و تحویلی که پیگیری می‌شود.",
         storyTitle: "داستان ما",
         storyParagraphs: [
            "بیااستور از یک مشکل ساده متولد شد. پیدا کردن یک اسکین خاص کار سختی نبود؛ پیدا کردن کسی که مطمئن باشی سرش کلاه نمی‌رود، سخت بود.",
            "بازار اسکین ایران پر از آگهی‌های پراکنده است: قیمت‌های نامعلوم، اصالت تأییدنشده و پرداخت‌هایی که هیچ سابقه‌ای از خود جا نمی‌گذارند. ما این پراکندگی را به یک فروشگاه واقعی تبدیل کردیم؛ با کاتالوگ، قیمت نوشته‌شده و سفارشی که تا آخر پیگیری می‌شود.",
            "هر اسکین پیش از انتشار در فروشگاه بررسی می‌شود، قیمتش بدون کارمزد پنهان روی صفحه محصول نوشته شده است، و تحویل از طریق لینک ترید استیم انجام می‌شود — همان روشی که خود بازیکن‌ها به آن اعتماد دارند.",
         ],
         valuesTitle: "چیزی که ما را متفاوت می‌کند",
         valuesSubtitle: "چهار اصلی که روی هر تصمیم فروشگاه اثر می‌گذارد.",
         values: {
            authenticity: {
               title: "اصالت، پیش از هر چیز",
               body: "هر اسکین با تصویر واقعی خودش نمایش داده می‌شود و پیش از انتشار بررسی می‌شود. آنچه می‌بینید همان چیزی است که تحویل می‌گیرید.",
            },
            transparency: {
               title: "قیمت شفاف به تومان",
               body: "قیمت نهایی روی صفحه محصول نوشته شده است؛ بدون کارمزد پنهان و بدون تبدیل ارز.",
            },
            speed: {
               title: "تحویل سریع",
               body: "پس از تأیید پرداخت، اسکین در کوتاه‌ترین زمان از طریق لینک ترید به حساب شما منتقل می‌شود.",
            },
            support: {
               title: "پشتیبانی انسانی",
               body: "پشت هر سفارش یک نفر پاسخگو است. اگر جایی گیر کردید، پشتیبانی تلگرام تا رسیدن به نتیجه همراهتان می‌ماند.",
            },
         },
         statsTitle: "بیااستور در یک نگاه",
         statsSubtitle: "اعداد زیر مستقیم از کاتالوگ زنده فروشگاه خوانده می‌شوند، نه از یک تخمین تبلیغاتی.",
         statProducts: "اسکین موجود",
         statCategories: "دسته‌بندی",
         statSubcategories: "زیردسته",
         faqTitle: "پرسش‌هایی که زیاد می‌پرسند",
         faqSubtitle: "اگر پاسخ پرسش شما اینجا نبود، پشتیبانی تلگرام در دسترس است.",
         faq: {
            who: {
               q: "بیااستور چه تفاوتی با خرید از آگهی‌های پراکنده دارد؟",
               a: "در بیااستور هر اسکین بخشی از یک کاتالوگ ثبت‌شده است: قیمت مشخص، تصویر واقعی و سفارشی که در پنل کاربری قابل پیگیری است. هیچ‌کدام از این‌ها در یک آگهی تلگرامی وجود ندارد.",
            },
            catalog: {
               q: "کاتالوگ چقدر به‌روز است؟",
               a: "قیمت‌ها و موجودی مستقیماً از کاتالوگ خوانده می‌شوند، پس آنچه روی صفحه محصول می‌بینید همان وضعیت لحظه‌ای فروشگاه است.",
            },
            team: {
               q: "چه کسی پشت بیااستور است؟",
               a: "یک تیم کوچک از بازیکن‌های CS2 که هم اسکین جمع کرده‌اند و هم از بازار آن آسیب دیده‌اند. همین باعث شد فروشگاه را طوری بسازیم که خودمان دوست داشتیم با آن خرید کنیم.",
            },
         },
         ctaTitle: "کاتالوگ را ببینید",
         ctaSubtitle: "بیش از هشتاد اسکین در دوازده دسته‌بندی، با قیمت تومانی و تصویر واقعی.",
         ctaPrimary: "مشاهده محصولات",
         ctaSecondary: "تماس با ما",
      },

      /** /contact */
      contact: {
         metaTitle: "تماس با ما",
         metaDescription: "راه‌های ارتباط با پشتیبانی بیااستور: تلگرام، ایمیل و ساعات پاسخ‌گویی.",
         badge: "پشتیبانی",
         heroTitle: "تماس با ما",
         heroSubtitle: "پشتیبانی بیااستور از طریق تلگرام پاسخ می‌دهد. برای پیگیری سریع‌تر، شماره سفارش خود را همراه داشته باشید.",
         channelsTitle: "راه‌های ارتباطی",
         channelsSubtitle: "سریع‌ترین راه، تلگرام است.",
         channels: {
            telegram: {
               title: "پشتیبانی تلگرام",
               body: "پاسخ‌گویی سریع برای پیگیری سفارش، مشکلات تحویل و پرسش‌های پرداخت. تلگرام تنها راهی است که در تمام ساعات شبانه‌روز پیام می‌گیرد.",
               action: "گفت‌وگو در تلگرام",
            },
            email: {
               title: "ایمیل",
               body: "برای موضوع‌های رسمی مثل همکاری، گزارش تخلف یا اسناد سفارش، ایمیل مناسب‌تر است. پاسخ در همان روز کاری داده می‌شود.",
               action: "ارسال ایمیل",
            },
            panel: {
               title: "پنل کاربری",
               body: "وضعیت سفارش‌ها، کیف پول و اطلاعات حساب شما در پنل کاربری قابل مشاهده و ویرایش است؛ شاید پاسخ پرسشتان همان‌جا باشد.",
               action: "ورود به پنل",
            },
            faq: {
               title: "سوالات متداول",
               body: "بسیاری از پرسش‌های خرید، پرداخت و تحویل پاسخ آماده دارند. پیش از ارسال پیام، یک نگاه به آن‌ها بیندازید.",
               action: "مشاهده پاسخ‌ها",
            },
         },
         hoursTitle: "ساعات پاسخ‌گویی",
         hoursSubtitle: "بیرون از این ساعات هم می‌توانید پیام بگذارید؛ پیام شما در اولین فرصت پاسخ می‌گیرد.",
         /**
          * Deliberately the same figure as `fa.footer.trust.supportHours` — the
          * two are read on the same page, and two different sets of support
          * hours side by side is worse than a vague one.
          */
         hours: {
            days: "همه روزه، از جمله تعطیلات",
            time: "۸:۰۰ تا ۲۲:۰۰",
            telegram: "پیام تلگرام در تمام ساعات شبانه‌روز ثبت می‌شود.",
            note: "پیگیری سفارش‌های در جریان، خارج از این ساعات هم انجام می‌شود.",
         },
         beforeTitle: "پیش از ارسال پیام",
         beforeSubtitle: "این سه مورد باعث می‌شود مشکل شما در همان اولین پیام حل شود.",
         before: [
            "شماره سفارش را از پنل کاربری کپی کنید و همراه پیام بفرستید.",
            "اگر مشکل تحویل است، لینک ترید خود را بررسی کنید؛ بیشتر تأخیرها از همین‌جا می‌آید.",
            "تصویر صفحه‌ای که مشکل را نشان می‌دهد، از هر توضیحی مفیدتر است.",
         ],
         faqTitle: "پرسش‌های پرتکرار درباره پشتیبانی",
         faqSubtitle: "پیش از ارسال پیام، این‌ها را یک بار ببینید.",
         faq: {
            responseTime: {
               q: "پاسخ چقدر طول می‌کشد؟",
               a: "در ساعات کاری معمولاً زیر چند دقیقه. اگر پشتیبانی شلوغ باشد، پاسخ ممکن است کمی طول بکشد؛ پیام شما از دست نمی‌رود.",
            },
            orderStatus: {
               q: "وضعیت سفارشم را از کجا ببینم؟",
               a: "در پنل کاربری، بخش سفارش‌ها. وضعیت هر سفارش همراه با مرحله‌ای که در آن قرار دارد نمایش داده می‌شود.",
            },
            refund: {
               q: "برای بازگشت وجه به کجا پیام بدهم؟",
               a: "از همان گفت‌وگوی تلگرام، همراه با شماره سفارش. درخواست شما بررسی می‌شود و نتیجه اعلام می‌شود.",
            },
         },
         ctaTitle: "پاسخ پرسشتان را اینجا نگرفتید؟",
         ctaSubtitle: "پشتیبانی تلگرام سریع‌ترین راه است؛ معمولاً در چند دقیقه پاسخ می‌گیرید.",
         ctaPrimary: "گفت‌وگو در تلگرام",
         ctaSecondary: "مشاهده محصولات",
      },

      /** /rules */
      rules: {
         metaTitle: "قوانین و مقررات",
         metaDescription: "شرایط استفاده از بازار بیااستور: حساب کاربری، پرداخت، تحویل، بازگشت وجه و موارد ممنوعه.",
         badge: "قوانین",
         heroTitle: "قوانین و مقررات",
         heroSubtitle: "این قوانین شرایط استفاده از بیااستور را مشخص می‌کنند. با ساخت حساب کاربری یا ثبت سفارش، آن‌ها را پذیرفته‌اید.",
         updatedLabel: "آخرین به‌روزرسانی",
         updatedValue: "مهر ۱۴۰۵",
         sections: {
            account: {
               title: "حساب کاربری",
               items: [
                  "هر شماره موبایل تنها می‌تواند به یک حساب کاربری متصل باشد.",
                  "مسئولیت حفظ دسترسی به شماره موبایل و اطلاعات حساب بر عهده صاحب حساب است.",
                  "ثبت اطلاعات نادرست — از جمله شماره موبایل متعلق به شخص دیگر — باعث مسدود شدن حساب می‌شود.",
                  "در صورت مشاهده ورود غیرمجاز، بلافاصله از طریق پشتیبانی اطلاع دهید.",
               ],
            },
            payment: {
               title: "پرداخت",
               items: [
                  "تمام مبالغ به تومان و از طریق درگاه بانکی امن پرداخت می‌شوند.",
                  "قیمت نهایی همان مبلغی است که روی صفحه محصول نوشته شده؛ کارمزد پنهانی وجود ندارد.",
                  "سفارش تنها پس از تأیید پرداخت وارد مرحله تحویل می‌شود.",
                  "استفاده از کیف پول اختیاری است و پرداخت از درگاه بانکی همیشه در دسترس است.",
               ],
            },
            delivery: {
               title: "تحویل",
               items: [
                  "تحویل اسکین‌ها از طریق لینک ترید استیم انجام می‌شود.",
                  "ثبت لینک ترید صحیح و به‌روز شرط امکان تحویل است؛ لینک نادرست روند را متوقف می‌کند.",
                  "اگر محدودیت استیم یا تعلیق ترید باعث شود تحویل ممکن نباشد، سفارش در حالت انتظار می‌ماند و با شما تماس گرفته می‌شود.",
                  "زمان تحویل پس از تأیید پرداخت معمولاً چند دقیقه است، اما در ساعات اوج ممکن است بیشتر طول بکشد.",
               ],
            },
            refund: {
               title: "بازگشت وجه",
               items: [
                  "درخواست بازگشت وجه پیش از تحویل اسکین پذیرفته می‌شود.",
                  "پس از تحویل، اسکین تنها در صورتی مرجوع می‌شود که با توضیحات صفحه محصول تفاوت داشته باشد.",
                  "بازگشت وجه به همان حساب یا کیف پولی انجام می‌شود که پرداخت از آن صورت گرفته است.",
                  "بررسی درخواست‌های بازگشت وجه معمولاً یک روز کاری زمان می‌برد.",
               ],
            },
            prohibited: {
               title: "موارد ممنوعه",
               items: [
                  "استفاده از کارت بانکی یا حساب متعلق به شخص دیگر.",
                  "هرگونه تلاش برای سوءاستفاده از خطاهای سایت، قیمت‌گذاری یا فرآیند پرداخت.",
                  "ثبت اسکین‌هایی با منبع نامشخص، دزدی یا حاصل از کلاهبرداری.",
                  "توهین، تهدید یا رفتار نامناسب با تیم پشتیبانی.",
               ],
            },
            changes: {
               title: "تغییر قوانین",
               items: [
                  "این قوانین ممکن است همراه با تغییر فرآیندهای فروشگاه به‌روزرسانی شود.",
                  "تغییرات مهم پیش از اعمال، در همین صفحه اعلام می‌شوند.",
                  "ادامه استفاده از فروشگاه پس از انتشار نسخه جدید، به معنی پذیرش آن است.",
               ],
            },
         },
         faqTitle: "پرسش‌های پرتکرار درباره قوانین",
         faqSubtitle: "کوتاه‌ترین پاسخ به رایج‌ترین ابهام‌ها.",
         faq: {
            agreement: {
               q: "پذیرش قوانین از چه زمانی اتفاق می‌افتد؟",
               a: "با ساخت حساب کاربری یا ثبت اولین سفارش. اگر با بخشی از این قوانین موافق نیستید، لطفاً پیش از خرید با پشتیبانی صحبت کنید.",
            },
            accountSharing: {
               q: "می‌توانم حسابم را با کسی به اشتراک بگذارم؟",
               a: "نه. هر حساب متعلق به یک شماره موبایل است و تحویل سفارش‌ها بر پایه همان حساب انجام می‌شود. اشتراک‌گذاری حساب باعث مسدود شدن آن می‌شود.",
            },
            banned: {
               q: "اگر حسابم مسدود شود چه می‌شود؟",
               a: "سفارش‌های در جریان تعیین تکلیف می‌شوند و موجودی کیف پول قابل برداشت می‌ماند. دلیل مسدود شدن از طریق پشتیبانی اعلام می‌شود.",
            },
         },
         ctaTitle: "پرسشی درباره قوانین دارید؟",
         ctaSubtitle: "اگر بخشی از این متن برایتان مبهم است، پیش از خرید بپرسید؛ پاسخ دادن به یک پرسش بهتر از حل یک مشکل است.",
         ctaPrimary: "مشاهده محصولات",
         ctaSecondary: "تماس با ما",
      },

      /** /trade-link */
      tradeLink: {
         metaTitle: "لینک ترید چیست؟",
         metaDescription: "راهنمای ساخت و ثبت لینک ترید استیم برای دریافت اسکین از بیااستور، همراه با ساختار لینک و اشتباه‌های رایج.",
         badge: "راهنما",
         heroTitle: "لینک ترید چیست؟",
         heroSubtitle:
            "لینک ترید آدرسی اختصاصی در استیم است که به فروشنده اجازه می‌دهد اسکین را بدون افزودن دوست به حساب شما منتقل کند.",
         introTitle: "چرا به لینک ترید نیاز دارید؟",
         introParagraphs: [
            "استیم اجازه نمی‌دهد کسی بدون تأیید شما کالایی به حسابتان بفرستد. لینک ترید همان تأیید است، اما فقط در یک جهت: اجازه ارسال کالا به شما، نه برداشت آن از حساب‌تان.",
            "بدون لینک ترید، تحویل اسکین فقط با افزودن دوست و انتظار برای تأیید دستی ممکن می‌شود؛ روشی که هم کند است و هم جای اشتباه دارد.",
         ],
         stepsTitle: "ساخت لینک ترید در چهار قدم",
         stepsSubtitle: "کل مسیر کمتر از دو دقیقه طول می‌کشد و فقط یک بار لازم است.",
         steps: [
            { title: "ورود به استیم", body: "با حساب خود وارد استیم شوید و مطمئن شوید حساب محدودیت ترید ندارد." },
            { title: "رفتن به پیشنهادهای ترید", body: "روی نام کاربری خود بزنید و از منو، Inventory و سپس Trade Offers را انتخاب کنید." },
            { title: "ساخت لینک", body: "در بخش Who can send me Trade Offers? روی Create New Trade Link بزنید." },
            { title: "کپی و ثبت", body: "لینک ساخته‌شده را کپی کنید و در پنل کاربری، بخش پروفایل، در فیلد لینک ترید ذخیره کنید." },
         ],
         anatomyTitle: "ساختار لینک ترید",
         anatomySubtitle: "لینک شما از سه بخش ساخته شده است؛ شناختن آن‌ها کمک می‌کند خطا را سریع پیدا کنید.",
         anatomy: [
            { label: "آدرس پایه", value: "steamcommunity.com/tradeoffer/new/", note: "ثابت است و همیشه همین شکل را دارد." },
            { label: "شناسه حساب", value: "partner=000000000", note: "شناسه عددی حساب استیم شما." },
            { label: "توکن ترید", value: "token=XXXXXXXX", note: "کلید خصوصی لینک؛ اگر تغییرش دهید، لینک از کار می‌افتد." },
         ],
         mistakesTitle: "اشتباه‌های رایج",
         mistakesSubtitle: "بیشتر تأخیرهای تحویل از این چهار مورد می‌آید.",
         mistakes: [
            "فرستادن آدرس پروفایل به‌جای لینک ترید؛ آدرس پروفایل برای تحویل کافی نیست.",
            "استفاده از لینک قدیمی پس از ساخت لینک جدید؛ ساخت لینک تازه، لینک قبلی را باطل می‌کند.",
            "پاک شدن بخش token هنگام کپی کردن لینک.",
            "ثبت لینک روی حسابی که هنوز محدودیت ترید دارد.",
         ],
         panelTitle: "لینک ترید خود را ثبت کنید",
         panelBody: "پس از ثبت در پنل کاربری، لینک شما ذخیره می‌شود و در تمام سفارش‌های بعدی از همان استفاده خواهد شد.",
         panelAction: "ثبت در پنل کاربری",
         faqTitle: "پرسش‌های پرتکرار درباره لینک ترید",
         faqSubtitle: "اگر پاسخ پرسشتان اینجا نبود، پشتیبانی تلگرام در دسترس است.",
         faq: {
            safe: {
               q: "آیا دادن لینک ترید امن است؟",
               a: "بله. لینک ترید فقط اجازه ارسال کالا به حساب شما را می‌دهد و اجازه برداشت یا تغییر رمز را نمی‌دهد. با این حال آن را عمومی منتشر نکنید.",
            },
            change: {
               q: "اگر لینکم را عوض کنم چه می‌شود؟",
               a: "لینک قدیمی باطل می‌شود و سفارش‌های در جریان نمی‌توانند تحویل شوند. لینک جدید را در پنل کاربری به‌روز کنید تا روند ادامه پیدا کند.",
            },
            tradeBan: {
               q: "حسابم محدودیت ترید دارد؛ می‌توانم خرید کنم؟",
               a: "پرداخت و ثبت سفارش ممکن است، اما تحویل تا پایان محدودیت انجام نمی‌شود. سفارش در حالت انتظار می‌ماند و پس از رفع محدودیت تحویل می‌گردد.",
            },
         },
         ctaTitle: "لینک ترید دارید؟",
         ctaSubtitle: "کافی است یک بار در پنل کاربری ثبتش کنید تا در همه سفارش‌های بعدی آماده باشد.",
         ctaPrimary: "ورود به پنل کاربری",
         ctaSecondary: "مشاهده محصولات",
      },

      /** /verify */
      verify: {
         metaTitle: "چرا احراز هویت؟",
         metaDescription: "دلیل اهمیت احراز هویت شماره موبایل در بیااستور و نحوه انجام آن، در سه قدم.",
         badge: "امنیت",
         heroTitle: "چرا احراز هویت؟",
         heroSubtitle:
            "احراز هویت در بیااستور فقط یک مرحله ورود نیست؛ همان چیزی است که تضمین می‌کند اسکین به دست صاحب واقعی حساب می‌رسد.",
         whyTitle: "احراز هویت چه چیزی را تضمین می‌کند؟",
         whySubtitle: "چهار دلیلی که این مرحله را برای هر دو طرف معامله ضروری می‌کند.",
         why: {
            ownership: {
               title: "اسکین به صاحب حساب می‌رسد",
               body: "تحویل به لینک تریدی انجام می‌شود که روی حساب تأییدشده ثبت شده است؛ نه به آدرسی که در متن پیام آمده.",
            },
            recovery: {
               title: "بازیابی حساب ممکن است",
               body: "اگر دسترسی به حساب را از دست بدهید، تأیید شماره موبایل تنها راه بازگرداندن آن است.",
            },
            fraud: {
               title: "جلوگیری از جعل هویت",
               body: "بدون تأیید شماره، هر کسی می‌توانست به نام شما حساب بسازد و به قیمت‌های فروشگاه دسترسی بگیرد.",
            },
            traceable: {
               title: "پیگیری‌پذیری سفارش",
               body: "هر سفارش به یک حساب تأییدشده گره خورده است، پس در صورت بروز مشکل، پیگیری و حل آن سریع‌تر انجام می‌شود.",
            },
         },
         stepsTitle: "احراز هویت در سه قدم",
         stepsSubtitle: "به یک شماره موبایل واقعی نیاز دارید؛ شماره مجازی پذیرفته نمی‌شود.",
         steps: [
            { title: "ثبت شماره موبایل", body: "شماره خود را در فرم ورود یا ثبت‌نام وارد کنید. شماره با فرمت‌های مختلف پذیرفته می‌شود." },
            { title: "دریافت کد تأیید", body: "یک کد یک‌بار‌مصرف برای شما ارسال می‌شود. کد اعتبار زمانی محدود دارد و چند بار قابل استفاده نیست." },
            { title: "ورود به حساب", body: "با وارد کردن کد، حساب شما تأیید می‌شود و از این پس با همان شماره وارد می‌شوید." },
         ],
         privacyTitle: "اطلاعات شما کجا ذخیره می‌شود؟",
         privacyParagraphs: [
            "تنها چیزی که از شما نگه داشته می‌شود شماره موبایل و اطلاعاتی است که خودتان در پروفایل تکمیل می‌کنید؛ مثل شناسه استیم و لینک ترید.",
            "کد تأیید پس از استفاده باطل می‌شود و در هیچ پاسخی به مرورگر برگردانده نمی‌شود. ما به رمز استیم، آیتم‌های موجودی یا دسترسی به حساب استیم شما نیازی نداریم و هرگز آن را درخواست نمی‌کنیم.",
         ],
         faqTitle: "پرسش‌های پرتکرار درباره احراز هویت",
         faqSubtitle: "پیش از شروع، این‌ها را یک بار ببینید.",
         faq: {
            code: {
               q: "کد تأیید را دریافت نکردم؛ چه کنم؟",
               a: "پس از کمی صبر دوباره درخواست کنید. با هر درخواست جدید، کد قبلی باطل می‌شود — پس همیشه آخرین کد را وارد کنید.",
            },
            change: {
               q: "می‌توانم شماره موبایلم را عوض کنم؟",
               a: "بله، از پنل کاربری. برای جلوگیری از سوءاستفاده، شماره جدید باید مالکیت خودش را اثبات کند و نمی‌تواند از قبل روی حساب دیگری ثبت شده باشد.",
            },
            shareCode: {
               q: "کد را با پشتیبانی به اشتراک بگذارم؟",
               a: "هرگز. هیچ‌کس در بیااستور نباید کد تأیید شما را بخواهد. اگر کسی چنین درخواستی کرد، آن را گزارش دهید.",
            },
         },
         ctaTitle: "هنوز احراز هویت نکرده‌اید؟",
         ctaSubtitle: "با شماره موبایل خود وارد شوید؛ کل مسیر کمتر از یک دقیقه طول می‌کشد.",
         ctaPrimary: "ورود به حساب",
         ctaSecondary: "مشاهده محصولات",
      },

      /**
       * Shared copy for the two category landing pages (knives, gloves). The
       * per-page differences live in `knives` / `gloves` below.
       */
      categoryPage: {
         inStock: "اسکین موجود",
         families: "خانواده اسکین",
         cheapest: "ارزان‌ترین",
         priciest: "گران‌ترین",
         subcategoriesTitle: "خانواده‌ها را مرور کنید",
         subcategoriesSubtitle: "برای دیدن اسکین‌های یک خانواده مشخص، روی آن بزنید.",
         productsTitle: "اسکین‌های این دسته",
         productsSubtitle: "قیمت‌ها به تومان و مستقیم از کاتالوگ فروشگاه خوانده می‌شوند.",
         productsCta: "مشاهده همه",
         productsEmpty: "هنوز محصولی برای نمایش در این دسته ثبت نشده است.",
         /** Shown in place of the product grid when the catalogue call fails. */
         unavailable: "ارتباط با کاتالوگ برقرار نشد، پس فهرست اسکین‌ها فعلاً نمایش داده نمی‌شود. راهنمای پایین صفحه همچنان در دسترس است.",
         ctaPrimary: "مشاهده محصولات",
         ctaSecondary: "تماس با ما",
      },

      /** /knives */
      knives: {
         metaTitle: "خرید چاقوهای CS2",
         metaDescription: "خرید چاقوی CS2 با قیمت تومانی و تصویر واقعی: بایونت، کارامبیت، باترفلای و دیگر خانواده‌ها.",
         badge: "چاقو",
         heroTitle: "چاقوهای CS2",
         heroSubtitle:
            "چاقو گران‌ترین و پرحاشیه‌ترین بخش هر اینونتوری است. اینجا همه چیز از ابتدا مشخص است: کدام خانواده، چه قیمتی و با چه تصویری.",
         guideTitle: "پیش از خرید چاقو بدانید",
         guideParagraphs: [
            "قیمت چاقو بیش از هر چیز به خانواده و سپس به طرح آن بستگی دارد. یک کارامبیت با طرح ساده معمولاً از یک چاقوی ارزان‌تر با طرح کم‌یاب گران‌تر است.",
            "وضعیت ظاهری (Float) هم روی قیمت اثر می‌گذارد. تصاویر این صفحه، تصویر واقعی همان اسکین موجود در کاتالوگ است، نه یک عکس نمونه.",
            "چاقوها در همه دسته‌بندی‌ها بیشترین تعداد زیردسته را دارند، چون هر خانواده چاقو یک زیردسته جداگانه است. اگر دنبال یک مدل خاص هستید، از بخش خانواده‌ها شروع کنید.",
         ],
         faqTitle: "پرسش‌های پرتکرار درباره چاقوها",
         faqSubtitle: "اگر پاسخ پرسشتان اینجا نبود، پشتیبانی تلگرام در دسترس است.",
         faq: {
            price: {
               q: "قیمت چاقو به چه چیزی بستگی دارد؟",
               a: "بیش از همه به خانواده چاقو، و بعد به طرح و وضعیت ظاهری آن. اختلاف قیمت دو چاقو از یک خانواده معمولاً از اختلاف طرح می‌آید.",
            },
            choose: {
               q: "از کجا شروع کنم؟",
               a: "اگر مدل خاصی در ذهن دارید، از بخش خانواده‌ها همان مدل را انتخاب کنید. اگر مطمئن نیستید، فهرست اسکین‌های پایین صفحه را بر اساس قیمت مرور کنید.",
            },
            delivery: {
               q: "تحویل چاقو چقدر طول می‌کشد؟",
               a: "پس از تأیید پرداخت معمولاً چند دقیقه. تحویل از طریق لینک ترید استیم انجام می‌شود، پس لینک خود را از قبل در پنل کاربری ثبت کنید.",
            },
         },
         ctaTitle: "چاقوی مورد نظرتان را پیدا کنید",
         ctaSubtitle: "از میان خانواده‌ها و طرح‌ها جستجو کنید و قیمت تومانی هر کدام را ببینید.",
      },

      /** /gloves */
      gloves: {
         metaTitle: "خرید دستکش‌های CS2",
         metaDescription: "خرید دستکش CS2 با قیمت تومانی و تصویر واقعی: اسپرت، موتو، درایور و دیگر خانواده‌ها.",
         badge: "دستکش",
         heroTitle: "دستکش‌های CS2",
         heroSubtitle:
            "دستکش‌ها کنار چاقو، یک اینونتوری را کامل می‌کنند. قیمتشان بیشتر به خانواده و وضعیت ظاهری وابسته است تا طرح‌های تزئینی.",
         guideTitle: "پیش از خرید دستکش بدانید",
         guideParagraphs: [
            "برخلاف چاقو، تفاوت قیمت دستکش‌ها بیشتر از خانواده می‌آید تا از طرح. یک دستکش اسپرت و یک دستکش موتو، حتی با ظاهر نزدیک، می‌توانند قیمت‌های بسیار متفاوتی داشته باشند.",
            "وضعیت ظاهری روی دستکش بسیار بیشتر به چشم می‌آید، چون سطح آن یکدست است و خط‌وخش روی آن واضح دیده می‌شود. تصاویر این صفحه تصویر واقعی همان اسکین موجود در کاتالوگ است.",
            "دستکش‌ها در همه دسته‌بندی‌ها کمترین تعداد زیردسته را دارند، چون هر خانواده یک زیردسته است و تعداد خانواده‌ها محدود است. همین کار انتخاب را ساده‌تر می‌کند: سریع می‌توانید همه گزینه‌ها را ببینید.",
         ],
         faqTitle: "پرسش‌های پرتکرار درباره دستکش‌ها",
         faqSubtitle: "اگر پاسخ پرسشتان اینجا نبود، پشتیبانی تلگرام در دسترس است.",
         faq: {
            family: {
               q: "کدام خانواده دستکش را انتخاب کنم؟",
               a: "بستگی به ظاهر مورد علاقهتان دارد. موتو و اسپرت محبوب‌ترین‌ها هستند و انتخاب گسترده‌تری دارند؛ درایور و هند‌رپ ظاهر ساده‌تری دارند.",
            },
            float: {
               q: "وضعیت ظاهری دستکش چقدر مهم است؟",
               a: "روی دستکش بیشتر از چاقو به چشم می‌آید، چون سطح یکدست آن خط‌وخش را واضح‌تر نشان می‌دهد. اگر ظاهر یکدست برایتان مهم است، پیش از خرید تصویر محصول را با دقت ببینید.",
            },
            delivery: {
               q: "تحویل دستکش چقدر طول می‌کشد؟",
               a: "پس از تأیید پرداخت معمولاً چند دقیقه. تحویل از طریق لینک ترید استیم انجام می‌شود، پس لینک خود را از قبل در پنل کاربری ثبت کنید.",
            },
         },
         ctaTitle: "دستکش مناسب خود را پیدا کنید",
         ctaSubtitle: "خانواده‌ها را مقایسه کنید و قیمت تومانی هر کدام را در کاتالوگ ببینید.",
      },

      /**
       * /prime — CS2 Prime, priced per Steam region.
       *
       * `regions` is keyed by the `variant` column in `service_prices`, so a
       * region added to the database renders under its raw value until it is
       * labelled here.
       */
      prime: {
         metaTitle: "خرید پرایم CS2",
         metaDescription: "خرید پرایم CS2 با قیمت تومانی و انتخاب ریجن استیم: آرژانتین، اروپا، اوکراین، ایالات متحده، ترکیه و هند.",
         badge: "CS2 · پرایم",
         heroTitle: "خرید پرایم CS2",
         heroSubtitle:
            "ریجن اکانت را انتخاب کنید و با کیف پول تومانی بخرید. تحویل را فروشنده انجام می‌دهد و وضعیت سفارش در پنل کاربری به‌روز می‌شود.",
         pickerTitle: "ریجن اکانت را انتخاب کنید",
         pickerSubtitle: "قیمت پرایم به ریجن استیم اکانت شما بستگی دارد؛ همان ریجنی را انتخاب کنید که اکانت‌تان روی آن است.",
         selected: "انتخاب‌شده",
         priceLabel: "قیمت",
         /** Product header at the top of the buy card, above the region picker. */
         productEyebrow: "ارتقای وضعیت اکانت",
         productName: "CS2 Prime",
         productTagline:
            "پرایم روی همان اکانت استیم خودتان فعال می‌شود؛ بخش رقابتی و دراپ هفتگی آیتم باز می‌گردد و تحویل را فروشنده انجام می‌دهد.",
         regions: {
            argentina: "آرژانتین",
            europe: "اروپا",
            ukraine: "اوکراین",
            usa: "ایالات متحده",
            turkey: "ترکیه",
            india: "هند",
         },
         trust: {
            delivery: { title: "تحویل پس از تأیید فروشنده", body: "وضعیت سفارش در پنل کاربری به‌روز می‌شود." },
            payment: { title: "پرداخت فقط از کیف پول تومانی", body: "بدون تبدیل ارز و بدون کارمزد پنهان." },
            security: { title: "رمز استیم هرگز پرسیده نمی‌شود", body: "نه رمز، نه کد Steam Guard؛ ورود فقط در صفحه رسمی استیم." },
         },
         orderIntro: "سلام، می‌خواهم پرایم CS2 بخرم.",
         orderRegionLabel: "ریجن:",
         orderPriceLabel: "مبلغ:",
         orderCta: "ثبت سفارش در تلگرام",
         walletCta: "شارژ کیف پول",

         // --- Add to cart ---
         addToCart: "افزودن به سبد خرید",
         addedToCart: "به سبد خرید اضافه شد",
         adding: "در حال افزودن…",
         viewCart: "مشاهده سبد خرید",
         inCartHint: "این ریجن در سبد خرید شما است؛ با دکمه بالا تعدادش را ببینید.",
         /** Telegram stays offered, but as the fallback rather than the way in. */
         telegramFallback: "یا سفارش را در تلگرام ثبت کنید",

         unavailable:
            "ارتباط با کاتالوگ برقرار نشد، پس قیمت ریجن‌ها فعلاً نمایش داده نمی‌شود. راهنمای پایین صفحه همچنان در دسترس است و می‌توانید سفارش را از تلگرام ثبت کنید.",
         facts: {
            regions: "ریجن قابل انتخاب",
            cheapest: "ارزان‌ترین ریجن (تومان)",
            priciest: "گران‌ترین ریجن (تومان)",
         },
         stepsTitle: "خرید پرایم در چهار قدم",
         stepsSubtitle: "پرایم یک آیتم نیست که در اینونتوری بنشیند؛ وضعیتی روی اکانت استیم شماست.",
         steps: [
            { title: "انتخاب ریجن", body: "ریجن استیم اکانت خود را انتخاب کنید. اگر مطمئن نیستید، پیش از پرداخت از پشتیبانی بپرسید." },
            { title: "ورود به حساب", body: "با شماره موبایل خود وارد شوید تا سفارش به حساب شما گره بخورد و قابل پیگیری باشد." },
            { title: "ثبت سفارش", body: "ریجن و مبلغ را از تلگرام ثبت کنید. پرداخت از کیف پول تومانی انجام می‌شود." },
            { title: "تحویل پس از تأیید", body: "پس از انجام تحویل، وضعیت سفارش در پنل کاربری به‌روز می‌شود و تا آخر قابل پیگیری است." },
         ],
         aboutTitle: "پرایم CS2 چیست؟",
         aboutParagraphs: [
            "پرایم یک آیتم قابل حمل در اینونتوری نیست؛ وضعیت رسمی Counter-Strike 2 روی اکانت استیم شماست. با پرایم، بخش رقابتی و صف اختصاصی بازیکنان پرایم برایتان باز می‌شود و دراپ هفتگی آیتم فعال می‌گردد.",
            "بدون پرایم، بخش رقابتی و بخشی از امکانات حساب قفل می‌ماند. به همین دلیل برای بازیکنی که جدی بازی می‌کند، پرایم اولین خرید است، نه یک ارتقای تزئینی.",
            "چون پرایم روی اکانت می‌نشیند و نه در اینونتوری، تحویلش با اسکین فرق دارد: ریجن اکانت باید درست انتخاب شود و تحویل را فروشنده انجام می‌دهد. وضعیت هر سفارش در پنل کاربری قابل پیگیری است.",
         ],
         regionTitle: "ریجن یعنی چه؟",
         regionParagraphs: [
            "ریجن همان کشور یا منطقه‌ای است که روی اکانت استیم شما ثبت شده است. استیم قیمت خدماتش را بر اساس همین منطقه تعیین می‌کند، پس یک محصول یکسان در ریجن‌های مختلف قیمت‌های متفاوتی دارد.",
            "همین تفاوت، دلیل اختلاف قیمت گزینه‌های بالاست. ریجنی را انتخاب کنید که با اکانت خودتان هم‌خوانی دارد؛ تحویل روی همان ریجنی انجام می‌شود که انتخاب کرده‌اید.",
            "اگر ریجن اکانت‌تان را نمی‌دانید یا در فهرست نیست، پیش از ثبت سفارش از پشتیبانی تلگرام بپرسید تا سفارش روی ریجن اشتباه ثبت نشود.",
         ],
         faqTitle: "پرسش‌های پرتکرار درباره پرایم",
         faqSubtitle: "اگر پاسخ پرسش شما اینجا نبود، پشتیبانی تلگرام در دسترس است.",
         faq: {
            credentials: {
               q: "آیا برای خرید پرایم رمز استیم لازم است؟",
               a: "خیر. ما هرگز رمز استیم یا کد Steam Guard را نمی‌پرسیم. ورود فقط در صفحه رسمی استیم انجام می‌شود و اگر جایی چنین چیزی از شما خواسته شد، آن را گزارش دهید.",
            },
            whichRegion: {
               q: "ریجن اکانتم را از کجا ببینم؟",
               a: "در تنظیمات اکانت استیم، بخش کشور یا منطقه. اگر مطمئن نیستید، پیش از پرداخت از پشتیبانی بپرسید؛ ریجن اشتباه یعنی تحویل انجام نمی‌شود.",
            },
            payment: {
               q: "پرداخت از چه راهی انجام می‌شود؟",
               a: "فقط از کیف پول تومانی. اگر موجودی کافی نیست، اول کیف پول را شارژ کنید. هیچ تبدیل ارزی و کارمزد پنهانی وجود ندارد.",
            },
            priceDiff: {
               q: "چرا قیمت ریجن‌ها با هم فرق دارد؟",
               a: "چون استیم قیمت‌گذاری منطقه‌ای دارد و پرایم در هر منطقه به یک قیمت عرضه می‌شود. این اختلاف از استیم می‌آید، نه از ما؛ به همین دلیل هم قابل چانه‌زنی نیست.",
            },
         },
         ctaTitle: "ریجن خود را انتخاب کرده‌اید؟",
         ctaSubtitle: "پس از انتخاب ریجن، سفارش را از تلگرام ثبت کنید تا موجودی کیف پول و زمان تحویل نهایی شود.",
         ctaPrimary: "ثبت سفارش در تلگرام",
         ctaSecondary: "شارژ کیف پول",
      },

      /**
       * /tf2-keys — Mann Co. keys, priced per unit with a per-order cap.
       */
      tf2Keys: {
         metaTitle: "خرید کلید TF2",
         metaDescription: "خرید کلید TF2 با قیمت تومانی، موجودی لحظه‌ای و محاسبه‌گر تعداد تا سقف ۵۰ کلید در هر سفارش.",
         badge: "TF2 · کلید",

         /** The "sell your keys to us" card beside the buy calculator. */
         sell: {
            badge: "فروش کلید",
            title: "کلیدهای خود را به ما بفروشید",
            body: "کلید Mann Co. مازاد دارید؟ فروشگاه به‌عنوان خریدار همیشه بی‌کار نمی‌شود؛ از طریق ربات تلگرام، تعداد کلیدها را اعلام کنید و با یک پیشنهاد تومانی قطعی مواجه شوید.",
            points: {
               price: { title: "قیمت منصفانه و قطعی", body: "بر اساس نرخ روز بازار؛ قیمت پیشنهادی پیش از تأیید معامله معلوم می‌شود." },
               wallet: { title: "تسویه با کیف پول", body: "مبلغ پس از تأیید معامله استیم، بدون واسطه به کیف پول تومانی شما واریز می‌شود." },
               speed: { title: "معامله سریع", body: "پیشنهاد معامله در استیم همان جلسه فرستاده می‌شود و معامله چند دقیقه بیشتر نمی‌گیرد." },
            },
            cta: "شروع فروش در تلگرام",
            hint: "پس از کلیک، ربات فروش کلید باز می‌شود؛ مراحل و قیمت‌دهی همان‌جا انجام می‌شود.",
         },

         heroTitle: "خرید کلید TF2",
         heroSubtitle:
            "کلید Mann Co. را با کیف پول تومانی بخرید؛ تعداد را انتخاب کنید و مبلغ قابل پرداخت را همان لحظه ببینید.",
         pricePerKey: "قیمت هر کلید",
         stockLabel: "موجودی",
         stockUnit: "کلید",
         /** Product header at the top of the calculator, above the numbers. */
         productEyebrow: "آیتم Team Fortress 2",
         productName: "کلید Mann Co.",
         productTagline: "کلید طلایی Mann Co. برای باز کردن جعبه‌های TF2؛ پس از تأیید سفارش به لینک ترید شما تحویل داده می‌شود.",
         quantityLabel: "تعداد کلید مورد نظر",
         limitBefore: "حداکثر",
         limitAfter: "کلید در هر سفارش",
         quickPick: "انتخاب سریع",
         decrease: "کاهش تعداد",
         increase: "افزایش تعداد",
         quantityInput: "تعداد کلید",
         totalLabel: "مبلغ قابل پرداخت",
         trust: {
            payment: { title: "تراکنش ایمن", body: "پرداخت از کیف پول تومانی و ثبت سفارش در پنل کاربری." },
            delivery: { title: "تحویل پس از تأیید", body: "کلید پس از تأیید سفارش به لینک ترید شما فرستاده می‌شود." },
         },
         orderIntro: "سلام، می‌خواهم کلید TF2 بخرم.",
         orderQuantityLabel: "تعداد:",
         orderPriceLabel: "مبلغ:",
         orderCta: "ثبت سفارش در تلگرام",
         walletCta: "شارژ کیف پول",

         // --- Add to cart ---
         addToCart: "افزودن به سبد خرید",
         addedToCart: "به سبد خرید اضافه شد",
         adding: "در حال افزودن…",
         viewCart: "مشاهده سبد خرید",
         telegramFallback: "یا سفارش را در تلگرام ثبت کنید",
         unavailable:
            "ارتباط با کاتالوگ برقرار نشد، پس قیمت و موجودی کلید فعلاً نمایش داده نمی‌شود. راهنمای پایین صفحه همچنان در دسترس است و می‌توانید سفارش را از تلگرام ثبت کنید.",
         facts: {
            stock: "کلید موجود",
            price: "قیمت هر کلید (تومان)",
            cap: "سقف هر سفارش (کلید)",
         },
         stepsTitle: "خرید کلید TF2 در چهار قدم",
         stepsSubtitle: "کلید به اینونتوری Team Fortress 2 تحویل داده می‌شود، پس حساب باید تریدپذیر باشد.",
         steps: [
            { title: "احراز هویت", body: "با شماره موبایل خود وارد شوید؛ کلید فقط به حساب تأییدشده تحویل داده می‌شود." },
            { title: "ثبت لینک ترید", body: "لینک ترید استیم خود را در پنل کاربری ذخیره کنید؛ بدون آن تحویل ممکن نیست." },
            { title: "انتخاب تعداد و ثبت سفارش", body: "تعداد را انتخاب کنید، مبلغ قابل پرداخت را ببینید و سفارش را از تلگرام نهایی کنید." },
            { title: "تحویل کلید", body: "پس از تأیید سفارش، کلید به لینک ترید شما فرستاده می‌شود و وضعیت در پنل به‌روز می‌گردد." },
         ],
         whatTitle: "کلید TF2 چیست؟",
         whatParagraphs: [
            "کلید Mann Co. آیتم رسمی بازی Team Fortress 2 است و برای باز کردن جعبه‌ها و کریت‌های همان بازی استفاده می‌شود. چون تقاضایش همیشه پایدار است، در بازار به‌عنوان یک واحد معامله شناخته می‌شود.",
            "بسیاری از بازیکن‌های CS2 هم کلید TF2 می‌خرند، اما نه برای بازی کردن: با فروش کلید در بازار استیم می‌توان کیف پول استیم را با هزینه کمتر شارژ کرد. همین کاربرد است که کلید را از یک آیتم معمولی جدا می‌کند.",
            "نکته‌ای که باید بدانید این است که کلید، اسکین نیست: به اینونتوری Team Fortress 2 شما می‌رود، نه به اینونتوری CS2.",
         ],
         limitsTitle: "سقف معامله و شرایط حساب",
         limitsParagraphs: [
            "استیم اجازه نگه داشتن بیش از ۵۰ کلید را در یک اکانت نمی‌دهد. به همین دلیل هر سفارش در فروشگاه هم به ۵۰ کلید محدود است؛ اگر تعداد بیشتری می‌خواهید، سفارش دوم را جدا ثبت کنید.",
            "برای تحویل، اینونتوری حساب شما باید تریدپذیر باشد و Steam Guard موبایل روی آن فعال باشد. اگر حساب محدودیت ترید دارد، سفارش تا پایان محدودیت در حالت انتظار می‌ماند.",
         ],
         faqTitle: "پرسش‌های پرتکرار درباره کلید TF2",
         faqSubtitle: "اگر پاسخ پرسش شما اینجا نبود، پشتیبانی تلگرام در دسترس است.",
         faq: {
            cs2Case: {
               q: "آیا کلید TF2 کیس CS2 را باز می‌کند؟",
               a: "خیر. کلید Mann Co. فقط جعبه و کریت Team Fortress 2 را باز می‌کند. کیس‌های سلاح CS2 کلید جداگانه خودشان را می‌خواهند.",
            },
            howToBuy: {
               q: "چطور اینجا کلید TF2 بخرم؟",
               a: "با شماره موبایل وارد شوید، لینک ترید را در پنل کاربری ذخیره کنید و اگر موجودی کم است کیف پول را شارژ کنید. تعداد را انتخاب کنید و سفارش را از تلگرام نهایی کنید.",
            },
            limits: {
               q: "محدودیت تعداد چیست؟",
               a: "هر سفارش حداکثر ۵۰ کلید است، چون استیم اجازه نگه داشتن بیش از این تعداد را در یک اکانت نمی‌دهد. خرید بیش از موجودی فروشگاه هم امکان‌پذیر نیست.",
            },
            requirements: {
               q: "برای دریافت کلید چه چیزهایی لازم است؟",
               a: "حساب تأییدشده با شماره موبایل، لینک ترید معتبر و Steam Guard موبایل روی حساب. اینونتوری هم باید تریدپذیر باشد.",
            },
            why: {
               q: "چرا مردم کلید TF2 می‌خرند؟",
               a: "بیشتر برای شارژ ارزان‌تر کیف پول استیم: کلید را می‌خرند و در بازار استیم می‌فروشند. بعضی هم برای باز کردن جعبه‌های TF2 یا معامله آیتم‌های همان بازی.",
            },
         },
         ctaTitle: "تعداد کلید را مشخص کرده‌اید؟",
         ctaSubtitle: "مبلغ را در محاسبه‌گر بالا ببینید و سفارش را از تلگرام ثبت کنید تا تحویل انجام شود.",
         ctaPrimary: "ثبت سفارش در تلگرام",
         ctaSecondary: "لینک ترید چیست؟",
      },
   },
   /**
    * Every amount in the product catalogue, the wallet and order totals is
    * denominated in Toman. There is no currency conversion anywhere - this key
    * exists so the unit is written in one place.
    */
   currency: "تومان",
} as const

export interface NavLink {
   name: string
   href: string
}

/**
 * The header's two shop links.
 *
 * Both are real routes: /cart is the review-and-pay page, and /orders forwards to
 * /panel/orders, where an order actually lives alongside the rest of the account.
 */
export const faNavLinks: NavLink[] = [
   { name: fa.links.cart, href: "/cart" },
]

/**
 * Persian names for the two goods that are not products.
 *
 * A product carries its own title through the database, so nothing here is needed
 * for skins. CS2 Prime and TF2 keys live in `service_prices`, which holds machine
 * values only (`prime` + `argentina`) because the backend has no Persian copy -
 * so the cart, the order history and the inventory all resolve their labels
 * through here, via `orderItemLabel` in `app/lib/orderItems.ts`.
 */
export const faServiceLabels: Record<string, { name: string; variants: Record<string, string> }> = {
   prime: { name: "پرایم CS2", variants: fa.info.prime.regions },
   tf2_keys: { name: "کلید TF2", variants: { key: "مان کوفکتوری" } },
}

/**
 * Persian label for an admin sidebar entry, looked up by href.
 * Falls back to the label in `lib/adminNavigation.ts` so a new route never
 * renders blank while its translation is still missing.
 */
export function faAdminNavLabel(href: string, fallback: string): string {
   const labels = fa.admin.nav as Record<string, string | undefined>
   return labels[href] ?? fallback
}
