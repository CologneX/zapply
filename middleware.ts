import { NextRequest, NextResponse } from "next/server";
import { RouteURL } from "./lib/routes";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

export default async function middleware(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session) {
        return NextResponse.redirect(new URL(RouteURL.SIGNIN, request.url));
    }
    return NextResponse.next(
        // with session data, if needed in the future
        // {
        //     request: {
    );
}

export const config = {
    runtime: "nodejs",
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/resume/:path*',
        '/coverletter/:path*',
    ],
};