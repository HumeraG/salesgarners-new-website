import LegalPage from '@/components/LegalPage';
import { SG } from '@/lib/content';

export const metadata = { title: 'Privacy Policy' };
export default function Page() { return <LegalPage title="Privacy Policy" sections={SG.privacy} />; }
