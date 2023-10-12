import { useEffect, useState } from "react"
import useCurrentMonth from "../../state/hooks/useCurrentTableMonth"
import useTablesInformations from "../../state/hooks/useTablesInformations"
import findCurrentTable from "../../utils/findCurrentTable"
import useSalaryTable from "../../state/hooks/useSalaryTable"
import usePeriodItens from "../../state/hooks/usePeriodItens"
import { IdTable } from "../../utils/IdTables"
import { showValue } from "../../utils/createFormatValue"
import { findMonth, returnMonthYear } from "../../utils/dayTime"
import IPeriodsItens from "../../shared/interfaces/IPeriodsItens"
import { IObjectTable } from "../../shared/interfaces/IObjectTable"

const RemainingSalary = () => {
    const allTables = useTablesInformations()
    const dateCurrent = useCurrentMonth()
    const currentTable = findCurrentTable(allTables, dateCurrent)
    const periodItens = usePeriodItens()
    const salaryTable = useSalaryTable()

    const [remainingSalary, setRemainingSalary] = useState<string>()
    useEffect(() => {
        resultOfMonth()
    }, [dateCurrent, salaryTable, currentTable, periodItens])
    function resultOfMonth() {
        function isBeforeCreation(tableFound: IObjectTable) {
            const [currentMonth, currentYear] = returnMonthYear(dateCurrent)
            const currentMonthNumber = findMonth(currentMonth)
            const [itemMonth, itemYear] = returnMonthYear(tableFound.monthTable)
            const itemMonthNumber = findMonth(itemMonth)
            const itemMonthYear = new Date(`01/${itemMonthNumber + 1}/${itemYear}`)
            const CurrentTableMonthYear = new Date(`01/${currentMonthNumber + 1}/${currentYear}`)
            if (itemMonthYear <= CurrentTableMonthYear) {
                return false
            } else {
                return true
            }
        }
        function limitOfDeleteMonthYear(item: IPeriodsItens) {
            if (item.showUntilMonth !== "") {
                const [itensMonth, itensYear] = returnMonthYear(item.showUntilMonth)
                const itensMonthNumber = findMonth(itensMonth)
                const [currentMonth, currentYear] = returnMonthYear(dateCurrent)
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
        let resultOnMonth = 0
        let expenses = 0
        const salary = parseFloat(salaryTable.replace(',', '.'))
        currentTable.itensTable.forEach(item => {
            if (!item.repeat) {
                expenses += parseFloat(item.value.replace(',', '.'))
            }
        })
        if (periodItens[0]) {
            periodItens.forEach(item => {
                const findIdTable = allTables.findIndex(table => table.id === IdTable.returnIdTable(item.id))
                const tableFound = allTables[findIdTable]
                const findItemtable = tableFound.itensTable.findIndex(itemTable=>itemTable.id === item.id)
                const itemFound = tableFound.itensTable[findItemtable]
                if (!isBeforeCreation(tableFound) && !limitOfDeleteMonthYear(item)) {
                    let isAnnual = true
                    if (item.periods.type === "Anualmente") {
                        const [monthItem, yearItem] = returnMonthYear(tableFound.monthTable)
                        const [monthCurrent, yearCurrent] = returnMonthYear(dateCurrent)
                        if (monthItem !== monthCurrent) {
                            isAnnual = false
                        }
                    }
                    if (isAnnual) {
                        expenses += parseFloat(showValue(itemFound.value, item.periods.type, dateCurrent, item.periods.days).replace(',', '.'))
                    }
                }
            })
        }
        resultOnMonth = salary - expenses
        if (resultOnMonth.toFixed(2) !== 'NaN') {
            const h2 = document.getElementById("remainingSalary")!
            if(resultOnMonth < 0){
                h2.classList.add("text-red-700")
            } else {
                h2.classList.remove("text-red-700")
            }
            setRemainingSalary(resultOnMonth.toFixed(2).replace('.', ','))
        }
    }
    return (
        <h2 className="flex gap-2 px-4 font-medium text-lg border-2 rounded-lg border-gray-400 ">
            <p>Total no mês:</p> 
            <p id="remainingSalary" className="border-gray-400"> R${remainingSalary}</p>
        </h2>
    )
}

export default RemainingSalary