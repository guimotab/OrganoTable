import { IObjectTable } from "../shared/IObjectTable"
import { dayTime } from "../utils/dayTime"
import deleteTablesUnused from "../utils/deleteTablesUnused"

export abstract class LocalStorager {
    static getInformations() {
        return JSON.parse(localStorage.getItem("Tables")!) || [{
            id: "0",
            salary: "",
            monthTable: dayTime(),
            itensTable: [],
            periodsItens: [{
              id: "",
              periods: {
                type: "",
                days: []
              }
            }]
          }]
    }
    static saveInformations(localStorager: IObjectTable[]) {
        return localStorage.setItem("Tables", JSON.stringify(deleteTablesUnused(localStorager)))
    }
}