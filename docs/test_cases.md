# Test Cases

## Functional Tests

1. Full FortiGate model name such as `FortiGate 7121F`
   - Expect match by default FortiGate full-name pattern rule
2. Short FortiGate model name such as `FG-7081F`
   - Expect match by default FortiGate short-name pattern rule
3. Full FortiGate G-series name such as `FortiGate 900G`
   - Expect match by default G-series pattern rule
4. Short FortiGate G-series name such as `FG-90G`
   - Expect match by default G-series short-name rule
5. `FG-350xG -> MODEL-350X`
   - Expect `FG-3500G` and `FG-3501G` to match
6. `FG-350*G -> MODEL-350-FAMILY`
   - Expect `FG-350ABG` and `FG-350XYG` to match
7. Windows path with spaces and quotes
   - Expect path and file parts masked correctly
8. Archive filename like `report.tar.gz`
   - Expect file masking support
9. Fortinet-style serial such as `FG7H1GTB25000123`
   - Expect SN masking because it starts with `F` or `f`, is 16 characters, and contains letters plus digits
10. Repeated serial values such as `FG7H1GTB25001333` appearing twice
   - Expect the same `SN-*` label reused
11. Version strings like `v7.2.11 build6634`, `R1.2.3`, `7.2`, `build 6634`
   - Expect version masking support
12. Export current rules
   - Expect local JSON download only
13. Import exported rules
   - Expect rule editors restored locally
14. Mapping filter and search
   - Expect correct filtered results

## Constraint Checks

Run string scans excluding `.git/` and confirm no matches inside shipped app files for disallowed tokens.
