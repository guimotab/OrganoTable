import { CurrentTable } from "../models/CurrentTable";
import NewCellTable from "../models/NewCellTable";
import { Tables } from "../models/Tables";
import { INewCell } from "../shared/INewCell";
import { IdTable } from "./IdTables";
import { findMonth, fixMontYear, returnMonthYear } from "./dayTime";

export function createOthersInstallments(installment: string, currentTable: CurrentTable, allTables: Tables, newCell: INewCell) {
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    const installmentNumber = parseFloat(installment)
    const [month, year] = returnMonthYear(currentTable.monthTable)
    let monthNumber = findMonth(month)
    for (let i = 1; i < installmentNumber; i++) {
        const newCellTable = new NewCellTable(newCell)
        const [monthFixed, yearSum] = fixMontYear(monthNumber + i)
        const thisMonthYear = `${months[monthFixed]} ${parseFloat(year) + yearSum}`
        const existTable = allTables.tables.findIndex(table => table.monthTable === thisMonthYear)
        const thisTable = allTables.tables[existTable]
        //se existe alguma tabela igual mês
        if (thisTable) {
            if(thisTable.itensTable[0]){ //se possui algum primeiro elemento
                const lastCell = thisTable.itensTable.length - 1
                const idLastCell = thisTable.itensTable[lastCell].id
                newCellTable.installment = `${i + 1}/${installmentNumber}`
                newCellTable.id = `${thisTable.id}.${parseFloat(IdTable.returnIdCell(idLastCell)) + 1}`
                allTables.tables[existTable].itensTable.push(newCellTable.returnInformations())
            } else { //se não possui primeiro elemento
                const lastId = allTables.highestId()
                thisTable.id =`${lastId + 1}`
                newCellTable.installment = `${i + 1}/${installmentNumber}`
                newCellTable.id = `${thisTable.id}.0`
                allTables.tables[existTable].itensTable.push(newCellTable.returnInformations())
            }
        } else if (!thisTable) {//se não existe alguma tabela igual mês
            allTables.updateTables(currentTable.monthTable, currentTable)
            allTables.createNewTable(thisMonthYear)
            const indexThisTable = allTables.tables.findIndex(table => table.monthTable === `${thisMonthYear}`)
            const thisTable = allTables.tables[indexThisTable]
            newCellTable.installment = `${i + 1}/${installmentNumber}`
            newCellTable.id = `${thisTable.id}.0`
            allTables.tables[indexThisTable].itensTable.push(newCellTable.returnInformations())
        }
    }
}
