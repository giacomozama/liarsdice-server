import app from './app.js'

const port = process.env.PORT || 8080;
const host = process.env.HOST || 'localhost';

console.log(`Running at http://${host}:${port}`);
app.listen(host, port);