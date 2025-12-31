console.log("Hello World from JavaScript");

const http = require("http");
const fs = require("fs");
const path = require("path");

http.createServer(function (request, response) {

    console.log('Server Requesting ' + request.url);

    // --- MAGIC FIX: CLEAN THE URL ---
    // This strips away "?type=phone" so we just get the filename "productPage.html"
    const cleanUrl = request.url.split('?')[0];
    const fileName = path.basename(cleanUrl);

    // 1. HANDLE HOME PAGE
    if (cleanUrl === "/" || cleanUrl === "/frontPage.html") {
        const htmlPath = path.join(__dirname, 'public/HTML/frontPage.html');
        serveFile(response, htmlPath, 'text/html');
    }

    // 2. HANDLE ALL OTHER HTML PAGES (Dynamic)
    else if (cleanUrl.endsWith(".html")) {
        const htmlPath = path.join(__dirname, 'public/HTML', fileName);
        serveFile(response, htmlPath, 'text/html');
    }
        fs.readFile(htmlPath, function (err, html) {
            if (err) {
                console.error("HTML Error: " + err.message);
                response.writeHead(404);
                response.end("Front Page not found");
            } else {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(html);
            }
        });
    } else if (request.url.endsWith(".html")) {
        const htmlFile = path.basename(request.url);
        const htmlPath = path.join(__dirname, 'public/HTML', htmlFile);

    // 3. HANDLE CSS (Dynamic)
    else if (cleanUrl.endsWith(".css")) {
        const cssPath = path.join(__dirname, 'public/CSS', fileName);
        serveFile(response, cssPath, 'text/css');
    }

    // 4. HANDLE JAVASCRIPT (Dynamic)
    else if (cleanUrl.endsWith(".js")) {
        const jsPath = path.join(__dirname, 'public/JavaScript', fileName);
        serveFile(response, jsPath, 'text/javascript');
    }

    // 5. HANDLE IMAGES (Dynamic)
    else if (cleanUrl.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
        const imgPath = path.join(__dirname, 'public/img', fileName);

        const ext = path.extname(imgPath).toLowerCase();
        let contentType = 'image/jpeg';
        if (ext === '.png') contentType = 'image/png';
        if (ext === '.webp') contentType = 'image/webp';
        if (ext === '.gif') contentType = 'image/gif';
        if (ext === '.svg') contentType = 'image/svg+xml';

        serveFile(response, imgPath, contentType);
    }

    // 6. HANDLE VIDEO
    else if (cleanUrl.endsWith(".mp4")) {
        const vidPath = path.join(__dirname, 'public/vid', fileName);
        serveFile(response, vidPath, 'video/mp4');
    }

    // 7. HANDLE JSON DATA (NEW! - THIS IS REQUIRED FOR GAMES)
    else if (cleanUrl.endsWith(".json")) {
        // We look inside public/data folder
        const jsonPath = path.join(__dirname, 'public/data', fileName);
        serveFile(response, jsonPath, 'application/json');
    }

    // 8. 404 ERROR
    else {
        console.log("404 Error: " + request.url);
        response.writeHead(404);
        response.end("404 Not Found");
    }

}).listen(8081, '0.0.0.0');

// --- HELPER FUNCTION ---
function serveFile(response, filePath, contentType) {
    fs.readFile(filePath, function (err, content) {
        if (err) {
            console.error(`Error serving ${filePath}: ${err.message}`);
            response.writeHead(404);
            response.end("File not found");
        } else {
            response.writeHead(200, {'Content-Type': contentType});
            response.end(content);
        }
    });
}

console.log('Server running at http://127.0.0.1:8081/');