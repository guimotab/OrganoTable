import { useEffect } from "react"
import { CurrentTable } from "../../../models/CurrentTable"
import { Tables } from "../../../models/Tables"
import { LocalStorager } from "../../../service/LocalStorager"
import useCurrentMonth from "../../../state/hooks/useCurrentTableMonth"
import usePeriodItens from "../../../state/hooks/usePeriodItens"
import useTablesInformations from "../../../state/hooks/useTablesInformations"
import { useUpdateAllTables } from "../../../state/hooks/useUpdateAllTables"
import { useUpdatePeriodItens } from "../../../state/hooks/useUpdatePeriodItens"
import { IdTable } from "../../../utils/IdTables"
import findCurrentTable from "../../../utils/findCurrentTable"
import { PeriodItens } from "../../../models/PeriodItens"

interface WarningDeleteCellProps {
    textP: string
    idCell: string
    setShowWarningDelete: React.Dispatch<React.SetStateAction<boolean>>
}

const WarningDeleteCell = ({ textP, idCell, setShowWarningDelete }: WarningDeleteCellProps) => {
    const currentDate = useCurrentMonth()
    const allTables = new Tables(useTablesInformations())
    const updateAllTables = useUpdateAllTables()
    const currentTable = new CurrentTable(findCurrentTable(allTables.tables, currentDate))
    const periodItens = new PeriodItens(usePeriodItens())
    const setPeriodItens = useUpdatePeriodItens()

    function deleteCell() {
        const verifyIfIsInstallment = idCell.split("-")[1]
        if (verifyIfIsInstallment) { //para installment
            let indexTable = allTables.tables.findIndex(table => table.itensTable.find(item => item.id.split("-")[1] === idCell.split("-")[1]))
            while (indexTable !== -1) {
                const thisTable = new CurrentTable(allTables.tables[indexTable])
                const indexItem = thisTable.itensTable.findIndex(item => item.id.split("-")[1] === idCell.split("-")[1])
                thisTable.itensTable.splice(indexItem, 1)
                indexTable = allTables.tables.findIndex(table => table.itensTable.find(item => item.id.split("-")[1] === idCell.split("-")[1]))
                allTables.updateTables(thisTable.monthTable, thisTable.getInformations())
            }
            updateAllTables(allTables.tables)
            LocalStorager.saveTablesInformations(allTables.tables)
        } else { // para normal
            const indexItem = currentTable.itensTable.findIndex(item => item.id === idCell)
            currentTable.itensTable.splice(indexItem, 1)
            allTables.updateTables(currentTable.monthTable, currentTable.getInformations())
            updateAllTables(allTables.tables)
            LocalStorager.saveTablesInformations(allTables.tables)
        }
    }
    function deleteAllSameCells() {
        const idTable = IdTable.returnIdTable(idCell)
        const indexTable = allTables.tables.findIndex(table => table.id === idTable)
        const indexPeriodItens = periodItens.periodItens.findIndex(period=> period.id === idCell)
        const thisTable = new CurrentTable(allTables.tables[indexTable])
        const indexItemTable = thisTable.itensTable.findIndex(item => item.id === idCell)
        thisTable.itensTable.splice(indexItemTable, 1)
        periodItens.splicePeriods(indexPeriodItens, 1)
        setPeriodItens(periodItens.periodItens)
        allTables.updateTables(thisTable.monthTable, thisTable.getInformations())
        updateAllTables(allTables.tables)
        LocalStorager.savePeriodItens(periodItens.periodItens)
        LocalStorager.saveTablesInformations(allTables.tables)
    }
    function deleteAllSameCellsFromThis() {
        const idTable = IdTable.returnIdTable(idCell)
        const indexTable = allTables.tables.findIndex(table => table.id === idTable)
        const thisTable = new CurrentTable(allTables.tables[indexTable])
        const indexPeriodItens = periodItens.periodItens.findIndex(period=> period.id === idCell)
        if (thisTable.monthTable === currentTable.monthTable) { // se o mês da tabela for igual ao mês do delete
            const indexItemTable = thisTable.itensTable.findIndex(item => item.id === idCell)
            thisTable.itensTable.splice(indexItemTable, 1)
            periodItens.splicePeriods(indexPeriodItens, 1)
        } else { // se o mês da tabela for diferente ao mês do delete
            const indexPeriodItem = periodItens.periodItens.findIndex(period => period.id === idCell)
            periodItens.updateShowUntilMonth(indexPeriodItem, currentTable.monthTable)
        }
        allTables.updateTables(thisTable.monthTable, thisTable.getInformations())
        setPeriodItens(periodItens.periodItens)
        updateAllTables(allTables.tables)
        LocalStorager.savePeriodItens(periodItens.periodItens)
        LocalStorager.saveTablesInformations(allTables.tables)
    }
    return (
        <div
            onMouseEnter={event => setShowWarningDelete(true)}
            onMouseLeave={event => setShowWarningDelete(false)}
            className="flex flex-col absolute bg-cor-terciaria items-center text-center justify-center text-white rounded-lg z-10 left-10 -bottom-9">
            {textP === "Você tem certeza?" ?
                <div className="w-44 px-2 py-2">
                    <p>{textP}</p>
                    <div className="flex justify-center px-2">
                        <button onClick={event => deleteCell()} className="bg-cor-secundaria px-3 py rounded-lg">Sim</button>
                    </div>
                </div>
                :
                <div className="w-64 px-2 py-2 pb-2">
                    <p>{textP}</p>
                    <div className="flex justify-center px-2 gap-3">
                        <button onClick={event => deleteAllSameCells()} className="bg-cor-secundaria px-3 py rounded-lg">Todos</button>
                        <button onClick={event => deleteAllSameCellsFromThis()} className="bg-cor-secundaria px-3 py rounded-lg">Deste em diante</button>
                    </div>
                </div>
            }
        </div>
    )
}

export default WarningDeleteCell