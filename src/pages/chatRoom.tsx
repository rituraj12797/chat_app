
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import { io, Socket } from "socket.io-client";

import ChatBox from "@/components/chat_box/chatBox"
import { useEffect, useState } from "react"

const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

function ChatRoom() {

    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        setSocket(io("http://localhost:8000", {
            withCredentials: true
          }));
          console.log("socket");
    }, []);

    socket?.on("connect", () => {
        console.log("connected");
    })

    socket?.on("message",(data)=>{
        console.log("this is the received data ",data);
    })

    function sendMessage(){
        socket?.emit("message", "Hello from client");
    }
    return (
        <div className="flex justify-center align-center relative flex-col w-[90%] gap-[20px] h-[100%]">
            <ScrollArea className=" w-48 rounded-md relative border h-[80%] w-[100%]">
                <div className="w-[100%] chat_messages">
                  
           
                        < div className="w-[100%]" >
                            <ChatBox className={"left_chat"}/>
                            <Separator />
                        </div>
                   
                </div>
            </ScrollArea>
            <div className="h-[10%] w-[100%] bg-blue-100 flex justify-center items-center">
                <form>
                    
                </form>
            </div>
        </div>
    );
}

export default ChatRoom;