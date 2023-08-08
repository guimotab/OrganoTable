import { useEffect, useState } from 'react'
import { IObjectTable } from '../../shared/IObjectTable'
import { createFormatValue } from '../../utils/createFormatValue'
import { LocalStorager } from '../../service/LocalStorager'
import { CurrentTable } from '../../models/CurrentTable'
import EditCell from '../EditCell'
import { log } from 'console'

interface TableCellsProps {
    name: string
    value: string
    installment: string
    type: string
    paid: boolean
    id: string
    repeat: boolean
    optionsButtons: boolean
    setOptionsButtons: React.Dispatch<React.SetStateAction<boolean>>
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    table: IObjectTable
    tables: IObjectTable[]
    setAllTables: (value: React.SetStateAction<IObjectTable[]>) => void
    setAllert: React.Dispatch<React.SetStateAction<boolean>>
    noButtons?: boolean
}

const TableCells = ({ name, value, installment, type, paid, id, repeat, optionsButtons, setOptionsButtons, table, tables, setAllTables, setAllert, noButtons = false }: TableCellsProps) => {
    const currentTable = new CurrentTable(table)

    const [editButtonName, setEditButtonName] = useState(0)
    const [editButtonValue, setEditButtonValue] = useState(0)
    const [editButtonInstallment, setEditButtonInstallment] = useState(0)
    const [editButtonType, setEditButtonType] = useState(0)
    
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
        
        if(constCell === typeCell){
            setTypeCell(valueInput)
            valueTypeCell = valueInput
        } else if (constCell === installmentCell){
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

    function showOptionsButton() {
        setOptionsButtons(true)
    }
    function hideOptionsButton() {
        setOptionsButtons(false)
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
        //  {
        //     classDiv: "flex justify-center w-32 border-gray-300 border-r-2",
        //     editButton: editButtonInstallment,
        //     constCell: installmentCell,
        //     onStartEditCell: onStartEditCell,
        //     onEndEditCell: onEndEditCell,
        //     setEditButton: setEditButtonInstallment,
        //     setConstCell: setInstallmentCell,
        //     type: 'text',
        //     value: installmentCell,
        //     onChange: (event: React.ChangeEvent<HTMLInputElement>) => setInstallmentCell(event.target.value),
        //     autoFocus: true,
        //     className: 'px-1 w-full font-medium placeholder:font-medium border-cor-outline',
        //     placeholder: installmentCell,
        //     maxLength: 3,
        // }
        // ,{
        //     classDiv: "flex justify-center w-60 border-gray-300 border-r-2",
        //     editButton: editButtonType,
        //     constCell: typeCell,
        //     onStartEditCell: onStartEditCell,
        //     onEndEditCell: onEndEditCell,
        //     setEditButton: setEditButtonType,
        //     setConstCell: setTypeCell,
        //     type: 'text',
        //     value: typeCell,
        //     onChange: (event: React.ChangeEvent<HTMLInputElement>) => setTypeCell(event.target.value),
        //     autoFocus: true,
        //     className: 'px-1 w-full font-medium placeholder:font-medium border-cor-outline',
        //     placeholder: typeCell,
        //     maxLength: 18,
        //     pattern: "^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$",
        // },
    ]
    // const installmentSelectInput = [
    //     { label: "1/1" },
    //     { label: "1/2" },
    //     { label: "1/3" },
    //     { label: "1/4" },
    //     { label: "1/5" },
    //     { label: "1/6" },
    //     { label: "1/7" },
    //     { label: "1/8" },
    //     { label: "1/9" },
    //     { label: "1/10" },
    //     { label: "1/11" },
    //     { label: "1/12" }
    // ]
    const optionsSelectInput = [
        { label: "Despesas" },
        { label: "Investimento" },
        { label: "Beleza" },
        { label: "Saúde" },
        { label: "Outros" }
    ]
    return (
        <>
            <div className='flex border-2 rounded-lg border-cor-secundaria py-1.5' onMouseEnter={event => showOptionsButton()}
                onMouseLeave={event => hideOptionsButton()}
            >
                {editButtons.map((button, index) =>
                    <div className={button.classDiv} key={index}>
                        <EditCell
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
                <div className='flex justify-start pl-4 w-32 border-gray-300 border-r-2'>
                    <p className='font-medium'>{installmentCell}</p>
                    {/* <select onChange={event => changeTypeInput(event, installmentCell)} value={"2/3"} className='w-24 font-medium'>
                        {installmentSelectInput.map((option, index) =>
                            <option key={index} className='font-medium'>{option.label}</option>
                        )}
                    </select> */}
                </div>
                <div className='flex justify-start pl-4 w-48 border-gray-300 border-r-2'>
                    <select onChange={event => changeTypeInput(event, typeCell)} value={typeCell} className='w-40 font-medium'>
                        {optionsSelectInput.map((option, index) =>
                            <option key={index} className='font-medium'>{option.label}</option>
                        )}
                    </select>
                </div>
                <div className='flex justify-center w-24'>
                    <div className='flex justify-center'>
                        {
                            <input
                                type="checkbox"
                                checked={paidCell}
                                onChange={event => changeChecked(event)}
                                className='flex self-center'
                            />
                        }
                    </div>
                </div>
            </div >
        </>
    )
}

export default TableCells