import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.178.0/build/three.module.js";
import { Block, World } from "./main.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

scene.background = new THREE.Color(0xBBDDFF);

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const player = new THREE.Object3D();
player.position.set(0, 0, 0);
camera.position.set(0, 0.5, 0);
player.add(camera);
scene.add(player);

let keys = {};

document.addEventListener('click', () => {
    renderer.domElement.requestPointerLock();
});

document.addEventListener("mousemove", (e) => {
    camera.rotation.x -= e.movementY / 1000;
    player.rotation.y -= e.movementX / 1000;
});

document.addEventListener("keydown", (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
    keys[e.key.toLowerCase()] = false;
});
const world = new World(16, 8, 16, scene);

let lastTime = performance.now();

let playerSpeed = 5;

let fps = 0;

function animate() {
    renderer.render(scene, camera);
    const now = performance.now();
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    fps = 1 / deltaTime;


    if(keys['w']) {
        player.translateZ(-playerSpeed * deltaTime);
    }
    if(keys['a']) {
        player.translateX(-playerSpeed * deltaTime);
    }
    if(keys['s']) {
        player.translateZ(playerSpeed * deltaTime);
    }
    if(keys['d']) {
        player.translateX(playerSpeed * deltaTime);
    }

    if(keys['shift']) {
        player.translateY(playerSpeed * deltaTime);
    }
    if(keys['control']) {
        player.translateY(-playerSpeed * deltaTime);
    }

    requestAnimationFrame(animate);
}

animate();

async function loadSettings() {
    const res = await fetch("./settings.json");
    const data = await res.json();

    document.title = `${data.title} ${data.version}`
}

function tick() {
    let finalFPS = parseInt(fps);
    document.getElementById("fps").textContent = `FPS: ${finalFPS}`;
}

setInterval(tick, 200);

loadSettings();
