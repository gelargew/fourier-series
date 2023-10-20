import { DftProps, dft } from '@/lib/fourier'
import { PerlinNoise } from '@/lib/noise'
import { MouseEvent, useCallback, useEffect, useRef, useState } from 'react'
import { DRAWING } from './coding_train'
import { useAtom } from 'jotai'
import { imagePathAtom } from '@/lib/store'



let drawing: {x: number; y: number}[] = []
const TWO_PI = Math.PI * 2
const HALF_PI = Math.PI / 2
let time = 0
let path: { x: number; y: number }[] = []
let y: number[] = []
let x: number[] = []

let ctx: CanvasRenderingContext2D
let frame: number

export const DrawingInput = ({ step = 1 }) => {
  const ref = useRef<HTMLCanvasElement>(null!)
  const [STATE, setSTATE] = useState('IDLE')

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (STATE === 'USER') {
          const rect = ref.current.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          drawing.push({ x, y })

        }
    }, [STATE])



    useEffect(() => {
      cancelAnimationFrame(frame)
        if (STATE === 'IDLE') {
          console.log('IDEL')
        }
        time = 0
        x = []
        y = []
        const canvas = document.getElementById('dft') as HTMLCanvasElement
        ctx = canvas.getContext('2d') as CanvasRenderingContext2D

        if (STATE === 'USER') {
            path = []
            drawing = []
            const animateUserDraw = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
                for (let i = 0; i < drawing.length - 1; i++) {
                    ctx.beginPath()
                    ctx.strokeStyle = '#fff'
                    ctx.moveTo(drawing[i].x, drawing[i].y)
                    ctx.lineTo(drawing[i + 1].x, drawing[i + 1].y)
                    ctx.stroke()
                }
                frame = requestAnimationFrame(animateUserDraw)
            }
            frame = requestAnimationFrame(animateUserDraw)
        }
        if (STATE === 'FOURIER') {
            for (let i = 0; i < drawing.length; i += step) {
                x.push(drawing[i].x)
                y.push(drawing[i].y)
            }

            let fourierY = dft(y)
            let fourierX = dft(x)

            fourierY.sort((a, b) => b.amp - a.amp)
            fourierX.sort((a, b) => b.amp - a.amp)
            const animate = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height)

                let vx = epicycles(0, 100, 0, fourierX) as {
                    x: number
                    y: number
                }
                let vy = epicycles(100, 0, HALF_PI, fourierY) as {
                    x: number
                    y: number
                }

                let v = {
                    x: vx.x,
                    y: vy.y,
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
                for (let i = 0; i < path.length - 1; i++) {
                    ctx.lineTo(path[i].x, path[i].y)
                }
                ctx.stroke()


                let dt = TWO_PI / fourierY.length
                time += dt
                if (path.length >= drawing.length) {
                    path = []
                    time = 0
                    setSTATE('IDLE')
                }
                frame =requestAnimationFrame(animate)
            }
            frame = requestAnimationFrame(animate)
        }

        return () => {
            cancelAnimationFrame(frame)
        }

        // animate()
    }, [STATE])

    return <canvas ref={ref} onPointerDown={(e) => {setSTATE('USER')}} onPointerUp={() => {setSTATE('FOURIER')}} onMouseMove={handleMouseMove} width={1000} height={600} id='dft'></canvas>
}

function epicycles(
    x: number,
    y: number,
    rotation: number,
    fourier: DftProps[],
) {
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
        x,
        y,
    }
}
