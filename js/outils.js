'use strict';
/*
 * Petits outils partagés.
 *
 * `h()` fabrique un élément ; le texte passe toujours par des nœuds texte,
 * jamais par innerHTML — sauf pour les dessins SVG, écrits par l'application
 * elle-même. `riche()` met en forme les textes du contenu : paragraphes,
 * listes, gras, italique et renvois vers les points, méridiens, soins…
 */
(function (racine) {

  function h(balise, attributs, ...enfants) {
    const n = document.createElement(balise);
    if (attributs) {
      for (const [k, v] of Object.entries(attributs)) {
        if (v == null || v === false) continue;
        if (k === 'class') n.className = v;
        else if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
        else if (k === 'dataset') Object.assign(n.dataset, v);
        else n.setAttribute(k, v === true ? '' : v);
      }
    }
    ajouter(n, enfants);
    return n;
  }
  function ajouter(n, enfants) {
    for (const e of enfants) {
      if (e == null || e === false) continue;
      if (Array.isArray(e)) ajouter(n, e);
      else n.appendChild(e.nodeType ? e : document.createTextNode(String(e)));
    }
  }

  const NS = 'http://www.w3.org/2000/svg';
  function s(balise, attributs, ...enfants) {
    const n = document.createElementNS(NS, balise);
    if (attributs) {
      for (const [k, v] of Object.entries(attributs)) {
        if (v == null || v === false) continue;
        if (k.startsWith('on') && typeof v === 'function') n.addEventListener(k.slice(2), v);
        else n.setAttribute(k, v);
      }
    }
    for (const e of enfants.flat(Infinity)) {
      if (e == null || e === false) continue;
      n.appendChild(e.nodeType ? e : document.createTextNode(String(e)));
    }
    return n;
  }

  /* Une icône du jeu (voir js/icones.js). */
  function icone(nom, classe) {
    const svg = s('svg', { viewBox: '0 0 24 24', class: 'ico' + (classe ? ' ' + classe : ''), 'aria-hidden': 'true', focusable: 'false' });
    svg.innerHTML = (racine.ICONES && racine.ICONES[nom]) || '';
    return svg;
  }

  function normaliser(t) {
    return String(t || '').toLowerCase().normalize('NFKD').replace(/\p{M}/gu, '')
      .replace(/[’‘`]/g, "'").replace(/œ/g, 'oe').replace(/æ/g, 'ae').replace(/\s+/g, ' ').trim();
  }

  /* ── Texte riche ─────────────────────────────────────────────────────────
   * Un texte du contenu peut contenir :
   *   paragraphes séparés par une ligne vide, listes « - », titres « ## »
   *   **gras**, *italique*
   *   [[GI4]]                 un point (affiché « GI4 Hegu »)
   *   [[m:F]]                 un méridien
   *   [[s:cephalee]]          un soin
   *   [[p:yin-yang]]          un chapitre des principes
   *   [[a:gingembre]]         un aliment
   *   [[r:congee]]            une recette
   *   [[x|libellé]]           n'importe lequel avec un libellé choisi
   */
  function riche(texte, options) {
    const frag = document.createDocumentFragment();
    const blocs = String(texte || '').replace(/\r/g, '').split(/\n\s*\n/);
    for (const bloc of blocs) {
      const lignes = bloc.split('\n').filter((l) => l.trim());
      if (!lignes.length) continue;
      if (lignes.every((l) => /^\s*[-•]\s+/.test(l))) {
        const ul = h('ul', { class: 'liste-texte' });
        for (const l of lignes) ul.appendChild(h('li', null, enLigne(l.replace(/^\s*[-•]\s+/, ''), options)));
        frag.appendChild(ul);
      } else if (/^##\s/.test(lignes[0])) {
        frag.appendChild(h('h3', { class: 'intertitre' }, enLigne(lignes[0].replace(/^##\s*/, ''), options)));
        if (lignes.length > 1) frag.appendChild(h('p', null, enLigne(lignes.slice(1).join(' '), options)));
      } else {
        frag.appendChild(h('p', null, enLigne(lignes.join(' '), options)));
      }
    }
    return frag;
  }

  function enLigne(texte, options) {
    const frag = document.createDocumentFragment();
    const motif = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
    let pos = 0;
    let m;
    while ((m = motif.exec(texte))) {
      if (m.index > pos) frag.appendChild(document.createTextNode(texte.slice(pos, m.index)));
      if (m[1]) frag.appendChild(renvoi(m[1].trim(), m[2], options));
      else if (m[3]) frag.appendChild(h('strong', null, enLigne(m[3], options)));
      else if (m[4]) frag.appendChild(h('em', null, m[4]));
      pos = motif.lastIndex;
    }
    if (pos < texte.length) frag.appendChild(document.createTextNode(texte.slice(pos)));
    return frag;
  }

  /* Un renvoi devient un lien interne. Les données sont lues au moment du rendu. */
  function renvoi(cle, libelle, options) {
    const D = racine.MTC || {};
    let href = null;
    let texte = libelle;
    let classe = 'renvoi';
    const [type, id] = cle.includes(':') ? cle.split(':') : ['pt', cle];
    if (type === 'pt') {
      const p = D.point && D.point(id);
      href = '#/point/' + encodeURIComponent(id);
      texte = texte || (p ? Notation.code(id) + ' ' + p.nom : id);
      classe += ' renvoi-point m-' + ((racine.Planche && Planche.meridienDe(id)) || 'EX');
    } else if (type === 'm') {
      const me = D.meridien && D.meridien(id);
      href = '#/meridien/' + id;
      texte = texte || (me ? me.nom : id);
      classe += ' renvoi-meridien m-' + id;
    } else if (type === 's') {
      const so = D.soin && D.soin(id);
      href = '#/soin/' + id;
      texte = texte || (so ? so.nom : id);
    } else if (type === 'p') {
      const ch = D.chapitre && D.chapitre(id);
      href = '#/principes/' + id;
      texte = texte || (ch ? ch.titre : id);
    } else if (type === 'a') {
      const al = D.aliment && D.aliment(id);
      href = '#/aliment/' + id;
      texte = texte || (al ? al.nom : id);
      if (al) classe += ' renvoi-aliment n-' + al.nature;
    } else if (type === 'r') {
      const re = D.recette && D.recette(id);
      href = '#/recette/' + id;
      texte = texte || (re ? re.nom : id);
    } else if (type === 'h') {
      href = '#/' + id;
      texte = texte || id;
    } else if (type === 'c') {
      const co = D.constitution && D.constitution(id);
      href = '#/constitution/' + id;
      texte = texte || (co ? co.nom : id);
    }
    if (options && options.sansLiens) return document.createTextNode(texte || cle);
    return h('a', { class: classe, href }, texte || cle);
  }

  /* Le texte brut d'un texte riche (pour la recherche et la voix). */
  function brut(texte) {
    const D = racine.MTC || {};
    return String(texte || '')
      .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, '$2')
      .replace(/\[\[([^\]]+)\]\]/g, (x, cle) => {
        const [type, id] = cle.includes(':') ? cle.split(':') : ['pt', cle];
        if (type === 'pt') { const p = D.point && D.point(id); return p ? id + ' ' + p.nom : id; }
        if (type === 'm') { const m = D.meridien && D.meridien(id); return m ? m.nom : id; }
        if (type === 'a') { const a = D.aliment && D.aliment(id); return a ? a.nom : id; }
        return id;
      })
      .replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/^##\s*/gm, '').replace(/^\s*-\s+/gm, '');
  }

  function vibrer(motif) {
    try { if (racine.Reglages && !Reglages.lire('vibrations')) return; if (navigator.vibrate) navigator.vibrate(motif); } catch (e) { /* rien */ }
  }

  /* Durées : 90 → « 1 min 30 ». */
  function duree(sec) {
    const m = Math.floor(sec / 60);
    const r = Math.round(sec % 60);
    if (!m) return r + ' s';
    return m + ' min' + (r ? ' ' + String(r).padStart(2, '0') : '');
  }
  function chrono(sec) {
    const m = Math.floor(Math.max(0, sec) / 60);
    const r = Math.ceil(Math.max(0, sec) % 60);
    return (r === 60 ? m + 1 : m) + ':' + String(r === 60 ? 0 : r).padStart(2, '0');
  }

  function melanger(tableau, graine) {
    const t = tableau.slice();
    let x = graine || 1;
    for (let i = t.length - 1; i > 0; i -= 1) {
      x = (x * 9301 + 49297) % 233280;
      const j = Math.floor((x / 233280) * (i + 1));
      [t[i], t[j]] = [t[j], t[i]];
    }
    return t;
  }

  /* Le numéro du jour (pour « le point du jour », stable sur une journée). */
  function jourDeLAnnee(d) {
    const date = d || new Date();
    return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  }

  async function copier(texte) {
    try { await navigator.clipboard.writeText(texte); return true; } catch (e) { return false; }
  }

  function element(balise, classe, texte) { const n = document.createElement(balise); if (classe) n.className = classe; if (texte != null) n.textContent = texte; return n; }
  function bouton(classe, texte, action) { const b = element('button', classe, texte); b.type = 'button'; if (action) b.addEventListener('click', action); return b; }

  racine.Outils = { h, s, icone, element, bouton, normaliser, riche, enLigne, brut, vibrer, duree, chrono, melanger, jourDeLAnnee, copier };

})(window);
