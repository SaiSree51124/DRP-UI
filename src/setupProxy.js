const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function setupProxy(app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://uk1ip13n80.execute-api.us-east-1.amazonaws.com",
      changeOrigin: true,
      pathRewrite: (path) => {
        // Just strip the local /api prefix — this backend does NOT
        // want a /v1 prefix in the path (confirmed via Postman:
        // /users/me/onboarding-status -> 200 OK,
        // /v1/users/me/onboarding-status -> 404).
        const requestPath = path.replace(/^\/api/, "");
        console.log(`[PROXY] ${path} -> ${requestPath}`);
        return requestPath;
      },
    })
  );
};