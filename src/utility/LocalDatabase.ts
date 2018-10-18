import Dexie from 'dexie';
import Result from './Result';
import JSTDate from './JSTDate';

interface ConfigEntry {
  key: string | null,
  value: string | null
}

interface ResultEntry {
  date: number,
  result: Result
}

class LocalDatabase extends Dexie {
  private configs: Dexie.Table<ConfigEntry, string>
  private results: Dexie.Table<ResultEntry, number>

  constructor() {
    super('LocalDatabase');

    // The first entry represents the primary key of the table
    this.version(1).stores({
      configs: 'key, value',
      results: 'date, result'
    });

    // Executed only when the DB is newly created
    this.on('populate', () => {
      this.configs.add({key: 'name', value: null});
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

  // Subscription

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

  // Result

  public async addTodaysResult(result: Result) {
    const date = JSTDate.today().toDBNumber();
    await this.results.put({date, result}, date);
  }

  // async getAllResults(): Promise<Result[]>
}

export default new LocalDatabase();