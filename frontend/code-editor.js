const codeEditor = document.getElementById('code');
const lineNumbersDiv = document.getElementById('line-numbers');
const fileTree = document.getElementById('file-list');
const tabs = document.getElementById('tabs');

let activeTab = 'file_1.sql'; // Track the active tab

const contents = {
  'file_1.sql': `SELECT * FROM users;`,
  'file_2.sql': `INSERT INTO users (id, name) VALUES (1, 'John Doe');`,
  'file_3.sql': `UPDATE users SET name = 'Jane Doe' WHERE id = 1;`
};

codeEditor.addEventListener('input', handleInput);
codeEditor.addEventListener('scroll', syncScroll);
codeEditor.addEventListener('keyup', updateLineNumbers);

function handleInput() {
  saveContent();
  updateEditor();
}

function updateEditor() {
  const code = codeEditor.innerText;
  const highlightedCode = syntaxHighlight(code);
  codeEditor.innerHTML = highlightedCode;
  placeCaretAtEnd(codeEditor);
  updateLineNumbers();
}

function updateLineNumbers() {
  const lines = codeEditor.innerText.split('\n').length;
  let lineNumbers = '';
  for (let i = 1; i <= lines; i++) {
    lineNumbers += `<div>${i}</div>`;
  }
  lineNumbersDiv.innerHTML = lineNumbers;
}

function syncScroll() {
  lineNumbersDiv.scrollTop = codeEditor.scrollTop;
}

function placeCaretAtEnd(el) {
  el.focus();
  const range = document.createRange();
  range.selectNodeContents(el);
  range.collapse(false);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
}

function syntaxHighlight(code) {
  // Replace special characters to display correctly in HTML
  let htmlCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // PL/SQL keywords
  const keywords = ['SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE', 'PROCEDURE', 'FUNCTION', 'BEGIN', 'END', 'DECLARE', 'IF', 'ELSE', 'ELSIF', 'FOR', 'LOOP', 'WHILE', 'RETURN', 'THEN'];

  // Simple syntax highlighting for keywords (case-insensitive)
  keywords.forEach(keyword => {
    const pattern = new RegExp('\\b' + keyword + '\\b', 'gi');
    htmlCode = htmlCode.replace(pattern, match => `<span class="keyword">${match}</span>`);
  });

  // Simple syntax highlighting for comments
  htmlCode = htmlCode.replace(/(--[^\n]*)/g, '<span class="comment">$1</span>');

  // Simple syntax highlighting for strings
  htmlCode = htmlCode.replace(/('.*?')/g, '<span class="string">$1</span>');

  // Simple syntax highlighting for numbers
  htmlCode = htmlCode.replace(/\b(\d+)\b/g, '<span class="number">$1</span>');

  return htmlCode;
}

function loadContent(contentKey, tabId) {
  // Save the content of the current tab
  saveContent();

  // Load the content of the new tab
  codeEditor.innerText = contents[contentKey] || '';
  updateEditor();

  // Update active tab
  document.querySelectorAll('.tab-button').forEach(button => {
    button.classList.remove('active');
  });
  const tabElement = document.getElementById(tabId);
  if (tabElement) {
    tabElement.classList.add('active');
  }
  activeTab = contentKey; // Track the active tab
}

function saveContent() {
  if (activeTab && codeEditor.innerText !== contents[activeTab]) {
    contents[activeTab] = codeEditor.innerText;
  }
}

function createNewFile() {
  const fileName = prompt('Enter the new file name (with .sql extension):');
  if (fileName && !contents.hasOwnProperty(fileName)) {
    contents[fileName] = '';

    // Create a new editor tab for the given file
    const newTabId = 'tab' + (Object.keys(contents).length);
    const newTab = document.createElement('button');
    newTab.id = newTabId;
    newTab.className = 'tab-button';
    newTab.textContent = fileName;
    newTab.onclick = () => loadContent(fileName, newTabId);
    
    // Add the new file before the + tab
    const newTabButton = document.getElementById('new-tab');
    const fileTabs = document.getElementById('file-tabs');
    console.log('newTabButton', newTabButton);
    console.log('fileTabs', fileTabs);
    if (newTabButton && fileTabs) {
      fileTabs.insertBefore(newTab, newTabButton);
    } else {
      console.warn('New tab button or tabs element is missing.');
    }

    // Create new project tree element
    const newFile = document.createElement('li');
    newFile.textContent = fileName;
    newFile.onclick = () => loadContent(fileName, newTabId);

    // Add file to the project tree
    const fileTree = document.getElementById('file-tree');
    if (fileTree) {
      fileTree.appendChild(newFile);
    } else {
      console.warn('File tree element is missing.');
    }
  } else if (!fileName) {
    console.warn('File name is not provided.');
  } else {
    console.warn('File name already exists.');
  }
}

// Initialize line numbers and load the content of the active tab on page load
window.onload = function() {
  loadContent(activeTab, 'tab1');
  updateLineNumbers();
};
