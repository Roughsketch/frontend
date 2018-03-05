use diesel;
use diesel::prelude::*;
use dotenv::dotenv;
use r2d2;
use r2d2_diesel::ConnectionManager;
use std::env;

pub mod schema;
pub mod models;

pub type SqlitePool = r2d2::Pool<ConnectionManager<SqliteConnection>>;

pub fn establish_connection() -> SqlitePool {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<SqliteConnection>::new(database_url);
    r2d2::Pool::new(manager).expect("Could not initialize db pool")
}

pub fn create_xbee(conn: &SqliteConnection, node_id: i32, name: &String, units: &String) -> usize {
    use self::schema::xbees;
    use self::models::NewXbee;

    let new = NewXbee {
        node_id: node_id,
        name: name.clone(),
        units: units.clone(),
    };

    diesel::insert_into(xbees::table)
        .values(&new)
        .execute(conn)
        .expect("Error saving new xbee")
}