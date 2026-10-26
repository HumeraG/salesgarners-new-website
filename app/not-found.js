import Header from '@/components/client/Header';
import Footer from '@/components/Footer';
import { BtnP, PageHero } from '@/components/ui';

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <PageHero eb="404" title="This page doesn’t exist" lead="The link may be old or mistyped. Head back to the home page to keep exploring." center><BtnP href="/">Back to home</BtnP></PageHero>
      </main>
      <Footer />
    </>
  );
}
