/* Calendario de adviento de Feminario · 5 días (30 nov al 4 dic de 2026).
   Privacidad: todo lo que escribe cada mujer se guarda SOLO en su navegador (localStorage). Nada se envía a Feminario ni a ningún servidor. */
(function () {
  var CFG = window.CAL_CFG, KEY = 'feminario_adviento_2026_v1', app = document.getElementById('app');
  var MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  var DIAS = [
    { n: 1, t: 'Construye tus metas', q: 'Tus ahorros, tus ingresos y las metas que quieres lograr.', ilus: 'ilus-diana.png' },
    { n: 2, t: 'Conoce tus deudas', q: 'Tus deudas y tus gastos, en un solo lugar.', ilus: 'ilus-cofre.png' },
    { n: 3, t: 'Invierte', q: 'Si ya inviertes, revisa tu portafolio. Si no, da tu primer paso.', ilus: 'ilus-arbol.png' },
    { n: 4, t: 'Sesión con Andre y Tina', q: 'Una carta para tu yo del futuro, escrita en conjunto.', ilus: 'ilus-casa.png' },
    { n: 5, t: 'Comunidad', q: 'Mesa de trabajo y una carta a una mujer que admiras.', ilus: 'ilus-rompecabezas.png' }
  ];
  var S = cargar();
  function cargar() { try { return JSON.parse(localStorage.getItem(KEY)) || { hecho: {} }; } catch (e) { return { hecho: {} }; } }
  function guardar() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  var esc = function (t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var num = function (v) { var n = parseFloat(String(v || '').replace(/[^\d.,-]/g, '').replace(/\./g, '').replace(',', '.')); return isFinite(n) ? n : 0; };
  var cop = function (n) { return '$' + Math.round(n).toLocaleString('es-CO'); };
  var preview = /[?&]preview=1/.test(location.search);
  function fechaDia(n) { return new Date(CFG.INICIO[0], CFG.INICIO[1] - 1, CFG.INICIO[2] + n - 1); }
  function abierta(n) { if (preview) return true; var h = new Date(); h = new Date(h.getFullYear(), h.getMonth(), h.getDate()); return h >= fechaDia(n); }
  var txtFecha = function (d) { return d.getDate() + ' de ' + MESES[d.getMonth()]; };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var val = function (id) { var e = document.getElementById(id); return e ? e.value : ''; };

  /* ---------- Portada ---------- */
  function portada() {
    var hechos = Object.keys(S.hecho).filter(function (k) { return S.hecho[k]; }).length;
    app.innerHTML =
      '<header class="portada"><img class="logo" src="assets/logo-feminario.png" alt="Feminario">' +
      '<div class="pill">Del 30 de noviembre al 4 de diciembre · A tu ritmo</div>' +
      '<h1>Calendario de <em>adviento</em></h1>' +
      '<p class="lead">Ahora son <strong>5 días</strong> para ordenar tu plata de una vez: construyes tus metas, conoces tus deudas, inviertes, le escribes a tu yo del futuro y compartes en comunidad. Al final te llevas tu <strong>Wrapped financiero 2026</strong>.</p></header>' +
      '<div class="priv">🔒 <b>Tu información es solo tuya.</b> Lo que escribes se guarda únicamente en este dispositivo: Feminario no puede verlo. Si cambias de celular o computador, descarga tu copia desde «Mi Wrapped».</div>' +
      '<label for="nombre">¿Cómo te llamas?</label><input id="nombre" placeholder="Tu nombre" value="' + esc(S.nombre) + '">' +
      '<div class="puertas">' + DIAS.map(function (d) {
        var ok = abierta(d.n);
        return '<button class="puerta ' + (S.hecho[d.n] ? 'hecha' : '') + '" data-dia="' + d.n + '"' + (ok ? '' : ' disabled') + '><span class="num">' + (S.hecho[d.n] ? '✓' : d.n) + '</span><span><b>Día ' + d.n + ' · ' + d.t + '</b><small>' + (ok ? d.q : 'Se abre el ' + txtFecha(fechaDia(d.n))) + '</small></span></button>';
      }).join('') + '</div>' +
      '<div class="btns"><button class="btn lima" id="verWrapped">✨ Ver mi Wrapped financiero' + (hechos ? ' (' + hechos + '/5)' : '') + '</button>' +
      (CFG.GRUPO_WA ? '<a class="btn sec" target="_blank" rel="noopener" href="' + esc(CFG.GRUPO_WA) + '">Entrar al grupo de WhatsApp</a>' : '<span class="nota" style="align-self:center">El enlace del grupo de WhatsApp llega muy pronto.</span>') + '</div>' +
      '<footer class="pie">Hecho con cariño por Feminario · <a href="' + CFG.INSTAGRAM + '" target="_blank" rel="noopener">@feminario.co</a><br>Contenido educativo, no asesoría financiera personalizada.</footer>';
    $('#nombre').addEventListener('input', function (e) { S.nombre = e.target.value.trim(); guardar(); });
    app.querySelectorAll('[data-dia]').forEach(function (b) { b.addEventListener('click', function () { dia(+b.dataset.dia); }); });
    $('#verWrapped').addEventListener('click', wrapped);
    window.scrollTo(0, 0);
  }

  /* ---------- Piezas ---------- */
  function cab(d) { return '<div class="dia-cab"><button class="volver" id="volver">← Volver</button><span class="nota">' + txtFecha(fechaDia(d.n)) + '</span></div><div class="card"><img class="ilus" src="assets/' + d.ilus + '" alt=""><h2>Día ' + d.n + ' · ' + d.t + '</h2><p class="nota" style="margin:0 0 8px">' + d.q + '</p>'; }
  function wa(texto) {
    return '<div class="wa"><b>💬 Dinámica en el grupo de WhatsApp</b><span class="nota">Cuéntale al grupo cómo te fue (sin cifras si prefieres). Puedes usar este mensaje:</span><textarea id="waTxt" readonly>' + esc(texto) + '</textarea>' +
      '<div class="btns" style="margin-top:6px"><button class="btn sec" id="copiar">Copiar mensaje</button>' + (CFG.GRUPO_WA ? '<a class="btn" target="_blank" rel="noopener" href="' + esc(CFG.GRUPO_WA) + '">Abrir el grupo</a>' : '<span class="nota" style="align-self:center">El grupo se abre muy pronto.</span>') + '</div></div>';
  }
  function pie(n) { return '<div class="btns"><button class="btn" id="hecho">' + (S.hecho[n] ? 'Guardar cambios' : 'Guardar y marcar como hecho') + '</button><button class="btn sec" id="volver2">Volver</button></div></div>'; }
  function enlazar(n, recoger) {
    $('#volver').onclick = portada; $('#volver2').onclick = portada;
    var c = $('#copiar'); if (c) c.onclick = function () { var t = $('#waTxt'); t.select(); try { navigator.clipboard.writeText(t.value); } catch (e) { document.execCommand('copy'); } c.textContent = 'Copiado ✓'; };
    $('#hecho').onclick = function () { recoger(); S.hecho[n] = true; guardar(); if (window.lanzarConfeti) window.lanzarConfeti({ ntp: 120 }); setTimeout(portada, 900); };
    window.scrollTo(0, 0);
  }
  function filas(id, items, campos, nuevo) {
    return items.map(function (it, i) {
      return '<div class="fila" data-f="' + id + '" data-i="' + i + '">' + campos.map(function (c) { return '<div><label>' + c.l + '</label><input data-k="' + c.k + '" ' + (c.num ? 'inputmode="numeric"' : '') + ' value="' + esc(it[c.k]) + '"></div>'; }).join('') + '<button class="x" data-del="' + id + '" data-i="' + i + '" aria-label="Quitar">×</button></div>';
    }).join('');
  }
  function leerFilas(id) { var out = []; app.querySelectorAll('[data-f="' + id + '"]').forEach(function (f) { var o = {}; f.querySelectorAll('[data-k]').forEach(function (i) { o[i.dataset.k] = i.value; }); out.push(o); }); return out; }
  function listaEditable(id, campos, vacio, texto) {
    var cont = document.getElementById(id);
    function pintar(items) {
      cont.innerHTML = filas(id, items, campos) + '<button class="btn sec" id="mas-' + id + '" type="button">+ ' + texto + '</button>';
      cont.querySelectorAll('[data-del]').forEach(function (b) { b.onclick = function () { var xs = leerFilas(id); xs.splice(+b.dataset.i, 1); pintar(xs.length ? xs : [Object.assign({}, vacio)]); }; });
      $('#mas-' + id).onclick = function () { var xs = leerFilas(id); xs.push(Object.assign({}, vacio)); pintar(xs); };
    }
    return pintar;
  }

  /* ---------- Los 5 días ---------- */
  function dia(n) {
    var d = DIAS[n - 1];
    if (n === 1) {
      var m = S.d1 || { ahorros: '', ingresos: '', metas: [{ t: '', monto: '', fecha: '' }] };
      app.innerHTML = cab(d) +
        '<p>Una meta sin número es un deseo. Hoy les ponemos nombre, monto y fecha.</p>' +
        '<label for="ahorros">¿Cuánto tienes ahorrado hoy?</label><input id="ahorros" inputmode="numeric" placeholder="$" value="' + esc(m.ahorros) + '">' +
        '<label for="ingresos">¿Cuánto ingresa al mes (en promedio)?</label><input id="ingresos" inputmode="numeric" placeholder="$" value="' + esc(m.ingresos) + '">' +
        '<h3>Tus metas</h3><div id="metas"></div>' +
        wa('Hoy construí mis metas para 2027 💜 Mi meta principal: ' + (m.metas[0] && m.metas[0].t ? m.metas[0].t : '[tu meta]') + '. ¿Cuál es la tuya?') + pie(n);
      listaEditable('metas', [{ k: 't', l: 'Meta' }, { k: 'monto', l: 'Monto', num: 1 }, { k: 'fecha', l: 'Para cuándo' }], { t: '', monto: '', fecha: '' }, 'Agregar otra meta')(m.metas);
      enlazar(n, function () { S.d1 = { ahorros: val('ahorros'), ingresos: val('ingresos'), metas: leerFilas('metas').filter(function (x) { return x.t; }) }; });
    }
    if (n === 2) {
      var q = S.d2 || { deudas: [{ n: '', saldo: '', cuota: '' }], gastos: { vivienda: '', comida: '', transporte: '', otros: '' } };
      app.innerHTML = cab(d) +
        '<p>Una deuda no define quién eres: es un dato, no una sentencia. Verlo escrito pesa menos que imaginarlo.</p>' +
        '<h3>Tus deudas</h3><div id="deudas"></div>' +
        '<h3>Tus gastos al mes</h3>' + [['vivienda', 'Vivienda y servicios'], ['comida', 'Comida'], ['transporte', 'Transporte'], ['otros', 'Todo lo demás']].map(function (g) { return '<label for="g-' + g[0] + '">' + g[1] + '</label><input id="g-' + g[0] + '" inputmode="numeric" placeholder="$" value="' + esc(q.gastos[g[0]]) + '">'; }).join('') +
        '<div class="tot" id="tot"></div>' +
        wa('Hoy puse mis deudas y gastos en un solo lugar y me dio claridad 💜 ¿Qué te sorprendió a ti?') + pie(n);
      listaEditable('deudas', [{ k: 'n', l: 'A quién le debes' }, { k: 'saldo', l: 'Cuánto debes', num: 1 }, { k: 'cuota', l: 'Cuota al mes', num: 1 }], { n: '', saldo: '', cuota: '' }, 'Agregar otra deuda')(q.deudas);
      var tot = function () { var ds = leerFilas('deudas'), td = ds.reduce(function (a, x) { return a + num(x.saldo); }, 0), tc = ds.reduce(function (a, x) { return a + num(x.cuota); }, 0), tg = ['vivienda', 'comida', 'transporte', 'otros'].reduce(function (a, k) { return a + num(val('g-' + k)); }, 0), ing = num((S.d1 || {}).ingresos);
        $('#tot').innerHTML = '<div><small>Total que debes</small><b>' + cop(td) + '</b></div><div><small>Cuotas al mes</small><b>' + cop(tc) + '</b></div><div><small>Gastos al mes</small><b>' + cop(tg) + '</b></div>' + (ing ? '<div><small>De tus ingresos se va en cuotas y gastos</small><b>' + Math.round(((tc + tg) / ing) * 100) + '%</b></div>' : ''); };
      app.addEventListener('input', tot); tot();
      enlazar(n, function () { S.d2 = { deudas: leerFilas('deudas').filter(function (x) { return x.n || x.saldo; }), gastos: { vivienda: val('g-vivienda'), comida: val('g-comida'), transporte: val('g-transporte'), otros: val('g-otros') } }; });
    }
    if (n === 3) {
      var p = S.d3 || { invierte: '', activos: [{ n: '', monto: '' }], monto: '', objetivo: '' };
      app.innerHTML = cab(d) +
        '<p>No necesitas mucho para empezar. Necesitas empezar. Contenido educativo, no asesoría personalizada.</p>' +
        '<label for="inv">¿Ya inviertes?</label><select id="inv"><option value="">Elige…</option><option value="si"' + (p.invierte === 'si' ? ' selected' : '') + '>Sí, ya invierto</option><option value="no"' + (p.invierte === 'no' ? ' selected' : '') + '>Todavía no he invertido</option></select>' +
        '<div id="si" style="display:none"><h3>Tu portafolio</h3><p class="nota">Pon en qué tienes tu plata. Diversificar es repartir el riesgo.</p><div id="activos"></div><div id="dist"></div></div>' +
        '<div id="no" style="display:none"><h3>Tu primer paso</h3><p class="nota">Guardar es el primer paso; invertir hace que tu plata trabaje. Empieza con un monto que no te estrese.</p>' +
        '<label for="monto">¿Cuánto podrías apartar al mes para empezar?</label><input id="monto" inputmode="numeric" placeholder="$" value="' + esc(p.monto) + '">' +
        '<label for="obj">¿Para qué lo harías?</label><input id="obj" value="' + esc(p.objetivo) + '">' +
        '<p class="nota"><a href="' + CFG.CALC_URL + '" target="_blank" rel="noopener">Prueba la calculadora de inversión</a> · <a href="' + CFG.PORTAFOLIO_URL + '" target="_blank" rel="noopener">Construye tu portafolio</a></p></div>' +
        wa('Hoy di un paso con mi plata y mis inversiones 💜 ¿Tú ya inviertes o estás empezando?') + pie(n);
      listaEditable('activos', [{ k: 'n', l: 'Dónde está' }, { k: 'monto', l: 'Cuánto', num: 1 }], { n: '', monto: '' }, 'Agregar otra inversión')(p.activos);
      var cambia = function () { var v = val('inv'); $('#si').style.display = v === 'si' ? 'block' : 'none'; $('#no').style.display = v === 'no' ? 'block' : 'none';
        var as = leerFilas('activos'), t = as.reduce(function (a, x) { return a + num(x.monto); }, 0);
        $('#dist').innerHTML = t ? as.filter(function (x) { return num(x.monto); }).map(function (x) { var pc = Math.round((num(x.monto) / t) * 100); return '<div class="nota">' + esc(x.n || 'Sin nombre') + ' · ' + pc + '%</div><div class="barra"><i style="width:' + pc + '%"></i></div>'; }).join('') + (as.filter(function (x) { return num(x.monto); }).length < 2 ? '<p class="nota">Todo está en un solo lugar: vale la pena mirar cómo repartir el riesgo.</p>' : '') : ''; };
      app.addEventListener('input', cambia); app.addEventListener('change', cambia); cambia();
      enlazar(n, function () { S.d3 = { invierte: val('inv'), activos: leerFilas('activos').filter(function (x) { return x.n || x.monto; }), monto: val('monto'), objetivo: val('obj') }; });
    }
    if (n === 4) {
      var c4 = S.d4 || { carta: '' };
      app.innerHTML = cab(d) +
        '<p><b>Sesión en conjunto con Andre y Tina:</b> ' + esc(CFG.SESION.cuando) + '.' + (CFG.SESION.enlace ? ' <a href="' + esc(CFG.SESION.enlace) + '" target="_blank" rel="noopener">Entrar a la sesión</a>' : ' El enlace lo compartimos en el grupo de WhatsApp.') + '</p>' +
        '<p>Tu yo de 2027 ya existe. ¿Qué le dejas escrito? Puedes pensar en: qué le quieres contar, qué le prometes y qué le agradeces por adelantado.</p>' +
        '<label for="carta4">Querida yo del futuro…</label><textarea id="carta4" placeholder="Querida yo de diciembre de 2027…">' + esc(c4.carta) + '</textarea>' +
        '<p class="nota">Lo que escribes hoy se vuelve una promesa que puedes cumplir. Se guarda solo en tu dispositivo: guárdala también en tu PDF para abrirla en un año.</p>' +
        wa('Hoy le escribí una carta a mi yo del futuro con Andre y Tina 💜') + pie(n);
      enlazar(n, function () { S.d4 = { carta: val('carta4') }; });
    }
    if (n === 5) {
      var c5 = S.d5 || { para: '', carta: '' };
      app.innerHTML = cab(d) +
        '<p>Hay una mujer que te enseñó sin saberlo. Hoy trabajamos en comunidad: piensa en ella, en qué aprendiste de ella y qué cambiaste gracias a eso.</p>' +
        '<label for="para">¿A quién le escribes?</label><input id="para" placeholder="Su nombre (o «una mujer que admiro»)" value="' + esc(c5.para) + '">' +
        '<label for="carta5">Tu carta</label><textarea id="carta5" placeholder="Querida…">' + esc(c5.carta) + '</textarea>' +
        '<div class="btns"><button class="btn sec" id="envia">Enviársela por WhatsApp</button></div>' +
        '<p class="nota">Compartir lo aprendido lo fija, y le abre la puerta a ella.</p>' +
        wa('Hoy le escribí una carta a una mujer que admiro y me sentí en comunidad 💜 ¿A quién le escribirías tú?') + pie(n) +
        '<div class="card" style="text-align:center"><h3>¿Quieres seguir acompañada?</h3><p class="nota">El Club 365 es una membresía anual para ordenar tus finanzas, aprender a invertir y construir tu portafolio con otras mujeres.</p><a class="btn" href="' + CFG.CLUB_URL + '" target="_blank" rel="noopener">Conocer el Club 365</a></div>';
      $('#envia').onclick = function () { window.open('https://wa.me/?text=' + encodeURIComponent(val('carta5')), '_blank'); };
      enlazar(n, function () { S.d5 = { para: val('para'), carta: val('carta5') }; });
    }
  }

  /* ---------- Wrapped financiero ---------- */
  function wrapped() {
    var d1 = S.d1 || {}, d2 = S.d2 || {}, d3 = S.d3 || {}, d4 = S.d4 || {}, d5 = S.d5 || {};
    var td = (d2.deudas || []).reduce(function (a, x) { return a + num(x.saldo); }, 0), tc = (d2.deudas || []).reduce(function (a, x) { return a + num(x.cuota); }, 0);
    var tg = d2.gastos ? ['vivienda', 'comida', 'transporte', 'otros'].reduce(function (a, k) { return a + num(d2.gastos[k]); }, 0) : 0;
    var seccion = function (t, h) { return h ? '<div class="card"><h3 style="margin-top:0">' + t + '</h3>' + h + '</div>' : ''; };
    var inv = d3.invierte === 'si' ? (d3.activos || []).map(function (x) { return esc(x.n) + ': ' + cop(num(x.monto)); }).join('<br>') : d3.invierte === 'no' ? 'Mi primer paso: ' + (d3.monto ? cop(num(d3.monto)) + ' al mes' : 'por definir') + (d3.objetivo ? ' para ' + esc(d3.objetivo) : '') : '';
    app.innerHTML = '<div class="dia-cab"><button class="volver" id="volver">← Volver</button></div>' +
      '<div id="wrapped"><img class="logo" src="assets/logo-feminario.png" alt="Feminario"><h1 style="text-align:center">Mi Wrapped <em>financiero 2026</em></h1><p class="lead" style="text-align:center">' + esc(S.nombre || 'Tu') + (S.nombre ? ', este es tu' : ' resumen,') + ' punto de partida. 💜</p>' +
      seccion('Mis números', (d1.ahorros || d1.ingresos) ? '<div class="tot"><div><small>Ahorrado</small><b>' + cop(num(d1.ahorros)) + '</b></div><div><small>Ingreso mensual</small><b>' + cop(num(d1.ingresos)) + '</b></div></div>' : '') +
      seccion('Mis metas', (d1.metas || []).map(function (m) { return '• ' + esc(m.t) + (m.monto ? ' · ' + cop(num(m.monto)) : '') + (m.fecha ? ' · ' + esc(m.fecha) : ''); }).join('<br>')) +
      seccion('Mis deudas y gastos', (td || tg) ? '<div class="tot"><div><small>Debo en total</small><b>' + cop(td) + '</b></div><div><small>Cuotas al mes</small><b>' + cop(tc) + '</b></div><div><small>Gastos al mes</small><b>' + cop(tg) + '</b></div></div>' : '') +
      seccion('Mis inversiones', inv) +
      seccion('Carta a mi yo del futuro', d4.carta ? '<p style="white-space:pre-wrap;margin:0">' + esc(d4.carta) + '</p>' : '') +
      seccion('Carta a ' + esc(d5.para || 'una mujer que admiro'), d5.carta ? '<p style="white-space:pre-wrap;margin:0">' + esc(d5.carta) + '</p>' : '') +
      '<p class="nota" style="text-align:center">feminario.co · Contenido educativo, no asesoría financiera personalizada.</p></div>' +
      '<div class="btns"><button class="btn" id="pdf">Descargar mi Wrapped (PDF)</button><button class="btn sec" id="resp">Guardar copia de mis datos</button><label class="btn sec" style="margin:0">Cargar mi copia<input type="file" id="carga" accept=".json" hidden></label><button class="btn sec" id="borrar" style="color:#b3261e;border-color:#b3261e">Borrar mis datos</button></div>' +
      '<p class="nota">Tu copia es un archivo que se guarda en tu dispositivo. Feminario no recibe nada.</p>';
    $('#volver').onclick = portada;
    $('#pdf').onclick = function () { if (window.html2pdf) window.html2pdf().set({ margin: 8, filename: 'Mi-Wrapped-financiero-2026.pdf', html2canvas: { scale: 2 }, jsPDF: { format: 'a4' } }).from($('#wrapped')).save(); else window.print(); };
    $('#resp').onclick = function () { var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S)], { type: 'application/json' })); a.download = 'mi-adviento-feminario.json'; a.click(); };
    $('#carga').onchange = function (e) { var f = e.target.files[0]; if (!f) return; var r = new FileReader(); r.onload = function () { try { S = JSON.parse(r.result); guardar(); portada(); } catch (x) { alert('Ese archivo no es una copia válida.'); } }; r.readAsText(f); };
    $('#borrar').onclick = function () { if (confirm('¿Borrar todo lo que escribiste en este dispositivo?')) { S = { hecho: {} }; guardar(); portada(); } };
    window.scrollTo(0, 0);
  }

  portada();
})();
