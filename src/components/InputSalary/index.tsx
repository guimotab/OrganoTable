import { useEffect } from "react"
import useCurrentMonth from "../../state/hooks/useCurrentTableMonth"
import useTablesInformations from "../../state/hooks/useTablesInformations"
import findCurrentTable from "../../utils/findCurrentTable"
import useSalaryTable from "../../state/hooks/useSalaryTable"
import { useUpdateSalaryTable } from "../../state/hooks/useUpdateSalaryTable"
import { CurrentTable } from "../../models/CurrentTable"
import { Tables } from "../../models/Tables"
import { LocalStorager } from "../../service/LocalStorager"
import { useUpdateAllTables } from "../../state/hooks/useUpdateAllTables"

const InputSalary = () => {
    const allTables = new Tables(useTablesInformations())
    const setAllTables = useUpdateAllTables()
    const dateCurrent = useCurrentMonth()
    let currentTable = new CurrentTable(findCurrentTable(allTables.tables, dateCurrent))
    let salaryTable = useSalaryTable()
    const setSalaryTable = useUpdateSalaryTable()
    useEffect(()=>{
        setSalaryTable(currentTable.salary.replace('.',','))
    },[dateCurrent])
    function checkInput(event: React.FocusEvent<HTMLInputElement, Element>){
        if(salaryTable !== "NaN"){
            const numberSalary = parseFloat(salaryTable.replace(',', '.'))
            currentTable.salary = numberSalary.toFixed(2).replace('.', ',')
            setSalaryTable(currentTable.salary)
            allTables.updateTables(dateCurrent, currentTable.getInformations())
            setAllTables(allTables.tables)
            LocalStorager.saveTablesInformations(allTables.tables)
        }
    }
    return (
        <div className="flex max-w-6xl w-full py-2 gap-2 px-10">
            <label className="font-medium text-lg">Salário:</label>
            <div className="flex flex-col">
                <div className="flex items-center">
                    <p className="font-medium">R$</p>
                    <input
                        placeholder={salaryTable}
                        type="text"
                        maxLength={14}
                        value={salaryTable}
                        onChange={event => setSalaryTable(event.target.value)}
                        onBlur={event => checkInput(event)}
                        className="px-1 focus:outline-none rounded-lg font-medium" />
                </div>
                <div className="border-b-2 border-cor-secundaria border-dashed w-full"></div>
            </div>
        </div>
    )
}


export default InputSalary