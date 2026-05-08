const fs = require('fs');
const path = require('path');

async function updateBadge() {
  const user = process.env.PAYLOAD_USER;
  const badge_id = process.env.PAYLOAD_BADGE_ID;
  const version = process.env.PAYLOAD_VERSION;
  const issuer = process.env.PAYLOAD_ISSUER;
  const level = process.env.PAYLOAD_LEVEL;
  const proof_url = process.env.PAYLOAD_PROOF_URL;
  const attempt_code = process.env.PAYLOAD_ATTEMPT_CODE;
  const grade = process.env.PAYLOAD_GRADE;

  const badgeNames = {
    "secure-service-dev": "Secure Service Developer",
    // Add other badge mappings here as needed
  };
  const resolvedBadgeName = badgeNames[badge_id] || badge_id;

  if (!user || !badge_id) {
    console.error('Missing user or badge_id in payload');
    process.exit(1);
  }

  // The output directory is expected to be in the root repository
  // We assume the script runs from the scripts repo, so we go up one level
  const outputDir = path.join(__dirname, '..', 'badges', user);
  const outputFile = path.join(outputDir, `${badge_id}.json`);

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const TARGET_VERSION = version || "1.0.0";

  let shouldGenerate = true;
  if (fs.existsSync(outputFile)) {
    try {
      const existingData = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
      if (existingData.version === TARGET_VERSION) {
        console.log(`Badge ${badge_id} for user ${user} already exists at version ${TARGET_VERSION}. Skipping generation.`);
        shouldGenerate = false;
      }
    } catch (e) {
      console.warn('Could not parse existing badge file. It will be overwritten.');
    }
  }

  if (shouldGenerate) {
    // Format the current date
    const acquiredAt = new Date().toISOString().split('T')[0];

    // Construct badge payload
    const badgeData = {
      badge_id: badge_id,
      name: resolvedBadgeName,
      version: TARGET_VERSION,
      user: user,
      acquired_at: acquiredAt,
      status: "active",
      proof: proof_url || "github-actions-pass",
      metadata: {
        issuer: issuer || "Engineering Academy",
        level: level || "advanced",
        attempt_code: attempt_code || "N/A",
        grade: grade || "N/A"
      }
    };

    fs.writeFileSync(outputFile, JSON.stringify(badgeData, null, 2), 'utf8');
    console.log(`Successfully generated badge JSON at ${outputFile}`);
  }

  // Tell GitHub Actions whether we actually generated a new file or not
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `badge_generated=${shouldGenerate}\n`);
  }
}

updateBadge().catch(err => {
  console.error('Update badge script error:', err);
  process.exit(1);
});
