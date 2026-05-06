# Design

## Program Architecture

The project uses a simple static front-end structure:

- `index.html` provides the UI
- `style.css` provides responsive layout and styling
- `app.js` contains all masking logic and DOM actions

## Main Functions

- `generateLabel(type, index)` creates labels like `EMAIL-A` and `EMAIL-AA`
- `applyCustomRules()` applies manual user replacements before automatic masking
- `applyAutoRules()` runs regex-based automatic masking rules
- `renderMappingTable()` shows the current mapping on screen
- `clearAll()` removes input, output, custom rules, and mapping table state

## Regex Rule Location

Regex rules are centralized in the `maskRules` array in `app.js` so PM can adjust matching patterns in one place.

## How to Add a New Masking Rule

1. Add a new rule object to `maskRules`
2. Define `type`
3. Define `pattern`
4. Add a matching counter entry in `createWorkingState()` if needed

## How to Adjust Label Format

Edit `generateLabel()` and `toAlphabeticLabel()` in `app.js`.

## Execution Order

1. Collect custom rules from the UI
2. Apply manual custom rules first
3. Apply automatic regex rules after custom rules
4. Render mapping table on screen

## Notes

- Identical values of the same type reuse the same label in one masking run
- Mapping is regenerated fresh for each masking run
- No persistent storage is used
