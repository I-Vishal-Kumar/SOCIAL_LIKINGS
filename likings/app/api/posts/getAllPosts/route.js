import { connect } from "@/app/modals/dbConfig";
import { POSTS } from "@/app/modals/modals";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connect();
        let posts = await POSTS.find({});

        return NextResponse.json({
            status: 200,
            data: posts,
            message: "data gathered successfull",
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json({
            status: 300,
            message: "something went wrong",
        });
    }
}
