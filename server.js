const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8'
};

function sendJSON(res, status, data) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/api/login') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            let data;
            try { data = JSON.parse(body); }
            catch {
                return sendJSON(res, 400, { ok: false, message: 'Datos inválidos.' });
            }

            const { email = '', password = '' } = data;

            if (!EMAIL_RE.test(String(email).trim())) {
                return sendJSON(res, 400, { ok: false, message: 'Correo inválido.' });
            }

            if (String(password).length < 8) {
                return sendJSON(res, 400, { ok: false, message: 'Contraseña inválida.' });
            }

            sendJSON(res, 200, { ok: true, message: 'Login exitoso' });
        });
        return;
    }

    const file = req.url === '/' ? '/index.html' : req.url.split('?')[0];
    const filePath = path.join(__dirname, path.normalize(file));

    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403); return res.end();
    }

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404); return res.end('No encontrado');
        }

        res.writeHead(200, { 'Content-Type': TYPES[path.extname(filePath)] || 'text/plain' });
        res.end(content);
    });
});

server.listen(PORT, () => console.log(`Servidor listo en http://localhost:${PORT}`));