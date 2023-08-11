import { useEffect, useState } from "react"
import { IObjectTable } from "../../shared/IObjectTable"
import { LocalStorager } from "../../service/LocalStorager"
import { CurrentTable } from "../../models/CurrentTable"
import { Tables } from "../../models/Tables"
interface InputSalaryProps {
    table: IObjectTable
    tables: IObjectTable[],
    dateCurrent: string
    setTables: React.Dispatch<React.SetStateAction<IObjectTable[]>>
    currentSalary: string
    setCurrentSalary: React.Dispatch<React.SetStateAction<string>>
}

const InputSalary = ({ table, tables, dateCurrent, setTables, currentSalary, setCurrentSalary }: InputSalaryProps) => {
    const currentTable = new CurrentTable(table)
    const allTables = new Tables(tables)

    const [showSalaryValue, setShowSalaryValue] = useState(table.salary)
    const [errorInput, setErrorInput] = useState(false)
    
    useEffect(()=>{
        table.salary === "" ?
        setShowSalaryValue("0,00") :
        setShowSalaryValue((table.salary.replace('.', ',')))
    },[tables, dateCurrent])

    function checkInput(event: React.FocusEvent<HTMLInputElement, Element>) {
        let targeValue = event.target.value
        if(targeValue === ""){
            if(currentSalary === ""){
                targeValue = "0,00"
            } else {
                targeValue = currentSalary
            }
        }
        const valueInput = parseFloat(targeValue.replace(',', '.')).toFixed(2)

        if (valueInput !== "NaN") {
            setErrorInput(false)
            setCurrentSalary(valueInput)
            setShowSalaryValue(valueInput.replace('.', ','))
            currentTable.salary = valueInput
            allTables.updateTables(currentTable.monthTable, currentTable.getInformations())
            setTables(allTables.returnTables())
            LocalStorager.saveInformations(tables)
        } else {
            setErrorInput(true)
        }
    }
    return (
        <div className="flex py-2 px-4 w-fit gap-2">
            <label className="font-medium text-lg">Salário:</label>
            <div className="flex flex-col gap-1 w-40">
                <div className="flex">
                    <p className="font-medium">R$</p>
                    {
                        <input
                            placeholder={currentSalary}
                            type="text"
                            maxLength={14}
                            value={showSalaryValue}
                            onChange={event => setShowSalaryValue(event.target.value)}
                            onBlur={event => checkInput(event)}
                            className="px-1 focus:outline-none rounded-lg font-medium" />
                    }
                </div>
                <div className="border-b-2 border-cor-secundaria border-dashed w-full"></div>
                {errorInput ? <div className="text-cor-erro font-medium">Use um valor válido. Ex: 44,22 ou 44.22</div> : ""}
            </div>
        </div>
    )
}

export default InputSalary