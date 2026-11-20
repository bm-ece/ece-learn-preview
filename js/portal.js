// Portail ECE Learn : filtrage par niveau sans modifier la progression des cours.
(function () {
  'use strict';
  const target = document.getElementById('courses');
  const selector = document.getElementById('level');
  const message = document.getElementById('course-message');
  const catalog = window.ECE_CATALOG;
  const levels = ['ING1', 'ING2', 'ING3'];
  const storageKey = 'ece_learn_selected_level';
  if (!target || !selector || !message || !Array.isArray(catalog)) throw new Error('Portail ECE Learn indisponible');
  let saved = null;
  try { saved = localStorage.getItem(storageKey); } catch { /* stockage facultatif */ }
  selector.value = levels.includes(saved) ? saved : '';
  function render() {
    target.replaceChildren();
    const level = selector.value;
    if (!levels.includes(level)) {
      message.textContent = 'Sélectionnez votre niveau pour voir les matières correspondantes.';
      return;
    }
    const courses = catalog.filter(course => Array.isArray(course.levels) && course.levels.includes(level));
    message.textContent = courses.length ? 'Matières pour ' + level : 'Aucun cours n’est encore publié pour ' + level + '.';
    for (const course of courses) {
      const card = document.createElement('article'); card.className = 'course';
      const heading = document.createElement('h3'); heading.textContent = course.title; card.append(heading);
      const description = document.createElement('p'); description.textContent = course.description; card.append(description);
      if (course.available && course.path) {
        const link = document.createElement('a'); link.href = course.path; link.textContent = 'Accéder au cours →'; card.append(link);
      } else {
        const soon = document.createElement('span'); soon.className = 'soon'; soon.textContent = 'Prochainement'; card.append(soon);
      }
      target.append(card);
    }
  }
  selector.addEventListener('change', () => {
    try { localStorage.setItem(storageKey, selector.value); } catch { /* stockage facultatif */ }
    render();
  });
  render();
})();
