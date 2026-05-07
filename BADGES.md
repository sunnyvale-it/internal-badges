# Example Badges

Here are examples of how to render badges using [Shields.io Dynamic JSON](https://shields.io/badges/dynamic-json-badge) feature, pointing to the generated JSON files in this repository.

These examples use the dummy user `denis` and the badge ID `mcp-engineer`. The raw JSON URL used is:
`https://raw.githubusercontent.com/sunnyvale-it/internal-badges/main/badges/denis/mcp-engineer.json`

*(Note: These badge images will display as "invalid" or "not found" until the actual JSON file is generated and pushed to the `main` branch of this repository).*

### 1. Standard Badge (Shows Status)
Displays the `status` field from the JSON.
```markdown
![Status Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsunnyvale-it%2Finternal-badges%2Fmain%2Fbadges%2Fdenis%2Fmcp-engineer.json&query=%24.status&label=MCP%20Engineer&color=success)
```
**Preview:**
![Status Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsunnyvale-it%2Finternal-badges%2Fmain%2Fbadges%2Fdenis%2Fmcp-engineer.json&query=%24.status&label=MCP%20Engineer&color=success)

### 2. Level Badge
Displays the `metadata.level` field from the JSON.
```markdown
![Level Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsunnyvale-it%2Finternal-badges%2Fmain%2Fbadges%2Fdenis%2Fmcp-engineer.json&query=%24.metadata.level&label=Level&color=blue)
```
**Preview:**
![Level Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsunnyvale-it%2Finternal-badges%2Fmain%2Fbadges%2Fdenis%2Fmcp-engineer.json&query=%24.metadata.level&label=Level&color=blue)

### 3. Version Badge
Displays the `version` field from the JSON.
```markdown
![Version Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsunnyvale-it%2Finternal-badges%2Fmain%2Fbadges%2Fdenis%2Fmcp-engineer.json&query=%24.version&label=Version&color=orange)
```
**Preview:**
![Version Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsunnyvale-it%2Finternal-badges%2Fmain%2Fbadges%2Fdenis%2Fmcp-engineer.json&query=%24.version&label=Version&color=orange)

### 4. Custom Issuer Badge
Displays the `metadata.issuer` field from the JSON, with a custom logo.
```markdown
![Issuer Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsunnyvale-it%2Finternal-badges%2Fmain%2Fbadges%2Fdenis%2Fmcp-engineer.json&query=%24.metadata.issuer&label=Issuer&color=purple&logo=google)
```
**Preview:**
![Issuer Badge](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsunnyvale-it%2Finternal-badges%2Fmain%2Fbadges%2Fdenis%2Fmcp-engineer.json&query=%24.metadata.issuer&label=Issuer&color=purple&logo=google)

## Customizing Your Badge

You can build your own variations by altering the URL parameters:
- `query=`: The JSONPath to extract data (e.g., `$.status`, `$.proof`, `$.metadata.level`). Note that `$` is encoded as `%24`.
- `label=`: The text to display on the left side.
- `color=`: The color of the right side (e.g., `success`, `blue`, `orange`, `red`, or a hex code like `ff69b4`).
- `style=`: The aesthetic style (e.g., `flat`, `flat-square`, `plastic`, `for-the-badge`, `social`).
- `logo=`: Add an icon from simple-icons (e.g., `github`, `google`).
