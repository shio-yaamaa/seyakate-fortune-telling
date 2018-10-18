import * as React from 'react';
import './NotificationToggle.css';

import requestNotificationPermission from '../utility/requestNotificationPermission';

interface NotificationToggleProps {
  isPushSupported: boolean;
  isSubscriptionDBProcessing: boolean;
  isNotificationEnabled: boolean;
  toggleNotification: (enable: boolean) => void;
}
 
class NotificationToggle extends React.Component<NotificationToggleProps> {
  constructor(props: NotificationToggleProps) {
    super(props);
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
    if (this.props.isPushSupported) {
      if (this.props.isSubscriptionDBProcessing) {
        return (
          <div>処理中...</div>
        );
      } else {
        return (
          <div className="notification-toggle">
            <input type="checkbox" checked={this.props.isNotificationEnabled} onChange={this.handleChange} />
            <label>通知を受け取る</label>
            <p>通知は日本時間で午前6時くらいです</p>
          </div>
        );
      }
    } else {
      return (
        <div>このブラウザは通知機能をサポートしていません</div>
      );
    }
  }
}

export default NotificationToggle;
