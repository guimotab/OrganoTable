import { IObjectTable } from "../shared/IObjectTable";
import IPeriodsItens from "../shared/IPeriodsItens";
import { ITableItens } from "../shared/ITableItens";

export class Tables {
    private _tables: IObjectTable[]
    constructor(tables: IObjectTable[]) {
        this._tables = tables
    }

    updateTables(currentDate: string, currentTable: IObjectTable) {
        // if(this.tables[0].id = "0"){
        //     this._tables = [currentTable]
        // }
        this._tables.splice(this.indexCurrentTable(currentDate), 1)
        this._tables.push(currentTable)
    }

    indexCurrentTable(currentDate: string) {
        return this._tables.findIndex(object => object.monthTable == currentDate)
    }
    returnTables(): IObjectTable[] {
        return this._tables
    }

    highestIndex(): number {
        try{
            this._tables.sort((a, b) => parseFloat(a.id) - parseFloat(b.id))
            const lastIndex = this._tables[this._tables.length - 1].id
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