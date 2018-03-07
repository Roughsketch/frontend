use std::io;
use rocket::response::NamedFile;

/// This is used whenever an invalid endpoint is called.
/// It simply returns a static 404 file.
#[catch(404)]
fn not_found() -> io::Result<NamedFile> {
    NamedFile::open("static/404.html")
}