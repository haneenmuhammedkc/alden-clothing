const sendEmail = async (to, subject, html) => {
  const apiKey = process.env.MAILJET_API_KEY
  const secretKey = process.env.MAILJET_SECRET_KEY
  const senderEmail = process.env.MAILJET_SENDER_EMAIL || "aldenclothing.auth@gmail.com"
  const senderName = process.env.MAILJET_SENDER_NAME || "Alden Clothing"

  if (!apiKey || !secretKey) {
    console.error("EMAIL ERROR: Mailjet API key or Secret key missing in environment")
    throw new Error("Email provider credentials missing")
  }

  const credentials = Buffer.from(`${apiKey}:${secretKey}`).toString("base64")

  try {
    const response = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${credentials}`
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: senderEmail,
              Name: senderName
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
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("EMAIL ERROR: Mailjet API responded with failure status")
      throw new Error(`Mailjet API Error (HTTP ${response.status})`)
    }

    // 🔒 Operational logging sanitized (no recipient, secret, or payload data logged)
    console.log("Email dispatched successfully via Mailjet REST API")
    return data
  } catch (err) {
    console.error("EMAIL ERROR: Failed to dispatch email message via Mailjet")
    throw err
  }
}

export default sendEmail