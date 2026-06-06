import React, { useEffect, useRef } from 'react';

// CustomCursor: renders a full-screen, pointer-events:none canvas and
// mounts a WebGL fluid/smoke simulation adapted from smokyCursor.html.
const CustomCursor = ({ mousePosition, darkMode }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    // Keep a simple mouse position tracker (for other parts of the app)
    const handleMouseMove = (e) => {
      if (mousePosition) {
        mousePosition.x = e.clientX;
        mousePosition.y = e.clientY;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const canvas = canvasRef.current;
    if (!canvas) return () => window.removeEventListener('mousemove', handleMouseMove);

    // make canvas fill the viewport
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '1';

    // --- Begin adapted fluid simulation (trimmed and adapted) ---
    let gl, ext;
    let pointers = [{ id: -1, texcoordX: 0, texcoordY: 0, prevTexcoordX: 0, prevTexcoordY: 0, deltaX: 0, deltaY: 0, down: false, moved: false, color: { r: 0, g: 0, b: 0 } }];
    let dye, velocity, divergence, curlFBO, pressureFBO;
    let lastUpdateTime = Date.now();

    let copyProgram, clearProgram, splatProgram, advectionProgram;
    let divergenceProgram, curlProgram, vorticityProgram, pressureProgram;
    let gradienSubtractProgram, displayMaterial;

    const config = {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1024,
      DENSITY_DISSIPATION: 3.5,
      VELOCITY_DISSIPATION: 2,
      PRESSURE: 0.1,
      PRESSURE_ITERATIONS: 20,
      CURL: 3,
      SPLAT_RADIUS: 0.2,
      SPLAT_FORCE: 6000,
      SHADING: true,
      COLOR_UPDATE_SPEED: 10
    };

    // small helpers
    function scaleByPixelRatio(input) {
      const pixelRatio = window.devicePixelRatio || 1;
      return Math.floor(input * pixelRatio);
    }

    // Use this when calculating pointer movement so very small mouse moves
    // are preserved (don't floor to integer pixels).
    function scaleFloatByPixelRatio(input) {
      const pixelRatio = window.devicePixelRatio || 1;
      return input * pixelRatio;
    }

    function hashCode(s) {
      if (!s || !s.length) return 0;
      let hash = 0;
      for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0;
      }
      return hash;
    }

    function addKeywords(source, keywords) {
      if (!keywords) return source;
      let keywordsString = '';
      for (const keyword of keywords) keywordsString += `#define ${keyword}\n`;
      return keywordsString + source;
    }

    function compileShader(type, source, keywords = null) {
      const shaderSource = addKeywords(source, keywords);
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, shaderSource);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(shader));
      return shader;
    }

    function createProgram(vertexShader, fragmentShader) {
      if (!vertexShader || !fragmentShader) return null;
      const program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) console.error(gl.getProgramInfoLog(program));
      return program;
    }

    function getUniforms(program) {
      const uniforms = {};
      const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const info = gl.getActiveUniform(program, i);
        if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
      }
      return uniforms;
    }

    class Program {
      constructor(vs, fs) {
        this.program = createProgram(vs, fs);
        this.uniforms = this.program ? getUniforms(this.program) : {};
      }
      bind() { if (this.program) gl.useProgram(this.program); }
    }

    class Material {
      constructor(vs, fsSource) { this.vertexShader = vs; this.fragmentShaderSource = fsSource; this.programs = {}; this.activeProgram = null; this.uniforms = {}; }
      setKeywords(keywords) {
        let hash = 0; for (const kw of keywords) hash += hashCode(kw);
        let program = this.programs[hash];
        if (program == null) {
          const fragmentShader = compileShader(gl.FRAGMENT_SHADER, this.fragmentShaderSource, keywords);
          program = createProgram(this.vertexShader, fragmentShader);
          this.programs[hash] = program;
        }
        if (program === this.activeProgram) return;
        if (program) this.uniforms = getUniforms(program);
        this.activeProgram = program;
      }
      bind() { if (this.activeProgram) gl.useProgram(this.activeProgram); }
    }

    function initializeWebGL() {
      // use existing canvas element
      try {
        gl = canvas.getContext('webgl2', { alpha: true, depth: false, stencil: false, antialias: false }) || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      } catch (e) { gl = null; }
      if (!gl) throw new Error('WebGL not supported');

      const isWebGL2 = 'drawBuffers' in gl;
      let supportLinearFiltering = false;
      let halfFloat = null;
      if (isWebGL2) {
        gl.getExtension('EXT_color_buffer_float');
        supportLinearFiltering = !!gl.getExtension('OES_texture_float_linear');
      } else {
        halfFloat = gl.getExtension('OES_texture_half_float');
        supportLinearFiltering = !!gl.getExtension('OES_texture_half_float_linear');
      }

      const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : (halfFloat && halfFloat.HALF_FLOAT_OES) || 0;

      function supportRenderTextureFormat(internalFormat, format, type) {
        const texture = gl.createTexture(); if (!texture) return false;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);
        const fbo = gl.createFramebuffer(); if (!fbo) return false;
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        return status === gl.FRAMEBUFFER_COMPLETE;
      }

      function getSupportedFormat(internalFormat, format, type) {
        if (!supportRenderTextureFormat(internalFormat, format, type)) {
          if ('drawBuffers' in gl) {
            switch (internalFormat) {
              case gl.R16F: return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
              case gl.RG16F: return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
              default: return null;
            }
          }
          return null;
        }
        return { internalFormat, format };
      }

      let formatRGBA, formatRG, formatR;
      if (isWebGL2) {
        formatRGBA = getSupportedFormat(gl.RGBA16F, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl.RG16F, gl.RG, halfFloatTexType);
        formatR = getSupportedFormat(gl.R16F, gl.RED, halfFloatTexType);
      } else {
        formatRGBA = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
        formatRG = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
        formatR = getSupportedFormat(gl.RGBA, gl.RGBA, halfFloatTexType);
      }

      ext = { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering };
      if (!ext.supportLinearFiltering) config.DYE_RESOLUTION = 256, config.SHADING = false;
    }

    // The shaders and many helper functions are taken from the original file.
    // For brevity here we only include the essential ones to create a pleasing smoke effect.
    function initializeShaders() {
      const baseVertexShader = compileShader(gl.VERTEX_SHADER, `
        precision highp float;
        attribute vec2 aPosition;
        varying vec2 vUv;
        varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB;
        uniform vec2 texelSize;
        void main () {
          vUv = aPosition * 0.5 + 0.5;
          vL = vUv - vec2(texelSize.x, 0.0);
          vR = vUv + vec2(texelSize.x, 0.0);
          vT = vUv + vec2(0.0, texelSize.y);
          vB = vUv - vec2(0.0, texelSize.y);
          gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `);

      const copyShader = compileShader(gl.FRAGMENT_SHADER, `precision mediump float; varying vec2 vUv; uniform sampler2D uTexture; void main(){ gl_FragColor = texture2D(uTexture, vUv); }`);

      const displayShader = `precision highp float; varying vec2 vUv; uniform sampler2D uTexture; void main(){ vec3 c = texture2D(uTexture, vUv).rgb; float a = max(c.r, max(c.g, c.b)); gl_FragColor = vec4(c, a); }`;

      const splatShader = compileShader(gl.FRAGMENT_SHADER, `precision highp float; varying vec2 vUv; uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius; void main(){ vec2 p = vUv - point.xy; p.x *= aspectRatio; vec3 splat = exp(-dot(p,p)/radius)*color; vec3 base = texture2D(uTarget, vUv).xyz; gl_FragColor = vec4(base + splat, 1.0); }`);

      const advectionShader = compileShader(gl.FRAGMENT_SHADER, `precision highp float; varying vec2 vUv; uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform vec2 dyeTexelSize; uniform float dt; uniform float dissipation; void main(){ vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize; vec4 result = texture2D(uSource, coord); float decay = 1.0 + dissipation * dt; gl_FragColor = result / decay; }`);

      const divergenceShader = compileShader(gl.FRAGMENT_SHADER, `precision mediump float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity; void main(){ float L = texture2D(uVelocity, vL).x; float R = texture2D(uVelocity, vR).x; float T = texture2D(uVelocity, vT).y; float B = texture2D(uVelocity, vB).y; float div = 0.5 * (R - L + T - B); gl_FragColor = vec4(div,0.0,0.0,1.0); }`);

      const curlShader = compileShader(gl.FRAGMENT_SHADER, `precision mediump float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity; void main(){ float L = texture2D(uVelocity, vL).y; float R = texture2D(uVelocity, vR).y; float T = texture2D(uVelocity, vT).x; float B = texture2D(uVelocity, vB).x; float vorticity = R - L - T + B; gl_FragColor = vec4(0.5 * vorticity,0.0,0.0,1.0); }`);

      const vorticityShader = compileShader(gl.FRAGMENT_SHADER, `precision highp float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt; void main(){ float L = texture2D(uCurl, vL).x; float R = texture2D(uCurl, vR).x; float T = texture2D(uCurl, vT).x; float B = texture2D(uCurl, vB).x; float C = texture2D(uCurl, vUv).x; vec2 force = 0.5 * vec2(abs(T)-abs(B), abs(R)-abs(L)); force /= length(force)+0.0001; force *= curl * C; force.y *= -1.0; vec2 velocity = texture2D(uVelocity, vUv).xy; velocity += force * dt; velocity = min(max(velocity, -1000.0), 1000.0); gl_FragColor = vec4(velocity,0.0,1.0); }`);

      const pressureShader = compileShader(gl.FRAGMENT_SHADER, `precision mediump float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uPressure; uniform sampler2D uDivergence; void main(){ float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x; float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x; float divergence = texture2D(uDivergence, vUv).x; float pressure = (L+R+B+T - divergence) * 0.25; gl_FragColor = vec4(pressure,0.0,0.0,1.0); }`);

      const gradientSubtractShader = compileShader(gl.FRAGMENT_SHADER, `precision mediump float; varying vec2 vUv; varying vec2 vL; varying vec2 vR; varying vec2 vT; varying vec2 vB; uniform sampler2D uPressure; uniform sampler2D uVelocity; void main(){ float L = texture2D(uPressure, vL).x; float R = texture2D(uPressure, vR).x; float T = texture2D(uPressure, vT).x; float B = texture2D(uPressure, vB).x; vec2 velocity = texture2D(uVelocity, vUv).xy; velocity.xy -= vec2(R-L, T-B); gl_FragColor = vec4(velocity,0.0,1.0); }`);

      copyProgram = new Program(baseVertexShader, copyShader);
      clearProgram = new Program(baseVertexShader, copyShader);
      splatProgram = new Program(baseVertexShader, splatShader);
      advectionProgram = new Program(baseVertexShader, advectionShader);
      divergenceProgram = new Program(baseVertexShader, divergenceShader);
      curlProgram = new Program(baseVertexShader, curlShader);
      vorticityProgram = new Program(baseVertexShader, vorticityShader);
      pressureProgram = new Program(baseVertexShader, pressureShader);
      gradienSubtractProgram = new Program(baseVertexShader, gradientSubtractShader);
      displayMaterial = new Material(baseVertexShader, displayShader);
    }

    let blit;
    function initializeBlit() {
      const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,-1,1,1,1,1,-1]), gl.STATIC_DRAW);
      const elemBuffer = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elemBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0,1,2,0,2,3]), gl.STATIC_DRAW);
      gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0); gl.enableVertexAttribArray(0);
      blit = (target, doClear=false) => {
        if (!target) { gl.viewport(0,0,gl.drawingBufferWidth, gl.drawingBufferHeight); gl.bindFramebuffer(gl.FRAMEBUFFER, null); }
        else { gl.viewport(0,0,target.width, target.height); gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); }
        if (doClear) { gl.clearColor(0,0,0,1); gl.clear(gl.COLOR_BUFFER_BIT); }
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      };
    }

    function createFBO(w,h,internalFormat,format,type,param) {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);
      const fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0,0,w,h); gl.clear(gl.COLOR_BUFFER_BIT);
      return { texture, fbo, width: w, height: h, texelSizeX: 1/w, texelSizeY: 1/h, attach(id){ gl.activeTexture(gl.TEXTURE0+id); gl.bindTexture(gl.TEXTURE_2D, texture); return id; } };
    }

    function createDoubleFBO(w,h,internalFormat,format,type,param) { const f1 = createFBO(w,h,internalFormat,format,type,param); const f2 = createFBO(w,h,internalFormat,format,type,param); return { width: w, height: h, texelSizeX: f1.texelSizeX, texelSizeY: f1.texelSizeY, read: f1, write: f2, swap(){ const tmp=this.read; this.read=this.write; this.write=tmp; } } }

    function getResolution(resolution) {
      const w = gl.drawingBufferWidth; const h = gl.drawingBufferHeight; const aspectRatio = w/h; let aspect = aspectRatio < 1 ? 1/aspectRatio : aspectRatio; const min = Math.round(resolution); const max = Math.round(resolution * aspect); if (w > h) return { width: max, height: min }; return { width: min, height: max };
    }

    function initFramebuffers() {
      const simRes = getResolution(config.SIM_RESOLUTION); const dyeRes = getResolution(config.DYE_RESOLUTION);
      const texType = ext.halfFloatTexType; const rgba = ext.formatRGBA; const rg = ext.formatRG; const r = ext.formatR; const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;
      gl.disable(gl.BLEND);
      dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
      velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
      divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
      curlFBO = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
      pressureFBO = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    }

    function updateKeywords() { const displayKeywords = []; if (config.SHADING) displayKeywords.push('SHADING'); displayMaterial.setKeywords(displayKeywords); }

    function HSVtoRGB(h,s,v){ let r=0,g=0,b=0; const i=Math.floor(h*6); const f=h*6-i; const p=v*(1-s); const q=v*(1-f*s); const t=v*(1-(1-f)*s); switch(i%6){case 0:r=v;g=t;b=p;break;case 1:r=q;g=v;b=p;break;case 2:r=p;g=v;b=t;break;case 3:r=p;g=q;b=v;break;case 4:r=t;g=p;b=v;break;case 5:r=v;g=p;b=q;break;}return {r,g,b}; }
    function generateColor(){ const c = HSVtoRGB(Math.random(),1.0,1.0); c.r*=0.15; c.g*=0.15; c.b*=0.15; return c }

    function correctRadius(radius){ const aspectRatio = canvas.width / canvas.height; if (aspectRatio>1) radius *= aspectRatio; return radius }

    // Blanking many unchanged functions from original for brevity: we'll include the core update loop and splat/use handlers
    function splat(x,y,dx,dy,color){ splatProgram.bind(); if (splatProgram.uniforms.uTarget) gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0)); if (splatProgram.uniforms.aspectRatio) gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height); if (splatProgram.uniforms.point) gl.uniform2f(splatProgram.uniforms.point, x, y); if (splatProgram.uniforms.color) gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0); if (splatProgram.uniforms.radius) gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS/100)); blit(velocity.write); velocity.swap(); if (splatProgram.uniforms.uTarget) gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0)); if (splatProgram.uniforms.color) gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b); blit(dye.write); dye.swap(); }

    function applyInputs(){ for(const p of pointers){ if(p.moved){ p.moved=false; splat(p.texcoordX, p.texcoordY, p.deltaX*config.SPLAT_FORCE, p.deltaY*config.SPLAT_FORCE, p.color); } } }

    function step(dt){ gl.disable(gl.BLEND);
      // Curl
      curlProgram.bind(); if (curlProgram.uniforms.texelSize) gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY); if (curlProgram.uniforms.uVelocity) gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0)); blit(curlFBO);
      // Vorticity
      vorticityProgram.bind(); if (vorticityProgram.uniforms.texelSize) gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY); if (vorticityProgram.uniforms.uVelocity) gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0)); if (vorticityProgram.uniforms.uCurl) gl.uniform1i(vorticityProgram.uniforms.uCurl, curlFBO.attach(1)); if (vorticityProgram.uniforms.curl) gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL); if (vorticityProgram.uniforms.dt) gl.uniform1f(vorticityProgram.uniforms.dt, dt); blit(velocity.write); velocity.swap();
      // Divergence
      divergenceProgram.bind(); if (divergenceProgram.uniforms.texelSize) gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY); if (divergenceProgram.uniforms.uVelocity) gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0)); blit(divergence);
      // Clear pressure
      clearProgram.bind(); if (clearProgram.uniforms.uTexture) gl.uniform1i(clearProgram.uniforms.uTexture, pressureFBO.read.attach(0)); if (clearProgram.uniforms.value) gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE); blit(pressureFBO.write); pressureFBO.swap();
      // Pressure
      pressureProgram.bind(); if (pressureProgram.uniforms.texelSize) gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY); if (pressureProgram.uniforms.uDivergence) gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0)); for (let i=0;i<config.PRESSURE_ITERATIONS;i++){ if (pressureProgram.uniforms.uPressure) gl.uniform1i(pressureProgram.uniforms.uPressure, pressureFBO.read.attach(1)); blit(pressureFBO.write); pressureFBO.swap(); }
      // Gradient Subtract
      gradienSubtractProgram.bind(); if (gradienSubtractProgram.uniforms.texelSize) gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY); if (gradienSubtractProgram.uniforms.uPressure) gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressureFBO.read.attach(0)); if (gradienSubtractProgram.uniforms.uVelocity) gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1)); blit(velocity.write); velocity.swap();
      // Advection velocity
      advectionProgram.bind(); if (advectionProgram.uniforms.texelSize) gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY); const velocityId = velocity.read.attach(0); if (advectionProgram.uniforms.uVelocity) gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId); if (advectionProgram.uniforms.uSource) gl.uniform1i(advectionProgram.uniforms.uSource, velocityId); if (advectionProgram.uniforms.dt) gl.uniform1f(advectionProgram.uniforms.dt, dt); if (advectionProgram.uniforms.dissipation) gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION); blit(velocity.write); velocity.swap();
      // Advection dye
      if (advectionProgram.uniforms.uVelocity) gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0)); if (advectionProgram.uniforms.uSource) gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1)); if (advectionProgram.uniforms.dissipation) gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION); blit(dye.write); dye.swap();
    }

    function drawDisplay(target){ const width = target ? target.width : gl.drawingBufferWidth; const height = target ? target.height : gl.drawingBufferHeight; displayMaterial.bind(); if (config.SHADING && displayMaterial.uniforms.texelSize) gl.uniform2f(displayMaterial.uniforms.texelSize, 1/width, 1/height); if (displayMaterial.uniforms.uTexture) gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0)); blit(target,false); }

  // give the pointer an initial color so first movement can splat
  pointers[0].color = generateColor();

  let rafId = null; let running = true;
    function updateFrame(){ const now = Date.now(); let dt = (now - lastUpdateTime)/1000; dt = Math.min(dt, 0.016666); lastUpdateTime = now; if (resizeCanvas()) initFramebuffers(); applyInputs(); step(dt); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.BLEND); drawDisplay(null); if (running) rafId = requestAnimationFrame(updateFrame); }

    function resizeCanvas(){ const width = scaleByPixelRatio(canvas.clientWidth); const height = scaleByPixelRatio(canvas.clientHeight); if (canvas.width !== width || canvas.height !== height){ canvas.width = width; canvas.height = height; return true;} return false }

    function updatePointerDownData(pointer, id, posX, posY){ pointer.id = id; pointer.down = true; pointer.moved = false; pointer.texcoordX = posX / canvas.width; pointer.texcoordY = 1 - posY / canvas.height; pointer.prevTexcoordX = pointer.texcoordX; pointer.prevTexcoordY = pointer.texcoordY; pointer.deltaX = 0; pointer.deltaY = 0; pointer.color = generateColor(); }

    function updatePointerMoveData(pointer, posX, posY, color){ pointer.prevTexcoordX = pointer.texcoordX; pointer.prevTexcoordY = pointer.texcoordY; pointer.texcoordX = posX / canvas.width; pointer.texcoordY = 1 - posY / canvas.height; pointer.deltaX = pointer.texcoordX - pointer.prevTexcoordX; pointer.deltaY = pointer.texcoordY - pointer.prevTexcoordY; pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0; pointer.color = color; }

    // Event handlers for interaction (we will remove on cleanup)
    const onMouseDown = (e) => {
      const p = pointers[0]; const posX = scaleFloatByPixelRatio(e.clientX); const posY = scaleFloatByPixelRatio(e.clientY); updatePointerDownData(p, -1, posX, posY); // click splat
      const color = generateColor(); color.r *= 10; color.g *= 10; color.b *= 10; const dx = 10*(Math.random()-0.5); const dy = 30*(Math.random()-0.5); splat(p.texcoordX, p.texcoordY, dx, dy, color);
    };

    const onMouseMoveCanvas = (e) => {
      const p = pointers[0]; const posX = scaleFloatByPixelRatio(e.clientX); const posY = scaleFloatByPixelRatio(e.clientY); const color = p.color; updatePointerMoveData(p, posX, posY, color);
    };

    // Initialize everything
    try {
      // ensure the canvas has an initial pixel size so pointer texcoords
      // computed on early mousemove events are valid (not dividing by 0)
      const pixelRatio = window.devicePixelRatio || 1;
      const targetWidth = canvas.clientWidth || window.innerWidth || 1;
      const targetHeight = canvas.clientHeight || window.innerHeight || 1;
      canvas.width = Math.max(1, Math.floor(targetWidth * pixelRatio));
      canvas.height = Math.max(1, Math.floor(targetHeight * pixelRatio));

      initializeWebGL();
      initializeShaders();
      initializeBlit();
      updateKeywords();
      initFramebuffers();
      // attach listeners
      window.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mousemove', onMouseMoveCanvas);
      // start loop
      rafId = requestAnimationFrame(updateFrame);
    } catch (error) {
      console.error('Failed to initialize fluid simulation:', error);
    }

    // cleanup when component unmounts
    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMoveCanvas);
    };
    // --- End adapted fluid simulation ---
  }, [mousePosition]);

  // Render a single full-screen canvas used by the fluid sim.
  return (
    <canvas ref={canvasRef} id="fluid-canvas" aria-hidden="true" />
  );
};

export default CustomCursor;