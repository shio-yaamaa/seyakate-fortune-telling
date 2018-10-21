import Dexie from 'dexie';
import Result from './Result';
import JSTDate from './JSTDate';
import { arrayEqual } from './utility';
import { DEFAULT_NAME } from './constants';

interface ConfigEntry {
  key: string | null;
  value: string | null;
}

interface ResultEntry {
  date: number; // Not a JSTDate object since it's a primary key
  chars: [number, number, number, number];
  distance: number;
}

class LocalDatabase extends Dexie {
  private configs: Dexie.Table<ConfigEntry, string>
  private results: Dexie.Table<ResultEntry, number>

  constructor() {
    super('LocalDatabase');

    // The first entry represents the primary key of the table
    this.version(1).stores({
      configs: 'key, value',
      results: 'date, chars, distance'
    });

    // Executed only when the DB is newly created
    this.on('populate', () => {
      this.configs.add({key: 'name', value: DEFAULT_NAME});
      this.configs.add({key: 'subscriptionId', value: null});
    });
  }

  // Name

  public async getName(): Promise<string | null> {
    const nameEntry = await this.configs.get('name');
    return nameEntry ? nameEntry.value : null;
  }

  public async setName(name: string) {
    await this.configs.put({key: 'name', value: name});
  }

  // Subscription ID

  public async getSubscriptionId(): Promise<string | null> {
    const subscriptionIdEntry = await this.configs.get('subscriptionId');
    return subscriptionIdEntry ? subscriptionIdEntry.value : null;
  }

  public async getIsNotificationEnabled(): Promise<boolean> {
    return await this.getSubscriptionId() !== null;
  }

  public async setSubscriptionId(id: string) {
    await this.configs.put({key: 'subscriptionId', value: id});
  }

  public async unsetSubscription() {
    await this.configs.put({key: 'subscriptionId', value: null});
  }

  // Results

  public async getResult(date: JSTDate): Promise<Result | null> {
    const resultEntry = await this.results.get(date.toDBNumber());
    return resultEntry ? Result.fromChars(resultEntry.chars) : null;
  }

  // Results are sorted in reverse chronological order
  public async getRecentResultsWithDates(count: number): Promise<Map<JSTDate, Result>> {
    const resultEntries = await this.results
      .orderBy('date')
      .reverse()
      .offset(1) // Skip today's result
      .limit(count)
      .toArray();
    return new Map<JSTDate, Result>(resultEntries.map(entry => {
      // Requres type assertion since TypeScript infers [JSTDate, Result] is of type (JSTDate | Result)[]
      return [JSTDate.fromDBNumber(entry.date), Result.fromChars(entry.chars)] as [JSTDate, Result];
    }));
  }

  public async getSeyakateCount(): Promise<number> {
    return await this.results
      .filter(result => {
        return arrayEqual(result.chars, Result.seyakate);
      })
      .count();
  }

  // Returns a map of results and their counts
  public async getResultsFilteredByDistance(distance: number): Promise<Map<Result, number>> {
    const closeResultEntries = await this.results
      .where({ distance })
      .toArray();

    // TODO: Inefficient implementation; Need to store chars as a string to efficiently bundle up identical results
    const charsCountMap = new Map<[number, number, number, number], number>(); // Keys are result.chars
    for (const resultEntry of closeResultEntries) {
      for (const key of charsCountMap.keys()) {
        if (arrayEqual(key, resultEntry.chars)) {
          charsCountMap.set(key, charsCountMap.get(key)! + 1);
          break;
        }
      }
      charsCountMap.set(resultEntry.chars, 1);
    }
    
    const mapElements = Array.from(charsCountMap.entries()).map(([chars, count]) => {
      return [Result.fromChars(chars), count] as [Result, number];
    });

    return new Map<Result, number>(mapElements);
  }

  public async setTodaysResult(result: Result) {
    const date = JSTDate.today().toDBNumber();
    await this.results.put({
      date,
      chars: result.toChars(),
      distance: result.distance
    });
  }
}

export default new LocalDatabase();