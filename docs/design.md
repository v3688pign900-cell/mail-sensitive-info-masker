# Design

## Program Architecture

The project uses a static front-end structure:

- `index.html` provides the UI
- `style.css` provides responsive layout and styling
- `app.js` contains all masking logic and DOM actions

## Main Functions

- `generateLabel(type, index)` creates labels like `EMAIL-A` and `EMAIL-AA`
- `applyCustomRules()` applies manual exact replacements first
- `applyPatternRules()` applies wildcard model rules such as `FG-350xG` and `FG-350*G`
- `applyAutoRules()` runs regex-based automatic masking rules
- `replacePathsWithFileAwareness()` handles path/file masking with punctuation awareness
- `renderMappingTable()` shows the current mapping on screen
- `applyMappingFilters()` filters current mapping table by type and keyword
- `exportRules()` and `importRules()` handle local rule template files only
- `clearAll()` removes input, output, rule editors, and mapping table state

## Regex Rule Location

Regex rules are centralized in the `maskRules` array in `app.js` so PM can adjust matching patterns in one place.

## How to Add a New Masking Rule

1. Add a new rule object to `maskRules`
2. Define `type`
3. Define `pattern`
4. Add `normalize` logic if values should be case-normalized or spacing-normalized
5. Add a matching counter entry in `createWorkingState()` if needed

## How to Adjust Label Format

Edit `generateLabel()` and `toAlphabeticLabel()` in `app.js`.

## Execution Order

1. Collect exact custom rules from the UI
2. Apply exact custom rules first
3. Collect wildcard pattern rules from the UI
4. Apply wildcard pattern rules second
5. Apply automatic regex rules after custom logic
6. Filter mapping table for user review if requested
7. Render mapping table on screen

## Pattern Rule Design

v1.2 adds stronger wildcard model rules for many naming variations.

- Pattern example: `FG-350xG`
- Pattern example: `FG-350*G`
- `x` means one alphanumeric wildcard character
- `*` means multiple alphanumeric wildcard characters
- Matching is case-insensitive

## Notes

- Identical normalized values of the same type reuse the same label in one masking run
- Mapping is regenerated fresh for each masking run
- Rule template files are user-triggered local JSON only
- No persistent browser storage is used
