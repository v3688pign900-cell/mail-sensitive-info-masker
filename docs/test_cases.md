# Test Cases

## Functional Tests

1. Paste sample email and click mask
   - Expect output to replace email, IP, SN, path, file, issue, and version values
2. Repeated same email appears twice with different case
   - Expect same `EMAIL-*` label both times
3. Add exact custom rule `FG-123G -> MODEL-A`
   - Expect custom label before auto masking
4. Add exact custom rule `FLEX -> FACTORY-A`
   - Expect replacement in output and mapping table
5. Add pattern rule `FG-350xG -> MODEL-350X`
   - Expect both `FG-3500G` and `FG-3501G` to become `MODEL-350X`
6. Add pattern rule `FG-300xG -> MODEL-300X`
   - Expect both `FG-3000G` and `FG-3001G` to become `MODEL-300X`
7. Lowercase model text such as `fg-3000g`
   - Expect case-insensitive pattern rule replacement
8. Click `Copy Result`
   - Expect clipboard copy or graceful warning if browser blocks clipboard
9. Click `Clear`
   - Expect input, output, custom rules, pattern rules, and mapping table removed
10. Click `Load Sample`
   - Expect fake sample email and example rules loaded

## Constraint Checks

Run string scans excluding `.git/` and confirm no matches inside shipped app files for:

- `fetch`
- `XMLHttpRequest`
- `WebSocket`
- `localStorage`
- `sessionStorage`
- `document.cookie`
- `indexedDB`
- `navigator.sendBeacon`
- `google-analytics`
- `gtag`
- `clarity`
- `cdn`
- `http://`
- `https://`

## Manual Browser Checks

- Chrome latest
- Edge latest
- Firefox latest
- Safari latest
- Mobile layout under narrow width
