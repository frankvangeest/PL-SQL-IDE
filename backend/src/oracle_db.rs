use oracle::{Connection, Result, Row, ResultSet};

/// Connects to an Oracle database and returns a `Connection` object.
pub fn connect_to_oracle(username: &str, password: &str, service: &str) -> Result<Connection> {
    println!("connect_to_oracle: ({:?}, {:?}, {:?})", username, password, service);
    let conn = Connection::connect(username, password, service)?;
    Ok(conn)
}

/// Executes an SQL query on the provided `Connection` and returns the column names and the result set for further use.
pub fn execute_query<'a>(conn: &'a Connection, sql: &'a str) -> Result<(Vec<String>, Vec<Row>)> {
    println!("execute_query: {:?}", sql);

    let rows: ResultSet<'_,Row>;
    let mut column_names: Vec<String> = Vec::new();
    let mut result_rows: Vec<Row> = Vec::new();

    println!("building statement ...");
    let mut stmt = conn.statement(sql).build()?;
    println!("statement: {:?}", stmt);
    println!("fetching rows ...");
    // let rows = stmt.query(&[])?;
    // println!("rows: {:?}", rows);
    
    rows = match stmt.query(&[]) {
        Ok(resultset) => resultset,
        Err(e) => {
            println!("Failed to fetch rows: {}", e);
            return Ok((column_names, result_rows))
        }
    };
    println!("rows: {:?}", rows);

    println!("fetching column_names ..");
    column_names = rows.column_info().iter().map(|info| info.name().to_string()).collect();
    
    println!("fetching result_rows ..");
    for row_result in rows {
        let row = row_result?;
        result_rows.push(row);
    }

    println!("returning (column_names, result_rows)");
    Ok((column_names, result_rows))
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
