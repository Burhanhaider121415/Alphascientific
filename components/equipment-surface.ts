import { DoubleSide, Mesh, MeshBasicMaterial, PlaneGeometry, SRGBColorSpace, TextureLoader } from 'three';

const range = (value: number) => Math.min(1, Math.max(0, value));

const profiles = {
  home: {
    width: 5.25,
    depth(u: number, v: number) {
      const seam = .79 - v * .073;
      const side = range((u - seam) / (.984 - seam));
      const hood = range((.46 - u) * 12) * range((.54 - v) * 13);
      const gap = range((.43 - u) * 9) * range(1 - Math.abs(v - .56) * 15);
      return -.20 + u * .64 - side * 1.71 + hood * .20 - gap * .36;
    },
  },
  discovery: {
    width: 4.13,
    depth(u: number, v: number) {
      const side = range((u - .873) / .125);
      const holder = range(1 - Math.abs(u - .66) * 10) * range(1 - Math.abs(v - .59) * 8);
      return .28 - side * 1.39 - holder * .37;
    },
  },
  contact: {
    width: 4.04,
    depth(u: number, v: number) {
      const top = range((.84 - v - u * .16) * 1.18);
      const tray = range(1 - Math.abs(u - .36) * 7) * range(1 - Math.abs(v - .71) * 8);
      return .48 - top * 1.63 - tray * .26;
    },
  },
};

export type SurfaceVariant = keyof typeof profiles;

// Project the original photograph onto the visible housing planes. Each sample
// follows its reference camera ray, preserving the supplied image at the neutral
// view while creating real parallax across the front, recess and visible side.
export async function loadEquipmentSurface(image: string, variant: SurfaceVariant) {
  const texture = await new TextureLoader().loadAsync(image);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  const profile = profiles[variant];
  const height = profile.width * texture.image.height / texture.image.width;
  const geometry = new PlaneGeometry(profile.width, height, 64, 48);
  const positions = geometry.getAttribute('position');
  const coordinates = geometry.getAttribute('uv');
  for (let i = 0; i < positions.count; i++) {
    const depth = profile.depth(coordinates.getX(i), 1 - coordinates.getY(i));
    const projection = (9.46 - depth) / 9.46;
    positions.setXYZ(i, positions.getX(i) * projection, positions.getY(i) * projection, depth);
  }
  geometry.computeBoundingSphere();
  const material = new MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: .04,
    side: DoubleSide,
    toneMapped: false,
  });
  const mesh = new Mesh(geometry, material);
  return {
    mesh,
    dispose() {
      geometry.dispose();
      material.dispose();
      texture.dispose();
    },
  };
}
