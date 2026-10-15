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

export const fa = {
   /** 404 pages — rendered by not-found.tsx and global-not-found.tsx. */
   notFound: {
      code: "خطای ۴۰۴",
      title: "صفحه مورد نظر پیدا نشد",
      description: "ممکن است آدرس را اشتباه وارد کرده باشید یا این صفحه جابه‌جا شده باشد. از اینجا می‌توانید به خانه یا فروشگاه برگردید.",
      backHome: "بازگشت به خانه",
      browseShop: "مشاهده فروشگاه",
      metaTitle: "صفحه پیدا نشد — Shopify",
      metaDescription: "صفحه‌ای که به دنبال آن بودید وجود ندارد یا جابه‌جا شده است.",
   },

   nav: {
      home: "صفحه اصلی",
      products: "محصولات",
      panel: "پنل",
      myPanel: "پنل من",
      admin: "مدیریت",
      adminDashboard: "داشبورد مدیریت",
   },
   header: {
      brand: "شاپیفای",
      openMenu: "باز کردن منو",
      closeMenu: "بستن منو",
      openUserMenu: "باز کردن منوی کاربر",
      fallbackUserName: "کاربر",
   },
   /** Shared auth button labels used by the header and the user menu. */
   auth: {
      login: "ورود",
      signup: "ثبت‌نام",
      logout: "خروج",
   },
   /** Links to routes that are not implemented yet. */
   links: {
      orders: "سفارش‌ها",
      cart: "سبد خرید",
   },

   /**
    * Auth pages: /login, /register and /login/verify.
    * Mirrors the strings in app/(myPages)/(auth) and app/components/auth.
    */
   authPages: {
      // --- <title> / meta description ---
      loginMetaTitle: "ورود — شاپیفای",
      loginMetaDescription: "برای ادامه خرید وارد شوید.",
      signupMetaTitle: "ثبت‌نام — شاپیفای",
      signupMetaDescription: "حساب شاپیفای خود را بسازید.",
      verifyMetaTitle: "تایید شماره موبایل — شاپیفای",
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
      metaTitle: "پنل من — Shopify",
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
            body: "سبد خرید در حال راه‌اندازی است و به‌زودی در دسترس قرار می‌گیرد.",
            cta: "به‌زودی",
         },
         orders: {
            title: "سفارش‌ها",
            body: "پیگیری و تاریخچه سفارش‌ها به‌زودی فعال می‌شود.",
            cta: "به‌زودی",
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
         name: "نام و نام خانوادگی",
         namePlaceholder: "نام شما",
         email: "ایمیل",
         emailPlaceholder: "you@example.com",
         emailHint: "برای دریافت اطلاعیه‌های سفارش",
         steamId: "Steam ID",
         steamIdPlaceholder: "STEAM_0:1:12345678",
         tradeUrl: "آدرس معامله استیم",
         tradeUrlPlaceholder: "https://steamcommunity.com/tradeoffer/...",
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
    * /products and /products/[id] — the storefront catalog.
    * Product titles, descriptions and category names come from the backend and
    * are therefore NOT translated here; only the UI chrome around them is.
    */
   products: {
      metaTitle: "محصولات",
      metaDescription: "کاتالوگ محصولات ما را مرور کنید.",
      detailMetaTitle: "محصول — Shopify",
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
      freeShipping: "ارسال رایگان برای سفارش‌های بالای ۵۰ دلار",
      returnPolicy: "سیاست بازگشت ۳۰ روزه",

      // --- Detail tabs ---
      tabs: {
         description: "توضیحات",
         details: "جزئیات",
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

      /** Value propositions. */
      features: {
         title: "چرا فروشگاه ما؟",
         subtitle: "هر چیزی که برای یک خرید امن و بی‌دردسر لازم دارید.",
         items: {
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
         },
      },

      /** Weapon-class showcase grid. */
      categories: {
         title: "مرور بر اساس دسته‌بندی",
         subtitle: "از تفنگ‌های سوزنی تا اسنایپر و کلت‌های کلاسیک، دسته مورد نظر خود را انتخاب کنید.",
         cta: "مشاهده همه محصولات",
         /**
          * Keys are the category directory names under
          * public/images/weapons-real/skins, so they must stay in sync with
          * GET /api/categories. Values are what users see.
          */
         labels: {
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
         } as Record<string, string>,
         empty: "هنوز محصولی در کاتالوگ ثبت نشده است.",
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
      shellTitle: "Shopify Admin",
      /** /admin — the dashboard landing page. */
      dashboard: {
         metaTitle: "داشبورد — Shopify Admin",
         metaDescription: "داشبورد مدیریت — مدیریت فروشگاه، محصولات و کاربران.",
         title: "داشبورد",
         subtitle: "به فضای کاری مدیریت خوش آمدید. یک بخش را از نوار کناری انتخاب کنید.",
         quickActionsTitle: "دسترسی سریع",
         quickActionsSubtitle: "میانبر به پرکاربرد‌ترین بخش‌های پنل مدیریت.",
         quickActions: {
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
      productsLoadError: { title: "بارگذاری محصولات ناموفق بود" },

      // --- Users ---
      users: {
         metaTitle: "کاربران — Shopify Admin",
         metaDescription: "مدیریت کاربران — مشاهده، ویرایش و کنترل حساب‌های کاربری.",
         title: "کاربران",
         subtitle: "همه افراد ثبت‌نام‌شده در فروشگاه شما.",
         total: "{count} کاربر",
         headers: {
            user: "کاربر",
            contact: "تماس",
            joined: "تاریخ عضویت",
            permission: "سطح دسترسی",
         },
         idLabel: "شناسه",
      },
      usersEmpty: {
         outOfRangeTitle: "در این صفحه کاربری وجود ندارد",
         outOfRangeBody: "صفحه‌ای که درخواست کردید وجود ندارد.",
         goToFirstPage: "رفتن به صفحه ۱",
         noUsersTitle: "هنوز کاربری وجود ندارد",
         noUsersBody: "کاربران جدید پس از ثبت‌نام، اینجا نمایش داده می‌شوند.",
      },

      // --- Products ---
      products: {
         metaTitle: "محصولات — Shopify Admin",
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
            "بازار ایرانی اسکین‌های CS2 و کلیدهای TF2؛ با کیف پل تومانی، قیمت‌گذاری لحظه‌ای و تحویل مستقیم به لینک ترید شما.",
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
    * Placeholder copy for routes that the footer links to but that are not
    * built yet. Each one renders a real page rather than a 404, so the footer
    * never dead-ends.
    */
   comingSoon: {
      /** Heading on the placeholder panel. The page title is already in PageHero. */
      heading: "به‌زودی",
      contact: {
         title: "تماس با ما",
         subtitle: "برای هر پرسشی درباره سفارش، تحویل یا حساب کاربری با ما در تماس باشید.",
         body: "این صفحه در حال آماده‌سازی است. تا آن زمان می‌توانید از پشتیبانی تلگرام استفاده کنید.",
      },
      about: {
         title: "درباره ما",
         subtitle: "شاپیفای یک بازار ایرانی برای خرید و فروش اسکین‌های CS2 است.",
         body: "داستان و تیم ما به‌زودی روی این صفحه منتشر می‌شود.",
      },
      blog: {
         title: "بلاگ",
         subtitle: "راهنماها، اخبار و نکات دنیای CS2.",
         body: "اولین مطلب‌های بلاگ در حال آماده‌سازی است.",
      },
      rules: {
         title: "قوانین و مقررات",
         subtitle: "شرایط استفاده از بازار شاپیفای.",
         body: "متن کامل قوانین به‌زودی منتشر می‌شود.",
      },
      verify: {
         title: "چرا احراز هویت؟",
         subtitle: "احراز هویت کمک می‌کند خرید و تحویل شما امن بماند.",
         body: "راهنمای کامل احراز هویت به‌زودی در این صفحه قرار می‌گیرد.",
      },
      tradeLink: {
         title: "لینک ترید چیست؟",
         subtitle: "راهنمای ساخت و استفاده از لینک ترید استیم.",
         body: "برای ثبت لینک ترید خود، به بخش پروفایل در پنل کاربری بروید. راهنمای کامل به‌زودی منتشر می‌شود.",
      },
      sell: {
         title: "فروش اسکین CS2",
         subtitle: "اسکین‌های خود را به ما بفروشید.",
         body: "فرم ثبت درخواست فروش به‌زودی راه‌اندازی می‌شود.",
      },
      prime: {
         title: "خرید پرایم CS2",
         subtitle: "پرایم CS2 را با کیف پل تومانی بخرید.",
         body: "این بخش در حال آماده‌سازی است.",
      },
      knives: {
         title: "چاقوها",
         subtitle: "خرید چاقوهای CS2.",
         body: "دسته‌بندی چاقوها به‌زودی به فروشگاه اضافه می‌شود.",
      },
      gloves: {
         title: "دستکش‌ها",
         subtitle: "خرید دستکش‌های CS2.",
         body: "دسته‌بندی دستکش‌ها به‌زودی به فروشگاه اضافه می‌شود.",
      },
      tf2Keys: {
         title: "کلید TF2",
         subtitle: "خرید کلید Team Fortress 2.",
         body: "این بخش در حال آماده‌سازی است.",
      },
      withdrawals: {
         title: "برداشت وجه",
         subtitle: "برداشت موجودی کیف پول.",
         body: "درخواست‌های برداشت به‌زودی فعال می‌شوند.",
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

/** Placeholder destinations that already have labels in the dictionary. */
export const faNavLinks: NavLink[] = [
   { name: fa.links.orders, href: "/orders" },
   { name: fa.links.cart, href: "/cart" },
]

/**
 * Persian label for an admin sidebar entry, looked up by href.
 * Falls back to the label in `lib/adminNavigation.ts` so a new route never
 * renders blank while its translation is still missing.
 */
export function faAdminNavLabel(href: string, fallback: string): string {
   const labels = fa.admin.nav as Record<string, string | undefined>
   return labels[href] ?? fallback
}
