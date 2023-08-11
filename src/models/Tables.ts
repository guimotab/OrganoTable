import { IObjectTable } from "../shared/IObjectTable";
import { dayTime } from "../utils/dayTime";

export class Tables {
    private _tables: IObjectTable[]
    constructor(tables: IObjectTable[]) {
        this._tables = tables || [{
            id: `0`,
            salary: "",
            monthTable: dayTime(),
            itensTable: [],
            periodsItens: [{
                id: "",
                periods: {
                    type: "",
                    days: []
                },
                lastMonthYear:""
            }]
        }] as IObjectTable[]
    }

    createNewTable(dateCurrent: string) {
        const newIdTable = this.highestId() + 1
        
        const newTable = {
            id: `${newIdTable}`,
            salary: "",
            monthTable: dateCurrent,
            itensTable: [],
            highestIdInstallment: "",
            periodsItens: [{
                id: "",
                periods: {
                    type: "",
                    days: []
                },
                lastMonthYear:""
            }]
        } as IObjectTable
        this._tables.push(newTable)
    }

    updateTables(currentDate: string, currentTable: IObjectTable) {
        this._tables.splice(this.indexCurrentTable(currentDate), 1)
        this._tables.push(currentTable)
    }

    indexCurrentTable(currentDate: string) {
        return this._tables.findIndex(object => object.monthTable == currentDate)
    }
    returnTables(): IObjectTable[] {
        return this._tables
    }

    highestId(): number {
        const realTables = this._tables.filter(table => table.id !== "0")
        try {
            realTables.sort((a, b) => parseFloat(a.id) - parseFloat(b.id))
            const lastIndex = realTables[realTables.length - 1].id
            return parseFloat(lastIndex)
        } catch {
            return 0
        }
    }

    public get tables(): IObjectTable[] {
        return this._tables
    }
    public set tables(newtables: IObjectTable[]) {
        this._tables = newtables
    }

}