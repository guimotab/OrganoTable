export default interface IPeriodsItens{
    id: string,
    periods: {
        type: string
        days?: string[]
    }
    datePaid: string[]
    showUntilMonth: string
}