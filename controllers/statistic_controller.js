var models = require('../models/models.js')


// GET /statistics
exports.load = function(req, res, next) {
	req.statistics = [];

	// Nº Preguntas
	models.Quiz.count().then(
		function (nPreguntas) {
			req.statistics.push({texto: 'Nº Preguntas', valor: nPreguntas});

			// Nº Comentarios
			models.Comment.count().then(
				function (nComentarios) {
					req.statistics.push({texto: 'Nº Comentarios', valor: nComentarios});
					// Media Comentarios x Pregunta
					if (req.statistics[0].valor) {
						req.statistics.push({texto: 'Media de Comentarios X Pregunta', valor: (nComentarios / req.statistics[0].valor).toFixed(2)});
					};

					// Preguntas con comentarios
					models.Quiz.count({
						include: [ {model: models.Comment, required: true} ],
						distinct: true
					}).then(
						function(nPregComentarios) {
							req.statistics.push({texto: 'Nº Preguntas con Comentarios', valor: nPregComentarios});
							// Preguntas sin comentarios
							req.statistics.push({texto: 'Nº Preguntas sin Comentarios', valor: req.statistics[0].valor - nPregComentarios});
							next();
						}
					).catch(function(error) { next(error); });

				}
			).catch(function(error) { next(error); });
				}
	).catch(function(error) { next(error); });


};

exports.index = function(req, res) {
	res.render('statistics/index.ejs', {statistics: req.statistics, errors: []});
};
