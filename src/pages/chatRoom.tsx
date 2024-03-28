

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

import { io, Socket } from "socket.io-client";

import ChatBox from "@/components/chat_box/chatBox"
import { useCallback, useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { Virtuoso } from 'react-virtuoso'

import { useInfiniteQuery } from "@tanstack/react-query"
import { useInView } from 'react-intersection-observer';

const formSchema = z.object({
    textMessage: z.string().min(2).max(500),
})


type message = {
    index: number,
    chat: string
}
let chats: message[] = []
for (let index = 0; index < 10; index++) {
    chats.push({
        index: index,
        chat: `hi ${index}`
    })
}

// lower the index latest is the chat 



// when user scroll anobe we will need t use infinite query to fetch the data from redis 
function ChatRoom() {




    const virtuoso = useRef<any>(null)
    const { ref, inView, entry } = useInView({
        threshold: 0,
    })

    // const {
    //     data,
    //     fetchNextPage,
    //     hasNextPage
    // } = useInfiniteQuery({
    //     queryKey: ['projects'],
    //     queryFn: getUsers,
    //     initialPageParam: 0,
    //     getNextPageParam: (lastPage) => {
    //         if (lastPage.prevOffset + 10 > lastPage.articleCount) {
    //             return false;
    //         }

    //         return lastPage.prevOffset + 10;
    //     },
    // })
    // const articles = data?.pages.reduce((acc, page) => {
    //     return [...acc, ...page.articles]
    // }, [])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            textMessage: "",
        },
    })

    // 2. Define a submit handler.
    function submitHandler(values: z.infer<typeof formSchema>, type: string) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        sendMessage(values, type);
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

    type User = {
        name: string;
    }

    const [users, setUsers] = useState<User[]>([]); // Added type annotation for initial state

    const loadMore = useCallback(() => {

        return setTimeout(() => {
            
            setUsers((prevUsers) => [...prevUsers, ...generateUsers(10, prevUsers.length)]);
        }, 500);

    }, [setUsers]);

   useEffect(()=>{
    let v = 10
   
    virtuoso.current.scrollToIndex({
        index:v,
        align:"end",
        behavior:"smooth"
      });
   },[users])

    useEffect(() => {
        const timeout = loadMore();
        return () => clearTimeout(timeout);
    }, []);

    function generateUsers(count: number, start: number): User[] {
        
      
        return Array.from({ length: count }, (_, i) => ({
            name: `User ${start + i}`,
        }));
    }

    useEffect(() => {
      
       if (inView) {
        loadMore();
        
       }
    }, [inView])
   console.log(users)













    // function increaseChat() {
    //     for (let index = chats.length; index < chats.length+10; index++) {
    //         chats.push({
    //             index:index,
    //             chat:`hi ${index}`
    //         })
    //   }
    // }

    {/* Duplicate messages were received due to adding the event listener multiple times on the client side, often within a React functional component, without removing previous listeners. To resolve, ensure setting up the listener once during component mount and implement cleanup using React's useEffect hook, preventing redundant event registrations and duplicate message reception. */ }
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





    function sendMessage(message: z.infer<typeof formSchema>, type: string) {
        console.log("this is the message from client", message);
        if (type === "message") {
            socket?.emit("message", { text: message.textMessage, type: "client" });
        }
        else if (type === "broadcast") {
            socket?.emit("broadcast", message.textMessage);
        }
    }
    return (
        <div className="flex justify-center align-center relative flex-col w-[90%] gap-[20px] h-[100%]">
            <ScrollArea className=" w-48 rounded-md relative border w-[100%] h-[100%]" >
                <div className="w-[100%] chat_messages h-[100%]">
                    < div className="w-[100%] h-[100%]" >
                        <Virtuoso
                            style={{ height: '650px', width: "100%", display: "flex" }}
                            data={users}
                            ref={virtuoso}
                            initialTopMostItemIndex={users.length-1}
                            itemContent={(index) => {
                                index = users.length - 1 - index
                                return <div>
                                     {
                                        (index===users.length - 1) && (<div ref={ref}>  </div>)
                                     }
                                     <div  className={`h-[80px] w-[200px]   ${index===(users.length-1) ? "bg-green-600":"bg-red-600"}`}>{users[index].name}</div>
                                </div>
                            }}
                        />
                        {/*  we were unable to reverse the virtuso so hat we will do is we will diaply the chats n reverse order at the client side and add the listener to 0th index to add more mesages or fetch infiinite query when the user reaches 0 it will fetch and then re assign all the index */}
                    </div>
                    <div className="bottom_chat_indicator">{inView}</div>

                </div>
            </ScrollArea>
            <div className="w-[100%] bg-blue-100 flex justify-center items-center">

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
                            submitHandler(form.getValues(), "message")
                        }}>Submit </Button>
                        <Button type="submit" onClick={(event) => {
                            event.preventDefault();
                            submitHandler(form.getValues(), "broadcast")
                        }}>broadcast room 1</Button>
                    </form>
                </Form>

            </div>
        </div>
    );
}

export default ChatRoom;