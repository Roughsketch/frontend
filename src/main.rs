#![feature(plugin, decl_macro)]
#![plugin(rocket_codegen)]
#![feature(alloc_system)]
extern crate alloc_system;


#[macro_use] 
extern crate diesel;
extern crate dotenv;
#[macro_use] 
extern crate log;
extern crate r2d2;
extern crate r2d2_diesel;
extern crate rocket;
#[macro_use] 
extern crate rocket_contrib;
#[macro_use] 
extern crate serde_derive;

use std::io;
use std::path::{Path, PathBuf};

use rocket::response::NamedFile;

mod api;
mod db;
mod errors;

/// This will return the homepage. It is the base for the
/// frontend and is where the user will be able to interact
/// with and view data from the backend.
#[get("/")]
fn index() -> io::Result<NamedFile> {
    NamedFile::open("static/index.html")
}

/// This is a wildcard route. It will attempt to send a file
/// if the given path leads to one. 
/// 
/// For example, if the file ./static/test.jpg exists, then
/// going to https://localhost:8000/test.jpg should return
/// that file.
#[get("/<file..>", rank = 99)]
fn files(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("static/").join(file)).ok()
}

fn main() {
    //  Establish a connection with the local database
    let conn = db::establish_connection();

    //  Mount all the routes for the webserver
    rocket::ignite()
        .mount("/", routes![
            index,
            files,
            api::add,
            api::send,
            api::list_authed,
            api::list_invalid,
            api::login,
            api::logout,
        ])
        //  Add the 404 handler
        .catch(catchers![errors::not_found])
        //  Manage the database connection
        .manage(conn)
        .launch();
}
