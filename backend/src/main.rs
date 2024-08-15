// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use std::{thread, time};
use tauri::{Window, State};
use std::sync::Mutex;
use serde::Deserialize;
use std::fs::{self, File};
use std::io::prelude::*;
use std::path::{Path};


mod oracle_db;
use oracle_db::{connect_to_oracle, execute_query, display_result_set};
use oracle::{Connection}; // Do not use oracle::Result here. It will messup std::Result;


#[derive(Deserialize, Debug)]
struct ContentPayload {
    content: String,
    filename: String,
}

#[derive(Deserialize, Debug)]
struct ConnectionPayload {
    username: String,
    password: String,
    database: String,
}

#[derive(Deserialize, Debug)]
struct SQLPayload {
    sql: String,
}

pub struct DbConnection {
    pub connection: Mutex<Option<Connection>>,
}

impl DbConnection {
    pub fn new() -> Self {
        DbConnection {
            connection: Mutex::new(None),
        }
    }
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
        fs::create_dir(base_path).map_err(|e:std::io::Error| format!("Couldn't create data directory: {}", e))?;
    }
    let file_path = base_path.join(payload.filename);
    println!("save_content(): base_path '{}' , file_path '{}'", base_path.display(), file_path.display());

    let mut file = File::create(&file_path)
        .map_err(|e:std::io::Error| format!("Couldn't create file: {}", e))?;
    
    file.write_all(payload.content.as_bytes())
        .map_err(|e:std::io::Error| format!("Couldn't write to file: {}", e))?;
    
    Ok(format!("Content saved to {}.", file_path.display()))
}

#[tauri::command]
fn db_connect(state: State<DbConnection>, payload: ConnectionPayload) -> Result<String, String> {
    println!("db_connect(): '{:?}'", payload);
    

    let conn = Connection::connect(
                            payload.username.as_str(), 
                            payload.password.as_str(), 
                            payload.database.as_str()
                           ).map_err(|e| format!("Failed to connect: {}", e))?;
    
    // Lock the state and update the connection
    let mut connection = state.connection.lock().unwrap();
    *connection = Some(conn);



    // let connection_result: Result<oracle::Connection, oracle::Error> = connect_to_oracle(payload.username.as_str(), payload.password.as_str(), payload.database.as_str());

    // match connection_result {
    //     Ok(my_connection) => {
    //         println!("Connection to DB succeeded.");

    //         // Get db version
    //         let version_result: Result<(oracle::Version, String), oracle::Error> = my_connection.server_version();
    //         match version_result {
    //             Ok((server_ver,banner)) => {
    //                 // println!("\nDatabase Server Version: {}", version);
    //                 println!("\nDatabase Server Version: {}", server_ver);
    //                 println!("\nServer Banner: {}\n", banner);
    //             },
    //             Err(e) => {
    //                 println!("Connection to DB failed: {}", e);
    //             }
    //         }
    //     },
    //     Err(e) => {
    //         // Use the custom conversion function to convert an oracle::Error to a String
    //         // let error_string = error_to_string(e);
    //         // println!("Operation failed: {}", error_string);
    //         println!("Connection to DB failed: {}", e.to_string());
    //     }
    // }

    Ok(format!("db_connect {}", "done"))
}

// #[tauri::command]
// fn db_disconnect(payload: ConnectionPayload) -> Result<String, String> {
//     println!("db_disconnect(): '{:?}'", payload);
    
//     match DB_CONNECTION {
//         Ok(connection) => {
//             println!("Attempting disconnect ...");
//             let close: Result<(), oracle::Error> = connection.close();
//             match close {
//                 Ok(()) => {
//                     println!("Disconnection succeeded.");
//                     println!("\nBye");
//                 },
//                 Err(e) => {
//                     println!("Disconnect failed: {}", e);
//                 }
//             }
//         },
//         Err(e) => {
//             println!("Disconnect failed: {}", e.to_string());
//         }
//     }

//     Ok(format!("db_disconnect {}", "done"))
// }

#[tauri::command]
fn db_query(state: State<DbConnection>, payload: SQLPayload) -> Result<String, String> {
    println!("db_query(): '{:?}'", payload);

    let mut connection = state.connection.lock().unwrap();
    
    // If a connection exists, close it
    if let Some(conn) = connection.take() {
        println!("Connection exists. execute_query...");
        
        // let sql = "select count(asg_id) cnt from aansluitingen";
        let (column_names, rows) = execute_query(&conn, payload.sql.as_str())
                                                            .map_err(|e| format!("Query failed: {}", e))?;
    
        // Print the column names
        println!("{:?}", column_names.join(", "));
    
        // Display the result set
        display_result_set(rows);
    }

    Ok(format!("db_query {}", "done"))
}

fn main() {
    let current_dir = env::current_dir().unwrap();
    println!("Current directory: {}", current_dir.display());

    tauri::Builder::default()
        .manage(DbConnection::new()) // Initialize the shared state
        .invoke_handler(tauri::generate_handler![
            do_with_progress,
            save_content,
            db_connect,
            db_query,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
