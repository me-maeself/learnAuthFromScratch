const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "Username cannot be blank."],
	},
	password: {
		type: String,
		required: [true, "Password cannot be blank."],
	},
});

userSchema.statics.findAndValidate = async function (username, password) {
	const foundUser = await this.findOne({ username });
	const isValid = await bcrypt.compare(password, foundUser.password);
	return isValid ? foundUser : false;
};

// Would call before save() -> mongoDB
userSchema.pre("save", async function (next) {
	// We call save both on username and password
	// code bellow signify if a password has been modified.
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 12);
	return next();
});

module.exports = mongoose.model("User", userSchema);

// isValid ? foundUser : false
// <ifElse> ? <return true> : <return false>
