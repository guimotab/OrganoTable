import { useEffect, useState } from 'react'
import { IObjectTable } from '../../shared/IObjectTable'
import { ITableItens } from '../../shared/ITableItens'
import CreateCell from '../CreateCell'
import TableCells from '../TableCells'
import TableTitle from '../TableTitle'
import ResultOnMonth from '../ResultOnMonth/ResultOnMonth'
import { CurrentTable } from '../../models/CurrentTable'
import IPeriodsItens from '../../shared/IPeriodsItens'
import { IdTable } from '../../utils/IdTables'
import { dayTime, findMonth, returnMonthYear } from '../../utils/dayTime'
import { showValue } from '../../utils/createFormatValue'
import TableCellsPeriods from '../TableCellsPeriods'
import { Expenses } from '../../models/Expenses'

interface TableProps {
    table: IObjectTable
    tables: IObjectTable[]
    dateCurrent: string
    expensesPeriodItens: string[]
    setExpensesPeriodItens: React.Dispatch<React.SetStateAction<string[]>>
    setTables: React.Dispatch<React.SetStateAction<IObjectTable[]>>
    setDateCurrent: React.Dispatch<React.SetStateAction<string>>
    onClick: () => void
}

const Table = ({ table, tables, dateCurrent, setTables, setDateCurrent, onClick }: TableProps) => {
    const currentTable = new CurrentTable(table)
    const indexCurrentTable = tables.findIndex((table: IObjectTable) => table.monthTable === dateCurrent)
    const [expensesPeriodItens, setExpensesPeriodItens] = useState<string[]>([])
    const [itensTable, setItensTable] = useState(currentTable.getInformations())
    const [periodItens, setPeriodItens] = useState<IPeriodsItens[]>([])
    const [allert, setAllert] = useState(false)
    const [expenseClass, setExpenseClass] = useState(new Expenses())
    
    useEffect(() => {
        const arrayPeriods = [] as IPeriodsItens[]
        tables.forEach(table => table.periodsItens[0].id === "" ? "" : arrayPeriods.push(...table.periodsItens))
        setPeriodItens([...arrayPeriods])
        setItensTable(table)
    }, [table])

    function updateTables(event: React.ChangeEvent<HTMLInputElement>) {
        const idElement = parseFloat(event.target.id)
        const newObjects = [...tables, currentTable.getInformations()]
        setTables(tables.splice(indexCurrentTable, 1))
        currentTable.itensTable[idElement].paid = event.target.checked
        setTables([...newObjects])
    }

    function renderCells(table: ITableItens, index: number) {
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
                onChange={updateTables}
                table={currentTable.getInformations()}
                tables={tables}
                setAllTables={setTables}
                setAllert={setAllert}
            />
        }
    }

    function renderEspecialCells(idPeriodItens: string, index: number, itens: IPeriodsItens) {
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
                        setPeriodItens={setPeriodItens}
                        expenseClass={expenseClass}
                        expensesPeriodItens={expensesPeriodItens}
                        setExpensesPeriodItens={setExpensesPeriodItens}
                        table={currentTable.getInformations()}
                        tables={tables}
                        setAllTables={setTables}
                        setAllert={setAllert}
                    />
                }
            }
        }
    }

    const titleTr = [
        { name: "Nome", width: "flex text-gray-600 justify-start w-[18rem] font-medium pl-3" },
        { name: "Valor", width: "flex text-gray-600 justify-start w-60 font-medium pl-3" },
        { name: "Parcela", width: "flex text-gray-600 justify-start w-32 font-medium pl-3" },
        { name: "Tipo", width: "flex text-gray-600 justify-start w-48 font-medium pl-3" },
        { name: "Pago", width: "flex text-gray-600 justify-start w-24 font-medium pl-2" },
    ]

    return (
        <div className=' w-full'>
            {itensTable.itensTable ?
                <div className='flex flex-col gap-1 w-full'>
                    <div className='flex flex-col gap-2'>
                        <div className='flex justify-between h-fit pr-2 pl-24'>
                            <TableTitle
                                name={currentTable.monthTable}
                                setExpenseClass={setExpenseClass}
                                expensesPeriodItens={expensesPeriodItens}
                                setDateCurrent={setDateCurrent}
                                setExpensesPeriodItens={setExpensesPeriodItens} />
                            <CreateCell onClick={onClick} />
                        </div>
                        <div className='flex flex-col gap-1 w-full scrollbar'>
                            <div className='flex pr-4 pl-24 py-1'>
                                {titleTr.map((title, index) => <div className={title.width} key={index}>{title.name}</div>)}
                            </div>
                            <section className='flex flex-col pr-2 gap-1 max-h-[21rem] overflow-auto '>
                                {itensTable.itensTable.map((table: ITableItens, index) => renderCells(table, index))}
                                {periodItens.map((itens, index) => renderEspecialCells(itens.id, index, itens))}
                            </section>
                        </div>
                    </div>
                    <ResultOnMonth table={table}
                        valueSalary={table.salary}
                        expensesPeriodItens={expensesPeriodItens} />
                </div>
                :
                <>
                    <TableTitle
                        name={dateCurrent}
                        setExpenseClass={setExpenseClass}
                        expensesPeriodItens={expensesPeriodItens}
                        setDateCurrent={setDateCurrent}
                        setExpensesPeriodItens={setExpensesPeriodItens} />
                    <CreateCell onClick={onClick} />

                    <table className='flex text-lg font-semibold w-full justify-center'>
                        Clique no + para criar sua tabela
                    </table>
                </>
            }
            {allert ? <div className='font-medium text-cor-erro'>*Há alterações não salvas</div> : ""}
        </div>
    )
}

export default Table