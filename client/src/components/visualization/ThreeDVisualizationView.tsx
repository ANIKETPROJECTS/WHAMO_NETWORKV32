import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Box, Crosshair, RotateCcw, X, ZoomIn } from "lucide-react";
import type { WhamoEdge, WhamoNode } from "@/lib/store";

interface ThreeDVisualizationViewProps {
  nodes: WhamoNode[];
  edges: WhamoEdge[];
  projectName?: string;
  onClose: () => void;
}

type HydraulicNodeType = WhamoNode["type"];

const NODE_COLORS: Record<string, number> = {
  reservoir: 0x2563eb,
  node: 0x0f766e,
  junction: 0x7c3aed,
  surgeTank: 0xf59e0b,
  flowBoundary: 0x0891b2,
  pump: 0xdc2626,
  checkValve: 0x9333ea,
  turbine: 0x059669,
};

const NODE_LABELS: Record<string, string> = {
  reservoir: "Reservoir",
  node: "Node",
  junction: "Junction",
  surgeTank: "Surge tank",
  flowBoundary: "Flow boundary",
  pump: "Pump",
  checkValve: "Check valve",
  turbine: "Turbine",
};

function numberValue(value: unknown, fallback = 0) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function makeMaterial(color: number, opacity = 1) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.42,
    metalness: 0.18,
    transparent: opacity < 1,
    opacity,
  });
}

function addNodeModel(node: WhamoNode, position: THREE.Vector3, group: THREE.Group) {
  const type = (node.type as HydraulicNodeType | undefined) ?? "node";
  const color = NODE_COLORS[type] ?? 0x475569;
  const material = makeMaterial(color);
  let mesh: THREE.Object3D;

  switch (type) {
    case "reservoir": {
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32), material);
      const water = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.7, 0.06, 32),
        makeMaterial(0x38bdf8, 0.9),
      );
      water.position.y = 0.55;
      tank.add(water);
      mesh = tank;
      break;
    }
    case "surgeTank": {
      const tankHeight = Math.max(
        1.8,
        Math.min(5.5, Math.abs(numberValue(node.data?.tankTop) - numberValue(node.data?.tankBottom)) * 0.08),
      );
      mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, tankHeight, 24), material);
      break;
    }
    case "pump": {
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 1.25, 24), material);
      body.rotation.z = Math.PI / 2;
      const impeller = new THREE.Mesh(
        new THREE.TorusGeometry(0.42, 0.1, 10, 24),
        makeMaterial(0xfca5a5),
      );
      impeller.rotation.y = Math.PI / 2;
      body.add(impeller);
      mesh = body;
      break;
    }
    case "checkValve": {
      mesh = new THREE.Mesh(new THREE.ConeGeometry(0.72, 1.2, 4), material);
      (mesh as THREE.Mesh).rotation.z = -Math.PI / 2;
      break;
    }
    case "turbine": {
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 0.9, 24), material);
      body.rotation.z = Math.PI / 2;
      for (let index = 0; index < 4; index += 1) {
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.85, 0.12),
          makeMaterial(0xa7f3d0),
        );
        blade.rotation.x = (index * Math.PI) / 4;
        blade.position.x = 0.48;
        body.add(blade);
      }
      mesh = body;
      break;
    }
    case "junction":
      mesh = new THREE.Mesh(new THREE.ConeGeometry(0.75, 1.1, 6), material);
      break;
    case "flowBoundary":
      mesh = new THREE.Mesh(new THREE.BoxGeometry(1.25, 1.25, 1.25), material);
      break;
    case "node":
    default:
      mesh = new THREE.Mesh(new THREE.SphereGeometry(0.68, 24, 16), material);
      break;
  }

  mesh.position.copy(position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData = { label: node.data?.label || node.id, type };
  group.add(mesh);
}

function addPipeModel(
  edge: WhamoEdge,
  source: THREE.Vector3,
  target: THREE.Vector3,
  group: THREE.Group,
) {
  const direction = new THREE.Vector3().subVectors(target, source);
  const length = direction.length();
  if (length < 0.001) return;

  const radius = Math.max(0.06, Math.min(0.32, numberValue(edge.data?.diameter, 0.35) * 0.025));
  const pipe = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, length, 16),
    makeMaterial(edge.data?.type === "dummy" ? 0x94a3b8 : 0x334155),
  );
  pipe.position.copy(source).add(target).multiplyScalar(0.5);
  pipe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
  pipe.castShadow = true;
  pipe.receiveShadow = true;
  pipe.userData = {
    label: edge.data?.label || edge.id,
    type: edge.data?.type || "conduit",
    length: numberValue(edge.data?.length, length),
    diameter: numberValue(edge.data?.diameter),
  };
  group.add(pipe);
}

export function ThreeDVisualizationView({
  nodes,
  edges,
  projectName,
  onClose,
}: ThreeDVisualizationViewProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const [modelStats, setModelStats] = useState({ nodes: nodes.length, pipes: 0 });

  const resetCamera = useCallback(() => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;
    camera.position.set(18, 15, 20);
    controls.target.set(0, 0, 0);
    controls.update();
  }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf1f5f9);
    scene.fog = new THREE.Fog(0xf1f5f9, 45, 110);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 250);
    camera.position.set(18, 15, 20);
    cameraRef.current = camera;
    sceneRef.current = scene;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 4;
    controls.maxDistance = 100;
    controlsRef.current = controls;

    scene.add(new THREE.HemisphereLight(0xffffff, 0x64748b, 2.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(10, 25, 14);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const graphGroup = new THREE.Group();
    scene.add(graphGroup);

    const rawPositions = nodes.map((node) => ({
      node,
      x: numberValue(node.position?.x),
      y: numberValue(node.position?.y),
      elevation: numberValue(node.data?.elevation ?? node.data?.reservoirElevation),
    }));
    const centerX = rawPositions.reduce((sum, item) => sum + item.x, 0) / Math.max(rawPositions.length, 1);
    const centerY = rawPositions.reduce((sum, item) => sum + item.y, 0) / Math.max(rawPositions.length, 1);
    const centerElevation =
      rawPositions.reduce((sum, item) => sum + item.elevation, 0) / Math.max(rawPositions.length, 1);
    const graphScale = 0.055;
    const elevationScale = 0.035;
    const modelPositions = new Map<string, THREE.Vector3>();

    rawPositions.forEach(({ node, x, y, elevation }) => {
      const position = new THREE.Vector3(
        (x - centerX) * graphScale,
        (elevation - centerElevation) * elevationScale,
        -(y - centerY) * graphScale,
      );
      modelPositions.set(node.id, position);
      addNodeModel(node, position, graphGroup);
    });

    let pipeCount = 0;
    edges.forEach((edge) => {
      const source = modelPositions.get(edge.source);
      const target = modelPositions.get(edge.target);
      if (source && target) {
        addPipeModel(edge, source, target, graphGroup);
        pipeCount += 1;
      }
    });
    setModelStats({ nodes: nodes.length, pipes: pipeCount });

    const extents = rawPositions.reduce(
      (largest, item) => Math.max(largest, Math.abs(item.x - centerX), Math.abs(item.y - centerY)),
      8,
    ) * graphScale;
    const gridSize = Math.max(30, Math.min(100, extents * 4));
    const grid = new THREE.GridHelper(gridSize, Math.round(gridSize / 2), 0x94a3b8, 0xcbd5e1);
    grid.position.y = -Math.max(2.5, extents * 0.3);
    scene.add(grid);
    scene.add(new THREE.AxesHelper(Math.max(3, extents * 0.35)));

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(gridSize, gridSize),
      new THREE.ShadowMaterial({ opacity: 0.12 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = grid.position.y - 0.02;
    ground.receiveShadow = true;
    scene.add(ground);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      graphGroup.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material.dispose();
        }
      });
      mount.removeChild(renderer.domElement);
      sceneRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
    };
  }, [edges, nodes]);

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-slate-950">
      <header className="flex items-center gap-3 border-b border-slate-700 bg-slate-900 px-5 py-3 text-white">
        <div className="flex items-center gap-2">
          <Box className="h-5 w-5 text-cyan-300" />
          <div>
            <h2 className="text-sm font-semibold">3D Network Visualization</h2>
            <p className="text-[11px] text-slate-400">
              {projectName || "Current WHAMO network"} · live hydraulic model
            </p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden rounded-md bg-slate-800 px-2.5 py-1.5 text-[11px] text-slate-300 sm:inline-flex">
            {modelStats.nodes} components · {modelStats.pipes} links
          </span>
          <button
            type="button"
            onClick={resetCamera}
            className="flex items-center gap-1.5 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset view
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700"
          >
            <X className="h-3.5 w-3.5" />
            Close
          </button>
        </div>
      </header>

      <div className="relative min-h-0 flex-1">
        <div ref={mountRef} className="absolute inset-0" />
        <div className="pointer-events-none absolute left-4 top-4 rounded-lg border border-slate-700/80 bg-slate-900/85 p-3 text-[11px] text-slate-200 shadow-lg backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-1.5 font-semibold text-white">
            <Crosshair className="h-3.5 w-3.5 text-cyan-300" />
            Navigate model
          </div>
          <p className="text-slate-400">Drag to orbit · Shift-drag to pan</p>
          <p className="mt-1 flex items-center gap-1 text-slate-400">
            <ZoomIn className="h-3 w-3" /> Scroll to zoom
          </p>
        </div>
        <div className="pointer-events-none absolute bottom-4 left-4 grid grid-cols-2 gap-x-3 gap-y-1 rounded-lg border border-slate-700/80 bg-slate-900/85 p-3 text-[10px] text-slate-300 shadow-lg backdrop-blur-sm sm:grid-cols-4">
          {Object.entries(NODE_LABELS).map(([type, label]) => (
            <span key={type} className="flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: `#${(NODE_COLORS[type] ?? 0x475569).toString(16).padStart(6, "0")}` }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}