/* app.js */

// Monaco Editor Loader
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.1/min/vs' } });
require(['vs/editor/editor.main'], function() {
    monaco.editor.create(document.getElementById('editorContainer'), {
        value: 'select * from dual;',
        language: 'sql',
        theme: 'vs-dark',
        automaticLayout: true
    });
});

// Toggle visibility of left sidebar panels
function toggleTab(tabId, tabContainerId, panelId, panelContainerId) {
    let current_tab      = document.getElementById(tabId);
    let tabContainer     = document.getElementById(tabContainerId);
    let display          = document.getElementById(panelId).style.display;
    let leftPanelDisplay = document.getElementById(panelContainerId).style.display;
 
    // Set active tab
    if(current_tab.nodeName == 'I') {
        document.querySelectorAll('#' + tabContainerId + ' .icon-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        current_tab.classList.add('active');
    } else if (current_tab.nodeName == 'LI'){
        document.querySelectorAll('#' + tabContainerId + ' .text-tab').forEach(tab => {
            tab.children[0].classList.remove('active');
        });
        current_tab.firstElementChild.classList.add('active');
    } else {
        console.warn('Invalid tab type "' + tab.nodeName + '" for function toggleTab(), expecting <i> or <li>.');
    }
    // Hide all tab content
    document.querySelectorAll('#' + panelContainerId + ' .tab-content').forEach(panel => {
        panel.style.display = 'none';
    });
    // Set active tab content to visible
    if(display == 'block' && leftPanelDisplay == 'block') {
        document.getElementById(panelId).style.display = 'none';
        document.getElementById(panelContainerId).style.display = 'none';
    } else {
        document.getElementById(panelId).style.display = 'block';
        document.getElementById(panelContainerId).style.display = 'block';
    }

    
}

// Event listener for updating status bar information
const editorContainer = document.getElementById('editorContainer');
let lineCountElement = document.getElementById('lineCount');
let charCountElement = document.getElementById('charCount');

editorContainer.addEventListener('mouseup', updateStatusBar);
editorContainer.addEventListener('keyup', updateStatusBar);

function updateStatusBar() {
    // Placeholder logic for updating line and character count
    // Replace with actual Monaco API interaction if needed
    const editorText = monaco.editor.getModels()[0].getValue();
    const lineCount = editorText.split('\n').length;
    const charCount = editorText.length;

    lineCountElement.textContent = `Lines: ${lineCount}`;
    charCountElement.textContent = `Characters Selected: ${charCount}`;
}

// Update: Add file menu icon with dropdown
// const fileMenuHTML = `
//     <div class="dropdown">
//         <button class="btn btn-secondary dropdown-toggle" type="button" id="fileMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
//             <i class="fas fa-file-alt"></i> <!-- File icon -->
//         </button>
//         <div class="dropdown-menu" aria-labelledby="fileMenuButton">
//             <a class="dropdown-item" href="#">New</a>
//             <a class="dropdown-item" href="#">Open</a>
//             <a class="dropdown-item" href="#">Save</a>
//         </div>
//     </div>
// `;

// document.getElementById('topNavBar').innerHTML = fileMenuHTML + document.getElementById('topNavBar').innerHTML;
