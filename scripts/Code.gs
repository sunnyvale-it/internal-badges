const GITHUB_REPO = "sunnyvale-it/internal-badges"; // Update to match your public repo
const GITHUB_PAT = "YOUR_GITHUB_PAT_HERE"; // Need repo access

function onFormSubmit(e) {
  // Assuming the form has questions like "User", "Badge ID", "Proof URL"
  // Safely find the email column (handles English "Email Address" or Italian "Indirizzo email")
  let user = '';
  if (e.namedValues) {
    const emailKey = Object.keys(e.namedValues).find(k => k.toLowerCase().includes('email'));
    if (emailKey) user = e.namedValues[emailKey][0];
  }
  if (!user) user = "unknown-user@sunnyvale.it"; // Fallback to prevent crashes
  // Use a dropdown in your form titled "Challenge" with options like "secure-service-dev/1.0.0/advanced"
  const challengeDataStr = e.namedValues['Challenge'] ? e.namedValues['Challenge'][0] : '';
  
  let badgeId = e.namedValues['Badge ID'] ? e.namedValues['Badge ID'][0] : '';
  let version = '1.0.0';
  let level = 'advanced';

  if (challengeDataStr && challengeDataStr.includes('/')) {
    const parts = challengeDataStr.split('/');
    badgeId = parts[0].trim();
    if (parts[1]) version = parts[1].trim();
    if (parts[2]) level = parts[2].trim();
  } else if (challengeDataStr) {
    badgeId = challengeDataStr.trim();
  }
  let proofUrl = e.namedValues['Proof URL'] ? e.namedValues['Proof URL'][0] : '';
  if (!proofUrl) {
    // If there is no explicit proof URL, it's likely a native Google Form Quiz.
    proofUrl = "Google Form Quiz Submission";
  }
  
  const repository = e.namedValues['Repository URL'] ? e.namedValues['Repository URL'][0] : '';
  
  let attemptCode = e.namedValues['Attempt Code'] ? e.namedValues['Attempt Code'][0] : '';
  if (!attemptCode && e.namedValues) {
    // Look for a key containing "attempt", "tentativo", or "code"
    const attemptKey = Object.keys(e.namedValues).find(k => {
      const lowerK = k.toLowerCase();
      return (lowerK.includes('attempt') || lowerK.includes('tentativo') || lowerK.includes('codice')) || 
             (lowerK.includes('code') && !lowerK.includes('url'));
    });
    if (attemptKey) attemptCode = e.namedValues[attemptKey][0];
  }
  
  let grade = "N/A";
  if (e.namedValues) {
    const scoreKey = Object.keys(e.namedValues).find(k => k.toLowerCase().includes('score') || k.toLowerCase().includes('punteggio'));
    if (scoreKey) grade = e.namedValues[scoreKey][0];
  }

  const payload = {
    event_type: "issue_badge",
    client_payload: {
      user: user,
      badge_id: badgeId,
      proof_url: proofUrl,
      repository: repository,
      grade: grade,
      attempt_code: attemptCode
    }
  };

  const options = {
    method: "post",
    contentType: "application/json",
    headers: {
      Authorization: `Bearer ${GITHUB_PAT}`,
      Accept: "application/vnd.github.v3+json"
    },
    payload: JSON.stringify(payload)
  };

  const url = `https://api.github.com/repos/${GITHUB_REPO}/dispatches`;

  try {
    const response = UrlFetchApp.fetch(url, options);
    Logger.log("Triggered GitHub Action: " + response.getContentText());
  } catch (error) {
    Logger.log("Error triggering GitHub Action: " + error.toString());
  }
}
