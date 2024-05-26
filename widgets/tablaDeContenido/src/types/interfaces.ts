export interface TablaDeContenidoInterface {
    DESCRIPCIONSERVICIO: Descripcionservicio;
    IDCAPA: number;
    METADATOCAPA: string;
    URL: string;
    VISIBLE: boolean;
    NOMBRETEMATICA: string;
    ATRIBUTO: string;
    TITULOCAPA: string;
    METADATOSERVICIO: string;
    IDTEMATICAPADRE: number;
    NOMBRECAPA: string;
    IDTEMATICA: number;
    URLSERVICIOWFS: string;
    ESTADO?: Estado;
    DESCARGACAPA?: boolean;
    [key: string]: any; // Para manejar cualquier otra propiedad dinámica
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