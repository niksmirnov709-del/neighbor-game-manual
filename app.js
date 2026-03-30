const textInput = document.getElementById("textInput");
const fileNameInput = document.getElementById("fileName");
const restoreButton = document.getElementById("restoreButton");
const copyButton = document.getElementById("copyButton");
const downloadButton = document.getElementById("downloadButton");
const clearButton = document.getElementById("clearButton");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const lineCount = document.getElementById("lineCount");
const saveStatus = document.getElementById("saveStatus");

const STORAGE_KEY = "bloc-de-texto-contenido";
const FILE_NAME_KEY = "bloc-de-texto-archivo";
const DEFAULT_FILE_NAME = "The Neighbors Manual 1.0 alpha";
const DEFAULT_TEXT = `THE NEIGHBORS MANUAL 1.0 ALPHA

OBJETIVO
- Victimas: sobrevivir y completar tareas.
- Vecinos: evolucionar y eliminar victimas.

JUGADORES Y ROLES
2 jugadores
- 1 vecino
- 1 victima

3-5 jugadores
- 1 vecino
- Resto de jugadores: victimas

6-10 jugadores
- 2 vecinos
- Resto de jugadores: victimas

10+ jugadores
- 3-4 vecinos
- Resto de jugadores: victimas

FLUJO DEL JUEGO
- Duracion estimada: 20-30 min.
- Juego en tiempo real.
- Cada 2-5 min: un vecino aparece, sube de fase o cambia condiciones.

MOVIMIENTO
- Todos deben moverse y no permanecer quietos.
- Los vecinos dependen del movimiento de las victimas.

TAREAS
- Encender o apagar luces.
- Mover objetos.
- Recitar frases.
- Permanecer en un sitio.
- Activar rituales.
- Victoria de las victimas: completar tareas y sobrevivir.

VECINOS: FASES Y APARIENCIA

PROFESOR
Fase 1: Ojos pequenos y blancos, calvo, con gafas.
Fase 2: Bajo, fuerte, lengua sobresale y boca abierta.
Fase 3: Boca desgarrada hasta el pecho, lengua larga y afilada, ojos amarillos.
Condicion F2: Habla demasiado, se detiene o toca objetos prohibidos.

HOMBRE AMABLE
Fase 1: Hombre con barba, amable, ayuda a otros.
Fase 2: Se arrastra, piel blanca, dice que no tiene fuerzas.
Fase 3: Gusano blanco con boca humana que expulsa sangre.
Condicion F2: Hace ruido o falla reglas o rituales.

SURFISTA
Fase 1: Sonrie, gafas de sol, habla con todos como amigo.
Fase 2: Golpea "accidentalmente" con la tabla.
Fase 3: La tabla se clava en la victima y aparecen sonrisas demoniacas alrededor.
Condicion F2: Oscuridad o poca luz, o victima distraida.

ANCIANO
Fase 1: Viejo con baston, camina mucho.
Fase 2: Extremidades alargadas, persigue jugadores.
Fase 3: Criatura tipo arana, 8 extremidades, ojos blancos y boca abierta.
Condicion F2: Quedarse quieto mas de 5 segundos o dejar de moverse.

RITUALES INICIALES (F1 -> F2)
Profesor: Lupa + lapiz + cinta verde, mantener 5 segundos.
Hombre Amable: Martillo + papel rojo + liquido, mantener 5 segundos.
Surfista: Banano + tabla + aparato electrico, mantener 5 segundos.
Anciano: Baston + zapato + silla, mantener 5 segundos.

RITUALES FINALES COMPLEJOS (F2 -> F3)
Profesor: Lupa sobre libro + vela, trazar circulo con lapiz, silencio 5-10 segundos.
Hombre Amable: Martillo + papel rojo + liquido + cuerda + vela negra, tocar la cuerda y recitar "olvida" 3 veces, silencio total.
Surfista: Banano sobre tabla + aparato electrico + luz parpadeante + objeto puntiagudo, trazar una "X" sobre el banano, silencio 5-10 segundos.
Anciano: Baston en zapato sobre silla + papel con simbolo + vela, caminar 3 veces alrededor de la silla, silencio total.

SABOTAJES
- Apagar luces, generar ruido y bloquear zonas.
- Generan condiciones de ataque F2.

REUNIONES / DISCUSIONES
- Se activan si se encuentra un cuerpo o alguien grita "REUNION".
- Se discute, se acusa y se vota.

OBJETOS
- Utiles: linterna, espejo, papeles y rituales.
- Malditos: caja (esconderse), campana (revela vecinos), papel rojo (protege pero marca).

MODO 1 JUGADOR
- Los vecinos aparecen aleatoriamente.
- Las tareas y reglas cambian segun el vecino activo.
- Si fallas, el vecino entra en Fase 3 y ataca.

MODO 2 JUGADORES
- 1 victima + 1 vecino.
- Evolucion: ritual inicial -> F2; matar con condicion + ritual final -> F3; luego ataque libre.
- La victima completa tareas mientras evita condiciones.

VICTORIA
- Victimas: completan tareas y sobreviven.
- Vecinos: eliminan suficientes jugadores o alcanzan Fase 3.`;

function pluralize(value, singular, plural) {
  return `${value} ${value === 1 ? singular : plural}`;
}

function updateStats(text) {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const lines = text.length ? text.split(/\r\n|\r|\n/).length : 1;

  charCount.textContent = pluralize(text.length, "caracter", "caracteres");
  wordCount.textContent = pluralize(words, "palabra", "palabras");
  lineCount.textContent = pluralize(lines, "linea", "lineas");
}

function setStatus(message) {
  saveStatus.textContent = message;
}

function saveContent() {
  localStorage.setItem(STORAGE_KEY, textInput.value);
  localStorage.setItem(FILE_NAME_KEY, fileNameInput.value.trim() || DEFAULT_FILE_NAME);
  setStatus("Guardado automaticamente");
}

function loadSavedContent() {
  const savedText = localStorage.getItem(STORAGE_KEY);
  const savedName = localStorage.getItem(FILE_NAME_KEY);

  if (savedText !== null) {
    textInput.value = savedText;
  } else {
    textInput.value = DEFAULT_TEXT;
  }

  if (savedName) {
    fileNameInput.value = savedName;
  } else {
    fileNameInput.value = DEFAULT_FILE_NAME;
  }

  updateStats(textInput.value);
}

function downloadTextFile() {
  const content = textInput.value;
  const fileName = `${(fileNameInput.value.trim() || DEFAULT_FILE_NAME).replace(/[\\/:*?"<>|]/g, "-")}.txt`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
  setStatus("Archivo descargado");
}

let saveTimeout;

textInput.addEventListener("input", () => {
  updateStats(textInput.value);
  setStatus("Escribiendo...");
  window.clearTimeout(saveTimeout);
  saveTimeout = window.setTimeout(saveContent, 250);
});

fileNameInput.addEventListener("input", () => {
  setStatus("Actualizando nombre...");
  window.clearTimeout(saveTimeout);
  saveTimeout = window.setTimeout(saveContent, 250);
});

restoreButton.addEventListener("click", () => {
  textInput.value = DEFAULT_TEXT;
  fileNameInput.value = DEFAULT_FILE_NAME;
  updateStats(textInput.value);
  saveContent();
  setStatus("Manual restaurado");
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(textInput.value);
    setStatus("Texto copiado");
  } catch (error) {
    setStatus("No se pudo copiar");
  }
});

downloadButton.addEventListener("click", downloadTextFile);

clearButton.addEventListener("click", () => {
  textInput.value = "";
  updateStats("");
  saveContent();
  setStatus("Texto eliminado");
});

loadSavedContent();
