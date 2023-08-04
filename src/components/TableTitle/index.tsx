import { useEffect, useState } from "react"
import { BiLeftArrow } from "react-icons/bi"
import { BiRightArrow } from "react-icons/bi"
import { dayTime } from "../../utils/dayTime"
import { Expenses } from "../../models/Expenses"

interface TableTitleProps {
    name: string
    expensesPeriodItens: string[]
    setDateCurrent: React.Dispatch<React.SetStateAction<string>>
    setExpensesPeriodItens: React.Dispatch<React.SetStateAction<string[]>>
    setExpenseClass: React.Dispatch<React.SetStateAction<Expenses>>
}

const TableTitle = ({ name, setDateCurrent, expensesPeriodItens, setExpensesPeriodItens, setExpenseClass }: TableTitleProps) => {
    let [monthNumber, setMonthNumber] = useState(0)

    function changeMonth(number: number) {
        setMonthNumber(number)
    }

    useEffect(() => {
        setDateCurrent(dayTime((monthNumber).toString()))
        if (expensesPeriodItens[0]) {
            setExpenseClass(new Expenses())
            setExpensesPeriodItens([])
        }
    }, [monthNumber])

    return (
        <div className='flex h-10 w-80 justify-start items-center text-white'>
            <button
                onClick={event => changeMonth(monthNumber -= 1)}
                className="flex h-full items-center px-2">
                <BiLeftArrow strokeWidth={1} size={22} color="#112D4E"/>
            </button>
            <h1 className='flex h-full justify-center text-center text-cor-terciaria text-2xl font-bold'>
                {name}
            </h1>
            <button
                onClick={event => changeMonth(monthNumber += 1)}
                className="flex h-full items-center px-2">
                <BiRightArrow strokeWidth={1} size={22} color="#112D4E"/>
            </button>
        </div>
    )
}
export default TableTitle