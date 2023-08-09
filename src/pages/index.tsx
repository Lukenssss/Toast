import Head from 'next/head'
import Image from 'next/image'
import axios from 'axios'
import { signIn, signOut, useSession } from 'next-auth/react'
import { getCookie, setCookie } from 'cookies-next'
import localFont from 'next/font/local'
import styles from '@/styles/Home.module.css'
import { useEffect, useRef, useState } from 'react'
import Ripple from 'react-ripplejs'
import { Inter } from 'next/font/google'
import ConfettiExplosion from 'react-confetti-explosion'
import { BiLogoDiscord, BiLogoSpotify } from 'react-icons/bi'
import { io } from 'socket.io-client'
import { CgFile, CgCheck } from 'react-icons/cg'

const interNormal = Inter({
    subsets: ['cyrillic'],
    weight: '400',
})

const feather = localFont({
    src: '../../public/fonts/Feather.ttf'
})

const interBold = Inter({
    subsets: ['cyrillic'],
    weight: '700',
})

export default function Home() {
    const socket = io('https://tongue-7udk.onrender.com')
    const { data: session } = useSession()

    const fileUpload = useRef<HTMLInputElement>(null)

    const [loaded, setLoaded] = useState(false)
    const [user, setUser] = useState('')
    const [file, setFile] = useState<File>()
    const [uploaded, setUploaded] = useState(false)
    const [recieved, setRecieved] = useState(true)

    const Send = async () => {
        /* if (recieved === true) {
            setRecieved(false)
        } else {
            return false
        } */

        const metadata = {
            file: file,
            name: file?.name,
            type: file?.type,
        }

        socket.emit('data', {
            to: user,
            metadata: metadata,
            from: session?.user?.name,
        })
    }

    /* socket.on('recieved', (e) => {
        if (e.state === 'true') {
            setRecieved(true)            
        }
    }) */

    socket.on('data', (e) => {
        const noti = new Notification('Click to Download 🍞', {
            requireInteraction: true,
            silent: false,
            body: `Content from ${e.metadata.name}: ${e.from}`
        })

        noti.onclose = () => {
            /* socket.emit('recieved', {
                to: e.from,
                from: session?.user?.name,
                state: 'true'
            }) */
        
            return false
        }

        noti.onclick = async () => {
            /* socket.emit('recieved', {
                to: e.from,
                from: session?.user?.name,
                state: 'true'
            }) */

            const a = document.createElement('a')

            a.href = URL.createObjectURL(new Blob([e.metadata.file], {
                type: e.metadata.type,
            }))
    
            a.download = e.metadata.name
            a.click()
        }
    })

    if (session) {
        if (loaded === false) {
            Notification.requestPermission()

            socket.emit('join', {
                to: session.user?.name,
            })
            console.log(session.user?.name)

            setLoaded(true)
        }

        return (
            <>
                <Head>
                    <title>Toast</title>
                    <meta name='theme-color' content='#0f0f10' />
                    <meta name="description" content="Welcome to another universe called toast!" />
                    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
                </Head>
    
                <div className={styles.container}>
                    <img title={'Sign Out'} onClick={() => signOut()} src={session.user?.image as string} className={styles.avatar} alt={''} />

                    <input style={feather.style} type={'text'} placeholder={'Reciever'} className={styles.user} value={user} onChange={(e) => setUser(e.target.value)} />

                    <div onClick={() => {
                        fileUpload.current?.click()
                    }} className={styles.files}>
                        {file ? <CgCheck className={styles.check} /> : <CgFile className={styles.fileIcon} />}
                    </div>

                    <button style={feather.style} className={styles.send} onClick={() => Send()}>Send</button>

                    <input type={'file'} placeholder={''} style={{
                        display: 'none',
                    }} ref={fileUpload} onChange={(e) => {
                        if (!e.target.files) {
                            return
                        } else {
                            setFile(e.target.files[0])
                        }
                    }} />
                </div>
            </>
        )
    }

    return (
        <>
            <Head>
                <title>Toast</title>
                <meta name="description" content="Welcome to another universe called toast!" />
                <meta name='theme-color' content='#0f0f10' />
                <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
            </Head>

            <div className={styles.container}>
                <h1 className={styles.logo} style={feather.style}>Login</h1>

                <ul className={styles.listTwo}>
                    <li className={styles.itemTwo}>
                        <Ripple
                            color={'#00000010'}
                            style={feather.style}
                            className={styles.signIn}
                            onClick={() => signIn('discord')}
                        >
                            <BiLogoDiscord className={styles.iconOne} />
                        </Ripple>
                    </li>
                </ul>
            </div>
        </>
    )
}