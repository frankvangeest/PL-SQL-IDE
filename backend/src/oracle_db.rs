use oracle::{Connection, ConnStatus, Result, Row, ResultSet};
use serde_json::json;

static mut db_connection: Option<Connection> = None;

pub fn connection_is_alive() -> bool {
    unsafe {
        match db_connection {
            Some(ref conn) => {
                match conn.status() {
                    Ok(ConnStatus::Normal) => return true,
                    Ok(ConnStatus::NotConnected) => return false,
                    Ok(ConnStatus::Closed) => return false,
                    _ => return false,
                }
            },
            None => return false,
        }
    }
}

/// Connects to an Oracle database and returns a `Connection` object.
pub fn connect_to_oracle(username: &str, password: &str, service: &str) -> std::result::Result<String, String> {
    println!("Connecting to database: '{:?}@{:?}'", username, service);

    if !connection_is_alive() {
        unsafe {
            match Connection::connect(username, password, service) {
                Ok(conn) => {
                    db_connection = Some(conn);
                    println!("Connected to database.");
                    Ok("Connected to database.".to_string())
                },
                Err(e) => Err(format!("Failed to connect: {}", e))
            }
        }
    } else {
        println!("Connection to database already exists.");
        Err("Connection to database already exists.".to_string())
    }
}

pub fn disconnect_from_oracle() -> std::result::Result<String, String> {
    unsafe {
        match db_connection.take() {
            Some(conn) => {
                match conn.close() {
                    Ok(_) => {
                        println!("Disconnected from database.");
                        Ok("Disconnected from database.".to_string())
                    },
                    Err(e) => Err(format!("Failed to disconnect: {}", e))
                }
            },
            None => Err("No active database connection to disconnect.".to_string())
        }
    }
}

/// Executes an SQL query on the provided `Connection` and returns a JSON string containing column names, types, and rows.
pub fn execute_query<'a>(sql: &'a str) -> Result<String> {
    println!("execute_query: {:?}", sql);

    if !connection_is_alive() {
        return Ok(json!({
            "column_names": ["error"],
            "column_types": ["string"],
            "rows": [["Can't run query: connection is not alive"]]
        }).to_string());
    }

    println!("building statement ...");
    unsafe {
        if let Some(ref conn) = db_connection {
            let mut stmt = conn.statement(sql).build()?;
            println!("statement: {:?}", stmt);
            println!("fetching rows ...");
            
            let rows = match stmt.query(&[]) {
                Ok(resultset) => resultset,
                Err(e) => {
                    return Ok(json!({
                        "column_names": ["error"],
                        "column_types": ["string"],
                        "rows": [[format!("Failed to fetch rows: {}", e)]]
                    }).to_string());
                }
            };
            println!("rows: {:?}", rows);

            let mut column_names = Vec::new();
            let mut column_types = Vec::new();
            let mut row_values = Vec::new();

            println!("fetching column_names and column_types ..");
            for info in rows.column_info() {
                column_names.push(info.name().to_string());
                column_types.push(format!("{:?}", info.oracle_type()));
            }
            
            println!("fetching row_values ..");
            for row_result in rows {
                let row = row_result?;
                let row_data: Vec<String> = row.sql_values().iter().map(|value| value.to_string()).collect();
                row_values.push(row_data);
            }

            println!("returning JSON string");
            Ok(json!({
                "column_names": column_names,
                "column_types": column_types,
                "rows": row_values
            }).to_string())
        } else {
            Ok(json!({
                "column_names": ["error"],
                "column_types": ["string"],
                "rows": [["No active database connection."]]
            }).to_string())
        }
    }
}

/// Displays the result set from a `Vec<Row>`.
pub fn display_result_set(rows: Vec<Row>) {
    println!("display_result_set:");
    for row in rows {
        for (idx, val) in row.sql_values().iter().enumerate() {
            if idx != 0 {
                print!(", ");
            }
            print!("{}", val);
        }
        println!();
    }
}
