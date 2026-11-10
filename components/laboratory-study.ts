import {
  AmbientLight, CircleGeometry, CylinderGeometry, DirectionalLight, Group, InstancedMesh,
  Matrix4, Mesh, MeshStandardMaterial, PerspectiveCamera, Scene, TorusGeometry, WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export function mountLaboratoryStudy(canvas: HTMLCanvasElement) {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new Scene();
  const camera = new PerspectiveCamera(33, 1, .1, 40);
  camera.position.set(5.6, 6.1, 8.8);
  camera.lookAt(0, 0, 0);

  const key = new DirectionalLight(0xfff4dd, 3.3);
  key.position.set(-3, 6, 3);
  const rim = new DirectionalLight(0xc7f6ef, 2);
  rim.position.set(4, 2, -5);
  scene.add(new AmbientLight(0xe3f7f4, 1.4), key, rim);

  const model = new Group();
  scene.add(model);
  const base = new Mesh(new RoundedBoxGeometry(4.7, .22, 3.2, 3, .095),
    new MeshStandardMaterial({ color: 0x233c3e, roughness: .34, metalness: .4 }));
  const opticalLayer = new Mesh(new RoundedBoxGeometry(4.48, .19, 3, 3, .08),
    new MeshStandardMaterial({ color: 0x4d978d, roughness: .29, metalness: .24 }));
  const plate = new Group();
  model.add(base, opticalLayer, plate);

  const housing = new Mesh(new RoundedBoxGeometry(4.32, .26, 2.82, 3, .09),
    new MeshStandardMaterial({ color: 0xe7e7da, roughness: .29, metalness: .17 }));
  plate.add(housing);

  const rings = new InstancedMesh(new TorusGeometry(.151, .026, 8, 24),
    new MeshStandardMaterial({ color: 0xb4cbbe, roughness: .26, metalness: .27 }), 40);
  const wells = new InstancedMesh(new CylinderGeometry(.127, .106, .046, 24),
    new MeshStandardMaterial({ color: 0x254c4b, roughness: .38, metalness: .25 }), 40);
  const samples = new InstancedMesh(new CircleGeometry(.100, 24),
    new MeshStandardMaterial({ color: 0xb58542, roughness: .25, metalness: .16 }), 6);
  const transform = new Matrix4();
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 8; column++) {
      const x = (column - 3.5) * .49;
      const z = (row - 2) * .48;
      const index = row * 8 + column;
      transform.makeRotationX(-Math.PI / 2).setPosition(x, .14, z);
      rings.setMatrixAt(index, transform);
      transform.makeTranslation(x, .138, z);
      wells.setMatrixAt(index, transform);
      if (row === 2 && column > 0 && column < 7) {
        transform.makeRotationX(-Math.PI / 2).setPosition(x, .164, z);
        samples.setMatrixAt(column - 1, transform);
      }
    }
  }
  plate.add(rings, wells, samples);

  let width = 0;
  let height = 0;

  return {
    draw(progress: number, reduced: boolean) {
      if (renderer.getContext().isContextLost()) return false;
      if (width !== canvas.clientWidth || height !== canvas.clientHeight) {
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        if (!width || !height) return false;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
      const motion = reduced ? .23 : 1;
      const lift = Math.sin(progress * Math.PI) * motion;
      model.rotation.y = -.5 + (progress - .5) * .94 * motion;
      model.rotation.z = (progress - .5) * .12 * motion;
      base.position.y = -.44 - lift * .29;
      opticalLayer.position.set(-lift * .19, -.16, 0);
      plate.position.set(lift * .24, .17 + lift * .44, 0);
      renderer.render(scene, camera);
      return true;
    },
    dispose() {
      for (const mesh of [base, opticalLayer, housing, rings, wells, samples]) {
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
      rings.dispose();
      wells.dispose();
      samples.dispose();
      renderer.dispose();
    },
  };
}
