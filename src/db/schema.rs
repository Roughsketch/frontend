table! {
    xbees (id) {
        id -> Integer,
        node_id -> Integer,
        name -> Text,
        units -> Text,
    }
}

table! {
    users (id) {
        id -> Integer,
        username -> Text,
        password -> Text,
    }
}