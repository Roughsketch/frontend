#![feature(plugin, decl_macro)]
#![plugin(rocket_codegen)]

extern crate rocket;

use std::io;
use std::path::{Path, PathBuf};

use rocket::response::{content, NamedFile};

#[get("/")]
fn index() -> io::Result<NamedFile> {
    NamedFile::open("static/index.html")
}

#[get("/<file..>")]
fn files(file: PathBuf) -> Option<NamedFile> {
    NamedFile::open(Path::new("static/").join(file)).ok()
}

#[error(404)]
fn not_found() -> io::Result<NamedFile> {
    NamedFile::open("static/missing.html")
}

fn main() {
    rocket::ignite()
        .mount("/", routes![index, files])
        .catch(errors![not_found])
        .launch();
}
