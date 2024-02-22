const path = require("path");
const fs = require("fs");
const express = require("express");
const Router = express.Router();

// route file extension
const ext = ".ts";
const routes = fs.readdirSync(path.resolve(__dirname, "./")).filter(item => item != "index" + ext);

routes.forEach(route => {
	if (path.extname(route) === ext) {
		const file = path.basename(route, ext);
		Router.use(`/api/${file}`, require(`./${file}`).router);
	}
});

module.exports = { Router };
