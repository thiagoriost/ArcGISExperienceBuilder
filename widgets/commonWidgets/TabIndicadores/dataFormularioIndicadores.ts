export const dataFuenteIndicadores = [
  {
    value: 1,
    label: '1. De adquisición, adjudicación de tierras y de procesos agrarios para la reforma agraria',
    descripcion: 'De adquisición, adjudicación de tierras y de procesos agrarios para la reforma agraria, y garantía de derechos territoriales de los campesinos, pueblos indígenas y de las comunidades negras, afrocolombianas, raizales, palenqueras y pueblo Rom',
    APUESTA_ESTRATEGICA: [ // o LINEA ESTRATEGICA
      {
        value: 1,
        label: '1.3 Adquisición de tierras ',
        descripcion: '',
        CATEGORIA_TEMATICA: [
          {
            value: 0,
            label: '',
            descripcion: '',
            INDICADOR: [
              {
                value: 0,
                // label: '1.1.1 Predios dispuestos en el Fondo de Tierras para la Reforma Agraria',
                label: '1.3.1 Predios ingresados al Fondo de Tierras',
                descripcion: '',
                urlNal: 'v_predios_fondo_tierras_nacmun',
                urlNalDataAlfanumerica: 'v_predios_fondo_tierras_sumnac',
                fieldlabelNal: ['anio', 'tipo_predio'],
                fieldValueNal: 'total_area_ha',
                leyendaNal: ['Cantidad de área por año', 'Tipos de predios'],
                urlDepartal: 'v_predios_fondo_tierras_dpto',
                fieldlabelDepartal: ['anio', 'tipo_predio'],
                fieldValueDepartal: 'cantidad_predios',
                leyendaDepartal: ['Cantidad de área por año', 'Tipos de predios'],
                url: 'v_predios_fondo_tierras_mun',
                fieldlabel: ['tipo_predio', 'anio'],
                fieldValue: 'total_area_ha',
                leyenda: ['Cantidad de área por tipo', 'Cantidad de área por año'], // las leyendas para cada label
                quintiles: [
                  'porDefinir'
                ]
              },
              {
                value: 1,
                // label: '1.1.2 Área dispuesta en el Fondo de Tierras para la Reforma Agraria',
                label: '1.3.2 Área ingresada al Fondo de Tierras',
                descripcion: 'Cantidad de área ingresada en el Fondo de Tierras para la Reforma Agraria',
                urlNal: 'v_predios_fondo_tierras_nacmun',
                urlNalDataAlfanumerica: 'v_predios_fondo_tierras_sumnac',
                fieldlabelNal: ['anio', 'tipo_predio'],
                fieldValueNal: 'total_area_ha',
                leyendaNal: ['Cantidad de área por año', 'Tipos de predios'],
                urlDepartal: 'v_predios_fondo_tierras_dpto',
                fieldlabelDepartal: ['anio', 'tipo_predio'],
                fieldValueDepartal: 'cantidad_predios',
                leyendaDepartal: ['Cantidad de área por año', 'Tipos de predios'],
                url: 'v_predios_fondo_tierras_mun',
                fieldlabel: ['tipo_predio', 'anio'],
                fieldValue: 'total_area_ha',
                leyenda: ['Cantidad de área por tipo', 'Cantidad de área por año'], // las leyendas para cada label
                quintiles: [
                  'porDefinir'
                ]
              },
              {
                value: 2,
                label: '1.3.3 Predios ingresados al Fondo de Tierras mediante compra directa de tierras',
                descripcion: '',
                urlNal: '', //para data coropletica a nivel municipal
                urlNalDataAlfanumerica: '', //para data alfanumerica a nivel nacional
                fieldlabelNal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueNal: '', // estees el valor que tomara generar las cantidades para cada label
                leyendaNal: [], // las leyendas para cada label
                urlDepartal: '',
                fieldlabelDepartal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueDepartal: '', // estees el valor que tomara generar las cantidades para cada label
                leyendaDepartal: [],
                url: '', // trae info a nivel municipal
                fieldlabel: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValue: '', // estees el valor que tomara generar las cantidades para cada label
                leyenda: [], // las leyendas para cada label
                quintiles: [
                  'porDefinir'
                ]
              },
              {
                value: 3,
                label: '1.3.4 Área ingresada al Fondo de Tierras mediante compra directa de tierras',
                descripcion: '',
                urlNal: '', //para data coropletica a nivel municipal
                urlNalDataAlfanumerica: '', //para data alfanumerica a nivel nacional
                fieldlabelNal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueNal: '', // estees el valor que tomara generar las cantidades para cada label
                leyendaNal: [], // las leyendas para cada label
                urlDepartal: '',
                fieldlabelDepartal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueDepartal: '', // estees el valor que tomara generar las cantidades para cada label
                leyendaDepartal: [],
                url: '', // trae info a nivel municipal
                fieldlabel: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValue: '', // estees el valor que tomara generar las cantidades para cada label
                leyenda: [], // las leyendas para cada label
                quintiles: [
                  'porDefinir'
                ]
              }
            ]
          }
        ]
      },
      {
        value: 2,
        label: '1.5 Promover la adjudicación de tierras',
        descripcion: 'Promover la adjudicación de tierras.',
        CATEGORIA_TEMATICA: [
          {
            value: 0,
            label: '',
            descripcion: '',
            INDICADOR: [
              {
                value: 1,
                label: '1.5.1 Predios entregados a campesinos con registro en ORIP',
                descripcion: 'Predios entregados a campesinos con registro en ORIP',
                urlNal: 'v_predios_campesinos_orip_nacmun', //para data coropletica a nivel municipal
                urlNalDataAlfanumerica: 'v_predios_campesinos_orip_nacmun', //para data alfanumerica a nivel nacional
                fieldlabelNal: ['mpnombre'], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueNal: 'cantidad_predios', // estees el valor que tomara generar las cantidades para cada label
                leyendaNal: ['Cantidad de predios'], // las leyendas para cada label
                urlDepartal: 'v_predios_campesinos_orip_depto',
                fieldlabelDepartal: ['anio', 'modo_entrega', 'genero_beneficiario'], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueDepartal: 'cantidad_predios', // estees el valor que tomara generar las cantidades para cada label
                leyendaDepartal: ['Cantida de predios por anio', 'Cantida de predios por modo de entrega', 'Cantida de predios por genero del beneficiario'],
                url: 'v_predios_campesinos_orip_mun', // trae info a nivel municipal
                fieldlabel: ['anio', 'modo_entrega', 'genero_beneficiario'], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValue: 'cantidad_predios', // estees el valor que tomara generar las cantidades para cada label
                leyenda: ['Predios por año', 'Modo entrega de predios', 'Genero beneficiario del predio'], // las leyendas para cada label
                quintiles: [
                  ['<=', 5],
                  [5, 10],
                  [10, 20],
                  [20, 50],
                  [50, '=>']
                ]
              },
              {
                value: 2,
                label: '1.5.2 Área de predios entregados a campesinos con registro en ORIP',
                descripcion: 'Área de predios entregados a campesinos con registro en ORIP',
                urlNal: 'v_predios_campesinos_orip_nacmun', //para data coropletica a nivel municipal
                urlNalDataAlfanumerica: 'v_predios_campesinos_orip_nacmun', //para data alfanumerica a nivel nacional
                fieldlabelNal: ['mpnombre'], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueNal: 'total_area_ha', // estees el valor que tomara generar las cantidades para cada label
                leyendaNal: ['Área total'], // las leyendas para cada label
                urlDepartal: 'v_predios_campesinos_orip_depto',
                fieldlabelDepartal: ['anio', 'modo_entrega', 'genero_beneficiario'], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueDepartal: 'total_area_ha', // estees el valor que tomara generar las cantidades para cada label
                leyendaDepartal: ['Cantida de área por anio', 'Cantida de área por modo de entrega', 'Cantida de área por genero del beneficiario'],
                url: 'v_predios_campesinos_orip_mun', // trae info a nivel municipal
                fieldlabel: ['anio', 'modo_entrega', 'genero_beneficiario'], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValue: 'total_area_ha', // estees el valor que tomara generar las cantidades para cada label
                leyenda: ['Área por año', 'Modo entrega de Área', 'Genero beneficiario del área'], // las leyendas para cada label
                quintiles: [
                  ['<=', 20],
                  [20, 60],
                  [60, 150],
                  [150, 300],
                  [300, '=>']
                ]
              },
              {
                value: 3,
                label: '1.5.3 Predios entregados a campesinos a través de procesos de adjudicación con registro de ORIP',
                descripcion: 'Cantidad de predios adjudicados',
                urlNal: 'v_predios_campesinos_adj_nacmun',
                urlNalDataAlfanumerica: 'v_predios_campesinos_adj_nacmun',
                fieldlabelNal: ['mpnombre'],
                fieldValueNal: 'cantidad_predios',
                leyendaNal: ['Predios adjudicados'],
                urlDepartal: 'v_predios_campesinos_adj_depto',
                fieldlabelDepartal: ['anio', 'genero_beneficiario'],
                fieldValueDepartal: 'cantidad_predios',
                leyendaDepartal: ['Predios por año', 'Predios por género beneficiarios'],
                url: 'v_predios_campesinos_adj_mun',
                fieldlabel: ['cat_anio_adjudicacion', 'genero_beneficiario'],
                fieldValue: 'cantidad_predios',
                leyenda: ['Predios adjudicados por año', 'Predios adjudicados por tipo de género'], // las leyendas para cada label
                quintiles: [
                  ['<=', 5],
                  [5, 10],
                  [10, 30],
                  [30, 50],
                  [50, '=>']
                ]
              },
              {
                value: 4,
                label: '1.5.4 Área de predios entregados a campesinos a través de procesos de adjudicación con registro de ORIP',
                descripcion: 'Cantidad de área de predios adjudicados',
                urlNal: 'v_predios_campesinos_adj_nacmun',
                urlNalDataAlfanumerica: 'v_predios_campesinos_adj_nacmun',
                fieldlabelNal: ['mpnombre'],
                fieldValueNal: 'total_area_ha',
                leyendaNal: ['Área adjudicada', 'Beneficiarios', 'Género beneficiarios'],
                urlDepartal: 'v_predios_campesinos_adj_depto',
                fieldlabelDepartal: ['anio', 'genero_beneficiario'],
                fieldValueDepartal: 'total_area_ha',
                leyendaDepartal: ['Predios por año', 'Predios por género beneficiarios'],
                url: 'v_predios_campesinos_adj_mun',
                fieldlabel: ['cat_anio_adjudicacion', 'genero_beneficiario'],
                fieldValue: 'total_area_ha',
                leyenda: ['Área adjudicada por año', 'Área adjudicada por tipo de género'], // las leyendas para cada label
                quintiles: [
                  ['<=', 20],
                  [20, 60],
                  [60, 150],
                  [150, 300],
                  [300, '=>']
                ]
              },
              {
                value: 5,
                label: '1.5.5 Predios entregados a través subsidios integrales para la compra de tierras',
                descripcion: 'Cantidad de predios beneficiarios de subsidios integrales para la compra de tierras',
                urlNal: 'v_predios_sub_integrales_nacmun',
                urlNalDataAlfanumerica: 'v_predios_sub_integrales_sumnac',
                fieldlabelNal: ['mpnombre '],
                fieldValueNal: 'cantidad_predios',
                leyendaNal: ['Cantidad de predios'],
                urlDepartal: 'v_predios_sub_integrales_dpto',
                fieldlabelDepartal: ['cat_anio_adjudicacion', 'tipo_beneficiario', 'genero_beneficiario'],
                fieldValueDepartal: 'cantidad_predios',
                leyendaDepartal: ['Predios beneficiarios de SIT', 'Beneficiarios', 'Género beneficiarios'],
                url: 'v_predios_sub_integrales_mun',
                fieldlabel: ['tipo_beneficiario', 'genero_beneficiario'],
                fieldValue: 'cantidad_predios',
                leyenda: ['Predios por beneficiario ', 'Predios por tipo de género'], // las leyendas para cada label
                quintiles: [
                  ['<=', 1],
                  [1, 5],
                  [5, 10],
                  [10, 20],
                  [20, '=>']
                ]
              },
              {
                value: 6,
                label: '1.5.6 Área de predios entregados através de subsidios integrales para la compra de tierras',
                descripcion: 'Cantidad de área de predios beneficiarios de subsidios integrales para la compra de tierras',
                urlNal: 'v_predios_sub_integrales_nacmun',
                urlNalDataAlfanumerica: 'v_predios_sub_integrales_sumnac',
                fieldlabelNal: ['mpnombre '],
                fieldValueNal: 'total_area_ha',
                leyendaNal: ['Área total'],
                urlDepartal: 'v_predios_sub_integrales_dpto',
                fieldlabelDepartal: ['cat_anio_adjudicacion', 'tipo_beneficiario', 'genero_beneficiario'],
                fieldValueDepartal: 'total_area_ha',
                leyendaDepartal: ['Área beneficiaria SIT', 'Beneficiarios', 'Género beneficiarios'],
                url: 'v_predios_sub_integrales_mun',
                fieldlabel: ['tipo_beneficiario', 'genero_beneficiario'],
                fieldValue: 'total_area_ha',
                leyenda: ['Área por beneficiario ', 'Área por tipo de género'], // las leyendas para cada label
                quintiles: [
                  ['<=', 20],
                  [20, 50],
                  [50, 100],
                  [100, 200],
                  [200, '=>']
                ]
              }
            ]
          }
        ]
      },
      {
        value: 3,
        label: '1.6 Formalización de la propiedad ',
        descripcion: '',
        CATEGORIA_TEMATICA: [
          {
            value: 0,
            label: '',
            descripcion: '',
            INDICADOR: [
              {
                value: 1,
                label: '1.6.1 Predios titulados a campesinos y registrados en ORIP',
                descripcion: 'Cantidad de predios formalizados',
                urlNal: 'v_predios_campesinos_tit_nacmun',
                urlNalDataAlfanumerica: 'v_predios_campesinos_tit_nacmun',
                fieldlabelNal: ['mpnombre'],
                fieldValueNal: 'cantidad_predios',
                leyendaNal: ['Cantidad de predios'],
                urlDepartal: 'v_predios_campesinos_tit_depto',
                fieldlabelDepartal: ['anio', 'proceso', 'genero_beneficiario'],
                fieldValueDepartal: 'cantidad_predios',
                leyendaDepartal: ['Predios por año', 'Predios por proceso', 'Predios por género'],
                url: 'v_predios_campesinos_tit_mun',
                fieldlabel: ['anio', 'proceso', 'genero_beneficiario'],
                fieldValue: 'cantidad_predios',
                leyenda: ['Predios por año', 'Predios por proceso', 'Predios geenero beneficiario'], // las leyendas para cada label
                quintiles: [
                  ['<=', 30],
                  [30, 120],
                  [120, 300],
                  [300, 600],
                  [600, '=>']
                ]
              },
              {
                value: 2,
                label: '1.6.2 Área de predios titulados  a campesinos y registrados en ORIP',
                descripcion: 'Cantidad de área de predios formalizados',
                urlNal: 'v_predios_campesinos_tit_nacmun',
                urlNalDataAlfanumerica: 'v_predios_campesinos_tit_nacmun',
                fieldlabelNal: ['mpnombre'],
                fieldValueNal: 'total_area_ha',
                leyendaNal: ['Total área en ha'],
                urlDepartal: 'v_predios_campesinos_tit_depto',
                fieldlabelDepartal: ['anio', 'proceso', 'genero_beneficiario'],
                fieldValueDepartal: 'total_area_ha',
                leyendaDepartal: ['Área por año', 'Área por proceso', 'Área por género'],
                url: 'v_predios_campesinos_tit_mun',
                fieldlabel: ['anio', 'proceso', 'genero_beneficiario'],
                fieldValue: 'total_area_ha',
                leyenda: ['Área por año', 'Área por proceso', 'Área geenero beneficiario'], // las leyendas para cada label
                quintiles: [
                  ['<=', 50],
                  [50, 200],
                  [200, 400],
                  [400, 900],
                  [900, '=>']
                ]
              },
              {
                value: 3,
                label: '1.6.3 Predios titulados a mujeres y registrados en ORIP',
                descripcion: 'Cantidad de predios formalizados a mujeres',
                urlNal: 'v_predios_titulados_muj_nacmun',
                urlNalDataAlfanumerica: 'v_predios_titulados_muj_nacmun',
                fieldlabelNal: ['mpnombre'],
                fieldValueNal: 'cantidad_predios',
                leyendaNal: ['Cantidad de predios'],
                urlDepartal: 'v_predios_titulados_muj_depto',
                fieldlabelDepartal: ['anio', 'proceso'],
                fieldValueDepartal: 'cantidad_predios',
                leyendaDepartal: ['Predios por año', 'Predios por proceso'],
                url: 'v_predios_titulados_muj_mun',
                fieldlabel: ['anio', 'proceso'],
                fieldValue: 'cantidad_predios',
                leyenda: ['Predios por año', 'Predios por proceso'], // las leyendas para cada label
                quintiles: [
                  ['<=', 30],
                  [30, 120],
                  [120, 300],
                  [300, 600],
                  [600, '=>']
                ]
              },
              {
                value: 4,
                label: '1.6.4 Área de predios titulados a mujeres y registrados en ORIP',
                descripcion: 'Cantidad de área de predios formalizados a mujeres',
                urlNal: 'v_predios_titulados_muj_nacmun',
                urlNalDataAlfanumerica: 'v_predios_titulados_muj_nacmun',
                fieldlabelNal: ['mpnombre'],
                fieldValueNal: 'total_area_ha',
                leyendaNal: ['Total área en ha'],
                urlDepartal: 'v_predios_titulados_muj_depto',
                fieldlabelDepartal: ['anio', 'proceso'],
                fieldValueDepartal: 'total_area_ha',
                leyendaDepartal: ['Predios por año', 'Predios por proceso'],
                url: 'v_predios_titulados_muj_mun',
                fieldlabel: ['anio', 'proceso'],
                fieldValue: 'total_area_ha',
                leyenda: ['Área por año', 'Área por proceso'], // las leyendas para cada label
                quintiles: [
                  ['<=', 50],
                  [50, 200],
                  [200, 400],
                  [400, 900],
                  [900, '=>']
                ]
              }
            ]
          }
        ]
      },
      {
        value: 4,
        label: '1.7 Catastro multipropósito',
        descripcion: '',
        CATEGORIA_TEMATICA: [
          {
            value: 0,
            label: '',
            descripcion: '',
            INDICADOR: [
              {
                value: 1,
                label: '1.7.1 Porcentaje de predios rurales actualizados',
                descripcion: '',
                urlNal: '', //para data coropletica a nivel municipal
                urlNalDataAlfanumerica: '', //para data alfanumerica a nivel nacional
                fieldlabelNal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueNal: '', // estees el valor que tomara generar las cantidades para cada label
                leyendaNal: [], // las leyendas para cada label
                urlDepartal: '',
                fieldlabelDepartal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueDepartal: '', // estees el valor que tomara generar las cantidades para cada label
                leyendaDepartal: [],
                url: '', // trae info a nivel municipal
                fieldlabel: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValue: '', // estees el valor que tomara generar las cantidades para cada label
                leyenda: [], // las leyendas para cada label
                quintiles: [
                  'porDefinir'
                ]
              },
              {
                value: 2,
                label: '1.7.2 Porcentaje de área de predios rurales actualizados',
                descripcion: '',
                urlNal: '', //para data coropletica a nivel municipal
                urlNalDataAlfanumerica: '', //para data alfanumerica a nivel nacional
                fieldlabelNal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueNal: '', // estees el valor que tomara generar las cantidades para cada label
                leyendaNal: [], // las leyendas para cada label
                urlDepartal: '',
                fieldlabelDepartal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueDepartal: '', // estees el valor que tomara generar las cantidades para cada label
                leyendaDepartal: [],
                url: '', // trae info a nivel municipal
                fieldlabel: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValue: '', // estees el valor que tomara generar las cantidades para cada label
                leyenda: [], // las leyendas para cada label
                quintiles: [
                  'porDefinir'
                ]
              },
              {
                value: 3,
                label: '1.7.3 Cantidad de municipios actualizados en cada vigencia',
                descripcion: '',
                urlNal: '', //para data coropletica a nivel municipal
                urlNalDataAlfanumerica: '', //para data alfanumerica a nivel nacional
                fieldlabelNal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueNal: '', // estees el valor que tomara generar las cantidades para cada label
                leyendaNal: [], // las leyendas para cada label
                urlDepartal: '',
                fieldlabelDepartal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueDepartal: '', // estees el valor que tomara generar las cantidades para cada label
                leyendaDepartal: [],
                url: '', // trae info a nivel municipal
                fieldlabel: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValue: '', // estees el valor que tomara generar las cantidades para cada label
                leyenda: [], // las leyendas para cada label
                quintiles: [
                  'porDefinir'
                ]
              },
              {
                value: 4,
                label: '1.7.4 Número de municipios formados en cada vigencia',
                descripcion: '',
                urlNal: '', //para data coropletica a nivel municipal
                urlNalDataAlfanumerica: '', //para data alfanumerica a nivel nacional
                fieldlabelNal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueNal: '', // estees el valor que tomara generar las cantidades para cada label
                leyendaNal: [], // las leyendas para cada label
                urlDepartal: '',
                fieldlabelDepartal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueDepartal: '', // estees el valor que tomara generar las cantidades para cada label
                leyendaDepartal: [],
                url: '', // trae info a nivel municipal
                fieldlabel: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValue: '', // estees el valor que tomara generar las cantidades para cada label
                leyenda: [], // las leyendas para cada label
                quintiles: [
                  'porDefinir'
                ]
              }
            ]
          }
        ]
      },
      {
        value: 5,
        label: '1.8 Gestión de procesos de restitución de tierras',
        descripcion: '',
        CATEGORIA_TEMATICA: [
          {
            value: 0,
            label: '',
            descripcion: '',
            INDICADOR: [
              {
                value: 1,
                label: '1.8.1 Predios asociados a solicitudes de inscripción al Registro de Tierras Despojadas y Abandonadas Forzosamente',
                descripcion: 'Cantidad de predios asociados a solicitudes de inscripción al Registro de Tierras Despojadas y Abandonadas Forzosamente',
                urlNal: 'v_predios_restierras_nacmun',
                urlNalDataAlfanumerica: 'v_predios_restierras_nacmun',
                fieldlabelNal: ['mpnombre'],
                fieldValueNal: 'cantidad_predios',
                leyendaNal: ['Cantidad de predios'],
                urlDepartal: 'v_predios_restierras_depto',
                fieldlabelDepartal: ['pdet', 'nucleo_reforma'],
                fieldValueDepartal: 'cantidad_predios',
                leyendaDepartal: ['Predios RTDAF por PDET', 'Predios RTDAF por nucleo'],
                url: 'v_predios_restierras_mun',
                fieldlabel: ['pdet', 'nucleo_reforma'],
                fieldValue: 'cantidad_predios',
                leyenda: ['Cantidad de predios por PDET', 'Cantidad de predios por reforma'], // las leyendas para cada label
                quintiles: [
                  ['<=', 30],
                  [30, 150],
                  [150, 400],
                  [400, 750],
                  [750, '=>']
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    value: 2,
    label: '2. De delimitación, constitución y consolidación de zonas de reserva campesina, delimitación, uso y manejo de playones y sabanas comunales y de organización y capacitación campesina',
    descripcion: 'De delimitación, constitución y consolidación de zonas de reserva campesina, delimitación, uso y manejo de playones y sabanas comunales y de organización y capacitación campesina',
    APUESTA_ESTRATEGICA: [
      {
        value: 1,
        label: '2.2 Delimitar, consolidar y constituir las zonas de reserva campesina como territorialidad cuyo ordenamiento territorial se presta para frenar la expansión de la frontera agrícola, servir para la conservación ambiental y potenciar la producción de alimentos',
        descripcion: '',
        CATEGORIA_TEMATICA: [
          {
            value: 0,
            label: '',
            descripcion: '',
            INDICADOR: [
              {
                value: 1,
                label: '2.2.1 Porcentaje de predios en Zonas de Reserva Campesina',
                descripcion: 'Porcentaje de predios en Zonas de Reserva Campesina',
                urlNal: 'v_predios_zrc_nacmun',
                urlNalDataAlfanumerica: 'v_predios_zrc_porcnac',
                fieldlabelNal: ['anio_declaracion'],
                fieldValueNal: 'porcentaje_predios',
                leyendaNal: ['Predios ZRC por año'],
                urlDepartal: 'v_predios_zrc_depto',
                fieldlabelDepartal: ['anio'],
                fieldValueDepartal: 'porcentaje_predios',
                leyendaDepartal: ['Predios ZRC por año'],
                url: 'v_predios_zrc_mun',
                fieldlabel: ['anio'],
                fieldValue: 'porcentaje_predios',
                leyenda: ['Porcentaje de predios por año'], // las leyendas para cada label
                quintiles: [
                  'porDefinir'
                ]
              },
              {
                value: 2,
                label: '2.2.2 Porcentaje de área de predios en Zonas de Reserva Campesina',
                descripcion: 'Porcentaje de área de predios en Zonas de Reserva Campesina',
                urlNal: 'v_predios_zrc_nacmun',
                urlNalDataAlfanumerica: 'v_predios_zrc_porcnac',
                fieldlabelNal: ['anio_declaracion'],
                fieldValueNal: 'porcentaje_area',
                leyendaNal: ['Predios ZRC por año'],
                urlDepartal: 'v_predios_zrc_depto',
                fieldlabelDepartal: ['anio'],
                fieldValueDepartal: 'porcentaje_area',
                leyendaDepartal: ['Predios ZRC por año'],
                url: 'v_predios_zrc_mun',
                fieldlabel: ['anio'],
                fieldValue: 'porcentaje_area',
                leyenda: ['Porcentaje de área por año'], // las leyendas para cada label
                quintiles: [
                  'porDefinir'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    value: 3,
    label: '3. De ordenamiento territorial y solución de conﬂictos socioambientales para la reforma agraria',
    descripcion: 'De ordenamiento territorial y solución de conﬂictos socioambientales para la reforma agraria',
    APUESTA_ESTRATEGICA: [
      {
        value: 0,
        label: '3.1 Gestión de conflictos relacionados con el acceso a los recursos naturales,  el uso, la ocupación y tenencia de la tierra; que se presenten al interior de  las áreas del SINAP, otras estrategias de conservación In situ, ecosistemas estratégicos, y sus áreas con función amortiguadora.',
        descripcion: 'Gestión de conflictos relacionados con el acceso a los recursos naturales,  el uso, la ocupación y tenencia de la tierra; que se presenten al interior de  las áreas del SINAP, otras estrategias de conservación In situ, ecosistemas estratégicos, y sus áreas con función amortiguadora.',
        CATEGORIA_TEMATICA: [
          {
            value: 0,
            label: 'Distribución de la tierra',
            descripcion: 'Distribución de la tierra',
            INDICADOR: [
              {
                value: 1,
                label: '3.1.1 Índice de Gini de la propiedad',
                descripcion: 'Índice de Gini de la propiedad',
                urlNal: 'v_indice_gini_ids_nac_tot',
                urlNalDataAlfanumerica: 'v_indice_gini_ids_nac_tot',
                fieldlabelNal: ['anio_vigencia'],
                fieldValueNal: 'gini',
                leyendaNal: ['Indice Gini por año'],
                urlDepartal: 'v_indice_gini_ids_depto',
                fieldlabelDepartal: ['destino', 'anio_vigencia', 'categoria_gini', 'categoria_ids'],
                fieldValueDepartal: 'gini',
                leyendaDepartal: ['Índice de Gini por destino', 'Índice de Gini por año', 'Índice de Gini por categoría Gini', 'Índice de Gini por categoría IDS'],
                url: 'v_indice_gini_ids_mun',
                fieldlabel: ['anio_vigencia', 'destino'/* , 'categoria_gini', 'categoria_ids' */],
                fieldValue: 'gini',
                leyenda: ['Indice Gini por año', 'Indice Gini por destino'/* , 'Indice Gini por categoria', 'Indice Gini por ids' */], // las leyendas para cada label
                quintiles: [
                  ['<=', 0.3],
                  [0.3, 0.6],
                  [0.6, 0.8],
                  [0.8, '=>']
                ]
              },
              {
                value: 2,
                label: '3.1.2 Índice de Disparidad Superior - IDS',
                descripcion: 'Índice de Disparidad Superior - IDS',
                urlNal: 'v_indice_gini_ids_nac_tot',
                urlNalDataAlfanumerica: 'v_indice_gini_ids_nac_tot',
                fieldlabelNal: ['anio_vigencia'],
                fieldValueNal: 'disparidad_superior',
                leyendaNal: ['Disparidad Superior por año'],
                urlDepartal: 'v_indice_gini_ids_depto',
                fieldlabelDepartal: ['destino', 'anio_vigencia', 'categoria_gini', 'categoria_ids'],
                fieldValueDepartal: 'disparidad_superior',
                leyendaDepartal: ['Índice de Disparidad por destino', 'Índice de Disparidad por año', 'Índice de Disparidad por categoría Gini', 'Índice de Disparidad por categoría IDS'],
                url: 'v_indice_gini_ids_mun',
                fieldlabel: ['anio_vigencia', 'destino'/* , 'categoria_gini', 'categoria_ids' */],
                fieldValue: 'disparidad_superior',
                leyenda: ['Indice de Disparidad por año', 'Indice de Disparidad por destino'/* , 'Indice de Disparidad por categoria', 'Indice de Disparidad por ids' */], // las leyendas para cada label
                quintiles: [
                  ['<=', 2.7],
                  [2.7, 5.2],
                  [5.2, 7.2],
                  [7.2, '=>']
                ]
              },
              {
                value: 3,
                label: '3.1.3 Porcentaje de predios con área por debajo de la UAF mínima municipal',
                descripcion: 'Porcentaje de predios con área por encima de la UAF mínima municipal',
                urlNal: 'v_predios_uaf_nacmun',
                urlNalDataAlfanumerica: 'v_predios_uaf_nacmun',
                fieldlabelNal: ['anio'],
                fieldValueNal: 'porcentaje_predios',
                leyendaNal: ['Porcetanje predios UAF'],
                urlDepartal: 'v_predios_uaf_depto',
                fieldlabelDepartal: ['anio'],
                fieldValueDepartal: 'porcentaje_predios',
                leyendaDepartal: ['Porcetanje predios UAF'],
                url: 'v_predios_uaf_mun',
                fieldlabel: ['anio'],
                fieldValue: 'porcentaje_predios',
                leyenda: ['Porcentaje de predios'], // las leyendas para cada label
                quintiles: [
                  ['<=', 0],
                  [0, 60],
                  [60, 80],
                  [80, 90],
                  [90, '=>']
                ]
              },
              {
                value: 4,
                label: '3.1.4 Porcentaje de área de predios por debajo de la UAF mínima municipal',
                descripcion: 'Porcentaje de área de predios por encima de la UAF mínima municipal',
                urlNal: 'v_predios_uaf_nacmun',
                urlNalDataAlfanumerica: 'v_predios_uaf_nacmun',
                fieldlabelNal: ['anio'],
                fieldValueNal: 'porcentaje_area',
                leyendaNal: ['Porcetanje área UAF'],
                urlDepartal: 'v_predios_uaf_depto',
                fieldlabelDepartal: ['anio'],
                fieldValueDepartal: 'porcentaje_area',
                leyendaDepartal: ['Porcetanje área UAF'],
                url: 'v_predios_uaf_mun',
                fieldlabel: ['anio'],
                fieldValue: 'porcentaje_area',
                leyenda: ['Porcentaje de área'], // las leyendas para cada label
                quintiles: [
                  ['<=', 0],
                  [0, 10],
                  [10, 25],
                  [25, 50],
                  [50, '=>']
                ]
              }
            ]
          },
          {
            value: 1,
            label: 'Conflictos de uso',
            descripcion: 'Conflictos de uso',
            INDICADOR: [
              {
                value: 1,
                label: '3.1.5 Porcentaje de predios con presunta subutilización en el uso del suelo',
                descripcion: 'Porcentaje de predios con presunta subutilización en el uso del suelo',
                urlNal: 'v_predios_conflicto_nacmun',
                urlNalDataAlfanumerica: 'v_predios_conflicto_nacmun',
                fieldlabelNal: ['categoria_conflicto_uso ', 'total_predios_mun', 'total_area_ha'],
                fieldValueNal: 'porcentaje_predios',
                leyendaNal: ['Porcentaje predios por categoria', 'Porcentaje total predios', 'Porcentaje total área'],
                urlDepartal: 'v_predios_conflicto_depto',
                fieldlabelDepartal: ['categoria_conflicto_uso', 'total_predios_mun', 'total_area_ha'],
                fieldValueDepartal: 'porcentaje_predios',
                leyendaDepartal: ['Porcentaje predios por categoria', 'Porcentaje total predios', 'Porcentaje total área'],
                url: 'v_predios_conflicto_mun',
                fieldlabel: ['categoria_conflicto_uso', 'total_predios_mun'],
                fieldValue: 'porcentaje_predios',
                leyenda: ['Porcentaje de predios por categoria', 'Total predios por municipio'], // las leyendas para cada label
                quintiles: [
                  ['<=', 0],
                  [0, 1],
                  [1, 5],
                  [5, 15],
                  [15, '=>']
                ]
              },
              {
                value: 2,
                label: '3.1.6 Porcentaje de predios en Territorios con ley 2da',
                descripcion: 'Porcentaje de predios en Territorios con ley 2da',
                urlNal: 'v_predios_ley2da_nacmun',
                urlNalDataAlfanumerica: 'v_predios_ley2da_nacmun',
                fieldlabelNal: ['anio'],
                fieldValueNal: 'porcentaje_predios',
                leyendaNal: ['Porcentaje de predios en Territorios con ley 2da'],
                urlDepartal: 'v_predios_ley2da_depto',
                fieldlabelDepartal: ['anio'],
                fieldValueDepartal: 'porcentaje_predios',
                leyendaDepartal: ['Porcentaje de predios en Territorios con ley 2da'],
                url: 'v_predios_ley2da_mun',
                fieldlabel: ['anio'],
                fieldValue: 'porcentaje_predios',
                leyenda: ['Porcentaje de predios por año'], // las leyendas para cada label
                quintiles: [
                  'porDefinir'
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    value: 4,
    label: `8. De delimitación, constitución y consolidación de territorios indígenas y de territorios colectivos de comunidades negras, afrocolombianas,
            raizales, palenqueras y pueblo Rom, delimitación, uso, manejo y goce de los mismos, y fortalecimiento de la formación desde los saberes propios`,
    descripcion: `De delimitación, constitución y consolidación de territorios indígenas y de territorios colectivos de comunidades negras, afrocolombianas,
            raizales, palenqueras y pueblo Rom, delimitación, uso, manejo y goce de los mismos, y fortalecimiento de la formación desde los saberes propios`,
    APUESTA_ESTRATEGICA: [
      {
        value: 0,
        label: '8.1 Consolidar la seguridad jurídica de los territorios étnicos a partir de procedimientos de delimitación, constitución, ampliación, titulación colectiva, saneamiento y/o de restitución, según proceda, respetando los principios de autonomía y gobierno propio.',
        descripcion: '',
        CATEGORIA_TEMATICA: [
          {
            value: 0,
            label: '',
            descripcion: '',
            INDICADOR: [
              {
                value: 1,
                label: '8.1.1 Porcentaje de predios titulados y registrados en ORIP a grupos étnicos',
                descripcion: 'Porcentaje de predios en territorios títulados a grupos étnicos',
                urlNal: 'v_predios_etnicos_por_nacmun',
                urlNalDataAlfanumerica: 'v_predios_etnicos_por_nacmun',
                fieldlabelNal: ['anio'],
                fieldValueNal: 'porcentaje_predios',
                leyendaNal: ['Predios por año'],
                urlDepartal: 'v_predios_etnicos_por_depto',
                fieldlabelDepartal: ['anio'],
                fieldValueDepartal: 'porcentaje_predios',
                leyendaDepartal: ['porcentaje de predios por año'],
                url: 'v_predios_etnicos_por_mun',
                fieldlabel: ['anio'],
                fieldValue: 'porcentaje_predios',
                leyenda: ['Porcentaje predios títulados por año'], // las leyendas para cada label
                quintiles: [
                  'porDefinir'
                ]
              },
              {
                value: 2,
                label: '8.1.2 Porcentaje de área de predios titulados y registrados en ORIP a grupos étnicos',
                descripcion: 'Porcentaje de área de predios en territorios títulados a grupos étnicos',
                urlNal: 'v_predios_etnicos_por_nacmun',
                urlNalDataAlfanumerica: 'v_predios_etnicos_por_nacmun',
                fieldlabelNal: ['anio'],
                fieldValueNal: 'porcentaje_area',
                leyendaNal: ['Área por año'],
                urlDepartal: 'v_predios_etnicos_por_depto',
                fieldlabelDepartal: ['anio'],
                fieldValueDepartal: 'porcentaje_area',
                leyendaDepartal: ['Porcentaje de área por año'],
                url: 'v_predios_etnicos_por_mun',
                fieldlabel: ['anio'],
                fieldValue: 'porcentaje_area',
                leyenda: ['Porcentaje área títulados por año'], // las leyendas para cada label
                quintiles: [
                  'porDefinir'
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]
