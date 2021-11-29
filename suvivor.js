import * as THREE from "./libs/three.js/r125/three.module.js";
import { OrbitControls } from "./libs/three.js/r125/controls/OrbitControls.js";
import { OBJLoader } from "./libs/three.js/r125/loaders/OBJLoader.js";
import { MTLLoader } from "./libs/three.js/r125/loaders/MTLLoader.js";
import { FBXLoader } from "./libs/three.js/r125/loaders/FBXLoader.js";

let renderer = null,
  scene = null,
  camera = null,
  root = null,
  group = null,
  manGroup = null,
  island = null,
  fish = null,
  waves = null,
  orbitControls = null;

let duration = 10,
  islandAnimator = null,
  boatAnimator = null,
  waveAnimator = null,
  lightAnimator = null,
  waterAnimator = null,
  fishAnimator = null,
  rodAnimator = null,
  logsAnimator = null,
  planeAnimator = null,
  manAnimator = null,
  cameraAnimator = null;

let directionalLight = null;
let spotLight = null;
let ambientLight = null;

const waterMapUrl = "../models/images/water_texture.jpg";

let objPalmIsland = {
  obj: "models/palm_island/palm_island.obj",
  mtl: "models/palm_island/palm_island.mtl",
};
let objCarp = {
  obj: "models/fish/Carp.obj",
  mtl: "models/fish/Carp.mtl",
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

let objfRod = {
  obj: "./models/FishingRod/fishingRod.obj",
  mtl: "./models/FishingRod/fishingRod.mtl",
};

let objInitTent = {
  obj: "./models/initTent/Firewood.obj",
  mtl: "./models/initTent/Firewood.mtl",
};

let isMovingMouse = false,
  fishingTries = 0;

function main() {
  const canvas = document.getElementById("webglcanvas");
  let startButton = document.getElementById("start");
  let title = document.getElementById("title");
  let waterDiv = document.getElementById("water");
  let sceneBoatFloat = document.getElementById("sceneBoatFloat");
  let continueSceneBoat = document.getElementById("continueSceneBoat");
  let continueSceneHelp = document.getElementById("continueSceneHelp");
  let continueSceneTent = document.getElementById("continueSceneTent");
  let continueSceneSaved = document.getElementById("continueSceneSaved");
  let rodDiv = document.getElementById("rod");
  let logsDiv = document.getElementById("logs");
  let planeFlyDiv = document.getElementById("planeFly");
  let clickHereButton = document.getElementById("circle-button");
  let endDiv = document.getElementById("end");

  createMainTitleScene(canvas);
  startButton.onclick = () => {
    title.innerHTML = "";
    playCameraAnimationTitle();
    createBoatFloatScene();
    playBoatFloatSceneAnimations();
    group.addEventListener("click", function () {
      playFishFlyAnimation;
    });
    sceneBoatFloat.style.display = "block";
    waterDiv.style.display = "block";
  };
  sceneBoatFloat.addEventListener("mousedown", (e) => {
    isMovingMouse = true;
  });
  sceneBoatFloat.addEventListener("mousemove", (e) => {
    if (isMovingMouse) {
      playBoatArriveScene();
      playBoatArriveAnimations();
      isMovingMouse = false;
      sceneBoatFloat.style.display = "none";
      continueSceneBoat.style.display = "block";
    }
  });
  planeFlyDiv.addEventListener("mousedown", (e) => {
    isMovingMouse = true;
  });
  planeFlyDiv.addEventListener("mousemove", (e) => {
    if (isMovingMouse) {
      playPlaneFlyAnimations();
      isMovingMouse = false;
      planeFlyDiv.style.display = "none";
      clickHereButton.style.display = "block";
    }
  });
  continueSceneBoat.addEventListener("mousedown", () => {
    isMovingMouse = true;
  });
  continueSceneBoat.addEventListener("mousemove", (e) => {
    if (isMovingMouse) {
      isMovingMouse = false;
      playTransitionToHelp();
      continueSceneBoat.style.display = "none";
      continueSceneHelp.style.display = "block";
      waterDiv.style.display = "none";
    }
  });
  continueSceneHelp.addEventListener("mousedown", () => {
    isMovingMouse = true;
  });
  continueSceneHelp.addEventListener("mousemove", (e) => {
    if (isMovingMouse) {
      isMovingMouse = false;
      playTransitionToFishing();
      continueSceneHelp.style.display = "none";
      createFishingScene();
      rodDiv.style.display = "block";
      waterDiv.style.width = "70%";
      waterDiv.style.height = "60%";
      waterDiv.style.marginTop = "30%";
      waterDiv.style.display = "block";
    }
  });
  continueSceneTent.addEventListener("mousedown", () => {
    isMovingMouse = true;
  });
  continueSceneTent.addEventListener("mousemove", (e) => {
    if (isMovingMouse) {
      isMovingMouse = false;
      createTentScene();
      playTransitionToTent();
      waterDiv.style.display = "none";
      logsDiv.style.display = "block";
      continueSceneTent.style.display = "none";
      continueSceneSaved.style.display = "block";
    }
  });
  continueSceneSaved.addEventListener("mousedown", () => {
    isMovingMouse = true;
  });
  continueSceneSaved.addEventListener("mousemove", (e) => {
    if (isMovingMouse) {
      isMovingMouse = false;
      playTransitionToSaved();
      logsDiv.style.display = "none";
      continueSceneSaved.style.display = "none";
      planeFlyDiv.style.display = "block";
    }
  });
  waterDiv.onclick = () => {
    if (fish) {
      playFishFlyAnimation();
    }
  };
  rodDiv.onclick = () => {
    if (group) {
      playFishingAnimations();
      fishingTries += 1;
    }
    if (fishingTries > 2) {
      playFishedAnimation();
      rodDiv.style.display = "none";
      continueSceneTent.style.display = "block";
    }
  };
  logsDiv.ondblclick = () => {
    if (group) {
      logsDiv.style.display = "none";
      playLogsAnimations();
      setTimeout(buildTent(), 6000);
    }
  };
  clickHereButton.onclick = () => {
    playTransitionToEnd();
    clickHereButton.style.display = "none";
    endDiv.style.display = "block";
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
  directionalLight = new THREE.DirectionalLight(0x888888, 0.7);

  // Create and add all the lights
  directionalLight.position.set(0, 1, 2);
  root.add(directionalLight);

  ambientLight = new THREE.AmbientLight(0x888888);
  root.add(ambientLight);
  //sky map
  let materialArray = [];
  let texture_ft = new THREE.TextureLoader().load(
    "./models/skyboxsun25deg/nx.jpg"
  );
  let texture_bk = new THREE.TextureLoader().load(
    "./models/skyboxsun25deg/px.jpg"
  );
  let texture_up = new THREE.TextureLoader().load(
    "./models/skyboxsun25deg/py.jpg"
  );
  let texture_dn = new THREE.TextureLoader().load(
    "./models/skyboxsun25deg/ny.jpg"
  );
  let texture_rt = new THREE.TextureLoader().load(
    "./models/skyboxsun25deg/nz.jpg"
  );
  let texture_lf = new THREE.TextureLoader().load(
    "./models/skyboxsun25deg/pz.jpg"
  );

  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_up }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_dn }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
  materialArray.push(new THREE.MeshBasicMaterial({ map: texture_lf }));

  for (let i = 0; i < 6; i++) materialArray[i].side = THREE.BackSide;

  let skyboxGeo = new THREE.BoxGeometry(3000, 3000, 3000);
  let sky = new THREE.Mesh(skyboxGeo, materialArray);

  root.add(sky);
  // Nos add group to our scene
  scene.add(root);
  // Create a texture map
  let waterMap = new THREE.TextureLoader().load(waterMapUrl);
  waterMap.wrapS = waterMap.wrapT = THREE.RepeatWrapping;
  waterMap.repeat.set(4, 4);

  // Put in a ground plane to show off the lighting
  const floorGeometry = new THREE.PlaneGeometry(2000, 2000, 50, 50);
  waves = new THREE.Mesh(
    floorGeometry,
    new THREE.MeshPhongMaterial({ map: waterMap, side: THREE.DoubleSide })
  );
  waves.rotation.x = -Math.PI / 2;
  waves.position.y = -1.02;

  // Add the waves to our group
  root.add(waves);
  playWaterAnimations();
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
function createBoatFloatScene() {
  // Create a group to hold the objects
  group = new THREE.Object3D();
  fish = new THREE.Object3D();
  manGroup = new THREE.Object3D();

  // Add lifeboat and fishes
  loadObjMtl(objLifeboat, -38, -16, 43, 0.15, 0.15, 0.15);
  loadObjMtl(objCarp, -13, -5, 0, 3.5, 3.5, 3.5);
  loadObjMtl(objCarp, 18, -5, -20, 3, 3, 3);

  const loader = new FBXLoader();

  loader.load(
    "./models/55-rp_nathan_animated_003_walking_fbx/rp_nathan_animated_003_walking.fbx",
    function (object) {
      object.scale.set(0.05, 0.05, 0.05);
      object.rotation.y = Math.PI / 2.3;
      object.position.set(-1, -4, -1);

      manGroup.add(object);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );
  group.add(manGroup);

  root.add(group);
  root.add(fish);
}
function playWaterAnimations() {
  // rotation animation
  waves.rotation.set(-Math.PI / 2, 0, 0);
  waveAnimator = new KF.KeyFrameAnimator();
  waveAnimator.init({
    interps: [
      {
        keys: [0, 0.5, 1],
        values: [
          { x: -Math.PI / 2, y: 0 },
          { x: -Math.PI / 2.05, y: 0 },
          { x: -Math.PI / 2, y: 0 },
        ],
        target: waves.rotation,
      },
    ],
    loop: true,
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
          { r: 0.778, g: 0.778, b: 0.778 },
          { r: 0.556, g: 0.556, b: 0.556 },
          { r: 0.667, g: 0.667, b: 0.667 },
          { r: 0.887, g: 0.887, b: 0.887 },
          { r: 0.9, g: 0.9, b: 0.9 },
        ],
        target: directionalLight.color,
      },
    ],
    loop: true,
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
          { x: 0.2, y: 0 },
          { x: 0.5, y: 0 },
        ],
        target: waves.material.map.offset,
      },
    ],
    loop: true,
    duration: duration * 1000,
    easing: TWEEN.Easing.Sinusoidal.In,
  });
  waterAnimator.start();
}
function playBoatFloatSceneAnimations() {
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
    loop: true,
    duration: duration * 1000,
    easing: TWEEN.Easing.Bounce.InOut,
  });
  boatAnimator.start();
}
function playFishFlyAnimation() {
  // fish animation
  fish.position.set(0, 0, 0);
  fishAnimator = new KF.KeyFrameAnimator();
  fishAnimator.init({
    interps: [
      {
        keys: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        values: [
          { x: -13, y: -5, z: 0 },
          { x: -10, y: -3, z: 0.25 },
          { x: -9, y: -1, z: 0.5 },
          { x: -6, y: 1, z: 0.25 },
          { x: -3, y: 3, z: 0 },
          { x: -1, y: 5, z: 0 },
          { x: 2, y: 6, z: 0 },
          { x: 4, y: 5, z: 0 },
          { x: 5, y: 3, z: 0 },
          { x: 6, y: 0, z: 0 },
        ],
        target: fish.position,
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
        target: fish.rotation,
      },
    ],
    loop: false,
    duration: duration * 150,
    easing: TWEEN.Easing.Linear.None,
  });
  fishAnimator.start();
}
function playBoatArriveScene() {
  island = new THREE.Object3D();

  loadObjMtl(objPalmIsland, 270, 0, 2, 0.2, 0.2, 0.2);

  root.add(island);
}
function playBoatArriveAnimations() {
  group.position.set(0, 0, 0);
  group.rotation.set(0, 0, 0);
  islandAnimator = new KF.KeyFrameAnimator();
  islandAnimator.init({
    interps: [
      {
        keys: [0, 0.2, 0.25, 0.375, 0.5, 0.9, 1],
        values: [
          { x: 250, y: 0, z: 2 },
          { x: 200, y: 0, z: 2 },
          { x: 150, y: 0, z: 2 },
          { x: 110, y: 0, z: 2 },
          { x: 70, y: 0, z: 2 },
          { x: 20, y: 0, z: 2 },
          { x: -20, y: 0, z: 2 },
        ],
        target: island.position,
      },
    ],
    loop: false,
    duration: duration * 300,
    easing: TWEEN.Easing.Linear.None,
  });
  islandAnimator.start();
  cameraAnimator.init({
    interps: [
      {
        keys: [0, 1],
        values: [
          { x: 0, y: 7, z: 45 },
          { x: -28, y: 14, z: 60 },
        ],
        target: camera.position,
      },
    ],
    duration: duration * 400,
  });
  cameraAnimator.start();

  boatAnimator.init({
    interps: [
      {
        keys: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
        values: [
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 0, z: 0.25 },
          { x: 3, y: 0, z: 0.25 },
          { x: 6, y: 0.25, z: 0.25 },
          { x: 9, y: 1, z: 1 },
          { x: 12, y: 0.25, z: 0.25 },
          { x: 19, y: 0.75, z: 0.75 },
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
    loop: false,
    duration: duration * 500,
    easing: TWEEN.Easing.Cubic.InOut,
  });
  boatAnimator.start();
  group.position.set(19, 2, 2);
}
function playTransitionToHelp() {
  // color animation
  lightAnimator.init({
    interps: [
      {
        keys: [0, 0.4, 0.6, 0.8, 1],
        values: [
          { r: 1, g: 1, b: 1 },
          { r: 0.1, g: 0.1, b: 0.1 },
          { r: 0, g: 0, b: 0 },
          { r: 0.1, g: 0.1, b: 0.1 },
          { r: 1, g: 1, b: 1 },
        ],
        target: directionalLight.color,
      },
      {
        keys: [0, 0.4, 0.6, 0.8, 1],
        values: [
          { r: 1, g: 1, b: 1 },
          { r: 0.5, g: 0.5, b: 0.5 },
          { r: 0, g: 0, b: 0 },
          { r: 0.5, g: 0.5, b: 0.5 },
          { r: 0.8, g: 0.8, b: 0.8 },
        ],
        target: ambientLight.color,
      },
    ],
    loop: false,
    duration: duration * 100,
    easing: TWEEN.Easing.Circular.Out,
  });
  lightAnimator.start();

  cameraAnimator.init({
    interps: [
      {
        keys: [0, 1],
        values: [
          { x: -28, y: 14, z: 60 },
          { x: -120, y: 20, z: -100 },
        ],
        target: camera.position,
      },
    ],
    loop: false,
    duration: duration * 100,
    easing: TWEEN.Easing.Circular.Out,
  });
  cameraAnimator.start();

  manAnimator = new KF.KeyFrameAnimator();
  manAnimator.init({
    interps: [
      {
        keys: [0, 1],
        values: [
          { x: 0, y: 0, z: 0 },
          { x: 45, y: 26, z: 0 },
        ],
        target: manGroup.position,
      },
      {
        keys: [0, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        values: [
          { x: 0, y: 0, z: 0 },
          { x: 0.5, y: 0, z: 0 },
          { x: 0, y: 0, z: 0 },
          { x: -0.5, y: 0, z: 0 },
          { x: 0, y: 0, z: 0 },
          { x: 0.5, y: 0, z: 0 },
          { x: 0, y: 0, z: 0 },
          { x: -0.5, y: 0, z: 0 },
          { x: 0, y: 0, z: 0 },
          { x: 0.5, y: 0, z: 0 },
          { x: 0, y: 0, z: 0 },
        ],
        target: manGroup.rotation,
      },
    ],
    loop: false,
    duration: duration * 600,
    easing: TWEEN.Easing.Linear.None,
  });
  manAnimator.start();

  // group.clear();
  fish.clear();
}
function playTransitionToFishing() {
  // color animation
  lightAnimator.init({
    interps: [
      {
        keys: [0, 0.4, 0.6, 0.8, 1],
        values: [
          { r: 1, g: 1, b: 1 },
          { r: 0.1, g: 0.1, b: 0.1 },
          { r: 0, g: 0, b: 0 },
          { r: 0.1, g: 0.1, b: 0.1 },
          { r: 1, g: 1, b: 1 },
        ],
        target: directionalLight.color,
      },
      {
        keys: [0, 0.4, 0.6, 0.8, 1],
        values: [
          { r: 1, g: 1, b: 1 },
          { r: 0.5, g: 0.5, b: 0.5 },
          { r: 0, g: 0, b: 0 },
          { r: 0.5, g: 0.5, b: 0.5 },
          { r: 0.8, g: 0.8, b: 0.8 },
        ],
        target: ambientLight.color,
      },
    ],
    loop: false,
    duration: duration * 100,
    easing: TWEEN.Easing.Circular.Out,
  });
  lightAnimator.start();
  cameraAnimator.init({
    interps: [
      {
        keys: [0, 1],
        values: [
          { x: -120, y: 20, z: -100 },
          { x: 95, y: 15, z: 120 },
        ],
        target: camera.position,
      },
    ],
    loop: false,
    duration: duration * 100,
    easing: TWEEN.Easing.Circular.Out,
  });
  cameraAnimator.start();

  group.clear();
  fish.clear();
}
function createFishingScene() {
  loadObjMtl(objfRod, 32, 22, 5, 6, 6, 6);
  loadObjMtl(objCarp, 10, -10, 50, 23, 23, 23);
  root.add(fish);
  root.add(group);
}
function playFishingAnimations() {
  // position animation
  group.position.set(0, 0, 0);
  group.rotation.set(0, 0, 0);

  rodAnimator = new KF.KeyFrameAnimator();
  rodAnimator.init({
    interps: [
      {
        keys: [0, 0.5, 1],
        values: [
          { x: 0, y: 0, z: 0 },
          { x: 0.25, y: 0.25, z: 0 },
          { x: 0, y: 0, z: 0 },
        ],
        target: group.position,
      },
      {
        keys: [0, 0.5, 1],
        values: [
          { x: 0, z: 0 },
          { x: 0, z: Math.PI / 12 },
          { x: 0, z: 0 },
        ],
        target: group.rotation,
      },
    ],
    loop: false,
    duration: duration * 100,
    easing: TWEEN.Easing.Bounce.InOut,
  });
  rodAnimator.start();
}
function playFishedAnimation() {
  fish.position.set(-40, -90, 0);

  // rod animation
  fish.rotation.set(0, 0, Math.PI / 2);
  rodAnimator.init({
    interps: [
      {
        keys: [0, 0.5, 1],
        values: [
          { x: 0, y: 0, z: 0 },
          { x: 1, y: 1, z: 1 },
          { x: 0, y: 0, z: 0 },
        ],
        target: group.position,
      },
      {
        keys: [0, 0.5, 1],
        values: [
          { x: 0, z: 0 },
          { x: 0, z: Math.PI / 12 },
          { x: 0, z: 0 },
        ],
        target: group.rotation,
      },
    ],
    loop: false,
    duration: duration * 250,
    easing: TWEEN.Easing.Bounce.In,
  });
  rodAnimator.start();

  // fish animation
  fishAnimator = new KF.KeyFrameAnimator();
  fishAnimator.init({
    interps: [
      {
        keys: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        values: [
          { x: -40, y: -60, z: 0 },
          { x: -10, y: -65, z: 0 },
          { x: -10, y: -65, z: 0 },
          { x: -15, y: -65, z: 0 },
          { x: -10, y: -60, z: 0 },
          { x: -10, y: -60, z: 0 },
          { x: -10, y: -54, z: 0 },
          { x: -10, y: -44, z: 0 },
          { x: 0, y: 0, z: 0 },
          { x: 0, y: 0, z: 0 },
        ],
        target: fish.position,
      },
    ],
    loop: false,
    duration: duration * 400,
    easing: TWEEN.Easing.Bounce.In,
  });
  fishAnimator.start();
}
function playTransitionToTent() {
  // color animation
  lightAnimator.init({
    interps: [
      {
        keys: [0, 0.4, 0.6, 0.8, 1],
        values: [
          { r: 1, g: 1, b: 1 },
          { r: 0.1, g: 0.1, b: 0.1 },
          { r: 0, g: 0, b: 0 },
          { r: 0.1, g: 0.1, b: 0.1 },
          { r: 0.75, g: 0.75, b: 0.75 },
        ],
        target: directionalLight.color,
      },
      {
        keys: [0, 0.4, 0.6, 0.8, 1],
        values: [
          { r: 1, g: 1, b: 1 },
          { r: 0.5, g: 0.5, b: 0.5 },
          { r: 0, g: 0, b: 0 },
          { r: 0.5, g: 0.5, b: 0.5 },
          { r: 1, g: 1, b: 1 },
        ],
        target: ambientLight.color,
      },
    ],
    loop: false,
    duration: duration * 100,
    easing: TWEEN.Easing.Circular.Out,
  });
  lightAnimator.start();
  cameraAnimator.init({
    interps: [
      {
        keys: [0, 1],
        values: [
          { x: 95, y: 15, z: 120 },
          { x: 110, y: 17, z: 0 },
        ],
        target: camera.position,
      },
    ],
    loop: false,
    duration: duration * 100,
    easing: TWEEN.Easing.Circular.Out,
  });
  cameraAnimator.start();

  group.clear();
  fish.clear();
}
function createTentScene() {
  loadObjMtl(objInitTent, 80, 8, 0, 0.1, 0.1, 0.1);
  root.add(group);
}
function playLogsAnimations() {
  // position animation
  logsAnimator = new KF.KeyFrameAnimator();
  logsAnimator.init({
    interps: [
      {
        keys: [0, 0.5, 1],
        values: [
          { x: 19, y: 0.75, z: 0.74 },
          { x: 16, y: 1, z: 0 },
          { x: 19, y: 0.75, z: 0.74 },
        ],
        target: group.position,
      },
    ],
    duration: duration * 100,
    easing: TWEEN.Easing.Bounce.InOut,
  });
  logsAnimator.start();
}
function buildTent() {
  group.clear();
  loadObjMtl(objTent, 60, 8.5, 0, 0.08, 0.08, 0.08);
  console.log(group.position);

  // spotLight.target.position.set(19, 0.75, 0.75);
  console.log(spotLight.target.position);

  root.add(spotLight);
  root.add(group);
}
function playTransitionToSaved() {
  // color animation
  lightAnimator.init({
    interps: [
      {
        keys: [0, 0.4, 0.6, 0.8, 1],
        values: [
          { r: 1, g: 1, b: 1 },
          { r: 0.1, g: 0.1, b: 0.1 },
          { r: 0, g: 0, b: 0 },
          { r: 0.1, g: 0.1, b: 0.1 },
          { r: 1, g: 1, b: 1 },
        ],
        target: directionalLight.color,
      },
      {
        keys: [0, 0.4, 0.6, 0.8, 1],
        values: [
          { r: 1, g: 1, b: 1 },
          { r: 0.5, g: 0.5, b: 0.5 },
          { r: 0, g: 0, b: 0 },
          { r: 0.5, g: 0.5, b: 0.5 },
          { r: 0.8, g: 0.8, b: 0.8 },
        ],
        target: ambientLight.color,
      },
    ],
    loop: false,
    duration: duration * 100,
    easing: TWEEN.Easing.Circular.Out,
  });
  lightAnimator.start();
  cameraAnimator.init({
    interps: [
      {
        keys: [0, 1],
        values: [
          { x: 110, y: 17, z: 0 },
          { x: -280, y: 15, z: -100 },
        ],
        target: camera.position,
      },
    ],
    loop: false,
    duration: duration * 100,
    easing: TWEEN.Easing.Circular.Out,
  });
  cameraAnimator.start();
  group.clear();
  manGroup.position.set(40, 20, 10);
  root.add(manGroup);
}
function playPlaneFlyAnimations() {
  loadObjMtl(objPlane, 270, 0, 2, 0.2, 0.2, 0.2);

  group.position.set(0, 0, 0);
  group.rotation.set(0, 0, 0);
  planeAnimator = new KF.KeyFrameAnimator();
  planeAnimator.init({
    interps: [
      {
        keys: [0, 0.45, 0.5, 0.55, 1],
        values: [
          { x: -150, y: 200, z: 420 },
          { x: -150, y: 50, z: 30 },
          { x: -150, y: 50, z: 30 },
          { x: -150, y: 50, z: 30 },
          { x: -150, y: 200, z: -470 },
        ],
        target: group.position,
      },
    ],
    loop: false,
    duration: duration * 500,
    easing: TWEEN.Easing.Linear.None,
  });
  planeAnimator.start();
  manAnimator.init({
    interps: [
      {
        keys: [0, 0.25, 0.5, 0.75, 1],
        values: [
          { x: 40, y: 20, z: 10 },
          { x: 100, y: 20, z: 10 },
          { x: 140, y: 25, z: 10 },
          { x: -1300, y: -1130, z: -1115 },
          { x: -1000, y: -1110, z: -1110 },
        ],
        target: manGroup.position,
      },
    ],
    loop: false,
    duration: duration * 500,
    easing: TWEEN.Easing.Linear.None,
  });
  manAnimator.start();
}
function playTransitionToEnd() {
  // color animation
  lightAnimator.init({
    interps: [
      {
        keys: [0, 0.4, 0.6, 0.8, 1],
        values: [
          { r: 1, g: 1, b: 1 },
          { r: 0.1, g: 0.1, b: 0.1 },
          { r: 0, g: 0, b: 0 },
          { r: 0.1, g: 0.1, b: 0.1 },
          { r: 1, g: 1, b: 1 },
        ],
        target: directionalLight.color,
      },
      {
        keys: [0, 0.4, 0.6, 0.8, 1],
        values: [
          { r: 1, g: 1, b: 1 },
          { r: 0.5, g: 0.5, b: 0.5 },
          { r: 0, g: 0, b: 0 },
          { r: 0.5, g: 0.5, b: 0.5 },
          { r: 0.8, g: 0.8, b: 0.8 },
        ],
        target: ambientLight.color,
      },
    ],
    loop: false,
    duration: duration * 100,
    easing: TWEEN.Easing.Circular.Out,
  });
  lightAnimator.start();
  cameraAnimator.init({
    interps: [
      {
        keys: [0, 1],
        values: [
          { x: -280, y: 15, z: -100 },
          { x: 180, y: 35, z: 150 },
        ],
        target: camera.position,
      },
    ],
    loop: false,
    duration: duration * 100,
    easing: TWEEN.Easing.Circular.Out,
  });
  cameraAnimator.start();
  group.clear();

  // add plane to scene
  loadObjMtl(objPlane, 270, 0, 2, 0.2, 0.2, 0.2);

  group.position.set(0, 0, 0);
  group.rotation.set(0, 0, 0);
  planeAnimator.init({
    interps: [
      {
        keys: [0, 0.25, 0.5, 0.75, 1],
        values: [
          { x: -1600, y: 200, z: 0 },
          { x: -1500, y: 200, z: -600 },
          { x: -1400, y: 200, z: -1200 },
          { x: -1300, y: 200, z: -1800 },
          { x: -1200, y: 200, z: -2450 },
        ],
        target: group.position,
      },
    ],
    loop: false,
    duration: duration * 1000,
    easing: TWEEN.Easing.Linear.None,
  });
  planeAnimator.start();
  manGroup.clear();
}

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
async function loadObjMtl(objModelUrl, x, y, z, scaleX, scaleY, scaleZ) {
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
    if (objModelUrl == objCarp) {
      object.rotation.y = Math.PI / 2;
    }
    if (objModelUrl == objfRod) {
      object.rotation.y = -Math.PI / 1.5;
    }
    if (objModelUrl == objInitTent) {
      object.rotation.z = Math.PI / 1.5;
      object.rotation.x = -Math.PI / 2;
    }
    if (objModelUrl == objTent) {
      object.rotation.y = -Math.PI / 1;
    }

    // object.position.y += yPosition;
    if (y != 0) {
      object.position.y = y;
    }
    if (x != 0) {
      object.position.x = x;
    }
    if (z != 0) {
      object.position.z = z;
    }
    object.scale.set(scaleX, scaleY, scaleZ);

    if (objModelUrl == objPalmIsland) {
      island.add(object);
    } else if (objModelUrl == objCarp) {
      fish.add(object);
    } else {
      group.add(object);
    }
  } catch (err) {
    onError(err);
  }
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
window.onload = () => main();
