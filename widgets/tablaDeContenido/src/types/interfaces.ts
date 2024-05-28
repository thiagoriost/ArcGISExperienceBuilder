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

export interface capaInterface {
    id: string;
    idCapaMapa: string;
    text: string;
    type: string;
    parent: string;
    state: {
        checked: boolean;
    };
    url: string;
    idCapaDeServicio: string;
    urlMetadatoCapa: string;
    urlMetadatoServicio: string;
    DESCARGACAPA: boolean;
    urlMapServer: string;
}

export interface tablaContenInterface {
    IDTEMATICA: number;
    NOMBRETEMATICA: string;
    capas: any[];
}

export interface datosBasicosInterface{
    IDTEMATICAPADRE: number;
    IDTEMATICA: number;
    NOMBRETEMATICA: string;
    TITULOCAPA?: string;
}

export interface interfaceCapasNietos {
    capas: interfCapa[];
    tematicasNietas: any[] | {
        capasBisnietos: TablaDeContenidoInterface[];
        IDTEMATICAPADRE: number;
        IDTEMATICA: number;
        NOMBRETEMATICA: string;
        TITULOCAPA?: string;
        
    }[] | { capasBisnietos: undefined[];
        IDTEMATICAPADRE: number;
        IDTEMATICA: number;
        NOMBRETEMATICA: string;
        TITULOCAPA?: string;
        
    }[];
}

export interface interfCapa{
    IDCAPA: number;
    IDTEMATICA: number;
}

export interface TematicasTablaDeContenidoInterface {
    IDTEMATICAPADRE: number;
    IDTEMATICA:      number;
    NOMBRETEMATICA:  string;
    TITULOCAPA:      string;
    capasHijas?:     TematicasTablaDeContenidoInterface[] | ItemResponseTablaContenido[];
    capasNietas?:    CapasTematicas[];
}

export interface CapasTematicas {
    DESCRIPCIONSERVICIO?: Descripcionservicio;
    IDCAPA?:              number;
    METADATOCAPA?:        string;
    URL?:                 string;
    VISIBLE?:             boolean;
    NOMBRETEMATICA:       string;
    ESTADO?:              Estado;
    ATRIBUTO?:            string;
    TITULOCAPA:           string;
    METADATOSERVICIO?:    string;
    IDTEMATICAPADRE:      number;
    NOMBRECAPA?:          string;
    DESCARGACAPA?:        boolean;
    IDTEMATICA:           number;
    URLSERVICIOWFS?:      string;
    capasBisnietos?:      CapasTematicas[];
}
export interface ItemResponseTablaContenido {
    ATRIBUTO:            string;
    DESCRIPCIONSERVICIO: string;
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
}

export interface DatosBasicos {
    IDTEMATICAPADRE: number;
    IDTEMATICA:      number;
    NOMBRETEMATICA:  string;
    TITULOCAPA:      string;
}