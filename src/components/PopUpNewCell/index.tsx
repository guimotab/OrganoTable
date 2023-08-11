import { useEffect, useState } from 'react'
import { IObjectTable } from '../../shared/IObjectTable'
import FormInput from '../FormInput'
import { createFormatValue } from '../../utils/createFormatValue'
import { LocalStorager } from '../../service/LocalStorager'
import { IdTable } from '../../utils/IdTables'
import { CurrentTable } from '../../models/CurrentTable'
import { Tables } from '../../models/Tables'
import { ITableItens } from '../../shared/ITableItens'
import { createOthersInstallments } from '../../utils/installmentOrganizer'
import { log } from 'console'

interface PopUpProps {
    table: IObjectTable
    dateCurrent: string
    tables: IObjectTable[]
    // expensesPeriodItens: string[]
    // setExpensesPeriodItens: React.Dispatch<React.SetStateAction<string[]>>
    setMouseOutPopUp: React.Dispatch<React.SetStateAction<boolean>>
    setTables: React.Dispatch<React.SetStateAction<IObjectTable[]>>
}
const PopUpNewCell = ({ table, dateCurrent, tables, setMouseOutPopUp, setTables }: PopUpProps) => {
    const currentTable = new CurrentTable(table)
    const allTables = new Tables(tables)

    const [name, setName] = useState("")
    const [value, setValue] = useState("")
    const [type, setType] = useState("Despesas")
    const [valueInstallment, setValueInstallment] = useState("1")
    const [repeat, setRepeat] = useState(false)
    const [checkInstallment, setCheckInstallment] = useState(false)
    const [checkRepeat, setCheckRepeat] = useState(false)

    const [typeRepeat, setTypeRepeat] = useState("")
    const [daysRepeat, setDaysRepeat] = useState<string[]>([])


    function constructObjectPeriodItens(idTable: number, idItens: number) {
        if (repeat) {
            if (typeRepeat !== "") {
                if (typeRepeat === "Semanalmente" && !daysRepeat[0]) {
                    setRepeat(false)
                } else {
                    currentTable.periodsItens = [{
                        id: `${idTable}.${idItens}`,
                        periods: {
                            type: typeRepeat,
                            days: daysRepeat
                        },
                        lastMonthYear: ""
                    }]
                    setTypeRepeat("")
                    setDaysRepeat([])
                }
            } else {
                setRepeat(false)
            }
        } else if (!repeat) {
            setTypeRepeat("")
            setDaysRepeat([])
        }
    }
    function constructNewCell(lastIdCell: number) {
        let newCell
        const secondId = lastIdCell
        let idInstallment = ""
        if (parseFloat(valueInstallment) > 1) {
            idInstallment = `-${currentTable.id}P${secondId}`
        }
        newCell = {
            name: name,
            value: createFormatValue(value),
            installment: `1/${valueInstallment}`,
            repeat: repeat,
            type: type,
            paid: false,
            id: `${currentTable.id}.${secondId}${idInstallment}`
        }
        return newCell
    }
    function saveNewInformations(newCell: ITableItens) {
        currentTable.itensTable = [newCell]
        allTables.updateTables(dateCurrent, currentTable.getInformations())
        const novaTable = [...allTables.tables]
        setTables(novaTable)
        LocalStorager.saveInformations(tables)
    }
    function submitForm(event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLButtonElement>) {
        event.preventDefault()
        const checked = checkInputs()
        if (checked) {

            if (currentTable.itensTable[0]) {
                //atualiza tables
                const lastPositionCell = currentTable.itensTable.length - 1
                const lastIdCell = currentTable.itensTable[lastPositionCell].id
                const idItens = parseFloat(IdTable.returnIdCell(lastIdCell)) + 1

                constructObjectPeriodItens(parseFloat(currentTable.id), idItens)
                const newCell = constructNewCell(parseFloat(IdTable.returnIdCell(lastIdCell)) + 1)

                if (parseFloat(valueInstallment) > 1) {
                    createOthersInstallments(valueInstallment, currentTable, allTables, newCell);
                }
                saveNewInformations(newCell)
            } else {
                // cria currentTable inicial
                const lastIdTable = allTables.highestId()
                currentTable.id = `${lastIdTable + 1}`

                constructObjectPeriodItens(parseFloat(currentTable.id), 0)
                const newCell = constructNewCell(0)

                if (parseFloat(valueInstallment) > 1) {
                    createOthersInstallments(valueInstallment, currentTable, allTables, newCell);
                }
                saveNewInformations(newCell)
            }
        }
    }
    function checkInputs() {
        const checkName = name !== ""
        const checkValueIsNull = value === ""
        const checkRepeat = repeat === true && typeRepeat !== "" || repeat === false && typeRepeat === ""
        let checkTypeAndDayRepeat = true 
        if(typeRepeat === "Semanalmente" && !daysRepeat[0]) {
            checkTypeAndDayRepeat = false 
        }
        const checkValue = value !== "NaN"
        if (checkName && checkValue && checkRepeat && checkTypeAndDayRepeat && !checkValueIsNull) {
            return true
        } else {
            return false
        }
    }
    function changeDaysRepeat(event: React.ChangeEvent<HTMLInputElement>, day: string) {
        const daysArray = [...daysRepeat]
        if (event.target.checked) {
            daysArray.push(day)
            setDaysRepeat(daysArray)
        } else {
            const index = daysArray.findIndex(element => element === day)
            daysArray.splice(index, 1)
            setDaysRepeat(daysArray)
        }
    }
    function transformValueInput(event: React.FocusEvent<HTMLInputElement, Element>) {
        let targetValue = event.target.value
        if (targetValue !== "") {
            setValue(parseFloat(targetValue.replace(',', '.')).toFixed(2).replace('.', ','))
        }
    }
    function changeTypeRepeat(type: string) {
        setRepeat(true)
        if (type !== "Semanalmente") {
            setDaysRepeat([])
        }
        if (type === typeRepeat) {
            setDaysRepeat([])
            setTypeRepeat("")
        } else {
            setTypeRepeat(type)
        }
    }
    function changeRepeat() {
        setRepeat(!repeat)
        setCheckRepeat(!checkRepeat)
    }
    function changeValueInstallment(event: React.ChangeEvent<HTMLSelectElement>) {
        if (event.target.value !== "1/1") {
            setCheckInstallment(true)
        } else {
            setCheckInstallment(false)
        }
        let value = event.target.value
        value = value.split("/")[1]
        setValueInstallment(value)
    }

    const formInput = [
        {
            label: "Nome:",
            type: "text",
            value: name,
            minLength: 2,
            maxLength: 20,
            onChange: setName,
            pattern: "^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$",
            required: true,
        }, {
            label: "Valor:",
            tagP: "R$",
            type: "text",
            maxLength: 17,
            value: value,
            onChange: setValue,
            onBlur: transformValueInput,
            pattern: "^(\d+)((\,|\.)\d{2})?$",
            required: true,
        }
    ]
    const arrayDaysRepeat = [
        {
            label: "D",
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => changeDaysRepeat(event, "Domingo")
        }, {
            label: "S",
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => changeDaysRepeat(event, "Segunda")
        }, {
            label: "T",
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => changeDaysRepeat(event, "Terça")
        }, {
            label: "Q",
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => changeDaysRepeat(event, "Quarta")
        }, {
            label: "Q",
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => changeDaysRepeat(event, "Quinta")
        }, {
            label: "S",
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => changeDaysRepeat(event, "Sexta")
        }, {
            label: "S",
            onChange: (event: React.ChangeEvent<HTMLInputElement>) => changeDaysRepeat(event, "Sábado")
        },
    ]
    const buttonPeriods = [
        {
            label: "Diariamente",
            className: typeRepeat === "Diariamente" ? 'bg-cor-hover rounded-xl px-2 h-fit py-1 font-medium text-white' : 'bg-cor-terciaria rounded-xl px-2 h-fit py-1 font-medium text-white',
            onclick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => changeTypeRepeat("Diariamente")
        }, {
            label: "Semanalmente",
            className: typeRepeat === "Semanalmente" ? 'bg-cor-hover rounded-xl px-2 h-fit py-1 font-medium text-white' : 'bg-cor-terciaria rounded-xl px-2 h-fit py-1 font-medium text-white',
            onclick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => changeTypeRepeat("Semanalmente")
        }, {
            label: "Mensalmente",
            className: typeRepeat === "Mensalmente" ? 'bg-cor-hover rounded-xl px-2 h-fit py-1 font-medium text-white' : 'bg-cor-terciaria rounded-xl px-2 h-fit py-1 font-medium text-white',
            onclick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => changeTypeRepeat("Mensalmente")
        }, {
            label: "Anualmente",
            className: typeRepeat === "Anualmente" ? 'bg-cor-hover rounded-xl px-2 h-fit py-1 font-medium text-white' : 'bg-cor-terciaria rounded-xl px-2 h-fit py-1 font-medium text-white',
            onclick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => changeTypeRepeat("Anualmente")
        },
    ]
    const optionsSelectInput = [
        { label: "Despesas" },
        { label: "Investimento" },
        { label: "Beleza" },
        { label: "Saúde" },
        { label: "Outros" }
    ]
    let installmentSelectInput
    if (checkRepeat) {
        installmentSelectInput = [
            { label: "1/1" }
        ]
    } else {
        installmentSelectInput = [
            { label: "1/1" },
            { label: "1/2" },
            { label: "1/3" },
            { label: "1/4" },
            { label: "1/5" },
            { label: "1/6" },
            { label: "1/7" },
            { label: "1/8" },
            { label: "1/9" },
            { label: "1/10" },
            { label: "1/11" },
            { label: "1/12" }
        ]
    }
    return (
        <div
            onMouseLeave={() => setMouseOutPopUp(true)}
            onMouseEnter={() => setMouseOutPopUp(false)}
            className="absolute shadow-2xl border border-cor-secundaria rounded-xl bg-white px-9 py-9 h-fit w-[35rem] top-40 left-[46rem]">
            <form
                onSubmit={event => submitForm(event)}
                className='grid grid-cols-2 grid-rows-[auto]'>
                <div className='flex pb-4'>
                    {formInput.map((input, index) => <FormInput
                        key={index}
                        label={input.label}
                        type={input.type}
                        value={input.value}
                        minLength={input.minLength}
                        maxLength={input.maxLength}
                        onChange={input.onChange}
                        onBlur={input.onBlur}
                        pattern={input.pattern}
                        required={input.required}
                        tagP={input.tagP}
                    />)}
                </div>
                <div className='flex col-start-1 row-start-2 items-center justify-start gap-2 pb-4'>
                    <label className='font-medium'>Tipo: </label>
                    <select
                        onChange={event => setType(event.target.value)}
                        className='w-36 rounded-md border-2 border-gray-300 font-medium focus:border-cor-secundaria outline-none'>
                        {optionsSelectInput.map((option, index) =>
                            <option key={index} className='font-medium'>{option.label}</option>
                        )}
                    </select>
                </div>
                <div className='flex col-start-2 row-start-2 items-center justify-start gap-2 pb-4'>
                    <label className=' font-medium'>Parcelado: </label>
                    <select
                        onChange={event => changeValueInstallment(event)}
                        className='w-24 rounded-md py-0.5 border-2 border-gray-300 font-medium focus:border-cor-secundaria outline-none'>
                        {installmentSelectInput.map((option, index) =>
                            <option key={index} className='font-medium'>{option.label}</option>
                        )}
                    </select>
                </div>
                {!checkInstallment ?
                    <div className='flex items-center row-start-3 gap-1 pb-2'>
                        <label className='font-medium'>Repetir</label>
                        <input
                            checked={repeat}
                            type="checkbox"
                            onChange={event => changeRepeat()}
                        />
                    </div> : <></>
                }
                {repeat ?
                    <>
                        <div className='flex col-span-2 row-start-4 justify-between pb-2'>
                            {buttonPeriods.map((button, index) =>
                                <button
                                    key={index}
                                    onClick={event => changeTypeRepeat(button.label)}
                                    className={button.className}>
                                    {button.label}
                                </button>
                            )}
                        </div>
                    </> : <></>
                }
                {repeat && typeRepeat === "Semanalmente" ?
                    <div className='flex row-start-5 gap-3 '>
                        {arrayDaysRepeat.map((days, index) =>
                            <div key={index}>
                                <p className="font-medium ">{days.label}</p>
                                <input type='checkbox' onChange={(event) => days.onChange(event)} />
                            </div>
                        )}
                    </div>
                    : <></>}
                <div className='flex justify-center row-start-6 col-span-2'>
                    <button
                        type='submit'
                        onClick={event => submitForm(event)}
                        className='flex text-white bg-cor-secundaria w-fit px-4 py-0.5 rounded-lg font-medium text-lg'>
                        Criar
                    </button>
                </div>
            </form>

        </div >
    )
}

export default PopUpNewCell