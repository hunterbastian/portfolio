import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export interface PixelateHoverProps {
  /** Image URL to display */
  image: string;

  /** Size of pixelation blocks (higher = larger pixels) */
  pixelSize?: number;

  /** Radius of the cursor effect in pixels */
  cursorRadius?: number;

  /** Softness of the transition falloff (0-1) */
  falloff?: number;

  /** Mode: "reveal" = starts pixelated, reveals on hover | "pixelate" = starts normal, pixelates on hover */
  mode?: "reveal" | "pixelate";

  /** Mouse smoothing/dampening factor (0-1, lower = smoother/slower) */
  smoothing?: number;

  /** Enable auto-demo animation when idle */
  autoDemo?: boolean;

  /** Speed of auto-demo movement */
  autoSpeed?: number;

  /** Delay before auto-demo resumes after user interaction (ms) */
  autoResumeDelay?: number;

  style?: React.CSSProperties;
  className?: string;
}

interface PixelateHoverWebGL {
  resize: () => void;
  start: () => void;
  pause: () => void;
  dispose: () => void;
  output?: {
    resize: () => void;
  };
  autoDriver?: {
    enabled: boolean;
    speed: number;
    forceStop: () => void;
  };
}

const PixelateHover: React.FC<PixelateHoverProps> = ({
  image,
  pixelSize = 20,
  cursorRadius = 200,
  falloff = 0.5,
  mode = "reveal",
  smoothing = 0.15,
  autoDemo = true,
  autoSpeed = 0.5,
  autoResumeDelay = 1500,
  style,
  className = "",
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const webglRef = useRef<PixelateHoverWebGL | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const intersectionObserverRef = useRef<IntersectionObserver | null>(null);
  const rafRef = useRef<number | null>(null);
  const resizeRafRef = useRef<number | null>(null);
  const isVisibleRef = useRef<boolean>(true);
  const imageTexRef = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let disposed = false;

    class CommonClass {
      width = 0;
      height = 0;
      aspect = 1;
      pixelRatio = 1;
      container: HTMLElement | null = null;
      renderer: THREE.WebGLRenderer | null = null;
      clock = new THREE.Clock();
      time = 0;
      delta = 0;

      init(el: HTMLElement) {
        this.container = el;
        const antialias = true;
        const alpha = true;

        this.renderer = new THREE.WebGLRenderer({
          antialias,
          alpha,
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.resize();
      }

      resize() {
        if (!this.container || !this.renderer) return;
        const rect = this.container.getBoundingClientRect();
        this.width = rect.width;
        this.height = rect.height;
        this.aspect = this.width / this.height;
        this.renderer.setSize(this.width, this.height);
      }

      update() {
        this.delta = this.clock.getDelta();
        this.time += this.delta;
      }
    }
    const Common = new CommonClass();

    class MouseClass {
      coords = new THREE.Vector2(0.5, 0.5);
      coords_old = new THREE.Vector2(0.5, 0.5);
      diff = new THREE.Vector2(0, 0);

      target = new THREE.Vector2(0.5, 0.5);
      smoothing = 0.15;

      container: HTMLElement | null = null;
      docTarget: HTMLElement | Document | null = null;
      listenerTarget: HTMLElement | Document | Window | null = null;

      isHoverInside = false;
      hasUserControl = false;
      isAutoActive = false;

      takeoverActive = false;
      takeoverStartTime = 0;
      takeoverDuration = 0.25;
      takeoverFrom = new THREE.Vector2();
      takeoverTo = new THREE.Vector2();

      onInteract?: () => void;

      private _onMouseMove?: EventListener;
      private _onTouchStart?: EventListener;
      private _onTouchMove?: EventListener;
      private _onTouchEnd?: EventListener;
      private _onDocumentLeave?: EventListener;

      init(el: HTMLElement) {
        this.container = el;

        const defaultView = (el.ownerDocument || document)
          .defaultView as Window | null;
        this.docTarget = el.ownerDocument || document;
        this.listenerTarget = defaultView || window;
        this.smoothing = smoothing;

        this._onMouseMove = this.onDocumentMouseMove.bind(
          this,
        ) as EventListener;
        this._onTouchStart = this.onDocumentTouchStart.bind(
          this,
        ) as EventListener;
        this._onTouchMove = this.onDocumentTouchMove.bind(
          this,
        ) as EventListener;
        this._onTouchEnd = this.onTouchEnd.bind(this) as EventListener;
        this._onDocumentLeave = this.onDocumentLeave.bind(
          this,
        ) as EventListener;

        this.listenerTarget.addEventListener("mousemove", this._onMouseMove, {
          passive: true,
        });
        this.listenerTarget.addEventListener("touchstart", this._onTouchStart, {
          passive: true,
        });
        this.listenerTarget.addEventListener("touchmove", this._onTouchMove, {
          passive: true,
        });
        this.listenerTarget.addEventListener("touchend", this._onTouchEnd);
        this.docTarget.addEventListener("mouseleave", this._onDocumentLeave);
      }

      dispose() {
        if (this.listenerTarget && this._onMouseMove) {
          this.listenerTarget.removeEventListener(
            "mousemove",
            this._onMouseMove,
          );
        }
        if (this.listenerTarget && this._onTouchStart) {
          this.listenerTarget.removeEventListener(
            "touchstart",
            this._onTouchStart,
          );
        }
        if (this.listenerTarget && this._onTouchMove) {
          this.listenerTarget.removeEventListener(
            "touchmove",
            this._onTouchMove,
          );
        }
        if (this.listenerTarget && this._onTouchEnd) {
          this.listenerTarget.removeEventListener("touchend", this._onTouchEnd);
        }
        if (this.docTarget && this._onDocumentLeave) {
          this.docTarget.removeEventListener(
            "mouseleave",
            this._onDocumentLeave,
          );
        }
      }

      private isPointInside(x: number, y: number): boolean {
        if (!this.container) return false;
        const rect = this.container.getBoundingClientRect();
        return (
          x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
        );
      }

      private updateHoverState(x: number, y: number) {
        this.isHoverInside = this.isPointInside(x, y);
      }

      private setCoordsFromClient(clientX: number, clientY: number) {
        if (!this.container) return;
        const rect = this.container.getBoundingClientRect();

        const nx = (clientX - rect.left) / rect.width;
        const ny = (clientY - rect.top) / rect.height;
        this.setNormalized(nx, ny);
      }

      setNormalized(x: number, y: number) {
        this.target.set(x, 1 - y);
      }

      onDocumentMouseMove(e: MouseEvent) {
        const x = e.clientX;
        const y = e.clientY;
        this.updateHoverState(x, y);

        if (!this.isHoverInside || !this.container) return;

        if (this.isAutoActive && !this.hasUserControl && !this.takeoverActive) {
          const rect = this.container.getBoundingClientRect();
          const nx = (x - rect.left) / rect.width;
          const ny = (y - rect.top) / rect.height;
          this.takeoverFrom.copy(this.coords);
          this.takeoverTo.set(nx, 1 - ny);
          this.takeoverStartTime = performance.now();
          this.takeoverActive = true;
          this.hasUserControl = true;
          this.isAutoActive = false;
          if (this.onInteract) this.onInteract();
          return;
        }

        this.setCoordsFromClient(x, y);
        this.hasUserControl = true;
        this.isAutoActive = false;
        this.takeoverActive = false;

        if (this.onInteract) this.onInteract();
      }

      onDocumentTouchStart(e: TouchEvent) {
        if (e.touches.length === 0) return;
        const t = e.touches[0];
        this.updateHoverState(t.clientX, t.clientY);
        if (this.isHoverInside) {
          this.setCoordsFromClient(t.clientX, t.clientY);
          if (this.onInteract) this.onInteract();
        }
      }

      onDocumentTouchMove(e: TouchEvent) {
        if (e.touches.length === 0) return;
        const t = e.touches[0];
        this.updateHoverState(t.clientX, t.clientY);
        if (this.isHoverInside) {
          this.setCoordsFromClient(t.clientX, t.clientY);
          this.hasUserControl = true;
          this.isAutoActive = false;
          this.takeoverActive = false;
          if (this.onInteract) this.onInteract();
        }
      }

      onTouchEnd() {
        this.isHoverInside = false;
      }

      onDocumentLeave() {
        this.isHoverInside = false;
      }

      update() {
        if (this.takeoverActive) {
          const t =
            (performance.now() - this.takeoverStartTime) /
            (this.takeoverDuration * 1000);
          if (t >= 1) {
            this.takeoverActive = false;
            this.coords.copy(this.takeoverTo);
            this.target.copy(this.takeoverTo);
            this.coords_old.copy(this.coords);
            this.diff.set(0, 0);
          } else {
            const k = t * t * (3 - 2 * t);
            this.coords.copy(this.takeoverFrom).lerp(this.takeoverTo, k);
          }
        } else {
          this.coords.lerp(this.target, this.smoothing);
        }

        this.diff.subVectors(this.coords, this.coords_old);
        this.coords_old.copy(this.coords);
      }
    }
    const Mouse = new MouseClass();

    class AutoDriver {
      mouse: MouseClass;
      manager: WebGLManager;
      enabled: boolean;
      speed: number;
      resumeDelay: number;
      rampDurationMs: number;

      active = false;
      current = new THREE.Vector2(0.5, 0.5);
      target = new THREE.Vector2(0.5, 0.5);
      lastTime = 0;
      activationTime = 0;
      margin = 0.15;

      private _tmpDir = new THREE.Vector2();

      constructor(
        mouse: MouseClass,
        manager: WebGLManager,
        opts: {
          enabled: boolean;
          speed: number;
          resumeDelay: number;
          rampDuration: number;
        },
      ) {
        this.mouse = mouse;
        this.manager = manager;
        this.enabled = opts.enabled;
        this.speed = opts.speed;
        this.resumeDelay = opts.resumeDelay;
        this.rampDurationMs = opts.rampDuration * 1000;

        if (this.enabled) {
          this.active = true;
          this.activationTime = performance.now();

          const r = Math.random();
          if (r < 0.25) {
            this.current.set(this.margin, 0.5);
          } else if (r < 0.5) {
            this.current.set(1 - this.margin, 0.5);
          } else if (r < 0.75) {
            this.current.set(0.5, this.margin);
          } else {
            this.current.set(0.5, 1 - this.margin);
          }

          const initialDir = new THREE.Vector2(
            Math.random() - 0.5,
            Math.random() - 0.5,
          ).normalize();
          const initialOffset = initialDir.multiplyScalar(0.15);
          this.target.copy(this.current).add(initialOffset);
          this.target.x = Math.max(
            this.margin,
            Math.min(1 - this.margin, this.target.x),
          );
          this.target.y = Math.max(
            this.margin,
            Math.min(1 - this.margin, this.target.y),
          );

          this.mouse.coords.copy(this.current);
          this.mouse.coords_old.copy(this.current);
          this.mouse.isAutoActive = true;
        }
      }

      pickNewTarget() {
        const r = Math.random() * Math.PI * 2;
        const dist = 0.2 + Math.random() * 0.2;
        this.target
          .set(Math.cos(r) * dist, Math.sin(r) * dist)
          .add(this.current);
        this.target.x = Math.max(
          this.margin,
          Math.min(1 - this.margin, this.target.x),
        );
        this.target.y = Math.max(
          this.margin,
          Math.min(1 - this.margin, this.target.y),
        );
      }

      forceStop() {
        this.active = false;
        this.mouse.isAutoActive = false;
        this.lastTime = performance.now();
      }

      update() {
        if (!this.enabled) return;

        const now = performance.now();
        const idle = now - this.manager.lastUserInteraction;

        if (idle < this.resumeDelay) {
          if (this.active) this.forceStop();
          return;
        }

        if (this.mouse.isHoverInside) {
          if (this.active) this.forceStop();
          return;
        }

        if (!this.active) {
          this.active = true;
          this.current.copy(this.mouse.coords);
          this.lastTime = now;
          this.activationTime = now;
          this.pickNewTarget();

          this.mouse.takeoverActive = true;
          this.mouse.takeoverStartTime = now;
          this.mouse.takeoverFrom.copy(this.mouse.coords);
          this.mouse.takeoverTo.copy(this.target);
        }

        this.mouse.isAutoActive = true;

        let dtSec = (now - this.lastTime) / 1000;
        this.lastTime = now;
        if (dtSec > 0.2) dtSec = 0.016;

        const dir = this._tmpDir.subVectors(this.target, this.current);
        const dist = dir.length();

        if (dist < 0.01) {
          this.pickNewTarget();
          return;
        }

        dir.normalize();

        let ramp = 1;
        if (this.rampDurationMs > 0) {
          const t = Math.min(
            1,
            (now - this.activationTime) / this.rampDurationMs,
          );
          ramp = t * t * (3 - 2 * t);
        }

        const step = this.speed * dtSec;
        const move = Math.min(step * ramp, dist);
        this.current.addScaledVector(dir, move);

        this.mouse.setNormalized(this.current.x, this.current.y);
      }
    }

    const vertex_shader = `
      precision highp float;
      attribute vec3 position;
      attribute vec2 uv;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragment_shader = `
      precision highp float;
      varying vec2 vUv;

      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      uniform vec2 uImageResolution;
      uniform float uCursorRadius;
      uniform float uFalloff;
      uniform float uPixelSize;
      uniform float uMode;

      vec2 getCoverUv(vec2 uv, vec2 texRes, vec2 canvasRes) {
        vec2 ratio = vec2(
          min((canvasRes.x / canvasRes.y) / (texRes.x / texRes.y), 1.0),
          min((canvasRes.y / canvasRes.x) / (texRes.y / texRes.x), 1.0)
        );

        vec2 newUv = vec2(
          uv.x * ratio.x + (1.0 - ratio.x) * 0.5,
          uv.y * ratio.y + (1.0 - ratio.y) * 0.5
        );

        return newUv;
      }

      void main() {
        vec2 pixelCoord = vUv * uResolution;
        vec2 mousePixel = uMouse * uResolution;
        float dist = distance(pixelCoord, mousePixel);

        float radius = uCursorRadius;
        float innerRadius = radius * (1.0 - uFalloff);
        float blend = smoothstep(innerRadius, radius, dist);

        if (uMode < 0.5) {
          blend = 1.0 - blend;
        }

        vec2 coverUv = getCoverUv(vUv, uImageResolution, uResolution);

        vec4 normalColor = texture2D(uTexture, coverUv);

        vec2 pixelatedUv = coverUv;
        if (blend < 1.0) {
          vec2 gridSize = uImageResolution / uPixelSize;
          vec2 gridUv = floor(coverUv * gridSize) / gridSize;
          gridUv += 0.5 / gridSize;
          pixelatedUv = gridUv;
        }

        vec4 pixelatedColor = texture2D(uTexture, pixelatedUv);

        vec4 finalColor = mix(pixelatedColor, normalColor, blend);

        gl_FragColor = finalColor;
      }
    `;

    class Output {
      scene: THREE.Scene;
      camera: THREE.Camera;
      mesh: THREE.Mesh;
      uniforms: {
        uTexture: { value: THREE.Texture | null };
        uMouse: { value: THREE.Vector2 };
        uResolution: { value: THREE.Vector2 };
        uImageResolution: { value: THREE.Vector2 };
        uCursorRadius: { value: number };
        uFalloff: { value: number };
        uPixelSize: { value: number };
        uMode: { value: number };
      };

      constructor(texture: THREE.Texture) {
        this.scene = new THREE.Scene();
        this.camera = new THREE.Camera();

        this.uniforms = {
          uTexture: { value: texture },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uResolution: {
            value: new THREE.Vector2(Common.width, Common.height),
          },
          uImageResolution: {
            value: new THREE.Vector2(
              (texture.image as { width?: number })?.width ||
                (texture.source?.data as { width?: number })?.width ||
                1,
              (texture.image as { height?: number })?.height ||
                (texture.source?.data as { height?: number })?.height ||
                1,
            ),
          },
          uCursorRadius: { value: cursorRadius },
          uFalloff: { value: falloff },
          uPixelSize: { value: pixelSize },
          uMode: { value: mode === "pixelate" ? 1.0 : 0.0 },
        };

        const material = new THREE.RawShaderMaterial({
          vertexShader: vertex_shader,
          fragmentShader: fragment_shader,
          transparent: true,
          uniforms: this.uniforms,
        });

        this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        this.scene.add(this.mesh);
      }

      resize() {
        this.uniforms.uResolution.value.set(Common.width, Common.height);
      }

      update() {
        this.uniforms.uMouse.value.copy(Mouse.coords);
      }

      render() {
        if (!Common.renderer) return;
        Common.renderer.setRenderTarget(null);
        Common.renderer.render(this.scene, this.camera);
      }
    }

    class WebGLManager implements PixelateHoverWebGL {
      props: Record<string, unknown>;
      output!: Output;
      autoDriver?: AutoDriver;
      lastUserInteraction = performance.now() - 10000;
      running = false;

      private _loop = this.loop.bind(this);
      private _resize = this.resize.bind(this);
      private _onVisibility?: () => void;

      constructor(props: { $wrapper: HTMLElement; texture: THREE.Texture }) {
        this.props = props;

        Common.init(props.$wrapper);
        Mouse.init(props.$wrapper);
        Mouse.onInteract = () => {
          this.lastUserInteraction = performance.now();
          if (this.autoDriver) this.autoDriver.forceStop();
        };

        this.init();

        window.addEventListener("resize", this._resize);
        this._onVisibility = () => {
          const hidden = document.hidden;
          if (hidden) this.pause();
          else if (isVisibleRef.current) this.start();
        };
        document.addEventListener("visibilitychange", this._onVisibility);
      }

      init() {
        if (!Common.renderer) return;
        (this.props.$wrapper as HTMLElement).prepend(
          Common.renderer.domElement,
        );
        this.output = new Output(this.props.texture as THREE.Texture);

        this.autoDriver = new AutoDriver(Mouse, this, {
          enabled: autoDemo,
          speed: autoSpeed,
          resumeDelay: autoResumeDelay,
          rampDuration: 0.6,
        });

        if (this.autoDriver && this.autoDriver.enabled) {
          for (let i = 0; i < 3; i++) {
            this.autoDriver.update();
            Mouse.update();
            this.output.update();
          }
        }

        this.start();
      }

      resize() {
        Common.resize();
        this.output.resize();
      }

      render() {
        if (this.autoDriver) this.autoDriver.update();
        Mouse.update();
        Common.update();
        this.output.update();
        this.output.render();
      }

      loop() {
        if (!this.running) return;
        this.render();
        rafRef.current = requestAnimationFrame(this._loop);
      }

      start() {
        if (this.running) return;
        this.running = true;
        this._loop();
      }

      pause() {
        this.running = false;
        if (rafRef.current != null) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      }

      dispose() {
        try {
          window.removeEventListener("resize", this._resize);
          if (this._onVisibility) {
            document.removeEventListener(
              "visibilitychange",
              this._onVisibility,
            );
          }
          Mouse.dispose();
          if (Common.renderer) {
            const canvas = Common.renderer.domElement;
            if (canvas && canvas.parentNode)
              canvas.parentNode.removeChild(canvas);
            Common.renderer.dispose();
          }
          this.output.mesh.geometry.dispose();
          (this.output.mesh.material as THREE.Material).dispose();
        } catch {
        }
      }
    }

    container.style.position = container.style.position || "relative";
    container.style.overflow = container.style.overflow || "hidden";

    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";

    const loadTexture = (url: string) =>
      new Promise<THREE.Texture>((resolve, reject) => {
        loader.load(
          url,
          (tex) => {
            tex.wrapS = THREE.ClampToEdgeWrapping;
            tex.wrapT = THREE.ClampToEdgeWrapping;
            tex.minFilter = THREE.LinearFilter;
            tex.magFilter = THREE.LinearFilter;
            resolve(tex);
          },
          undefined,
          (err) => reject(err),
        );
      });

    (async () => {
      try {
        const texture = await loadTexture(image);

        if (disposed) {
          texture.dispose();
          return;
        }

        imageTexRef.current = texture;

        const webgl = new WebGLManager({
          $wrapper: container,
          texture,
        });
        webgl.start();
        webglRef.current = webgl;

        const io = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            const isVisible =
              entry.isIntersecting && entry.intersectionRatio > 0;
            isVisibleRef.current = isVisible;
            if (!webglRef.current) return;
            if (isVisible && !document.hidden) {
              webglRef.current.start();
            } else {
              webglRef.current.pause();
            }
          },
          { threshold: [0, 0.01, 0.1] },
        );
        io.observe(container);
        intersectionObserverRef.current = io;

        const ro = new ResizeObserver(() => {
          if (!webglRef.current) return;
          if (resizeRafRef.current) cancelAnimationFrame(resizeRafRef.current);
          resizeRafRef.current = requestAnimationFrame(() => {
            if (!webglRef.current) return;
            webglRef.current.resize();
          });
        });
        ro.observe(container);
        resizeObserverRef.current = ro;
      } catch {
      }
    })();

    return () => {
      disposed = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (resizeObserverRef.current) {
        try {
          resizeObserverRef.current.disconnect();
        } catch {
          /* noop */
        }
      }
      if (intersectionObserverRef.current) {
        try {
          intersectionObserverRef.current.disconnect();
        } catch {
          /* noop */
        }
      }
      if (webglRef.current) {
        webglRef.current.dispose();
      }
      webglRef.current = null;

      if (imageTexRef.current) {
        imageTexRef.current.dispose();
        imageTexRef.current = null;
      }
    };
  }, [
    image,
    pixelSize,
    cursorRadius,
    falloff,
    mode,
    smoothing,
    autoDemo,
    autoSpeed,
    autoResumeDelay,
  ]);

  return (
    <div
      ref={mountRef}
      className={cn("relative w-full h-full overflow-hidden", className)}
      style={style}
    />
  );
};

export default PixelateHover;
