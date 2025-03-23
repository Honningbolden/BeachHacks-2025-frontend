import {NextResponse} from "next/server";

export async function POST(request: Request) {
    const {image, csv} = await request.json()

    const res = await fetch('http://10.39.13.207:5001', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({image, csv})
    })

    const data = await res.json()

    return NextResponse.json(data)
}