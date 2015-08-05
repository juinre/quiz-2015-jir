
// MW de autorización de accesos
exports.loginRequired = function(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};


// GET /login -- Formulario de Login
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});	
};

// POST /login -- Crear la sesion
exports.create = function(req, res) {
	
	var login 		= req.body.login;
	var password 	= req.body.password;

	var userController = require('./user_controller');

	userController.autenticar(login, password, function(error, user) {

		if (error) {
			req.session.errors = [{"message": 'Se ha producido un error :' + error}];
			res.redirect("/login");
			return;
		};

		// Guardamos los datos del usuario
		req.session.user = {id: user.id, username: user.username};
		// Guardamos el momento actual
		req.session.lastTime = process.hrtime();
		// Cargamos la pagina anterior al login
		res.redirect(req.session.redir.toString());
	})

	
};

// DELETE /logout -- Destruir sesion
exports.destroy = function (req, res) {
	delete req.session.user;
	// Cargamos la pagina anterior al logout
	res.redirect(req.session.redir.toString());
}