# Internal Badges

This repository holds the generated badges for the Engineering Academy.

## How to get a badge

1. Submit your challenge and proof via our internal Google Form.
2. The system will automatically validate your submission using a secure pipeline.
3. If successful, your badge will be generated and stored here.

## How to display your badge

You can embed your dynamic badge anywhere that supports Markdown, like your GitHub profile or an internal wiki, using Shields.io.

### Example Markdown Snippet

Replace `<USER>` and `<BADGE_ID>` with your specific details.

```markdown
![MCP Engineer Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsunnyvale-it%2Finternal-badges%2Fmain%2Fbadges%2F%3CUSER%3E%2F%3CBADGE_ID%3E.json&query=%24.status&label=mcp-engineer&color=success)
```

**Note**: You can customize the `label` and `color` in the Shields.io URL to match the badge aesthetics you want.

---

### Setup Instructions (Admin)

1. **Private Repository**: Set up a separate private repository `internal-badges-verification` to hold the `scripts/validate_proof.js` and `scripts/update_badge.js`.
2. **Secrets**: 
   - Add a Personal Access Token (PAT) with access to the private verification repo as `VERIFICATION_REPO_PAT` in this public repository's GitHub Action secrets.
   - Add a PAT with `repo` access to the Google Apps Script so it can trigger the `repository_dispatch` event on this repository.
3. **Google Apps Script**: Copy the contents of `apps-script/Code.gs` into your Google Sheet's Apps Script editor and set up an `onFormSubmit` trigger.
