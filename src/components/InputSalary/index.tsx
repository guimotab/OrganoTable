import { useEffect, useState } from "react"
import { IObjectTable } from "../../shared/IObjectTable"
import { LocalStorager } from "../../service/LocalStorager"
import { dayTime } from "../../utils/dayTime"
import { CurrentTable } from "../../models/CurrentTable"
import { Tables } from "../../models/Tables"
interface InputSalaryProps {
    table: IObjectTable
    tables: IObjectTable[],
    dateCurrent: string
    setTables: React.Dispatch<React.SetStateAction<IObjectTable[]>>
}

const InputSalary = ({ table, tables, dateCurrent, setTables }: InputSalaryProps) => {
    const currentTable = new CurrentTable(table)
    const allTables = new Tables(tables)

    const indexCurrentTable = allTables.tables.findIndex(object => object.monthTable === dateCurrent)

    const [salaryValue, setSalaryValue] = useState("")
    const [showSalaryValue, setShowSalaryValue] = useState("")
    const [changeInput, setChangeInput] = useState(false)
    const [errorInput, setErrorInput] = useState(false)

    // function setValue(event?: React.ChangeEvent<HTMLInputElement>){
    //     let salary
    //     if(event){
    //         salary = event.target.value
    //     } else {
    //         setShowSalaryValue(table.salary)
    //     }

    //     return salary
    // }
    function checkInput(event: React.FocusEvent<HTMLInputElement, Element>) {
        let targeValue = event.target.value
        if(targeValue === ""){
            if(currentTable.salary === ""){
                targeValue = "0,00"
            } else {
                targeValue = currentTable.salary
            }
        }
        const valueInput = parseFloat(targeValue.replace(',', '.')).toFixed(2)
        const regex = /^(\d+)((\.)\d{2})?$/
        const result = regex.test(valueInput)

        if (result) {
            setSalaryValue(valueInput)
            setShowSalaryValue("")
            setErrorInput(false)
            setChangeInput(false)

            const newObjects = [...allTables.tables]
            newObjects[indexCurrentTable].salary = valueInput.replace('.', ',')

            setTables(newObjects)
            LocalStorager.saveInformations(allTables.tables)
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
                    {changeInput ?
                        <input
                            placeholder={currentTable.salary}
                            type="text"
                            autoFocus
                            maxLength={14}
                            value={showSalaryValue}
                            onChange={event => setShowSalaryValue(event.target.value)}
                            onBlur={event => checkInput(event)}
                            className="px-1 focus:outline-none rounded-lg font-medium" />
                        :
                        <p onClick={event => setChangeInput(true)} className="px-1 w-full rounded-lg font-medium cursor-text">
                            {currentTable.salary == "" ? "0,00" : currentTable.salary}
                        </p>
                    }
                </div>
                <div className="border-b-2 border-cor-secundaria border-dashed w-full"></div>
                {errorInput ? <div className="text-cor-erro font-medium">Use um valor válido. Ex: 44,22 ou 44.22</div> : ""}
            </div>
        </div>
    )
}

export default InputSalary