// const servicioMadre = "https://pruebassig.igac.gov.co/server/rest/services/Indicadores/MapServer"
const servicioMadre = "https://pruebassig.igac.gov.co/server/rest/services/Indicadores_municipios/MapServer"
/* const urls = {
    tablaContenido:"https://sigquindio.gov.co:8443/ADMINSERV/AdminGeoApplication/AdminGeoWebServices/getTablaContenidoJsTree/public",
    Departamentos: `${servicioMadre}/11`,
    Municipios: `${servicioMadre}/10`,
    indicadores:{
        v_predios_fondo_tierras_mun: `${servicioMadre}/1`,
        v_predios_inventario_baldios_mun: `${servicioMadre}/2`,
        v_predios_adjudicados_mun: `${servicioMadre}/3`,
        v_predios_adj_baldios_mun: `${servicioMadre}/4`,
        v_bienes_fiscales_adj_mun: `${servicioMadre}/5`,
        v_predios_sub_integrales_mun: `${servicioMadre}/6`,
        v_predios_entregados_ft_mun: `${servicioMadre}/7`,
        v_predios_formalizados_mun: `${servicioMadre}/8`,
        v_predios_formal_mujeres_mun: `${servicioMadre}/9`,
    }
} */


const urls = {
    // tablaContenido:"https://sigquindio.gov.co:8443/ADMINSERV/AdminGeoApplication/AdminGeoWebServices/getTablaContenidoJsTree/public",
    tablaContenido:"https://sae.igac.gov.co:8443/ADMINSERV/AdminGeoApplication/AdminGeoWebServices/getTablaContenidoJsTree/public",
    
    Departamentos: `${servicioMadre}/1`,
    Municipios: `${servicioMadre}/0`,
    indicadores:{
        v_predios_fondo_tierras_mun: `${servicioMadre}/3`,
        v_predios_inventario_baldios_mun: `${servicioMadre}/4`,
        v_predios_adjudicados_mun: `${servicioMadre}/5`,
        v_predios_adj_baldios_mun: `${servicioMadre}/6`,
        v_bienes_fiscales_adj_mun: `${servicioMadre}/7`,
        v_predios_sub_integrales_mun: `${servicioMadre}/8`,
        v_predios_entregados_ft_mun: `${servicioMadre}/9`,
        v_predios_formalizados_mun: `${servicioMadre}/10`,
        v_predios_formal_mujeres_mun: `${servicioMadre}/11`,
    }
}

export {
    urls
}