/**
 * Alden Clothing — Transactional Email Templates
 * Timeless Editorial Luxury Presentation Layer
 */

/**
 * Generates the Email Verification / Welcome OTP email template
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
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F5EFE8; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #DED4CB; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(48, 37, 31, 0.03);">
          
          <!-- Editorial Brand Header -->
          <tr>
            <td align="center" style="padding: 36px 40px 24px 40px; border-bottom: 1px solid #F5EFE8;">
              <span style="font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 600; letter-spacing: 0.25em; color: #30251F; text-transform: uppercase;">A L D E N</span>
              <div style="font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif; font-size: 9px; font-weight: 500; letter-spacing: 0.35em; color: #8B634B; text-transform: uppercase; margin-top: 4px;">C L O T H I N G</div>
            </td>
          </tr>

          <!-- Main Content Section -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; text-align: left;">
              <h1 style="margin: 0 0 16px 0; font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 500; color: #30251F; line-height: 1.25;">Welcome to Alden Clothing</h1>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #76675D;">Dear ${name || "Valued Customer"},</p>
              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.6; color: #76675D;">Thank you for joining Alden Clothing. To complete your account creation and verify your email address, please use the verification code below.</p>
              
              <!-- OTP Container Component -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                <tr>
                  <td align="center" style="background-color: #FBF9F6; border: 2px dashed #D8C4B4; border-radius: 4px; padding: 24px 20px;">
                    <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.2em; color: #8B634B; text-transform: uppercase; margin-bottom: 10px;">Your Verification Code</div>
                    <div style="font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif; font-size: 34px; font-weight: 700; letter-spacing: 0.35em; color: #30251F; padding-left: 0.35em;">${otp}</div>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.5; color: #8B634B; font-weight: 500;">This verification code is valid for 10 minutes.</p>
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #76675D; font-style: italic;">If you did not create an Alden Clothing account, you can safely ignore this email.</p>
            </td>
          </tr>

          <!-- Editorial Divider Line -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background-color: #F5EFE8; width: 100%;"></div>
            </td>
          </tr>

          <!-- Premium Branded Footer -->
          <tr>
            <td align="center" style="padding: 28px 40px; background-color: #FBF9F6; text-align: center;">
              <p style="margin: 0 0 6px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 14px; font-weight: 600; letter-spacing: 0.1em; color: #30251F; text-transform: uppercase;">ALDEN CLOTHING</p>
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
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F5EFE8; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Email Container Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 1px solid #DED4CB; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 12px rgba(48, 37, 31, 0.03);">
          
          <!-- Editorial Brand Header -->
          <tr>
            <td align="center" style="padding: 36px 40px 24px 40px; border-bottom: 1px solid #F5EFE8;">
              <span style="font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 600; letter-spacing: 0.25em; color: #30251F; text-transform: uppercase;">A L D E N</span>
              <div style="font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif; font-size: 9px; font-weight: 500; letter-spacing: 0.35em; color: #8B634B; text-transform: uppercase; margin-top: 4px;">C L O T H I N G</div>
            </td>
          </tr>

          <!-- Main Content Section -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; text-align: left;">
              <h1 style="margin: 0 0 16px 0; font-family: 'Cormorant Garamond', Georgia, 'Times New Roman', serif; font-size: 28px; font-weight: 500; color: #30251F; line-height: 1.25;">Password Reset Request</h1>
              <p style="margin: 0 0 28px 0; font-size: 14px; line-height: 1.6; color: #76675D;">We received a request to reset the password for your Alden Clothing account. Please use the reset code below to complete the process.</p>
              
              <!-- OTP Container Component -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                <tr>
                  <td align="center" style="background-color: #FBF9F6; border: 2px dashed #D8C4B4; border-radius: 4px; padding: 24px 20px;">
                    <div style="font-size: 10px; font-weight: 600; letter-spacing: 0.2em; color: #8B634B; text-transform: uppercase; margin-bottom: 10px;">Your Password Reset Code</div>
                    <div style="font-family: 'Montserrat', 'Helvetica Neue', Arial, sans-serif; font-size: 34px; font-weight: 700; letter-spacing: 0.35em; color: #30251F; padding-left: 0.35em;">${otp}</div>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 12px 0; font-size: 13px; line-height: 1.5; color: #8B634B; font-weight: 500;">This reset code is valid for 10 minutes.</p>
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #76675D; font-style: italic;">If you did not request a password reset, you can safely ignore this email. Your account remains secure.</p>
            </td>
          </tr>

          <!-- Editorial Divider Line -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="height: 1px; background-color: #F5EFE8; width: 100%;"></div>
            </td>
          </tr>

          <!-- Premium Branded Footer -->
          <tr>
            <td align="center" style="padding: 28px 40px; background-color: #FBF9F6; text-align: center;">
              <p style="margin: 0 0 6px 0; font-family: 'Cormorant Garamond', Georgia, serif; font-size: 14px; font-weight: 600; letter-spacing: 0.1em; color: #30251F; text-transform: uppercase;">ALDEN CLOTHING</p>
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
