"use client"

import { useSyncExternalStore } from "react"

// Never called: this hook exists to detect hydration completion, not to listen
// to anything.
const subscribe = () => () => {}

const getSnapshot = () => true
const getServerSnapshot = () => false

/**
 * True only once this component has finished hydrating.
 *
 * React hydrates the shell synchronously and defers inner boundaries, so
 * AuthHydrator's effect (it lives in the shell) dispatches *before* a deferred
 * subtree has hydrated. Gating on the Redux `hydrated` flag is therefore not
 * enough — by then the flag is already true while React is still comparing that
 * subtree against the server HTML, which is what produced "server rendered text
 * didn't match the client" in the header nav.
 *
 * useSyncExternalStore is used instead of a useEffect + setState pair because
 * React consults `getServerSnapshot` for the hydration render and only switches
 * to `getSnapshot` once hydration has finished. The flag therefore cannot
 * change mid-hydration by construction, and it needs no effect.
 *
 * The one-frame delay is the same as the old behaviour; the difference is that
 * the pre-hydration render now provably matches the server.
 */
export function useMounted(): boolean {
   return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export default useMounted