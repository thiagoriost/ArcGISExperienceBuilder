import React, { useEffect, useState, useRef, useCallback } from 'react';
import { AllWidgetProps } from "jimu-core";
import { JimuMapViewComponent, JimuMapView, loadArcGISJSAPIModules } from 'jimu-arcgis';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Bubble, Line } from 'react-chartjs-2';
import { loadModules } from 'esri-loader';
import { InterfaceFeatureSelected } from '../types/interfacesIndicadores';
import { PieChart } from 'jimu-ui/advanced/lib/chart/pie';
import '../styles/style.css'

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
  const [widgetModules, setWidgetModules] = useState<any>(null);
  const [graficoSeleccionado, setGraficoSeleccionado] = useState<number | null>(null);
  const [dataGrafico, setDataGrafico] = useState<any>(null);
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

  const chartRef = useRef(null);

  const activeViewChangeHandler = (jmv: JimuMapView) => {
    if (jmv) {
      setJimuMapView(jmv);
      setInitialExtent(jmv.view.extent);
    }
  };

  const handleTipoGraficoChanged = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(event.target.value, 10);
    setGraficoSeleccionado(value);
    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
    let datos: any, opciones: any;

    if (value === 0) {
      datos = {
        labels,
        datasets: [
          {
            label: 'datos_1',
            data: labels.map(() => Math.floor(Math.random() * 1001)),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'datos_2',
            data: labels.map(() => Math.floor(Math.random() * 1001)),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };
      opciones = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Vertical Bar Chart',
          },
        },
      };
    } else if (value === 1) {
      datos = {
        labels,
        datasets: [
          {
            label: 'Dataset 1',
            data: labels.map(() => Math.floor(Math.random() * 2001) - 1000),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Dataset 2',
            data: labels.map(() => Math.floor(Math.random() * 2001) - 1000),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };
      opciones = {
        indexAxis: 'y' as const,
        elements: {
          bar: {
            borderWidth: 2,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'right' as const,
          },
          title: {
            display: true,
            text: 'Horizontal Bar Chart',
          },
        },
      };
    } else if (value === 2) {
      datos = {
        labels,
        datasets: [
          {
            fill: true,
            label: 'Dataset 2',
            data: labels.map(() => Math.floor(Math.random() * 1001)),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };
      opciones = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
          },
          title: {
            display: true,
            text: 'Chart.js Line Chart',
          },
        },
      };
    } else if (value === 3) {
      datos = {
        datasets: [
          {
            label: 'Red dataset',
            data: Array.from({ length: 50 }, () => ({
              x: Math.floor(Math.random() * 2001) - 1000,
              y: Math.floor(Math.random() * 2001) - 1000,
              r: Math.floor(Math.random() * 16) + 5,
            })),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'Blue dataset',
            data: Array.from({ length: 50 }, () => ({
              x: Math.floor(Math.random() * 2001) - 1000,
              y: Math.floor(Math.random() * 2001) - 1000,
              r: Math.floor(Math.random() * 16) + 5,
            })),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
      };
      opciones = {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      };
    }
    setDataGrafico(datos);
    setOptions(opciones);
  };

  const handleChartClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (chartRef.current) {
      console.log(featureSelected.attributes)
      const chart = chartRef.current;
      const points = chart.getElementsAtEventForMode(event.nativeEvent, 'nearest', { intersect: true }, true);
      if (points.length) {
        const firstPoint = points[0];
        const label = chart.data.labels.length>0 ? chart.data.labels[firstPoint.index] : '';
        const value = chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
        const datasetLabel = chart.data.datasets[firstPoint.datasetIndex].label;
        console.log({ label, value, datasetLabel })
        setSelectedData({ label, value, datasetLabel,...featureSelected.attributes });
      }else{
        setSelectedData(null);
      }
    }else{
      setSelectedData(null);
    }
  };

  const fetchData = async (url, jimuMapView) => {
    try {
      console.log("fetchData");
      setSelectedData(null);
      // Cargar los módulos necesarios de Esri
      const [FeatureLayer] = await loadModules(['esri/layers/FeatureLayer'], {
        url: 'https://js.arcgis.com/4.29/'
      });
  
      // Crear y añadir la capa al mapa
      const layer = new FeatureLayer({ url });
      jimuMapView.view.map.add(layer);
  
      // Esperar a que la capa esté lista
      layer.when();
      console.log(layer)
      // Hacer zoom a la extensión completa de la capa
      jimuMapView.view.goTo(layer.fullExtent);
  
      // Crear y ejecutar la consulta
      const query = layer.createQuery();
      query.where = '1=1';
      query.returnGeometry = true;
      query.outFields = ["OBJECTID", "OBJECTID_1", "DEPARTAMEN", "MUNICIPIO", "PCC", "VEREDA"];
  
      const response = await layer.queryFeatures(query);
      console.log(response);
      setResponseQueryCapa(response)
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getDataLayerToRenderGrafic = (_featureSelected: InterfaceFeatureSelected) => {
    console.log(_featureSelected)
    console.log(responseQueryCapa)
    const logica = (attToFilter) => {
      attToFilter.forEach(att => {
          const data = [];
          const filter = responseQueryCapa.features.filter(e => e.attributes[att] == _featureSelected.attributes[att])
          filter.forEach(e => data.push(e.attributes))
          console.log(data)
          const distributionByDepartment = data.reduce((acc, curr) => {
            acc[curr.DEPARTAMEN] = (acc[curr.DEPARTAMEN] || 0) + 1;
            return acc;
          }, {});

          /* const labels = Object.keys(distributionByDepartment);
          const values = Object.values(distributionByDepartment);

          const chartData = {
            labels: labels,
            datasets: [
              {
                label: 'Número de Registros',
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
              title: {
                display: true,
                text: 'Distribución por Departamento',
              },
            },
          }; */
          // setOptions(options)
          console.log("Distribución por Departamento:", distributionByDepartment);
          
          // Distribución por Municipio
          const distributionByMunicipio = data.reduce((acc, curr) => {
            acc[curr.MUNICIPIO] = (acc[curr.MUNICIPIO] || 0) + 1;
            return acc;
          }, {});
          
          console.log("Distribución por Municipio:", distributionByMunicipio);
          
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
          
          console.log("Diversidad de Municipios por Departamento:", diversityCountByDepartment);
          
          // Concentración por PCC
          const concentrationByPCC = data.reduce((acc, curr) => {
            acc[curr.PCC] = (acc[curr.PCC] || 0) + 1;
            return acc;
          }, {});
          const labels = Object.keys(concentrationByPCC);
          const values = Object.values(concentrationByPCC);
          
          console.log("Concentración por PCC:", concentrationByPCC);
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
              title: {
                display: true,
                text: 'Concentración por PCC',
              },
            },
          };
          setOptions(options)
          setGraficoSeleccionado(0)
      })
      
    }
    logica([/* "DEPARTAMEN"  ,*/ "MUNICIPIO"/*, "VEREDA", "PCC" */]);
  }

  useEffect(() => {
    if (!jimuMapView || !responseQueryCapa) return
      // Añadir evento de clic para capturar la información de la geometría seleccionada
      console.log("effect => responseQueryCapa")
      jimuMapView.view.on('click', async (event) => {
        try {
          setSelectedData(null);
          const screenPoint = {
            x: event.x,
            y: event.y
          };
          const hitTestResult: any = await jimuMapView.view.hitTest(screenPoint);
          console.log(hitTestResult)
          const graphic = hitTestResult.results[0].graphic;
          if (graphic) {
            const attributes = graphic.attributes;
            console.log('Selected feature attributes:', attributes);
            const att = hitTestResult.results[0].graphic.attributes;
            const _featureSelected = responseQueryCapa.features.find(e => e.attributes.OBJECTID_1 == att.OBJECTID_1)
            console.log(_featureSelected)
            setFeatureSelected(_featureSelected)
            getDataLayerToRenderGrafic(_featureSelected);
          }
        } catch (error) {
          console.error('Error capturing geometry information:', error);
        }
      });
  }, [responseQueryCapa]);

  useEffect(() => {
    console.log(jimuMapView)
    if (!jimuMapView) return
    console.log("effect => jimuMapView")

    fetchData("https://sigquindio.gov.co/arcgis/rest/services/QUINDIO_III/Ambiental_T_Ajustado/MapServer/14", jimuMapView);
    return () => {}
  }, [jimuMapView])
  

  useEffect(() => {
    console.log({props})
    if (props.hasOwnProperty("stateProps")) {
      setContador(props.stateProps.contador)      
    }
  
    return () => {}
  }, [props])
  

  useEffect(() => {
    console.log(props)
    import('../../../utils/module').then(modulo => setUtilsModule(modulo));
    import('../../../commonWidgets/widgetsModule').then(modulo => {
      console.log({modulo})
      setWidgetModules(modulo)
    });
  }, []);

  return (
    <div className="w-100 p-3 bg-primary text-white">
      {props.useMapWidgetIds && props.useMapWidgetIds.length === 1 && (
        <JimuMapViewComponent useMapWidgetId={props.useMapWidgetIds[0]} onActiveViewChange={activeViewChangeHandler} />
      )}
      <div style={{ padding: '10px' }}>
        <h3>Indicator Statistics {graficoSeleccionado}{contador}</h3>
        {/* {widgetModules?.INPUTSELECT(tiposGraficos, handleTipoGraficoChanged, graficoSeleccionado, "Tipo graficos")} */}
        {(graficoSeleccionado === 0 || graficoSeleccionado === 1) && (
          <Bar options={options} data={dataGrafico} ref={chartRef} onClick={handleChartClick} />
        )}
        {graficoSeleccionado === 2 && (
          <Line options={options} data={dataGrafico} ref={chartRef} onClick={handleChartClick} />
        )}
        {graficoSeleccionado === 3 && (
          <Bubble options={options} data={dataGrafico} ref={chartRef} onClick={handleChartClick} />
        )}
        

        {selectedData && (
          <div>
            <h4>Información Seleccionada:</h4>
            {/* {selectedData.label&&<p>Etiqueta: {selectedData.label}</p>}
            <p>Conjunto de datos: {selectedData.datasetLabel}</p>
            <p>Valor: {JSON.stringify(selectedData.value)}</p> */}
            {
              selectedData &&
                <div className="data-card">
                  <h1>{selectedData.datasetLabel}</h1>
                  <p><span className="label">PCC:</span> <span className="value">{selectedData.label}</span></p>
                  <p><span className="label">Value:</span> <span className="value">{selectedData.value}</span></p>
                  <div className="label-value"><span>OBJECTID:</span> <span>{selectedData.OBJECTID}</span></div>
                  <div className="label-value"><span>OBJECTID_1:</span> <span>{selectedData.OBJECTID_1}</span></div>
                  <div className="label-value"><span>Departamento:</span> <span>{selectedData.DEPARTAMEN}</span></div>
                  <div className="label-value"><span>Municipio:</span> <span>{selectedData.MUNICIPIO}</span></div>
                  <div className="label-value"><span>PCC:</span> <span>{selectedData.PCC}</span></div>
                  <div className="label-value"><span>Vereda:</span> <span>{selectedData.VEREDA}</span></div>
                </div>
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Indicadores;

interface interfaceData {
  labels?: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
  }[] | {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[] | {
    fill: boolean;
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
  }[] | {
    label: string;
    data: {
      x: number;
      y: number;
      r: number;
    }[];
    backgroundColor: string;
  }[];
}

interface interfaceOptions {
  responsive?: boolean;
  plugins?: {
    legend: {
      position: "top" | "right";
    };
    title: {
      display: boolean;
      text: string;
    };
  };
  indexAxis?: "y";
  elements?: {
    bar: {
      borderWidth: number;
    };
  };
  scales?: {
    y: {
      beginAtZero: boolean;
    };
  };
}
