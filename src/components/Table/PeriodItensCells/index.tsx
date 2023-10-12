import { useEffect, useState } from "react"
import IPeriodsItens from "../../../shared/interfaces/IPeriodsItens"
import DeleteCell from "../DeleteCell"
import CellsPeriodItens from "./CellsPeriodItens"
import { Tables } from "../../../models/Tables"
import useTablesInformations from "../../../state/hooks/useTablesInformations"
import findItemPeriodItem from "../../../utils/findItemPeriodItem"
import { showValue } from "../../../utils/createFormatValue"
import { IdTable } from "../../../utils/IdTables"
import { findMonth, returnMonthYear } from "../../../utils/dayTime"
import useCurrentMonth from "../../../state/hooks/useCurrentTableMonth"
import { IObjectTable } from "../../../shared/interfaces/IObjectTable"
import { ITableItens } from "../../../shared/interfaces/ITableItens"

interface PeriodItensCellsProps {
    periodItens: IPeriodsItens
}

const PeriodItensCells = ({ periodItens }: PeriodItensCellsProps) => {
    const tables = new Tables(useTablesInformations())
    const currentDate = useCurrentMonth()
    let [currentTable, findItem] = findItemPeriodItem(tables, periodItens) as [IObjectTable, ITableItens]

    const [nameCell, setNameCell] = useState(findItem.name)
    const [valueCell, setValueCell] = useState(findItem.value)
    const [installmentCell, setInstallmentCell] = useState(findItem.installment)
    const [repeatCell, setRepeatCell] = useState(findItem.repeat)
    const [typeCell, setTypeCell] = useState(findItem.type)
    const [idCell, setIdCell] = useState(findItem.id)

    const [iconDeleteCell, setIconDeleteCell] = useState(false)

    useEffect(() => {
        [currentTable, findItem] = findItemPeriodItem(tables, periodItens) as [IObjectTable, ITableItens]
        setValueCell(showValue(findItem.value, periodItens.periods.type, currentDate, periodItens.periods.days))
        setInstallmentCell(findItem.installment)
        setRepeatCell(findItem.repeat)
        setTypeCell(findItem.type)
        setIdCell(findItem.id)
    }, [periodItens, currentDate])

    function verifyIfCanConstruct() {
        const [idTable, idItens] = [parseFloat(IdTable.returnIdTable(periodItens.id)), parseFloat(IdTable.returnIdCell(periodItens.id))]
        const findIdTable = tables.tables.findIndex(table => table.id === `${idTable}`)
        function isBeforeCreation() {
            const [currentMonth, currentYear] = returnMonthYear(currentDate)
            const currentMonthNumber = findMonth(currentMonth)
            const [itemMonth, itemYear] = returnMonthYear(currentTable.monthTable)
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
            if (periodItens.showUntilMonth !== "") {
                const [itensMonth, itensYear] = returnMonthYear(periodItens.showUntilMonth)
                const itensMonthNumber = findMonth(itensMonth)
                const [currentMonth, currentYear] = returnMonthYear(currentDate)
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
        if (!isBeforeCreation() && !limitOfDeleteMonthYear()) {
            let isAnnual = true
            if (periodItens.periods.type === "Anualmente") {
                const [monthItem, yearItem] = returnMonthYear(tables.tables[findIdTable].monthTable)
                const [monthCurrent, yearCurrent] = returnMonthYear(currentDate)
                if (monthItem !== monthCurrent) {
                    isAnnual = false
                }
            }
            if (isAnnual) {
                return true
            }
        }
        return false
    }
    const editableCells = [
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
            constCell: typeCell,
            justifyCell: "justify-center",
            classDiv: "flex w-44 border-gray-300 border-r-2"
        }
    ]
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
        <>
            {verifyIfCanConstruct() ?
                <div className='flex' onMouseEnter={event => setIconDeleteCell(true)} onMouseLeave={event => setIconDeleteCell(false)}>
                    <DeleteCell idCell={idCell} iconDeleteCell={iconDeleteCell} textP={"Você deseja excluir:"}/>
                    <div className="flex flex-grow border-2 rounded-lg border-cor-secundaria py-1.5 hover:border-cor-terciaria">
                        {cells.map((cell, index) =>
                            <div className={cell.classDiv} key={index}>
                                <CellsPeriodItens constCell={cell.constCell} tagP={cell.tagP} justifyCell={cell.justifyCell} />
                            </div>)
                        }
                        <div className='flex flex-grow'>
                        </div>
                    </div >
                </div>
                : <></>
            }
        </>
    )
}

export default PeriodItensCells