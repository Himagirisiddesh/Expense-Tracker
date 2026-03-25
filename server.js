const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 3000;
const HOST = "127.0.0.1";
const ROOT = __dirname;

const CONTENT_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".ico": "image/x-icon",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".txt": "text/plain; charset=utf-8"
};

function resolveFilePath(urlPath) {
    const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
    const requestedPath = cleanPath === "/" ? "/index.html" : cleanPath;
    const resolvedPath = path.normalize(path.join(ROOT, requestedPath));

    if (!resolvedPath.startsWith(ROOT)) {
        return null;
    }

    return resolvedPath;
}

function sendResponse(response, statusCode, headers, body) {
    response.writeHead(statusCode, headers);
    response.end(body);
}

const server = http.createServer((request, response) => {
    const filePath = resolveFilePath(request.url || "/");

    if (!filePath) {
        sendResponse(response, 403, { "Content-Type": "text/plain; charset=utf-8" }, "Forbidden");
        return;
    }

    fs.stat(filePath, (statError, stats) => {
        if (statError || !stats.isFile()) {
            sendResponse(response, 404, { "Content-Type": "text/plain; charset=utf-8" }, "Not Found");
            return;
        }

        const extension = path.extname(filePath).toLowerCase();
        const contentType = CONTENT_TYPES[extension] || "application/octet-stream";

        fs.readFile(filePath, (readError, data) => {
            if (readError) {
                sendResponse(response, 500, { "Content-Type": "text/plain; charset=utf-8" }, "Server Error");
                return;
            }

            sendResponse(response, 200, { "Content-Type": contentType }, data);
        });
    });
});

server.listen(PORT, HOST, () => {
    console.log("");
    console.log("Expense Tracker Pro is running.");
    console.log(`Local: http://${HOST}:${PORT}/`);
    console.log("");
    console.log("Open that link in your browser.");
    console.log("Press Ctrl + C to stop the server.");
    console.log("");
});

server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Try: set PORT=3001 && npm.cmd start`);
        return;
    }

    console.error("Server failed to start:", error.message);
});
