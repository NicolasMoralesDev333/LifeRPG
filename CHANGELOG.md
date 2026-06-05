# Sprint 1 - LifeRPG MVP Dashboard

## Bitácora de desarrollo

En este primer sprint construí la base visual y funcional del dashboard principal de LifeRPG. El objetivo fue transformar la idea inicial de un tracker de hábitos en una experiencia que se sienta más cercana a un menú de videojuego RPG moderno que a un panel corporativo tradicional.

Logré montar el HUD inicial del personaje con nivel, experiencia actual, experiencia requerida y una barra de XP con presencia visual fuerte. También dejé implementado el panel de atributos core con STR, INT, VIT, CHA y AGI, cada uno con su valor numérico y una barra de progreso propia. En el centro del flujo quedó el panel de acciones/hábitos, donde cada acción incrementa una estadística concreta y entrega XP al personaje.

## Decisiones técnicas

Elegí Tailwind CSS para concentrar todo el lenguaje visual directamente en el componente, sin depender de archivos CSS externos. Esto me permitió iterar rápido sobre bordes, gradientes, sombras, estados activos, responsive layout y detalles tipo HUD con clases de utilidad.

Para el estado usé `useState` como mock temporal del store global: `level`, `xp`, `xpNeeded` y `stats`. Esta decisión mantiene el MVP simple, fácil de leer y listo para migrar a Zustand cuando el flujo de hábitos, recompensas y persistencia empiece a crecer.

Sumé Framer Motion para que el dashboard tenga respuesta visual inmediata: animaciones de entrada, barras que progresan con suavidad, botones con interacción y feedback flotante de XP al completar acciones. La intención es que cada hábito completado se sienta como una micro-recompensa dentro del sistema.

## Resultado del sprint

- Dashboard principal MVP creado como componente React funcional.
- Sistema local de nivel, XP, XP necesaria y estadísticas base.
- Acciones de hábitos con incremento de stat y ganancia de XP.
- Lógica de subida de nivel con XP acumulable y recalculo de XP requerida.
- Dirección visual inicial basada en estética RPG/cyberpunk: fondo oscuro, acentos neón, barras biseladas, bordes fuertes y feedback animado.

## Próximos pasos para Sprint 2

Para el Sprint 2, el siguiente paso lógico es migrar el estado local a Zustand y separar la lógica de progreso en un store reutilizable. También quiero sumar creación real de hábitos, categorías, rachas, recompensas desbloqueables y persistencia local o en base de datos.

Después de eso, el sistema debería empezar a incluir misiones diarias, historial de progreso, inventario o recompensas cosméticas, y una capa de balance para que la progresión se sienta motivadora sin volverse trivial.

## Sprint 2: El Poder de la Personalización (CRUD Local)

En este sprint di un paso clave para que LifeRPG empiece a sentirse como una herramienta viva y no solo como una maqueta visual. Pasé de trabajar con una lista estática de acciones a manejar un conjunto dinámico de misiones en estado local con `useState`, lo que me permitió crear y eliminar hábitos directamente desde la interfaz.

El cambio más importante fue convertir el Quest Log en un sistema CRUD local. Ahora puedo forjar nuevas misiones con nombre personalizado, elegir qué atributo mejoran y definir su dificultad, que a su vez determina la cantidad de XP que entregan. También agregué la posibilidad de abandonar misiones desde cada tarjeta, cuidando que ese click no active accidentalmente la recompensa del hábito.

A nivel técnico, el desafío estuvo en coordinar varios estados de React al mismo tiempo: la colección de hábitos, la apertura y cierre del modal, los campos controlados del formulario y la validación mínima del nombre de la misión. Mantener todo en el cliente con `useState` sigue siendo una decisión consciente para este MVP, porque me permite iterar rápido antes de mover la lógica a una capa de estado más robusta.

También cuidé que la interfaz no perdiera identidad. El modal fue diseñado como una ventana de sistema dentro de un RPG cyberpunk: fondo oscuro translúcido, `backdrop-blur`, bordes neón, sombras intensas y controles con foco luminoso. La creación de hábitos tenía que sentirse como "forjar una misión", no como llenar un formulario administrativo.

El próximo paso natural para el Sprint 3 será persistir estas misiones en una base de datos, probablemente con Supabase. Eso va a permitir que los hábitos personalizados sobrevivan al refresh, se asocien a un usuario real y empiecen a formar parte de un progreso duradero dentro del juego.
