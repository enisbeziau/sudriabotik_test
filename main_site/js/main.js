document.addEventListener("DOMContentLoaded", () => {

  // Code relatif à la partie "sponso"
  const conteneurSponsors = document.getElementById('inject-sponsors');
  lesSponsors.forEach(sponsor => {
    const lienSponsor = document.createElement('a');
    lienSponsor.href = sponsor.lien;

    if (sponsor.lien !== "#") {
      lienSponsor.target = "_blank";
      lienSponsor.rel = "noopener noreferrer";
    }

    const imgSponsor = document.createElement('img');
    imgSponsor.src = sponsor.image;
    imgSponsor.alt = `Logo de ${sponsor.nom}`;

    lienSponsor.appendChild(imgSponsor);
    conteneurSponsors.appendChild(lienSponsor);
  });

  // Code relatif à la partie "histoire"
  const conteneurDates = document.getElementById('injecter_dates_timeline');
  const conteneurContenu = document.getElementById('injecter_contenu_timeline');

  // Tri par date
  const coupesTriees = lesCoupesDeRobotique.sort((a, b) => new Date(a.date_systeme) - new Date(b.date_systeme));
  const distanceEntreDates = 150; // px

  coupesTriees.forEach((coupe, index) => {
    const positionLeft = (index * distanceEntreDates) + 50;

    // On injecte sur la ligne
    const liDate = document.createElement('li');
    const aDate = document.createElement('a');
    aDate.href = "#0";
    aDate.setAttribute('data-date', coupe.date_systeme);
    aDate.textContent = coupe.label_menu;
    aDate.style.left = `${positionLeft}px`;
    if (coupe.est_selectionne) aDate.classList.add('selected');
    liDate.appendChild(aDate);
    conteneurDates.appendChild(liDate);

    // On injecte sur la boite d'information
    const liContenu = document.createElement('li');
    liContenu.setAttribute('data-date', coupe.date_systeme);
    if (coupe.est_selectionne) liContenu.classList.add('selected');
    liContenu.innerHTML = `
        <h2>${coupe.titre}</h2>
        <em>${coupe.date_exacte}</em>
        <p><b>Notre classement :</b><br>${coupe.classement || "Non classé"}</p>
        <p><b>Le thème :</b><br>${coupe.theme}</p>
        <p><b>Président(e) :</b><br>${coupe.president}</p>
      `;
    conteneurContenu.appendChild(liContenu);
  });

  // Paramétrages des dimensions du carrousel
  const totalWidth = (coupesTriees.length * distanceEntreDates) + 150;
  const eventsboite_a_contenu = document.querySelector('.boite_globale_timeline .events');
  if (eventsboite_a_contenu) eventsboite_a_contenu.style.width = `${totalWidth}px`;

  const timelineWrapper = document.querySelector('.events-wrapper');
  const fillingLine = document.querySelector('.filling-line');
  const timelineLinks = document.querySelectorAll('#injecter_dates_timeline a');
  const btnNext = document.querySelector('.cd-timeline-navigation .next');
  const btnPrev = document.querySelector('.cd-timeline-navigation .prev');
  let translateValue = 0;

  // Fonctions de mise à jour visuelle
  const updateFillingLine = (selectedLink) => {
    const scaleValue = (parseFloat(selectedLink.style.left) + selectedLink.offsetWidth / 2) / totalWidth;
    if (fillingLine) fillingLine.style.transform = `scaleX(${scaleValue})`;
  };

  const updateContentHeight = () => {
    const activeContent = document.querySelector('#injecter_contenu_timeline li.selected');
    const eventsContentboite_a_contenu = document.querySelector('.contenu_events');
  };

  // Initialisation visuelle au démarrage
  document.querySelector('.boite_globale_timeline').classList.add('loaded');
  const initialSelected = document.querySelector('#injecter_dates_timeline a.selected');
  if (initialSelected) updateFillingLine(initialSelected);
  setTimeout(updateContentHeight, 100);

  // Interaction : Clic sur une date
  timelineLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const currentSelectedLink = document.querySelector('#injecter_dates_timeline a.selected');
      const currentSelectedContent = document.querySelector('#injecter_contenu_timeline li.selected');
      const contentToShow = document.querySelector(`#injecter_contenu_timeline li[data-date="${link.getAttribute('data-date')}"]`);

      if (currentSelectedLink !== link && contentToShow && currentSelectedContent) {

        currentSelectedLink.classList.remove('selected');
        link.classList.add('selected');
        currentSelectedContent.classList.remove('selected');

        // Détermine le sens de l'animation de la carte (gauche ou droite)
        const isForward = parseFloat(link.style.left) > parseFloat(currentSelectedLink.style.left);
        contentToShow.className = `selected ${isForward ? 'enter-right' : 'enter-left'}`;
        currentSelectedContent.className = isForward ? 'leave-left' : 'leave-right';

        setTimeout(() => {
          currentSelectedContent.className = '';
          contentToShow.className = 'selected';
          updateContentHeight();
        }, 400);

        updateFillingLine(link);
      }
    });
  });

  // Interaction : Flèche Suivant
  if (btnNext) {
    btnNext.addEventListener('click', (e) => {
      e.preventDefault();
      const wrapperWidth = timelineWrapper.offsetWidth;
      translateValue = translateValue - wrapperWidth + distanceEntreDates;
      if (Math.abs(translateValue) > totalWidth - wrapperWidth) translateValue = -(totalWidth - wrapperWidth);
      eventsboite_a_contenu.style.transform = `translateX(${translateValue}px)`;
      btnPrev.classList.remove('inactive');
      if (Math.abs(translateValue) >= totalWidth - wrapperWidth) btnNext.classList.add('inactive');
    });
  }

  // Interaction : Flèche Précédent
  if (btnPrev) {
    btnPrev.addEventListener('click', (e) => {
      e.preventDefault();
      const wrapperWidth = timelineWrapper.offsetWidth;
      translateValue = translateValue + wrapperWidth - distanceEntreDates;
      if (translateValue > 0) translateValue = 0;
      eventsboite_a_contenu.style.transform = `translateX(${translateValue}px)`;
      btnNext.classList.remove('inactive');
      if (translateValue === 0) btnPrev.classList.add('inactive');
    });
  }

  // Code relatif à la partie "équipe"
  const conteneurEquipe = document.getElementById('injection_contenu_equipe_grille');
  lesMembresEquipe.forEach(membre => {
    const article = document.createElement('article');
    article.className = 'team-member';
    article.innerHTML = `
        <div class="member-front" style="background-image: url('${membre.image}')">
          <div class="member-info">
            <h3>${membre.nom}</h3>
            <span>${membre.role}</span>
          </div>
        </div>
        <div class="member-back">
          <p>${membre.description1}</p>
          <span>${membre.description2}</span>
        </div>
      `;
    conteneurEquipe.appendChild(article);
  });

});
