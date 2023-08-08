import { IObjectTable } from "../shared/IObjectTable";
import IPeriodsItens from "../shared/IPeriodsItens";
import { ITableItens } from "../shared/ITableItens";
import { dayTime } from "../utils/dayTime";

export class CurrentTable {
    private _id: string
    private _monthTable: string
    private _salary: string
    private _itensTable: ITableItens[]
    private _periodsItens: IPeriodsItens[]

    // constructor({ id, monthTable, salary, itensTable, periodsItens}: IObjectTable) {
    //     this._id = id || "0"
    //     this._monthTable = monthTable || dayTime()
    //     this._salary = salary || ""
    //     this._itensTable = itensTable || []
    //     this._periodsItens = periodsItens = [{ id: "", periods: { type: "", days: [] } }] 
    // }
    constructor({id, monthTable, salary, itensTable, periodsItens}: IObjectTable) {
        this._id = id || "0"
        this._monthTable = monthTable || dayTime()
        this._salary = salary || ""
        this._itensTable = itensTable || []
        this._periodsItens = periodsItens || [{ id: "", periods: { type: "", days: [] } }] 
    }

    getInformations(): IObjectTable {
        return {
            id: this._id,
            monthTable: this._monthTable,
            salary: this._salary,
            itensTable: this._itensTable,
            periodsItens: this._periodsItens
        }
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
    public get itensTable(): ITableItens[]{
        return this._itensTable
    }
    public get periodsItens(): IPeriodsItens[] {
        return this._periodsItens
    }
    public set id(newId){
        this._id = newId
    }
    public set monthTable(newMonthTable) {
        this._monthTable = newMonthTable
    }
    public set salary(newSalary) {
        this._salary = newSalary
    }
    public set itensTable(newItensTable: ITableItens[]) {
        if(this._id ==="0"){
            
            this._id = "1"
            this._itensTable = newItensTable
        } else {
            this._itensTable.push(...newItensTable)
        }
    }
    public set periodsItens(newPeriodsItens: IPeriodsItens[]) {
        
        if(this._periodsItens[0].id === ""){
            
            this._periodsItens = newPeriodsItens
            console.log(this._periodsItens);
        } else {
            this.periodsItens.push(...newPeriodsItens)
        }
    }
}