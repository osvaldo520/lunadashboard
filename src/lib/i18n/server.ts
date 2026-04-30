import { cookies } from 'next/headers';
import ptBR from './locales/pt-BR.json';
import en from './locales/en.json';

export type Locale = 'pt-BR' | 'en';

const dictionaries: Record<Locale, Record<string, any>> = { 'pt-BR': ptBR, 'en': en };

function resolve(dict: Record<string, any>, key: string): string {
  const parts = key.split('.');
  let current: any = dict;
  for (const part of parts) {
    if (current == null || typeof current !== 'object') return key;
    current = current[part];
  }
  return typeof current === 'string' ? current : key;
}

/** Server-side: read locale from cookie */
export async function getServerLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const val = cookieStore.get('judite-locale')?.value;
  if (val === 'en' || val === 'pt-BR') return val;
  return 'pt-BR';
}

/** Server-side t() */
export function createT(locale: Locale) {
  return (key: string): string => {
    const value = resolve(dictionaries[locale], key);
    if (value === key && locale !== 'pt-BR') return resolve(dictionaries['pt-BR'], key);
    return value;
  };
}
