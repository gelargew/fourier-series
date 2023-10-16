import { useEffect, useState } from 'react'

export const Fourier = () => {
    const [rendered, isRendered] = useState(false)
    const n = 10

    useEffect(() => {
        if (rendered) return
        isRendered(true)
        const canvas = document.getElementById('sketch') as HTMLCanvasElement
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

        let time = 0
        const wave: number[] = []
        const drawCircle = (r: number, x: number, y: number) => {
            ctx.arc(x, y, r, 0, Math.PI * 2)
        }
        ctx.translate(125, 150)
        // ctx.translate(250, 300)
        // animation frame
        const animate = () => {
            ctx.clearRect(-250, -300, canvas.width, canvas.height)
            time += 0.02
            let x = 0
            let y = 0

            for (let i = 0; i < n; i++) {
                let prevX = x
                let prevY = y
                let a = i * 2 + 1
                let radius = 100 * (4 / (a * Math.PI))
                x += radius * Math.cos(a * time)
                y += radius * Math.sin(a * time)

                ctx.strokeStyle = 'rgba(255,255,255,0.5)'
                ctx.beginPath()

                drawCircle(radius, prevX, prevY)
                ctx.stroke()

                ctx.beginPath()
                ctx.fillStyle = 'rgba(255,255,255,0.5)'
                drawCircle(5, x, y)
                ctx.fill()
                ctx.beginPath()
                ctx.strokeStyle = 'rgba(255,255,255,0.5)'
                ctx.moveTo(prevX, prevY)
                ctx.lineTo(x, y)
                ctx.stroke()

                let [waveX, waveY] = [200, wave[0]]



                if (i === n - 1) {
                  for (let j = 1; j < wave.length; j++) {
                    ctx.beginPath()
                    ctx.moveTo(waveX, waveY)
                    ctx.strokeStyle = '#fff'
                    waveX = j + 200
                    waveY = wave[j]
                    ctx.lineTo(waveX, waveY)
                    ctx.stroke()
                }
                    ctx.beginPath()
                    ctx.moveTo(x, y)
                    ctx.lineTo(200, wave[0])
                    ctx.stroke()
                }
            }
            wave.unshift(y)

            if (wave.length > 700) {
                wave.pop()
            }
            requestAnimationFrame(animate)
        }
        const id = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(id)
        }

        // animate()
    }, [])

    return <canvas width={1000} height={600} id='sketch'></canvas>
}
