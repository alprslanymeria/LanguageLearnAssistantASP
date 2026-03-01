// NEXT
import { NextRequest, NextResponse } from "next/server"


// PUBLIC URL FOR BROWSER REDIRECTS
const OAUTH_SERVER_PUBLIC_URL = process.env.OAUTH_SERVER_PUBLIC_URL

// EXTERNALLY ACCESSIBLE URL OF THIS NEXT.JS APP
const BASE_URL = process.env.BASE_URL


export async function GET(request: NextRequest) {

    // USE BASE_URL IF SET, OTHERWISE DERIVE FROM REQUEST HEADERS
    const origin = BASE_URL
    const callbackUrl = `${origin}/api/auth/google/callback`

    return NextResponse.redirect(
        
        `${OAUTH_SERVER_PUBLIC_URL}/api/Auth/GoogleLogin?redirect_uri=${encodeURIComponent(callbackUrl)}`
    )
}
