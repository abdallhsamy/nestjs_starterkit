export function generateRandomText(textLength: number): string {
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let text = '';
  for (let i = 0; i <= textLength; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    text += chars.substring(randomNumber, randomNumber + 1);
  }
  return text;
}
