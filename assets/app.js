/* Calendario de adviento Feminario — motor compartido (portada y días). */
(function () {
  var CFG = window.CAL_CFG || {};
  var KEY = "feminario_calendario_v1";
  var PREVIEW = /[?&]preview=1/.test(location.search);
  var S = cargar();

  /* ───────── estado ───────── */
  function cargar() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v) return s; } catch (e) {}
    return { nombre: "", correo: "", autorizo: false, v: {}, listo: {} };
  }
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function setV(k, val) { S.v[k] = val; guardar(); }
  function getV(k) { return S.v[k]; }

  /* ───────── utilidades ───────── */
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  function num(k) { var x = S.v[k]; if (x === undefined || x === "" || x === null) return 0; if (typeof x === "number") return isFinite(x) ? x : 0; var n = parseFloat(String(x).replace(/\./g, "").replace(",", ".")); return isFinite(n) ? n : 0; }
  function cop(n) { return "$ " + Math.round(n).toLocaleString("es-CO"); }
  function fechaDia(n) { var i = CFG.INICIO || [2026, 12, 1]; return new Date(i[0], i[1] - 1, i[2] + n - 1); }
  function abierto(n) { if (PREVIEW) return true; var h = new Date(); h.setHours(0, 0, 0, 0); return h >= fechaDia(n); }
  function fechaTxt(n) { return fechaDia(n).toLocaleDateString("es-CO", { day: "numeric", month: "long" }); }
  function hechos() { return Object.keys(S.listo).filter(function (k) { return S.listo[k]; }).length; }
  function confeti(o) { try { window.lanzarConfeti && window.lanzarConfeti(o); } catch (e) {} }
  function urlDe(clave) {
    var m = CFG.MAPA_URL || "";
    var map = { mapa_antes: m + "?origen=calendario", mapa_despues: m + "?momento=despues&origen=calendario", calc110: CFG.CALC110_URL, portafolio: "https://feminario.github.io/construye-tu-portafolio/" };
    return map[clave] || clave;
  }
  function pre() { return PREVIEW ? "?preview=1" : ""; }

  /* ───────── envío a la hoja ───────── */
  function enviar(payload) {
    if (!CFG.API_URL) return;
    payload.correo = S.correo; payload.nombre = S.nombre;
    try { fetch(CFG.API_URL, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) }); } catch (e) {}
  }
  function datosDelDia(n) {
    var o = {}; Object.keys(S.v).forEach(function (k) { if (k.indexOf("d" + n + "_") === 0 || k === "d" + n) o[k] = S.v[k]; });
    return o;
  }

  /* ───────── identidad ───────── */
  function pedirIdentidad(destino, despues) {
    if (S.nombre && S.correo && S.autorizo) { despues(); return; }
    destino.innerHTML =
      '<div class="card"><h2>Antes de empezar</h2><p>Guardamos tu progreso con tu nombre y tu correo para que puedas volver cuando quieras.</p>' +
      '<label for="id-nombre">Tu nombre</label><input type="text" id="id-nombre" autocomplete="given-name" value="' + esc(S.nombre) + '">' +
      '<label for="id-correo">Tu correo</label><input type="text" inputmode="email" id="id-correo" autocomplete="email" value="' + esc(S.correo) + '">' +
      '<label class="check"><input type="checkbox" id="id-ok"> Autorizo a Feminario a tratar mis datos (nombre, correo y respuestas) para acompañarme en el calendario y medir el impacto de forma agregada.</label>' +
      '<div class="error" id="id-err"></div><button class="btn" id="id-go">Empezar mi calendario</button></div>';
    destino.querySelector("#id-go").onclick = function () {
      var n = destino.querySelector("#id-nombre").value.trim(), c = destino.querySelector("#id-correo").value.trim().toLowerCase(), ok = destino.querySelector("#id-ok").checked;
      var err = destino.querySelector("#id-err");
      if (!n) { err.textContent = "Escribe tu nombre."; return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c)) { err.textContent = "Revisa tu correo."; return; }
      if (!ok) { err.textContent = "Necesitamos tu autorización para guardar tu progreso."; return; }
      S.nombre = n; S.correo = c; S.autorizo = true; guardar();
      enviar({ tipo: "registro" }); despues();
    };
  }

  /* ───────── calculadoras ───────── */
  var R = 0.08 / 12;
  function vf(aporte, anios) { var n = anios * 12; return aporte * ((Math.pow(1 + R, n) - 1) / R); }
  var CALCS = {
    meta_frase: function () {
      var m = num("d5_monto"), a = getV("d5_anios");
      if (!m || !a) return null;
      var p = getV("d5_porque");
      return { html: '<div class="res-label">Mi meta</div><div class="res-frase">Quiero <strong>' + cop(m) + '</strong> en <strong>' + esc(a) + ' ' + (String(a) === "1" ? "año" : "años") + '</strong>' + (p ? ", porque " + esc(p) : "") + ".</div>" };
    },
    libertad: function () {
      var t = 0; ["vivienda", "mercado", "transporte", "salud", "servicios", "ocio", "viajes", "otros"].forEach(function (k) { t += num("d6_" + k); });
      setV("d6_total", t || "");
      if (!t) return null;
      return { html: '<div class="res-label">Tu número de la libertad</div><div class="res-num">' + cop(t) + '</div><div class="res-desc">al mes · al año son ' + cop(t * 12) + "</div>" };
    },
    hora: function () {
      var s = num("d7_salario"), h = num("d7_horas") || 176;
      if (!s) { setV("d7_hora", ""); return null; }
      setV("d7_hora", s / h);
      return { html: '<div class="res-label">Tu hora de vida vale</div><div class="res-num">' + cop(s / h) + '</div><div class="res-desc">por hora trabajada (' + h + " horas al mes)</div>" };
    },
    balance: function () {
      var a = num("d8_liquido") + num("d8_inversion") + num("d8_bienes"), d = num("d8_deudas");
      setV("d8_neto", a || d ? a - d : "");
      if (!a && !d) return null;
      return { html: '<div class="res-label">Tu patrimonio hoy</div><div class="res-num">' + cop(a - d) + '</div><div class="res-desc">Tienes ' + cop(a) + " · debes " + cop(d) + "</div>" };
    },
    colchon: function () {
      var g = num("d9_gastos"), m = num("d9_meses"), h = num("d9_hoy");
      if (!g || !m) return null;
      var meta = g * m, cub = h / g, pct = Math.min(100, Math.round(h / meta * 100));
      setV("d9_meta", meta); setV("d9_cubre", cub);
      return { html: '<div class="res-label">Tu colchón ideal</div><div class="res-num">' + cop(meta) + '</div><div class="res-desc">' + m + " meses de tus gastos</div>" +
        '<div class="barra"><div style="width:' + pct + '%"></div></div><div class="res-desc">Hoy cubres <strong>' + (Math.round(cub * 10) / 10) + ' meses</strong> (' + pct + " % de tu meta)." + (meta > h ? " Te faltan " + cop(meta - h) + "." : " ¡Ya lo lograste!") + "</div>" };
    },
    hueco: function () {
      var M = num("d11_monto"), a = num("d11_anios"), h = num("d11_hoy"), ing = num("d11_ingreso");
      if (!M || !a) return null;
      var n = a * 12, falta = M - h * Math.pow(1 + R, n), pmt = falta > 0 ? falta * R / (Math.pow(1 + R, n) - 1) : 0, simple = Math.max(0, (M - h) / n);
      setV("d11_pmt", pmt);
      var peso = ing && pmt ? "<br>Eso es el <strong>" + Math.round(pmt / ing * 100) + " %</strong> de tu ingreso mensual." : "";
      return { html: '<div class="res-label">Para llegar a tu meta, ahorrando e invirtiendo</div><div class="res-num">' + cop(pmt) + '</div><div class="res-desc">al mes (con 8 % anual de supuesto)' + peso + "<br>Solo guardando, sin rendimiento, serían " + cop(simple) + " al mes.</div>" };
    },
    aporte: function () {
      var a = num("d12_aporte"); if (!a) return null;
      var p = num("d11_pmt"), txt = p ? (a >= p ? "Con esto <strong>cubres tu meta</strong> 🎉" : "Tu meta pedía " + cop(p) + ": es un buen comienzo y puedes subirlo con el tiempo.") : "";
      return { html: '<div class="res-label">En 12 meses habrás apartado</div><div class="res-num">' + cop(a * 12) + '</div><div class="res-desc">' + txt + "</div>" };
    },
    compuesto: function () {
      var a = num("d13_aporte"); if (!a) return null;
      var f = function (y) { return "<tr><td>" + y + " años</td><td>" + cop(a * 12 * y) + "</td><td><strong>" + cop(vf(a, y)) + "</strong></td></tr>"; };
      return { html: '<div class="res-label">Tu aporte de ' + cop(a) + ' al mes</div><table class="tabla"><tr><th></th><th>Solo guardando</th><th>Invirtiendo al 8 %</th></tr>' + f(5) + f(10) + f(20) + '</table><div class="res-desc">Supuesto educativo, no una promesa de rentabilidad. La diferencia es el interés compuesto trabajando para ti.</div>' };
    }
  };

  /* ───────── bloques ───────── */
  function recalcular(raiz) {
    raiz.querySelectorAll("[data-calc]").forEach(function (el) {
      var f = CALCS[el.getAttribute("data-calc")]; var r = f ? f() : null;
      el.innerHTML = r ? r.html : '<span class="res-vacio">Llena los datos y tu resultado aparece aquí.</span>';
    });
  }
  function campoNum(c) {
    var v = getV(c.id);
    if ((v === undefined || v === "") && c.pre) { var p = getV(c.pre); if (p !== undefined && p !== "") { v = p; setV(c.id, v); } }
    var vis = v === undefined || v === "" ? "" : (c.moneda ? Number(v).toLocaleString("es-CO") : v);
    return '<label for="' + c.id + '">' + c.label + '</label><input type="text" inputmode="' + (c.moneda ? "numeric" : "decimal") + '" id="' + c.id + '" data-id="' + c.id + '" data-moneda="' + (c.moneda ? 1 : 0) + '" placeholder="' + esc(c.ph || "") + '" value="' + esc(vis) + '">';
  }
  function render(b) {
    if (b.t === "p") return '<p class="lead">' + b.html + "</p>";
    if (b.t === "nota") return '<div class="nota">' + b.html + "</div>";
    if (b.t === "reflex") return '<label for="' + b.id + '">' + b.label + '</label><textarea id="' + b.id + '" data-id="' + b.id + '" placeholder="' + esc(b.ph || "") + '">' + esc(getV(b.id) || "") + "</textarea>";
    if (b.t === "chips") {
      var cur = getV(b.id), sel = b.multi ? (Array.isArray(cur) ? cur : []) : [cur];
      return '<label>' + b.label + (b.multi ? ' <span class="suave">(puedes marcar varias)</span>' : "") + '</label><div class="chips" data-chips="' + b.id + '" data-multi="' + (b.multi ? 1 : 0) + '">' +
        b.opts.map(function (o) { return '<button type="button" class="chip' + (sel.indexOf(o) > -1 ? " on" : "") + '" data-val="' + esc(o) + '">' + esc(o) + "</button>"; }).join("") + "</div>";
    }
    if (b.t === "nums") return '<div class="bloque-nums"><h3>' + b.titulo + "</h3>" + b.campos.map(campoNum).join("") + '<div class="resultado" data-calc="' + b.calc + '"></div></div>';
    if (b.t === "filas") {
      var h = "<h3>" + b.titulo + "</h3>"; for (var i = 1; i <= b.n; i++) {
        h += '<div class="fila"><input type="text" data-id="' + b.id + "_n" + i + '" placeholder="' + esc(b.ph) + '" value="' + esc(getV(b.id + "_n" + i) || "") + '"><input type="text" inputmode="numeric" data-moneda="1" data-id="' + b.id + "_v" + i + '" placeholder="$" value="' + esc(getV(b.id + "_v" + i) ? Number(getV(b.id + "_v" + i)).toLocaleString("es-CO") : "") + '"><div class="fila-res" data-fila="' + b.id + "|" + i + '"></div></div>';
      } return h;
    }
    if (b.t === "link") return '<div class="enlace"><a class="btn" target="_blank" rel="noopener" href="' + esc(urlDe(b.url)) + '">' + b.texto + "</a>" + (b.nota ? '<p class="suave">' + b.nota + "</p>" : "") + "</div>";
    if (b.t === "custom") return '<div data-custom="' + b.k + '"></div>';
    return "";
  }
  function filasRes(raiz) {
    var hr = num("d7_hora");
    raiz.querySelectorAll("[data-fila]").forEach(function (el) {
      var p = el.getAttribute("data-fila").split("|"), v = num(p[0] + "_v" + p[1]);
      el.textContent = v && hr ? "= " + (Math.round(v / hr * 10) / 10) + " horas de tu vida" : (v ? "Calcula primero tu hora ↑" : "");
    });
  }
  function enlazar(raiz) {
    raiz.querySelectorAll("[data-id]").forEach(function (el) {
      el.addEventListener("input", function () {
        var id = el.getAttribute("data-id"), val = el.value;
        if (el.getAttribute("data-moneda") === "1") { var d = val.replace(/\D/g, ""); setV(id, d); el.value = d ? Number(d).toLocaleString("es-CO") : ""; }
        else setV(id, val);
        recalcular(raiz); filasRes(raiz);
      });
    });
    raiz.querySelectorAll("[data-chips]").forEach(function (box) {
      box.addEventListener("click", function (e) {
        var b = e.target.closest(".chip"); if (!b) return;
        var id = box.getAttribute("data-chips"), multi = box.getAttribute("data-multi") === "1", val = b.getAttribute("data-val");
        if (multi) { var a = Array.isArray(getV(id)) ? getV(id).slice() : []; var i = a.indexOf(val); if (i > -1) a.splice(i, 1); else a.push(val); setV(id, a); b.classList.toggle("on"); }
        else { setV(id, val); box.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("on", c === b); }); }
        recalcular(raiz);
      });
    });
    recalcular(raiz); filasRes(raiz);
  }

  /* ───────── bloques especiales ───────── */
  function reelHTML(d) {
    var m = String(d.reel || "").match(/instagram\.com\/(?:reel|p|tv)\/([\w-]+)/);
    if (m) return '<div class="reel"><iframe src="https://www.instagram.com/reel/' + m[1] + '/embed" loading="lazy" allowtransparency="true" allowfullscreen scrolling="no"></iframe><a class="suave" target="_blank" rel="noopener" href="https://www.instagram.com/reel/' + m[1] + '/">Verlo en Instagram</a></div>';
    return '<div class="reel vacio"><div class="reel-ico">▶</div><p><strong>El video del día</strong><br><span class="suave">Pronto lo vas a ver aquí. Mientras tanto, pasa por nuestro Instagram.</span></p><a class="btn secundario chico" target="_blank" rel="noopener" href="' + esc(CFG.INSTAGRAM) + '">@feminario.co</a></div>';
  }
  function urlCalendario() { var u = location.href.replace(/dia\.html.*$/, "").replace(/\?.*$/, ""); return u.slice(-1) === "/" ? u : u; }
  function tarjeta(texto) {
    var c = document.createElement("canvas"); c.width = 1080; c.height = 1350; var x = c.getContext("2d");
    var g = x.createLinearGradient(0, 0, 1080, 1350); g.addColorStop(0, "#C2CBFF"); g.addColorStop(1, "#F9E1FF"); x.fillStyle = g; x.fillRect(0, 0, 1080, 1350);
    x.fillStyle = "#4C4F68"; x.textAlign = "center"; x.font = "700 40px Montserrat, sans-serif"; x.fillText("CALENDARIO FEMINARIO", 540, 150);
    x.font = "600 54px Montserrat, sans-serif"; var lineas = [], pal = texto.split(" "), l = "";
    pal.forEach(function (w) { var t = l ? l + " " + w : w; if (x.measureText(t).width > 880) { lineas.push(l); l = w; } else l = t; }); lineas.push(l);
    var y = 640 - lineas.length * 40; lineas.forEach(function (ln) { x.fillText(ln, 540, y); y += 78; });
    x.font = "500 36px Montserrat, sans-serif"; x.fillStyle = "#7E84AE"; x.fillText("Hablar de plata nos hace libres", 540, 1130);
    x.font = "700 40px Montserrat, sans-serif"; x.fillStyle = "#4C4F68"; x.fillText("@feminario.co", 540, 1230);
    return c;
  }
  var CUSTOM = {
    compartir: function (el) {
      var frase = getV("d10_frase") || "";
      el.innerHTML =
        '<div class="card sub"><h3>1 · Una conversación real</h3><p>Escoge a alguien de confianza (tu mamá, una amiga, tu pareja, tu hermana) y háblale de plata durante 10 minutos. Tres preguntas para empezar:</p>' +
        '<ol class="lista"><li>¿Qué te enseñaron a ti sobre el dinero?</li><li>¿Cuál es tu meta financiera que sigue pendiente?</li><li>¿Cómo podríamos ayudarnos con eso?</li></ol>' +
        '<label for="d10_descubri">¿Qué descubriste en esa conversación?</label><textarea id="d10_descubri" data-id="d10_descubri" placeholder="Lo que dijo, lo que sentiste, lo que no sabías de ella…">' + esc(getV("d10_descubri") || "") + "</textarea></div>" +
        '<div class="card sub"><h3>2 · El muro de la comunidad</h3><p>Completa la frase. Si quieres, aparece <strong>sin tu nombre</strong> en el muro, para que otras mujeres se vean en ti. Revisamos cada frase antes de publicarla.</p>' +
        '<label for="d10_frase">Lo que nadie me dijo del dinero era…</label><textarea id="d10_frase" data-id="d10_frase" placeholder="…que podía ser mío, que no era egoísta querer más, que no hay que saber para empezar…">' + esc(frase) + "</textarea>" +
        '<label class="check"><input type="checkbox" id="muro-ok"> Autorizo que mi frase se publique de forma anónima en el muro.</label><button class="btn secundario" id="muro-go" type="button">Enviar mi frase al muro</button><div class="aviso" id="muro-aviso"></div>' +
        '<div id="muro-lista" class="muro"></div></div>' +
        '<div class="card sub"><h3>3 · Tu tarjeta para historias</h3><p>Descarga tu tarjeta y compártela en tus historias. Sin cifras: solo la frase.</p><button class="btn secundario" id="tar-go" type="button">Crear mi tarjeta</button><div id="tar-out"></div></div>' +
        '<div class="card sub"><h3>Invita a una amiga</h3><p>El calendario es mejor acompañada. Mándale el enlace:</p><a class="btn" target="_blank" rel="noopener" id="inv" href="#">Invitar por WhatsApp</a></div>';
      enlazar(el);
      var u = urlCalendario();
      el.querySelector("#inv").href = "https://wa.me/?text=" + encodeURIComponent("Estoy haciendo el calendario de adviento de Feminario: 15 días para ordenar tus metas y tu plata, a tu ritmo. Haz el tuyo conmigo 💜 " + u);
      el.querySelector("#muro-go").onclick = function () {
        var f = (getV("d10_frase") || "").trim(), av = el.querySelector("#muro-aviso");
        if (f.length < 8) { av.textContent = "Escribe tu frase (mínimo unas palabras)."; return; }
        if (!el.querySelector("#muro-ok").checked) { av.textContent = "Marca la autorización para enviarla."; return; }
        enviar({ tipo: "muro", frase: f }); setV("d10_enviada", "1");
        av.textContent = "Gracias 💜 La revisamos y, si todo está bien, aparece en el muro.";
      };
      el.querySelector("#tar-go").onclick = function () {
        var base = getV("d2_primera") ? "Quiero ser la primera mujer de mi familia en " + String(getV("d2_primera")).toLowerCase() : (frase ? "Lo que nadie me dijo del dinero era " + frase : "Hoy hablé de dinero. Y se siente distinto.");
        var cv = tarjeta(base), out = el.querySelector("#tar-out"); out.innerHTML = ""; cv.className = "tarjeta"; out.appendChild(cv);
        var a = document.createElement("a"); a.className = "btn"; a.textContent = "Descargar tarjeta"; a.href = cv.toDataURL("image/png"); a.download = "mi-tarjeta-feminario.png"; out.appendChild(a);
      };
      if (CFG.API_URL) { fetch(CFG.API_URL + "?accion=muro").then(function (r) { return r.json(); }).then(function (d) {
        var L = el.querySelector("#muro-lista"); if (!d || !d.frases || !d.frases.length) return;
        L.innerHTML = "<h3>Lo que dicen otras mujeres</h3>" + d.frases.slice(-12).reverse().map(function (f) { return '<div class="post">«' + esc(f) + "»</div>"; }).join("");
      }).catch(function () {}); }
    },
    comparar_mapa: function (el) {
      var a = getV("d4_guion"), b = getV("d14_guion");
      el.innerHTML = a || b ? '<div class="resultado"><div class="res-label">Tu guion</div><div class="res-desc">Día 4: <strong>' + esc(a || "—") + "</strong> → Día 14: <strong>" + esc(b || "—") + "</strong>" + (a && b && a === b ? "<br>Sigue siendo tu guion principal, y ya sabes reconocerlo: eso es lo que cambia." : "") + "</div></div>" : "";
    },
    plan: function (el) {
      var n = S.nombre || "";
      function fila(t, v) { return '<div class="plan-fila"><span>' + t + "</span><strong>" + (v || "—") + "</strong></div>"; }
      var meta = num("d5_monto") ? cop(num("d5_monto")) + " en " + esc(getV("d5_anios") || "?") + " años" : "";
      el.innerHTML =
        '<div class="card plan" id="plan"><div class="res-label">Plan Feminario de</div><h2>' + esc(n || "tu nombre") + '</h2>' +
        '<h3>Mi meta</h3>' + fila("La meta que quiero cumplir", esc(getV("d1_meta") || "")) + fila("Con número y fecha", meta) + fila("Mi porqué", esc(getV("d5_porque") || "")) +
        '<h3>Mi punto de partida</h3>' + fila("Mi número de la libertad (mes)", num("d6_total") ? cop(num("d6_total")) : "") + fila("Mi hora de vida", num("d7_hora") ? cop(num("d7_hora")) : "") + fila("Mi patrimonio hoy", getV("d8_neto") !== undefined && getV("d8_neto") !== "" ? cop(num("d8_neto")) : "") + fila("Meses de colchón que cubro", getV("d9_cubre") ? (Math.round(num("d9_cubre") * 10) / 10) + " meses" : "") +
        '<h3>Mi camino</h3>' + fila("Lo que necesito ahorrar al mes", num("d11_pmt") ? cop(num("d11_pmt")) : "") + fila("Mi aporte mensual", num("d12_aporte") ? cop(num("d12_aporte")) : "") + fila("Cuándo lo aparto", esc(getV("d12_cuando") || "")) + fila("Mi guion de dinero", esc((getV("d4_guion") || "—") + (getV("d14_guion") ? " → " + getV("d14_guion") : ""))) +
        '<label for="d15_comp">Mi compromiso para este mes</label><textarea id="d15_comp" data-id="d15_comp" placeholder="Una sola cosa concreta que voy a hacer.">' + esc(getV("d15_comp") || "") + '</textarea></div>' +
        '<button class="btn secundario" type="button" id="plan-pdf">Descargar mi PDF con todo el calendario</button>' +
        '<div class="card cta"><div class="res-label">El siguiente paso</div><h2>Tienes el diagnóstico. El Club 365 es donde lo ejecutas.</h2><p>Ya sabes tu meta, tu punto de partida y tu camino. En el Club 365 lo recorres acompañada: cursos, sesiones en vivo con Andrea y Tina y una comunidad de mujeres que invierten juntas.</p><a class="btn cta-btn" target="_blank" rel="noopener" href="' + esc(CFG.CLUB_URL) + '">Quiero entrar al Club 365</a></div>';
      enlazar(el);
      el.querySelector("#plan-pdf").onclick = function () { location.href = "resumen.html" + pre(); };
    }
  };

  /* ───────── página de un día ───────── */
  function pagDia() {
    var n = parseInt((location.search.match(/[?&]d=(\d+)/) || [])[1], 10), D = window.DIAS, d = D && D[n - 1];
    var raiz = document.getElementById("app");
    if (!d) { raiz.innerHTML = '<div class="card"><h2>No encontramos ese día</h2><a class="btn" href="index.html' + pre() + '">Volver al calendario</a></div>'; return; }
    document.title = "Día " + n + " · " + d.titulo + " — Calendario Feminario";
    if (!abierto(n)) { raiz.innerHTML = '<div class="card"><div class="puerta-cerrada">🔒</div><h2>Esta puerta se abre el ' + fechaTxt(n) + "</h2><p>Mientras tanto, puedes volver a los días anteriores.</p><a class=\"btn\" href=\"index.html" + pre() + '">Volver al calendario</a></div>'; return; }
    pedirIdentidad(raiz, function () {
      var acto = window.ACTOS[d.acto - 1];
      var h = '<div class="dia-top"><a href="index.html' + pre() + '" class="volver">← Calendario</a><img class="dia-logo" src="assets/logo-feminario.png" alt="Feminario"><span class="prog">' + hechos() + "/15</span></div>" +
        '<div class="dia-head" style="--c:' + acto.color + '"><div class="pill">Acto ' + acto.id + " · " + acto.nombre + '</div><div class="dia-n">Día ' + n + " · " + fechaTxt(n) + '</div><h1>' + d.emoji + " " + esc(d.titulo) + "</h1><p>" + esc(d.gancho) + "</p></div>" +
        reelHTML(d) + '<div class="card" id="cuerpo">' + d.bloques.map(render).join("") + "</div>" +
        '<button class="btn" id="fin" type="button">' + (S.listo[n] ? "✓ Día completado · actualizar" : "Completar el día " + n) + '</button><div class="celebra" id="celebra"></div>' +
        '<div class="nav-dias">' + (n > 1 ? '<a href="dia.html?d=' + (n - 1) + (PREVIEW ? "&preview=1" : "") + '">← Día ' + (n - 1) + "</a>" : "<span></span>") + (n < 15 ? '<a href="dia.html?d=' + (n + 1) + (PREVIEW ? "&preview=1" : "") + '">Día ' + (n + 1) + " →</a>" : "<span></span>") + "</div>";
      raiz.innerHTML = h;
      var cuerpo = raiz.querySelector("#cuerpo"); enlazar(cuerpo);
      cuerpo.querySelectorAll("[data-custom]").forEach(function (c) { var f = CUSTOM[c.getAttribute("data-custom")]; if (f) f(c); });
      raiz.querySelector("#fin").onclick = function () {
        S.listo[n] = true; guardar(); enviar({ tipo: "dia", dia: n, datos: datosDelDia(n) });
        confeti({ n: n === 15 ? 260 : 110 });
        raiz.querySelector("#fin").textContent = "✓ Día completado · actualizar";
        var msgs = ["Eso fue un primer paso real.", "Hablar de plata ya es romper un patrón.", "Entender por qué no pasó libera.", "Tu mapa ya es tuyo.", "Tu meta ya tiene dirección.", "Ya sabes cuánto cuesta tu vida.", "Tu tiempo tiene precio y ahora lo ves.", "Tu línea de salida está clara.", "Tu colchón es tu libertad.", "Ya no lo cargas sola.", "El hueco ya tiene tamaño.", "Un gesto de cuidado cada mes.", "El tiempo trabaja contigo.", "Ya te reconoces distinto.", "Lo lograste: tienes un plan escrito."];
        raiz.querySelector("#celebra").innerHTML = '<div class="card ok"><h3>¡Lo hiciste' + (S.nombre ? ", " + esc(S.nombre) : "") + "! 🎉</h3><p>" + msgs[n - 1] + "</p>" + (n < 15 ? '<a class="btn secundario" href="dia.html?d=' + (n + 1) + (PREVIEW ? "&preview=1" : "") + '">Ir al día ' + (n + 1) + "</a>" : "") + "</div>";
      };
    });
  }

  /* ───────── portada ───────── */
  function pagPortada() {
    var raiz = document.getElementById("app");
    pedirIdentidad(raiz.querySelector("#identidad"), function () {
      raiz.querySelector("#identidad").innerHTML = '<div class="card hola"><h2>Hola, ' + esc(S.nombre) + " 💜</h2><p>Llevas <strong>" + hechos() + " de 15</strong> días. Cada puerta se abre en su fecha y se queda abierta: hazlas a tu ritmo.</p><div class=\"barra\"><div style=\"width:" + Math.round(hechos() / 15 * 100) + '%"></div></div>' + (hechos() ? '<a class="btn secundario" href="resumen.html' + pre() + '">Descargar mi PDF con todo</a>' : "") + "</div>";
    });
    var cont = raiz.querySelector("#puertas");
    var PASO = 118, BANNER = 92, TOP = 20;
    // posiciones: cada día es una parada del camino; los banners de acto van antes del día 1, 6 y 11
    var items = [], y = TOP;
    window.DIAS.forEach(function (d, i) {
      var primero = i === 0 || window.DIAS[i - 1].acto !== d.acto;
      if (primero) { items.push({ banner: window.ACTOS[d.acto - 1], y: y }); y += BANNER; }
      items.push({ d: d, y: y + 34 }); y += PASO;
    });
    var alto = y + 90;
    var proximo = 0; window.DIAS.forEach(function (d) { if (abierto(d.n) && !S.listo[d.n] && !proximo) proximo = d.n; });
    var h = '<div class="camino" style="height:' + alto + 'px"><svg class="camino-svg" aria-hidden="true"><defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7E84AE"/><stop offset=".5" stop-color="#CEA2DD"/><stop offset="1" stop-color="#F59356"/></linearGradient></defs><path id="ruta-base" class="ruta-base"/><path id="ruta-avance" class="ruta-avance"/></svg>';
    items.forEach(function (it, k) {
      if (it.banner) { var a = it.banner; h += '<div class="acto-banner" style="top:' + it.y + 'px;--c:' + a.color + ';--k:' + k + '"><span>Acto ' + a.id + "</span><strong>" + a.nombre + "</strong><em>" + a.sub + "</em></div>"; return; }
      var d = it.d, ab = abierto(d.n), ok = !!S.listo[d.n], actual = d.n === proximo;
      var cls = "paso" + (ab ? " abierto" : " cerrado") + (ok ? " hecho" : "") + (actual ? " actual" : "");
      var tag = ab ? "a" : "div", href = ab ? ' href="dia.html?d=' + d.n + (PREVIEW ? "&preview=1" : "") + '"' : "";
      h += "<" + tag + href + ' class="' + cls + '" data-n="' + d.n + '" style="top:' + it.y + "px;--c:" + window.ACTOS[d.acto - 1].color + ";--k:" + k + '">' +
        '<span class="nodo">' + (ok ? "✓" : (ab ? d.emoji : "🔒")) + '<i class="n">' + d.n + "</i></span>" +
        '<span class="rotulo"><b>' + esc(d.titulo) + "</b><small>" + (ab ? (ok ? "Completado" : (actual ? "Te toca hoy" : "Abierta")) : "Se abre el " + fechaTxt(d.n)) + "</small></span>" +
        (actual ? '<em class="aqui">¡Aquí estás!</em>' : "") + "</" + tag + ">";
    });
    h += '<div class="meta-final" style="top:' + (y + 6) + 'px"><span>🌟</span><b>Tu Plan Feminario</b><small>Todo tu camino en una hoja</small></div></div>';
    cont.innerHTML = h;
    // la ruta se dibuja por el centro de cada parada, alternando izquierda y derecha
    function trazar() {
      var cam = cont.querySelector(".camino"), svg = cont.querySelector(".camino-svg"); if (!cam) return;
      var W = cam.clientWidth, pts = [];
      cont.querySelectorAll(".paso").forEach(function (el, i) {
        var n = +el.getAttribute("data-n"), top = parseFloat(el.style.top);
        var x = W * (0.5 + 0.27 * Math.sin(i * 1.15 + 0.4));
        el.style.left = (x - 34) + "px"; el.classList.toggle("a-izq", x > W / 2);
        var rot = el.querySelector(".rotulo"); if (rot) rot.style.maxWidth = Math.max(110, (x > W / 2 ? x - 34 - 12 : W - x - 34 - 12) - 10) + "px";
        pts.push({ n: n, x: x, y: top + 34 });
      });
      svg.setAttribute("width", W); svg.setAttribute("height", alto); svg.setAttribute("viewBox", "0 0 " + W + " " + alto);
      function curva(ps) { if (!ps.length) return ""; var d = "M" + ps[0].x + " " + (ps[0].y - 70); d += " L" + ps[0].x + " " + ps[0].y; for (var i = 1; i < ps.length; i++) { var a = ps[i - 1], b = ps[i], my = (a.y + b.y) / 2; d += " C" + a.x + " " + my + " " + b.x + " " + my + " " + b.x + " " + b.y; } return d; }
      var ult = pts.length ? pts[pts.length - 1] : null;
      var base = cont.querySelector("#ruta-base"); base.setAttribute("d", curva(pts) + (ult ? " L" + ult.x + " " + (ult.y + 70) : ""));
      var hasta = 0; pts.forEach(function (p, i) { if (S.listo[p.n] || p.n === proximo) hasta = i + 1; });
      cont.querySelector("#ruta-avance").setAttribute("d", curva(pts.slice(0, hasta)));
      [base, cont.querySelector("#ruta-avance")].forEach(function (pa) { var L = pa.getTotalLength ? pa.getTotalLength() : 0; if (pa.id === "ruta-avance") { pa.style.strokeDasharray = L; pa.style.strokeDashoffset = L; pa.getBoundingClientRect(); pa.style.setProperty("--L", L); } });
      cam.classList.add("lista");
    }
    trazar(); var rz; window.addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(trazar, 120); });
    var aqui = cont.querySelector(".paso.actual");
    if (aqui && aqui.scrollIntoView && !PREVIEW) setTimeout(function () { aqui.scrollIntoView({ behavior: "smooth", block: "center" }); }, 900);
  }


  /* ───────── PDF con todo lo que ha hecho ───────── */
  function seccionDia(d) {
    var partes = [];
    d.bloques.forEach(function (b) {
      if (b.t === "reflex") { var v = getV(b.id); if (v && String(v).trim()) partes.push('<div class="r-item"><div class="r-q">' + esc(b.label) + '</div><div class="r-a">' + esc(v).replace(/\n/g, "<br>") + "</div></div>"); }
      else if (b.t === "chips") { var c = getV(b.id), t = Array.isArray(c) ? c.join(" · ") : (c || ""); if (t) partes.push('<div class="r-item"><div class="r-q">' + esc(b.label.replace(/\(puedes.*$/, "")) + '</div><div class="r-a">' + esc(t) + "</div></div>"); }
      else if (b.t === "nums") {
        var filas = b.campos.map(function (c) { var v = getV(c.id); if (v === undefined || v === "" || v === null) return ""; return '<div class="plan-fila"><span>' + c.label + "</span><strong>" + (c.moneda ? cop(num(c.id)) : esc(v)) + "</strong></div>"; }).join("");
        var r = CALCS[b.calc] ? CALCS[b.calc]() : null;
        if (filas || r) partes.push('<div class="r-item"><div class="r-q">' + esc(b.titulo) + "</div>" + filas + (r ? '<div class="resultado">' + r.html + "</div>" : "") + "</div>");
      }
      else if (b.t === "filas") {
        var fs = ""; for (var i = 1; i <= b.n; i++) { var nm = getV(b.id + "_n" + i), vv = num(b.id + "_v" + i), hr = num("d7_hora"); if (nm || vv) fs += '<div class="plan-fila"><span>' + esc(nm || "Gasto") + "</span><strong>" + cop(vv) + (hr && vv ? " · " + (Math.round(vv / hr * 10) / 10) + " h de vida" : "") + "</strong></div>"; }
        if (fs) partes.push('<div class="r-item"><div class="r-q">' + esc(b.titulo) + "</div>" + fs + "</div>");
      }
      else if (b.t === "custom" && b.k === "compartir") {
        var cc = []; if (getV("d10_descubri")) cc.push('<div class="r-item"><div class="r-q">Lo que descubrí en mi conversación</div><div class="r-a">' + esc(getV("d10_descubri")) + "</div></div>");
        if (getV("d10_frase")) cc.push('<div class="r-item"><div class="r-q">Lo que nadie me dijo del dinero era…</div><div class="r-a">' + esc(getV("d10_frase")) + "</div></div>");
        partes = partes.concat(cc);
      }
    });
    if (!partes.length) return "";
    return '<section class="r-dia"><div class="r-dia-h"><span>Día ' + d.n + "</span> " + d.emoji + " " + esc(d.titulo) + "</div>" + partes.join("") + "</section>";
  }
  function pagResumen() {
    var raiz = document.getElementById("app");
    pedirIdentidad(raiz, function () {
      var cuerpo = window.DIAS.map(seccionDia).join("");
      var plan = document.createElement("div"); CUSTOM.plan(plan);
      var pl = plan.querySelector("#plan"); if (pl) { var ta = pl.querySelector("textarea"); if (ta) { var d = document.createElement("div"); d.className = "r-a"; d.textContent = ta.value; ta.parentNode.replaceChild(d, ta); } }
      raiz.innerHTML =
        '<div class="dia-top"><a href="index.html' + pre() + '" class="volver">← Calendario</a><span class="prog">' + hechos() + "/15</span></div>" +
        '<div class="card"><h2>Mi calendario en PDF</h2><p>Aquí está todo lo que has hecho, día por día. Se genera con lo que llevas hasta hoy: puedes volver a descargarlo cuando avances más.</p><button class="btn" id="pdf-go" type="button">Descargar mi PDF</button><div class="aviso" id="pdf-av"></div></div>' +
        '<div id="pdf-doc" class="pdf-doc"><div class="pdf-portada"><img src="assets/logo-feminario.png" alt="Feminario"><div class="res-label">Calendario de adviento · Mi recorrido</div><h1>' + esc(S.nombre) + '</h1><p class="suave">' + hechos() + " de 15 días completados · " + new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" }) + "</p></div>" +
        (pl ? pl.outerHTML : "") + (cuerpo || '<p class="suave">Todavía no hay respuestas guardadas. Completa tu primer día y vuelve.</p>') +
        '<p class="pdf-pie">Hecho con cariño por Feminario · @feminario.co · Contenido educativo, no asesoría financiera personalizada.</p></div>';
      var av = raiz.querySelector("#pdf-av");
      raiz.querySelector("#pdf-go").onclick = function () {
        var btn = this, doc = raiz.querySelector("#pdf-doc"), arch = "mi-calendario-feminario.pdf";
        function imprimir() { av.textContent = "En el cuadro que se abre, elige «Guardar como PDF»."; window.print(); }
        if (window.html2pdf) {
          btn.disabled = true; btn.textContent = "Preparando tu PDF…";
          window.html2pdf().set({ margin: [10, 8, 12, 8], filename: arch, image: { type: "jpeg", quality: 0.96 }, html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" }, jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, pagebreak: { mode: ["css", "avoid-all"], avoid: [".r-item", ".plan-fila", ".resultado"] } }).from(doc).save()
            .then(function () { btn.disabled = false; btn.textContent = "Descargar mi PDF"; av.textContent = "¡Listo! Revisa tus descargas 💜"; confeti({ n: 80, dur: 2000 }); })
            .catch(function () { btn.disabled = false; btn.textContent = "Descargar mi PDF"; imprimir(); });
        } else imprimir();
      };
    });
  }

  window.CAL = { portada: pagPortada, dia: pagDia, resumen: pagResumen };
})();
