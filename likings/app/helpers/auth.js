import { v4 as uuid } from "uuid";
import { SignJWT, jwtVerify } from "jose";
import { connect } from "../modals/dbConfig";
import { cookies } from "next/headers";

const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET; // Replace with your secret key

export const isAuthenticated = async () => {
    try {
        await connect();
        const token = await getCookieData();
        const decoded = await jwtVerify(
            token,
            new TextEncoder().encode(secretKey)
        );
        if (!decoded) {
            return false;
        } else {
            let UserName = decoded?.payload?.UserName;
            return UserName || "";
        }
    } catch (error) {
        console.log(error);
        return false;
    }
};

async function getCookieData() {
    try {
        let token = cookies().get("token")?.value || "";
        const cookieData = token;
        return cookieData;
    } catch (error) {
        console.log(error);
        return "";
    }
    // return new Promise((resolve) =>
    //   setTimeout(() => {
    //     resolve(cookieData);
    //   }, 1000)
    // );
}

export const generateToken = async (payload) => {
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setJti(uuid())
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(new TextEncoder().encode(secretKey));
    return token;
};
