import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.121.1/build/three.module.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/DRACOLoader.js"

(function () {
  let scene,
    renderer,
    camera,
    model,
    intro_scene,
    intro_renderer,
    intro_cam,
    iModel,
    iModelAlt,
    scene2,
    renderer2,
    camera2,
    model2,
    closeLook_scene,
    closeLook_renderer,
    closeLook_cam,
    CLM,
    CLMAltL,
    CLMAltR;

  init();

  function init() {
    const INTRO_MODEL_PATH = "models/LN_fe.glb";
    const MODEL_PATH_1 = "models/LN_fe.glb";
    const MODEL_PATH_2 = "models/LN_fe.glb";
    const MODEL_PATH_3 = "models/LN_fe.glb";

    // LN setup ////////////////////////////////////
    intro_scene = new THREE.Scene();
    intro_scene.background = null;
    
    scene = new THREE.Scene();
    scene.background = null;

    scene2 = new THREE.Scene();
    scene2.background = null;
    
    closeLook_scene = new THREE.Scene();
    closeLook_scene.background = null;
    
    intro_renderer = new THREE.WebGLRenderer({ 
      canvas: document.querySelector("#intro-canva"), 
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    renderer = new THREE.WebGLRenderer({ 
      canvas: document.querySelector("#model-canva"), 
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    renderer2 = new THREE.WebGLRenderer({ 
      canvas: document.querySelector("#main-canva"), 
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    closeLook_renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#closelook-canva'),
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    
    // const Renderers = [renderer, renderer2];
    // for (let i = 0; i < Renderers.length; i++) {
    //   Renderers[i].shadowMap.enabled = true;
    //   Renderers[i].setPixelRatio(window.devicePixelRatio);
    //   Renderers[i].setClearColor(0x000000, 0);
    //   document.body.appendChild(Renderers[i].domElement);
    // };
    
    intro_cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    intro_cam.position.set(3,1.6,5);
    
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(3,1.6,5);

    camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera2.position.set(3,1.6,5);
    
    closeLook_cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    closeLook_cam.position.set(3,1.6,5);
    
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/"); 
    
    let intro_loader = new GLTFLoader();
    let loader = new GLTFLoader();
    let loader2 = new GLTFLoader();
    let closeLook_loader = new GLTFLoader();

    intro_loader.setDRACOLoader(dracoLoader);
    loader.setDRACOLoader(dracoLoader);
    loader2.setDRACOLoader(dracoLoader);
    closeLook_loader.setDRACOLoader(dracoLoader);
    
    // Load intro model //
    intro_loader.load(
      INTRO_MODEL_PATH,
      function (gltf) {
        iModel = gltf.scene;
        iModel.castShadow = true;
        iModel.scale.set(2,2,2);
        
        // left top corner pos/spin 
        iModel.position.order = 'XYZ';
        iModel.position.set(-1,5.3,-3);
        iModel.rotation.order = 'XYZ';
        iModel.rotation.set(
          THREE.MathUtils.degToRad(-15), // tilt
          THREE.MathUtils.degToRad(180),
          THREE.MathUtils.degToRad(150)
          // THREE.MathUtils.degToRad(300)
        );
        
        // center pos/spin
        // iModel.position.order = 'XYZ';
        // iModel.position.set(3,-1,-5);
        // iModel.rotation.order = 'XYZ';
        // iModel.rotation.set(
        //   THREE.MathUtils.degToRad(40), // tilt
        //   THREE.MathUtils.degToRad(90),
        //   THREE.MathUtils.degToRad(0)
        // );
        // iModel.visible = false;
        
        iModelAlt = iModel.clone();
        iModelAlt.scale.set(2,2,2);
        iModelAlt.position.set(7,-2.2,-3);
        iModelAlt.rotation.set(
          THREE.MathUtils.degToRad(15), // tilt
          THREE.MathUtils.degToRad(0),
          THREE.MathUtils.degToRad(30)
          // THREE.MathUtils.degToRad(210)
        );
        iModelAlt.visible = true;

        // const AltModelArray = [];

        // for (let i = 0; i < 5; i++) {
        //   const AltModelClone = iModelAlt.clone();
        //   if (i < 3) {
        //     AltModelClone.position.z -= 1;
        //   } else if (i > 2) {
        //     AltModelClone.position.z += 1;
        //   }
        //   AltModelClone.position.y += i;
        //   AltModelClone.rotation.x += THREE.MathUtils.degToRad(i * 25);
        //   AltModelArray.push(AltModelClone);
        //   intro_scene.add(AltModelClone);
        //   console.log(AltModelClone);
        // }
        
        intro_cam.fov = 45;
        intro_cam.updateProjectionMatrix();
        
        intro_scene.add(iModel, iModelAlt);
        
        iModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        function setupLighting() {
          let iLight = new THREE.PointLight(0xffffff,1);
          iLight.position.set(8,-5,4);
          iLight.castShadow = true;
          iLight.shadow.mapSize.width = 2000;
          iLight.shadow.mapSize.height = 2000;
          iLight.shadow.camera.near = 0;
          iLight.shadow.camera.far = 50;

          let jjj = new THREE.PointLight(0xffffff,1);
          jjj.position.set(-1,8,4);
          jjj.castShadow = true;
          jjj.shadow.mapSize.width = 2000;
          jjj.shadow.mapSize.height = 2000;
          jjj.shadow.camera.near = 0;
          jjj.shadow.camera.far = 50;
          
          intro_scene.add(iLight, jjj);
        }
        setupLighting(intro_scene);
      },
      undefined,
      function (error) {
        console.error('Error loading model',error);
      }
    );
    
    // Load Model 1 //
    loader.load(
      MODEL_PATH_1,
      function (gltf) {
        model = gltf.scene;
        model.castShadow = true;
        model.scale.set(.55,.55,.55);
        model.position.order = 'XYZ';
        model.position.set(3,.8,0);
        model.rotation.set(
          THREE.MathUtils.degToRad(0),
          THREE.MathUtils.degToRad(90),
          THREE.MathUtils.degToRad(50)
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

        const lights_storage = {};
        function setupLighting(scene) {
          lights_storage.Top = new THREE.PointLight(0xffffff, 1);
          lights_storage.Top.position.set(3, 3, 0);
          light_specs(lights_storage.Top);
          
          lights_storage.RightTop = new THREE.PointLight(0xffffff, 5);
          lights_storage.RightTop.position.set(5, 3, 0);
          light_specs(lights_storage.RightTop);
          
          lights_storage.LeftTop = new THREE.PointLight(0xffffff, 2);
          lights_storage.LeftTop.position.set(1, 3, 0);
          light_specs(lights_storage.LeftTop);
          
          lights_storage.Low = new THREE.PointLight(0xffffff, 2);
          lights_storage.Low.position.set(0, -2, 0);
          light_specs(lights_storage.Low);
          
          scene.add(lights_storage.Top, lights_storage.RightTop, lights_storage.LeftTop, lights_storage.Low);
        }
        function light_specs(light) {
          light.castShadow = true;
          light.shadow.mapSize.width = 2000;
          light.shadow.mapSize.height = 2000;
          light.shadow.camera.near = 0;
          light.shadow.camera.far = 50;
        }
        setupLighting(scene);
      },
      undefined,
      function (error) {
        console.error('Error loading model',error);
      }
    );

    // Load Model 2 //
    loader2.load(
      MODEL_PATH_2,
      function (gltf) {
        model2 = gltf.scene;
        model2.castShadow = true;
        model2.scale.set(1.5,1.5,1.5);
        model2.position.order = 'XYZ';
        model2.position.set(3,2.6,0);
        model2.rotation.order = 'XYZ';
        model2.rotation.set(
          THREE.MathUtils.degToRad(45),
          THREE.MathUtils.degToRad(30),
          THREE.MathUtils.degToRad(-180)
        );

        camera2.fov = 45;
        camera2.updateProjectionMatrix();
        
        scene2.add(model2);
        
        model2.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        render_2_model();

        function setupLighting(scene2, light2) {
          light2 = new THREE.PointLight(0xffffff,7);
          light2.position.set(2,1,1);
          light2.castShadow = true;
          light2.shadow.mapSize.width = 2000;
          light2.shadow.mapSize.height = 2000;
          light2.shadow.camera.near = 0;
          light2.shadow.camera.far = 50;
          
          scene2.add(light2);
        }
        setupLighting(scene2);
      },
      undefined,
      function (error) {
        console.error('Error loading model',error);
      }
    );

    closeLook_loader.load(
      MODEL_PATH_3,
      function (gltf) {
        CLM = gltf.scene;
        CLM.castShadow = true;
        CLM.scale.set(.7,.7,.7);
        CLM.position.order = 'XYZ';
        CLM.position.set(3,1.5,0);
        CLM.rotation.order = 'XYZ';
        CLM.rotation.set(
          THREE.MathUtils.degToRad(0),
          THREE.MathUtils.degToRad(90),
          THREE.MathUtils.degToRad(80)
        );

        CLMAltL = CLM.clone();
        CLMAltL.scale.set(.6,.6,.6);
        CLMAltL.position.set(3,1.5,-1);
        CLMAltL.rotation.set(
          THREE.MathUtils.degToRad(0),
          THREE.MathUtils.degToRad(75),
          THREE.MathUtils.degToRad(80),
        )
        
        CLMAltR = CLM.clone();
        CLMAltR.scale.set(.6,.6,.6);
        CLMAltR.position.set(3,1.5,-1);
        CLMAltR.rotation.set(
          THREE.MathUtils.degToRad(0),
          THREE.MathUtils.degToRad(105),
          THREE.MathUtils.degToRad(80),
        )

        closeLook_cam.fov = 45;
        closeLook_cam.updateProjectionMatrix();
        
        // closeLook_scene.add(CLM);
        closeLook_scene.add(CLM, CLMAltL, CLMAltR);
        
        CLM.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        function setupLighting(closeLook_scene, CLL) {
          CLL = new THREE.PointLight(0xffffff,7);
          CLL.position.set(2,1,1);
          CLL.castShadow = true;
          CLL.shadow.mapSize.width = 2000;
          CLL.shadow.mapSize.height = 2000;
          CLL.shadow.camera.near = 0;
          CLL.shadow.camera.far = 50;
          
          closeLook_scene.add(CLL);
        }
        setupLighting(closeLook_scene);

        // interaction //
        let CLI = false;
        const CLWrap = document.querySelector('.close-look');

        let CLLInitialPos = new THREE.Vector3(3,1.5,-1);
        let CLRInitialPos = new THREE.Vector3(3,1.5,-1);
        let CLLTargetPos = new THREE.Vector3(2,1.5,-.3);
        let CLRTargetPos = new THREE.Vector3(4,1.5,-.3);

        const lerpFactor = 0.2;

        window.closelookIn = function() {
          CLI = true;
        }
        window.closelookOut = function() {
          CLI = false
        }

        window.closelook = function() {
          if (CLI) {
            CLMAltL.position.lerp(CLLTargetPos, lerpFactor);
            CLMAltR.position.lerp(CLRTargetPos, lerpFactor);
          } else {
            CLMAltL.position.lerp(CLLInitialPos, lerpFactor);
            CLMAltR.position.lerp(CLRInitialPos, lerpFactor);
          }

          closeLook_renderer.render(closeLook_scene, closeLook_cam);
          requestAnimationFrame(closelook);

          if (resizeToDisplay_closelook_rtd(closeLook_renderer)) {
            const canvas = closeLook_renderer.domElement;
            closeLook_cam.aspect = canvas.clientWidth / canvas.clientHeight;
            closeLook_cam.updateProjectionMatrix();
          }
        }
        closelook();

        const CLWrapObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              closelookIn();
            } else {
              closelookOut();
            }
          })
        }, { threshold: 0.7 });

        CLWrapObserver.observe(CLWrap);

        // rotation in fullscreen mode //
        const CLCanvas = document.querySelector('#closelook-canva');
        
        let isRotatingCLM = false;
        let prevMouseX = 0;
        let prevMouseY = 0;
        const spin = 0.005;

        const handlers = {
          mouseDown: (e) => {
            isRotatingCLM = true;
            prevMouseX = e.clientX;
            prevMouseY = e.clientY;
          }, 
          mouseUpLeave: () => {
            isRotatingCLM = false;
          }, 
          mouseMove: (e) => {
            if (!isRotatingCLM || !CLM) return;
            
            const deltaX = e.clientX - prevMouseX;
            const deltaY = e.clientY - prevMouseY;
            
            CLM.rotation.y += deltaX * spin;
            CLM.rotation.x += deltaY * spin;
            
            CLMAltL.rotation.y = CLM.rotation.y + THREE.MathUtils.degToRad(-15);
            CLMAltR.rotation.y = CLM.rotation.y + THREE.MathUtils.degToRad(15);
            
            prevMouseX = e.clientX;
            prevMouseY = e.clientY;
          }
        };
        window.enableSpin = function() {
          CLCanvas.addEventListener('mousedown', handlers.mouseDown);
          CLCanvas.addEventListener('mouseup', handlers.mouseUpLeave);
          CLCanvas.addEventListener('mouseleave', handlers.mouseUpLeave);
          CLCanvas.addEventListener('mousemove', handlers.mouseMove);
        }
        window.disableSpin = function() {
          CLM.rotation.set(
            THREE.MathUtils.degToRad(0),
            THREE.MathUtils.degToRad(90),
            THREE.MathUtils.degToRad(80)
          );
          CLMAltL.rotation.set(
            THREE.MathUtils.degToRad(0),
            THREE.MathUtils.degToRad(75),
            THREE.MathUtils.degToRad(80),
          )
          CLMAltR.rotation.set(
            THREE.MathUtils.degToRad(0),
            THREE.MathUtils.degToRad(105),
            THREE.MathUtils.degToRad(80),
          )

          CLCanvas.removeEventListener('mousedown', handlers.mouseDown);
          CLCanvas.removeEventListener('mouseup', handlers.mouseUpLeave);
          CLCanvas.removeEventListener('mouseleave', handlers.mouseUpLeave);
          CLCanvas.removeEventListener('mousemove', handlers.mouseMove);

          closeLook_renderer.render(closeLook_scene, closeLook_cam);
          requestAnimationFrame(disableSpin);
        }
      },
      undefined,
      function (error) {
        console.error('Error loading model',error);
      }
    );
  }

  // first model //
  window.liveRender = function() {
    renderer.render(scene, camera);
    requestAnimationFrame(liveRender);

    if (resizeToDisplay_equal_rtd(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
  };
  liveRender();

  let posMouseY = 0;
  let prevMouseX = 0;
  
  document.addEventListener('mousemove', (e) => {
    if (!model) return;
    
    const deltaY = e.clientY - posMouseY;
    
    model.rotation.x += deltaY * 0.0005;
    
    const curSpin = THREE.MathUtils.degToRad(90);
    const maxDeviation_md = THREE.MathUtils.degToRad(10);
    const main_md = THREE.MathUtils.degToRad(30);
    
    document.addEventListener('mousemove', (e) => {
        if (!model) return;
        
        const deltaX = e.movementX || e.clientX - prevMouseX;

        model.rotation.y = THREE.MathUtils.clamp(
            model.rotation.y + (deltaX / 10000),
            curSpin - maxDeviation_md,
            curSpin + maxDeviation_md
        );
        model2.rotation.y = THREE.MathUtils.clamp(
          model2.rotation.y + (deltaX / 100000),
          0 - main_md,
          0 + main_md 
        );
        
        prevMouseX = e.clientX;
      });
      
    posMouseY = e.clientY;
    
    renderer.render(scene,camera);
    renderer2.render(scene2,camera2);
  });

  // introductury model //
  window.loadIntro = function() {
    intro_renderer.render(intro_scene, intro_cam);
    requestAnimationFrame(loadIntro);

    if (resizeToDisplay_intro_rtd(intro_renderer)) {
      const canvas = intro_renderer.domElement;
      intro_cam.aspect = canvas.clientWidth / canvas.clientHeight;
      intro_cam.updateProjectionMatrix(); 
    }
  }
  loadIntro();
  
  let recorded_scroll = 0;
  window.addEventListener('scroll', function() {
    let current_scroll = window.scrollY;

    if (current_scroll > recorded_scroll) {
      iModel.rotation.z += THREE.MathUtils.degToRad(window.scrollY / 30000);
      iModelAlt.rotation.z += THREE.MathUtils.degToRad(window.scrollY / 30000);
    } else {
      iModel.rotation.z -= THREE.MathUtils.degToRad(window.scrollY / 30000);
      iModelAlt.rotation.z -= THREE.MathUtils.degToRad(window.scrollY / 30000);
    } 
    intro_renderer.render(intro_scene, intro_cam);

    recorded_scroll = current_scroll;
  });

  const introWrap = document.querySelector('.intro');
  const highlights = Array.from(introWrap.querySelectorAll('h1'));
  const checkpoint = Array.from(introWrap.querySelectorAll('#checkpoint'));

  const introWrapObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        highlights.forEach(h => {
          h.style.display = 'block';
        })
      } else {
        highlights.forEach(h => {
          h.style.display = 'none';
        })
      }
    })
  }, { threshold: 0.1 });

  introWrapObserver.observe(introWrap);

  const checkpointObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      let ind = checkpoint.indexOf(entry.target);
    
      if (entry.isIntersecting) {
          if (ind == 0) {
            highlights[ind].style.opacity = '1';
            
            highlights.forEach((h,i) => {
              if (i !== ind) { h.style.opacity = '0'; }
            })
          } else if (ind == 1) {
            highlights[ind].style.opacity = '1';

            highlights.forEach((h,i) => {
              if (i !== ind) { h.style.opacity = '0'; }
            })
          } else if (ind == 2) {
            highlights[ind].style.opacity = '1';

            highlights.forEach((h,i) => {
              if (i !== ind) { h.style.opacity = '0'; }
            })
          } else if (ind == 3) {
            highlights[ind].style.opacity = '1';
            
            highlights.forEach((h,i) => {
              if (i !== ind) { h.style.opacity = '0'; }
            })
          } 
      } else {
        highlights[ind].style.opacity = '0';
      }
    });
  }, { threshold: 0.3});

  checkpoint.forEach(cp => {
    checkpointObserver.observe(cp);
  });

  // 2nd model //
  window.render_2_model = function() {
    renderer2.render(scene2, camera2);
    requestAnimationFrame(render_2_model);

    if (resizeToDisplay_2_rtd(renderer2)) {
      const canvas = renderer2.domElement;
      camera2.aspect = canvas.clientWidth / canvas.clientHeight;
      camera2.updateProjectionMatrix();
    }
  };

  // expand 360 model canvas //
  const CLWrap = document.querySelector('.close-look');
  const CLWrapChild0 = CLWrap.children[0];
  const CLCanva = document.querySelector('#closelook-canva');
  const CLBtn = document.querySelector('#cl-btn');

  window.expand360 = function() {
    closelookOut();
    
    CLMAltL.visible = false;
    CLMAltR.visible = false;

    enableSpin();
    
    CLBtn.setAttribute('onclick', 'shrink360()');

    CLWrapChild0.style.opacity = '0';
    if (CLWrapChild0,style.opacity === '0') {
      CLWrapChild0.style.display = 'none';
    }
    // CLCanva.style.position = 'fixed';
    CLCanva.style.width = '100vw';
    CLCanva.style.height = '100vh';
    CLCanva.style.margin = '0';
    CLCanva.style.borderRadius = '0vw';
    CLCanva.style.transform = 'translateY(-8.25vh)';

    CLBtn.children[0].style.transform = 'scale(0)';
    CLBtn.children[1].style.transform = 'scale(1)';

    // closeLook_renderer.render(closeLook_scene, closeLook_cam);
    requestAnimationFrame(expand360);

    const canvas = closeLook_renderer.domElement;
    closeLook_cam.aspect = canvas.clientWidth / canvas.clientHeight;
    closeLook_cam.updateProjectionMatrix();
  }
  window.shrink360 = function() {
    CLMAltL.visible = true;
    CLMAltR.visible = true;
    
    closelookIn();

    disableSpin();

    CLBtn.setAttribute('onclick', 'expand360()');

    CLWrapChild0.style.display = 'block';
    CLWrapChild0.style.opacity = '1';
    CLCanva.style.width = '90vw';
    CLCanva.style.height = '82vh';
    CLCanva.style.margin = '5vh 0 0 5vw';
    CLCanva.style.borderRadius = '2vw';
    CLCanva.style.transform = 'translateY(0vh)';

    CLBtn.children[0].style.transform = 'scale(1)';
    CLBtn.children[1].style.transform = 'scale(0)';

    // closeLook_renderer.render(closeLook_scene, closeLook_cam);
    requestAnimationFrame(shrink360);
  
    const canvas = closeLook_renderer.domElement;
    closeLook_cam.aspect = canvas.clientWidth / canvas.clientHeight;
    closeLook_cam.updateProjectionMatrix();
  }

  // canva resizers //
  function resizeToDisplay_intro_rtd(intro_renderer) {
    const canvas = intro_renderer.domElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvasPixelWidth = canvas.width / window.devicePixelRatio;
    let canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      intro_renderer.setSize(width, height, false);
    }
    return needResize;
  }
  function resizeToDisplay_equal_rtd(renderer) {
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
  function resizeToDisplay_2_rtd(renderer2) {
    const canvas = renderer2.domElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvasPixelWidth = canvas.width / window.devicePixelRatio;
    let canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      renderer2.setSize(width, height, false);
    }
    return needResize;
  }
  function resizeToDisplay_closelook_rtd(closeLook_renderer) {
    const canvas = closeLook_renderer.domElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvasPixelWidth = canvas.width / window.devicePixelRatio;
    let canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      closeLook_renderer.setSize(width, height, false);
    }
    return needResize;
  }
})(); // Don't add anything below this line