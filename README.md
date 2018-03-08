# frontend

This is a frontend webserver for the project. It will serve files and respond to API requests.

# Install
## Basics
To run this webserver, you must install [Rust](https://www.rustup.rs/). After it is installed, you will need to switch to the nightly compiler since Rocket uses nightly features. To do that run the following command:
```
rustup default nightly
```
After that is set up, simply run `cargo build --release` to build the server in release mode, and `cargo run --release` to run it.

The default location for the server to bind to is https://localhost:8000. In order for it to bind and run correctly, you will need to set up a self-signed certificate. To do this you will need to install openssl, run the following command, and copy the cert.pem and key.pem to the directory you will run the server from:
```
openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
```
Browsers will say the certificate isn't trusted, so you will need to add an exception for it.

You may also need to create a secret key which is used by Rocket for stuff like private cookies. To do this, run the following command:
```
openssl rand -base64 32
```
Take the output of that command and then edit Rocket.toml so that the development and production sections have the following key:
```toml
secret_key = "[the generated key]"
```

## Database
To work with the database you will need to install an extra tool called `diesel_cli`.To do this, you will need to have the sqlite library installed somewhere on your computer where cargo can see it. For linux, it is sufficient to install `libsqlite3-dev` through a package manager. 

After the library is installed, run the following command to install diesel_cli with only the sqlite feature (no postgres or mysql).
```
cargo install diesel_cli --no-default-features --features sqlite
```

# Production Mode
In order to compile in production mode you will need to set an environmental variable to indicate that to Rocket. Simply set the environmental variable `ROCKET_ENV` to `prod`. For example, in Linux you'd run the following to compile and run in production mode:
```
ROCKET_ENV="prod" cargo run --release
```
You may also use "dev" for development mode, and "stage" for staging mode. Development mode gives more information in the logs about what is being accessed where as production will keep logs to warnings/errors only. Staging mode in this configuration does not do anything special currently.

# Database Management
The database is managed through diesel_cli and is updated through migrations. The initial setup just requires you set the `DATABASE_URL` environment variable to the path of the database. The `.env` file in this repo defaults to `./db/sqlite`, but you must still create the directory before it will work. To initialize a blank database, run the following:

```
diesel setup
```
Or if you want to pass in a database url manually, add the `--database-url` flag followed by a path.

The database is updated through migrations which can be run in sequence to create a current database structure. To run the migrations in the repo, use the following command:

```
diesel migration run
```

To make a new migration, run the following command:
```
diesel migration generate your_migration_name
```
This will create a new folder in `./migrations` with the name you give it and a date. In that folder there will be two files: up.sql and down.sql. To make a change to the database, you must edit up.sql. This file will contain all your changes in SQL format. Before you upgrade though you must counteract your changes in down.sql. That means if you make a table in up.sql, you must drop that table in down.sql. Every change must be undone. To test if it works, run the following:
```
diesel migration redo
```
If everything works, you should be able to just run the migrations and have your updated database.
