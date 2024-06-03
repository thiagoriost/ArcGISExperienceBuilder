export interface TablaDeContenidoInterface {
    [key: string]: any; // Para manejar cualquier otra propiedad dinámica
    ATRIBUTO?: string;
    DESCARGACAPA?: boolean;
    DESCRIPCIONSERVICIO?: Descripcionservicio;
    ESTADO?: Estado;
    IDCAPA?: number;
    IDTEMATICA?: number;
    IDTEMATICAPADRE?: number;
    METADATOCAPA?: string;
    METADATOSERVICIO?: string;
    NOMBRECAPA?: string;
    NOMBRETEMATICA?: string;
    TITULOCAPA?: string;
    URL?: string;
    URLSERVICIOWFS?: string;
    VISIBLE?: boolean;
}

export enum Descripcionservicio {
    Ambiental = "Ambiental",
    CartografíaBásica = "Cartografía Básica",
    CartografíaBásica15000 = "Cartografía Básica 1:5.000",
    CuencaLaVieja = "Cuenca La Vieja",
    CulturaYTurismo = "Cultura y Turismo",
    Educación = "Educación",
    Empty = "",
    GestiónDelRiesgo = "Gestión del riesgo",
    IndustriaYComercio = "Industria y comercio",
    MovimientosEnMasaPúblico = "Movimientos en masa público",
    OrdenamientoTerritorial = "Ordenamiento territorial",
    Salud = "Salud",
    Sgc = "SGC",
    SusceptibilidadIncendios = "Susceptibilidad Incendios",
    'Ambiental Ajustado' = "Ambiental Ajustado"
}

export enum Estado {
    A = "A",
    I = "I",
}

export interface interfaceCapasNietos {
    capas: interfCapa[];
    tematicasNietas: {
        capasBisnietos: TablaDeContenidoInterface[];
        IDTEMATICAPADRE: number;
        IDTEMATICA: number;
        NOMBRETEMATICA: string;
        TITULOCAPA?: string;
        
    }[];
}
export interface interfCapa{
    IDCAPA: number;
    IDTEMATICA: number;
    capasNietas: any[];
}

export interface datosBasicosInterface{
    IDTEMATICAPADRE: number;
    IDTEMATICA: number;
    NOMBRETEMATICA: string;
    TITULOCAPA?: string;
}
export interface ItemResponseTablaContenido {
    ATRIBUTO:            string;
    DESCRIPCIONSERVICIO: Descripcionservicio;
    IDCAPA:              number;
    IDTEMATICA:          number;
    IDTEMATICAPADRE:     number;
    METADATOCAPA:        string;
    METADATOSERVICIO:    string;
    NOMBRECAPA:          string;
    NOMBRETEMATICA:      string;
    TITULOCAPA:          string;
    URL:                 string;
    URLSERVICIOWFS:      string;
    VISIBLE:             boolean;
    capasNietas?: ItemResponseTablaContenido[]
}

export interface Tematicas {
    IDTEMATICAPADRE: number;
    IDTEMATICA:      number;
    NOMBRETEMATICA:  string;
    TITULOCAPA:      string;
    capasHijas?:     Tematicas[];
    capasNietas?:    CapasTematicas[];
}
export interface CapasTematicas {
    ATRIBUTO?:            string;
    capasBisnietos?:       CapasTematicas[];
    capasHijas?:           any[];
    DESCARGACAPA?:        boolean;
    DESCRIPCIONSERVICIO?: Descripcionservicio;
    ESTADO?:              Estado;
    IDCAPA?:              number;
    IDTEMATICA?:           number;
    IDTEMATICAPADRE?:      number;
    METADATOCAPA?:        string;
    METADATOSERVICIO?:    string;
    NOMBRECAPA?:          string;
    NOMBRETEMATICA?:       string;
    TITULOCAPA?:           string;
    URL?:                 string;
    URLSERVICIOWFS?:       string;
    VISIBLE?:             boolean;
}

export interface InterfaceContextMenu {
    mouseX: number;
    mouseY: number;
    capa:   ItemResponseTablaContenido;
}