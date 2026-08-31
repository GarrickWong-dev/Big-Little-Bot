const userRepo = require('../repository/userRepository');
const contestRepo = require('../repository/ContestRepoHelper');
const subsRepo = require('../repository/subsRepoHelper');
const ctRepo = require('../repository/ctRepoHelper');

async function createSubmission({ title, teamID, contestID, submissionDate, points, picturePath }) {
  if (!title || !teamID || !contestID || !submissionDate || points == null || !picturePath) {
    throw new Error('All fields are required');
  }

  const active = await contestRepo.getStatus(contestID);

  if (!active) {
    throw new Error('This contest is not active.');
  }

  const maxSubs = await contestRepo.getMaxSubs(contestID);

  if (maxSubs === null) {
    const submission = await userRepo.newSubmission({ title, teamID, contestID, submissionDate, points, picturePath });
    await ctRepo.addPoints(contestID, teamID, points);
    return submission;
  }

  const dailySubsCount = await subsRepo.countDailySubs(contestID, teamID, submissionDate);

  if (dailySubsCount >= maxSubs){
    throw new Error(`This team has reached the contest limit of ${maxSubs} submissions for today.`);
  }

  const submission = await userRepo.newSubmission({ title, teamID, contestID, submissionDate, points, picturePath });

  await ctRepo.addPoints(contestID, teamID, points);

  return submission;
}

module.exports = {
  createSubmission,
};
