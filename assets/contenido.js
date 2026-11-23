/* Contenido de los 5 días del calendario de adviento (30 nov al 4 dic de 2026). Para cambiar un texto o poner el video del día, edita aquí.
   reel: pega el enlace del reel de Instagram del día (https://www.instagram.com/reel/XXXX/). Vacío = «video próximamente».
   Tipos de bloque: p, nota, reflex, chips, nums, filas, link, wa, custom. La dinámica del día se comparte en el grupo de WhatsApp (bloque wa). */
window.ACTOS = [
  { id: 1, nombre: "Empezamos por ti", sub: "Lo que sueñas y lo que tienes hoy", color: "#C2CBFF" },
  { id: 2, nombre: "Tu plata en movimiento", sub: "Pasar de guardar a hacerla crecer", color: "#DFF3AF" },
  { id: 3, nombre: "Juntas", sub: "Tu yo del futuro y las mujeres que te inspiran", color: "#F9E1FF" }
];

window.DIAS = [
  { n: 1, acto: 1, emoji: "", img: "st-sonar.png", titulo: "Tus sueños, con nombre y número", reel: "",
    gancho: "Soñar es gratis, pero un sueño con número y fecha se vuelve plan. Hoy empezamos por ahí.",
    bloques: [
      { t: "nums", titulo: "Tu punto de partida", calc: "ahorro_meses", campos: [
        { id: "d1_ahorros", label: "¿Cuánto tienes ahorrado hoy?", moneda: true, ph: "$" },
        { id: "d1_ingresos", label: "¿Cuánto ingresa al mes, en promedio?", moneda: true, ph: "$" } ] },
      { t: "filas", id: "d1_metas", n: 3, sinhora: true, titulo: "Tus metas (qué quieres lograr y cuánto cuesta)", ph: "Ej: fondo de emergencia" },
      { t: "reflex", id: "d1_cuando", label: "¿Para cuándo quieres lograr tu meta principal?", ph: "Ej: diciembre de 2027" },
      { t: "wa", texto: "Hoy construí mis metas para 2027 💜 Mi meta principal es [tu meta]. ¿Cuál es la tuya?" }
    ] },

  { n: 2, acto: 1, emoji: "", img: "st-laptop.png", titulo: "Tus deudas, sin miedo ni culpa", reel: "",
    gancho: "Una deuda no define quién eres: es un dato, no una sentencia. Hoy la miramos juntas, sin culpa.",
    bloques: [
      { t: "filas", id: "d2_deudas", n: 5, sinhora: true, titulo: "Tus deudas (a quién y cuánto debes)", ph: "Ej: tarjeta de crédito" },
      { t: "nums", titulo: "Tus gastos al mes", calc: "deudas_gastos", campos: [
        { id: "d2_vivienda", label: "Vivienda y servicios", moneda: true, ph: "$" },
        { id: "d2_comida", label: "Comida", moneda: true, ph: "$" },
        { id: "d2_transporte", label: "Transporte", moneda: true, ph: "$" },
        { id: "d2_otros", label: "Todo lo demás", moneda: true, ph: "$" } ] },
      { t: "reflex", id: "d2_sorpresa", label: "¿Qué te sorprendió al verlo todo junto?", ph: "Lo que sea es válido." },
      { t: "wa", texto: "Hoy puse mis deudas y mis gastos en un solo lugar y me dio claridad 💜 ¿Qué te sorprendió a ti?" }
    ] },

  { n: 3, acto: 2, emoji: "", img: "st-hongo.png", titulo: "Que tu plata trabaje por ti", reel: "",
    gancho: "Si ya inviertes, hoy revisamos tu portafolio. Si nunca empezaste, hoy das tu primer paso.",
    bloques: [
      { t: "chips", id: "d3_invierte", label: "¿Ya inviertes?", opts: ["Sí, ya invierto", "Todavía no he invertido"] },
      { t: "filas", id: "d3_activos", n: 5, sinhora: true, titulo: "Si ya inviertes: ¿dónde está tu plata y cuánto?", ph: "Ej: CDT, fondo, acciones…" },
      { t: "nums", titulo: "Si aún no inviertes: tu primer paso", calc: "aporte3", campos: [
        { id: "d3_aporte", label: "¿Cuánto podrías apartar al mes para empezar?", moneda: true, ph: "$" } ] },
      { t: "link", url: "calc110", texto: "Probar la calculadora de inversión" },
      { t: "link", url: "portafolio", texto: "Construye tu portafolio" },
      { t: "wa", texto: "Hoy di un paso con mis inversiones 💜 ¿Tú ya inviertes o estás empezando?" }
    ] },

  { n: 4, acto: 3, emoji: "", img: "st-mapa.png", titulo: "Una carta para tu yo del futuro", reel: "",
    gancho: "Tu yo de 2027 ya existe. Hoy le escribimos juntas, en una sesión con Andre y Tina.",
    bloques: [
      { t: "custom", k: "sesion" },
      { t: "reflex", id: "d4_carta", label: "Querida yo de diciembre de 2027…", ph: "Escribe con calma. Nadie más puede ver esto: se queda en tu dispositivo." },
      { t: "wa", texto: "Hoy le escribí una carta a mi yo del futuro con Andre y Tina 💜" }
    ] },

  { n: 5, acto: 3, emoji: "", img: "st-planta.png", titulo: "Gracias, mujer que me inspiró", reel: "",
    gancho: "Hay una mujer que te enseñó sin saberlo. Hoy trabajamos en comunidad y le escribes para darle las gracias.",
    bloques: [
      { t: "reflex", id: "d5_para", label: "¿A quién le escribes?", ph: "Su nombre, o «una mujer que admiro»." },
      { t: "reflex", id: "d5_carta", label: "Tu carta", ph: "Querida…" },
      { t: "custom", k: "enviar_carta" },
      { t: "wa", texto: "Hoy le escribí una carta a una mujer que admiro y me sentí en comunidad 💜 ¿A quién le escribirías tú?" },
      { t: "custom", k: "plan" }
    ] }
];
