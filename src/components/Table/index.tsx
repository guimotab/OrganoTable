import { useEffect, useState } from 'react'
import { IObjectTable } from '../../shared/IObjectTable'
import { ITableItens } from '../../shared/ITableItens'
import CreateCell from '../ButtonCreateCell'
import TableCells from '../TableCells'
import TableTitle from '../TableTitle'
import ResultOnMonth from '../ResultOnMonth/ResultOnMonth'
import { CurrentTable } from '../../models/CurrentTable'
import IPeriodsItens from '../../shared/IPeriodsItens'
import { IdTable } from '../../utils/IdTables'
import { findMonth, returnMonthYear } from '../../utils/dayTime'
import { showValue } from '../../utils/createFormatValue'
import TableCellsPeriods from '../TableCellsPeriods'
import { Expenses } from '../../models/Expenses'
import PopUpNewCell from '../PopUpNewCell'

interface TableProps {
    table: IObjectTable
    tables: IObjectTable[]
    showPopUp: boolean
    expensesTableItems: number
    expensesPeriodItens: string[]
    setMouseOutPopUp: React.Dispatch<React.SetStateAction<boolean>>
    setExpensesPeriodItens: React.Dispatch<React.SetStateAction<string[]>>
    setTables: React.Dispatch<React.SetStateAction<IObjectTable[]>>
    setDateCurrent: React.Dispatch<React.SetStateAction<string>>
    createNewCell: () => void
    currentSalary: string
    // setCurrentSalary: React.Dispatch<React.SetStateAction<string>>
}

const Table = ({ table, tables, showPopUp, expensesTableItems, setMouseOutPopUp, setTables, setDateCurrent, createNewCell, currentSalary }: TableProps) => {
    const currentTable = new CurrentTable(table)
    const [expensesPeriodItens, setExpensesPeriodItens] = useState<string[]>([])
    const [itensTable, setItensTable] = useState(currentTable.getInformations())
    const [periodItens, setPeriodItens] = useState<IPeriodsItens[]>([])
    const [expenseClass, setExpenseClass] = useState(new Expenses())

    useEffect(() => {
        const arrayPeriods = [] as IPeriodsItens[]
        tables.forEach(table => table.periodsItens[0].id === "" ? "" : arrayPeriods.push(...table.periodsItens))
        setPeriodItens([...arrayPeriods])
        setItensTable(table)
    }, [table])

    function renderCells(table: ITableItens) {
        const [idTable, idItens] = [parseFloat(IdTable.returnIdTable(table.id)), parseFloat(IdTable.returnIdCell(table.id))]
        if (!table.repeat) {
            return <TableCells
                key={`${idTable}${idItens}`}
                name={table.name}
                value={table.value}
                installment={table.installment}
                type={table.type}
                paid={table.paid}
                id={table.id}
                repeat={table.repeat}
                table={currentTable.getInformations()}
                tables={tables}
                setAllTables={setTables}
            />
        }
    }
    function renderEspecialCells(idPeriodItens: string, itens: IPeriodsItens) {
        const [idTable, idItens] = [parseFloat(IdTable.returnIdTable(idPeriodItens)), parseFloat(IdTable.returnIdCell(idPeriodItens))]
        const findIdTable = tables.findIndex(table => table.id === `${idTable}`)
        const tableItem = tables[findIdTable]
        function isBeforeCreation() {
            const [currentMonth, currentYear] = returnMonthYear(currentTable.monthTable)
            const currentMonthNumber = findMonth(currentMonth)
            const [itemMonth, itemYear] = returnMonthYear(tableItem.monthTable)
            const itemMonthNumber = findMonth(itemMonth)
            const itemMonthYear = new Date(`01/${itemMonthNumber + 1}/${itemYear}`)
            const CurrentTableMonthYear = new Date(`01/${currentMonthNumber + 1}/${currentYear}`)
            if (itemMonthYear <= CurrentTableMonthYear) {
                return false
            } else {
                return true
            }
        }
        function limitOfDeleteMonthYear() {
            if (itens.lastMonthYear !== "") {
                const [itensMonth, itensYear] = returnMonthYear(itens.lastMonthYear)
                const itensMonthNumber = findMonth(itensMonth)
                const [currentMonth, currentYear] = returnMonthYear(currentTable.monthTable)
                const currentMonthNumber = findMonth(currentMonth)
                const itemMonthYear = new Date(`01/${itensMonthNumber + 1}/${itensYear}`)
                const currentMonthYear = new Date(`01/${currentMonthNumber + 1}/${currentYear}`)
                if (itemMonthYear > currentMonthYear) {
                    return false
                } else {
                    return true
                }
            } else {
                return false
            }
        }
        if (tableItem) {
            const findIdItem = tableItem.itensTable.findIndex(item => item.id === `${idTable}.${idItens}`)
            const item = tableItem.itensTable[findIdItem]
            if (!isBeforeCreation() && !limitOfDeleteMonthYear()) {

                let isAnnual = true
                if (itens.periods.type === "Anualmente") {
                    const [monthItem, yearItem] = returnMonthYear(tables[findIdTable].monthTable)
                    const [monthCurrent, yearCurrent] = returnMonthYear(currentTable.monthTable)
                    if (monthItem !== monthCurrent) {
                        isAnnual = false
                    }
                }
                const valueOfCell = () => showValue(item.value, itens.periods.type, currentTable.monthTable, itens.periods.days)
                if (item && isAnnual) {
                    return <TableCellsPeriods
                        key={`${idTable + 1}${idItens}`}
                        name={item.name}
                        value={valueOfCell()}
                        installment={item.installment}
                        type={item.type}
                        paid={item.paid}
                        id={item.id}
                        repeat={item.repeat}
                        expenseClass={expenseClass}
                        setExpensesPeriodItens={setExpensesPeriodItens}
                        table={currentTable.getInformations()}
                        tables={tables}
                        setAllTables={setTables}
                    />
                }
            }
        }
    }
    const titlesTable = [
        { name: "Nome", width: "flex text-gray-600 justify-start w-[18rem] font-medium pl-3" },
        { name: "Valor", width: "flex text-gray-600 justify-start w-60 font-medium pl-3" },
        { name: "Parcela", width: "flex text-gray-600 justify-start w-28 font-medium pl-3" },
        { name: "Tipo", width: "flex text-gray-600 justify-start w-44 font-medium pl-3" },
        { name: "Pago", width: "flex text-gray-600 justify-start w-24 font-medium pl-2" },
    ]

    return (
        <div className='flex flex-col gap-1 w-full'>
            <div className='flex flex-col gap-2'>
                <div className='flex justify-between h-fit pr-2 pl-12'>
                    <TableTitle
                        name={currentTable.monthTable}
                        setExpenseClass={setExpenseClass}
                        expensesPeriodItens={expensesPeriodItens}
                        setDateCurrent={setDateCurrent}
                        setExpensesPeriodItens={setExpensesPeriodItens} />
                    <div className='flex flex-col'>
                        <div className='flex justify-end'>
                            <CreateCell createNewCell={createNewCell} />
                        </div>
                        <div className='mr-[33rem]'>
                            {showPopUp ? <PopUpNewCell
                                dateCurrent={currentTable.monthTable}
                                tables={tables}
                                table={currentTable}
                                setMouseOutPopUp={setMouseOutPopUp}
                                setTables={setTables} /> : <></>}
                        </div>
                    </div>
                </div>
                <div className='flex flex-col gap-1 w-full scrollbar'>
                    <div className='flex pr-4 pl-12 py-1'>
                        {titlesTable.map((title, index) => <div className={title.width} key={index}>{title.name}</div>)}
                    </div>
                    <section className='flex flex-col pr-2 gap-1 max-h-[21rem] overflow-auto '>
                        {itensTable.itensTable.map((table: ITableItens, index) => renderCells(table))}
                        {periodItens.map((itens, index) => renderEspecialCells(itens.id, itens))}
                    </section>
                </div>
            </div>
            <ResultOnMonth table={table}
                expensesTableItems={expensesTableItems}
                valueSalary={currentSalary}
                expensesPeriodItens={expensesPeriodItens} />
        </div>
    )
}

export default Table