var models = require('../models/models.js')


// Si la ruta contiene :quizId carga el objeto quiz recuperado de BD en req
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next (new Error ('No existe quizId = ' + quizId));
			}
		}
	);
};

// GET /quizes
exports.index = function(req, res) {
	
	var busqueda;

	// Contruimos la consulta de búsqueda
	consulta = {};
	if (req.query.search !== undefined) {
		// Convertimos a mayúsculas y sustituimos los espacios por %
		busqueda = req.query.search.toUpperCase().replace(/\s/g,"%");
		consulta = {where: ["Upper(pregunta) like ?", '%' + busqueda  + '%'], 
				    order: [['pregunta', 'ASC']]};
	};

	// Ejecutamos la consulta y mostramos el resultado
	models.Quiz.findAll(consulta).then(
		function(quizes) {
			res.render('quizes/index.ejs', {quizes: quizes, errors: []});
		}
	).catch(function(error) { next(error); });
};

// GET /quizes/:quizId
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz, errors: []});
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta.toUpperCase() === req.quiz.respuesta) {
	   	resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = 	models.Quiz.build(
					{pregunta: "Pregunta",
				 	 respuesta: "Respuesta"}
				);
	res.render('quizes/new', {quiz: quiz, errors: []});	
};

// POST /quizes/create
exports.create = function(req, res) {
	// Construimos el objeto a partir de los parámetros
	var quiz = 	models.Quiz.build(req.body.quiz);

	quiz.validate().then (

		function (err) {

			if (err) {

				res.render('quizes/new', {quiz: quiz, errors: err.errors});	

			} else {

				// Convertimos la respuesta a mayúsculas
				quiz.respuesta = quiz.respuesta.toUpperCase();

				// Guardamos los valores en la BD (sólo los valores de pregunta, respuesta)
				quiz.save({fields:["pregunta", "respuesta"]}).then(
					function() {
						// Redirección HTTP (URL relativa)
						res.redirect('/quizes');	
					}
				)
			}
		}

	)
};


// GET /quizes/:quizId/edit
exports.edit = function(req, res) {
	// Se carga con el load al contener la URL quizid
	var quiz = req.quiz;
	res.render('quizes/edit', {quiz: quiz, errors: []});	
};


// PUT /quizes/:quizId
exports.update = function(req, res) {
	
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz.validate().then (

		function (err) {

			if (err) {

				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});	

			} else {

				// Convertimos la respuesta a mayúsculas
				req.quiz.respuesta = req.quiz.respuesta.toUpperCase();

				// Guardamos los valores en la BD (sólo los valores de pregunta, respuesta)
				req.quiz.save({fields:["pregunta", "respuesta"]}).then(
					function() {
						// Redirección HTTP (URL relativa)
						res.redirect('/quizes');	
					}
				)
			}
		}

	)
};


// DELETE /quizes/:quizId
exports.destroy = function(req, res) {
	req.quiz.destroy().then (
		function () {
			res.redirect('/quizes');
		}
	).catch(
		function(err) {
			next(err)
		}
	);
};
