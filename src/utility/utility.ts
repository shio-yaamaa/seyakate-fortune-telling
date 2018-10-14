// https://gist.github.com/malko/ff77f0af005f684c44639e4061fa8019
export const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  return Uint8Array.from(rawData.split('').map((char) => char.charCodeAt(0)));
};