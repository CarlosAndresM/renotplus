const sqlite3 = require('sqlite3').verbose();

// Abre la conexión a la base de datos
let db = new sqlite3.Database('database.db');

// ...operaciones en la base de datos...

// Cierra la conexión a la base de datos
db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Conexión a la base de datos cerrada.');
});
