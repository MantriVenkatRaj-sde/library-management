import { createContext, useContext, useState } from "react";

export const ChatContext=createContext();

export const ChatProvider=({children})=>{
    const [clubName,setClubName]=useState("");
    const [userName,setUserName]=useState("");
    const [connected,setConnected]=useState(false);
    const forgetUser=()=>{
    setClubName("");
    setUserName("");
    setConnected(false);
    }
    return (
        <ChatContext.Provider value={{clubName,setClubName,userName,setUserName,connected,setConnected,forgetUser}}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext=()=>{
   const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used inside a ChatProvider");
  return ctx;
};


