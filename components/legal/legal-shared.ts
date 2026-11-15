import content from './legal-content.json';
import ui from './legal-ui.json';
export {content,ui};
export type LegalLang = keyof typeof content;
export type LegalKind = 'terms' | 'privacy' | 'cookies' | 'identity';
export const languages = Object.keys(content) as LegalLang[];
export const paths: Record<LegalKind,string> = {terms:'/obchodne-podmienky',privacy:'/ochrana-osobnych-udajov',cookies:'/cookies',identity:'/identifikacia'};
export function normalizeLegalLang(v?: string): LegalLang {const k=v==='cs'?'cz':v;return languages.includes(k as LegalLang)?k as LegalLang:'sk';}
export function legalHref(kind:LegalKind,lang:LegalLang){return `${paths[kind]}?lang=${lang}`;}
export function legalTitle(kind:LegalKind, lang:LegalLang){return kind==='terms'?content[lang].termsTitle:kind==='privacy'?content[lang].privacyTitle:kind==='cookies'?ui[lang].cookiesTitle:ui[lang].identityTitle;}
