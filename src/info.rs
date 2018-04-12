use xbee::packet::Packet;
use byteorder::{ByteOrder, LittleEndian};
use chrono::Utc;
use failure::Error;
use parking_lot::RwLock;
use rocket::http::Status;
use rocket::request::{self, FromRequest};
use rocket::{Outcome, Request, State};

use std::sync::Arc;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct XbeeInfo {
    pub uuid: u32,
    pub name: String,
    pub units: String,
    pub max_voltage: f32,
    pub min_voltage: f32,
    pub max_value: f32,
    pub min_value: f32,
    pub last_update: i64,
    pub reading: Option<u16>,
}

#[derive(Debug, Fail)]
enum InfoError {
    #[fail(display = "Packet does not contain xbee info.")]
    NoInfo,
    #[fail(display = "Node not in set.")]
    NoNode,
    #[fail(display = "Not enough data to set reading.")]
    NotEnoughData,
}

impl XbeeInfo {
    pub fn new(packet: &Packet) -> Result<Self, Error> {
        ensure!(packet.length == 50, InfoError::NoInfo);
        let bytes = packet.data();

        Ok(XbeeInfo {
            uuid: LittleEndian::read_u32(&bytes),
            min_voltage: LittleEndian::read_f32(&bytes[4..]),
            max_voltage: LittleEndian::read_f32(&bytes[8..]),
            min_value: LittleEndian::read_f32(&bytes[12..]),
            max_value: LittleEndian::read_f32(&bytes[16..]),
            name: String::from_utf8(bytes[20..39].to_vec())?.replace("\x00", ""),
            units: String::from_utf8(bytes[40..].to_vec())?.replace("\x00", ""),
            last_update: Utc::now().timestamp(),
            reading: None,
        })
    }

    pub fn set_reading(&mut self, value: u16) {
        self.reading = Some(value);
        self.last_update = Utc::now().timestamp();
    }
}

#[derive(Clone)]
pub struct InfoSet(pub Arc<RwLock<Vec<XbeeInfo>>>);

impl InfoSet {
    pub fn contains(&self, uuid: u32) -> bool {
        if uuid == 0xFFFFFFFF {
            return true
        }

        let values = self.0.read();

        values.iter().any(|x| x.uuid == uuid)
    }

    pub fn set_reading(&self, packet: Packet) -> Result<u16, Error> {
        let mut values = self.0.write();
        let entry = values.iter_mut()
            .find(|x| x.uuid == packet.origin)
            .ok_or(InfoError::NoNode)?;

        let data = packet.data();
        ensure!(data.len() == 2, InfoError::NotEnoughData);

        let value = LittleEndian::read_u16(data);
        entry.set_reading(value);

        Ok(value)
    }

    pub fn nodes(&self) -> Vec<XbeeInfo> {
        (*self.0.read()).clone()
    }
}

/// Implements FromRequest so Rocket can use DbConn in web
/// requests. Will return a failure only if it cannot get
/// a database connection through the pool.
impl <'a, 'r> FromRequest<'a, 'r> for InfoSet {
    type Error = ();

    fn from_request(request: &'a Request<'r>) -> request::Outcome<InfoSet, ()> {
        match request.guard::<State<InfoSet>>() {
            Outcome::Success(info) => Outcome::Success(info.clone()),
            _ => Outcome::Failure((Status::ServiceUnavailable, ())),
        }
    }
}