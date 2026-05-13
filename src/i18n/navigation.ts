// Wrappers typés pour Link, useRouter, redirect, usePathname, getPathname.
// DEV-RULES §10 : TOUJOURS importer ces exports dans le projet, jamais next/link ou next/navigation.
import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// createNavigation génère des composants/hooks conscients de la locale active
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
