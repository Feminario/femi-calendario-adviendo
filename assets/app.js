/* Calendario de adviento Feminario — motor compartido (camino, días y Wrapped).
   Privacidad: todo lo que escribe cada mujer se guarda SOLO en su dispositivo (localStorage). No se envía a ningún servidor. */
(function () {
  var CFG = window.CAL_CFG || {};
  // DEMO (?demo=1): todas las puertas abiertas y NADA se guarda de verdad: vive solo en esta pestaña (sessionStorage, otra clave) y se borra al cerrarla.
  var DEMO = /[?&]demo=1/.test(location.search);
  var KEY = DEMO ? "feminario_adviento_demo" : "feminario_adviento_2026_v2";
  var ALM = (function () { try { return DEMO ? window.sessionStorage : window.localStorage; } catch (e) { return null; } })();
  var PREVIEW = DEMO || /[?&]preview=1/.test(location.search) || !!CFG.PREVIEW;
  var S = cargar();

  /* ───────── estado ───────── */
  function cargar() {
    try { var s = JSON.parse(ALM.getItem(KEY)); if (s && s.v) return s; } catch (e) {}
    return { nombre: "", foto: "", v: {}, listo: {} };
  }
  function guardar() { try { ALM.setItem(KEY, JSON.stringify(S)); } catch (e) {} sincronizar(); }

  /* ───────── panel: guardar respuestas y saber qué días abrió el equipo ───────── */
  var HASTA = null;          // hasta qué día abrió el equipo (null = por fecha)
  var tSync = null;
  function sincronizar(ya) {
    if (DEMO || !CFG.API || !S.id || !S.email || !S.permiso) return;
    clearTimeout(tSync);
    tSync = setTimeout(function () {
      var cuerpo = { id: S.id, nombre: S.nombre, email: S.email, whatsapp: S.wa || "", consentimiento: true, v: S.v, listo: S.listo, emi: S.emi || {} };
      if (S.fotoPend && S.foto) cuerpo.foto = S.foto;
      try {
        fetch(CFG.API, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(cuerpo), keepalive: true })
          .then(function (r) { if (r.ok && cuerpo.foto) { S.fotoPend = false; try { ALM.setItem(KEY, JSON.stringify(S)); } catch (e) {} } }).catch(function () {});
      } catch (e) {}
    }, ya ? 0 : 1500);
  }
  function consultarPanel(listo) {
    if (DEMO || !CFG.API) { listo(); return; }
    var hecho = false, fin = function () { if (!hecho) { hecho = true; listo(); } };
    setTimeout(fin, 2500);
    try {
      fetch(CFG.API + (S.id ? "?id=" + encodeURIComponent(S.id) : ""), { cache: "no-store" }).then(function (r) { return r.json(); })
        .then(function (j) { if (j && typeof j.hasta === "number") HASTA = j.hasta; if (j && j.insights) { S.insights = j.insights; try { ALM.setItem(KEY, JSON.stringify(S)); } catch (e) {} } fin(); }).catch(fin);
    } catch (e) { fin(); }
  }
  function nuevoId() { var t = "c"; for (var i = 0; i < 14; i++) t += "abcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(Math.random() * 36)); return t; }
  function setV(k, val) { S.v[k] = val; guardar(); adelantarIA(); }
  function getV(k) { return S.v[k]; }

  /* ───────── utilidades ───────── */
  function esc(t) { return String(t == null ? "" : t).replace(/[&<>"']/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]; }); }
  function toNum(x) { if (x === undefined || x === "" || x === null) return 0; if (typeof x === "number") return isFinite(x) ? x : 0; var n = parseFloat(String(x).replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "")); return isFinite(n) ? n : 0; }
  function num(k) { return toNum(S.v[k]); }
  function cop(n) { return "$ " + Math.round(n).toLocaleString("es-CO"); }
  function fechaDia(n) { var i = CFG.INICIO || [2026, 11, 30]; return new Date(i[0], i[1] - 1, i[2] + n - 1); }
  function abierto(n) { if (PREVIEW) return true; if (HASTA !== null) return n <= HASTA; var h = new Date(); h.setHours(0, 0, 0, 0); return h >= fechaDia(n); }
  function fechaTxt(n) { return fechaDia(n).toLocaleDateString("es-CO", { day: "numeric", month: "long" }); }
  function total() { return window.DIAS.length; }
  function hechos() { return Object.keys(S.listo).filter(function (k) { return S.listo[k]; }).length; }
  function confeti(o) { try { window.lanzarConfeti && window.lanzarConfeti(o); } catch (e) {} }
  function pre() { return DEMO ? "?demo=1" : (PREVIEW && !CFG.PREVIEW ? "?preview=1" : ""); }
  function preY() { var p = pre(); return p ? "&" + p.slice(1) : ""; }
  function bandaDemo() { return DEMO ? '<div class="demo-banda">Modo demo: puedes llenar todo, pero nada se guarda. Se borra al cerrar la pestaña.</div>' : ""; }
  function urlDe(clave) {
    var map = { calc110: CFG.CALC110_URL, portafolio: "https://feminario.github.io/construye-tu-portafolio/" };
    return map[clave] || clave;
  }
  var ESTRELLA = '<img class="estrella" src="assets/forma-estrella-morada.png" alt="">';
  var CANDADO = '<svg class="candado" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="3" fill="#7E84AE"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#7E84AE" stroke-width="2.4" stroke-linecap="round"/></svg>';

  /* ───────── identidad (solo el nombre) ───────── */
  function pedirIdentidad(destino, despues) {
    if (S.nombre && (DEMO || (S.email && S.permiso))) { if (!S.id) { S.id = nuevoId(); guardar(); } despues(); return; }
    destino.innerHTML =
      '<div class="card centro"><h2>Antes de empezar</h2><p class="suave">Con esto guardamos tu avance. Al terminar cada día, Emi te deja una mirada a tus números y una pregunta.</p>' +
      '<label for="id-nombre">¿Cómo te llamas?</label><input type="text" id="id-nombre" autocomplete="given-name" value="' + esc(S.nombre) + '">' +
      '<label for="id-email">Tu correo</label><input type="email" id="id-email" autocomplete="email" value="' + esc(S.email || "") + '">' +
      '<label for="id-wa">Tu WhatsApp</label><input type="tel" id="id-wa" autocomplete="tel" placeholder="+57 300 000 0000" value="' + esc(S.wa || "") + '">' +
      '<label class="check" for="id-ok"><input type="checkbox" id="id-ok"' + (S.permiso ? " checked" : "") + '><span>Acepto que Feminario guarde lo que escribo aquí para acompañarme (solo lo ve el equipo de Feminario).</span></label>' +
      '<div class="error" id="id-err"></div><button class="btn" id="id-go">Empezar</button></div>';
    destino.querySelector("#id-go").onclick = function () {
      var n = destino.querySelector("#id-nombre").value.trim(), em = destino.querySelector("#id-email").value.trim(), wa = destino.querySelector("#id-wa").value.trim(), ok = destino.querySelector("#id-ok").checked, err = destino.querySelector("#id-err");
      if (!n) { err.textContent = "Escribe tu nombre."; return; }
      if (!DEMO && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) { err.textContent = "Escribe un correo válido."; return; }
      if (!DEMO && wa.replace(/\D/g, "").length < 7) { err.textContent = "Escribe tu WhatsApp para que Emi te mande tu análisis."; return; }
      if (!DEMO && !ok) { err.textContent = "Marca la casilla para poder guardar tu avance."; return; }
      S.nombre = n; S.email = em; S.wa = wa; S.permiso = ok || DEMO; if (!S.id) S.id = nuevoId(); if (S.foto) S.fotoPend = true;
      guardar(); sincronizar(true); despues();
    };
  }

  /* ───────── tablas (filas con categoría) ───────── */
  function filasDe(id) { var a = getV(id); return Array.isArray(a) && a.length ? a : [{ c: "" }]; }
  function suma(id, k) { return filasDe(id).reduce(function (t, f) { return t + toNum(f[k]); }, 0); }
  var MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  function campoFecha(c, v) {
    var m = /^(\d{4})-(\d{2})$/.exec(v || ""), ym = m ? m[1] : "", mm = m ? m[2] : "";
    var ms = '<select data-fm aria-label="Mes"><option value="">Mes</option>' + MESES.map(function (t, i) { var k = (i < 9 ? "0" : "") + (i + 1); return '<option value="' + k + '"' + (k === mm ? " selected" : "") + ">" + t + "</option>"; }).join("") + "</select>";
    var ys = '<select data-fy aria-label="Año"><option value="">Año</option>' + [2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035].map(function (y) { return '<option value="' + y + '"' + (String(y) === ym ? " selected" : "") + ">" + y + "</option>"; }).join("") + "</select>";
    return '<div class="fecha" data-tk="' + c.k + '" data-fecha="1" role="group" aria-label="' + esc(c.l) + '">' + ms + ys + "</div>";
  }
  function fmtFecha(v) { var m = /^(\d{4})-(\d{2})$/.exec(v || ""); return m ? MESES[+m[2] - 1] + " " + m[1] : v; }
  function filaTabla(b, f, i) {
    var cats = b.cats, enLista = !f.c || cats.indexOf(f.c) > -1;
    var sel = '<select data-tc aria-label="Categoría"><option value="">Categoría…</option>' + cats.map(function (c) { return '<option' + (f.c === c ? " selected" : "") + ">" + esc(c) + "</option>"; }).join("") + '<option value="__otra"' + (enLista ? "" : " selected") + ">Crear categoría…</option></select>";
    var otra = enLista ? "" : '<input type="text" data-tn placeholder="Nombre de la categoría" value="' + esc(f.c) + '">';
    var cols = b.cols.map(function (c) {
      if (c.fecha) return campoFecha(c, f[c.k]);
      var v = f[c.k]; if (c.moneda && v !== undefined && v !== "") v = Number(toNum(v)).toLocaleString("es-CO");
      return '<input type="text" data-tk="' + c.k + '"' + (c.moneda ? ' inputmode="numeric" data-moneda="1"' : "") + ' placeholder="' + esc(c.l) + '" aria-label="' + esc(c.l) + '" value="' + esc(v == null ? "" : v) + '">';
    }).join("");
    return '<div class="trow" data-i="' + i + '"><div class="tcat">' + sel + otra + '</div><div class="tcols c' + b.cols.length + '">' + cols + '</div><button type="button" class="x" data-del aria-label="Quitar esta fila" title="Quitar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button></div>';
  }
  function pintarTabla(box, b) {
    box.innerHTML = filasDe(b.id).map(function (f, i) { return filaTabla(b, f, i); }).join("") + '<button type="button" class="btn secundario chico" data-mas>+ Agregar ' + (b.una || "categoría") + "</button>" + '<div class="resultado" data-calc="' + (b.calc || "") + '" hidden></div>';
  }
  function leerTabla(box, b) {
    var out = []; box.querySelectorAll(".trow").forEach(function (r) {
      var sel = r.querySelector("[data-tc]"), c = sel.value, o = {};
      if (c === "__otra") { var t = r.querySelector("[data-tn]"); c = t ? t.value.trim() : ""; }
      o.c = c; r.querySelectorAll("[data-tk]").forEach(function (i) { if (i.hasAttribute("data-fecha")) { var fy = i.querySelector("[data-fy]").value, fm = i.querySelector("[data-fm]").value; o[i.getAttribute("data-tk")] = fy && fm ? fy + "-" + fm : ""; return; } o[i.getAttribute("data-tk")] = i.getAttribute("data-moneda") === "1" ? i.value.replace(/\D/g, "") : i.value; });
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

  /* ───────── balance (mismas opciones que el artefacto de diciembre) ───────── */
  function itemsDe(id) { var a = getV(id); return Array.isArray(a) && a.length ? a : [{}]; }
  function sumaV(id, f) { return itemsDe(id).reduce(function (t, x) { return t + (f ? f(x) : toNum(x.v)); }, 0); }
  function mil(v) { return toNum(v) ? Number(toNum(v)).toLocaleString("es-CO") : ""; }
  function filaBal(b, x, i, n) {
    var h = '<div class="fila-bal" data-i="' + i + '">';
    if (b.tipo === "inversion" || b.tipo === "deuda") { var L = b.tipo === "deuda" ? window.TIPOS_DEUDA : window.TIPOS_INV; h += '<select data-f="tj" aria-label="Tipo"><option value="">' + (b.tipo === "deuda" ? "¿Qué tipo de deuda?" : "¿Qué tipo de inversión?") + "</option>" + L.map(function (t, j) { return '<option value="' + j + '"' + (String(x.tj) === String(j) ? " selected" : "") + ">" + esc(t) + "</option>"; }).join("") + "</select>"; }
    if (b.tipo === "gasto") h += '<select data-f="t" aria-label="Tipo de gasto"><option value="fijo"' + (x.t !== "var" ? " selected" : "") + '>Gasto fijo (vivienda, servicios, cuotas)</option><option value="var"' + (x.t === "var" ? " selected" : "") + ">Gasto variable (mercado, salidas, antojos)</option></select>";
    if (b.tipo === "ingreso") h += '<div class="estados"><button type="button" class="estado' + (x.t !== "var" ? " sel" : "") + '" data-set="t" data-val="fijo">Ingreso fijo</button><button type="button" class="estado' + (x.t === "var" ? " sel" : "") + '" data-set="t" data-val="var">Ingreso variable</button></div>' + (x.t === "var" ? '<div class="mini-lbl">Cambia cada mes: pon cuánto te entra en promedio</div>' : "");
    h += '<input type="text" data-f="n" placeholder="' + esc(b.ph || "") + '" value="' + esc(x.n || "") + '">';
    h += '<div class="monto-wrap"><span>$</span><input type="text" inputmode="numeric" data-f="v" data-moneda="1" placeholder="' + (b.tipo === "bien" ? "¿Cuánto vale hoy?" : b.tipo === "deuda" ? "¿Cuánto debes?" : x.t === "var" && b.tipo === "ingreso" ? "Promedio al mes" : "Valor") + '" value="' + mil(x.v) + '"></div>';
    if (b.cuota) h += '<div class="monto-wrap"><span>$</span><input type="text" inputmode="numeric" data-f="cuota" data-moneda="1" placeholder="Cuota al mes" value="' + mil(x.cuota) + '"></div>';
    if (b.tipo === "bien") {
      h += '<div class="mini-lbl">¿Ya es tuyo?</div><div class="estados"><button type="button" class="estado' + (x.est === "mio" ? " sel" : "") + '" data-set="est" data-val="mio">Ya es mío</button><button type="button" class="estado' + (x.est === "pagando" ? " sel" : "") + '" data-set="est" data-val="pagando">Lo estoy pagando</button></div>';
      if (x.est === "pagando") h += '<div class="mini-lbl">¿Cuánto te falta por pagar?</div><div class="monto-wrap"><span>$</span><input type="text" inputmode="numeric" data-f="debo" data-moneda="1" placeholder="Saldo de la deuda" value="' + mil(x.debo) + '"></div>';
    }
    return h + (n > 1 ? '<button type="button" class="quitar" data-q>Quitar ' + esc(b.una) + "</button>" : "") + "</div>";
  }
  function pintarBal(box, b) {
    var xs = itemsDe(b.id);
    box.innerHTML = xs.map(function (x, i) { return filaBal(b, x, i, xs.length); }).join("") + '<button type="button" class="btn secundario chico mas-fila" data-mas>+ Agregar ' + esc(b.una) + "</button>" + (b.calc ? '<div class="resultado" data-calc="' + b.calc + '" hidden></div>' : "");
  }
  function enlazarBal(box, b, raiz) {
    pintarBal(box, b);
    function xs() { return itemsDe(b.id).map(function (x) { return Object.assign({}, x); }); }
    box.addEventListener("input", function (e) {
      var el = e.target, f = el.getAttribute("data-f"), row = el.closest(".fila-bal"); if (!f || !row) return;
      var cur = xs(), i = +row.getAttribute("data-i"), val = el.value;
      if (el.getAttribute("data-moneda") === "1") { var d = val.replace(/\D/g, ""); el.value = d ? Number(d).toLocaleString("es-CO") : ""; val = d; }
      cur[i][f] = val; setV(b.id, cur); recalcular(raiz);
    });
    box.addEventListener("change", function (e) {
      var el = e.target, f = el.getAttribute("data-f"), row = el.closest(".fila-bal"); if (!f || el.tagName !== "SELECT") return;
      var cur = xs(); cur[+row.getAttribute("data-i")][f] = el.value; setV(b.id, cur); pintarBal(box, b); recalcular(raiz);
    });
    box.addEventListener("click", function (e) {
      var el = e.target, row = el.closest(".fila-bal"), cur = xs();
      if (el.hasAttribute("data-set")) { cur[+row.getAttribute("data-i")][el.getAttribute("data-set")] = el.getAttribute("data-val"); }
      else if (el.hasAttribute("data-mas")) cur.push({});
      else if (el.hasAttribute("data-q")) cur.splice(+row.getAttribute("data-i"), 1);
      else return;
      setV(b.id, cur.length ? cur : [{}]); pintarBal(box, b); recalcular(raiz);
    });
  }

  /* ───────── calculadoras ───────── */
  var R = 0.08 / 12;
  function vf(aporte, anios) { var n = anios * 12; return aporte * ((Math.pow(1 + R, n) - 1) / R); }
  var CALCS = {
    ingresos: function () {
      var t = sumaV("d1_ing"), vr = sumaV("d1_ing", function (x) { return x.t === "var" ? toNum(x.v) : 0; });
      if (!t) return null;
      return { html: '<div class="res-label">Lo que entra cada mes</div><div class="res-num">' + cop(t) + "</div>" + (vr ? '<div class="res-desc">De eso, <strong>' + cop(vr) + "</strong> es variable (promedio).</div>" : "") };
    },
    ahorro: function () {
      var ah = sumaV("d1_ahorros"), t = sumaV("d1_ing"); if (!ah) return null;
      return { html: '<div class="res-label">Lo que tienes ahorrado</div><div class="res-num">' + cop(ah) + "</div>" + (t ? '<div class="res-desc">Equivale a <strong>' + (Math.round(ah / t * 10) / 10) + " meses</strong> de lo que te entra.</div>" : "") };
    },
    deudas: function () {
      var d = sumaV("d2_deudas"), c = sumaV("d2_deudas", function (x) { return toNum(x.cuota); }), ing = sumaV("d1_ing"); if (!d && !c) return null;
      return { html: '<div class="res-label">Tus deudas</div><div class="res-num">' + cop(d) + '</div><div class="res-desc">Pagas <strong>' + cop(c) + "</strong> al mes en cuotas" + (ing && c ? ", el <strong>" + Math.round(c / ing * 100) + " %</strong> de tus ingresos" : "") + ".</div>" };
    },
    gastos: function () {
      var g = sumaV("d2_gastos"), fijo = sumaV("d2_gastos", function (x) { return x.t !== "var" ? toNum(x.v) : 0; }), ing = sumaV("d1_ing"); if (!g) return null;
      return { html: '<div class="res-label">Lo que gastas al mes</div><div class="res-num">' + cop(g) + '</div><div class="res-desc">Fijos <strong>' + cop(fijo) + "</strong> · variables <strong>" + cop(g - fijo) + "</strong>" + (ing ? ". Es el <strong>" + Math.round(g / ing * 100) + " %</strong> de lo que te entra" : "") + ".</div>" };
    },
    portafolio: function () {
      var fs = itemsDe("d3_activos").filter(function (f) { return toNum(f.v) > 0; }), t = fs.reduce(function (a, f) { return a + toNum(f.v); }, 0); if (!t) return null;
      var porCat = {}; fs.forEach(function (f) { var k = f.tj !== undefined && f.tj !== "" ? window.TIPOS_INV[+f.tj] : "Sin tipo"; porCat[k] = (porCat[k] || 0) + toNum(f.v); });
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
    if (b.t === "bal") return '<div class="bloque"><h3>' + b.titulo + '</h3><div data-bal="' + b.id + '"></div></div>';
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
    raiz.querySelectorAll("[data-bal]").forEach(function (box) { if (box.__ok) return; box.__ok = 1; enlazarBal(box, bloqueDe(box.getAttribute("data-bal"), TODOS()), raiz); });
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
    return '<div class="gracias"><img src="assets/fundadoras.jpg" alt="Andre y Tina"><h2>Gracias por recorrer este camino con nosotras</h2><p>Terminaste los cinco días: ahora sabes dónde estás y hacia dónde vas. Cada paso que diste cuenta, y no vas sola.</p><p class="firma">Andre y Tina</p><a class="btn" href="resumen.html' + pre() + '">Ver mi Wrapped financiero</a></div>' + nubes();
  }

  /* ───────── página de un día ───────── */
  function pagDia() {
    var n = parseInt((location.search.match(/[?&]d=(\d+)/) || [])[1], 10), D = window.DIAS, d = D && D[n - 1];
    var raiz = document.getElementById("app");
    if (!d) { raiz.innerHTML = '<div class="card centro"><h2>No encontramos ese día</h2><a class="btn" href="index.html' + pre() + '">Volver al camino</a></div>'; return; }
    document.title = d.titulo + " · Adviento Feminario";
    if (!abierto(n)) { raiz.innerHTML = '<div class="card centro"><div class="puerta-cerrada">' + CANDADO + '</div><h2>Esta puerta se abre el ' + fechaTxt(n) + '</h2><a class="btn" href="index.html' + pre() + '">Volver al camino</a></div>'; return; }
    pedirIdentidad(raiz, function () {
      DIA_ACT = n;
      raiz.innerHTML =
        bandaDemo() + '<div class="dia-top"><a href="index.html' + pre() + '" class="volver">← Camino</a><img class="dia-logo" src="assets/logo-feminario.png" alt="Feminario"><span class="prog">' + n + "/" + total() + "</span></div>" +
        '<div class="dia-head"><img class="dia-img" src="assets/' + d.img + '" alt=""><h1>' + esc(d.titulo) + "</h1></div>" +
        '<div class="card" id="cuerpo">' + d.bloques.map(render).join("") + "</div>" +
        '<div class="acciones"><button class="btn" id="fin" type="button">' + (S.listo[n] ? "Guardar cambios" : "Completar el día " + n) + "</button></div>";
      var cuerpo = raiz.querySelector("#cuerpo"); enlazar(cuerpo);
      cuerpo.querySelectorAll("[data-custom]").forEach(function (c) { var f = CUSTOM[c.getAttribute("data-custom")]; if (f) f(c); });
      cuerpo.querySelectorAll("[data-wa-copiar]").forEach(function (bt) { bt.onclick = function () { var t = bt.parentNode.querySelector(".wa-txt"); t.select(); try { navigator.clipboard.writeText(t.value); } catch (e) { document.execCommand("copy"); } bt.textContent = "Copiado"; }; });
      raiz.querySelector("#fin").onclick = function () {
        S.listo[n] = true; guardar(); sincronizar(true); confeti({ n: n === total() ? 260 : 110 }); window.scrollTo(0, 0);
        var msgs = ["Tus metas ya tienen nombre y número.", "Verlas escritas pesa menos que imaginarlas.", "Diste un paso con tu plata.", "Le dejaste una promesa a tu yo del futuro.", "Compartir lo aprendido lo fija."];
        raiz.innerHTML = (n === total() && hechos() === total() ? gracias() :
          '<div class="card centro fin-dia">' + ESTRELLA + "<h2>¡Lo hiciste, " + esc(S.nombre) + "!</h2><p>" + msgs[n - 1] + '</p><a class="btn" href="index.html' + pre() + '">Volver al camino</a></div>') + '<div id="emi-zona"></div>';
        mostrarEmi(n, raiz.querySelector("#emi-zona"));
      };
    });
  }

  /* ───────── foto de perfil ───────── */
  function subirFoto(file, cb) {
    var fr = new FileReader();
    fr.onload = function () {
      var im = new Image(); im.onload = function () {
        var c = document.createElement("canvas"), L = 240, m = Math.min(im.width, im.height), x = (im.width - m) / 2, y = (im.height - m) / 2;
        c.width = c.height = L; c.getContext("2d").drawImage(im, x, y, m, m, 0, 0, L, L); S.foto = c.toDataURL("image/jpeg", 0.85); S.fotoPend = true; guardar(); cb();
      }; im.src = fr.result;
    }; fr.readAsDataURL(file);
  }
  function avatar(cls) { return S.foto ? '<img class="' + cls + '" src="' + S.foto + '" alt="">' : '<span class="' + cls + ' sin">' + esc((S.nombre || "?").charAt(0).toUpperCase()) + "</span>"; }

  /* ───────── portada: el camino ───────── */
  function pagPortada() {
    var raiz = document.getElementById("app");
    if (!(S.nombre && (DEMO || (S.email && S.permiso)))) { pedirIdentidad(raiz.querySelector("#identidad"), pagPortada); return; }   // el camino aparece solo después de dejar sus datos
    if (DEMO && !raiz.querySelector(".demo-banda")) raiz.insertAdjacentHTML("afterbegin", bandaDemo());
    pedirIdentidad(raiz.querySelector("#identidad"), function () {
      var ok = hechos();
      raiz.querySelector("#identidad").innerHTML =
        '<div class="hola"><label class="foto-sub" title="Subir mi foto">' + avatar("foto") + '<input type="file" accept="image/*" id="foto-in" hidden><i>+</i></label><div><h2>Hola, ' + esc(S.nombre) + "</h2><p>Llevas <strong>" + ok + " de " + total() + '</strong> días.</p><div class="barra"><div style="width:' + Math.round(ok / total() * 100) + '%"></div></div></div></div>' +
        (ok >= total() ? gracias() : "");
      raiz.querySelector("#foto-in").onchange = function (e) { if (e.target.files[0]) subirFoto(e.target.files[0], function () { pagPortada(); }); };
    });
    var cont = raiz.querySelector("#puertas");
    var PASO = 118, BANNER = 92, TOP = 20;
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
      if (it.banner) { var a = it.banner; h += '<div class="acto-banner" style="top:' + it.y + "px;--c:" + a.color + ";--k:" + k + '"><span>Acto ' + a.id + "</span><strong>" + a.nombre + "</strong><em>" + a.sub + "</em></div>"; return; }
      var d = it.d, ab = abierto(d.n), hecho = !!S.listo[d.n], actual = d.n === proximo;
      var cls = "paso" + (ab ? " abierto" : " cerrado") + (hecho ? " hecho" : "") + (actual ? " actual" : "");
      var tag = ab ? "a" : "div", href = ab ? ' href="dia.html?d=' + d.n + preY() + '"' : "";
      h += "<" + tag + href + ' class="' + cls + '" data-n="' + d.n + '" style="top:' + it.y + "px;--c:" + window.ACTOS[d.acto - 1].color + ";--k:" + k + '">' +
        '<span class="nodo">' + ('<img src="assets/' + d.img + '" alt="">' + (ab ? "" : CANDADO)) + '<i class="n">' + d.n + "</i></span>" +
        '<span class="rotulo"><b>' + esc(d.titulo) + "</b><small>" + (ab ? (hecho ? "Completado" : (actual ? "Te toca hoy" : "Abierta")) : "Se abre el " + fechaTxt(d.n)) + "</small></span>" +
        "</" + tag + ">";
    });
    h += '<a class="meta-final" href="resumen.html' + pre() + '" style="top:' + (y + 6) + 'px"><img src="assets/st-poder.png" alt=""><b>Mi Wrapped financiero</b><small>Todo tu camino en una hoja</small></a></div>';
    cont.innerHTML = h;
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
      var av = cont.querySelector("#ruta-avance"); av.setAttribute("d", curva(pts.slice(0, hasta)));
      var L = av.getTotalLength ? av.getTotalLength() : 0; av.style.strokeDasharray = L; av.style.strokeDashoffset = L; av.getBoundingClientRect();
      cam.classList.add("lista");
    }
    trazar(); var rz; window.addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(trazar, 120); });
    var aqui = cont.querySelector(".paso.actual");
    if (aqui && aqui.scrollIntoView && !PREVIEW) setTimeout(function () { aqui.scrollIntoView({ behavior: "smooth", block: "center" }); }, 900);
  }

  /* ───────── PDF con todo lo que ha hecho ───────── */
  function filasPDF(titulo, id, b) {
    var fs = filasDe(id).filter(function (f) { return f.c || toNum(f.a) || f.n; }); if (!fs.length) return "";
    return '<div class="r-item"><div class="r-q">' + esc(titulo) + "</div>" + fs.map(function (f) { return '<div class="plan-fila"><span>' + esc([f.c, f.n].filter(Boolean).join(" · ") || "—") + "</span><strong>" + [f.a ? cop(toNum(f.a)) : "", f.b ? (b.cols[2] && b.cols[2].fecha ? "para " : "") + (/^\d{4}-\d{2}$/.test(f.b) ? esc(fmtFecha(f.b)) : isNaN(toNum(f.b)) || /[a-zA-Z]/.test(f.b) ? esc(f.b) : cop(toNum(f.b))) : ""].filter(Boolean).join(" · ") + "</strong></div>"; }).join("") + "</div>";
  }
  function balPDF(b) {
    var xs = itemsDe(b.id).filter(function (x) { return toNum(x.v) || x.n; }); if (!xs.length) return "";
    return '<div class="r-item"><div class="r-q">' + esc(b.titulo) + "</div>" + xs.map(function (x) {
      var tipo = x.tj !== undefined && x.tj !== "" ? (b.tipo === "deuda" ? window.TIPOS_DEUDA : window.TIPOS_INV)[+x.tj] : "";
      var extra = [tipo, b.tipo === "ingreso" ? (x.t === "var" ? "variable, promedio" : "fijo") : "", b.tipo === "gasto" ? (x.t === "var" ? "variable" : "fijo") : "", x.est === "mio" ? "ya es mío" : x.est === "pagando" ? "lo estoy pagando, faltan " + cop(toNum(x.debo)) : "", b.cuota && toNum(x.cuota) ? "cuota " + cop(toNum(x.cuota)) + " al mes" : ""].filter(Boolean).join(" · ");
      return '<div class="plan-fila"><span>' + esc(x.n || tipo || (b.una.charAt(0).toUpperCase() + b.una.slice(1))) + (extra && x.n ? ' <small class="suave">· ' + esc(extra) + "</small>" : !x.n && extra && extra !== tipo ? ' <small class="suave">· ' + esc(extra.replace(tipo + " · ", "")) + "</small>" : "") + "</span><strong>" + cop(toNum(x.v)) + "</strong></div>";
    }).join("") + "</div>";
  }
  function seccionDia(d) {
    var partes = [];
    (function rec(bs) {
      bs.forEach(function (b) {
        if (b.t === "reflex") { var v = getV(b.id); if (v && String(v).trim()) partes.push('<div class="r-item"><div class="r-q">' + esc(b.label) + '</div><div class="r-a">' + esc(v).replace(/\n/g, "<br>") + "</div></div>"); }
        else if (b.t === "nums") { var f = b.campos.map(function (c) { var v = getV(c.id); return v ? '<div class="plan-fila"><span>' + c.label + "</span><strong>" + cop(toNum(v)) + "</strong></div>" : ""; }).join(""); if (f) partes.push('<div class="r-item"><div class="r-q">' + esc(b.titulo) + "</div>" + f + "</div>"); }
        else if (b.t === "tabla") { var h = filasPDF(b.titulo, b.id, b); if (h) partes.push(h); }
        else if (b.t === "bal") { var hb = balPDF(b); if (hb) partes.push(hb); }
        else if (b.t === "embudo") { var v2 = getV(b.id), op = b.ops.filter(function (o) { return o.v === v2; })[0]; if (op) rec(op.bloques); }
      });
    })(d.bloques);
    if (!partes.length) return "";
    return '<section class="r-dia"><div class="r-dia-h"><span>Día ' + d.n + "</span> " + esc(d.titulo) + "</div>" + partes.join("") + "</section>";
  }
  /* ───────── Emi: un insight y una pregunta por día ─────────
     No es un chat: ella no le escribe a Emi. Emi lee SUS números y SUS metas, le deja un insight y una pregunta, y ella puede dejar una respuesta escrita
     que queda guardada para el equipo (Emi no contesta aquí). Todo se arma al instante en el dispositivo, sin esperas. */
  var MES_L = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  function mesesHasta(para) { var m = /^(\d{4})-(\d{2})$/.exec(para || ""); if (!m) return null; var h = new Date(); return Math.max(1, (+m[1] - h.getFullYear()) * 12 + (+m[2] - (h.getMonth() + 1))); }
  function fechaLarga(para) { var m = /^(\d{4})-(\d{2})$/.exec(para || ""); return m ? MES_L[+m[2] - 1] + " " + m[1] : ""; }
  function corto(t, n) { t = String(t || "").replace(/\s+/g, " ").trim(); return t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t; }
  function datosEmi() {
    var ing = sumaV("d1_ing"), vr = sumaV("d1_ing", function (x) { return x.t === "var" ? toNum(x.v) : 0; }), aho = sumaV("d1_ahorros");
    var gas = sumaV("d2_gastos"), gv = sumaV("d2_gastos", function (x) { return x.t === "var" ? toNum(x.v) : 0; }), cuo = sumaV("d2_deudas", function (x) { return toNum(x.cuota); });
    var libre = ing ? ing - gas - cuo : null;
    var metas = filasDe("d1_metas").filter(function (f) { return f.c || f.n || toNum(f.a); }).map(function (f) { return { nombre: f.n || f.c || "tu meta", costo: toNum(f.a), para: f.b || "", mh: mesesHasta(f.b) }; });
    var total = metas.reduce(function (t, m) { return t + m.costo; }, 0), falta = Math.max(0, total - aho), mhMax = metas.reduce(function (t, m) { return Math.max(t, m.mh || 0); }, 0);
    var completas = metas.length && metas.every(function (m) { return m.costo && m.para; });
    return { ing: ing, vr: vr, aho: aho, gas: gas, gv: gv, cuo: cuo, libre: libre, metas: metas, completas: completas, necesita: completas && mhMax ? Math.ceil(falta / mhMax) : null,
      colchon: gas && aho ? Math.round(aho / gas * 10) / 10 : null, faltaColchon: gas ? Math.max(0, 3 * gas - aho) : null };
  }
  // Los HECHOS que se le pasan a la IA (solo cifras y metas: nunca nombre, correo ni teléfono)
  function hechosDia(n) {
    var d = datosEmi(), h = {
      ingreso_mensual: d.ing || null, ingreso_variable_pct: d.ing ? Math.round(d.vr / d.ing * 100) : null, ahorrado: d.aho || null, gasto_mensual: d.gas || null,
      gasto_variable_pct: d.gas ? Math.round(d.gv / d.gas * 100) : null, cuotas_al_mes: d.cuo || null, cuotas_pct_del_ingreso: d.ing && d.cuo ? Math.round(d.cuo / d.ing * 100) : null,
      le_queda_libre_al_mes: d.libre, ahorro_cubre_meses_de_gasto: d.colchon, le_faltan_para_3_meses_de_colchon: d.faltaColchon || null, necesita_apartar_al_mes_para_todas_sus_metas: d.necesita,
      sus_metas: d.metas.slice(0, 3).map(function (m) { return { meta: m.nombre, cuesta: m.costo || null, para_cuando: fechaLarga(m.para) || null, meses_hasta_esa_fecha: m.mh, necesitaria_apartar_al_mes_si_fuera_la_unica: m.costo && m.mh ? Math.ceil(Math.max(0, m.costo - d.aho) / m.mh) : null }; })
    };
    if (n === 2) h.lo_que_le_sorprendio = String(getV("d2_sorpresa") || "").trim().slice(0, 200) || null;
    if (n === 3) {
      var inv = sumaV("d3_activos"), aporte = sumaV("d3_aportes") || toNum(getV("d3_aporte")), por = {};
      itemsDe("d3_activos").forEach(function (x) { if (!toNum(x.v)) return; var k = x.tj !== undefined && x.tj !== "" ? window.TIPOS_INV[+x.tj] : "Sin tipo"; por[k] = (por[k] || 0) + toNum(x.v); });
      var ks = Object.keys(por).sort(function (a, b) { return por[b] - por[a]; });
      h.camino = getV("d3_camino") === "si" ? "ya invierte" : getV("d3_camino") === "no" ? "nunca ha invertido" : null; h.invertido = inv || null; h.inversion_principal = ks[0] || null; h.concentracion_pct = inv && ks[0] ? Math.round(por[ks[0]] / inv * 100) : null;
      h.aporte_mensual = aporte || null; h.aporte_pct_del_ingreso = d.ing && aporte ? Math.round(aporte / d.ing * 100) : null;
      h.si_aporta_10_anios_al_8_pct_anual = aporte ? Math.round(aporte * ((Math.pow(1 + 0.08 / 12, 120) - 1) / (0.08 / 12))) : null;
    }
    if (n === 4) h.carta_a_su_yo_de_2027 = String(getV("d4_carta") || "").trim().slice(0, 500) || null;
    if (n === 5) h.escribio_carta_de_gratitud = !!String(getV("d5_carta") || "").trim();
    return h;
  }
  // La IA solo redacta el análisis: si no responde (o no pasa los filtros del servidor) en 5 segundos, se queda el texto calculado
  // Se adelanta mientras ella escribe: cuando se detiene 2 s, la IA ya empieza a pensar; al tocar «Completar» el análisis casi siempre ya está listo
  var DIA_ACT = 0, cacheIA = {}, tPre = null, nPre = 0;
  function clavePre(n) { return n + "|" + JSON.stringify(hechosDia(n)); }
  function adelantarIA() {
    if (!DIA_ACT || !CFG.API) return;
    clearTimeout(tPre);
    tPre = setTimeout(function () { var n = DIA_ACT, k = clavePre(n); if (!cacheIA[k]) { nPre++; cacheIA[k] = iaDia(n); } }, 2000);
  }
  function iaDia(n) {
    return new Promise(function (res) {
      var listo = false, t = setTimeout(function () { if (!listo) { listo = true; res(null); } }, 5000);
      function fin(v) { if (listo) return; listo = true; clearTimeout(t); res(v); }
      try {
        fetch(CFG.API + "/insight", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ dia: n, hechos: hechosDia(n) }) })
          .then(function (r) { return r.json(); }).then(function (j) { fin(j && j.ok && j.t && j.q ? { t: j.t, q: j.q } : null); }).catch(function () { fin(null); });
      } catch (e) { fin(null); }
    });
  }
  function insightDia(n) {
    var d = datosEmi(), m = d.metas[0], varios = d.metas.length > 1, nec = d.necesita, t, q;
    var cual = varios ? "tus " + d.metas.length + " metas" : (m ? "«" + m.nombre + "»" : "");
    if (n === 1) {
      if (!d.metas.length) { t = "Hoy pusiste tus números, pero falta lo más importante: hacia dónde va esa plata. Sin una meta con costo y fecha es difícil saber si alcanza."; q = "¿Qué es lo primero que quisieras lograr con tu plata el próximo año?"; }
      else if (!d.completas) { t = "Tu meta " + cual + " ya tiene nombre, pero le falta " + (d.metas.some(function (x) { return !x.costo; }) ? "el costo" : "la fecha") + ": con eso te puedo decir cuánto necesitas apartar cada mes."; q = "¿Para cuándo la quieres y cuánto crees que cuesta?"; }
      else {
        t = (varios ? "Tus " + d.metas.length + " metas juntas piden apartar cerca de " : "Para llegar a " + cual + " en " + fechaLarga(m.para) + " necesitas apartar cerca de ") + cop(nec) + " al mes" + (d.ing ? ", el " + Math.round(nec / d.ing * 100) + " % de lo que te entra" : "") + (varios ? " si quieres llegar a todas a tiempo" : "") + ".";
        if (d.ing && d.vr / d.ing >= 0.3) t += " Ojo: el " + Math.round(d.vr / d.ing * 100) + " % de tu ingreso es variable, así que conviene contar con el mes más flojo.";
        q = varios ? "Si no alcanza para todas a la vez, ¿cuál es la que no quieres que espere?" : "¿Qué parte de tu mes estás dispuesta a dejar solo para esta meta?";
      }
    } else if (n === 2) {
      var sorp = String(getV("d2_sorpresa") || "").trim(), pctCuo = d.ing ? Math.round(d.cuo / d.ing * 100) : 0;
      if (d.libre !== null && d.libre <= 0) { t = "Tus gastos y cuotas ya se llevan todo lo que te entra: hoy no queda plata libre para tus metas."; q = "¿Qué gasto sientes que podrías mover sin sufrir?"; }
      else if (d.libre !== null && nec) {
        if (d.libre >= nec) { t = "Después de gastos y cuotas te quedan libres cerca de " + cop(d.libre) + " al mes y " + cual + " piden " + cop(nec) + ": sí alcanza, si esa plata de verdad llega a su destino."; q = "¿A dónde se va hoy esa plata que te queda libre?"; }
        else { t = cual.charAt(0).toUpperCase() + cual.slice(1) + " piden " + cop(nec) + " al mes y, después de gastos y cuotas, te quedan libres " + cop(d.libre) + ": hay una brecha de " + cop(nec - d.libre) + "."; q = "¿Qué gasto moverías, o qué meta cambiarías de fecha, para cerrar esa brecha?"; }
      } else if (d.libre !== null) { t = "Después de gastos y cuotas te quedan libres cerca de " + cop(d.libre) + " al mes, pero como aún no hay metas con costo y fecha no puedo decirte si eso alcanza para lo que quieres."; q = "¿Qué te gustaría lograr con esa plata?"; }
      else { t = "Ya está todo junto en un solo lugar: eso es lo que casi nadie hace."; q = "¿Qué número te incomodó más al verlo?"; }
      if (d.colchon !== null && d.colchon < 3 && d.libre !== null && d.libre > 0) t += " Tu ahorro cubre " + String(d.colchon).replace(".", ",") + " meses de gasto; lo sano son 3.";
      if (pctCuo >= 30) { t = "Las cuotas se llevan el " + pctCuo + " % de lo que te entra, y eso es lo que más pesa sobre tus metas. " + t; q = "¿Qué deuda quisieras terminar primero?"; }
      if (sorp) q = "Dijiste que te sorprendió: «" + corto(sorp, 80) + "». ¿Qué harías distinto este mes con eso?";
    } else if (n === 3) {
      var camino = getV("d3_camino"), inv = sumaV("d3_activos"), aporte = sumaV("d3_aportes") || toNum(getV("d3_aporte"));
      if (camino === "no") {
        if (aporte) { var fv = Math.round(aporte * ((Math.pow(1 + 0.08 / 12, 120) - 1) / (0.08 / 12))); t = "Apartar " + cop(aporte) + " al mes durante 10 años sumaría cerca de " + cop(fv) + " a un 8 % anual (un supuesto educativo, no una promesa)." + (nec ? " Tus metas piden cerca de " + cop(nec) + " al mes." : ""); q = cual ? "¿Eso te acerca a " + cual + " o necesitas más?" : "¿Para qué te gustaría que trabajara esa plata?"; }
        else { t = "Empezar no tiene que ser grande: lo importante es que el primer aporte sea automático."; q = "¿Cuánto podrías apartar cada mes sin que se note en tu mes?"; }
      } else if (inv) {
        var por = {}; itemsDe("d3_activos").forEach(function (x) { if (!toNum(x.v)) return; var k = x.tj !== undefined && x.tj !== "" ? window.TIPOS_INV[+x.tj] : "Sin tipo"; por[k] = (por[k] || 0) + toNum(x.v); });
        var ks = Object.keys(por).sort(function (a, b) { return por[b] - por[a]; }), conc = Math.round(por[ks[0]] / inv * 100);
        if (conc >= 70) { t = "El " + conc + " % de lo que inviertes está en " + ks[0].toLowerCase() + ": si eso se mueve, se mueve casi todo tu portafolio."; q = cual ? "¿Esta plata es para " + cual + " o para otra cosa?" : "¿Para qué la tienes invertida?"; }
        else { t = "Tienes tu plata repartida en " + ks.length + " tipos de inversión: eso baja el riesgo."; q = cual ? "¿Cuál de estas inversiones sostiene " + cual + "?" : "¿Esta plata está pensada para alguna meta?"; }
      } else { t = "Todavía no pusiste inversiones ni un aporte posible, y está bien: es un punto de partida."; q = "¿Qué te frena hoy para empezar a invertir?"; }
    } else if (n === 4) {
      var carta = String(getV("d4_carta") || "").trim(), fr = corto(carta.split(/(?<=[.!?])\s+/)[0] || carta, 110);
      t = carta ? "Una frase de tu carta se me quedó: «" + fr + "». Es una promesa que puedes releer en diciembre de 2027." + (cual ? " Y se conecta con " + cual + "." : "") : "Todavía no escribiste tu carta: es la forma más bonita de ponerle fecha a tus metas.";
      q = "¿Cuál es la primera cosa de esa carta que harías en enero?";
    } else {
      var para = String(getV("d5_para") || "").trim();
      t = "En cinco días pusiste tus ingresos, tus deudas, tu plata y tus sueños en un solo lugar." + (nec && d.libre ? " Lo que te llevas: tus metas piden cerca de " + cop(nec) + " al mes y hoy te quedan libres " + cop(d.libre) + "." : "") + (para ? " Gracias por escribirle a " + para + "." : "");
      q = "¿Cuál será tu primer paso en enero?";
    }
    return { t: t, q: q };
  }
  function mostrarEmi(n, zona) {
    S.emi = S.emi || {}; var previa = S.emi[n] || {}, ins = insightDia(n);
    S.emi[n] = { t: ins.t, q: ins.q, r: previa.r || "" }; guardar();
    var rapido = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
    var av = '<img class="emi-av" src="assets/favicon.png" alt="">';
    zona.innerHTML = '<div class="emi-chat"><div class="emi-fila">' + av + '<div class="emi-col"><small>Emi</small><div class="burbuja" data-b1></div></div></div></div>';
    var chat = zona.querySelector(".emi-chat"), b1 = zona.querySelector("[data-b1]");
    function puntos(el) { el.className = "burbuja escribiendo"; el.innerHTML = "<i></i><i></i><i></i>"; }
    function texto(el) { el.className = "burbuja"; el.innerHTML = esc(S.emi[n].t) + '<div class="emi-q">' + esc(S.emi[n].q) + "</div>"; }
    function cierre() {
      var box = document.createElement("div"); box.className = "emi-resp";
      box.innerHTML = '<label for="emi-r">Nota mental <span class="suave">(opcional)</span></label><textarea id="emi-r" placeholder="Una idea, una decisión o lo que quieras recordar de esto.">' + esc(S.emi[n].r) + '</textarea><button class="btn secundario chico" type="button" id="emi-g">Guardar nota mental</button>';
      chat.appendChild(box);
      box.querySelector("#emi-g").onclick = function () { S.emi[n].r = box.querySelector("#emi-r").value.trim().slice(0, 1000); guardar(); sincronizar(true); this.textContent = "Anotada ✓"; };
    }
    if (rapido) { texto(b1); cierre(); return; }
    puntos(b1);
    var espera = new Promise(function (ok) { setTimeout(ok, 1400); });
    var kIA = clavePre(n), listaIA = !!cacheIA[kIA];
    var pIA = CFG.API ? (cacheIA[kIA] || (cacheIA[kIA] = iaDia(n))) : Promise.resolve(null);
    if (listaIA) espera = new Promise(function (ok) { setTimeout(ok, 600); });   // ya venía adelantado: casi sin esperar
    Promise.all([pIA, espera]).then(function (r) {
      if (r[0]) { S.emi[n].t = r[0].t; S.emi[n].q = r[0].q; S.emi[n].ia = true; guardar(); sincronizar(true); }
      texto(b1); setTimeout(cierre, 500);
    });
  }
  function nubes() {
    var out = "";
    for (var n = 1; n <= 5; n++) { var e = S.emi && S.emi[n]; if (e && e.r) out += '<div class="nube-nota" style="--r:' + [-2, 1.5, -1, 2, -1.5][n - 1] + 'deg"><small>Día ' + n + "</small><p>" + esc(e.r) + "</p></div>"; }
    return out ? '<div class="card nubes-card"><div class="res-label">Mis notas mentales</div><div class="nubes">' + out + "</div></div>" : "";
  }
  function analisisEmi() {
    var out = "";
    for (var n = 1; n <= 5; n++) { var e = S.emi && S.emi[n]; if (e && e.t) out += '<div class="r-item"><div class="r-q">Día ' + n + " · Emi vio esto</div><div class=\"r-a\">" + esc(e.t) + "<br><br><em>" + esc(e.q) + "</em>" + (e.r ? "<br><br><strong>Mi nota mental:</strong> " + esc(e.r) : "") + "</div></div>"; }
    return out ? '<div class="card emi-analisis"><div class="res-label">Lo que vio Emi</div>' + out + "</div>" : "";
  }
  function pagResumen() {
    var raiz = document.getElementById("app");
    pedirIdentidad(raiz, function () {
      var cuerpo = window.DIAS.map(seccionDia).join("");
      var ing = sumaV("d1_ing"), deu = sumaV("d2_deudas") + sumaV("d2_bienes", function (x) { return x.est === "pagando" ? toNum(x.debo) : 0; }), cuo = sumaV("d2_deudas", function (x) { return toNum(x.cuota); }), gas = sumaV("d2_gastos"), aho = sumaV("d1_ahorros"), inv = sumaV("d3_activos");
      var resumen =
        '<div class="card plan"><div class="res-label">Mi Wrapped financiero 2026</div><h2>' + esc(S.nombre) + "</h2><div class=\"tot\">" +
        (ing ? '<div><small>Ingresos al mes</small><b>' + cop(ing) + "</b></div>" : "") + (aho ? '<div><small>Ahorrado</small><b>' + cop(aho) + "</b></div>" : "") + (inv ? '<div><small>Invertido</small><b>' + cop(inv) + "</b></div>" : "") +
        (deu ? '<div><small>Debo</small><b>' + cop(deu) + "</b></div>" : "") + (cuo ? '<div><small>Cuotas al mes</small><b>' + cop(cuo) + "</b></div>" : "") + (gas ? '<div><small>Gastos al mes</small><b>' + cop(gas) + "</b></div>" : "") + "</div></div>";
      raiz.innerHTML =
        bandaDemo() + '<div class="dia-top"><a href="index.html' + pre() + '" class="volver">← Camino</a><img class="dia-logo" src="assets/logo-feminario.png" alt="Feminario"><span class="prog">' + hechos() + "/" + total() + "</span></div>" +
        '<div class="dia-head"><img class="dia-img" src="assets/st-poder.png" alt=""><h1>Mi Wrapped financiero</h1></div>' +
        '<div id="pdf-doc" class="pdf-doc"><div class="pdf-portada"><img src="assets/logo-feminario.png" alt="Feminario"><div class="res-label">Adviento Feminario 2026</div><h1>' + esc(S.nombre) + "</h1></div>" +
        resumen + nubes() + analisisEmi() + (cuerpo || '<p class="suave centro">Completa tu primer día y aquí aparece tu resumen.</p>') + '<p class="pdf-pie">Feminario · @feminario.co · Contenido educativo, no asesoría financiera personalizada.</p></div>' +
        '<div class="acciones"><button class="btn" id="pdf-go" type="button">Descargar mi PDF</button><a class="btn secundario" target="_blank" rel="noopener" href="' + esc(CFG.CLUB_URL) + '">Conocer el Club 365</a></div>' +
        '<p class="mini"><a href="#" id="copia">Guardar copia de mis datos</a> · <a href="#" id="borrar">Borrar mis datos</a></p><div class="aviso" id="pdf-av"></div>';
      var av = raiz.querySelector("#pdf-av");
      raiz.querySelector("#copia").onclick = function (e) { e.preventDefault(); var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: "application/json" })); a.download = "mi-adviento-feminario.json"; a.click(); };
      raiz.querySelector("#borrar").onclick = function (e) { e.preventDefault(); if (confirm("¿Borrar todo lo que escribiste en este dispositivo?")) { try { ALM.removeItem(KEY); } catch (e2) {} location.href = "index.html" + pre(); } };
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

  function tras(f) { return function () { consultarPanel(f); }; }
  window.CAL = { portada: tras(pagPortada), dia: tras(pagDia), resumen: tras(pagResumen) };
})();
