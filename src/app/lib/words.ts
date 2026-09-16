const SMALL_NUMBERS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty",
];

/** "eleven" for 11, "21" for anything above twenty. */
export function numberWord(n: number): string {
  return Number.isInteger(n) && n >= 0 && n < SMALL_NUMBERS.length
    ? SMALL_NUMBERS[n]
    : String(n);
}

/** "Eleven" for 11. */
export function numberWordCapitalized(n: number): string {
  const word = numberWord(n);
  return word.charAt(0).toUpperCase() + word.slice(1);
}
