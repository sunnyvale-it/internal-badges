const GITHUB_REPO = "sunnyvale-it/internal-badges"; // Update to match your public repo
const GITHUB_PAT = "YOUR_GITHUB_PAT_HERE"; // Need repo access

function onFormSubmit(e) {
  // Assuming the form has questions like "User", "Badge ID", "Proof URL"
  // You will need to map e.namedValues or e.values to the payload fields
  
  const user = e.namedValues['User'][0];
  const badgeId = e.namedValues['Badge ID'][0];
  const proofUrl = e.namedValues['Proof URL'][0];
  const repository = e.namedValues['Repository URL'] ? e.namedValues['Repository URL'][0] : '';
  const attemptCode = e.namedValues['Attempt Code'] ? e.namedValues['Attempt Code'][0] : '';
  
  const payload = {
    event_type: "issue_badge",
    client_payload: {
      user: user,
      badge_id: badgeId,
      proof_url: proofUrl,
      repository: repository,
      grade: "N/A",
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
