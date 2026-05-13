// Configuration Next.js — plugin next-intl + headers de sécurité (DEV-RULES §7).
// Les security headers complets seront ajoutés à la Task 15.
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Initialise le plugin next-intl en pointant vers le fichier de config par requête
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default withNextIntl(nextConfig);
