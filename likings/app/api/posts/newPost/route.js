import { connect } from "@/app/modals/dbConfig";
import { POSTS } from "@/app/modals/modals";

const { NextResponse } = require("next/server");

export async function POST(request) {
    try {
        await connect();
        const { title, description, image } = await request.json();
        if (!title || !description || !image)
            throw new Error("Each field is required.");
        let isCreated = await POSTS.create({
            Title: title,
            Content: description,
            Image: image,
        });
        if (!isCreated)
            throw new Error("Something went wrong while post creation");
        return NextResponse.json({
            status: 200,
            message: "Post created successfully",
        });
    } catch (error) {
        return NextResponse.json({
            status: 300,
            message: error?.message || "Error Occured",
        });
    }
}
