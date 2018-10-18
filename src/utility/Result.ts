export enum Char {
  Se = 0, Ya, Ka, Te
}

export default class Result {
  private static charMap = new Map<Char, string>([
    [Char.Se, 'せ'],
    [Char.Ya, 'や'],
    [Char.Ka, 'か'],
    [Char.Te, 'て']
  ]);

  private chars: [Char, Char, Char, Char];

  private constructor(char1: Char, char2: Char, char3: Char, char4: Char) {
    this.chars = [char1, char2, char3, char4];
  }

  // The string may optionally contain "工藤" at the end.
  public static fromString(originalString: string): Result {
    const chars: [Char, Char, Char, Char] = [Char.Se, Char.Se, Char.Se, Char.Se];

    if (originalString.length < 4) throw Error('The string is too short');
    for (let i = 0; i < 4; i++) {
      const char: Char | null = Array.from(Result.charMap.entries()).reduce((accumulator, current) => {
        return current[1] === originalString[i] ? current[0] : accumulator;
      }, null);
      if (!char) throw Error('Invalid character');
      chars[i] = char;
    }

    return new Result(...chars);
  }

  public static fromStorage(numbers: [number, number, number, number]): Result {
    return new Result(...numbers);
  }

  public toString(): string {
    return this.chars.map(char => Result.charMap.get(char)).join('') + '工藤';
  }

  public toStorable(): [number, number, number, number] {
    return this.chars;
  }
}