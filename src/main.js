import * as THREE from "three";
import { PerlinNoise } from "./noise.js";


export class Block {
    constructor(x, y, z, src, scene) {
        const loader = new THREE.TextureLoader();

        const texture = loader.load(src);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;

        const material = new THREE.MeshBasicMaterial({ map: texture });
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        this.cube = new THREE.Mesh(geometry, material);
        this.cube.position.x = x;
        this.cube.position.y = y;
        this.cube.position.z = z;
        scene.add(this.cube);
    }
}

export class MultipleFaceBlock {
    constructor(x, y, z, top, side, bottom, scene) {
        const loader = new THREE.TextureLoader();

        const tTop = loader.load(top);
        tTop.colorSpace = THREE.SRGBColorSpace;
        tTop.magFilter = THREE.NearestFilter;
        tTop.minFilter = THREE.NearestFilter;

        const tSide = loader.load(side);
        tSide.colorSpace = THREE.SRGBColorSpace;
        tSide.magFilter = THREE.NearestFilter;
        tSide.minFilter = THREE.NearestFilter;

        const tBot = loader.load(bottom);
        tBot.colorSpace = THREE.SRGBColorSpace;
        tBot.magFilter = THREE.NearestFilter;
        tBot.minFilter = THREE.NearestFilter;

        const materials = [
            new THREE.MeshBasicMaterial({ map: tSide }), // right
            new THREE.MeshBasicMaterial({ map: tSide }), // left
            new THREE.MeshBasicMaterial({ map: tTop }),  // top
            new THREE.MeshBasicMaterial({ map: tBot }),  // bottom
            new THREE.MeshBasicMaterial({ map: tSide }), // front
            new THREE.MeshBasicMaterial({ map: tSide })  // back
        ];

        const geometry = new THREE.BoxGeometry(1, 1, 1);

        this.cube = new THREE.Mesh(geometry, materials);

        this.cube.position.set(x, y, z);

        scene.add(this.cube);
    }
}


export class World {
    constructor(width, height, depth, scene) {

        const noise = new PerlinNoise(Math.random());

        for (let x = 0; x < width; x++) {
            for (let z = 0; z < depth; z++) {

                const n = noise.noise2D(
                    x / 10,
                    z / 10
                );

                const terrainHeight = Math.floor(
                    (n + 1) * height
                );

                for (let y = 0; y < terrainHeight; y++) {

                    if(y === terrainHeight - 1) {
                        new MultipleFaceBlock(x, y, z, "./textures/grass_top.png", "./textures/grass_side.png", "./textures/dirt.png", scene);
                    } else if (y >= terrainHeight - 4) {
                        new Block(x, y, z, "./textures/dirt.png", scene);
                    } else {
                        new Block(x, y, z, "./textures/stone.png", scene);
                    }
                }
            }
        }
    }
}

document.addEventListener("keypress", (e) => {
    if(e.key === "F11") {
        window.electronAPI.toggleFullscreen();
    }
});
