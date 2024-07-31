const { invoke } = window.__TAURI__.tauri;
const { appWindow } =  window.__TAURI__.window;
// import { invoke } from "@tauri-apps/api";
// import { appWindow } from "@tauri-apps/api/window";

let greetInputEl;
let greetMsgEl;

async function greet() {
  // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
  greetMsgEl.textContent = await invoke("greet", { name: greetInputEl.value });
}

// let testprogressbar = document.getElementById("my_progressbar");
// console.log('testprogressbar: ', testprogressbar);
// document.getElementById("my_progressbar").value = 5;

window.addEventListener("DOMContentLoaded", () => {
  greetInputEl = document.querySelector("#greet-input");
  greetMsgEl = document.querySelector("#greet-msg");
  document.querySelector("#greet-form").addEventListener("submit", (e) => {
    e.preventDefault();
    greet();
  });
});

// Call this from somewhere
async function progress() {
  const destroy = await appWindow.listen("progress-update", (p) => {
    // console.log(`Progress -> ${p.payload}`);
    let progressbar = document.getElementById("my_progressbar");
    progressbar.value = p.payload;
    // console.log('progressbar: ', progressbar);
  });
  const res = await invoke("do_with_progress");
  console.log(res);
  destroy();
}

progress();


