var path = require('path');


// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null, 
  { dialect:  "sqlite",
    storage:  "quiz.sqlite" 
  }      
);

// Importar definicion de la tabla Quiz
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// Exportar tabla, para acceder desde todos los ficheros de la aplicacón
exports.Quiz = Quiz; 

// sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	Quiz.count().then(function (count){
		    // Sólo si la tabla está vacía
        if(count === 0) {   
    	    Quiz.create( 
            	{pregunta: 'Capital de Italia',   
               respuesta: 'ROMA'})
            .then(function(){console.log('Base de datos inicializada')});
        };
    });
});
