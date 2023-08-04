import { IObjectTable } from "../shared/IObjectTable"
import { dayTime } from "../utils/dayTime"

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
        const tables = [...localStorager]
        let index = tables.findIndex(item => item.itensTable[0] == undefined)

        while (!(index == -1)) {
            tables.splice(index, 1)
            index = tables.findIndex(item => item.itensTable[0] == undefined)
        }
        return localStorage.setItem("Tables", JSON.stringify(tables))
    }
}