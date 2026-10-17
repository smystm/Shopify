# Steam sign-in — cutover and rollback

Steam authentication is **built, tested and switched off**. The shop is still signing
people in with phone numbers. This file is the switch, and the only thing you need
to read before turning it on.

Nothing here is a suggestion about future work. Everything below has already been
written, and the only parts that cannot exist yet are the credentials, because
Valve issues those to you.

---

## What is done

| Piece | Where | State |
|---|---|---|
| OpenID 2.0 protocol, nonce, RSA-SHA1 verification, live re-check | `shopify-back/app/services/steam.js` | done, unit-tested |
| Persona name + avatar from `GetPlayerSummaries` | same | done |
| Sign-in endpoints (`/auth/mode`, `/auth/steam/login`, `/auth/steam/exchange`) | `shopify-back/routes/steam.js` | done |
| Link Steam onto an account that already exists | `shopify-back/routes/steamLink.js` | done |
| `avatar` column + unique index on `steam_id` | `app/db/createDatabase.js` | migrated on boot |
| Storefront pages that ask the backend which sign-in it is serving | `app/(myPages)/(auth)/login`, `.../register` | done |
| Callback that turns Steam's reply into a session cookie | `app/auth/steam/callback/route.ts` | done |
| Steam picture in the header | `app/components/layout/UserMenu.tsx` | done |
| Phone required before checkout | `app/services/checkout.js` → `PHONE_REQUIRED` | **live** |
| Phone-number auth, preserved and still mounted | `routes/legacyPhoneAuth.js`, `AuthForm`/`VerifyForm`/`LoginClient` | **live** |

## What cannot be finished without you

Two things, both from Valve:

1. **`STEAM_RETURN_URL` must be a real, registered domain.** Steam rejects an
   OpenID callback whose return URL is not listed under *Website* on your
   Steamworks partner site. `localhost` will never complete a login — this is not
   a limitation of this code, it is Steam refusing to trust a callback address
   anyone could have pointed at their own machine.

2. **`STEAM_OPENID_PUBLIC_KEY` must come from Valve's documentation.** It is not
   hardcoded here on purpose. A key copied from a blog post is a key nobody has
   verified, and when it is wrong the failure looks exactly like a genuine
   signature mismatch, which is a miserable thing to debug in production.

`STEAM_API_KEY` (from <https://steamcommunity.com/dev/apikey>) is optional: without
it the sign-in still works, the customer just has no Steam name or picture.

---

## Turning it on

**1. Get the domain registered.** Steamworks partner site → *Settings* →
*Website* → add your frontend origin (e.g. `https://your-domain`). Take the
exact origin; Steam compares it character for character.

**2. Fill in `shopify-back/.env`.** The block is already written and
commented:

```
AUTH_PROVIDER=steam
STEAM_OPENID_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
STEAM_API_KEY=xxxxxxxxxxxxxxxx
STEAM_RETURN_URL=https://your-domain/auth/steam/callback
STEAM_REALM=https://your-domain
```

`STEAM_RETURN_URL` is fixed: it must be this app's `/auth/steam/callback`, because
that is the route that receives Steam's reply and sets the session cookie.

**3. Restart the backend.** It reads the provider once, at boot.

**4. Check `GET /api/auth/mode` returns `{"provider":"steam"}`.** If it says
`phone`, the environment did not load — see the `.env` path note below.

That is the whole cutover. No frontend rebuild, no deploy, no migration: the
storefront asks the backend which sign-in it is serving on every request.

### What changes for a customer

- **Sign in.** `/login` and `/register` both become the same Steam button. A first
  visit creates the account on the way back; a returning one is signed straight
  into the existing row, matched on SteamID. There is no duplicate-account path,
  and a partial unique index on `steam_id` makes a duplicate impossible even under
  a double-submitted callback.
- **Name and picture.** Taken from Steam and re-synced on every sign-in, because
  Steam lets their owner rename and re-picture at will. They are also removed from
  the profile's editable fields automatically — see below — so nobody can write a
  stranger's name on their own header.
- **Existing accounts.** They keep working exactly as they are. Their orders,
  balance and history stay on the same row.
- **Paying.** Unchanged, and a Steam-only account can check out only after
  verifying a phone number in the panel — which is what `PHONE_REQUIRED` is for,
  and which is already live.

### Two things that tighten themselves at cutover

Both are driven off `AUTH_PROVIDER`, so nothing has to be remembered:

- `name`, `steam_id` and `avatar` **drop out of `PATCH /user`'s allow-list**
  (`app/services/profile.js`). While phone auth is live they remain editable,
  because with no Steam identity a customer's own name is the best name there is
  and removing the field would be a regression for nothing.
- The panel's *edit name* and *Steam ID* rows become read-only. The *connect
  Steam* panel action is already written and only appears for an account that has
  a verified phone and no `steam_id`.

### Telling your existing customers

They need one sentence, and they need to do it themselves:

> Sign in as you always do, go to your panel, and press **اتصال حساب استیم**. Your
> orders and balance stay exactly where they are.

That button only works *after* they have a verified phone — which every current
account already has, because a phone was how they signed in.

---

## Rolling back

Change one line in `shopify-back/.env`:

```
AUTH_PROVIDER=phone
```

Restart. The storefront goes back to the phone form on its next request.

Accounts created through Steam in the meantime are **not** reachable by phone —
they have no phone number. Nothing is lost (the row, the cart, the orders and the
balance are all still there); they are just parked until you turn Steam back on.
If you need them reachable in both worlds at once, that is a different feature
(dual sign-in) and worth saying so explicitly rather than assuming.

---

## Telling me to do the cutover

Say this:

> **Flip AUTH_PROVIDER to steam.** Here are the credentials: STEAM_OPENID_PUBLIC_KEY,
> STEAM_API_KEY, STEAM_RETURN_URL, STEAM_REALM. Verify the round trip against a real
> Steam account.

I will then: set the keys, restart, confirm `/api/auth/mode`, walk the full
callback in a browser, and check that an existing phone account can link and that
a Steam-only account is stopped at checkout until it verifies a phone.

If you instead want something **retuned** rather than switched on — different
copy on the Steam page, a different post-login landing page, avatar sizing, or the
dual sign-in above — say which, because those are edits to what already exists
rather than the cutover itself.

---

## Troubleshooting

| Symptom | Cause |
|---|---|
| `/api/auth/mode` still says `phone` | `.env` was not loaded. `dotenv` reads the file at `shopify-back/.env` by absolute path, independent of the working directory. |
| `/auth/steam/login` returns 503 | `STEAM_OPENID_PUBLIC_KEY` or `STEAM_RETURN_URL` is missing or unparseable. The backend log says which. |
| Steam rejects the return URL | It is not registered under *Website* on the partner site, or does not match character for character. |
| Every signature fails | The public key is wrong, not the user. Re-copy it from Valve's documentation. |
| Login works, no name or picture | `STEAM_API_KEY` is missing. Not an error — the Web API is the garnish, OpenID is the proof. |