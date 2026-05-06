# Mail Sensitive Info Masker

Mail Sensitive Info Masker is a browser-only web tool for masking sensitive values in email content before sending the text to AI tools for translation or summarization.

## Tool Purpose

- Paste email content into the input box
- Apply masking locally in the browser
- Review the masked result and mapping table on screen
- Copy the masked result safely for external use

## Usage

1. Open `index.html` in a browser, or open the GitHub Pages page.
2. Paste email content into the original text area.
3. Use toggle buttons to open Custom Rules or Pattern Rules only when needed.
4. Optionally edit repo JSON rule files directly on GitHub.
5. Optionally import or export local rule templates.
6. Click `Mask / 遮罩轉換`.
7. Review the masked result and mapping table.
8. Use type filter or search box to review mappings.

## v1.3 Highlights

- Repo-based default rule JSON files
- Toggle buttons for Custom Rules and Pattern Rules panels
- More path/version edge case handling
- GitHub-editable rule file links on the page

## GitHub-editable Rule Files

These files are now part of the repository and can be edited directly in GitHub:

- `rules/custom-rules.json`
- `rules/pattern-rules.json`

After editing those files in GitHub and refreshing the page from GitHub Pages, the updated defaults can be used as repo-managed rule references.

## Rule Template Import / Export

- Export saves current exact and pattern rules to a local JSON file
- Import loads rules from a local JSON file into the current page
- No rule template is uploaded anywhere

## Pattern Rules

- `x` means one alphanumeric wildcard character
- `*` means multiple alphanumeric wildcard characters
- Matching is case-insensitive

## Security Statement

All masking is performed locally in your browser. No email content, sensitive information, or mapping table is uploaded or stored.
