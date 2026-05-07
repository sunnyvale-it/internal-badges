const fs = require('fs');
const path = require('path');

async function updateBadge() {
  const payloadPath = process.env.PAYLOAD_FILE;
  if (!payloadPath || !fs.existsSync(payloadPath)) {
    console.error('Payload file not found.');
    process.exit(1);
  }

  const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));
  const { user, badge_id, issuer, level, proof_url } = payload;

  if (!user || !badge_id) {
    console.error('Missing user or badge_id in payload');
    process.exit(1);
  }

  // The output directory is expected to be in the public repository
  // We assume the script runs from the verification repo, so we go up one level
  const outputDir = path.join(__dirname, '..', '..', 'badges', user);
  const outputFile = path.join(outputDir, `${badge_id}.json`);

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Format the current date
  const acquiredAt = new Date().toISOString().split('T')[0];

  // Construct badge payload
  const badgeData = {
    badge_id: badge_id,
    version: "1.3.0",
    user: user,
    acquired_at: acquiredAt,
    status: "active",
    proof: proof_url || "github-actions-pass",
    metadata: {
      issuer: issuer || "Engineering Academy",
      level: level || "advanced"
    }
  };

  fs.writeFileSync(outputFile, JSON.stringify(badgeData, null, 2), 'utf8');
  console.log(`Successfully generated badge JSON at ${outputFile}`);
}

updateBadge().catch(err => {
  console.error('Update badge script error:', err);
  process.exit(1);
});
