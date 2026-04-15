const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === "465", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Send welcome email to new user
 */
const sendWelcomeEmail = async (user) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: user.email,
      subject: "Welcome to ClipSphere!",
      html: `
        <h1>Welcome to ClipSphere, ${user.firstName}!</h1>
        <p>We're excited to have you join our community.</p>
        <p>Start sharing your videos and discover amazing content from creators around the world.</p>
        <p>Best regards,<br>The ClipSphere Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${user.email}`);
  } catch (error) {
    console.error(`Error sending welcome email to ${user.email}:`, error.message);
    // Don't throw error - continue even if email fails
  }
};

/**
 * Send engagement notification email
 */
const sendEngagementNotificationEmail = async (recipient, action, actor, video) => {
  try {
    // Check user preferences for notifications
    if (!recipient.notificationPreferences || !recipient.notificationPreferences.email) {
      console.log(`Email notifications disabled for user ${recipient.email}`);
      return;
    }

    let subject = "";
    let actionText = "";

    switch (action) {
      case "like":
        subject = `${actor.firstName} liked your video!`;
        actionText = `liked your video`;
        break;
      case "review":
        subject = `${actor.firstName} reviewed your video!`;
        actionText = `left a review on your video`;
        break;
      case "follow":
        subject = `${actor.firstName} started following you!`;
        actionText = `started following you`;
        break;
      default:
        return;
    }

    const mailOptions = {
      from: process.env.SMTP_FROM_EMAIL,
      to: recipient.email,
      subject,
      html: `
        <h2>${subject}</h2>
        <p><strong>${actor.firstName} ${actor.lastName}</strong> ${actionText}.</p>
        ${video ? `<p><strong>Video:</strong> ${video.title}</p>` : ""}
        <p>
          <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/videos/${video?.id || "#"}">
            View on ClipSphere
          </a>
        </p>
        <p>
          You can manage your notification preferences in your<br>
          <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/settings">account settings</a>.
        </p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Engagement email sent to ${recipient.email} for action: ${action}`);
  } catch (error) {
    console.error(
      `Error sending engagement email to ${recipient.email}:`,
      error.message
    );
    // Don't throw error - continue even if email fails
  }
};

/**
 * Test email configuration
 */
const testEmailConfig = async () => {
  try {
    const result = await transporter.verify();
    console.log("Email configuration verified successfully");
    return result;
  } catch (error) {
    console.error("Email configuration verification failed:", error.message);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendEngagementNotificationEmail,
  testEmailConfig,
};
