import { connect, gotoAuthed } from "/tmp/rookhub-audit/cdp.mjs";
const { ws, send } = await connect();
await send("Log.enable").catch(()=>{});
await gotoAuthed(send, "http://localhost:4173/app/mapa", 1440, 900);
const { result } = await send("Runtime.evaluate", { returnByValue: true, expression: `(() => {
  const c = document.createElement('canvas');
  const gl = c.getContext('webgl2') || c.getContext('webgl');
  const canvas = document.querySelector('.maplibregl-canvas');
  return JSON.stringify({
    webgl: !!gl,
    renderer: gl ? gl.getParameter(gl.getExtension('WEBGL_debug_renderer_info')?.UNMASKED_RENDERER_WEBGL ?? gl.RENDERER) : null,
    mapCanvas: canvas ? { w: canvas.width, h: canvas.height } : null,
    tilesLoaded: document.querySelectorAll('.maplibregl-canvas').length,
  });
})()` });
console.log(result.value); ws.close();
