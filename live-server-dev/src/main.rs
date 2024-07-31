use live_server::listen;

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    println!("Starting live-server for development!");
    listen("127.0.0.1", 5500, "./../frontend/").await?;
    Ok(())
}
