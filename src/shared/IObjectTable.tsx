import IPeriodsItens from "./IPeriodsItens";
import { ITableItens } from "./ITableItens";

export interface IObjectTable {
    id: string
    monthTable:string,
    salary: string,
    itensTable: ITableItens[],
    periodsItens: IPeriodsItens[] | undefined
}