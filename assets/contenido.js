/* Contenido de los 5 días del calendario de adviento (30 nov al 4 dic de 2026). Para cambiar un texto, edita aquí. Ningún día lleva video.
   Tipos de bloque: reflex (texto libre), nums (montos), tabla (filas con categoría, para las metas), bal (balance con las mismas opciones del artefacto
   de diciembre: ingreso fijo/variable, gasto fijo/variable, tipo de inversión, tipo de deuda, bien «ya es mío / lo estoy pagando»), embudo (dos caminos), link, wa, custom. */
window.ACTOS = [
  { id: 1, nombre: "Empezamos por ti", sub: "Lo que sueñas y lo que tienes hoy", color: "#C2CBFF" },
  { id: 2, nombre: "Tu plata en movimiento", sub: "Pasar de guardar a hacerla crecer", color: "#DFF3AF" },
  { id: 3, nombre: "Juntas", sub: "Tu yo del futuro y las mujeres que te inspiran", color: "#F9E1FF" }
];

var CAT_METAS = ["Fondo de emergencia", "Casa o vivienda", "Un viaje", "Estudio", "Emprender", "Mi retiro", "Salir de deudas", "Un carro", "Otra"];
// Las mismas opciones del artefacto de diciembre
window.TIPOS_INV = ["CDT y renta fija", "Fondos de inversión", "Acciones y ETF", "Criptomonedas", "Finca raíz", "Pensión voluntaria o cesantías invertidas", "Dólares u oro", "Otra inversión"];
window.TIPOS_DEUDA = ["Tarjeta de crédito", "Crédito de libre inversión", "Crédito de vivienda", "Crédito de vehículo", "Crédito educativo", "Familia o amigas", "Fiado u otra deuda"];

window.DIAS = [
  { n: 1, acto: 1, img: "st-sonar.png", titulo: "Tus sueños, con nombre y número",
    bloques: [
      { t: "bal", id: "d1_ing", titulo: "Lo que entra cada mes", tipo: "ingreso", una: "ingreso", ph: "Salario, negocio, arriendo, pensión…", calc: "ingresos" },
      { t: "bal", id: "d1_ahorros", titulo: "Lo que tengo ahorrado", una: "ahorro", ph: "Cuenta de ahorros, efectivo, fondo de emergencia…", calc: "ahorro" },
      { t: "tabla", id: "d1_metas", titulo: "Tus metas", cats: CAT_METAS, una: "meta", cols: [{ k: "n", l: "¿Qué quieres lograr?" }, { k: "a", l: "Costo", moneda: true }, { k: "b", l: "Para cuándo", fecha: true }] },
      { t: "wa", texto: "Hoy construí mis metas para 2027. ¿Cuál es la tuya?" }
    ] },

  { n: 2, acto: 1, img: "st-laptop.png", titulo: "Tus deudas, sin miedo ni culpa",
    bloques: [
      { t: "bal", id: "d2_deudas", titulo: "Lo que debo", tipo: "deuda", una: "deuda", ph: "¿A quién o dónde? (opcional)", cuota: true, calc: "deudas" },
      { t: "bal", id: "d2_bienes", titulo: "Mis bienes", tipo: "bien", una: "bien", ph: "Casa, carro, negocio, terreno…" },
      { t: "bal", id: "d2_gastos", titulo: "Lo que gasto cada mes", tipo: "gasto", una: "gasto", ph: "Vivienda, mercado, transporte, salidas…", calc: "gastos" },
      { t: "reflex", id: "d2_sorpresa", label: "¿Qué te sorprendió al verlo todo junto?", ph: "Lo que sea es válido." },
      { t: "wa", texto: "Hoy puse mis deudas y mis gastos en un solo lugar y me dio claridad. ¿Qué te sorprendió a ti?" }
    ] },

  { n: 3, acto: 2, img: "st-hongo.png", titulo: "Que tu plata trabaje por ti",
    bloques: [
      { t: "embudo", id: "d3_camino", titulo: "¿Dónde estás hoy?", ops: [
        { v: "si", t: "Ya invierto", sub: "Revisemos tu portafolio", img: "st-poder.png", bloques: [
          { t: "bal", id: "d3_activos", titulo: "Mis inversiones", tipo: "inversion", una: "inversión", ph: "¿Dónde la tienes? (opcional)", calc: "portafolio" },
          { t: "bal", id: "d3_aportes", titulo: "Lo que ahorro o invierto cada mes", una: "aporte", ph: "Cuota del fondo, CDT mensual, ahorro programado…" } ] },
        { v: "no", t: "Nunca he invertido", sub: "Demos tu primer paso", img: "st-hongo.png", bloques: [
          { t: "nums", titulo: "Tu primer paso", calc: "aporte3", campos: [{ id: "d3_aporte", label: "¿Cuánto podrías apartar al mes para empezar?", moneda: true, ph: "$" }] },
          { t: "link", url: "calc110", texto: "Probar la calculadora de inversión" } ] } ] },
      { t: "wa", texto: "Hoy di un paso con mis inversiones. ¿Tú ya inviertes o estás empezando?" }
    ] },

  { n: 4, acto: 3, img: "st-mapa.png", titulo: "Una carta para tu yo del futuro",
    bloques: [
      { t: "custom", k: "sesion" },
      { t: "reflex", id: "d4_carta", label: "Querida yo de diciembre de 2027…", ph: "Qué le quieres contar, qué le prometes y qué le agradeces por adelantado." },
      { t: "wa", texto: "Hoy le escribí una carta a mi yo del futuro con Andre y Tina." }
    ] },

  { n: 5, acto: 3, img: "st-planta.png", titulo: "Gracias, mujer que me inspiró",
    bloques: [
      { t: "reflex", id: "d5_para", label: "¿A quién le escribes?", ph: "Su nombre, o «una mujer que admiro»." },
      { t: "reflex", id: "d5_carta", label: "Tu carta", ph: "Qué aprendiste de ella y qué cambiaste gracias a eso." },
      { t: "custom", k: "enviar_carta" }
    ] }
];
