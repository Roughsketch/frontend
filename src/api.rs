use rocket_contrib::{Json, JsonValue};

#[derive(Debug, Deserialize, Serialize)]
struct Message {
    content: String,
    dest: u32,
}

#[post("/api/send", format = "application/json", data = "<message>")]
fn send(message: Json<Message>) -> JsonValue {
    info!("JSON: {:?}", message);
    json!({
        "content": message.content.clone(),
        "success": true,
    })
}