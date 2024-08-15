const btnencrypt = document.querySelector("#encrypt");
const btndesencrypt = document.querySelector("#desencrypt");
const btndelete = document.querySelector("#erase");
const btncopied = document.querySelector("#copy");

let firstClick = true;
let alertShown = false;

let originalcntcolumn;
let originalclasstxt;

let selectedButton = null;
let dataCopied = null;

document.addEventListener("DOMContentLoaded", () => {
	const cntTxt = document.getElementById("cnt-txt");
	originalcntcolumn = cntTxt.innerHTML;
	originalclasstxt = cntTxt.className;
});

function encryptEvent() {
	const textoencryp = accionEncrypt();
	if (firstClick) {
		hiddenContentEvent();
		firstClick = false; // Cambia la bandera para evitar que se ejecute nuevamente
	}
	if (!alertShown) {
		messageAlert();
		alertShown = true;
	}
	saveDataText("encrypt", textoencryp);
}
function desencryptEvent() {
	const textodesencryp = accionDecrypt();
	if (firstClick) {
		hiddenContentEvent();
		firstClick = false; // Cambia la bandera para evitar que se ejecute nuevamente
	}
	if (!alertShown) {
		messageAlert();
		alertShown = true;
	}
	saveDataText("decrypt", textodesencryp);
}
function accionEncrypt() {
	let texto = document.getElementById("txt");
	let textoencryp = texto.value
		.replace(/e/g, "enter")
		.replace(/i/g, "imes")
		.replace(/a/g, "ai")
		.replace(/o/g, "ober")
		.replace(/u/g, "ufat");
	texto.value = "";
	return textoencryp;
}
function accionDecrypt() {
	let texto = document.getElementById("txt");
	const textodesencryp = texto.value
		.replace(/enter/g, "e")
		.replace(/imes/g, "i")
		.replace(/ai/g, "a")
		.replace(/ober/g, "o")
		.replace(/ufat/g, "u");
	texto.value = "";
	return textodesencryp;
}
function hiddenContentEvent() {
	const cntTextHidden = document.getElementById("cnt-txt");

	if (cntTextHidden) {
		Array.from(cntTextHidden.children).forEach((child) => {
			child.remove();
		});
		cntTextHidden.className = "cnt-datatext-wrapper";
		const dataText = document.createElement("div");
		dataText.className = "cnt-datatext";
		dataText.id = "cnt-datatext";
		cntTextHidden.appendChild(dataText);
	}
}
function saveDataText(action, text) {
	const saveData = document.getElementById("cnt-datatext");
	const boxDataText = document.createElement("button");
	boxDataText.className = "box-text";
	const spantext = document.createElement("span");
	if (action === "encrypt") {
		spantext.innerHTML = text; // Usa el texto encriptado
	} else if (action === "decrypt") {
		spantext.innerHTML = text; // Usa el texto desencriptado
	}
	boxDataText.appendChild(spantext);
	saveData.appendChild(boxDataText);

	boxDataText.addEventListener("click", function () {
		if (selectedButton) {
			selectedButton.classList.remove("selected");
		}
		selectedButton = this;
		selectedButton.classList.add("selected");
		dataCopied = this;
	});
	showExtraButtons();
}
function messageAlert() {
	if (!document.getElementById("box-alert")) {
		const sendAlert = document.getElementById("main-container");
		const boxAlert = document.createElement("div");
		boxAlert.className = "box-alert";
		boxAlert.id = "box-alert";
		boxAlert.innerHTML = `<img src="images/notification.png" alt="Circulo de exclamación"/>
	<br> <p>Puedes seleccionar el texto que desees copiar o eliminar para usar el algoritmo de encriptado o desencriptado</p>`;
		sendAlert.appendChild(boxAlert);
		setTimeout(() => {
			boxAlert.classList.add("appear");
		}, 0);
		messageAlertTimedOut();
	}
}
function messageAlertTimedOut() {
	const contador = document.getElementById("box-alert");
	setTimeout(() => {
		contador.classList.remove("appear");
		contador.classList.add("fade-out");
		setTimeout(() => {
			contador.remove();
		}, 2000);
	}, 6000);
}
function createBottonErase() {
	const createBtnErase = document.getElementById("buttons");
	const btnErase = document.createElement("button");
	btnErase.className = "btn-erase";
	btnErase.id = "erase";
	btnErase.innerHTML = `<p>Eliminar</p><img src="images/trash.png" alt="Icono de basura"/>`;
	createBtnErase.appendChild(btnErase);

	btnErase.addEventListener("click", function () {
		if (selectedButton) {
			selectedButton.remove();
			selectedButton = null; // Reiniciar la selección después de eliminar el botón
			showExtraButtons(); // Actualiza los botones extra
		}
	});
}
function createButtonCopy() {
	const createBtnCopy = document.getElementById("buttons");
	const btnCopy = document.createElement("button");
	btnCopy.className = "btn-copy";
	btnCopy.id = "copy";
	btnCopy.innerHTML = `<p>Copiar</p><img src="images/page.png" alt="Icono de copiar"/>`;
	createBtnCopy.appendChild(btnCopy);

	btnCopy.addEventListener("click", function (text) {
		if (dataCopied) {
			const spanContent = dataCopied.querySelector("span").innerText;
			navigator.clipboard.writeText(spanContent).then(() => {});
		}
	});
}
function showExtraButtons() {
	const showButtons = document.getElementsByClassName("box-text");
	const eraseButton = document.getElementById("erase");
	const copyButton = document.getElementById("copy");

	if (showButtons.length > 0) {
		if (!eraseButton) {
			createBottonErase();
		}
		if (!copyButton) {
			createButtonCopy();
		}
	} else {
		removeButtons();
		restoreOriginalState();
		firstClick = true;
	}
}
function removeButtons() {
	const removeErase = document.getElementById("erase");
	const removeCopy = document.getElementById("copy");
	if (removeErase) {
		removeErase.remove();
	}
	if (removeCopy) {
		removeCopy.remove();
	}
}
function restoreOriginalState() {
	const backupContent = document.getElementById("cnt-txt");
	if (backupContent) {
		backupContent.className = originalclasstxt;
		backupContent.innerHTML = originalcntcolumn;
	}
}

btnencrypt.addEventListener("click", encryptEvent);
btndesencrypt.addEventListener("click", desencryptEvent);
