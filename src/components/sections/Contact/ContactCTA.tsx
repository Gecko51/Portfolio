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

// Distance max (px) de translation du lien vers le curseur.
const MAGNETIC_STRENGTH = 0.25;

export function ContactCTA({ href, ariaLabel, label, value, trackEvent, external, icon }: ContactCTAProps) {
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

      // Quick setters GSAP — meilleure perf que gsap.to() à chaque mousemove.
      const setX = gsap.quickSetter(el, 'x', 'px');
      const setY = gsap.quickSetter(el, 'y', 'px');

      // Au mousemove dans la zone du lien, on déplace l'élément vers le curseur.
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - (rect.left + rect.width / 2)) * MAGNETIC_STRENGTH;
        const y = (e.clientY - (rect.top + rect.height / 2)) * MAGNETIC_STRENGTH;
        setX(x);
        setY(y);
      };

      // Au mouseleave on revient à la position initiale avec easing.
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
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
      {icon ? <span className="text-fg-muted transition-transform group-hover:translate-x-1">{icon}</span> : null}
    </a>
  );
}
