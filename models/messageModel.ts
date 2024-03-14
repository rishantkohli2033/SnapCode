import mongoose, { Model } from "mongoose";

export interface IMessage{
    sender: mongoose.Schema.Types.ObjectId;
    receiver: mongoose.Schema.Types.ObjectId;
    content: String;
    messageType: "text" | "image";
    opened: Boolean;
}

export interface IMessageDocument extends IMessage, mongoose.Document{
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new mongoose.Schema<IMessageDocument>({
    sender: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true,
    },
    content:{
        type: String,
        required: true,
    },
    messageType: {
        type: String,
        required: true,
        enum:["text" , "image"],
    },
    opened: {
        type: Boolean,
        default: false
    }
})

const Message: Model<IMessageDocument> = mongoose.models?.Message || mongoose.model("Message", messageSchema);

export default Message;