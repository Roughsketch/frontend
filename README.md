# frontend

This is a frontend webserver for the project. It will serve files and respond to API requests.

# Install
To run this webserver, you must install [Rust](https://www.rustup.rs/). After it is installed, you will need to switch to the nightly compiler since Rocket uses nightly features. To do that run the following command:
```
rustup default nightly
```
After that is set up, simply run `cargo build --release` to build the server in release mode, and `cargo run --release` to run it.

The default location for the server to bind to is http://localhost:8000

# Production Mode
In order to compile in production mode you will need to set an environmental variable to indicate that to Rocket. Simply set the environmental variable `ROCKET_ENV` to `prod`. For example, in Linux you'd run the following to compile and run in production mode:
```
ROCKET_ENV="prod" cargo run --release
```
You may also use "dev" for development mode, and "stage" for staging mode. Development mode gives more information in the logs about what is being accessed where as production will keep logs to warnings/errors only. Staging mode in this configuration does not do anything special currently.
