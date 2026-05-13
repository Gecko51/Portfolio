import { routing } from '@/i18n/routing';
// Middleware next-intl — détecte la locale via le header Accept-Language,
// redirige automatiquement / vers /fr ou /en selon la préférence du navigateur.
import createMiddleware from 'next-intl/middleware';

// createMiddleware prend la config de routing et gère la négociation de locale
export default createMiddleware(routing);

export const config = {
  // Match toutes les routes sauf : API routes, _next (assets Next.js), _vercel, fichiers statiques (ex: .ico, .svg)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
