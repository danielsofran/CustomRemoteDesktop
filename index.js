import {WebSocketServer} from 'ws'
import {URL} from 'url'
import robot from "robotjs"
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wss = new WebSocketServer({port: 12550})

wss.on('connection', (ws, req) => {
	// extract authentication token from headers
	const protocols = req.headers['sec-websocket-protocol']
	const token = protocols.split(',').map(x => x.trim()).find(x => x.startsWith('token-')).split('-')[1]
	if (token !== '__Daniel__#3875') {
		ws.send(JSON.stringify({type: 'error', message: 'Invalid token'}))
		ws.close()
		return
	}

	ws.on('message', message => {
		console.log(`Received message => ${message}`)
		const data = JSON.parse(message)

		if (data.type === 'mousemove') { // {type: 'mousemove', x: 100, y: 100}
			data.x = parseFloat(data.x) || 0
			data.y = parseFloat(data.y) || 0
			const current = robot.getMousePos()
			console.log(`Moving mouse from (${current.x}, ${current.y}) to (${current.x + data.x}, ${current.y + data.y})`)
			robot.moveMouse(current.x + data.x, current.y + data.y)
		}
		else if (data.type === 'mouseclick') { // {type: 'mouseclick', button: 'left', double: false}
			robot.mouseClick(data.button, data.double)
		}
		else if (data.type === 'mousestate') { // {type: 'mousestate', button: 'left', state: 'down'}
			robot.mouseToggle(data.state, data.button)
		}
		else if (data.type === 'keypress') { // {type: 'keypress', key: 'a', modifier: ['alt', 'shift', 'control']}
			robot.keyTap(data.key, data.modifier)
		}
		else if (data.type === 'stop') {
			ws.close()
		}
	})
})

const app = express()

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Catch-all route to serve index.html for all frontend routes
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

app.listen(12555, () => {
	console.log('Server started on port 12555')
})