import express from 'express';
import { spawn } from 'child_process';
const app = express();
const port = 9207; // default port to listen on

app.get('/', (req, res) => {
    // ensure the query parameter is a string
    const command = req.query['command'];
    if (command === undefined) {
        console.log("Missing query parameter");
        res.send('Missing query parameters');
        return;
    }
    if (typeof command !== 'string') {
        console.log("Invalid query parameter");
        res.send('Invalid query parameter');
        return;
    }

    // spawn a new itg-cli python process and send the output to the client
    const pythonProcess = spawn('python3',["../itg-cli/main.py", command]);
    pythonProcess.stdout.on('data', (data) => {
        console.log("Sending response: ", data.toString());
        res.send({ output: data.toString() });
    });
    // TODO: add support for multiple responses
    //       might need to use a different package than express
    // TODO: add robust error handling
});

console.log(`Listening on port ${port}...`);
app.listen(port);