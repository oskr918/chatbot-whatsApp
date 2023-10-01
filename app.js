const express = require('express');
const twilio = require('./twilio');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base de datos temporal para almacenar citas
const citas = [];
const instructionsTemplate = `
¡Hola! Soy tu asistente virtual.

Aquí tienes algunas instrucciones sobre cómo interactuar conmigo:

1. **Saludar:** Escribe "Hola".

2. **Preguntar cómo estoy:** Escribe "¿Cómo estás?".

3. **Reservar una cita:** Utiliza el siguiente formato: "Reservar cita el [Fecha] a las [Hora]".

   Por ejemplo: "Reservar cita el 15 de octubre a las 3 PM".

   ¡Recuerda proporcionar la fecha y hora deseadas!

4. **Otras consultas:** Si tienes alguna otra pregunta o consulta, no dudes en escribirme.

¡Espero poder ayudarte! 😊
`;
app.post('/webhook', function(req, res) {
    const userMessage = req.body.Body.toLowerCase();
    const userNumber = req.body.WaId;

    if (userMessage.includes('hola')) {
        twilio.sendTextMessage(userNumber, instructionsTemplate);
    } else if (userMessage.includes('cómo estás')) {
        twilio.sendTextMessage(userNumber, 'Estoy bien, ¿y tú?');
    } else if (userMessage.includes('reservar cita')) {
        twilio.sendTextMessage(userNumber, 'Por supuesto. Por favor, proporciona la fecha y hora para la cita (ejemplo: "Cita el 15 de octubre a las 3 PM").');
    } else if (userMessage.includes('cita el')) {
        const fechaHora = userMessage.match(/cita el (.+)/)[1];
        citas.push({ usuario: userNumber, fecha: fechaHora });
        twilio.sendTextMessage(userNumber, `Cita confirmada para el ${fechaHora}.`);
    } else {
        twilio.sendTextMessage(userNumber, 'Lo siento, no entiendo ese mensaje.');
    }

    console.log(req.body);
    res.send('Mensaje recibido');
});

app.listen(5000, () => {
    console.log('Servidor en el puerto 5000');
});
