console.log("Hello World from JavaScript");

const http = require("http");
const fs = require("fs");
const path = require("path");

http.createServer(function (request, response) {

    console.log('Server Requesting ' + request.url);

    // --- HTML ROUTES ---
    let htmlFile = '';

    if (request.url === "/" || request.url === "/frontPage.html") {
        htmlFile = 'frontPage.html';
    } else if (request.url === "/aboutPage.html") {
        htmlFile = 'aboutPage.html';
    } else if (request.url.startsWith("/productPage.html")) {
        // .startsWith is needed because we will use queries like ?type=phone
        htmlFile = 'productPage.html';
    } else if (request.url === "/cartPage.html") {
        htmlFile = 'cartPage.html';
    }

    // If an HTML file was matched above, serve it
    if (htmlFile) {
        const htmlPath = path.join(__dirname, 'public/HTML', htmlFile);
        fs.readFile(htmlPath, function (err, html) {
            if (err) {
                response.writeHead(404);
                response.end("HTML File not found");
            } else {
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.end(html);
            }
        });
        return; // Exit function so we don't check other types
    }

    // --- CSS REQUESTS ---
    if (request.url.includes(".css")) {
        const cssFile = path.basename(request.url);
        const cssPath = path.join(__dirname, 'public/CSS', cssFile);
        fs.readFile(cssPath, function (err, css) {
            if (err) {
                response.writeHead(404);
                response.end("CSS Not Found");
            } else {
                response.writeHead(200, {'Content-Type': 'text/css'});
                response.end(css);
            }
        });

        // --- JS REQUESTS ---
    } else if (request.url.includes(".js")) {
        const jsFile = path.basename(request.url);
        const jsPath = path.join(__dirname, 'public/JavaScript', jsFile);
        fs.readFile(jsPath, function (err, js) {
            if (err) {
                response.writeHead(404);
                response.end("JS Not Found");
            } else {
                response.writeHead(200, {'Content-Type': 'text/javascript'});
                response.end(js);
            }
        });

        // --- IMAGE REQUESTS ---
    } else if (request.url.match(/\.(jpg|jpeg|png|webp|gif)$/)) {
        const imgPath = path.join(__dirname, 'public/img', path.basename(request.url));
        fs.readFile(imgPath, function(err, content) {
            if (err) {
                response.writeHead(404);
                response.end("Image not found");
            } else {
                response.writeHead(200);
                response.end(content);
            }
        });
    } else {
        response.writeHead(404);
        response.end("404 Not Found");
    }

}).listen(8081, '0.0.0.0');

console.log('Server running at http://127.0.0.1:8081/');