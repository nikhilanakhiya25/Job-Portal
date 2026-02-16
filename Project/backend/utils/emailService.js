// Email service for sending notifications
// In production, integrate with services like SendGrid, AWS SES, or Nodemailer

const sendEmail = async ({ to, subject, text, html }) => {
  // Log email for development
  console.log('📧 Email Notification:');
  console.log(`To: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${text}`);
  
  // In production, implement actual email sending here
  // Example with nodemailer:
  /*
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    html
  });
  */
  
  return { success: true, message: 'Email logged (development mode)' };
};

const sendApplicationStatusEmail = async (to, jobTitle, status, company = '') => {
  const subject = `Application Status Update - ${jobTitle}`;
  
  const statusMessages = {
    pending: 'Your application is under review.',
    reviewed: 'Your application has been reviewed.',
    shortlisted: 'Congratulations! You have been shortlisted for the next round.',
    rejected: 'We appreciate your interest, but we have decided to move forward with other candidates.',
    accepted: 'Congratulations! We are pleased to offer you the position.'
  };

  const text = `
Dear Candidate,

${statusMessages[status] || 'Your application status has been updated.'}

Job Position: ${jobTitle}
${company ? `Company: ${company}` : ''}
Status: ${status.toUpperCase()}

We will contact you with further details if applicable.

Best regards,
Hiring Team
  `;

  return await sendEmail({ to, subject, text });
};

const sendBulkStatusEmails = async (applications, status) => {
  const results = await Promise.all(
    applications.map(async (app) => {
      try {
        await sendApplicationStatusEmail(
          app.applicant.email,
          app.job.title,
          status,
          app.job.company
        );
        return { success: true, applicant: app.applicant.email };
      } catch (error) {
        return { success: false, applicant: app.applicant.email, error: error.message };
      }
    })
  );

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return {
    message: `Bulk emails sent: ${successful} successful, ${failed} failed`,
    results
  };
};

module.exports = { 
  sendEmail,
  sendApplicationStatusEmail,
  sendBulkStatusEmails
};
