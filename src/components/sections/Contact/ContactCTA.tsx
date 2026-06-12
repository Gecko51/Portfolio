'use client';

// CTA contact avec magnetic effect GSAP — desktop avec pointer fine uniquement.
// Mobile / reduced-motion : lien statique sans transform.
// Tracking analytics appelé au onClick (avant que le navigateur quitte la page).
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { ReactNode } from 'react';
import { useRef } from 'react';

import { track } from '@/lib/analytics';

type ContactCTAProps = {
  href: string;
  ariaLabel: string;
  label: string;
  value: string;
  // Identifiant Plausible event (ex: 'click_contact_email').
  trackEvent: string;
  // Cible externe ou non — _blank si externe, undefined sinon (mailto stay in tab).
  external?: boolean;
  // Slot icône optionnel (SVG inline, lucide, etc).
  icon?: ReactNode;
};

// Fraction de la distance curseur→centre appliquée en translation. Volontairement faible (0.12)
// pour un effet magnétique discret et non « lurch » sur un lien pleine largeur.
const MAGNETIC_STRENGTH = 0.12;

export function ContactCTA({
  href,
  ariaLabel,
  label,
  value,
  trackEvent,
  external,
  icon,
}: ContactCTAProps) {
  // Ref vers le <a> pour appliquer le transform GSAP.
  const linkRef = useRef<HTMLAnchorElement>(null);

  // useGSAP gère le cleanup auto au démontage (DEV-RULES §1).
  useGSAP(
    () => {
      // Check media query côté JS — magnetic uniquement desktop pointer fine + sans reduced-motion.
      const supportsMagnetic = window.matchMedia('(min-width: 768px) and (pointer: fine)').matches;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!supportsMagnetic || prefersReducedMotion) return;

      const el = linkRef.current;
      if (!el) return;

      // quickTo : setters LISSÉS (ils tweenent vers la cible au lieu de la poser instantanément).
      // duration 0.5 + power3.out → le lien suit le curseur avec un léger retard doux,
      // cohérent avec le damping du curseur custom et le scrub Lenis du reste de la page.
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });

      // Au mousemove dans la zone du lien, on retargette le tween vers la position du curseur.
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * MAGNETIC_STRENGTH;
        const y = (e.clientY - (rect.top + rect.height / 2)) * MAGNETIC_STRENGTH;
        xTo(x);
        yTo(y);
      };

      // Au mouseleave on revient à 0 avec le même easing doux (plus de rebond élastique).
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);

      // Cleanup explicite (useGSAP nettoie GSAP tweens, mais pas les listeners DOM natifs).
      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    },
    { scope: linkRef },
  );

  // onClick : track AVANT la navigation, en mode synchrone (Plausible utilise sendBeacon en interne).
  const handleClick = () => {
    track(trackEvent);
  };

  return (
    <a
      ref={linkRef}
      href={href}
      aria-label={ariaLabel}
      onClick={handleClick}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="group flex items-center justify-between gap-6 border-b border-border py-8 transition-colors hover:border-fg"
    >
      <span className="flex items-baseline gap-4">
        <span className="font-mono text-xs uppercase tracking-wider text-fg-muted">{label}</span>
        <span className="font-display text-3xl italic transition-colors group-hover:text-accent md:text-5xl">
          {value}
        </span>
      </span>
      {icon ? (
        // aria-hidden masque l'icône aux screen readers — l'aria-label du <a> couvre déjà l'intention.
        <span
          aria-hidden="true"
          className="text-fg-muted transition-transform group-hover:translate-x-1"
        >
          {icon}
        </span>
      ) : null}
    </a>
  );
}
