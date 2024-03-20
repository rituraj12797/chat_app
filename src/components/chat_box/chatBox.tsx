
import  './chatBox.css'
interface Props {
    className: string;
}

function ChatBox({className}:Props) {
    return ( <div className={"chatbox h-[30px] w-[120px]  flex justify-center items-center "+className}>
        <div className="messg h-[1005] w-[90%] rounded-md">
          this is message 
        </div>
        <div className='chat_directr h-[100%] w-[10%] bg-white'>

        </div>
    </div> );
}

export default ChatBox;