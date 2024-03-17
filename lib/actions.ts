"use server";
import { auth, signIn, signOut } from "@/auth";
import { connectToMongoDB } from "./db";
import { v2 as cloudinary } from "cloudinary";
import Message, { IMessageDocument } from "@/models/messageModel";
import Chat, { IChatDocument } from "@/models/chatModel";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function authAction() {
    try {
        await signIn("github"); //when successfull it calls redirect() which interally and by default throws an error
    } catch (error:any) {
        if(error.message === "NEXT_REDIRECT"){ //if error is redirect error we throw the error
            throw error;
        }
        return error.message;
    }
    
}

export async function logout(){
    await signOut();
}

export const sendMessageAction = async(receiverId: string, content: string, messageType: "image" | "text") => {
    try {
        const session = await auth();
        if(!session) return;
        await connectToMongoDB();
        const senderId = session.user?._id;
        let uploadedResponse;
        if(messageType === "image"){
           uploadedResponse = await cloudinary.uploader.upload(content);
        }
        const newMessage: IMessageDocument = await Message.create({
			sender: senderId,
			receiver: receiverId,
			content: uploadedResponse?.secure_url || content,
			messageType,
		});
        
        let chat: IChatDocument | null = await Chat.findOne({
			participants: { $all: [senderId, receiverId] },
		});
        
        if (!chat) {  //sending message for the first time
			chat = await Chat.create({
				participants: [senderId, receiverId],
				messages: [newMessage._id],
			});
            
		} else { //already have chat history
			chat.messages.push(newMessage._id);
			await chat.save();
		}
        revalidatePath(`/chat/$${receiverId}`); //to refresh the page to get new data(will fetch latest data for the page)
        return newMessage;
    } catch (error:any) {
        console.error("Error in sendMessage:", error.message);
		throw error;
    }
}

export const deleteChatAction = async (deleteUserId: string) => {
	try {
		await connectToMongoDB();
		const { user } = (await auth()) || {};
		if (!user) return;
		const chat = await Chat.findOne({ participants: { $all: [user._id, deleteUserId] } });
		if (!chat) return;

		const messageIds = chat.messages.map((messageId) => messageId.toString());
		await Message.deleteMany({ _id: { $in: messageIds } });
		await Chat.deleteOne({ _id: chat._id });

		revalidatePath("/chat/[id]", "page");
		// this will throw an error bc it internally throws an error
		// redirect("/chat");
	} catch (error: any) {
		console.error("Error in deleteChat:", error.message);
		throw error;
	}
	redirect("/chat");//redirect must be used outside of the try
};