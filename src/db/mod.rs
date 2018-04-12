use diesel;
use diesel::prelude::*;
use dotenv::dotenv;
use r2d2;
use r2d2_diesel::ConnectionManager;
use rocket::http::Status;
use rocket::request::{self, FromRequest};
use rocket::{Outcome, Request, State};
use std::env;
use std::ops::Deref;

pub mod schema;
pub mod models;

pub type SqlitePool = r2d2::Pool<ConnectionManager<SqliteConnection>>;
pub struct DbConn(r2d2::PooledConnection<ConnectionManager<SqliteConnection>>);

/// Implements FromRequest so Rocket can use DbConn in web
/// requests. Will return a failure only if it cannot get
/// a database connection through the pool.
impl <'a, 'r> FromRequest<'a, 'r> for DbConn {
    type Error = ();

    fn from_request(request: &'a Request<'r>) -> request::Outcome<DbConn, ()> {
        let pool = request.guard::<State<SqlitePool>>()?;

        match pool.get() {
            Ok(conn) => Outcome::Success(DbConn(conn)),
            Err(_) => Outcome::Failure((Status::ServiceUnavailable, ())),
        }
    }
}

/// Implement Deref to make it easier to use.
impl Deref for DbConn {
    type Target = SqliteConnection;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

/// Establishes a connection with the database.
/// 
/// # Errors
/// The database url must be set in an environmental variable
/// named DATABASE_URL. If it is not, this method will panic.
pub fn establish_connection() -> SqlitePool {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<SqliteConnection>::new(database_url);
    r2d2::Pool::new(manager).expect("Could not initialize db pool")
}

/// Creates a new row in the database with the given xbee information.
/// 
/// This information will be used to keep track of which nodes have 
/// connected to our main server at least once.
pub fn create_xbee(conn: &SqliteConnection, node_id: i32, name: &String, units: &String) -> usize {
    use self::schema::xbees;
    use self::models::NewXbee;

    let new = NewXbee {
        node_id: node_id,
        name: name.clone(),
        units: units.clone(),
    };

    diesel::replace_into(xbees::table)
        .values(&new)
        .execute(conn)
        .expect("Error saving new xbee")
}