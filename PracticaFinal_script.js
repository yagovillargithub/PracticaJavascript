
//Definir vocales
let vocales = /[aeiouáéíóúü]/;

//Cadena del abecedario
let letras = 'abcdefghijklmnñopqrstuvwxyz';

// Array que tiene las palabras.
let palabras = [
    // 2 letras
    'si','no','te','da','mi','tu','el','la','lo','un','en','es','ya','se',
    // 3 letras
    'sol','mar','luz','pan','dia','voy','dos','sal','ver','con','por','los','las','que','uno',
    // 4 letras
    'casa','mesa','gato','vida','rosa','luna','cara','pelo','azul','agua','niño','amor','vino',
    // 5 letras
    'madre','padre','libro','perro','tigre','fuego','noche','verde','playa','flores'
];

// Probabilidad de que aparezca el botón BONUS después de cada click.
const PROBABILIDAD_BONUS = 0.5;

//Matriz que guarda las letras
let matriz = [
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0],
                [0,0,0,0,0]
];

//Contador del nivel de las letras
let nivel = 2;

// Contador de los intentos
let intentos = nivel * 3;

// Contador de la puntuación
let puntuacion = 0;

// Las letras para guardar
let cadena = "";

// Guardo las letras para comprobar
let posicion = [];

// Casillas de la palabra ya formada
let casillasBloqueadas = new Set();

//Devuelve posición aleatoria
function getPosicion(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// Comprueba si la letra es vocal
function esVocal(vocales, letra) {
    return vocales.test(letra);
}

// Comprueba si la palabra está en palabras
function esPalabra(palabra) {
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

// Puntuación de una palabra
function puntuacionPalabra(palabra){
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


// Rellena la matriz con letras aleatorias del alfabeto.
// Se llama al inicio y al reiniciar.
function rellenarMatriz(letras,matriz){ 
    for(let i=0;i<matriz.length;i++){ //bucle para recorrer la matriz
      for(let j=0;j<matriz[i].length;j++){
        matriz[i][j]=letras[getPosicion(0,letras.length-1)];
      }  
    }
}

// BONUS, cambia las letras de todas las casillas que NO estén bloqueadas
function refrescarLetrasNoBloqueadas() {
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            const id = `${i}${j}`;
            if (!casillasBloqueadas.has(id)) {
                matriz[i][j] = letras[getPosicion(0, letras.length - 1)];
                ocultarCasilla(id);
            }
        }
    }
}


// Muestra la letra que está en la casilla
function mostrarCasilla(id) {
    const fila = Number(id[0]);
    const col = Number(id[1]);
    document.getElementById(id).textContent = matriz[fila][col];
}

// Oculta la letra de la casilla
function ocultarCasilla(id) {
    document.getElementById(id).textContent = "";
}

// Las letras que han formado palabra no se ocultan
function bloquearCasilla(id) {
    document.getElementById(id).classList.add("bloqueada");
    casillasBloqueadas.add(id);
}

// Comprueba si esa palabra existe, si no es así oculta esas casillas
function ocultarTodoExceptoBloqueadas() {
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            const id = `${i}${j}`;
            if (!casillasBloqueadas.has(id)) {
                ocultarCasilla(id);
            }
        }
    }
}

// Incrementa los marcadores
function incrementarMarcadores() {
    document.getElementById("letras").textContent = nivel;
    document.getElementById("intentos").textContent = intentos;
    document.getElementById("puntuacion").textContent = puntuacion;
}

// Muestra y oculta el botón BONUS 
function mostrarBonus(visible) {
    document.getElementById("btn-bonus").style.visibility = visible ? "visible" : "hidden";
}


// Muestra el botón BONUS cada cierto tiempo
function probabilidadBonus() {
    const muestra = Math.random() < PROBABILIDAD_BONUS;
    mostrarBonus(muestra);
}

// Limpia la cadena si no ha formado palabra válida
function limpiarIntento() {
    cadena = "";
    posicion = [];
}

// Sube al siguiente nivel
function subirNivel() {
    nivel++;
    intentos = nivel * 3;
}

// Click sobre una casilla del tablero.
function clickCasilla(event) {
    const boton = event.currentTarget;
    const id = boton.id;

    // Si ya no quedan intentos se termina el juego
    if (intentos <= 0) return;

    // Las casillas que han formado palabra no se pueden volver a usar
    if (casillasBloqueadas.has(id)) return;

    // Mostrar casilla y guardar las letras para comprobar si forman una palabra válida
    mostrarCasilla(id);
    const fila = Number(id[0]);
    const col = Number(id[1]);
    cadena += matriz[fila][col];
    posicion.push(id);
    intentos--;  // Intentos - 1 
    incrementarMarcadores();

    //console.log(`click ${id} -> letra='${matriz[fila][col]}' | cadena='${cadena}' | intentos=${intentos}`);
     //console.log(matriz[fila][col]);
    console.log(cadena);

    //Si nuúmero de letres ==nivel 
    if (posicion.length === nivel) {
        //Comprueba si la palabra está en palabras
        if (esPalabra(cadena)) {

            console.log('Puntuación: ' + puntuacionPalabra(cadena));
            for (const idCasilla of posicion) {
                bloquearCasilla(idCasilla); //Si la palabra existe bloquea las casillas
            }
            subirNivel();
            limpiarIntento();
            incrementarMarcadores();
        } else { //Si no existe
            const cadenaFallida = cadena;
            limpiarIntento();
            incrementarMarcadores();
            setTimeout(() => {
                ocultarTodoExceptoBloqueadas();
                //console.log(`Ocultado '${cadenaFallida}'.`);
            }, 700);
        }
    }

    //Mostrar bonus
    probabilidadBonus();

    //Si no hay más intentos termina el juego
    if (intentos <= 0) {
        //console.log(`GAME OVER. Puntuación final: ${puntuacion}`);
        // Pequeño delay para que el navegador pinte el último cambio antes del alert.
       setTimeout(() => alert(`¡Fin del juego! Puntuación final: ${puntuacion}`), 50);
    }
}

// Pulsar BONUS
function clickBonus() {
    console.log("BONUS");
    refrescarLetrasNoBloqueadas();
    limpiarIntento();
    mostrarBonus(false);
    mostrarMatrizConsole(matriz);
}

// Pulsar Reiniciar
function clickReiniciar() {
    console.log("REINICIANDO");
    // Reinicia también las casillas bloqueadas
    for (const id of casillasBloqueadas) {
        document.getElementById(id).classList.remove("bloqueada");
    }
    casillasBloqueadas.clear();
    limpiarIntento();

    nivel = 2;
    intentos = nivel * 3;
    puntuacion = 0;

    rellenarMatriz(letras,matriz);
    mostrarMatrizConsole(matriz);

    // Vacia todas las casillas
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            ocultarCasilla(`${i}${j}`);
        }
    }

    mostrarBonus(false);
    incrementarMarcadores();
}


// Muestra la matriz por consola
function mostrarMatrizConsole(matriz) {
    let fila="";
    for(let i=0;i<matriz.length;i++){ //bucle para recorrer la matriz
      for(let j=0;j<matriz[i].length;j++){
        fila+=matriz[i][j]+"\t";
      }  
      console.log(fila);
      fila="";
    }
}

function principal() {
    // Estado inicial: matriz rellena y marcadores
    rellenarMatriz(letras,matriz);
    mostrarMatrizConsole(matriz);
    incrementarMarcadores();
    mostrarBonus(false);

    // Listener a cada botón de la matriz
    document.querySelectorAll("#tablero button").forEach(b => {
        b.addEventListener("click", clickCasilla);
    });

    //Listener a los botones de bonus y reiniciar
    document.getElementById("btn-bonus").addEventListener("click", clickBonus);
    document.getElementById("btn-reiniciar").addEventListener("click", clickReiniciar);
}
//Window: evento que carga la pestaña. Cuando carga la pestaña escucha(tipo de evento, funcion) DOM: es un arbol que carga el contenido
window.addEventListener("DOMContentLoaded", principal); 