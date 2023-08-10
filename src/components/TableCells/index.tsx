import { useEffect, useState } from 'react'
import { IObjectTable } from '../../shared/IObjectTable'
import { createFormatValue } from '../../utils/createFormatValue'
import { LocalStorager } from '../../service/LocalStorager'
import { CurrentTable } from '../../models/CurrentTable'
import EditCell from '../EditCell'
import { IoMdInformationCircle } from 'react-icons/io'
import { BsTrash3Fill } from 'react-icons/bs'
import WarningDeleteCell from '../WarningDeleteCell'
import IconDeleteCell from '../IconDeleteCell'


interface TableCellsProps {
    name: string
    value: string
    installment: string
    type: string
    paid: boolean
    id: string
    repeat: boolean
    // setOptionsButtons: React.Dispatch<React.SetStateAction<boolean>>
    // optionsButtons: boolean
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    table: IObjectTable
    tables: IObjectTable[]
    setAllTables: (value: React.SetStateAction<IObjectTable[]>) => void
    setAllert: React.Dispatch<React.SetStateAction<boolean>>
    noButtons?: boolean
}

const TableCells = ({ name, value, installment, type, paid, id, repeat, table, tables, setAllTables, setAllert, noButtons = false }: TableCellsProps) => {
    const currentTable = new CurrentTable(table)

    const [editButtonName, setEditButtonName] = useState(0)
    const [editButtonValue, setEditButtonValue] = useState(0)
    const [optionsButtons, setOptionsButtons] = useState(false)

    const [nameCell, setNameCell] = useState(name)
    const [valueCell, setValueCell] = useState(value)
    const [installmentCell, setInstallmentCell] = useState(installment)
    const [repeatCell, setRepeatCell] = useState(repeat)
    const [typeCell, setTypeCell] = useState(type)
    const [paidCell, setPaidCell] = useState(paid)
    const [idCell, setIdCell] = useState(id)

    useEffect(() => {
        setNameCell(name)
        setValueCell(value)
        setInstallmentCell(installment)
        setRepeatCell(repeat)
        setTypeCell(type)
        setPaidCell(paid)
        setIdCell(id)
    }, [name, value, installment, repeat, type, paid, id])

    function onStartEditCell(setEditButton: React.Dispatch<React.SetStateAction<number>>) {
        setEditButton(1)
        setAllert(true)
    }
    function onEndEditCell(event: React.FormEvent<HTMLFormElement>, setEditButton: React.Dispatch<React.SetStateAction<number>>) {
        event.preventDefault()
        setAllert(false)
        setEditButton(0)

        const cellEdited = {
            name: nameCell,
            value: createFormatValue(valueCell, setValueCell),
            installment: installmentCell,
            repeat: repeatCell,
            type: typeCell,
            paid: paidCell,
            id: idCell
        }
        const indexObjectCurrent = tables.findIndex(object => object.monthTable === currentTable.monthTable)
        const idObjectCurrent = currentTable.itensTable.findIndex(item => item.id === idCell)
        const newObjects = [...tables]

        newObjects[indexObjectCurrent].itensTable[idObjectCurrent] = cellEdited
        setAllTables(newObjects)
        LocalStorager.saveInformations(tables)
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
        }
        const indexObjectCurrent = tables.findIndex(object => object.monthTable === currentTable.monthTable)
        const idObjectCurrent = currentTable.itensTable.findIndex(item => item.id === idCell)
        const oldObjects = [...tables]

        oldObjects[indexObjectCurrent].itensTable[idObjectCurrent] = cellEdited
        setAllTables(oldObjects)
        LocalStorager.saveInformations(tables)
    }
    function changeTypeInput(event: React.ChangeEvent<HTMLSelectElement>, constCell: string) {
        const valueInput = event.target.value
        let valueTypeCell = typeCell
        let valueInstallmentCell = installmentCell

        if (constCell === typeCell) {
            setTypeCell(valueInput)
            valueTypeCell = valueInput
        } else if (constCell === installmentCell) {
            setInstallmentCell(valueInput)
            valueInstallmentCell = valueInput
        }
        const cellEdited = {
            name: nameCell,
            value: createFormatValue(valueCell, setValueCell),
            installment: valueInstallmentCell,
            repeat: repeatCell,
            type: valueTypeCell,
            paid: paidCell,
            id: idCell
        }
        const indexObjectCurrent = tables.findIndex(object => object.monthTable === currentTable.monthTable)
        const idObjectCurrent = currentTable.itensTable.findIndex(item => item.id === idCell)
        const newObjects = [...tables]


        newObjects[indexObjectCurrent].itensTable[idObjectCurrent] = cellEdited
        setAllTables(newObjects)
        LocalStorager.saveInformations(tables)
    }

    const editButtons = [
        {
            classDiv: "flex justify-center w-[18rem] border-gray-300 border-r-2",
            editButton: editButtonName,
            constCell: nameCell,
            onStartEditCell: onStartEditCell,
            onEndEditCell: onEndEditCell,
            setEditButton: setEditButtonName,
            setConstCell: setNameCell,
            type: 'text',
            value: nameCell,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => setNameCell(event.target.value),
            autoFocus: true,
            className: 'px-1 w-full font-medium placeholder:font-medium border-cor-outline',
            placeholder: nameCell,
            maxLength: 24,
            pattern: "^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$",
        }, {
            classDiv: "flex justify-center w-60 border-gray-300 border-r-2",
            tagP: "R$",
            editButton: editButtonValue,
            constCell: valueCell,
            onStartEditCell: onStartEditCell,
            onEndEditCell: onEndEditCell,
            setEditButton: setEditButtonValue,
            setConstCell: setValueCell,
            type: 'text',
            value: valueCell,
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => setValueCell(event.target.value),
            autoFocus: true,
            className: 'px-1 w-full font-medium placeholder:font-medium border-cor-outline',
            placeholder: nameCell,
            maxLength: 12,
            // pattern: "^(\d+)(\,|\.)(\d{2})?$",
        }
    ]
    const optionsSelectInput = [
        { label: "Despesas" },
        { label: "Investimento" },
        { label: "Beleza" },
        { label: "Saúde" },
        { label: "Outros" }
    ]
    return (
        <div className='flex'>
            <IconDeleteCell
                table={table}
                tables={tables}
                setAllTables={setAllTables}
                optionsButtons={optionsButtons}
                setOptionsButtons={setOptionsButtons}
                idCell={idCell}
                repeatCell={repeatCell}
                textP={"Você tem certeza?"}
            />
            <div
                className='flex flex-grow border-2 rounded-lg border-cor-secundaria py-1.5'
                onMouseEnter={event => setOptionsButtons(true)}
                onMouseLeave={event => setOptionsButtons(false)}>
                {editButtons.map((button, index) =>
                    <div className={button.classDiv} key={index}>
                        <EditCell
                            installmentCell={installmentCell}
                            editButton={button.editButton}
                            constCell={button.constCell}
                            onStartEditCell={button.onStartEditCell}
                            onEndEditCell={button.onEndEditCell}
                            setEditButton={button.setEditButton}
                            setConstCell={button.setConstCell}
                            maxLength={button.maxLength}
                            pattern={button.pattern}
                            tagP={button.tagP}
                        />
                    </div>
                )}
                <div className='flex justify-center w-28 border-gray-300 border-r-2'>
                    <p className='font-medium'>{installmentCell}</p>
                </div>
                {
                    installmentCell === "1/1" ?
                        <div className='flex justify-start px-4 w-44 border-gray-300 border-r-2'>
                            <select onChange={event => changeTypeInput(event, typeCell)} value={typeCell} className='w-40 font-medium'>
                                {optionsSelectInput.map((option, index) =>
                                    <option key={index} className='font-medium'>{option.label}</option>
                                )}
                            </select>
                        </div>
                        :
                        <div className='flex justify-center w-44 border-gray-300 border-r-2'>
                            <p className='font-medium'>{typeCell}</p>
                        </div>
                }
                <div className='flex flex-grow text-center justify-center'>
                    {
                        <input
                            type="checkbox"
                            checked={paidCell}
                            onChange={event => changeChecked(event)}
                            className='flex self-center'
                        />
                    }
                </div>
            </div >
        </div>
    )
}

export default TableCells