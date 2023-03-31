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
        path.join(__dirname, 'assets/docs.json'),
        { encoding: 'utf8', flag: 'r' }
    );

    res.send(apiSpec);
});

server.get('/clients/available', (req, res) => {
    res.json([
        {
            id: 1,
            name: 'Remote PBX',
            domain: 'remote.net',
        },
    ]);
});

server.get('/users/:id/login_qr', (req, res) => {
    const apiSpec = fs.readFileSync(
        path.join(__dirname, 'assets/login_qr_code.png'),
        { encoding: 'binary', flag: 'r' }
    );

    res.contentType('image/png');
    res.end(apiSpec, 'binary');
});

server.post('/provision/preview', (req, res) => {
    const response = 
    `<account>
        <title>disabled</title>
        <password>disabled</password>
    </account>`;
    res.send(response);
});

server.post('/:entity/:id/notify_credentials', (req, res) => {
    res.send(`{}`);
});

server.post('/clients/:userId/sync', (req, res) => {
    res.send(`{}`);
});

server.post('/users/:id/switch_licenses', (req, res) => {
    res.send(`{}`);
});

server.get('/administrator/:id/avatar', (req, res) => {
    const apiSpec = fs.readFileSync(
        path.join(__dirname, 'assets/avatar.jpg'),
        { encoding: 'binary', flag: 'r' }
    );

    res.set('Content-Disposition', 'attachment');
    res.contentType('image/jpeg');
    res.end(apiSpec, 'binary');
});

server.get('/administrator/:id/greeting', (req, res) => {
    const mp3 = fs.readFileSync(
        path.join(__dirname, 'assets/example.mp3'),
        { flag: 'r' }
    );

    res.contentType('audio/mpeg3');
    res.end(mp3, 'binary');
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)

// Use default router
server.use((req, res, next) => {
    const intercept =
        req.path.indexOf('/administrators') === 0
        && req.method !== "GET"
        Object.keys(req.body).length === 0;

    if (intercept) {
        res.end(`{}`);
        return;
    }

    next();
})
server.use(router);

server.listen(3000, () => {
    console.log('JSON Server is running');
})