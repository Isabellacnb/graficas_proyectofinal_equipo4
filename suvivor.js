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
  waves = null,
  sky = null,
  orbitControls = null;

let cube = null;

let duration = 10,
  boatAnimator = null,
  waveAnimator = null,
  lightAnimator = null,
  waterAnimator = null,
  skyAnimator = null,
  cameraAnimator = null,
  loopAnimation = true;

let currentTime = Date.now();

let directionalLight = null;
let spotLight = null;
let ambientLight = null;

let SHADOW_MAP_WIDTH = 4096,
  SHADOW_MAP_HEIGHT = 4096;

const waterMapUrl = "../models/images/water_texture.jpg";
const skyMapUrl = "../models/images/sky.jpg";

let objPalmIsland = {
  obj: "models/palm_island/palm_island.obj",
  mtl: "models/palm_island/palm_island.mtl",
};
let objCarp = {
  obj: "models/fish/Carp.obj",
  mtl: "models/fish/Carp.mtl",
};
let objCampFire = {
  obj: "./models/campfire/camp_fire.obj",
  mtl: "./models/campfire/camp_fire.mtl",
};

let objTent = {
  obj: "./models/tent/Basiccampingtents.obj",
  mtl: "./models/tent/Basiccampingtents.mtl",
};

let objLifeboat = {
  obj: "./models/lifeboat/LifeBoat.obj",
  mtl: "./models/lifeboat/LifeBoat.mtl",
};

let objPlane = {
  obj: "./models/plane/Plane.obj",
  mtl: "./models/plane/Plane.mtl",
};
let objPerson = {
  obj: "./models/person/person2.obj",
  mtl: "./models/person/person2.mtl",
};
let objfRod = {
  obj: "./models/FishingRod/fishingRod.obj",
  mtl: "./models/FishingRod/fishingRod.mtl",
};
let objbackpack = {
  obj: "./models/backpack/Backpack.obj",
  mtl: "./models/backpack/Backpack.mtl",
};
let objMan = {
  obj: "./models/Man/Man.obj",
  mtl: "./models/Man/Man.mtl",
};

function main() {
  const canvas = document.getElementById("webglcanvas");
  let startButton = document.getElementById("start");
  let title = document.getElementById("title");
  let scene2 = document.getElementById("scene2");
  let next = document.getElementById("next");

  createMainTitleScene(canvas);
  playSkyAnimation();

  startButton.onclick = () => {
    title.innerHTML = "";
    createFirstScene();
    playCameraAnimationTitle();
    playFirstSceneAnimations();
    scene2.style.display = "block";
  };

  update();
}

function createMainTitleScene(canvas) {
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
    1,
    4000
  );
  camera.position.set(0, 50, 1000);

  orbitControls = new OrbitControls(camera, renderer.domElement);

  // Create a group to hold all the objects
  root = new THREE.Object3D();

  // Add a directional light to show off the object
  directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);

  // Create and add all the lights
  directionalLight.position.set(0, 1, 2);
  root.add(directionalLight);

  ambientLight = new THREE.AmbientLight(0x888888);
  root.add(ambientLight);

  let skyMap = new THREE.TextureLoader().load(skyMapUrl);
  skyMap.wrapS = skyMap.wrapT = THREE.RepeatWrapping;

  const skyGeometry = new THREE.SphereGeometry(1000, 50, 50);
  sky = new THREE.Mesh(
    skyGeometry,
    new THREE.MeshPhongMaterial({ map: skyMap, side: THREE.DoubleSide })
  );
  sky.position.set(0, 0, -500);
  root.add(sky);
  // Nos add group to our scene
  scene.add(root);
}

function playSkyAnimation() {
  // sky animation
  skyAnimator = new KF.KeyFrameAnimator();
  skyAnimator.init({
    interps: [
      {
        keys: [0, 1],
        values: [
          { x: 0, y: 0 },
          { x: 0.2, y: 0 },
        ],
        target: sky.material.map.offset,
      },
    ],
    loop: loopAnimation,
    duration: duration * 1000,
    easing: TWEEN.Easing.Sinusoidal.In,
  });
  skyAnimator.start();
}
function playCameraAnimationTitle() {
  // camera animation zoom
  cameraAnimator = new KF.KeyFrameAnimator();
  cameraAnimator.init({
    interps: [
      {
        keys: [0, 1],
        values: [
          { x: 0, y: 50, z: 1000 },
          { x: 0, y: 7, z: 45 },
        ],
        target: camera.position,
      },
    ],
    duration: 4000,
  });
  cameraAnimator.start();
}
function createFirstScene() {
  // Create a group to hold the objects
  group = new THREE.Object3D();

  // Create a texture map
  let waterMap = new THREE.TextureLoader().load(waterMapUrl);
  waterMap.wrapS = waterMap.wrapT = THREE.RepeatWrapping;
  waterMap.repeat.set(4, 4);

  // Put in a ground plane to show off the lighting
  const floorGeometry = new THREE.PlaneGeometry(900, 900, 50, 50);
  waves = new THREE.Mesh(
    floorGeometry,
    new THREE.MeshPhongMaterial({ map: waterMap, side: THREE.DoubleSide })
  );
  waves.rotation.x = -Math.PI / 2;
  waves.position.y = -1.02;

  // Add the waves to our group
  root.add(waves);

  loadObjMtl(objLifeboat, objectList, -38, -16, 38, 0.15, 0.15, 0.15);

  root.add(group);
}
function playFirstSceneAnimations() {
  // position animation
  group.position.set(0, 0, 0);
  group.rotation.set(0, 0, 0);

  boatAnimator = new KF.KeyFrameAnimator();
  boatAnimator.init({
    interps: [
      {
        keys: [0, 0.2, 0.25, 0.375, 0.5, 0.9, 1],
        values: [
          { x: 0, y: 0, z: 0 },
          { x: 0.5, y: 0, z: 0.5 },
          { x: 0, y: 0, z: 0 },
          { x: 0.25, y: 0.25, z: 0.25 },
          { x: 1, y: 1, z: 1 },
          { x: 0.25, y: 0.25, z: 0.25 },
          { x: 0, y: 0, z: 0 },
        ],
        target: group.position,
      },
      {
        keys: [0, 0.25, 0.5, 0.75, 1],
        values: [
          { x: 0, z: 0 },
          { x: Math.PI / 12, z: Math.PI / 12 },
          { x: 0, z: Math.PI / 12 },
          { x: -Math.PI / 12, z: -Math.PI / 12 },
          { x: 0, z: 0 },
        ],
        target: group.rotation,
      },
    ],
    loop: loopAnimation,
    duration: duration * 1000,
    easing: TWEEN.Easing.Bounce.InOut,
  });
  boatAnimator.start();

  // rotation animation
  waves.rotation.set(-Math.PI / 2, 0, 0);
  waveAnimator = new KF.KeyFrameAnimator();
  waveAnimator.init({
    interps: [
      {
        keys: [0, 0.5, 1],
        values: [
          { x: -Math.PI / 2, y: 0 },
          { x: -Math.PI / 2.2, y: 0 },
          { x: -Math.PI / 2, y: 0 },
        ],
        target: waves.rotation,
      },
    ],
    loop: loopAnimation,
    duration: duration * 1000,
  });
  waveAnimator.start();

  // color animation
  directionalLight.color.setRGB(1, 1, 1);
  lightAnimator = new KF.KeyFrameAnimator();
  lightAnimator.init({
    interps: [
      {
        keys: [0, 0.4, 0.6, 0.7, 0.8, 1],
        values: [
          { r: 1, g: 1, b: 1 },
          { r: 0.66, g: 0.66, b: 0.66 },
          { r: 0.444, g: 0.444, b: 0.444 },
          { r: 0.667, g: 0.667, b: 0.667 },
          { r: 0.887, g: 0.887, b: 0.887 },
          { r: 0.9, g: 0.9, b: 0.9 },
        ],
        target: directionalLight.color,
      },
    ],
    loop: loopAnimation,
    duration: duration * 1000,
  });
  lightAnimator.start();

  // water animation
  waterAnimator = new KF.KeyFrameAnimator();
  waterAnimator.init({
    interps: [
      {
        keys: [0, 1],
        values: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
        ],
        target: waves.material.map.offset,
      },
    ],
    loop: loopAnimation,
    duration: duration * 1000,
    easing: TWEEN.Easing.Sinusoidal.In,
  });
  waterAnimator.start();
}

function finishFirstScene(canvas) {}

// Helper Functions
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
  xPosition,
  yPosition,
  zPosition,
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

    if (objModelUrl == objLifeboat) {
      object.rotation.x = -Math.PI / 2;
    }

    // object.position.y += yPosition;
    if (yPosition != 0) {
      object.position.y = yPosition;
    }
    if (xPosition != 0) {
      object.position.x = xPosition;
    }
    if (zPosition != 0) {
      object.position.z = zPosition;
    }

    object.scale.set(scaleX, scaleY, scaleZ);
    group.add(object);
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
  // animate();
  KF.update();

  // Update the camera controller
  orbitControls.update();
}

// function createScene(canvas) {
//   // Create the Three.js renderer and attach it to our canvas
//   renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

//   // Set the viewport size
//   renderer.setSize(canvas.width, canvas.height);

//   // Turn on shadows
//   renderer.shadowMap.enabled = true;

//   // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
//   renderer.shadowMap.type = THREE.BasicShadowMap;

//   // Create a new Three.js scene
//   scene = new THREE.Scene();

//   // Add  a camera so we can view the scene
//   camera = new THREE.PerspectiveCamera(
//     45,
//     canvas.width / canvas.height,
//     5,
//     4000
//   );
//   camera.position.set(-1050, 500, 15);
//   scene.add(camera);

//   orbitControls = new OrbitControls(camera, renderer.domElement);

//   // Create a group to hold all the objects
//   root = new THREE.Object3D();

//   // Add a directional light to show off the object
//   directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);

//   // Create and add all the lights
//   directionalLight.position.set(50, 50, 0.5);
//   directionalLight.target.position.set(0, 0, 0);
//   directionalLight.castShadow = true;
//   root.add(directionalLight);

//   spotLight = new THREE.SpotLight(0xaaaaaa);
//   spotLight.position.set(0, 0, 0);
//   spotLight.target.position.set(0, 0, 0);
//   root.add(spotLight);

//   spotLight.castShadow = true;

//   spotLight.shadow.camera.near = 1;
//   spotLight.shadow.camera.far = 200;
//   spotLight.shadow.camera.fov = 45;

//   spotLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
//   spotLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

//   ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
//   root.add(ambientLight);

//   // Create the objects
//   // loadObjMtl(objModelUrl, objectList,yPosition,xPosition,zPosition,scaleX,scaleY,scaleZ)
//   loadObjMtl(objPalmIsland, objectList, 1, 0, 0, 0.15, 0.15, 0.15);
//   // loadObjMtl(objCarp, objectList, -13.5, -300, 0, 10, 10, 10);
//   // loadObjMtl(objCampFire, objectList, 10, -150, 100, 10, 10, 10);
//   // loadObjMtl(objTent, objectList, 8, -150, 0, 0.1, 0.1, 0.1);
//   loadObjMtl(objLifeboat, objectList, 0, 0, 0, 0.5, 0.5, 0.5);
//   // loadObjMtl(objPlane, objectList, 140, 0, -30, 0.1, 0.1, 0.1);
//   // loadObjMtl(objPerson, objectList, 28, 0, -30, 1, 1, 1);
//   // loadObjMtl(objfRod, objectList, 10, -30, 130, 1, 1, 1);
//   // loadObjMtl(objbackpack, objectList, 10, -0, 130, 0.2, 0.2, 0.2);
//   // loadObjMtl(objMan, objectList, 18, 0, -100, 0.1, 0.1, 0.1);

//   scene.add(root);
// }

window.onload = () => main();
