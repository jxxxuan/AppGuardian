
const { createServer } = require('http')
const fs = require('fs');
const { parse } = require('url')
const next = require('next')
const port = parseInt(process.env.PORT, 10) || 3050
const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const httpsOptions = {
    pfx: fs.readFileSync('./STAR_onepay_2024.pfx'),
    passphrase: 'Abcd1234%^'
};

app.prepare().then(() => {
    createServer(httpsOptions,(req, res) => {
        const parsedUrl = parse(req.url, true)
        //const { pathname, query } = parsedUrl

        handle(req, res, parsedUrl)
    }).listen(port, err => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
    })
})
