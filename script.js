/* ===== Navigazione ===== */
const navigationButton = document.querySelector('.navigation-toggle');
const navigationLabel = document.querySelector('.navigation-label');
const navigationPanel = document.querySelector('.navigation-panel');
const desktopMedia = window.matchMedia('(min-width: 1000px)');
const supportsNavigation = 'popover' in HTMLElement.prototype &&
  CSS.supports('top', 'anchor(bottom)') &&
  CSS.supports('width', 'anchor-size(width)');

// Aggiorna il testo del pulsante in base allo stato del menu
function updateNavigationLabel() {
  const text = navigationPanel.matches(':popover-open') ? 'Chiudi menu' : 'Menu dei capitoli';
  navigationButton.setAttribute('aria-label', text);
  navigationLabel.textContent = text;
}

// Su desktop il popover viene tolto e le voci vanno in linea; altrove viene riattivato
function updateNavigationLayout() {
  if (desktopMedia.matches) {
    navigationButton.removeAttribute('popovertarget');
    navigationPanel.removeAttribute('popover');
    navigationButton.hidden = true;
  } else {
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
  // Ripiego per i browser senza le funzionalità richieste: menu sempre visibile
  navigationButton.removeAttribute('popovertarget');
  navigationPanel.removeAttribute('popover');
  navigationButton.hidden = true;
}

// Chiude il popover quando si clicca un link e lascia all'HTML lo scorrimento alla sezione
navigationPanel.addEventListener('click', function (event) {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  if (supportsNavigation && navigationPanel.matches(':popover-open')) {
    navigationPanel.hidePopover();
  }
});

// Il link "Vai al contenuto" sposta il focus sul contenuto principale
document.querySelector('.skip-link').addEventListener('click', function () {
  document.querySelector('#top').focus();
});

// Se cambia il breakpoint, il focus resta dove serve
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


/* ===== breakdownTabs: scegliere una voce e cambiare immagine ===== */
const tabs = document.querySelector('.breakdownTabs');

if (tabs) {
  const tabItems = tabs.querySelectorAll('.breakdownTabs-item');
  const tabButtons = tabs.querySelectorAll('.breakdownTabs-button');
  const tabVisuals = tabs.querySelectorAll('.breakdownTabs-visual');

  // Dice al CSS che JavaScript funziona
  tabs.classList.add('breakdownTabs-ready');

  // Voce, pulsante e immagine con la stessa posizione vanno insieme
  function selectTab(position) {
    for (let i = 0; i < tabItems.length; i++) {
      const isSelected = i === position;
      tabItems[i].classList.toggle('is-selected', isSelected);
      tabButtons[i].setAttribute('aria-expanded', isSelected);
      if (tabVisuals[i]) tabVisuals[i].classList.toggle('is-active', isSelected);
    }
  }

  // All'avvio mostra la prima voce e la prima immagine
  selectTab(0);

  // Ogni pulsante passa la propria posizione
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].addEventListener('click', function () {
      selectTab(i);
    });
  }
}