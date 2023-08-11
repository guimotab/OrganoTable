import { useEffect, useState } from "react"
import { CurrentTable } from "../../models/CurrentTable"
import { IObjectTable } from "../../shared/IObjectTable"
import { ITableItens } from "../../shared/ITableItens"

interface ResultOnMonth {
    // tables: IObjectTable[]
    table: IObjectTable
    expensesTableItems: number
    // dateCurrent: string
    valueSalary: string
    expensesPeriodItens: string[]
    // setExpensesPeriodItens: React.Dispatch<React.SetStateAction<string[]>>
}
const ResultOnMonth = ({table, expensesTableItems, expensesPeriodItens }: ResultOnMonth) => { 
    const [resultOnMonthValue, setResulOnMonthValue] = useState(resultOnMonth(table.salary, expensesTableItems))
    
    useEffect(()=>{
        const value = resultOnMonth(table.salary, expensesTableItems)
        setResulOnMonthValue(value)
    },[table, expensesPeriodItens, expensesTableItems])

    function resultOnMonth(valueSalary: string, expensesTableItems: number) {
        
        let salaryFloat = 0
        valueSalary === "" ? salaryFloat = 0 : salaryFloat = parseFloat(valueSalary)
        let allExpenses = 0
        expensesPeriodItens.forEach(expenses => {
            allExpenses += parseFloat(expenses.replace(',', '.'))
        })
        allExpenses += expensesTableItems
        salaryFloat -= allExpenses
        return salaryFloat
    }
    return (
        <div className='pr-2 pl-24'>
            <h2 className="flex px-4 font-medium text-lg border-2 rounded-lg border-gray-400">
                Total no mês: R${resultOnMonthValue.toFixed(2).replace('.', ',')}
            </h2>
        </div>
    )
}

export default ResultOnMonth