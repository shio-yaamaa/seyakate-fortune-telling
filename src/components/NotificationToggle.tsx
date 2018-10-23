import * as React from 'react';
import './NotificationToggle.css';

import SubscriptionManager from '../utility/SubscriptionManager';
import LocalDatabase from '../utility/LocalDatabase';
import requestNotificationPermission from '../utility/requestNotificationPermission';

interface NotificationToggleProps {
  isVisible: boolean;
}

interface NotificationToggleState {
  isProcessing: boolean; // True while waiting for a response from Lambda
  isEnabled: boolean;
}
 
class NotificationToggle extends React.Component<NotificationToggleProps, NotificationToggleState> {
  constructor(props: NotificationToggleProps) {
    super(props);
    this.state = {
      isProcessing: false,
      isEnabled: false
    };

    LocalDatabase.getIsNotificationEnabled().then(isEnabled => {
      this.setState({ isEnabled });
    });
  }

  private toggleNotification(enable: boolean) {
    if (enable) {
      SubscriptionManager.subscribe().then(() => {
        this.setState({
          isProcessing: false,
          isEnabled: true
        });
      });
    } else {
      SubscriptionManager.unsubscribe().then(() => {
        this.setState({
          isProcessing: false,
          isEnabled: false
        });
      });
    }
    this.setState({ isProcessing: true });
  }

  private handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const isGranted = await requestNotificationPermission();
      if (isGranted) {
        this.toggleNotification(true);
      }
    } else {
      this.toggleNotification(false);
    }
  }

  public render() {
    if (!this.props.isVisible) return null;
    if (this.state.isProcessing) {
      return (
        <section className="notification-toggle">
          <p>処理中</p>
          <p className="secondary-text notification-tip">通知は日本時間で午前6時くらいです</p>
        </section>
      );
    } else {
      return (
        <section className="notification-toggle">
          <input type="checkbox" checked={this.state.isEnabled} onChange={this.handleChange} />
          <label>通知を受け取る</label>
          <p className="secondary-text notification-tip">通知は日本時間で午前6時くらいです</p>
        </section>
      );
    }
  }
}

export default NotificationToggle;
