export const PRODUCTS_PAGE_SIZE = 10

export function suggestProductNumber(count: number): string {
    return String(count + 1).padStart(4, "0")
}
