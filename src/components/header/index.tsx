import { tw, css } from 'twind/css';
import Uniswap from '@/constants/svg/uniswap.svg';
import Gelato from '@/constants/svg/gelato.svg';
import Link from 'next/link';
import Button from '../button'

import { buttonBaseStyle } from '@/styles/styles';
import {supabase} from '@/utils/supabase'
const headerStyle = css`
  background-color:bg-blue;
  min-height: calc(100vh - 6rem);
`;

export default function Header(){

  return (<header className={tw(headerStyle)}>
    <div className={tw(`max-w-4xl mx-auto py-16 px-14 sm:px-6 lg:px-8`)}>
      <h1 className={tw(`font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-center leading-snug text-gray-800`)}>
        Non-custodial DCA from your wallet. <br/>
        Fully on chain.
      </h1>
      <div className={tw(`max-w-xl mx-auto`)}>
        <p className={tw(`mt-10 text-gray-400 text-center text-xl lg:text-l`)}></p>
      </div>
      <div className={tw(`mt-10 flex justify-center items-center w-full mx-auto`)}>
        <Link href="/app">
          <Button primary>Try our Polygon beta</Button>
        </Link>
      </div>
    </div>

    <div className={tw(`flex justify-center w-full`)}>
      <div className={tw(`mt-4 w-full`)}>
        <p className={tw(`font-mono uppercase text-center font-medium text-sm text-gray-600`)}>Powered by</p>
        <div className={tw(`flex items-center justify-center mx-auto flex-wrap`)}>
          <Gelato className={tw(`m-12`)} width={140} />
          <Uniswap className={tw(`m-12`)} width={140} />
        </div>
      </div>
    </div>
  </header>)
};