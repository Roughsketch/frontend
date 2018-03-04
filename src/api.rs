use rocket::Outcome;
use rocket::http::{Cookie, Cookies};
use rocket::request::{self, Request, FromRequest};
use rocket_contrib::{Json, JsonValue};

#[derive(Debug, Deserialize, Serialize)]
struct Message {
    content: String,
    dest: u32,
}

#[derive(Debug, Deserialize, Serialize)]
struct Login {
    user: String,
    pass: String,
}

struct AuthedUser;

impl<'a, 'r> FromRequest<'a, 'r> for AuthedUser {
    type Error = ();

    fn from_request(request: &'a Request<'r>) -> request::Outcome<AuthedUser, ()> {
        match request.cookies().get_private("auth") {
            Some(_) => Outcome::Success(AuthedUser),
            None => Outcome::Forward(()),
        }
    }
}

#[post("/api/send", format = "application/json", data = "<message>")]
fn send(message: Json<Message>, _user: AuthedUser) -> JsonValue {
    info!("JSON: {:?}", message);
    json!({
        "content": message.content.clone(),
        "success": true,
    })
}

#[get("/api/list")]
fn list_authed(_user: AuthedUser) -> JsonValue {
    json!({
        "success": true,
    })
}

#[get("/api/list", rank = 2)]
fn list_invalid() -> JsonValue {
    json!({
        "success": false,
    })
}

/// This is a very insecure login. It is meant to be a placeholder.
/// 
/// TODO: Change this so it reads from a SQLite database or something.
#[post("/api/login", format = "application/json", data = "<login>")]
fn login(login: Json<Login>, mut cookies: Cookies) -> JsonValue {
    if login.user == "root" && login.pass == "toor" {
        cookies.add_private(Cookie::new("auth", "true"));

        json!({
            "success": true,
        })
    } else {
        json!({
            "error": "Invalid login credentials.",
            "success": false,
        })
    }
}

#[get("/api/logout")]
fn logout(mut cookies: Cookies) -> JsonValue {
    cookies.remove_private(Cookie::new("auth", "true"));
    json!({
        "success": true,
    })
}