const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipcMain = require('electron').ipcMain;

const path = require('path');
const url = require('url');
const dgram = require('dgram');

let mainWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({ width: 1200, height: 700 });
	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, 'public', 'index.html'),
			protocol: 'file:',
			slashes: true,
		})
	);
	// mainWindow.webContents.openDevTools();
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
	if (mainWindow === null) createWindow();
});

// messaging stuff
const client = dgram.createSocket('udp4');
const ip1 = '192.168.1.2';
const ip2 = '192.168.1.3';
const ip3 = '192.168.1.4';
const ip4 = '192.168.1.5';

const port = 8888;

const sendText = (text, ip) => {
	const message = new Buffer(text, 'binary');
	client.send(message, 0, message.length, port, ip);
};

ipcMain.on('text1', (event, arg) => {
	console.log(ip1, arg);
	sendText(arg || ' ', ip1);
});
ipcMain.on('text2', (event, arg) => {
	console.log(ip2, arg);
	sendText(arg || ' ', ip2);
});
ipcMain.on('text3', (event, arg) => {
	console.log(ip3, arg);
	sendText(arg || ' ', ip3);
});
ipcMain.on('text4', (event, arg) => {
	console.log(ip4, arg);
	sendText(arg || ' ', ip4);
});
