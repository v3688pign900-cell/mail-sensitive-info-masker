# Security Design

## Data Flow

1. User pastes email text into the browser page
2. JavaScript processes the text in page memory only
3. Masked output and mapping table are rendered on screen
4. User may copy the masked result manually or with clipboard API
5. `Clear` removes input, output, rules, and mapping from the page

## Why Data Does Not Leave the Local Machine

- The project uses only local HTML, CSS, and JavaScript
- No backend service exists
- No network request code exists
- The tool works offline by opening `index.html` directly
- GitHub Pages serves static files only; pasted user content is processed only by the browser runtime

## Forbidden APIs and Features

The project does not use:

- `fetch`
- `XMLHttpRequest`
- `WebSocket`
- external CDN
- analytics
- `localStorage`
- `sessionStorage`
- cookies

## Mapping Table Lifetime

The mapping table exists only in page memory and is not automatically downloaded or stored.

## Clear Behavior

`Clear` removes:

- original input
- masked output
- custom rules
- mapping table
- status text

## Offline Usage

Users can download the repository and double-click `index.html` to run the tool without a server or network connection.
