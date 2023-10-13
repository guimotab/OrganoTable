import { useEffect, useState } from "react"
import IPeriodsItens from "../../../shared/interfaces/IPeriodsItens"
import DeleteCell from "../DeleteCell"
import CellsPeriodItens from "./CellsPeriodItens"
import { Tables } from "../../../models/Tables"
import useTablesInformations from "../../../state/hooks/useTablesInformations"
import findItemPeriodItem from "../../../utils/findItemPeriodItem"
import { createFormatValue, showValue } from "../../../utils/createFormatValue"
import { IdTable } from "../../../utils/IdTables"
import { findMonth, returnMonthYear } from "../../../utils/dayTime"
import useCurrentMonth from "../../../state/hooks/useCurrentTableMonth"
import { IObjectTable } from "../../../shared/interfaces/IObjectTable"
import { ITableItens } from "../../../shared/interfaces/ITableItens"
import { LocalStorager } from "../../../service/LocalStorager"
import { useUpdateAllTables } from "../../../state/hooks/useUpdateAllTables"
import { CurrentTable } from "../../../models/CurrentTable"
import { PeriodItens } from "../../../models/PeriodItens"
import usePeriodItens from "../../../state/hooks/usePeriodItens"
import { useUpdatePeriodItens } from "../../../state/hooks/useUpdatePeriodItens"

interface PeriodItensCellsProps {
    periodItens: IPeriodsItens
}

const PeriodItensCells = ({ periodItens }: PeriodItensCellsProps) => {
    const allTables = new Tables(useTablesInformations())
    const setUpdateTables = useUpdateAllTables()
    const allPeriodItens = new PeriodItens(usePeriodItens())
    const setAllPeriodItens = useUpdatePeriodItens()
    const currentDate = useCurrentMonth()
    let result = findItemPeriodItem(allTables, periodItens) as [IObjectTable, ITableItens]
    let currentTable = new CurrentTable(result[0])
    let findItem = result[1]
    const [nameCell, setNameCell] = useState(findItem.name)
    const [valueCell, setValueCell] = useState(findItem.value)
    const [installmentCell, setInstallmentCell] = useState(findItem.installment)
    const [repeatCell, setRepeatCell] = useState(findItem.repeat)
    const [paidCell, setPaidCell] = useState(verifyIfIsPaid())
    const [typeCell, setTypeCell] = useState(findItem.type)
    const [idCell, setIdCell] = useState(findItem.id)

    const [iconDeleteCell, setIconDeleteCell] = useState(false)

    useEffect(() => {
        result = findItemPeriodItem(allTables, periodItens) as [IObjectTable, ITableItens]
        currentTable = new CurrentTable(result[0])
        findItem = result[1]
        setValueCell(showValue(findItem.value, periodItens.periods.type, currentDate, periodItens.periods.days))
        setInstallmentCell(findItem.installment)
        setRepeatCell(findItem.repeat)
        setPaidCell(verifyIfIsPaid())
        setTypeCell(findItem.type)
        setIdCell(findItem.id)
    }, [periodItens, currentDate])
    function verifyIfIsPaid(){
        let result = false
        periodItens.datePaid.forEach(date=> {
            if(!result){
                result = date === currentDate
            }
        })
        return result
    }

    function verifyIfCanConstruct() {
        const [idTable, idItens] = [parseFloat(IdTable.returnIdTable(periodItens.id)), parseFloat(IdTable.returnIdCell(periodItens.id))]
        const findIdTable = allTables.tables.findIndex(table => table.id === `${idTable}`)
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
                const [monthItem, yearItem] = returnMonthYear(allTables.tables[findIdTable].monthTable)
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
    function saveInformations(cellEdited: ITableItens) {
        const idObjectCurrent = currentTable.itensTable.findIndex(item => item.id === idCell)
        currentTable.itensTable[idObjectCurrent] = cellEdited
        allTables.updateTables(currentTable.monthTable, currentTable.getInformations())
        setUpdateTables(allTables.tables)
        LocalStorager.saveTablesInformations(allTables.tables)
    }
    function changeChecked(event: React.ChangeEvent<HTMLInputElement>){
        const checked = event.target.checked
        setPaidCell(checked)
        const indexPeriodItem = allPeriodItens.periodItens.findIndex(period=> period.id === periodItens.id)
        if(checked){
            allPeriodItens.addDatePaid(indexPeriodItem, currentDate)
        } else {
            const indexDatePaid = allPeriodItens.periodItens[indexPeriodItem].datePaid.findIndex(date=> date === currentDate)
            allPeriodItens.removeDatePaid(indexPeriodItem, indexDatePaid)
        }
        setAllPeriodItens(allPeriodItens.periodItens)
        LocalStorager.savePeriodItens(allPeriodItens.periodItens)
    }
    function changeTypeInput(event: React.ChangeEvent<HTMLSelectElement>) {
        const valueInput = event.target.value
        setTypeCell(valueInput)
        event.preventDefault()
        const idObjectCurrent = currentTable.itensTable.findIndex(item => item.id === idCell)
        const cellEdited = {
            name: nameCell,
            value: currentTable.itensTable[idObjectCurrent].value,
            installment: installmentCell,
            repeat: repeatCell,
            type: valueInput,
            paid: paidCell,
            id: idCell
        } as ITableItens
        saveInformations(cellEdited)
    }
    function onEndEditCell(event: React.FocusEvent<HTMLInputElement, Element>) {
        event.preventDefault()
        const idObjectCurrent = currentTable.itensTable.findIndex(item => item.id === idCell)
        const cellEdited = {
            name: nameCell,
            value: currentTable.itensTable[idObjectCurrent].value,
            installment: installmentCell,
            repeat: repeatCell,
            type: typeCell,
            paid: paidCell,
            id: idCell
        } as ITableItens
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
        <>
            {verifyIfCanConstruct() ?
                <div className='flex' onMouseEnter={event => setIconDeleteCell(true)} onMouseLeave={event => setIconDeleteCell(false)}>
                    <DeleteCell idCell={idCell} iconDeleteCell={iconDeleteCell} textP={"Você deseja excluir:"} />
                    <div className="flex flex-grow border-2 rounded-lg border-cor-secundaria py-1.5 hover:border-cor-terciaria">
                        <div className="flex justify-center w-[18rem] border-gray-300 border-r-2 px-2">
                            <input
                                type="text"
                                value={nameCell}
                                onChange={event => { setNameCell(event.target.value) }}
                                onBlur={event => onEndEditCell(event)}
                                className='px-2 w-full font-medium placeholder:font-medium border-cor-outline'
                                placeholder={nameCell}
                                maxLength={24}
                                pattern="^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+$"
                            />
                        </div>
                        <div className="flex w-60 border-gray-300 border-r-2 px-2">
                            <p className='px-2 w-full font-medium placeholder:font-medium border-cor-outline'>{valueCell}</p>
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
                    </div >
                </div>
                : <></>
            }
        </>
    )
}

export default PeriodItensCells