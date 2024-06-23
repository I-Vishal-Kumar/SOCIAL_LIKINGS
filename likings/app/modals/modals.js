import mongoose from "mongoose";

const Schema = mongoose.Schema;

const User = new Schema({
    UserName: { type: String, unique: true },
});
const Post = new Schema(
    {
        Title: String,
        Content: String,
        Image: String,
        Likes: { type: Array, default: [] },
        Comments: [
            {
                UserName: String,
                Comment: String,
            },
        ],
    },
    { timestamps: true }
);
export const USER = mongoose?.models?.User || mongoose?.model("User", User);
export const POSTS = mongoose?.models?.Post || mongoose?.model("Post", Post);
