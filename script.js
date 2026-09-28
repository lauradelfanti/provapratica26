const navigationButton = document.querySelector('.navigation-toggle');
const navigationLabel = document.querySelector('.navigation-label');
const navigationPanel = document.querySelector('.navigation-panel');
const desktopMedia = window.matchMedia('(min-width: 1000px)');
const supportsNavigation = 'popover' in HTMLElement.prototype &&
  CSS.supports('top', 'anchor(bottom)') &&
  CSS.supports('width', 'anchor-size(width)');

// Scegliamo la modalitÃ  di navigazione al caricamento (il popover funziona giÃ  in HTML)
function updateNavigationLabel() {
  const text = navigationPanel.matches(':popover-open') ? 'Chiudi menu' : 'Apri menu';
  navigationButton.setAttribute('aria-label', text);
  navigationLabel.textContent = text;
}
function updateNavigationLayout() {
  if (desktopMedia.matches) { // Siamo su desktop, disattiva il popover!
    navigationButton.removeAttribute('popovertarget');
    navigationPanel.removeAttribute('popover');
    navigationButton.hidden = true;
  } else { // Non siamo su desktop, riattiva il popover!
    navigationPanel.setAttribute('popover', 'auto');
    navigationButton.setAttribute('popovertarget', navigationPanel.id);
    navigationButton.hidden = false;
  }
  updateNavigationLabel();
}
if (supportsNavigation) {
  navigationPanel.addEventListener('toggle', updateNavigationLabel);
  updateNavigationLayout();
} else {
  // Qui si puÃ² eventualmente inserire un ripiego per i browser privi delle funzionalitÃ  richieste.
  navigationButton.removeAttribute('popovertarget');
  navigationPanel.removeAttribute('popover');
  navigationButton.hidden = true;
}

// Chiudiamo il popover se clicchiamo fuori (ad eccezione di alcuni casi) e lasciamo al link HTML la navigazione al capitolo
navigationPanel.addEventListener('click', function (event) {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  if (supportsNavigation && navigationPanel.matches(':popover-open')) navigationPanel.hidePopover();
  // Il link continua ad aggiornare il frammento e a scorrere con il comportamento HTML.
});
document.querySelector('.skip-link').addEventListener('click', function () {
  document.querySelector('#top').focus();
});

// Bonus accessibilitÃ : se cambia il breakpoint, manteniamo il focus dove serve
desktopMedia.addEventListener('change', function () {
  if (!supportsNavigation) return;
  const focused = document.activeElement;
  const focusInNavigation = navigationPanel.contains(focused);
  const focusOnButton = focused === navigationButton;
  updateNavigationLayout();
  if (desktopMedia.matches && focusInNavigation) focused.focus();
  else if (desktopMedia.matches && focusOnButton) navigationPanel.querySelector('a').focus();
  else if (!desktopMedia.matches && focusInNavigation) navigationButton.focus();
});

function cambia(numero, titolo, testo) {
  // togli "attivo" a tutti
  document.getElementById("step1").classList.remove("attivo");
  document.getElementById("step2").classList.remove("attivo");
  document.getElementById("step3").classList.remove("attivo");

  // mettilo solo a quello cliccato
  document.getElementById("step" + numero).classList.add("attivo");

  // cambia il contenuto dell'immagine
  document.getElementById("preview-titolo").textContent = titolo;
  document.getElementById("preview-testo").textContent = testo;
}