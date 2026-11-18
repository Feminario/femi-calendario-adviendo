# Calendario de adviento · Feminario

15 días (1 al 15 de diciembre) para que cada mujer **cumpla esa meta financiera que ha pospuesto**: conoce su punto de partida, mira su relación con el dinero y arma un camino que pueda sostener. A su ritmo: cada puerta se abre en su fecha y queda abierta. Cierra con la invitación al **Club 365**.

## Estructura
| Acto | Días |
|---|---|
| **1 · Tus metas** | 1 La meta pendiente · 2 Hablar de dinero · 3 ¿Por qué no pasó? · 4 Tu mapa de dinero · 5 Tu meta reescrita |
| **2 · Tu punto de partida** | 6 Cuánto cuesta tu vida · 7 Tu hora de vida · 8 Mini balance · 9 Red de seguridad · 10 Día de compartir |
| **3 · Tu camino** | 11 El hueco hasta tu meta · 12 Ahorrar con amor · 13 Invertir con paciencia · 14 Tu mapa otra vez · 15 Tu Plan Feminario |

Reutiliza [Tu mapa de dinero](https://github.com/Feminario/Tu-mapa-de-dinero) (días 4 y 14, con `?momento=despues`), la [Calculadora de inversión](https://github.com/Feminario/calculadora-feminario) (día 13), [Construye tu portafolio](https://github.com/Feminario/construye-tu-portafolio) (día 8, opcional) y la mecánica del [Reto Femiversario](https://github.com/Feminario/reto-femiversario).

## Cómo editar
- **Textos y ejercicios:** [assets/contenido.js](assets/contenido.js). Cada día es un objeto con sus bloques.
- **Video de Instagram del día:** en `reel:` de cada día pega el enlace del reel (`https://www.instagram.com/reel/XXXX/`). Vacío = muestra «video próximamente».
- **Fechas, enlaces y Club 365:** [assets/config.js](assets/config.js) (`INICIO`, `CLUB_URL`).
- **Probar sin esperar las fechas:** agrega `?preview=1` (ej. `index.html?preview=1`).

## Guardar en Google Sheets (una sola vez)
1. Hoja nueva → Extensiones → Apps Script → pega [apps-script/Code.gs](apps-script/Code.gs).
2. Implementar → Aplicación web → Ejecutar como **yo**, acceso **Cualquier persona**.
3. Copia la URL `.../exec` en `API_URL` de `assets/config.js`.

Hojas que se crean solas: **Registro**, **Respuestas** (una fila por día completado, datos en JSON) y **Muro**. En el día 10, las frases quedan sin publicar: escribe `sí` en la columna *Aprobada* para que aparezcan en el muro.

Sin `API_URL` el calendario funciona igual, pero no guarda en la hoja (el progreso queda en el navegador de cada mujer).

## Privacidad
Se pide nombre, correo y autorización antes de empezar. El muro es anónimo y moderado. Las cifras no se publican nunca.
