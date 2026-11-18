/* Contenido de los 15 días. Para cambiar un texto o poner el video del día, edita aquí.
   reel: pega el enlace del reel de Instagram del día (https://www.instagram.com/reel/XXXX/). Vacío = «video próximamente».
   Tipos de bloque: p, nota, reflex, chips, nums, filas, link, custom */
window.ACTOS = [
  { id: 1, nombre: "Tus metas", sub: "El dolor de lo que no se cumplió", color: "#C2CBFF" },
  { id: 2, nombre: "Tu punto de partida", sub: "Dónde estás hoy, sin juicio", color: "#DFF3AF" },
  { id: 3, nombre: "Tu camino", sub: "De la meta al hábito", color: "#F9E1FF" }
];

window.DIAS = [
  { n: 1, acto: 1, emoji: "🎯", titulo: "La meta que sigues cargando", reel: "",
    gancho: "Hay una meta financiera que llevas meses (o años) posponiendo. Hoy le ponemos nombre.",
    bloques: [
      { t: "p", html: "No vamos a empezar por cifras. Vamos a empezar por <strong>lo que quieres y todavía no pasa</strong>. Sin juicio: aquí nadie te va a decir que debiste hacerlo antes." },
      { t: "reflex", id: "d1_meta", label: "¿Cuál es esa meta financiera que no has cumplido?", ph: "Ej: tener un fondo de emergencia, salir de la tarjeta, comprar mi casa, empezar a invertir…" },
      { t: "chips", id: "d1_tipo", multi: true, label: "¿De qué tipo es?", opts: ["Ahorrar", "Salir de deudas", "Invertir", "Comprar casa o carro", "Viajar", "Emprender", "Mi pensión", "Otra"] },
      { t: "chips", id: "d1_tiempo", label: "¿Hace cuánto la tienes en la cabeza?", opts: ["Menos de 1 año", "1 a 3 años", "Más de 3 años", "Ya perdí la cuenta"] },
      { t: "reflex", id: "d1_sentir", label: "Cuando piensas en esa meta, ¿qué sientes?", ph: "Frustración, culpa, ganas, cansancio… lo que sea es válido." },
      { t: "nota", html: "Que esa meta siga ahí después de tanto tiempo dice algo bueno de ti: <strong>no te rendiste con ella.</strong>" }
    ] },

  { n: 2, acto: 1, emoji: "💬", titulo: "Hablar de dinero (sí, de verdad)", reel: "",
    gancho: "A muchas nos enseñaron que de plata no se habla. Hoy rompemos ese silencio, empezando por contigo.",
    bloques: [
      { t: "p", html: "Para muchas de nosotras, hablar de dinero fue incómodo, mal visto o directamente <strong>un tema de otros</strong>: del papá, del esposo, del que “sabía”. Y lo que no se habla, no se aprende, no se pregunta y no se cuestiona." },
      { t: "p", html: "No es casualidad que tantas mujeres lleguen a los 30, 40 o 50 sin haber tenido nunca una conversación honesta sobre su plata. <strong>Hablar de dinero no es cosa de ricos. Es cosa de quien quiere decidir.</strong>" },
      { t: "reflex", id: "d2_nina", label: "De niña, ¿qué escuchaste sobre el dinero en tu casa?", ph: "Frases, silencios, peleas, consejos…" },
      { t: "reflex", id: "d2_quien", label: "¿Quién hablaba de plata en tu familia y quién no?", ph: "Quién decidía, quién preguntaba, quién se quedaba callada." },
      { t: "reflex", id: "d2_falto", label: "¿Qué te habría gustado que alguien te dijera sobre el dinero?", ph: "Lo que hoy le dirías a esa niña." },
      { t: "chips", id: "d2_primera", label: "Completa: «Quiero ser la primera mujer de mi familia en…»", opts: ["Hablar de dinero abiertamente", "Tener ahorros propios", "Invertir", "Salir de deudas", "Tener un plan financiero", "Enseñarle a mis hijas / sobrinas"] },
      { t: "nota", html: "Hablar de plata te cuesta menos cada vez. El día 10 vamos a darle voz en comunidad." }
    ] },

  { n: 3, acto: 1, emoji: "🔍", titulo: "¿Por qué no pasó?", reel: "",
    gancho: "Casi nunca es falta de disciplina. Casi siempre es falta de un mapa. Vamos a encontrar el tuyo.",
    bloques: [
      { t: "p", html: "Si una meta no se cumple, solemos pensar «yo soy así». Pero la mayoría de las veces hay <strong>razones concretas</strong> y casi todas se pueden trabajar. Marca las que te suenan." },
      { t: "chips", id: "d3_causas", multi: true, label: "¿Qué pasó con tu meta?", opts: ["No tenía un número claro", "No tenía un plan", "Mis ingresos no alcanzaban", "Otras prioridades pasaron primero (familia, cuidado)", "Empecé y no fui constante", "No sabía por dónde empezar", "Me da miedo o pereza mirar mis cuentas", "Dependo de otra persona para decidir", "Me faltó con quién hablarlo"] },
      { t: "reflex", id: "d3_peso", label: "De todas, ¿cuál es la que más pesa?", ph: "Escríbela con tus palabras." },
      { t: "nota", html: "<strong>Una meta sin número y sin camino es un deseo.</strong> Eso no es un defecto tuyo: es lo que nadie nos enseñó a hacer. Los próximos días lo construimos." }
    ] },

  { n: 4, acto: 1, emoji: "🗺️", titulo: "Tu mapa de dinero", reel: "",
    gancho: "¿Qué guion repites con la plata sin darte cuenta? Hoy lo descubres en 7 minutos.",
    bloques: [
      { t: "p", html: "Hoy haces <strong>Tu mapa de dinero</strong>: 25 afirmaciones y un perfil en 5 dimensiones (<em>Evitación, Promesa, Imagen, Vigilancia y Ceder</em>). Es un espejo, no un examen." },
      { t: "link", id: "d4_mapa", url: "mapa_antes", texto: "Hacer mi mapa de dinero →", nota: "Se abre en otra pestaña. Cuando termines, vuelve aquí y cuéntanos tu resultado." },
      { t: "chips", id: "d4_guion", label: "¿Cuál fue tu guion predominante?", opts: ["Evitación", "Promesa", "Imagen", "Vigilancia", "Ceder", "Tengo empate", "Todavía no lo hago"] },
      { t: "reflex", id: "d4_sorpresa", label: "¿Qué te sorprendió de tu perfil?", ph: "Lo que te hizo asentir, o lo que no esperabas." }
    ] },

  { n: 5, acto: 1, emoji: "✍️", titulo: "Tu meta, reescrita", reel: "",
    gancho: "Hoy tu meta deja de ser un deseo y se convierte en una meta con número, fecha y razón.",
    bloques: [
      { t: "reflex", id: "d5_guion", label: "Ese guion de dinero, ¿cómo ha afectado tu meta?", ph: "Ej: «Como evito mirar mis cuentas, nunca supe cuánto necesitaba»." },
      { t: "p", html: "Ahora reescribe tu meta del día 1 como una meta que se puede medir:" },
      { t: "nums", id: "d5", titulo: "Mi meta con número y fecha", campos: [
        { id: "d5_monto", label: "¿Cuánto dinero necesito para cumplirla? ($)", ph: "Ej: 20.000.000", moneda: true },
        { id: "d5_anios", label: "¿En cuántos años quiero lograrla?", ph: "Ej: 3" }
      ], calc: "meta_frase" },
      { t: "reflex", id: "d5_porque", label: "¿Para qué? ¿Qué cambia en tu vida cuando la cumples?", ph: "Esta es la frase que te va a sostener cuando te dé pereza." },
      { t: "nota", html: "Cierra el Acto 1 con una frase: <strong>«Quiero ____ en ____ años, porque ____»</strong>. Guárdala, la vamos a usar en los próximos días." }
    ] },

  { n: 6, acto: 2, emoji: "🧭", titulo: "Cuánto cuesta tu vida", reel: "",
    gancho: "No el mínimo ni el ideal imposible: el número que necesitas al mes para vivir la vida que quieres.",
    bloques: [
      { t: "p", html: "Este es <strong>tu número de la libertad</strong>: lo que cuesta al mes vivir con dignidad, con placer y sin angustia. Llena lo que aplique. Sin trampa y sin juicio." },
      { t: "nums", id: "d6", titulo: "Mis gastos de un mes normal", campos: [
        { id: "d6_vivienda", label: "🏠 Vivienda / arriendo", ph: "$", moneda: true },
        { id: "d6_mercado", label: "🛒 Mercado y comida", ph: "$", moneda: true },
        { id: "d6_transporte", label: "🚌 Transporte", ph: "$", moneda: true },
        { id: "d6_salud", label: "💊 Salud y bienestar", ph: "$", moneda: true },
        { id: "d6_servicios", label: "📱 Servicios y suscripciones", ph: "$", moneda: true },
        { id: "d6_ocio", label: "🎭 Ocio y cultura", ph: "$", moneda: true },
        { id: "d6_viajes", label: "✈️ Viajes y experiencias", ph: "$", moneda: true },
        { id: "d6_otros", label: "💛 Lo que a ti te importa (deudas, familia, regalos…)", ph: "$", moneda: true }
      ], calc: "libertad" },
      { t: "reflex", id: "d6_sorpresa", label: "¿Es más alto, más bajo, o igual a lo que pensabas?", ph: "" }
    ] },

  { n: 7, acto: 2, emoji: "🕐", titulo: "Tu hora de vida", reel: "",
    gancho: "No gastas dinero: gastas horas de tu vida. Hoy vemos cuánto cuesta cada cosa.",
    bloques: [
      { t: "p", html: "Cuando compras algo, lo pagas con las horas que trabajaste para ganar ese dinero. Calcula cuánto vale una hora de tu vida:" },
      { t: "nums", id: "d7", titulo: "Mi hora de vida", campos: [
        { id: "d7_salario", label: "💰 Ingreso mensual neto (lo que te llega)", ph: "$", moneda: true },
        { id: "d7_horas", label: "⏱ Horas trabajadas al mes", ph: "176 = 8h × 22 días" }
      ], calc: "hora" },
      { t: "filas", id: "d7_gastos", titulo: "¿Cuántas horas de vida te cuestan?", n: 3, ph: "Ej: café diario, streaming, ropa…", calc: "horas_gasto" },
      { t: "reflex", id: "d7_reflex", label: "¿Qué gasto te cuesta muchas horas y te aporta poco?", ph: "Y al revés: ¿cuál vale más de lo que creías?" }
    ] },

  { n: 8, acto: 2, emoji: "📊", titulo: "Mini balance: lo que tienes y lo que debes", reel: "",
    gancho: "Sin vergüenza y sin profundizar: una foto rápida de dónde estás parada hoy.",
    bloques: [
      { t: "p", html: "No necesitas centavos exactos. Un estimado honesto es suficiente. Si algo no aplica, déjalo en blanco." },
      { t: "nums", id: "d8", titulo: "Mi punto de partida", campos: [
        { id: "d8_liquido", label: "🏦 Ahorro disponible (cuentas, efectivo, fondos líquidos)", ph: "$", moneda: true },
        { id: "d8_inversion", label: "📈 Inversiones (CDT, acciones, fondos, cripto…)", ph: "$", moneda: true },
        { id: "d8_bienes", label: "🏠 Bienes (casa, carro, negocio, pensión acumulada)", ph: "$", moneda: true },
        { id: "d8_deudas", label: "💳 Deudas (tarjetas, créditos, préstamos)", ph: "$", moneda: true }
      ], calc: "balance" },
      { t: "reflex", id: "d8_reflex", label: "¿Qué sentiste al verlo escrito?", ph: "Esta es tu línea de salida. Desde acá todo suma." },
      { t: "link", id: "d8_portafolio", url: "portafolio", texto: "Quiero un balance más completo (Construye tu portafolio) →", nota: "Opcional: si eres del Club 365, tu portafolio completo te espera." }
    ] },

  { n: 9, acto: 2, emoji: "🛡️", titulo: "Tu red de seguridad", reel: "",
    gancho: "Un colchón no es solo para emergencias: es el permiso para elegir sin pedirle nada a nadie.",
    bloques: [
      { t: "p", html: "El <strong>fondo para la autonomía</strong> es entre 3 y 6 meses de tus gastos reales, en una cuenta a la que accedas en 24 horas. No se invierte. Su trabajo es que, si algo pasa o si quieres cambiar algo, <strong>no dependas de nadie</strong>." },
      { t: "nums", id: "d9", titulo: "Mi colchón", campos: [
        { id: "d9_gastos", label: "💰 Gastos mensuales reales", ph: "$ (si hiciste el día 6, ya está)", moneda: true, pre: "d6_total" },
        { id: "d9_meses", label: "📅 ¿Cuántos meses quieres cubrir?", ph: "3 mínimo · 6 recomendado · 12 si tus ingresos varían" },
        { id: "d9_hoy", label: "🏦 Lo que tienes hoy para esto", ph: "$", moneda: true, pre: "d8_liquido" }
      ], calc: "colchon" },
      { t: "reflex", id: "d9_reflex", label: "Con ese colchón, ¿qué decisión podrías tomar sin miedo?", ph: "Cambiar de trabajo, irte, decir que no…" }
    ] },

  { n: 10, acto: 2, emoji: "🫶", titulo: "Día de compartir", reel: "",
    gancho: "Ya conoces tu punto de partida. Hoy no lo cargas sola: hablamos de plata entre todas.",
    bloques: [
      { t: "p", html: "Llegaste a la mitad del camino. Mirar tu dinero de frente no es poca cosa, y <strong>hacerlo acompañada se siente muy distinto</strong>. Hoy elijes hasta dónde compartir: una, dos o las tres opciones." },
      { t: "custom", k: "compartir" }
    ] },

  { n: 11, acto: 3, emoji: "🌉", titulo: "El hueco entre hoy y tu meta", reel: "",
    gancho: "Ya tienes tu meta y tu punto de partida. Ahora medimos lo que falta, sin drama.",
    bloques: [
      { t: "p", html: "Con lo que ya escribiste, calculamos <strong>cuánto necesitas ahorrar al mes</strong>. Usamos un supuesto de rendimiento de 8 % anual (es un ejemplo para mostrarte el efecto, no una promesa)." },
      { t: "nums", id: "d11", titulo: "Mi hueco", campos: [
        { id: "d11_monto", label: "🎯 Mi meta ($)", ph: "$", moneda: true, pre: "d5_monto" },
        { id: "d11_anios", label: "📆 En cuántos años", ph: "", pre: "d5_anios" },
        { id: "d11_hoy", label: "🌱 Lo que ya tengo para esta meta", ph: "$", moneda: true, pre: "d8_inversion" },
        { id: "d11_ingreso", label: "💰 Mi ingreso mensual (para ver el peso real)", ph: "$", moneda: true, pre: "d7_salario" }
      ], calc: "hueco" },
      { t: "reflex", id: "d11_reflex", label: "¿Esto es más grande o más pequeño de lo que pensabas?", ph: "" }
    ] },

  { n: 12, acto: 3, emoji: "🌱", titulo: "Ahorrar con amor", reel: "",
    gancho: "No se trata de aguantar: se trata de que ahorrar sea un gesto de cuidado hacia ti.",
    bloques: [
      { t: "p", html: "El hábito gana a la fuerza de voluntad. La clave es <strong>decidirlo una vez</strong> y automatizarlo: un monto pequeño, un día fijo, un lugar fijo. Sin esperar a que «sobre»." },
      { t: "nums", id: "d12", titulo: "Mi aporte mensual", campos: [
        { id: "d12_aporte", label: "💜 Mi aporte mensual", ph: "$ (aunque sea pequeño)", moneda: true }
      ], calc: "aporte" },
      { t: "chips", id: "d12_cuando", label: "¿Cuándo lo aparto?", opts: ["El mismo día que me pagan", "Cada quincena", "El día 1 de cada mes", "Cada semana"] },
      { t: "chips", id: "d12_donde", label: "¿Dónde lo guardo?", opts: ["Cuenta de ahorros aparte", "Bolsillo / alcancía digital", "CDT", "Fondo de inversión"] },
      { t: "chips", id: "d12_hecho", label: "Mi primer aporte", opts: ["Ya lo programé o lo hice hoy", "Lo hago esta semana", "Todavía no"] },
      { t: "nota", html: "<strong>Ahorrar con amor</strong> es hablarte con cariño cuando fallas un mes y volver al siguiente. La constancia imperfecta le gana a la perfección que nunca empieza." }
    ] },

  { n: 13, acto: 3, emoji: "⏳", titulo: "Invertir con paciencia", reel: "",
    gancho: "El tiempo hace gran parte del trabajo. Hoy ves lo que pasa con el mismo aporte, a lo largo de los años.",
    bloques: [
      { t: "p", html: "Guardar es el primer paso; invertir es lo que hace que ese dinero <strong>trabaje por ti</strong> con el interés compuesto. Aquí, un ejemplo con tu aporte:" },
      { t: "nums", id: "d13", titulo: "Mi aporte en el tiempo", campos: [
        { id: "d13_aporte", label: "💜 Aporte mensual", ph: "$", moneda: true, pre: "d12_aporte" }
      ], calc: "compuesto" },
      { t: "p", html: "¿Cuánto riesgo te corresponde asumir según tu edad? Usa la <strong>Regla del 110</strong>:" },
      { t: "link", id: "d13_calc", url: "calc110", texto: "Abrir la calculadora de inversión →", nota: "Es una guía educativa, no asesoría personalizada." },
      { t: "reflex", id: "d13_reflex", label: "¿Qué te frena para empezar a invertir?", ph: "Miedo, no entender, falta de plata, no saber dónde…" }
    ] },

  { n: 14, acto: 3, emoji: "🪞", titulo: "Tu mapa, otra vez", reel: "",
    gancho: "Hace 10 días hiciste tu mapa. Hoy lo repites para ver qué se movió dentro de ti.",
    bloques: [
      { t: "p", html: "Repite <strong>Tu mapa de dinero</strong>. No busques sacar «mejor puntaje»: busca ver qué cambió en tu relación con la plata." },
      { t: "link", id: "d14_mapa", url: "mapa_despues", texto: "Repetir mi mapa de dinero →", nota: "Se abre en otra pestaña. Guarda tu resultado y vuelve aquí." },
      { t: "chips", id: "d14_guion", label: "¿Cuál fue tu guion predominante ahora?", opts: ["Evitación", "Promesa", "Imagen", "Vigilancia", "Ceder", "Tengo empate", "Todavía no lo hago"] },
      { t: "custom", k: "comparar_mapa" },
      { t: "reflex", id: "d14_cambio", label: "¿Qué cambió en estos días?", ph: "En lo que sabes, en lo que sientes, en lo que hiciste." }
    ] },

  { n: 15, acto: 3, emoji: "🌟", titulo: "Tu Plan Feminario", reel: "",
    gancho: "Todo lo que hiciste en 15 días, en una sola hoja. Y el camino para ejecutarlo acompañada.",
    bloques: [
      { t: "custom", k: "plan" }
    ] }
];
