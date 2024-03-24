

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import { io, Socket } from "socket.io-client";

import ChatBox from "@/components/chat_box/chatBox"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    textMessage: z.string().min(2).max(500),
})
function ChatRoom() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            textMessage: "",
        },
    })

    // 2. Define a submit handler.
    function submitHandler(values: z.infer<typeof formSchema>,type:string) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        sendMessage(values,type);
    }

    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        const newSocket = io("http://localhost:8000", {
            withCredentials: true
        });
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on("message", (data) => {
                console.log("Received data from the server:", data);
            });
            socket.on("broadcast", (data) => {
                console.log("Received data from the server:", data);
            })
        }

        return () => {
            if (socket) {
                socket.off("message");
            }
        };
    }, [socket]);


    {/* Duplicate messages are received due to adding the event listener multiple times on the client side, often within a React functional component, without removing previous listeners. To resolve, ensure setting up the listener once during component mount and implement cleanup using React's useEffect hook, preventing redundant event registrations and duplicate message reception. */ }
    // useEffect(() => {
    //     setSocket(io("http://localhost:8000", {
    //         withCredentials: true
    //       }));
    //       console.log("socket");
    // }, []);

    // socket?.on("connect", () => {
    //     console.log("connected");
    // })

    // socket?.on("message",(data)=>{
    //     console.log("this is the received data ",data);
    // })





    function sendMessage(message:z.infer<typeof formSchema>,type:string) {
        console.log("this is the message from client", message);
        if(type === "message"){
            socket?.emit("message", message.textMessage);
        }
        else if(type === "broadcast"){
            socket?.emit("broadcast", message.textMessage);
       }
    }
    return (
        <div className="flex justify-center align-center relative flex-col w-[90%] gap-[20px] h-[100%]">
            <ScrollArea className=" w-48 rounded-md relative border h-[0%] w-[100%]">
                <div className="w-[100%] chat_messages">


                    < div className="w-[100%]" >
                        <ChatBox className={"left_chat"} />
                        <Separator />
                    </div>

                </div>
            </ScrollArea>
            <div className="h-[10%] w-[100%] bg-blue-100 flex justify-center items-center">

                <Form {...form}>
                    <form onSubmit={(event) => {
                        event.preventDefault();
                    }} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="textMessage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="type your message here " {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" onClick={(event) => {
                            event.preventDefault();
                            submitHandler(form.getValues(),"message")
                        }}>Submit </Button>
                        <Button type="submit" onClick={(event) => {
                            event.preventDefault();
                            submitHandler(form.getValues(),"broadcast")
                        }}>broadcast all</Button>
                    </form>
                </Form>

            </div>
        </div>
    );
}

export default ChatRoom;