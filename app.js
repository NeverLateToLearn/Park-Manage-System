// Setup server, session and middleware here.
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const configRoutes = require('./routes');
const session = require('express-session');
const exphbs = require('express-handlebars');

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(
	session({
		name: 'AuthCookie',
		saveUninitialized: false,
		secret: "look here is the secret",
		resave: false,
		cookie: { maxAge: 600000 },
	})
);

app.use(async (req, res, next) => {
	let auth = "(Authenticated User)"
	if (req.session.user) {
		console.log(
			`${new Date().toUTCString()}: ${req.method} ${req.originalUrl} ${auth}`
		);
	} else {
		auth = "(Non-Authenticated User)"
		console.log(
			`${new Date().toUTCString()}: ${req.method} ${req.originalUrl} ${auth}`
		);
	}

	next();
});

app.use('/protected', (req, res, next) => {
	if (!req.session.user) {
		return res.status(403).render('forbiddenAccess');
	} else {
		next();
	}
});

configRoutes(app);

app.listen(3000, () => {
	console.log("We've now got a server!");
	console.log('Your routes will be running on http://localhost:3000');
});