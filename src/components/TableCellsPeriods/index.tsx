import { useEffect, useState } from "react"
import { CurrentTable } from "../../models/CurrentTable"
import { createFormatValue } from "../../utils/createFormatValue"
import { LocalStorager } from "../../service/LocalStorager"
import { IObjectTable } from "../../shared/IObjectTable"
import { BiEditAlt } from "react-icons/bi"
import { FaCheck } from "react-icons/fa"
import { Expenses } from "../../models/Expenses"

interface TableCellsPeriodProps{
    name: string
    value: string
    installment: string
    type: string
    paid: boolean
    id: string
    repeat: boolean
    expenseClass: Expenses
    expensesPeriodItens: string[]
    setExpensesPeriodItens: React.Dispatch<React.SetStateAction<string[]>>
    table: IObjectTable
    tables: IObjectTable[]
    setAllTables: (value: React.SetStateAction<IObjectTable[]>) => void
    setAllert: React.Dispatch<React.SetStateAction<boolean>>
}

const TableCellsPeriods = ({ name, value, installment, type, paid, id, repeat, expenseClass, expensesPeriodItens, setExpensesPeriodItens, table, tables, setAllTables, setAllert}: TableCellsPeriodProps) => {
    const currentTable = new CurrentTable(table)
    
    const [editButtonName, setEditButtonName] = useState(false)
    const [editButtonValue, setEditButtonValue] = useState(false)
    const [editButtonType, setEditButtonType] = useState(false)
    
    const [nameCell, setNameCell] = useState(name)
    const [valueCell, setValueCell] = useState(value)
    const [installmentCell, setInstallmentCell] = useState(installment)
    const [repeatCell, setRepeatCell] = useState(repeat)
    const [typeCell, setTypeCell] = useState(type)
    const [paidCell, setPaidCell] = useState(paid)
    const [idCell, setIdCell] = useState(id)
    
    useEffect(()=>{
        setNameCell(name)
        setValueCell(value)
        setInstallmentCell(installment)
        setRepeatCell(repeat)
        setTypeCell(type)
        setPaidCell(paid)
        setIdCell(id)
    },[name, value, installment, repeat, type, paid, id])
    
    useEffect(()=>{
        expenseClass.expenses = [value]
        expenseClass.setExpensesPeriodItens(setExpensesPeriodItens)
    },[table.monthTable])
    
    function onStartEditCell(setEditButton: React.Dispatch<React.SetStateAction<boolean>>) {
        setEditButton(true)
        setAllert(true)
    }
    function onEndEditCell(event: React.FormEvent<HTMLFormElement>, setEditButton: React.Dispatch<React.SetStateAction<boolean>>) {
        event.preventDefault()
        setAllert(false)
        
        setEditButton(false)
        
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
    function changeTypeInput(event: React.ChangeEvent<HTMLSelectElement>) {
        setTypeCell(event.target.value)
        const cellEdited = {
            name: nameCell,
            value: createFormatValue(valueCell, setValueCell),
            installment: installmentCell,
            repeat: repeatCell,
            type: event.target.value,
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
    const optionsSelectInput = [
        { label: "Despesas" },
        { label: "Investimento" },
        { label: "Beleza" },
        { label: "Saúde" },
        { label: "Outros" }
    ]
    return (
        <div className="flex">
            <div className="w-24">
            </div>
            <div className="flex flex-grow border-2 rounded-lg border-cor-secundaria py-1.5">
                <div className="flex justify-center w-[18rem] border-gray-300 border-r-2">
                    {!editButtonName ?
                        <div className="flex items-center justify-between pl-4 pr-3 w-full">
                            <p className='font-medium'>{nameCell}</p>
                            < button
                                onClick={event => onStartEditCell(setEditButtonName)}
                                className='bg-cor-secundaria rounded-lg text-white h-7 w-fit px-1.5'
                            ><BiEditAlt size={18} /></button>
                        </div>
                        :
                        <form
                            onSubmit={event => onEndEditCell(event, setEditButtonName)}
                            className="flex justify-between px-3 gap-2 w-full">
                            <input
                                type='text'
                                value={nameCell}
                                onChange={event => { setNameCell(event.target.value) }}
                                autoFocus={true}
                                className='px-1 w-full font-medium placeholder:font-medium border-cor-outline'
                                placeholder={nameCell}
                                maxLength={24}
                                pattern={"^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$"}
                            />
                            <button
                                type='submit'
                                className='bg-cor-secundaria rounded-lg text-white h-7 w-fit px-2'>
                                <FaCheck size={14} />
                            </button>
                        </form>}
                </div>
                <div className="flex justify-center w-60 border-gray-300 border-r-2">
                    {!editButtonValue ?
                        <div className="flex items-center justify-between pl-4 pr-3 w-full">
                            <p className='font-medium'>R${valueCell}</p>
                            < button
                                onClick={event => onStartEditCell(setEditButtonValue)}
                                className='bg-cor-secundaria rounded-lg text-white h-7 w-fit px-1.5'
                            ><BiEditAlt size={18} /></button>
                        </div>
                        :
                        <form
                            onSubmit={event => onEndEditCell(event, setEditButtonValue)}
                            className="flex justify-between px-3 gap-2 w-full">
                            <input
                                type='number'
                                step={0.01}
                                value={valueCell}
                                onChange={event => { setValueCell(event.target.value) }}
                                autoFocus={true}
                                className='px-1 w-full font-medium placeholder:font-medium border-cor-outline'
                                placeholder={valueCell}
                                maxLength={12}
                                pattern={"^(\d+)(\,|\.)(\d{2})?$"}
                            />
                            <button
                                type='submit'
                                className='bg-cor-secundaria rounded-lg text-white h-7 w-fit px-2'>
                                <FaCheck size={14} />
                            </button>
                        </form>}
                </div>
                <div className="flex justify-center w-32 border-gray-300 border-r-2">
                    <div className="flex items-center justify-center w-full">
                        <p className='font-medium'>{installmentCell}</p>
                    </div>
                </div>
                {/* <div className="flex justify-center w-60 border-gray-300 border-r-2">
                    {!editButtonType ?
                        <div className="flex items-center justify-between pl-4 pr-3 w-full">
                            <p className='font-medium'>{typeCell}</p>
                            < button
                                onClick={event => onStartEditCell(setEditButtonType)}
                                className='bg-cor-secundaria rounded-lg text-white h-7 w-fit px-1.5'
                            ><BiEditAlt size={18} /></button>
                        </div>
                        :
                        <form
                            onSubmit={event => onEndEditCell(event, setEditButtonType)}
                            className="flex justify-between px-3 gap-2 w-full">
                            <input
                                type='text'
                                value={typeCell}
                                onChange={event => { setTypeCell(event.target.value) }}
                                autoFocus={true}
                                className='px-1 w-full font-medium placeholder:font-medium border-cor-outline'
                                placeholder={typeCell}
                                maxLength={18}
                                pattern={"^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$"}
                            />
                            <button
                                type='submit'
                                className='bg-cor-secundaria rounded-lg text-white h-7 w-fit px-2'>
                                <FaCheck size={14} />
                            </button>
                        </form>}
                </div> */}
                <div className='flex justify-start pl-4 w-48 border-gray-300 border-r-2'>
                    <select onChange={event => changeTypeInput(event)} value={typeCell} className="w-40 font-medium">
                        {optionsSelectInput.map((option, index) =>
                            <option key={index} className="font-medium">{option.label}</option>
                        )}
                    </select>
                </div>
                <div className='w-24'>
                </div>
            </div >
        </div>
    )
}

export default TableCellsPeriods