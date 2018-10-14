// Returns if the permission is granted
const requestNotificationPermission = async (): Promise<boolean> => {
  // Check for the availability
  if (!('Notification' in window)) {
    alert('このブラウザは通知をサポートしていません');
    return false;
  }
  
  // Check for the permission
  if (Notification.permission === 'granted') {
    return true;
  } else { // 'denied', 'default', or not set
    // Request permission
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      return true;
    } else {
      alert('許可されていないので通知を送れません');
      return false;
    }
  }
};

export default requestNotificationPermission;