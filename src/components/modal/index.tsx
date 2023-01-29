import React, { useState } from 'react';
import { tw } from 'twind';
import emailjs from 'emailjs-com'
import { buttonBaseStyle } from '@/styles/styles';

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setFeedback('');
    setIsOpen(false);
  };

  const handleSubmit = (e :any) => {
    e.preventDefault();
    // code to submit feedback
    if(feedback.length > 5){
    emailjs.send(process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID!, process.env.NEXT_PUBLIC_FEEDBACK_EMAIL_ID!, {message : feedback}, process.env.NEXT_PUBLIC_EMAIL_KEY!)
      .then((result) => {
          console.log(result.text);
      }, (error) => {
          console.log(error.text);
      });
}
    setFeedback('');
    handleClose();
  };
  
const modalContainer = "flex flex-row fixed bottom-5 left-5 rounded-full cursor-pointer bg-white";
const modal = "absolute bottom-0 left-0 w-300 h-200 bg-white shadow-md p-2";
const open = "block";
const textarea = "w-200 h-300  text-base rounded-md border border-gray-400";
const modalFooter = "text-center";
const button = "py-2 px-4 font-medium bg-blue-500 text-white border border-white hover:bg-blue-600 hover:text-white rounded-md mr-2 cursor-pointer";


  return (
<div className={tw(`modal-container ${modalContainer}`)} onClick={handleOpen}>
    {!isOpen ? <button className={tw(`modal-container items-center ${modalContainer} bg-white p-2 text-black hover:underline`)}>Submit feedback</button> : ``}
  {isOpen && <div className={tw(`${modal} ${isOpen ? open : ''} `)}>
    <form onSubmit={handleSubmit}>
      <textarea
        placeholder="Type here..."
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className={textarea}
      />
      <div className={tw(`modal-footer ${modalFooter}`)}>
        <button onClick={handleClose} className={tw(`${buttonBaseStyle} py-0 px-2 border-transparent`)}>Cancel</button>
        <button type="submit" className={tw(`${buttonBaseStyle} py-0 px-2 border-transparent`)}>Submit</button>
      </div>
    </form>
  </div>}
</div>

  );
};

export default Modal;
