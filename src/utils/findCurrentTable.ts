import { IObjectTable } from "../shared/interfaces/IObjectTable";
export default function findCurrentTable(allTables: IObjectTable[], dateCurrent: string){
    let indexCurrentTable = allTables.findIndex((object: IObjectTable) => object.monthTable === dateCurrent)
    if(indexCurrentTable !== -1){
        return allTables[indexCurrentTable]
    } else {
        return {
            id: "0",
            salary: "0.00",
            monthTable: dateCurrent,
            itensTable: [],
          } as IObjectTable
    }
}