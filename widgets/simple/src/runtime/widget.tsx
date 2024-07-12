import { React, AllWidgetProps } from "jimu-core";
import { JimuMapViewComponent, JimuMapView } from 'jimu-arcgis'; // The map object can be accessed using the JimuMapViewComponent
const { useState } = React
import { Select, Option, Button, TextArea, DropdownItemProps } from 'jimu-ui'
import { JSXElementConstructor, ReactElement, useEffect } from "react";
import { CapasTematicas, ItemResponseTablaContenido, TablaDeContenidoInterface, Tematicas, TematicasCapasBisnietos, datosBasicosInterface, interfaceCapasNietos } from "widgets/consulta-avanzada/src/types/interfaces";

const Consulta_Avanzada = (props: AllWidgetProps<any>) => {
  
  const [varJimuMapView, setJimuMapView] = useState<JimuMapView>(); // To add the layer to the Map, a reference to the Map must be saved into the component state.
  const [temas, setTemas] = useState<CapasTematicas[]>([]);
  const [subtemas, setSubtemas] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [capas, setCapas] = useState<CapasTematicas[]>([]);
  const [campos, setCampos] = useState([]);
  const [valores, setValores] = useState([]);
  
  const [selectedTema, setSelectedTema] = useState<Tematicas>();
  const [selectedSubtema, setSelectedSubtema] = useState<any>();
  const [selectedGrupo, setSelectedGrupo] = useState<TematicasCapasBisnietos>();
  const [selectedCapa, setSelectedCapa] = useState('');
  const [selectedCampos, setSelectedCampos] = useState([]);
  const [selectedValores, setSelectedValores] = useState([]);
  const [searchCondition, setSearchCondition] = useState(''); 

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
    }
  };

  const handleFieldChange = (setter) => (e) => {
    console.log(e)
    // setter(e.target.value);
  };

  const handleMultipleFieldChange = (setter) => (e) => {
    const options = e.target.options;
    const selectedOptions = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedOptions.push(options[i].value);
      }
    }
    setter(selectedOptions);
  };

  const handleSearch = () => {
    // Validate form fields
    // if (!selectedTema || !selectedSubtema || !selectedGrupo || !selectedCapa || selectedCampos.length === 0 || selectedValores.length === 0) {
    //   alert('Todos los campos deben estar diligenciados.');
    //   return;
    // }
    return
    // Perform the query with the captured information
    // console.log('Querying with condition:', searchCondition);
  };

  const handleClearForm = () => {
    // setSelectedTema(null);
    // setSelectedSubtema('');
    // setSelectedGrupo('');
    // setSelectedCapa('');
    // setSelectedCampos([]);
    // setSelectedValores([]);
    // setSearchCondition('');
  };

  const handleAddCondition = (condition) => {
    // setSearchCondition(prev => `${prev} ${condition}`);
  };
 

  const traerDataTablaOntenido = async () => {
    const tematicas = await getDataTablaContenido();
    console.log(tematicas)
    setTemas(tematicas);
  }

  /**
   * realiza la consulta de la data tabla de contenido la primera vez que se renderiza el componente
   */
  useEffect(() => {
    traerDataTablaOntenido();
  }, []);

  const handleTematica = ({target}, item?: ReactElement<DropdownItemProps, string | JSXElementConstructor<any>>): void => {
    console.log(item)
    const tematicaSelected = JSON.parse(target.value)
    console.log(tematicaSelected)
    setSelectedTema(tematicaSelected);
    setSelectedSubtema(null);
    setSelectedGrupo(null);
    setSelectedCapa(null);
    setCapas([])
  }

  const handleSubtemas = ({target}, item?: ReactElement<DropdownItemProps, string | JSXElementConstructor<any>>): void => {
    console.log(item)
    const subtematicaSelected = JSON.parse(target.value)
    console.log(subtematicaSelected)
    setSelectedSubtema(subtematicaSelected)    
    if (subtematicaSelected.capasNietas[0].URL) {
      setCapas(subtematicaSelected.capasNietas)
    }else{
      setCapas([])
    }
    setSelectedCapa(null);


  }

  const handleGrupo = ({target}: any, item?: ReactElement<DropdownItemProps, string | JSXElementConstructor<any>>): void => {
    const grupoSeleccionadao = JSON.parse(target.value);
    console.log(grupoSeleccionadao)
    setSelectedGrupo(grupoSeleccionadao)
    setCapas(grupoSeleccionadao?.capasBisnietos)
  }

  return (
    <div  className="w-100 p-3 bg-primary text-white">
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds?.[0]} onActiveViewChange={activeViewChangeHandler} />
      )}

      <div className="advanced-query-widget">
        <form>
          <div className="d-flex align-items-center mt-1">
            <p style={{width:'85px'}}> Temas: </p>
            <div className="overflow-hidden flex-grow-1 ">              
              <Select
                onChange={handleTematica}
                placeholder="Seleccione tema..."
                value={JSON.stringify(selectedTema)}
              >             
              {temas.map(
                  (tematica) => (
                    <Option value={JSON.stringify(tematica)}>{tematica.NOMBRETEMATICA}</Option>
                  )
              )}
            </Select>
            </div>                          
          </div>
          <div className="d-flex align-items-center mt-1">
            <p style={{width:'85px'}}> Subtemas: </p>            
            <div className="overflow-hidden flex-grow-1 ">
              <Select
                onChange={handleSubtemas}
                placeholder="Seleccione Subtema..."
                value={JSON.stringify(selectedSubtema)}
              >
                {/* <Option header>
                  Seleccione ...
                </Option> */}
                {selectedTema?.capasHijas.map(
                  (subTema) => (
                    <Option value={JSON.stringify(subTema)}>{subTema.NOMBRETEMATICA}</Option>
                  )
              )}
              </Select>
            </div>                          
          </div>          
          {
            selectedSubtema?.capasNietas[0].capasBisnietos &&
              <div className="d-flex align-items-center mt-1">
                <p style={{width:'85px'}}> Grupos: </p>            
                <div className="overflow-hidden flex-grow-1 ">
                  <Select
                    onChange={handleGrupo}
                    placeholder="Seleccione grupo..."
                    value={JSON.stringify(selectedGrupo)}
                  >                   
                    {selectedSubtema?.capasNietas.map(
                      (capaNieta) => (
                        <Option value={JSON.stringify(capaNieta)}>{capaNieta.NOMBRETEMATICA}</Option>
                      )
                  )}
                  </Select>
                </div>                          
              </div>
          }

         {/*  {
            selectedGrupo &&
              <div className="d-flex align-items-center mt-1">
                <p style={{width:'85px'}}> Capas: </p>            
                <div className="overflow-hidden flex-grow-1 ">
                  <Select
                    onChange={(e)=>{
                      console.log(JSON.parse(e.target.value))
                      setSelectedCapa(JSON.parse(e.target.value))
                    }}
                    placeholder="Seleccione capa..."
                    value={JSON.stringify(selectedCapa)}
                  >                   
                    {selectedGrupo?.capasBisnietos.map(
                      (capa) => (
                        <Option value={JSON.stringify(capa)}>{capa.TITULOCAPA}</Option>
                      )
                    )}
                  </Select>
                </div>                          
              </div>

          } */}
          {
            capas.length > 0 &&
            <div className="d-flex align-items-center mt-1">
                <p style={{width:'85px'}}> Capas: </p>            
                <div className="overflow-hidden flex-grow-1 ">
                  <Select
                    onChange={(e)=>{
                      console.log(JSON.parse(e.target.value))
                      setSelectedCapa(JSON.parse(e.target.value))
                    }}
                    placeholder="Seleccione capa..."
                    value={JSON.stringify(selectedCapa)}
                  >                   
                    {capas.map(
                      (capa) => (
                        <Option value={JSON.stringify(capa)}>{capa.TITULOCAPA}</Option>
                      )
                    )}
                  </Select>
                </div>                          
              </div>
          }


          <div className="d-flex align-items-center mt-1">
            <p style={{width:'85px'}}> Campos: </p>            
            <div className="overflow-hidden flex-grow-1 ">
              <Select onChange={function noRefCheck(){}} size="lg">
                <Option header>
                  Seleccione ...
                </Option>
                <Option value="1">
                  <div className="text-truncate">
                    Option 1
                  </div>
                </Option>
              </Select>
            </div>                          
          </div>
          <div className="d-flex align-items-center mt-1">
            <p style={{width:'85px'}}> Valores: </p>            
            <div className="overflow-hidden flex-grow-1  mr-1">
              <Select onChange={function noRefCheck(){}} size="lg">
                <Option header>
                  Seleccione ...
                </Option>
                <Option value="1">
                  <div className="text-truncate">
                    Option 1
                  </div>
                </Option>
              </Select>
            </div>                          
            <Button
              size="default"
              type="primary"
            >
              Obtener
            </Button>
          </div>
          <div className="d-flex align-items-center mt-1">
            <p style={{width:'85px'}}> Condición de búsqueda: </p>            
            <div className="overflow-hidden flex-grow-1   mr-1">
              {/* <label>
                Condición de búsqueda: */}
                <TextArea
                  className="mb-4"
                  required
                />
              {/* </label> */}
            </div>     
              <Button
                size="default"
                type="primary"
              >
                Borrar
              </Button>
          </div>
          <div className="condition-buttons text-center">
            <Button type="primary" size="sm" onClick={() => handleAddCondition('=')}>=</Button>
            <Button type="primary" size="sm" onClick={() => handleAddCondition('BETWEEN')}>{"<>"}</Button>
            <Button type="primary" size="sm" onClick={() => handleAddCondition('>')}>&gt;</Button>
            <Button type="primary" size="sm" onClick={() => handleAddCondition('<')}>&lt;</Button>
            <Button type="primary" size="sm" onClick={() => handleAddCondition('>=')}>&gt;=</Button>
            <Button type="primary" size="sm" onClick={() => handleAddCondition('<=')}>&lt;=</Button>
            <Button type="primary" size="sm" onClick={() => handleAddCondition('LIKE')}>LIKE</Button>
            <Button type="primary" size="sm" onClick={() => handleAddCondition('AND')}>AND</Button>
            <Button type="primary" size="sm" onClick={() => handleAddCondition('OR')}>OR</Button>
            <Button type="primary" size="sm" onClick={() => handleAddCondition('NOT')}>NOT</Button>
            <Button type="primary" size="sm" onClick={() => handleAddCondition('IS')}>IS</Button>
            <Button type="primary" size="sm" onClick={() => handleAddCondition('NULL')}>NULL</Button>
          </div>                     
{/* 
          <label>
            Subtemas:
            <select value={selectedSubtema} onChange={handleFieldChange(setSelectedSubtema)}>
              {subtemas.map(subtema => <option key={subtema} value={subtema}>{subtema}</option>)}
            </select>
          </label>
          <label>
            Grupos:
            <select value={selectedGrupo} onChange={handleFieldChange(setSelectedGrupo)}>
              {grupos.map(grupo => <option key={grupo} value={grupo}>{grupo}</option>)}
            </select>
          </label>
          <label>
            Capas:
            <select value={selectedCapa} onChange={handleFieldChange(setSelectedCapa)}>
              {capas.map(capa => <option key={capa} value={capa}>{capa}</option>)}
            </select>
          </label>
          <label>
            Campos:
            <select multiple size={2} value={selectedCampos} onChange={handleMultipleFieldChange(setSelectedCampos)}>
              {campos.map(campo => <option key={campo} value={campo}>{campo}</option>)}
            </select>
          </label>
          <label>
            Valores:
            <select multiple size={2} value={selectedValores} onChange={handleMultipleFieldChange(setSelectedValores)}>
              {valores.map(valor => <option key={valor} value={valor}>{valor}</option>)}
            </select>
          </label>
          <button type="button" onClick={handleSearch}>Buscar</button>
          <button type="button" onClick={handleClearForm}>Limpiar</button>
          <textarea value={searchCondition} onChange={handleFieldChange(setSearchCondition)} placeholder="Condición de búsqueda"></textarea> */}
        </form>
        
      </div>
      
      
    </div>
  );
};

export default Consulta_Avanzada;

/**
   * En este meto se realiza la consulta del jeison de la tabla de contenido
   */
export const getDataTablaContenido = async () => {
  const url = 'https://sigquindio.gov.co:8443/ADMINSERV/AdminGeoApplication/AdminGeoWebServices/getTablaContenidoJsTree/public';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseTablaDeContenido: TablaDeContenidoInterface[] = await response.json();
    const tematicas = ordenarDataTablaContenido(responseTablaDeContenido);
    return tematicas;
  } catch (error) {
    console.error('Error fetching layers:', error);
  }
};

/**
   * En este metodo se separa las capas padres, hijas, nietas y bisnietas.
   * @param responseTablaDeContenido 
   */
const ordenarDataTablaContenido = (responseTablaDeContenido: any[] | TablaDeContenidoInterface) => {
  const tematicas:CapasTematicas[] = [];
  let capasNietos: interfaceCapasNietos = { capas: [], tematicasNietas: [] };

  const addTematica = (tematicas:CapasTematicas[], datosBasicos: datosBasicosInterface, itemResponseTablaContenido: ItemResponseTablaContenido) => {
    if (!itemResponseTablaContenido.URL) {
      tematicas.push({ ...datosBasicos, capasHijas: [] });
    } else {
      tematicas.push({
        ...datosBasicos,
        capasHijas: [{ ...datosBasicos, capasNietas: itemResponseTablaContenido.NOMBRECAPA ? [itemResponseTablaContenido] : [] }],
      });
    }
  };

  /**
   * Con este for se separa las capas padre con IDTEMATICAPADRE === 0
   */
  responseTablaDeContenido.forEach((itemResponseTablaContenido: ItemResponseTablaContenido) => {
    const datosBasicos:datosBasicosInterface = {
      IDTEMATICAPADRE: itemResponseTablaContenido.IDTEMATICAPADRE,
      IDTEMATICA: itemResponseTablaContenido.IDTEMATICA,
      NOMBRETEMATICA: itemResponseTablaContenido.NOMBRETEMATICA,
      TITULOCAPA: itemResponseTablaContenido.TITULOCAPA,
    };

    if (itemResponseTablaContenido.IDTEMATICAPADRE === 0 && itemResponseTablaContenido.NOMBRETEMATICA) {
      const tematicaExistente = tematicas.find(t => t.IDTEMATICA === itemResponseTablaContenido.IDTEMATICA);
      if (!tematicaExistente) {
        addTematica(tematicas, datosBasicos, itemResponseTablaContenido);
      } else if (itemResponseTablaContenido.NOMBRECAPA) {
        tematicaExistente.capasHijas.push({ ...datosBasicos, capasNietas: [itemResponseTablaContenido] });
      }
    }
  });

  /**
   * En este for se separa las capas nietas, capasBisnietos, y las hijas se agregan directamente al padre
   */
  responseTablaDeContenido.forEach((itemResponseTablaContenido: ItemResponseTablaContenido) => {
    const datosBasicos:datosBasicosInterface = {
      IDTEMATICAPADRE: itemResponseTablaContenido.IDTEMATICAPADRE,
      IDTEMATICA: itemResponseTablaContenido.IDTEMATICA,
      NOMBRETEMATICA: itemResponseTablaContenido.NOMBRETEMATICA,
      TITULOCAPA: itemResponseTablaContenido.TITULOCAPA,
    };

    if (itemResponseTablaContenido.IDTEMATICAPADRE > 1) {
      const tematicaPadre = tematicas.find(tematica => tematica.IDTEMATICA === itemResponseTablaContenido.IDTEMATICAPADRE);
      if (tematicaPadre) {
        let capaHija = tematicaPadre.capasHijas.find((capaHija: { IDTEMATICA: number; }) => capaHija.IDTEMATICA === itemResponseTablaContenido.IDTEMATICA);
        if (!capaHija) {
          tematicaPadre.capasHijas.push({ ...datosBasicos, capasNietas: itemResponseTablaContenido.URL ? [itemResponseTablaContenido] : [] });
        } else {
          capaHija.capasNietas.push(itemResponseTablaContenido);
        }
      } else if (validaSiExisteCApaNieto(capasNietos, itemResponseTablaContenido)) {
        const tematicaNieta = capasNietos.tematicasNietas.find(tn => tn.IDTEMATICA === itemResponseTablaContenido.IDTEMATICA);
        if (tematicaNieta) {
          tematicaNieta.capasBisnietos.push(itemResponseTablaContenido);
        } else {
          capasNietos = agregarTematicaNietaNueva(capasNietos, itemResponseTablaContenido, datosBasicos);
        }
      }
    }
  });

  /**
   * En este for se asignan las capas hijas pendientes
   */
  capasNietos.tematicasNietas.forEach(itemCapaNieta => {
    tematicas.forEach(itemTematica => {
      itemTematica.capasHijas.forEach(capaHija => {
        if (itemCapaNieta.IDTEMATICAPADRE === capaHija.IDTEMATICA) {
          capaHija.capasNietas.push(itemCapaNieta);
        }
      });
    });
  });

  // setGroupedLayers(tematicas);
  return tematicas;
}

/**
 * Metodo para validar si existe capa nieto
 * @param capasNietos 
 * @param ItemResponseTablaContenido 
 * @returns 
 */
const validaSiExisteCApaNieto = (capasNietos: interfaceCapasNietos, ItemResponseTablaContenido:ItemResponseTablaContenido) => {
  return !capasNietos.capas.some(capaNieta =>
    capaNieta.IDCAPA === ItemResponseTablaContenido.IDCAPA &&
    capaNieta.IDTEMATICA === ItemResponseTablaContenido.IDTEMATICA
  );
}

/**
 * Metodo que crea un objeto nuevo de capas y tematicas nietas
 * @param capasNietos 
 * @param ItemResponseTablaContenido 
 * @param datosBasicos 
 * @returns 
 */
const agregarTematicaNietaNueva = (capasNietos, ItemResponseTablaContenido: ItemResponseTablaContenido, datosBasicos:datosBasicosInterface) => {

  //Define una nueva capa basada en ItemResponseTablaContenido.
  const nuevaCapa = {
    IDCAPA: ItemResponseTablaContenido.IDCAPA,
    IDTEMATICA: ItemResponseTablaContenido.IDTEMATICA,
  };

  //Define una nueva temática nieta basada en datosBasicos y agrega capasBisnietos.
  const nuevaTematicaNieta = {
    ...datosBasicos,
    capasBisnietos: ItemResponseTablaContenido.URL ? [ItemResponseTablaContenido] : ['']
  };

  return {
    capas: [...capasNietos.capas, nuevaCapa],
    tematicasNietas: [...capasNietos.tematicasNietas, nuevaTematicaNieta]
  };
}