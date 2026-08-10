import { useEffect, useRef } from "react";
import * as THREE from "three";
import { feature } from "topojson-client";
import landTopology from "world-atlas/land-110m.json";

export interface PortalGlobeProps {
  /** Alterna a tonalidade do globo conforme o destino destacado. */
  tone?: "primary" | "secondary";
}

type Coordinate = [longitude: number, latitude: number];
type Ring = Coordinate[];
type Polygon = Ring[];
type LandCoordinates = Polygon[];

const topology = landTopology as unknown as { objects: { land: unknown } };
const landFeature = feature(topology as never, topology.objects.land as never);
const landEntries =
  (landFeature as unknown as { features?: { geometry?: { type: string; coordinates: unknown } }[] })
    .features ?? [landFeature as unknown as { geometry?: { type: string; coordinates: unknown } }];
const landCoordinates: LandCoordinates = landEntries.flatMap(({ geometry }) => {
  if (!geometry) return [];
  if (geometry.type === "Polygon") return [geometry.coordinates as Polygon];
  if (geometry.type === "MultiPolygon") return geometry.coordinates as LandCoordinates;
  return [];
});

function isInsideRing(longitude: number, latitude: number, ring: Ring) {
  let inside = false;
  for (let current = 0, previous = ring.length - 1; current < ring.length; previous = current++) {
    const currentPoint = ring[current];
    const previousPoint = ring[previous];
    if (!currentPoint || !previousPoint) continue;
    const [currentLongitude, currentLatitude] = currentPoint;
    const [previousLongitude, previousLatitude] = previousPoint;
    const crossesLatitude = (currentLatitude > latitude) !== (previousLatitude > latitude);
    const crossingLongitude =
      ((previousLongitude - currentLongitude) * (latitude - currentLatitude)) /
        (previousLatitude - currentLatitude) +
      currentLongitude;
    if (crossesLatitude && longitude < crossingLongitude) inside = !inside;
  }
  return inside;
}

function isLand(longitude: number, latitude: number) {
  return landCoordinates.some((polygon) => {
    const outerRing = polygon[0];
    if (!outerRing || !isInsideRing(longitude, latitude, outerRing)) return false;
    return !polygon.slice(1).some((hole) => isInsideRing(longitude, latitude, hole));
  });
}

function pointFromCoordinates(longitude: number, latitude: number, radius: number) {
  const longitudeRadians = THREE.MathUtils.degToRad(longitude);
  const latitudeRadians = THREE.MathUtils.degToRad(latitude);
  const horizontalRadius = Math.cos(latitudeRadians) * radius;
  return [
    Math.sin(longitudeRadians) * horizontalRadius,
    Math.sin(latitudeRadians) * radius,
    Math.cos(longitudeRadians) * horizontalRadius,
  ];
}

function createSpherePoints(radius: number) {
  const count = 1100;
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < count; index += 1) {
    const y = 1 - (index / (count - 1)) * 2;
    const horizontalRadius = Math.sqrt(1 - y * y);
    const angle = Math.PI * (3 - Math.sqrt(5)) * index;
    positions[index * 3] = Math.cos(angle) * horizontalRadius * radius;
    positions[index * 3 + 1] = y * radius;
    positions[index * 3 + 2] = Math.sin(angle) * horizontalRadius * radius;
  }
  return positions;
}

function createContinentPoints(radius: number) {
  const positions: number[] = [];
  for (let latitude = -58; latitude <= 82; latitude += 3.1) {
    for (let longitude = -180; longitude < 180; longitude += 3.1) {
      if (isLand(longitude, latitude)) positions.push(...pointFromCoordinates(longitude, latitude, radius));
    }
  }
  return new Float32Array(positions);
}

/**
 * Globo de dados Three.js com massa terrestre real do Natural Earth / world-atlas.
 * O canvas é decorativo e respeita `prefers-reduced-motion` (FE-07).
 */
export function PortalGlobe({ tone = "primary" }: PortalGlobeProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const oceanMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const landMaterialRef = useRef<THREE.PointsMaterial | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue("--color-primary").trim();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const radius = 1.63;
    const scene = new THREE.Scene();
    const globe = new THREE.Group();
    globe.rotation.set(-0.18, -0.7, 0.04);
    scene.add(globe);

    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 4.18);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    // O fundo é decorativo: 1,25x preserva os pontos sem disputar GPU com o painel.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const oceanGeometry = new THREE.BufferGeometry();
    oceanGeometry.setAttribute("position", new THREE.BufferAttribute(createSpherePoints(radius), 3));
    const oceanMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(accent), size: 0.018, sizeAttenuation: true, transparent: true, opacity: 0.18, depthWrite: false,
    });
    oceanMaterialRef.current = oceanMaterial;
    globe.add(new THREE.Points(oceanGeometry, oceanMaterial));

    const landGeometry = new THREE.BufferGeometry();
    landGeometry.setAttribute("position", new THREE.BufferAttribute(createContinentPoints(radius + 0.008), 3));
    const landMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(accent), size: 0.031, sizeAttenuation: true, transparent: true, opacity: 0.98, depthWrite: false,
    });
    landMaterialRef.current = landMaterial;
    globe.add(new THREE.Points(landGeometry, landMaterial));

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    let frameId = 0;
    let previousFrame = 0;
    const render = (now = 0) => {
      // Limitar o canvas decorativo a 30 FPS evita competir com a animação dos cards.
      if (now - previousFrame >= 1000 / 30 || previousFrame === 0) {
        if (!reduceMotion) globe.rotation.y += 0.0024;
        renderer.render(scene, camera);
        previousFrame = now;
      }
      if (!reduceMotion) frameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      oceanGeometry.dispose();
      oceanMaterial.dispose();
      landGeometry.dispose();
      landMaterial.dispose();
      oceanMaterialRef.current = null;
      landMaterialRef.current = null;
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    const color = styles.getPropertyValue(tone === "primary" ? "--color-primary" : "--color-secondary").trim();
    oceanMaterialRef.current?.color.set(color);
    landMaterialRef.current?.color.set(color);
  }, [tone]);

  return <div ref={hostRef} aria-hidden="true" className="pointer-events-none absolute inset-y-0 -right-[70%] w-[140%] opacity-80" />;
}
