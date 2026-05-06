# Mail Sensitive Info Masker

Mail Sensitive Info Masker is a browser-only web tool for masking sensitive values in email content before sending the text to AI tools for translation or summarization.

## Tool Purpose

- Paste email content into the input box
- Apply masking locally in the browser
- Review the masked result and mapping table on screen
- Copy the masked result safely for external use

## v1.7 Highlights

- Built-in FortiGate masking starter rules
- Supports both full product names and short model names
- Adds SN masking for 16-character values starting with `F` or `f`
- Keeps previous wildcard model rule support
- Includes FortiGate model reference file in repo

## FortiGate Rule Strategy

This version adds default pattern rules for FortiGate naming styles:

- `FortiGate *F` → `MODEL-FORTIGATE-FULL-F`
- `FortiGate *G` → `MODEL-FORTIGATE-FULL-G`
- `FG-*F` → `MODEL-FORTIGATE-SHORT-F`
- `FG-*G` → `MODEL-FORTIGATE-SHORT-G`

This means you do not need to create one rule for every FortiGate model if your goal is only masking.

## When You Need One-by-One Rules

Use one-by-one custom rules only if you must preserve model differences after masking.

## Repo Rule Files

- `rules/custom-rules.json`
- `rules/pattern-rules.json`
- `rules/fortigate-models-reference.json`

## Security Statement

All masking is performed locally in your browser. No email content, sensitive information, or mapping table is uploaded or stored.
