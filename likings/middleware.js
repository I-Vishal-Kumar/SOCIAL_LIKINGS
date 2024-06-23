import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET;

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Define public paths that do not require authentication
    const isPublic = ["/login", "/signup", "/api/otp"].some((path) =>
        pathname.startsWith(path)
    );
    console.log(isPublic);
    if (isPublic) return NextResponse.next();

    // Extract token from cookies
    const token = (await request.cookies.get("token")?.value) || "";

    if (!token) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    // Verify token validity
    const isValidToken = await verifyToken(token);

    if (!isValidToken.success) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    // Proceed with the request
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/home",
        "/profile/:path*",
        "/stake/:path*",
        "/recharge/:path*",
        "/matches/:path*",
    ],
};

async function verifyToken(token) {
    try {
        const decoded = await jwtVerify(
            token,
            new TextEncoder().encode(secretKey)
        );
        return { success: true, decoded: decoded.payload };
    } catch (error) {
        console.error("Token verification failed:", error);
        return { success: false, error: "Invalid token" };
    }
}
