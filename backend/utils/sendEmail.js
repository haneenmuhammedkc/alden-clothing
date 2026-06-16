import nodemailer from "nodemailer"

const sendEmail = async (to, subject, html) => {
  try {
    console.log("EMAIL_USER:", process.env.EMAIL_USER)

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    console.log("Verifying SMTP...")

    await transporter.verify()

    console.log("SMTP Verified")

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