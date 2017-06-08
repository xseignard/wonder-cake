const ipcRenderer = require('electron').ipcRenderer;

const text = document.querySelector('#text');
const send = document.querySelector('#send');
const current = document.querySelector('#current');

send.onclick = () => {
	ipcRenderer.send('text', text.value);
	current.textContent = text.value;
	setTimeout(() => {
		text.value = '';
	}, 100);
};
