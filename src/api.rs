use rocket_contrib::Json;

#[derive(Debug, Deserialize, Serialize)]
struct Message {
    content: String,
    dest: u32,
}

#[post("/api/send", format = "application/json", data = "<message>")]
fn send(message: Json<Message>) -> String {
    println!("JSON: {:?}", message);
    message.content.clone() + "\n"
}