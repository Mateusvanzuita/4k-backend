const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true para porta 465, false para outras portas
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Bem-vindo ao 4K Team!",
      html: `
        <h1>Bem-vindo, ${userName}!</h1>
        <p>Você foi cadastrado com sucesso no sistema 4K Team.</p>
        <p>Agora você pode acessar a plataforma e começar sua jornada conosco!</p>
        <br>
        <p>Equipe 4K Team</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Email de boas-vindas enviado para ${userEmail}`)
  } catch (error) {
    console.error("Erro ao enviar email:", error)
  }
}

const sendNotificationEmail = async (userEmail, title, message) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: title,
      html: `
        <h2>${title}</h2>
        <p>${message}</p>
        <br>
        <p>Equipe 4K Team</p>
      `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`Email de notificação enviado para ${userEmail}`)
  } catch (error) {
    console.error("Erro ao enviar email:", error)
  }
}

module.exports = {
  sendWelcomeEmail,
  sendNotificationEmail,
}
