interface RangeOptions {
  min: number;
  max: number;
}

export function getIntegerInRange(input: number, { min, max }: RangeOptions): number {
  const roundedInteger: number = Math.round(input);

  if (roundedInteger < min) {
    return min;
  }

  if (roundedInteger > max) {
    return max;
  }

  return roundedInteger;
}
