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

    await client.sql`TRUNCATE TABLE users`

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

type Day = {
    date: string
    recommended: number
    consumed: number
}

const days: Day[] = [
    {
        date: (new Date('2024-06-26')).toDateString(),
        recommended: 2000,
        consumed: 1500,
    },
    {
        date: (new Date('2024-06-27')).toDateString(),
        recommended: 2000,
        consumed: 0,
    },
]

const seedDays = async () => {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

    await client.sql`
        CREATE TABLE IF NOT EXISTS days (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            date TEXT UNIQUE NOT NULL,
            recommended INT NOT NULL,
            consumed INT NOT NULL
        );
    `

    await client.sql`TRUNCATE TABLE days`

    const insertedDays = await Promise.all(
        days.map(async (day) => {
            return client.sql`
                INSERT INTO days (date, recommended, consumed)
                VALUES (${day.date}, ${day.recommended}, ${day.consumed})
                RETURNING *;
            `
        })
    )

    return insertedDays;
}

export async function GET() {
    try {
        await client.sql`BEGIN`
        await seedUsers()
        await seedDays()
        await client.sql`COMMIT`

        return Response.json({ message: 'Seed successful' })
    } catch (error) {
        await client.sql`ROLLBACK`
        return Response.json({ error }, { status: 500 })
    }
}
