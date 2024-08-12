// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use std::{thread, time};
use tauri::Window;
use serde::Deserialize;
use std::fs::{self, File};
use std::io::prelude::*;
use std::path::{Path};


#[derive(Deserialize, Debug)]
struct ContentPayload {
    content: String,
    filename: String,
}


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn do_with_progress(window: Window) -> String {
    let wait = time::Duration::from_millis(500);
    for i in 0..10 {
        window.emit("progress-update", i+1).unwrap();
        thread::sleep(wait);
    }
    "done".into()
}

#[tauri::command]
fn save_content(payload: ContentPayload) -> Result<String, String> {
    let base_path = Path::new("data");
    if !base_path.exists() {
        fs::create_dir(base_path).map_err(|e| format!("Couldn't create data directory: {}", e))?;
    }
    let file_path = base_path.join(payload.filename);
    println!("save_content(): base_path '{}' , file_path '{}'", base_path.display(), file_path.display());

    let mut file = File::create(&file_path)
        .map_err(|e| format!("Couldn't create file: {}", e))?;
    
    file.write_all(payload.content.as_bytes())
        .map_err(|e| format!("Couldn't write to file: {}", e))?;
    
    Ok(format!("Content saved to {}", file_path.display()))
}

fn main() {
    let current_dir = env::current_dir().unwrap();
    println!("Current directory: {}", current_dir.display());

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            do_with_progress,
            save_content
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
