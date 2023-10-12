import { IObjectTable } from "../shared/interfaces/IObjectTable";
import IPeriodsItens from "../shared/interfaces/IPeriodsItens";
import { ITableItens } from "../shared/interfaces/ITableItens";
import { dayTime } from "../utils/dayTime";

export class CurrentTable {
    private _id: string
    private _monthTable: string
    private _salary: string
    private _itensTable: ITableItens[]

    constructor({ id, monthTable, salary, itensTable }: IObjectTable) {
        this._id = id || "0"
        this._monthTable = monthTable || dayTime()
        this._salary = salary || ""
        this._itensTable = [...itensTable] || []
    }

    getInformations(): IObjectTable {
        return {
            id: this._id,
            monthTable: this._monthTable,
            salary: this._salary,
            itensTable: this._itensTable,
        }
    }
    constructPeriodItems() {
        return [{ id: "", periods: { type: "", days: [] }, showUntilMonth: "" }] as IPeriodsItens[]
    }

    public get id(): string {
        return this._id
    }
    public get monthTable(): string {
        return this._monthTable
    }
    public get salary(): string {
        return this._salary
    }
    public get itensTable(): ITableItens[] {
        return this._itensTable
    }
    public set id(newId) {
        this._id = newId
    }
    public set monthTable(newMonthTable) {
        this._monthTable = newMonthTable
    }
    public set salary(newSalary) {
        this._salary = newSalary
    }
    public set itensTable(newItensTable: ITableItens[]) {
        const outro = []
        if (this._id === "0") {
            this._id = "1"
            this._itensTable = newItensTable
        } else {
            this._itensTable.push(...newItensTable)
        }
    }
    // public set periodsItens(newPeriodsItens: IPeriodsItens[]) {
    //     try {
    //         if (this._periodsItens[0].id === "") {
    //             this._periodsItens = newPeriodsItens
    //         } else {
    //             this.periodsItens.push(...newPeriodsItens)
    //         }
    //     } catch {
    //         this._periodsItens = this.constructPeriodItems()
    //         this.periodsItens.push(...newPeriodsItens)
    //     }
    // }
}