var nombreDocente;
var ruta;
let listaDocentes = [];
let l = [];
var seleccionado;
const { app } = require("electron").remote;
const path = require("path");
const Database = require("better-sqlite3");
const dbFile = path.join(app.getAppPath(), "db.sqlite");
const db = new Database(dbFile);
// const query = "SELECT * FROM docentes";
// const row = db.prepare(query);
// const docentesDB = row.all();
// docentesDB.forEach((docente) => {
// 	listaDocentes.push(docente);
// });

getDocentes().then((data) => {
	data.data.forEach((docente) => {
		listaDocentes.push(docente);
	});
	setView(listaDocentes);
	addListener();
});

function setView(listaDocentes) {
	let ul = document.getElementById("listaDocentes");
	for (let index = 0; index < listaDocentes.length; index++) {
		let nombreApellido = listaDocentes[index].nombre + " " + listaDocentes[index].apellido;
		let idDB = listaDocentes[index].id;
		let listItem = document.createElement("li");
		listItem.setAttribute("idDB", idDB);
		listItem.setAttribute("class", "collection-item ");
		listItem.setAttribute("ruta", listaDocentes[index].rutaAvatar);
		listItem.textContent = nombreApellido;
		ul.appendChild(listItem);
	}
}

function addListener() {
	var ul = document.getElementById("listaDocentes");
	ul.addEventListener("click", (e) => {
		if (e.target.tagName === "LI") {
			blankAll();
			event.target.setAttribute("class", "collection-item active");
			nombreDocente = event.target.textContent;
			ruta = event.target.getAttribute("ruta");
		}
	});
}

function blankAll() {
	let ul = document.getElementById("listaDocentes");
	let items = ul.getElementsByTagName("li");
	for (let i = 0; i < items.length; ++i) {
		items[i].setAttribute("class", "collection-item");
	}
}

let btnIniciar = document.getElementById("btnIniciarSesion");
let btnNuevo = document.getElementById("btnNuevo");

btnIniciar.addEventListener("click", () => {
	if (nombreDocente != null) {
		localStorage.setItem("login", JSON.stringify({ nombreDocente: nombreDocente, ruta: ruta }));
		location.href = "index.html";
	}
});

btnNuevo.addEventListener("click", () => {
	location.href = "altaDocente.html";
});

async function getDocentes() {
	let response = await fetch("http://localhost:3000/docentes");
	let data = await response.json();
	return data;
}
