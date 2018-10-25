// Returns if the permission is granted
const requestNotificationPermission = async (): Promise<boolean> => {
  // Check for the availability
  if (!('Notification' in window)) {
    alert('このブラウザは通知をサポートしていません');
    return false;
  }
  
  // Check for the permission
  switch (Notification.permission) {
  case 'granted':
    return true;
  case 'denied':
    alert('通知を送るための許可がブロックされているため通知を送れません。ブラウザの設定からブロックを取り消すことができます。');
    return false;
  default: // 'default' or not set
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return true;
    } else {
      alert('許可されなかったため通知を送れません');
      return false;
    }
  }
};

export default requestNotificationPermission;