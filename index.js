// TODO Problem with the code is that it won't catch error in user.js
// Error would happen if the the password is wrong and pointer reading to null.
// possible fix: try catch, try catch function class, if else foundUser empty or not.

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const app = express();
const User = require("./models/user");
const session = require("express-session");
const port = 3000;

main()
	.then(() => console.log("(mongoose) Connected."))
	.catch((err) => console.log(err));
async function main() {
	await mongoose.connect("mongodb://127.0.0.1:27017/authDemo");
}

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "secretKey" }));

const requireLogin = (req, res, next) => {
	if (!req.session.user_id) {
		return res.redirect("/login");
	}
	return next();
};

app.get("/", (req, res) => {
	res.send("This is the homepage");
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const foundUser = await User.findAndValidate(username, password);
	if (foundUser) {
		req.session.user_id = foundUser._id;
		res.redirect("/secret");
	} else {
		res.redirect("/login");
	}
});

app.get("/register", (req, res) => {
	res.render("register");
});

app.post("/register", async (req, res) => {
	const { password, username } = req.body;
	const hash = await bcrypt.hash(password, 12);

	// // this is the old User where we hash in the server
	// const user = new User({
	// 	username,
	// 	password: hash,
	// });
	const user = new User({ username, password });

	await user.save();
	req.session.user_id = user._id;
	res.redirect("/");
});

app.post("/logout", (req, res) => {
	// req.session.user_id = null;
	req.session.destroy();
	res.redirect("/login");
});

app.get("/secret", requireLogin, (req, res) => {
	return res.render("secret");
});

app.get("/topSecret", requireLogin, (req, res) => {
	res.send("Top Secret");
});

app.listen(port, () => {
	console.log(`(express) listening at ${port}.`);
});
