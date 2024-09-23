import { JimuMapView, JimuMapViewComponent } from 'jimu-arcgis';
import { React, AllWidgetProps, BaseWidget } from 'jimu-core';
import { WidgetPlaceholder } from 'jimu-ui';
// import { IMConfig } from '../config';

interface State {
  count: number;
  extent: __esri.Extent
}

// class MyClassWidget extends React.PureComponent<AllWidgetProps<IMConfig>, State> {
// class MyClassWidget extends React.PureComponent<AllWidgetProps<{}>, State> {
  class MyClassWidget extends BaseWidget<AllWidgetProps<{}>, State> {
  /* constructor(props) {
    super(props);

    // Inicializar el estado
    this.state = {
      count: 0,
    };
  } */

  extentWatch: __esri.WatchHandle;
  state: State = {
    extent: null,
    count:0
  }

  isConfigured = () => {
    return this.props.useMapWidgetIds && this.props.useMapWidgetIds.length === 1;
  }

  // Ciclo de vida: componentDidMount
  componentDidMount() {
    // Aquí puedes añadir lógica que necesites cuando el componente se monte
    console.log('Widget se ha montado.');
  }

  // Ciclo de vida: componentWillUnmount
  componentWillUnmount() {
    // Aquí puedes añadir lógica para limpiar o desuscribirte de eventos antes de que el componente se desmonte
    console.log('Widget se va a desmontar.');
    if (this.extentWatch) {
      this.extentWatch.remove();
      this.extentWatch = null;
    }
  }

  onActiveViewChange = (jimuMapView: JimuMapView) => {
    if (!this.extentWatch) {
      this.extentWatch = jimuMapView.view.watch('extent', extent=>{
        this.setState({
          extent
        })
      })
    }
  }

  // Manejar eventos
  handleIncrement = () => {
    this.setState((prevState) => ({ count: prevState.count + 1 }));
    // const extentWatch = JimuMapView.view.watch
  };

  handleDecrement = () => {
    this.setState((prevState) => ({ count: prevState.count - 1 }));
  };

  // Renderizar el widget
  render() {
    return (
      <div className="widget-myclass">
        <h3>Contador: {this.state.count}</h3>
        <button onClick={this.handleIncrement}>Incrementar</button>
        <button onClick={this.handleDecrement}>Decrementar</button>
        <h3>How tu use a dinamic extent</h3>
        <JimuMapViewComponent useMapWidgetId={this.props.useMapWidgetIds[0]} onActiveViewChange={this.onActiveViewChange} />
        <div>xmin: {this.state.extent && JSON.stringify(this.state.extent.xmin)}</div>
        <div>ymin: {this.state.extent && JSON.stringify(this.state.extent.ymin)}</div>
        <div>xmax: {this.state.extent && JSON.stringify(this.state.extent.xmax)}</div>
        <div>ymax: {this.state.extent && JSON.stringify(this.state.extent.ymax)}</div>
        <div>Spatial Reference: {this.state.extent && JSON.stringify(this.state.extent.spatialReference)}</div>
      </div>
    );
  }
}

export default MyClassWidget;
