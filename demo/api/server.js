const jsonServer = require('json-server');
const path = require('path');
const fs = require('fs');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.post('/admin_login', (req, res) => {
    res.json({
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2ODMyODczMTksImV4cCI6MTY4MzI5MDkxOSwicm9sZXMiOlsiUk9MRV9CUkFORF9BRE1JTiJdLCJ1c2VybmFtZSI6ImJyYW5kIn0.Qxn9LCXovVsy_VaT6Ev7u4Cgap8CyoaKg8hlqEyWejfOnAyFjpu0QRHbQTFO5EXiOfYGJTKRTIV7fI5W1vU2zm9nhShlLNFkQwNegI7Vi1p_9VK_STSbzeGpbWHZ2ShFSPwmJmDksFEJZ_kkiXQIaiTnz1YoJECKYoHhuNMaFqMyTn_EVzVS93peaXlau1zoeXWrUB3hpjNuW44Y0F8xQf3iOGyZgvnhoy_FRkvDQyIJbkjOLM8cL84v987zL2pGmJ2zO30Py6rInEQztzak9Ec74rjLvcoel7J81bq7tEV2MJ6IcQFDsL0Uta6J1edcsRlgUIUYmKF4RXqNMncD3vDT_5pDthCsw4M97OYwd6isa9EuzhA-YKqncisgDT3bqFuxAzc-tnXf3rIQKBNQOJnXY6wJOWw8p765jGB4AZo-YVI9BFGg063Em3mKPGNwuONSBOzhyOzI2AJ0bVGZw_tziuIpl8hD1TRPTew7yO_bwGAy5se_acSuaBiFBUCWEpz8mDc7l0fmQGjekMvFcT-6B3ETinP45m1tHP_R1iRl2NDwVERna0K5P0GFZrBjY08eViH37kiyT5MZudAq1LJl-bMmRHEu6amH0JZXq0X9VGoq-FXyxFG0_O-VpxwSmf1_MFrDPXbUxRz36k-Cjt3eOoY6ucasev6B60kR2BU",
        "refresh_token": "fake_refresh_token"
    });
});

server.post('/token/refresh', (req, res) => {
    res.json({
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2ODMyODczMTksImV4cCI6MTY4MzI5MDkxOSwicm9sZXMiOlsiUk9MRV9CUkFORF9BRE1JTiJdLCJ1c2VybmFtZSI6ImJyYW5kIn0.Qxn9LCXovVsy_VaT6Ev7u4Cgap8CyoaKg8hlqEyWejfOnAyFjpu0QRHbQTFO5EXiOfYGJTKRTIV7fI5W1vU2zm9nhShlLNFkQwNegI7Vi1p_9VK_STSbzeGpbWHZ2ShFSPwmJmDksFEJZ_kkiXQIaiTnz1YoJECKYoHhuNMaFqMyTn_EVzVS93peaXlau1zoeXWrUB3hpjNuW44Y0F8xQf3iOGyZgvnhoy_FRkvDQyIJbkjOLM8cL84v987zL2pGmJ2zO30Py6rInEQztzak9Ec74rjLvcoel7J81bq7tEV2MJ6IcQFDsL0Uta6J1edcsRlgUIUYmKF4RXqNMncD3vDT_5pDthCsw4M97OYwd6isa9EuzhA-YKqncisgDT3bqFuxAzc-tnXf3rIQKBNQOJnXY6wJOWw8p765jGB4AZo-YVI9BFGg063Em3mKPGNwuONSBOzhyOzI2AJ0bVGZw_tziuIpl8hD1TRPTew7yO_bwGAy5se_acSuaBiFBUCWEpz8mDc7l0fmQGjekMvFcT-6B3ETinP45m1tHP_R1iRl2NDwVERna0K5P0GFZrBjY08eViH37kiyT5MZudAq1LJl-bMmRHEu6amH0JZXq0X9VGoq-FXyxFG0_O-VpxwSmf1_MFrDPXbUxRz36k-Cjt3eOoY6ucasev6B60kR2BU",
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

server.get('/administrators/:id/avatar', (req, res) => {
    const apiSpec = fs.readFileSync(
        path.join(__dirname, 'assets/avatar.jpg'),
        { encoding: 'binary', flag: 'r' }
    );

    res.set('Content-Disposition', 'attachment');
    res.contentType('image/jpeg');
    res.end(apiSpec, 'binary');
});

server.put('/administrators/:id', (req, res) => {
    throw Error('Forbidden');
});

server.get('/administrators/:id/greeting', (req, res) => {
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
    res.append('x-total-items', 10);
})
server.use(router);

server.listen(3000, () => {
    console.log('JSON Server is running');
})