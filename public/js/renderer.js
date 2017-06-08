const ipcRenderer = require('electron').ipcRenderer;

const text = document.querySelector('#text');
const send = document.querySelector('#send');
send.onclick = () => {
	if (text.value !== '') {
		ipcRenderer.send('text', text.value);
		setTimeout(() => {
			text.value = '';
		}, 100);
	}
};
