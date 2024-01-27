const bcrypt = require("bcrypt");

const hashPassword = async (pw) => {
	const salt = await bcrypt.genSalt(12);
	const hash = await bcrypt.hash(pw, salt);
	console.log(salt);
	console.log(hash);
};

// hashPassword("monkey");

const login = async (pw, hashedPw) => {
	const res = await bcrypt.compare(pw, hashedPw);
	if (res) {
		console.log("y");
	} else {
		console.log("n");
	}
};

// login("monkey", "$2b$12$haCan8.v8UzZ5zH3AfIxzeWx8IDi.vQpmA.AzkVGq3xa0fe8uacG6");

const hashPasswordSalt = async (pw) => {
	const hash = await bcrypt.hash(pw, 12);
	console.log(hash);
};

hashPasswordSalt("monkey");
