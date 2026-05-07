const fs = require('fs');
const path = require('path');

async function updateBadge() {
  const payloadPath = process.env.PAYLOAD_FILE;
  if (!payloadPath || !fs.existsSync(payloadPath)) {
    console.error('Payload file not found.');
    process.exit(1);
  }

  const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));
  const { user, badge_id, version, issuer, level, proof_url } = payload;

  const badgeNames = {
    "mcp-engineer": "MCP Engineer",
    // Add other badge mappings here as needed
  };
  const resolvedBadgeName = badgeNames[badge_id] || badge_id;

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
        level: level || "advanced"
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
