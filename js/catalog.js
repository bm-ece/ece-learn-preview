// Catalogue des matières prévues pour ECE Learn.
// Les matières non publiées ne disposent pas de lien navigable.
(function () {
  'use strict';
  window.ECE_CATALOG = Object.freeze([
    Object.freeze({ id: 'linux', title: 'Linux', description: 'Linux, Bash et administration système', available: true, path: null }),
    Object.freeze({ id: 'networks', title: 'Réseaux', description: 'Protocoles, adressage et simulation', available: false, path: null }),
    Object.freeze({ id: 'programming', title: 'Programmation', description: 'Algorithmes et exercices pratiques', available: false, path: null }),
    Object.freeze({ id: 'cybersecurity', title: 'Cybersécurité', description: 'Sécurité des systèmes et réseaux', available: false, path: null })
  ]);
})();
