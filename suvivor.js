import * as THREE from "./libs/three.js/r125/three.module.js";
import { OrbitControls } from "./libs/three.js/r125/controls/OrbitControls.js";
import { OBJLoader } from "./libs/three.js/r125/loaders/OBJLoader.js";
import { MTLLoader } from "./libs/three.js/r125/loaders/MTLLoader.js";

let renderer = null,
  scene = null,
  camera = null,
  root = null,
  group = null,
  objectList = [],
  orbitControls = null;

let duration = 20000; // ms
let currentTime = Date.now();

let directionalLight = null;
let spotLight = null;
let ambientLight = null;

let SHADOW_MAP_WIDTH = 4096,
  SHADOW_MAP_HEIGHT = 4096;

let objPalmIsland = {
  obj: "models/palm_island/palm_island.obj",
  mtl: "models/palm_island/palm_island.mtl",
};
let objCarp = {
  obj: "models/fish/Carp.obj",
  obj: "models/fish/Carp.mtl",
};
let objCampFire = {
  obj: "./models/campfire/Campfire_2.obj",
  obj: "./models/campfire/Campfire_2.mtl",
};

function main() {
  const canvas = document.getElementById("webglcanvas");

  createScene(canvas);

  update();
}

function onError(err) {
  console.error(err);
}

function onProgress(xhr) {
  if (xhr.lengthComputable) {
    const percentComplete = (xhr.loaded / xhr.total) * 100;
    console.log(
      xhr.target.responseURL,
      Math.round(percentComplete, 2) + "% downloaded"
    );
  }
}

async function loadObjMtl(
  objModelUrl,
  objectList,
  yPosition,
  xPosition,
  scaleX,
  scaleY,
  scaleZ
) {
  try {
    const mtlLoader = new MTLLoader();

    const materials = await mtlLoader.loadAsync(
      objModelUrl.mtl,
      onProgress,
      onError
    );

    materials.preload();

    const objLoader = new OBJLoader();

    objLoader.setMaterials(materials);
    const object = await objLoader.loadAsync(
      objModelUrl.obj,
      onProgress,
      onError
    );

    object.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    object.position.y += yPosition;
    if (xPosition != 0) {
      object.position.x = xPosition;
    }
    object.scale.set(scaleX, scaleY, scaleZ);

    objectList.push(object);
    scene.add(object);
  } catch (err) {
    onError(err);
  }
}

function animate() {
  let now = Date.now();
  let deltat = now - currentTime;
  currentTime = now;
  let fract = deltat / duration;
  let angle = Math.PI * 2 * fract;
}

function update() {
  requestAnimationFrame(function () {
    update();
  });

  // Render the scene
  renderer.render(scene, camera);

  // Spin the cube for next frame
  animate();

  // Update the camera controller
  orbitControls.update();
}

function createScene(canvas) {
  // Create the Three.js renderer and attach it to our canvas
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

  // Set the viewport size
  renderer.setSize(canvas.width, canvas.height);

  // Turn on shadows
  renderer.shadowMap.enabled = true;

  // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
  renderer.shadowMap.type = THREE.BasicShadowMap;

  // Create a new Three.js scene
  scene = new THREE.Scene();

  // Add  a camera so we can view the scene
  camera = new THREE.PerspectiveCamera(
    45,
    canvas.width / canvas.height,
    5,
    4000
  );
  camera.position.set(-1050, 500, 15);
  scene.add(camera);

  orbitControls = new OrbitControls(camera, renderer.domElement);

  // Create a group to hold all the objects
  root = new THREE.Object3D();

  // Add a directional light to show off the object
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

  // Create and add all the lights
  directionalLight.position.set(100, 100, 1);
  directionalLight.target.position.set(0, 0, 0);
  directionalLight.castShadow = true;
  root.add(directionalLight);

  spotLight = new THREE.SpotLight(0xaaaaaa);
  spotLight.position.set(-2000, 3000, -3000);
  spotLight.target.position.set(0, 0, 0);
  root.add(spotLight);

  spotLight.castShadow = true;

  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.camera.fov = 45;

  spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
  spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

  ambientLight = new THREE.AmbientLight(0x444444, 0.8);
  root.add(ambientLight);

  // Create the objects
  loadObjMtl(objPalmIsland, objectList, 1, 0, 0.15, 0.15, 0.15);
  loadObjMtl(objCarp, objectList, 50, -200, 5, 5, 5);

  // Create a group to hold the objects
  group = new THREE.Object3D();
  root.add(group);

  // Create the cylinder
  let geometry = new THREE.CylinderGeometry(1, 2, 2, 50, 10);
  let mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial());
  mesh.position.y = 50;
  mesh.position.x = -200;
  mesh.castShadow = false;
  mesh.receiveShadow = true;
  group.add(mesh);

  scene.add(root);
}

window.onload = () => main();
