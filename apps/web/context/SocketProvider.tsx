'use client';
import React, { useCallback, useContext, useEffect,useState } from "react";
import { io,Socket } from "socket.io-client";
interface SocketProviderProps {
    children?: React.ReactNode
}
//utility functions
interface ISocketContext {
    sendMessage: (msg:string) => any;
}

const SocketContext = React.createContext<ISocketContext | null>(null)
// we also need to implement the objects we have made in the ISocketContext for that we will use the callback hook under the below function

//we are defining a custom hook for connecting the frontend and the backend 
export const useSocket = () => {
    const state = useContext(SocketContext);
    if (!state) {
        throw new Error("SocketProvider not found");
    }
    return state;
}


export const SocketProvider: React.FC<SocketProviderProps> = ({children}) => {
    const [socket,setSocket] = useState<Socket>();
    const sendMessage: ISocketContext['sendMessage'] = useCallback((msg)=>{
        console.log("Send Message ",msg);
        if(socket){
            socket.emit('event:message',{message:msg})
        }
    },[socket])

    useEffect(()=>{
        const _socket = io("http://localhost:8000");
        setSocket(_socket)
        return () => {
            _socket.disconnect();
            setSocket(undefined);
        }
    },[])

    return(
        <SocketContext.Provider value={{sendMessage}}>
            {children}
        </SocketContext.Provider>
    )
}