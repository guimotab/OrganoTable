import { CurrentTable } from "../../models/CurrentTable"
import { Tables } from "../../models/Tables"
import { LocalStorager } from "../../service/LocalStorager"
import { IObjectTable } from "../../shared/IObjectTable"
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
        if (idTypeInstallment) {
            let indexTable = allTables.tables.findIndex(table => table.itensTable.find(item => item.id.split("-")[1] === idTypeInstallment))
            while (indexTable !== -1) {
                const indexItem = allTables.tables[indexTable].itensTable.findIndex(item => item.id.split("-")[1] === idTypeInstallment)
                allTables.tables[indexTable].itensTable.splice(indexItem, 1)
                indexTable = allTables.tables.findIndex(table => table.itensTable.find(item => item.id.split("-")[1] === idTypeInstallment))
            }
            setTables(deleteTablesUnused(allTables.tables))
            LocalStorager.saveInformations(tables)
        } else {
            if (repeat) {
                if (choiceButtonTypeRepeat) {
                    const idTable = IdTable.returnIdTable(id)
                    const indexTable = tables.findIndex(table => table.id === idTable)
                    const indexItemTable = tables[indexTable].itensTable.findIndex(item => item.id === id)
                    allTables.tables[indexTable].itensTable.splice(indexItemTable, 1)
                    setTables(deleteTablesUnused(allTables.tables))
                    LocalStorager.saveInformations(tables)
                }

            } else {
                const idItem = id
                const indexItem = table.itensTable.findIndex(item => item.id === idItem)
                currentTable.itensTable.splice(indexItem, 1)
                allTables.updateTables(currentTable.monthTable, currentTable)
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
            className="flex flex-col absolute bg-cor-terciaria text-white mt-24 ml-10 px-5 pt-2 pb-3 gap-1 rounded-lg">
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
                        <button onClick={event => deleteCell()} className="bg-cor-secundaria px-3 py rounded-lg">Deste em diante</button>
                    </div>
                </>
            }
        </div>
    )
}

export default WarningDeleteCell