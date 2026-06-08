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

## Sprint 5: Economía de Juego y el Mercado Negro (Recompensas Reales)

En este sprint cerré una parte clave del loop de gamificación de LifeRPG: ya no se trata solamente de ganar XP y subir stats, sino también de acumular una moneda interna y gastarla en recompensas reales. Implementé los `cyberCredits` como una segunda capa de progreso, visible en el HUD principal y conectada a misiones, ataques contra jefes y recompensas finales.

La decisión de sumar una economía dual cambia mucho la sensación de uso. La XP empuja el crecimiento a largo plazo del personaje, mientras que los créditos funcionan como una recompensa más inmediata y tangible. Cada hábito completado y cada sub-tarea importante ahora dejan loot, lo que hace que incluso las acciones pequeñas tengan un impacto visible dentro del sistema.

También construí el Mercado Negro, una tienda de recompensas con estética de contrabando cyberpunk. Desde ahí puedo registrar mis propios ítems, asignarles un costo y comprarlos cuando tengo saldo suficiente. Esto transforma la app en un acuerdo personal: yo defino qué premios valen la pena, cuánto cuestan y qué esfuerzo necesito hacer para desbloquearlos.

El desafío técnico principal estuvo en manejar validaciones transaccionales en React. Al comprar una recompensa, el sistema primero valida si tengo créditos suficientes. Si la compra es válida, descuenta el saldo, muestra una notificación de éxito y registra la acción en el Quest Log. Si no alcanza el saldo, la tarjeta responde con una animación de shake y un error claro. Esa validación es simple, pero es la base de una economía confiable.

A nivel UX, este sprint aporta algo muy importante: autogestión de incentivos. LifeRPG empieza a conectar tareas reales con recompensas reales, manteniendo la fantasía RPG sin perder utilidad práctica. Con este Mercado Negro, el loop queda mucho más completo: hago hábitos, gano XP y créditos, progreso mi personaje, derroto proyectos grandes y canjeo recompensas que yo mismo definí.

El próximo paso lógico será persistir las recompensas del Mercado Negro en Supabase, junto con un historial más formal de transacciones. Eso permitiría auditar compras, recuperar ítems entre sesiones y empezar a balancear mejor la economía del juego con datos reales.

## Sprint 6: El Oráculo (Visualización de Datos y Analíticas)

En este sprint agregué una nueva capa de lectura para LifeRPG: El Oráculo. Hasta ahora la aplicación se sentía fuerte en acción inmediata, recompensas, jefes y economía, pero faltaba una vista que me permitiera observar mi progreso como si estuviera leyendo la hoja de estadísticas de un RPG complejo.

Implementé una vista dedicada de analíticas con un Radar Chart para representar la build del jugador a partir de los cinco atributos principales: STR, INT, VIT, CHA y AGI. Esta visualización permite entender rápidamente hacia dónde se está inclinando mi personaje. No es lo mismo ver cinco números separados que ver una forma completa: el gráfico convierte los stats en una silueta de progreso.

También construí un mapa de calor de actividad para los últimos 30 días, inspirado en la lógica visual de GitHub. Cada cuadro representa un día y su intensidad cambia según la cantidad de acciones completadas. Esto ayuda a que el esfuerzo cotidiano no desaparezca: cada hábito, cada ataque a un boss y cada sesión activa empieza a dejar una marca acumulativa.

El desafío técnico principal fue procesar un array plano de `activity_logs` y transformarlo en datos estructurados agrupados por fecha. Para este frontend generé un historial mock determinístico, pero lo modelé con una forma cercana a la que después podría venir de Supabase: logs individuales con fecha, tipo, label y valor. A partir de ahí agrupé por día, calculé acciones totales, días activos y racha actual.

Desde el punto de vista de retención, este sprint es importante porque le muestra al usuario que su esfuerzo tiene memoria. La gamificación no funciona solo por recompensas inmediatas; también necesita evidencia de avance a largo plazo. El Oráculo empieza a cumplir ese rol: convertir acciones pequeñas en una narrativa visual de crecimiento.

El próximo paso lógico será persistir los `activity_logs` reales en Supabase, conectar el heatmap con datos históricos verdaderos y sumar filtros por tipo de actividad, atributo entrenado o periodo de tiempo.

## Sprint 7: Inteligencia Artificial como Dungeon Master

En este sprint empecé a integrar una capa de inteligencia generativa en LifeRPG con el Dungeon Master IA. La idea principal fue atacar un problema muy real: el síndrome de la página en blanco. Muchas veces tengo una meta clara en la cabeza, pero no sé cómo dividirla en pasos concretos, accionables y medibles. Ahí es donde la IA puede convertirse en un puente entre una intención grande y una misión jugable.

Construí el Orbe del Oráculo como una interfaz tipo terminal/chat dentro de la Boss Arena. Desde ahí puedo escribir una meta general, como conseguir mi primer trabajo frontend, y pedirle al Dungeon Master que la transforme en un jefe épico con HP, recompensas y subtareas. La experiencia está diseñada para sentirse como una invocación dentro del juego, no como un formulario genérico.

A nivel técnico, implementé `generateQuestFromAI(prompt)` como una función asíncrona mockeada, simulando una llamada real a un LLM con estado de carga. Mientras la respuesta se genera, la UI muestra el mensaje "El Dungeon Master está tejiendo tu destino...", reforzando la fantasía sin ocultar que hay una operación en progreso.

También diseñé un prompt de sistema estricto para que la IA devuelva un JSON predecible. Esto es clave: React necesita poder mapear la respuesta sin romperse, así que la estructura esperada incluye `bossName`, `bossHp`, recompensas y un arreglo de `subtasks`. Aunque por ahora la respuesta está mockeada, el contrato ya queda preparado para conectar OpenAI, Gemini o cualquier backend propio más adelante.

El resultado generado se muestra antes de aceptarlo. Si la misión tiene sentido, puedo presionar "Aceptar Misión" y el sistema inyecta automáticamente ese jefe en el estado de la aplicación, convirtiendo la meta abstracta en una Boss Fight jugable. Este sprint hace que LifeRPG empiece a sentirse menos como una app que espera datos y más como un compañero activo que ayuda a diseñar el camino.

El próximo paso natural será mover esta simulación a una API real, proteger la key del proveedor en backend, validar el JSON con un schema estricto y guardar los bosses generados en Supabase para que formen parte de la partida persistente.

## Sprint 8: Production Readiness (Camino al Portfolio)

En este sprint empecé a preparar LifeRPG para dejar de ser solamente un prototipo atractivo y convertirse en un proyecto presentable para portfolio. El foco no estuvo en sumar más features por acumulación, sino en fortalecer la base técnica que una empresa esperaría ver: persistencia más completa, documentación clara y una historia de producto fácil de entender.

El avance más importante fue extender la sincronización con Supabase. Hasta este punto la nube guardaba el perfil del jugador y sus hábitos, pero varias piezas potentes del juego todavía vivían como estado local. En este sprint conecté también el Mercado Negro, los Boss Fights, las subtareas y los logs de actividad. Esto hace que la economía, los proyectos largos y las analíticas empiecen a comportarse como una partida real y no como una demo aislada.

A nivel técnico trabajé sobre el problema de serializar datos de UI. Los íconos de Lucide son componentes React, pero la base de datos necesita valores simples y persistibles. Para resolverlo agregué claves de ícono en texto y funciones de mapeo que transforman filas de Supabase en objetos listos para renderizar. Este patrón mantiene separada la representación visual de la estructura persistida.

También preparé un README con enfoque de portfolio. Quiero que quien vea el repositorio pueda entender rápido qué problema resuelve LifeRPG, qué stack usa, qué features incluye, cómo se configura Supabase y por qué las decisiones técnicas tienen sentido. La documentación empieza a contar el proyecto como producto, no solo como código.

El siguiente paso antes del deploy será ordenar el componente principal en módulos más pequeños, agregar tests mínimos de flujos críticos y terminar la configuración real de Supabase/Vercel. Recién cuando esa base esté sólida quiero publicar el deploy final, para que el link del portfolio muestre una experiencia pulida y confiable.
