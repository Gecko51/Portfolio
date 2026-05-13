// Type Messages dérivé du JSON FR — next-intl utilise ce type pour autocomplete des clés.
import type messages from '@/messages/fr.json';

type Messages = typeof messages;

declare global {
  interface IntlMessages extends Messages {}
}

export type {};
