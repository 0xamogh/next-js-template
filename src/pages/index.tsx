import { NextSeo } from 'next-seo';
import Page from '@/components/page';
import Header from '@/components/header';
import Twitter from '@/components/twitter';


export default function Home() {
  return (
    <Page isApp={false}>
      <NextSeo
        title="dca.cash"
        description="📈 Dollar Cost Average into your favourite crypto assets"
        openGraph={{
          url: 'https://dca.cash',
          title: '📈 Dollar Cost Average into your favourite crypto assets',
          description:' ',
          images: [
            {
              url: 'https://i.ibb.co/FKK8SCK/Screenshot-from-2022-12-29-12-22-51.png',// 'https://i.ibb.co/gm6r9b1/Screenshot-from-2022-12-29-12-03-58.png', //'https://i.ibb.co/sW20VtP/landing-page.png',
              width: 800,
              height: 600,
              alt: 'Og Image Alt',
              type: 'image/png',
            },
          ],
        }}
        twitter={{
          handle: '@0xamogh',
          cardType: 'summary_large_image',
        }}
      />
      <Header />
      <Twitter/>
  </Page>
  );
}
