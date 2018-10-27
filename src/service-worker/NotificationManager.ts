import Result from '../utility/Result';

class NotificationManager {
  private tag = 'seyakate-fortune-telling';

  showNotification(registration: ServiceWorkerRegistration, result: Result, isSilent: boolean) {
    registration.showNotification(result.toString(), {
      tag: this.tag,
      icon: '/logo.png',
      badge: '/notification-badge.png',
      silent: isSilent
    });
  }
  
  handleClick(event: NotificationEvent, clients: Clients) {
    clients.openWindow(process.env.REACT_APP_DEPLOY_URL!);
    event.notification.close();
  }
}

export default new NotificationManager();