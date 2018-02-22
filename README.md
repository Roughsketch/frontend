# frontend

This is a frontend webserver for the project. It will serve files and respond to API requests.

# Install
To run this webserver, you must install [Rust](https://www.rustup.rs/). After it is installed, you will need to switch to the nightly compiler since Rocket uses nightly features. To do that run the following command:
```
rustup default nightly
```
After that is set up, simply run `cargo build --release` to build the server in release mode, and `cargo run --release` to run it.

The default location for the server to bind to is https://localhost:8000. In order for it to bind and run correctly, you will need to set up a self-signed certificate. To do this you wil need to install openssl, run the following command, and copy the cert.pem and key.pem to the directory you will run the server from:
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

# Production Mode
In order to compile in production mode you will need to set an environmental variable to indicate that to Rocket. Simply set the environmental variable `ROCKET_ENV` to `prod`. For example, in Linux you'd run the following to compile and run in production mode:
```
ROCKET_ENV="prod" cargo run --release
```
You may also use "dev" for development mode, and "stage" for staging mode. Development mode gives more information in the logs about what is being accessed where as production will keep logs to warnings/errors only. Staging mode in this configuration does not do anything special currently.
