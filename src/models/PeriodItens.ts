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
    updateShowUntilMonth(indexPeriodItens: number, newMonth: string) {
        const periodItens = [...this._periodItens]
        const thisPeriodItens = periodItens[indexPeriodItens]
        const newPeriodItens = {
            id: thisPeriodItens.id,
            periods: thisPeriodItens.periods,
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