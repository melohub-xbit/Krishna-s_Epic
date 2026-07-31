const TELUGU_DIGITS = ["౦", "౧", "౨", "౩", "౪", "౫", "౬", "౭", "౮", "౯"];

/**
 * Telugu numerals. Shared because two places number things — the book's page
 * counter and the chapter index on each epic page — and they must agree.
 */
export function teluguNum(n: number) {
  return String(n)
    .split("")
    .map((d) => TELUGU_DIGITS[Number(d)] ?? d)
    .join("");
}
