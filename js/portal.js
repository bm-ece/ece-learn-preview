// Portail ECE Learn : seule une matière avec un chemin publié reçoit un lien.
(function(){
  'use strict';
  const target=document.getElementById('courses');
  const catalog=window.ECE_CATALOG;
  if(!target||!Array.isArray(catalog))throw new Error('Catalogue ECE Learn indisponible');
  for(const course of catalog){
    const card=document.createElement('article');card.className='course';
    const heading=document.createElement('h3');heading.textContent=course.title;card.append(heading);
    const description=document.createElement('p');description.textContent=course.description;card.append(description);
    if(course.available&&course.id==='linux'){
      const link=document.createElement('a');link.href='linux/';link.textContent='Accéder au cours →';card.append(link);
    }else{
      const soon=document.createElement('span');soon.className='soon';soon.textContent='Prochainement';card.append(soon);
    }
    target.append(card);
  }
})();
