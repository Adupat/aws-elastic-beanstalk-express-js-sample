const assert = require('assert');
const http = require('http');
const { spawn } = require('child_process');

const app = spawn('node', ['app.js']);

const timeout = setTimeout(() => {
    console.error('FAIL: Test timed out');
    app.kill();
    process.exit(1);
}, 5000);

setTimeout(() => {
    http.get('http://localhost:8080/', (res) => {
        let body = '';

        res.on('data', chunk => body += chunk);

        res.on('end', () => {
            try {
                assert.strictEqual(res.statusCode, 200);
                assert.strictEqual(body, 'Hello World!');
                console.log('PASS: Application test successful');
                process.exitCode = 0;
            } catch (err) {
                console.error('FAIL:', err.message);
                process.exitCode = 1;
            } finally {
                clearTimeout(timeout);
                app.kill();
            }
        });
    }).on('error', (err) => {
        clearTimeout(timeout);
        console.error('FAIL:', err.message);
        app.kill();
        process.exitCode = 1;
    });
}, 1000);