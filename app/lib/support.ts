/**
 * Support contact details.
 *
 * Configuration rather than copy, so they live in code instead of `fa.ts` - the
 * same split the footer uses for its own links. They live in one module because
 * the footer, the contact page and the closing CTA bands all need to point at
 * the same place, and a support handle repeated in four files is a support
 * handle that will eventually disagree with itself.
 */

/** The only support channel that is actually staffed right now. */
export const SUPPORT_TELEGRAM_URL = "https://t.me/itemestoon_support"

/**
 * The Telegram bot the store buys TF2 keys through.
 *
 * This is a store *buying*, not supporting: the keys page's "sell to us" card
 * hands the customer to the bot, which walks them through pricing and the
 * Steam trade. It stays separate from `SUPPORT_TELEGRAM_URL` because the two
 * conversations disagree - one is a manned help desk, the other an automated
 * counter-offer flow - and pointing hopeful sellers at a support inbox would
 * strand them.
 */
export const SELL_TELEGRAM_BOT_URL = "https://t.me/biastore_bot"

/**
 * Support mailbox.
 *
 * Deliberately empty: no mailbox has been provisioned for the store yet, and a
 * `mailto:` that bounces is worse than no email card at all. Anything that
 * renders this must skip the email option while it is empty, so putting an
 * address in here is what switches the channel on.
 */
export const SUPPORT_EMAIL = ""

/**
 * True when there is a reachable address behind `SUPPORT_EMAIL`.
 *
 * Call sites read this instead of testing the string themselves, so the "skip
 * the channel while empty" rule is stated once.
 */
export const hasSupportEmail = SUPPORT_EMAIL.trim().length > 0

/** `mailto:` href, or an empty string when no mailbox is configured. */
export const supportMailtoHref = hasSupportEmail ? `mailto:${SUPPORT_EMAIL}` : ""

/**
 * The support chat with a message already written into the composer.
 *
 * Prime and TF2 keys cannot be checked out - there is no order-creation or
 * wallet-debit path - so their pages hand the selection to a human instead of
 * pretending to charge a wallet. Telegram's `?text=` parameter opens the
 * conversation with the draft filled in, which is what turns the calculator into
 * a real action rather than a dead end.
 */
export function supportTelegramWithText(message: string): string {
   return `${SUPPORT_TELEGRAM_URL}?text=${encodeURIComponent(message)}`
}
