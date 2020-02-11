////////////////////////////////////////////////////////////////////////////////
///////////DATOS PARA LOS DATOS DE LOS CUENTOS EN EL EJERCICIO//////////////////
////////////////////////////////////////////////////////////////////////////////

///Parametros de configuración del ejercicio que pase por el json
const datosejercicio=JSON.parse(localStorage.getItem("configDactilologico"));
const alumno=datosejercicio.alumno;
const dificultad=datosejercicio.dificultad;
const ejercitacion=datosejercicio.ejercicio;
let repeticiones=datosejercicio.repeticiones;  if(repeticiones=="default") {repeticiones=5}
const linkImagen="../public/images/dactilológico/";
const Swal = require("sweetalert2");
console.log(datosejercicio)


//////////////////////////////////////////////////////////////////////////////////////
//////////////Funciones asociadas a los botones de progreso //////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

//Defino de forma anticipada la cantidad de repeticiones
document.getElementById("repe").innerHTML="0"; //seteo en las repeticiones
document.getElementById("total").innerHTML=repeticiones; //seteo las repeticiones

//Defino la cantidad de botones que voy a crear , cantidad = cantidad repeticiones
var i=0;
while (i < ejercitacion.length) {
 var button = document.createElement("button");	
 button.className="siguiente";
 //clases anterior ; actual ; siguiente
 button.setAttribute("id","boton"+i);
 var pagination = document.getElementById("pagination");
 pagination.appendChild(button);
 i++; //incremento el contador
}

//Funcion para avanzar o retroceder en las repeticiones 
function recalcularBotones(pasoActual,etapa) { 
 

    if (etapa=="volver") {
     let paso=pasoActual + 1;    	 
     let indiceBoton="boton"+paso;
     let botonActual= document.getElementById(indiceBoton).className="siguiente";       
    }

    if (etapa=="avanzar") {
        for (let index = 0; index <= pasoActual; index++) { 
         let indiceBoton="boton"+index;
         let botonActual= document.getElementById(indiceBoton).className="correcta";
        }     
    }


}


//////////////////////////////////////////////////////////////////////////////////////
//////////////Funciones que le dan la funcionalidad al ejercicio//////////////////////
//////////////////////////////////////////////////////////////////////////////////////

let pasoActual=0;
generarImagenes(ejercitacion,pasoActual);


//Funcion que se encarga de generar las imagenes correspondientes a la Fase del ¿Que es?
function generarImagenes (ejercitacion,pasoActual) { 
 let listadoDistractores=[]; //defino los distractores que voy a usar 
 let divContenedor=document.getElementById("contenedorejercicio"); //me paro en el div del contenedor   
 let elementoActual=ejercitacion[pasoActual]; //tomo el elemento actual a partir del numero aleatorio

 //Escribo el mensaje superior que sirve como guia del ejercicio 
 document.getElementById("ejercitacion_paso_inferior").innerHTML=elementoActual;

 //Creo la imagen    
 var imagenCorrecta= document.createElement("img"); //Imagen 1 es la opcion correcta  
 imagenCorrecta.setAttribute("width","300px");
 imagenCorrecta.setAttribute("height","300px");
 imagenCorrecta.src=linkImagen+elementoActual+".jpg";
 divContenedor.appendChild(imagenCorrecta);


 let divContenedor2=document.getElementById("contenedorejercicio2"); //me paro en el div del contenedor   

 //creo el boton de siguiente
 var botonSiguiente=document.createElement("a");
 botonSiguiente.className="waves-effect waves-light btn-large";
 botonSiguiente.addEventListener("click",function(){avanzarEtapa()},false); //llamo a la funcion al clickear
 var botonSiguienteContent=document.createTextNode("Siguiente");
 botonSiguiente.appendChild(botonSiguienteContent);  

 //creo el boton de anterior
 var botonAnterior=document.createElement("a");
 botonAnterior.className="waves-effect waves-light btn-large";
 botonAnterior.addEventListener("click",function(){retrocederEtapa()},false); //llamo a la funcion al clickear
 var botonAnteriorContent=document.createTextNode("Anterior");
 botonAnterior.appendChild(botonAnteriorContent); 

 //separador
 var botonFalso=document.createElement("button");
 botonFalso.className="botonFalso";
 divContenedor2.appendChild(botonAnterior);
 divContenedor2.appendChild(botonFalso);
 divContenedor2.appendChild(botonSiguiente); 
}
 
//Funcion que retorna a la etapa anterior 
function retrocederEtapa(){
    if (pasoActual==0) {
 	 alertaEjercicio();
    }
    else {
     document.getElementById("contenedorejercicio").innerHTML=" ";
     document.getElementById("contenedorejercicio2").innerHTML=" ";
     //tengo que eliminar el contenido de este div contenedorejercicio
     --pasoActual;     
     recalcularBotones(pasoActual,"volver");
     generarImagenes(ejercitacion,pasoActual); 
    }

}


//Funcion que la utilizo para avanzar un nuevo paso
function avanzarEtapa(){ 	
    if (pasoActual==(ejercitacion.length-parseInt(1))) {
     recalcularBotones('correcta');
     finalEjercicio();
    }
    else {
     document.getElementById("contenedorejercicio").innerHTML=" ";
     document.getElementById("contenedorejercicio2").innerHTML=" ";
     //tengo que eliminar el contenido de este div contenedorejercicio
     pasoActual++;
     recalcularBotones(pasoActual,"avanzar");
     generarImagenes(ejercitacion,pasoActual); //si no es el final vuelvo a generar otra opcion
    }
} 

//Funcion que activa la animacion cuando hay un acierto en el ejercicio
function alertaEjercicio(){ 
 Swal.fire({
     imageUrl: "../public/images/Felicitaciones.png",
     width: 500,
     imageWidth: 200,
     imageHeight: 300,
     background: "#e4f2f0",
     title: "No se puede volver , es el inicio",
     showConfirmButton: false,
     timer: 1000
    });
}


function finalEjercicio() {
 setTimeout(function(){ location.href ="configuracionDactilologico.html";  }, 1500);
}