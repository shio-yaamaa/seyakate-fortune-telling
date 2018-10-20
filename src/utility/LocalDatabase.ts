import Dexie from 'dexie';
import Result from './Result';
import JSTDate from './JSTDate';
import { DEFAULT_NAME } from './constants';

interface ConfigEntry {
  key: string | null,
  value: string | null
}

interface ResultEntry {
  date: number, // Not a JSTDate object since it's a primary key
  chars: [number, number, number, number]
}

class LocalDatabase extends Dexie {
  private configs: Dexie.Table<ConfigEntry, string>
  private results: Dexie.Table<ResultEntry, number>

  constructor() {
    super('LocalDatabase');

    // The first entry represents the primary key of the table
    this.version(1).stores({
      configs: 'key, value',
      results: 'date, chars'
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
      return ([JSTDate.fromDBNumber(entry.date), Result.fromChars(entry.chars)] as [JSTDate, Result]);
    }));
  }

  // Results are not sorted
  public async getAllResults(): Promise<Result[]> {
    return (await this.results.toArray()).map(entry => Result.fromChars(entry.chars));
  }

  public async setTodaysResult(result: Result) {
    const date = JSTDate.today().toDBNumber();
    await this.results.put({date, chars: result.toChars()});
  }
}

export default new LocalDatabase();