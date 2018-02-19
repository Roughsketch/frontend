use rocket_contrib::Json;

#[derive(Debug, Deserialize, Serialize)]
struct Message {
    content: String,
    dest: u32,
}

#[post("/api/send", format = "application/json", data = "<message>")]
fn send(message: Json<Message>) -> Json {
    println!("JSON: {:?}", message);
    Json(json!({
        "content": message.content.clone(),
        "success": true,
    }))
}