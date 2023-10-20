const TWO_PI = Math.PI * 2

export interface DftProps {
  re: number;
  im: number;
  freq: number;
  amp: number;
  phase: number;
}[]

export const dft = (x: number[]) => {
    let X = [] as {
      re: number;
      im: number;
      freq: number;
      amp: number;
      phase: number;
    }[]
    const N = x.length
    for (let k = 0; k < N; k++) {
        let re = 0
        let im = 0
        for (let n = 0; n < N; n++) {
            const phi = (TWO_PI * k * n) / N
            re += x[n] * Math.cos(phi)
            im -= x[n] * Math.sin(phi)
        }
        re = re / N
        im = im / N

        let freq = k
        let amp = Math.sqrt(re * re + im * im)
        let phase = Math.atan2(im, re)
        X[k] = { re, im, freq, amp, phase }
    }
    return X
}
