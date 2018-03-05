#![feature(plugin, decl_macro)]
#![plugin(rocket_codegen)]

#[macro_use] extern crate log;
extern crate rocket;
#[macro_use] extern crate rocket_contrib;
#[macro_use] extern crate serde_derive;

use std::io;
use std::path::{Path, PathBuf};

use rocket::response::NamedFile;

mod api;
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
    rocket::ignite()
        .mount("/", routes![
            index,
            files,
            api::send,
            api::list_authed,
            api::list_invalid,
            api::login,
            api::logout,
        ])
        .catch(catchers![errors::not_found])
        .launch();
}
