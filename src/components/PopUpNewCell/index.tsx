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
    expensesPeriodItens: string[]
    setMouseOutPopUp: React.Dispatch<React.SetStateAction<boolean>>
    setExpensesPeriodItens: React.Dispatch<React.SetStateAction<string[]>>
    hidden: () => void
    setTables: React.Dispatch<React.SetStateAction<IObjectTable[]>>
}
const PopUpNewCell = ({ table, hidden, dateCurrent, tables, setMouseOutPopUp, expensesPeriodItens, setExpensesPeriodItens, setTables }: PopUpProps) => {
    const currentTable = new CurrentTable(table)
    const allTables = new Tables(tables)

    const [installment, setInstallment] = useState(false)
    const [name, setName] = useState("")
    const [value, setValue] = useState("")
    const [type, setType] = useState("")
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
                        }
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
    function saveNewInformations(newCell: ITableItens) {
        currentTable.itensTable = [newCell]
        allTables.updateTables(dateCurrent, currentTable.getInformations())
        const novaTable = [...allTables.tables]
        setTables(novaTable)
        LocalStorager.saveInformations(tables)
    }
    function submitForm(event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent> | React.FormEvent<HTMLButtonElement>) {
        event.preventDefault()

        if (currentTable.itensTable[0]) {
            //atualiza tables
            const lastPositionCell = currentTable.itensTable.length - 1
            const lastIdCell = currentTable.itensTable[lastPositionCell].id
            const idItens = parseFloat(IdTable.returnIdCell(lastIdCell)) + 1

            constructObjectPeriodItens(parseFloat(currentTable.id), idItens)

            const newCell = {
                name: name,
                value: createFormatValue(value),
                installment: `1/${valueInstallment}`,
                repeat: repeat,
                type: type,
                paid: false,
                id: `${currentTable.id}.${parseFloat(IdTable.returnIdCell(lastIdCell)) + 1}`
            }

            if (parseFloat(valueInstallment) > 1) {
                createOthersInstallments(valueInstallment, currentTable, allTables, newCell);
            }
            saveNewInformations(newCell)
        } else {
            // cria currentTable inicial
            const lastIdTable = allTables.highestId()
            currentTable.id = `${lastIdTable + 1}`
            constructObjectPeriodItens(parseFloat(currentTable.id), 0)
            const newCell = {
                name: name,
                value: createFormatValue(value),
                installment: `1/${valueInstallment}`,
                repeat: repeat,
                type: type,
                paid: false,
                id: `${currentTable.id}.0`
            }
            if (parseFloat(valueInstallment) > 1) {
                createOthersInstallments(valueInstallment, currentTable, allTables, newCell);
            }
            saveNewInformations(newCell)
        }
    }
    function changeDaysRepeat(event: React.ChangeEvent<HTMLInputElement>, day: string) {
        const daysArray = [...daysRepeat]
        if (event.target.checked) {
            daysArray.push(day)
            setDaysRepeat(daysArray)
            console.log(daysArray);
        } else {
            const index = daysArray.findIndex(element => element === day)
            daysArray.splice(index, 1)
            setDaysRepeat(daysArray)
            console.log(daysArray);
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
    function changeInstallment() {
        if (!installment) {
            setValueInstallment("2")
        } else if (installment) {
            setValueInstallment("1")
        }
        setCheckInstallment(!checkInstallment)
        setInstallment(!installment)
    }
    function changeRepeat() {
        setRepeat(!repeat)
        setCheckRepeat(!checkRepeat)
    }
    function changeValueInstallment(event: React.ChangeEvent<HTMLSelectElement>) {
        if(event.target.value !== "1/1"){
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
    if(checkRepeat){
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
            className="absolute bg-cor-secundaria py-3 h-fit w-[34rem] top-36 left-[46rem]">
            <div>
                <button onClick={() => hidden()} className='flex mx-2 px-2.5 text-black font-medium rounded-lg bg-white'>X</button>
            </div>
            <form onSubmit={event => submitForm(event)} className='flex flex-col gap-2'>
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
                <div className='flex items-center justify-between gap-2 ml-5 mr-5 px-2 '>
                    <label className='text-white font-medium'>Tipo: </label>
                    <select onChange={event => setType(event.target.value)} className='font-medium'>
                        {optionsSelectInput.map((option, index) =>
                            <option key={index} className='font-medium'>{option.label}</option>
                        )}
                    </select>
                </div>
                <div className='flex justify-between mr-7'>
                    <div className='flex gap-1 ml-5 mr-8 px-2'>
                        <label className='text-white font-medium'>Parcelado: </label>
                    </div>
                    <select onChange={event => changeValueInstallment(event)} className='w-24 font-medium'>
                        {installmentSelectInput.map((option, index) =>
                            <option key={index} className='font-medium'>{option.label}</option>
                        )}
                    </select>
                </div>
                {
                    !checkInstallment ?
                        <div className='flex gap-1 ml-5 mr-8 px-2'>
                            <label className='text-white font-medium'>Repetir</label>
                            <input
                                checked={repeat}
                                type="checkbox"
                                onChange={event => changeRepeat()}
                            />
                        </div> : <></>
                }
                {repeat ?
                    <>
                        <div className='flex mx-7 justify-between'>
                            {buttonPeriods.map((button, index) =>
                                <button
                                    onClick={event => changeTypeRepeat(button.label)}
                                    className={button.className}>
                                    {button.label}
                                </button>
                            )}
                        </div>
                    </> : <></>
                }
                {repeat && typeRepeat === "Semanalmente" ?
                    <div className='flex gap-3 mx-7'>
                        {arrayDaysRepeat.map((days, index) =>
                            <div key={index}>
                                <p className="font-medium text-white">{days.label}</p>
                                <input type='checkbox' onChange={(event) => days.onChange(event)} />
                            </div>
                        )}
                    </div>
                    : <></>}
                <button
                    type='submit'
                    onClick={event => submitForm(event)}
                    className='flex self-center bg-white w-fit px-4 py rounded-lg font-medium text-lg'
                >Criar</button>
            </form>

        </div >
    )
}

export default PopUpNewCell