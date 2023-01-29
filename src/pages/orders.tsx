import { tw, css } from 'twind/css';
import {buttonBaseStyle, formInnerDivStyle, formOuterDivStyle} from '../styles/styles'
import { polygon } from "wagmi/chains";
import { configureChains, createClient, WagmiConfig, useAccount, useContract, useSigner, useContractRead, erc20ABI, usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";

import { createClient as supabaseCreateClient } from '@supabase/supabase-js'
import emailjs from 'emailjs-com'
import { useForm } from "react-hook-form";
import { Web3Button, Web3Modal } from '@web3modal/react';
import Page from '@/components/page';
import { useEffect, useState } from 'react';
import { DcaCallerAddress,TimedAllowanceABI, TimedAllowanceAddress, TOKEN_INFO_MAP } from '@/constants/constants';
import { BigNumber } from 'ethers';
import { SpinnerCircularFixed } from 'spinners-react';
import Button from '@/components/button';
import Link from 'next/link';
import Modal from '@/components/modal';
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
// Create a single supabase client for interacting with your database
const supabase = supabaseCreateClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
// console.log("🚀 ~ file: app.tsx:34 ~ process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
// console.log("🚀 ~ file: app.tsx:34 ~ process.env.NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL)

const ethereumClient = new EthereumClient(wagmiClient, chains);

export default function AppWrapper() {
  return (
          <Page isApp={true}>
<WagmiConfig client={wagmiClient}>
    <Orders/>
    </WagmiConfig>
          <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeMode={'light'}
        themeColor={'default'}
      />
      <Modal/>
      <Twitter/>
    </Page>
  )
}

function Orders() {
  const {address, isConnected} = useAccount()
  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false);
  const [userOrders, setUserOrders] = useState([]);  
  useEffect(() => {
      const getUserOrders = async (address: `0x${string}`)=>{
          const userRecords = await supabase.from('dca-alpha').select("*").ilike('address',address)
        //   console.log("🚀 ~ file: orders.tsx:67 ~ getUserOrders ~ userRecords", userRecords)
          //@ts-ignore
          setUserOrders(userRecords.data)
    } 
    if (isConnected) {
        setIsDefinitelyConnected(true);
        getUserOrders(address!).then(()=> console.log("orders set")) 
    } else {
      setIsDefinitelyConnected(false);
    }
}, [address]);


    return (<div className={tw(`max-w-4xl mx-auto py-16 px-14 sm:px-6 lg:px-8 `)}>
      <h1 className={tw(`font-sans font-bold text-4xl md:text-5xl lg:text-3xl text-center leading-snug text-gray-800`)}>Your orders</h1> <br/>
        {renderList(userOrders)}
    <div className={tw(`mt-10 flex justify-center items-center w-full mx-auto`)}>
      <Link href="/app">
        <button className={tw(`${buttonBaseStyle}`)}>Place another DCA order</button>
      </Link>
    </div>
    </div>)

}

async function getUserOrders(address: `0x${string}`){
    const userRecords = await supabase.from('dca-alpha').select("*").ilike('address',address)
} 

function renderList(orders: any[]){
    if(typeof orders == "undefined" || orders.length == 0) return <div>Connected address does not have any orders</div>
    return orders?.map((item, index) => <div key={index}>Order Id: {item.id} Token In : {item.tokenIn} TokenOut : {item.tokenOut} Input Amount : {item.amountIn} Frequency : {item.frequency === '10080' ? '1 week' : item.frequency == '1440' ? '1 day' : '1 month'} Status : {item.active ? 'Active' : 'Inactive'} </div>)
    // console.log("render list called", orders)
}