# Test Cases

## Functional Tests

1. Paste sample email and click mask
   - Expect output to replace email, IP, SN, path, file, issue, and version values
2. Repeated same email appears twice
   - Expect same `EMAIL-*` label both times
3. Add custom rule `FG-123G -> MODEL-A`
   - Expect custom label before auto masking
4. Add custom rule `FLEX -> FACTORY-A`
   - Expect replacement in output and mapping table
5. Click `Copy Result`
   - Expect clipboard copy or graceful warning if browser blocks clipboard
6. Click `Clear`
   - Expect input, output, rules, and mapping table removed
7. Click `Load Sample`
   - Expect fake sample email and example custom rules loaded

## Constraint Checks

1. `app.js` must not contain `fetch(`
2. `app.js` must not contain `XMLHttpRequest`
3. `app.js` must not contain `WebSocket`
4. `app.js` must not contain `localStorage`
5. `app.js` must not contain `sessionStorage`
6. `app.js` must not contain `document.cookie`
7. `app.js` must not contain `eval(`
8. `index.html` must not reference external CDN assets

## Manual Browser Checks

- Chrome latest
- Edge latest
- Firefox latest
- Safari latest
- Mobile layout under narrow width
