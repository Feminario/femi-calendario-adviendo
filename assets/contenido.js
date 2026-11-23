/* Contenido de los 5 días del calendario de adviento (30 nov al 4 dic de 2026). Para cambiar un texto, edita aquí.
   Tipos de bloque: reflex (texto libre), nums (montos), tabla (filas con categoría), embudo (dos caminos), link, wa (mensaje para el grupo), custom. */
window.ACTOS = [{ id: 1 }, { id: 2 }, { id: 3 }];

var CAT_INGRESOS = ["Salario", "Negocio propio", "Trabajo independiente", "Arriendos", "Pensión", "Ayuda familiar", "Otro"];
var CAT_METAS = ["Fondo de emergencia", "Casa o vivienda", "Un viaje", "Estudio", "Emprender", "Mi retiro", "Salir de deudas", "Un carro", "Otra"];
var CAT_DEUDAS = ["Tarjeta de crédito", "Crédito de libre inversión", "Hipoteca", "Crédito de vehículo", "Crédito educativo", "Libranza", "Familiares o amigas", "Fiado o cuentas pendientes", "Otra"];
var CAT_GASTOS = ["Vivienda", "Servicios", "Mercado", "Transporte", "Salud", "Educación", "Hijos o cuidado", "Ocio y salidas", "Suscripciones", "Ropa y cuidado personal", "Mascotas", "Otro"];
var CAT_INV = ["CDT", "Fondo de inversión", "Acciones", "ETF", "Cripto", "Finca raíz", "Pensión voluntaria", "Dólares u oro", "Otra"];

window.DIAS = [
  { n: 1, acto: 1, emoji: "", img: "st-sonar.png", titulo: "Tus sueños, con nombre y número", reel: "", gancho: "",
    bloques: [
      { t: "tabla", id: "d1_ing", titulo: "Tus ingresos al mes", sub: "Si varían, pon el promedio. Puedes agregar varias fuentes.", cats: CAT_INGRESOS, una: "fuente de ingreso", calc: "ingresos", cols: [{ k: "a", l: "Promedio al mes", moneda: true }] },
      { t: "nums", titulo: "Tu ahorro", campos: [{ id: "d1_ahorros", label: "¿Cuánto tienes ahorrado hoy?", moneda: true, ph: "$" }] },
      { t: "tabla", id: "d1_metas", titulo: "Tus metas", cats: CAT_METAS, una: "meta", cols: [{ k: "n", l: "¿Qué quieres lograr?" }, { k: "a", l: "Cuánto cuesta", moneda: true }, { k: "b", l: "Para cuándo" }] },
      { t: "wa", texto: "Hoy construí mis metas para 2027. ¿Cuál es la tuya?" }
    ] },

  { n: 2, acto: 1, emoji: "", img: "st-laptop.png", titulo: "Tus deudas, sin miedo ni culpa", reel: "", gancho: "",
    bloques: [
      { t: "tabla", id: "d2_deudas", titulo: "Tus deudas", cats: CAT_DEUDAS, una: "deuda", calc: "deudas", cols: [{ k: "n", l: "Detalle (entidad o persona)" }, { k: "a", l: "Cuánto debes", moneda: true }, { k: "b", l: "Valor de la cuota", moneda: true }] },
      { t: "tabla", id: "d2_gastos", titulo: "Tus gastos al mes", cats: CAT_GASTOS, una: "gasto", calc: "gastos", cols: [{ k: "a", l: "Valor al mes", moneda: true }] },
      { t: "reflex", id: "d2_sorpresa", label: "¿Qué te sorprendió al verlo todo junto?", ph: "Lo que sea es válido." },
      { t: "wa", texto: "Hoy puse mis deudas y mis gastos en un solo lugar y me dio claridad. ¿Qué te sorprendió a ti?" }
    ] },

  { n: 3, acto: 2, emoji: "", img: "st-hongo.png", titulo: "Que tu plata trabaje por ti", reel: "", gancho: "",
    bloques: [
      { t: "embudo", id: "d3_camino", titulo: "¿Dónde estás hoy?", ops: [
        { v: "si", t: "Ya invierto", sub: "Revisemos tu portafolio", img: "st-poder.png", bloques: [
          { t: "tabla", id: "d3_activos", titulo: "Tu portafolio", cats: CAT_INV, una: "inversión", calc: "portafolio", cols: [{ k: "a", l: "Cuánto tienes", moneda: true }] } ] },
        { v: "no", t: "Nunca he invertido", sub: "Demos tu primer paso", img: "st-hongo.png", bloques: [
          { t: "nums", titulo: "Tu primer paso", calc: "aporte3", campos: [{ id: "d3_aporte", label: "¿Cuánto podrías apartar al mes para empezar?", moneda: true, ph: "$" }] },
          { t: "link", url: "calc110", texto: "Probar la calculadora de inversión" } ] } ] },
      { t: "wa", texto: "Hoy di un paso con mis inversiones. ¿Tú ya inviertes o estás empezando?" }
    ] },

  { n: 4, acto: 3, emoji: "", img: "st-mapa.png", titulo: "Una carta para tu yo del futuro", reel: "", gancho: "",
    bloques: [
      { t: "custom", k: "sesion" },
      { t: "reflex", id: "d4_carta", label: "Querida yo de diciembre de 2027…", ph: "Qué le quieres contar, qué le prometes y qué le agradeces por adelantado." },
      { t: "wa", texto: "Hoy le escribí una carta a mi yo del futuro con Andre y Tina." }
    ] },

  { n: 5, acto: 3, emoji: "", img: "st-planta.png", titulo: "Gracias, mujer que me inspiró", reel: "", gancho: "",
    bloques: [
      { t: "reflex", id: "d5_para", label: "¿A quién le escribes?", ph: "Su nombre, o «una mujer que admiro»." },
      { t: "reflex", id: "d5_carta", label: "Tu carta", ph: "Qué aprendiste de ella y qué cambiaste gracias a eso." },
      { t: "custom", k: "enviar_carta" }
    ] }
];
