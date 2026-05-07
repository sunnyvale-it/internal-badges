const fs = require('fs');

async function validate() {
  // Read payload passed from the GitHub Action
  const payloadPath = process.env.PAYLOAD_FILE;
  if (!payloadPath || !fs.existsSync(payloadPath)) {
    console.error('Payload file not found.');
    process.exit(1);
  }

  const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));
  const { user, badge_id, proof_url, repository } = payload;

  console.log(`Validating proof for user: ${user}, badge: ${badge_id}`);

  // TODO: Add your custom secret validation logic here.
  // Example: Check if the repository exists
  // if (!repository) {
  //   console.error('Validation failed: Repository not provided');
  //   process.exit(1);
  // }
  
  // Example: Validate proof URL format
  if (!proof_url || !proof_url.startsWith('https://')) {
    console.error('Validation failed: Invalid proof URL');
    process.exit(1);
  }

  // If we reach here, validation passed.
  console.log('Validation successful!');
  process.exit(0);
}

validate().catch(err => {
  console.error('Validation script error:', err);
  process.exit(1);
});
