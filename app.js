console.log("Hello World from JavaScript");

const http = require("http");
const fs = require("fs");
const path = require("path");

http.createServer(function (request, response) {

    console.log('Server Requesting ' + request.url);

    // 1. HANDLE HTML REQUESTS
    if (request.url === "/" || request.url === "/aboutPage.html") {

        // FIXED: Removed '../' because app.js is now next to the public folder
        const htmlPath = path.join(__dirname, 'public/HTML/aboutPage.html');

        console.log("Looking for HTML at: " + htmlPath); // Debug line

        fs.readFile(htmlPath, function (err, html) {
            if (err) {
                console.error("HTML Error: " + err.message);
                response.writeHead(404);
                response.end("HTML File not found");
            } else {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(html);
            }
        });

        // 2. HANDLE CSS REQUESTS
    } else if (request.url.includes(".css")) {

        // FIXED: Removed '../'
        const cssPath = path.join(__dirname, 'public/CSS/aboutPage.css');

        fs.readFile(cssPath, function (err, css) {
            if (err) {
                console.error("CSS Error: " + err.message);
                response.writeHead(404);
                response.write("CSS File not found");
            } else {
                response.writeHead(200, {'Content-Type': 'text/css'});
                response.end(css);
            }
        });

        // 3. HANDLE JAVASCRIPT FILES (script.js)
    } else if (request.url === '/script.js') {

        // FIXED: Removed '../' - Assuming script.js is in public/JavaScript
        const jsPath = path.join(__dirname, 'public/JavaScript/script.js');

        fs.readFile(jsPath, function (err, JS) {
            if (err) {
                response.writeHead(404);
                response.end("JS Not Found");
            } else {
                response.writeHead(200, {'Content-Type': 'text/javascript'});
                response.end(JS);
            }
        });

        // 4. HANDLE IMAGES
    } else if (request.url.match(/\.(jpg|jpeg|png|webp|gif)$/)) {

        // FIXED: Removed '../'
        const imgPath = path.join(__dirname, 'public/img', path.basename(request.url));

        fs.readFile(imgPath, function(err, content) {
            if (err) {
                console.error("Image Error: " + err.message);
                response.writeHead(404);
                response.end("Image not found");
            } else {
                const ext = path.extname(imgPath).toLowerCase();
                let contentType = 'image/jpeg';
                if (ext === '.png') contentType = 'image/png';
                if (ext === '.webp') contentType = 'image/webp';

                response.writeHead(200, {'Content-Type': contentType});
                response.end(content);
            }
        });

    } else {
        response.writeHead(404);
        response.end("404 Not Found");
    }

}).listen(8081, '0.0.0.0');

console.log('Server running at http://127.0.0.1:8081/');