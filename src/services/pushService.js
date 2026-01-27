const webpush = require('web-push');

webpush.setVapidDetails(
  'mailto:mvanzuita.dev@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const sendPush = async (subscription, title, message) => {
  const payload = JSON.stringify({
    title: title,
    body: message,
    icon: '/icon-192x192.png'
  });

  try {
    await webpush.sendNotification(subscription, payload);
    console.log("📲 Push enviado com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao enviar Push:", error);
  }
};

module.exports = { sendPush };