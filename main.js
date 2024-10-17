import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// luz ambiente
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// luz direcional
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 0).normalize();
scene.add(directionalLight);

const whiteCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const whiteCubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const whiteCube = new THREE.Mesh(whiteCubeGeometry, whiteCubeMaterial);

whiteCube.scale.set(0, 0, 2); 
whiteCube.rotation.y -= 0.5;
scene.add(whiteCube);

const loader = new GLTFLoader();
loader.load('/modelos/nave.gltf', function (gltf) {
    scene.add(gltf.scene);
    model = gltf.scene;
    model.rotation.set(0, -1.5, 0); 
});

loader.load('/modelos/sol/sol.gltf', function(gltf){
    scene.add(gltf.scene)
    sol = gltf.scene;
    sol.position.set(0, 0, -5)
}, undefined, function (error) {
    console.error(error);
});

loader.load('/modelos/alien/alien.gltf', function(gltf){
    scene.add(gltf.scene)
    alien = gltf.scene;
    alien.position.set(0, 0.3, -5)
}, undefined, function (error) {
    console.error(error);
});

camera.position.z = 1;

let model; 
let sol;
let alien;
let alienHeight = 0.3;

let angle = 0; 
const radius = 0.5; // Raio do círculo

const cubes = []; 
const maxCubes = 100; 

let arrowLeft = false
let arrowRight = false

let a = false
let d = false

let direction = 1; 
let maxHeight = 0;
let minHeight = -5; 
let speed = 0.03

function createCube(position) {
    if (cubes.length >= maxCubes) return; 

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const cube = new THREE.Mesh(geometry, material);
    cube.scale.set(0.05, 0.05, 2); 
    
    if (position) {
        cube.position.copy(position);
    } else {
        cube.position.set(
            (Math.random() - 0.5) * 20, // Posição X 
            (Math.random() - 0.5) * 20, -10 // Posição Y e Z 
        );
    }
    
    scene.add(cube);
    cubes.push(cube);
}


setInterval(() => {
    for (let i = 0; i < 10; i++) { 
        createCube();
    }
    // Cada cubo existente cria múltiplos cubos
    cubes.forEach(cube => {
        for (let i = 0; i < 1; i++) { 
            createCube(cube.position);
        }
    });
}, 200); 

function animate() {

    if (model) {
        model.rotation.x += 0.5;
        model.rotation.z += 0.5;

    }
    if(arrowLeft){
        angle -= 0.05; 
        model.position.x = Math.cos(angle) * radius;
        model.position.y = Math.sin(angle) * radius;
        alien.position.x = model.position.x;
        alien.position.y = model.position.y + alienHeight; 
	}else
	if(arrowRight){
		angle += 0.05; 
        model.position.x = Math.cos(angle) * radius;
        model.position.y = Math.sin(angle) * radius;
        alien.position.x = model.position.x;
        alien.position.y = model.position.y + alienHeight; 
	}else
    if(a){
        camera.rotation.y -= 0.01
        camera.position.x -= 0.05
    }else
    if(d){
        camera.rotation.y += 0.01
        camera.position.x += 0.05
    }

    if(alien){
        alien.position.z += speed * direction;
        if(alien.position.z >= maxHeight){
            direction = -1;
        }else if(alien.position.z <= minHeight){
            direction = 1;
        }
    }
    
   

    // Movendo os cubos brancos em direção a tela
    for (let i = cubes.length - 1; i >= 0; i--) {
        const cube = cubes[i];
        if (cube.position.z < 5) {
            cube.position.z += 0.1; // Ajuste a velocidade
        } else {
            scene.remove(cube);
            cubes.splice(i, 1);
        }
    }

    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

document.addEventListener("keydown", onDocumentKeyDown, false)

function onDocumentKeyDown(event){
    console.log(event.key)
    switch(event.key){
        case "ArrowLeft":
            arrowLeft = true
            break
        case "ArrowRight":
            arrowRight = true
            break 
        case "a":
            a = true
            break    
        case "d":
            d = true
            break    
    }
}

document.addEventListener("keyup", onDocumentKeyUp, false)

function onDocumentKeyUp(event){
    console.log(event.key)
    switch(event.key){
        case "ArrowLeft":
            arrowLeft = false
            break
        case "ArrowRight":
            arrowRight = false
            break 
        case "a":
            a = false
            break 
        case "d":
            d = false
            break 
    }
}




