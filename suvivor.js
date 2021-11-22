import * as THREE from "./libs/three.js/r125/three.module.js";
import { OrbitControls } from "./libs/three.js/r125/controls/OrbitControls.js";
import { OBJLoader } from "./libs/three.js/r125/loaders/OBJLoader.js";
import { MTLLoader } from "./libs/three.js/r125/loaders/MTLLoader.js";

let renderer = null,
  scene = null,
  camera = null,
  root = null,
  group = null,
  island = null,
  fish = null,
  waves = null,
  sky = null,
  orbitControls = null;

let duration = 10,
  islandAnimator = null,
  boatAnimator = null,
  waveAnimator = null,
  lightAnimator = null,
  waterAnimator = null,
  skyAnimator = null,
  fishAnimator = null,
  rodAnimator = null,
  cameraAnimator = null;

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

let objInitTent = {
  obj: "./models/",
};

let isMovingMouse = false,
  fishingTries = 0;

function main() {
  // play audio
  var audio = new Audio("ocean2.mp3");
  audio.volume = 0.4;
  audio.play();

  const canvas = document.getElementById("webglcanvas");
  let startButton = document.getElementById("start");
  let title = document.getElementById("title");
  let waterDiv = document.getElementById("water");
  let sceneBoatFloat = document.getElementById("sceneBoatFloat");
  let continueSceneBoat = document.getElementById("continueSceneBoat");
  let continueSceneHelp = document.getElementById("continueSceneHelp");
  let rodDiv = document.getElementById("rod");

  createMainTitleScene(canvas);
  playSkyAnimation();

  startButton.onclick = () => {
    title.innerHTML = "";
    createBoatFloatScene();
    playCameraAnimationTitle();
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
  continueSceneBoat.onclick = () => {
    playTransitionToHelp();
    continueSceneBoat.style.display = "none";
    continueSceneHelp.style.display = "block";
    waterDiv.style.display = "none";
  };

  continueSceneHelp.onclick = () => {
    playTransitionToFishing();
    continueSceneHelp.style.display = "none";
    createFishingScene();
    rodDiv.style.display = "block";
    waterDiv.style.width = "70%";
    waterDiv.style.height = "60%";
    waterDiv.style.marginTop = "30%";
    waterDiv.style.display = "block";
  };

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
    }
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
    loop: true,
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
function createBoatFloatScene() {
  // Create a group to hold the objects
  group = new THREE.Object3D();
  fish = new THREE.Object3D();

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
  loadObjMtl(objLifeboat, -38, -16, 38, 0.15, 0.15, 0.15);
  loadObjMtl(objCarp, -13, -5, 0, 3.5, 3.5, 3.5);
  loadObjMtl(objCarp, 18, -5, -20, 3, 3, 3);

  root.add(group);
  root.add(fish);
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
          { x: 270, y: 0, z: 2 },
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
    duration: duration * 100,
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

  group.clear();
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
          { x: 70, y: 70, z: 0 },
        ],
        target: fish.position,
      },
    ],
    loop: false,
    duration: duration * 200,
    easing: TWEEN.Easing.Bounce.In,
  });
  fishAnimator.start();
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
