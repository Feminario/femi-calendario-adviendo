/* Calendario de adviento Feminario — motor compartido (portada y días). */
(function () {
  var CFG = window.CAL_CFG || {};
  var KEY = "feminario_adviento_2026_v1";
  var PREVIEW = /[?&]preview=1/.test(location.search) || !!CFG.PREVIEW;
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
  function fechaDia(n) { var i = CFG.INICIO || [2026, 11, 30]; return new Date(i[0], i[1] - 1, i[2] + n - 1); }
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
  // Privacidad: nada se envía a ningún servidor; todo queda en este dispositivo.
  function enviar() {}
  function datosDelDia(n) {
    var o = {}; Object.keys(S.v).forEach(function (k) { if (k.indexOf("d" + n + "_") === 0 || k === "d" + n) o[k] = S.v[k]; });
    return o;
  }

  /* ───────── identidad ───────── */
  function pedirIdentidad(destino, despues) {
    if (S.nombre) { despues(); return; }
    destino.innerHTML =
      '<div class="card"><h2>Antes de empezar</h2><p>Lo que escribas se queda <strong>solo en este dispositivo</strong>.</p>' +
      '<label for="id-nombre">¿Cómo te llamas?</label><input type="text" id="id-nombre" autocomplete="given-name" value="' + esc(S.nombre) + '">' +
      '<div class="error" id="id-err"></div><button class="btn" id="id-go">Empezar mi calendario</button></div>';
    destino.querySelector("#id-go").onclick = function () {
      var n = destino.querySelector("#id-nombre").value.trim(), err = destino.querySelector("#id-err");
      if (!n) { err.textContent = "Escribe tu nombre."; return; }
      S.nombre = n; S.autorizo = true; guardar(); despues();
    };
  }

  /* ───────── calculadoras ───────── */
  var R = 0.08 / 12;
  function vf(aporte, anios) { var n = anios * 12; return aporte * ((Math.pow(1 + R, n) - 1) / R); }
  var CALCS = {
    ahorro_meses: function () {
      var a = num("d1_ahorros"), g = num("d1_ingresos"); if (!a && !g) return null;
      var txt = g && a ? "Tu ahorro equivale a <strong>" + (Math.round(a / g * 10) / 10) + " meses</strong> de tus ingresos." : "Llena los dos datos para ver cuántos meses de ingresos tienes ahorrados.";
      return { html: '<div class="res-label">Tu punto de partida</div><div class="res-desc">' + txt + "</div>" };
    },
    deudas_gastos: function () {
      var td = 0, tc = 0; for (var i = 1; i <= 5; i++) td += num("d2_deudas_v" + i);
      var tg = 0; ["vivienda", "comida", "transporte", "otros"].forEach(function (k) { tg += num("d2_" + k); });
      var ing = num("d1_ingresos"); if (!td && !tg) return null;
      return { html: '<div class="res-label">Tu foto de hoy</div><div class="res-desc">Debes en total <strong>' + cop(td) + "</strong> y tus gastos al mes son <strong>" + cop(tg) + "</strong>." + (ing && tg ? "<br>Eso es el <strong>" + Math.round(tg / ing * 100) + " %</strong> de tu ingreso mensual." : "") + "</div>" };
    },
    aporte3: function () {
      var a = num("d3_aporte"); if (!a) return null;
      var f = function (y) { return "<tr><td>" + y + " años</td><td>" + cop(a * 12 * y) + "</td><td><strong>" + cop(vf(a, y)) + "</strong></td></tr>"; };
      return { html: '<div class="res-label">Tu aporte de ' + cop(a) + ' al mes</div><table class="tabla"><tr><th></th><th>Solo guardando</th><th>Invirtiendo al 8 %</th></tr>' + f(5) + f(10) + '</table><div class="res-desc">Supuesto educativo, no una promesa de rendimiento.</div>' };
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
        h += '<div class="fila"><input type="text" data-id="' + b.id + "_n" + i + '" placeholder="' + esc(b.ph) + '" value="' + esc(getV(b.id + "_n" + i) || "") + '"><input type="text" inputmode="numeric" data-moneda="1" data-id="' + b.id + "_v" + i + '" placeholder="$" value="' + esc(getV(b.id + "_v" + i) ? Number(getV(b.id + "_v" + i)).toLocaleString("es-CO") : "") + '">' + (b.sinhora ? "" : '<div class="fila-res" data-fila="' + b.id + "|" + i + '"></div>') + '</div>';
      } return h;
    }
    if (b.t === "link") return '<div class="enlace"><a class="btn" target="_blank" rel="noopener" href="' + esc(urlDe(b.url)) + '">' + b.texto + "</a>" + (b.nota ? '<p class="suave">' + b.nota + "</p>" : "") + "</div>";
    if (b.t === "wa") return '<div class="wa"><b>💬 Dinámica en el grupo de WhatsApp</b><textarea readonly class="wa-txt">' + esc(b.texto) + '</textarea><div class="wa-btns"><button type="button" class="btn secundario chico" data-wa-copiar>Copiar mensaje</button>' + (CFG.GRUPO_WA ? '<a class="btn chico" target="_blank" rel="noopener" href="' + esc(CFG.GRUPO_WA) + '">Abrir el grupo</a>' : '<span class="suave">Grupo: muy pronto.</span>') + "</div></div>";
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
    return '<div class="reel vacio"><div class="reel-ico">▶</div><p><strong>Video del día</strong><br><span class="suave">Muy pronto.</span></p><a class="btn secundario chico" target="_blank" rel="noopener" href="' + esc(CFG.INSTAGRAM) + '">@feminario.co</a></div>';
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
    sesion: function (el) {
      var se = CFG.SESION || {};
      el.innerHTML = '<div class="card sub"><h3>Sesión con Andre y Tina</h3><p><strong>' + esc(se.cuando || "Fecha por confirmar") + "</strong></p>" + (se.enlace ? '<a class="btn" target="_blank" rel="noopener" href="' + esc(se.enlace) + '">Entrar a la sesión</a>' : '<p class="suave">El enlace va en el grupo de WhatsApp.</p>') + "</div>";
    },
    enviar_carta: function (el) {
      el.innerHTML = '<button class="btn secundario" type="button" id="carta-wa">Enviársela por WhatsApp</button>';
      el.querySelector("#carta-wa").onclick = function () { window.open("https://wa.me/?text=" + encodeURIComponent(getV("d5_carta") || ""), "_blank"); };
    },
    plan: function (el) {
      var n = S.nombre || "";
      function fila(t, v) { return '<div class="plan-fila"><span>' + t + "</span><strong>" + (v || "—") + "</strong></div>"; }
      var td = 0; for (var i = 1; i <= 5; i++) td += num("d2_deudas_v" + i);
      var tg = 0; ["vivienda", "comida", "transporte", "otros"].forEach(function (k) { tg += num("d2_" + k); });
      var metas = ""; for (var m = 1; m <= 3; m++) if (getV("d1_metas_n" + m)) metas += esc(getV("d1_metas_n" + m)) + (num("d1_metas_v" + m) ? " · " + cop(num("d1_metas_v" + m)) : "") + "<br>";
      var activos = ""; for (var a = 1; a <= 5; a++) if (getV("d3_activos_n" + a)) activos += esc(getV("d3_activos_n" + a)) + (num("d3_activos_v" + a) ? " · " + cop(num("d3_activos_v" + a)) : "") + "<br>";
      el.innerHTML =
        '<div class="card plan" id="plan"><div class="res-label">Mi Wrapped financiero 2026</div><h2>' + esc(n || "tu nombre") + "</h2>" +
        "<h3>Mis números</h3>" + fila("Ahorrado hoy", num("d1_ahorros") ? cop(num("d1_ahorros")) : "") + fila("Ingreso mensual", num("d1_ingresos") ? cop(num("d1_ingresos")) : "") + fila("Mis metas", metas) +
        "<h3>Mis deudas y gastos</h3>" + fila("Debo en total", td ? cop(td) : "") + fila("Gastos al mes", tg ? cop(tg) : "") +
        "<h3>Mis inversiones</h3>" + fila(getV("d3_invierte") === "Todavía no he invertido" ? "Mi primer paso" : "Donde está mi plata", getV("d3_invierte") === "Todavía no he invertido" ? (num("d3_aporte") ? cop(num("d3_aporte")) + " al mes" : "") : activos) +
        '<div class="card cta"><div class="res-label">¿Quieres seguir acompañada?</div><h2>El Club 365 es donde lo ejecutas.</h2><p>Una membresía anual para ordenar tus finanzas, aprender a invertir y construir tu portafolio con otras mujeres.</p><a class="btn" target="_blank" rel="noopener" href="' + esc(CFG.CLUB_URL) + '">Conocer el Club 365</a></div></div>' +
        '<button class="btn secundario" type="button" id="plan-pdf">Descargar mi PDF con todo el calendario</button>' +
        '<button class="btn secundario" type="button" id="copia-datos">Guardar copia de mis datos</button> <button class="btn secundario" type="button" id="borrar-datos">Borrar mis datos</button>';
      enlazar(el);
      el.querySelector("#plan-pdf").onclick = function () { location.href = "resumen.html" + pre(); };
      el.querySelector("#copia-datos").onclick = function () { var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: "application/json" })); a.download = "mi-adviento-feminario.json"; a.click(); };
      el.querySelector("#borrar-datos").onclick = function () { if (confirm("¿Borrar todo lo que escribiste en este dispositivo?")) { localStorage.removeItem(KEY); location.href = "index.html" + pre(); } };
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
      var h = '<div class="dia-top"><a href="index.html' + pre() + '" class="volver">← Calendario</a><img class="dia-logo" src="assets/logo-feminario.png" alt="Feminario"><span class="prog">' + hechos() + "/" + window.DIAS.length + "</span></div>" +
        '<div class="dia-head" style="--c:' + acto.color + '"><div class="pill">Acto ' + acto.id + " · " + acto.nombre + '</div><div class="dia-n">Día ' + n + " · " + fechaTxt(n) +  '</div><img class="dia-img" src="assets/' + d.img + '" alt=""><h1>' + esc(d.titulo) + "</h1><p>" + esc(d.gancho) + "</p></div>" +
        reelHTML(d) + '<div class="card" id="cuerpo">' + d.bloques.map(render).join("") + "</div>" +
        '<button class="btn" id="fin" type="button">' + (S.listo[n] ? "✓ Día completado · actualizar" : "Completar el día " + n) + '</button><div class="celebra" id="celebra"></div>' +
        '<div class="nav-dias">' + (n > 1 ? '<a href="dia.html?d=' + (n - 1) + (PREVIEW ? "&preview=1" : "") + '">← Día ' + (n - 1) + "</a>" : "<span></span>") + (n < window.DIAS.length ? '<a href="dia.html?d=' + (n + 1) + (PREVIEW ? "&preview=1" : "") + '">Día ' + (n + 1) + " →</a>" : "<span></span>") + "</div>";
      raiz.innerHTML = h;
      var cuerpo = raiz.querySelector("#cuerpo"); enlazar(cuerpo);
      cuerpo.querySelectorAll("[data-wa-copiar]").forEach(function (bt) { bt.onclick = function () { var t = bt.parentNode.parentNode.querySelector(".wa-txt"); t.select(); try { navigator.clipboard.writeText(t.value); } catch (e) { document.execCommand("copy"); } bt.textContent = "Copiado ✓"; }; });
      cuerpo.querySelectorAll("[data-custom]").forEach(function (c) { var f = CUSTOM[c.getAttribute("data-custom")]; if (f) f(c); });
      raiz.querySelector("#fin").onclick = function () {
        S.listo[n] = true; guardar(); enviar({ tipo: "dia", dia: n, datos: datosDelDia(n) });
        confeti({ n: n === window.DIAS.length ? 260 : 110 });
        raiz.querySelector("#fin").textContent = "✓ Día completado · actualizar";
        var msgs = ["Tus metas ya tienen nombre y número.", "Ver tus deudas escritas pesa menos que imaginarlas.", "Diste tu paso con tu plata.", "Le dejaste una promesa a tu yo del futuro.", "Compartir lo aprendido lo fija. ¡Terminaste!"];
        raiz.querySelector("#celebra").innerHTML = '<div class="card ok"><h3>¡Lo hiciste' + (S.nombre ? ", " + esc(S.nombre) : "") + "! 🎉</h3><p>" + msgs[n - 1] + "</p>" + (n < window.DIAS.length ? '<a class="btn secundario" href="dia.html?d=' + (n + 1) + (PREVIEW ? "&preview=1" : "") + '">Ir al día ' + (n + 1) + "</a>" : "") + "</div>";
      };
    });
  }

  /* ───────── portada ───────── */
  function pagPortada() {
    var raiz = document.getElementById("app");
    pedirIdentidad(raiz.querySelector("#identidad"), function () {
      raiz.querySelector("#identidad").innerHTML = '<div class="card hola"><h2>Hola, ' + esc(S.nombre) + " 💜</h2><p>Llevas <strong>" + hechos() + " de " + window.DIAS.length + "</strong> días.</p><div class=\"barra\"><div style=\"width:" + Math.round(hechos() / window.DIAS.length * 100) + '%"></div></div>' + (hechos() ? '<a class="btn secundario" href="resumen.html' + pre() + '">Descargar mi PDF con todo</a>' : "") + "</div>";
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
    var alto = y + 170;
    var proximo = 0; window.DIAS.forEach(function (d) { if (abierto(d.n) && !S.listo[d.n] && !proximo) proximo = d.n; });
    var h = '<div class="camino" style="height:' + alto + 'px"><svg class="camino-svg" aria-hidden="true"><defs><linearGradient id="grad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7E84AE"/><stop offset=".5" stop-color="#CEA2DD"/><stop offset="1" stop-color="#F59356"/></linearGradient></defs><path id="ruta-base" class="ruta-base"/><path id="ruta-avance" class="ruta-avance"/></svg>';
    items.forEach(function (it, k) {
      if (it.banner) { var a = it.banner; h += '<div class="acto-banner" style="top:' + it.y + 'px;--c:' + a.color + ';--k:' + k + '"><span>Acto ' + a.id + "</span><strong>" + a.nombre + "</strong><em>" + a.sub + "</em></div>"; return; }
      var d = it.d, ab = abierto(d.n), ok = !!S.listo[d.n], actual = d.n === proximo;
      var cls = "paso" + (ab ? " abierto" : " cerrado") + (ok ? " hecho" : "") + (actual ? " actual" : "");
      var tag = ab ? "a" : "div", href = ab ? ' href="dia.html?d=' + d.n + (PREVIEW ? "&preview=1" : "") + '"' : "";
      h += "<" + tag + href + ' class="' + cls + '" data-n="' + d.n + '" style="top:' + it.y + "px;--c:" + window.ACTOS[d.acto - 1].color + ";--k:" + k + '">' +
        '<span class="nodo">' + (ok ? "✓" : '<img src="assets/' + d.img + '" alt="">' + (ab ? "" : '<u class="cand">🔒</u>')) + '<i class="n">' + d.n + "</i></span>" +
        '<span class="rotulo"><b>' + esc(d.titulo) + "</b><small>" + (ab ? (ok ? "Completado" : (actual ? "Te toca hoy" : "Abierta")) : "Se abre el " + fechaTxt(d.n)) + "</small></span>" +
        (actual ? '<em class="aqui">¡Aquí estás!</em>' : "") + "</" + tag + ">";
    });
    h += '<div class="meta-final" style="top:' + (y + 6) + 'px"><img src="assets/st-poder.png" alt=""><b>Mi Wrapped financiero</b><small>Todo tu camino en una hoja</small></div></div>';
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
    });
    if (!partes.length) return "";
    return '<section class="r-dia"><div class="r-dia-h"><span>Día ' + d.n + "</span> " + esc(d.titulo) + "</div>" + partes.join("") + "</section>";
  }
  function pagResumen() {
    var raiz = document.getElementById("app");
    pedirIdentidad(raiz, function () {
      var cuerpo = window.DIAS.map(seccionDia).join("");
      var plan = document.createElement("div"); CUSTOM.plan(plan);
      var pl = plan.querySelector("#plan"); if (pl) { var ta = pl.querySelector("textarea"); if (ta) { var d = document.createElement("div"); d.className = "r-a"; d.textContent = ta.value; ta.parentNode.replaceChild(d, ta); } }
      raiz.innerHTML =
        '<div class="dia-top"><a href="index.html' + pre() + '" class="volver">← Calendario</a><span class="prog">' + hechos() + "/" + window.DIAS.length + "</span></div>" +
        '<div class="card"><h2>Mi calendario en PDF</h2><p>Aquí está todo lo que has hecho, día por día. Se genera con lo que llevas hasta hoy: puedes volver a descargarlo cuando avances más.</p><button class="btn" id="pdf-go" type="button">Descargar mi PDF</button><div class="aviso" id="pdf-av"></div></div>' +
        '<div id="pdf-doc" class="pdf-doc"><div class="pdf-portada"><img src="assets/logo-feminario.png" alt="Feminario"><div class="res-label">Calendario de adviento · Mi recorrido</div><h1>' + esc(S.nombre) + '</h1><p class="suave">' + hechos() + " de " + window.DIAS.length + " días completados · " + new Date().toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" }) + "</p></div>" +
        (pl ? pl.outerHTML : "") + (cuerpo || '<p class="suave">Todavía no hay respuestas guardadas. Completa tu primer día y vuelve.</p>') +
        '<p class="pdf-pie">Hecho con cariño por Feminario · @feminario.co · Contenido educativo, no asesoría financiera personalizada.</p></div>';
      var av = raiz.querySelector("#pdf-av");
      raiz.querySelector("#pdf-go").onclick = function () {
        var btn = this, doc = raiz.querySelector("#pdf-doc"), arch = "mi-adviento-feminario.pdf";
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
