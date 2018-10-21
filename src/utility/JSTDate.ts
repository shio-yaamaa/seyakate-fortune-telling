import * as moment from 'moment-timezone';

moment.tz.setDefault('Asia/Tokyo');

class JSTDate {
  private year: number;
  private month: number; // 0-11
  private date: number; // 1-28, 29, 30, 31 depending on the month

  private constructor(year: number, month: number, date: number) {
    this.year = year;
    this.month = month;
    this.date = date;
  }

  public static today(): JSTDate {
    const jstMoment = moment();
    return new JSTDate(jstMoment.year(), jstMoment.month(), jstMoment.date());
  }

  public toDBNumber(): number {
    return this.year * 10 ** 4 + this.month * 10 ** 2 + this.date;
  }

  public static fromDBNumber(dbNumber: number): JSTDate {
    const year = Math.floor(dbNumber / 10 ** 4);
    const month = Math.floor((dbNumber % 10 ** 4) / 10 ** 2);
    const date = dbNumber % 10 ** 2;
    return new JSTDate(year, month, date);
  }

  public toDisplayString(): string {
    return `${this.year}-${this.month + 1}-${this.date}`;
  }

  // Used as keys in render() to identify list elements
  public toKeyString(): string {
    return `${this.year}-${this.month}-${this.date}`;
  }

  public isToday(): boolean {
    const today = JSTDate.today();
    return this.year === today.year && this.month === today.month && this.date === today.date;
  }
}

export default JSTDate;