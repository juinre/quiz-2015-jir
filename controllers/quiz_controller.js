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
	models.Quiz.findAll().then(
		function(quizes) {
			res.render('quizes/index.ejs', {quizes: quizes});
		}
	).catch(function(error) { next(error); });
};

// GET /quizes/:quizId
exports.show = function(req, res) {
	res.render('quizes/show', {quiz: req.quiz});
};

// GET /quizes/:quizId/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
	if (req.query.respuesta.toUpperCase() === req.quiz.respuesta) {
	   	resultado = 'Correcto';
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};
