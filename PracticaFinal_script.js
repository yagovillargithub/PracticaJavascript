// =========================================================================
//  PRÁCTICA FINAL - JUEGO DE FORMAR PALABRAS EN UNA MATRIZ 5x5
//  Implementación basada en el diagrama de flujo proporcionado.
// =========================================================================

// ----------------------------- CONSTANTES --------------------------------

// Expresión regular para identificar vocales (incluye tildes y diéresis).
const VOCALES = /[aeiouáéíóúü]/;

// Alfabeto del que se sacan las letras aleatorias del tablero.
const ALFABETO = 'abcdefghijklmnñopqrstuvwxyz';

// Diccionario de palabras válidas. Si el nivel sube por encima de la
// longitud máxima de esta lista, conviene ampliar el array.
const PALABRAS = [
    // 2 letras
    'si','no','te','da','mi','tu','el','la','lo','un','en','es','ya','se',
    // 3 letras
    'sol','mar','luz','pan','dia','voy','dos','sal','ver','con','por','los','las','que','uno',
    // 4 letras
    'casa','mesa','gato','vida','rosa','luna','cara','pelo','azul','agua','niño','amor','vino',
    // 5 letras
    'madre','padre','libro','perro','tigre','fuego','noche','verde','playa','flores'
];

// Probabilidad (0..1) de que aparezca el botón BONUS después de cada click.
const PROBABILIDAD_BONUS = 0.5;

// Tamaño del tablero (lado del cuadrado).
const TAMANO = 5;


// --------------------------- ESTADO DEL JUEGO ----------------------------

// Matriz 5x5 con la letra "secreta" de cada casilla (lo que muestra al revelar).
let matriz = [];

// Nivel actual = nº de letras que hay que formar para completar palabra.
let nivel = 2;

// Intentos restantes. Cada click sobre una casilla nueva consume uno.
let intentos = nivel * 3;

// Puntuación acumulada en la partida.
let puntuacion = 0;

// Letras pulsadas en el intento actual, en orden (concatenadas).
let cadena = "";

// IDs (formato "FC") de los botones pulsados en el intento actual.
// Sirve para: (a) ignorar re-clicks en la misma casilla, (b) saber cuándo
// hemos completado un intento (length == nivel) y (c) saber qué casillas
// bloquear si se forma palabra.
let posicionesIntento = [];

// Conjunto de ids "FC" que ya han formado palabra y, por tanto, quedan
// fijadas en pantalla y no se reciclan con BONUS ni se borran con un fallo.
let casillasBloqueadas = new Set();


// ---------------------------- HELPERS PUROS ------------------------------

// Devuelve un entero aleatorio en el intervalo [min, max).
// (Versión original del proyecto; la 'z' nunca llega a salir.)
function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

// ¿Es vocal la letra recibida?
function esVocal(letra) {
    return VOCALES.test(letra);
}

// ¿La cadena coincide con alguna palabra del diccionario?
function esPalabra(palabra) {
    return PALABRAS.includes(palabra);
}

// Puntuación que da una palabra: cada vocal suma 1, cada consonante 2.
function puntuacionPalabra(palabra) {
    let total = 0;
    for (const letra of palabra) {
        total += esVocal(letra) ? 1 : 2;
    }
    return total;
}


// ------------------------- LÓGICA DEL TABLERO ----------------------------

// Rellena la matriz completa con letras aleatorias del alfabeto.
// Se llama al inicio y al reiniciar.
function rellenarMatriz() {
    for (let f = 0; f < TAMANO; f++) {
        matriz[f] = [];
        for (let c = 0; c < TAMANO; c++) {
            matriz[f][c] = ALFABETO[aleatorio(0, ALFABETO.length - 1)];
        }
    }
}

// Acción del BONUS: cambia las letras de TODAS las casillas que NO estén
// bloqueadas (las que ya forman palabra se mantienen intactas).
// También oculta visualmente esas casillas porque sus letras ya no son las
// que estaban a la vista.
function refrescarLetrasNoBloqueadas() {
    for (let f = 0; f < TAMANO; f++) {
        for (let c = 0; c < TAMANO; c++) {
            const id = `${f}${c}`;
            if (!casillasBloqueadas.has(id)) {
                matriz[f][c] = ALFABETO[aleatorio(0, ALFABETO.length - 1)];
                ocultarCasilla(id);
            }
        }
    }
}


// --------------------- MANIPULACIÓN DEL DOM ------------------------------

// Muestra dentro del propio <button> la letra que esa casilla tiene en la
// matriz. Usamos textContent (NO innerHTML del <td>) para no destruir el
// botón y mantenerlo clicable y con su event listener intacto.
function revelarCasilla(id) {
    const fila = Number(id[0]);
    const col = Number(id[1]);
    document.getElementById(id).textContent = matriz[fila][col];
}

// Borra el texto visible del botón (la letra sigue guardada en la matriz).
function ocultarCasilla(id) {
    document.getElementById(id).textContent = "";
}

// Marca una casilla como "ha formado palabra": clase CSS + registro en el set.
// A partir de aquí el handler de click la ignorará.
function bloquearCasilla(id) {
    document.getElementById(id).classList.add("bloqueada");
    casillasBloqueadas.add(id);
}

// Tras un intento fallido, vacía todas las casillas reveladas excepto las
// bloqueadas (lo que ya formó palabra se queda en pantalla).
function ocultarTodoExceptoBloqueadas() {
    for (let f = 0; f < TAMANO; f++) {
        for (let c = 0; c < TAMANO; c++) {
            const id = `${f}${c}`;
            if (!casillasBloqueadas.has(id)) {
                ocultarCasilla(id);
            }
        }
    }
}

// Refresca los tres marcadores (letras/nivel, intentos, puntuación).
function actualizarMarcadores() {
    document.getElementById("letras").textContent = nivel;
    document.getElementById("intentos").textContent = intentos;
    document.getElementById("puntuacion").textContent = puntuacion;
}

// Muestra/oculta el botón BONUS usando visibility para no romper layout.
function mostrarBonus(visible) {
    document.getElementById("btn-bonus").style.visibility = visible ? "visible" : "hidden";
}


// ---------------------- FLUJO DEL JUEGO ----------------------------------

// Tira el "dado" del bonus: con probabilidad PROBABILIDAD_BONUS hace
// aparecer el botón BONUS; en caso contrario lo mantiene oculto.
function tirarDadoBonus() {
    const sale = Math.random() < PROBABILIDAD_BONUS;
    mostrarBonus(sale);
}

// Limpia el estado del intento en curso (no toca lo bloqueado).
function limpiarIntento() {
    cadena = "";
    posicionesIntento = [];
}

// Sube al siguiente nivel: una letra más por palabra y recargamos intentos.
// IMPORTANTE: según el diagrama NO se limpia la pantalla aquí.
function subirNivel() {
    nivel++;
    intentos = nivel * 3;
}

// Handler principal: click sobre una casilla del tablero.
function clickCasilla(event) {
    const boton = event.currentTarget;
    const id = boton.id;

    // Guard: si ya no quedan intentos no se hace nada (game over).
    if (intentos <= 0) return;

    // Guard: una casilla bloqueada (ya formó palabra) no se vuelve a usar.
    if (casillasBloqueadas.has(id)) return;

    // ---- 1. REVELAR CASILLA E IR FORMANDO LA CADENA ----
    revelarCasilla(id);
    const fila = Number(id[0]);
    const col = Number(id[1]);
    cadena += matriz[fila][col];
    posicionesIntento.push(id);
    intentos--;                                  // Intentos - 1 (según diagrama)
    actualizarMarcadores();

    console.log(`click ${id} -> letra='${matriz[fila][col]}' | cadena='${cadena}' | intentos=${intentos}`);

    // ---- 2. ¿HEMOS COMPLETADO EL INTENTO (nº letras == nivel)? ----
    if (posicionesIntento.length === nivel) {

        if (esPalabra(cadena)) {
            // 2a. ACIERTO -> sumar puntuación, bloquear casillas, subir de nivel.
            //     La pantalla NO se limpia (las casillas acertadas se quedan).
            const sumaba = puntuacionPalabra(cadena);
            puntuacion += sumaba;
            console.log(`¡PALABRA! '${cadena}' (+${sumaba} puntos). Subiendo a nivel ${nivel + 1}.`);
            for (const idCasilla of posicionesIntento) {
                bloquearCasilla(idCasilla);
            }
            subirNivel();
            limpiarIntento();
            actualizarMarcadores();
        } else {
            // 2b. FALLO -> esperar un poco para que se vea la última letra y
            //     luego ocultar todo lo que no esté bloqueado.
            //     Sin el setTimeout, el navegador nunca llega a pintar la
            //     segunda letra (revelar + ocultar ocurren en el mismo frame).
            console.log(`Fallo: '${cadena}' no es palabra. Ocultando...`);
            const cadenaFallida = cadena;
            limpiarIntento();
            actualizarMarcadores();
            setTimeout(() => {
                ocultarTodoExceptoBloqueadas();
                console.log(`Ocultado '${cadenaFallida}'.`);
            }, 700);
        }
    }

    // ---- 3. DESPUÉS DE CADA CLICK: ¿MOSTRAR BONUS? (50%) ----
    tirarDadoBonus();

    // ---- 4. ¿GAME OVER? ----
    if (intentos <= 0) {
        console.log(`GAME OVER. Puntuación final: ${puntuacion}`);
        // Pequeño delay para que el navegador pinte el último cambio antes del alert.
        setTimeout(() => alert(`¡Fin del juego! Puntuación final: ${puntuacion}`), 50);
    }
}

// Handler del botón BONUS: re-randomiza las letras no bloqueadas y oculta
// el propio botón hasta que vuelva a salir el dado favorable.
// El intento en curso se descarta porque las letras ya no son las mismas.
function clickBonus() {
    console.log("BONUS aplicado: se re-randomizan las casillas no bloqueadas.");
    refrescarLetrasNoBloqueadas();
    limpiarIntento();
    mostrarBonus(false);
}

// Handler del botón REINICIAR: vuelve al estado inicial completo
// (nivel 2, intentos 6, puntuación 0, tablero nuevo, sin bloqueos).
function clickReiniciar() {
    console.log("REINICIAR: vuelta al estado inicial.");
    // Quitar la clase visual de las casillas bloqueadas.
    for (const id of casillasBloqueadas) {
        document.getElementById(id).classList.remove("bloqueada");
    }
    casillasBloqueadas.clear();
    limpiarIntento();

    nivel = 2;
    intentos = nivel * 3;
    puntuacion = 0;

    rellenarMatriz();

    // Vaciar la representación visual de todas las casillas.
    for (let f = 0; f < TAMANO; f++) {
        for (let c = 0; c < TAMANO; c++) {
            ocultarCasilla(`${f}${c}`);
        }
    }

    mostrarBonus(false);
    actualizarMarcadores();
}


// ------------------------ INICIALIZACIÓN ---------------------------------

// Vuelca la matriz por consola en forma de tabla para depurar.
function mostrarMatrizConsole() {
    console.table(matriz);
}

function principal() {
    // Estado inicial: matriz rellena y marcadores pintados.
    rellenarMatriz();
    mostrarMatrizConsole();
    actualizarMarcadores();
    mostrarBonus(false);

    // Engancho un listener a cada botón del tablero (sin tocar BONUS/REINICIAR).
    document.querySelectorAll("#tablero button").forEach(b => {
        b.addEventListener("click", clickCasilla);
    });

    // Botones de acción.
    document.getElementById("btn-bonus").addEventListener("click", clickBonus);
    document.getElementById("btn-reiniciar").addEventListener("click", clickReiniciar);
}

// Espera a que el DOM esté listo para enganchar los listeners.
window.addEventListener("DOMContentLoaded", principal);
