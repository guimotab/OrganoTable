import { useEffect, useState } from "react"
import { CurrentTable } from "../../models/CurrentTable"
import { IObjectTable } from "../../shared/IObjectTable"

interface ResultOnMonth {
    // tables: IObjectTable[]
    // table: IObjectTable
    // dateCurrent: string
    resultOnMonth: number
    // expensesPeriodItens: string[]
    // setExpensesPeriodItens: React.Dispatch<React.SetStateAction<string[]>>
}
//o fato de reiniciar em julho e agosto, naõ é culpa desse lugar
const ResultOnMonth = ({ resultOnMonth }: ResultOnMonth) => {
    return (
        <h2 className="flex px-4 font-medium text-lg border-2 rounded-lg border-gray-400">
            Total no mês: R${resultOnMonth.toFixed(2).replace('.', ',')}
        </h2>
    )
}

export default ResultOnMonth