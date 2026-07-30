export class PerlinNoise {
    constructor(seed = Math.random()) {
        this.permutation = [];

        let p = [];

        for (let i = 0; i < 256; i++) {
            p[i] = i;
        }

        // Seeded random generator
        let random = this.randomGenerator(seed);

        // Shuffle
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));

            [p[i], p[j]] = [p[j], p[i]];
        }

        // Duplicate permutation table
        for (let i = 0; i < 512; i++) {
            this.permutation[i] = p[i & 255];
        }
    }

    randomGenerator(seed) {
        let value = Math.floor(seed * 2147483647);

        return function () {
            value = value * 16807 % 2147483647;
            return (value - 1) / 2147483646;
        };
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(a, b, t) {
        return a + t * (b - a);
    }

    grad(hash, x, y) {
        const h = hash & 3;

        let u = h < 2 ? x : y;
        let v = h < 2 ? y : x;

        return ((h & 1) ? -u : u) +
               ((h & 2) ? -v : v);
    }

    noise2D(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);

        const u = this.fade(x);
        const v = this.fade(y);

        const A = this.permutation[X] + Y;
        const B = this.permutation[X + 1] + Y;

        return this.lerp(
            this.lerp(
                this.grad(this.permutation[A], x, y),
                this.grad(this.permutation[B], x - 1, y),
                u
            ),
            this.lerp(
                this.grad(this.permutation[A + 1], x, y - 1),
                this.grad(this.permutation[B + 1], x - 1, y - 1),
                u
            ),
            v
        );
    }
}
