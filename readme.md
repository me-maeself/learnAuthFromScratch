# Authentication from scratch

## Overview
Crucial:
- Authentication vs Authorization 
- How not to store password
- Working with Bcrypt

Important:
- Auth Demo
- Understanding Hashing Function
- Password Salts

- tools for next session: Passport

## 508. Authentication vs Authorization
- Authentication:
  - Who they are, authentic.
- Authorization: 
  - Their privileges, Authority, Accessibility

## 509. How to (not) store password
Rules:
1. Never store passwords in plain text

What we use:
- Hashing function
  - Turning data into some fixed output values
    - We match hash output from the client and the server

## 510. Crypto hash function
- SHA

Hash function:
- input: random
- output: fixed size output
Cryptographic function:
1. one way function, infeasible to invert or reverse
   1. example: Math.abs()
2. Small input change, huge output change
3. Deterministic. Same input = Same output
4. Unlikely found 2 output with same value
5. Password Hash Function are deliberately SLOW

## 511. Password Salts (Salting)
This courses used `BCRYPT`.
Extra steps to make password hard to reverse engineering.
How?:
- Adding few characters to the input.
- Every some user have different salt

|input|password|hashed|Salt
|-|-|-|-|
|monkeyDUCK|monkey|?????|DUCK|
|monkeyDOG|monkey|?!?!?|DOG|

Common password issues:
- Many user used the same, generic, password

## 512. Intro to Bcrypt
`bcryptDemo.js`
bcrypt is a password-hashing function designed by Niels Provos and David Mazières, based on the Blowfish cipher and presented at USENIX in 1999.[1] Besides incorporating a salt to protect against rainbow table attacks, bcrypt is an adaptive function: over time, the iteration count can be increased to make it slower, so it remains resistant to brute-force search attacks even with increasing computation power.

Module:
- **bcrypt** -> Made for node -> On top of c++
- bcrypt.js -> Entirely JS

Steps:
- npm i bcrypt

Note:
- SaltRounds: 250 ms -> Sweet spot
- Recommended number: 12.

Overview:
- Salt is to introduce randomness.
- Salt would be saved in database

```js
// 12 is the level
const hash = await bcrypt.hash(pw, 12);
const res = await bcrypt.compare(pw, hashedPw);
```

## 513. Auth Demo: Setup
## 514. Auth Demo: Registering
```js
app.post("/register", async (req, res) => {
	const { password, username } = req.body;
	const hash = await bcrypt.hash(password, 12);
	const user = new User({
		username,
		password: hash,
	});
	await user.save();
	res.redirect("/");
});
```

## 515. Auth Demo: Login
```js
app.post("/login", async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username });
	const validity = await bcrypt.compare(password, user.password);
	if (validity) {
		res.send("Welcome!");
	} else {
		res.send("try again.");
	}
});
```
## 516. Auth Demo: Staying Logged in with Sessions
- `const session = require("express-session");`
- `app.use(session({ secret: "secretKey" }));`
- `req.session.user_id = user._id;`

## 517. Auth Demo: Logout
- Make app.post("/secret")
- Make secret.ejs
  - Have a sign out button

## 518. Auth Demo: Require Login Middleware
app.use to check if the client have the session id

## 519. Auth Demo: Refactoring To Model Methods
in `user.js`
```js
// Would call before save() -> mongoDB
userSchema.pre("save", async function (next) {
	// We call save both on username and password
	// code bellow signify if a password has been modified.
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 12);
	return next();
});
```