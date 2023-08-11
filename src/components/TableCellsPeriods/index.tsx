import { useEffect, useState } from "react"
import { CurrentTable } from "../../models/CurrentTable"
import { createFormatValue } from "../../utils/createFormatValue"
import { LocalStorager } from "../../service/LocalStorager"
import { IObjectTable } from "../../shared/IObjectTable"
import { BiEditAlt } from "react-icons/bi"
import { FaCheck } from "react-icons/fa"
import { Expenses } from "../../models/Expenses"
import { BsTrash3Fill } from "react-icons/bs"
import WarningDeleteCell from "../WarningDeleteCell"
import IPeriodsItens from "../../shared/IPeriodsItens"
import Cell from "../Cell"
import IconDeleteCell from "../IconDeleteCell"

interface TableCellsPeriodProps {
    name: string
    value: string
    installment: string
    type: string
    paid: boolean
    id: string
    repeat: boolean
    // setPeriodItens: React.Dispatch<React.SetStateAction<IPeriodsItens[]>>
    expenseClass: Expenses
    // expensesPeriodItens: string[]
    setExpensesPeriodItens: React.Dispatch<React.SetStateAction<string[]>>
    table: IObjectTable
    tables: IObjectTable[]
    setAllTables: (value: React.SetStateAction<IObjectTable[]>) => void
}

const TableCellsPeriods = ({ name, value, installment, type, paid, id, repeat, expenseClass, setExpensesPeriodItens, table, tables, setAllTables }: TableCellsPeriodProps) => {
    const currentTable = new CurrentTable(table)

    const [nameCell, setNameCell] = useState(name)
    const [valueCell, setValueCell] = useState(value)
    const [installmentCell, setInstallmentCell] = useState(installment)
    const [repeatCell, setRepeatCell] = useState(repeat)
    const [typeCell, setTypeCell] = useState(type)
    const [idCell, setIdCell] = useState(id)
    
    const [optionsButtons, setOptionsButtons] = useState(false)

    useEffect(() => {
        setNameCell(name)
        setValueCell(value)
        setInstallmentCell(installment)
        setRepeatCell(repeat)
        setTypeCell(type)
        setIdCell(id)
    }, [name, value, installment, repeat, type, paid, id])

    useEffect(() => {
        expenseClass.expenses = [value]
        expenseClass.setExpensesPeriodItens(setExpensesPeriodItens)
    }, [table.monthTable])
    const cells = [
        {
            constCell: nameCell,
            justifyCell: "justify-start",
            classDiv: "flex w-[18rem] border-gray-300 border-r-2"
        }, {
            constCell: valueCell,
            justifyCell: "justify-start",
            tagP: "R$",
            classDiv: "flex w-60 border-gray-300 border-r-2"
        }, {
            constCell: installmentCell,
            justifyCell: "justify-center",
            classDiv: "flex w-28 border-gray-300 border-r-2"
        }, {
            constCell: typeCell,
            justifyCell: "justify-center",
            classDiv: "flex w-44 border-gray-300 border-r-2"
        }
    ]
    return (
        <div className="flex">
            <IconDeleteCell
                table={table}
                tables={tables}
                setAllTables={setAllTables}
                optionsButtons={optionsButtons}
                setOptionsButtons={setOptionsButtons}
                idCell={idCell}
                repeatCell={repeatCell}
                textP={"Você deseja excluir:"}
            />
            <div className="flex flex-grow border-2 rounded-lg border-cor-secundaria py-1.5"
                onMouseEnter={event => setOptionsButtons(true)}
                onMouseLeave={event => setOptionsButtons(false)}>
                {cells.map((cell, index) =>
                    <div className={cell.classDiv} key={index}>
                        <Cell constCell={cell.constCell} tagP={cell.tagP} justifyCell={cell.justifyCell} />
                    </div>)
                }
                <div className='flex flex-grow'>
                </div>
            </div >
        </div>
    )
}

export default TableCellsPeriods