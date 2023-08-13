import { CurrentTable } from "../../models/CurrentTable"
import { Tables } from "../../models/Tables"
import { LocalStorager } from "../../service/LocalStorager"
import { IObjectTable } from "../../shared/IObjectTable"
import IPeriodsItens from "../../shared/IPeriodsItens"
import { IdTable } from "../../utils/IdTables"
import deleteTablesUnused from "../../utils/deleteTablesUnused"

interface WarningDeleteCellProps {
    textP: string
    id: string
    repeat?: boolean
    table: IObjectTable
    tables: IObjectTable[]
    setTables: (value: React.SetStateAction<IObjectTable[]>) => void
    setOptionsButtons: React.Dispatch<React.SetStateAction<boolean>>
    setShowWarningDelete: React.Dispatch<React.SetStateAction<boolean>>

}
const WarningDeleteCell = ({ textP, id, repeat, table, tables, setTables, setOptionsButtons, setShowWarningDelete }: WarningDeleteCellProps) => {
    const allTables = new Tables(tables)
    const currentTable = new CurrentTable(table)
    function deleteCell(choiceButtonTypeRepeat?: string) {
        const idTypeInstallment = id.split("-")[1]
        if (idTypeInstallment) { //para installment
            let indexTable = allTables.tables.findIndex(table => table.itensTable.find(item => item.id.split("-")[1] === idTypeInstallment))
            while (indexTable !== -1) {
                const indexItem = allTables.tables[indexTable].itensTable.findIndex(item => item.id.split("-")[1] === idTypeInstallment)
                allTables.tables[indexTable].itensTable.splice(indexItem, 1)
                indexTable = allTables.tables.findIndex(table => table.itensTable.find(item => item.id.split("-")[1] === idTypeInstallment))
            }
            setTables(deleteTablesUnused(allTables.tables))
            LocalStorager.saveInformations(tables)
        } else {
            if (repeat) { // para repeat
                const idTable = IdTable.returnIdTable(id)
                const indexTable = tables.findIndex(table => table.id === idTable)

                if (choiceButtonTypeRepeat === "Todos") { // se apagar todos 
                    const indexItemTable = tables[indexTable].itensTable.findIndex(item => item.id === id)
                    const indexPeriodItems = tables[indexTable].periodsItens.findIndex(item => item.id === id)
                    allTables.tables[indexTable].itensTable.splice(indexItemTable, 1)
                    allTables.tables[indexTable].periodsItens.splice(indexPeriodItems, 1)
                    if(!allTables.tables[indexTable].periodsItens[0]){
                        allTables.tables[indexTable].periodsItens = currentTable.constructPeriodItems()
                    }
                    setTables(deleteTablesUnused(allTables.tables))
                    LocalStorager.saveInformations(tables)

                } else if (choiceButtonTypeRepeat === "Deste em diante") {
                    if(allTables.tables[indexTable].monthTable === currentTable.monthTable){ // se o mês da tabela for igual ao mês do delete
                        const indexItemTable = allTables.tables[indexTable].itensTable.findIndex(item => item.id === id)
                        const indexPeriodItems = tables[indexTable].periodsItens.findIndex(item => item.id === id)
                        allTables.tables[indexTable].itensTable.splice(indexItemTable, 1)
                        allTables.tables[indexTable].periodsItens.splice(indexPeriodItems, 1)
                        if(!allTables.tables[indexTable].periodsItens[0]){
                            allTables.tables[indexTable].periodsItens = currentTable.constructPeriodItems()
                        }
                    } else { // se o mês da tabela for diferente ao mês do delete
                        const indexPeriodItem = allTables.tables[indexTable].periodsItens.findIndex(period => period.id === id)
                        const thisTable = allTables.tables[indexTable]
                        thisTable.periodsItens[indexPeriodItem].lastMonthYear = `${currentTable.monthTable}`
                    }
                    setTables(deleteTablesUnused(allTables.tables))
                    LocalStorager.saveInformations(tables)
                }
            } else { // para normal
                const idItem = id
                const indexItem = table.itensTable.findIndex(item => item.id === idItem)
                currentTable.itensTable.splice(indexItem, 1)
                allTables.updateTables(currentTable.monthTable, currentTable.getInformations())
                setTables(deleteTablesUnused(allTables.tables))
                LocalStorager.saveInformations(tables)
            }
        }
    }
    function showWarnings() {
        setOptionsButtons(true)
        setShowWarningDelete(true)
    }
    function hideWarnings() {
        setOptionsButtons(false)
        setShowWarningDelete(false)
    }
    return (
        <div
            onMouseEnter={event => showWarnings()}
            onMouseLeave={event => hideWarnings()}
            className="flex flex-col absolute bg-cor-terciaria text-white mt-[5.5rem] px-5 py-2 rounded-lg">
            {textP === "Você tem certeza?" ?
                <>
                    <p className="flex justify-center">{textP}</p>
                    <div className="flex justify-center px-2">
                        <button onClick={event => deleteCell()} className="bg-cor-secundaria px-3 py rounded-lg">Sim</button>
                    </div>
                </>
                :
                <>
                    <p className="flex justify-center">{textP}</p>
                    <div className="flex justify-center px-2 gap-3">
                        <button onClick={event => deleteCell("Todos")} className="bg-cor-secundaria px-3 py rounded-lg">Todos</button>
                        <button onClick={event => deleteCell("Deste em diante")} className="bg-cor-secundaria px-3 py rounded-lg">Deste em diante</button>
                    </div>
                </>
            }
        </div>
    )
}

export default WarningDeleteCell