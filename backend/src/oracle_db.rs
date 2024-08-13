use oracle::{Connection, Result, Row};

/// Connects to an Oracle database and returns a `Connection` object.
pub fn connect_to_oracle(username: &str, password: &str, service: &str) -> Result<Connection> {
    let conn = Connection::connect(username, password, service)?;
    Ok(conn)
}

/// Executes an SQL query on the provided `Connection` and returns the column names and the result set for further use.
pub fn execute_query<'a>(conn: &'a Connection, sql: &'a str) -> Result<(Vec<String>, Vec<Row>)> {
    let mut stmt = conn.statement(sql).build()?;
    let rows = stmt.query(&[])?;
    
    let column_names = rows.column_info().iter().map(|info| info.name().to_string()).collect();
    
    let mut result_rows = Vec::new();
    for row_result in rows {
        let row = row_result?;
        result_rows.push(row);
    }

    Ok((column_names, result_rows))
}

/// Displays the result set from a `Vec<Row>`.
pub fn display_result_set(rows: Vec<Row>) {
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
