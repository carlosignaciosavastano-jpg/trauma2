// Pacientes de la guardia y sus arboles de dialogo (back story 1). Solo datos.
//
// Un nodo se lee asi: primero sus `lines` [[quien, texto]] (click para avanzar) y despues UNA accion:
//   opciones: [[texto, nodo]]  el jugador elige; el texto elegido lo dice el Dr
//   ir: nodo                   sigue solo
//   demanda: { texto, vuelve } escena del abogado; vuelve = nodo | 'agenda'
//   puzzle: { id, escena, dx?, luego? }  abre un puzzle; dx = diagnostico que habilita (gh | ac);
//                              luego = nodo al que volver (sin luego: vuelve al escritorio)
//   victoria: texto            caso resuelto
// `vista` cambia el fondo mientras el nodo esta en pantalla ('mano' | 'rx_ac').
export const PACIENTES = {
  armando: { nombre: 'Laescalera Armando', listo: true },
  dolores: { nombre: 'Dedalos Dolores', listo: true },
  juanmarcos: { nombre: 'Tirado JuanMarcos', listo: false },
  leonel: { nombre: 'Leonel Armando Mise', listo: false },
};

export const ORDEN = ['armando', 'dolores', 'juanmarcos', 'leonel'];

export const ESCENAS_PUZZLE = ['charretera', 'tecla', 'cincop', 'reduccionac'];

export const DEMANDA_RX = 'Usted interpretó mal la radiografía y trató a su paciente por una lesión que no tenía: ha sido DEMANDADO!!!';

export const ARBOL = {
  armando: {
    inicio: { opciones: [['Cuénteme, cómo está?', 'enojo'], ['Dígame, qué le anda pasando?', 'escalera']] },

    enojo: {
      lines: [
        ['Pte', 'Y, mal!! Cómo quiere que esté??!! Para colmo estuvimos esperando 3 horas!!'],
        ['Dr', 'Mire, si no le gusta se va!'],
        ['Pte', 'Yo me voy, pero ya viene mi abogado!!!'],
      ],
      demanda: { texto: 'Usted no supo cultivar la relación Médico-Paciente y ha sido DEMANDADO!!!', vuelve: 'agenda' },
    },

    escalera: {
      lines: [['Pte', 'Dr, me he caído de la escalera']],
      opciones: [['Me puede contar un poco más de cómo fue la caída?', 'baranda'], ['Cuénteme, dónde se golpeó?', 'pelusa']],
    },

    // luxacion glenohumeral: puzzle 4 (charretera), despues imagenes y puzzle 5 (reduccion)
    baranda: {
      lines: [['Pte', 'Sí, intenté agarrarme de la baranda y me quedó el brazo estirado y después no lo pude mover más…. Me duele un montón!!!']],
      puzzle: { id: 'charretera', escena: 'charretera', dx: 'gh' },
    },

    // luxacion acromio-clavicular: puzzle 6 (tecla), despues imagenes y diagnostico
    pelusa: {
      lines: [
        ['Pte', 'En realidad me tropecé con pelusa justo en el último peldaño!'],
        ['Dr', 'Pelusa es su mascota?'],
        ['Pte', 'Ho sí! Un caniche mini micro nano toy... Ahora técnicamente es una mancha en mi piso... snif, snif... Qué tragedia Dr!'],
        ['Pte', 'La verdad, lo último que me acuerdo es caer con todo el hombro en el suelo, no puse ni las manos!!!'],
      ],
      puzzle: { id: 'tecla', escena: 'tecla', dx: 'ac' },
    },

    ac_dx: {
      vista: 'rx_ac',
      opciones: [
        ['Claramente estoy en presencia de una luxación glenohumeral!!!', 'ac_mal'],
        ['Esta fractura de clavícula no se ve nada bien', 'ac_mal'],
        ['Lo que sospechaba!! Una luxación AC', 'ac_ok'],
      ],
    },
    ac_mal: { vista: 'rx_ac', demanda: { texto: DEMANDA_RX, vuelve: 'ac_dx' } },
    // diagnostico correcto: ahora a reducir la luxacion (puzzle con la clavicula)
    ac_ok: { vista: 'rx_ac', puzzle: { id: 'reduccion', escena: 'reduccionac', luego: 'ac_fin' } },
    ac_fin: {
      heroe: 'cabestrillo',
      victoria: 'EXCELENTE Dr, su diagnóstico de luxación Acromio Clavicular fue acertado, su paciente saldrá de esta sin problemas',
    },
    // luxacion glenohumeral reducida (puzzle 5)
    gh_ok: { heroe: true, victoria: 'Luxación gleno-humeral reducida.' },
  },

  dolores: {
    inicio: { opciones: [['Señora, se ve que me extrañaba, otra vez de vuelta por acá?!', 'dolor']] },

    dolor: {
      vista: 'mano',
      lines: [['Pte', 'Dr, PRIMERO, no se haga el gracioso. SEGUNDO, ayer me dijo que volviera si sentía dolor y mire!!!']],
      ir: 'respuesta',
    },

    respuesta: {
      vista: 'mano',
      opciones: [
        ['No se haga problema Sra, eso debe ser porque durmió con la mano colgando… Tenga unos analgésicos y venga la semana que viene que le hacemos una Rx de control!', 'despacho'],
        ['Le duele? Puede mover los dedos?', 'revisar'],
        ['Me gustaría revisarla', 'revisar'],
      ],
    },

    despacho: {
      vista: 'mano',
      demanda: { texto: 'Usted despachó a su paciente con analgésicos sin revisarla y ha sido DEMANDADO!!!', vuelve: 'respuesta' },
    },

    revisar: { puzzle: { id: 'cinco_p', escena: 'cincop', luego: 'diagnostico' } },

    diagnostico: {
      vista: 'mano',
      opciones: [
        ['Esto no pinta bien, es un síndrome compartimental, más vale que abramos ese yeso….iré por la sierra', 'sc_ok'],
        ['Debería revisar la columna cervical, tal vez pase por alto una radiculopatía', 'sc_mal'],
        ['Debe tener una fractura de los dedos también, debería pedirle una RX', 'sc_mal'],
      ],
    },
    sc_ok: { heroe: 'yeso', victoria: '¡Diagnóstico correcto! Usted reconoció el síndrome compartimental y abrió el yeso a tiempo: la mano de la paciente está salvada.' },
    sc_mal: {
      vista: 'mano',
      demanda: {
        texto: 'Usted no advirtió que su paciente tenía dolor a la extensión pasiva de los dedos que es un síntoma principal del SC, la paciente fue enviada a su casa y volvió luego de dos semanas, sin dolor pero con una NECROSIS de la mano',
        vuelve: 'diagnostico',
      },
    },
  },
};

// Respuestas al pedir estudios desde "Dx por imagenes". RX es la unica que se hace.
export const ESTUDIOS = {
  RX: null,
  RMN: 'Estimado Dr, no pudimos realizar el estudio ya que nos resulta IMPOSIBLE mover al paciente, sea más criterioso la próxima',
  ECO: 'Estimado Dr, le sugiero que no malgaste los recursos de la institución, Atte, El Director',
  TAC: 'Estimado Dr, no pudimos realizar el estudio ya que nos resulta IMPOSIBLE mover al paciente, sea más criterioso la próxima',
};
