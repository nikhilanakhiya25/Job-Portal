const sendApplicationStatusEmail = async (to, jobTitle, status) => {
  console.log(`Email sent to: ${to} for job: ${jobTitle} with status: ${status}`);
};

module.exports = { sendApplicationStatusEmail };
