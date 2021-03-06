var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var statisticController = require('../controllers/statistic_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

/* Página de créditos del autor */
router.get('/author', function(req, res) {
  res.render('author', {errors: []});
});

/* Cuando la URL contiene el parámetro quizId -> lanzamos el controlador que recupera el registro de la BD */
router.param('quizId', quizController.load);
/* Cuando la URL contiene el parámetro commentId -> lanzamos el controlador que recupera el registro de la BD */
router.param('commentId', commentController.load);

// Definición de rutas de sesion
router.get('/login',		sessionController.new);
router.post('/login',		sessionController.create);
router.delete('/logout',	sessionController.destroy);


// Definición de rutas de quizes
router.get('/quizes', 						quizController.index);
router.get('/quizes/:quizId(\\d+)', 		quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', 	quizController.answer);

// Incluimos el control de Autorización
router.get('/quizes/new', 					sessionController.loginRequired,	quizController.new);
router.post('/quizes/create', 				sessionController.loginRequired,	quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', 	sessionController.loginRequired,	quizController.edit);
router.put('/quizes/:quizId(\\d+)', 		sessionController.loginRequired,	quizController.update);
router.delete('/quizes/:quizId(\\d+)', 		sessionController.loginRequired,	quizController.destroy);

// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new',	commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',		commentController.create);
router.put('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',	sessionController.loginRequired,	commentController.publish);


// Definición de estadísticas
router.get('/statistics', 	statisticController.load, statisticController.index);


module.exports = router;
