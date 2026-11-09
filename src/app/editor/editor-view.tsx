"use client";

import Link from "next/link";
import { useState } from "react";
import { BodyPhoto, DesignArt } from "@/components/artwork";
import {
  BrushIcon,
  ChevronLeftIcon,
  CropIcon,
  EraserIcon,
  EyeIcon,
  EyeOffIcon,
  EyedropperIcon,
  LassoIcon,
  LockIcon,
  MoveIcon,
  PlusIcon,
  RedoIcon,
  RulerIcon,
  TextIcon,
  TransformIcon,
  UndoIcon,
  UnlockIcon,
  WandIcon,
  WarpIcon,
} from "@/components/icons";
import { BLEND_MODES, type BlendMode, type Layer } from "@/lib/types";
import styles from "./editor.module.css";

// The preview below uses CSS blend modes and filters as a stand-in.
// The real canvas will be a WebGL (PixiJS) compositor; see README.

const TOOLS = [
  { id: "move", label: "Move", Icon: MoveIcon },
  { id: "transform", label: "Transform", Icon: TransformIcon },
  { id: "warp", label: "Warp", Icon: WarpIcon },
  { id: "brush", label: "Brush", Icon: BrushIcon },
  { id: "eraser", label: "Eraser", Icon: EraserIcon },
  { id: "lasso", label: "Lasso select", Icon: LassoIcon },
  { id: "cutout", label: "Remove background", Icon: WandIcon },
  { id: "text", label: "Text", Icon: TextIcon },
  { id: "eyedropper", label: "Eyedropper", Icon: EyedropperIcon },
  { id: "crop", label: "Crop", Icon: CropIcon },
  { id: "measure", label: "Measure in centimetres", Icon: RulerIcon },
] as const;

type ToolId = (typeof TOOLS)[number]["id"];

const CSS_BLEND: Record<BlendMode, React.CSSProperties["mixBlendMode"]> = {
  Normal: "normal",
  Multiply: "multiply",
  Screen: "screen",
  Overlay: "overlay",
  Darken: "darken",
  "Soft light": "soft-light",
};

// Warp mesh control points on a 4 × 4 grid, bowed to suggest the curve of the arm.
const MESH_POINTS: [number, number][] = [
  [0, 0], [80, -6], [160, -6], [240, 0],
  [-2, 80], [79, 74], [161, 74], [242, 80],
  [-2, 160], [79, 154], [161, 154], [242, 160],
  [0, 240], [80, 234], [160, 234], [240, 240],
];

export function EditorView({ initialLayers }: { initialLayers: Layer[] }) {
  const [tool, setTool] = useState<ToolId>("warp");
  const [layers, setLayers] = useState(initialLayers);
  const [selectedId, setSelectedId] = useState(initialLayers[0].id);
  const [blend, setBlend] = useState<BlendMode>("Multiply");
  const [opacity, setOpacity] = useState(85);
  const [widthCm, setWidthCm] = useState("9.2");
  const [heightCm, setHeightCm] = useState("9.4");
  const [rotation, setRotation] = useState("14");
  const [lockRatio, setLockRatio] = useState(true);
  const [lineArt, setLineArt] = useState(true);
  const [threshold, setThreshold] = useState(72);
  const [zoom, setZoom] = useState(62);

  const design = layers.find((l) => l.kind === "design");
  const healed = layers.find((l) => l.kind === "adjustment")?.visible ?? false;
  const activeTool = TOOLS.find((t) => t.id === tool)!;

  function toggle(id: string, key: "visible" | "locked") {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: !l[key] } : l)));
  }

  function layerDetail(layer: Layer) {
    if (layer.kind === "design") return `${layer.detail} · ${blend} · ${opacity}%`;
    if (layer.kind === "adjustment") return `${layer.detail} · ${layer.visible ? "on" : "off"}`;
    return `${layer.detail}${layer.locked ? " · locked" : ""}`;
  }

  return (
    <div className={styles.app}>
      <header className={styles.topbar}>
        <Link href="/uploads" className={styles.back}>
          <ChevronLeftIcon size={16} />
          Uploads
        </Link>
        <div className={styles.docTitle}>
          <span>Aarav M. · forearm mockup</span>
          <span className={styles.muted}>Saved just now</span>
        </div>
        <div className={styles.history}>
          <button type="button" className="btn btn-icon" aria-label="Undo">
            <UndoIcon />
          </button>
          <button type="button" className="btn btn-icon" aria-label="Redo" disabled>
            <RedoIcon />
          </button>
        </div>
        <div className={styles.topActions}>
          <button type="button" className="btn">
            Share with client
          </button>
          <button type="button" className="btn btn-primary">
            Export
          </button>
        </div>
      </header>

      <div className={styles.workspace}>
        <nav aria-label="Tools" className={styles.rail}>
          {TOOLS.map(({ id, label, Icon }, i) => (
            <div key={id} className={styles.railItem}>
              {i === 3 && <span className={styles.railRule} aria-hidden="true" />}
              <button
                type="button"
                aria-label={label}
                title={label}
                aria-pressed={tool === id}
                className={styles.tool}
                onClick={() => setTool(id)}
              >
                <Icon size={20} />
              </button>
            </div>
          ))}
        </nav>

        <main aria-label="Canvas" className={styles.canvas}>
          <div className={styles.contextBar}>
            <span className={styles.contextName}>{activeTool.label}</span>
            {tool === "warp" && (
              <>
                <label className={styles.inlineField}>
                  Grid
                  <select defaultValue="4">
                    <option value="3">3 × 3</option>
                    <option value="4">4 × 4</option>
                    <option value="6">6 × 6</option>
                  </select>
                </label>
                <button type="button" className="btn">
                  Reset
                </button>
                <button type="button" className="btn btn-accent" onClick={() => setTool("move")}>
                  Done
                </button>
              </>
            )}
          </div>

          <div className={styles.artboard} style={{ transform: `scale(${zoom / 62})` }}>
            <BodyPhoto angle={14} />
            {design?.visible && (
              <div className={styles.placed} style={{ transform: `translate(-50%, -50%) rotate(${Number(rotation) || 0}deg)` }}>
                <div
                  className={styles.ink}
                  style={{
                    opacity: (healed ? opacity * 0.8 : opacity) / 100,
                    mixBlendMode: CSS_BLEND[blend],
                    filter: healed ? "blur(0.6px)" : undefined,
                  }}
                >
                  <DesignArt size={240} stroke="#2a2420" strokeWidth={1.4} />
                </div>
                {tool === "warp" && (
                  <svg className={styles.mesh} width="264" height="276" viewBox="-12 -24 264 276" fill="none" aria-hidden="true">
                    <g stroke="var(--accent)" strokeWidth="1.2">
                      <path d="M0 0Q120 -16 240 0M0 80Q120 64 240 80M0 160Q120 144 240 160M0 240Q120 224 240 240" />
                      <path d="M0 0Q-8 120 0 240M80 -6Q76 120 80 234M160 -6Q164 120 160 234M240 0Q248 120 240 240" />
                    </g>
                    <g fill="#ffffff" stroke="var(--accent)" strokeWidth="1.5">
                      {MESH_POINTS.map(([x, y]) => (
                        <circle key={`${x},${y}`} cx={x} cy={y} r="5" />
                      ))}
                    </g>
                  </svg>
                )}
              </div>
            )}
            {design?.visible && (
              <span className={styles.size}>
                {widthCm} × {heightCm} cm
              </span>
            )}
          </div>

          <div className={styles.zoom}>
            <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(25, z - 10))}>
              −
            </button>
            <span aria-live="polite">{zoom}%</span>
            <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(200, z + 10))}>
              +
            </button>
            <button type="button" onClick={() => setZoom(62)}>
              Fit
            </button>
          </div>
          {tool === "warp" && <p className={styles.hint}>Drag the points to wrap the design around the arm</p>}
        </main>

        <aside aria-label="Layers and properties" className={styles.panel}>
          <section className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>Layers</h2>
              <button type="button" className="btn btn-icon" aria-label="Add layer">
                <PlusIcon size={16} />
              </button>
            </div>
            <ul className={styles.layers}>
              {layers.map((layer) => (
                <li key={layer.id} className={layer.id === selectedId ? styles.layerSelected : styles.layer}>
                  <button type="button" className={styles.layerMain} onClick={() => setSelectedId(layer.id)} aria-pressed={layer.id === selectedId}>
                    <span className={`${styles.layerThumb} ${styles[`thumb_${layer.kind}`]}`}>
                      {layer.kind === "design" && <DesignArt size={26} strokeWidth={4} />}
                    </span>
                    <span className={styles.layerText}>
                      <span>{layer.name}</span>
                      <span className={styles.muted}>{layerDetail(layer)}</span>
                    </span>
                  </button>
                  {layer.kind === "photo" ? (
                    <button type="button" className="btn btn-icon" aria-label={layer.locked ? "Unlock layer" : "Lock layer"} onClick={() => toggle(layer.id, "locked")}>
                      {layer.locked ? <LockIcon size={16} /> : <UnlockIcon size={16} />}
                    </button>
                  ) : (
                    <button type="button" className="btn btn-icon" aria-label={layer.visible ? "Hide layer" : "Show layer"} onClick={() => toggle(layer.id, "visible")}>
                      {layer.visible ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Layer</h2>
            <label className={styles.field}>
              Blend mode
              <select value={blend} onChange={(e) => setBlend(e.target.value as BlendMode)}>
                {BLEND_MODES.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.fieldRow}>
                Opacity <span className={styles.value}>{opacity}%</span>
              </span>
              <input type="range" min={0} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} />
            </label>
            <div className={styles.pair}>
              <label className={styles.field}>
                Width, cm
                <input inputMode="decimal" value={widthCm} onChange={(e) => setWidthCm(e.target.value)} />
              </label>
              <label className={styles.field}>
                Height, cm
                <input inputMode="decimal" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
              </label>
              <label className={styles.field}>
                Rotate, degrees
                <input inputMode="numeric" value={rotation} onChange={(e) => setRotation(e.target.value)} />
              </label>
              <label className={styles.check}>
                <input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} />
                Lock ratio
              </label>
            </div>
            <p className={styles.muted}>Scale calibrated from the ruler card in the photo.</p>
          </section>

          <section className={styles.section}>
            <h2>Background</h2>
            <button type="button" className="btn">
              Remove background
            </button>
            <label className={styles.check}>
              <input type="checkbox" checked={lineArt} onChange={(e) => setLineArt(e.target.checked)} />
              Line-art mode (paper to transparent)
            </label>
            <label className={styles.field}>
              <span className={styles.fieldRow}>
                Threshold <span className={styles.value}>{threshold}</span>
              </span>
              <input type="range" min={0} max={100} value={threshold} disabled={!lineArt} onChange={(e) => setThreshold(Number(e.target.value))} />
            </label>
          </section>
        </aside>
      </div>
    </div>
  );
}
