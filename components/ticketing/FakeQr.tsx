import s from "./Flow.module.css";

const N = 21;

function seedOf(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
/** mulberry32: bộ sinh số giả ngẫu nhiên xác định. */
function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Ô thuộc mắt định vị 7×7 (0/1) hoặc -1 nếu không nằm trong mắt nào. */
function finder(r: number, c: number): number {
  for (const [a, b] of [[0, 0], [0, 14], [14, 0]]) {
    if (r >= a && r < a + 7 && c >= b && c < b + 7) {
      const x = r - a, y = c - b;
      return x === 0 || x === 6 || y === 0 || y === 6 || (x > 1 && x < 5 && y > 1 && y < 5) ? 1 : 0;
    }
  }
  return -1;
}

/** QR GIẢ (minh hoạ, không quét được). 21×21, 3 mắt định vị, phần còn lại sinh từ `value`. Nền trắng tuyệt đối. */
export function FakeQr({ value }: { value: string }) {
  const rand = rng(seedOf(value));
  let d = "";
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const f = finder(r, c);
      const rv = rand(); // luôn gọi để dãy ngẫu nhiên không phụ thuộc vị trí mắt định vị
      const on = f >= 0 ? f === 1 : rv < 0.45;
      if (on) d += `M${c} ${r}h1v1h-1z`;
    }
  }
  return (
    <figure className={s.qr}>
      <svg className={s.qrSvg} viewBox={`-1 -1 ${N + 2} ${N + 2}`} role="img" aria-label="Mã QR vé (minh hoạ)" shapeRendering="crispEdges">
        <rect x={-1} y={-1} width={N + 2} height={N + 2} style={{ fill: "var(--white)" }} />
        <path d={d} fill="currentColor" />
      </svg>
      <figcaption className={s.qrCap}>QR minh hoạ</figcaption>
    </figure>
  );
}
