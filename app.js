const APP_VERSION = 'v1.6';
const EFFECTIVE_TIME = '2026-05-06 13:44 Asia/Taipei';

const FALLBACK_CUSTOM_RULES = [
  { source: 'FG-123G', label: 'MODEL-A' },
  { source: 'FLEX', label: 'FACTORY-A' }
];

const FALLBACK_PATTERN_RULES = [
  { pattern: 'FG-350xG', label: 'MODEL-350X' },
  { pattern: 'FG-300xG', label: 'MODEL-300X' },
  { pattern: 'FG-350*G', label: 'MODEL-350-FAMILY' }
];

const sampleEmail = `Hi team,

Please help check the issue reported by user john.doe@example.com.
The device IP is 192.168.10.25 and backup server is 10.0.0.8.
The serial number is SN1234567890.
The log file is error_report_2026.txt.
The Windows path is "C:\\Users\\Test User\\Documents\\error_report_2026.txt".
The Linux path is /var/log/system/error.log;
The macOS path is /Users/testuser/Desktop/report.txt.
The archive path is /opt/backups/report.tar.gz.
The release path is D:\\Build Output\\release notes\\firmware_v7.2.11.zip.
The Mantis ID is 943464.
The firmware version is v7.2.11 build6634.
The fallback version is R1.2.3 and patch version 7.2.
The hotfix is build 6634.

Please update FG-123G, fg-3500g, FG-3501G, FG-300xG, FG-350ABG, FG-350XYG and FG-3509G status for FLEX.
Also verify model fg-3000g, FG-350TESTG and customer ACME.

Thanks.`;

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
    pattern: /(?:(?:"[A-Za-z]:\\(?:[^\\\r\n"]+\\)*[^\\\r\n"]+")|(?:[A-Za-z]:\\(?:[^\\\r\n]+\\)*[^\\\r\n\s]+)|(?:\/(?:[^\s/:]+\/)+[^\s]+)|(?:\/Users\/(?:[^\/\s]+\/)+[^\s]+))/g,
    normalize: (value) => value.trim().replace(/^"|"$/g, '')
  },
  {
    type: 'FILE',
    pattern: /\b[A-Za-z0-9._ -]+\.(?:txt|log|csv|json|xml|zip|7z|pdf|docx?|xlsx?|pptx?|tar\.gz)\b/gi,
    normalize: (value) => value.trim().toLowerCase()
  },
  {
    type: 'ISSUE',
    pattern: /\b(?:#\d{4,}|\d{6,})\b/g,
    normalize: (value) => value.trim()
  },
  {
    type: 'VERSION',
    pattern: /\b(?:v?\d+(?:\.\d+){1,3}(?:[-\s_]*build\s*\d+)?|R\d+(?:\.\d+){1,3}|build\s*\d+)\b/gi,
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
  maskBtnMobile: document.getElementById('maskBtnMobile'),
  copyBtnMobile: document.getElementById('copyBtnMobile'),
  moreBtnMobile: document.getElementById('moreBtnMobile'),
  clearBtnMobile: document.getElementById('clearBtnMobile'),
  sampleBtnMobile: document.getElementById('sampleBtnMobile'),
  addRuleBtn: document.getElementById('addRuleBtn'),
  addPatternBtn: document.getElementById('addPatternBtn'),
  exportRulesBtn: document.getElementById('exportRulesBtn'),
  importRulesFile: document.getElementById('importRulesFile'),
  toggleCustomRulesBtn: document.getElementById('toggleCustomRulesBtn'),
  togglePatternRulesBtn: document.getElementById('togglePatternRulesBtn'),
  toggleRulesPanelBtn: document.getElementById('toggleRulesPanelBtn'),
  toggleMappingBtn: document.getElementById('toggleMappingBtn'),
  toggleMetaBtn: document.getElementById('toggleMetaBtn'),
  customRulesPanel: document.getElementById('customRulesPanel'),
  patternRulesPanel: document.getElementById('patternRulesPanel'),
  rulesContainer: document.getElementById('rulesContainer'),
  mappingPanel: document.getElementById('mappingPanel'),
  mobileMorePanel: document.getElementById('mobileMorePanel'),
  footerMeta: document.getElementById('footerMeta'),
  customRules: document.getElementById('customRules'),
  patternRules: document.getElementById('patternRules'),
  mappingTableBody: document.getElementById('mappingTableBody'),
  mappingTypeFilter: document.getElementById('mappingTypeFilter'),
  mappingSearch: document.getElementById('mappingSearch'),
  statusMessage: document.getElementById('statusMessage'),
  appVersion: document.getElementById('appVersion'),
  effectiveTime: document.getElementById('effectiveTime')
};

let customRuleCount = 0;
let patternRuleCount = 0;
let latestMappingEntries = [];

initialize();

function initialize() {
  renderMetaInfo();
  attachEvents();
  loadDefaultRules();
}

function renderMetaInfo() {
  elements.appVersion.textContent = `Version: ${APP_VERSION}`;
  elements.effectiveTime.textContent = `Effective: ${EFFECTIVE_TIME}`;
}

function attachEvents() {
  elements.maskBtn.addEventListener('click', handleMask);
  elements.copyBtn.addEventListener('click', copyResult);
  elements.clearBtn.addEventListener('click', clearAll);
  elements.sampleBtn.addEventListener('click', loadSample);
  if (elements.maskBtnMobile) elements.maskBtnMobile.addEventListener('click', handleMask);
  if (elements.copyBtnMobile) elements.copyBtnMobile.addEventListener('click', copyResult);
  if (elements.clearBtnMobile) elements.clearBtnMobile.addEventListener('click', clearAll);
  if (elements.sampleBtnMobile) elements.sampleBtnMobile.addEventListener('click', loadSample);
  if (elements.moreBtnMobile) elements.moreBtnMobile.addEventListener('click', toggleMobileMore);
  elements.addRuleBtn.addEventListener('click', () => addCustomRuleRow('', ''));
  elements.addPatternBtn.addEventListener('click', () => addPatternRuleRow('', ''));
  elements.exportRulesBtn.addEventListener('click', exportRules);
  elements.importRulesFile.addEventListener('change', importRules);
  elements.mappingTypeFilter.addEventListener('change', applyMappingFilters);
  elements.mappingSearch.addEventListener('input', applyMappingFilters);
  elements.toggleCustomRulesBtn.addEventListener('click', () => togglePanel(elements.customRulesPanel, elements.toggleCustomRulesBtn, 'Custom Rules'));
  elements.togglePatternRulesBtn.addEventListener('click', () => togglePanel(elements.patternRulesPanel, elements.togglePatternRulesBtn, 'Pattern Rules'));
  elements.toggleRulesPanelBtn.addEventListener('click', () => togglePanel(elements.rulesContainer, elements.toggleRulesPanelBtn, 'Rules Panel'));
  elements.toggleMappingBtn.addEventListener('click', () => togglePanel(elements.mappingPanel, elements.toggleMappingBtn, 'Mapping'));
  if (elements.toggleMetaBtn) {
    elements.toggleMetaBtn.addEventListener('click', toggleFooterMeta);
  }
}

function loadDefaultRules() {
  resetRuleEditors();

  const defaultCustomRules = Array.isArray(window.DEFAULT_CUSTOM_RULES) && window.DEFAULT_CUSTOM_RULES.length
    ? window.DEFAULT_CUSTOM_RULES
    : FALLBACK_CUSTOM_RULES;

  const defaultPatternRules = Array.isArray(window.DEFAULT_PATTERN_RULES) && window.DEFAULT_PATTERN_RULES.length
    ? window.DEFAULT_PATTERN_RULES
    : FALLBACK_PATTERN_RULES;

  defaultCustomRules.forEach((rule) => addCustomRuleRow(rule.source || '', rule.label || ''));
  defaultPatternRules.forEach((rule) => addPatternRuleRow(rule.pattern || '', rule.label || ''));
}

function togglePanel(panel, button, labelBase) {
  const isCollapsed = panel.classList.contains('collapsed');
  panel.classList.toggle('collapsed', !isCollapsed);
  button.textContent = isCollapsed ? `Hide ${labelBase}` : `${labelBase}`;
}

function toggleFooterMeta() {
  const isOpen = elements.footerMeta.classList.contains('open');
  elements.footerMeta.classList.toggle('open', !isOpen);
  elements.toggleMetaBtn.textContent = isOpen ? 'Info' : 'Hide Info';
}

function toggleMobileMore() {
  const isOpen = elements.mobileMorePanel.classList.contains('open');
  elements.mobileMorePanel.classList.toggle('open', !isOpen);
  elements.moreBtnMobile.textContent = isOpen ? 'More' : 'Hide';
}

function handleMask() {
  const originalText = elements.inputText.value;
  const workingState = createWorkingState();

  let maskedText = applyCustomRules(originalText, workingState);
  maskedText = applyPatternRules(maskedText, workingState);
  maskedText = applyAutoRules(maskedText, workingState);

  elements.outputText.value = maskedText;
  latestMappingEntries = workingState.mappingEntries.slice();
  applyMappingFilters();
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
    const key = rule.source.toLowerCase();
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
      const normalizedKey = `${rule.pattern.toLowerCase()}::${match.trim().toUpperCase()}`;
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
      const cleaned = stripTrailingPunctuation(match);
      const trailing = match.slice(cleaned.length);
      const normalizedValue = rule.normalize ? rule.normalize(cleaned) : cleaned.trim();
      const label = getOrCreateLabel(rule.type, normalizedValue, cleaned, state);
      return `${label}${trailing}`;
    });
  });

  return result;
}

function replacePathsWithFileAwareness(text, rule, state) {
  return text.replace(rule.pattern, (match) => {
    const trimmed = match.trim();
    const cleanedMatch = stripTrailingPunctuation(trimmed);
    const trailing = trimmed.slice(cleanedMatch.length);
    const unquoted = cleanedMatch.replace(/^"|"$/g, '');
    const splitPath = splitPathAndTrailingFile(unquoted);

    if (!splitPath.fileName) {
      const normalizedValue = rule.normalize ? rule.normalize(cleanedMatch) : cleanedMatch;
      const label = getOrCreateLabel(rule.type, normalizedValue, cleanedMatch, state);
      return `${label}${trailing}`;
    }

    const pathLabel = getOrCreateLabel(rule.type, splitPath.directory, splitPath.directory, state);
    const fileLabel = getOrCreateLabel('FILE', splitPath.fileName.toLowerCase(), splitPath.fileName, state);
    return `${pathLabel}${splitPath.separator}${fileLabel}${trailing}`;
  });
}

function splitPathAndTrailingFile(pathValue) {
  const separatorIndex = Math.max(pathValue.lastIndexOf('\\'), pathValue.lastIndexOf('/'));
  if (separatorIndex === -1) {
    return { directory: pathValue, fileName: '', separator: '' };
  }

  const directory = pathValue.slice(0, separatorIndex);
  const separator = pathValue.slice(separatorIndex, separatorIndex + 1);
  const fileName = pathValue.slice(separatorIndex + 1);

  if (!/\.(?:txt|log|csv|json|xml|zip|7z|pdf|docx?|xlsx?|pptx?|tar\.gz)$/i.test(fileName)) {
    return { directory: pathValue, fileName: '', separator: '' };
  }

  return { directory, fileName, separator };
}

function stripTrailingPunctuation(value) {
  return value.replace(/[.,;:!?]+$/g, '');
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

function applyMappingFilters() {
  const filterType = elements.mappingTypeFilter.value;
  const keyword = elements.mappingSearch.value.trim().toLowerCase();

  const filteredEntries = latestMappingEntries.filter((entry) => {
    const typeMatch = filterType === 'ALL' || entry.type === filterType;
    const keywordMatch = !keyword || `${entry.type} ${entry.original} ${entry.masked}`.toLowerCase().includes(keyword);
    return typeMatch && keywordMatch;
  });

  renderMappingTable(filteredEntries);
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
  elements.mappingTypeFilter.value = 'ALL';
  elements.mappingSearch.value = '';
  latestMappingEntries = [];
  elements.mappingTableBody.innerHTML = '<tr><td colspan="3" class="empty">No mapping generated yet.</td></tr>';
  elements.statusMessage.textContent = '';
  loadDefaultRules();
}

function loadSample() {
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
    sourcePlaceholder: 'Pattern e.g. FG-350xG or FG-350*G',
    labelPlaceholder: 'Replacement label',
    sourceValue: pattern,
    labelValue: label,
    ignoreCase: true,
    helperText: 'x = one alphanumeric character, * = multiple alphanumeric characters. Example: FG-350xG or FG-350*G.'
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

  let escaped = '';
  for (const char of trimmed) {
    if (char === '*') {
      escaped += '[A-Za-z0-9]*';
    } else if (char === 'x' || char === 'X') {
      escaped += '[A-Za-z0-9]';
    } else {
      escaped += escapeRegExp(char);
    }
  }

  return {
    regex: new RegExp(`\\b${escaped}\\b`, 'gi')
  };
}

function exportRules() {
  const exportData = {
    version: APP_VERSION,
    exportedAt: EFFECTIVE_TIME,
    customRules: getCustomRules().map((rule) => ({ source: rule.source, label: rule.label })),
    patternRules: getPatternRules().map((rule) => ({ pattern: rule.pattern, label: rule.label }))
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = 'mail-sensitive-info-masker-rules.json';
  anchor.click();
  URL.revokeObjectURL(objectUrl);
  setStatus('Rule template exported locally.');
}

function importRules(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      applyImportedRules(parsed);
      setStatus('Rule template imported locally.');
    } catch (_error) {
      setStatus('Invalid rule template file.');
    }
    elements.importRulesFile.value = '';
  };
  reader.readAsText(file);
}

function applyImportedRules(data) {
  resetRuleEditors();

  const customRules = Array.isArray(data.customRules) ? data.customRules : [];
  const patternRules = Array.isArray(data.patternRules) ? data.patternRules : [];

  customRules.forEach((rule) => addCustomRuleRow(rule.source || '', rule.label || ''));
  patternRules.forEach((rule) => addPatternRuleRow(rule.pattern || '', rule.label || ''));
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
