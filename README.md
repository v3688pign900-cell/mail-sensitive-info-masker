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
3. Optionally add exact custom replacement rules.
4. Optionally add model pattern rules such as `FG-350xG`.
5. Click `Mask / 遮罩轉換`.
6. Review the masked result and mapping table.
7. Click `Copy Result / 複製結果` if needed.
8. Click `Clear / 清除` to remove input, output, custom rules, pattern rules, and mapping data.

## GitHub Pages Usage

Open the repository Pages site from the repo page.

## Offline Usage

1. Download or clone this repository.
2. Open `index.html` directly with a browser.
3. Use the tool without any server, build step, or installation.

## Security Statement

All masking is performed locally in your browser. No email content, sensitive information, or mapping table is uploaded or stored.

## Privacy and Storage

- No backend is used
- No external API is used
- No analytics or tracking code is included
- No email content is uploaded
- No sensitive data is stored
- No persistent browser storage is used
- Custom rules exist only in current page memory
- Pattern rules exist only in current page memory
- Mapping data exists only in current page memory until cleared or page close

## Automatic Masking Rules

The tool automatically masks:

- Email addresses → `EMAIL-A`
- IPv4 addresses → `IP-A`
- Serial numbers / SN values → `SN-A`
- Windows / Linux / macOS paths → `PATH-A`
- File names → `FILE-A`
- Issue / Mantis IDs → `ISSUE-A`
- Version numbers → `VERSION-A`

Repeated identical values in the same masking run always map to the same label.

## Exact Custom Replacement

You can add exact replacement rules before masking.

Examples:

- `FG-123G` → `MODEL-A`
- `FLEX` → `FACTORY-A`
- `CustomerName` → `CUSTOMER-A`

Exact rules are case-insensitive and run before automatic masking.

## Model Pattern Rules

For many model variants, use one pattern rule.

Examples:

- `FG-350xG` can match `FG-3500G` and `FG-3501G`
- `FG-300xG` can match `FG-3000G` and `FG-3001G`

Rule design in v1.1:

- `x` means one alphanumeric wildcard character
- Matching is case-insensitive
- Pattern rules run after exact custom rules and before automatic rules

This is the recommended way to manage many model writing styles.

## Test Sample

Use `Load Sample / 載入範例` to load a fake sample email with fake data only.

## Supported Browsers

- Chrome latest
- Edge latest
- Firefox latest
- Safari latest

## Not Supported

- Internet Explorer
