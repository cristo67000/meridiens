# -*- coding: utf-8 -*-
"""Génère les icônes de Méridiens et l'image d'aperçu des liens partagés.

Dessin : un cachet vermillon, un anneau ouvert couleur papier — le Qi qui
circule — et en son centre un point, celui qu'on presse. Le même dessin que
le logo de l'application (index.html).

Dessiné au quadruple de la taille finale puis réduit : Pillow ne lisse pas
les bords, le suréchantillonnage s'en charge.

    python build/generer-icones.py
"""
import math
import os

from PIL import Image, ImageDraw, ImageFont

ICI = os.path.dirname(os.path.abspath(__file__))
SORTIE = os.path.join(os.path.dirname(ICI), "icons")
VERMILLON = (181, 52, 42)
VERMILLON_SOMBRE = (150, 40, 32)
PAPIER = (255, 248, 241)
FOND = (246, 240, 228)
ENCRE = (36, 29, 23)
E = 4

POLICES_TITRE = [r"C:\Windows\Fonts\cambriab.ttf", r"C:\Windows\Fonts\palab.ttf", r"C:\Windows\Fonts\georgiab.ttf"]
POLICES_TEXTE = [r"C:\Windows\Fonts\segoeui.ttf", r"C:\Windows\Fonts\arial.ttf"]
POLICES_HAN = [r"C:\Windows\Fonts\simsun.ttc", r"C:\Windows\Fonts\msyh.ttc", r"C:\Windows\Fonts\simhei.ttf"]


def police(chemins, taille):
    for chemin in chemins:
        if os.path.exists(chemin):
            return ImageFont.truetype(chemin, taille)
    return ImageFont.load_default()


def point(cx, cy, r, angle):
    """Angle en degrés, 0 en haut, sens des aiguilles d'une montre."""
    a = math.radians(angle)
    return (cx + r * math.sin(a), cy - r * math.cos(a))


def trace_enso(cx, cy, r, ep, pas=96):
    """Le contour d'un ensō : un cercle tracé d'un seul coup de pinceau,
    épais au départ (en haut à droite), qui s'amincit en faisant le tour et
    s'arrête avant de se refermer. Renvoie un polygone."""
    debut, fin = 58, 392
    exterieur, interieur = [], []
    for k in range(pas + 1):
        t = k / pas
        a = debut + (fin - debut) * t
        e = ep * (1.15 - 0.75 * t ** 1.4)          # le trait s'affine
        rr = r * (1 + 0.025 * math.sin(t * math.pi * 3))  # main légèrement irrégulière
        exterieur.append(point(cx, cy, rr + e / 2, a))
        interieur.append(point(cx, cy, rr - e / 2, a))
    # bout arrondi au départ : un demi-cercle
    return exterieur + interieur[::-1]


def symbole(d, cx, cy, r, ep):
    """L'ensō et le point central."""
    d.polygon(trace_enso(cx, cy, r, ep), fill=PAPIER)
    x, y = point(cx, cy, r, 58)
    e = ep * 1.15
    d.ellipse([x - e / 2, y - e / 2, x + e / 2, y + e / 2], fill=PAPIER)
    rp = r * 0.27
    d.ellipse([cx - rp, cy - rp, cx + rp, cy + rp], fill=PAPIER)


def chemin_svg(cx=32, cy=32, r=17, ep=6.2):
    """Le même dessin, en chemin SVG pour le logo de la page (viewBox 64)."""
    pts = trace_enso(cx, cy, r, ep, pas=40)
    return "M" + "L".join("%.1f %.1f" % p for p in pts) + "Z"


def icone(cote, masquable=False):
    g = cote * E
    image = Image.new("RGBA", (g, g), (0, 0, 0, 0))
    d = ImageDraw.Draw(image)
    if masquable:
        d.rectangle([0, 0, g, g], fill=VERMILLON)
        r = g * 0.25
    else:
        marge = g * 0.03
        d.rounded_rectangle([marge, marge, g - marge, g - marge], radius=g * 0.22, fill=VERMILLON)
        # un léger liseré intérieur, comme l'empreinte d'un cachet
        m2 = g * 0.075
        d.rounded_rectangle([m2, m2, g - m2, g - m2], radius=g * 0.17, outline=VERMILLON_SOMBRE, width=max(1, int(g * 0.012)))
        r = g * 0.30
    symbole(d, g / 2, g / 2, r, g * 0.085)
    return image.resize((cote, cote), Image.LANCZOS)


def apercu():
    l, h = 1200, 630
    image = Image.new("RGB", (l * 2, h * 2), FOND)
    d = ImageDraw.Draw(image)
    # le caractère 经 (méridien) en grand filigrane
    fh = police(POLICES_HAN, 900)
    d.text((l * 2 - 760, h - 520), "经", font=fh, fill=(236, 226, 208))
    ic = icone(300).resize((520, 520), Image.LANCZOS)
    image.paste(ic, (150, (h * 2 - 520) // 2), ic)
    ft = police(POLICES_TITRE, 168)
    fs = police(POLICES_TEXTE, 62)
    d.text((760, 360), "Méridiens", font=ft, fill=ENCRE)
    d.text((768, 590), "Médecine traditionnelle chinoise", font=fs, fill=(91, 80, 70))
    d.text((768, 680), "Méridiens, points de digipuncture,", font=fs, fill=(91, 80, 70))
    d.text((768, 770), "soins guidés, diététique — hors ligne", font=fs, fill=(91, 80, 70))
    d.rectangle([768, 900, 1000, 912], fill=VERMILLON)
    return image.resize((l, h), Image.LANCZOS)


if __name__ == "__main__":
    os.makedirs(SORTIE, exist_ok=True)
    icone(192).save(os.path.join(SORTIE, "icon-192.png"), optimize=True)
    icone(512).save(os.path.join(SORTIE, "icon-512.png"), optimize=True)
    icone(512, masquable=True).save(os.path.join(SORTIE, "icon-maskable-512.png"), optimize=True)
    apercu().save(os.path.join(SORTIE, "apercu-1200x630.png"), optimize=True)
    print("icones ecrites dans", SORTIE)
    print("logo:", chemin_svg())
