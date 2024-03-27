const sqlite3 = require('sqlite3').verbose();

const conn = new sqlite3.Database('database.db');

// Ejecutar la declaración SQL para crear la tabla Usuarios
conn.run(`CREATE TABLE IF NOT EXISTS Usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    numero INTEGER NOT NULL
)`, 
(error) => {
    if (error) {
        console.error('Error al crear la tabla Usuarios:', error.message);
    } else {
        console.log('Tabla Usuarios creada');
    }
});

// Ejecutar la declaración SQL para crear la tabla Actividades_Pagadas
conn.run(`CREATE TABLE IF NOT EXISTS Actividades_Pagadas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER NOT NULL,
    id_actividad INTEGER NOT NULL, 
    Fecha TEXT NOT NULL,
    pagos REAL NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id)
)`,
(error) => {
    if (error) {
        console.error('Error al crear la tabla Actividades_Pagadas:', error.message);
    } else {
        console.log('Tabla Actividades_Pagadas creada');
    }
});
