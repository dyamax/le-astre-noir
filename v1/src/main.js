import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";

(function () {
  let scene,
    renderer,
    camera,
    model;

  init();

  function init() {
    const MODEL_PATH =
      "models/LN (watch)(black).glb";

    scene = new THREE.Scene();
    scene.background = null;

    renderer = new THREE.WebGLRenderer({ 
      canvas: document.querySelector("#c"), 
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
    camera.position.set(0,1.6,5);
    // camera.lookAt(model.position);

    let loader = new GLTFLoader();

    loader.load(
      MODEL_PATH,
      function (gltf) {
        model = gltf.scene;
        model.castShadow = true;
        model.scale.set(1.8,1.8,1.8);
        model.position.set(0,1.5,0);

        camera.lookAt(model.position);
        camera.fov = 45;
        camera.updateProjectionMatrix();
        
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = false;
            child.receiveShadow = true;
          }
          console.log('child', child);
        });
        scene.add(model);

        console.log('Model loaded', model);

        // objects' interactions ///////////////////////////////////////////////////////////////////////////////////////
        
        // define object names
        const objectName_Watch = 'watch';

        // get objects by name
        const object_watch = scene.getObjectByName(objectName_Watch);
        
        // interact with objects
        if (object_watch) {
          object_watch.rotation.x = THREE.MathUtils.degToRad(0);
          object_watch.visible = true;
        } else {
          console.log(`no object found with the name '${objectName_Watch}'`)
        }

        // objects' interactions END ///////////////////////////////////////////////////////////////////////////////////

        function logObjectInfo(object) {
          const worldPosition = new THREE.Vector3();
          object.getWorldPosition(worldPosition);
          console.log("World Position:", worldPosition);
        
          const boundingBox = new THREE.Box3().setFromObject(object);
          const size = new THREE.Vector3();
          boundingBox.getSize(size);
          console.log("Dimensions (Width, Height, Depth):", size);
        
          const center = new THREE.Vector3();
          boundingBox.getCenter(center);
          console.log("Bounding Box Center:", center);
        }
      
        const watch_logObjectInfo = scene.getObjectByName('watch');
        
        if (watch_logObjectInfo) {
            logObjectInfo(watch_logObjectInfo);
        } else {
            console.log(`No object found with the name:'${objectName_Watch}'`);
        }

        function setupLighting(scene) {
          // Directional light
          const strongLight = new THREE.DirectionalLight(0xffffff, 10);
          strongLight.position.set(-1,-.04,0);
          strongLight.castShadow = true;
          strongLight.shadow.mapSize.width = 2000;
          strongLight.shadow.mapSize.height = 2000;
          strongLight.shadow.camera.near = 0;
          strongLight.shadow.camera.far = 50;

          const strongLightAlt = new THREE.DirectionalLight(0xffffff, 10);
          strongLightAlt.position.set(1,.1,0);
          strongLightAlt.castShadow = true;
          strongLightAlt.shadow.mapSize.width = 2000;
          strongLightAlt.shadow.mapSize.height = 2000;
          strongLightAlt.shadow.camera.near = 0;
          strongLightAlt.shadow.camera.far = 50;

          // Bottom light
          const bottomLight = new THREE.DirectionalLight(0xffffff, 10);
          bottomLight.position.set(-1,1,0);
          bottomLight.castShadow = true;
          bottomLight.shadow.mapSize.width = 2000;
          bottomLight.shadow.mapSize.height = 2000;
          bottomLight.shadow.camera.near = 0;
          bottomLight.shadow.camera.far = 50;

          const bottomLightAlt = new THREE.DirectionalLight(0xffffff, 10);
          bottomLightAlt.position.set(1,.9,0);
          bottomLightAlt.castShadow = true;
          bottomLightAlt.shadow.mapSize.width = 2000;
          bottomLightAlt.shadow.mapSize.height = 2000;
          bottomLightAlt.shadow.camera.near = 0;
          bottomLightAlt.shadow.camera.far = 50;
          
          const targetObj = new THREE.Object3D();
          targetObj.position.set(0,-.4,0);
          const targetObjAlt = new THREE.Object3D();
          targetObjAlt.position.set(0,2.2,0);
          
          scene.add(strongLight, strongLightAlt, bottomLight, bottomLightAlt, targetObj, targetObjAlt);

          bottomLight.target = targetObj;
          bottomLightAlt.target = targetObjAlt;
  
          // turnOnTheLight();
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
  
  function render() {
    const duration = 2;
    const startTime = performance.now();

    const initialPosition = new THREE.Vector3(1,-.5, -1);
    const targetPosition = new THREE.Vector3(1,-.4,0);

    const initialRotation = new THREE.Euler(
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(-90),
        THREE.MathUtils.degToRad(15)
    );

    const targetRotation = new THREE.Euler(
        THREE.MathUtils.degToRad(0),
        THREE.MathUtils.degToRad(-90),
        THREE.MathUtils.degToRad(-15)
    );

    function easeOutQuad(t) {
        return t * (2 - t);
    }

    function updateRotation(currentTime) {
        const elapsedTime = (currentTime - startTime) / 1000;
        let progress = Math.min(elapsedTime / duration, 1);

        progress = easeOutQuad(progress);

        if (model) {
          model.position.lerpVectors(initialPosition, targetPosition, progress);

          model.rotation.x = THREE.MathUtils.lerp(initialRotation.x, targetRotation.x, progress);
          model.rotation.y = THREE.MathUtils.lerp(initialRotation.y, targetRotation.y, progress);
          model.rotation.z = THREE.MathUtils.lerp(initialRotation.z, targetRotation.z, progress);
      }

      if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
      }

      renderer.render(scene, camera);

      if (progress < 1 || model && model.visible) {
        requestAnimationFrame(updateRotation);
        console.log('Animation is being prepared')
        // setTimeout(() => {
        // }, 3000);
      } else {
        console.log('Animation is not executed')
      }
    }
    requestAnimationFrame(updateRotation);
  }
  render();
  if (render()) {
    console.log('Rendered')
  } else {
    console.log('Not rendered')
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvasPixelWidth = canvas.width / window.devicePixelRatio;
    let canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize =
      canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
})(); // Don't add anything below this line