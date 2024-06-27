import { db } from '@vercel/postgres'

const client = await db.connect();

export async function GET(

) {
    return Response.json({ msg: "Hello World"});
}


export const POST = async (req: any) => {

    const day = await req.json()
    await client.sql`BEGIN`

    const insertedDay = await client.sql`
      INSERT INTO days (date, recommended, consumed)
      VALUES (${day.date}, ${day.recommended}, ${day.consumed})
      RETURNING *;
    `

    await client.sql`COMMIT`

    return Response.json({ message: 'Seed successful', insertedDay })
}
