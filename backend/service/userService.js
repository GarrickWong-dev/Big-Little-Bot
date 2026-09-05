const userRepo = require('../repository/userRepository');
const contestRepo = require('../repository/contestRepo');
const subsRepo = require('../repository/subsRepo');
const ctRepo = require('../repository/ctRepo');

async function createSubmission({ title, userID, contestID, submissionDate, points, picturePath }) {
  if (!title || !userID || !contestID || !submissionDate || points == null || !picturePath) {
    throw new Error('All fields are required');
  }

  const active = await contestRepo.getStatus(contestID);

  if (!active) {
    throw new Error('This contest is not active.');
  }

  const maxSubs = await contestRepo.getMaxSubs(contestID);

  if (maxSubs === null) {
    const submission = await userRepo.newSubmission({ title, userID, contestID, submissionDate, points, picturePath });
    await ctRepo.addPoints(contestID, userID, points);
    return submission;
  }

  const dailySubsCount = await subsRepo.countDailySubs(contestID, userID, submissionDate);

  if (dailySubsCount >= maxSubs){
    throw new Error(`This user has reached the contest limit of ${maxSubs} submissions for today.`);
  }

  const submission = await userRepo.newSubmission({ title, userID, contestID, submissionDate, points, picturePath });

  await ctRepo.addPoints(contestID, userID, points);

  return submission;
}

module.exports = {
  createSubmission,
};
