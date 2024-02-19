import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TWEEN } from "https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js";

let renderer;
let camera;
let controls;
let scene;

const createRenderer = () => {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const sceneElementWrapper = document.getElementById("scene");
  sceneElementWrapper.appendChild(renderer.domElement);
};

const createCamera = () => {
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.01,
    2000
  );

  camera.position.set(0, 12, 0);
};

const createScene = () => {
  scene = new THREE.Scene();
};

const createControls = () => {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enablePan = true;
  controls.minDistance = 0.1;
  controls.maxDistance = 20;
  controls.minPolarAngle = 0.5;
  controls.maxPolarAngle = 1.5;
  controls.autoRotate = false;
  controls.target = new THREE.Vector3(0, 2, -0.5);
  controls.update();
};

const createGround = () => {
  const groundGeometry = new THREE.PlaneGeometry(100, 100, 32, 32);
  groundGeometry.rotateX(-Math.PI / 2);

  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x555555,
    side: THREE.DoubleSide,
  });

  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
  groundMesh.castShadow = false;
  groundMesh.receiveShadow = true;
  scene.add(groundMesh);
};

const createLights = () => {
  const spotLight1 = new THREE.SpotLight(0xffffff, 3, 50, 0.22, 1);
  spotLight1.position.set(-10, 25, -10);
  spotLight1.castShadow = true;
  spotLight1.shadow.bias = -0.001;

  const spotLight2 = new THREE.SpotLight(0xffffff, 3, 200, 0.22, 1);
  spotLight2.position.set(10, 25, 25);
  spotLight2.castShadow = true;
  spotLight2.shadow.bias = -0.001;

  scene.add(spotLight1);
  scene.add(spotLight2);
};

const loadObject = (objectName) => {
  const loadingElement = document.getElementById("loading-element");
  const loader = new GLTFLoader().setPath(`public/${objectName}/`);
  loader.load(
    "scene.gltf",
    (gltf) => {
      loadingElement.style.display = "none";
      createGround();
      const mesh = gltf.scene;

      mesh.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      mesh.position.set(0, 2, -0.5);
      scene.add(mesh);
    },
    (xhr) => {
      var percentComplete = (xhr.loaded / xhr.total) * 100;
      loadingElement.innerHTML = "Loading: " + percentComplete.toFixed(2) + "%";
    }
  );
};

const bindListeners = () => {
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const menuItemsHTMLCollection = document.querySelectorAll("#menu li");
  const menuItems = Array.from(menuItemsHTMLCollection);

  menuItems.forEach((menuItem) => {
    menuItem.addEventListener("click", (event) => {
      const objectId = event.target.getAttribute("id");
      const targetPoint = cameraTargetsAndPositions[objectId];

      var positionTween = new TWEEN.Tween(camera.position)
        .to(
          {
            x: targetPoint.position.x,
            y: targetPoint.position.y,
            z: targetPoint.position.z,
          },
          2000
        ) // 2000 ms = 2 seconds
        .easing(TWEEN.Easing.Quadratic.Out) // Use any easing function that suits the movement
        .onUpdate(() => {});

      var targetTween = new TWEEN.Tween(controls.target)
        .to(
          {
            x: targetPoint.lookAt.x,
            y: targetPoint.lookAt.y,
            z: targetPoint.lookAt.z,
          },
          2000
        )
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          controls.update();
        });

      positionTween.start();
      targetTween.start();
    });
  });
};

const animate = () => {
  requestAnimationFrame(animate);
  TWEEN.update();

  renderer.render(scene, camera);
};

const init = (objectName) => {
  createRenderer();
  createCamera();
  createScene();
  createControls();
  createLights();
  bindListeners();
  loadObject(objectName);
  animate();
};

init("millennium_falcon");

const satellitePointData = {
  position: {
    x: 2.2363356030075563,
    y: 2.820678683267509,
    z: 2.684753953671324,
  },
  lookAt: {
    x: 0,
    y: 2,
    z: -0.5,
  },
};

const machineGunPointData = {
  position: {
    x: 0.5760624910715781,
    y: 3.051817229890369,
    z: 0.4757104852229018,
  },
  lookAt: {
    x: -0.3332266219157822,
    y: 2.2358192826928676,
    z: -0.5257846919885497,
  },
};

const frontalPointData = {
  position: {
    x: -1.6956829343157755,
    y: 2.911476432638847,
    z: 6.006285240809736,
  },
  lookAt: {
    x: -0.12111220935307855,
    y: 1.2546289604273042,
    z: -0.3443322137823006,
  },
};

const sidePodPointData = {
  position: {
    x: -3.842264605996623,
    y: 2.531246896437086,
    z: 3.2344043181914017,
  },
  lookAt: {
    x: -1.2075112121972915,
    y: 1.598525061225214,
    z: -1.0790626359441582,
  },
};

const airConditioningPointData = {
  position: {
    x: -0.5680513933598731,
    y: 3.8647939449647435,
    z: -2.8722469298357245,
  },
  lookAt: {
    x: -0.03259431926139941,
    y: 2.3942898229981293,
    z: -1.899660839467895,
  },
};

const warpDrivePointData = {
  position: {
    x: -2.2960948510395087,
    y: 2.3045136500926064,
    z: -3.7251187837076998,
  },
  lookAt: {
    x: -0.22176763221662282,
    y: 1.7171330696876503,
    z: -1.974151811476235,
  },
};

const cameraTargetsAndPositions = {
  satellite: {
    position: {
      x: satellitePointData.position.x,
      y: satellitePointData.position.y,
      z: satellitePointData.position.z,
    },
    lookAt: {
      x: satellitePointData.lookAt.x,
      y: satellitePointData.lookAt.y,
      z: satellitePointData.lookAt.z,
    },
  },
  machineGun: {
    position: {
      x: machineGunPointData.position.x,
      y: machineGunPointData.position.y,
      z: machineGunPointData.position.z,
    },
    lookAt: {
      x: machineGunPointData.lookAt.x,
      y: machineGunPointData.lookAt.y,
      z: machineGunPointData.lookAt.z,
    },
  },
  frontal: {
    position: {
      x: frontalPointData.position.x,
      y: frontalPointData.position.y,
      z: frontalPointData.position.z,
    },
    lookAt: {
      x: frontalPointData.lookAt.x,
      y: frontalPointData.lookAt.y,
      z: frontalPointData.lookAt.z,
    },
  },
  sidePod: {
    position: {
      x: sidePodPointData.position.x,
      y: sidePodPointData.position.y,
      z: sidePodPointData.position.z,
    },
    lookAt: {
      x: sidePodPointData.lookAt.x,
      y: sidePodPointData.lookAt.y,
      z: sidePodPointData.lookAt.z,
    },
  },
  airConditioning: {
    position: {
      x: airConditioningPointData.position.x,
      y: airConditioningPointData.position.y,
      z: airConditioningPointData.position.z,
    },
    lookAt: {
      x: airConditioningPointData.lookAt.x,
      y: airConditioningPointData.lookAt.y,
      z: airConditioningPointData.lookAt.z,
    },
  },
  warpDrive: {
    position: {
      x: warpDrivePointData.position.x,
      y: warpDrivePointData.position.y,
      z: warpDrivePointData.position.z,
    },
    lookAt: {
      x: warpDrivePointData.lookAt.x,
      y: warpDrivePointData.lookAt.y,
      z: warpDrivePointData.lookAt.z,
    },
  },
};
