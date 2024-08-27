import React, { useEffect, useState, useRef, useCallback } from 'react';
import { AllWidgetProps } from "jimu-core";
import { JimuMapViewComponent, JimuMapView, loadArcGISJSAPIModules } from 'jimu-arcgis';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Bubble, Line } from 'react-chartjs-2';
import { loadModules } from 'esri-loader';
import { InterfaceFeatureSelected } from '../types/interfacesIndicadores';
import { PieChart } from 'jimu-ui/advanced/lib/chart/pie';
import '../styles/style.css'
import { Pagination } from 'jimu-ui';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
);

interface Grafico {
  label: string;
  value: number;
}

const tiposGraficos: Grafico[] = [
  { label: "Vertical Bar Chart", value: 0 },
  { label: "Horizontal Bar Chart", value: 1 },
  { label: "Area Chart", value: 2 },
  { label: "Bubble Chart", value: 3 },
];



const Indicadores = (props: AllWidgetProps<any>) => {
  const [jimuMapView, setJimuMapView] = useState<JimuMapView>();
  const [initialExtent, setInitialExtent] = useState(null);
  const [utilsModule, setUtilsModule] = useState<any>(null);
  // const [widgetModules, setWidgetModules] = useState<any>(null);
  const [graficoSeleccionado, setGraficoSeleccionado] = useState<number | null>(null);
  const [dataGrafico, setDataGrafico] = useState<any>([]);
  const [dataGraficByAnnual, setDataGraficByAnnual] = useState(undefined);
  const [options, setOptions] = useState<any>(null);
  const [selectedData, setSelectedData] = useState<any>(null);
  /* const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Indicator',
        data: [],
        backgroundColor: 'rgba(75,192,192,0.6)'
      }
    ]
  }); */
  const [featureSelected, setFeatureSelected] = useState<InterfaceFeatureSelected>(null);
  const [responseQueryCapa, setResponseQueryCapa] = useState(null)
  const [contador, setContador] = useState();
  const [poligonoSeleccionado, setPoligonoSeleccionado] = useState(undefined);
  const [currentpage, setCurrentpage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  const chartRef = useRef(null);

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
      setInitialExtent(jmv.view.extent);
    }
  };

  const handleChartClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (chartRef.current) {
      /* const chart = chartRef.current;
      if (utilsModule.logger()) console.log(featureSelected.attributes)
      const points = chart.getElementsAtEventForMode(event.nativeEvent, 'nearest', { intersect: true }, true);
      if (points.length) {
        const firstPoint = points[0];
        const label = chart.data.labels.length>0 ? chart.data.labels[firstPoint.index] : '';
        const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
        const datasetLabel = chart.data.datasets[firstPoint.datasetIndex].label;
        if (utilsModule.logger()) console.log({ label, value, datasetLabel })
        setSelectedData({ label, value, datasetLabel,...featureSelected.attributes });
      }else{
        setSelectedData(null);
      } */
    }/* else{
      setSelectedData(null);
    } */
  };

  const getDataLayerToRenderGrafic = (_featureSelected: InterfaceFeatureSelected) => {
    if (utilsModule.logger()) console.log({_featureSelected, responseQueryCapa})
    const logica = (attToFilter) => {
      attToFilter.forEach(att => {
          const data = [];
          const filter = responseQueryCapa.features.filter(e => e.attributes[att] == _featureSelected.attributes[att])
          filter.forEach(e => data.push(e.attributes))
          if (utilsModule.logger()) console.log(data)
          const distributionByDepartment = data.reduce((acc, curr) => {
            acc[curr.DEPARTAMEN] = (acc[curr.DEPARTAMEN] || 0) + 1;
            return acc;
          }, {});
         
          if (utilsModule.logger())console.log("Distribución por Departamento:", distributionByDepartment);
          
          // Distribución por Municipio
          const distributionByMunicipio = data.reduce((acc, curr) => {
            acc[curr.MUNICIPIO] = (acc[curr.MUNICIPIO] || 0) + 1;
            return acc;
          }, {});
          
          if (utilsModule.logger())console.log("Distribución por Municipio:", distributionByMunicipio);
          
          // Diversidad de Municipios en un Departamento
          const diversityByDepartment = data.reduce((acc, curr) => {
            acc[curr.DEPARTAMEN] = acc[curr.DEPARTAMEN] || new Set();
            acc[curr.DEPARTAMEN].add(curr.MUNICIPIO);
            return acc;
          }, {});
          
          const diversityCountByDepartment = Object.keys(diversityByDepartment).map(depart => ({
            DEPARTAMEN: depart,
            numMunicipios: diversityByDepartment[depart].size
          }));
          
          if (utilsModule.logger())console.log("Diversidad de Municipios por Departamento:", diversityCountByDepartment);
          
          // Concentración por PCC
          const concentrationByPCC = data.reduce((acc, curr) => {
            acc[curr.PCC] = (acc[curr.PCC] || 0) + 1;
            return acc;
          }, {});
          const labels = Object.keys(concentrationByPCC);
          const values = Object.values(concentrationByPCC);
          
          if (utilsModule.logger())console.log("Concentración por PCC:", concentrationByPCC);
          const chartData = {
            labels: labels,
            datasets: [
              {
                label: 'Concentración por PCC',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
              },
            ],
          };
          setDataGrafico(chartData)
          const options = {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                enabled: true
              },
              datalabels: {
                anchor: 'end',
                align: 'top',
                formatter: Math.round,
                font: {
                  weight: 'bold'
                }
              },
              title: {
                display: true,
                text: 'Concentración por PCC',
              },
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            },
          };
          setOptions(options)
          setGraficoSeleccionado(0)
      })
      
    }
    logica([/* "DEPARTAMEN"  ,*/ "MUNICIPIO"/*, "VEREDA", "PCC" */]);
  }

  const _fixDataToRenderGrafig = ({poligonoSeleccionado, selectIndicadores, departmentSelect }) => {
    
    const {geometry, symbol, attributes, popupTemplate}=poligonoSeleccionado;
    const {fieldlabel, fieldValue, leyenda, descricion } = selectIndicadores;
    if (utilsModule.logger())console.log({fieldlabel, fieldValue, leyenda, descricion, geometry, symbol, attributes, popupTemplate});
    const generateChartData = (data, fieldlabel, fieldValue, leyenda) => {
      // const parsedData = JSON.parse(data);
      const labels = [];
      const metaData = {};
      if (!data) {
        if (utilsModule.logger())console.error("El poligono seleccionada no presenta atributos");
        return {
          labels: ["Sin data"], // Ordenar etiquetas para asegurar consistencia
          datasets: [
            {
              label: "El municipio seleccionado no presenta información",
              // label: 'Cantidad de Predios',
              data: [0],
              backgroundColor: getRandomRGBA(),
            },
          ],
        };
      }else if(!departmentSelect){ // para la grafica a nivel nacional

        const ajusteLeyenda = (leyenda =="Cantidad de predios por tipo" || leyenda =='Cantidad de área por tipo') ? 
        leyenda.replace("por tipo", "").trim()
        :leyenda;
        return {
          labels:[fieldValue],//: labels.sort(), // Ordenar etiquetas para asegurar consistencia
          datasets: [
            {
              label: fieldValue,
              // label: 'Cantidad de Predios',
              data: [data[fieldValue]],
              backgroundColor: getRandomRGBA(),
            },
          ],
        };
      }else{
        data.forEach(item => {
          // const { tipo_predio, cantidad_predios } = item.attributes;
          // const { fieldlabel, fieldValue } = item.attributes;
          const findLabel = item.attributes[fieldlabel];
          const findValues = item.attributes[fieldValue];
      
          // Añadir fieldlabel a las etiquetas si no está presente
          if (!labels.includes(findLabel)) {
            labels.push(findLabel);
            metaData[findLabel] = 0;
          }
      
          // Sumar findValues al findLabel correspondiente
          metaData[findLabel] += findValues;
        });
      
        const dataValues = labels.map(label => metaData[label]);
        
  
        return {
          labels,//: labels.sort(), // Ordenar etiquetas para asegurar consistencia
          datasets: [
            {
              label: leyenda,
              // label: 'Cantidad de Predios',
              data: dataValues,
              backgroundColor: getRandomRGBA(),
            },
          ],
        };
      }
    
      /* return {
        labels: labels.sort(), // Ordenar etiquetas para asegurar consistencia
        datasets,
      }; */
    };
    setTotalPage(departmentSelect?fieldlabel.length:0)
    /* 
      const chartData = generateChartData(attributes.dataIndicadores, fieldlabel[0], fieldValue, leyenda[0]);
      setDataGrafico(chartData);
      // const chartDataByAnnual = generateChartData(attributes.dataIndicadores, fieldlabel[1], fieldValue, leyenda[1]);
      const orderDataByAnnual = ordenarDatos(generateChartData(attributes.dataIndicadores, fieldlabel[1], fieldValue, leyenda[1]));
      setDataGraficByAnnual(orderDataByAnnual);
      if (utilsModule.logger())console.log({chartData, orderDataByAnnual})
     */
    const dataToRenderGraphics = [];
    fieldlabel.forEach((fl, i) => {
      if (fl.includes("anio")) {
        dataToRenderGraphics.push(ordenarDatos(generateChartData(attributes.dataIndicadores, fl, fieldValue, leyenda[i])));
      } else if(attributes.dataIndicadores){
        dataToRenderGraphics.push(generateChartData(attributes.dataIndicadores, fl, fieldValue, leyenda[i]));
      }else if(!departmentSelect){ // cuando es nacional
        dataToRenderGraphics.push(generateChartData(attributes, fl, fieldValue, leyenda[i]));
      }else{
        console.log("caso no comtemplado", {poligonoSeleccionado, selectIndicadores, departmentSelect})
      }
    });
    setDataGrafico(dataToRenderGraphics);
    if (utilsModule.logger())console.log({dataToRenderGraphics})
    setOptions({
      responsive: true,
      plugins: {
        legend: { position: 'top' as const, },
        title: {
          display: true,
          text: `${descricion} ${poligonoSeleccionado.attributes.mpnombre} - ${departmentSelect?.label?departmentSelect.label:poligonoSeleccionado.attributes.depto}`,
        },
        tooltip: {
          enabled: true
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: Math.round,
          font: {
            weight: 'bold'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
  }

  useEffect(() => {
    if (!jimuMapView || !responseQueryCapa) return
      // Añadir evento de clic para capturar la información de la geometría seleccionada
      if (utilsModule.logger()) console.log("effect => responseQueryCapa")
      jimuMapView.view.on('click', async (event) => {
        try {
          setSelectedData(null);
          const screenPoint = {
            x: event.x,
            y: event.y
          };
          const hitTestResult: any = await jimuMapView.view.hitTest(screenPoint);
          if (utilsModule.logger()) console.log(hitTestResult)
          const graphic = hitTestResult.results[0].graphic;
          if (graphic) {
            const attributes = graphic.attributes;
            if (utilsModule.logger()) console.log('Selected feature attributes:', attributes);
            const att = hitTestResult.results[0].graphic.attributes;
            const _featureSelected = responseQueryCapa.features.find(e => e.attributes.OBJECTID_1 == att.OBJECTID_1)
            if (utilsModule.logger()) console.log(_featureSelected)
            setFeatureSelected(_featureSelected)
            getDataLayerToRenderGrafic(_featureSelected);
          }
        } catch (error) {
          if (utilsModule.logger()) console.error('Error capturing geometry information:', error);
        }
      });
  }, [responseQueryCapa]);

  /* useEffect(() => {
    if (utilsModule.logger()) console.log(jimuMapView)
    if (!jimuMapView) return
    if (utilsModule.logger()) console.log("effect => jimuMapView")

    // fetchData("https://sigquindio.gov.co/arcgis/rest/services/QUINDIO_III/Ambiental_T_Ajustado/MapServer/14", jimuMapView);
    return () => {}
  }, [jimuMapView]) */

  useEffect(() => {
    if (props.hasOwnProperty("stateProps")) {
      const dataFromDispatch = JSON.parse(props.stateProps.poligonoSeleccionado)
      if (utilsModule?.logger()) console.log({props, id:props.id, dataFromDispatch});
      if (dataFromDispatch?.clear) {
        if (utilsModule?.logger()) console.log("clearing graphic")
        setDataGrafico([])
        setOptions(null)
      }else {
        // const data = JSON.parse(props.stateProps.poligonoSeleccionado);
        setPoligonoSeleccionado(dataFromDispatch)      
        _fixDataToRenderGrafig(dataFromDispatch);
        setCurrentpage(1);
      }      
    }
  
    return () => {}
  }, [props])

  useEffect(() => {
    import('../../../utils/module').then(modulo => {
      setUtilsModule(modulo)
      if (modulo.logger()) console.log(props, props.id)
  });
    // import('../../../commonWidgets/widgetsModule').then(modulo => setWidgetModules(modulo));
  }, []);

  return (
    <div className="w-100 p-3  text-white">
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds[0]} onActiveViewChange={activeViewChangeHandler} />
      )}
      <>
        { 
          (dataGrafico.length > 0 && poligonoSeleccionado.departmentSelect) && (
            <div style={{ padding: '10px', width:'500px', height:'300px', border:'solid', borderRadius:'10px' }}>
              {
                totalPage > 1 && 
                  <Pagination
                    current={currentpage}
                    size="default"
                    totalPage={totalPage}
                    onChangePage={e=>setCurrentpage(e)}
                  />
              }
              {
                  dataGrafico.map((d, i) => (
                    currentpage == (i+1)&&
                    <Bar options={options} data={d} ref={chartRef} onClick={handleChartClick} />
                ))
              }
          </div>  
        )}  
      </>
    </div>
  );
};

export default Indicadores;

function getRandomRGBA() {
  // Generar valores aleatorios para rojo, verde y azul
  const r = Math.floor(Math.random() * 256); // Valores entre 0 y 255
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  // Generar un valor aleatorio para la opacidad (alpha)
  // const a = Math.random().toFixed(2); // Valores entre 0 y 1, con dos decimales
  const a = 0.5; // Valores entre 0 y 1, con dos decimales

  // Formatear el resultado como rgba
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const ordenarDatos = (data) => {
  // Combinar las etiquetas y los valores correspondientes en un solo array de objetos
  const combinedData = data.labels.map((label, index) => ({
    label: label,
    value: data.datasets[0].data[index],
  }));

  // Ordenar el array combinado por las etiquetas
  combinedData.sort((a, b) => a.label - b.label);

  // Separar de nuevo las etiquetas y los valores ordenados
  const labelsOrdenados = combinedData.map(item => item.label);
  const dataOrdenada = combinedData.map(item => item.value);

  // Asignar las etiquetas y valores ordenados al objeto original
  data.labels = labelsOrdenados;
  data.datasets[0].data = dataOrdenada;
  return data
};