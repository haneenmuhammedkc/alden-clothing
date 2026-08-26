import Mailjet from "node-mailjet"

const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
)

const sendEmail = async (to, subject, html) => {
  try {
    const result = await mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.MAILJET_SENDER_EMAIL || "aldenclothing.auth@gmail.com",
              Name: process.env.MAILJET_SENDER_NAME || "Alden Clothing"
            },
            To: [
              {
                Email: to
              }
            ],
            Subject: subject,
            HTMLPart: html
          }
        ]
      })

    // 🔒 Operational logging sanitized (no recipient or credential data logged)
    console.log("Email dispatched successfully via Mailjet provider")
    return result
  } catch (err) {
    console.error("EMAIL ERROR: Failed to dispatch email message via Mailjet")
    throw err
  }
}

export default sendEmail