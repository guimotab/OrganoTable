import { useEffect, useState } from "react"
import { ITableItens } from "../../../shared/interfaces/ITableItens"
import findCurrentTable from "../../../utils/findCurrentTable"
import DeleteCell from "../DeleteCell"
import { createFormatValue } from "../../../utils/createFormatValue"
import useTablesInformations from "../../../state/hooks/useTablesInformations"
import useCurrentMonth from "../../../state/hooks/useCurrentTableMonth"
import { Tables } from "../../../models/Tables"
import { useUpdateAllTables } from "../../../state/hooks/useUpdateAllTables"
import { LocalStorager } from "../../../service/LocalStorager"
import { CurrentTable } from "../../../models/CurrentTable"
import { IdTable } from "../../../utils/IdTables"

interface TableItensCellsProps {
    tableItens: ITableItens
}

const TableItensCells = ({ tableItens }: TableItensCellsProps) => {
    const allTables = new Tables(useTablesInformations())
    const setUpdateTables = useUpdateAllTables()
    const dateCurrent = useCurrentMonth()
    const currentTable = new CurrentTable(findCurrentTable(allTables.tables, dateCurrent))
    const [nameCell, setNameCell] = useState(tableItens.name)
    const [valueCell, setValueCell] = useState(tableItens.value)
    const [installmentCell, setInstallmentCell] = useState(tableItens.installment)
    const [repeatCell, setRepeatCell] = useState(tableItens.repeat)
    const [typeCell, setTypeCell] = useState(tableItens.type)
    const [paidCell, setPaidCell] = useState(tableItens.paid)
    const [idCell, setIdCell] = useState(tableItens.id)

    const [iconDeleteCell, setIconDeleteCell] = useState(false)

    useEffect(() => {
        setNameCell(tableItens.name)
        setValueCell(tableItens.value)
        setInstallmentCell(tableItens.installment)
        setRepeatCell(tableItens.repeat)
        setTypeCell(tableItens.type)
        setPaidCell(tableItens.paid)
        setIdCell(tableItens.id)
    }, [tableItens])

    function saveInformations(cellEdited: ITableItens) {
        const idObjectCurrent = currentTable.itensTable.findIndex(item => item.id === idCell)
        currentTable.itensTable[idObjectCurrent] = cellEdited
        allTables.updateTables(dateCurrent, currentTable.getInformations())
        setUpdateTables(allTables.tables)
        LocalStorager.saveTablesInformations(allTables.tables)
    }
    function updateAllInstallments(valueInput: string = typeCell) {
        const quantity = parseFloat(installmentCell.split('/')[1])
        const idOriginalTable = idCell.split("-")[1]
        for (let i = 0; i < quantity; i++) {
            const indexThisTable = allTables.tables.findIndex(table => parseFloat(table.id) === parseFloat(idOriginalTable.split("P")[0]) + i)
            const thisTable = new CurrentTable(allTables.tables[indexThisTable])
            const indexThisItens = thisTable.itensTable.findIndex(item => item.id.split("-")[1] === idOriginalTable)
            const newCell = {
                name: nameCell,
                value: createFormatValue(valueCell, setValueCell),
                installment: thisTable.itensTable[indexThisItens].installment,
                repeat: thisTable.itensTable[indexThisItens].repeat,
                type: valueInput,
                paid: thisTable.itensTable[indexThisItens].paid,
                id: thisTable.itensTable[indexThisItens].id
            } as ITableItens
            thisTable.itensTable[indexThisItens] = newCell
            allTables.updateTables(thisTable.monthTable, thisTable.getInformations())
            setUpdateTables(allTables.tables)
        }
        LocalStorager.saveTablesInformations(allTables.tables)
    }
    function changeTypeInput(event: React.ChangeEvent<HTMLSelectElement>) {
        const valueInput = event.target.value
        setTypeCell(valueInput)
        const cellEdited = {
            name: nameCell,
            value: createFormatValue(valueCell, setValueCell),
            installment: installmentCell,
            repeat: repeatCell,
            type: valueInput,
            paid: paidCell,
            id: idCell
        } as ITableItens
        if (installmentCell !== "1/1") {
            updateAllInstallments(valueInput)
        }
        saveInformations(cellEdited)
    }
    function changeChecked(event: React.ChangeEvent<HTMLInputElement>) {
        const checked = event.target.checked
        setPaidCell(checked)
        const cellEdited = {
            name: nameCell,
            value: valueCell,
            installment: `${installmentCell}`,
            repeat: repeatCell,
            type: typeCell,
            paid: !paidCell,
            id: idCell
        } as ITableItens
        saveInformations(cellEdited)
    }
    function onEndEditCell(event: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement, Element>) {
        event.preventDefault()
        const cellEdited = {
            name: nameCell,
            value: createFormatValue(valueCell, setValueCell),
            installment: installmentCell,
            repeat: repeatCell,
            type: typeCell,
            paid: paidCell,
            id: idCell
        } as ITableItens
        if (installmentCell !== "1/1") {
            updateAllInstallments()
        }
        saveInformations(cellEdited)
    }
    const optionsSelectInput = [
        { label: "Despesas" },
        { label: "Investimento" },
        { label: "Beleza" },
        { label: "Saúde" },
        { label: "Outros" }
    ]
    return (
        <div className='flex' onMouseEnter={event => setIconDeleteCell(true)} onMouseLeave={event => setIconDeleteCell(false)}>
            <DeleteCell idCell={idCell} iconDeleteCell={iconDeleteCell} textP={"Você tem certeza?"} />
            <div className='flex flex-grow border-2 rounded-lg border-cor-secundaria py-1.5 hover:border-cor-terciaria'>
                <div className="flex justify-center w-[18rem] border-gray-300 border-r-2 px-2">
                    <input
                        type="text"
                        value={nameCell}
                        onChange={event => { setNameCell(event.target.value) }}
                        onBlur={event => onEndEditCell(event)}
                        className='px-2 w-full font-medium placeholder:font-medium border-cor-outline'
                        placeholder={nameCell}
                        maxLength={24}
                        pattern="^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$"
                    />
                </div>
                <div className="flex justify-center w-60 border-gray-300 border-r-2 px-2">
                    <input
                        type="text"
                        value={valueCell}
                        onChange={event => { setValueCell(event.target.value) }}
                        onBlur={event => onEndEditCell(event)}
                        className='px-2 w-full font-medium placeholder:font-medium border-cor-outline'
                        placeholder={valueCell}
                        maxLength={12}
                        pattern="^(\d+)(\,|\.)(\d{2})?$"
                    />
                </div>
                <div className='flex justify-center w-28 border-gray-300 border-r-2'>
                    <p className='font-medium'>{installmentCell}</p>
                </div>
                <div className='flex justify-start px-4 w-44 border-gray-300 border-r-2'>
                    <select onChange={event => changeTypeInput(event)} value={typeCell} className='w-40 font-medium'>
                        {optionsSelectInput.map((option, index) =>
                            <option key={index} className='font-medium'>{option.label}</option>
                        )}
                    </select>
                </div>
                <div className='flex flex-grow text-center justify-center'>
                    <input type="checkbox"
                        checked={paidCell}
                        onChange={event => changeChecked(event)}
                        className='flex self-center'
                    />
                </div>
            </div>
        </div>
    )
}

export default TableItensCells