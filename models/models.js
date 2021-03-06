var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  dialect,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// Importar definicion de la tabla Quiz
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

// Importar definicion de la tabla Comment
var Comment = sequelize.import(path.join(__dirname,'comment'));

// Establecemos las relaciones entre las tablas Quiz y Comment
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

// Exportar tabla, para acceder desde todos los ficheros de la aplicacón
exports.Quiz = Quiz; 
exports.Comment = Comment;

// sequelize.sync() inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
	Quiz.count().then(function (count){
		    // Sólo si la tabla está vacía
        if(count === 0) {   
    	    Quiz.create( 
            	{pregunta: 'Capital de Italia',   
               respuesta: 'ROMA',
               tema: 'humanidades'
              });
          Quiz.create( 
              {pregunta: 'Capital de Portugal',   
               respuesta: 'LISBOA',
               tema: 'humanidades'
             })
          .then(function(){console.log('Base de datos inicializada')});
        };
    });
});
