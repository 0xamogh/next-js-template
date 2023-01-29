import Head from 'next/head';
import Navigation from '@/components/navigation';
import { tw } from 'twind';

interface IProps {
  children: React.ReactNode;
  isApp?: boolean
}

const Page = ({ children, isApp }: IProps) => (
  <div>
    <Head>
      <link rel="icon" href="/dollar_ios.png" />
    </Head>
    <div className={tw(`min-h-screen flex flex-col`)}>
      <Navigation isApp={isApp}/>
      {children}
    </div>
  </div>
);

export default Page;
