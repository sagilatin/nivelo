// Placeholder Spanish news content about Israel and Spain.
// Each article has `byLevel` with a CEFR level → { headline, body } map.
// Body paragraphs are arrays of segments. A segment is either { text } or
// { text, hebrew } for a tappable Hebrew translation.
//
// `summary` (top level) is the short blurb shown on home cards under the
// headline; it stays constant per article.

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

export const articles = [
  {
    id: '1',
    flag: '🇮🇱',
    source: 'Haaretz',
    category: 'TECNOLOGÍA',
    minutes: 4,
    date: '9 de mayo, 2026',
    summary:
      'StoreDot anuncia un acuerdo con tres fabricantes europeos de coches.',
    byLevel: {
      A1: {
        headline: 'Tel Aviv crea baterías rápidas',
        body: [
          [
            { text: 'Una ' },
            { text: 'empresa', hebrew: 'חברה' },
            { text: ' de Tel Aviv hace una ' },
            { text: 'batería', hebrew: 'סוללה' },
            { text: ' nueva. Se carga en cinco minutos.' },
          ],
        ],
      },
      A2: {
        headline: 'Una empresa de Tel Aviv crea baterías de carga rápida',
        body: [
          [
            { text: 'Una ' },
            { text: 'empresa', hebrew: 'חברה' },
            { text: ' de Tel Aviv presentó una ' },
            { text: 'batería', hebrew: 'סוללה' },
            { text: ' para coches eléctricos. La batería se carga en cinco minutos. La producción empezará el próximo año en Haifa.' },
          ],
        ],
      },
      B1: {
        headline: 'Una startup de Tel Aviv crea baterías que se cargan en cinco minutos',
        body: [
          [
            { text: 'Una empresa tecnológica de Tel Aviv ha presentado una ' },
            { text: 'batería', hebrew: 'סוללה' },
            { text: ' para coches eléctricos que se carga en solo cinco minutos. La compañía, llamada StoreDot, ya ha firmado acuerdos con tres ' },
            { text: 'fabricantes', hebrew: 'יצרנים' },
            { text: ' europeos. La producción empezará a principios del próximo año en una fábrica cerca de Haifa. Los expertos creen que es un cambio importante para la industria del coche eléctrico.' },
          ],
        ],
      },
      B2: {
        headline: 'Una startup israelí presenta una batería capaz de cargarse en cinco minutos',
        body: [
          [
            { text: 'Una ' },
            { text: 'empresa', hebrew: 'חברה' },
            { text: ' tecnológica con sede en Tel Aviv ha sorprendido al sector del automóvil con una nueva ' },
            { text: 'batería', hebrew: 'סוללה' },
            { text: ' para coches eléctricos capaz de cargarse en apenas cinco minutos. La compañía, llamada StoreDot, ha cerrado acuerdos con tres ' },
            { text: 'fabricantes', hebrew: 'יצרנים' },
            { text: ' europeos cuyas identidades aún no ha desvelado. La producción comenzará a principios del próximo año en una planta cercana a Haifa. Para muchos analistas, este avance podría suponer un cambio decisivo: hasta ahora la lentitud de la recarga seguía siendo el principal ' },
            { text: 'obstáculo', hebrew: 'מכשול' },
            { text: ' para los conductores. El gobierno israelí ha celebrado el anuncio y ha prometido apoyo financiero para mantener la innovación tecnológica del país.' },
          ],
        ],
      },
      C1: {
        headline: 'Una compañía israelí desarrolla una batería que reduce la recarga eléctrica a cinco minutos',
        body: [
          [
            { text: 'Una ' },
            { text: 'empresa', hebrew: 'חברה' },
            { text: ' tecnológica con sede en Tel Aviv ha irrumpido en el sector automovilístico al presentar una ' },
            { text: 'batería', hebrew: 'סוללה' },
            { text: ' para vehículos eléctricos cuya recarga completa se realiza, según sus desarrolladores, en apenas cinco minutos. La firma, denominada StoreDot, ya ha alcanzado acuerdos estratégicos con tres ' },
            { text: 'fabricantes', hebrew: 'יצרנים' },
            { text: ' europeos de gran envergadura, cuyas identidades permanecen, de momento, bajo reserva.' },
          ],
          [
            { text: 'Para los analistas del sector, el avance podría constituir un punto de inflexión: hasta ahora, los tiempos de recarga representaban uno de los principales ' },
            { text: 'escollos', hebrew: 'מכשולים' },
            { text: ' para la transición masiva al coche eléctrico. El ejecutivo israelí ha celebrado el hito y se ha comprometido a destinar fondos adicionales para mantener la innovación tecnológica como pilar estratégico de la economía nacional.' },
          ],
        ],
      },
      C2: {
        headline: 'Una firma israelí promete revolucionar el coche eléctrico con una batería de carga ultrarrápida',
        body: [
          [
            { text: 'Lo que durante años pareció una promesa lejana de la ingeniería —una ' },
            { text: 'batería', hebrew: 'סוללה' },
            { text: ' capaz de disipar, en cuestión de minutos, las inquietudes acumuladas por toda una generación de conductores— se ha materializado esta semana en Tel Aviv. La firma StoreDot ha presentado un dispositivo cuyo tiempo de recarga, fijado en escasos cinco minutos, desafía cuanto cabía esperar del actual estado del arte; tres ' },
            { text: 'fabricantes', hebrew: 'יצרנים' },
            { text: ' europeos, cuya identidad prefieren resguardar de la curiosidad mediática, habrían suscrito ya acuerdos con la compañía.' },
          ],
          [
            { text: 'Los analistas más prudentes coinciden en señalar que, de cumplirse las expectativas, el sector se enfrenta a un punto de no retorno: la eterna sombra de los largos tiempos de recarga había sostenido durante demasiado tiempo la indecisión de un público todavía aferrado, casi sentimentalmente, al motor de combustión. El ejecutivo israelí, consciente del valor simbólico y económico del ' },
            { text: 'hallazgo', hebrew: 'תגלית' },
            { text: ', no ha tardado en comprometer apoyos adicionales para que la innovación local conserve el papel privilegiado que ha venido ocupando.' },
          ],
        ],
      },
    },
  },

  {
    id: '2',
    flag: '🇪🇸',
    source: 'El País',
    category: 'POLÍTICA',
    minutes: 5,
    date: '9 de mayo, 2026',
    summary:
      'La norma limita los alquileres en zonas tensionadas y obliga a los grandes propietarios.',
    byLevel: {
      A1: {
        headline: 'Nueva ley de vivienda en España',
        body: [
          [
            { text: 'España tiene una ley nueva sobre la ' },
            { text: 'vivienda', hebrew: 'דיור' },
            { text: '. Quiere bajar el precio de los pisos.' },
          ],
        ],
      },
      A2: {
        headline: 'España aprueba una ley para bajar los alquileres',
        body: [
          [
            { text: 'El Congreso aprobó hoy una nueva ley de ' },
            { text: 'vivienda', hebrew: 'דיור' },
            { text: '. Los alquileres no podrán subir tanto en algunas ciudades. El gobierno quiere ayudar a las familias jóvenes.' },
          ],
        ],
      },
      B1: {
        headline: 'El Congreso aprueba una nueva ley de vivienda asequible',
        body: [
          [
            { text: 'El Congreso ha aprobado hoy una ley para frenar el aumento de los alquileres en las ciudades más afectadas por la crisis inmobiliaria. La norma identifica zonas tensionadas, donde los grandes propietarios no podrán cobrar por encima de un índice oficial. La oposición critica la medida y advierte que podría reducir la oferta de pisos. El gobierno defiende que la ley es necesaria para proteger a las familias jóvenes y a quienes buscan su primera ' },
            { text: 'vivienda', hebrew: 'דיור' },
            { text: '.' },
          ],
        ],
      },
      B2: {
        headline: 'España aprueba una ley para limitar los alquileres en zonas tensionadas',
        body: [
          [
            { text: 'El Congreso ha aprobado este jueves una nueva ley de ' },
            { text: 'vivienda', hebrew: 'דיור' },
            { text: ' destinada a frenar el aumento de los alquileres en aquellas ciudades donde la presión inmobiliaria se ha vuelto insostenible. La norma identifica las llamadas zonas tensionadas y obliga a los grandes propietarios a someter sus rentas a un índice de referencia oficial, además de reservar parte de su parque a precios reducidos. La oposición ha cuestionado la medida y advierte que podría reducir la oferta disponible. El gobierno, en cambio, sostiene que la ley es imprescindible para proteger a las familias jóvenes y a los hogares con menos recursos.' },
          ],
        ],
      },
      C1: {
        headline: 'Aprobada una ambiciosa ley de vivienda para contener la escalada de los alquileres',
        body: [
          [
            { text: 'El Congreso de los Diputados ha aprobado este jueves una ambiciosa ley de ' },
            { text: 'vivienda', hebrew: 'דיור' },
            { text: ' destinada a contener la escalada de los alquileres en aquellos núcleos urbanos donde la presión inmobiliaria se ha vuelto insostenible para amplios sectores de la población.' },
          ],
          [
            { text: 'La normativa, sometida a meses de negociación parlamentaria, identifica las denominadas zonas tensionadas y obliga a los grandes tenedores a someter sus rentas a un índice de referencia oficial. La oposición cuestiona el alcance del texto, alertando sobre un posible efecto adverso sobre la oferta disponible; el ejecutivo defiende su urgencia como pieza clave de la política de vivienda del próximo ciclo legislativo.' },
          ],
        ],
      },
      C2: {
        headline: 'El Congreso intenta domar el mercado del alquiler con una de las leyes de vivienda más ambiciosas en décadas',
        body: [
          [
            { text: 'Tras meses de pulsos parlamentarios, el Congreso ha aprobado este jueves una de las leyes de ' },
            { text: 'vivienda', hebrew: 'דיור' },
            { text: ' más ambiciosas que se recuerdan en la última década, concebida para contener una escalada de los alquileres que, en determinados núcleos urbanos, ha terminado por desbordar todas las previsiones razonables sobre el acceso a un derecho básico.' },
          ],
          [
            { text: 'La norma, fruto de un equilibrio frágil entre socios de gobierno, identifica las llamadas zonas tensionadas y somete las rentas de los grandes tenedores a un índice oficial. La oposición, no exenta de cierta razón técnica, advierte de un eventual repliegue de la oferta; el ejecutivo, por su parte, defiende la urgencia del texto como gesto político inaplazable frente a una generación que percibe la vivienda como una promesa cada vez más distante.' },
          ],
        ],
      },
    },
  },

  {
    id: '3',
    flag: '🇮🇱',
    source: 'Times of Israel',
    category: 'CULTURA',
    minutes: 3,
    date: '8 de mayo, 2026',
    summary:
      'El hallazgo, en perfecto estado, será expuesto al público a finales de año.',
    byLevel: {
      A1: {
        headline: 'Mosaico romano viejo cerca de Jerusalén',
        body: [
          [
            { text: 'Cerca de Jerusalén hay un ' },
            { text: 'mosaico', hebrew: 'פסיפס' },
            { text: ' romano. Tiene 1.700 años.' },
          ],
        ],
      },
      A2: {
        headline: 'Encuentran un mosaico romano cerca de Jerusalén',
        body: [
          [
            { text: 'Unos arqueólogos encontraron un ' },
            { text: 'mosaico', hebrew: 'פסיפס' },
            { text: ' romano cerca de Jerusalén. Es muy viejo: tiene 1.700 años. Estará en el museo este año.' },
          ],
        ],
      },
      B1: {
        headline: 'Arqueólogos hallan un mosaico romano de 1.700 años cerca de Jerusalén',
        body: [
          [
            { text: 'Un equipo de arqueólogos ha descubierto un ' },
            { text: 'mosaico', hebrew: 'פסיפס' },
            { text: ' romano cerca de Jerusalén que se conserva en un estado excepcional después de más de mil setecientos años bajo tierra. Las imágenes representan escenas de caza y figuras mitológicas. Los expertos lo consideran uno de los hallazgos más importantes de los últimos años. El mosaico se expondrá al público a finales de año en el Museo de Israel.' },
          ],
        ],
      },
      B2: {
        headline: 'Hallan un mosaico romano en estado excepcional cerca de Jerusalén',
        body: [
          [
            { text: 'Un equipo de arqueólogos ha sacado a la luz cerca de Jerusalén un ' },
            { text: 'mosaico', hebrew: 'פסיפס' },
            { text: ' romano cuyo estado de conservación, tras más de mil setecientos años bajo tierra, ha sorprendido a la comunidad científica. Las escenas, vinculadas a la caza y a motivos mitológicos clásicos, constituyen, según los expertos, uno de los hallazgos más relevantes de la última década en la región. El mosaico será restaurado durante los próximos meses y se expondrá al público a finales de año en el Museo de Israel.' },
          ],
        ],
      },
      C1: {
        headline: 'Sale a la luz un mosaico romano excepcional en las inmediaciones de Jerusalén',
        body: [
          [
            { text: 'Un equipo de arqueólogos ha sacado a la luz, en las inmediaciones de Jerusalén, un ' },
            { text: 'mosaico', hebrew: 'פסיפס' },
            { text: ' de factura romana cuyo extraordinario estado de conservación, después de más de mil setecientos años bajo tierra, ha sorprendido a la comunidad científica.' },
          ],
          [
            { text: 'Las escenas representadas, vinculadas a la caza y a motivos mitológicos clásicos, serán expuestas al público a finales de año en el Museo de Israel, una vez concluyan las labores de restauración y catalogación que actualmente se llevan a cabo sobre el terreno.' },
          ],
        ],
      },
      C2: {
        headline: 'Las arenas de Jerusalén devuelven, casi intacto, un mosaico romano de mil setecientos años',
        body: [
          [
            { text: 'Un equipo de arqueólogos ha sacado a la luz, en las inmediaciones de Jerusalén, un ' },
            { text: 'mosaico', hebrew: 'פסיפס' },
            { text: ' de factura romana cuyo asombroso estado de conservación, después de más de mil setecientos años sepultado, ha devuelto a la comunidad científica un fragmento poco común de la cotidianidad mediterránea de la antigüedad tardía.' },
          ],
          [
            { text: 'Las escenas, vinculadas a la caza y a un repertorio mitológico de marcado clasicismo, serán expuestas a finales de año en el Museo de Israel, una vez concluyan las delicadas labores de restauración que aún se desarrollan sobre el terreno; los responsables prefieren no aventurar atribuciones definitivas, conscientes de que cada nueva pieza romana descubierta en la región tiende a reescribir, siquiera parcialmente, el mapa cultural del periodo.' },
          ],
        ],
      },
    },
  },

  {
    id: '4',
    flag: '🇪🇸',
    source: 'Marca',
    category: 'DEPORTE',
    minutes: 4,
    date: '8 de mayo, 2026',
    summary:
      'El estadio del FC Barcelona vuelve con una capacidad de 105.000 espectadores.',
    byLevel: {
      A1: {
        headline: 'El Camp Nou abre otra vez',
        body: [
          [
            { text: 'El Camp Nou abre otra vez. Es el ' },
            { text: 'estadio', hebrew: 'אצטדיון' },
            { text: ' del Barcelona.' },
          ],
        ],
      },
      A2: {
        headline: 'El Camp Nou reabre tras tres años de obras',
        body: [
          [
            { text: 'El Camp Nou abrió este fin de semana después de tres años de obras. Es el ' },
            { text: 'estadio', hebrew: 'אצטדיון' },
            { text: ' del FC Barcelona. Ahora caben 105.000 personas.' },
          ],
        ],
      },
      B1: {
        headline: 'El Camp Nou reabre sus puertas tras tres años de obras',
        body: [
          [
            { text: 'El ' },
            { text: 'estadio', hebrew: 'אצטדיון' },
            { text: ' Spotify Camp Nou ha vuelto a abrir oficialmente este fin de semana, tras tres años de obras de modernización. La nueva capacidad alcanza los 105.000 espectadores. El club ha presentado un calendario de actos para celebrar la reapertura, con conciertos y partidos amistosos. Para los aficionados, supone el regreso al estadio más emblemático de la ciudad.' },
          ],
        ],
      },
      B2: {
        headline: 'El Camp Nou regresa con una capacidad ampliada y nuevas instalaciones',
        body: [
          [
            { text: 'El Spotify Camp Nou ha vuelto oficialmente a la actividad este fin de semana, tras tres años de profundas obras de modernización que han elevado su capacidad hasta los 105.000 espectadores. El club ha aprovechado la reapertura para presentar un calendario inaugural cargado de conciertos, partidos amistosos y actos institucionales. Las nuevas instalaciones equiparan al ' },
            { text: 'estadio', hebrew: 'אצטדיון' },
            { text: ' con cualquier coliseo deportivo del primer nivel europeo. Para los aficionados, supone el reencuentro con uno de los grandes símbolos de la ciudad, tras años de partidos en sedes provisionales.' },
          ],
        ],
      },
      C1: {
        headline: 'El Camp Nou regresa: tres años de obras y un coliseo equiparable a los grandes europeos',
        body: [
          [
            { text: 'El Spotify Camp Nou ha vuelto oficialmente a la actividad este fin de semana, tras tres años de profundas obras de remodelación que han devuelto al templo blaugrana una capacidad ampliada y unas instalaciones equiparables a las de cualquier coliseo deportivo del primer nivel europeo.' },
          ],
          [
            { text: 'El club ha aprovechado la reapertura para presentar un calendario inaugural de actos institucionales, sociales y culturales con la voluntad de reposicionar el ' },
            { text: 'estadio', hebrew: 'אצטדיון' },
            { text: ' como uno de los grandes referentes del turismo deportivo de Barcelona y de su área metropolitana.' },
          ],
        ],
      },
      C2: {
        headline: 'El Camp Nou regresa, ya sin andamios, dispuesto a reclamar su sitio entre los grandes coliseos del fútbol europeo',
        body: [
          [
            { text: 'Tres años después de iniciar su transformación más ambiciosa, el Spotify Camp Nou ha vuelto este fin de semana a la actividad oficial, devuelto al barrio de Les Corts con una capacidad ampliada y un nivel de instalaciones que el propio club no duda en equiparar al de los grandes coliseos europeos.' },
          ],
          [
            { text: 'La reapertura ha sido aprovechada para desplegar un calendario inaugural cuidadosamente coreografiado —actos institucionales, sociales, culturales y deportivos— con la inequívoca voluntad de reposicionar el ' },
            { text: 'estadio', hebrew: 'אצטדיון' },
            { text: ' no ya como un mero recinto deportivo, sino como un eje vertebrador del turismo y la vida cultural de Barcelona y su área metropolitana.' },
          ],
        ],
      },
    },
  },

  {
    id: '5',
    flag: '🇮🇱',
    source: 'Globes',
    category: 'TRANSPORTE',
    minutes: 3,
    date: '7 de mayo, 2026',
    summary:
      'La nueva línea reduce a la mitad el tiempo de viaje entre las dos ciudades.',
    byLevel: {
      A1: {
        headline: 'Nuevo tren rápido entre Haifa y Tel Aviv',
        body: [
          [
            { text: 'Hay un ' },
            { text: 'tren', hebrew: 'רכבת' },
            { text: ' rápido entre Haifa y Tel Aviv. El viaje dura 30 minutos.' },
          ],
        ],
      },
      A2: {
        headline: 'Un tren rápido conecta Haifa y Tel Aviv en 30 minutos',
        body: [
          [
            { text: 'Esta semana empezó una nueva línea de ' },
            { text: 'tren', hebrew: 'רכבת' },
            { text: ' entre Haifa y Tel Aviv. Es muy rápida: solo 30 minutos. Antes el viaje era el doble de largo.' },
          ],
        ],
      },
      B1: {
        headline: 'El nuevo tren rápido conecta Haifa con Tel Aviv en treinta minutos',
        body: [
          [
            { text: 'La nueva línea de ' },
            { text: 'tren', hebrew: 'רכבת' },
            { text: ' rápido entre Haifa y Tel Aviv ha entrado oficialmente en servicio esta semana, reduciendo a la mitad el tiempo de viaje habitual entre las dos ciudades. El ministerio de Transportes calcula que más de cuarenta mil personas usarán la línea cada día. Se espera reducir notablemente el tráfico en las carreteras del norte. Para muchos viajeros, supone un cambio importante en su rutina diaria.' },
          ],
        ],
      },
      B2: {
        headline: 'La nueva línea ferroviaria entre Haifa y Tel Aviv reduce el viaje a la mitad',
        body: [
          [
            { text: 'La nueva línea de alta velocidad entre Haifa y Tel Aviv ha entrado oficialmente en servicio esta semana, reduciendo a la mitad un trayecto que durante años había padecido las congestiones del corredor norte del país. El ministerio de Transportes calcula que más de cuarenta mil pasajeros utilizarán la línea cada día y prevé un descenso notable del tráfico por carretera. Las autoridades locales celebran la inauguración como un impulso para la economía de Haifa, que durante décadas ha quedado al margen de las mejoras ferroviarias del centro del país. Para muchos viajeros se abre, de hecho, una nueva manera de habitar el norte y el centro como un único territorio.' },
          ],
        ],
      },
      C1: {
        headline: 'La nueva línea de alta velocidad acerca Haifa a Tel Aviv en treinta minutos',
        body: [
          [
            { text: 'La nueva línea de alta velocidad que conecta Haifa con Tel Aviv ha entrado oficialmente en servicio esta semana, reduciendo prácticamente a la mitad un trayecto que durante décadas había padecido todas las congestiones del corredor norte del país.' },
          ],
          [
            { text: 'El ministerio de Transportes ha calificado el proyecto como una de las infraestructuras más significativas de la última década y prevé que el flujo diario supere con holgura los cuarenta mil pasajeros una vez se estabilicen las frecuencias y se complete la integración con las líneas suburbanas.' },
          ],
        ],
      },
      C2: {
        headline: 'El corredor norte estrena su línea de alta velocidad y promete reescribir la geografía cotidiana del país',
        body: [
          [
            { text: 'La nueva línea de alta velocidad entre Haifa y Tel Aviv ha entrado oficialmente en servicio esta semana, reduciendo casi a la mitad un trayecto que durante décadas había acumulado todas las congestiones imaginables del corredor norte y que, no pocas veces, parecía resistirse a cualquier tentativa de mejora.' },
          ],
          [
            { text: 'El ministerio de Transportes ha calificado el proyecto como una de las infraestructuras más significativas de la última década y prevé que el flujo diario supere con holgura los cuarenta mil pasajeros, lo que de confirmarse acabaría reescribiendo, en silencio, la geografía cotidiana de millones de israelíes habituados a aceptar la distancia entre ambas ciudades como un mal menor inevitable.' },
          ],
        ],
      },
    },
  },

  {
    id: '6',
    flag: '🇪🇸',
    source: 'ABC',
    category: 'TURISMO',
    minutes: 4,
    date: '7 de mayo, 2026',
    summary:
      'La fiesta valenciana cierra una edición histórica con récord de turistas internacionales.',
    byLevel: {
      A1: {
        headline: 'Las Fallas de Valencia, con un millón de visitantes',
        body: [
          [
            { text: 'Las Fallas son una ' },
            { text: 'fiesta', hebrew: 'חגיגה' },
            { text: ' de Valencia. Este año vino un millón de personas.' },
          ],
        ],
      },
      A2: {
        headline: 'Un millón de personas visitan las Fallas de Valencia',
        body: [
          [
            { text: 'Las Fallas de Valencia terminaron este fin de semana. Vino más de un millón de personas a la ' },
            { text: 'fiesta', hebrew: 'חגיגה' },
            { text: '. Muchos turistas eran de otros países.' },
          ],
        ],
      },
      B1: {
        headline: 'Las Fallas de Valencia atraen a más de un millón de visitantes',
        body: [
          [
            { text: 'Las Fallas de Valencia han cerrado este año una edición histórica, con más de un millón de visitantes en sus calles. La ' },
            { text: 'fiesta', hebrew: 'חגיגה' },
            { text: ' tradicional valenciana es una de las más conocidas de España y atrae a turistas de todo el mundo. Los organizadores destacan el aumento de visitantes internacionales, sobre todo de Francia y Reino Unido. También subrayan la creciente importancia de las redes sociales para difundir la fiesta.' },
          ],
        ],
      },
      B2: {
        headline: 'Las Fallas firman una edición histórica con más de un millón de visitantes en Valencia',
        body: [
          [
            { text: 'Las Fallas de Valencia han cerrado este año una edición especialmente memorable, con más de un millón de visitantes registrados en el casco histórico y un repunte sin precedentes de la presencia de público internacional. La organización destaca el peso del mercado francés y británico, así como el papel cada vez más decisivo de las redes sociales en la proyección global de la ' },
            { text: 'fiesta', hebrew: 'חגיגה' },
            { text: '. La inversión cultural también ha crecido respecto a ediciones anteriores. Para Valencia, las cifras suponen una confirmación clara del atractivo turístico de su patrimonio festivo, recientemente reconocido por la UNESCO.' },
          ],
        ],
      },
      C1: {
        headline: 'Las Fallas cierran una edición memorable con récord de visitantes internacionales',
        body: [
          [
            { text: 'Las Fallas de Valencia han clausurado este año una edición particularmente memorable, con más de un millón de visitantes registrados en el casco histórico y un repunte sin precedentes en la presencia de público internacional procedente, en buena parte, de mercados como el francés y el británico.' },
          ],
          [
            { text: 'La Junta Central Fallera ha destacado el incremento de la inversión cultural y el papel determinante de las redes sociales en la proyección global de la ' },
            { text: 'fiesta', hebrew: 'חגיגה' },
            { text: ', recientemente reconocida por la UNESCO como Patrimonio Cultural Inmaterial de la Humanidad.' },
          ],
        ],
      },
      C2: {
        headline: 'Las Fallas se despiden tras una edición sin precedentes que vuelve a confirmar a Valencia como capital festiva del Mediterráneo',
        body: [
          [
            { text: 'Las Fallas de Valencia se han despedido este año de una edición que pocos vacilarán en calificar de sin precedentes: más de un millón de visitantes en el casco histórico y un repunte hasta ahora desconocido en la presencia de público internacional, procedente en buena medida de los mercados francés y británico, han devuelto a la capital del Turia el pulso de las grandes capitales festivas del Mediterráneo.' },
          ],
          [
            { text: 'La Junta Central Fallera ha subrayado el aumento de la inversión cultural y el creciente protagonismo de las redes sociales como vehículo de proyección global de una ' },
            { text: 'fiesta', hebrew: 'חגיגה' },
            { text: ' que, recientemente reconocida por la UNESCO como Patrimonio Cultural Inmaterial de la Humanidad, parece haber encontrado, casi sin proponérselo, una segunda juventud.' },
          ],
        ],
      },
    },
  },
]

export const getArticleById = (id) => articles.find((a) => a.id === id) || articles[0]

// Returns { headline, body } for the requested level. If the level is not
// available for that article, falls back to the closest neighbouring level.
export function getArticleContent(article, level) {
  const map = article.byLevel || {}
  if (map[level]) return map[level]
  const idx = LEVELS.indexOf(level)
  for (let d = 1; d < LEVELS.length; d++) {
    const lower = LEVELS[idx - d]
    const upper = LEVELS[idx + d]
    if (lower && map[lower]) return map[lower]
    if (upper && map[upper]) return map[upper]
  }
  return { headline: '', body: [] }
}
