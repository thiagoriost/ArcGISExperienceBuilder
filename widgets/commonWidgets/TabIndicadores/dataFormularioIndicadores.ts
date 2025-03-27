export const dataFuenteIndicadores = [
  {
    value: 1,
    label: '1. De adquisición, adjudicación de tierras y de procesos agrarios para la reforma agraria',
    descripcion: 'De adquisición, adjudicación de tierras y de procesos agrarios para la reforma agraria, y garantía de derechos territoriales de los campesinos, pueblos indígenas y de las comunidades negras, afrocolombianas, raizales, palenqueras y pueblo Rom',
    APUESTA_ESTRATEGICA: [ // o LINEA ESTRATEGICA
      /* {
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
                fieldlabel: ['tipo_predio', 'anio'], // data a nivel municipal
                urlNal: '', // data a nivel nacional
                fieldValueDepartal: '', antidad_predio // data a nivel depatamentals',
                urlNalDataAlfanumerica: '', // para alguna data adicional alfanuemrica
                leyendaNal: ['Cantidad de Área por año (ha)', 'Tipos de predios'], // labels a nivel municipal
                fieldlabelNal: ['anio', 'tipo_predio'], // labels a nivel nacional
                fieldValueNal: 'total_area_ha', // labels a nivel departamental
                leyenda: ['Cantidad de área por tipo', 'Cantidad de Área por año (ha)'], // las leyendas para cada label // leyenda a nivel dapartamental
                fieldlabelDepartal: ['anio', 'tipo_predio'], // leyenda a nivel nacional
                url: '',
                fieldValue: 'total_area_ha',
                urlDepartal: 'v_predios_fondo_tierras_dpto',
                leyendaDepartal: ['Cantidad de Área por año (ha)', 'Tipos de predios'],
                quintiles: [
                  'porDefinir'
                ]
              },
              {
                value: 1,
                // label: '1.1.2 Área dispuesta en el Fondo de Tierras para la Reforma Agraria',
                label: '1.3.2 Área ingresada al Fondo de Tierras',
                descripcion: 'Cantidad de área ingresada en el Fondo de Tierras para la Reforma Agraria',
                fieldlabel: ['tipo_predio', 'anio'], // data a nivel municipal
                urlNal: '', // data a nivel nacional
                fieldValueDepartal: 'cantidad_predio // data a nivel depatamentals',
                urlNalDataAlfanumerica: 'v_predios_fondo_tierras_sumnac', // para alguna data adicional alfanuemrica
                leyendaNal: ['Cantidad de Área por año (ha)', 'Tipos de predios'], // labels a nivel municipal
                fieldlabelNal: ['anio', 'tipo_predio'], // labels a nivel nacional
                fieldValueNal: 'total_area_ha', // labels a nivel departamental
                leyenda: ['Cantidad de área por tipo', 'Cantidad de Área por año (ha)'], // las leyendas para cada label // leyenda a nivel dapartamental
                fieldlabelDepartal: ['anio', 'tipo_predio'], // leyenda a nivel nacional
                url: 'v_predios_fondo_tierras_mun',
                fieldValue: 'total_area_ha',
                urlDepartal: 'v_predios_fondo_tierras_dpto',
                leyendaDepartal: ['Cantidad de Área por año (ha)', 'Tipos de predios'],
                quintiles: [
                  'porDefinir'
                ]
              },
              {
                value: 2,
                label: '1.3.3 Predios ingresados al Fondo de Tierras mediante compra directa de tierras',
                descripcion: '',
                fieldlabel: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // data a nivel municipal
                urlNal: '', //para data coropletica a nivel municipal // data a nivel nacional
                fieldValueDepartal: '', // estees el valor que tomara generar las cantidades p // data a nivel depatamentalara cada label
                urlNalDataAlfanumerica: '', //para data alfanumerica a nivel nacional // para alguna data adicional alfanuemrica
                leyendaNal: [], // las leyendas para cada label // labels a nivel municipal
                fieldlabelNal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // labels a nivel nacional
                fieldValueNal: '', // estees el valor que tomara generar las cantidades para cada label // labels a nivel departamental
                leyenda: [], // las leyendas para cada label // leyenda a nivel dapartamental
                fieldlabelDepartal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // leyenda a nivel nacional
                url: '', // trae info a nivel municipal
                fieldValue: '', // estees el valor que tomara generar las cantidades para cada label
                urlDepartal: '',
                leyendaDepartal: [],
                quintiles: [
                  'porDefinir'
                ]
              },
              {
                value: 3,
                label: '1.3.4 Área ingresada al Fondo de Tierras mediante compra directa de tierras',
                descripcion: '',
                fieldlabel: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // data a nivel municipal
                urlNal: '', //para data coropletica a nivel municipal // data a nivel nacional
                fieldValueDepartal: '', // estees el valor que tomara generar las cantidades p // data a nivel depatamentalara cada label
                urlNalDataAlfanumerica: '', //para data alfanumerica a nivel nacional // para alguna data adicional alfanuemrica
                leyendaNal: [], // las leyendas para cada label // labels a nivel municipal
                fieldlabelNal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // labels a nivel nacional
                fieldValueNal: '', // estees el valor que tomara generar las cantidades para cada label // labels a nivel departamental
                leyenda: [], // las leyendas para cada label // leyenda a nivel dapartamental
                fieldlabelDepartal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // leyenda a nivel nacional
                url: '', // trae info a nivel municipal
                fieldValue: '', // estees el valor que tomara generar las cantidades para cada label
                urlDepartal: '',
                leyendaDepartal: [],
                quintiles: [
                  'porDefinir'
                ]
              }
            ]
          }
        ]
      }, */
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
                url: 'v_predios_campesinos_orip_mun', // trae info a nivel municipal
                urlNal: 'v_predios_campesinos_orip_mun', //para data coropletica a nivel municipal // data a nivel nacional
                urlDepartal: 'v_predios_campesinos_orip_mun', // data a nivel depatamental
                urlNalDataAlfanumerica: '', //para data alfanumerica a nivel nacional // para alguna data adicional alfanuemrica
                fieldlabel: ['anio', 'modo_entrega', 'genero_beneficiario'], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // leyenda a nivel dapartamental
                fieldlabelNal: ['anio', 'modo_entrega', 'genero_beneficiario'], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // labels a nivel departamental
                fieldlabelDepartal: ['anio', 'modo_entrega', 'genero_beneficiario'], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                leyenda: ['Predios por año', 'Modo entrega de predios', 'Genero beneficiario del predio'], // las leyendas para cada label
                leyendaNal: ['Predios por año', 'Modo entrega de predios', 'Genero beneficiario del predio'], // las leyendas para cada label // leyenda a nivel nacional
                leyendaDepartal: ['Predios por año', 'Modo entrega de predios', 'Genero beneficiario del predio'], // data a nivel municipal
                fieldValue: 'cantidad_predios', // estees el valor que tomara generar las cantidades para cada label
                fieldValueNal: 'cantidad_predios', // estees el valor que tomara generar las cantidades para cada label // labels a nivel municipal
                fieldValueDepartal: 'cantidad_predios', // estees el valor que tomara generar las cantidades para cada label
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
                descripcion: 'Área de predios entregados a campesinos con registro en ORIP (ha)',
                url: 'v_predios_campesinos_orip_mun', // trae info a nivel municipal
                urlNal: 'v_predios_campesinos_orip_mun', //para data coropletica a nivel municipal // data a nivel nacional
                urlDepartal: 'v_predios_campesinos_orip_mun', // data a nivel depatamental
                urlNalDataAlfanumerica: '', //para data alfanumerica a nivel nacional // para alguna data adicional alfanuemrica
                fieldlabel: ['anio', 'modo_entrega', 'genero_beneficiario'], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // leyenda a nivel dapartamental
                fieldlabelNal: ['anio', 'modo_entrega', 'genero_beneficiario'], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // labels a nivel departamental
                fieldlabelDepartal: ['anio', 'modo_entrega', 'genero_beneficiario'], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                leyenda: ['Área por año (ha)', 'Modo entrega de Área (ha)', 'Genero beneficiario del área (ha)'], // las leyendas para cada label
                leyendaNal: ['Área por año (ha)', 'Modo entrega de Área (ha)', 'Genero beneficiario del área (ha)'], // las leyendas para cada label // leyenda a nivel nacional
                leyendaDepartal: ['Área por año (ha)', 'Modo entrega de Área (ha)', 'Genero beneficiario del área (ha)'], // data a nivel municipal
                fieldValue: 'total_area_ha', // estees el valor que tomara generar las cantidades para cada label
                fieldValueNal: 'total_area_ha', // estees el valor que tomara generar las cantidades para cada label // labels a nivel municipal
                fieldValueDepartal: 'total_area_ha', // estees el valor que tomara generar las cantidades para cada label
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
                url: 'v_predios_campesinos_adj_mun',
                urlNal: 'v_predios_campesinos_adj_mun', // data a nivel nacional
                urlDepartal: 'v_predios_campesinos_adj_mun',
                urlNalDataAlfanumerica: '', // para alguna data adicional alfanuemrica
                fieldlabel: ['anio', 'genero_beneficiario'], // data a nivel municipal
                fieldlabelNal: ['anio', 'genero_beneficiario'], // labels a nivel nacional
                fieldlabelDepartal: ['anio', 'genero_beneficiario'], // leyenda a nivel nacional
                leyenda: ['Predios por año', 'Predios por tipo de género'], // las leyendas para cada label // leyenda a nivel dapartamental
                leyendaNal: ['Predios por año', 'Predios por tipo de género'], // labels a nivel municipal
                leyendaDepartal: ['Predios por año', 'Predios por tipo de género'],
                fieldValue: 'cantidad_predios',
                fieldValueNal: 'cantidad_predios', // labels a nivel departamental
                fieldValueDepartal: 'cantidad_predios', // data a nivel depatamental
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
                descripcion: 'Cantidad de área de predios adjudicados (ha)',
                url: 'v_predios_campesinos_adj_mun',
                urlNal: 'v_predios_campesinos_adj_mun', // data a nivel nacional
                urlDepartal: 'v_predios_campesinos_adj_mun',
                urlNalDataAlfanumerica: '', // para alguna data adicional alfanuemrica
                fieldlabel: ['anio', 'genero_beneficiario'], // data a nivel municipal
                fieldlabelNal: ['anio', 'genero_beneficiario'], // labels a nivel nacional
                fieldlabelDepartal: ['anio', 'genero_beneficiario'], // leyenda a nivel nacional
                leyenda: ['Área por año (ha)', 'Área por tipo de género (ha)'], // las leyendas para cada label // leyenda a nivel dapartamental
                leyendaNal: ['Área por año (ha)', 'Área por tipo de género (ha)'], // labels a nivel municipal
                leyendaDepartal: ['Área por año (ha)', 'Área por tipo de género (ha)'],
                fieldValue: 'total_area_ha',
                fieldValueNal: 'total_area_ha', // labels a nivel departamental
                fieldValueDepartal: 'total_area_ha', // data a nivel depatamental
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
                url: 'v_predios_sub_integrales_mun',
                urlNal: 'v_predios_sub_integrales_mun', // data a nivel nacional
                urlDepartal: 'v_predios_sub_integrales_mun',
                urlNalDataAlfanumerica: '', // para alguna data adicional alfanuemrica
                fieldlabel: ['rango_subsidio_compra', 'genero_beneficiario'], // data a nivel municipal
                fieldlabelNal: ['rango_subsidio_compra', 'genero_beneficiario'], // labels a nivel nacional
                fieldlabelDepartal: ['rango_subsidio_compra', 'genero_beneficiario'], // leyenda a nivel nacional
                leyenda: ['Predios por rango de subsidio', 'Predios por beneficiario'], // las leyendas para cada label // leyenda a nivel dapartamental
                leyendaNal: ['Predios por rango de subsidio', 'Predios por beneficiario'], // labels a nivel municipal
                leyendaDepartal: ['Predios por rango de subsidio', 'Predios por beneficiario'],
                fieldValue: 'cantidad_predios',
                fieldValueNal: 'cantidad_predios', // labels a nivel departamental
                fieldValueDepartal: 'cantidad_predios', // data a nivel depatamental
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
                descripcion: 'Cantidad de área de predios beneficiarios de subsidios integrales para la compra de tierras (ha)',
                url: 'v_predios_sub_integrales_mun',
                urlNal: 'v_predios_sub_integrales_mun', // data a nivel nacional
                urlDepartal: 'v_predios_sub_integrales_mun',
                urlNalDataAlfanumerica: '', // para alguna data adicional alfanuemrica
                fieldlabel: ['rango_subsidio_compra', 'genero_beneficiario'], // data a nivel municipal
                fieldlabelNal: ['rango_subsidio_compra', 'genero_beneficiario'], // labels a nivel nacional
                fieldlabelDepartal: ['rango_subsidio_compra', 'genero_beneficiario'], // leyenda a nivel nacional
                leyenda: ['Área por rango de subsidio (ha)', 'Área por beneficiario (ha)'], // las leyendas para cada label // leyenda a nivel dapartamental
                leyendaNal: ['Área por rango de subsidio (ha)', 'Área por beneficiario (ha)'], // labels a nivel municipal
                leyendaDepartal: ['Área por rango de subsidio (ha)', 'Área por beneficiario (ha)'],
                fieldValue: 'total_area_ha',
                fieldValueNal: 'total_area_ha', // labels a nivel departamental
                fieldValueDepartal: 'total_area_ha', // data a nivel depatamental
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
                url: 'v_predios_campesinos_tit_mun',
                urlNal: 'v_predios_campesinos_tit_mun', // data a nivel nacional
                urlDepartal: 'v_predios_campesinos_tit_mun',
                urlNalDataAlfanumerica: '', // para alguna data adicional alfanuemrica
                fieldlabel: ['anio', 'proceso', 'genero_beneficiario'], // data a nivel municipal
                fieldlabelNal: ['anio', 'proceso', 'genero_beneficiario'], // labels a nivel nacional
                fieldlabelDepartal: ['anio', 'proceso', 'genero_beneficiario'], // leyenda a nivel nacional
                leyenda: ['Predios por año', 'Predios por proceso', 'Predios genero beneficiario'], // las leyendas para cada label // leyenda a nivel dapartamental
                leyendaNal: ['Predios por año', 'Predios por proceso', 'Predios genero beneficiario'], // labels a nivel municipal
                leyendaDepartal: ['Predios por año', 'Predios por proceso', 'Predios genero beneficiario'],
                fieldValue: 'cantidad_predios',
                fieldValueNal: 'cantidad_predios', // labels a nivel departamental
                fieldValueDepartal: 'cantidad_predios', // data a nivel depatamental
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
                descripcion: 'Cantidad de área de predios formalizados (ha)',
                url: 'v_predios_campesinos_tit_mun',
                urlNal: 'v_predios_campesinos_tit_mun', // data a nivel nacional
                urlDepartal: 'v_predios_campesinos_tit_mun',
                urlNalDataAlfanumerica: '', // para alguna data adicional alfanuemrica
                fieldlabel: ['anio', 'proceso', 'genero_beneficiario'], // data a nivel municipal
                fieldlabelNal: ['anio', 'proceso', 'genero_beneficiario'], // labels a nivel nacional
                fieldlabelDepartal: ['anio', 'proceso', 'genero_beneficiario'], // leyenda a nivel nacional
                leyenda: ['Área por año (ha)', 'Área por proceso (ha)', 'Área genero beneficiario (ha)'], // las leyendas para cada label // leyenda a nivel dapartamental
                leyendaNal: ['Área por año (ha)', 'Área por proceso (ha)', 'Área genero beneficiario (ha)'], // labels a nivel municipal
                leyendaDepartal: ['Área por año (ha)', 'Área por proceso (ha)', 'Área genero beneficiario (ha)'],
                fieldValue: 'total_area_ha',
                fieldValueNal: 'total_area_ha', // labels a nivel departamental
                fieldValueDepartal: 'total_area_ha', // data a nivel depatamental
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
                url: 'v_predios_titulados_muj_mun',
                urlNal: 'v_predios_titulados_muj_mun', // data a nivel nacional
                urlDepartal: 'v_predios_titulados_muj_mun',
                urlNalDataAlfanumerica: '', // para alguna data adicional alfanuemrica
                fieldlabel: ['anio', 'proceso'], // data a nivel municipal
                fieldlabelNal: ['anio', 'proceso'], // labels a nivel nacional
                fieldlabelDepartal: ['anio', 'proceso'], // leyenda a nivel nacional
                leyenda: ['Predios por año', 'Predios por proceso'], // las leyendas para cada label // leyenda a nivel dapartamental
                leyendaNal: ['Predios por año', 'Predios por proceso'], // labels a nivel municipal
                leyendaDepartal: ['Predios por año', 'Predios por proceso'],
                fieldValue: 'cantidad_predios',
                fieldValueNal: 'cantidad_predios', // labels a nivel departamental
                fieldValueDepartal: 'cantidad_predios', // data a nivel depatamental
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
                descripcion: 'Cantidad de área de predios formalizados a mujeres (ha)',
                url: 'v_predios_titulados_muj_mun',
                urlNal: 'v_predios_titulados_muj_mun', // data a nivel nacional
                urlDepartal: 'v_predios_titulados_muj_mun',
                urlNalDataAlfanumerica: '', // para alguna data adicional alfanuemrica
                fieldlabel: ['anio', 'proceso'], // data a nivel municipal
                fieldlabelNal: ['anio', 'proceso'], // labels a nivel nacional
                fieldlabelDepartal: ['anio', 'proceso'], // leyenda a nivel nacional
                leyenda: ['Área por año (ha)', 'Área por proceso (ha)'], // las leyendas para cada label // leyenda a nivel dapartamental
                leyendaNal: ['Área por año (ha)', 'Área por proceso (ha)'], // labels a nivel municipal
                leyendaDepartal: ['Área por año (ha)', 'Área por proceso (ha)'],
                fieldValue: 'total_area_ha',
                fieldValueNal: 'total_area_ha', // labels a nivel departamental
                fieldValueDepartal: 'total_area_ha', // data a nivel depatamental
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
      /* {
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
                descripcion: 'Porcentaje de predios rurales actualizados',
                url: '', // trae info a nivel municipal
                urlNal: '', //para data coropletica a nivel municipal // data a nivel nacional
                urlDepartal: '',
                urlNalDataAlfanumerica: '', //para data alfanumerica a nivel nacional // para alguna data adicional alfanuemrica
                fieldlabel: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // data a nivel municipal
                fieldlabelNal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // labels a nivel nacional
                fieldlabelDepartal: ['anio_vigencia'], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // leyenda a nivel nacional
                leyenda: [], // las leyendas para cada label // leyenda a nivel dapartamental
                leyendaNal: [], // las leyendas para cada label // labels a nivel municipal
                leyendaDepartal: ['Porcentaje de predios por año'],
                fieldValue: '', // estees el valor que tomara generar las cantidades para cada label
                fieldValueNal: '', // estees el valor que tomara generar las cantidades para cada label // labels a nivel departamental
                fieldValueDepartal: 'porcentaje_predios', // estees el valor que tomara genera // data a nivel depatamentalr las cantidades para cada label
                quintiles: [
                  ['<=', 0],
                  [0, 0.05],
                  [0.05, 0.2],
                  [0.2, 0.5],
                  [0.5, '=>']
                ]
              },
              {
                value: 2,
                label: '1.7.2 Porcentaje de área de predios rurales actualizados',
                descripcion: 'Porcentaje de área de predios rurales actualizados',
                url: '', // trae info a nivel municipal
                urlNal: '', //para data coropletica a nivel municipal // data a nivel nacional
                urlDepartal: '',
                urlNalDataAlfanumerica: '', //para data alfanumerica a nivel nacional // para alguna data adicional alfanuemrica
                fieldlabel: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // data a nivel municipal
                fieldlabelNal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // labels a nivel nacional
                fieldlabelDepartal: ['anio_vigencia'], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // leyenda a nivel nacional
                leyenda: [], // las leyendas para cada label // leyenda a nivel dapartamental
                leyendaNal: [], // las leyendas para cada label // labels a nivel municipal
                leyendaDepartal: ['Año de vigencia'],
                fieldValue: '', // estees el valor que tomara generar las cantidades para cada label
                fieldValueNal: '', // estees el valor que tomara generar las cantidades para cada label // labels a nivel departamental
                fieldValueDepartal: 'porcentaje_area', // estees el valor que tomara generar l // data a nivel depatamentalas cantidades para cada label
                quintiles: [
                  ['<=', 0],
                  [0, 0.05],
                  [0.05, 0.1],
                  [0.1, 0.5],
                  [0.5, '=>']
                ]
              },
              {
                value: 3,
                label: '1.7.3 Cantidad de municipios actualizados en cada vigencia',
                descripcion: 'Cantidad de municipios actualizados en cada vigencia',
                url: '', // trae info a nivel municipal
                urlNal: '', //para data coropletica a nivel municipal // data a nivel nacional
                urlDepartal: '',
                urlNalDataAlfanumerica: '', //para data alfanumerica a nivel nacional // para alguna data adicional alfanuemrica
                fieldlabel: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // data a nivel municipal
                fieldlabelNal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // labels a nivel nacional
                fieldlabelDepartal: ['anio_vigencia', 'estado_actualizacion'], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // leyenda a nivel nacional
                leyenda: [], // las leyendas para cada label // leyenda a nivel dapartamental
                leyendaNal: [], // las leyendas para cada label // labels a nivel municipal
                leyendaDepartal: ['Año vigencia', 'Estado de actualización'],
                fieldValue: '', // estees el valor que tomara generar las cantidades para cada label
                fieldValueNal: '', // estees el valor que tomara generar las cantidades para cada label // labels a nivel departamental
                fieldValueDepartal: 'cantidad_mpios', // estees el valor que tomara generar la // data a nivel depatamentals cantidades para cada label
                quintiles: [
                  ['<=', 0],
                  [0, 1],
                  [1, 5],
                  [5, '=>']
                ]
              },
              {
                value: 4,
                label: '1.7.4 Número de municipios formados en cada vigencia',
                descripcion: 'Número de municipios formados en cada vigencia',
                url: '', // trae info a nivel municipal
                urlNal: '', //para data coropletica a nivel municipal // data a nivel nacional
                urlDepartal: '',
                leyendaDepartal: [],
                urlNalDataAlfanumerica: '', //para data alfanumerica a nivel nacional // para alguna data adicional alfanuemrica
                fieldlabel: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // data a nivel municipal
                fieldlabelNal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // labels a nivel nacional
                fieldlabelDepartal: [], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature // leyenda a nivel nacional
                leyenda: [], // las leyendas para cada label // leyenda a nivel dapartamental
                leyendaNal: [], // las leyendas para cada label // labels a nivel municipal
                quintiles: [
                  'porDefinir'
                ]
              }
            ]
          }
        ]
      }, */
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
                url: 'v_predios_restierras_mun',
                urlNal: 'v_predios_restierras_mun', // data a nivel nacional
                urlDepartal: 'v_predios_restierras_mun',
                urlNalDataAlfanumerica: '', // para alguna data adicional alfanuemrica
                fieldlabel: ['pdet', 'nucleo_reforma'], // data a nivel municipal
                fieldlabelNal: ['pdet', 'nucleo_reforma'], // labels a nivel nacional
                fieldlabelDepartal: ['pdet', 'nucleo_reforma'], // leyenda a nivel nacional
                leyenda: ['Cantidad de predios por PDET', 'Cantidad de predios por reforma'], // las leyendas para cada label // leyenda a nivel dapartamental
                leyendaNal: ['Cantidad de predios por PDET', 'Cantidad de predios por reforma'], // labels a nivel municipal
                leyendaDepartal: ['Cantidad de predios por PDET', 'Cantidad de predios por reforma'],
                fieldValue: 'cantidad_predios',
                fieldValueNal: 'cantidad_predios', // labels a nivel departamental
                fieldValueDepartal: 'cantidad_predios', // data a nivel depatamental
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
  /*  {
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
                url: 'v_predios_zrc_mun',
                urlNal: 'v_predios_zrc_nacmun', // data a nivel nacional
                urlDepartal: 'v_predios_zrc_nacmun',
                urlNalDataAlfanumerica: '', // para alguna data adicional alfanuemrica
                fieldlabel: ['anio'], // data a nivel municipal
                fieldlabelNal: ['anio'], // labels a nivel nacional
                fieldlabelDepartal: ['anio'], // leyenda a nivel nacional
                leyenda: ['Porcentaje de predios por año'], // las leyendas para cada label // leyenda a nivel dapartamental
                leyendaNal: ['Porcentaje de predios por año'], // labels a nivel municipal
                leyendaDepartal: ['Predios ZRC por año'],
                fieldValue: 'porcentaje_predios',
                fieldValueNal: 'porcentaje_predios', // labels a nivel departamental
                fieldValueDepartal: 'porcentaje_predios', // data a nivel depatamental
                quintiles: [
                  'porDefinir'
                ]
              },
              {
                value: 2,
                label: '2.2.2 Porcentaje de área de predios en Zonas de Reserva Campesina',
                descripcion: 'Porcentaje de área de predios en Zonas de Reserva Campesina',
                url: 'v_predios_zrc_mun',
                urlNal: 'v_predios_zrc_nacmun', // data a nivel nacional
                urlDepartal: 'v_predios_zrc_nacmun',
                urlNalDataAlfanumerica: '', // para alguna data adicional alfanuemrica
                fieldlabel: ['anio'], // data a nivel municipal
                fieldlabelNal: ['anio'], // labels a nivel nacional
                fieldlabelDepartal: ['anio'], // leyenda a nivel nacional
                leyenda: ['Porcentaje de área ZRC por año'], // las leyendas para cada label // leyenda a nivel dapartamental
                leyendaNal: ['Porcentaje de Área por año (ha)'], // labels a nivel municipal
                leyendaDepartal: ['Porcentaje área ZRC por año'],
                fieldValue: 'porcentaje_area',
                fieldValueNal: 'porcentaje_area', // labels a nivel departamental
                fieldValueDepartal: 'porcentaje_area', // data a nivel depatamental
                quintiles: [
                  ['<=', 0],
                  [0, 0.1],
                  [0.1, 0.3],
                  [0.3, 0.6],
                  [0.6, '=>']
                ]
              }
            ]
          }
        ]
      }
    ]
  }, */
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
                url: 'v_indice_gini_ids_mun',
                urlNal: 'v_indice_gini_ids_mun', // data a nivel nacional
                urlDepartal: 'v_indice_gini_ids_mun',
                urlNalDataAlfanumerica: '', // para alguna data adicional alfanuemrica
                fieldlabel: ['anio_vigencia'/* , 'destino' *//* , 'categoria_gini', 'categoria_ids' */], // data a nivel municipal
                fieldlabelNal: ['anio_vigencia'/* , 'destino' */], // labels a nivel nacional
                fieldlabelDepartal: ['anio_vigencia'/* , 'destino' */], // leyenda a nivel nacional
                leyenda: ['Indice Gini por año'/* , 'Indice Gini por destino' *//* , 'Indice Gini por categoria', 'Indice Gini por ids' */], // las leyendas para cada label // leyenda a nivel dapartamental
                leyendaNal: ['Indice Gini por año'/* , 'Indice Gini por destino' */], // labels a nivel municipal
                leyendaDepartal: ['Indice Gini por año'/* , 'Indice Gini por destino' */],
                fieldValue: 'gini',
                fieldValueNal: 'gini', // labels a nivel departamental
                fieldValueDepartal: 'gini', // data a nivel depatamental
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
                url: 'v_indice_gini_ids_mun', // data a nivel municipal
                urlNal: 'v_indice_gini_ids_mun', // data a nivel nacional
                urlDepartal: 'v_indice_gini_ids_mun', // data a nivel depatamental
                urlNalDataAlfanumerica: '', // para alguna data adicional alfanuemrica
                fieldlabel: ['anio_vigencia'/*, 'destino' , 'categoria_gini', 'categoria_ids' */], // labels a nivel municipal
                fieldlabelNal: ['anio_vigencia'/* , 'destino' */], // labels a nivel nacional
                fieldlabelDepartal: ['anio_vigencia'/* , 'destino' */], // labels a nivel departamental
                leyenda: ['Indice de Disparidad por año'/* , 'Indice de Disparidad por destino' *//* , 'Indice de Disparidad por categoria', 'Indice de Disparidad por ids' */], // las leyendas para cada label // leyenda a nivel dapartamental
                leyendaNal: ['Indice de Disparidad por año'/* , 'Indice de Disparidad por destino' */], // leyenda a nivel nacional
                leyendaDepartal: ['Indice de Disparidad por año'/* , 'Indice de Disparidad por destino' */],
                fieldValue: 'disparidad_superior',
                fieldValueNal: 'disparidad_superior',
                fieldValueDepartal: 'disparidad_superior',
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
                url: 'v_predios_uaf_mun', // data municipal
                urlNal: 'v_predios_uaf_mun', // data a nivel nacaional
                urlDepartal: 'v_predios_uaf_mun',
                urlNalDataAlfanumerica: '',
                fieldlabel: ['anio'],
                fieldlabelNal: ['anio'],
                fieldlabelDepartal: ['anio'],
                leyenda: ['Porcentaje de predios UAF'], // las leyendas para cada label
                leyendaNal: ['Porcetanje predios UAF'],
                leyendaDepartal: ['Porcetanje predios UAF'],
                fieldValue: 'porcentaje_predios',
                fieldValueNal: 'porcentaje_predios',
                fieldValueDepartal: 'porcentaje_predios',
                quintiles: [
                  ['<=', 0],
                  [0, 0.6],
                  [0.6, 0.8],
                  [0.8, 0.9],
                  [0.9, '=>']
                ]
              },
              {
                value: 4,
                label: '3.1.4 Porcentaje de área de predios por debajo de la UAF mínima municipal',
                descripcion: 'Porcentaje de área de predios por encima de la UAF mínima municipal (ha)',
                url: 'v_predios_uaf_mun', // data municipal
                urlNal: 'v_predios_uaf_mun', // data a nivel nacaional
                urlDepartal: 'v_predios_uaf_mun',
                urlNalDataAlfanumerica: '',
                fieldlabel: ['anio'],
                fieldlabelNal: ['anio'],
                fieldlabelDepartal: ['anio'],
                leyenda: ['Porcentaje de área UAF (ha)'], // las leyendas para cada label
                leyendaNal: ['Porcetanje área UAF (ha)'],
                leyendaDepartal: ['Porcetanje área UAF (ha)'],
                fieldValue: 'porcentaje_area',
                fieldValueNal: 'porcentaje_area',
                fieldValueDepartal: 'porcentaje_area',
                quintiles: [
                  ['<=', 0],
                  [0, 0.1],
                  [0.1, 0.25],
                  [0.25, 0.5],
                  [0.5, '=>']
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
                url: 'v_predios_conflicto_mun', // data municipal
                urlNal: 'v_predios_conflicto_nacmun', // data a nivel nacaional
                urlDepartal: 'v_predios_conflicto_nacmun',
                urlNalDataAlfanumerica: '',
                fieldlabel: ['categoria_conflicto_uso'/* , 'total_predios_mun' */],
                fieldlabelNal: [/* 'total_predios_mun',  */'categoria_conflicto_uso'],
                fieldlabelDepartal: [/* 'total_predios_mun',  */],
                leyenda: ['Porcentaje de predios por categoria'/* , 'Total predios por municipio' */], // las leyendas para cada label
                leyendaNal: ['Porcentaje de predios por categoria uso del suelo'],
                leyendaDepartal: ['Porcentaje de predios por categoria uso del suelo'],
                fieldValue: 'porcentaje_predios',
                fieldValueNal: 'porcentaje_predios',
                fieldValueDepartal: 'porcentaje_predios',
                quintiles: [
                  ['<=', 0],
                  [0, 0.01],
                  [0.01, 0.05],
                  [0.05, 0.15],
                  [0.15, '=>']
                ]
              },
              {
                value: 2,
                label: '3.1.6 Porcentaje de predios en Territorios con ley 2da',
                descripcion: 'Porcentaje de predios en Territorios con ley 2da',
                url: 'v_predios_ley2da_mun', // data municipal
                urlNal: 'v_predios_ley2da_nacmun', // data a nivel nacaional
                urlDepartal: 'v_predios_ley2da_nacmun',
                urlNalDataAlfanumerica: '',
                fieldlabel: ['anio'],
                fieldlabelNal: ['anio'],
                fieldlabelDepartal: ['anio'],
                leyenda: ['Porcentaje de predios por año'], // las leyendas para cada label
                leyendaNal: ['Porcentaje de predios en Territorios con ley 2da'],
                leyendaDepartal: ['Porcentaje de predios en Territorios con ley 2da'],
                fieldValue: 'porcentaje_area',
                fieldValueNal: 'porcentaje_area',
                fieldValueDepartal: 'porcentaje_area',
                quintiles: [
                  ['<=', 0],
                  [0, 0.3],
                  [0.3, 0.6],
                  [0.6, 0.9],
                  [0.9, '=>']
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
                url: 'v_predios_etnicos_por_mun', // data municipal
                urlNal: 'v_predios_etnicos_por_nacmun', // data a nivel nacaional
                urlDepartal: 'v_predios_etnicos_por_mun',
                urlNalDataAlfanumerica: '',
                fieldlabel: ['anio'],
                fieldlabelNal: ['anio'],
                fieldlabelDepartal: ['anio'],
                leyenda: ['Porcentaje predios títulados por año'], // las leyendas para cada label
                leyendaNal: ['Porcentaje predios títulados por año'],
                leyendaDepartal: ['Porcentaje predios títulados por año'],
                fieldValue: 'porcentaje_predios',
                fieldValueNal: 'porcentaje_predios',
                fieldValueDepartal: 'porcentaje_predios',
                quintiles: [
                  'porDefinir'
                ]
              },
              {
                value: 2,
                label: '8.1.2 Porcentaje de área de predios titulados y registrados en ORIP a grupos étnicos',
                descripcion: 'Porcentaje de área de predios en territorios títulados a grupos étnicos (ha)',
                url: 'v_predios_etnicos_por_mun', // data municipal
                urlNal: 'v_predios_etnicos_por_nacmun', // data a nivel nacaional
                urlDepartal: 'v_predios_etnicos_por_nacmun',
                urlNalDataAlfanumerica: '',
                fieldlabel: ['anio'],
                fieldlabelNal: ['anio'],
                fieldlabelDepartal: ['anio'],
                leyenda: ['Porcentaje área títulados por año (ha)'], // las leyendas para cada label
                leyendaNal: ['Porcentaje área títulados por año (ha)'],
                leyendaDepartal: ['Porcentaje área títulados por año (ha)'],
                fieldValue: 'porcentaje_area',
                fieldValueNal: 'porcentaje_area',
                fieldValueDepartal: 'porcentaje_area',
                quintiles: [
                  ['<=', 0],
                  [0, 0.05],
                  [0.05, 0.2],
                  [0.2, 0.5],
                  [0.5, '=>']
                ]
              },
              {
                value: 3,
                label: '8.1.3 Predios titulados a grupos étnicos y registrados en ORIP',
                descripcion: 'Predios titulados a grupos étnicos y registrados en ORIP',
                url: 'v_predios_etnicos_mun', // data municipal
                urlNal: 'v_predios_etnicos_nacmun', // data a nivel nacaional
                urlDepartal: 'v_predios_etnicos_nacmun',
                urlNalDataAlfanumerica: '',
                fieldlabel: ['cat_anio'],
                fieldlabelNal: ['cat_anio'],
                fieldlabelDepartal: ['cat_anio'],
                leyenda: ['Cantidad de predios por año'], // las leyendas para cada label
                leyendaNal: ['Cantidad de predios por año'],
                leyendaDepartal: ['Cantidad de predios por año'],
                fieldValue: 'cantidad_predios',
                fieldValueNal: 'cantidad_predios',
                fieldValueDepartal: 'cantidad_predios',
                quintiles: [
                  ['<=', 5],
                  [5, 10],
                  [10, 15],
                  [15, 25],
                  [25, '=>']
                ]
              },
              {
                value: 4,
                label: '8.1.4 Área titulada a grupos étnicos con registro en ORIP',
                descripcion: 'Área titulada a grupos étnicos con registro en ORIP (ha)',
                url: 'v_predios_etnicos_mun', // data municipal
                urlNal: 'v_predios_etnicos_nacmun', // data a nivel nacaional
                urlDepartal: 'v_predios_etnicos_nacmun',
                urlNalDataAlfanumerica: '',
                fieldlabel: ['cat_anio'],
                fieldlabelNal: ['cat_anio'],
                fieldlabelDepartal: ['cat_anio'],
                leyenda: ['Cantidad de Área por año (ha)'], // las leyendas para cada label
                leyendaNal: ['Cantidad de Área por año (ha)'],
                leyendaDepartal: ['Cantidad de Área por año (ha)'],
                fieldValue: 'total_area_ha',
                fieldValueNal: 'total_area_ha',
                fieldValueDepartal: 'total_area_ha',
                quintiles: [
                  ['<=', 500],
                  [500, 2000],
                  [2000, 5000],
                  [5000, 30000],
                  [30000, '=>']
                ]
              }
            ]
          }
        ]
      }
    ]
  }
]
