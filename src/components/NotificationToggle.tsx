import * as React from 'react';
import './NotificationToggle.css';

import requestNotificationPermission from '../utility/requestNotificationPermission';

interface NotificationToggleProps {
  // isNotificationEnabled: boolean;
  toggleNotification: (enable: boolean) => void;
}
 
class NotificationToggle extends React.Component<NotificationToggleProps> {
  private isSupported: boolean; // If the browser supports push-notification-related APIs

  constructor(props: NotificationToggleProps) {
    super(props);
    this.isSupported = 'serviceWorker' in navigator
      && 'Notification' in window
      && 'PushManager' in window;
  }

  private handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) { // Checked
      const isGranted = await requestNotificationPermission();
      if (isGranted) {
        this.props.toggleNotification(true);
      }
    } else { // Unchecked
      this.props.toggleNotification(false);
    }
  }

  public render() {
    const isChecked = false;

    if (this.isSupported) {
      return (
        <div className="notification-toggle">
          <input type="checkbox" defaultChecked={isChecked} onChange={this.handleChange} />
          <label>通知を受け取る</label>
          <p>通知は日本時間で午前6時くらいです</p>
        </div>
      );
    } else {
      return (
        <div>このブラウザは通知機能をサポートしていません</div>
      );
    }
  }
}

export default NotificationToggle;
