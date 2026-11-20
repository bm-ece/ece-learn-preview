// Persistance Linux : conserver les clés historiques et l'isolation Preview.
// Script classique chargé avant app.js ; aucune modification du format des données.
(function () {
  'use strict';
  const isPreview = location.pathname.startsWith('/ece-learn-preview/');
  const key = isPreview ? 'ece_learn_preview_linux_progress_2026' : 'ece_learn_linux_progress_2026';
  window.ECE_STORAGE = {
    load() {
      try { return JSON.parse(localStorage.getItem(key) || '{}'); }
      catch { return {}; }
    },
    save(data) {
      try { localStorage.setItem(key, JSON.stringify(data)); }
      catch { /* Stockage indisponible : conserver le comportement historique. */ }
    }
  };
})();
