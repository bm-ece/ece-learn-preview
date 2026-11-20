// Persistance Linux : conserver les clés historiques et l'isolation Preview.
// Script classique chargé avant app.js ; aucune modification du format des données.
(function () {
  'use strict';
  const isPreview = location.pathname.startsWith('/linux-nexus-preview/');
  const key = isPreview ? 'linux_nexus_preview_complete_2026' : 'linux_nexus_complete_2026';
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
