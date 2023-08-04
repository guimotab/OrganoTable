import { daysOnMonth, findMonth, returnMonthYear } from "./dayTime"

export function createFormatValue(value: string, setValueCell?: React.Dispatch<React.SetStateAction<string>>) {
    let money = parseFloat(value.replace(",", ".")).toFixed(2).replace(".", ",")

    // const sl = money.toLocaleString('pt-br', {maximumFractionDigits: 2, minimumFractionDigits:2})

    if (setValueCell) {
        setValueCell(money)
    }
    return money
}

export function showValue(value: string, typeRepeat: string, dateTable: string, daysRepeat: string[] = []) {
    const [month, year] = returnMonthYear(dateTable)
    const days = daysOnMonth(month, year)
    const valueFloat = parseFloat(value.replace(",", "."))

    let money = valueFloat.toFixed(2).replace(".", ",")

    if (typeRepeat === "Diariamente") {
        money = (valueFloat * days).toFixed(2).replace(".", ",")
    }

    if (typeRepeat === "Semanalmente") {
        const daysOfItensTable = [] as string[]
        const daysOfWeek = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
        const monthNumber = (findMonth(month) + 1).toString().padStart(2, "0")
        const nextMonthNumber = (findMonth(month) + 2).toString().padStart(2, "0")
        
        for (let i = 2; i < days; i++) {
            const iString = i.toString().padStart(2, "0")
            const iDay = (i - 1).toString().padStart(2, "0")
            const data = new Date(`${year}-${monthNumber}-${iString}`).getDay()
            daysRepeat.forEach(day => day === daysOfWeek[data] ? daysOfItensTable.push(iDay) : "")
        }
        const data = new Date(`${year}-${nextMonthNumber}-01`).getDay()
        daysRepeat.forEach(day => day === daysOfWeek[data] ? daysOfItensTable.push(`${days}`) : "")

        const daysOfMonth = daysOfItensTable.length;
        money = (valueFloat * daysOfMonth).toFixed(2).replace(".", ",")
    }
    return money
}