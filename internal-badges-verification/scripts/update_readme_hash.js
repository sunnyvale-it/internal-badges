const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

async function updateReadme() {
  const payloadPath = process.env.PAYLOAD_FILE;
  if (!payloadPath || !fs.existsSync(payloadPath)) {
    console.error('Payload file not found.');
    process.exit(1);
  }

  const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8'));
  const { user, badge_id } = payload;

  const publicRepoDir = path.join(__dirname, '..', '..');
  const badgeFile = path.join(publicRepoDir, 'badges', user, `${badge_id}.json`);
  const badgesMdFile = path.join(publicRepoDir, 'BADGES.md');

  if (!fs.existsSync(badgeFile) || !fs.existsSync(badgesMdFile)) {
    console.warn('Badge file or BADGES.md not found. Skipping BADGES.md update.');
    return;
  }

  // Compute SHA256 of the generated badge.json
  const fileBuffer = fs.readFileSync(badgeFile);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  const sha256 = hashSum.digest('hex');

  const rekorUrl = `https://search.sigstore.dev/?hash=sha256:${sha256}`;
  const newSignatureLink = `[![Signature](https://img.shields.io/badge/Signature-Sigstore-blueviolet)](${rekorUrl})`;

  let markdown = fs.readFileSync(badgesMdFile, 'utf8');

  // Regex to find the row for this user and replace the signature cell
  // This looks for a row starting with | **user** | and replaces the LAST column content
  const rowRegex = new RegExp(`(\\|\\s*\\*\\*${user}\\*\\*\\s*\\|.*?\\|)\\s*\\[\\!\\[Signature\\].*?\\)\\s*\\|`, 'g');
  
  if (rowRegex.test(markdown)) {
    markdown = markdown.replace(rowRegex, `$1 ${newSignatureLink} |`);
    fs.writeFileSync(badgesMdFile, markdown, 'utf8');
    console.log(`Updated BADGES.md with new Rekor hash link for ${user}`);
  } else {
    console.warn(`User ${user} not found in BADGES.md table. Skipping link update.`);
  }
}

updateReadme().catch(err => {
  console.error('Failed to update BADGES.md:', err);
  process.exit(1);
});
