import React, { useState } from 'react';
import { tw } from 'twind';
import TwitIcon from "../../../public/twitter.svg"
const Twitter = () => {

const modalContainer = "flex flex-row fixed bottom-5 right-5 rounded-full cursor-pointer bg-white";
const button = "font-medium text-white rounded-full mr-2 cursor-pointer";


  return (
    <a href='https://twitter.com/intent/follow?screen_name=0xamogh' target="_blank">
<div className={tw(`modal-container items-center ${modalContainer} bg-black p-2`)} >
    <TwitIcon className={tw(`p`)}/>
    <p className={tw(`hover:underline text-white font-medium pr-2`)}>@0xamogh</p>
</div>
    </a>

  );
};

export default Twitter;
