export class PerlinNoise {
  private static permutation: number[] = [];

  constructor(seed: number) {
    this.seedPermutationTable(seed);
  }

  private seedPermutationTable(seed: number): void {
    const permutation = [...Array(256).keys()].sort(() => Math.random() - 0.5);
    PerlinNoise.permutation = new Array(512);
    for (let i = 0; i < 512; i++) {
      PerlinNoise.permutation[i] = permutation[i & 255];
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number): number {
    return (hash & 1) === 0 ? x : -x;
  }

  public perlin1D(previousValue: number): number {
    const x0 = Math.floor(previousValue) & 255;
    const x1 = (x0 + 1) & 255;
    const t = previousValue - Math.floor(previousValue);
    const u = this.fade(t);

    const a = PerlinNoise.permutation[x0];
    const b = PerlinNoise.permutation[x1];

    return this.lerp(u, this.grad(a, t), this.grad(b, t - 1));
  }
}

// Example usage:
const noiseGenerator = new PerlinNoise(12345);
let value = 0.0; // Initialize the value
for (let i = 0; i < 10; i++) {
  value = value + noiseGenerator.perlin1D(value);
  console.log(value);
}