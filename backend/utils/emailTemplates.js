/**
 * Alden Clothing — Transactional Email Templates
 * Compact Premium E-Commerce Presentation Layer
 */

/**
 * Generates the Email Verification OTP email template
 * @param {Object} params
 * @param {string} params.name - Customer's full name
 * @param {string} params.otp - 6-digit OTP verification code
 * @returns {{ subject: string, html: string }}
 */
export const getVerificationEmailTemplate = ({ name, otp }) => {
  const subject = "Email Verification OTP — Alden Clothing"

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F5EFE8; font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F5EFE8; padding: 36px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Card Container (560px Compact Width) -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #DED4CB; border-radius: 8px; overflow: hidden;">
          
          <!-- Header Wordmark -->
          <tr>
            <td align="center" style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #F5EFE8;">
              <span style="font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 600; letter-spacing: 0.2em; color: #30251F; text-transform: uppercase;">ALDEN CLOTHING</span>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 32px 36px 28px 36px; text-align: center;">
              <h1 style="margin: 0 0 16px 0; font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 500; color: #30251F; line-height: 1.3;">Verify Your Email Address</h1>
              
              <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #30251F;">Welcome to Alden Clothing, ${name || "Valued Customer"}.</p>
              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.6; color: #76675D;">Use the verification code below to complete your registration and activate your account.</p>
              
              <!-- OTP Container Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td align="center" style="background-color: #FBF9F6; border: 1px solid #D8C4B4; border-radius: 8px; padding: 18px 16px;">
                    <div style="font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif; font-size: 32px; font-weight: 700; letter-spacing: 0.35em; color: #30251F; padding-left: 0.35em;">${otp}</div>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.5; color: #8B634B; font-weight: 500;">This code is valid for 10 minutes.</p>
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #76675D;">If you did not create an Alden Clothing account, you can safely ignore this email.</p>
            </td>
          </tr>

          <!-- Subtle Divider -->
          <tr>
            <td style="padding: 0 36px;">
              <div style="height: 1px; background-color: #F5EFE8; width: 100%;"></div>
            </td>
          </tr>

          <!-- Minimal Footer -->
          <tr>
            <td align="center" style="padding: 20px 36px; background-color: #FFFFFF; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #76675D;">&copy; ${new Date().getFullYear()} Alden Clothing. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { subject, html }
}

/**
 * Generates the Password Reset OTP email template
 * @param {Object} params
 * @param {string} params.otp - 6-digit OTP reset code
 * @returns {{ subject: string, html: string }}
 */
export const getResetPasswordEmailTemplate = ({ otp }) => {
  const subject = "Reset Password OTP — Alden Clothing"

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F5EFE8; font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F5EFE8; padding: 36px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Card Container (560px Compact Width) -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: #FFFFFF; border: 1px solid #DED4CB; border-radius: 8px; overflow: hidden;">
          
          <!-- Header Wordmark -->
          <tr>
            <td align="center" style="padding: 32px 32px 20px 32px; border-bottom: 1px solid #F5EFE8;">
              <span style="font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif; font-size: 22px; font-weight: 600; letter-spacing: 0.2em; color: #30251F; text-transform: uppercase;">ALDEN CLOTHING</span>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 32px 36px 28px 36px; text-align: center;">
              <h1 style="margin: 0 0 16px 0; font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 500; color: #30251F; line-height: 1.3;">Password Reset</h1>
              
              <p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.6; color: #30251F;">We received a request to reset the password for your Alden Clothing account.</p>
              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.6; color: #76675D;">Use the verification code below to continue.</p>
              
              <!-- OTP Container Card -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0 0 24px 0;">
                <tr>
                  <td align="center" style="background-color: #FBF9F6; border: 1px solid #D8C4B4; border-radius: 8px; padding: 18px 16px;">
                    <div style="font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif; font-size: 32px; font-weight: 700; letter-spacing: 0.35em; color: #30251F; padding-left: 0.35em;">${otp}</div>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.5; color: #8B634B; font-weight: 500;">This code is valid for 10 minutes.</p>
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #76675D;">If you did not request a password reset, you can safely ignore this email.</p>
            </td>
          </tr>

          <!-- Subtle Divider -->
          <tr>
            <td style="padding: 0 36px;">
              <div style="height: 1px; background-color: #F5EFE8; width: 100%;"></div>
            </td>
          </tr>

          <!-- Minimal Footer -->
          <tr>
            <td align="center" style="padding: 20px 36px; background-color: #FFFFFF; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #76675D;">&copy; ${new Date().getFullYear()} Alden Clothing. All rights reserved.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { subject, html }
}
