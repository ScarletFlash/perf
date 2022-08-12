type UnicodeIndex = `U+${number | string}`;

interface Params {
  rangeStart: UnicodeIndex;
  rangeEnd: UnicodeIndex;
}

export function getRandomUnicodeCharFromRange({ rangeStart }: Params): string {
  const leftMarkRegExp: RegExp = new RegExp(/$\U\+/);
  const rangeStartHex: number = Number.parseInt(rangeStart.replace(leftMarkRegExp, ''), 16);
  // const rangeEndHex: number = Number.parseInt(rangeEnd.replace(leftMarkRegExp, ''), 16);

  //   const rangeStart: number = 0x1f600;
  //   const rangeEnd: number = 0x1f64f;

  // const rangeSize: number = rangeEndHex - rangeStartHex + 1;
  // const randomCharIndex: number = Math.floor(rangeStartHex + Math.random() * rangeSize);

  // const randomCharHexCode: string = (0x10000 + randomCharIndex).toString(16).substring(-4).toUpperCase();
  // const resultChar: string = String.fromCharCode(Number.parseInt(randomCharHexCode, 16));

  // console.log({
  //   rangeEnd,
  //   rangeStart,
  //   resultChar,
  //   randomCharIndex,
  //   randomCharHexCode
  // });
  // return resultChar;

  return String.fromCharCode(rangeStartHex);
}
