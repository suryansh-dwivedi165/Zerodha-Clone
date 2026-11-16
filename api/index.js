const app = require("../backend/index.js");

module.exports = (req, res) => {
  const requestUrl = new URL(req.url, "http://localhost");
  const apiPath = requestUrl.searchParams.get("__api_path");

  if (apiPath) {
    requestUrl.searchParams.delete("__api_path");
    req.url = `/api${apiPath}${requestUrl.search}`;
  }

  return app(req, res);
};
