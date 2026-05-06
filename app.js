const sampleEmail = `Hi team,

Please help check the issue reported by user john.doe@example.com.
The device IP is 192.168.10.25 and backup server is 10.0.0.8.
The serial number is SN1234567890.
The log file is error_report_2026.txt.
The Windows path is C:\\Users\\TestUser\\Documents\\error_report_2026.txt.
The Linux path is /var/log/system/error.log.
The macOS path is /Users/testuser/Desktop/report.txt.
The Mantis ID is 943464.
The firmware version is v7.2.11 build6634.

Please update FG-123G, fg-3500g, FG-3501G and FG-300xG status for FLEX.
Also verify model fg-3000g and customer ACME.

Thanks.`;

const presetPatternRules = [
  { pattern: 'FG-350xG', replacement: 'MODEL-350X' },
  { pattern: 'FG-300xG', replacement: 'MODEL-300X' }
];

const maskRules = [
  {
    type: 'EMAIL',
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    normalize: (value) => value.trim().toLowerCase()
  },
  {
    type: 'IP',
    pattern: /\b(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}\b/g,
    normalize: (value) => value.trim()
  },
  {
    type: 'SN',
    pattern: /\bSN[A-Z0-9-]{6,}\b/gi,
    normalize: (value) => value.trim().toUpperCase()
  },
  {
    type: 'PATH',
    pattern: /(?:[A-Za-z]:\\(?:[^\\\r\n]+\\)*[^\\\r\n\s]+|\/(?:[^\s/:]+\/)+[^\s]+|\/Users\/(?:[^\/\s]+\/)+[^\s]+)/g,
    normalize: (value) => value.trim()
  },
  {
    type: 'FILE',
    pattern: /\b[A-Za-z0-9._-]+\.(?:txt|log|csv|json|xml|zip|7z|pdf|docx?|xlsx?|pptx?)\b/gi,
    normalize: (value) => value.trim().toLowerCase()
  },
  {
    type: 'ISSUE',
    pattern: /\b(?:#\d{4,}|\d{6,})\b/g,
    normalize: (value) => value.trim()
  },
  {
    type: 'VERSION',
    pattern: /\b(?:v?\d+(?:\.\d+){1,3}(?:\s*build\s*\d+)?)\b/gi,
    normalize: (value) => value.trim().toLowerCase().replace(/\s+/g, ' ')
  }
];

const elements = {
  inputText: document.getElementById('inputText'),
  outputText: document.getElementById('outputText'),
  maskBtn: document.getElementById('maskBtn'),
  copyBtn: document.getElementById('copyBtn'),
  clearBtn: document.getElementById('clearBtn'),
  sampleBtn: document.getElementById('sampleBtn'),
  addRuleBtn: document.getElementById('addRuleBtn'),
  customRules: document.getElementById('customRules'),
  patternRules: document.getElementById('patternRules'),
  mappingTableBody: document.getElementById('mappingTableBody'),
  statusMessage: document.getElementById('statusMessage')
};

let customRuleCount = 0;
let patternRuleCount = 0;

initialize();

function initialize() {
  attachEvents();
  resetRuleEditors();
}

function attachEvents() {
  elements.maskBtn.addEventListener('click', handleMask);
  elements.copyBtn.addEventListener('click', copyResult);
  elements.clearBtn.addEventListener('click', clearAll);
  elements.sampleBtn.addEventListener('click', loadSample);
  elements.addRuleBtn.addEventListener('click', () => addCustomRuleRow('', ''));
  document.getElementById('addPatternBtn').addEventListener('click', () => addPatternRuleRow('', ''));
}

function handleMask() {
  const originalText = elements.inputText.value;
  const workingState = createWorkingState();

  let maskedText = applyCustomRules(originalText, workingState);
  maskedText = applyPatternRules(maskedText, workingState);
  maskedText = applyAutoRules(maskedText, workingState);

  elements.outputText.value = maskedText;
  renderMappingTable(workingState.mappingEntries);
  setStatus('Masking completed locally in your browser.');
}

function createWorkingState() {
  return {
    typeCounters: {
      EMAIL: 0,
      IP: 0,
      SN: 0,
      PATH: 0,
      FILE: 0,
      ISSUE: 0,
      VERSION: 0,
      CUSTOM: 0
    },
    mappingByType: {
      EMAIL: new Map(),
      IP: new Map(),
      SN: new Map(),
      PATH: new Map(),
      FILE: new Map(),
      ISSUE: new Map(),
      VERSION: new Map(),
      CUSTOM: new Map()
    },
    mappingEntries: []
  };
}

function applyCustomRules(text, state) {
  const rules = getCustomRules();
  let result = text;

  rules.forEach((rule) => {
    const key = rule.source;
    if (!state.mappingByType.CUSTOM.has(key)) {
      state.mappingByType.CUSTOM.set(key, rule.label);
      state.mappingEntries.push({ type: 'CUSTOM', original: rule.source, masked: rule.label });
    }
    result = replaceLiteral(result, rule.source, rule.label, rule.ignoreCase);
  });

  return result;
}

function applyPatternRules(text, state) {
  const rules = getPatternRules();
  let result = text;

  rules.forEach((rule) => {
    const compiled = buildPatternRegex(rule.pattern);
    if (!compiled) {
      return;
    }

    result = result.replace(compiled.regex, (match) => {
      const normalizedKey = `${rule.pattern}::${match.trim().toUpperCase()}`;
      if (!state.mappingByType.CUSTOM.has(normalizedKey)) {
        state.mappingByType.CUSTOM.set(normalizedKey, rule.label);
        state.mappingEntries.push({ type: 'CUSTOM', original: match, masked: rule.label });
      }
      return rule.label;
    });
  });

  return result;
}

function applyAutoRules(text, state) {
  let result = text;

  maskRules.forEach((rule) => {
    if (rule.type === 'PATH') {
      result = replacePathsWithFileAwareness(result, rule, state);
      return;
    }

    result = result.replace(rule.pattern, (match) => {
      const normalizedValue = rule.normalize ? rule.normalize(match) : match.trim();
      return getOrCreateLabel(rule.type, normalizedValue, match, state);
    });
  });

  return result;
}

function replacePathsWithFileAwareness(text, rule, state) {
  return text.replace(rule.pattern, (match) => {
    const cleanedMatch = match.trim();
    const splitPath = splitPathAndTrailingFile(cleanedMatch);

    if (!splitPath.fileName) {
      const normalizedValue = rule.normalize ? rule.normalize(cleanedMatch) : cleanedMatch;
      return getOrCreateLabel(rule.type, normalizedValue, cleanedMatch, state);
    }

    const pathLabel = getOrCreateLabel(rule.type, splitPath.directory, splitPath.directory, state);
    const fileLabel = getOrCreateLabel('FILE', splitPath.fileName.toLowerCase(), splitPath.fileName, state);
    return `${pathLabel}${splitPath.separator}${fileLabel}`;
  });
}

function splitPathAndTrailingFile(pathValue) {
  const separatorIndex = Math.max(pathValue.lastIndexOf('\\\\'), pathValue.lastIndexOf('/'));
  if (separatorIndex === -1) {
    return { directory: pathValue, fileName: '', separator: '' };
  }

  const directory = pathValue.slice(0, separatorIndex);
  const separator = pathValue.slice(separatorIndex, separatorIndex + 1);
  const fileName = pathValue.slice(separatorIndex + 1);

  if (!/\.[A-Za-z0-9]{1,8}$/.test(fileName)) {
    return { directory: pathValue, fileName: '', separator: '' };
  }

  return { directory, fileName, separator };
}

function getOrCreateLabel(type, key, originalValue, state) {
  if (state.mappingByType[type].has(key)) {
    return state.mappingByType[type].get(key);
  }

  const label = generateLabel(type, state.typeCounters[type]);
  state.typeCounters[type] += 1;
  state.mappingByType[type].set(key, label);
  state.mappingEntries.push({ type, original: originalValue.trim(), masked: label });
  return label;
}

function generateLabel(type, index) {
  return `${type}-${toAlphabeticLabel(index)}`;
}

function toAlphabeticLabel(index) {
  let value = index;
  let output = '';

  do {
    output = String.fromCharCode(65 + (value % 26)) + output;
    value = Math.floor(value / 26) - 1;
  } while (value >= 0);

  return output;
}

function renderMappingTable(entries) {
  if (!entries.length) {
    elements.mappingTableBody.innerHTML = '<tr><td colspan="3" class="empty">No mapping generated yet.</td></tr>';
    return;
  }

  elements.mappingTableBody.innerHTML = entries
    .map((entry) => `<tr><td>${escapeHtml(entry.type)}</td><td>${escapeHtml(entry.original)}</td><td>${escapeHtml(entry.masked)}</td></tr>`)
    .join('');
}

function clearAll() {
  elements.inputText.value = '';
  elements.outputText.value = '';
  elements.mappingTableBody.innerHTML = '<tr><td colspan="3" class="empty">No mapping generated yet.</td></tr>';
  elements.statusMessage.textContent = '';
  resetRuleEditors();
}

function loadSample() {
  clearAll();
  elements.inputText.value = sampleEmail;
  setStatus('Sample email loaded with fake data.');
}

async function copyResult() {
  const text = elements.outputText.value;

  if (!text) {
    setStatus('Nothing to copy yet.');
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    setStatus('Masked result copied to clipboard.');
  } catch (_error) {
    setStatus('Clipboard copy is blocked by this browser. Please copy manually.');
  }
}

function resetRuleEditors() {
  elements.customRules.innerHTML = '';
  elements.patternRules.innerHTML = '';
  customRuleCount = 0;
  patternRuleCount = 0;

  addCustomRuleRow('FG-123G', 'MODEL-A');
  addCustomRuleRow('FLEX', 'FACTORY-A');
  presetPatternRules.forEach((rule) => addPatternRuleRow(rule.pattern, rule.replacement));
}

function addCustomRuleRow(source = '', label = '') {
  customRuleCount += 1;
  const row = createRuleRow({
    rowId: customRuleCount,
    sourcePlaceholder: 'Original string',
    labelPlaceholder: 'Replacement label',
    sourceValue: source,
    labelValue: label,
    ignoreCase: true
  });
  elements.customRules.appendChild(row);
}

function addPatternRuleRow(pattern = '', label = '') {
  patternRuleCount += 1;
  const row = createRuleRow({
    rowId: `pattern-${patternRuleCount}`,
    sourcePlaceholder: 'Pattern e.g. FG-350xG',
    labelPlaceholder: 'Replacement label',
    sourceValue: pattern,
    labelValue: label,
    ignoreCase: true,
    helperText: 'x matches one alphanumeric character. Example: FG-350xG matches FG-3500G / FG-3501G.'
  });
  elements.patternRules.appendChild(row);
}

function createRuleRow(options) {
  const row = document.createElement('div');
  row.className = 'rule-row';
  row.dataset.rowId = String(options.rowId);

  const sourceInput = document.createElement('input');
  sourceInput.type = 'text';
  sourceInput.placeholder = options.sourcePlaceholder;
  sourceInput.value = options.sourceValue || '';
  sourceInput.className = 'custom-source';

  const labelInput = document.createElement('input');
  labelInput.type = 'text';
  labelInput.placeholder = options.labelPlaceholder;
  labelInput.value = options.labelValue || '';
  labelInput.className = 'custom-label';

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.textContent = 'Remove';
  removeButton.className = 'remove-btn';
  removeButton.addEventListener('click', () => row.remove());

  row.appendChild(sourceInput);
  row.appendChild(labelInput);
  row.appendChild(removeButton);

  if (options.helperText) {
    const helper = document.createElement('p');
    helper.className = 'rule-helper';
    helper.textContent = options.helperText;
    row.appendChild(helper);
  }

  row.dataset.ignoreCase = options.ignoreCase ? 'true' : 'false';
  return row;
}

function getCustomRules() {
  const rows = Array.from(elements.customRules.querySelectorAll('.rule-row'));

  return rows
    .map((row) => ({
      source: row.querySelector('.custom-source').value.trim(),
      label: row.querySelector('.custom-label').value.trim(),
      ignoreCase: row.dataset.ignoreCase === 'true'
    }))
    .filter((rule) => rule.source && rule.label)
    .sort((a, b) => b.source.length - a.source.length);
}

function getPatternRules() {
  const rows = Array.from(elements.patternRules.querySelectorAll('.rule-row'));

  return rows
    .map((row) => ({
      pattern: row.querySelector('.custom-source').value.trim(),
      label: row.querySelector('.custom-label').value.trim()
    }))
    .filter((rule) => rule.pattern && rule.label)
    .sort((a, b) => b.pattern.length - a.pattern.length);
}

function buildPatternRegex(patternText) {
  const trimmed = patternText.trim();
  if (!trimmed) {
    return null;
  }

  const escaped = escapeRegExp(trimmed).replace(/x/gi, '[A-Za-z0-9]');
  return {
    regex: new RegExp(`\\b${escaped}\\b`, 'gi')
  };
}

function replaceLiteral(text, source, replacement, ignoreCase) {
  const flags = ignoreCase ? 'gi' : 'g';
  return text.replace(new RegExp(escapeRegExp(source), flags), replacement);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setStatus(message) {
  elements.statusMessage.textContent = message;
}
