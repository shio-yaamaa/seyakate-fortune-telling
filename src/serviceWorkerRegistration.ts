export const registerServiceWorker = () => {
  window.addEventListener('load', () => {
    const swUrl = `${process.env.PUBLIC_URL}/notification-sw.js`;
    navigator.serviceWorker
      .register(swUrl)
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.error('Error during SW registration:', error);
      });
  });
};

export const unregisterServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
