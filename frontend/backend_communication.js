// backend_communication.js

// Import the necessary Tauri API components
const { appWindow } = window.__TAURI__.window;
const { invoke } = window.__TAURI__.tauri;

// Function to handle sending data to the backend
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

// Function to handle Tauri events from the backend
function handleTauriEvent(event) {
  console.log('Received event from backend:', event);
  // Process the event data as needed
}

// Set up the event listener for Tauri events
appWindow.listen('backend-event', handleTauriEvent);

// Example usage: sending data to the backend
async function saveEditorContent() {
  const content = codeEditor.innerText;
  const filename = activeTab;
  await sendDataToBackend('save_content', { content, filename });
}

// Attach event listeners to UI elements (if any) to trigger backend communication
document.getElementById('save-button').addEventListener('click', saveEditorContent);
