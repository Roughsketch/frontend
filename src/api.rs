use rocket::Outcome;
use rocket::http::{Cookie, Cookies};
use rocket::request::{self, Request, FromRequest};
use rocket_contrib::{Json, JsonValue};

use db::{self, DbConn};
use db::models::*;
use db::schema::xbees::dsl::*;
use diesel::prelude::*;

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

/// Represents a user who is authorized via private cookies.
/// A user will become authorized once they login with
/// the proper credentials using the /api/login endpoint.
pub struct AuthedUser;

/// Controls how an authorized user's requests are handled.
/// If a user is authenticated, it will succeed. Otherwise
/// the request will be forwarded to another handler.
impl<'a, 'r> FromRequest<'a, 'r> for AuthedUser {
    type Error = ();

    fn from_request(request: &'a Request<'r>) -> request::Outcome<AuthedUser, ()> {
        match request.cookies().get_private("auth") {
            Some(_) => Outcome::Success(AuthedUser),
            None => Outcome::Forward(()),
        }
    }
}

/// Sends the data given to the xbee network.
/// 
/// This endpoint takes JSON data that contains both the
/// destination node's id and the content of the message.
/// 
/// **Note**: This endpoint requires that the user is authorized.
/// 
/// # Example
/// ```json
/// {
///     "content": "Data to send",
///     "dest": 1234
/// }
/// ```
#[post("/api/send", format = "application/json", data = "<message>")]
fn send(message: Json<Message>, _user: AuthedUser) -> JsonValue {
    info!("JSON: {:?}", message);
    json!({
        "content": message.content.clone(),
        "success": true,
    })
}

/// A temporary endpoint that adds the given data to the database.
/// 
/// This endpoint takes JSON data that describes an Xbee. 
/// 
/// **Note**: This endpoint requires that the user is authorized.
/// 
/// # Example
/// ```json
/// {
///     "node_id": 1234,
///     "name": "Temperature Sensor",
///     "units": "C"
/// }
/// ```
#[post("/api/add", format = "application/json", data = "<xbee>")]
fn add(conn: DbConn, xbee: Json<NewXbee>, _user: AuthedUser) -> JsonValue {
    db::create_xbee(&conn, xbee.node_id, &xbee.name, &xbee.units);

    json!({
        "success": true,
    })
}

/// Returns a list of active nodes and their most recent values.
/// This data will be returned as a JSON object where the xbee
/// data is stored in an array.
/// 
/// **Note**: This endpoint requires that the user is authorized.
/// 
/// # Example
/// ```json
/// {
///     "nodes": [{
///         "id": 1,
///         "name": "Temperature Sensor",
///         "node_id": 1234,
///         "units": "C"
///     }, {
///         "id": 2,
///         "name": "Weight Sensor",
///         "node_id": 4321,
///         "units": "kg"
///     }],
///     "success": true
/// }
/// ```
#[get("/api/list")]
fn list_authed(conn: DbConn, _user: AuthedUser) -> JsonValue {
    let res = xbees.load::<Xbees>(&*conn).expect("Error loading Xbees.");

    json!({
        "nodes": res,
        "success": true,
    })
}

/// This is an error handler for the /api/list endpoint
/// that is called when the user is not authorized. No
/// xbee data will be returned from this endpoint, just
/// a simple JSON object that indicates failure.
#[get("/api/list", rank = 2)]
fn list_invalid() -> JsonValue {
    json!({
        "success": false,
    })
}

/// This is a login endpoint for users to authenticate themselves.
/// A username and password must be supplied in a JSON object as
/// described below. Once a user is authenticated, a private cookie
/// will be stored which will allow them to access endpoints that
/// require authentication.
/// 
/// **Note**: This is a very insecure login. It is meant to be a placeholder.
/// 
/// # Todo:
/// Change this so it reads from a SQLite database or something.
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

/// This endpoint removes the authentication cookie. Once
/// called, a user can no longer access authenticated endpoints.
#[get("/api/logout")]
fn logout(mut cookies: Cookies) -> JsonValue {
    cookies.remove_private(Cookie::new("auth", "true"));
    json!({
        "success": true,
    })
}