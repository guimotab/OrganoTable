import { useEffect, useState } from "react"
import { CurrentTable } from "../../models/CurrentTable"
import { IObjectTable } from "../../shared/IObjectTable"

interface ResultOnMonth {
    // tables: IObjectTable[]
    table: IObjectTable
    // dateCurrent: string
    valueSalary: string
    expensesPeriodItens: string[]
    // setExpensesPeriodItens: React.Dispatch<React.SetStateAction<string[]>>
}
//o fato de reiniciar em julho e agosto, naõ é culpa desse lugar
const ResultOnMonth = ({table, valueSalary, expensesPeriodItens }: ResultOnMonth) => { 
    function resultOnMonth(valueSalary: string) {
        let salaryFloat = 0
        valueSalary === "" ? salaryFloat = 0 : salaryFloat = parseFloat(valueSalary)
        let allExpenses = 0
        expensesPeriodItens.forEach(expenses => {
            allExpenses += parseFloat(expenses.replace(',', '.'))
        })
        currentTable.itensTable.forEach(expenses => !expenses.repeat ? allExpenses += parseFloat(expenses.value) : "")
        salaryFloat -= allExpenses
        return salaryFloat
    }
    const currentTable = new CurrentTable(table)
    const [resultOnMonthValue, setResulOnMonthValue] = useState(resultOnMonth(valueSalary))
    useEffect(()=>{
        setResulOnMonthValue(resultOnMonth(valueSalary))
    },[valueSalary])
    return (
        <div className='pr-2 pl-24'>
            <h2 className="flex px-4 font-medium text-lg border-2 rounded-lg border-gray-400">
                Total no mês: R${resultOnMonthValue.toFixed(2).replace('.', ',')}
            </h2>
        </div>
    )
}

export default ResultOnMonth