use db::schema::xbees;

/// Represents a row in the database that stores xbee data.
#[derive(Queryable, Deserialize, Serialize)]
pub struct Xbees {
    pub id: i32,
    pub node_id: i32,
    pub name: String,
    pub units: String,
}

/// Represents information needed to make a new xbee entry
/// in the database.
#[derive(Insertable, Deserialize, Serialize)]
#[table_name = "xbees"]
pub struct NewXbee {
    pub node_id: i32,
    pub name: String,
    pub units: String,
}

/// Represents a user in the database.
#[derive(Queryable, Deserialize, Serialize)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub password: String,
}