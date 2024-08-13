// backend_communication.js

// Import the necessary Tauri API components
const { appWindow } = window.__TAURI__.window;
const { invoke } = window.__TAURI__.tauri;


/**
 * The general function to handle sending data to the backend.
 * This does the actual sending.
 */
async function sendDataToBackend(eventName, data) {
  try {
    // Call the Rust command with the event name and data
    const response = await invoke(eventName, { payload: data });
    console.log('Response from backend:', response);
  } catch (error) {
    console.error('Error sending data to backend:', error);
    console.error('eventName & data:', eventName, data);
  }
}



/**
 * Handle Tauri events from the backend
 */
function handleTauriEvent(event) {
  console.log('Received event from backend:', event);
  // Process the event data as needed
}

// Set up the event listener for Tauri events
appWindow.listen('backend-event', handleTauriEvent);



/**
 * Async functions that send data to the backend.
 * These define all the types of commands we send.
 */
async function saveEditorContent() {
  const content = codeEditor.innerText;
  const filename = activeTab;
  await sendDataToBackend('save_content', { content, filename });
}

async function connectToOracleDB() {
  const username = 'testname1';
  const password = 'testpw1';
  const database = 'testdb1';
  await sendDataToBackend('db_connect', { username, password, database });
}

async function runSQL() {
  const sql = 'select 1 from dual;';
  await sendDataToBackend('db_query', { sql });
}



/**
 * Attach event listeners to UI elements (if any) to trigger backend communication.
 * Here we bind the commands to html elements e.g. buttons.
 */
document.getElementById('editor-save-button').addEventListener('click', saveEditorContent);
document.getElementById('connect-button').addEventListener('click', connectToOracleDB);
document.getElementById('editor-run-button').addEventListener('click', runSQL);
