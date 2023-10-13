import IPeriodsItens from "../shared/interfaces/IPeriodsItens";

export class PeriodItens {
    private _periodItens: IPeriodsItens[]
    constructor(periodItens: IPeriodsItens[]) {
        this._periodItens = periodItens
    }
    splicePeriods(index: number, quantity: number = 1) {
        const periodItens = [...this._periodItens]
        periodItens.splice(index, quantity)
        this._periodItens = periodItens
    }
    addDatePaid(index: number, month: string) {
        const periodItens = [...this._periodItens]
        const newPeriodItens = {    
            id: periodItens[index].id,
            periods: periodItens[index].periods, 
            showUntilMonth: periodItens[index].showUntilMonth,
            datePaid: [...periodItens[index].datePaid, month]
        } as IPeriodsItens
        periodItens[index] = newPeriodItens
        this._periodItens = periodItens
    }
    removeDatePaid(index: number, indexMonth: number) {
        const periodItens = [...this._periodItens]
        const datePaid = [...periodItens[index].datePaid]
        datePaid.splice(indexMonth, 1)
        const newPeriodItens = {    
            id: periodItens[index].id,
            periods: periodItens[index].periods, 
            showUntilMonth: periodItens[index].showUntilMonth,
            datePaid: datePaid
        } as IPeriodsItens
        periodItens[index] = newPeriodItens
        this._periodItens = periodItens
    }
    updateShowUntilMonth(indexPeriodItens: number, newMonth: string) {
        const periodItens = [...this._periodItens]
        const thisPeriodItens = periodItens[indexPeriodItens]
        const newPeriodItens = {
            id: thisPeriodItens.id,
            periods: thisPeriodItens.periods,
            datePaid: [],
            showUntilMonth: newMonth
        } as IPeriodsItens
        periodItens[indexPeriodItens] = newPeriodItens
        this._periodItens = periodItens
    }

    public get periodItens(): IPeriodsItens[] {
        return this._periodItens
    }
    public set periodItens(periodItens: IPeriodsItens[]) {
        this._periodItens = periodItens
    }

}