import bcrypt from 'bcrypt'
import { db } from '@vercel/postgres'

const client = await db.connect();

type User = {
    email: string
    password: string
    weight: number
}

const users: User[] = [
    {
        email: 'demo@user.com',
        password: 'password',
        weight: 150,
    },
    {
        email: 'brianrlam@gmail.com',
        password: 'asdfasdf',
        weight: 200,
    },
]

const seedUsers = async () => {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
    await client.sql`
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            weight INT NOT NULL
        );
    `

    await client.sql`TRUNCATE TABLE users`

    const insertedUsers = await Promise.all(
        users.map(async (user) => {
            const hashedPassword = await bcrypt.hash(user.password, 10)
            return client.sql`
                INSERT INTO users (email, password, weight)
                VALUES (${user.email}, ${hashedPassword}, ${user.weight})
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
        date: (new Date()).toDateString(),
        recommended: 75,
        consumed: 60,
    },
    {
        date: (new Date()).toDateString(),
        recommended: 100,
        consumed: 0,
    },
]

const seedDays = async () => {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

    await client.sql`
        CREATE TABLE IF NOT EXISTS days (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            date TEXT NOT NULL,
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

const dropTables = async () => {
    await client.sql`DROP TABLE IF EXISTS users`
    await client.sql`DROP TABLE IF EXISTS days`
}

export async function GET() {
    try {
        await client.sql`BEGIN`
        await dropTables()
        await seedUsers()
        await seedDays()
        await client.sql`COMMIT`

        return Response.json({ message: 'Seed successful' })
    } catch (error) {
        await client.sql`ROLLBACK`
        return Response.json({ error }, { status: 500 })
    }
}
