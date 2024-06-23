const oneDay = 24 * 60 * 60 * 1000;
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateToken } from "@/app/helpers/auth";
import { USER } from "@/app/modals/modals";
import { connect } from "@/app/modals/dbConfig";

// post request will handle the login functionality
export async function POST(NextRequest) {
    await connect();

    try {
        let { UserName } = await NextRequest.json();
        if (!UserName) throw new Error("Username is missing", {});
        UserName = UserName.trim();
        let res = await USER.findOne({ UserName });
        if (!res) throw new Error("User not found.", {});

        const token = await generateToken({
            UserName,
        });

        const response = NextResponse.json({
            status: 200,
            message: "logged in",
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
