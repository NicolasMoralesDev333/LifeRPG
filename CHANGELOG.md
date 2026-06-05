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

## Sprint 3: Guardando la Partida (Supabase & Cloud)

En este sprint llevé LifeRPG de un estado efímero en memoria a una experiencia con guardado real de partida. Hasta ahora, el progreso del jugador y sus misiones vivían solamente dentro del cliente; al refrescar la página, todo volvía al punto inicial. Con Supabase empecé a construir la capa cloud que permite autenticar usuarios, cargar sus datos y persistir sus avances.

Elegí Supabase porque encaja muy bien con la velocidad que necesita este MVP: autenticación integrada, una base Postgres flexible y una API JavaScript directa para leer y mutar datos desde el cliente. Dejé definidos los placeholders de tablas `life_rpg_profiles` y `life_rpg_habits`, separando el perfil del jugador de sus misiones para que el modelo pueda crecer sin mezclar responsabilidades.

También incorporé una pantalla de título/login con estética RPG cyberpunk. Si el usuario no está autenticado, no ve el dashboard: primero debe entrar o crear su save slot. Al iniciar sesión, el sistema sincroniza nivel, XP, XP necesaria, atributos y misiones desde Supabase, mostrando un estado de carga tipo terminal mientras se recuperan los datos.

Uno de los desafíos más importantes fue manejar la asincronía sin romper la sensación de juego. Para eso implementé mutaciones optimistas: cuando completo una misión, creo un hábito o lo elimino, la UI responde inmediatamente antes de que el servidor confirme la operación. Si Supabase falla, muestro un toast rojo de error y revierto la acción cuando corresponde. Esa decisión mantiene el "game feel" fluido sin ignorar la integridad de los datos.

El siguiente paso será crear el schema real en Supabase con RLS, asociar cada fila al usuario autenticado y empezar a preparar una migración hacia stores más especializados si el estado sigue creciendo. A partir de acá LifeRPG ya tiene la base para convertirse en una app persistente, multiusuario y lista para evolucionar hacia misiones diarias, historial e inventario.

## Sprint 4: Batallas contra Jefes (Sub-tareas y Datos Relacionales)

En este sprint empecé a transformar LifeRPG en algo más profundo que un tracker de hábitos diarios. Implementé el sistema de Boss Fights: proyectos grandes representados como jefes con HP, recompensa masiva de XP y una lista de subtareas que funcionan como ataques.

El desafío técnico principal fue manejar estado anidado en React sin mutar datos directamente. Cada boss tiene subtasks propias, y al completar una subtarea necesito actualizar dos niveles al mismo tiempo: marcar ese ataque como completado y descontar su daño del `currentHp` del jefe padre. Para resolverlo trabajé con copias inmutables, mapeando el arreglo de bosses y luego el arreglo interno de subtareas.

A nivel de diseño, la Boss Arena cambia el tono visual del dashboard. Las misiones comunes siguen siendo acciones rápidas, pero un jefe se siente como una amenaza: barra de vida grande, colores carmesí, daño flotante y alerta de victoria al derrotarlo. Esto aporta una capa emocional que una simple lista de tareas no tiene.

El valor UX de este sprint está en convertir proyectos largos en combates visibles. En vez de ver "Entregar Tesis" como una tarea enorme y abstracta, ahora puedo descomponerla en ataques concretos: escribir la introducción, ordenar el marco teórico, procesar resultados y hacer la entrega final. Cada avance baja la vida del jefe y hace que el progreso se sienta físico.

Por ahora dejé esta lógica mockeada con `useState`, pensando en que más adelante los bosses y subtareas puedan persistirse en Supabase como datos relacionales. El siguiente paso natural será crear tablas para bosses y boss_subtasks, conectarlas al usuario autenticado y mantener esta misma sensación de combate con datos reales.
