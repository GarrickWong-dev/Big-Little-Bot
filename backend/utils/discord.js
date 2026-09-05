const fs = require('fs');

async function notifySubmission(submission, imagePath) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

    if (!webhookUrl) {
      console.warn('DISCORD_WEBHOOK_URL not configured');
      return;
    }

    const imageBuffer = await fs.promises.readFile(imagePath);

    const formData = new FormData();

    formData.append(
      'payload_json',
      JSON.stringify({
        content:
          `📸 New Submission\n` +
          `Title: ${submission.title}\n` +
          `User: ${submission.userID}\n` +
          `Contest: ${submission.contestID}\n` +
          `Points: ${submission.points}`,
      }),
    );

    formData.append(
      'file',
      new Blob([imageBuffer]),
      'submission.jpg',
    );

    await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
    });
  } catch (error) {
    console.error('Discord notification failed:', error);
  }
}

module.exports = {
  notifySubmission,
};