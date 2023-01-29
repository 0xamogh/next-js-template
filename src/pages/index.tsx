import { NextSeo } from 'next-seo';
import Page from '@/components/page';
import Header from '@/components/header';
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createClient, WagmiConfig, useAccount } from "wagmi";
import { polygon } from "wagmi/chains";
import Twitter from '@/components/twitter';

const chains = [polygon];
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!
const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: projectId }),
]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "web3Modal", chains }),
  provider,
});

// Web3Modal Ethereum Client
const ethereumClient = new EthereumClient(wagmiClient, chains);
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
