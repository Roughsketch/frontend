use db::schema::xbees;

#[derive(Queryable, Deserialize, Serialize)]
pub struct Xbees {
    pub id: i32,
    pub node_id: i32,
    pub name: String,
    pub units: String,
}

#[derive(Insertable, Deserialize, Serialize)]
#[table_name = "xbees"]
pub struct NewXbee {
    pub node_id: i32,
    pub name: String,
    pub units: String,
}