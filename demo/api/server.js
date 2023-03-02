const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.post('/admin_login', (req, res) => {
    res.json({
        "token": "fake_token",
        "refresh_token": "fake_refresh_token"
    });
});

server.post('/token/refresh', (req, res) => {
    res.json({
        "token": "fake_token",
        "refresh_token": "fake_refresh_token"
    });
});

server.get('/docs.json', (req, res) => {

    const apiSpec = fs.readFileSync(
        path.join(__dirname, 'docs.json'),
        { encoding: 'utf8', flag: 'r' }
    );

    res.send(apiSpec);
});


// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)

// Use default router
server.use(router);
server.listen(3000, () => {
    console.log('JSON Server is running');
})