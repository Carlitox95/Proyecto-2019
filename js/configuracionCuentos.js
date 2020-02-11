////////////////////////////////////////////////////////////////////////////////
/////Datos de prueba donde se muestra el resultado del ejercicio realizado//////
////////////////////////////////////////////////////////////////////////////////

//Parametros de configuración del ejercicio que pase por el json
const resultadosEjercicio=JSON.parse(localStorage.getItem("resultadosCuentos"));
console.log(resultadosEjercicio);


////////////////////////////////////////////////////////////////////////////////
/////Datos necesarios para generar el listado dinamico de cuentos y alumnos/////
////////////////////////////////////////////////////////////////////////////////

let listaAlumnos = []; //Array donde tengo el listado de mis alumnos
const { app } = require("electron").remote;
const path = require("path");
const Database = require("better-sqlite3");
const dbFile = path.join(app.getAppPath(), "db.sqlite");
const db = new Database(dbFile);
const Swal = require("sweetalert2");
var idEstudiante; //voy a trabajar con el ID de cada estudiante
var nroCuento; //voy a trabajar con el Nro del cuento
let query = "SELECT * FROM estudiantes";
let row = db.prepare(query);
let alumnosDB = row.all();
alumnosDB.forEach((alumno) => {
	listaAlumnos.push(alumno);
});
   
//Cargo el JSON de los cuentos
//const cuentos = require('../jsonCuentos.json');
//console.log(cuentos);

//Cargo mis cuentos desde la base de datos
let cuentos = []; //array de objetos que va a contener los cuentos
let cuentosBD = db.prepare("SELECT * FROM cuentos").all(); //Me traigo todos los cuentos

//Defino los listados para crear los objetos
let listacuentosBD=[];
for (let index = 0; index <cuentosBD.length; index++) {
 var CuentoActual= new Object();  //voy a crear un objeto para cada concepto

 //defino las variables
 let id_cuentoBD=cuentosBD[index].idcuento;
 let nroCuentoBD=cuentosBD[index].nrocuento;
 let tituloCuentoBD=cuentosBD[index].titulo;

 //Defino los array donde voy a almacenar las listas para cada iteracion
 let listaPasosBD=[];
 let listaPalabrasObjetivoBD=[]; 
 let listaPalabrasDistractorasBD=[];
 
 //Defino la QUERY para cada TABLA PASO DEL EJERCICIO DEL CUENTO EN PARTICULAR
 let pasoBD=db.prepare("SELECT * FROM cuentos_pasos Where idcuento ="+id_cuentoBD).all();

    //Obtengo todos los datos de ese paso con respecto al cuento que quiero
    for (let index=0; index < pasoBD.length; index++) {
     listaPasosBD.push(pasoBD[index].paso);
     listaPalabrasObjetivoBD.push(pasoBD[index].palabraobjetivo);
     listaPalabrasDistractorasBD.push(pasoBD[index].palabradistractora);
    }
    
 //Creo los cada atributo del OBJETO
 CuentoActual.titulo=tituloCuentoBD;
 CuentoActual.nrocuento=nroCuentoBD;
 CuentoActual.pasos=listaPasosBD;
 CuentoActual.palabrasobjetivo=listaPalabrasObjetivoBD;
 CuentoActual.palabrasdistractores=listaPalabrasDistractorasBD;

 //Agrego el objeto a mi ARRAY DE OBJETOS
 cuentos.push(CuentoActual); 
}
console.log(cuentos)



/////////////////////////////////////////////////////////////////////////////////
/////EL SIGUIENTE WHILE SE ENCARGA DE MOSTRAR EL LISTADO DINAMICO DE CUENTOS/////
/////////////////////////////////////////////////////////////////////////////////

let div_cuentos = document.getElementById("listadocuentos"); //Creo un DIV para el listado
div_cuentos.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
        blankAllCuentos();
        //e.target.setAttribute("class", "collection-item avatar Seleccionado");
        nroCuento = e.target.getAttribute("nroCuento");        
        var li_select= document.getElementById("li"+nroCuento);        
        li_select.setAttribute("class","collection-item avatar teal lighten-2 white-text text-darken-2");        
    }
});

function blankAllCuentos() {
    let cuentos_aux = document.getElementById("listadocuentos").getElementsByTagName("img");
    for (let index = 0; index < cuentos_aux.length; index++) {
        //cuentos_aux[index].setAttribute("class", "collection-item avatar noSeleccionado");
        let li_select = document.getElementById("li"+index);
        li_select.setAttribute("class","collection-item avatar noSeleccionado");       
    }
}

let searchBarCuento = document.getElementById("buscarCuento").addEventListener("keyup", searchCuento);
function searchCuento() {
    var input, i, filter, li, ul, txtValue;
    input = document.getElementById("buscarCuento");
    filter = input.value.toUpperCase();
    let array_aux = document.getElementById("listadocuentos").getElementsByTagName("img");
    for (i = 0; i < array_aux.length; i++) {
        a = array_aux[i].getAttribute("titulo");
        txtValue = a;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            array_aux[i].parentElement.style.display = "";
        } else {
            array_aux[i].parentElement.style.display = "none";
        }
    }
}

//Generamos el listado de cuentos
var contadorcuento=0;
while (contadorcuento<cuentos.length) {
 let nro = parseInt(contadorcuento)+parseInt(1);
 let titulo = cuentos[contadorcuento].titulo;
 let nrocuento = contadorcuento;
 let li = document.createElement("li");
 li.setAttribute("class", "collection-item avatar noSeleccionado");
 li.setAttribute("id","li"+nrocuento);
 let img_cuento = document.createElement("img");
 img_cuento.setAttribute("id",nrocuento);
 img_cuento.setAttribute("class","circle");
 img_cuento.setAttribute("hight", "200");
 img_cuento.setAttribute("width", "200");
 img_cuento.setAttribute("nroCuento",nrocuento);
 img_cuento.setAttribute("titulo",titulo);
 img_cuento.src="../public/images/cuentos/"+nro+"/portada.jpg";
 let p1= document.createElement("p");
 let p1_content= document.createTextNode(titulo);
 li.appendChild(p1_content);
 let listadocuentos=document.getElementById("listadocuentos");
 li.appendChild(img_cuento).appendChild(p1);
 listadocuentos.appendChild(li);  
 contadorcuento++;
}




////////////////////////////////////////////////////////////////////////////////
////////////EL SIGUIENTE WHILE GENERA EL LISTADO DINAMICO DE ALUMNOS////////////
////////////////////////////////////////////////////////////////////////////////


let div_estudiantes = document.getElementById("listadoalumnos"); //Creo un DIV para el listado
div_estudiantes.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG") {
        blankAllEstudiantes();
        e.target.setAttribute("class", "circle avatar seleccionado");
        idEstudiante = e.target.getAttribute("idDB");
    }
});

function blankAllEstudiantes() {
    let array_aux = document.getElementById("listadoalumnos").getElementsByTagName("img");
    for (let index = 0; index < array_aux.length; index++) {
        array_aux[index].setAttribute("class", "circle avatar noSeleccionado");
    }
}

let searchBarEstudiante = document.getElementById("buscarEstudiante").addEventListener("keyup", searchNombre);
function searchNombre() {
    var input, i, filter, li, ul, txtValue;
    input = document.getElementById("buscarEstudiante");
    filter = input.value.toUpperCase();
    let array_aux = document.getElementById("listadoalumnos").getElementsByTagName("img");
    for (i = 0; i < array_aux.length; i++) {
        a = array_aux[i].getAttribute("nombre") + " " + array_aux[i].getAttribute("apellido");
        txtValue = a;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            array_aux[i].parentElement.style.display = "";
        } else {
            array_aux[i].parentElement.style.display = "none";
        }
    }
}

var contador1=0; //contador
while (contador1<=listaAlumnos.length) {
 let nombreApellido = listaAlumnos[contador1].nombre + " " + listaAlumnos[contador1].apellido;
 let idDB = listaAlumnos[contador1].id;
 let listItem = document.createElement("div");
 let pal = document.createElement("p");
 pal.setAttribute("class", "nyap");
 listItem.setAttribute("class", "col s2 estudiante");
 pal.innerHTML = nombreApellido;
 let img = document.createElement("img");
 img.setAttribute("class", "circle avatar noSeleccionado ");
 img.setAttribute("hight", "80");
 img.setAttribute("width", "80");
 img.setAttribute("avatar", nombreApellido);
 img.setAttribute("nombre", listaAlumnos[contador1].nombre);
 img.setAttribute("apellido", listaAlumnos[contador1].apellido);
 img.setAttribute("edad", listaAlumnos[contador1].edad);
 img.setAttribute("descripcion", listaAlumnos[contador1].descripcion);
 img.setAttribute("idDB", listaAlumnos[contador1].id);
 listItem.innerHTML += img.outerHTML;
 listItem.innerHTML += pal.outerHTML; 
 div_estudiantes.appendChild(listItem);
 contador1++;
}

////////////////////////////////////////////////////////////////////////////////
////////Funciones necesarias para el control de todas las configuraciones///////
////////////////////////////////////////////////////////////////////////////////

function iniciarEjercicio() {
 let alumno_definido=listaAlumnos[parseInt(idEstudiante)-parseInt(1)];
 let cuento_definido=cuentos[nroCuento];
 //let nrocuento_definido=parseInt(nroCuento)+parseInt(1);
 //console.log(alumno_definido);
 //console.log(cuento_definido);

    if ((alumno_definido== null) || (cuento_definido == null)) {
     //alert("Debe seleccionar un estudiante y un cuento");
        Swal.fire({
         //imageUrl: "../public/images/otravez.png",
         width: 400,
         imageWidth: 200,
         imageHeight: 300,
         background: "#e4f2f0",
         title: "Debe seleccionar un estudiante y un cuento",
         showConfirmButton: false,
         timer: 1000
        });
    }
    else {
     localStorage.setItem("configCuentos", JSON.stringify({cuento:cuento_definido,alumno:alumno_definido}));
     location.href = "cuento.html";  
    }
 
}

