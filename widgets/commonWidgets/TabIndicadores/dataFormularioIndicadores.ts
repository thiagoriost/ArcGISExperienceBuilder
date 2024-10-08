export const DATA_Fuente_Indicadores = [
    {
      value:1,
      label: "Adquisición",
      descricion:"1. De adquisición, adjudicación de tierras y de procesos agrarios para la reforma agraria, y garantía de derechos territoriales de los campesinos, pueblos indígenas y de las comunidades negras, afrocolombianas, raizales, palenqueras y pueblo Rom",
      APUESTA_ESTRATEGICA:[    
        {
          value:1,
          label:"Estrategia de acceso a la tierra",
          descricion:"1. Implementar la estretegia de acceso a la tierra por medio del programa especial de adquisición de tierras para la producción de alimentos y otros instrumentos y materializar el Plan Nacional de Formalización Masiva de la Propiedad Rural.",
          CATEGORIA_TEMATICA:[
            {
              value:0,
              label:"Disposición de predios",
              descricion:"1.1 Disposición de predios para la Reforma Agraria",
              INDICADOR:[
                {
                  value:0,
                  label:"Cantidad predios fondo tierras RA",
                  descricion:"Cantidad de predios en el Fondo de Tierras para la Reforma Agraria",
                  url:"v_predios_fondo_tierras_mun",
                  urlNal:"v_predios_fondo_tierras_nacmun",
                  fieldlabel:["tipo_predio", "anio"], // con esto se especifica la cantidad de graficas q se desplegaran segun la data de cada feature
                  fieldValue:"cantidad_predios",// estees el valor que tomara generar las cantidades para cada label
                  leyenda:["Cantidad de predios por tipo","Cantidad de predios por año"] // las leyendas para cada label
                },
                {
                  value:1,
                  label:"Cantidad de área",
                  descricion:"Cantidad de área dispuesta en el Fondo de Tierras para la Reforma Agraria",
                  url:"v_predios_fondo_tierras_mun",
                  urlNal:"v_predios_fondo_tierras_nacmun",
                  fieldlabel:["tipo_predio", "anio"],
                  fieldValue:"total_area_ha",
                  leyenda:["Cantidad de área por tipo","Cantidad de área por año"]
                },
                {
                  value:2,
                  label:"Inventario Predios Nacional de Baldíos",
                  descricion:"Cantidad de predios en el Inventario Nacional de Baldíos",
                  url:"v_predios_inventario_baldios_mun",
                  urlNal:"v_predios_inv_baldios_nacmun",
                  fieldlabel:["destinacion_predio", "anio"],
                  fieldValue:"cantidad_predios",
                  leyenda:["Cantidad de predios por destino","Cantidad de predios por año"]
                },
                {
                  value:3,
                  label:"Inventario Årea Nacional de Baldíos",
                  descricion:"Cantidad de área en el Inventario Nacional de Baldíos",
                  url:"v_predios_inventario_baldios_mun",
                  urlNal:"v_predios_inv_baldios_nacmun",
                  fieldlabel:["destinacion_predio", "anio"],
                  fieldValue:"total_area_ha",
                  leyenda:["Cantidad de área por destino","Cantidad de área por año"]
                }
              ]
            },
            {
              value:1,
              label:"Acceso a tierra",
              descricion:"1.2 Acceso a tierra",
              INDICADOR:[
                {
                  value:0,
                  label:"Predios adjudicados",
                  descricion:"Cantidad de predios adjudicados",
                  url:"v_predios_adjudicados_mun",
                  urlNal:"v_predios_adjudicados_macmun",
                  fieldlabel:["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                  fieldValue:"cantidad_predios",
                  leyenda:["Predios adjudicados por año","Predios adjudicados por beneficiario ","Predios adjudicados por tipo de género"]
                },
                {
                  value:1,
                  label:"Årea de predios adjudicados",
                  descricion:"Cantidad de área de predios adjudicados",
                  url:"v_predios_adjudicados_mun",
                  urlNal:"v_predios_adjudicados_macmun",
                  fieldlabel:["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                  fieldValue:"total_area_ha",
                  leyenda:["Área adjudicada por año","Área adjudicada por beneficiario ","Área adjudicada por tipo de género"]
                },
                {
                  value:2,
                  label:"Predios baldíos adjudicados",
                  descricion:"Cantidad de predios baldíos adjudicados",
                  url:"v_predios_adj_baldios_mun",
                  urlNal:"v_predios_adj_baldios_nacmun",
                  fieldlabel:["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                  fieldValue:"cantidad_predios",
                  leyenda:["Predios por año","Predios por beneficiario ","Predios por tipo de género"]
                },
                {
                  value:3,
                  label:"Área de predios baldíos adjudicados",
                  descricion:"Cantidad de área de predios baldíos adjudicados",
                  url:"v_predios_adj_baldios_mun",
                  urlNal:"v_predios_adj_baldios_nacmun",
                  fieldlabel:["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                  fieldValue:"total_area_ha",
                  leyenda:["Área por año","Área por beneficiario ","Área por tipo de género"]
                },
                {
                  value:4,
                  label:"Bienes Fiscales Patrimoniales adjudicados",
                  descricion:"Cantidad de Bienes Fiscales Patrimoniales adjudicados",
                  url:"v_bienes_fiscales_adj_mun",
                  urlNal:"v_bienes_fiscales_adj_nacmun",
                  fieldlabel:["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                  fieldValue:"cantidad_predios",
                  leyenda:["Predios por año","Predios por beneficiario ","Predios por tipo de género"]
                },
                {
                  value:5,
                  label:"Área de Bienes Fiscales Patrimoniales adjudicados",
                  descricion:"Cantidad de área de Bienes Fiscales Patrimoniales adjudicados",
                  url:"v_bienes_fiscales_adj_mun",
                  urlNal:"v_bienes_fiscales_adj_nacmun",
                  fieldlabel:["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                  fieldValue:"total_area_ha",
                  leyenda:["Área por año","Área por beneficiario ","Área por tipo de género"]
                },
                {
                  value:6,
                  label:"Beneficiarios de subsidios integrales para la compra de tierras",
                  descricion:"Cantidad de predios beneficiarios de subsidios integrales para la compra de tierras",
                  url:"v_predios_sub_integrales_mun",
                  urlNal:"v_predios_sub_integrales_nacmun",
                  fieldlabel:["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                  fieldValue:"cantidad_predios",
                  leyenda:["Predios por año","Predios por beneficiario ","Predios por tipo de género"]
                },
                {
                  value:7,
                  label:"Årea de predios beneficiarios de subsidios integrales para la compra de tierras",
                  descricion:"Cantidad de área de predios beneficiarios de subsidios integrales para la compra de tierras",
                  url:"v_predios_sub_integrales_mun",
                  urlNal:"v_predios_sub_integrales_nacmun",
                  fieldlabel:["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                  fieldValue:"total_area_ha",
                  leyenda:["Área por año","Área por beneficiario ","Área por tipo de género"]
                },
                {
                  value:8,
                  label:"Predios entregados a través del Fondo de Tierras",
                  descricion:"Cantidad de predios entregados a través del Fondo de Tierras",
                  url:" v_predios_entregados_ft_mun",
                  urlNal:" v_predios_entregados_ft_nacmun",
                  fieldlabel:["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                  fieldValue:"cantidad_predios",
                  leyenda:["Predios por año","Predios por beneficiario ","Predios por tipo de género"]
                },
                {
                  value:9,
                  label:"Årea entregada a través del Fondo de Tierras",
                  descricion:"Cantidad de área entregada a través del Fondo de Tierras",
                  url:" v_predios_entregados_ft_mun",
                  urlNal:" v_predios_entregados_ft_nacmun",
                  fieldlabel:["cat_anio_adjudicacion", "tipo_beneficiario", "genero_beneficiario"],
                  fieldValue:"total_area_ha",
                  leyenda:["Área por año","Área por beneficiario ","Área por tipo de género"]
                }
              ]
            },
            {
              value:2,
              label:"Ordenamiento Social de la Propiedad",
              descricion:"1.3 Ordenamiento Social de la Propiedad",
              INDICADOR:[
                {
                  value:0,
                  label:"Porcentaje de predios",
                  descricion:"Porcentaje de predios con área por encima de la UAF mínima municipal",
                  url:'v_predios_uaf_mun',
                  urlNal:'v_predios_uaf_nacmun',
                  fieldlabel:['anio'],
                  fieldValue:'porcentaje_predios',
                  leyenda:['Porcentaje de predios'],
                  
                },
                {
                  value:1,
                  label:"Porcentaje de área",
                  descricion:"Porcentaje de área de predios por encima de la UAF mínima municipal",
                  url:'v_predios_uaf_mun',
                  urlNal:'v_predios_uaf_nacmun',
                  fieldlabel:['anio'],
                  fieldValue:'porcentaje_area',
                  leyenda:['Porcentaje de área'],
                }
              ]
            },
            {
              value:3,
              label:"Formalización",
              descricion:"1.4 Formalización",
              INDICADOR:[
                {
                  value:0,
                  label:"Cantidad de predios",
                  descricion:"Cantidad de predios formalizados",
                  url:"v_predios_formalizados_mun",
                  urlNal:"v_predios_formalizados_nacmun",
                  fieldlabel:["tipo_beneficiario", "genero_beneficiario", "cat_anio_formalizado"],
                  fieldValue:"cantidad_predios",
                  leyenda:["Predios por tipo","Predios por genero" ,"Predios por año"]
                },
                {
                  value:1,
                  label:"Cantidad de área",
                  descricion:"Cantidad de área de predios formalizados",
                  url:"v_predios_formalizados_mun",
                  urlNal:"v_predios_formalizados_nacmun",
                  fieldlabel:["tipo_beneficiario", "genero_beneficiario", "cat_anio_formalizado"],
                  fieldValue:"total_area_ha",
                  leyenda:["Área por tipo","Área por genero" ,"Área por año"]
                },
                {
                  value:2,
                  label:"Cantidad de predios a mujeres",
                  descricion:"Cantidad de predios formalizados a mujeres",
                  url:"v_predios_formal_mujeres_mun",
                  urlNal:"v_predios_for_mujeres_nacmun",
                  fieldlabel:["cat_anio_formalizado"],
                  fieldValue:"cantidad_predios",
                  leyenda:["Predios por año"]
                },
                {
                  value:3,
                  label:"Cantidad de área a mujeres",
                  descricion:"Cantidad de área de predios formalizados a mujeres",
                  url:"v_predios_formal_mujeres_mun",
                  urlNal:"v_predios_for_mujeres_nacmun",
                  fieldlabel:["cat_anio_formalizado"],
                  fieldValue:"total_area_ha",
                  leyenda:["Área por año"]
                }
              ]
            }
          ]
        },
        /* {
          value:2,
          label:"Ordenar el suelo rural",
          descricion:"2. Ordenar el suelo rural agropecuario y avanzar en los procesos de actualización catastral con enfoque multipropósito.",
          CATEGORIA_TEMATICA:[
            {
              value:0,
              label:"Actualización catastral",
              descricion:"1.5 Actualización catastral",
              INDICADOR:[
                {
                  value:0,
                  label:"Porcentaje de predios",
                  descricion:"Porcentaje de predios actualizados",
                  url:'',
                  urlNal:'',
                  fieldlabel:[''],
                  fieldValue:'',
                  leyenda:[''],
                },
                {
                  value:1,
                  label:"Porcentaje de área",
                  descricion:"Porcentaje de área de predios actualizados",
                  url:'',
                  urlNal:'',
                  fieldlabel:[''],
                  fieldValue:'',
                  leyenda:[''],
                },
                {
                  value:2,
                  label:"Cantidad de municipios",
                  descricion:"Cantidad de municipios actualizados en cada vigencia",
                  url:'',
                  urlNal:'',
                  fieldlabel:[''],
                  fieldValue:'',
                  leyenda:[''],
                },
                {
                  value:3,
                  label:"Número de municipios",
                  descricion:"Número de municipios formados en cada vigencia",
                  url:'',
                  urlNal:'',
                  fieldlabel:[''],
                  fieldValue:'',
                  leyenda:[''],
                }
              ]
            },
          ]
        }, */
        {
          value:3,
          label:"Ejecutar la política de restitución de tierras",
          descricion:"3. Ejecutar la política de restitución de tierras.",
          CATEGORIA_TEMATICA:[
            {
              value:0,
              label:"Restitución de tierras",
              descricion:"1.7 Restitución de tierras",
              INDICADOR:[
                {
                  value:0,
                  label:"Cantidad de predios",
                  descricion:"Cantidad de predios asociados a solicitudes de inscripción al Registro de Tierras Despojadas y Abandonadas Forzosamente",
                  url:'v_predios_restierras_mun',
                  urlNal:'v_predios_restierras_nacmun',
                  fieldlabel:['pdet', 'nucleo_reforma'],
                  fieldValue:'cantidad_predios',
                  leyenda:['Cantidad de predios por PDET', 'Cantidad de predios por reforma'],
                }
              ]
            }
          ]
        },      
      ],
    },
    {
      value:2,
      label:"Delimitación de zonas de reserva",
      descricion:"2. De delimitación, constitución y consolidación de zonas de reserva campesina, delimitación, uso y manejo de playones y sabanas comunales y de organización y capacitación campesina",
      APUESTA_ESTRATEGICA:[
        {
          value:0,
          label:"Delimitar, consolidar y constituir las zonas de reserva",
          descricion:"1. Delimitar, consolidar y constituir las zonas de reserva campesina como territorialidad cuyo ordenamiento territorial se presta para frenar la expansión de la frontera agrícola, servir para la conservación ambiental y potenciar la producción de alimentos ",
          CATEGORIA_TEMATICA:[
            {
              value:0,
              label:"Constitución de ZRC",
              descricion:"2.1 Constitución de ZRC",
              INDICADOR:[
                {
                  value:0,
                  label:"Porcentaje de predios",
                  descricion:"Porcentaje de predios en Zonas de Reserva Campesina",
                  url:'v_predios_zrc_mun',
                  urlNal:'v_predios_zrc_nacmun',
                  fieldlabel:['anio'],
                  fieldValue:'porcentaje_predios',
                  leyenda:['Porcentaje de predios por año'],
                },
                {
                  value:1,
                  label:"Porcentaje de área",
                  descricion:"Porcentaje de área de predios en Zonas de Reserva Campesina",
                  url:'v_predios_zrc_mun',
                  urlNal:'v_predios_zrc_nacmun',
                  fieldlabel:['anio'],
                  fieldValue:'porcentaje_area',
                  leyenda:['Porcentaje de área por año'],
                }
              ]
            }
          ]
        }
      ]
    },
    {
      value:3,
      label:"Ordenamiento Territorial",
      descricion:"3. De ordenamiento territorial y solución de conﬂictos socioambientales para la reforma agraria",
      APUESTA_ESTRATEGICA:[
        {
          value:0,
          label:"Resolución de Conflictos",
          descricion:"1. Resolución de Conflictos socioambientales en áreas de especial importancia ambiental, mediante la regularización del uso, ocupación y tenencia hacia el uso sostenible y la protección de los recursos naturales",
          CATEGORIA_TEMATICA:[
            {
              value:0,
              label:"Distribución de la tierra",
              descricion:"3.1 Distribución de la tierra",
              INDICADOR:[
                {
                  value:0,
                  label:"Índice de Gini de la propiedad",
                  descricion:"Índice de Gini de la propiedad",
                  url:'v_indice_gini_ids_mun',
                  urlNal:'v_indice_gini_ids_nacmun',
                  fieldlabel:['anio_vigencia','destino','categoria_gini','categoria_ids'],
                  fieldValue:'gini',
                  leyenda:['Indice Gini por año','Indice Gini por destino','Indice Gini por categoria', 'Indice Gini por ids',],
                },
                {
                  value:1,
                  label:"Índice de Disparidad Superior - IDS",
                  descricion:"Índice de Disparidad Superior - IDS",
                  url:'v_indice_gini_ids_mun',
                  urlNal:'v_indice_gini_ids_nacmun',
                  fieldlabel:['anio_vigencia','destino','categoria_gini','categoria_ids'],
                  fieldValue:'disparidad_superior',
                  leyenda:['Indice de Disparidad por año','Indice de Disparidad por destino','Indice de Disparidad por categoria', 'Indice de Disparidad por ids',],
                }
              ]
            },
            {
              value:1,
              label:"Conflictos de uso del suelo",
              descricion:"3.2 Conflictos de uso",
              INDICADOR:[
                {
                  value:0,
                  label:"Porcentaje predios presunta subutilización del uso del suelo",
                  descricion:"Porcentaje de predios con presunta subutilización en el uso del suelo",
                  url:'v_predios_conflicto_mun',
                  urlNal:'v_predios_conflicto_nacmun',
                  fieldlabel:['categoria_conflicto_uso'],
                  fieldValue:'porcentaje_predios',
                  leyenda:['Porcentaje de predios por categoria'],
                },
                {
                  value:1,
                  label:"Porcentaje predios, Territorios ley 2da",
                  descricion:"Porcentaje de predios en Territorios con ley 2da",
                  url:'v_predios_ley2da_mun',
                  urlNal:'v_predios_ley2da_nacmun',
                  fieldlabel:['anio'],
                  fieldValue:'porcentaje_predios',
                  leyenda:['Porcentaje de predios por año'],
                }
              ]
            }
          ]
        }
      ]
    },
    /* {
      value:5,
      label:"Investigación",
      descricion:"5. De investigación, asistencia técnica, capacitación, transferencia de tecnología y diversiﬁcación de cultivos",
      APUESTA_ESTRATEGICA:[
        {
          value:3,
          label:"Desarrollar instrumentos de innovación",
          descricion:"3. Desarrollar instrumentos de innovación en extensión agropecuaria hacia el reconocimiento de la diversidad de saberes y conocimientos.",
          CATEGORIA_TEMATICA:[
            {
              value:5,
              label:"Asistencia técnica",
              descricion:"5.1 Asistencia técnica",
              INDICADOR:[
                {
                  value:0,
                  label:"Cantidad de esquemas",
                  descricion:"Cantidad de esquemas de asistencia técnica implementados",
                  url:'',
                  urlNal:'',
                  fieldlabel:[''],
                  fieldValue:'',
                  leyenda:[''],
                }
              ]
            }
          ]
        }
      ]
    }, */
    {
      value:8,
      label:"Delimitación de territorios",
      descricion:`8.De delimitación, constitución y consolidación de territorios indígenas y de territorios colectivos de comunidades negras, afrocolombianas,
      raizales, palenqueras y pueblo Rom, delimitación, uso, manejo y goce de los mismos, y fortalecimiento de la formación desde los saberes propios`,
      APUESTA_ESTRATEGICA:[
        {
          value:1,
          label:"Formalizar los territorios ancestrales",
          descricion:`1. Formalizar los territorios ancestrales de los grupos étnicos, para el manejo, uso y posesión tradicional bajo los principios de la autonomía y gobierno propio.`,
          CATEGORIA_TEMATICA:[
            {
              value:0,
              label:"Titulación territorios grupos étnicos",
              descricion:`8.1 Titulación de territorios de grupos étnicos`,
              INDICADOR:[
                {
                  value:0,
                  label:"Porcentaje predios títulados a grupos étnicos",
                  descricion:"Porcentaje de predios en territorios títulados a grupos étnicos",
                  url:'v_predios_etnicos_mun',
                  urlNal:'v_predios_etnicos_nacmun',
                  fieldlabel:['anio'],
                  fieldValue:'porcentaje_predios',
                  leyenda:['Porcentaje predios títulados por año'],
                },
                {
                  value:1,
                  label:"Porcentaje área títulada a grupos étnicos",
                  descricion:"Porcentaje de área de predios en territorios títulados a grupos étnicos",
                  url:'v_predios_etnicos_mun',
                  urlNal:'v_predios_etnicos_nacmun',
                  fieldlabel:['anio'],
                  fieldValue:'porcentaje_area',
                  leyenda:['Porcentaje área títulados por año'],
                }
              ]
            }
          ]
        }
      ]
    },
  ]