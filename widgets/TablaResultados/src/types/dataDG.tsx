
/**
* Parametrización del Path del sistema, para uso en componente tablaResultSrcSIEC
* @date 2025-04-09
* @author IGAC - DIP
* @dateUpdated 2025-05-19
* @changes Actualización del JSON asociado
* @dateUpdated 2025-05-29
* @changes creación objeto controller para parametrización
* @remarks Folder desde server/public
*/
const controller = 10;
const pathDataGridSIEC = {
    path: "/apps/"+controller+"/resources",
    folder: "siec_img"
}

/**
 * Parametrización código divipola especial, asociado a Bogotá D.C
 * @author IGAC - DIP
 * @remarks Uso en el componente FiltersSrcSIEC
 */
const codDeptoDivip = {
    codDepto: "11",
    NomDepto: "Bogotá, D.C"
}

/**
 * Parametrización campos salida asociados al consumo de servicios remotos
 * @date 2025-05-29
 * @author IGAC - DIP
 */
const outFieldsService = {
    fieldsOut: "objectid,codigofirma,projectname,campananame,covertype,divipoladepto,divipolamunicipio,sealevelaltitude,instrumentname,photosignature,spectralintegrity",
    fieldOutDivipola: "mpcodigo,mpnombre,decodigo,depto"
}
export{
    pathDataGridSIEC, 
    codDeptoDivip,
    outFieldsService
}