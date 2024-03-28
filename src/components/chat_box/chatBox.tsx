
import React from 'react';
import  './chatBox.css'
interface Props {
    className: string;
}
type ChatCompProps = {
    className:string,
    message:string
}
const ChatBox: React.FC<ChatCompProps> = ({className,message})=> {
    return ( <div className={"chatbox h-[100px] w-[120px]  flex justify-center items-center "+className}>
        <div className="messg h-[100%] w-[90%] rounded-md">
          {message}
        </div>
        <div className='chat_directr h-[100%] w-[10%] bg-white'>

        </div>
    </div> );
}

export default ChatBox;