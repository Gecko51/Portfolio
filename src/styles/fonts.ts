// Déclarations next/font — polices auto-hébergées, optimisé CLS=0 (DEV-RULES §1).
// Display = Instrument Serif italique (fallback gratuit pour Migra, cf. PRD §8 hypothèse).
import { GeistSans } from 'geist/font/sans';
import { Instrument_Serif, JetBrains_Mono } from 'next/font/google';

// Polices de display : Instrument Serif avec support italic et normal.
export const fontDisplay = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

// Polices monospace : JetBrains Mono avec poids régulier et semi-bold pour la lisibilité du code.
export const fontMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
  display: 'swap',
});

// GeistSans est exporté directement : elle gère sa propre variable CSS (--font-geist-sans).
// Pas besoin d'appel constructeur, elle s'utilise telle quelle en layout.
export const fontBody = GeistSans;
