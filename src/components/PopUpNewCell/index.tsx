import { useEffect, useState } from 'react'
import { IObjectTable } from '../../shared/IObjectTable'
import FormInput from '../FormInput'
import { createFormatValue } from '../../utils/createFormatValue'
import { LocalStorager } from '../../service/LocalStorager'
import { IdTable } from '../../utils/IdTables'
import { CurrentTable } from '../../models/CurrentTable'
import { Tables } from '../../models/Tables'
import { ITableItens } from '../../shared/ITableItens'

interface PopUpProps {
    table: IObjectTable
    dateCurrent: string
    tables: IObjectTable[]
    expensesPeriodItens: string[]
    setExpensesPeriodItens: React.Dispatch<React.SetStateAction<string[]>>
    hidden: () => void
    setTables: React.Dispatch<React.SetStateAction<IObjectTable[]>>
}
const PopUpNewCell = ({ table, hidden, dateCurrent, tables, expensesPeriodItens, setExpensesPeriodItens, setTables }: PopUpProps) => {
    const currentTable = new CurrentTable(table)
    const allTables = new Tables(tables)

    const [installment, setInstallment] = useState(false)
    const [name, setName] = useState("")
    const [value, setValue] = useState("")
    const [type, setType] = useState("")
    const [valueInstallment, setValueInstallment] = useState("1")
    const [repeat, setRepeat] = useState(false)

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
            saveNewInformations(newCell)
        } else {
            // cria currentTable inicial
            const lastIdTable = allTables.highestIndex()
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
            saveNewInformations(newCell)
        }
    }
    function changeDaysRepeat(event: React.ChangeEvent<HTMLInputElement>, day: string) {
        const daysArray = [...daysRepeat]
        daysArray.push(day)
        setDaysRepeat(daysArray)
        if (!event.target.checked) {
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
            setRepeat(false)
            setTypeRepeat("")
        } else {
            setTypeRepeat(type)
        }
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
        }, {
            label: "Tipo:",
            type: "text",
            value: type,
            onChange: setType,
            pattern: "^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$",
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
    return (
        <div className="absolute bg-cor-secundaria py-3 h-fit w-[34rem] top-48 left-[48rem]">
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
                <div className='flex gap-1 ml-5 mr-8 px-2'>
                    <label className='text-white font-medium'>Parcelado</label>
                    <input
                        type="checkbox"
                        onChange={event => setInstallment(!installment)}
                    />
                </div>
                {installment ?
                    <FormInput
                        key={5}
                        label="Parcelas:"
                        type="number"
                        minLength={2}
                        maxLength={12}
                        value={valueInstallment}
                        onChange={setValueInstallment}
                        required={true}
                    /> : <></>
                }
                <div className='flex gap-1 ml-5 mr-8 px-2'>
                    <label className='text-white font-medium'>Repetir</label>
                    <input
                        checked={repeat}
                        type="checkbox"
                        onChange={event => setRepeat(!repeat)}
                    />
                </div>
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

        </div>
    )
}

export default PopUpNewCell