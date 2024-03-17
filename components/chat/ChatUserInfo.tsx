import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { IUserDocument } from "@/models/userModel";

const ChatUserInfo = async({userData}: {userData: IUserDocument}) => {
	console.log(userData.email)
	const userFullName = userData.fullName ? userData.fullName : "User";
	const userAvatar = userData.avatar;

	return (
		<div className='cursor-pointer bg-sigButtonSecondary hover:bg-sigButtonSecondaryHover rounded-full flex gap-2 items-center py-1 px-3 text-white font-semibold'>
			<Avatar className='h-8 w-8 rounded-full flex items-center justify-center'>
				<AvatarImage src={userAvatar || "/logo.svg"} />
			</Avatar>

			<span>{userFullName}</span>
		</div>
	);
};
export default ChatUserInfo;