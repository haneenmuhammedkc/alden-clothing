import nodemailer from "nodemailer"

const sendEmail = async (to, subject, html) => {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER)

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      logger: true,
      debug: true,
    })

    console.log("Verifying SMTP...")
    await transporter.verify()

    console.log("SMTP verified")

    const info = await transporter.sendMail({
      from: `"ALDEN CLOTHING & CO" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    })

    console.log("Email sent:", info.messageId)

  } catch (error) {
    console.error("EMAIL ERROR:", error)
    throw error
  }
}

export default sendEmail