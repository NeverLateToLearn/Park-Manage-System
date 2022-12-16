const user = require('./user');
//const manager = require("./manager");
const events = require("./events");
//const reviews = require("./reviews");

const constructorMethod = (app) => {
	//app.use("/reviews", reviews);
	app.use("/events", events);
	//app.use("/manager", manager);
	app.use("/user", user);

	app.get('/',(req,res) => {
		let userLoggedIn = false;
		let user = req.session.user;
		if (user){
			userLoggedIn = true;
		}
		res.status(200).render('home',{userLoggedIn:userLoggedIn});

	})
	app.use('*', (req, res) => {
		res.sendStatus(404);
	});
};

module.exports = constructorMethod;