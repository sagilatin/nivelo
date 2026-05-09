// 35 placeholder Spanish news articles — 5 per country.
//
// Article shape:
//   id, country, flag                ── identification + filtering
//   source, sourceLang, sourceUrl    ── displayed as "Source · LANG", links out
//   category, minutes, date          ── card metadata
//   imageSeed                        ── stable seed for picsum.photos
//   summary                          ── Spanish blurb shown on card
//   summaryTranslations: { en, he, de, fr, it, ja }
//                                    ── lighter italic line under the summary
//   byLevel: { A1..C2: { headline, body } }
//                                    ── headline + body adapt to the CEFR level.
//                                       Body paragraphs are arrays of segments;
//                                       a segment is { text } or { text, t: true }.
//
// The 11 original articles ship full A1–C2. The 24 newer ones ship A1 + B1,
// and getArticleContent() falls back to the closest available level.

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const SRC = {
  haaretz:    { source: 'Haaretz',             sourceLang: 'EN', sourceUrl: 'https://www.haaretz.com' },
  toi:        { source: 'Times of Israel',     sourceLang: 'EN', sourceUrl: 'https://www.timesofisrael.com' },
  elpais:     { source: 'El País',             sourceLang: 'ES', sourceUrl: 'https://elpais.com' },
  elmundo:    { source: 'El Mundo',            sourceLang: 'ES', sourceUrl: 'https://www.elmundo.es' },
  nyt:        { source: 'The New York Times',  sourceLang: 'EN', sourceUrl: 'https://www.nytimes.com' },
  wapo:       { source: 'Washington Post',     sourceLang: 'EN', sourceUrl: 'https://www.washingtonpost.com' },
  bbc:        { source: 'BBC',                 sourceLang: 'EN', sourceUrl: 'https://www.bbc.com' },
  reuters:    { source: 'Reuters',             sourceLang: 'EN', sourceUrl: 'https://www.reuters.com' },
  repubblica: { source: 'La Repubblica',       sourceLang: 'IT', sourceUrl: 'https://www.repubblica.it' },
  corriere:   { source: 'Corriere',            sourceLang: 'IT', sourceUrl: 'https://www.corriere.it' },
  lemonde:    { source: 'Le Monde',            sourceLang: 'FR', sourceUrl: 'https://www.lemonde.fr' },
  lefigaro:   { source: 'Le Figaro',           sourceLang: 'FR', sourceUrl: 'https://www.lefigaro.fr' },
  nhk:        { source: 'NHK',                 sourceLang: 'JP', sourceUrl: 'https://www3.nhk.or.jp' },
  asahi:      { source: 'Asahi',               sourceLang: 'JP', sourceUrl: 'https://www.asahi.com' },
}

export const articles = [
  // ─── 1 · Israel · Tel Aviv batteries ────────────────────────────────
  {
    id: '1', country: 'IL', flag: '🇮🇱', ...SRC.haaretz,
    category: 'TECNOLOGÍA', minutes: 4, date: '9 de mayo, 2026',
    imageSeed: 'nivelo-tel-aviv-tech',
    summary: 'StoreDot anuncia un acuerdo con tres fabricantes europeos de coches.',
    summaryTranslations: {
      en: 'StoreDot announces a deal with three European carmakers.',
      he: 'סטורדוט הודיעה על הסכם עם שלושה יצרני רכב אירופיים.',
      de: 'StoreDot kündigt einen Vertrag mit drei europäischen Autobauern an.',
      fr: 'StoreDot annonce un accord avec trois constructeurs automobiles européens.',
      it: 'StoreDot annuncia un accordo con tre case automobilistiche europee.',
      ja: 'StoreDotが欧州自動車メーカー3社との契約を発表。',
    },
    byLevel: {
      A1: {
        headline: 'Tel Aviv crea baterías rápidas',
        body: [[
          { text: 'Una ' }, { text: 'empresa', t: true },
          { text: ' de Tel Aviv hace una ' }, { text: 'batería', t: true },
          { text: ' nueva. La batería es para coches eléctricos. Se carga en cinco minutos. Antes los coches eléctricos eran lentos. Ahora cargar el coche es muy fácil.' },
        ]],
      },
      A2: {
        headline: 'Una empresa de Tel Aviv crea baterías de carga rápida',
        body: [[
          { text: 'Una ' }, { text: 'empresa', t: true },
          { text: ' de Tel Aviv presentó una ' }, { text: 'batería', t: true },
          { text: ' para coches eléctricos. La batería se carga en cinco minutos. La producción empezará el próximo año en Haifa.' },
        ]],
      },
      B1: {
        headline: 'Una startup de Tel Aviv crea baterías que se cargan en cinco minutos',
        body: [[
          { text: 'Una empresa tecnológica de Tel Aviv ha presentado una ' },
          { text: 'batería', t: true },
          { text: ' para coches eléctricos que se carga en solo cinco minutos. La compañía, llamada StoreDot, ya ha firmado acuerdos con tres ' },
          { text: 'fabricantes', t: true },
          { text: ' europeos. La producción empezará a principios del próximo año en una fábrica cerca de Haifa. Los expertos creen que es un cambio importante para la industria del coche eléctrico.' },
        ]],
      },
      B2: {
        headline: 'Una startup israelí presenta una batería capaz de cargarse en cinco minutos',
        body: [[
          { text: 'Una ' }, { text: 'empresa', t: true },
          { text: ' tecnológica con sede en Tel Aviv ha sorprendido al sector del automóvil con una nueva ' },
          { text: 'batería', t: true },
          { text: ' para coches eléctricos capaz de cargarse en apenas cinco minutos. La compañía, llamada StoreDot, ha cerrado acuerdos con tres ' },
          { text: 'fabricantes', t: true },
          { text: ' europeos cuyas identidades aún no ha desvelado. La producción comenzará a principios del próximo año en una planta cercana a Haifa. Para muchos analistas, este avance podría suponer un cambio decisivo: hasta ahora la lentitud de la recarga seguía siendo el principal ' },
          { text: 'obstáculo', t: true },
          { text: ' para los conductores. El gobierno israelí ha celebrado el anuncio y ha prometido apoyo financiero.' },
        ]],
      },
      C1: {
        headline: 'Una compañía israelí desarrolla una batería que reduce la recarga eléctrica a cinco minutos',
        body: [
          [
            { text: 'Una ' }, { text: 'empresa', t: true },
            { text: ' tecnológica con sede en Tel Aviv ha irrumpido en el sector automovilístico al presentar una ' },
            { text: 'batería', t: true },
            { text: ' para vehículos eléctricos cuya recarga completa se realiza, según sus desarrolladores, en apenas cinco minutos. La firma, denominada StoreDot, ya ha alcanzado acuerdos estratégicos con tres ' },
            { text: 'fabricantes', t: true },
            { text: ' europeos de gran envergadura, cuyas identidades permanecen, de momento, bajo reserva.' },
          ],
          [
            { text: 'Para los analistas del sector, el avance podría constituir un punto de inflexión: hasta ahora, los tiempos de recarga representaban uno de los principales ' },
            { text: 'escollos', t: true },
            { text: ' para la transición masiva al coche eléctrico. El ejecutivo israelí ha celebrado el hito y se ha comprometido a destinar fondos adicionales para mantener la innovación tecnológica como pilar estratégico de la economía nacional.' },
          ],
        ],
      },
      C2: {
        headline: 'Una firma israelí promete revolucionar el coche eléctrico con una batería de carga ultrarrápida',
        body: [
          [
            { text: 'Lo que durante años pareció una promesa lejana de la ingeniería —una ' },
            { text: 'batería', t: true },
            { text: ' capaz de disipar, en cuestión de minutos, las inquietudes acumuladas por toda una generación de conductores— se ha materializado esta semana en Tel Aviv. La firma StoreDot ha presentado un dispositivo cuyo tiempo de recarga, fijado en escasos cinco minutos, desafía cuanto cabía esperar del actual estado del arte; tres ' },
            { text: 'fabricantes', t: true },
            { text: ' europeos, cuya identidad prefieren resguardar de la curiosidad mediática, habrían suscrito ya acuerdos con la compañía.' },
          ],
          [
            { text: 'Los analistas más prudentes coinciden en señalar que, de cumplirse las expectativas, el sector se enfrenta a un punto de no retorno. El ejecutivo israelí, consciente del valor simbólico y económico del ' },
            { text: 'hallazgo', t: true },
            { text: ', no ha tardado en comprometer apoyos adicionales para que la innovación local conserve el papel privilegiado que ha venido ocupando.' },
          ],
        ],
      },
    },
  },

  // ─── 2 · España · Vivienda ──────────────────────────────────────────
  {
    id: '2', country: 'ES', flag: '🇪🇸', ...SRC.elpais,
    category: 'POLÍTICA', minutes: 5, date: '9 de mayo, 2026',
    imageSeed: 'nivelo-spain-housing',
    summary: 'La norma limita los alquileres en zonas tensionadas y obliga a los grandes propietarios.',
    summaryTranslations: {
      en: 'The law caps rents in stressed areas and binds large landlords.',
      he: 'החוק מגביל שכר דירה באזורי לחץ ומחייב את בעלי הנכסים הגדולים.',
      de: 'Das Gesetz deckelt Mieten in angespannten Gebieten und bindet Großvermieter.',
      fr: "La loi plafonne les loyers dans les zones tendues et engage les grands propriétaires.",
      it: 'La legge limita gli affitti nelle zone tese e vincola i grandi proprietari.',
      ja: '逼迫地域の家賃を制限し、大家を拘束する法律。',
    },
    byLevel: {
      A1: { headline: 'Nueva ley de vivienda en España', body: [[
        { text: 'España tiene una ley nueva. La ley es sobre la ' }, { text: 'vivienda', t: true },
        { text: '. Los pisos son muy caros en muchas ciudades. La ley quiere ayudar a las familias. Ahora los alquileres no van a subir tanto.' },
      ]]},
      A2: { headline: 'España aprueba una ley para bajar los alquileres', body: [[
        { text: 'El Congreso aprobó hoy una nueva ley de ' }, { text: 'vivienda', t: true },
        { text: '. Los alquileres no podrán subir tanto en algunas ciudades. El gobierno quiere ayudar a las familias jóvenes.' },
      ]]},
      B1: { headline: 'El Congreso aprueba una nueva ley de vivienda asequible', body: [[
        { text: 'El Congreso ha aprobado hoy una ley para frenar el aumento de los alquileres en las ciudades más afectadas por la crisis inmobiliaria. La norma identifica zonas tensionadas, donde los grandes propietarios no podrán cobrar por encima de un índice oficial. La oposición critica la medida y advierte que podría reducir la oferta de pisos. El gobierno defiende que la ley es necesaria para proteger a las familias jóvenes y a quienes buscan su primera ' },
        { text: 'vivienda', t: true }, { text: '.' },
      ]]},
      B2: { headline: 'España aprueba una ley para limitar los alquileres en zonas tensionadas', body: [[
        { text: 'El Congreso ha aprobado este jueves una nueva ley de ' }, { text: 'vivienda', t: true },
        { text: ' destinada a frenar el aumento de los alquileres en aquellas ciudades donde la presión inmobiliaria se ha vuelto insostenible. La norma identifica las llamadas zonas tensionadas y obliga a los grandes propietarios a someter sus rentas a un índice de referencia oficial, además de reservar parte de su parque a precios reducidos. La oposición ha cuestionado la medida y advierte que podría reducir la oferta. El gobierno sostiene que la ley es imprescindible para proteger a las familias jóvenes y a los hogares con menos recursos.' },
      ]]},
      C1: { headline: 'Aprobada una ambiciosa ley de vivienda para contener la escalada de los alquileres', body: [
        [{ text: 'El Congreso de los Diputados ha aprobado este jueves una ambiciosa ley de ' },
         { text: 'vivienda', t: true },
         { text: ' destinada a contener la escalada de los alquileres en aquellos núcleos urbanos donde la presión inmobiliaria se ha vuelto insostenible para amplios sectores de la población.' }],
        [{ text: 'La normativa, sometida a meses de negociación parlamentaria, identifica las denominadas zonas tensionadas y obliga a los grandes tenedores a someter sus rentas a un índice de referencia oficial. La oposición cuestiona el alcance del texto, alertando sobre un posible efecto adverso sobre la oferta disponible; el ejecutivo defiende su urgencia como pieza clave de la política de vivienda del próximo ciclo legislativo.' }],
      ]},
      C2: { headline: 'El Congreso intenta domar el mercado del alquiler con una de las leyes de vivienda más ambiciosas en décadas', body: [
        [{ text: 'Tras meses de pulsos parlamentarios, el Congreso ha aprobado este jueves una de las leyes de ' },
         { text: 'vivienda', t: true },
         { text: ' más ambiciosas que se recuerdan en la última década, concebida para contener una escalada de los alquileres que, en determinados núcleos urbanos, ha terminado por desbordar todas las previsiones razonables sobre el acceso a un derecho básico.' }],
        [{ text: 'La norma, fruto de un equilibrio frágil entre socios de gobierno, identifica las llamadas zonas tensionadas y somete las rentas de los grandes tenedores a un índice oficial. La oposición, no exenta de cierta razón técnica, advierte de un eventual repliegue de la oferta; el ejecutivo defiende la urgencia del texto como gesto político inaplazable frente a una generación que percibe la vivienda como una promesa cada vez más distante.' }],
      ]},
    },
  },

  // ─── 3 · Israel · Mosaico ───────────────────────────────────────────
  {
    id: '3', country: 'IL', flag: '🇮🇱', ...SRC.toi,
    category: 'CULTURA', minutes: 3, date: '8 de mayo, 2026',
    imageSeed: 'nivelo-roman-mosaic',
    summary: 'El hallazgo, en perfecto estado, será expuesto al público a finales de año.',
    summaryTranslations: {
      en: 'The find, in perfect condition, will go on public display by year-end.',
      he: 'הממצא, במצב מושלם, יוצג לציבור עד סוף השנה.',
      de: 'Der Fund, in perfektem Zustand, wird Ende des Jahres öffentlich ausgestellt.',
      fr: "La découverte, en parfait état, sera exposée au public d'ici la fin de l'année.",
      it: 'Il ritrovamento, in perfette condizioni, sarà esposto al pubblico entro fine anno.',
      ja: '保存状態が完璧な発見物が、年末までに一般公開される予定。',
    },
    byLevel: {
      A1: { headline: 'Mosaico romano viejo cerca de Jerusalén', body: [[
        { text: 'Cerca de Jerusalén hay un ' }, { text: 'mosaico', t: true },
        { text: ' romano. Es muy viejo: tiene 1.700 años. El mosaico está bien conservado. Tiene imágenes de animales y de caza. La gente lo verá en un museo este año.' },
      ]]},
      A2: { headline: 'Encuentran un mosaico romano cerca de Jerusalén', body: [[
        { text: 'Unos arqueólogos encontraron un ' }, { text: 'mosaico', t: true },
        { text: ' romano cerca de Jerusalén. Es muy viejo: tiene 1.700 años. Estará en el museo este año.' },
      ]]},
      B1: { headline: 'Arqueólogos hallan un mosaico romano de 1.700 años cerca de Jerusalén', body: [[
        { text: 'Un equipo de arqueólogos ha descubierto un ' }, { text: 'mosaico', t: true },
        { text: ' romano cerca de Jerusalén que se conserva en un estado excepcional después de más de mil setecientos años bajo tierra. Las imágenes representan escenas de caza y figuras mitológicas. Los expertos lo consideran uno de los hallazgos más importantes de los últimos años. El mosaico se expondrá al público a finales de año en el Museo de Israel.' },
      ]]},
      B2: { headline: 'Hallan un mosaico romano en estado excepcional cerca de Jerusalén', body: [[
        { text: 'Un equipo de arqueólogos ha sacado a la luz cerca de Jerusalén un ' }, { text: 'mosaico', t: true },
        { text: ' romano cuyo estado de conservación, tras más de mil setecientos años bajo tierra, ha sorprendido a la comunidad científica. Las escenas, vinculadas a la caza y a motivos mitológicos clásicos, constituyen, según los expertos, uno de los hallazgos más relevantes de la última década en la región. El mosaico será restaurado durante los próximos meses y se expondrá al público a finales de año en el Museo de Israel.' },
      ]]},
      C1: { headline: 'Sale a la luz un mosaico romano excepcional en las inmediaciones de Jerusalén', body: [
        [{ text: 'Un equipo de arqueólogos ha sacado a la luz, en las inmediaciones de Jerusalén, un ' }, { text: 'mosaico', t: true },
         { text: ' de factura romana cuyo extraordinario estado de conservación, después de más de mil setecientos años bajo tierra, ha sorprendido a la comunidad científica.' }],
        [{ text: 'Las escenas representadas, vinculadas a la caza y a motivos mitológicos clásicos, serán expuestas al público a finales de año en el Museo de Israel, una vez concluyan las labores de restauración y catalogación que actualmente se llevan a cabo sobre el terreno.' }],
      ]},
      C2: { headline: 'Las arenas de Jerusalén devuelven, casi intacto, un mosaico romano de mil setecientos años', body: [
        [{ text: 'Un equipo de arqueólogos ha sacado a la luz, en las inmediaciones de Jerusalén, un ' }, { text: 'mosaico', t: true },
         { text: ' de factura romana cuyo asombroso estado de conservación, después de más de mil setecientos años sepultado, ha devuelto a la comunidad científica un fragmento poco común de la cotidianidad mediterránea de la antigüedad tardía.' }],
        [{ text: 'Las escenas, vinculadas a la caza y a un repertorio mitológico de marcado clasicismo, serán expuestas a finales de año en el Museo de Israel, una vez concluyan las delicadas labores de restauración que aún se desarrollan sobre el terreno.' }],
      ]},
    },
  },

  // ─── 4 · España · Camp Nou ──────────────────────────────────────────
  {
    id: '4', country: 'ES', flag: '🇪🇸', ...SRC.elmundo,
    category: 'DEPORTE', minutes: 4, date: '8 de mayo, 2026',
    imageSeed: 'nivelo-camp-nou',
    summary: 'El estadio del FC Barcelona vuelve con una capacidad de 105.000 espectadores.',
    summaryTranslations: {
      en: 'FC Barcelona\'s stadium returns with a 105,000-seat capacity.',
      he: 'האצטדיון של ברצלונה חוזר ביכולת קיבול של 105,000 צופים.',
      de: 'Das FC-Barcelona-Stadion kehrt mit 105.000 Plätzen zurück.',
      fr: "Le stade du FC Barcelone revient avec une capacité de 105 000 places.",
      it: 'Lo stadio del Barcellona torna con una capienza di 105.000 spettatori.',
      ja: 'FCバルセロナのスタジアムが105,000席で復帰。',
    },
    byLevel: {
      A1: { headline: 'El Camp Nou abre otra vez', body: [[
        { text: 'El Camp Nou abre otra vez. Es el ' }, { text: 'estadio', t: true },
        { text: ' del Barcelona. Las obras duraron tres años. Ahora caben 105.000 personas. Es un día feliz para los aficionados.' },
      ]]},
      A2: { headline: 'El Camp Nou reabre tras tres años de obras', body: [[
        { text: 'El Camp Nou abrió este fin de semana después de tres años de obras. Es el ' }, { text: 'estadio', t: true },
        { text: ' del FC Barcelona. Ahora caben 105.000 personas.' },
      ]]},
      B1: { headline: 'El Camp Nou reabre sus puertas tras tres años de obras', body: [[
        { text: 'El ' }, { text: 'estadio', t: true },
        { text: ' Spotify Camp Nou ha vuelto a abrir oficialmente este fin de semana, tras tres años de obras de modernización. La nueva capacidad alcanza los 105.000 espectadores. El club ha presentado un calendario de actos para celebrar la reapertura, con conciertos y partidos amistosos. Para los aficionados, supone el regreso al estadio más emblemático de la ciudad.' },
      ]]},
      B2: { headline: 'El Camp Nou regresa con una capacidad ampliada y nuevas instalaciones', body: [[
        { text: 'El Spotify Camp Nou ha vuelto oficialmente a la actividad este fin de semana, tras tres años de profundas obras de modernización que han elevado su capacidad hasta los 105.000 espectadores. El club ha aprovechado la reapertura para presentar un calendario inaugural cargado de conciertos, partidos amistosos y actos institucionales. Las nuevas instalaciones equiparan al ' },
        { text: 'estadio', t: true },
        { text: ' con cualquier coliseo deportivo del primer nivel europeo. Para los aficionados, supone el reencuentro con uno de los grandes símbolos de la ciudad.' },
      ]]},
      C1: { headline: 'El Camp Nou regresa: tres años de obras y un coliseo equiparable a los grandes europeos', body: [
        [{ text: 'El Spotify Camp Nou ha vuelto oficialmente a la actividad este fin de semana, tras tres años de profundas obras de remodelación que han devuelto al templo blaugrana una capacidad ampliada y unas instalaciones equiparables a las de cualquier coliseo deportivo del primer nivel europeo.' }],
        [{ text: 'El club ha aprovechado la reapertura para presentar un calendario inaugural de actos institucionales, sociales y culturales con la voluntad de reposicionar el ' },
         { text: 'estadio', t: true },
         { text: ' como uno de los grandes referentes del turismo deportivo de Barcelona y de su área metropolitana.' }],
      ]},
      C2: { headline: 'El Camp Nou regresa, ya sin andamios, dispuesto a reclamar su sitio entre los grandes coliseos del fútbol europeo', body: [
        [{ text: 'Tres años después de iniciar su transformación más ambiciosa, el Spotify Camp Nou ha vuelto este fin de semana a la actividad oficial, devuelto al barrio de Les Corts con una capacidad ampliada y un nivel de instalaciones que el propio club no duda en equiparar al de los grandes coliseos europeos.' }],
        [{ text: 'La reapertura ha sido aprovechada para desplegar un calendario inaugural cuidadosamente coreografiado —actos institucionales, sociales, culturales y deportivos— con la inequívoca voluntad de reposicionar el ' },
         { text: 'estadio', t: true },
         { text: ' no ya como un mero recinto deportivo, sino como un eje vertebrador del turismo y la vida cultural de Barcelona y su área metropolitana.' }],
      ]},
    },
  },

  // ─── 5 · Israel · Tren rápido ───────────────────────────────────────
  {
    id: '5', country: 'IL', flag: '🇮🇱', ...SRC.toi,
    category: 'TRANSPORTE', minutes: 3, date: '7 de mayo, 2026',
    imageSeed: 'nivelo-haifa-train',
    summary: 'La nueva línea reduce a la mitad el tiempo de viaje entre las dos ciudades.',
    summaryTranslations: {
      en: 'The new line halves the travel time between the two cities.',
      he: 'הקו החדש חוצה את זמן הנסיעה בין שתי הערים.',
      de: 'Die neue Linie halbiert die Reisezeit zwischen den beiden Städten.',
      fr: 'La nouvelle ligne divise par deux le temps de trajet entre les deux villes.',
      it: 'La nuova linea dimezza il tempo di percorrenza tra le due città.',
      ja: '新路線が二都市間の所要時間を半分に短縮。',
    },
    byLevel: {
      A1: { headline: 'Nuevo tren rápido entre Haifa y Tel Aviv', body: [[
        { text: 'Hay un nuevo ' }, { text: 'tren', t: true },
        { text: ' entre Haifa y Tel Aviv. El viaje dura solo treinta minutos. Antes era el doble de largo. Mucha gente va a usar el tren cada día. Es muy bueno para el norte del país.' },
      ]]},
      A2: { headline: 'Un tren rápido conecta Haifa y Tel Aviv en 30 minutos', body: [[
        { text: 'Esta semana empezó una nueva línea de ' }, { text: 'tren', t: true },
        { text: ' entre Haifa y Tel Aviv. Es muy rápida: solo 30 minutos. Antes el viaje era el doble de largo.' },
      ]]},
      B1: { headline: 'El nuevo tren rápido conecta Haifa con Tel Aviv en treinta minutos', body: [[
        { text: 'La nueva línea de ' }, { text: 'tren', t: true },
        { text: ' rápido entre Haifa y Tel Aviv ha entrado oficialmente en servicio esta semana, reduciendo a la mitad el tiempo de viaje habitual entre las dos ciudades. El ministerio de Transportes calcula que más de cuarenta mil personas usarán la línea cada día. Se espera reducir notablemente el tráfico en las carreteras del norte. Para muchos viajeros, supone un cambio importante en su rutina diaria.' },
      ]]},
      B2: { headline: 'La nueva línea ferroviaria entre Haifa y Tel Aviv reduce el viaje a la mitad', body: [[
        { text: 'La nueva línea de alta velocidad entre Haifa y Tel Aviv ha entrado oficialmente en servicio esta semana, reduciendo a la mitad un trayecto que durante años había padecido las congestiones del corredor norte del país. El ministerio de Transportes calcula que más de cuarenta mil pasajeros utilizarán la línea cada día y prevé un descenso notable del tráfico por carretera. Las autoridades locales celebran la inauguración como un impulso para la economía de Haifa.' },
      ]]},
      C1: { headline: 'La nueva línea de alta velocidad acerca Haifa a Tel Aviv en treinta minutos', body: [
        [{ text: 'La nueva línea de alta velocidad que conecta Haifa con Tel Aviv ha entrado oficialmente en servicio esta semana, reduciendo prácticamente a la mitad un trayecto que durante décadas había padecido todas las congestiones del corredor norte del país.' }],
        [{ text: 'El ministerio de Transportes ha calificado el proyecto como una de las infraestructuras más significativas de la última década y prevé que el flujo diario supere con holgura los cuarenta mil pasajeros una vez se estabilicen las frecuencias.' }],
      ]},
      C2: { headline: 'El corredor norte estrena su línea de alta velocidad y promete reescribir la geografía cotidiana del país', body: [
        [{ text: 'La nueva línea de alta velocidad entre Haifa y Tel Aviv ha entrado oficialmente en servicio esta semana, reduciendo casi a la mitad un trayecto que durante décadas había acumulado todas las congestiones imaginables del corredor norte y que parecía resistirse a cualquier tentativa de mejora.' }],
        [{ text: 'El ministerio de Transportes ha calificado el proyecto como una de las infraestructuras más significativas de la última década y prevé que el flujo diario supere con holgura los cuarenta mil pasajeros, lo que de confirmarse acabaría reescribiendo la geografía cotidiana de millones de israelíes.' }],
      ]},
    },
  },

  // ─── 6 · España · Fallas ────────────────────────────────────────────
  {
    id: '6', country: 'ES', flag: '🇪🇸', ...SRC.elpais,
    category: 'TURISMO', minutes: 4, date: '7 de mayo, 2026',
    imageSeed: 'nivelo-fallas-valencia',
    summary: 'La fiesta valenciana cierra una edición histórica con récord de turistas internacionales.',
    summaryTranslations: {
      en: 'Valencia\'s festival closes a record-breaking edition with international tourists.',
      he: "החגיגה הוולנסיאנית מסיימת מהדורה היסטורית עם שיא של תיירים בינלאומיים.",
      de: 'Valencias Fest schließt eine Rekordausgabe mit internationalen Touristen ab.',
      fr: 'La fête valencienne clôt une édition record avec des touristes internationaux.',
      it: 'La festa valenciana chiude un\'edizione record con turisti internazionali.',
      ja: 'バレンシアの祭りが国際観光客の記録更新で歴史的な開催を終了。',
    },
    byLevel: {
      A1: { headline: 'Las Fallas de Valencia, con un millón de visitantes', body: [[
        { text: 'Las Fallas son una ' }, { text: 'fiesta', t: true },
        { text: ' de Valencia. La fiesta tiene mucha música y fuego. Este año vino un millón de personas. Muchos turistas son de otros países. Valencia está muy contenta este año.' },
      ]]},
      A2: { headline: 'Un millón de personas visitan las Fallas de Valencia', body: [[
        { text: 'Las Fallas de Valencia terminaron este fin de semana. Vino más de un millón de personas a la ' }, { text: 'fiesta', t: true },
        { text: '. Muchos turistas eran de otros países.' },
      ]]},
      B1: { headline: 'Las Fallas de Valencia atraen a más de un millón de visitantes', body: [[
        { text: 'Las Fallas de Valencia han cerrado este año una edición histórica, con más de un millón de visitantes en sus calles. La ' }, { text: 'fiesta', t: true },
        { text: ' tradicional valenciana es una de las más conocidas de España y atrae a turistas de todo el mundo. Los organizadores destacan el aumento de visitantes internacionales, sobre todo de Francia y Reino Unido. También subrayan la creciente importancia de las redes sociales para difundir la fiesta.' },
      ]]},
      B2: { headline: 'Las Fallas firman una edición histórica con más de un millón de visitantes en Valencia', body: [[
        { text: 'Las Fallas de Valencia han cerrado este año una edición especialmente memorable, con más de un millón de visitantes registrados en el casco histórico y un repunte sin precedentes de la presencia de público internacional. La organización destaca el peso del mercado francés y británico, así como el papel cada vez más decisivo de las redes sociales en la proyección global de la ' },
        { text: 'fiesta', t: true },
        { text: '. La inversión cultural también ha crecido respecto a ediciones anteriores. Para Valencia, las cifras suponen una confirmación clara del atractivo turístico de su patrimonio festivo.' },
      ]]},
      C1: { headline: 'Las Fallas cierran una edición memorable con récord de visitantes internacionales', body: [
        [{ text: 'Las Fallas de Valencia han clausurado este año una edición particularmente memorable, con más de un millón de visitantes registrados en el casco histórico y un repunte sin precedentes en la presencia de público internacional procedente, en buena parte, de mercados como el francés y el británico.' }],
        [{ text: 'La Junta Central Fallera ha destacado el incremento de la inversión cultural y el papel determinante de las redes sociales en la proyección global de la ' },
         { text: 'fiesta', t: true },
         { text: ', recientemente reconocida por la UNESCO como Patrimonio Cultural Inmaterial de la Humanidad.' }],
      ]},
      C2: { headline: 'Las Fallas se despiden tras una edición sin precedentes que vuelve a confirmar a Valencia como capital festiva del Mediterráneo', body: [
        [{ text: 'Las Fallas de Valencia se han despedido este año de una edición que pocos vacilarán en calificar de sin precedentes: más de un millón de visitantes en el casco histórico y un repunte hasta ahora desconocido en la presencia de público internacional, procedente en buena medida de los mercados francés y británico, han devuelto a la capital del Turia el pulso de las grandes capitales festivas del Mediterráneo.' }],
        [{ text: 'La Junta Central Fallera ha subrayado el aumento de la inversión cultural y el creciente protagonismo de las redes sociales como vehículo de proyección global de una ' },
         { text: 'fiesta', t: true },
         { text: ' que, recientemente reconocida por la UNESCO como Patrimonio Cultural Inmaterial de la Humanidad, parece haber encontrado, casi sin proponérselo, una segunda juventud.' }],
      ]},
    },
  },

  // ─── 7 · USA · IA cáncer ────────────────────────────────────────────
  {
    id: '7', country: 'US', flag: '🇺🇸', ...SRC.nyt,
    category: 'TECNOLOGÍA', minutes: 4, date: '7 de mayo, 2026',
    imageSeed: 'nivelo-california-ai',
    summary: 'El programa analiza imágenes médicas y detecta señales de cáncer en segundos.',
    summaryTranslations: {
      en: 'The system reviews medical scans and flags signs of cancer in seconds.',
      he: 'התוכנה מנתחת תמונות רפואיות ומזהה סימני סרטן תוך שניות.',
      de: 'Das System wertet medizinische Bilder aus und erkennt Krebszeichen in Sekunden.',
      fr: 'Le programme analyse les images médicales et détecte les signes de cancer en quelques secondes.',
      it: 'Il programma analizza le immagini mediche e rileva segni di cancro in pochi secondi.',
      ja: 'システムが医療画像を解析し、数秒で癌の兆候を検出。',
    },
    byLevel: {
      A1: { headline: 'Una universidad de California ayuda con el cáncer', body: [[
        { text: 'Una universidad de California tiene una idea nueva. Hace un programa de ' }, { text: 'inteligencia', t: true },
        { text: ' artificial. El programa ayuda a los médicos. Puede ver el cáncer muy rápido. Es una buena noticia para todos.' },
      ]]},
      A2: { headline: 'Una universidad de California crea una IA para detectar el cáncer', body: [[
        { text: 'Una universidad de California ha creado un programa de ' }, { text: 'inteligencia', t: true },
        { text: ' artificial. El programa ayuda a los médicos a detectar el cáncer más rápido. Los primeros resultados son muy positivos.' },
      ]]},
      B1: { headline: 'Crean una inteligencia artificial capaz de detectar el cáncer en segundos', body: [[
        { text: 'Un grupo de ' }, { text: 'investigadores', t: true },
        { text: ' de una universidad de California ha presentado un programa de ' }, { text: 'inteligencia', t: true },
        { text: ' artificial capaz de detectar varios tipos de cáncer en pocos segundos. La herramienta analiza imágenes médicas y avisa a los médicos cuando encuentra señales de la enfermedad. Los primeros resultados son muy positivos. Los científicos esperan probarla en hospitales de todo el país.' },
      ]]},
      B2: { headline: 'Una IA desarrollada en California promete revolucionar el diagnóstico del cáncer', body: [[
        { text: 'Un grupo de ' }, { text: 'investigadores', t: true },
        { text: ' de una universidad de California ha presentado un programa de ' }, { text: 'inteligencia', t: true },
        { text: ' artificial capaz de detectar varios tipos de cáncer en pocos segundos a partir de imágenes médicas. La herramienta avisa a los médicos cuando encuentra señales sospechosas y permite confirmar el diagnóstico con mayor rapidez. Los primeros resultados, publicados en una revista científica reciente, son muy alentadores y han generado gran expectación entre la comunidad médica. Si las pruebas siguen confirmándose, el programa podría llegar a hospitales de todo el país durante el próximo año.' },
      ]]},
      C1: { headline: 'Una herramienta de inteligencia artificial reduce a segundos el cribado oncológico', body: [
        [{ text: 'Un equipo de ' }, { text: 'investigadores', t: true },
         { text: ' de una universidad de California ha presentado un sistema de ' }, { text: 'inteligencia', t: true },
         { text: ' artificial capaz de detectar, en cuestión de segundos, distintos tipos de cáncer a partir del análisis automatizado de imágenes médicas. La herramienta no pretende sustituir al médico, sino acortar drásticamente el tiempo entre la sospecha clínica y un diagnóstico confirmado.' }],
        [{ text: 'Los primeros resultados, publicados en una revista científica de referencia, han despertado considerable entusiasmo en la comunidad médica internacional. De confirmarse en próximas pruebas, el sistema podría implantarse durante el próximo año en una red de hospitales del país, especialmente en zonas rurales con menor acceso a especialistas.' }],
      ]},
      C2: { headline: 'California explora un futuro en el que la inteligencia artificial actúe como primera lectora del diagnóstico oncológico', body: [
        [{ text: 'Un equipo de ' }, { text: 'investigadores', t: true },
         { text: ' de una universidad de California ha presentado un sistema de ' }, { text: 'inteligencia', t: true },
         { text: ' artificial capaz de detectar, en cuestión de segundos y a partir de imágenes médicas, distintos tipos de cáncer cuya identificación temprana viene exigiendo, hasta hoy, una infraestructura especializada al alcance de muy pocos centros.' }],
        [{ text: 'La herramienta, que sus propios autores se apresuran a presentar como complemento y no como sustituto del juicio clínico, podría, de cumplirse las expectativas, redibujar el mapa del diagnóstico oncológico en aquellas regiones del país donde la escasez de especialistas obliga a las familias a desplazamientos que no siempre llegan a tiempo.' }],
      ]},
    },
  },

  // ─── 8 · Global · Océanos ───────────────────────────────────────────
  {
    id: '8', country: 'GLOBAL', flag: '🌐', ...SRC.bbc,
    category: 'MEDIOAMBIENTE', minutes: 5, date: '6 de mayo, 2026',
    imageSeed: 'nivelo-ocean-climate',
    summary: 'Más de cien países firman un plan para reducir el plástico en los mares.',
    summaryTranslations: {
      en: 'More than a hundred countries sign a plan to cut ocean plastic.',
      he: 'יותר ממאה מדינות חותמות על תוכנית להפחתת פלסטיק בים.',
      de: 'Mehr als hundert Länder unterzeichnen einen Plan zur Reduzierung von Meeresplastik.',
      fr: "Plus de cent pays signent un plan pour réduire le plastique dans les mers.",
      it: 'Oltre cento Paesi firmano un piano per ridurre la plastica nei mari.',
      ja: '100カ国以上が海洋プラスチック削減計画に署名。',
    },
    byLevel: {
      A1: { headline: 'La ONU tiene un plan para los océanos', body: [[
        { text: 'La ONU tiene un plan nuevo. El plan es para los ' }, { text: 'océanos', t: true },
        { text: '. Los océanos están en peligro. Hay mucho ' }, { text: 'plástico', t: true },
        { text: ' en el agua. Los países van a trabajar juntos para ayudar.' },
      ]]},
      A2: { headline: 'La ONU lanza un plan internacional para proteger los océanos', body: [[
        { text: 'La ONU ha lanzado un plan internacional para proteger los ' }, { text: 'océanos', t: true },
        { text: '. El plan quiere reducir el plástico en el mar y proteger a los animales marinos. Más de cien países están participando.' },
      ]]},
      B1: { headline: 'La ONU lanza un plan global para proteger los océanos', body: [[
        { text: 'La ONU ha lanzado este lunes un ambicioso plan internacional para proteger los ' }, { text: 'océanos', t: true },
        { text: '. La iniciativa busca reducir la cantidad de ' }, { text: 'plástico', t: true },
        { text: ' que llega al mar cada año y proteger las especies más amenazadas. Más de cien países han firmado el acuerdo durante la cumbre celebrada en Lisboa. Los expertos coinciden en que el tiempo para actuar se está agotando.' },
      ]]},
      B2: { headline: 'Más de cien países se unen al plan de la ONU para salvar los océanos', body: [[
        { text: 'La ONU ha lanzado este lunes un ambicioso plan internacional para proteger los ' }, { text: 'océanos', t: true },
        { text: ', durante la cumbre celebrada en Lisboa. La iniciativa pretende reducir la cantidad de ' }, { text: 'plástico', t: true },
        { text: ' que llega al mar cada año y reforzar la protección de las especies marinas más amenazadas. Más de cien países han firmado el acuerdo, aunque algunos de los grandes contaminadores todavía no han confirmado su participación. Los expertos coinciden en que el tiempo para actuar se está agotando.' },
      ]]},
      C1: { headline: 'La cumbre de Lisboa alumbra el plan más ambicioso para la protección de los océanos en una década', body: [
        [{ text: 'La ONU ha lanzado esta semana, durante la cumbre celebrada en Lisboa, un ambicioso plan internacional para la protección de los ' },
         { text: 'océanos', t: true },
         { text: ' que combina la reducción progresiva de los ' }, { text: 'plástico', t: true },
         { text: 's de un solo uso con un refuerzo de las áreas marinas estrictamente protegidas.' }],
        [{ text: 'Más de un centenar de países han suscrito el acuerdo, si bien la ausencia de algunos de los principales contaminadores ha sido denunciada por las organizaciones ambientalistas. Los científicos insisten en que el margen de maniobra se reduce año tras año.' }],
      ]},
      C2: { headline: 'Lisboa rubrica un acuerdo oceánico que aspira a poner fecha al fin de los plásticos de un solo uso', body: [
        [{ text: 'La ONU ha lanzado esta semana, en una cumbre que pocos vacilarán en calificar de decisiva, un plan internacional para la salvaguarda de los ' },
         { text: 'océanos', t: true },
         { text: ' que aspira a articular en un único marco normativo la lucha contra los plásticos de un solo uso, la protección estricta de las áreas marinas más vulnerables y la obligación de transparencia sobre las prácticas pesqueras.' }],
        [{ text: 'La adhesión de más de un centenar de países, sumada a una llamativa ausencia de algunos grandes contaminadores, ha vuelto a poner sobre la mesa la pregunta incómoda de siempre.' }],
      ]},
    },
  },

  // ─── 9 · Italia · Pompeya ───────────────────────────────────────────
  {
    id: '9', country: 'IT', flag: '🇮🇹', ...SRC.repubblica,
    category: 'CULTURA', minutes: 3, date: '6 de mayo, 2026',
    imageSeed: 'nivelo-pompeii-fresco',
    summary: 'El fresco, en perfecto estado, formará parte del nuevo recorrido del parque arqueológico.',
    summaryTranslations: {
      en: 'The fresco, in perfect condition, will join the park\'s new visitor route.',
      he: 'הציור הקיר, במצב מושלם, יצטרף למסלול המבקרים החדש בפארק.',
      de: 'Das Fresko in perfektem Zustand wird Teil des neuen Besucherwegs des Parks.',
      fr: "La fresque, en parfait état, intégrera le nouveau parcours du parc archéologique.",
      it: "L'affresco, in perfette condizioni, entrerà nel nuovo percorso del parco archeologico.",
      ja: '保存状態の完璧なフレスコ画が、考古学公園の新ルートに加わる。',
    },
    byLevel: {
      A1: { headline: 'Encuentran un fresco antiguo en Pompeya', body: [[
        { text: 'En Italia hay una buena noticia. En Pompeya encontraron un ' }, { text: 'fresco', t: true },
        { text: ' antiguo. El fresco tiene 2.000 años. Está en muy buen estado. Pronto la gente lo va a poder ver.' },
      ]]},
      A2: { headline: 'Pompeya descubre un fresco romano de 2.000 años', body: [[
        { text: 'En Pompeya, los arqueólogos encontraron un nuevo ' }, { text: 'fresco', t: true },
        { text: '. Es una pintura romana de hace 2.000 años. Está casi intacta.' },
      ]]},
      B1: { headline: 'Hallan un fresco romano casi intacto en el corazón de Pompeya', body: [[
        { text: 'Un equipo de arqueólogos ha sacado a la luz en Pompeya un ' }, { text: 'fresco', t: true },
        { text: ' romano de casi dos mil años en un estado de conservación muy poco habitual. La pintura representa escenas de un banquete y conserva colores vivos y nítidos. Los expertos consideran que se trata del hallazgo más relevante del último año en la zona. Las autoridades italianas planean restaurarlo y exponerlo al público en pocos meses.' },
      ]]},
      B2: { headline: 'Pompeya saca a la luz un fresco romano en un estado de conservación excepcional', body: [[
        { text: 'Un equipo de arqueólogos ha sacado a la luz en Pompeya un ' }, { text: 'fresco', t: true },
        { text: ' romano de casi dos mil años en un estado de conservación poco habitual. La pintura representa escenas de un banquete y mantiene colores y detalles asombrosamente nítidos. Los expertos coinciden en que se trata del hallazgo más relevante del último año en la zona. Las autoridades italianas planean restaurarlo y exponerlo al público en pocos meses.' },
      ]]},
      C1: { headline: 'Sale a la luz en Pompeya un fresco romano de excepcional conservación', body: [
        [{ text: 'Un equipo de arqueólogos ha sacado a la luz, en el área central de Pompeya, un ' }, { text: 'fresco', t: true },
         { text: ' romano de casi dos mil años cuyo grado de conservación, francamente excepcional, ha sorprendido incluso a los especialistas más curtidos.' }],
        [{ text: 'La pieza, que representa escenas de un banquete con un nivel de detalle inusual, será restaurada en los próximos meses y se integrará en un nuevo recorrido museístico por la villa en que fue hallada.' }],
      ]},
      C2: { headline: 'Pompeya devuelve, casi insolente de nitidez, un fresco romano cuya luz parecía clausurada por dos mil años de cenizas', body: [
        [{ text: 'Un equipo de arqueólogos ha sacado a la luz, en el corazón de Pompeya, un ' }, { text: 'fresco', t: true },
         { text: ' romano de casi dos mil años cuyo asombroso estado de conservación devuelve a la mirada contemporánea, con una nitidez casi insolente, los gestos cotidianos de un banquete.' }],
        [{ text: 'La pieza será restaurada con mimo en los próximos meses y formará parte de un nuevo recorrido por la villa en que fue hallada. Los responsables del parque la consideran ya el hallazgo más significativo de la última temporada.' }],
      ]},
    },
  },

  // ─── 10 · Francia · Metro automático ────────────────────────────────
  {
    id: '10', country: 'FR', flag: '🇫🇷', ...SRC.lemonde,
    category: 'TRANSPORTE', minutes: 4, date: '5 de mayo, 2026',
    imageSeed: 'nivelo-paris-metro',
    summary: 'La línea forma parte de las grandes inversiones para los Juegos Olímpicos de 2028.',
    summaryTranslations: {
      en: 'The line is part of the major investments ahead of the 2028 Olympics.',
      he: 'הקו הוא חלק מההשקעות הגדולות לקראת אולימפיאדת 2028.',
      de: 'Die Linie gehört zu den Großinvestitionen vor den Olympischen Spielen 2028.',
      fr: "La ligne fait partie des grands investissements en vue des Jeux olympiques de 2028.",
      it: 'La linea fa parte dei grandi investimenti in vista delle Olimpiadi del 2028.',
      ja: 'この路線は2028年五輪に向けた大規模投資の一部。',
    },
    byLevel: {
      A1: { headline: 'París estrena un metro sin conductor', body: [[
        { text: 'En París hay un nuevo ' }, { text: 'metro', t: true },
        { text: '. El metro no tiene conductor. Es completamente automático. Va a otras ciudades muy rápido. Los viajeros están muy contentos.' },
      ]]},
      A2: { headline: 'París estrena una nueva línea de metro automática', body: [[
        { text: 'París tiene un ' }, { text: 'metro', t: true },
        { text: ' nuevo y automático. El tren no tiene conductor. Va a las afueras de la ciudad muy rápido.' },
      ]]},
      B1: { headline: 'París inaugura una línea de metro sin conductor con vistas a 2028', body: [[
        { text: 'París ha estrenado este fin de semana una nueva línea de ' }, { text: 'metro', t: true },
        { text: ' completamente automática, sin conductor a bordo. La línea conecta el centro de la ciudad con varias zonas del extrarradio en menos de la mitad de tiempo que las antiguas. La obra forma parte de las grandes inversiones de cara a los Juegos Olímpicos de 2028. Los pasajeros han recibido el estreno con buena acogida.' },
      ]]},
      B2: { headline: 'París pone en marcha su primera línea de metro plenamente automática', body: [[
        { text: 'París ha estrenado este fin de semana una nueva línea de ' }, { text: 'metro', t: true },
        { text: ' completamente automática, sin conductor a bordo, que une el centro con varias zonas del extrarradio en mucho menos tiempo que las antiguas conexiones. La obra forma parte del paquete de grandes inversiones desplegado de cara a los Juegos Olímpicos de 2028. Las primeras impresiones son muy positivas, aunque algunos sindicatos del sector denuncian la pérdida de empleos directos.' },
      ]]},
      C1: { headline: 'París estrena una línea automática que reduce drásticamente los tiempos del extrarradio', body: [
        [{ text: 'París ha estrenado este fin de semana una nueva línea de ' }, { text: 'metro', t: true },
         { text: ' completamente automática que conecta el centro de la ciudad con varios núcleos del extrarradio, reduciendo de manera notable los tiempos de desplazamiento.' }],
        [{ text: 'La infraestructura se enmarca en el ambicioso paquete de inversiones desplegado por la capital de cara a los Juegos Olímpicos de 2028. Aunque los primeros usos han recibido una acogida muy favorable, los sindicatos del sector continúan expresando reservas por la progresiva sustitución del personal.' }],
      ]},
      C2: { headline: 'París rubrica su tránsito hacia el metro sin conductor en vísperas de los Juegos de 2028', body: [
        [{ text: 'París ha inaugurado este fin de semana una nueva línea de ' }, { text: 'metro', t: true },
         { text: ' completamente automatizada que une el corazón de la capital con un puñado de núcleos periféricos cuya distancia, durante demasiados años, había sido medida menos en kilómetros que en horas perdidas.' }],
        [{ text: 'Las primeras impresiones recogidas en las nuevas estaciones contrastan con las inquietudes de los sindicatos del sector, que ven en la progresiva desaparición del personal a bordo un retroceso laboral cuya magnitud aún no se ha terminado de medir.' }],
      ]},
    },
  },

  // ─── 11 · Japón · Tren bala ─────────────────────────────────────────
  {
    id: '11', country: 'JP', flag: '🇯🇵', ...SRC.nhk,
    category: 'TRANSPORTE', minutes: 4, date: '5 de mayo, 2026',
    imageSeed: 'nivelo-japan-shinkansen',
    summary: 'El nuevo tren conecta Tokio y Osaka en menos de dos horas a 400 km/h.',
    summaryTranslations: {
      en: 'The new train links Tokyo and Osaka in under two hours at 400 km/h.',
      he: 'הרכבת החדשה מחברת את טוקיו ואוסקה בפחות משעתיים ב-400 קמ"ש.',
      de: 'Der neue Zug verbindet Tokio und Osaka in weniger als zwei Stunden bei 400 km/h.',
      fr: "Le nouveau train relie Tokyo et Osaka en moins de deux heures à 400 km/h.",
      it: 'Il nuovo treno collega Tokyo e Osaka in meno di due ore a 400 km/h.',
      ja: '新型列車が東京〜大阪を時速400キロ・2時間未満で結ぶ。',
    },
    byLevel: {
      A1: { headline: 'Japón estrena el tren más rápido del mundo', body: [[
        { text: 'En Japón hay un ' }, { text: 'tren', t: true },
        { text: ' muy rápido. Es un nuevo tren bala. Va a 400 kilómetros por hora. Es el tren más rápido del mundo. Los turistas quieren probarlo este año.' },
      ]]},
      A2: { headline: 'Japón inaugura un nuevo tren bala a 400 km/h', body: [[
        { text: 'Japón ha inaugurado un nuevo ' }, { text: 'tren', t: true },
        { text: ' bala. Va a 400 kilómetros por hora. Es el tren más rápido del mundo.' },
      ]]},
      B1: { headline: 'Japón pone en servicio el tren bala más rápido del mundo', body: [[
        { text: 'Japón ha inaugurado este miércoles un nuevo ' }, { text: 'tren', t: true },
        { text: ' bala capaz de circular a 400 kilómetros por hora, lo que lo convierte en el más rápido del mundo en servicio comercial. La línea conecta Tokio con Osaka en poco más de una hora y media. El gobierno espera que el tren impulse el turismo nacional y reduzca el tráfico aéreo. Los primeros viajeros han descrito la experiencia como sorprendentemente silenciosa.' },
      ]]},
      B2: { headline: 'El nuevo tren bala japonés une Tokio y Osaka en una hora y media a 400 km/h', body: [[
        { text: 'Japón ha inaugurado este miércoles un nuevo ' }, { text: 'tren', t: true },
        { text: ' bala capaz de circular a 400 kilómetros por hora. La línea conecta Tokio con Osaka en poco más de una hora y media, frente a las casi tres horas que se tardaba hasta ahora. El gobierno confía en que el nuevo servicio impulse el turismo nacional y reduzca el tráfico aéreo entre las dos ciudades. Los primeros viajeros, sorprendidos por el silencio del trayecto, han recibido con entusiasmo la inauguración.' },
      ]]},
      C1: { headline: 'El nuevo tren bala japonés acerca Tokio y Osaka a una hora y media a cuatrocientos por hora', body: [
        [{ text: 'Japón ha inaugurado este miércoles un nuevo ' }, { text: 'tren', t: true },
         { text: ' bala capaz de circular a cuatrocientos kilómetros por hora, lo que lo convierte en el servicio comercial más rápido del mundo y reduce el trayecto entre Tokio y Osaka a poco más de una hora y media.' }],
        [{ text: 'El gobierno confía en que la nueva línea impulse el turismo doméstico y disminuya un tráfico aéreo entre ambas ciudades que, en los últimos años, había seguido al alza pese a la apuesta nacional por la alta velocidad ferroviaria.' }],
      ]},
      C2: { headline: 'Japón vuelve al centro del relato ferroviario con un tren bala que pulveriza, en silencio, los trayectos del archipiélago', body: [
        [{ text: 'Japón ha inaugurado este miércoles un nuevo ' }, { text: 'tren', t: true },
         { text: ' bala capaz de circular a cuatrocientos kilómetros por hora, una cifra que lo convierte en el servicio comercial más veloz del planeta y reduce el trayecto entre Tokio y Osaka a poco más de una hora y media.' }],
        [{ text: 'Las primeras impresiones recogidas a bordo coinciden, casi unánimemente, en una sensación de silencio sorprendentemente cuidado, deudora de tecnologías de aislamiento acústico desarrolladas en exclusiva para este modelo.' }],
      ]},
    },
  },

  // ─── 12 · Israel · Acuerdo con Marruecos ────────────────────────────
  {
    id: '12', country: 'IL', flag: '🇮🇱', ...SRC.haaretz,
    category: 'POLÍTICA', minutes: 4, date: '5 de mayo, 2026',
    imageSeed: 'nivelo-israel-morocco',
    summary: 'Israel y Marruecos firman un acuerdo histórico de cooperación tecnológica.',
    summaryTranslations: {
      en: 'Israel and Morocco sign a historic technology cooperation agreement.',
      he: 'ישראל ומרוקו חתמו על הסכם היסטורי לשיתוף פעולה טכנולוגי.',
      de: 'Israel und Marokko unterzeichnen ein historisches Technologie-Kooperationsabkommen.',
      fr: 'Israël et le Maroc signent un accord historique de coopération technologique.',
      it: 'Israele e Marocco firmano uno storico accordo di cooperazione tecnologica.',
      ja: 'イスラエルとモロッコが歴史的な技術協力協定に署名。',
    },
    byLevel: {
      A1: { headline: 'Israel y Marruecos hacen un acuerdo nuevo', body: [[
        { text: 'Israel y Marruecos firman un acuerdo. Es un acuerdo de tecnología. Los dos países van a trabajar juntos. Es muy importante para la región. Mucha gente está contenta con el acuerdo.' },
      ]]},
      B1: { headline: 'Israel y Marruecos firman un acuerdo histórico de cooperación tecnológica', body: [[
        { text: 'Israel y Marruecos han firmado este lunes un acuerdo histórico para impulsar la cooperación en sectores como la inteligencia artificial, las energías renovables y la ciberseguridad. El pacto incluye programas de intercambio para ' },
        { text: 'investigadores', t: true },
        { text: ' y nuevas inversiones conjuntas en startups. Las autoridades de ambos países lo presentan como un paso decisivo en la normalización de relaciones iniciada en 2020. La oposición marroquí, sin embargo, ha expresado dudas sobre el alcance del texto.' },
      ]]},
    },
  },

  // ─── 13 · Israel · Centro de innovación verde ───────────────────────
  {
    id: '13', country: 'IL', flag: '🇮🇱', ...SRC.toi,
    category: 'SOCIEDAD', minutes: 3, date: '4 de mayo, 2026',
    imageSeed: 'nivelo-tel-aviv-green',
    summary: 'Tel Aviv inaugura el primer centro de innovación verde del Mediterráneo.',
    summaryTranslations: {
      en: "Tel Aviv opens the Mediterranean's first green innovation hub.",
      he: 'תל אביב פותחת את מרכז החדשנות הירוק הראשון בים התיכון.',
      de: 'Tel Aviv eröffnet das erste grüne Innovationszentrum des Mittelmeerraums.',
      fr: "Tel-Aviv inaugure le premier centre d'innovation verte de la Méditerranée.",
      it: "Tel Aviv inaugura il primo centro di innovazione verde del Mediterraneo.",
      ja: 'テルアビブが地中海初のグリーン・イノベーション拠点を開設。',
    },
    byLevel: {
      A1: { headline: 'Tel Aviv abre un centro verde nuevo', body: [[
        { text: 'Tel Aviv abre un centro de innovación. El centro es muy verde. Trabaja con la naturaleza. Tiene paneles solares y plantas. Es el primer centro así del Mediterráneo.' },
      ]]},
      B1: { headline: 'Tel Aviv inaugura el primer centro de innovación verde del Mediterráneo', body: [[
        { text: 'Tel Aviv ha inaugurado este lunes un nuevo centro de innovación dedicado a la ' }, { text: 'empresa', t: true },
        { text: ' verde, el primero de su tipo en el Mediterráneo. El edificio combina paneles solares, jardines verticales y un sistema avanzado de reciclaje del agua. Más de cien startups especializadas en sostenibilidad ya han confirmado su traslado al espacio. Las autoridades esperan convertirlo en una referencia regional.' },
      ]]},
    },
  },

  // ─── 14 · España · Goya en el Prado ─────────────────────────────────
  {
    id: '14', country: 'ES', flag: '🇪🇸', ...SRC.elpais,
    category: 'CULTURA', minutes: 4, date: '4 de mayo, 2026',
    imageSeed: 'nivelo-prado-goya',
    summary: 'El Museo del Prado estrena su mayor exposición sobre Goya en treinta años.',
    summaryTranslations: {
      en: "The Prado opens its largest Goya exhibition in thirty years.",
      he: 'מוזיאון פראדו פותח את התערוכה הגדולה ביותר של גויה בשלושים שנה.',
      de: 'Der Prado eröffnet seine größte Goya-Ausstellung seit dreißig Jahren.',
      fr: "Le Prado inaugure sa plus grande exposition Goya en trente ans.",
      it: 'Il Prado inaugura la più grande mostra su Goya in trent\'anni.',
      ja: 'プラド美術館が30年ぶり最大規模のゴヤ展を開幕。',
    },
    byLevel: {
      A1: { headline: 'Una exposición grande sobre Goya en Madrid', body: [[
        { text: 'El Museo del Prado tiene una exposición nueva. La exposición es sobre Goya. Goya fue un pintor muy famoso. Hay más de cien cuadros. Mucha gente quiere visitarla.' },
      ]]},
      B1: { headline: 'El Museo del Prado estrena su mayor exposición sobre Goya en treinta años', body: [[
        { text: 'El Museo del Prado ha inaugurado este sábado en Madrid su exposición más completa sobre Francisco de Goya en las últimas tres décadas. La muestra reúne más de ciento cincuenta obras procedentes de museos de todo el mundo y permite recorrer la evolución del pintor desde los retratos cortesanos hasta sus pinturas negras. Los comisarios subrayan el carácter excepcional de algunos préstamos. La exposición permanecerá abierta hasta finales de septiembre.' },
      ]]},
    },
  },

  // ─── 15 · España · Aceite de oliva ──────────────────────────────────
  {
    id: '15', country: 'ES', flag: '🇪🇸', ...SRC.elmundo,
    category: 'ECONOMÍA', minutes: 3, date: '3 de mayo, 2026',
    imageSeed: 'nivelo-spain-olive-oil',
    summary: 'España alcanza un récord histórico en exportaciones de aceite de oliva.',
    summaryTranslations: {
      en: 'Spain hits an all-time record for olive oil exports.',
      he: 'ספרד שוברת שיא של כל הזמנים ביצוא שמן זית.',
      de: 'Spanien erreicht einen historischen Rekord bei Olivenöl-Exporten.',
      fr: "L'Espagne atteint un record historique d'exportations d'huile d'olive.",
      it: 'La Spagna raggiunge un record storico nelle esportazioni di olio d\'oliva.',
      ja: 'スペインがオリーブ油輸出で過去最高を記録。',
    },
    byLevel: {
      A1: { headline: 'España vende mucho aceite de oliva', body: [[
        { text: 'España vende mucho aceite de oliva. Este año vendió más que nunca. Es una buena noticia para el país. El aceite va a muchos países diferentes. Los agricultores están muy contentos.' },
      ]]},
      B1: { headline: 'España bate su récord histórico de exportaciones de aceite de oliva', body: [[
        { text: 'España ha cerrado el último año con un récord histórico de exportaciones de aceite de oliva, según los datos publicados este lunes. Las ventas al extranjero han crecido un dieciocho por ciento, impulsadas por una fuerte demanda en Estados Unidos y Asia. Los productores destacan la mejora de la calidad y la apertura de nuevos mercados. Sin embargo, advierten que la sequía sigue siendo el principal desafío del sector.' },
      ]]},
    },
  },

  // ─── 16 · USA · Senado y desinformación ─────────────────────────────
  {
    id: '16', country: 'US', flag: '🇺🇸', ...SRC.nyt,
    category: 'POLÍTICA', minutes: 4, date: '3 de mayo, 2026',
    imageSeed: 'nivelo-us-senate',
    summary: 'El Senado aprueba una nueva ley para combatir la desinformación en redes.',
    summaryTranslations: {
      en: 'The Senate passes a new law to fight online disinformation.',
      he: 'הסנאט מאשר חוק חדש למאבק במידע שגוי ברשתות.',
      de: 'Der Senat verabschiedet ein neues Gesetz gegen Online-Desinformation.',
      fr: 'Le Sénat adopte une nouvelle loi pour lutter contre la désinformation en ligne.',
      it: 'Il Senato approva una nuova legge contro la disinformazione online.',
      ja: '上院がオンラインの偽情報に対抗する新法を可決。',
    },
    byLevel: {
      A1: { headline: 'EE. UU. tiene una ley nueva contra la desinformación', body: [[
        { text: 'El Senado de Estados Unidos aprueba una ley nueva. La ley es contra la desinformación. Hay muchas mentiras en internet. La ley quiere proteger a la gente. Es una ley muy importante.' },
      ]]},
      B1: { headline: 'El Senado de Estados Unidos aprueba una ley histórica contra la desinformación en redes', body: [[
        { text: 'El Senado de Estados Unidos ha aprobado este martes una nueva ley diseñada para combatir la desinformación en las grandes plataformas digitales. La norma obliga a las redes sociales a actuar con mayor rapidez frente a los contenidos falsos y exige más transparencia sobre los algoritmos. Demócratas y republicanos han llegado a un acuerdo poco habitual. Las plataformas afectadas, sin embargo, advierten de posibles efectos sobre la libertad de expresión.' },
      ]]},
    },
  },

  // ─── 17 · USA · Frida Kahlo musical ─────────────────────────────────
  {
    id: '17', country: 'US', flag: '🇺🇸', ...SRC.wapo,
    category: 'CULTURA', minutes: 3, date: '2 de mayo, 2026',
    imageSeed: 'nivelo-broadway-frida',
    summary: 'Broadway celebra una temporada récord con un musical sobre Frida Kahlo.',
    summaryTranslations: {
      en: 'Broadway celebrates a record season with a Frida Kahlo musical.',
      he: 'ברודוויי חוגגת עונה שיא עם מחזמר על פרידה קאלו.',
      de: 'Broadway feiert eine Rekordsaison mit einem Frida-Kahlo-Musical.',
      fr: 'Broadway célèbre une saison record avec une comédie musicale sur Frida Kahlo.',
      it: 'Broadway celebra una stagione record con un musical su Frida Kahlo.',
      ja: 'ブロードウェイがフリーダ・カーロのミュージカルで記録的シーズンを祝う。',
    },
    byLevel: {
      A1: { headline: 'Un musical sobre Frida Kahlo en Nueva York', body: [[
        { text: 'En Nueva York hay un musical nuevo. El musical es sobre Frida Kahlo. Frida Kahlo era una pintora mexicana muy famosa. Mucha gente lo ve cada noche. Es un éxito muy grande.' },
      ]]},
      B1: { headline: 'Un musical sobre Frida Kahlo arrasa en Broadway y bate récords', body: [[
        { text: 'Un nuevo musical inspirado en la vida de la pintora mexicana Frida Kahlo se ha convertido en uno de los grandes éxitos de la actual temporada de Broadway. La obra combina canciones originales en inglés y español, y cuenta con un reparto íntegramente latino. La crítica ha destacado tanto la potencia de la protagonista como la calidad de la música. Las entradas están agotadas hasta el próximo otoño.' },
      ]]},
    },
  },

  // ─── 18 · USA · Economía Q1 ─────────────────────────────────────────
  {
    id: '18', country: 'US', flag: '🇺🇸', ...SRC.wapo,
    category: 'ECONOMÍA', minutes: 3, date: '2 de mayo, 2026',
    imageSeed: 'nivelo-wall-street',
    summary: 'La economía estadounidense supera todas las previsiones del primer trimestre.',
    summaryTranslations: {
      en: 'The US economy beats all first-quarter forecasts.',
      he: 'הכלכלה האמריקאית עוקפת את כל התחזיות לרבעון הראשון.',
      de: 'Die US-Wirtschaft übertrifft alle Prognosen des ersten Quartals.',
      fr: "L'économie américaine dépasse toutes les prévisions du premier trimestre.",
      it: "L'economia statunitense supera tutte le previsioni del primo trimestre.",
      ja: '米経済が第1四半期の全予測を上回る。',
    },
    byLevel: {
      A1: { headline: 'La economía de EE. UU. crece mucho', body: [[
        { text: 'La economía de Estados Unidos crece mucho este año. Crece más de lo que pensaban los expertos. Hay más trabajo para la gente. Los precios suben menos. Es una buena noticia para muchas familias.' },
      ]]},
      B1: { headline: 'La economía estadounidense supera todas las previsiones del primer trimestre', body: [[
        { text: 'La economía de Estados Unidos ha crecido un tres coma cuatro por ciento durante el primer trimestre del año, una cifra muy por encima de lo que esperaban los analistas. El consumo y la inversión empresarial son los principales motores del crecimiento. La Reserva Federal mantiene los tipos de interés sin cambios por el momento. Los expertos advierten de posibles riesgos en la segunda mitad del año.' },
      ]]},
    },
  },

  // ─── 19 · USA · Acuerdo Bruselas ────────────────────────────────────
  {
    id: '19', country: 'US', flag: '🇺🇸', ...SRC.nyt,
    category: 'INTERNACIONAL', minutes: 4, date: '1 de mayo, 2026',
    imageSeed: 'nivelo-brussels-summit',
    summary: 'Washington y Bruselas estrenan un nuevo acuerdo comercial transatlántico.',
    summaryTranslations: {
      en: 'Washington and Brussels launch a new transatlantic trade deal.',
      he: 'וושינגטון ובריסל משיקות הסכם סחר טרנס-אטלנטי חדש.',
      de: 'Washington und Brüssel starten ein neues transatlantisches Handelsabkommen.',
      fr: 'Washington et Bruxelles lancent un nouvel accord commercial transatlantique.',
      it: 'Washington e Bruxelles avviano un nuovo accordo commerciale transatlantico.',
      ja: 'ワシントンとブリュッセルが新たな大西洋横断通商協定を開始。',
    },
    byLevel: {
      A1: { headline: 'Estados Unidos y Europa hacen un acuerdo nuevo', body: [[
        { text: 'Estados Unidos y Europa firman un acuerdo nuevo. Es un acuerdo de comercio. Los dos van a vender más cosas juntos. Es bueno para muchas familias. La gente piensa que va a ayudar.' },
      ]]},
      B1: { headline: 'Washington y Bruselas estrenan un nuevo acuerdo comercial transatlántico', body: [[
        { text: 'Estados Unidos y la Unión Europea han firmado este miércoles un nuevo acuerdo comercial que reduce los aranceles sobre cientos de productos y simplifica los procedimientos aduaneros. Las dos partes coinciden en presentar el pacto como una respuesta conjunta a la creciente competencia de Asia. Algunos sectores europeos, sin embargo, advierten que la apertura podría perjudicar a la agricultura local. La Comisión Europea defiende que el balance global será positivo.' },
      ]]},
    },
  },

  // ─── 20 · Global · Calentamiento 2°C ────────────────────────────────
  {
    id: '20', country: 'GLOBAL', flag: '🌐', ...SRC.reuters,
    category: 'CLIMA', minutes: 5, date: '1 de mayo, 2026',
    imageSeed: 'nivelo-climate-warming',
    summary: 'La temperatura media del planeta supera por primera vez los dos grados de calentamiento.',
    summaryTranslations: {
      en: "Global average temperature crosses the 2°C warming mark for the first time.",
      he: 'הטמפרטורה הממוצעת העולמית חוצה לראשונה את סף ההתחממות של 2°C.',
      de: 'Globale Durchschnittstemperatur überschreitet erstmals die 2-°C-Schwelle.',
      fr: "La température moyenne du globe franchit pour la première fois les 2 °C de réchauffement.",
      it: 'La temperatura media globale supera per la prima volta i 2°C di riscaldamento.',
      ja: '世界の平均気温が初めて温暖化2°Cの閾値を超える。',
    },
    byLevel: {
      A1: { headline: 'El planeta se calienta más que nunca', body: [[
        { text: 'El planeta es ahora más caliente. La temperatura sube cada año. Esto es un problema muy grande. Hace mucho calor en el verano. Los científicos dicen que es importante actuar.' },
      ]]},
      B1: { headline: 'La temperatura media del planeta supera por primera vez los dos grados de calentamiento', body: [[
        { text: 'La temperatura media del planeta ha superado por primera vez en la historia el umbral de los dos grados de calentamiento, según un informe publicado esta semana por las Naciones Unidas. Los científicos advierten que se ha cruzado una frontera que el Acuerdo de París intentaba evitar a toda costa. Los efectos ya se notan en las olas de calor y en el deshielo de los polos. Los expertos reclaman una respuesta política inmediata.' },
      ]]},
    },
  },

  // ─── 21 · Global · Enfermedad erradicada ────────────────────────────
  {
    id: '21', country: 'GLOBAL', flag: '🌐', ...SRC.bbc,
    category: 'SALUD', minutes: 4, date: '30 de abril, 2026',
    imageSeed: 'nivelo-who-health',
    summary: 'La OMS anuncia el fin oficial de una de las enfermedades más antiguas del mundo.',
    summaryTranslations: {
      en: "WHO declares an end to one of the world's oldest diseases.",
      he: 'ארגון הבריאות העולמי מכריז על סיום אחת המחלות הוותיקות בעולם.',
      de: 'WHO verkündet das Ende einer der ältesten Krankheiten der Welt.',
      fr: "L'OMS déclare officiellement la fin d'une des plus anciennes maladies du monde.",
      it: "L'OMS dichiara la fine di una delle malattie più antiche del mondo.",
      ja: 'WHOが世界最古の感染症の一つの終焉を発表。',
    },
    byLevel: {
      A1: { headline: 'La OMS dice que una enfermedad muy vieja ha terminado', body: [[
        { text: 'La OMS tiene una buena noticia. Una enfermedad muy antigua ha terminado. Mucha gente trabajó muchos años. Ahora ya no hay casos en el mundo. Es un día muy importante para todos.' },
      ]]},
      B1: { headline: 'La OMS anuncia la erradicación oficial de una de las enfermedades más antiguas del mundo', body: [[
        { text: 'La Organización Mundial de la Salud ha anunciado este viernes la erradicación oficial de una enfermedad infecciosa que ha acompañado a la humanidad durante miles de años. La declaración se produce tras varios años sin nuevos casos confirmados en ningún país. Los científicos describen el hito como uno de los grandes logros de la salud pública moderna. Aún así, las autoridades insisten en mantener la vigilancia epidemiológica.' },
      ]]},
    },
  },

  // ─── 22 · Global · Fusión nuclear ───────────────────────────────────
  {
    id: '22', country: 'GLOBAL', flag: '🌐', ...SRC.reuters,
    category: 'CIENCIA', minutes: 4, date: '29 de abril, 2026',
    imageSeed: 'nivelo-nuclear-fusion',
    summary: 'Un equipo internacional logra un avance histórico en la fusión nuclear.',
    summaryTranslations: {
      en: 'An international team achieves a historic nuclear-fusion breakthrough.',
      he: 'צוות בינלאומי משיג פריצת דרך היסטורית בהיתוך גרעיני.',
      de: 'Ein internationales Team erzielt einen historischen Durchbruch bei der Kernfusion.',
      fr: "Une équipe internationale réalise une avancée historique dans la fusion nucléaire.",
      it: 'Un team internazionale ottiene una storica svolta nella fusione nucleare.',
      ja: '国際チームが核融合で歴史的な突破口を達成。',
    },
    byLevel: {
      A1: { headline: 'Un avance importante en la fusión nuclear', body: [[
        { text: 'Unos científicos tienen una buena noticia. Trabajan con la fusión nuclear. La fusión es una nueva forma de energía. La nueva energía es muy limpia. Es un paso muy importante para el futuro.' },
      ]]},
      B1: { headline: 'Un consorcio internacional logra un avance histórico en la fusión nuclear', body: [[
        { text: 'Un equipo internacional de ' }, { text: 'investigadores', t: true },
        { text: ' ha conseguido por primera vez producir más energía mediante fusión nuclear de la que se necesitó para iniciar la reacción. El resultado, presentado en una conferencia celebrada esta semana en Ginebra, abre la puerta a una fuente de energía limpia y prácticamente ilimitada. Los expertos advierten que aún quedan décadas hasta su uso comercial. Aun así, califican el avance como un punto de inflexión para la ciencia.' },
      ]]},
    },
  },

  // ─── 23 · Global · G20 hambre ───────────────────────────────────────
  {
    id: '23', country: 'GLOBAL', flag: '🌐', ...SRC.bbc,
    category: 'INTERNACIONAL', minutes: 4, date: '28 de abril, 2026',
    imageSeed: 'nivelo-g20-hunger',
    summary: 'El G20 acuerda destinar mil millones de euros a la lucha contra el hambre.',
    summaryTranslations: {
      en: 'G20 leaders pledge one billion euros to fight world hunger.',
      he: 'מנהיגי ה-G20 מתחייבים למיליארד יורו למאבק ברעב.',
      de: 'G20-Staaten sagen eine Milliarde Euro für den Kampf gegen den Hunger zu.',
      fr: 'Les pays du G20 promettent un milliard d’euros pour lutter contre la faim.',
      it: 'I Paesi del G20 stanziano un miliardo di euro contro la fame.',
      ja: 'G20諸国が飢餓対策に10億ユーロを拠出することで合意。',
    },
    byLevel: {
      A1: { headline: 'El G20 ayuda contra el hambre en el mundo', body: [[
        { text: 'Los países del G20 hablan en una reunión grande. Quieren ayudar a la gente con hambre. Van a dar mil millones de euros. Es mucho dinero. La ayuda llega a muchos países pobres.' },
      ]]},
      B1: { headline: 'El G20 acuerda destinar mil millones de euros a la lucha contra el hambre', body: [[
        { text: 'Los líderes del G20 reunidos esta semana en Río de Janeiro han acordado destinar mil millones de euros a programas internacionales contra el hambre durante los próximos cuatro años. El compromiso prioriza el África subsahariana y varias regiones de Asia donde la inseguridad alimentaria ha aumentado. Las organizaciones humanitarias celebran el anuncio, aunque insisten en que la cifra sigue siendo insuficiente. La ONU pidió a los países industrializados un esfuerzo adicional.' },
      ]]},
    },
  },

  // ─── 24 · Italia · Sanidad pública ──────────────────────────────────
  {
    id: '24', country: 'IT', flag: '🇮🇹', ...SRC.corriere,
    category: 'POLÍTICA', minutes: 4, date: '28 de abril, 2026',
    imageSeed: 'nivelo-italy-health',
    summary: 'Italia aprueba un plan de modernización para el sistema sanitario público.',
    summaryTranslations: {
      en: 'Italy approves a modernisation plan for public healthcare.',
      he: 'איטליה מאשרת תוכנית מודרניזציה למערכת הבריאות הציבורית.',
      de: 'Italien beschließt einen Modernisierungsplan für das öffentliche Gesundheitswesen.',
      fr: 'L’Italie approuve un plan de modernisation du système de santé public.',
      it: 'L’Italia approva un piano di modernizzazione per la sanità pubblica.',
      ja: 'イタリアが公的医療制度の近代化計画を承認。',
    },
    byLevel: {
      A1: { headline: 'Italia mejora la sanidad pública', body: [[
        { text: 'Italia tiene un plan nuevo para la sanidad. La sanidad es para todos los ciudadanos. Va a haber más médicos y enfermeras. Los hospitales serán modernos. Es muy bueno para las familias.' },
      ]]},
      B1: { headline: 'Italia aprueba un plan de modernización para el sistema sanitario público', body: [[
        { text: 'El gobierno italiano ha aprobado este martes un plan para modernizar el sistema sanitario público a lo largo de los próximos cinco años. La iniciativa incluye la contratación de miles de profesionales, la renovación de hospitales en regiones rurales y un fuerte impulso a la telemedicina. Los sindicatos sanitarios reciben el anuncio con cautela y reclaman más detalles sobre el calendario. La oposición critica que la inversión sigue por debajo de la media europea.' },
      ]]},
    },
  },

  // ─── 25 · Italia · Parmesano ────────────────────────────────────────
  {
    id: '25', country: 'IT', flag: '🇮🇹', ...SRC.repubblica,
    category: 'COMIDA', minutes: 3, date: '27 de abril, 2026',
    imageSeed: 'nivelo-parmesan-cheese',
    summary: 'El parmesano vuelve a ser el queso más exportado del mundo.',
    summaryTranslations: {
      en: 'Parmesan is once again the world’s most exported cheese.',
      he: 'הפרמזן חוזר להיות הגבינה המיוצאת ביותר בעולם.',
      de: 'Parmesan ist wieder der meistexportierte Käse der Welt.',
      fr: 'Le parmesan redevient le fromage le plus exporté au monde.',
      it: 'Il parmigiano torna a essere il formaggio più esportato al mondo.',
      ja: 'パルメザンが再び世界で最も輸出されるチーズに。',
    },
    byLevel: {
      A1: { headline: 'El parmesano es el queso favorito del mundo', body: [[
        { text: 'El parmesano es un queso italiano. Es muy famoso en todo el mundo. Mucha gente lo come en pasta y pizza. Italia vende mucho parmesano cada año. Es la primera vez en mucho tiempo.' },
      ]]},
      B1: { headline: 'El parmesano vuelve a ser el queso más exportado del mundo', body: [[
        { text: 'El parmigiano reggiano ha vuelto a situarse como el queso más exportado del mundo, según los datos publicados por el consorcio italiano. Las ventas internacionales han crecido un veintidós por ciento gracias al fuerte tirón en Estados Unidos, Alemania y Japón. Los productores destacan la creciente atención al origen y a la calidad por parte de los consumidores extranjeros. El sector alerta, sin embargo, sobre el coste creciente de la materia prima.' },
      ]]},
    },
  },

  // ─── 26 · Italia · Turismo récord ───────────────────────────────────
  {
    id: '26', country: 'IT', flag: '🇮🇹', ...SRC.corriere,
    category: 'ECONOMÍA', minutes: 3, date: '26 de abril, 2026',
    imageSeed: 'nivelo-italy-tourism',
    summary: 'El turismo en Italia supera los récords previos a la pandemia.',
    summaryTranslations: {
      en: 'Italian tourism surpasses pre-pandemic records.',
      he: 'התיירות באיטליה עוברת את שיאי טרום המגפה.',
      de: 'Italiens Tourismus übertrifft die Rekorde vor der Pandemie.',
      fr: "Le tourisme italien dépasse les records d'avant-pandémie.",
      it: 'Il turismo in Italia supera i record pre-pandemia.',
      ja: 'イタリアの観光業がパンデミック前の記録を更新。',
    },
    byLevel: {
      A1: { headline: 'Italia tiene más turistas que nunca', body: [[
        { text: 'Italia tiene muchos turistas este año. Vienen de todo el mundo. Vienen más que antes de la pandemia. Visitan Roma, Venecia y Florencia. Los hoteles están casi llenos.' },
      ]]},
      B1: { headline: 'El turismo en Italia bate todos los récords previos a la pandemia', body: [[
        { text: 'Italia ha cerrado el primer trimestre del año con cifras de turismo internacional que superan los registros previos a la pandemia, según los datos publicados este lunes. Los visitantes extranjeros han aumentado un quince por ciento, impulsados por una fuerte demanda procedente de Alemania, Francia y Estados Unidos. Las autoridades destacan también el repunte del turismo cultural en ciudades pequeñas. La presión sobre Venecia, Roma y Florencia, sin embargo, vuelve a generar preocupación.' },
      ]]},
    },
  },

  // ─── 27 · Italia · Milan campeón ────────────────────────────────────
  {
    id: '27', country: 'IT', flag: '🇮🇹', ...SRC.repubblica,
    category: 'DEPORTE', minutes: 3, date: '25 de abril, 2026',
    imageSeed: 'nivelo-milan-champion',
    summary: 'El Milan se proclama campeón de Europa después de veintiún años.',
    summaryTranslations: {
      en: 'Milan are crowned champions of Europe after twenty-one years.',
      he: 'מילאן מוכתרת לאלופת אירופה לאחר עשרים ואחת שנים.',
      de: 'Milan wird nach 21 Jahren wieder Europameister.',
      fr: 'Milan sacré champion d\'Europe après vingt et un ans.',
      it: 'Il Milan si laurea campione d\'Europa dopo ventuno anni.',
      ja: 'ミランが21年ぶりに欧州王者に。',
    },
    byLevel: {
      A1: { headline: 'El Milan gana la Champions otra vez', body: [[
        { text: 'El Milan gana la Champions League. Es la final más importante de Europa. No ganaba desde hace 21 años. Los aficionados están muy felices. La fiesta es muy grande en Italia.' },
      ]]},
      B1: { headline: 'El Milan se proclama campeón de Europa después de veintiún años', body: [[
        { text: 'El Milan ha conquistado la Champions League veintiún años después de su última corona europea, tras imponerse en una final muy ajustada disputada en Estambul. El equipo italiano ha cerrado una temporada extraordinaria, marcada por la solidez defensiva y por las grandes actuaciones de su joven mediocampo. Los aficionados rossoneri han vivido en Milán una celebración multitudinaria. El club ya planea reforzarse para defender el título.' },
      ]]},
    },
  },

  // ─── 28 · Francia · Reforma universitaria ───────────────────────────
  {
    id: '28', country: 'FR', flag: '🇫🇷', ...SRC.lemonde,
    category: 'POLÍTICA', minutes: 4, date: '24 de abril, 2026',
    imageSeed: 'nivelo-paris-university',
    summary: 'Francia presenta una reforma del sistema universitario con vistas a 2030.',
    summaryTranslations: {
      en: 'France unveils a university reform aimed at 2030.',
      he: 'צרפת מציגה רפורמה במערכת האוניברסיטאות במטרה לשנת 2030.',
      de: 'Frankreich stellt eine Universitätsreform mit Blick auf 2030 vor.',
      fr: "La France présente une réforme universitaire à l'horizon 2030.",
      it: "La Francia presenta una riforma universitaria con orizzonte al 2030.",
      ja: 'フランスが2030年を見据えた大学改革を発表。',
    },
    byLevel: {
      A1: { headline: 'Francia tiene una nueva reforma para las universidades', body: [[
        { text: 'Francia presenta una reforma. La reforma es para las universidades. Quiere mejorar la educación. Habrá más dinero para los estudiantes. La reforma estará lista en 2030.' },
      ]]},
      B1: { headline: 'Francia presenta una reforma del sistema universitario con vistas a 2030', body: [[
        { text: 'El gobierno francés ha presentado este miércoles una ambiciosa reforma del sistema universitario destinada a entrar plenamente en vigor antes de 2030. El plan refuerza las becas para estudiantes con menos recursos, simplifica el acceso a los estudios y aumenta los presupuestos de investigación. Los sindicatos de estudiantes han recibido el anuncio con cautela. La oposición pide más detalles sobre el calendario y la financiación.' },
      ]]},
    },
  },

  // ─── 29 · Francia · Louvre arte africano ────────────────────────────
  {
    id: '29', country: 'FR', flag: '🇫🇷', ...SRC.lefigaro,
    category: 'CULTURA', minutes: 3, date: '23 de abril, 2026',
    imageSeed: 'nivelo-louvre-africa',
    summary: 'El Louvre prepara una nueva ala dedicada al arte africano contemporáneo.',
    summaryTranslations: {
      en: 'The Louvre is preparing a new wing for contemporary African art.',
      he: 'הלובר מכין אגף חדש לאמנות אפריקאית עכשווית.',
      de: 'Der Louvre plant einen neuen Flügel für zeitgenössische afrikanische Kunst.',
      fr: 'Le Louvre prépare une nouvelle aile dédiée à l\'art africain contemporain.',
      it: 'Il Louvre prepara una nuova ala dedicata all\'arte africana contemporanea.',
      ja: 'ルーヴルが現代アフリカ美術の新棟を準備中。',
    },
    byLevel: {
      A1: { headline: 'El Louvre tendrá un ala de arte africano', body: [[
        { text: 'El Louvre es un museo de París. Es muy famoso en el mundo. Ahora tendrá un ala nueva. La nueva ala es para arte africano. Va a abrir el próximo año.' },
      ]]},
      B1: { headline: 'El Louvre prepara una nueva ala dedicada al arte africano contemporáneo', body: [[
        { text: 'El Museo del Louvre ha confirmado este lunes que dedicará una nueva ala al arte africano contemporáneo, prevista para abrirse al público a finales de 2027. El proyecto incluye obras de artistas procedentes de más de veinte países y cuenta con préstamos importantes de instituciones de Senegal, Sudáfrica y Marruecos. La dirección del museo lo presenta como un paso decisivo en su política de apertura. Algunos críticos piden, además, una revisión más amplia del catálogo histórico.' },
      ]]},
    },
  },

  // ─── 30 · Francia · Energía nuclear ─────────────────────────────────
  {
    id: '30', country: 'FR', flag: '🇫🇷', ...SRC.lemonde,
    category: 'ECONOMÍA', minutes: 4, date: '22 de abril, 2026',
    imageSeed: 'nivelo-france-nuclear',
    summary: 'La energía nuclear vuelve a ser el principal motor de la electricidad francesa.',
    summaryTranslations: {
      en: 'Nuclear power is once again the main driver of French electricity.',
      he: 'הכוח הגרעיני שב להיות המנוע המרכזי של חשמל בצרפת.',
      de: 'Atomkraft ist wieder der Hauptmotor der französischen Stromerzeugung.',
      fr: "Le nucléaire redevient le principal moteur de l'électricité française.",
      it: 'Il nucleare torna a essere il principale motore dell\'elettricità francese.',
      ja: 'フランスの電力で原子力が再び主力に。',
    },
    byLevel: {
      A1: { headline: 'Francia usa más energía nuclear', body: [[
        { text: 'Francia usa mucha energía nuclear. Las centrales producen mucha electricidad. Es la principal fuente del país. Esta energía es bastante limpia. Otros países en Europa miran a Francia.' },
      ]]},
      B1: { headline: 'La energía nuclear vuelve a ser el principal motor de la electricidad francesa', body: [[
        { text: 'La energía nuclear ha vuelto a convertirse en la principal fuente de electricidad de Francia tras varios años de caída por motivos técnicos y de mantenimiento. Las cifras publicadas esta semana confirman que las centrales del país producen ya cerca del setenta por ciento del consumo eléctrico nacional. París presenta el dato como una confirmación de su apuesta por la energía atómica como pilar de la transición. Las organizaciones ecologistas, sin embargo, expresan dudas sobre la gestión de los residuos.' },
      ]]},
    },
  },

  // ─── 31 · Francia · Cumbre Europa-África ────────────────────────────
  {
    id: '31', country: 'FR', flag: '🇫🇷', ...SRC.lefigaro,
    category: 'INTERNACIONAL', minutes: 4, date: '21 de abril, 2026',
    imageSeed: 'nivelo-paris-summit',
    summary: 'París acoge una cumbre histórica entre líderes europeos y africanos.',
    summaryTranslations: {
      en: 'Paris hosts a historic summit between European and African leaders.',
      he: 'פריז מארחת פסגה היסטורית בין מנהיגי אירופה ואפריקה.',
      de: 'Paris empfängt einen historischen Gipfel europäischer und afrikanischer Staats- und Regierungschefs.',
      fr: "Paris accueille un sommet historique entre dirigeants européens et africains.",
      it: 'Parigi ospita un summit storico tra leader europei e africani.',
      ja: 'パリで欧州・アフリカ首脳の歴史的サミット開催。',
    },
    byLevel: {
      A1: { headline: 'París tiene una reunión grande con África', body: [[
        { text: 'Líderes de Europa y África están en París. Tienen una reunión muy grande. Hablan de comercio y de paz. La reunión dura tres días. Es muy importante para los dos continentes.' },
      ]]},
      B1: { headline: 'París acoge una cumbre histórica entre líderes europeos y africanos', body: [[
        { text: 'París acoge esta semana una cumbre que reúne a más de cuarenta líderes europeos y africanos para abordar comercio, migración y cooperación en seguridad. Los anfitriones franceses han presentado la cita como un punto de inflexión en las relaciones entre los dos continentes. Las delegaciones africanas reclaman un trato más equilibrado en los acuerdos comerciales. La cumbre concluirá el viernes con una declaración conjunta.' },
      ]]},
    },
  },

  // ─── 32 · Japón · Robot doméstico ───────────────────────────────────
  {
    id: '32', country: 'JP', flag: '🇯🇵', ...SRC.nhk,
    category: 'TECNOLOGÍA', minutes: 4, date: '20 de abril, 2026',
    imageSeed: 'nivelo-japan-robot',
    summary: 'Japón presenta un robot doméstico capaz de cuidar a personas mayores.',
    summaryTranslations: {
      en: 'Japan unveils a home robot designed to care for older adults.',
      he: 'יפן מציגה רובוט ביתי לטיפול בקשישים.',
      de: 'Japan stellt einen Haushaltsroboter zur Pflege älterer Menschen vor.',
      fr: 'Le Japon présente un robot domestique pour s’occuper des personnes âgées.',
      it: 'Il Giappone presenta un robot domestico per assistere gli anziani.',
      ja: '日本が高齢者を介護できる家庭用ロボットを発表。',
    },
    byLevel: {
      A1: { headline: 'Japón crea un robot para cuidar a los mayores', body: [[
        { text: 'En Japón hay un robot nuevo. El robot ayuda en la casa. Cuida a las personas mayores. Habla y trae cosas. Es una tecnología muy nueva.' },
      ]]},
      B1: { headline: 'Japón presenta un robot doméstico capaz de cuidar a personas mayores', body: [[
        { text: 'Japón ha presentado este miércoles un nuevo robot doméstico diseñado especialmente para asistir a personas mayores en su día a día. El aparato puede mantener conversaciones, recordar la toma de medicamentos y avisar a familiares en caso de emergencia. El gobierno japonés financia parte del proyecto frente al rápido envejecimiento de la población. La compañía espera empezar a venderlo en otros países asiáticos antes de 2027.' },
      ]]},
    },
  },

  // ─── 33 · Japón · Kioto turistas ────────────────────────────────────
  {
    id: '33', country: 'JP', flag: '🇯🇵', ...SRC.asahi,
    category: 'CULTURA', minutes: 3, date: '19 de abril, 2026',
    imageSeed: 'nivelo-kyoto-temple',
    summary: 'Kioto limita el número de turistas en sus templos para proteger el patrimonio.',
    summaryTranslations: {
      en: 'Kyoto caps tourist numbers at its temples to protect heritage.',
      he: 'קיוטו מגבילה את מספר התיירים במקדשים כדי לשמר את המורשת.',
      de: 'Kyoto begrenzt Besucherzahlen in seinen Tempeln, um das Erbe zu schützen.',
      fr: 'Kyoto limite le nombre de touristes dans ses temples pour protéger le patrimoine.',
      it: 'Kyoto limita il numero di turisti nei templi per proteggere il patrimonio.',
      ja: '京都が遺産保護のため寺院の観光客数を制限。',
    },
    byLevel: {
      A1: { headline: 'Kioto limita los turistas en los templos', body: [[
        { text: 'Kioto es una ciudad muy bonita en Japón. Tiene templos antiguos. Llegan demasiados turistas. Por eso limitan las visitas. Es para proteger los templos.' },
      ]]},
      B1: { headline: 'Kioto limita el número de turistas en sus templos para proteger el patrimonio', body: [[
        { text: 'Las autoridades de Kioto han anunciado este martes una nueva regulación para limitar el número diario de turistas en los templos más visitados de la ciudad. La medida llega después de varios años de fuerte aumento del turismo internacional, que había generado quejas entre los vecinos y los responsables del patrimonio. La nueva norma incluye reservas obligatorias y horarios reservados para los residentes. La organización Unesco ha valorado positivamente la decisión.' },
      ]]},
    },
  },

  // ─── 34 · Japón · Videojuegos ───────────────────────────────────────
  {
    id: '34', country: 'JP', flag: '🇯🇵', ...SRC.nhk,
    category: 'ECONOMÍA', minutes: 3, date: '18 de abril, 2026',
    imageSeed: 'nivelo-japan-gaming',
    summary: 'La industria de los videojuegos japoneses bate récord histórico.',
    summaryTranslations: {
      en: "Japan's gaming industry breaks an all-time record.",
      he: 'תעשיית משחקי הווידאו ביפן שוברת שיא היסטורי.',
      de: 'Japans Videospielbranche bricht einen historischen Rekord.',
      fr: 'L’industrie du jeu vidéo japonais bat un record historique.',
      it: "L'industria dei videogiochi giapponesi batte un record storico.",
      ja: '日本のゲーム業界が史上最高記録を更新。',
    },
    byLevel: {
      A1: { headline: 'Los videojuegos japoneses ganan mucho dinero', body: [[
        { text: 'Japón hace muchos videojuegos famosos. Este año vende más que nunca. Los jugadores compran de todo el mundo. Es muy bueno para la economía. Hay nuevos juegos cada mes.' },
      ]]},
      B1: { headline: 'La industria japonesa de los videojuegos bate su récord histórico', body: [[
        { text: 'La industria japonesa de los videojuegos ha cerrado el año fiscal con cifras de venta sin precedentes, según los datos publicados este lunes. El crecimiento, superior al treinta por ciento, ha estado impulsado por varios títulos de gran éxito internacional y por una fuerte demanda en el mercado asiático. Los principales estudios anuncian ya nuevas inversiones para producir contenidos exclusivos. El sector se consolida como uno de los grandes pilares de la economía cultural del país.' },
      ]]},
    },
  },

  // ─── 35 · Japón · Jornada laboral corta ─────────────────────────────
  {
    id: '35', country: 'JP', flag: '🇯🇵', ...SRC.asahi,
    category: 'SOCIEDAD', minutes: 4, date: '17 de abril, 2026',
    imageSeed: 'nivelo-japan-work',
    summary: 'Japón alcanza la jornada laboral más corta de los países desarrollados.',
    summaryTranslations: {
      en: 'Japan now has the shortest workweek among developed countries.',
      he: 'ליפן יש את שבוע העבודה הקצר ביותר במדינות המפותחות.',
      de: 'Japan hat nun die kürzeste Arbeitswoche unter den Industrieländern.',
      fr: 'Le Japon affiche désormais la semaine de travail la plus courte des pays développés.',
      it: 'Il Giappone ha ora la settimana lavorativa più corta tra i Paesi sviluppati.',
      ja: '日本が先進国で最短の労働時間に到達。',
    },
    byLevel: {
      A1: { headline: 'Japón trabaja menos horas que antes', body: [[
        { text: 'Japón cambia las horas de trabajo. Ahora la gente trabaja menos. Los días son más cortos. Las familias pasan más tiempo juntas. Es un gran cambio en la sociedad.' },
      ]]},
      B1: { headline: 'Japón alcanza la jornada laboral más corta de los países desarrollados', body: [[
        { text: 'Japón ha logrado este año la jornada laboral semanal más corta de los países desarrollados, según un informe publicado por la OCDE. La cifra es el resultado de varias reformas legales puestas en marcha durante la última década para combatir la cultura de las horas extra. Las empresas señalan, además, una mejora en la productividad y en el bienestar de las plantillas. Sin embargo, sectores como la construcción y el comercio aún se quedan al margen del cambio.' },
      ]]},
    },
  },
]

export const getArticleById = (id) => articles.find((a) => a.id === id) || articles[0]

// Returns { headline, body } for the requested level. If the level is not
// defined for that article, falls back to the closest neighbouring level.
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
