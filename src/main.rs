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

#[get("/")]
fn index() -> io::Result<NamedFile> {
    NamedFile::open("static/index.html")
}

#[get("/<file..>", rank = 99)]
fn files(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("static/").join(file)).ok()
}

fn main() {
    let conn = db::establish_connection();

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
        .catch(catchers![errors::not_found])
        .manage(conn)
        .launch();
}
