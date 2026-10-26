import LegalPage from '@/components/LegalPage';
import { SG } from '@/lib/content';

export const metadata = { title: 'Terms & Conditions' };
export default function Page() { return <LegalPage title="Terms And Conditions" sections={SG.terms} />; }
