import { db } from '@vercel/postgres'
import bcrypt from 'bcrypt'

const client = await db.connect();

export async function POST(
    req: any
) {
    const credentials = await req.json()

    const { rows: users } = await client.sql`
        SELECT * FROM users
        WHERE email = ${credentials.email}
    `

    if (!users?.length) return Response.json({ message: 'User not found' })
    const user = users[0]
    
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
    if (!isPasswordValid) return Response.json({ message: 'Invalid password' })
    return Response.json({ message: 'Login successful', user })
}
