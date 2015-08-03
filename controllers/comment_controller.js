var models = require('../models/models.js')



//Autoload :commentID de comentarios
exports.load = function(req, res, next, commentId) {
	models.Comment.find ({
		where : {
			id: Number(commentId)
		}
	}).then (function (comment) {
		if (comment) {
			req.comment = comment;
			next();
		} else {
			next(new Error('No existe comentario. commentId = ' + commentId))
		}
	}).catch(function(error) {next(error)});
};


// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
	res.render('comments/new', {quizid: req.params.quizId, errors: []});	
};

// POST /quizes/:quizId/comments
exports.create = function(req, res) {
	// Construimos el objeto a partir de los parámetros
	var comment = models.Comment.build(
		{ texto:  req.body.comment.texto,
		  QuizId: req.params.quizId
		});

	comment.validate().then (

		function (err) {

			if (err) {

				res.render('comments/new', {comment: comment, quizid: req.params.quizId, errors: err.errors});	

			} else {

				// Guardamos los valores en la BD (sólo los valores de pregunta, respuesta y tema)
				comment.save().then(
					function() {
						// Redirección HTTP (URL relativa)
						res.redirect('/quizes/' + req.params.quizId);	
					}
				)
			}
		}

	).catch(function(error) {next(error)});
};

// PUT /quizes/:quizId/comments/:commentID/publish
exports.publish = function(req, res) {
	req.comment.publicado = true;

	req.comment.save( {fields: ["publicado"]} )
		.then  (function() {res.redirect('/quizes/' + req.params.quizId);}) 
		.catch (function(error) {next(error)});
};


