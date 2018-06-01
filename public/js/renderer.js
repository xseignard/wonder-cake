const ipcRenderer = require('electron').ipcRenderer;

const text1 = document.querySelector('#text1');
const send1 = document.querySelector('#send1');
const current1 = document.querySelector('#current1');

send1.onclick = () => {
	ipcRenderer.send('text1', text1.value);
	if (!text1.value.startsWith('#')) current1.textContent = text1.value;
	setTimeout(() => {
		text1.value = '';
	}, 100);
};

const text2 = document.querySelector('#text2');
const send2 = document.querySelector('#send2');
const current2 = document.querySelector('#current2');

send2.onclick = () => {
	ipcRenderer.send('text2', text2.value);
	if (!text2.value.startsWith('#')) current2.textContent = text2.value;
	setTimeout(() => {
		text2.value = '';
	}, 100);
};

const text3 = document.querySelector('#text3');
const send3 = document.querySelector('#send3');
const current3 = document.querySelector('#current3');

send3.onclick = () => {
	ipcRenderer.send('text3', text3.value);
	if (!text3.value.startsWith('#')) current3.textContent = text3.value;
	setTimeout(() => {
		text3.value = '';
	}, 100);
};

const text4 = document.querySelector('#text4');
const send4 = document.querySelector('#send4');
const current4 = document.querySelector('#current4');

send4.onclick = () => {
	ipcRenderer.send('text4', text4.value);
	if (!text4.value.startsWith('#')) current4.textContent = text4.value;
	setTimeout(() => {
		text4.value = '';
	}, 100);
};
