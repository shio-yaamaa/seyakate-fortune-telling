import Result from '../utility/Result';

class NotificationManager {
  private tag = 'seyakate-fortune-telling';

  public async showNotification(registration: ServiceWorkerRegistration, result: Result, isSilent: boolean): Promise<void> {
    return registration.showNotification(result.toString(), {
      tag: this.tag,
      icon: '/logo.png',
      badge: '/notification-badge.png',
      silent: isSilent
    });
  }
  
  public handleClick(event: NotificationEvent, clients: Clients) {
    clients.openWindow(process.env.REACT_APP_DEPLOY_URL!);
    event.notification.close();
  }
}

export default new NotificationManager();