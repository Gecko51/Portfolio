// Experience — wrapper RSC : traduit les textes, construit les data items, compose la Timeline.
// Cf. PRD §3 Module 4.
import { getTranslations } from 'next-intl/server';

import type { ExperienceItem } from '@/types/experience';

import { Timeline } from './Timeline';
import { TimelineItem } from './TimelineItem';
import { TimelineMilitary } from './TimelineMilitary';

export async function Experience() {
  const t = await getTranslations('Experience');

  // Construction typée des items à partir des messages i18n.
  const geckoMind: ExperienceItem = {
    period: t('geckoMindPeriod'),
    role: t('geckoMindRole'),
    organization: t('geckoMindOrg'),
    description: t('geckoMindDescription'),
    stack: ['Python', 'LangChain', 'FastAPI', 'Claude Code', 'Supabase', 'Next.js'],
    variant: 'main',
  };

  // Gecko Design — activité web/SEO 2024-2025 (cf. CV), entre la reconversion et Gecko Mind.
  const geckoDesign: ExperienceItem = {
    period: t('geckoDesignPeriod'),
    role: t('geckoDesignRole'),
    organization: t('geckoDesignOrg'),
    description: t('geckoDesignDescription'),
    stack: ['WordPress', 'PHP', 'JavaScript', 'SEO'],
    variant: 'main',
  };

  const army: ExperienceItem = {
    period: t('armyPeriod'),
    role: t('armyRole'),
    organization: t('armyOrg'),
    description: t('armyDescription'),
    variant: 'compact',
  };

  const softSkills = [
    t('softSkillManagement'),
    t('softSkillFormation'),
    t('softSkillPilotage'),
    t('softSkillDecision'),
  ] as const;

  return (
    <section id="experience" className="relative px-6 py-32 md:py-48">
      <div className="mx-auto max-w-5xl flex flex-col gap-16">
        <header className="flex flex-col gap-3">
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            {t('kicker')}
          </span>
          <h2 className="font-display text-4xl md:text-6xl tracking-tight italic">{t('title')}</h2>
        </header>
        <Timeline>
          <TimelineItem item={geckoMind} />
          <TimelineItem item={geckoDesign} />
          <TimelineMilitary
            item={army}
            softSkillsKicker={t('softSkillsKicker')}
            softSkills={softSkills}
          />
        </Timeline>
      </div>
    </section>
  );
}
