import React, { useEffect, useState } from 'react'
import { Button } from 'jimu-ui'
import { appActions } from 'jimu-core';

const DATA = [
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
                label:"Predios fondo tierras RA",
                descricion:"Cantidad de predios en el Fondo de Tierras para la Reforma Agraria",
              },
              {
                value:1,
                label:"Cantidad de área",
                descricion:"Cantidad de área dispuesta en el Fondo de Tierras para la Reforma Agraria",
              },
              {
                value:2,
                label:"Predios Inventario Nacional de Baldíos",
                descricion:"Cantidad de predios en el Inventario Nacional de Baldíos",
              },
              {
                value:3,
                label:"Årea en el Inventario Nacional de Baldíos",
                descricion:"Cantidad de área en el Inventario Nacional de Baldíos",
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
              },
              {
                value:1,
                label:"Årea de predios adjudicados",
                descricion:"Cantidad de área de predios adjudicados",
              },
              {
                value:2,
                label:"Predios baldíos adjudicados",
                descricion:"Cantidad de predios baldíos adjudicados",
              },
              {
                value:3,
                label:"Årea de predios baldíos adjudicados",
                descricion:"Cantidad de área de predios baldíos adjudicados",
              },
              {
                value:4,
                label:"Bienes Fiscales Patrimoniales adjudicados",
                descricion:"Cantidad de Bienes Fiscales Patrimoniales adjudicados",
              },
              {
                value:5,
                label:"Årea de Bienes Fiscales Patrimoniales adjudicados",
                descricion:"Cantidad de área de Bienes Fiscales Patrimoniales adjudicados",
              },
              {
                value:6,
                label:"Beneficiarios de subsidios integrales para la compra de tierras",
                descricion:"Cantidad de predios beneficiarios de subsidios integrales para la compra de tierras",
              },
              {
                value:7,
                label:"Årea de predios beneficiarios de subsidios integrales para la compra de tierras",
                descricion:"Cantidad de área de predios beneficiarios de subsidios integrales para la compra de tierras",
              },
              {
                value:8,
                label:"Predios entregados a través del Fondo de Tierras",
                descricion:"Cantidad de predios entregados a través del Fondo de Tierras",
              },
              {
                value:9,
                label:"Årea entregada a través del Fondo de Tierras",
                descricion:"Cantidad de área entregada a través del Fondo de Tierras",
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
              },
              {
                value:1,
                label:"Porcentaje de área",
                descricion:"Porcentaje de área de predios por encima de la UAF mínima municipal",
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
              },
              {
                value:1,
                label:"Cantidad de área",
                descricion:"Cantidad de área de predios formalizados",
              },
              {
                value:2,
                label:"Cantidad de predios a mujeres",
                descricion:"Cantidad de predios formalizados a mujeres",
              },
              {
                value:3,
                label:"Cantidad de área a mujeres",
                descricion:"Cantidad de área de predios formalizados a mujeres",
              }
            ]
          }
        ]
      },
      {
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
              },
              {
                value:1,
                label:"Porcentaje de área",
                descricion:"Porcentaje de área de predios actualizados",
              },
              {
                value:2,
                label:"Cantidad de municipios",
                descricion:"Cantidad de municipios actualizados en cada vigencia",
              },
              {
                value:3,
                label:"Número de municipios",
                descricion:"Número de municipios formados en cada vigencia",
              }
            ]
          },
        ]
      },
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
              },
              {
                value:1,
                label:"Porcentaje de área",
                descricion:"Porcentaje de área de predios en Zonas de Reserva Campesina",
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
              },
              {
                value:1,
                label:"Índice de Disparidad Superior - IDS",
                descricion:"Índice de Disparidad Superior - IDS",
              }
            ]
          },
          {
            value:1,
            label:"Conflictos de uso",
            descricion:"3.2 Conflictos de uso",
            INDICADOR:[
              {
                value:0,
                label:"Porcentaje predios presunta subutilización del uso del suelo",
                descricion:"Porcentaje de predios con presunta subutilización en el uso del suelo",
              },
              {
                value:1,
                label:"Porcentaje predios, Territorios ley 2da",
                descricion:"Porcentaje de predios en Territorios con ley 2da",
              }
            ]
          }
        ]
      }
    ]
  },
  {
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
              }
            ]
          }
        ]
      }
    ]
  },
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
              },
              {
                value:1,
                label:"Porcentaje área títulada a grupos étnicos",
                descricion:"Porcentaje de área de predios en territorios títulados a grupos étnicos",
              }
            ]
          }
        ]
      }
    ]
  },
]

const TabIndicadores: React.FC<any> = ({dispatch}) => {

  const [contador, setContador] = useState(0);
  const [widgetModules, setWidgetModules] = useState(null);

  const [subsitemas, setSubsitemas] = useState(DATA);
  const [selectSubSistema, setSelectSubSistema] = useState(undefined)

  const [apuestaEstrategica, setApuestaEstrategica] = useState(null);
  const [selectApuestaEstategica, setSelectApuestaEstategica] = useState(undefined);

  const [categoriaTematica, setCategoriaTematica] = useState(null);
  const [selectCategoriaTematica, setSelectCategoriaTematica] = useState(undefined);

  const [indicadores, setIndicadores] = useState(null);
  const [selectindIcadores, setSelectindIcadores] = useState(undefined)



  const handleIncreDecreButton = (dato) => {
      console.log({dato})
      const result = contador + dato
      console.log({result})
      setContador(result)
      const widgetID_Indicadores = 'widget_42'
      dispatch(appActions.widgetStatePropChange(widgetID_Indicadores, "contador", result))
  }

  const getSubsistema = ({target}) => {
    setSelectApuestaEstategica(undefined);
    setSelectCategoriaTematica(undefined)
    setSelectindIcadores(undefined)
    console.log((subsitemas.find(e => e.value == target.value)));
    setApuestaEstrategica(subsitemas.find(e => e.value == target.value));
    setSelectSubSistema(subsitemas.find(e => e.value == target.value));
    setCategoriaTematica(null)
    setIndicadores(null)
  };
  const getApuestaEstrategica = ({target}) => {
    console.log(target.value)
    setSelectCategoriaTematica(undefined);
    setSelectindIcadores(undefined)
    console.log("APUESTA_ESTRATEGICA")
    console.log(apuestaEstrategica.APUESTA_ESTRATEGICA.find(e => e.value == target.value))
    setSelectApuestaEstategica(apuestaEstrategica.APUESTA_ESTRATEGICA.find(e => e.value == target.value))
    setCategoriaTematica(apuestaEstrategica.APUESTA_ESTRATEGICA.find(e => e.value == target.value))
    setIndicadores(null)
  };
  const getCategoriaTematica = ({target}) => {
    console.log(target.value)
    setSelectindIcadores(undefined)
    console.log("CATEGORIA_TEMATICA")
    console.log(categoriaTematica.CATEGORIA_TEMATICA.find(e => e.value == target.value))
    setIndicadores(categoriaTematica.CATEGORIA_TEMATICA.find(e => e.value == target.value));
    setSelectCategoriaTematica(categoriaTematica.CATEGORIA_TEMATICA.find(e => e.value == target.value));
  };
  const getIndicador = ({target}) => {
    console.log(target.value)
    console.log("INDICADOR")
    console.log(indicadores.INDICADOR.find(e => e.value == target.value))
    setSelectindIcadores(indicadores.INDICADOR.find(e => e.value == target.value))
  };
  const consultar= () =>{
    console.log(
      {
        subsitemas,
        apuestaEstrategica,
        categoriaTematica,
        indicadores,
        selectSubSistema,
        selectApuestaEstategica,
        selectCategoriaTematica,
        selectindIcadores,
      }
    )
  }
  const formularioIndicadores = () => {    

    return (
      <>
        { widgetModules?.INPUTSELECT(subsitemas, getSubsistema, selectSubSistema?.value, "Sub Sitema") }

        { (apuestaEstrategica && widgetModules) &&
            widgetModules.INPUTSELECT(apuestaEstrategica, getApuestaEstrategica, selectApuestaEstategica?.value, "Apuesta Estrategica","APUESTA_ESTRATEGICA")
        }
        { (categoriaTematica && widgetModules)&&
            widgetModules.INPUTSELECT(categoriaTematica, getCategoriaTematica, selectCategoriaTematica?.value, "Categoría Temática","CATEGORIA_TEMATICA")
        }
        { (indicadores && widgetModules)&&
            widgetModules.INPUTSELECT(indicadores, getIndicador, selectindIcadores?.value, "Indicador","INDICADOR")
        } 
        <Button
          size="sm"
          type="default"
          onClick={consultar}
          className="mb-4"
        >
          Consultar
        </Button>
      </>
    )
  }

  useEffect(() => {
      import('../widgetsModule').then(modulo => setWidgetModules(modulo));
      return () => {
        // Acción a realizar cuando el widget se cierra.
        console.log('El widget se cerrará');
      };
  }, []);

  return (
    <div className="">
       
        Contador {contador}
        <br />
        <Button onClick={()=>handleIncreDecreButton(1)}>Increment</Button>
        <Button onClick={()=>handleIncreDecreButton(-1)}>Decrement</Button>
        {
          formularioIndicadores()
        }
    </div>
  )
}

export default TabIndicadores