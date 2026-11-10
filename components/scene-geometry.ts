import {
  AmbientLight, BoxGeometry, DirectionalLight, EdgesGeometry, Group, LineBasicMaterial,
  LineSegments, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, TorusGeometry, WebGLRenderer,
} from 'three';

export function mountScene(canvas: HTMLCanvasElement, variant: string) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const scene = new Scene();
  const camera = new PerspectiveCamera(34, 1, .1, 70);
  const rig = new Group();
  scene.add(rig);
  scene.add(new AmbientLight(0xb4ffe4, 2.2));
  const light = new DirectionalLight(0xb6ffdd, 3);
  light.position.set(1, 4, 6);
  scene.add(light);

  const ringMaterial = new MeshStandardMaterial({ color: 0x51b59b, metalness: .42, roughness: .38 });
  const discovery = variant === 'discovery';
  const inspection = variant === 'inspection';
  const ring = new Mesh(new TorusGeometry(2.52, .014, 8, discovery ? 4 : 100), ringMaterial);
  const inner = new Mesh(new TorusGeometry(2.16, .009, 8, discovery ? 4 : 100), ringMaterial);
  inner.rotation.y = .35;
  ring.rotation.x = inspection ? .62 : .38;
  if (discovery) {
    ring.rotation.z = Math.PI / 4;
    inner.rotation.z = Math.PI / 4;
    ring.scale.set(1.22, .82, 1);
    inner.position.z = -.75;
  }
  const railBox = new BoxGeometry(4.95, 3.7, 1.25);
  const railEdges = new EdgesGeometry(railBox);
  railBox.dispose();
  const rails = new LineSegments(railEdges, new LineBasicMaterial({
    color: 0x51b59b, transparent: true, opacity: .42,
  }));
  rails.rotation.z = discovery ? .13 : -.10;
  rig.add(ring, inner, rails);
  let width = 0;
  let height = 0;

  return {
    draw(progress: number, x: number, y: number) {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      if (w !== width || h !== height) {
        width = w;
        height = h;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      camera.position.set(x * .48, 0.4 + y * .33, 10.6 + progress * 1.9);
      camera.lookAt(0, 0, 0);
      rig.rotation.set(progress * .55 - y * .1, progress * (discovery ? -.64 : .76) + x * .16, progress * .48);
      renderer.render(scene, camera);
    },
    dispose() {
      ring.geometry.dispose();
      inner.geometry.dispose();
      rails.geometry.dispose();
      rails.material.dispose();
      ringMaterial.dispose();
      renderer.dispose();
    },
  };
}
