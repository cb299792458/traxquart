import bcrypt from 'bcrypt'
import { db } from '@vercel/postgres'

const client = await db.connect();

type User = {
    email: string
    password: string
}

const users: User[] = [
    {
        email: 'demo@user.com',
        password: 'password',
    },
    {
        email: 'brianrlam@gmail.com',
        password: 'password',
    },
]

const seedUsers = async () => {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
    await client.sql`
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
    `

    const insertedUsers = await Promise.all(
        users.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10)
            return client.sql`
                INSERT INTO users (email, password)
                VALUES (${user.email}, ${hashedPassword})
                RETURNING *;
            `
        })
    )

    return insertedUsers;
}

export async function GET() {
    try {
        await client.sql`BEGIN`
        await seedUsers()
        await client.sql`COMMIT`

        return Response.json({ message: 'Seed successful' })
    } catch (error) {
        await client.sql`ROLLBACK`
        return Response.json({ error }, { status: 500 })
    }
}
