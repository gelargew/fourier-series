import { useCallback, useEffect, useRef } from 'react'
import { atom, useAtom } from 'jotai'
import { useControls } from 'leva'
import { imagePathAtom } from '@/lib/store'
import { precomputeDistances, sortArrayByClosestDistance } from '@/lib/distance'

const imageDataAtom = atom<ImageData | null>(null)

const defaultValues = {
    green: {
        value: 80,
        min: 0,
        max: 255,
        step: 1,
    },
    red: {
        value: 80,
        min: 0,
        max: 255,
        step: 1,
    },
    blue: {
        value: 80,
        min: 0,
        max: 255,
        step: 1,
    },
    contrast: {
        value: 80,
        min: 0,
        max: 255,
        step: 1,
    },
}

export type Controls = {
    green: number
    red: number
    blue: number
    contrast: number
}

export const ImageInput = () => {
    const controls = useControls(defaultValues)
    const {
        green: greenThreeshold,
        red: redThreeshold,
        blue: blueThreeshold,
    } = controls
    const ref = useRef<HTMLCanvasElement>(null!)
    const imageRef = useRef<HTMLImageElement>(null!)
    // real image data
    const [imageData, setImageData] = useAtom(imageDataAtom)
    const [imagePath, setImagePath] = useAtom(imagePathAtom)
    const ctx = useRef<CanvasRenderingContext2D>()

    const grayscale = useCallback(() => {
        if (!imageData) return
        const tempData = new ImageData(imageData.width, imageData.height, {
            colorSpace: 'srgb',
        })
        let _imagePath = [] as number[][]

        for (let i = 0; i < imageData.height; i++) {
            for (let j = 0; j < imageData.width; j++) {
                const index = i * 4 * imageData.width + j * 4
                const red = imageData.data[index]
                const green = imageData.data[index + 1]
                const blue = imageData.data[index + 2]
                let average = 255

                if (green < 80 && red > 20 && blue > 20) {
                    for (let k = -1; k <= 1; k++) {
                        for (let l = -1; l <= 1; l++) {
                            const index2 =
                                (i + k) * 4 * imageData.width + (j + l) * 4
                            const red2 = imageData.data[index2]
                            const green2 = imageData.data[index2 + 1]
                            const blue2 = imageData.data[index2 + 2]
                            // rubah warna tergantung threshold
                            if (
                                green2 > greenThreeshold ||
                                red2 > redThreeshold ||
                                blue2 > blueThreeshold
                            ) {
                                if (i % 3 === 0 && j % 3 === 0) {
                                    _imagePath.push([j, i])
                                }

                                average = 0
                                break
                            }
                        }
                    }
                }

                tempData.data[index] = average
                tempData.data[index + 1] = average
                tempData.data[index + 2] = average
                tempData.data[index + 3] = 255
            }
        }
        let sorted = sortArrayByClosestDistance(_imagePath)

        setImagePath(sorted)

        ctx.current?.putImageData(tempData, 0, 0)

        // disini ulik tempData biar gk ada kerumunan warna item
    }, [imageData, greenThreeshold, redThreeshold, blueThreeshold])

    useEffect(() => {
        grayscale()
    }, [grayscale])

    const onImageLoad = () => {
        const canvas = ref.current
        ctx.current = ref.current.getContext('2d') as CanvasRenderingContext2D
        const image = document.querySelector('#image') as HTMLImageElement
        const imgWidth = image.width
        const imgHeight = image.height

        canvas.width = imgWidth
        canvas.height = imgHeight
        ctx.current.drawImage(image, 0, 0)
        const imageData = ctx.current.getImageData(0, 0, imgWidth, imgHeight)
        setImageData(imageData)
        grayscale()
    }

    return (
        <>
            <canvas onClick={() => console.log(imagePath)} ref={ref}></canvas>
            <img
                ref={imageRef}
                id='image'
                src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREYIWiVJNQRZXmnXy1WU16ygtHRLnI77RQ3A&usqp=CAU'
                crossOrigin='anonymous'
                onLoad={onImageLoad}
            />
        </>
    )
}
