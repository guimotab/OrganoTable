import { CurrentTable } from "../models/CurrentTable";
import NewCellTable from "../models/NewCellTable";
import { Tables } from "../models/Tables";
import { ITableItens } from "../shared/interfaces/ITableItens";
import { IdTable } from "./IdTables";
import { findMonth, fixMontYear, returnMonthYear } from "./dayTime";

export function createOthersInstallments(installment: string, currentTable: CurrentTable, allTables: Tables, newCell: ITableItens) {
    const idOriginalTable = `-${newCell.id.split("-")[1]}`
    const months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
    const installmentNumber = parseFloat(installment)
    const [month, year] = returnMonthYear(currentTable.monthTable)
    let monthNumber = findMonth(month)
    for (let i = 1; i < installmentNumber; i++) {
        const newCellTable = new NewCellTable(newCell)
        const [monthFixed, yearSum] = fixMontYear(monthNumber + i)
        const thisMonthYear = `${months[monthFixed]} ${parseFloat(year) + yearSum}`
        const existTable = allTables.tables.findIndex(table => table.monthTable === thisMonthYear)
        const thereIsTable = allTables.tables[existTable]
        //se existe alguma tabela no mês
        if (thereIsTable) {
            const thisTable = new CurrentTable(allTables.tables[existTable])
            const thisCurrentTable = new CurrentTable(allTables.tables[existTable])
            if(thisTable.itensTable[0]){ //se possui algum primeiro elemento
                console.log(1);
                const lastCell = thisTable.itensTable.length - 1
                const idLastCell = thisTable.itensTable[lastCell].id
                newCellTable.installment = `${i + 1}/${installmentNumber}`
                newCellTable.id = `${thisTable.id}.${parseFloat(IdTable.returnIdCell(idLastCell)) + 1}${idOriginalTable}`
                thisCurrentTable.itensTable.push(newCellTable.returnInformations())
                allTables.updateTables(thisMonthYear, thisCurrentTable)
            } else { //se não possui primeiro elemento
                console.log(2);
                const lastId = allTables.highestId()
                thisTable.id =`${lastId + 1}`
                newCellTable.installment = `${i + 1}/${installmentNumber}`
                newCellTable.id = `${thisTable.id}.0${idOriginalTable}`
                thisTable.itensTable.push(newCellTable.returnInformations())
                allTables.updateTables(thisTable.monthTable, thisTable.getInformations())
            }
        } else if (!thereIsTable) {//se não existe alguma tabela igual mês
            console.log(3);
            allTables.updateTables(currentTable.monthTable, currentTable.getInformations())
            allTables.createNewTable(thisMonthYear)
            const indexThisTable = allTables.tables.findIndex(table => table.monthTable === `${thisMonthYear}`)
            const thisTable = allTables.tables[indexThisTable]
            newCellTable.installment = `${i + 1}/${installmentNumber}`
            newCellTable.id = `${thisTable.id}.0${idOriginalTable}`
            allTables.tables[indexThisTable].itensTable.push(newCellTable.returnInformations())
        }
    }
}
