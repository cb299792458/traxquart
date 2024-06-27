import type { NextApiRequest, NextApiResponse } from "next";
import { db } from '@vercel/postgres'

const client = await db.connect();

export async function GET(
    req: NextApiRequest,
) {
    return Response.json({ msg: "Hello World"});
}


export const POST = async (req: NextApiRequest) => {
    const day = req.body
    await client.sql`BEGIN`

    

    await client.sql`COMMIT`
    return Response.json({ message: 'Seed successful' })
}
