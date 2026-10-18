# Integrations — payment, SMS, Steam

Three external services sit behind configuration, not code. Each is either
already written behind an env switch or is a **single seam** in one file, so
connecting any of them is filling in credentials — not re-plumbing the shop.

| Integration | State | The switch |
|---|---|---|
| Payment (Zarinpal) | written, dormant | `PAYMENT_PROVIDER=zarinpal` |
| SMS verification | dev-mode console only | replace one function |
| Steam sign-in | written, tested, dormant | `AUTH_PROVIDER=steam` |

Every file referenced below exists in the tree today. Nothing here plans future
work.

---

## 1. Payment gateway — Zarinpal

### Why the wallet is the only thing a gateway touches

A gateway can only ever **credit the shop's Toman wallet** — it never pays for
an order. Checkout prices the cart live and debits the wallet in one
transaction; a "pay the gateway directly" order path would need a third
refusal/refund mechanic the order book does not have. One funding funnel keeps
every Toman traceable to one ledger.

### What is already written

| Piece | Where |
|---|---|
| Provider interface + "which gateway is on" picker (`state()`, sandbox aware) | `shopify-back/app/services/payments/index.js` |
| Zarinpal adapter (request + server-to-server settle, replay-safe) | `shopify-back/app/services/payments/zarinpal.js` |
| "Not configured" adapter that 503s instead of dead-ending the customer | `shopify-back/app/services/payments/unconfigured.js` |
| Routes: `GET /payments/config`, `POST /payments/intents`, `GET /payments/callback`, `GET /payments/intents` | `shopify-back/routes/payments.js` |
| Intent ledger (`provider, amount, status, authority, reference_id`) | `payment_intents` table, `app/db/repos/paymentIntent.js` |
| Storefront button that reads `/payments/config` | `app/(myPages)/panel/wallet/*` |

### The end-to-end flow

1. Customer opens `/panel/wallet` → the top-up card asks `GET /payments/config`
   for `{ provider, configured, sandbox, bounds }`.
   **While nothing is connected the store answers "not configured"** and the
   storefront hides the real top-up; the demo top-up in `routes/wallet.js`
   keeps working on top of it.
2. `POST /payments/intents { amount }` → `payment_intents` row is written
   **before** the provider is called (the authority from Zarinpal is stamped
   onto a row that already exists - a crash between the two leaves an intent
   nobody paid for, not a payment nobody recorded), then the adapter's
   `request({ amount, description, callbackUrl })` returns a payment URL.
3. The customer pays on Zarinpal and lands on
   `GET /payments/callback?Authority=...&Status=...` — deliberately
   **unauthenticated**, because the browser is never trusted for money: the
   authority is only a lookup key into our own row.
4. `settleTopUp` asks Zarinpal server-to-server to verify that authority for
   the amount **stored on the row**, credits the wallet in one write
   (ledger row `type 'topup'`, reference carrying the intent), and marks the
   intent. Replays answer 101 the same way a success does - a retried callback
   must not fail the customer - but the credit happens exactly once, guarded by
   the row's `status`.
5. The customer is redirected to `/panel/wallet?payment=<status>` with query
   params the wallet page already reads.

### Switching it on

```
# shopify-back/.env
PAYMENT_PROVIDER=zarinpal
PAYMENT_MERCHANT_ID=            # Zarinpal panel → merchant ID (UUID)
PAYMENT_CALLBACK_URL=https://your-domain/api/payments/callback
PAYMENT_SANDBOX=true
```

`PAYMENT_CALLBACK_URL` is configured rather than derived from the request, so a
proxied request cannot choose where the money reports back. The sandbox flag
points the adapter at Zarinpal's sandbox host with the panel's test merchant.

**Go-live checklist**

1. [x] `GET /payments/config` returns `{ configured: true, sandbox: true }`.
2. [x] One sandbox top-up: intent row `pending` → gateway → callback lands on
       the wallet page → ledger shows `topup` for the exact amount.
3. [x] Re-firing the callback URL twice credits exactly once (replay 101).
4. [x] Declined sandbox payment marks the intent `failed` cleanly.
5. [ ] Fill the **live** merchant ID, set `PAYMENT_SANDBOX=false`, redeploy, and
       repeat steps 1–3 with the smallest real amount.

Nothing storefront-side changes: the wallet card reads `/payments/config` per
request and turns itself on.

---

## 2. SMS verification — SMS.ir (or Kavenegar)

### The single seam

Phone verification lives in one module with one delivery function:

```
shopify-back/app/services/phoneVerification.js   →   function deliver(phone, code, context)
```

Today it prints `{ id, phone, code, purpose }` to the backend terminal so a
human can finish the dev flow. `issueCode()` writes the hashed-challenge row,
`consumeCode()` bounds it to 10 minutes and 5 wrong guesses, and a sweeper
cleans expired rows - none of that is involved in this swap. **Replace
`deliver`'s body and nothing else in the file.**

### What `deliver` must become (SMS.ir)

SMS.ir's verification endpoint fits this exactly: the provider panel owns one
approved template (that owns the message text), and the code is injected as a
named parameter. Using the same global `fetch` the Zarinpal adapter uses:

```js
// Position: replace the body of deliver() in app/services/phoneVerification.js
function deliver(phone, code, context) {
    // In dev, keep the terminal copy too - production can comment it out.
    console.log({ id: context.id, phone, code, purpose: context.purpose });

    fetch('https://api.sms.ir/v1/send/verify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-API-KEY': process.env.SMS_API_KEY ?? '',
        },
        body: JSON.stringify({
            mobile: phone,
            templateId: Number(process.env.SMS_TEMPLATE_ID ?? 0),
            parameters: [{ name: 'CODE', value: String(code) }],
        }),
    })
        .then(async (res) => {
            if (!res.ok) throw new Error(`SMS.ir answered ${res.status}`);
            const body = await res.json();
            if (body?.status !== 1) throw new Error(`SMS.ir status ${body?.status}: ${body?.message ?? ''}`);
        })
        .catch((err) => {
            // Never fail the HTTP request because a text did not go out: the
            // challenge row already exists and can be re-requested. Log loudly
            // instead - a silent delivery gap is worse than a visible one.
            console.error('[phone-verification] SMS delivery failed', err);
        });
}
```

Environment:

```
# shopify-back/.env
SMS_API_KEY=          # SMS.ir panel → API-KEYs section
SMS_TEMPLATE_ID=      # the "verification" template's numeric ID
```

### If you use Kavenegar instead

Same seam, different base URL and param shape:

```js
// Position: replace the body of deliver() in app/services/phoneVerification.js
function deliver(phone, code, context) {
    // In dev, keep the terminal copy too - production can comment it out.
    console.log({ id: context.id, phone, code, purpose: context.purpose });

    fetch(`https://api.kavenegar.com/v1/${process.env.SMS_API_KEY}/verify/lookup.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            receptor: phone,
            token: String(code),
            template: process.env.SMS_TEMPLATE_NAME ?? '',
        }),
    })
        .then(async (res) => {
            if (!res.ok) throw new Error(`Kavenegar answered ${res.status}`);
            // Kavenegar answers 200 for some carrier-level rejections too, so the
            // body's own status decides whether a text actually went out.
            const body = await res.json();
            if (Number(body?.return?.status) !== 200) {
                throw new Error(`Kavenegar return status ${body?.return?.status}: ${body?.return?.message ?? ''}`);
            }
        })
        .catch((err) => {
            console.error('[phone-verification] SMS delivery failed', err);
        });
}
```

### Operator notes that the code will not do for you

- **Firewall the sender.** `issueCode()` has no per-phone throttle of its own;
  the `MAX_ATTEMPTS = 5` bound stops guessing, not SMS spend. Until traffic
  justifies more, put a plain per-phone limiter in front of
  `POST /auth/request-code` (one code per phone per minute is the usual first
  line), or the provider's panel-side daily cap will be your limiter.
- **Template, not free text.** Both providers deliver OTPs through approved
  templates; the free-text send paths are for receipts, not codes.
- **Keep the dev console copy during rollout.** The `deliver` above still logs;
  delete that line the week the provider is proven, not before.

### Verifying the swap

1. Request a code from the login page → the provider's panel shows the send,
   the phone gets `CODE <code>` per the template.
2. Enter a wrong code 5× → the challenge is destroyed (no more attempts).
3. Enter the right code within 10 min → sign-in completes.
4. Request a second code → the first stops working (`deletePendingFor`).

---

## 3. Steam sign-in

Steam authentication is **built, tested and switched off**. The full
runbook - including the two Valve-issued credentials, the registered domain
requirement, the exact cutover order and the `phone` rollback - lives in
[`docs/steam-auth-cutover.md`](./steam-auth-cutover.md). Read that before touching anything.

The short shape of it:

```
# shopify-back/.env
AUTH_PROVIDER=steam
STEAM_OPENID_PUBLIC_KEY=   # Valve's PEM signing key, newlines as \n
STEAM_API_KEY=             # https://steamcommunity.com/dev/apikey (optional: name + avatar)
STEAM_RETURN_URL=          # https://your-domain/auth/steam/callback  (must be registered at Steamworks)
STEAM_REALM=               # the site shown on Steam's authorise screen
```

- `AUTH_PROVIDER=phone` is the rollback at every point; the phone flow stays
  mounted either way, and checkout still demands a phone number.
- The storefront adapts by itself: the login form asks the backend
  `GET /auth/mode` which sign-in it is being served, so no storefront changes
  ship with the cutover.
- Identity is the **SteamID64**, never the persona name (names are changeable
  and colliding); the Web API key only decorates the account with a name and
  picture.

---

## Where `.env` values live

`shopify-back/.env.example` documents every key above with the same comments
this file repeats. Copy it to `.env` and fill; in a container pass real
environment variables instead - dotenv simply finds no file and reads the
process.

The frontend needs no new keys for any of these: `FRONTEND_URL` (already in the
backend env) is what the payment callback redirects to and what Steam's OpenID
return URL points at.
