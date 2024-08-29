// const servicioMadre = "https://pruebassig.igac.gov.co/server/rest/services/Indicadores/MapServer"
const MapServerMunicipal = "https://pruebassig.igac.gov.co/server/rest/services/Indicadores_municipios/MapServer";
const mapServerNal = "https://pruebassig.igac.gov.co/server/rest/services/Indicadores_nacionales_municipales/MapServer";

const urls = {
    tablaContenido:"https://sigquindio.gov.co:8443/ADMINSERV/AdminGeoApplication/AdminGeoWebServices/getTablaContenidoJsTree/public",
    Municipios: `${MapServerMunicipal}/0`,
    Departamentos: `${MapServerMunicipal}/1`,
    indicadores:{// municipales
        v_predios_fondo_tierras_mun: `${MapServerMunicipal}/3`,
        v_predios_inventario_baldios_mun: `${MapServerMunicipal}/4`,
        v_predios_adjudicados_mun: `${MapServerMunicipal}/5`,
        v_predios_adj_baldios_mun: `${MapServerMunicipal}/6`,
        v_bienes_fiscales_adj_mun: `${MapServerMunicipal}/7`,
        v_predios_sub_integrales_mun: `${MapServerMunicipal}/8`,
        v_predios_entregados_ft_mun: `${MapServerMunicipal}/9`,
        v_predios_formalizados_mun: `${MapServerMunicipal}/10`,
        v_predios_formal_mujeres_mun: `${MapServerMunicipal}/11`,
        v_predios_uaf_mun: `${MapServerMunicipal}/12`,
        v_predios_restierras_mun: `${MapServerMunicipal}/13`,
    },
    indicadoresNaci:{ // nacionales
        v_predios_fondo_tierras_nacmun:`${mapServerNal}/3`,
        v_predios_inv_baldios_nacmun:`${mapServerNal}/4`,
        v_predios_adjudicados_macmun:`${mapServerNal}/5`,
        v_predios_adj_baldios_nacmun:`${mapServerNal}/6`,
        v_bienes_fiscales_adj_nacmun:`${mapServerNal}/7`,
        v_predios_sub_integrales_nacmun:`${mapServerNal}/8`,
        v_predios_entregados_ft_nacmun:`${mapServerNal}/9`,
        v_predios_formalizados_nacmun:`${mapServerNal}/10`,
        v_predios_for_mujeres_nacmun:`${mapServerNal}/11`,
        v_predios_uaf_nacmun:`${mapServerNal}/12`,
        v_predios_restierras_nacmun:`${mapServerNal}/13`,

    }
}

export {
    urls
}