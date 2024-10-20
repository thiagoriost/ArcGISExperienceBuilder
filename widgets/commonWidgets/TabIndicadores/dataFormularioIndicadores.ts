export const DATA_Fuente_Indicadores = [
  {
    value: 1,
    label: "1. De adquisición, adjudicación de tierras y de procesos agrarios para la reforma agraria",
    descripcion: "1. De adquisición, adjudicación de tierras y de procesos agrarios para la reforma agraria, y garantía de derechos territoriales de los campesinos, pueblos indígenas y de las comunidades negras, afrocolombianas, raizales, palenqueras y pueblo Rom",
    APUESTA_ESTRATEGICA: [
      {
        value: 1,
        label: "1. Implementar la estretegia de acceso a tierra",
        descripcion: "1. Implementar la estretegia de acceso a la tierra por medio del programa especial de adquisición de tierras para la producción de alimentos y otros instrumentos y materializar el Plan Nacional de Formalización Masiva de la Propiedad Rural.",
        CATEGORIA_TEMATICA: [
          {
            value: 0,
            label: "1.1 Disposición de predios para la Reforma Agraria",
            descripcion: "1.1 Disposición de predios para la Reforma Agraria",
            INDICADOR: [
              {
                value: 0,
                label: "1.1.1 Predios dispuestos en el Fondo de Tierras para la Reforma Agraria",
                descripcion: "Cantidad de predios en el Fondo de Tierras para la Reforma Agraria",
                urlNal: "v_predios_fondo_tierras_nacmun", //para data coropletica a nivel municipal
                urlNalDataAlfanumerica: "v_predios_fondo_tierras_sumnac", //para data alfanumerica a nivel nacional
                fieldlabelNal: ["anio","tipo_predio"], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueNal: "cantidad_predios",// estees el valor que tomara generar las cantidades para cada label
                leyendaNal: ["Cantidad de predios por año", "Tipos de predios"], // las leyendas para cada label
                urlDepartal: "v_predios_fondo_tierras_dpto",
                fieldlabelDepartal: ["anio", "tipo_predio"], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValueDepartal: "cantidad_predios",// estees el valor que tomara generar las cantidades para cada label
                leyendaDepartal: ["Cantidad de predios por año","Tipos de predios"],
                url: "v_predios_fondo_tierras_mun",
                fieldlabel: ["tipo_predio", "anio"], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                fieldValue: "cantidad_predios",// estees el valor que tomara generar las cantidades para cada label
                leyenda: ["Cantidad de predios por tipo", "Cantidad de predios por año"] // las leyendas para cada label
              },
              {
                value: 1,
                label: "1.1.2 Área dispuesta en el Fondo de Tierras para la Reforma Agraria",
                descripcion: "Cantidad de área dispuesta en el Fondo de Tierras para la Reforma Agraria",
                urlNal: "v_predios_fondo_tierras_nacmun",
                urlNalDataAlfanumerica: "v_predios_fondo_tierras_sumnac",
                fieldlabelNal:["anio","tipo_predio"],
                fieldValueNal:"total_area_ha",
                leyendaNal:["Cantidad de área por año", "Tipos de predios"],
                urlDepartal:"v_predios_fondo_tierras_dpto",
                fieldlabelDepartal:["anio", "tipo_predio"],
                fieldValueDepartal:"cantidad_predios",
                leyendaDepartal:["Cantidad de área por año","Tipos de predios"],
                url: "v_predios_fondo_tierras_mun",
                fieldlabel: ["tipo_predio", "anio"],
                fieldValue: "total_area_ha",
                leyenda: ["Cantidad de área por tipo", "Cantidad de área por año"]
              },
              {
                value: 2,
                label: "1.1.3 Predios dispuestos en el Inventario Nacional de Baldíos",
                descripcion: "Cantidad de predios en el Inventario Nacional de Baldíos",
                urlNal: "v_predios_inv_baldios_nacmun",
                urlNalDataAlfanumerica: "v_predios_inv_baldios_sumnac",
                fieldlabelNal:["anio", "destinacion_predio"],
                fieldValueNal:"cantidad_predios",
                leyendaNal:["Cantidad de predios por año", "Destinación de predios"],
                urlDepartal:"v_predios_inventario_baldios_dpto",
                fieldlabelDepartal:["anio", "destinacion_predio"],
                fieldValueDepartal:"cantidad_predios",
                leyendaDepartal:["Cantidad de predios por año", "Destinación de predios"],
                url: "v_predios_inventario_baldios_mun",
                fieldlabel: ["destinacion_predio", "anio"],
                fieldValue: "cantidad_predios",
                leyenda: ["Cantidad de predios por destino", "Cantidad de predios por año"]
              },
              {
                value: 3,
                label: "1.1.4 Área dispuesta en el Inventario Nacional de Baldíos",
                descripcion: "Cantidad de área en el Inventario Nacional de Baldíos",
                urlNal: "v_predios_inv_baldios_nacmun",
                urlNalDataAlfanumerica: "v_predios_inv_baldios_sumnac",
                fieldlabelNal:["anio", "destinacion_predio"],
                fieldValueNal:"total_area_ha",
                leyendaNal:["Cantidad de área por año", "Destinación de predios"],
                urlDepartal:"v_predios_inventario_baldios_dpto",
                fieldlabelDepartal:["anio", "destinacion_predio"],
                fieldValueDepartal:"total_area_ha",
                leyendaDepartal:["Cantidad de área por año", "Destinación de predios"],
                url: "v_predios_inventario_baldios_mun",
                fieldlabel: ["destinacion_predio", "anio"],
                fieldValue: "total_area_ha",
                leyenda: ["Cantidad de área por destino", "Cantidad de área por año"]
              }
            ]
          },
          {
            value: 1,
            label: "1.2 Acceso a tierra",
            descripcion: "1.2 Acceso a tierra",
            INDICADOR: [
              {
                value: 0,
                label: "1.2.1 Predios adjudicados",
                descripcion: "Cantidad de predios adjudicados",
                urlNal: "v_predios_adjudicados_macmun",
                urlNalDataAlfanumerica: "v_predios_adjudicados_sumnac",
                fieldlabelNal:["cat_anio_adjudicacion", "tipo_beneficiario","genero_beneficiario"],
                fieldValueNal:"cantidad_predios",
                leyendaNal:["Predios adjudicados","Beneficiarios","Género beneficiarios"],
                urlDepartal:"v_predios_adjudicados_depto",
                fieldlabelDepartal:["cat_anio_adjudicacion", "tipo_beneficiario","genero_beneficiario"],
                fieldValueDepartal:"cantidad_predios",
                leyendaDepartal:["Predios adjudicados","Beneficiarios","Género beneficiarios"],
                url: "v_predios_adjudicados_mun",
                fieldlabel: ["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                fieldValue: "cantidad_predios",
                leyenda: ["Predios adjudicados por año", "Predios adjudicados por beneficiario ", "Predios adjudicados por tipo de género"]
              },
              {
                value: 1,
                label: "1.2.2 Área de predios adjudicados",
                descripcion: "Cantidad de área de predios adjudicados",
                urlNal: "v_predios_adjudicados_macmun",
                urlNalDataAlfanumerica: "v_predios_adjudicados_sumnac",
                fieldlabelNal:["cat_anio_adjudicacion", "tipo_beneficiario","genero_beneficiario"],
                fieldValueNal:"total_area_ha",
                leyendaNal:["Área adjudicada","Beneficiarios","Género beneficiarios"],
                urlDepartal:"v_predios_adjudicados_depto",
                fieldlabelDepartal:["cat_anio_adjudicacion", "tipo_beneficiario","genero_beneficiario"],
                fieldValueDepartal:"total_area_ha",
                leyendaDepartal:["Área adjudicada","Beneficiarios","Género beneficiarios"],
                url: "v_predios_adjudicados_mun",
                fieldlabel: ["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                fieldValue: "total_area_ha",
                leyenda: ["Área adjudicada por año", "Área adjudicada por beneficiario ", "Área adjudicada por tipo de género"]
              },
              {
                value: 2,
                label: "1.2.3 Predios baldíos adjudicados",
                descripcion: "Cantidad de predios baldíos adjudicados",
                urlNal: "v_predios_adj_baldios_nacmun",
                urlNalDataAlfanumerica: "v_predios_adj_baldios_sumnac",
                fieldlabelNal:["cat_anio_adjudicacion","tipo_beneficiario","genero_beneficiario"],
                fieldValueNal:"cantidad_predios",
                leyendaNal:["Predios baldios adjudicados","Beneficiarios","Género beneficiarios"],
                urlDepartal:"v_predios_adj_baldios_depto",
                fieldlabelDepartal:["cat_anio_adjudicacion","tipo_beneficiario","genero_beneficiario"],
                fieldValueDepartal:"cantidad_predios",
                leyendaDepartal:["Predios baldios adjudicados","Beneficiarios","Género beneficiarios"],
                url: "v_predios_adj_baldios_mun",
                fieldlabel: ["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                fieldValue: "cantidad_predios",
                leyenda: ["Predios por año", "Predios por beneficiario ", "Predios por tipo de género"]
              },
              {
                value: 3,
                label: "1.2.4 Área de predios baldíos adjudicados",
                descripcion: "Cantidad de área de predios baldíos adjudicados",
                urlNal: "v_predios_adj_baldios_nacmun",
                urlNalDataAlfanumerica: "v_predios_adj_baldios_sumnac",
                fieldlabelNal:["cat_anio_adjudicacion","tipo_beneficiario","genero_beneficiario"],
                fieldValueNal:"total_area_ha",
                leyendaNal:["Área baldia adjudicada","Beneficiarios","Género beneficiarios"],
                urlDepartal:"v_predios_adj_baldios_depto",
                fieldlabelDepartal:["cat_anio_adjudicacion","tipo_beneficiario","genero_beneficiario"],
                fieldValueDepartal:"total_area_ha",
                leyendaDepartal:["Área baldia adjudicada","Beneficiarios","Género beneficiarios"],
                url: "v_predios_adj_baldios_mun",
                fieldlabel: ["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                fieldValue: "total_area_ha",
                leyenda: ["Área por año", "Área por beneficiario ", "Área por tipo de género"]
              },
              {
                value: 4,
                label: "1.2.5 Bienes Fiscales Patrimoniales adjudicados",
                descripcion: "Cantidad de Bienes Fiscales Patrimoniales adjudicados",
                urlNal: "v_bienes_fiscales_adj_nacmun",
                urlNalDataAlfanumerica: "v_bienes_fiscales_adj_sumnac",
                fieldlabelNal:["cat_anio_adjudicacion","tipo_beneficiario","genero_beneficiario"],
                fieldValueNal:"cantidad_predios",
                leyendaNal:["Bienes Fiscales adjudicados","Beneficiarios","Género beneficiarios"],
                urlDepartal:"v_bienes_fiscales_adj_dpto",
                fieldlabelDepartal:["cat_anio_adjudicacion","tipo_beneficiario","genero_beneficiario"],
                fieldValueDepartal:"cantidad_predios",
                leyendaDepartal:["Bienes Fiscales adjudicados","Beneficiarios","Género beneficiarios"],
                url: "v_bienes_fiscales_adj_mun",
                fieldlabel: ["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                fieldValue: "cantidad_predios",
                leyenda: ["Predios por año", "Predios por beneficiario ", "Predios por tipo de género"]
              },
              {
                value: 5,
                label: "1.2.6 Área de Bienes Fiscales Patrimoniales adjudicados",
                descripcion: "Cantidad de área de Bienes Fiscales Patrimoniales adjudicados",
                urlNal: "v_bienes_fiscales_adj_nacmun",
                urlNalDataAlfanumerica: "v_bienes_fiscales_adj_sumnac",
                fieldlabelNal:["cat_anio_adjudicacion","tipo_beneficiario","genero_beneficiario"],
                fieldValueNal:"total_area_ha",
                leyendaNal:["Área bien fiscal adjudicada","Beneficiarios","Género beneficiarios"],
                urlDepartal:"v_bienes_fiscales_adj_dpto",
                fieldlabelDepartal:["cat_anio_adjudicacion","tipo_beneficiario","genero_beneficiario"],
                fieldValueDepartal:"total_area_ha",
                leyendaDepartal:["Área bien fiscal adjudicada","Beneficiarios","Género beneficiarios"],
                url: "v_bienes_fiscales_adj_mun",
                fieldlabel: ["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                fieldValue: "total_area_ha",
                leyenda: ["Área por año", "Área por beneficiario ", "Área por tipo de género"]
              },
              {
                value: 6,
                label: "1.2.7 Predios beneficiarios de SIT",
                descripcion: "Cantidad de predios beneficiarios de subsidios integrales para la compra de tierras",
                urlNal: "v_predios_sub_integrales_nacmun",
                urlNalDataAlfanumerica: "v_predios_sub_integrales_sumnac",
                fieldlabelNal:["cat_anio_adjudicacion","tipo_beneficiario","genero_beneficiario"],
                fieldValueNal:"cantidad_predios",
                leyendaNal:["Predios beneficiarios de SIT","Beneficiarios","Género beneficiarios"],
                urlDepartal:"v_predios_sub_integrales_dpto",
                fieldlabelDepartal:["cat_anio_adjudicacion","tipo_beneficiario","genero_beneficiario"],
                fieldValueDepartal:"cantidad_predios",
                leyendaDepartal:["Predios beneficiarios de SIT","Beneficiarios","Género beneficiarios"],
                url: "v_predios_sub_integrales_mun",
                fieldlabel: ["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                fieldValue: "cantidad_predios",
                leyenda: ["Predios por año", "Predios por beneficiario ", "Predios por tipo de género"]
              },
              {
                value: 7,
                label: "1.2.8 Área de predios beneficiarios de SIT",
                descripcion: "Cantidad de área de predios beneficiarios de subsidios integrales para la compra de tierras",
                urlNal: "v_predios_sub_integrales_nacmun",
                urlNalDataAlfanumerica: "v_predios_sub_integrales_sumnac",
                fieldlabelNal:["cat_anio_adjudicacion","tipo_beneficiario","genero_beneficiario"],
                fieldValueNal:"total_area_ha",
                leyendaNal:["Área beneficiaria SIT","Beneficiarios","Género beneficiarios"],
                urlDepartal:"v_predios_sub_integrales_dpto",
                fieldlabelDepartal:["cat_anio_adjudicacion","tipo_beneficiario","genero_beneficiario"],
                fieldValueDepartal:"total_area_ha",
                leyendaDepartal:["Área beneficiaria SIT","Beneficiarios","Género beneficiarios"],
                url: "v_predios_sub_integrales_mun",
                fieldlabel: ["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                fieldValue: "total_area_ha",
                leyenda: ["Área por año", "Área por beneficiario ", "Área por tipo de género"]
              },
              {
                value: 8,
                label: "1.2.9 Predios entregados a través del Fondo de Tierras",
                descripcion: "Cantidad de predios entregados a través del Fondo de Tierras",
                urlNal: "v_predios_entregados_ft_nacmun",
                urlNalDataAlfanumerica: "v_predios_entregados_ft_sumnac",
                fieldlabelNal:["cat_anio_adjudicacion","tipo_beneficiario","genero_beneficiario"],
                fieldValueNal:"cantidad_predios",
                leyendaNal:["Predios entregados Fondo de Tierras","Beneficiarios","Género beneficiarios"],
                urlDepartal:"v_predios_entregados_ft_dpto",
                fieldlabelDepartal:["cat_anio_adjudicacion","tipo_beneficiario","genero_beneficiario"],
                fieldValueDepartal:"cantidad_predios",
                leyendaDepartal:["Predios entregados Fondo de Tierras","Beneficiarios","Género beneficiarios"],
                url: "v_predios_entregados_ft_mun",
                fieldlabel: ["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                fieldValue: "cantidad_predios",
                leyenda: ["Predios por año", "Predios por beneficiario ", "Predios por tipo de género"]
              },
              {
                value: 9,
                label: "1.2.10 Área entregada a través del Fondo de Tierras",
                descripcion: "Cantidad de área entregada a través del Fondo de Tierras",
                urlNal: "v_predios_entregados_ft_nacmun",
                urlNalDataAlfanumerica: "v_predios_entregados_ft_sumnac",
                fieldlabelNal:["cat_anio_adjudicacion","tipo_beneficiario","genero_beneficiario"],
                fieldValueNal:"total_area_ha",
                leyendaNal:["Área entregada Fondo de Tierras","Beneficiarios","Género beneficiarios"],
                urlDepartal:"v_predios_entregados_ft_dpto",
                fieldlabelDepartal:["cat_anio_adjudicacion","tipo_beneficiario","genero_beneficiario"],
                fieldValueDepartal:"total_area_ha",
                leyendaDepartal:["Área entregada Fondo de Tierras","Beneficiarios","Género beneficiarios"],
                url: "v_predios_entregados_ft_mun",
                fieldlabel: ["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                fieldValue: "total_area_ha",
                leyenda: ["Área por año", "Área por beneficiario ", "Área por tipo de género"]
              }
            ]
          },
          {
            value: 2,
            label: "1.3 Ordenamiento Social de la Propiedad",
            descripcion: "1.3 Ordenamiento Social de la Propiedad",
            INDICADOR: [
              {
                value: 0,
                label: "1.3.2 Porcentaje de predios con área por encima de la UAF mínima municipal",
                descripcion: "Porcentaje de predios con área por encima de la UAF mínima municipal",
                urlNal: 'v_predios_uaf_nacmun',
                urlNalDataAlfanumerica: "v_predios_uaf_sumnac",
                fieldlabelNal:["anio"],
                fieldValueNal:"porcentaje_predios",
                leyendaNal:["Porcetanje predios UAF"],
                urlDepartal:"v_predios_uaf_depto",
                fieldlabelDepartal:["anio"],
                fieldValueDepartal:"porcentaje_predios",
                leyendaDepartal:["Porcetanje predios UAF"],
                url: 'v_predios_uaf_mun',
                fieldlabel: ['anio'],
                fieldValue: 'porcentaje_predios',
                leyenda: ['Porcentaje de predios'],

              },
              {
                value: 1,
                label: "1.3.3 Porcentaje de área de predios por encima de la UAF mínima municipal",
                descripcion: "Porcentaje de área de predios por encima de la UAF mínima municipal",
                urlNal: 'v_predios_uaf_nacmun',
                urlNalDataAlfanumerica: "v_predios_uaf_sumnac",
                fieldlabelNal:["anio"],
                fieldValueNal:"porcentaje_area",
                leyendaNal:["Porcetanje área UAF"],
                urlDepartal:"v_predios_uaf_depto",
                fieldlabelDepartal:["anio"],
                fieldValueDepartal:"porcentaje_area",
                leyendaDepartal:["Porcetanje área UAF"],
                url: 'v_predios_uaf_mun',
                fieldlabel: ['anio'],
                fieldValue: 'porcentaje_area',
                leyenda: ['Porcentaje de área'],
              }
            ]
          },
          {
            value: 3,
            label: "1.4 Formalización",
            descripcion: "1.4 Formalización",
            INDICADOR: [
              {
                value: 0,
                label: "1.4.1 Predios formalizados",
                descripcion: "Cantidad de predios formalizados",
                urlNal: "v_predios_formalizados_nacmun",
                urlNalDataAlfanumerica: "v_predios_formalizados_sum",
                fieldlabelNal:["cat_anio_formalizado", "tipo_beneficiario", "genero_beneficiario"],
                fieldValueNal:"cantidad_predios",
                leyendaNal:["Predios formalizados por año","Predios formalizados por beneficiario","Predios formalizados por género"],
                urlDepartal:"v_predios_formalizados_dpto",
                fieldlabelDepartal:["cat_anio_formalizado", "tipo_beneficiario", "genero_beneficiario"],
                fieldValueDepartal:"cantidad_predios",
                leyendaDepartal:["Predios formalizados por año","Predios formalizados por beneficiario","Predios formalizados por género"],
                url: "v_predios_formalizados_mun",
                fieldlabel: ["tipo_beneficiario", "genero_beneficiario", "cat_anio_formalizado"],
                fieldValue: "cantidad_predios",
                leyenda: ["Predios por tipo", "Predios por genero", "Predios por año"]
              },
              {
                value: 1,
                label: "1.4.2 Área de predios formalizados",
                descripcion: "Cantidad de área de predios formalizados",
                urlNal: "v_predios_formalizados_nacmun",
                urlNalDataAlfanumerica: "v_predios_formalizados_sum",
                fieldlabelNal:["cat_anio_formalizado", "tipo_beneficiario", "genero_beneficiario"],
                fieldValueNal:"total_area_ha",
                leyendaNal:["Área formalizados por año","Área formalizados por beneficiario","Área formalizados por género"],
                urlDepartal:"v_predios_formalizados_dpto",
                fieldlabelDepartal:["cat_anio_formalizado", "tipo_beneficiario", "genero_beneficiario"],
                fieldValueDepartal:"total_area_ha",
                leyendaDepartal:["Área formalizados por año","Área formalizados por beneficiario","Área formalizados por género"],
                url: "v_predios_formalizados_mun",
                fieldlabel: ["tipo_beneficiario", "genero_beneficiario", "cat_anio_formalizado"],
                fieldValue: "total_area_ha",
                leyenda: ["Área por tipo", "Área por genero", "Área por año"]
              },
              {
                value: 2,
                label: "1.4.3 Predios formalizados a mujeres",
                descripcion: "Cantidad de predios formalizados a mujeres",
                urlNal: "v_predios_for_mujeres_nacmun",
                urlNalDataAlfanumerica: "v_predios_for_mujeres_sumnac",
                fieldlabelNal:["cat_anio_formalizado"],
                fieldValueNal:"cantidad_predios",
                leyendaNal:["Predios formalizados por año"],
                urlDepartal:"v_predios_formal_mujeres_dpto",
                fieldlabelDepartal:["cat_anio_formalizado"],
                fieldValueDepartal:"cantidad_predios",
                leyendaDepartal:["Predios formalizados por año"],
                url: "v_predios_formal_mujeres_mun",
                fieldlabel: ["cat_anio_formalizado"],
                fieldValue: "cantidad_predios",
                leyenda: ["Predios por año"]
              },
              {
                value: 3,
                label: "1.4.4 Área de predios formalizados a mujeres",
                descripcion: "Cantidad de área de predios formalizados a mujeres",
                urlNal: "v_predios_for_mujeres_nacmun",
                urlNalDataAlfanumerica: "v_predios_for_mujeres_sumnac",
                fieldlabelNal:["cat_anio_formalizado"],
                fieldValueNal:"total_area_ha",
                leyendaNal:["Área formalizados por año"],
                urlDepartal:"v_predios_formal_mujeres_dpto",
                fieldlabelDepartal:["cat_anio_formalizado"],
                fieldValueDepartal:"total_area_ha",
                leyendaDepartal:["Área formalizados por año"],
                url: "v_predios_formal_mujeres_mun",
                fieldlabel: ["cat_anio_formalizado"],
                fieldValue: "total_area_ha",
                leyenda: ["Área por año"]
              }
            ]
          }
        ]
      },
      /* {
        value:2,
        label:"2. Ordenar el suelo rural agropecuario y actualizar el catastro multipropósito",
        descripcion:"2. Ordenar el suelo rural agropecuario y avanzar en los procesos de actualización catastral con enfoque multipropósito.",
        CATEGORIA_TEMATICA:[
          {
            value:0,
            label:"Actualización catastral",
            descripcion:"1.5 Actualización catastral",
            INDICADOR:[
              {
                value:0,
                label:"Porcentaje de predios actualizados",
                descripcion:"Porcentaje de predios actualizados",
                urlNal:'',
                urlNalDataAlfanumerica: "",
                fieldlabelNal:[],
                fieldValueNal:"",
                leyendaNal:[],
                urlDepartal:"",
      fieldlabelDepartal:[],
      fieldValueDepartal:"",
      leyendaDepartal:[],
                url:'',
                fieldlabel:[''],
                fieldValue:'',
                leyenda:[''],
              },
              {
                value:1,
                label:"Porcentaje de área de predios actualizados",
                descripcion:"Porcentaje de área de predios actualizados",
                urlNal:'',
                urlNalDataAlfanumerica: "",
                fieldlabelNal:[],
                fieldValueNal:"",
                leyendaNal:[],
                urlDepartal:"",
      fieldlabelDepartal:[],
      fieldValueDepartal:"",
      leyendaDepartal:[],
                url:'',
                fieldlabel:[''],
                fieldValue:'',
                leyenda:[''],
              },
              {
                value:2,
                label:"Municipios actualizados",
                descripcion:"Cantidad de municipios actualizados en cada vigencia",
                urlNal:'',
                urlNalDataAlfanumerica: "",
                fieldlabelNal:[],
                fieldValueNal:"",
                leyendaNal:[],
                urlDepartal:"",
      fieldlabelDepartal:[],
      fieldValueDepartal:"",
      leyendaDepartal:[],
                url:'',
                fieldlabel:[''],
                fieldValue:'',
                leyenda:[''],
              },
              {
                value:3,
                label:"Municipios formados",
                descripcion:"Número de municipios formados en cada vigencia",
                urlNal:'',
                urlNalDataAlfanumerica: "",
                fieldlabelNal:[],
                fieldValueNal:"",
                leyendaNal:[],
                urlDepartal:"",
      fieldlabelDepartal:[],
      fieldValueDepartal:"",
      leyendaDepartal:[],
                url:'',
                fieldlabel:[''],
                fieldValue:'',
                leyenda:[''],
              }
            ]
          },
        ]
      }, */
      {
        value: 3,
        label: "3. Ejecutar la política de restitución de tierras",
        descripcion: "3. Ejecutar la política de restitución de tierras.",
        CATEGORIA_TEMATICA: [
          {
            value: 0,
            label: "1.7 Restitución de tierras",
            descripcion: "1.7 Restitución de tierras",
            INDICADOR: [
              {
                value: 0,
                label: "1.7.2 Predios asociados a solicitudes de inscripción al RTDAF",
                descripcion: "Cantidad de predios asociados a solicitudes de inscripción al Registro de Tierras Despojadas y Abandonadas Forzosamente",
                urlNal: 'v_predios_restierras_nacmun',
                urlNalDataAlfanumerica: "v_predios_restierras_sumnac",
                fieldlabelNal:["pdet","nucleo_reforma"],
                fieldValueNal:"cantidad_predios",
                leyendaNal:["Predios RTDAF por PDET", "Predios RTDAF por nucleo"],
                urlDepartal:"v_predios_restierras_depto",
                fieldlabelDepartal:["pdet","nucleo_reforma"],
                fieldValueDepartal:"cantidad_predios",
                leyendaDepartal:["Predios RTDAF por PDET", "Predios RTDAF por nucleo"],
                url: 'v_predios_restierras_mun',
                fieldlabel: ['pdet', 'nucleo_reforma'],
                fieldValue: 'cantidad_predios',
                leyenda: ['Cantidad de predios por PDET', 'Cantidad de predios por reforma'],
              }
            ]
          }
        ]
      },
    ],
  },
  {
    value: 2,
    label: "2. De delimitación, constitución y consolidación de ZRC y manejo de playones y sabanas comunales",
    descripcion: "2. De delimitación, constitución y consolidación de zonas de reserva campesina, delimitación, uso y manejo de playones y sabanas comunales y de organización y capacitación campesina",
    APUESTA_ESTRATEGICA: [
      {
        value: 0,
        label: "1. Delimitar, consolidar y constituir las ZRC",
        descripcion: "1. Delimitar, consolidar y constituir las zonas de reserva campesina como territorialidad cuyo ordenamiento territorial se presta para frenar la expansión de la frontera agrícola, servir para la conservación ambiental y potenciar la producción de alimentos ",
        CATEGORIA_TEMATICA: [
          {
            value: 0,
            label: "2.1 Constitución de ZRC",
            descripcion: "2.1 Constitución de ZRC",
            INDICADOR: [
              {
                value: 0,
                label: "2.1.1 Porcentaje de predios en Zonas de Reserva Campesina",
                descripcion: "Porcentaje de predios en Zonas de Reserva Campesina",
                urlNal: 'v_predios_zrc_nacmun',
                urlNalDataAlfanumerica: "v_predios_zrc_avgnac",
                fieldlabelNal:["anio"],
                fieldValueNal:"porcentaje_predios",
                leyendaNal:["Predios ZRC por año"],
                urlDepartal:"v_predios_zrc_depto",
                fieldlabelDepartal:["anio"],
                fieldValueDepartal:"porcentaje_predios",
                leyendaDepartal:["Predios ZRC por año"],
                url: 'v_predios_zrc_mun',
                fieldlabel: ['anio'],
                fieldValue: 'porcentaje_predios',
                leyenda: ['Porcentaje de predios por año'],
              },
              {
                value: 1,
                label: "2.1.2 Porcentaje de área de predios en Zonas de Reserva Campesina",
                descripcion: "Porcentaje de área de predios en Zonas de Reserva Campesina",
                urlNal: 'v_predios_zrc_nacmun',
                urlNalDataAlfanumerica: "v_predios_zrc_avgnac",
                fieldlabelNal:["anio"],
                fieldValueNal:"porcentaje_area",
                leyendaNal:["Predios ZRC por año"],
                urlDepartal:"v_predios_zrc_depto",
                fieldlabelDepartal:["anio"],
                fieldValueDepartal:"porcentaje_area",
                leyendaDepartal:["Predios ZRC por año"],
                url: 'v_predios_zrc_mun',
                fieldlabel: ['anio'],
                fieldValue: 'porcentaje_area',
                leyenda: ['Porcentaje de área por año'],
              }
            ]
          }
        ]
      }
    ]
  },
  {
    value: 3,
    label: "3. De ordenamiento territorial y solución de conﬂictos socioambientales",
    descripcion: "3. De ordenamiento territorial y solución de conﬂictos socioambientales para la reforma agraria",
    APUESTA_ESTRATEGICA: [
      {
        value: 0,
        label: "1. Resolución de Conflictos socioambientales",
        descripcion: "1. Resolución de Conflictos socioambientales en áreas de especial importancia ambiental, mediante la regularización del uso, ocupación y tenencia hacia el uso sostenible y la protección de los recursos naturales",
        CATEGORIA_TEMATICA: [
          {
            value: 0,
            label: "3.1 Distribución de la tierra",
            descripcion: "3.1 Distribución de la tierra",
            INDICADOR: [
              {
                value: 0,
                label: "3.1.1 Índice de Gini de la propiedad",
                descripcion: "Índice de Gini de la propiedad",
                urlNal: 'v_indice_gini_ids_nacmun',
                urlNalDataAlfanumerica: "",
                fieldlabelNal:[],
                fieldValueNal:"",
                leyendaNal:[],
                urlDepartal:"v_indice_gini_ids_depto",
                fieldlabelDepartal:["destino","anio_vigencia","categoria_gini","categoria_ids"],
                fieldValueDepartal:"gini",
                leyendaDepartal:["Índice de Gini por destino","Índice de Gini por año","Índice de Gini por categoría Gini", "Índice de Gini por categoría IDS"],
                url: 'v_indice_gini_ids_mun',
                fieldlabel: ['anio_vigencia', 'destino', 'categoria_gini', 'categoria_ids'],
                fieldValue: 'gini',
                leyenda: ['Indice Gini por año', 'Indice Gini por destino', 'Indice Gini por categoria', 'Indice Gini por ids',],
              },
              {
                value: 1,
                label: "3.1.2 Índice de Disparidad Superior - IDS",
                descripcion: "Índice de Disparidad Superior - IDS",
                urlNal: 'v_indice_gini_ids_nacmun',
                urlNalDataAlfanumerica: "",
                fieldlabelNal:[],
                fieldValueNal:"",
                leyendaNal:[],
                urlDepartal:"v_indice_gini_ids_depto",
                fieldlabelDepartal:["destino","anio_vigencia","categoria_gini","categoria_ids"],
                fieldValueDepartal:"disparidad_superior",
                leyendaDepartal:["Índice de Disparidad por destino","Índice de Disparidad por año","Índice de Disparidad por categoría Gini", "Índice de Disparidad por categoría IDS"],
                url: 'v_indice_gini_ids_mun',
                fieldlabel: ['anio_vigencia', 'destino', 'categoria_gini', 'categoria_ids'],
                fieldValue: 'disparidad_superior',
                leyenda: ['Indice de Disparidad por año', 'Indice de Disparidad por destino', 'Indice de Disparidad por categoria', 'Indice de Disparidad por ids',],
              }
            ]
          },
          {
            value: 1,
            label: "3.2 Conflictos de uso",
            descripcion: "3.2 Conflictos de uso",
            INDICADOR: [
              {
                value: 0,
                label: "3.2.1 Porcentaje de predios con presunta subutilización",
                descripcion: "Porcentaje de predios con presunta subutilización en el uso del suelo",
                urlNal: 'v_predios_conflicto_nacmun',
                urlNalDataAlfanumerica: "",
                fieldlabelNal:[],
                fieldValueNal:"",
                leyendaNal:[],
                urlDepartal:"v_predios_conflicto_depto",
                fieldlabelDepartal:["categoria_conflicto_uso"],
                fieldValueDepartal:"porcentaje_predios",
                leyendaDepartal:["Porcentaje predios por categoria"],
                url: 'v_predios_conflicto_mun',
                fieldlabel: ['categoria_conflicto_uso'],
                fieldValue: 'porcentaje_predios',
                leyenda: ['Porcentaje de predios por categoria'],
              },
              {
                value: 1,
                label: "3.2.2 Porcentaje de predios en Territorios con ley 2da",
                descripcion: "Porcentaje de predios en Territorios con ley 2da",
                urlNal: 'v_predios_ley2da_nacmun',
                urlNalDataAlfanumerica: "v_predios_ley2da_avgnac",
                fieldlabelNal:["anio"],
                fieldValueNal:"porcentaje_predios",
                leyendaNal:["Porcentaje de predios en Territorios con ley 2da"],
                urlDepartal:"v_predios_ley2da_depto",
                fieldlabelDepartal:["anio"],
                fieldValueDepartal:"porcentaje_predios",
                leyendaDepartal:["Porcentaje de predios en Territorios con ley 2da"],
                url: 'v_predios_ley2da_mun',
                fieldlabel: ['anio'],
                fieldValue: 'porcentaje_predios',
                leyenda: ['Porcentaje de predios por año'],
              }
            ]
          }
        ]
      }
    ]
  },
  /* 
  {
    value:4,
    label:"4. De acceso a derechos y servicios sociales básicos, infraestructura física, y adecuación de tierras",
    descripcion:"4. De acceso a derechos y servicios sociales básicos, infraestructura física, y adecuación de tierras",
    APUESTA_ESTRATEGICA:[
      {
        value:3,
        label:"",
        descripcion:"",
        CATEGORIA_TEMATICA:[
          {
            value:5,
            label:"",
            descripcion:"",
            INDICADOR:[
              {
                value:0,
                label:"",
                descripcion:"",
                urlNal:'',
                urlNalDataAlfanumerica: "",
                fieldlabelNal:[],
                fieldValueNal:"",
                leyendaNal:[],
                urlDepartal:"",
                fieldlabelDepartal:[],
                fieldValueDepartal:"",
                leyendaDepartal:[],
                url:'',
                fieldlabel:[''],
                fieldValue:'',
                leyenda:[''],
              }
            ]
          }
        ]
      }
    ]
  },
  {
    value:5,
    label:"5. De investigación, asistencia técnica, capacitación, transferencia de tecnología y diversiﬁcación de cultivos",
    descripcion:"5. De investigación, asistencia técnica, capacitación, transferencia de tecnología y diversiﬁcación de cultivos",
    APUESTA_ESTRATEGICA:[
      {
        value:3,
        label:"3. Desarrollar instrumentos de innovación",
        descripcion:"3. Desarrollar instrumentos de innovación",
        CATEGORIA_TEMATICA:[
          {
            value:5,
            label:"5.1 Asistencia técnica",
            descripcion:"5.1 Asistencia técnica",
            INDICADOR:[
              {
                value:0,
                label:"Esquemas de asistencia técnica implementados",
                descripcion:"Esquemas de asistencia técnica implementados",
                urlNal:'',
                urlNalDataAlfanumerica: "",
                fieldlabelNal:[],
                fieldValueNal:"",
                leyendaNal:[],
                urlDepartal:"",
                fieldlabelDepartal:[],
                fieldValueDepartal:"",
                leyendaDepartal:[],
                url:'',
                fieldlabel:[''],
                fieldValue:'',
                leyenda:[''],
              }
            ]
          }
        ]
      }
    ]
  },
  {
    value:6,
    label:"6. De estímulo a la economía campesina, familiar y comunitaria",
    descripcion:"6. De estímulo a la economía campesina, familiar y comunitaria",
    APUESTA_ESTRATEGICA:[
      {
        value:3,
        label:"",
        descripcion:"",
        CATEGORIA_TEMATICA:[
          {
            value:5,
            label:"",
            descripcion:"",
            INDICADOR:[
              {
                value:0,
                label:"",
                descripcion:"",
                urlNal:'',
                urlNalDataAlfanumerica: "",
                fieldlabelNal:[],
                fieldValueNal:"",
                leyendaNal:[],
                urlDepartal:"",
                fieldlabelDepartal:[],
                fieldValueDepartal:"",
                leyendaDepartal:[],
                url:'',
                fieldlabel:[''],
                fieldValue:'',
                leyenda:[''],
              }
            ]
          }
        ]
      }
    ]
  },
  {
    value:7,
    label:"7. De crédito agropecuario y gestión de riesgos",
    descripcion:"7. De crédito agropecuario y gestión de riesgos",
    APUESTA_ESTRATEGICA:[
      {
        value:3,
        label:"",
        descripcion:"",
        CATEGORIA_TEMATICA:[
          {
            value:5,
            label:"",
            descripcion:"",
            INDICADOR:[
              {
                value:0,
                label:"",
                descripcion:"",
                urlNal:'',
                urlNalDataAlfanumerica: "",
                fieldlabelNal:[],
                fieldValueNal:"",
                leyendaNal:[],
                urlDepartal:"",
                fieldlabelDepartal:[],
                fieldValueDepartal:"",
                leyendaDepartal:[],
                url:'',
                fieldlabel:[''],
                fieldValue:'',
                leyenda:[''],
              }
            ]
          }
        ]
      }
    ]
  }
     */
  {
    value: 8,
    label: "8. De delimitación, constitución y consolidación de territorios étnicos",
    descripcion: `8.De delimitación, constitución y consolidación de territorios indígenas y de territorios colectivos de comunidades negras, afrocolombianas,
      raizales, palenqueras y pueblo Rom, delimitación, uso, manejo y goce de los mismos, y fortalecimiento de la formación desde los saberes propios`,
    APUESTA_ESTRATEGICA: [
      {
        value: 1,
        label: "1. Formalizar los territorios ancestrales de los grupos étnicos",
        descripcion: `1. Formalizar los territorios ancestrales de los grupos étnicos, para el manejo, uso y posesión tradicional bajo los principios de la autonomía y gobierno propio.`,
        CATEGORIA_TEMATICA: [
          {
            value: 0,
            label: "8.1 Titulación de territorios de grupos étnicos",
            descripcion: `8.1 Titulación de territorios de grupos étnicos`,
            INDICADOR: [
              {
                value: 0,
                label: "8.1.1 Porcentaje de predios en territorios títulados a grupos étnicos",
                descripcion: "Porcentaje de predios en territorios títulados a grupos étnicos",
                urlNal: 'v_predios_etnicos_nacmun',
                urlNalDataAlfanumerica: "v_predios_etnicos_porcnac",
                fieldlabelNal:["cat_anio"],
                fieldValueNal:"porcentaje_predios",
                leyendaNal:["Predios por año"],
                urlDepartal:"v_predios_etnicos_depto",
                fieldlabelDepartal:["anio"],
                fieldValueDepartal:"porcentaje_predios",
                leyendaDepartal:["Predios por año"],
                url: 'v_predios_etnicos_mun',
                fieldlabel: ['anio'],
                fieldValue: 'porcentaje_predios',
                leyenda: ['Porcentaje predios títulados por año'],
              },
              {
                value: 1,
                label: "8.1.2 Porcentaje de área de predios en territorios títulados a grupos étnicos",
                descripcion: "Porcentaje de área de predios en territorios títulados a grupos étnicos",
                urlNal: 'v_predios_etnicos_nacmun',
                urlNalDataAlfanumerica: "v_predios_etnicos_porcnac",
                fieldlabelNal:["cat_anio"],
                fieldValueNal:"porcentaje_area",
                leyendaNal:["Área por año"],
                urlDepartal:"v_predios_etnicos_depto",
                fieldlabelDepartal:["anio"],
                fieldValueDepartal:"porcentaje_area",
                leyendaDepartal:["Área por año"],
                url: 'v_predios_etnicos_mun',
                fieldlabel: ['anio'],
                fieldValue: 'porcentaje_area',
                leyenda: ['Porcentaje área títulados por año'],
              }
            ]
          }
        ]
      }
    ]
  },
]