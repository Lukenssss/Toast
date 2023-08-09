import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth from 'next-auth'
import Discord from 'next-auth/providers/discord'
import Google from 'next-auth/providers/google'
import Twitch from 'next-auth/providers/twitch'
import { Adapter } from 'next-auth/adapters'

export default NextAuth({
    /* adapter: MongoDBAdapter(clientPromise, {
        databaseName: 'Database',
        collections: {
            Users: 'Users',
            Sessions: 'Sessions',
            Accounts: 'Accounts',
        },
    }) as Adapter, */
    providers: [
        Discord({
            clientId: process.env.DISCORD_ID || '',
            clientSecret: process.env.DISCORD_SECRET || '',
        }),
        Google({
            clientId: process.env.GOOGLE_ID || '',
            clientSecret: process.env.GOOGLE_SECRET || '',
        }),
        Twitch({
            clientId: process.env.TWITCH_ID || '',
            clientSecret: process.env.TWITCH_SECRET || '',
        })
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/',
        signOut: '/',
    }
})