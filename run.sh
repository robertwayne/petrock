git pull
cd client
npm ci
npm run build
cd ../server
cargo run --release