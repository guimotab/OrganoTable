import { IObjectTable } from "../shared/IObjectTable"

export default function deleteTablesUnused(localStorager: IObjectTable[]) {
    const tables = [...localStorager]
    let index = tables.findIndex(item => item.itensTable[0] == undefined)

    while (!(index == -1)) {
        tables.splice(index, 1)
        index = tables.findIndex(item => item.itensTable[0] == undefined)
    }
    return tables
}