import { IObjectTable } from "../shared/interfaces/IObjectTable";
import { dayTime } from "../utils/dayTime";

export class Tables {
    private _tables: IObjectTable[]
    constructor(tables: IObjectTable[]) {
        this._tables = [...tables] || [{
            id: `0`,
            salary: "",
            monthTable: dayTime(),
            itensTable: []
        }] as IObjectTable[]
    }

    createNewTable(dateCurrent: string) {
        const newIdTable = this.highestId() + 1
        const newTable = {
            id: `${newIdTable}`,
            salary: "0,00",
            monthTable: dateCurrent,
            itensTable: [],
            highestIdInstallment: "",
        } as IObjectTable
        this._tables.push(newTable)
    }

    updateTables(currentDate: string, currentTable: IObjectTable) {
        const fakeTable = [...this._tables]
        try{
            fakeTable.splice(this.indexCurrentTable(currentDate), 1)
        } catch {
        }
        fakeTable.push(currentTable)
        this._tables = fakeTable
    }

    indexCurrentTable(currentDate: string) {
        const resultado = this._tables.findIndex(object => object.monthTable === currentDate)
        if(resultado === -1){
            throw new Error()
        }
        return resultado
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