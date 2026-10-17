'use strict';
/*
 * La feuille : un panneau qui monte du bas de l'écran, pour un aperçu rapide
 * (un point touché sur une planche) sans quitter la page. Le bouton retour
 * du téléphone la referme.
 */
(function (racine) {

  const { h } = Outils;
  let voile = null;
  let feuille = null;
  let ouverte = false;
  let precedent = null;

  function fermer(sansHistorique) {
    if (!ouverte) return;
    ouverte = false;
    const v = voile;
    const f = feuille;
    v.classList.remove('ouvert');
    f.classList.remove('ouvert');
    setTimeout(() => { v.remove(); f.remove(); }, 320);
    document.removeEventListener('keydown', echap);
    if (!sansHistorique && history.state && history.state.feuille) history.back();
    if (precedent && precedent.focus) { try { precedent.focus({ preventScroll: true }); } catch (e) { /* rien */ } }
  }
  function echap(e) { if (e.key === 'Escape') fermer(); }

  function ouvrir(contenu, options) {
    if (ouverte) fermer(true);
    precedent = document.activeElement;
    voile = h('div', { class: 'voile', onclick: () => fermer() });
    feuille = h('div', { class: 'feuille', role: 'dialog', 'aria-modal': 'true', 'aria-label': (options && options.titre) || 'Aperçu' },
      h('div', { class: 'poignee' }), contenu);
    document.body.appendChild(voile);
    document.body.appendChild(feuille);
    requestAnimationFrame(() => { voile.classList.add('ouvert'); feuille.classList.add('ouvert'); });
    ouverte = true;
    document.addEventListener('keydown', echap);
    // une entrée d'historique, pour que « retour » ferme la feuille
    history.pushState({ feuille: true }, '');
    const premier = feuille.querySelector('a, button');
    if (premier) setTimeout(() => premier.focus({ preventScroll: true }), 60);
    // glisser vers le bas pour fermer
    let y0 = null;
    feuille.addEventListener('touchstart', (e) => { if (feuille.scrollTop <= 0) y0 = e.touches[0].clientY; }, { passive: true });
    feuille.addEventListener('touchmove', (e) => {
      if (y0 == null) return;
      const dy = e.touches[0].clientY - y0;
      if (dy > 0) feuille.style.transform = 'translateY(' + dy + 'px)';
    }, { passive: true });
    feuille.addEventListener('touchend', (e) => {
      if (y0 == null) return;
      const dy = e.changedTouches[0].clientY - y0;
      feuille.style.transform = '';
      y0 = null;
      if (dy > 90) fermer();
    });
  }

  racine.addEventListener('popstate', () => { if (ouverte) fermer(true); });

  /* Quitter la feuille vers une autre page : l'entrée d'historique de la
   * feuille est remplacée par la nouvelle adresse, pour qu'un seul « retour »
   * ramène à la page d'où l'on venait. */
  function aller(adresse) {
    if (ouverte && history.state && history.state.feuille) {
      fermer(true);
      history.replaceState(null, '', adresse);
      if (racine.App) App.afficher();
    } else {
      fermer(true);
      location.hash = adresse;
    }
  }

  racine.Feuille = { ouvrir, fermer, aller, get ouverte() { return ouverte; } };

})(window);
