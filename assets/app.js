/* Calendario de adviento Feminario — motor compartido (montaña, días y Wrapped).
   Privacidad: todo lo que escribe cada mujer se guarda SOLO en su dispositivo (localStorage). No se envía a ningún servidor. */
(function () {
  var CFG = window.CAL_CFG || {};
  var KEY = "feminario_adviento_2026_v1";
  var PREVIEW = /[?&]preview=1/.test(location.search) || !!CFG.PREVIEW;
  var CIMA = /[?&]cima=1/.test(location.search);   // demo: simula que ya terminó los 5 días
  var S = cargar();

  /* ───────── estado ───────── */
  function cargar() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v) return s; } catch (e) {}
    return { nombre: "", foto: "", v: {}, listo: {} };
  }
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function setV(k, val) { S.v[k] = val; guardar(); }
  function getV(k) { return S.v[k]; }

  /* ───────── utilidades ───────── */
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  function toNum(x) { if (x === undefined || x === "" || x === null) return 0; if (typeof x === "number") return isFinite(x) ? x : 0; var n = parseFloat(String(x).replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "")); return isFinite(n) ? n : 0; }
  function num(k) { return toNum(S.v[k]); }
  function cop(n) { return "$ " + Math.round(n).toLocaleString("es-CO"); }
  function fechaDia(n) { var i = CFG.INICIO || [2026, 11, 30]; return new Date(i[0], i[1] - 1, i[2] + n - 1); }
  function abierto(n) { if (PREVIEW) return true; var h = new Date(); h.setHours(0, 0, 0, 0); return h >= fechaDia(n); }
  function fechaTxt(n) { return fechaDia(n).toLocaleDateString("es-CO", { day: "numeric", month: "long" }); }
  function total() { return window.DIAS.length; }
  function hechos() { if (CIMA) return total(); return Object.keys(S.listo).filter(function (k) { return S.listo[k]; }).length; }
  function confeti(o) { try { window.lanzarConfeti && window.lanzarConfeti(o); } catch (e) {} }
  function pre() { return PREVIEW && !CFG.PREVIEW ? "?preview=1" : ""; }
  function urlDe(clave) {
    var map = { calc110: CFG.CALC110_URL, portafolio: "https://feminario.github.io/construye-tu-portafolio/" };
    return map[clave] || clave;
  }
  var ESTRELLA = '<img class="estrella" src="assets/forma-estrella-morada.png" alt="">';
  var CANDADO = '<svg class="candado" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="3" fill="#7E84AE"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#7E84AE" stroke-width="2.4" stroke-linecap="round"/></svg>';

  /* ───────── identidad (solo el nombre) ───────── */
  function pedirIdentidad(destino, despues) {
    if (S.nombre) { despues(); return; }
    destino.innerHTML =
      '<div class="card centro"><h2>Antes de empezar</h2><p class="suave">Lo que escribas se queda solo en este dispositivo.</p>' +
      '<label for="id-nombre">¿Cómo te llamas?</label><input type="text" id="id-nombre" autocomplete="given-name" value="' + esc(S.nombre) + '">' +
      '<div class="error" id="id-err"></div><button class="btn" id="id-go">Empezar</button></div>';
    destino.querySelector("#id-go").onclick = function () {
      var n = destino.querySelector("#id-nombre").value.trim(), err = destino.querySelector("#id-err");
      if (!n) { err.textContent = "Escribe tu nombre."; return; }
      S.nombre = n; guardar(); despues();
    };
  }

  /* ───────── tablas (filas con categoría) ───────── */
  function filasDe(id) { var a = getV(id); return Array.isArray(a) && a.length ? a : [{ c: "" }]; }
  function suma(id, k) { return filasDe(id).reduce(function (t, f) { return t + toNum(f[k]); }, 0); }
  function filaTabla(b, f, i) {
    var cats = b.cats, enLista = !f.c || cats.indexOf(f.c) > -1;
    var sel = '<select data-tc aria-label="Categoría"><option value="">Categoría…</option>' + cats.map(function (c) { return '<option' + (f.c === c ? " selected" : "") + ">" + esc(c) + "</option>"; }).join("") + '<option value="__otra"' + (enLista ? "" : " selected") + ">Crear categoría…</option></select>";
    var otra = enLista ? "" : '<input type="text" data-tn placeholder="Nombre de la categoría" value="' + esc(f.c) + '">';
    var cols = b.cols.map(function (c) {
      var v = f[c.k]; if (c.moneda && v !== undefined && v !== "") v = Number(toNum(v)).toLocaleString("es-CO");
      return '<input type="text" data-tk="' + c.k + '"' + (c.moneda ? ' inputmode="numeric" data-moneda="1"' : "") + ' placeholder="' + esc(c.l) + '" aria-label="' + esc(c.l) + '" value="' + esc(v == null ? "" : v) + '">';
    }).join("");
    return '<div class="trow" data-i="' + i + '"><div class="tcat">' + sel + otra + '</div><div class="tcols c' + b.cols.length + '">' + cols + '</div><button type="button" class="x" data-del aria-label="Quitar">×</button></div>';
  }
  function pintarTabla(box, b) {
    box.innerHTML = filasDe(b.id).map(function (f, i) { return filaTabla(b, f, i); }).join("") + '<button type="button" class="btn secundario chico" data-mas>+ Agregar ' + (b.una || "categoría") + "</button>" + '<div class="resultado" data-calc="' + (b.calc || "") + '" hidden></div>';
  }
  function leerTabla(box, b) {
    var out = []; box.querySelectorAll(".trow").forEach(function (r) {
      var sel = r.querySelector("[data-tc]"), c = sel.value, o = {};
      if (c === "__otra") { var t = r.querySelector("[data-tn]"); c = t ? t.value.trim() : ""; }
      o.c = c; r.querySelectorAll("[data-tk]").forEach(function (i) { o[i.getAttribute("data-tk")] = i.getAttribute("data-moneda") === "1" ? i.value.replace(/\D/g, "") : i.value; });
      out.push(o);
    }); return out;
  }
  function enlazarTabla(box, b, raiz) {
    pintarTabla(box, b);
    function leer() { setV(b.id, leerTabla(box, b)); recalcular(raiz); }
    box.addEventListener("input", function (e) {
      var el = e.target; if (el.getAttribute("data-moneda") === "1") { var d = el.value.replace(/\D/g, ""); el.value = d ? Number(d).toLocaleString("es-CO") : ""; }
      leer();
    });
    box.addEventListener("change", function (e) {
      if (e.target.hasAttribute("data-tc")) {
        var row = e.target.closest(".trow"), v = e.target.value, cur = leerTabla(box, b); cur[+row.getAttribute("data-i")].c = v === "__otra" ? "" : v;
        setV(b.id, cur); pintarTabla(box, b);
        if (v === "__otra") { var inp = box.querySelectorAll(".trow")[+row.getAttribute("data-i")].querySelector("[data-tn]"); if (inp) { inp.focus(); } }
        recalcular(raiz);
      }
    });
    box.addEventListener("click", function (e) {
      if (e.target.hasAttribute("data-mas")) { var cur = leerTabla(box, b); cur.push({ c: "" }); setV(b.id, cur); pintarTabla(box, b); recalcular(raiz); }
      if (e.target.hasAttribute("data-del")) { var row = e.target.closest(".trow"), cur2 = leerTabla(box, b); cur2.splice(+row.getAttribute("data-i"), 1); setV(b.id, cur2.length ? cur2 : [{ c: "" }]); pintarTabla(box, b); recalcular(raiz); }
    });
  }

  /* ───────── calculadoras ───────── */
  var R = 0.08 / 12;
  function vf(aporte, anios) { var n = anios * 12; return aporte * ((Math.pow(1 + R, n) - 1) / R); }
  var CALCS = {
    ingresos: function () {
      var t = suma("d1_ing", "a"); setV("d1_total_ing", t || "");
      var ah = num("d1_ahorros");
      if (!t) return null;
      return { html: '<div class="res-label">Tus ingresos al mes</div><div class="res-num">' + cop(t) + "</div>" + (ah ? '<div class="res-desc">Tu ahorro equivale a <strong>' + (Math.round(ah / t * 10) / 10) + " meses</strong> de ingresos.</div>" : "") };
    },
    deudas: function () {
      var d = suma("d2_deudas", "a"), c = suma("d2_deudas", "b"), ing = num("d1_total_ing"); if (!d && !c) return null;
      return { html: '<div class="res-label">Tus deudas</div><div class="res-num">' + cop(d) + '</div><div class="res-desc">Pagas <strong>' + cop(c) + "</strong> al mes en cuotas" + (ing && c ? ", el <strong>" + Math.round(c / ing * 100) + " %</strong> de tus ingresos" : "") + ".</div>" };
    },
    gastos: function () {
      var g = suma("d2_gastos", "a"), ing = num("d1_total_ing"); if (!g) return null;
      return { html: '<div class="res-label">Tus gastos al mes</div><div class="res-num">' + cop(g) + "</div>" + (ing ? '<div class="res-desc">Es el <strong>' + Math.round(g / ing * 100) + " %</strong> de tus ingresos.</div>" : "") };
    },
    portafolio: function () {
      var fs = filasDe("d3_activos").filter(function (f) { return toNum(f.a) > 0; }), t = fs.reduce(function (a, f) { return a + toNum(f.a); }, 0); if (!t) return null;
      var porCat = {}; fs.forEach(function (f) { var k = f.c || "Sin categoría"; porCat[k] = (porCat[k] || 0) + toNum(f.a); });
      var ks = Object.keys(porCat).sort(function (a, b) { return porCat[b] - porCat[a]; }), top = Math.round(porCat[ks[0]] / t * 100);
      return { html: '<div class="res-label">Cómo está repartida tu plata</div>' + ks.map(function (k) { var p = Math.round(porCat[k] / t * 100); return '<div class="barra-fila"><span>' + esc(k) + "</span><b>" + p + ' %</b></div><div class="barra"><div style="width:' + p + '%"></div></div>'; }).join("") + '<div class="res-desc">' + (ks.length < 2 || top > 60 ? "Casi todo está en un solo lugar: repartirlo reduce el riesgo." : "Tienes varias categorías: buen punto de partida para diversificar.") + "</div>" };
    },
    aporte3: function () {
      var a = num("d3_aporte"); if (!a) return null;
      var f = function (y) { return "<tr><td>" + y + " años</td><td>" + cop(a * 12 * y) + "</td><td><strong>" + cop(vf(a, y)) + "</strong></td></tr>"; };
      return { html: '<div class="res-label">Tu aporte de ' + cop(a) + ' al mes</div><table class="tabla"><tr><th></th><th>Solo guardando</th><th>Invirtiendo al 8 %</th></tr>' + f(5) + f(10) + '</table><div class="res-desc">Supuesto educativo, no una promesa de rendimiento.</div>' };
    }
  };
  function recalcular(raiz) {
    raiz.querySelectorAll("[data-calc]").forEach(function (el) {
      var f = CALCS[el.getAttribute("data-calc")]; var r = f ? f() : null;
      if (r) { el.innerHTML = r.html; el.hidden = false; } else { el.innerHTML = ""; el.hidden = true; }
    });
  }

  /* ───────── bloques ───────── */
  function campoNum(c) {
    var v = getV(c.id), vis = v === undefined || v === "" ? "" : Number(toNum(v)).toLocaleString("es-CO");
    return '<label for="' + c.id + '">' + c.label + '</label><input type="text" inputmode="numeric" id="' + c.id + '" data-id="' + c.id + '" data-moneda="1" placeholder="' + esc(c.ph || "$") + '" value="' + esc(vis) + '">';
  }
  function render(b) {
    if (b.t === "reflex") return '<label for="' + b.id + '">' + b.label + '</label><textarea id="' + b.id + '" data-id="' + b.id + '" placeholder="' + esc(b.ph || "") + '">' + esc(getV(b.id) || "") + "</textarea>";
    if (b.t === "nums") return '<div class="bloque"><h3>' + b.titulo + "</h3>" + b.campos.map(campoNum).join("") + (b.calc ? '<div class="resultado" data-calc="' + b.calc + '" hidden></div>' : "") + "</div>";
    if (b.t === "tabla") return '<div class="bloque"><h3>' + b.titulo + "</h3>" + (b.sub ? '<p class="suave centro">' + b.sub + "</p>" : "") + '<div data-tabla="' + b.id + '"></div></div>';
    if (b.t === "embudo") return '<div class="bloque" data-embudo="' + b.id + '"></div>';
    if (b.t === "link") return '<div class="enlace"><a class="btn secundario" target="_blank" rel="noopener" href="' + esc(urlDe(b.url)) + '">' + b.texto + "</a></div>";
    if (b.t === "wa") return '<div class="wa"><b>Mensaje para el grupo de WhatsApp</b><textarea readonly class="wa-txt">' + esc(b.texto) + '</textarea><button type="button" class="btn secundario chico" data-wa-copiar>Copiar</button></div>';
    if (b.t === "custom") return '<div data-custom="' + b.k + '"></div>';
    return "";
  }
  function pintarEmbudo(box, b, raiz) {
    var v = getV(b.id), op = b.ops.filter(function (o) { return o.v === v; })[0];
    box.innerHTML = '<h3>' + b.titulo + '</h3><div class="ops">' + b.ops.map(function (o) { return '<button type="button" class="op' + (o.v === v ? " on" : "") + '" data-op="' + o.v + '"><img src="assets/' + o.img + '" alt=""><b>' + o.t + "</b><small>" + o.sub + "</small></button>"; }).join("") + "</div>" + (op ? '<div class="emb-cuerpo">' + op.bloques.map(render).join("") + "</div>" : "");
    enlazar(box);
    box.querySelectorAll("[data-op]").forEach(function (bt) { bt.onclick = function () { setV(b.id, bt.getAttribute("data-op")); pintarEmbudo(box, b, raiz); }; });
  }
  function bloqueDe(id, bloques) { var out = null; (function rec(bs) { bs.forEach(function (b) { if (b.id === id) out = b; if (b.t === "embudo") b.ops.forEach(function (o) { rec(o.bloques); }); }); })(bloques); return out; }
  var TODOS = function () { var xs = []; window.DIAS.forEach(function (d) { xs = xs.concat(d.bloques); }); return xs; };
  function enlazar(raiz) {
    raiz.querySelectorAll("[data-id]").forEach(function (el) {
      el.addEventListener("input", function () {
        var id = el.getAttribute("data-id"), val = el.value;
        if (el.getAttribute("data-moneda") === "1") { var d = val.replace(/\D/g, ""); setV(id, d); el.value = d ? Number(d).toLocaleString("es-CO") : ""; } else setV(id, val);
        recalcular(raiz);
      });
    });
    raiz.querySelectorAll("[data-tabla]").forEach(function (box) { if (box.__ok) return; box.__ok = 1; enlazarTabla(box, bloqueDe(box.getAttribute("data-tabla"), TODOS()), raiz); });
    raiz.querySelectorAll("[data-embudo]").forEach(function (box) { if (box.__ok) return; box.__ok = 1; pintarEmbudo(box, bloqueDe(box.getAttribute("data-embudo"), TODOS()), raiz); });
    recalcular(raiz);
  }

  /* ───────── bloques especiales ───────── */
  var CUSTOM = {
    sesion: function (el) {
      var se = CFG.SESION || {};
      el.innerHTML = '<div class="sesion"><img src="assets/fundadoras.jpg" alt="Andre y Tina"><div><b>Sesión con Andre y Tina</b><span>' + esc(se.cuando || "") + "</span>" +
        (se.enlace ? '<a class="btn" target="_blank" rel="noopener" href="' + esc(se.enlace) + '">Entrar a la sesión</a>' : '<span class="suave">El enlace de conexión aparece aquí el día de la sesión.</span>') + "</div></div>";
    },
    enviar_carta: function (el) {
      el.innerHTML = '<button class="btn secundario" type="button" id="carta-wa">Enviar mi carta por WhatsApp</button>';
      el.querySelector("#carta-wa").onclick = function () { window.open("https://wa.me/?text=" + encodeURIComponent(getV("d5_carta") || ""), "_blank"); };
    }
  };

  /* ───────── gracias final ───────── */
  function gracias() {
    return '<div class="gracias"><img src="assets/fundadoras.jpg" alt="Andre y Tina"><h2>Gracias por subir con nosotras</h2><p>Llegaste a la cima de esta primera etapa: ahora sabes dónde estás y hacia dónde vas. Cada paso que diste cuenta, y no vas sola.</p><p class="firma">Andre y Tina</p><a class="btn" href="resumen.html' + pre() + '">Ver mi Wrapped financiero</a></div>';
  }

  /* ───────── página de un día ───────── */
  function pagDia() {
    var n = parseInt((location.search.match(/[?&]d=(\d+)/) || [])[1], 10), D = window.DIAS, d = D && D[n - 1];
    var raiz = document.getElementById("app");
    if (!d) { raiz.innerHTML = '<div class="card centro"><h2>No encontramos ese día</h2><a class="btn" href="index.html' + pre() + '">Volver al camino</a></div>'; return; }
    document.title = d.titulo + " · Adviento Feminario";
    if (!abierto(n)) { raiz.innerHTML = '<div class="card centro"><div class="puerta-cerrada">' + CANDADO + '</div><h2>Esta puerta se abre el ' + fechaTxt(n) + '</h2><a class="btn" href="index.html' + pre() + '">Volver al camino</a></div>'; return; }
    pedirIdentidad(raiz, function () {
      raiz.innerHTML =
        '<div class="dia-top"><a href="index.html' + pre() + '" class="volver">← Camino</a><img class="dia-logo" src="assets/logo-feminario.png" alt="Feminario"><span class="prog">' + n + "/" + total() + "</span></div>" +
        '<div class="dia-head"><img class="dia-img" src="assets/' + d.img + '" alt=""><h1>' + esc(d.titulo) + "</h1></div>" +
        '<div class="card" id="cuerpo">' + d.bloques.map(render).join("") + "</div>" +
        '<div class="acciones"><button class="btn" id="fin" type="button">' + (S.listo[n] ? "Guardar cambios" : "Completar el día " + n) + "</button></div>";
      var cuerpo = raiz.querySelector("#cuerpo"); enlazar(cuerpo);
      cuerpo.querySelectorAll("[data-custom]").forEach(function (c) { var f = CUSTOM[c.getAttribute("data-custom")]; if (f) f(c); });
      cuerpo.querySelectorAll("[data-wa-copiar]").forEach(function (bt) { bt.onclick = function () { var t = bt.parentNode.querySelector(".wa-txt"); t.select(); try { navigator.clipboard.writeText(t.value); } catch (e) { document.execCommand("copy"); } bt.textContent = "Copiado"; }; });
      raiz.querySelector("#fin").onclick = function () {
        S.listo[n] = true; guardar(); confeti({ n: n === total() ? 260 : 110 }); window.scrollTo(0, 0);
        var msgs = ["Tus metas ya tienen nombre y número.", "Verlas escritas pesa menos que imaginarlas.", "Diste un paso con tu plata.", "Le dejaste una promesa a tu yo del futuro.", "Compartir lo aprendido lo fija."];
        raiz.innerHTML = n === total() && hechos() === total() ? gracias() :
          '<div class="card centro fin-dia">' + ESTRELLA + "<h2>¡Lo hiciste, " + esc(S.nombre) + "!</h2><p>" + msgs[n - 1] + '</p><a class="btn" href="index.html' + pre() + '">Volver al camino</a></div>';
      };
    });
  }

  /* ───────── foto de perfil ───────── */
  function subirFoto(file, cb) {
    var fr = new FileReader();
    fr.onload = function () {
      var im = new Image(); im.onload = function () {
        var c = document.createElement("canvas"), L = 240, m = Math.min(im.width, im.height), x = (im.width - m) / 2, y = (im.height - m) / 2;
        c.width = c.height = L; c.getContext("2d").drawImage(im, x, y, m, m, 0, 0, L, L); S.foto = c.toDataURL("image/jpeg", 0.85); guardar(); cb();
      }; im.src = fr.result;
    }; fr.readAsDataURL(file);
  }
  function avatar(cls) { return S.foto ? '<img class="' + cls + '" src="' + S.foto + '" alt="">' : '<span class="' + cls + ' sin">' + esc((S.nombre || "?").charAt(0).toUpperCase()) + "</span>"; }

  /* ───────── montaña ───────── */
  var PUNTOS = [[88, 548], [292, 468], [112, 372], [288, 274], [158, 186]];   // paradas de los días (viewBox 400 × 640)
  var CIMA_PT = [200, 84], SALIDA = [56, 606];
  function suave(pts) {
    var d = "M" + pts[0][0] + " " + pts[0][1];
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2, t = 0.2;
      d += " C" + (p1[0] + (p2[0] - p0[0]) * t) + " " + (p1[1] + (p2[1] - p0[1]) * t) + "," + (p2[0] - (p3[0] - p1[0]) * t) + " " + (p2[1] - (p3[1] - p1[1]) * t) + "," + p2[0] + " " + p2[1];
    }
    return d;
  }
  function pagPortada() {
    var raiz = document.getElementById("app");
    pedirIdentidad(raiz.querySelector("#identidad"), function () {
      var ok = hechos(), todo = ok >= total();
      raiz.querySelector("#identidad").innerHTML =
        '<div class="hola"><label class="foto-sub" title="Subir mi foto">' + avatar("foto") + '<input type="file" accept="image/*" id="foto-in" hidden><i>+</i></label><div><h2>Hola, ' + esc(S.nombre) + "</h2><p>Llevas <strong>" + ok + " de " + total() + "</strong> días.</p></div></div>";
      raiz.querySelector("#foto-in").onchange = function (e) { if (e.target.files[0]) subirFoto(e.target.files[0], function () { pagPortada(); }); };
      montana(raiz, todo);
    });
  }
  function montana(raiz, todo) {
    var cont = raiz.querySelector("#puertas"), ok = hechos();
    var ruta = suave([SALIDA].concat(PUNTOS).concat([CIMA_PT]));
    var proximo = 0; window.DIAS.forEach(function (d) { if (abierto(d.n) && !S.listo[d.n] && !proximo) proximo = d.n; });
    var nodos = window.DIAS.map(function (d, i) {
      var p = PUNTOS[i], abr = abierto(d.n), hecho = CIMA || !!S.listo[d.n], izq = p[0] > 200;
      var estado = hecho ? "Completado" : (abr ? (d.n === proximo ? "Te toca hoy" : "Abierta") : "Se abre el " + fechaTxt(d.n));
      var tag = abr ? "a" : "div", href = abr ? ' href="dia.html?d=' + d.n + (PREVIEW && !CFG.PREVIEW ? "&preview=1" : "") + '"' : "";
      return "<" + tag + href + ' class="paso ' + (abr ? "abierto" : "cerrado") + (hecho ? " hecho" : "") + (izq ? " a-izq" : "") + '" style="left:' + (p[0] / 4) + "%;top:" + (p[1] / 6.4) + '%">' +
        '<span class="nodo">' + (hecho ? '<svg viewBox="0 0 24 24" class="ok"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' : '<img src="assets/' + d.img + '" alt="">') + (abr ? "" : CANDADO) + '<i class="n">' + d.n + "</i></span>" +
        '<span class="rotulo"><b>' + esc(d.titulo) + "</b><small>" + estado + "</small></span></" + tag + ">";
    }).join("");
    cont.innerHTML =
      '<div class="montana' + (todo ? " en-cima" : "") + '"><svg viewBox="0 0 400 640" class="mont-svg" aria-hidden="true">' +
      '<circle class="sol" cx="334" cy="74" r="30" fill="#F59356"/><g class="rayos" stroke="#F7C175" stroke-width="3" stroke-linecap="round"><path d="M334 24v-12M334 124v12M284 74h-12M396 74h-12M300 40l-8-8M368 108l8 8M368 40l8-8M300 108l-8 8"/></g>' +
      '<g class="nube n1" fill="#fff"><ellipse cx="70" cy="90" rx="34" ry="13"/><ellipse cx="94" cy="80" rx="24" ry="14"/></g><g class="nube n2" fill="#fff"><ellipse cx="300" cy="190" rx="30" ry="11"/><ellipse cx="318" cy="182" rx="20" ry="11"/></g>' +
      '<path d="M-20 640L96 330 170 440 262 268 420 640Z" fill="#C2CBFF"/>' +
      '<path d="M16 640L200 70 384 640Z" fill="#7E84AE"/><path d="M200 70L384 640H262L206 330Z" fill="#6E749F"/><path d="M200 70L230 160 214 150 200 176 184 150 168 160Z" fill="#F8F7F2"/>' +
      '<path d="M0 596c60-14 120-8 200-2s140 8 200-4V640H0Z" fill="#DFF3AF"/>' +
      '<path id="ruta-base" d="' + ruta + '" fill="none" stroke="#4C4F68" stroke-opacity=".22" stroke-width="11" stroke-linecap="round"/>' +
      '<path id="ruta" d="' + ruta + '" fill="none" stroke="#F8F7F2" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 11"/>' +
      '<path id="ruta-avance" d="' + ruta + '" fill="none" stroke="#DFF3AF" stroke-width="6" stroke-linecap="round"/>' +
      '<g class="bandera"><path d="M200 84V40" stroke="#4C4F68" stroke-width="3" stroke-linecap="round"/><path class="tela" d="M200 40l34 10-34 12Z" fill="#F59356"/></g></svg>' +
      nodos + '<div class="escalador" id="escalador">' + avatar("esc") + "</div>" +
      '<a class="cima-link" href="resumen.html' + pre() + '"><b>La cima</b><small>Mi Wrapped financiero</small></a></div>' + (todo ? gracias() : "");
    // el escalador sube por el sendero hasta su último paso (o hasta la cima)
    var path = cont.querySelector("#ruta"), climb = cont.querySelector("#escalador"), av = cont.querySelector("#ruta-avance");
    var L = path.getTotalLength ? path.getTotalLength() : 0;
    // largo recorrido hasta cada parada
    var idx = []; (function () { var acum = 0, ps = [SALIDA].concat(PUNTOS).concat([CIMA_PT]); var seg = []; for (var i = 1; i < ps.length; i++) { seg.push(Math.hypot(ps[i][0] - ps[i - 1][0], ps[i][1] - ps[i - 1][1])); } var tot = seg.reduce(function (a, b) { return a + b; }, 0); for (var j = 0; j < seg.length; j++) { acum += seg[j]; idx.push(acum / tot * L); } })();
    var objetivo = ok >= total() ? L : (ok ? idx[ok - 1] : 0);
    av.style.strokeDasharray = L; av.style.strokeDashoffset = L;
    function poner(l) { var pt = path.getPointAtLength(l); climb.style.left = (pt.x / 4) + "%"; climb.style.top = (pt.y / 6.4) + "%"; av.style.strokeDashoffset = L - l; }
    poner(0);
    var t0 = null, dur = 2200;
    function paso(t) { if (t0 === null) t0 = t; var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); poner(objetivo * e); if (k < 1) requestAnimationFrame(paso); else if (todo) { cont.querySelector(".montana").classList.add("llego"); confeti({ n: 220, dur: 3500 }); } }
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) { poner(objetivo); if (todo) cont.querySelector(".montana").classList.add("llego"); } else setTimeout(function () { requestAnimationFrame(paso); }, 400);
  }

  /* ───────── PDF con todo lo que ha hecho ───────── */
  function filasPDF(titulo, id, b) {
    var fs = filasDe(id).filter(function (f) { return f.c || toNum(f.a) || f.n; }); if (!fs.length) return "";
    return '<div class="r-item"><div class="r-q">' + esc(titulo) + "</div>" + fs.map(function (f) { return '<div class="plan-fila"><span>' + esc([f.c, f.n].filter(Boolean).join(" · ") || "—") + "</span><strong>" + [f.a ? cop(toNum(f.a)) : "", f.b ? (b.cols[2] ? esc(b.cols[2].l) + " " : "") + (isNaN(toNum(f.b)) || /[a-zA-Z]/.test(f.b) ? esc(f.b) : cop(toNum(f.b))) : ""].filter(Boolean).join(" · ") + "</strong></div>"; }).join("") + "</div>";
  }
  function seccionDia(d) {
    var partes = [];
    (function rec(bs) {
      bs.forEach(function (b) {
        if (b.t === "reflex") { var v = getV(b.id); if (v && String(v).trim()) partes.push('<div class="r-item"><div class="r-q">' + esc(b.label) + '</div><div class="r-a">' + esc(v).replace(/\n/g, "<br>") + "</div></div>"); }
        else if (b.t === "nums") { var f = b.campos.map(function (c) { var v = getV(c.id); return v ? '<div class="plan-fila"><span>' + c.label + "</span><strong>" + cop(toNum(v)) + "</strong></div>" : ""; }).join(""); if (f) partes.push('<div class="r-item"><div class="r-q">' + esc(b.titulo) + "</div>" + f + "</div>"); }
        else if (b.t === "tabla") { var h = filasPDF(b.titulo, b.id, b); if (h) partes.push(h); }
        else if (b.t === "embudo") { var v2 = getV(b.id), op = b.ops.filter(function (o) { return o.v === v2; })[0]; if (op) rec(op.bloques); }
      });
    })(d.bloques);
    if (!partes.length) return "";
    return '<section class="r-dia"><div class="r-dia-h"><span>Día ' + d.n + "</span> " + esc(d.titulo) + "</div>" + partes.join("") + "</section>";
  }
  function pagResumen() {
    var raiz = document.getElementById("app");
    pedirIdentidad(raiz, function () {
      var cuerpo = window.DIAS.map(seccionDia).join("");
      var ing = num("d1_total_ing"), deu = suma("d2_deudas", "a"), cuo = suma("d2_deudas", "b"), gas = suma("d2_gastos", "a");
      var resumen =
        '<div class="card plan"><div class="res-label">Mi Wrapped financiero 2026</div><h2>' + esc(S.nombre) + "</h2><div class=\"tot\">" +
        (ing ? '<div><small>Ingresos al mes</small><b>' + cop(ing) + "</b></div>" : "") + (num("d1_ahorros") ? '<div><small>Ahorrado</small><b>' + cop(num("d1_ahorros")) + "</b></div>" : "") +
        (deu ? '<div><small>Debo</small><b>' + cop(deu) + "</b></div>" : "") + (cuo ? '<div><small>Cuotas al mes</small><b>' + cop(cuo) + "</b></div>" : "") + (gas ? '<div><small>Gastos al mes</small><b>' + cop(gas) + "</b></div>" : "") + "</div></div>";
      raiz.innerHTML =
        '<div class="dia-top"><a href="index.html' + pre() + '" class="volver">← Camino</a><img class="dia-logo" src="assets/logo-feminario.png" alt="Feminario"><span class="prog">' + hechos() + "/" + total() + "</span></div>" +
        '<div class="dia-head"><img class="dia-img" src="assets/st-poder.png" alt=""><h1>Mi Wrapped financiero</h1></div>' +
        '<div id="pdf-doc" class="pdf-doc"><div class="pdf-portada"><img src="assets/logo-feminario.png" alt="Feminario"><div class="res-label">Adviento Feminario 2026</div><h1>' + esc(S.nombre) + "</h1></div>" +
        resumen + (cuerpo || '<p class="suave centro">Completa tu primer día y aquí aparece tu resumen.</p>') + '<p class="pdf-pie">Feminario · @feminario.co · Contenido educativo, no asesoría financiera personalizada.</p></div>' +
        '<div class="acciones"><button class="btn" id="pdf-go" type="button">Descargar mi PDF</button><a class="btn secundario" target="_blank" rel="noopener" href="' + esc(CFG.CLUB_URL) + '">Conocer el Club 365</a></div>' +
        '<p class="mini"><a href="#" id="copia">Guardar copia de mis datos</a> · <a href="#" id="borrar">Borrar mis datos</a></p><div class="aviso" id="pdf-av"></div>';
      var av = raiz.querySelector("#pdf-av");
      raiz.querySelector("#copia").onclick = function (e) { e.preventDefault(); var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: "application/json" })); a.download = "mi-adviento-feminario.json"; a.click(); };
      raiz.querySelector("#borrar").onclick = function (e) { e.preventDefault(); if (confirm("¿Borrar todo lo que escribiste en este dispositivo?")) { localStorage.removeItem(KEY); location.href = "index.html" + pre(); } };
      raiz.querySelector("#pdf-go").onclick = function () {
        var btn = this, doc = raiz.querySelector("#pdf-doc");
        function imprimir() { av.textContent = "En el cuadro que se abre, elige «Guardar como PDF»."; window.print(); }
        if (window.html2pdf) {
          btn.disabled = true; btn.textContent = "Preparando tu PDF…";
          window.html2pdf().set({ margin: [10, 8, 12, 8], filename: "mi-adviento-feminario.pdf", image: { type: "jpeg", quality: 0.96 }, html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" }, jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, pagebreak: { mode: ["css", "avoid-all"], avoid: [".r-item", ".plan-fila"] } }).from(doc).save()
            .then(function () { btn.disabled = false; btn.textContent = "Descargar mi PDF"; av.textContent = "Listo, revisa tus descargas."; confeti({ n: 80, dur: 2000 }); })
            .catch(function () { btn.disabled = false; btn.textContent = "Descargar mi PDF"; imprimir(); });
        } else imprimir();
      };
    });
  }

  window.CAL = { portada: pagPortada, dia: pagDia, resumen: pagResumen };
})();
