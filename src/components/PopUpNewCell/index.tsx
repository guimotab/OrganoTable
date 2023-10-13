import { useEffect, useState } from "react"
import FormInputText from "../Forminputs/FormInputText"
import FormInputSelect from "../Forminputs/FormInputSelect"
import useTablesInformations from "../../state/hooks/useTablesInformations"
import { Tables } from "../../models/Tables"
import { CurrentTable } from "../../models/CurrentTable"
import findCurrentTable from "../../utils/findCurrentTable"
import { ITableItens } from "../../shared/interfaces/ITableItens"
import { LocalStorager } from "../../service/LocalStorager"
import { useUpdateAllTables } from "../../state/hooks/useUpdateAllTables"
import useCurrentMonth from "../../state/hooks/useCurrentTableMonth"
import { createFormatValue } from "../../utils/createFormatValue"
import { IdTable } from "../../utils/IdTables"
import IPeriodsItens from "../../shared/interfaces/IPeriodsItens"
import usePeriodItens from "../../state/hooks/usePeriodItens"
import { useUpdatePeriodItens } from "../../state/hooks/useUpdatePeriodItens"
import { createOthersInstallments } from "../../utils/installmentOrganizer"

interface PopUpNewCellProps{
    setOpenPopUp: React.Dispatch<React.SetStateAction<boolean>>
}

const PopUpNewCell = ({setOpenPopUp}: PopUpNewCellProps) => {
    const allTables = new Tables(useTablesInformations())
    const setAllTables = useUpdateAllTables()
    const dateCurrent = useCurrentMonth()
    const periodItens = usePeriodItens()
    const setPeriodItens = useUpdatePeriodItens()
    let currentTable = new CurrentTable(findCurrentTable(allTables.tables, dateCurrent))

    useEffect(() => {
        currentTable = new CurrentTable(findCurrentTable(allTables.tables, dateCurrent))
    }, [dateCurrent])

    const [name, setName] = useState("")
    const [value, setValue] = useState("")
    const [type, setType] = useState("Despesas")
    const [valueInstallment, setValueInstallment] = useState("1")
    const [repeat, setRepeat] = useState(false)
    const [checkInstallment, setCheckInstallment] = useState(false)
    const [checkRepeat, setCheckRepeat] = useState(false)
    const [typeRepeat, setTypeRepeat] = useState("")
    const [daysRepeat, setDaysRepeat] = useState<string[]>([])
    function constructObjectPeriodItens(idPeriodItens: string) {
        if (typeRepeat !== "") {
            if (typeRepeat === "Semanalmente" && !daysRepeat[0]) {
                setRepeat(false)
            } else {
                const arrayPeriodItens = [...periodItens]
                const newPeriodItens = {
                    id: `${idPeriodItens}`,
                    periods: {
                        type: typeRepeat,
                        days: daysRepeat
                    },
                    datePaid: [],
                    showUntilMonth: ""
                } as IPeriodsItens
                arrayPeriodItens.push(newPeriodItens)
                setPeriodItens(arrayPeriodItens)
                LocalStorager.savePeriodItens(arrayPeriodItens)
                setTypeRepeat("")
                setDaysRepeat([])
            }
        }
    }
    function constructNewCell(secondId: number) {
        let newCell
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
        setAllTables([...allTables.tables])
        LocalStorager.saveTablesInformations([...allTables.tables])
    }
    function submitForm(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        function checkInputs() {
            const checkName = name !== ""
            const checkValueIsNull = value === ""
            let checkRepeat = true
            if(repeat){
                checkRepeat = repeat === true && typeRepeat !== ""
            }
            let checkTypeAndDayRepeat = true
            if (typeRepeat === "Semanalmente" && !daysRepeat[0]) {
                checkTypeAndDayRepeat = false
            }
            const checkValue = value !== "NaN"
            if (checkName && checkValue && checkRepeat && checkTypeAndDayRepeat && !checkValueIsNull) {
                return true
            } else {
                return false
            }
        }
        event.preventDefault()
        if (checkInputs()) {
            if (currentTable.itensTable[0]) {
                const lastPositionCell = currentTable.itensTable.length - 1
                const lastIdCell = currentTable.itensTable[lastPositionCell].id
                const newCell = constructNewCell(parseFloat(IdTable.returnIdCell(lastIdCell)) + 1)
                if (newCell.repeat) {
                    constructObjectPeriodItens(newCell.id)
                }
                if(newCell.installment !== "1/1"){
                    createOthersInstallments(valueInstallment, currentTable, allTables, newCell);
                }
                saveNewInformations(newCell)
            } else {
                const highestId = allTables.highestId()
                if(currentTable.id === "0"){
                    currentTable.id = `${highestId + 1}`
                }
                const newCell = constructNewCell(1)
                if (newCell.repeat) {
                    constructObjectPeriodItens(newCell.id)
                }
                if(newCell.installment !== "1/1"){
                    createOthersInstallments(valueInstallment, currentTable, allTables, newCell);
                }
                saveNewInformations(newCell)
            }
            setOpenPopUp(false)
        }
    }
    function changeValueInstallment(event: React.ChangeEvent<HTMLSelectElement>) {
        if (event.target.value !== "1/1") {
            setCheckInstallment(true)
        } else {
            setCheckInstallment(false)
        }
        let targetValue = event.target.value.split("/")[1]
        setValueInstallment(targetValue)
    }
    function changeRepeat() {
        setRepeat(!repeat)
        setCheckRepeat(!checkRepeat)
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
    const formInput = [
        {
            label: "Nome:",
            value: name,
            minLength: 2,
            maxLength: 20,
            setValue: setName,
            pattern: "^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$",
            required: true,
        }, {
            label: "Valor:",
            tagP: "R$",
            value: value,
            maxLength: 17,
            setValue: setValue,
            pattern: "^(\d+)((\,|\.)\d{2})?$",
            required: true,
        }
    ]
    const inputSelect = [
        {
            label: "Tipo",
            colStart: "1",
            widthClassName: "w-36",
            onChange: (event: React.ChangeEvent<HTMLSelectElement>) => setType(event.target.value)
        },
        {
            label: "Parcelado",
            colStart: "2",
            widthClassName: "w-24",
            onChange: (event: React.ChangeEvent<HTMLSelectElement>) => changeValueInstallment(event),
            checkRepeat: checkRepeat
        }
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
    return (
        <div className='mr-[33rem] z-10'>
            <div className="absolute shadow-2xl border border-cor-secundaria rounded-xl bg-white p-9 h-fit w-[35rem] top-40">
                <form className='grid grid-cols-2 grid-rows-[auto]'>
                    {formInput.map((input, index) => <FormInputText
                        key={index}
                        label={input.label}
                        value={input.value}
                        minLength={input.minLength}
                        maxLength={input.maxLength}
                        setValue={input.setValue}
                        pattern={input.pattern}
                        tagP={input.tagP}
                    />)}

                    {inputSelect.map((input, index) => <FormInputSelect
                        key={index}
                        label={input.label}
                        colStart={input.colStart}
                        widthClassName={input.widthClassName}
                        onChange={input.onChange}
                        checkRepeat={input.checkRepeat} />)
                    }
                    {!checkInstallment ?
                        <div className='flex items-center row-start-3 gap-1 pb-2'>
                            <label className='font-medium'>Repetir</label>
                            <input checked={repeat} type="checkbox" onChange={event => changeRepeat()} />
                        </div> : <></>
                    }
                    {repeat ?
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
                        : <></>
                    }
                    {repeat && typeRepeat === "Semanalmente" ?
                        <div className='flex row-start-5 gap-3 '>
                            {arrayDaysRepeat.map((days, index) =>
                                <div key={index}>
                                    <p className="font-medium ">{days.label}</p>
                                    <input type='checkbox' onChange={(event) => days.onChange(event)} />
                                </div>
                            )}
                        </div> : <></>
                    }
                    <div className='flex justify-center row-start-6 col-span-2'>
                        <button
                            type='submit'
                            onClick={event => submitForm(event)}
                            className='flex text-white bg-cor-secundaria w-fit px-4 py-0.5 rounded-lg font-medium text-lg'>
                            Criar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default PopUpNewCell