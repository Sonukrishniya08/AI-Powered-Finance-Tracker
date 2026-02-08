const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBudgetAlert = async (to, category, month, year) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "🚨 Budget Limit Exceeded",
      html: `
        <h2>Budget Alert</h2>
        <p>Your budget for <b>${category}</b> in ${month}/${year} has been exceeded.</p>
      `,
    });

    console.log("Email sent successfully");
  } catch (err) {
    console.log("EMAIL ERROR:", err);
    throw err;
  }
};

module.exports = { sendBudgetAlert };
