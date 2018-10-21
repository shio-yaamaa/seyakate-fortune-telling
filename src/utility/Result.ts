import { arrayEqual } from './utility';

export enum Char {
  Se = 0, Ya, Ka, Te
}

export default class Result {
  public distance: number;

  public static seyakate = [Char.Se, Char.Ya, Char.Ka, Char.Te];

  private static charMap = new Map<Char, string>([
    [Char.Se, 'せ'],
    [Char.Ya, 'や'],
    [Char.Ka, 'か'],
    [Char.Te, 'て']
  ]);

  private chars: [Char, Char, Char, Char];

  private constructor(char1: Char, char2: Char, char3: Char, char4: Char) {
    this.chars = [char1, char2, char3, char4];
    this.distance = Result.calculateDistance(this.chars);
  }

  // The string may optionally contain "工藤" at the end.
  public static fromString(originalString: string): Result {
    const chars: [Char, Char, Char, Char] = [Char.Se, Char.Se, Char.Se, Char.Se];

    if (originalString.length < 4) throw Error('The string is too short');
    for (let i = 0; i < 4; i++) {
      const char: Char | null = Array.from(Result.charMap.entries()).reduce((accumulator, current) => {
        return current[1] === originalString[i] ? current[0] : accumulator;
      }, null);
      if (char === null) throw Error('Invalid character');
      chars[i] = char;
    }

    return new Result(...chars);
  }

  public toString(): string {
    return this.chars.map(char => Result.charMap.get(char)).join('') + '工藤';
  }

  public static fromChars(numbers: [number, number, number, number]): Result {
    return new Result(...numbers);
  }

  public toChars(): [number, number, number, number] {
    return this.chars;
  }

  // Returns the distance from "せやかて"
  // Distance is:
  //   0 if exactly the same
  //   1 (惜しい) if only one substitution, rotation, or swap is needed
  //   2 (ちょっと惜しい) if two substitutions are needed or the chars have all the variation
  //   3 otherwise
  private static calculateDistance(chars: [Char, Char, Char, Char]): number {
    const substitutionCount = chars.reduce((accumulator, current, index) => {
      return accumulator + (current === Result.seyakate[index] ? 0 : 1);
    }, 0);

    // 0 or 1 substitutions
    if (substitutionCount <= 1) {
      return substitutionCount;
    }

    // 1 rotation to either direction
    const rotatedLeft = [chars[1], chars[2], chars[3], chars[0]];
    const rotatedRight = [chars[3], chars[0], chars[1], chars[2]];
    if (arrayEqual(rotatedLeft, Result.seyakate) || arrayEqual(rotatedRight, Result.seyakate)) {
      return 1;
    }

    // 1 swap
    const swap1 = [chars[1], chars[0], chars[2], chars[3]];
    const swap2 = [chars[0], chars[2], chars[1], chars[3]];
    const swap3 = [chars[0], chars[1], chars[3], chars[2]];
    if (arrayEqual(swap1, Result.seyakate) || arrayEqual(swap2, Result.seyakate) || arrayEqual(swap3, Result.seyakate)) {
      return 1;
    }

    // 2 substitutions
    if (substitutionCount === 2) {
      return substitutionCount;
    }

    // All variation
    if (arrayEqual([...chars].sort(), Result.seyakate)) {
      return 2;
    }

    return 3;
  }
}