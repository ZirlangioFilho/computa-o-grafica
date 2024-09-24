import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adicionando luz ambiente
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Adicionando luz direcional
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);


const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube = new THREE.Mesh(sphereGeometry, sphereMaterial);
cube.position.set(0, 0, -6); // Posicionando no centro da cena
scene.add(cube);

const whiteCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const whiteCubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const whiteCube = new THREE.Mesh(whiteCubeGeometry, whiteCubeMaterial);
whiteCube.position.set(0, 0, -10); // Iniciando no z = -10

// Ajustando a escala para transformar o cubo em um retângulo fino
whiteCube.scale.set(0, 0, 2); // Largura e altura finas, comprimento maior

whiteCube.rotation.y -= 0.5;
// Posicionando no eixo Z
scene.add(whiteCube);

const loader = new GLTFLoader();
loader.load('/modelos/Demo - Arm chair.gltf', function (gltf) {
    scene.add(gltf.scene);
    // Adicionando referência ao modelo para rotação
    model = gltf.scene;
    // Definindo a posição do modelo
    model.rotation.set(0, -1.5, 0); // Substitua por suas coordenadas desejadas
}, undefined, function (error) {
    console.error(error);
});

camera.position.z = 1;

let model; // Variável para armazenar o modelo carregado
let angle = 0; // Ângulo inicial
const radius = 0.5; // Raio do círculo

const cubes = []; // Array para armazenar os cubos
const maxCubes = 100; // Limite máximo de cubos

let arrowLeft = false
let arrowRight = false

let a = false
let d = false

function createCube(position) {
    if (cubes.length >= maxCubes) return; // Não criar mais cubos se atingir o limite

    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const cube = new THREE.Mesh(geometry, material);
    
    // Ajustando a escala para transformar o cubo em um retângulo fino
    cube.scale.set(0.05, 0.05, 2); // Largura e altura finas, comprimento maior
    
    // Posicionando o cubo em uma posição aleatória ou fornecida
    if (position) {
        cube.position.copy(position);
    } else {
        cube.position.set(
            (Math.random() - 0.5) * 20, // Posição X aleatória
            (Math.random() - 0.5) * 20, // Posição Y aleatória
            -10 // Posição Z inicial
        );
    }
    
    scene.add(cube);
    cubes.push(cube);
}

// Função para multiplicar cubos a cada segundo
setInterval(() => {
    // Criar múltiplos novos cubos
    for (let i = 0; i < 10; i++) { // Ajuste o número 2 para criar mais cubos
        createCube();
    }
    
    // Cada cubo existente cria múltiplos novos cubos
    cubes.forEach(cube => {
        for (let i = 0; i < 1; i++) { // Ajuste o número 1 para criar mais cubos por cubo existente
            createCube(cube.position);
        }
    });
}, 2000); // Aumente o intervalo para 2 segundos

function animate() {

    if (model) {
   
        model.rotation.x += 0.5;
        model.rotation.z += 0.5;
    }
    if(arrowLeft){
        angle -= 0.05; 
        model.position.x = Math.cos(angle) * radius;
        model.position.y = Math.sin(angle) * radius;
	}else
	if(arrowRight){
		angle += 0.05; 
        model.position.x = Math.cos(angle) * radius;
        model.position.y = Math.sin(angle) * radius;
	}else
    if(a){
        camera.rotation.y -= 0.01
        camera.position.x -= 0.05
    }else
    if(d){
        camera.rotation.y += 0.01
        camera.position.x += 0.05
    }

    // Movendo os cubos brancos em direção à tela
    for (let i = cubes.length - 1; i >= 0; i--) {
        const cube = cubes[i];
        if (cube.position.z < 5) {
            cube.position.z += 0.1; // Ajuste a velocidade conforme necessário
        } else {
            // Remover cubos que saíram do campo de visão
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




