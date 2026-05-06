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

Please update FG-123G status for FLEX.

Thanks.`;

const elements = {
  inputText: document.getElementById('inputText'),
  outputText: document.getElementById('outputText'),
  maskBtn: document.getElementById('maskBtn'),
  copyBtn: document.getElementById('copyBtn'),
  clearBtn: document.getElementById('clearBtn'),
  sampleBtn: document.getElementById('sampleBtn'),
  addRuleBtn: document.getElementById('addRuleBtn'),
  customRules: document.getElementById('customRules'),
  mappingTableBody: document.getElementById('mappingTableBody'),
  statusMessage: document.getElementById('statusMessage')
};

const maskRules = [
  {
    type: 'EMAIL',
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi
  },
  {
    type: 'IP',
    pattern: /\b(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}\b/g
  },
  {
    type: 'SN',
    pattern: /\bSN[A-Z0-9-]{6,}\b/gi
  },
  {
    type: 'PATH',
    pattern: /(?:[A-Za-z]:\\(?:[^\\\r\n]+\\)*[^\\\r\n]*|\/(?:[^\s/:]+\/)+[^\s]+|\/Users\/(?:[^\/\s]+\/)+[^\s]+)/g
  },
  {
    type: 'FILE',
    pattern: /\b[A-Za-z0-9._-]+\.(?:txt|log|csv|json|xml|zip|7z|pdf|docx?|xlsx?|pptx?)\b/gi
  },
  {
    type: 'ISSUE',
    pattern: /\b(?:#\d{4,}|\d{6,})\b/g
  },
  {
    type: 'VERSION',
    pattern: /\b(?:v?\d+(?:\.\d+){1,3}(?:\s*build\s*\d+)?)\b/gi
  }
];

let customRuleCount = 0;

initialize();

function initialize() {
  addCustomRuleRow('FG-123G', 'MODEL-A');
  addCustomRuleRow('FLEX', 'FACTORY-A');

  elements.maskBtn.addEventListener('click', handleMask);
  elements.copyBtn.addEventListener('click', copyResult);
  elements.clearBtn.addEventListener('click', clearAll);
  elements.sampleBtn.addEventListener('click', loadSample);
  elements.addRuleBtn.addEventListener('click', () => addCustomRuleRow('', ''));
}

function handleMask() {
  const originalText = elements.inputText.value;
  const workingState = createWorkingState();

  let maskedText = applyCustomRules(originalText, workingState);
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
    const originalValue = rule.source;
    const label = rule.label;

    if (!state.mappingByType.CUSTOM.has(originalValue)) {
      state.mappingByType.CUSTOM.set(originalValue, label);
      state.mappingEntries.push({ type: 'CUSTOM', original: originalValue, masked: label });
    }

    result = replaceLiteral(result, originalValue, label);
  });

  return result;
}

function applyAutoRules(text, state) {
  let result = text;

  maskRules.forEach((rule) => {
    result = result.replace(rule.pattern, (match) => {
      const normalized = match.trim();
      return getOrCreateLabel(rule.type, normalized, state);
    });
  });

  return result;
}

function getOrCreateLabel(type, originalValue, state) {
  if (state.mappingByType[type].has(originalValue)) {
    return state.mappingByType[type].get(originalValue);
  }

  const label = generateLabel(type, state.typeCounters[type]);
  state.typeCounters[type] += 1;
  state.mappingByType[type].set(originalValue, label);
  state.mappingEntries.push({ type, original: originalValue, masked: label });
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
  elements.customRules.innerHTML = '';
  customRuleCount = 0;
}

function loadSample() {
  clearAll();
  elements.inputText.value = sampleEmail;
  addCustomRuleRow('FG-123G', 'MODEL-A');
  addCustomRuleRow('FLEX', 'FACTORY-A');
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

function addCustomRuleRow(source = '', label = '') {
  customRuleCount += 1;

  const row = document.createElement('div');
  row.className = 'rule-row';
  row.dataset.rowId = String(customRuleCount);

  const sourceInput = document.createElement('input');
  sourceInput.type = 'text';
  sourceInput.placeholder = 'Original string';
  sourceInput.value = source;
  sourceInput.className = 'custom-source';

  const labelInput = document.createElement('input');
  labelInput.type = 'text';
  labelInput.placeholder = 'Replacement label';
  labelInput.value = label;
  labelInput.className = 'custom-label';

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.textContent = 'Remove';
  removeButton.className = 'remove-btn';
  removeButton.addEventListener('click', () => row.remove());

  row.appendChild(sourceInput);
  row.appendChild(labelInput);
  row.appendChild(removeButton);
  elements.customRules.appendChild(row);
}

function getCustomRules() {
  const rows = Array.from(elements.customRules.querySelectorAll('.rule-row'));

  return rows
    .map((row) => ({
      source: row.querySelector('.custom-source').value.trim(),
      label: row.querySelector('.custom-label').value.trim()
    }))
    .filter((rule) => rule.source && rule.label)
    .sort((a, b) => b.source.length - a.source.length);
}

function replaceLiteral(text, source, replacement) {
  return text.replace(new RegExp(escapeRegExp(source), 'g'), replacement);
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
