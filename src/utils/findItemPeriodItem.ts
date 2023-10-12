import { Tables } from "../models/Tables";
import IPeriodsItens from "../shared/interfaces/IPeriodsItens";
import { IdTable } from "./IdTables";

export default function findItemPeriodItem(tables: Tables, periodItens: IPeriodsItens) {
    const result = IdTable.returnAllId(periodItens.id)
    const idTablePeriodItens = tables.tables.findIndex(table => table.id === result[0])
    const idItemPeriodItens = tables.tables[idTablePeriodItens].itensTable.findIndex(table => table.id === `${result[0]}.${result[1]}`)
    const table = tables.tables[idTablePeriodItens]
    const item = table.itensTable[idItemPeriodItens]
    return [table, item]
}