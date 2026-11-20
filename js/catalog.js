// Catalogue des matières prévues pour ECE Learn.
// Seul Linux est actuellement attribué à ING3 ; les autres niveaux restent à définir.
(function () {
  'use strict';
  window.ECE_CATALOG = Object.freeze([
    Object.freeze({ id: 'linux', title: 'Linux', description: 'Linux, Bash et administration système', levels: ['ING3'], available: true, path: 'linux/' }),
    Object.freeze({ id: 'networks', title: 'Réseaux', description: 'Protocoles, adressage et simulation', levels: [], available: false, path: null }),
    Object.freeze({ id: 'programming', title: 'Programmation', description: 'Algorithmes et exercices pratiques', levels: [], available: false, path: null }),
    Object.freeze({ id: 'cybersecurity', title: 'Cybersécurité', description: 'Sécurité des systèmes et réseaux', levels: [], available: false, path: null })
  ]);
})();
