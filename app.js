const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'bmd0dfqbywfdaujcyu7v-mysql.services.clever-cloud.com',
    user: 'u95plknoonm7823p',
    password: 'RKMnnQA9Ak195yiL4zV2',
    database: 'bmd0dfqbywfdaujcyu7v',
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conexión exitosa a la base de datos');
});

app.use(express.static('public'));

// Middleware para evitar la solicitud de favicon
app.use('/favicon.ico', (req, res) => res.status(204));

// Ruta para obtener todos los registros
app.get('/switches', (req, res) => {
    const query = 'SELECT * FROM switches';
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error al obtener switches: ' + err.stack);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        res.json(result);
    });
});

// Ruta para guardar un nuevo registro
app.post('/switches', (req, res) => {
    const switchData = req.body;
    const query = 'INSERT INTO switches SET ?';
    db.query(query, switchData, (err, result) => {
        if (err) {
            console.error('Error al guardar switch: ' + err.stack);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        res.json({ message: 'Switch guardado exitosamente', id: result.insertId });
    });
});

// Ruta para actualizar un registro
app.put('/switches/:id', (req, res) => {
    const switchId = req.params.id;
    const switchData = req.body;
    const query = 'UPDATE switches SET ? WHERE id = ?';
    db.query(query, [switchData, switchId], (err, result) => {
        if (err) {
            console.error('Error al actualizar switch: ' + err.stack);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        res.json({ message: 'Switch actualizado exitosamente' });
    });
});

// Ruta para eliminar un registro
app.delete('/switches/:id', (req, res) => {
    const switchId = req.params.id;
    const query = 'DELETE FROM switches WHERE id = ?';
    db.query(query, switchId, (err, result) => {
        if (err) {
            console.error('Error al eliminar switch: ' + err.stack);
            res.status(500).json({ error: 'Error interno del servidor' });
            return;
        }
        res.json({ message: 'Switch eliminado exitosamente' });
    });
});

// Corrección en la ruta para enviar el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
