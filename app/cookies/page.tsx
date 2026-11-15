import {legalConfig} from '../../components/legal/legal-config';
import LegalPage from '../../components/legal/LegalPage';
import {normalizeLegalLang,legalTitle} from '../../components/legal/legal-shared';
type Props = {searchParams: Promise<{lang?:string|string[]}>};
export async function generateMetadata({searchParams}:Props){const q=await searchParams;const lang=normalizeLegalLang(typeof q.lang==='string'?q.lang:undefined);return {title:legalTitle('cookies',lang),alternates:{canonical:`/cookies?lang=${lang}`},robots:{index:!legalConfig.draft,follow:!legalConfig.draft}};}
export default async function Page({searchParams}:Props){const q=await searchParams;return <LegalPage kind="cookies" lang={normalizeLegalLang(typeof q.lang==='string'?q.lang:undefined)}/>;}
