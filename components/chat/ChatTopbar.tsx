import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ChatUserInfo from "./ChatUserInfo";
import DeleteMessagesButton from "./DeleteMessagesButton";
import { Button } from "../ui/button";

const ChatTopbar = async () => {
	return (
		<div className='mt-4 flex justify-between items-center w-full'>
			<div className='flex gap-2'>
				<Button
					asChild
					className='bg-sigButtonSecondary hover:bg-sigButtonSecondaryHover w-11 h-11 rounded-full '
				>
					<Link href={"/chat"}>
						<ChevronLeft className='min-w-7' />
					</Link>
				</Button>
				<ChatUserInfo />
			</div>
			{/* right */}
			<DeleteMessagesButton />
		</div>
	);
};
export default ChatTopbar;