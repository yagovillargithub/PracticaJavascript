//Definir vocales
const vocales=/[aeiou]/;
//matriz que guarda las letras
let matriz =[
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0]
];
//cadena del abecedario
let letras = 'abcdefghijklmnñopqrstuvwxyz';
// array que tiene las palabras
let palabras = ['si','no','te','da'];
// Contador de la puntuación
let puntuacion=0;
//Contador del nivel de las letras
let nivel=2;
// Contabilizo el número de clicks que son eventos
let clicks=1; //en el primer click no incrementa, se inicializa a 1
// Guardo las letras para comprobar
let posicion = [];
// Las letras para guardar
let cadena="";

function getPosicion(min,max){ //devuelve posición aleatoria
    return Math.floor(Math.random()*(max-min)+min)
}
function rellenarMatriz(letras,matriz){
    for(let i=0;i<matriz.length;i++){ //bucle para recorrer la matriz
      for(let j=0;j<matriz[i].length;j++){
        matriz[i][j]=letras[getPosicion(0,letras.length-1)];
      }  
    }
    //let letras = letras[getPosicion(0,letras.length-1)];
}
function mostrarMatrizConsole(matriz){
    let fila="";
    for(let i=0;i<matriz.length;i++){ //bucle para recorrer la matriz
      for(let j=0;j<matriz[i].length;j++){
        fila+=matriz[i][j]+"\t";
      }  
      console.log(fila);
      fila="";
    }
}
function esVocal(vocales,letra){
    return(vocales.test(letra)); //comprueba si la letra es vocal
}
function esPalabra(palabra,palabras){
    let esPalabra=false;
    let i=0;
    while(!esPalabra && i<palabras.length){
        if(palabras[i]==palabra){
            esPalabra=true;
        }else{
            i++;
        }
    }
    return esPalabra;
}
function puntuacionPalabra(palabra,vocales,puntuacion){
    for(let i=0;i<palabra.length;i++){
        console.log(palabra[i]);
        if(esVocal(vocales,palabra[i])){
            //Si es vocal suma 1
            puntuacion++;
        }else{
            //Si no es vocal suma 2
            puntuacion+=2;
        }
    }
    return puntuacion;
}

function incrementarMarcadores(puntuacion, palabra, vocales){

    document.getElementById('puntuacion').textContent=puntuacion+puntuacionPalabra(palabra,vocales,puntuacion); 
    document.getElementById('letras').textContent=nivel+1;
}
function mostrarCasilla(event){
    console.log(boton);
}
function principal(){
    /*const boton00 = document.getElementById("00");
    const boton01 = document.getElementById("01");
    const boton02 = document.getElementById("02");
    const boton03 = document.getElementById("03");
    const boton04 = document.getElementById("04");
    const boton10 = document.getElementById("10");
    const boton11 = document.getElementById("11");
    const boton12 = document.getElementById("12");
    const boton13 = document.getElementById("13");
    const boton14 = document.getElementById("14");
    const boton20 = document.getElementById("20");
    const boton21 = document.getElementById("21");
    const boton22 = document.getElementById("22");
    const boton23 = document.getElementById("23");
    const boton24 = document.getElementById("24");
    const boton30 = document.getElementById("30");
    const boton31 = document.getElementById("31");
    const boton32 = document.getElementById("32");
    const boton33 = document.getElementById("33");
    const boton34 = document.getElementById("34");
    const boton40 = document.getElementById("40");
    const boton41 = document.getElementById("41");
    const boton42 = document.getElementById("42");
    const boton43 = document.getElementById("43");
    const boton44 = document.getElementById("44");*/
    
    /*Devuelve un array*/
    const botones = document.querySelectorAll("button"); //selecciona todo los botones

    rellenarMatriz(letras,matriz);
    mostrarMatrizConsole(matriz);
    console.log(puntuacionPalabra('si',vocales,puntuacion));
    incrementarMarcadores(puntuacion, 'hola', vocales);
    console.log(esPalabra('si',palabras));
    console.log(esPalabra('ghb',palabras));

    /*Capturo el evento y llamo a la función*/
    botones.forEach(boton => {boton.addEventListener("click",()=>{
        /*console.log(boton.id);
        console.log(boton.id[0]);
        console.log(boton.id[1]);
        console.log(matriz[boton.id[0]][boton.id[1]]);*/
        console.log(clicks);
        // Los datos para comprobar palabra
        cadena=cadena+matriz[boton.id[0]][boton.id[1]];
        console.log(cadena);
        posicion.push(boton.id);
        if(clicks==nivel){
            //He llegado al momento de la comprobación
            if(esPalabra(cadena, palabras)){
                //Se hace cuando la palabra sea cierta
                // Hacemos lo siguiente para todos los elementos
                let casilla = "c"+boton.id;
                document.getElementById(casilla).innerHTML=matriz[boton.id[0]][boton.id[1]];
            }
            
            clicks=1;
            cadena="";
        }else{
            clicks++;
            
            //Aquí hay que guardar dos elementos: cadena y posición de la matriz
            
        }

        
    })}) //(indice que recorre cada uno de los elementos =>{boton.addEventListener("click", mostrarCasilla))} -- opción1) =>boton.addEventListener("click",()=>{console.log(boton.id)}) --opción2  (parámetro)=>{cuerpo función} fución flecha 
    
    
    //boton.addEventListener("click",mostrarCasilla); //se puede poner también ("click",mostrarCasilla,false)
}

window.addEventListener("DOMContentLoaded",principal); //window: evento que carga la pestaña. cuando carga la pestaña escucha(tipo de evento, funcion) DOM: es un arbol que carga el contenido

//event guarda todos los datos del objetoque ha desencadenado el evento
//querySelector() 

//console.log(letras[getPosicion(0,letras.length-1)]); //imprime letras del 0 a la longitud de la cadena

/*function esPalabra(palabra,palabras,puntuacion){
    for(let i=0;i<palabra.length;i++){
        palabra+=console.log(palabra[i]);
        for(let j=0;j<palabras.length;j++){
           if(palabra==palabras[i]){
            // si existe suma puntuación
            puntuacionPalabra(palabra,vocales,puntuacion);
            }else{
            mostrarMatrizConsole(matriz);
            } 
        }    
    }
}*/