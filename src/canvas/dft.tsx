import { DftProps, dft } from '@/lib/fourier'
import { PerlinNoise } from '@/lib/noise'
import { useEffect, useState } from 'react'
import { DRAWING } from './coding_train'
import { useAtom } from 'jotai'
import { imagePathAtom } from '@/lib/store'

const MONALISA = [[[101,98,91,83,80,80,82,92,104,117,139,154,169,180,181,177],[35,33,34,44,58,97,109,130,142,149,146,135,114,90,77,50]],[[91,86,94,91,83,77,68],[104,116,154,179,196,226,234]],[[4,0,0,12,5,13,26,40,115,151,165,199,233,238,236,245,241,228],[222,216,208,162,110,75,40,24,0,8,18,62,93,110,146,174,195,233]],[[168,173,200,211,203],[120,157,183,203,255]],[[3,59,89],[212,232,235]],[[208,222,245],[235,235,228]],[[97,135,154,169],[36,35,42,56]],[[112,113,120,144],[104,107,109,110]],[[114,112],[68,76]],[[136,133],[68,76]]]

const MONA = [] as {x:number; y:number}[]
MONALISA.forEach((stroke) => {

  for (let i = 0; i < stroke[0].length; i++) {
    MONA.push({x:stroke[0][i], y:stroke[1][i]})
  }

})

const noise = new PerlinNoise(12345)
const TWO_PI = Math.PI * 2
const HALF_PI = Math.PI / 2
let time = 0
let path: {x:number; y:number;}[] = []
let y: number[] = []
let x: number[] = []
let angle = 0
let ctx: CanvasRenderingContext2D

export const Dft = ({
  step=3
}) => {
    const [imagePath] = useAtom(imagePathAtom)
    const [rendered, isRendered] = useState(false)
    const n = 10


    useEffect(() => {
        if (imagePath.length === 0) return

        time = 0
        path = []
        x = []
        y = []
        const canvas = document.getElementById('dft') as HTMLCanvasElement
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        const width = canvas.width
        const height = canvas.height

        for (let i = 0; i < imagePath.length; i += step) {
            x.push(imagePath[i][0])
            y.push(imagePath[i][1])
        }


        let fourierY = dft(y)
        let fourierX = dft(x)
        fourierY.sort((a,b) => b.amp - a.amp)
        fourierX.sort((a,b) => b.amp - a.amp)
        // ctx.translate(125, 150)
        // ctx.translate(250, 300)
        // animation frame
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            let vx = epicycles(width / 2 + 150, 50, 0, fourierX) as {x: number; y: number;}
            let vy = epicycles(200, height / 2, HALF_PI, fourierY) as {x: number; y: number;}

            let v = {
                x: vx.x,
                y: vy.y
            }
            path.unshift(v)
            ctx.beginPath()
            ctx.moveTo(vx.x, vx.y)
            ctx.lineTo(v.x, v.y)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(vy.x, vy.y)
            ctx.lineTo(v.x, v.y)
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(path[0].x, path[0].y)
            for (let i = 0; i < path.length; i++) {
                ctx.lineTo(path[i].x, path[i].y)
            }
            ctx.stroke()

            let dt = TWO_PI / fourierY.length
            time += dt
            if (path.length > imagePath.length) {
                path = []
                time = 0
            }
            requestAnimationFrame(animate)
        }
        const id = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(id)
        }

        // animate()
    }, [imagePath])

    return <canvas width={1000} height={600} id='dft'></canvas>
}

const drawCircle = (r: number, x: number, y: number) => {
    ctx.arc(x, y, r, 0, Math.PI * 2)
}

function epicycles(x: number, y: number, rotation: number, fourier: DftProps[]) {
    for (let i = 0; i < fourier.length; i++) {
        let prevX = x
        let prevY = y
        let { amp: radius, freq, phase } = fourier[i]

        x += radius * Math.cos(freq * time + phase + rotation)
        y += radius * Math.sin(freq * time + phase + rotation)

        ctx.strokeStyle = 'rgba(255,255,255,0.5)'
        ctx.beginPath()
        ctx.arc(prevX, prevY, radius * 2, 0, Math.PI * 2)
        ctx.stroke()

        ctx.beginPath()
        ctx.fillStyle = 'rgba(255,255,255,0.5)'
        // drawCircle(5, x, y)
        ctx.fill()
        ctx.beginPath()
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        ctx.stroke()



        // for (let j = 1; j < wave.length; j++) {
        //     ctx.beginPath()
        //     ctx.moveTo(waveX, waveY)
        //     ctx.strokeStyle = '#fff'
        //     waveX = j + 200
        //     waveY = wave[j]
        //     ctx.lineTo(waveX, waveY)
        //     ctx.stroke()
        // }
        // ctx.beginPath()
        // ctx.moveTo(x, y)
        // ctx.lineTo(200, wave[0])
        // ctx.stroke()
    }
    return {
      x, y
    }
}
