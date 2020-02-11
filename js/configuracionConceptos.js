////////////////////////////////////////////////////////////////////////////////
/////Datos de prueba donde se muestra el resultado del ejercicio realizado//////
////////////////////////////////////////////////////////////////////////////////

///Parametros de configuración del ejercicio que pase por el json
const resultadosEjercicio=JSON.parse(localStorage.getItem("resultadosConceptos"));
console.log(resultadosEjercicio);


////////////////////////////////////////////////////////////////////////////////
/////Datos necesarios para generar el listado dinamico de conceptos y alumnos/////
////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function() {
    var elems = document.querySelectorAll("select");
    var instances = M.FormSelect.init(elems);
});

const { app } = require("electron").remote;
const path = require("path");
const Database = require("better-sqlite3");
const dbFile = path.join(app.getAppPath(), "db.sqlite");
const db = new Database(dbFile);
const Swal = require("sweetalert2");
var idEstudiante; //voy a trabajar con el ID de cada estudiante
var nroConcepto; //voy a trabajar con el Nro del cuento

////////////////////////////////////////////////////////////////////////////////
//////////////////////////CONCEPTOS DESDE LA BASE DE DATOS//////////////////////
////////////////////////////////////////////////////////////////////////////////
//Inserto en la BD
//const stmt = db.prepare("INSERT INTO conceptos (concepto,categoria_semantica) VALUES (?,?)");
//const info = stmt.run("Perro","Animales");

let conceptosBD = db.prepare("SELECT * FROM conceptos").all(); //Me traigo todos los conceptos

//Defino los listados para crear los objetos
let listaConceptosBD=[];
for (let index = 0; index < conceptosBD.length; index++) {
 var ConceptoActual= new Object();  //voy a crear un objeto para cada concepto

 //defino las variables
 let id_concepto=conceptosBD[index].idconcepto;
 let conceptoNombre=conceptosBD[index].concepto;
 let conceptoCategoria=conceptosBD[index].categoria_semantica;

 //Defino los array donde voy a almacenar las listas para cada iteracion
 let listaQueEsBD=[];
 let listaQueNoEsBD=[]; 
 let listaQuienEsBD=[];
 let listaQuienNoEsBD=[];
 let listaQueHaceBD=[];
 let listaQueNoHaceBD=[];
 let listaComoEsBD=[];
 let listaComoNoEsBD=[];
 

 //Defino cada QUERY para cada TABLA DEL EJERCICIO DEL CONCEPTO EN PARTICULAR
 let que_esBD=db.prepare("SELECT * FROM que_es Where id_concepto ="+id_concepto).all();
 let que_no_esBD=db.prepare("SELECT * FROM que_no_es Where id_concepto ="+id_concepto).all();
 let quien_esBD=db.prepare("SELECT * FROM quien_es where id_concepto="+id_concepto).all();
 let quien_no_esBD=db.prepare("SELECT * FROM quien_no_es where id_concepto="+id_concepto).all();
 let que_haceBD=db.prepare("SELECT * FROM que_hace where id_concepto="+id_concepto).all();
 let que_no_haceBD=db.prepare("SELECT * FROM que_no_hace where id_concepto="+id_concepto).all();
 let como_esBD=db.prepare("SELECT * FROM como_es where id_concepto="+id_concepto).all();
 let como_no_esBD=db.prepare("SELECT * FROM como_no_es where id_concepto="+id_concepto).all();

    //Obtengo todos los QUE ES
    for (let index=0; index < que_esBD.length; index++) {
     listaQueEsBD.push(que_esBD[index].que_es);
    }
    //Obtengo todos los QUE NO ES
    for (let index=0; index < que_no_esBD.length; index++) {
      listaQueNoEsBD.push(que_no_esBD[index].que_no_es);
    }
    //Obtengo todos los QUIEN ES
    for (let index=0; index < quien_esBD.length; index++) {
     listaQuienEsBD.push(quien_esBD[index].quien_es);
    }
    //Obtengo todos los QUIEN NO ES
    for (let index=0; index < quien_no_esBD.length; index++) {
     listaQuienNoEsBD.push(quien_no_esBD[index].quien_no_es);
    }
    //Obtengo todos los QUE HACE
    for (let index=0; index < que_haceBD.length; index++) {
     listaQueHaceBD.push(que_haceBD[index].que_hace);
    }
    //Obtengo todos los QUE NO HACE
    for (let index=0; index < que_no_haceBD.length; index++){
     listaQueNoHaceBD.push(que_no_haceBD[index].que_no_hace);
    }
    //Obtengo todos los COMO ES
    for (let index=0; index< como_esBD.length; index++) {
     listaComoEsBD.push(como_esBD[index].como_es);
    }
    //Obtengo todos los COMO NO ES
    for (let index=0; index < como_no_esBD.length; index++) {
     listaComoNoEsBD.push(como_no_esBD[index].como_no_es);
    }


 //Creo los cada atributo del OBJETO
 ConceptoActual.nroConcepto=id_concepto;
 ConceptoActual.concepto=conceptoNombre;
 ConceptoActual.categoria_semantica=conceptoCategoria;
 ConceptoActual.que_es=listaQueEsBD;
 ConceptoActual.que_no_es=listaQueNoEsBD;
 ConceptoActual.quien_es=listaQuienEsBD;
 ConceptoActual.quien_no_es=listaQuienNoEsBD;
 ConceptoActual.que_hace=listaQueHaceBD;
 ConceptoActual.que_no_hace=listaQueNoHaceBD;
 ConceptoActual.como_es=listaComoEsBD;
 ConceptoActual.como_no_es=listaComoNoEsBD;

 //Agrego el objeto a mi ARRAY DE OBJETOS
 listaConceptosBD.push(ConceptoActual); 
}
console.log(listaConceptosBD)

////////////////////////////////////////////////////////////////////////////////
//////////////OBTENGO LOS CONCEPTOS Y ALUMNOS DE LA BASE DE DATOS///////////////
////////////////////////////////////////////////////////////////////////////////

//Funcion que me retorna todas las categorias semanticas
function obtenerCategoriasSemanticas(listadoconceptos) {
 let categoriasSemanticas = []; //array donde voy a almacenar las categorias semanticas
 //Recorro todos los conceptos y me quedo con las categorias semanticas
    for (let index = 0; index < listaConceptos.length; index++) { 
     categoriasSemanticas.push(listaConceptos[index].categoria_semantica);
    }
 categoriasSemanticas = [...new Set(categoriasSemanticas)]; //elimino los elementos repetidos
 return categoriasSemanticas;
}

////Obtengo los alumnos de la Base de datos
let listaAlumnos = []; //Array donde tengo el listado de mis alumnos
let alumnosDB = db.prepare("SELECT * FROM estudiantes").all();
alumnosDB.forEach((alumno) => {
  listaAlumnos.push(alumno);
}); 

//Me traigo los conceptos del JSON
//let listaConceptos = json_conceptos.conceptos; 
//const json_conceptos = require('../jsonConceptos.json');
//let categoriasSemanticas = obtenerCategoriasSemanticas(listaConceptos); //Obtengo las categorias semanticas de los conceptos

//Me Traigo los conceptos de la base datos
let listaConceptos=listaConceptosBD; 
let categoriasSemanticas = obtenerCategoriasSemanticas(listaConceptos); //Obtengo las categorias semanticas de los conceptos


/////////////////////////////////////////////////////////////////////////////////
////EL SIGUIENTE WHILE SE ENCARGA DE MOSTRAR EL LISTADO DINAMICO DE CONCEPTOS////
/////////////////////////////////////////////////////////////////////////////////

let div_conceptos  = document.getElementById("listadoconceptos"); //Creo un DIV para el listado
let div_categorias = document.getElementById("listadoconceptos"); //Creo un DIV para el listado
listarCategoriasSemanticas(categoriasSemanticas); //Inicio listado las categorias Semanticas

//Se realizar la seleccion de la categoria
function seleccionarCategoria(categoria) {
 limpiarListaCategorias(); //limpio el listado de categorias
 obtenerConcepto(categoria); //obtengo los conceptos de la categoria semantica pedida 
}

//Selecciono un concepto para activarlo
function SeleccionarConcepto(elementoConcepto) {
 blankAllConceptos(); //seteo los demas conceptos
 nroConcepto = elementoConcepto.getAttribute("nroConcepto"); //me quedo con el ID del concepto
 elementoConcepto.setAttribute("class","collection-item teal lighten-2 white-text text-darken-2"); //lo dejo seleccionado
 
}

//Funcion para recargar el Listado dinamico de los conceptos
function restaurarListaConceptos() {
    while (div_conceptos.firstChild) {
     div_conceptos.removeChild(div_conceptos.firstChild);
    }
    listarCategoriasSemanticas(categoriasSemanticas);
}

//Funcion que limpia las categorias para dar lugar a la lista de los conceptos
function limpiarListaCategorias() {   
    while (div_categorias.firstChild) {
     div_categorias.removeChild(div_categorias.firstChild);
    }    
}

//Seteo los demas conceptos como no seleccionados
function blankAllConceptos() {  
 let conceptos = document.getElementById("listadoconceptos").getElementsByTagName("A");
 let index=0;
    while (index<conceptos.length) {
     conceptos[index].setAttribute("class","collection-item");
     index++;
    }  
}

let searchBarConceptos = document.getElementById("buscarConcepto").addEventListener("keyup", searchConcepto);

//Busco un concepto que cumpla con la busqueda que se ingresa por teclado
function searchConcepto() {
    limpiarListaCategorias(); //limpio todas las categorias
    listarConceptos(); //me traigo y genero el listado con todos los conceptos para despues buscar en el
    var input, i, filter, li, ul, txtValue;
    input = document.getElementById("buscarConcepto");
    filter = input.value.toUpperCase();
    //collection-item getElementsByClassName('prueba') ;
    let array_aux = document.getElementById("listadoconceptos").getElementsByTagName("A");
    //console.log(array_aux);
    for (i = 0; i < array_aux.length; i++) {
        a = array_aux[i].getAttribute("concepto");        
        txtValue = a;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            array_aux[i].parentElement.style.display = "";
        } else {
            array_aux[i].parentElement.style.display = "none";
        }
    }
}

//Funcion que me lista todas las categorias semanticas para seleccionar
function listarCategoriasSemanticas(categoriasSemanticas){
 var contadorCategorias=0; //contador 
    while (contadorCategorias<categoriasSemanticas.length) {
     let categoria = categoriasSemanticas[contadorCategorias];   
     let nroCategoria="categoria"+contadorCategorias;  
     let li=document.createElement("li");
     let a=document.createElement("a");
     a.setAttribute("class","collection-item active");
     a.setAttribute("nroCategoria",contadorCategorias);
     a.setAttribute("id",nroCategoria);
     a.setAttribute("categoria",categoria);
     a.addEventListener("click",function(){seleccionarCategoria(categoria)},false); //llamo a la funcion al clickear
     a.href="#!";
     let a_content = document.createTextNode(categoria);
     a.appendChild(a_content);
     li.appendChild(a);     
     div_categorias.appendChild(li);
     contadorCategorias++;
    }    
}



//Funcion que me retorna todos los elementos de una categoria semantica seleccionada previamente
function obtenerConcepto (unaCategoriaSemantica) {
 var contadorconceptos=0; //contador
    while (contadorconceptos<listaConceptos.length) {
     let concepto = listaConceptos[contadorconceptos].concepto;
     let categoriaSemantica=listaConceptos[contadorconceptos].categoria_semantica;
       if(categoriaSemantica == unaCategoriaSemantica) {
         let li=document.createElement("li");
         let a=document.createElement("a");
         a.setAttribute("class","collection-item");
         a.setAttribute("nroConcepto",contadorconceptos);
         a.setAttribute("id","concepto"+contadorconceptos);
         a.setAttribute("concepto",concepto);
         a.href="#!";
         a.addEventListener("click",function(){SeleccionarConcepto(a)},false); //llamo a la funcion al clickear
         let a_content = document.createTextNode(concepto);
         a.appendChild(a_content);
         li.appendChild(a);
         div_conceptos.appendChild(li);
        }  
     contadorconceptos++;
    }
}

//Genero el listado de todos los conceptos
function listarConceptos() {
 var contadorconceptos=0; //contador
    while (contadorconceptos<listaConceptos.length) {
     let concepto = listaConceptos[contadorconceptos].concepto;
     let categoriaSemantica=listaConceptos[contadorconceptos].categoria_semantica;       
     let li=document.createElement("li");
     let a=document.createElement("a");
     a.setAttribute("class","collection-item");
     a.setAttribute("nroConcepto",contadorconceptos);
     a.setAttribute("id","concepto"+contadorconceptos);
     a.setAttribute("concepto",concepto);
     a.href="#!";
     a.addEventListener("click",function(){SeleccionarConcepto(a)},false); //llamo a la funcion al clickear
     let a_content = document.createTextNode(concepto);
     a.appendChild(a_content);
     li.appendChild(a);
     div_conceptos.appendChild(li);
     contadorconceptos++;
    }
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

var contadoralumno=0; //contador
while (contadoralumno<=listaAlumnos.length) {
 //console.log(listaAlumnos[contadoralumno].nombre + " " + listaAlumnos[contadoralumno].apellido);
 let nombreApellido = listaAlumnos[contadoralumno].nombre + " " + listaAlumnos[contadoralumno].apellido;
 let idDB = listaAlumnos[contadoralumno].id;
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
 img.setAttribute("nombre", listaAlumnos[contadoralumno].nombre);
 img.setAttribute("apellido", listaAlumnos[contadoralumno].apellido);
 img.setAttribute("edad", listaAlumnos[contadoralumno].edad);
 img.setAttribute("descripcion", listaAlumnos[contadoralumno].descripcion);
 img.setAttribute("idDB", listaAlumnos[contadoralumno].id);
 listItem.innerHTML += img.outerHTML;
 listItem.innerHTML += pal.outerHTML; 
 div_estudiantes.appendChild(listItem);
 contadoralumno++;
}

////////////////////////////////////////////////////////////////////////////////
////////Funciones necesarias para el control de todas las configuraciones///////
////////////////////////////////////////////////////////////////////////////////

//Funcion que la utilizo para eliminar un elemento de un array
function removeItemFromArr( arr, item ) {
    return arr.filter( function( e ) {
     return e !== item;
    } );
};


function iniciarEjercicio() {
 let alumno_definido=listaAlumnos[parseInt(idEstudiante)-parseInt(1)];
 let concepto_definido=listaConceptos[nroConcepto];
 let nroconcepto_definido=parseInt(nroConcepto)+parseInt(1);
 //console.log(alumno_definido);
 //console.log(concepto_definido);

    if ((alumno_definido== null) || (concepto_definido == null)) {
     //alert("Debe seleccionar un estudiante y un concepto");
     //const Swal = require("sweetalert2");
        Swal.fire({
         //imageUrl: "../public/images/otravez.png",
         width: 400,
         imageWidth: 200,
         imageHeight: 300,
         background: "#e4f2f0",
         title: "Debe seleccionar un estudiante y un concepto",
         showConfirmButton: false,
         timer: 1000
        });
    }
    else {      
      let dificultad_ejercicio=document.getElementById("dificultad").value; //obtengo la dificultad del ejercicio
      let tipoimagen_ejercicio=document.getElementById("tipoimagen").value; //obtengo el tipo de imagen del ejercicio      
      
     localStorage.setItem("configConceptos",JSON.stringify({            
            concepto:concepto_definido,
            alumno:alumno_definido,
            dificultad:dificultad_ejercicio,            
            tipoimagen:tipoimagen_ejercicio
        }));
     location.href = "conceptos.html";  
    }
 
}
