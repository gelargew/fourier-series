import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useEffect, useState } from 'react'
import { Fourier } from '../canvas/sketch'
import { Dft } from '@/canvas/dft'
import { ImageInput } from '@/image/ImageInput'
import { useAtom } from 'jotai'
import { imagePathAtom } from '@/lib/store'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const [rendered, setRendered] = useState(false)
    const [imagePath] = useAtom(imagePathAtom)

    useEffect(() => {
        if (rendered) return
        setRendered(true)
    }, [])

    if (!rendered) return null

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <meta
                    name='description'
                    content='Generated by create next app'
                />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <header style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '3rem'
            }} >
              <Link href='/'>DRAW</Link>
              <Link href='/image'>IMAGE</Link>
            </header>
            <main className={`${styles.main} ${inter.className}`}>
                <ImageInput />
                {imagePath && (
                    <div className='container'>
                        <div className='sketch'>
                            <Dft />
                        </div>
                    </div>
                )}

                {/* <div className='container'>
          <div className='sketch'>
            <Fourier />
          </div>
        </div> */}
            </main>
        </>
    )
}
