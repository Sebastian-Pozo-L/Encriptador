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

document.getElementById("txt").addEventListener("paste", function (event) {
	// Prevenir el comportamiento por defecto del pegado
	event.preventDefault();
	// Obtener el texto pegado desde el portapapeles
	let pasteText = (event.clipboardData || event.originalEvent.clipboardData).getData("text");
	// Filtrar el texto para permitir solo letras minúsculas, espacios y "ñ"
	pasteText = pasteText.replace(/[^a-zñ ]/g, "");
	// Insertar el texto filtrado directamente en el textarea
	const txtArea = document.getElementById("txt");
	const start = txtArea.selectionStart;
	const end = txtArea.selectionEnd;
	// Insertar el texto pegado en la posición del cursor
	const textBefore = txtArea.value.substring(0, start);
	const textAfter = txtArea.value.substring(end);
	txtArea.value = textBefore + pasteText + textAfter;
	// Mover el cursor al final del texto pegado
	txtArea.setSelectionRange(start + pasteText.length, start + pasteText.length);
});

//encryptEvent(): Ejecuta la acción de encriptar el texto ingresado,
//muestra un mensaje de alerta y guarda el texto encriptado.
function encryptEvent() {
	const textoencryp = accionEncrypt();
	if (!textoencryp) return;
	if (firstClick) {
		hiddenContentEvent();
		firstClick = false;
	}
	if (!alertShown) {
		messageAlert();
		alertShown = true;
	}
	saveDataText("encrypt", textoencryp);
}
//desencryptEvent(): Ejecuta la acción de desencriptar el texto ingresado,
//muestra un mensaje de alerta y guarda el texto desencriptado.
function desencryptEvent() {
	const textodesencryp = accionDecrypt();
	if (!textodesencryp) return;
	if (firstClick) {
		hiddenContentEvent();
		firstClick = false;
	}
	if (!alertShown) {
		messageAlert();
		alertShown = true;
	}
	saveDataText("decrypt", textodesencryp);
}
//accionEncrypt(): Encripta el texto reemplazando las vocales con ciertos patrones de caracteres
function accionEncrypt() {
	let texto = document.getElementById("txt").value;
	if (texto === "") return null;
	const textoencryp = texto
		.replace(/e/g, "enter")
		.replace(/i/g, "imes")
		.replace(/a/g, "ai")
		.replace(/o/g, "ober")
		.replace(/u/g, "ufat");
	document.getElementById("txt").value = "";
	return textoencryp;
}
//accionDecrypt(): Desencripta el texto reemplazando los patrones
//de caracteres con sus respectivas vocales originales.
function accionDecrypt() {
	let texto = document.getElementById("txt").value;
	if (texto === "") return null;
	const textodesencryp = texto
		.replace(/enter/g, "e")
		.replace(/imes/g, "i")
		.replace(/ai/g, "a")
		.replace(/ober/g, "o")
		.replace(/ufat/g, "u");
	document.getElementById("txt").value = "";
	return textodesencryp;
}
//hiddenContentEvent(): Oculta el contenido original y prepara
//el contenedor para mostrar el texto encriptado o desencriptado.
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
//saveDataText(action, text): Crea un botón con el texto encriptado
//o desencriptado, permitiendo seleccionarlo para copiar o eliminar.
function saveDataText(action, text) {
	const saveData = document.getElementById("cnt-datatext");
	const boxDataText = document.createElement("button");
	boxDataText.className = "box-text";
	const spantext = document.createElement("span");
	if (action === "encrypt") {
		spantext.innerHTML = text;
	} else if (action === "decrypt") {
		spantext.innerHTML = text;
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
//messageAlert(): Muestra una alerta visual con un mensaje sobre las acciones disponibles.
function messageAlert() {
	if (!document.getElementById("box-alert")) {
		const sendAlert = document.getElementById("main-container");
		const boxAlert = document.createElement("div");
		boxAlert.className = "box-alert";
		boxAlert.id = "box-alert";
		boxAlert.innerHTML = `<img src="images/notification.png" alt="Circulo de exclamación"/>
	<br> <p>Puedes seleccionar el texto que desees copiar o eliminar para usar el algoritmo de encriptado o desencriptado.</p>`;
		sendAlert.appendChild(boxAlert);
		setTimeout(() => {
			boxAlert.classList.add("appear");
		}, 0);
		messageAlertTimedOut();
	}
}
//messageAlertTimedOut(): Controla el tiempo de visibilidad de la alerta,
//haciendo que desaparezca tras un periodo.
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
//createBottonErase(): Crea un botón de eliminar que permite eliminar el texto seleccionado.
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
			selectedButton = null;
			showExtraButtons();
		}
	});
}
//createButtonCopy(): Crea un botón de copiar que copia el contenido del texto seleccionado al portapapeles.
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
//showExtraButtons(): Verifica si hay texto disponible y, si es así, muestra los botones de copiar y eliminar.
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
//removeButtons(): Elimina los botones de copiar y eliminar cuando no hay texto seleccionado.
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
//restoreOriginalState(): Restaura el estado original del contenedor de texto
//si no hay texto encriptado o desencriptado.
function restoreOriginalState() {
	const backupContent = document.getElementById("cnt-txt");
	if (backupContent) {
		backupContent.className = originalclasstxt;
		backupContent.innerHTML = originalcntcolumn;
	}
}

btnencrypt.addEventListener("click", encryptEvent);
btndesencrypt.addEventListener("click", desencryptEvent);
