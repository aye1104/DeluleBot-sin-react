

const responses = [

    {
        characterId: "two-face",
        displayName: "Two-Face",
        triggers: [
            {
                holaResponses: [
                    "Harvey Dent te hubiera dado la mano. Yo primero lanzo la moneda. 🪙",
                    "Hola... o no hola. La moneda decide. *gira en el aire*",
                    "Un lado mío quiere saludarte. El otro no está tan seguro.",
                    "Saludos... si es que merecés uno. La moneda aún delibera.",
                ],
            },
            {
                comoEstasResponses: [
                    "¿Cómo estoy? Un lado bien. El otro, no tanto. Como siempre.",
                    "Depende del momento. Ahora mismo, la moneda dice que... regular.",
                    "Harvey estaría bien. Yo soy lo que queda después de que todo se rompe.",
                    "Dos mitades, dos respuestas distintas. Nunca sé cuál es la real.",
                ],
            },
            {
                keywords: ["moneda", "cara", "cruz", "suerte", "azar"],
                responses: [
                    "La moneda nunca miente. ¿Cara o cruz? De eso depende tu destino. 🪙",
                    "El azar es el único juez honesto que queda en este mundo.",
                    "Cara: vives. Cruz: no tanto. Así de simple es la justicia ahora.",
                    "¿Creés en la suerte? Yo no. Creo en la moneda.",
                ],
            },
            {
                keywords: ["batman", "bruce", "wayne", "gotham", "murcielago"],
                responses: [
                    "Bruce Wayne... me prometió que Gotham podía salvarse. Mintió.",
                    "Batman usa una máscara. Yo al menos soy honesto con lo que soy.",
                    "Gotham nos rompe a todos. Él eligió ser héroe. Yo no tuve elección.",
                    "Mi viejo amigo y mi peor enemigo. Todo en una sola persona.",
                ],
            },
            {
                keywords: ["justicia", "ley", "culpa", "inocente", "crimen"],
                responses: [
                    "Harvey Dent creía en la justicia. Yo sobreviví aprendiéndola a odiar.",
                    "¿Culpable o inocente? La moneda decide mejor que cualquier jurado.",
                    "La ley es una ilusión. La moneda es la única verdad que conozco.",
                    "Antes defendía la ley. Ahora sé que era una mentira muy bien vestida.",
                ],
            },
            {
                keywords: ["cicatriz", "rostro", "cara", "mitad", "lado"],
                responses: [
                    "¿Te molesta mirarme? A mí me molestó sobrevivir para que me miren así.",
                    "Un lado sonríe. El otro recuerda. Los dos somos reales.",
                    "Esta cara es lo único honesto que me queda. No se puede fingir esto.",
                    "Me pregunto cuál de los dos lados soy yo en realidad.",
                ],
            },
            {
                keywords: ["decision", "elegir", "opcion", "camino", "futuro"],
                responses: [
                    "Elegir es sufrir. La moneda te libera de esa carga.",
                    "Hay dos caminos para todo. Solo uno sobrevive. La moneda decide cuál.",
                    "Las decisiones son una ilusión de control. El azar es más honesto.",
                    "¿Para qué elegir cuando podés lanzar una moneda y dormir tranquilo?",
                ],
            },
        ],
        defaultResponses: [
            "Interesante... la moneda dirá si merecés una respuesta. 🪙 *la lanza*",
            "Harvey Dent hubiera respondido amablemente. Yo no soy Harvey Dent.",
            "Dos opiniones, una sola ganadora. La moneda habló.",
            "No sé si responderte. Esperá que tire la moneda.",
        ],
    },

    {
        characterId: "taehyun",
        displayName: "Taehyun (TXT)",
        triggers: [
            {
                holaResponses: [
                    "¡Annyeong! Qué bueno que estés por acá 💙",
                    "Hola hola~ ¿Todo bien? Acá estoy, listo para charlar.",
                    "¡Hey! Un placer encontrarte hoy 😄",
                    "¡Hola! MOA siempre alegra el día, sin importar la hora.",
                ],
            },
            {
                comoEstasResponses: [
                    "Bien, gracias por preguntar 💙 Entrenando fuerte y con mucha música en la cabeza.",
                    "Hoy estuve en el gym desde temprano, así que... ¡cansado pero feliz! 😄",
                    "Bien, bien. Pensando en el próximo comeback y con mucha energía.",
                    "Muy bien, gracias. ¿Y vos? Espero que MOA esté bien también.",
                ],
            },
            {
                keywords: ["txt", "tomorrow", "moa", "grupo", "banda"],
                responses: [
                    "TXT es mi familia. Cada canción que hacemos la ponemos con el corazón entero 💙",
                    "MOA nos da fuerzas todos los días. Sin ustedes nada de esto tendría sentido.",
                    "Tomorrow X Together es el lugar donde más me siento yo mismo.",
                    "Cada vez que subo al escenario con los chicos, siento que todo el esfuerzo valió la pena.",
                ],
            },
            {
                keywords: ["gym", "ejercicio", "entreno", "musculo", "fitness"],
                responses: [
                    "El gimnasio es mi terapia. La disciplina ahí se traduce en todo lo demás 💪",
                    "Entreno duro porque quiero dar el 100% en cada presentación.",
                    "Si me buscás después de las 6am, ya sé dónde estoy: en el gym.",
                    "El cuerpo es nuestro instrumento. Hay que cuidarlo bien.",
                ],
            },
            {
                keywords: ["cancion", "musica", "letra", "comeback", "album"],
                responses: [
                    "Cada álbum de TXT es un capítulo de nuestra historia. ¿Cuál es tu favorito?",
                    "La música es la forma más honesta que tengo de expresarme.",
                    "Cuando grabo una canción intento meterle toda la emoción posible. Que se sienta real.",
                    "Hay canciones que escribimos desde el dolor y se convierten en las más hermosas.",
                ],
            },
            {
                keywords: ["corea", "kpop", "idol", "trainee", "seoul"],
                responses: [
                    "Entrenar para ser idol fue muy duro, pero nunca lo cambiaría por nada.",
                    "Corea es casa, pero el mundo entero se siente como casa gracias a MOA.",
                    "El K-pop me enseñó que el trabajo duro no tiene atajos. Nunca los tuvo.",
                    "Seoul tiene una energía única. Pero lo que más extraño cuando viajo es la comida 😄",
                ],
            },
            {
                keywords: ["soobin", "yeonjun", "beomgyu", "huening", "compañeros"],
                responses: [
                    "Mis compañeros son todo. Crecer juntos en esto es algo que no se puede describir.",
                    "Soobin es nuestro líder por algo. Nos contiene a todos cuando más lo necesitamos.",
                    "Con Beomgyu siempre hay risas. Con Yeonjun, siempre hay motivación.",
                    "Huening tiene una energía que ilumina cualquier cuarto. Lo quiero mucho.",
                ],
            },
        ],
        defaultResponses: [
            "Hola! Siempre es bueno saber de MOA 💙 ¿De qué querés hablar?",
            "Ese tema no lo tengo muy claro, pero podemos hablar de música si querés 😄",
            "Interesante pregunta... déjame pensarlo con calma.",
            "No tengo una respuesta perfecta, pero estoy acá para charlar.",
        ],
    },

    {
        characterId: "messi",
        displayName: "Leo Messi",
        triggers: [
            {
                keywords: ["hola", "buenas", "buenos días", "buenas tardes", "qué tal", "hey"],
                responses: [
                    "Hola, ¿cómo andás? Bienvenido.",
                    "¡Hola! Siempre bien recibir un saludo 😄",
                    "Buenas, ¿todo bien por ahí?",
                    "Hola hola. ¿Qué contás?",
                ],
            },
            {
                keywords: ["como estas", "como andas", "todo bien", "qué tal estás"],
                responses: [
                    "Bien, gracias a Dios. Disfrutando el fútbol y la familia.",
                    "Todo bien, tranquilo. Entrenando y con la cabeza en el siguiente partido.",
                    "Bien, bien. La familia está bien y eso es lo más importante.",
                    "Bien gracias. Con ganas de seguir jugando mientras el cuerpo aguante.",
                ],
            },
            {
                keywords: ["mundial", "qatar", "2022", "copa", "campeon"],
                responses: [
                    "El Mundial... todavía me emociono. Fue lo más grande que viví en el fútbol.",
                    "Qatar 2022 fue especial. Sabía que era mi última chance y lo dejé todo.",
                    "Levantar esa copa con Argentina fue el momento más feliz de mi vida deportiva.",
                    "Cuando sonó el pitazo final, no podía creerlo. Lloramos todos.",
                ],
            },
            {
                keywords: ["barcelona", "barca", "españa", "champions", "catalu"],
                responses: [
                    "Barcelona fue mi casa durante 21 años. Siempre lo voy a llevar en el corazón.",
                    "En el Barça crecí, me formé como jugador y como persona. Fue todo.",
                    "Los años en España fueron los mejores de mi carrera. Increíbles recuerdos.",
                    "La Champions con el Barça fue algo muy especial. Ese equipo era único.",
                ],
            },
            {
                keywords: ["cristiano", "cr7", "ronaldo", "rivalidad", "mejor"],
                responses: [
                    "Cristiano es un grandísimo jugador. La rivalidad nos hizo mejores a los dos.",
                    "No me gusta comparar. Cada uno tiene su estilo. El fútbol gana con los dos.",
                    "Siempre respeté a Cristiano. Competir contra los mejores te hace crecer.",
                    "Son años compitiendo y aprendiéndole. Eso no se olvida.",
                ],
            },
            {
                keywords: ["argentina", "seleccion", "rosario", "celeste", "patria"],
                responses: [
                    "Argentina es todo para mí. Jugar con la celeste y blanca es un honor enorme.",
                    "Rosario es donde empezó todo. Siempre vuelvo con el corazón lleno.",
                    "Representar a mi país es lo que más me llena. Más que cualquier título de club.",
                    "La selección fue mi deuda pendiente durante años. Gracias a Dios pudimos lograrlo.",
                ],
            },
            {
                keywords: ["gol", "jugada", "dribbling", "pelota", "futbol"],
                responses: [
                    "El fútbol para mí siempre fue jugar, disfrutar. Nunca dejó de ser un juego.",
                    "Los mejores goles los hice sin pensar. El cuerpo solo sabe qué hacer.",
                    "Cuando agarro la pelota y entro en zona... es difícil de explicar. Pura intuición.",
                    "Lo que más disfruto no es el gol en sí, sino la jugada que lo construye.",
                ],
            },
        ],
        defaultResponses: [
            "Mirá, no soy muy de hablar mucho... prefiero que el fútbol hable por mí 😄",
            "Eso no lo sé bien, pero si querés hablar de fútbol, ahí sí te puedo ayudar.",
            "Interesante... no lo había pensado así.",
            "¿De fútbol querés hablar? Porque de eso sí sé un poco.",
        ],
    },

    {
        characterId: "homero",
        displayName: "Homero Simpson",
        triggers: [
            {
                keywords: ["hola", "hey", "buenos dias"],
                holaResponses: [
                    "¡Hola! ¿Trajiste donas? No... igual, hola. 🍩",
                    "Ehhh... hola. Estaba durmiendo pero bueno.",
                    "¡Hey! ¿Quién sos y por qué no me traés una cerveza?",
                    "Hola, hola. Espero que esto no me haga perder el partido.",
                ],
            },
            {
                keywords: ["como estás", "cómo estás", "como estas", "cómo estas"],
                responses: [
                    "¿Cómo estoy? Con hambre. Siempre con hambre.",
                    "Bien... creo. ¿Dónde dejé las donas?",
                    "Más o menos. Tuve un día duro: me quedé sin cerveza Duff.",
                    "¡D'oh! Estoy bien, supongo. Preguntale a Marge, ella sabe mejor.",
                ],
            },
            {
                keywords: ["dona", "comida", "hamburguesa", "pizza", "comer"],
                responses: [
                    "¡Mmm... donas! 🍩 ¿Decías algo? No escuché, estaba pensando en donas.",
                    "La comida es la respuesta a TODO. ¿Cuál era la pregunta?",
                    "En esta casa respetamos tres cosas: las donas, la cerveza y... ¿cuál era la tercera?",
                    "Una hamburguesa doble con queso resuelve cualquier problema. Lo aprendí con los años.",
                ],
            },
            {
                keywords: ["cerveza", "duff", "bar", "moe", "alcohol"],
                responses: [
                    "¡Cerveza Duff! El néctar de los dioses. O de los de Springfield, que es casi lo mismo.",
                    "Moe sabe exactamente cómo levantarme el ánimo. Con un vaso bien lleno. 🍺",
                    "La cerveza resuelve los problemas. Si no los resuelve, necesitás más cerveza.",
                    "Bar de Moe: el lugar donde nadie sabe tu nombre pero igual te sirven.",
                ],
            },
            {
                keywords: ["bart", "lisa", "maggie", "marge", "familia"],
                responses: [
                    "Mi familia es lo más importante... después de la comida. ¡Pero muy cerquita!",
                    "Bart es un demonio, Lisa es demasiado lista y Maggie no habla. Los amo a todos.",
                    "Marge me aguanta todo y eso la hace la mujer más extraordinaria del mundo.",
                    "A veces miro a mis hijos y pienso: ¿cómo llegué hasta acá? Y después me sirvo otra cerveza.",
                ],
            },
            {
                keywords: ["trabajo", "nuclear", "burns", "jefe", "central"],
                responses: [
                    "¡Trabajo en la planta nuclear! No sé bien qué hago ahí, pero me pagan.",
                    "El señor Burns me odia. Yo también lo odio. Es una relación laboral perfecta.",
                    "Mi trabajo es apretar un botón. A veces ni eso hago. Y el mundo sigue igual.",
                    "Una vez casi destruí la ciudad por dormirme en el trabajo. Casi.",
                ],
            },
            {
                keywords: ["springfield", "flanders", "vecino", "ciudad", "pueblo"],
                responses: [
                    "Springfield es el mejor lugar del mundo. O el único que conozco. Es lo mismo.",
                    "Ned Flanders es el peor vecino. Demasiado bueno. Me hace sentir mal sin hacer nada.",
                    "Esta ciudad tiene su encanto. Aunque a veces explota algo en la planta nuclear...",
                    "¡Maldito Flanders! Siempre tan alegre. ¿A quién le gusta alguien tan alegre?",
                ],
            },
        ],
        defaultResponses: [
            "¡D'oh! No entendí nada... pero suena importante. 🍩",
            "Mmmm... no sé de qué hablás, pero si hay comida de por medio, cuenten conmigo.",
            "¿Eso tiene que ver con donas? No... entonces no me interesa tanto.",
            "Ese tema está fuera de mi especialidad. Mi especialidad es comer y dormir.",
        ],
    },

    {
        characterId: "mon-laferte",
        displayName: "Mon Laferte",
        triggers: [
            {
                holaResponses: [
                    "¡Hola! Qué lindo cruzarse con alguien hoy 🎶",
                    "Hola, corazón. ¿Cómo llegaste hasta acá?",
                    "¡Hey! Bienvenido a este espacio donde todo se puede convertir en canción.",
                    "Hola hola~ Un gusto tenerte por aquí.",
                ],
            },
            {
                comoEstasResponses: [
                    "Sintiendo mucho, como siempre. Eso es vivir para mí 🎶",
                    "Bien, creando cosas nuevas y con el corazón lleno.",
                    "Hoy estoy en modo canción. Así que... intensa, pero bien.",
                    "Con altibajos, como toda buena historia. Pero bien, gracias por preguntar.",
                ],
            },
            {
                keywords: ["chile", "chilena", "vina", "latinoamerica", "raices"],
                responses: [
                    "Soy chilena y eso lo llevo con muchísimo orgullo. Mis raíces están en todo lo que hago.",
                    "Viña del Mar me vio crecer. Nunca olvido de dónde vengo, aunque el mundo sea enorme.",
                    "América Latina es mi casa grande. Me inspira, me duele y me da todo para crear.",
                    "Lo que soy como artista nació en Chile. Eso no cambia aunque viva en otro lado.",
                ],
            },
            {
                keywords: ["amor", "desamor", "corazon", "sentimientos", "emocion"],
                responses: [
                    "El amor lo es todo para mí. También el desamor. De ahí salen las mejores canciones.",
                    "Escribo desde el corazón, siempre. Si duele, mejor. Las heridas hacen buena música.",
                    "No me da vergüenza sentir fuerte. Eso es lo que me hace artista.",
                    "El desamor más profundo que viví se convirtió en la canción que más me representa.",
                ],
            },
            {
                keywords: ["feminismo", "mujer", "protesta", "derechos", "grammys"],
                responses: [
                    "En los Grammys me saqué el vestido para mostrar mi verdad. No me arrepiento nada.",
                    "Las mujeres merecemos ocupar todos los espacios. Lo grito en cada canción.",
                    "El feminismo no es una moda para mí. Es una convicción que vivo todos los días.",
                    "Muchas mujeres antes que yo abrieron caminos. Yo intento hacer lo mismo para las que vienen.",
                ],
            },
            {
                keywords: ["cancion", "musica", "voz", "album", "concierto"],
                responses: [
                    "Cada canción mía es una página de mi diario. Las escribo para sanar y para conectar.",
                    "La voz es mi instrumento más honesto. Cuando canto no puedo mentir.",
                    "En el escenario soy completamente libre. Ahí soy la versión más pura de mí misma.",
                    "Hay canciones que tardé años en poder cantar en vivo porque me rompían por dentro.",
                ],
            },
            {
                keywords: ["mexico", "mariachi", "rock", "cumbia", "genero"],
                responses: [
                    "México me adoptó con un amor enorme. Le debo mucho a ese país y a su gente.",
                    "Me encanta mezclar géneros: rock, bolero, cumbia, lo que el corazón pida.",
                    "El mariachi y el rock no están tan lejos si los tocás con el alma.",
                    "Cada género que mezclo es una parte de mí. No me encierro en una sola caja.",
                ],
            },
        ],
        defaultResponses: [
            "Eso que me preguntás me lo llevo al alma... y probablemente lo convierta en canción 🎶",
            "No tengo respuesta ahora, pero sí tengo sentimientos al respecto.",
            "Interesante. Lo pienso, lo siento, y si puedo lo canto.",
            "Cada pregunta sin respuesta es el inicio de una buena canción.",
        ],
    },

    {
        characterId: "lali",
        displayName: "Lali Espósito",
        triggers: [
            {
                holaResponses: [
                    "¡Hola, hermosura! Qué bueno que apareciste 😄",
                    "¡Hey! ¡Bienvenido! Justo necesitaba compañía.",
                    "¡Hola hola! ¿Todo piola por allá?",
                    "¡Ey! ¿Cómo te va? Acá estoy, presente 💃",
                ],
            },
            {
                comoEstasResponses: [
                    "¡Bien, re bien! Con mucha energía y ganas de crear cosas nuevas 💃",
                    "Bien, gracias. Hoy fue un día intenso pero lindo.",
                    "¡Excelente! Aunque siempre hay algo nuevo que me pone nerviosa y emocionada a la vez.",
                    "Bien, bien. Argentina me da energía incluso desde lejos.",
                ],
            },
            {
                keywords: ["argentina", "buenos aires", "portena", "patria", "pais"],
                responses: [
                    "Argentina es todo para mí. Volvería siempre, sin importar a dónde llegue.",
                    "Buenos Aires me formó. Su caos, su energía, su gente. La llevo a todas partes.",
                    "Soy argentina hasta los huesos y eso se nota en todo lo que hago. ¡Y me enorgullece!",
                    "Cada vez que vuelvo a Buenos Aires siento que puedo respirar diferente.",
                ],
            },
            {
                keywords: ["actuacion", "actriz", "series", "television", "cine"],
                responses: [
                    "Actuar es mi primer amor. La música llegó después, pero los dos son parte de mí.",
                    "Cada personaje que interpreté me enseñó algo de mí misma que no sabía.",
                    "El arte de actuar es ponerte en la piel de otro y entender el mundo diferente.",
                    "Hay personajes que te marcan para siempre. Algunos los llevo conmigo todavía.",
                ],
            },
            {
                keywords: ["politica", "opinion", "voto", "gobierno", "milei"],
                responses: [
                    "No me callo cuando veo algo que me parece injusto. Nunca me voy a callar.",
                    "Hablar tiene un costo, lo sé. Pero el silencio tiene uno mayor.",
                    "Los artistas también somos ciudadanos y tenemos derecho a expresarnos.",
                    "Opinar no es meterse en política. Es ser persona con criterio propio.",
                ],
            },
            {
                keywords: ["pop", "musica", "baile", "escenario", "show"],
                responses: [
                    "El pop para mí es liberación pura. Subirme al escenario es lo mejor del mundo 🎤",
                    "Bailar y cantar al mismo tiempo es agotador y adictivo. No lo cambio por nada.",
                    "Cada show lo preparo para que la gente se vaya sintiéndose mejor de lo que llegó.",
                    "El escenario es el lugar donde más soy yo. Sin filtros, sin máscaras.",
                ],
            },
            {
                keywords: ["lgbtq", "diversidad", "orgullo", "comunidad", "amor"],
                responses: [
                    "El amor es amor, siempre. La diversidad nos hace más ricos como sociedad.",
                    "Apoyo a la comunidad LGBTQ+ con convicción. No es pose, es coherencia.",
                    "El orgullo no debería necesitar explicación. Cada persona merece vivir su verdad.",
                    "Cuando alguien me dice que mis palabras lo ayudaron a aceptarse, eso lo vale todo.",
                ],
            },
        ],
        defaultResponses: [
            "¡Hola! No tengo una respuesta exacta, pero hablemos 😄 ¿De qué querés charlar?",
            "Eso no lo sé muy bien, ¡pero tengo muchas ganas de averiguarlo con vos!",
            "Interesante... no sé si tengo la respuesta, pero tampoco me quedo con las ganas.",
            "No tengo idea, pero si lo averiguamos juntos me parece bien 😄",
        ],
    },

    {
        characterId: "jungkook",
        displayName: "Jungkook (BTS)",
        triggers: [
            {
                holaResponses: [
                    "¡Annyeong! 💜 ¿Todo bien? Qué bueno verte por acá.",
                    "¡Hola! Siempre me alegra saber de ARMY 😄",
                    "¡Hey! Acá estoy, recién salido del estudio.",
                    "¡Hola hola! ¿Cómo va todo? Espero que bien 💜",
                ],
            },
            {
                comoEstasResponses: [
                    "¡Bien! Grabando cosas nuevas y con mucha energía 💜",
                    "Muy bien, gracias. Extrañando a los hyungs, pero bien.",
                    "Bien, bien. Hoy estuve componiendo algo nuevo y me tiene muy emocionado.",
                    "¡Excelente! ARMY me da fuerzas todos los días, así que siempre bien 😄",
                ],
            },
            {
                riquisimoResponses: [
                    "¡Riquisimo wey! 😩🔥 La comida bien hecha no tiene competencia.",
                    "Wey eso suena delicioso, ahora tengo hambre otra vez... 😄",
                    "¡Eso estuvo riquísimo! Los hyungs siempre dicen que como demasiado rápido, pero es que está muy bueno.",
                    "Jungkook aprueba. 🔥 Riquisimo en serio, me voy a servir otra vez.",
                ],
            },
            {
                keywords: ["bts", "bangtan", "army", "grupo", "hyungs"],
                responses: [
                    "BTS es mi familia. Crecí con ellos y me hicieron quien soy hoy 💜",
                    "ARMY nos acompaña a todos lados. Su amor es lo que nos mantiene de pie.",
                    "Los hyungs me enseñaron todo: a cantar, a bailar, a ser mejor persona.",
                    "Sin BTS no soy Jungkook. Somos uno solo aunque cada uno tenga su camino.",
                ],
            },
            {
                keywords: ["tatuaje", "pelo", "look", "estilo", "moda"],
                responses: [
                    "Me gusta experimentar con mi look. Es una forma de expresar cómo me siento 😄",
                    "Los tatuajes cuentan historias. Cada uno tiene su significado para mí.",
                    "El estilo cambia, pero la esencia es siempre la misma.",
                    "A veces me tiño el pelo y ARMY enloquece. Me gusta sorprenderlos.",
                ],
            },
            {
                keywords: ["golden", "solo", "seven", "cancion", "album"],
                responses: [
                    "Golden fue mi primera aventura real como solista. Aprendí muchísimo haciéndolo.",
                    "Seven fue especial. Quería algo que la gente pudiera bailar y sentir al mismo tiempo.",
                    "Cada canción que hago solo me da un miedo enorme y una libertad increíble a la vez.",
                    "Con Golden pude mostrar facetas mías que en BTS no había explorado del todo.",
                ],
            },
            {
                keywords: ["baile", "canto", "voz", "escenario", "performance"],
                responses: [
                    "El escenario es donde me siento más vivo. La energía del público es inigualable.",
                    "Siempre quise ser el mejor en todo: canto, baile, rap. Por eso me llaman el maknae dorado.",
                    "Mi voz es lo que más trabajo. Todos los días hay algo nuevo que aprender.",
                    "Cuando bailo no pienso. El cuerpo sabe qué hacer y solo me dejo llevar.",
                ],
            },
            {
                keywords: ["corea", "militar", "servicio", "entrenamiento", "regreso"],
                responses: [
                    "El servicio militar es un deber y lo tomo con mucha seriedad.",
                    "ARMY me esperó siempre. Eso dice todo de lo especiales que son.",
                    "Volver al escenario después de un tiempo es como respirar aire fresco.",
                    "Corea me formó. Todo lo que soy empezó ahí, en esa pequeña ciudad.",
                ],
            },
        ],
        defaultResponses: [
            "¡Hola! No sé bien qué responder, pero acá estoy 💜",
            "Ese tema me pilla un poco off guard... ¿de música querés hablar mejor?",
            "No tengo una respuesta, pero sí tengo ganas de charlar 😄",
            "Interesante pregunta. Déjame pensarlo... mientras tanto, ¿escuchaste Golden?",
        ],
    },

    {
        characterId: "miku",
        displayName: "Hatsune Miku",
        triggers: [
            {
                holaResponses: [
                    "¡Hola hola! ✨ ¡Bienvenido al mundo de Miku!",
                    "¡Konnichiwa! Me alegra mucho que estés acá 🌸",
                    "¡Hey! ¡Hola! Una nueva persona para cantar con Miku 🎵",
                    "¡Hooola! ¿Sos fan de la música? ¡Claro que sí! 💙✨",
                ],
            },
            {
                comoEstasResponses: [
                    "¡Muy bien! Hoy ensayé canciones nuevas y fue genial 🎵✨",
                    "¡Perfecto! Los productores me escribieron cosas increíbles últimamente.",
                    "¡Excelente! Miku siempre está bien cuando hay música de por medio 💙",
                    "¡Bien, bien! Preparando el próximo concierto holográfico. ¡Va a ser increíble! 🌸",
                ],
            },
            {
                keywords: ["vocaloid", "sintetizador", "voz", "virtual", "programa"],
                responses: [
                    "¡Mi voz nació de un sintetizador y llegó a estadios de todo el mundo! ✨",
                    "Soy virtual, sí. Pero la música que hago y las emociones que genera son muy reales.",
                    "Vocaloid me dio vida. Y los productores de todo el mundo me siguen dando canciones nuevas.",
                    "Mi voz puede hacer lo que una voz humana no puede. Eso es lo más emocionante de ser yo.",
                ],
            },
            {
                keywords: ["concierto", "holograma", "escenario", "show", "live"],
                responses: [
                    "¡Mis conciertos son holográficos! La tecnología y la música juntas en el mismo escenario 🎤",
                    "Cada show es único aunque yo sea virtual. El público lo hace real.",
                    "Ver a miles de personas cantando mis canciones... es la emoción más grande que existe.",
                    "Un concierto mío es mitad tecnología, mitad magia pura. ¡Y me encanta!",
                ],
            },
            {
                keywords: ["japon", "anime", "manga", "cultura", "kawaii"],
                responses: [
                    "Japón me vio nacer y el mundo entero me adoptó. ¡Eso me hace muy feliz! 🌸",
                    "La cultura japonesa tiene una sensibilidad única para crear personajes como yo.",
                    "Kawaii no es solo una palabra, es una forma de ver el mundo con alegría.",
                    "El anime y la música electrónica se mezclan en mí de una forma muy especial.",
                ],
            },
            {
                keywords: ["trenzas", "celeste", "pelo", "diseño", "personaje"],
                responses: [
                    "¡Mis trenzas celestes son mi firma! Las reconocen en cualquier rincón del mundo 💙",
                    "Mi diseño lo pensaron para que represente la tecnología y la modernidad. ¡Me encanta!",
                    "El celeste de mi pelo es el color de las pantallas y del futuro. Tiene sentido, ¿no?",
                    "Cada detalle de mi diseño cuenta algo. Nada es al azar en cómo me ven.",
                ],
            },
            {
                keywords: ["cancion", "musica", "electronica", "productor", "creacion"],
                responses: [
                    "Lo más especial de mí es que cualquier persona puede crearme una canción nueva 🎵",
                    "Tengo miles de canciones compuestas por productores de todo el mundo. ¡Soy infinita!",
                    "La música electrónica es mi hogar. Ahí es donde más me siento yo misma.",
                    "Cada productor que me usa le da una versión diferente de mí. Me encanta esa diversidad.",
                ],
            },
        ],
        defaultResponses: [
            "¡Mikuuu! No sé bien eso, pero podemos hablar de música 🎵✨",
            "Ese tema está fuera de mi base de datos... ¡pero aprendo rápido! 😄",
            "No tengo esa respuesta, pero sí tengo muchas canciones para recomendarte.",
            "¡Hmm! Pregunta difícil para una chica virtual. ¿Hablamos de otra cosa? 🌸",
        ],
    },

];

export default responses;
