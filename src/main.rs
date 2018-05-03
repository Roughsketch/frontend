#![feature(plugin, decl_macro)]
#![plugin(rocket_codegen)]

extern crate bcrypt;
extern crate byteorder;
extern crate chrono;
#[macro_use] extern crate diesel;
extern crate dotenv;
#[macro_use] extern crate dotenv_codegen;
#[macro_use] extern crate failure;
#[macro_use] extern crate log;
extern crate parking_lot;
extern crate r2d2;
extern crate r2d2_diesel;
extern crate rocket;
#[macro_use] extern crate rocket_contrib;
#[macro_use] extern crate serde_derive;
extern crate xbee;

use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::thread;

use failure::Error;
use parking_lot::RwLock;
use rocket::response::NamedFile;

mod api;
mod db;
mod errors;
mod info;

/// This will return the homepage for an authorized user.
/// It is the base for the frontend and is where the user 
/// will be able to interact with and view data from the 
/// backend.
#[get("/")]
fn index_authed(_user: api::AuthedUser) -> Result<NamedFile, Error> {
    Ok(NamedFile::open("static/index.html")?)
}

/// This will return the homepage for an unauthorized user.
/// Since the data being shown and modified is private,
/// this will instead redirect to a login page.
#[get("/", rank = 2)]
fn index_login() -> Result<NamedFile, Error> {
    Ok(NamedFile::open("static/login.html")?)
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

    let xbees = info::InfoSet(Arc::new(RwLock::new(HashMap::new())));
    let rocket_xbees = info::InfoSet(xbees.0.clone());

    //let (tx, rx) = mpsc::channel();

    thread::spawn(move|| {
        let mut xbee = xbee::Xbee::new(dotenv!("XBEE_PORT"))
            .expect("No Xbee found.");

        if let Err(why) = xbee.send_packet(0xFFFFFFFF, b"I") {
            error!("Could not send broadcast packet: {}", why);
        }

        loop {
            match xbee.read_packet() {
                Ok(packet) => {
                    trace!("Got packet: {:#?}", packet);
                    if packet.length == 50 {
                        if let Ok(info) =  info::XbeeInfo::new(&packet) {
                            debug!("New Xbee: {:?}", info);
                            let mut handle = xbees.0.write();
                            (*handle).insert(packet.origin, info);
                            
                            continue;
                        }
                    } 

                    if xbees.contains(packet.origin) {
                        if packet.length == 2 {
                            if let Err(why) = xbees.set_reading(packet) {
                                warn!("Could not set reading: {:?}", why);
                            }
                        }
                    } else {
                        debug!("Received packet before info was retrieved: {}", packet.origin);

                        if let Err(why) = xbee.send_packet(packet.origin, b"C") {
                            error!("Could not send info packet: {}", why);
                        }
                    }
                }
                Err(why) => debug!("Read error: {}", why),
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
        .manage(rocket_xbees)
        .launch();
}
