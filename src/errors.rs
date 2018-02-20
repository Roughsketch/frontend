use std::io;
use rocket::response::NamedFile;

#[catch(404)]
fn not_found() -> io::Result<NamedFile> {
    NamedFile::open("static/404.html")
}