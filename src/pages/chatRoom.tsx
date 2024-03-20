
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


import ChatBox from "@/components/chat_box/chatBox"

const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-beta.${a.length - i}`
)

function ChatRoom() {
    return (
        <div className="flex justify-center align-center relative flex-col w-[90%] gap-[20px] h-[100%]">
            <ScrollArea className=" w-48 rounded-md relative border h-[80%] w-[100%]">
                <div className="w-[100%]">
                    <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
                    {tags.map((tag,i) => (
                        < div className="w-[100%]">
                            <ChatBox className={ (i%2) ? "right_chat":"left_chat"}/>
                            <Separator />
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <div className="h-[10%] w-[100%] bg-blue-100 flex justify-center items-center">
                <Input />
                <Button className="ml-4">Send</Button>
            </div>
        </div>
    );
}

export default ChatRoom;