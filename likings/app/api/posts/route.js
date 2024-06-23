import { isAuthenticated } from "@/app/helpers/auth";
import { connect } from "@/app/modals/dbConfig";
import { POSTS } from "@/app/modals/modals";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connect();
        let UserName = await isAuthenticated();
        if (!UserName) throw new Error("session time out login again");
        const { id } = await request.json();
        await POSTS.findOneAndUpdate(
            { _id: id },
            {
                $push: { Likes: UserName },
            }
        );
        return NextResponse.json({
            status: 200,
            message: "like added successfull",
        });
    } catch (error) {
        return NextResponse.json({
            status: 300,
            message: error?.message || "something went wrong",
        });
    }
}

export async function PUT(request) {
    try {
        await connect();
        let UserName = await isAuthenticated();
        if (!UserName) throw new Error("session time out login again");
        const { id, Comment } = await request.json();
        const newComment = {
            UserName,
            Comment,
        };
        await POSTS.findOneAndUpdate(
            { _id: id },
            {
                $push: { Comments: newComment },
            }
        );
        return NextResponse.json({
            status: 200,
            message: "comment added successfull",
        });
    } catch (error) {
        return NextResponse.json({
            status: 300,
            message: error?.message || "something went wrong",
        });
    }
}
