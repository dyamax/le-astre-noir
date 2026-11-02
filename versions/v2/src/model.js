import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js"

(function () {
  let scene,
    renderer,
    camera,
    model;

  init();

  function init() {
    const MODEL_PATH = "models/LN.glb";

    scene = new THREE.Scene();
    scene.background = null;

    renderer = new THREE.WebGLRenderer({ 
      canvas: document.querySelector("#model-canva"), 
      alpha: true,
      antialias: true 
    });
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(3,1.6,5);

    let loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/"); 
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      MODEL_PATH,
      function (gltf) {
        model = gltf.scene;
        model.castShadow = true;
        model.scale.set(1.8,1.8,1.8);
        model.position.order = 'XYZ';
        model.position.set(2.97,-.4,0);
        model.rotation.order = 'XYZ';
        model.rotation.set(
          THREE.MathUtils.degToRad(15),
          THREE.MathUtils.degToRad(-90),
          THREE.MathUtils.degToRad(0)
        );
        
        camera.fov = 45;
        camera.updateProjectionMatrix();
        
        scene.add(model);

        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        // objects' interactions ///////////////////////////////////////////////////////////////////////////////////////

        // get objects by name
        const Noir = scene.getObjectByName('Noir');
        
        // interact with objects
        if (Noir) {
          Noir.visible = true;
        } else {
          console.log(`no object found with the name '${Noir}'`)
        }

        // objects' interactions ///////////////////////////////////////////////////////////////////////////////////////

        function setupLighting(scene) {
          const strongLight = new THREE.PointLight(0xffffff, 2);
          strongLight.position.set(4.97,3,0);
          strongLight.castShadow = true;
          strongLight.shadow.mapSize.width = 2000;
          strongLight.shadow.mapSize.height = 2000;
          strongLight.shadow.camera.near = 0;
          strongLight.shadow.camera.far = 50;

          const strongLightAlt = new THREE.PointLight(0xffffff, 1);
          strongLightAlt.position.set(2.97,3,0);
          strongLightAlt.castShadow = true;
          strongLightAlt.shadow.mapSize.width = 2000;
          strongLightAlt.shadow.mapSize.height = 2000;
          strongLightAlt.shadow.camera.near = 0;
          strongLightAlt.shadow.camera.far = 50;

          const lowLight = new THREE.PointLight(0xffffff, 2);
          lowLight.position.set(.97,3,0);
          lowLight.castShadow = true;
          lowLight.shadow.mapSize.width = 2000;
          lowLight.shadow.mapSize.height = 2000;
          lowLight.shadow.camera.near = 0;
          lowLight.shadow.camera.far = 50;

          const backLight = new THREE.DirectionalLight(0xffffff, 5);
          backLight.position.set(2.97,1,-100);
          backLight.castShadow = true;
          backLight.shadow.mapSize.width = 2000;
          backLight.shadow.mapSize.height = 2000;
          backLight.shadow.camera.near = 0;
          backLight.shadow.camera.far = 50;
          
          scene.add(strongLight, lowLight, backLight, strongLightAlt);
        }  

        if (scene) {
          setupLighting(scene);
        } else {
          console.log('No light was added');
        }
      },
      undefined,
      function (error) {
        console.error('Error loading model',error);
      }
    );
  }

  window.liveRender = function() {
    var raycaster = new THREE.Raycaster();
    var centralizer = new THREE.Vector2(0, 0);
    raycaster.setFromCamera(centralizer, camera);

    var intersection = raycaster.intersectObjects(scene.children, true);
    
    if (intersection.length > 0) {
      return;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(liveRender);

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
  };
  // liveRender();

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvasPixelWidth = canvas.width / window.devicePixelRatio;
    let canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  window.tmodelOFF = function() {
    if (model) {
      model.visible = false;
    }
    renderer.render(scene, camera);
  }
  window.tmodelON = function() {
    if (model) {
      model.visible = true;
    }
    renderer.render(scene, camera);
  }
})(); // Don't add anything below this line