const oneDay = 24 * 60 * 60 * 1000;
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { USER } from "@/app/modals/modals";
import { generateToken } from "@/app/helpers/auth";
import { connect } from "@/app/modals/dbConfig";

export async function POST(NextRequest) {
    try {
        await connect();
        // get data from client side
        let { UserName } = await NextRequest.json();

        UserName = UserName.trim();

        let userName = await USER.findOne({ UserName });

        if (userName) throw new Error("user name already exists");

        const token = generateToken({ UserName });

        let isCreated = await USER.create({ UserName });
        if (!isCreated) throw new Error("something went wrong");
        const response = NextResponse.json({
            status: 200,
            message: "user created",
        });
        cookies().set("token", `${token}`, {
            httpOnly: true,
            expires: Date.now() + oneDay,
            secure: true,
        });

        cookies().set("name", `${UserName}`, {
            expires: Date.now() + oneDay,
        });
        return response;
    } catch (error) {
        return NextResponse.json({
            status: error?.status || error?.code || 500,
            message: error?.message || "something went wrong",
        });
    }
}
