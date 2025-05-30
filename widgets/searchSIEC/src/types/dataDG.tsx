
/**
* Parametrización del Path del sistema, para uso en componente tablaResultSrcSIEC
* @date 2025-04-09
* @author IGAC - DIP
* @dateUpdated 2025-05-19
* @changes Actualización del JSON asociado
* @remarks Folder desde server/public
*/

const pathDataGridSIEC = {
    "controller": 10,
    "path": "/apps/10/resources",
    "folder": "siec_img"
}

/**
 * Parametrización código divipola especial, asociado a Bogotá D.C
 * @author IGAC - DIP
 * @remarks Uso en el componente FiltersSrcSIEC
 */
const codDeptoDivip = {
    "codDepto": "11",
    "NomDepto": "Bogotá, D.C"
}
export{
    pathDataGridSIEC, 
    codDeptoDivip
}