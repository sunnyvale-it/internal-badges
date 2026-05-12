const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function getSha256(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

function generateMarkdown() {
  const publicRepoDir = path.join(__dirname, '..');
  const badgesDir = path.join(publicRepoDir, 'badges');
  const badgesMdFile = path.join(publicRepoDir, 'BADGES.md');

  if (!fs.existsSync(badgesDir)) {
    console.warn('Badges directory not found. Skipping generation.');
    return;
  }

  const header = `# Team Badges

Here is the directory of all users and their dynamically rendered badges via Shields.io. The badges pull live data directly from the JSON files stored in this repository.

> 🔍 **Audit Trail:** You can view the complete, unalterable history of all cryptographically signed badges issued by our automated system by visiting the [Sigstore Transparency Log (Rekor)](https://search.sigstore.dev/?email=https%3A%2F%2Fgithub.com%2Fsunnyvale-it%2Finternal-badges%2F.github%2Fworkflows%2Fissue_badge.yml%40refs%2Fheads%2Fmaster).

*(Note: If badges display as "invalid" or "not found", ensure that this repository is set to **Public** on GitHub and that the JSON files have been pushed to the \`master\` branch).*

`;

  let categories = {};

  const users = fs.readdirSync(badgesDir).filter(f => fs.statSync(path.join(badgesDir, f)).isDirectory());

  for (const user of users) {
    const userDir = path.join(badgesDir, user);
    const badgeFiles = fs.readdirSync(userDir).filter(f => f.endsWith('.json'));

    for (const badgeFile of badgeFiles) {
      const fullPath = path.join(userDir, badgeFile);
      const sha256 = getSha256(fullPath);
      
      const badgeId = badgeFile.replace('.json', '');
      const encodedUrl = encodeURIComponent(`https://raw.githubusercontent.com/sunnyvale-it/internal-badges/master/badges/${user}/${badgeFile}`);

      const nameShield = `![Name](https://img.shields.io/badge/dynamic/json?url=${encodedUrl}&query=%24.name&label=Badge&color=black)`;
      const statusShield = `![Status](https://img.shields.io/badge/dynamic/json?url=${encodedUrl}&query=%24.status&label=Status&color=success)`;
      const levelShield = `![Level](https://img.shields.io/badge/dynamic/json?url=${encodedUrl}&query=%24.metadata.level&label=Level&color=blue)`;
      const gradeShield = `![Grade](https://img.shields.io/badge/dynamic/json?url=${encodedUrl}&query=%24.metadata.grade&label=Grade&color=yellow)`;
      const versionShield = `![Version](https://img.shields.io/badge/dynamic/json?url=${encodedUrl}&query=%24.version&label=Version&color=orange)`;
      const issuerShield = `![Issuer](https://img.shields.io/badge/dynamic/json?url=${encodedUrl}&query=%24.metadata.issuer&label=Issuer&color=purple)`;
      const acquiredAtShield = `![Acquired At](https://img.shields.io/badge/dynamic/json?url=${encodedUrl}&query=%24.acquired_at&label=Acquired&color=lightgrey)`;
      
      const sigUrl = `https://search.sigstore.dev/?hash=sha256:${sha256}`;
      const signatureShield = `[![Signature](https://img.shields.io/badge/Signature-Sigstore-blueviolet)](${sigUrl})`;

      const row = `| **${user}** | ${nameShield} | ${statusShield} | ${levelShield} | ${gradeShield} | ${versionShield} | ${issuerShield} | ${acquiredAtShield} | ${signatureShield} |`;
      
      const badgeData = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      const categoryName = badgeData.name || "Other";
      if (!categories[categoryName]) {
        categories[categoryName] = [];
      }
      categories[categoryName].push(row);
    }
  }

  let tablesMarkdown = '';
  // Sort categories alphabetically
  const sortedCategories = Object.keys(categories).sort();
  
  for (const category of sortedCategories) {
    const rows = categories[category];
    rows.sort(); // Sort rows alphabetically by username
    
    tablesMarkdown += `### ${category} Certifications\n\n`;
    tablesMarkdown += `| User | Badge | Status | Level | Grade | Version | Issuer | Acquired At | Signature |\n`;
    tablesMarkdown += `|------|-------|--------|-------|-------|---------|--------|-------------|-----------|\n`;
    tablesMarkdown += rows.join('\n') + '\n\n';
  }

  const finalMarkdown = header + tablesMarkdown;
  fs.writeFileSync(badgesMdFile, finalMarkdown, 'utf8');
  console.log('Successfully regenerated BADGES.md from scratch!');
}

generateMarkdown();
