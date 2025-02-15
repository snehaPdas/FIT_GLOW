import React from 'react'
import { BsSend } from "react-icons/bs";
import { useState, } from 'react';
import useSendMessage from '../../hooks/useSendMessage';
import { RootState } from '../../app/store';
import { useSelector } from 'react-redux';
import { useSocketContext } from '../../context/socket';



interface MessageInputBarProps {
  userId?: string;
  onNewMessage: (message: any) => void;
}

function MessageInputBar({ userId, onNewMessage }: MessageInputBarProps) {
    const [message, setMessage] = useState('');
    const { sendMessage } = useSendMessage();
    const trainerToken=localStorage.getItem("trainer_access_token")
    const { socket } = useSocketContext();  // Get socket from context
    const {  trainerInfo } = useSelector((state: RootState) => state.trainer);
    const validToken = trainerToken ?? ""; 
    const   handleSendMessage = async (e: React.FormEvent<HTMLElement>) => {
      
   e.preventDefault()
   if (!message) return;
    const receiverId = userId ?? "defaultUserId"
    try{
    const newMessage = {
      message,
      receiverId,
      senderModel: "Trainer",
      createdAt: new Date().toISOString(),
      userId: trainerInfo.id
  };
  if (socket) {
    socket.emit("sendMessage", newMessage);  
} else {
    console.error("Socket is not initialized");
}
  
 
  onNewMessage(newMessage);
  setMessage(""); 
  await sendMessage({ message, receiverId, token:validToken });
}catch(error){
  console.error("Error sending message:", error);

}
  
    }

    
  return (
    <form onSubmit={handleSendMessage} className="relative w-full">
    <input
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        type="text"
        className="border text-sm rounded-lg block w-full p-2.5 pr-10 bg-gray-700 border-gray-600 text-white"
        placeholder="Send a message"
    />
    <button
        type="submit"
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-white"
    >
        <BsSend />
    </button>
</form>
  )
}

export default MessageInputBar
