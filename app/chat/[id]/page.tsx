import ChatMessages from "@/components/chat/ChatMessages";
import ChatTopbar from "@/components/chat/ChatTopbar";
import SendMsgInput from "@/components/chat/SendMsgInput";

const ChatHistoryPage = async ({params}:{params:{id:string}}/*only works in page components*/) => {
	return (
		<div className='bg-sigMain h-screen flex-[3_3_0%] flex flex-col px-4 text-white'>
			{/* topbar */}
			<ChatTopbar params={params}/>
			{/* below-topbar section */}
			<div className='bg-sigSurface flex-1 overflow-y-auto rounded-xl my-4 border border-sigColorBgBorder  py-2 px-3 '>
				{/* Message container */}
				<div className='flex flex-col'>
					<ChatMessages />
				</div>
			</div>
			{/* Input */}
			<SendMsgInput />
		</div>
	);
};
export default ChatHistoryPage;