# BREAKOUT

Un juego clásico de Breakout basado en el esqueleto de Pong de Gilberto Echeverria.

## Cómo correr el juego

## Requisitos
- Un navegador 
- Un servidor local 

## 🎯 Objetivo del juego

Destruye todos los bloques de la pantalla usando la pelota sin dejar que caiga al fondo. Acumula la mayor cantidad de puntos posible antes de quedarte sin vidas.

## 📋 Reglas

- La pelota rebota en las paredes laterales y en la pared superior.
- Si la pelota cae por debajo de la paleta, *pierdes una vida*.
- Tienes *3 vidas* en total. Al perderlas todas, el juego termina.
- Al destruir todos los bloques, avanzas al siguiente nivel.
- La pelota *acelera* progresivamente cada 5 bloques destruidos.
- La velocidad máxima de la pelota está limitada para que el juego sea jugable.
- Los puntos se multiplican según el *nivel actual*.

## 🕹️ Controles

  | Tecla |                       | Acción |
| `←` / `A` | Mover la paleta hacia la izquierda                |
| `→` / `D` | Mover la paleta hacia la derecha                  |
| `ESPACIO` | Lanzar la pelota / Continuar tras perder una vida |
| `P`       | Pausar / Reanudar el juego                        |

## Sistema de puntuación

Los puntos por bloque varían según la fila en la que se encuentre. Las filas superiores valen más puntos:

| Fila         |  Puntos |
| 1            |  50 pts |
| 2            |  40 pts |
| 3            |  30 pts |
| 4            |  20 pts |
| 5            |  10 pts |

Los puntos se **multiplican por el nivel** actual.

## Estados del juego

| **Título** | Pantalla inicial con instrucciones. Haz clic en INICIAR. |
| **Jugando** | La acción está en curso. |
| **Vida perdida** | La pelota cayó. Presiona ESPACIO o el botón para continuar. |
| **Pausa** | Juego pausado con `P`. Presiona `P` o el botón para reanudar. |
| **Victoria** | Todos los bloques destruidos. Avanza al siguiente nivel. |
| **Game Over** | Sin vidas restantes. Puedes reintentar desde el principio. |


## Cambios y mejoras al gameplay

En comparación con el Pong base, este proyecto introduce los siguientes cambios:

## Grilla de bloques
- Se agregó una grilla configurable de bloques (`BLOCK_COLS × BLOCK_ROWS`).
- Cada bloque tiene puntos asignados según su fila y se destruye al recibir el impacto de la pelota.
- Los bloques soportan **sprites personalizados** por fila, con color de respaldo si no hay imagen.

## Soporte de assets visuales
- Se agregó carga de una **imagen de fondo** para el canvas.
- Los bloques pueden renderizarse con **sprites PNG** en lugar de colores sólidos.

## Efectos de sonido
- Se incorporó un **efecto de audio** (`bombo.wav`) que se reproduce al rebotar la pelota contra paredes, paleta y bloques.

## Dificultad progresiva
- La pelota **acelera un 8%** cada 5 bloques destruidos, hasta un máximo configurable (`BALL_SPEED_MAX`).
- Los puntos obtenidos se **multiplican por el nivel** actual, incentivando avanzar.

## Sistema de vidas y niveles
- El jugador tiene **3 vidas**. Al perder una, la pelota se reinicia y puede continuar.
- Al completar todos los bloques, se genera una **nueva grilla** y se incrementa el nivel, manteniendo el puntaje acumulado.

## HUD en canvas
- Se muestra en pantalla: vidas restantes, puntuación actual, bloques destruidos y nivel, todo renderizado directamente sobre el canvas.

## Sistema de overlays
- Pantallas de título, pausa, vida perdida, victoria y game over se muestran como **overlays** con botones clicables, sin interrumpir el loop del juego.

## Ángulo de rebote en paleta
- El ángulo de salida de la pelota al golpear la paleta varía según **dónde impacte** (centro vs. extremo), dando al jugador control sobre la dirección.