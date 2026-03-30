const textInput = document.getElementById("textInput");
const fileNameInput = document.getElementById("fileName");
const copyButton = document.getElementById("copyButton");
const downloadButton = document.getElementById("downloadButton");
const clearButton = document.getElementById("clearButton");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const lineCount = document.getElementById("lineCount");
const saveStatus = document.getElementById("saveStatus");

const STORAGE_KEY = "bloc-de-texto-contenido";
const FILE_NAME_KEY = "bloc-de-texto-archivo";

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
  localStorage.setItem(FILE_NAME_KEY, fileNameInput.value.trim() || "mi-texto");
  setStatus("Guardado automaticamente");
}

function loadSavedContent() {
  const savedText = localStorage.getItem(STORAGE_KEY);
  const savedName = localStorage.getItem(FILE_NAME_KEY);

  if (savedText !== null) {
    textInput.value = savedText;
  }

  if (savedName) {
    fileNameInput.value = savedName;
  }

  updateStats(textInput.value);
}

function downloadTextFile() {
  const content = textInput.value;
  const fileName = `${(fileNameInput.value.trim() || "mi-texto").replace(/[\\/:*?"<>|]/g, "-")}.txt`;
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
