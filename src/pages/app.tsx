import { tw, css } from 'twind/css';
import {buttonBaseStyle, disabledButtonStyle, formElement, formInnerDivStyle, formOuterDivStyle} from '../styles/styles'
import { polygon } from "wagmi/chains";
import { configureChains, createClient, WagmiConfig, useAccount, useSigner, useContractRead, erc20ABI, usePrepareContractWrite, useContractWrite, useWaitForTransaction, useFeeData } from "wagmi";
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
import { DcaCallerABI, DcaCallerAddress,TimedAllowanceABI, TimedAllowanceAddress, TOKEN_INFO_MAP } from '@/constants/constants';
import { BigNumber, ethers } from 'ethers';
import { SpinnerCircularFixed } from 'spinners-react';
import Button from '@/components/button';
import Link from 'next/link';
import Modal from "../components/modal"
import Twitter from "../components/twitter";
import { secondaryColorDefaultProps } from 'spinners-react/lib/esm/helpers';
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
// const gelatoOps = new GelatoOpsSDK(polygon.id, signer);
const ethereumClient = new EthereumClient(wagmiClient, chains);
export default function AppWrapper() {
  return (
          <Page isApp={true}>
<WagmiConfig client={wagmiClient}>
    <App/>
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

function App() {
  const {address, isConnected} = useAccount()
  const [isDefinitelyConnected, setIsDefinitelyConnected] = useState(false);
  const { register, handleSubmit, watch } = useForm();
  const [isApproved, setIsApproved] = useState(false);
  const { data: signer } = useSigner()
  const [inputAmount, setInputAmount] = useState(watch("inputAmount"))
  const [monitorTxHash, setMonitorTxHash] = useState<`0x${string}` | null>();
  const [submitData, setSubmitData] = useState<Object | null>();
  const [flowComplete, setFlowComplete] = useState<boolean | null>(false)

  // const [maticBalance, setMaticBalance] = useState(BigNumber.from(0));
  // assume true then useEffect will fill the correct value
  const [hasEnoughMaticBalance, setHasEnoughMaticBalance] = useState(true);
  // console.log("🚀 ~ file: app.tsx:54 ~ App ~ isApproved", isApproved)
  // console.log("🚀 ~ file: app.tsx:67 ~ App ~ maticBalance", hasEnoughMaticBalance)
  const {config : approveConfig} = usePrepareContractWrite({
    address: TOKEN_INFO_MAP[watch("tokenIn")]?.address,
    abi: erc20ABI,
    functionName: 'approve',
    args:[TimedAllowanceAddress, BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")],
  })
  const {config : setApprovalTimerConfig} = usePrepareContractWrite({
    address:DcaCallerAddress,
    abi: DcaCallerABI,
    functionName:'createTask',
    args: [TOKEN_INFO_MAP[watch("tokenIn")]?.address,TOKEN_INFO_MAP[watch("tokenOut")]?.address,inputAmount,watch("frequency")],
    overrides : {
      value: ethers.utils.parseEther("10"),
    },
    enabled: isApproved
  })

  const {data: approvalData, isLoading: isApproveLoading,isSuccess: isApproveSuccess, write: approve, status: approvalStatus } = useContractWrite(approveConfig)
  // console.log("🚀 ~ file: app.tsx:73 ~ App ~ approve", approve)
  // console.log("🚀 ~ file: app.tsx:69 ~ App ~ data", data)
  // console.log("🚀 ~ file: app.tsx:69 ~ App ~ isApproveSuccess", isApproveSuccess)
  // console.log("🚀 ~ file: app.tsx:69 ~ App ~ approvalStatus", approvalStatus)
  // console.log("🚀 ~ file: app.tsx:69 ~ App ~ isApproveLoading", isApproveLoading)
  const { data: setApprovalTimerData,isLoading: isSetApprovalTimerLoading,isSuccess: isSetApprovalTimerSuccess, write: setApprovalTimer, status: setApprovalTimerStatus } = useContractWrite(setApprovalTimerConfig)
  
  const { data:selectedTokenAllowance } = useContractRead({
    address: TOKEN_INFO_MAP[watch("tokenIn")]?.address,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [address!, TimedAllowanceAddress],
    watch: true,
  })

  useEffect(() => {
    if (isConnected) {
      setIsDefinitelyConnected(true);
    } else {
      setIsDefinitelyConnected(false);
    }
  }, [address]);

  useEffect(() => {
    const getBalance = async () => {
      const balance = await signer?.getBalance()
      const maticCompare = balance?.gte(ethers.utils.parseEther("10"))
      setHasEnoughMaticBalance(maticCompare!)
    }
    getBalance()

  },[signer, approvalStatus, setApprovalTimerStatus])
  useEffect(() => {
    if(!hasEnoughMaticBalance && isApproved){
      window.alert("You need to deposit 10 MATIC in order to pay for tx gas")
    } 
  },[hasEnoughMaticBalance, isDefinitelyConnected])
  
  // useEffect(() => {
  // }, [watch("inputAmount")])

  useEffect(() => {
    const inputAmountString = watch("inputAmount") + "0".repeat(TOKEN_INFO_MAP[watch("tokenIn")]?.decimals)
    // console.log("🚀 ~ file: app.tsx:111 ~ useEffect ~ inputAmountString", inputAmountString)
    const value = BigNumber.from(inputAmountString != "undefined" ? inputAmountString : "0")
    // console.log("🚀 ~ file: app.tsx:102 ~ useEffect ~ value", value, selectedTokenAllowance)
    // console.log("🚀 ~ file: app.tsx:104 ~ useEffect ~ selectedTokenAllowance! > value", selectedTokenAllowance! > value)
    if(selectedTokenAllowance?.gt(value) ){
      setIsApproved(true)
    } else {
      setIsApproved(false)
    }
    setInputAmount(value)
  }, [selectedTokenAllowance, watch("inputAmount")])
  // console.log("🚀 ~ file: app.tsx:101 ~ useEffect ~ inputAmount", inputAmount)
  // console.log("🚀 ~ file: app.tsx:106 ~ App ~ selectedTokenAllowance", selectedTokenAllowance)

  
  const {data: watchTxData, isError: isWatchTxError, isLoading: isWatchTxLoading, isSuccess: isWatchTxSuccess} = useWaitForTransaction({hash: monitorTxHash!})
  useEffect(() => setMonitorTxHash(setApprovalTimerData?.hash),[setApprovalTimerStatus])
  useEffect(() => setMonitorTxHash(approvalData?.hash),[approvalStatus])

  useEffect(() => {
    if(!isWatchTxLoading && isWatchTxSuccess && monitorTxHash && watchTxData?.to.toLowerCase() === DcaCallerAddress.toLowerCase()){
      submitForm({...Object(submitData)})
      setFlowComplete(true)
      setMonitorTxHash(null)
    }
  }, [isWatchTxLoading])
  
  const clearForm = () => {
    setFlowComplete(false)
    setSubmitData(null)
  }
  const onSubmit = !isApproved ? () =>  approve?.() : (hasEnoughMaticBalance ? (data :any) => {
    if(data.tokenIn === data.tokenOut){
      window.alert("Input token and output token cannot be the same")
      return
    }
    console.log("submitting data", data, setApprovalTimer)
    setSubmitData(data)
    setApprovalTimer?.() 
  } : () => window.alert("You need to deposit 10 MATIC in order to pay for tx gas"))
  
    return flowComplete ? (<div className={tw(`max-w-4xl mx-auto py-16 px-14 sm:px-6 lg:px-8 `)}>
      <h1 className={tw(`font-sans font-bold text-4xl md:text-5xl lg:text-6xl text-center leading-snug text-gray-800`)}>You are all set!</h1>
      <h1 className={tw(`p-4 flex justify-center`)}> Your order will be processed soon! Thank you for trying out 💵dca.cash!</h1>
    <div className={tw(`mt-10 flex justify-center items-center w-full mx-auto`)}>
      <Link href="/orders">
        <Button onclick={clearForm}>View your orders</Button>
      </Link>
      </div>
    </div>)
    :
    (
        <div className={tw(`flex flex-col items-center justify-center`)}>
      <h1 className={tw(`font-sans font-bold text-4xl md:text-5xl lg:text-3xl text-center leading-snug text-gray-800`)}>Choose your DCA configuration</h1>
          <form onSubmit={handleSubmit(onSubmit)} className={tw(`flex flex-col max-w-xl p-10`)} method="post">
         {isDefinitelyConnected && <div className={tw(formOuterDivStyle)}>
        <label htmlFor="userAddress" className={tw(formInnerDivStyle)}>Your Address: </label>  
          <input {...register("userAddress")} className={tw(`border border-white ${formInnerDivStyle} ${formElement}`)} value={address} readOnly></input>
          </div>}

        <div className={tw(formOuterDivStyle)}>
        <label htmlFor="inputAmount" className={tw(formInnerDivStyle)}>DCA Amount: </label>  
          <input {...register("inputAmount", {required: true, pattern: /^[0-9]/})}   type="number" defaultValue={"10"} className={tw(`${formInnerDivStyle} ${formElement}`)}></input>
          </div>
          
          <div className={tw(formOuterDivStyle)}>
        <label htmlFor="tokenIn" className={tw(formInnerDivStyle)}>Input Token:</label>
        <select {...register("tokenIn")} className={tw(`${formInnerDivStyle} ${formElement}`)} name="tokenIn">
          <option value="USDC">USDC</option>
          {/* <option value="DAI">DAI</option>
          <option value="USDT">USDT</option> */}
        </select>  
        </div>
                  <div className={tw(formOuterDivStyle)}>

        <label htmlFor="tokenOut" className={tw(formInnerDivStyle)}>Output Token:</label>
        <select {...register("tokenOut")} name="tokenOut" className={tw(`${formInnerDivStyle} ${formElement}`)}>
          <option value="ETH">ETH</option>
          <option value="MATIC">MATIC</option>
          {/* <option value="WBTC">WBTC</option> */}
        </select>
        </div>
          <div className={tw(formOuterDivStyle)}>
          <label htmlFor="frequency" className={tw(formInnerDivStyle)}>DCA frequency : </label>
        <select {...register("frequency")} name="frequency" className={tw(`${formInnerDivStyle} ${formElement}`)}>
          <option value="86400">Every day</option>
          <option value="604800">Every week</option>
          <option value="2628000">Every month</option>
        </select>
        </div>
        <div className={tw(`pt-6 flex justify-center`)}>
        {isDefinitelyConnected ? 
            (isApproveLoading || isSetApprovalTimerLoading || isWatchTxLoading) ? 
                <SpinnerCircularFixed size={51} thickness={112} speed={100} color="rgba(57, 105, 172, 1)" secondaryColor="rgba(0, 0, 0, 0.44)" /> 
                : <button type="submit" className={ tw(`${buttonBaseStyle} ${isApproved && !hasEnoughMaticBalance && hasEnoughMaticBalance != undefined ? disabledButtonStyle : '' }`)  } >{isApproved ? (!hasEnoughMaticBalance && hasEnoughMaticBalance != undefined ? 'Not enough MATIC' : 'Start DCA') : 'Approve'}</button> 
            : <Web3Button icon='hide' balance='show'/>}
        </div>
        </form>
      </div> 
)
}
function submitForm(event: {[key:string]:string}){
    supabase.from('dca-alpha').insert([{address: event.userAddress, tokenIn: event.tokenIn, tokenOut: event.tokenOut, amountIn:event.inputAmount,  frequency: event.frequency}]).then(() => {
    emailjs.send(process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID!, process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID!, event, process.env.NEXT_PUBLIC_EMAIL_KEY!)
      .then((result) => {
          // console.log(result.text);
      }, (error) => {
          // console.log(error.text);
      })});
}