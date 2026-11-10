import {
  AmbientLight, BoxGeometry, CircleGeometry, Color, CylinderGeometry, DirectionalLight,
  ExtrudeGeometry, GridHelper, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial,
  PerspectiveCamera, PointLight, Scene, Shape, TorusGeometry, Vector3, WebGLRenderer,
} from 'three';

export type SceneVariant = 'home' | 'discovery' | 'inspection' | 'contact';

type Frame = {
  progress: number;
  x: number;
  y: number;
  entrance: number;
  model: number;
  angle: number;
  reduced: boolean;
};

function roundedHousing(width: number, height: number, depth: number, radius: number) {
  const x = width / 2 - radius;
  const y = height / 2 - radius;
  const shape = new Shape();
  shape.moveTo(-x, -y);
  shape.lineTo(x, -y);
  shape.lineTo(x, y);
  shape.lineTo(-x, y);
  shape.closePath();
  const geometry = new ExtrudeGeometry(shape, {
    depth: depth - radius * 2, bevelEnabled: true, bevelSize: radius,
    bevelThickness: radius, bevelSegments: 4, steps: 1,
  });
  geometry.center();
  return geometry;
}

// The outer dimensions and visible front features follow Analyticon's User Manual,
// figures 1–2 and section 3.3. The model is a simplified exterior study.
function urineAnalyzer() {
  const model = new Group();
  const shell = new MeshStandardMaterial({color: 0xe2efed, roughness: .31, metalness: .08});
  const recess = new MeshStandardMaterial({color: 0x9db8bb, roughness: .47});
  const bin = new MeshStandardMaterial({color: 0x649bab, roughness: .34, metalness: .16});
  const dark = new MeshStandardMaterial({color: 0x173936, roughness: .42});

  function panel(width: number, height: number, depth: number, radius: number, x: number, y: number, z: number, material = shell) {
    const piece = new Mesh(roundedHousing(width, height, depth, radius), material);
    piece.position.set(x, y, z);
    model.add(piece);
  }

  panel(3.05, 3.02, 2.27, .18, 0, -.1, -.44);
  panel(1.45, 3.11, 3.10, .16, -.8, -.06, 0);
  panel(3.05, .30, 3.15, .13, 0, 1.475, 0);
  panel(1.61, 1.19, .91, .13, .71, .28, .47, recess);
  panel(1.61, .32, 1.18, .13, .71, -.44, .94);
  panel(1.63, .93, .93, .16, .71, -1.12, 1.04, bin);
  panel(.52, .06, .37, .025, .68, -.25, 1.04, dark);
  const start = new Mesh(new CylinderGeometry(.107, .107, .022, 24), dark);
  start.position.set(.72, 1.63, 1.16);
  model.add(start);
  for (const x of [.23, .40]) {
    const light = new Mesh(new CylinderGeometry(.035, .035, .018, 16), dark);
    light.position.set(x, 1.625, 1.16);
    model.add(light);
  }
  return model;
}

export function mountScene(canvas: HTMLCanvasElement, variant: SceneVariant) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const scene = new Scene();
  const camera = new PerspectiveCamera(37, 1, .1, 70);
  const rig = new Group();
  scene.add(rig, new AmbientLight(0xc7ebe1, 1.55));
  const light = new DirectionalLight(0xe1fff5, 2.5);
  light.position.set(-3, 5, 6);
  const accent = new PointLight(0x57e6bf, 28, 18, 2);
  accent.position.set(2, 1, -1.5);
  scene.add(light, accent);

  const isDiscovery = variant === 'discovery';
  const isInspection = variant === 'inspection';
  const isContact = variant === 'contact';
  const metal = new MeshStandardMaterial({color: isDiscovery ? 0x86b9b1 : 0x60cbb0, metalness: .32, roughness: .35});
  const floor = new Mesh(new CylinderGeometry(2.78, 2.86, .25, 80), new MeshStandardMaterial({
    color: isInspection ? 0x183e46 : 0x18453b, metalness: .23, roughness: .47,
  }));
  floor.position.y = -2.04;
  const rim = new Mesh(new TorusGeometry(2.78, .024, 8, 100), metal);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -1.90;
  const grid = new GridHelper(17, 32, 0x82debe, 0x397968);
  grid.material.transparent = true;
  grid.material.opacity = .42;
  grid.position.y = -2.20;
  if (isContact) {
    floor.visible = false;
    rim.visible = false;
    grid.visible = false;
  }
  scene.add(floor, rim, grid);

  const optics = new Group();
  const rings: Mesh<TorusGeometry, MeshStandardMaterial>[] = [];
  const ringCount = isDiscovery ? 5 : isInspection ? 2 : isContact ? 4 : 3;
  for (let i = 0; i < ringCount; i++) {
    const ring = new Mesh(new TorusGeometry(
      isDiscovery ? 2.45 : 2.10 + i * .27,
      i === 0 ? .045 : .017, 10, isDiscovery ? 4 : 120,
    ), metal);
    ring.position.z = -1.0 - i * (isDiscovery ? .70 : .43);
    if (isDiscovery) {
      ring.scale.set(1.15, .97, 1);
      ring.rotation.z = Math.PI / 4;
    }
    if (isInspection) ring.rotation.x = -.26 * i;
    rings.push(ring);
    optics.add(ring);
  }

  const lensMaterial = new MeshBasicMaterial({color: new Color(0x61d3b9), transparent:true, opacity:.14, depthWrite:false});
  const lens = new Mesh(new CircleGeometry(2.10, 72), lensMaterial);
  lens.position.set(0, 0, -1.07);
  if (!isDiscovery) optics.add(lens);
  else lens.geometry.dispose();
  rig.add(optics);

  const scanner = new Mesh(new BoxGeometry(isDiscovery ? 5.6 : 4.1, .027, .11),
    new MeshBasicMaterial({color: 0xc0ffe9, transparent: true, opacity: .8}));
  scanner.position.z = -.36;
  rig.add(scanner);
  const analyzer = isInspection ? urineAnalyzer() : null;
  if (analyzer) scene.add(analyzer);
  let width = 0;
  let height = 0;

  return {
    draw({progress, x, y, entrance, model, angle, reduced}: Frame) {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return false;
      if (w !== width || h !== height) {
        width = w;
        height = h;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      const tight = w / h < .94;
      const drift = Math.sin(progress * Math.PI);
      const cameraX = (isDiscovery ? -2.6 : 2.8) * progress + x * .65;
      camera.position.set(
        cameraX * (1 - model * .70),
        .85 + progress * 1.6 + y * .38 - model * .05,
        (tight ? 10.2 : 9.4) - drift * 1.1 + model * 1.0,
      );
      camera.lookAt(0, -.28 + progress * .48, 0);
      rig.position.set((isDiscovery ? 1.02 : -.83) * drift, isContact ? .12 : .22, -.25);
      rig.rotation.set(-.15 + progress * .43 + y * .10, x * .20 + progress * (isDiscovery ? -.35 : .52), -.05);
      optics.scale.setScalar(reduced ? 1 : .89 + entrance * .11 + drift * .10);
      rings.forEach((ring, i) => {
        ring.position.z = -1.05 - i * (.42 + progress * (isDiscovery ? .60 : .29));
      });
      scanner.visible = !reduced;
      scanner.position.y = 1.9 - (progress * .72 + entrance * .28) * 3.8;
      scanner.material.opacity = Math.max(.04, .78 - model * .68);
      accent.intensity = reduced ? 14 + entrance * 10 : 13 + 28 * (drift + (1 - entrance) * .46);
      accent.position.x = x * 3.6 + progress * 3.2 - 1.2;
      if (analyzer) {
        analyzer.visible = model > .01;
        analyzer.position.y = -.36 - (1 - model) * .21;
        analyzer.rotation.set(-.045 - y * .04, -.40 + angle + x * .19 + drift * .18, 0);
        analyzer.scale.setScalar(.87 + model * .13);
      }
      renderer.render(scene, camera);
      return true;
    },
    dispose() {
      const geometries = new Set<{dispose: () => void}>();
      const materials = new Set<{dispose: () => void}>();
      scene.traverse(object => {
        if (object instanceof Mesh || object instanceof GridHelper) {
          geometries.add(object.geometry);
          for (const material of Array.isArray(object.material) ? object.material : [object.material]) materials.add(material);
        }
      });
      for (const geometry of geometries) geometry.dispose();
      for (const material of materials) material.dispose();
      if (isDiscovery) lensMaterial.dispose();
      renderer.dispose();
    },
  };
}
