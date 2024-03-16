"use server";
import { auth, signIn, signOut } from "@/auth";
import { connectToMongoDB } from "./db";
import { v2 as cloudinary } from "cloudinary";
import Message, { IMessageDocument } from "@/models/messageModel";
import Chat, { IChatDocument } from "@/models/chatModel";

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
        
        if (!chat) {
			chat = await Chat.create({
				participants: [senderId, receiverId],
				messages: [newMessage._id],
			});
            
		} else {
			chat.messages.push(newMessage._id);
			await chat.save();
		}
        return newMessage;
    } catch (error:any) {
        console.error("Error in sendMessage:", error.message);
		throw error;
    }
}