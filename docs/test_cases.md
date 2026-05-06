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
8. Windows path with spaces and quotes
   - Expect path and file parts masked correctly
9. Linux path ending with semicolon
   - Expect punctuation preserved outside mask label
10. Archive filename like `report.tar.gz`
   - Expect file masking support
11. Version strings like `v7.2.11 build6634`, `R1.2.3`, `7.2`, `build 6634`
   - Expect version masking support
12. Export current rules
   - Expect local JSON download only
13. Import exported rules
   - Expect rule editors restored locally
14. Apply mapping type filter `EMAIL`
   - Expect table to show only email mappings
15. Search mapping keyword `MODEL`
   - Expect matching mapping rows only
16. Click `Copy Result`
   - Expect clipboard copy or graceful warning if browser blocks clipboard
17. Click `Clear`
   - Expect input, output, custom rules, pattern rules, and mapping table removed
18. Click `Load Sample`
   - Expect fake sample email and example rules loaded
19. Check page header
   - Expect product name without version text in main title
20. Check version and effective time chips
   - Expect both visible below title

## Constraint Checks

Run string scans excluding `.git/` and confirm no matches inside shipped app files for disallowed tokens.

## Manual Browser Checks

- Chrome latest
- Edge latest
- Firefox latest
- Safari latest
- Mobile layout under narrow width
