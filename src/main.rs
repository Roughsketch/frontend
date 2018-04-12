#![feature(plugin, decl_macro)]
#![plugin(rocket_codegen)]

extern crate bcrypt;
#[macro_use] extern crate diesel;
extern crate dotenv;
#[macro_use] extern crate dotenv_codegen;
#[macro_use] extern crate log;
extern crate r2d2;
extern crate r2d2_diesel;
extern crate rocket;
#[macro_use] extern crate rocket_contrib;
#[macro_use] extern crate serde_derive;
extern crate xbee;

use std::collections::VecDeque;
use std::io;
use std::path::{Path, PathBuf};
use std::sync::mpsc;
use std::thread;

use rocket::response::NamedFile;

mod api;
mod db;
mod errors;

/// This will return the homepage for an authorized user.
/// It is the base for the frontend and is where the user 
/// will be able to interact with and view data from the 
/// backend.
#[get("/")]
fn index_authed(_user: api::AuthedUser) -> io::Result<NamedFile> {
    NamedFile::open("static/index.html")
}

/// This will return the homepage for an unauthorized user.
/// Since the data being shown and modified is private,
/// this will instead redirect to a login page.
#[get("/", rank = 2)]
fn index_login() -> io::Result<NamedFile> {
    NamedFile::open("static/login.html")
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

    //let (tx, rx) = mpsc::channel();

    thread::spawn(move|| {
        let mut xbee = xbee::Xbee::new(dotenv!("XBEE_PORT"))
            .expect("No Xbee found.");
        let mut packets = VecDeque::new();

        if let Err(why) = xbee.send_packet(0xFFFFFFFF, b"I") {
            error!("Could not send broadcast packet: {}", why);
        }

        loop {
            if let Ok(packet) = xbee.read_packet() {
                println!("{:?}", packet);
                packets.push_back(packet);
            }
        }
    });

    //  Mount all the routes for the webserver
    rocket::ignite()
        .mount("/", routes![
            index_authed,
            index_login,
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
