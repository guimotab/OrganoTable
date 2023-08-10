import { IObjectTable } from "../shared/IObjectTable"

export default function deleteTablesUnused(localStorager: IObjectTable[]) {
    const tables = [...localStorager]
    
    let indexNoTables = tables.findIndex(item => item.itensTable[0] === undefined)
    while (!(indexNoTables == -1)) {
        tables.splice(indexNoTables, 1)
        indexNoTables = tables.findIndex(item => item.itensTable[0] === undefined)
    }
    return tables
}