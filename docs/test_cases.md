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
6. Add pattern rule `FG-350*G -> MODEL-350-FAMILY`
   - Expect `FG-350ABG` and `FG-350XYG` to become `MODEL-350-FAMILY`
7. Lowercase model text such as `fg-3000g`
   - Expect case-insensitive pattern rule replacement
8. Export current rules
   - Expect local JSON download only
9. Import exported rules
   - Expect rule editors restored locally
10. Apply mapping type filter `EMAIL`
   - Expect table to show only email mappings
11. Search mapping keyword `MODEL`
   - Expect matching mapping rows only
12. Click `Copy Result`
   - Expect clipboard copy or graceful warning if browser blocks clipboard
13. Click `Clear`
   - Expect input, output, custom rules, pattern rules, and mapping table removed
14. Click `Load Sample`
   - Expect fake sample email and example rules loaded
15. Check version and effective time
   - Expect both visible on page

## Constraint Checks

Run string scans excluding `.git/` and confirm no matches inside shipped app files for disallowed tokens.

## Manual Browser Checks

- Chrome latest
- Edge latest
- Firefox latest
- Safari latest
- Mobile layout under narrow width
