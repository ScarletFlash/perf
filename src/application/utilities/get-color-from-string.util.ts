/* eslint-disable no-bitwise */
export function getColorFromString(input: string): string {
  const hash: number = input
    .split('')
    .map((char: string) => char.charCodeAt(0))
    .reduce((accumulatedHash: number, charCode: number) => charCode + ((accumulatedHash << 5) - accumulatedHash), 0);

  const resultColorCode: string = new Array(3)
    .fill(null)
    .map((_: null, index: number) => (hash >> (index * 8)) & 0xff)
    .reduce(
      (accumulatedColorCode: string, colorCodeSection: number) =>
        String(`${accumulatedColorCode}00${colorCodeSection.toString(16)}`).substring(-2),
      '#'
    );

  return resultColorCode;
}
