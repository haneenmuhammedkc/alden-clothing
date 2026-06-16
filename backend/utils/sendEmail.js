import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

const sendEmail = async (to, subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Alden <onboarding@resend.dev>",
      to,
      subject,
      html,
    })

    if (error) {
      throw new Error(JSON.stringify(error))
    }

    console.log("Email sent:", data)

  } catch (err) {
    console.error("EMAIL ERROR:", err)
    throw err
  }
}

export default sendEmail