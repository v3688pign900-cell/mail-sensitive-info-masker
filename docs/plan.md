# Plan

## Goal

Build a static browser-only masking tool that works on GitHub Pages and also by opening `index.html` directly offline.

## Scope

- HTML, CSS, JavaScript only
- No server, no npm, no backend
- No network APIs or external libraries
- On-screen mapping review only
- Manual custom rules with higher priority than auto rules

## Deliverables

- `index.html`
- `style.css`
- `app.js`
- `README.md`
- docs set for design, security, tests, and usage

## Acceptance Targets

- Sensitive text masking works locally
- Mapping labels are deterministic within one run
- Clear removes all page state
- Repository is ready for GitHub Pages and offline use
