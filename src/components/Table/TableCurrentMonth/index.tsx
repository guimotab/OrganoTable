import { BiLeftArrow } from "react-icons/bi"
import { BiRightArrow } from "react-icons/bi"
import useCurrentMonth from "../../../state/hooks/useCurrentTableMonth"
import { useUpdateCurrentMonth } from "../../../state/hooks/useUpdateCurrentMonth"
import { dayTime } from "../../../utils/dayTime"
import { useEffect, useState } from "react"
import useTablesInformations from "../../../state/hooks/useTablesInformations"
const TableCurrentMonth = () => {
    let [monthNumber, setMonthNumber] = useState(0)
    const currentMonth = useCurrentMonth()
    const updateCurrentMonth = useUpdateCurrentMonth()
    const currentTable = useTablesInformations()
    useEffect(() => {
        updateCurrentMonth(dayTime((monthNumber).toString()))
    }, [monthNumber])
    function incrementNumber() {
        setMonthNumber(monthNumber += 1)
    }
    function decrementNumber() {
        if (currentTable[0].monthTable !== dayTime((monthNumber).toString())) {
            setMonthNumber(monthNumber -= 1)
        }
    }
    return (
        <div className='flex h-10 w-80 justify-start items-center text-white'>
            <button
                onClick={decrementNumber}
                className="flex h-full items-center px-2">
                <BiLeftArrow strokeWidth={1} size={22} color="#112D4E" />
            </button>
            <h2 className='flex h-full w-48 justify-center text-center text-cor-terciaria text-2xl font-bold'>
                {currentMonth}
            </h2>
            <button
                onClick={incrementNumber}
                className="flex h-full items-center px-2">
                <BiRightArrow strokeWidth={1} size={22} color="#112D4E" />
            </button>
        </div>
    )
}

export default TableCurrentMonth