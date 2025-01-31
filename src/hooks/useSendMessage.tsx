import { useState } from "react";
import axios from "axios";
import API_URL from "../../axios/API_URL";

interface SendMessageParams {
  message: string;
  receiverId: string;
  token: string;
}

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);

  const sendMessage = async ({ message, receiverId, token }: SendMessageParams) => {
    setLoading(true);
    try {
     
      const response = await axios.post(`${API_URL}/api/messages/send`, {
        message, 
        receiverId,
       token
      });

      // Handle response here if needed
    
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };
   console.log("send +++++++++++",sendMessage)
  return { sendMessage, loading };
};


export default useSendMessage;
