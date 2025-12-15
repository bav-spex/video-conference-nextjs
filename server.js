const fs = require("fs");
const https = require("https");
const os = require("os");
const path = require("path");

const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const next = require("next");

// Auto-detect IPv4
function getLocalIPv4() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }
  
return "127.0.0.1";
}

const HOST = getLocalIPv4();
const PORT = 3002;

process.env.NEXT_PUBLIC_LOCAL_IPV4 = HOST;

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, hostname: HOST, port: PORT });
const handle = app.getRequestHandler();

const key = fs.readFileSync(path.resolve(__dirname, "config/cert-key.pem"));
const cert = fs.readFileSync(path.resolve(__dirname, "config/cert.pem"));

app.prepare().then(() => {
  const server = express();

  // WebSocket proxy
  server.use(
    "/socket.io",
    createProxyMiddleware({
      target: "http://localhost:3000",
      changeOrigin: true,
      ws: true,
    })
  );

  // Catch ALL routes for Next.js (Express 5 safe)
  server.use((req, res) => handle(req, res));

  https.createServer({ key, cert }, server).listen(PORT, HOST, () => {
    console.log(`🚀 Next.js HTTPS dev server running:`);
    console.log(`👉 Local:   https://localhost:${PORT}`);
    console.log(`👉 Network: https://${HOST}:${PORT}`);
  });
});
