export enum Char {
  Se = 0, Ya, Ka, Te
}

export default class Result {
  public distance: number;

  public static seyakate: [Char, Char, Char, Char] = [Char.Se, Char.Ya, Char.Ka, Char.Te];

  private static charMap = new Map<Char, string>([
    [Char.Se, 'せ'],
    [Char.Ya, 'や'],
    [Char.Ka, 'か'],
    [Char.Te, 'て']
  ]);

  private chars: [Char, Char, Char, Char];

  private constructor(char1: Char, char2: Char, char3: Char, char4: Char) {
    this.chars = [char1, char2, char3, char4];
    this.distance = Result.computeDistance(this.chars, Result.seyakate);
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

  private static computeDistance(source: [Char, Char, Char, Char], destination: [Char, Char, Char, Char]) {
    // Create a cost matrix whose row and column indices correspond to the Char enum's values.
    // Row represents the source and column represents the destination of the substitution.
    // Identical Chars: 0, Chars with the same vowel: 1, Other combinations: 2
    const substitutionCostMetrix = [
      [0, 2, 2, 1],
      [2, 0, 1, 2],
      [2, 1, 0, 2],
      [1, 2, 2, 0]
    ];

    return source.reduce((accumulator, current, index) => {
      return accumulator + substitutionCostMetrix[current][destination[index]];
    }, 0);
  }
}