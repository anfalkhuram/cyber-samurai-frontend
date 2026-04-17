(function initHeroGlobe() {
  const minDesktopWidth = 992;
  const canvasContainer = document.getElementById("hero-globe-canvas");
  const labelsContainer = document.getElementById("hero-globe-labels");

  if (!canvasContainer) return;
  if (window.innerWidth < minDesktopWidth) return;
  if (!window.THREE) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearAlpha(0);
  canvasContainer.appendChild(renderer.domElement);

  const controls = window.THREE.OrbitControls
    ? new THREE.OrbitControls(camera, renderer.domElement)
    : null;

  if (controls) {
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false;
    controls.enableZoom = false;
  }

  camera.position.set(0, 0, 22);

  let particles = null;
  const globeRadius = 8.5;
  const orbiters = [];
  const ORBITER_COUNT = 24;
  const TRAIL_POINTS = 56;

  // 🔴 FIX FLAG
  let firstFrameAfterFocus = false;

  function latLonToVector(latRad, lonRad, radius) {
    return new THREE.Vector3(
      -radius * Math.cos(latRad) * Math.cos(lonRad),
      -radius * Math.sin(latRad),
      radius * Math.cos(latRad) * Math.sin(lonRad)
    );
  }

  function setSize() {
    const w = canvasContainer.clientWidth || 420;
    const h = canvasContainer.clientHeight || 420;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }

  function startWithPositions(positions, size = 0.085, opacity = 0.72) {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      color: 0x00bfa6,
      size,
      transparent: true,
      opacity
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
    animate();
  }

  function createFallbackPositions() {
    const positions = [];

    for (let i = 0; i <= 70; i++) {
      const lat = (i / 70) * Math.PI - Math.PI / 2;

      for (let j = 0; j < 140; j++) {
        const lon = (j / 140) * 2 * Math.PI - Math.PI;

        const p = latLonToVector(lat, lon, globeRadius);
        positions.push(p.x, p.y, p.z);
      }
    }

    return positions;
  }

  function createDottedMap() {
    const srcCanvas = document.createElement("canvas");
    const ctx = srcCanvas.getContext("2d");

    srcCanvas.width = 1024;
    srcCanvas.height = 512;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src =
      "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg";

    img.onload = () => {
      try {
        ctx.drawImage(img, 0, 0, 1024, 512);
        const data = ctx.getImageData(0, 0, 1024, 512).data;

        const positions = [];

        for (let y = 0; y < 512; y += 3) {
          for (let x = 0; x < 1024; x += 3) {
            const i = (y * 1024 + x) * 4;

            if (data[i] > 65) {
              const lat = (y / 512) * Math.PI - Math.PI / 2;
              const lon = (x / 1024) * 2 * Math.PI - Math.PI;

              const p = latLonToVector(lat, lon, globeRadius);
              positions.push(p.x, p.y, p.z);
            }
          }
        }

        startWithPositions(positions);
      } catch {
        startWithPositions(createFallbackPositions(), 0.08, 0.65);
      }
    };

    img.onerror = () =>
      startWithPositions(createFallbackPositions(), 0.08, 0.65);
  }

  function initOrbiters() {
    const shellOffset = 0.6;
    const orbitalRadius = globeRadius + shellOffset;

    for (let i = 0; i < ORBITER_COUNT; i++) {
      const speed = 0.02 + Math.random() * 0.03;
      const phase = Math.random() * Math.PI * 2;

      const axis = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();

      const startDir = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();

      const electron = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 8, 8),
        new THREE.MeshBasicMaterial({
          color: 0x9ad3ff,
          transparent: true,
          opacity: 0.9
        })
      );

      scene.add(electron);

      const trailPositions = new Float32Array(TRAIL_POINTS * 3);

      const trailGeo = new THREE.BufferGeometry();
      trailGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(trailPositions, 3)
      );

      const trail = new THREE.Line(
        trailGeo,
        new THREE.LineBasicMaterial({
          color: 0x00bfa6,
          transparent: true,
          opacity: 0.35
        })
      );

      scene.add(trail);

      const initialPos = startDir.clone().multiplyScalar(orbitalRadius);
      initialPos.applyAxisAngle(axis, phase);

      electron.position.copy(initialPos);

      for (let p = 0; p < TRAIL_POINTS; p++) {
        const idx = p * 3;
        trailPositions[idx] = initialPos.x;
        trailPositions[idx + 1] = initialPos.y;
        trailPositions[idx + 2] = initialPos.z;
      }

      orbiters.push({
        electron,
        trail,
        trailPositions,
        orbitalRadius,
        speed,
        phase,
        axis,
        startDir
      });
    }
  }

  // function updateOrbiters() {
  //   const t = performance.now() * 0.001;

  //   for (let i = 0; i < orbiters.length; i++) {
  //     const o = orbiters[i];

  //     const angle = t * o.speed * 10 + o.phase;

  //     const base = o.startDir.clone().multiplyScalar(o.orbitalRadius);
  //     base.applyAxisAngle(o.axis, angle);

  //     o.electron.position.copy(base);

  //     for (let p = 0; p < TRAIL_POINTS - 1; p++) {
  //       const from = (p + 1) * 3;
  //       const to = p * 3;

  //       o.trailPositions[to] = o.trailPositions[from];
  //       o.trailPositions[to + 1] = o.trailPositions[from + 1];
  //       o.trailPositions[to + 2] = o.trailPositions[from + 2];
  //     }

  //     const last = (TRAIL_POINTS - 1) * 3;
  //     o.trailPositions[last] = base.x;
  //     o.trailPositions[last + 1] = base.y;
  //     o.trailPositions[last + 2] = base.z;

  //     o.trail.geometry.attributes.position.needsUpdate = true;
  //   }
  // }

  function updateOrbiters() {
    const t = performance.now() * 0.001;

    for (let i = 0; i < orbiters.length; i++) {
      const o = orbiters[i];

      const angle = t * o.speed * 10 + o.phase;

      const base = o.startDir.clone().multiplyScalar(o.orbitalRadius);
      base.applyAxisAngle(o.axis, angle);

      o.electron.position.copy(base);

      // ✔️ CLEAN TRAIL UPDATE (NO SHIFTING BUGS)
      const arr = o.trailPositions;

      for (let p = 0; p < TRAIL_POINTS - 1; p++) {
        const i3 = p * 3;
        const n3 = (p + 1) * 3;

        arr[i3] = arr[n3];
        arr[i3 + 1] = arr[n3 + 1];
        arr[i3 + 2] = arr[n3 + 2];
      }

      const last = (TRAIL_POINTS - 1) * 3;
      arr[last] = base.x;
      arr[last + 1] = base.y;
      arr[last + 2] = base.z;

      o.trail.geometry.attributes.position.needsUpdate = true;
    }
  }

  // 🔴 FIXED RESET FUNCTION (INSIDE SCOPE)
  function resetTrails() {
    for (let i = 0; i < orbiters.length; i++) {
      const o = orbiters[i];
      const pos = o.electron.position;

      for (let p = 0; p < TRAIL_POINTS; p++) {
        const idx = p * 3;
        o.trailPositions[idx] = pos.x;
        o.trailPositions[idx + 1] = pos.y;
        o.trailPositions[idx + 2] = pos.z;
      }

      o.trail.geometry.attributes.position.needsUpdate = true;
    }
  }

  // 🔴 EVENTS INSIDE SCOPE
  window.addEventListener("focus", () => {
    firstFrameAfterFocus = true;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      firstFrameAfterFocus = true;
    }
  });

  function animate() {
    requestAnimationFrame(animate);

    let stableAfterFocus = false;

    window.addEventListener("focus", () => {
      stableAfterFocus = true;
    });

    if (stableAfterFocus) {
      resetTrails();
      stableAfterFocus = false;
    }

    if (controls) controls.update();
    if (particles) particles.rotation.y += 0.0065;

    // 🔴 CLEAN RESET ON FIRST FRAME
    if (firstFrameAfterFocus) {
      resetTrails();
      firstFrameAfterFocus = false;
    }

    updateOrbiters();
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth < minDesktopWidth) return;
    setSize();
  });

  setSize();

  if (labelsContainer) labelsContainer.innerHTML = "";

  initOrbiters();
  createDottedMap();
})();