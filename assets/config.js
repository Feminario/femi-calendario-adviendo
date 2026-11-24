// Configuración del calendario de adviento de Feminario (30 nov al 4 dic de 2026). Solo cosas públicas: aquí NUNCA van datos de las mujeres.
// Lo que escribe cada mujer se guarda en su dispositivo y en el panel de Feminario (con su permiso), para que el equipo y Emi la acompañen.
window.CAL_CFG = {
  // Primer día (año, mes 1-12, día). Cada puerta se abre en su fecha y queda abierta: se hace a su ritmo.
  INICIO: [2026, 11, 30],
  // Panel: guarda las respuestas y dice hasta qué día está abierto (lo controla el equipo en el panel, página «Adviento»)
  API: "https://femi-panel.vercel.app/api/adviento",
  // Enlace del grupo de WhatsApp de la dinámica (lo envía Caro). Vacío = muestra «llega muy pronto».
  GRUPO_WA: "",
  // Sesión en conjunto con Andre y Tina (día 4).
  SESION: { cuando: "Jueves 3 de diciembre, de 2:00 a 3:00 p. m. (hora de Colombia)", enlace: "" },
  CLUB_URL: "https://www.feminario.co/store",
  CALC110_URL: "https://feminario.github.io/calculadora-feminario/",
  MAPA_URL: "https://feminario.github.io/Tu-mapa-de-dinero/",
  INSTAGRAM: "https://www.instagram.com/feminario.co/",
  // Para probar sin esperar las fechas: abre cualquier página con ?preview=1
};
