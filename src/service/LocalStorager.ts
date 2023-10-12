import { IObjectTable } from "../shared/interfaces/IObjectTable"
import IPeriodsItens from "../shared/interfaces/IPeriodsItens"
import { dayTime } from "../utils/dayTime"

export class LocalStorager {
  static getTables() {
    const returnLocalStorage = localStorage.getItem("Tables")
    let localStorageTables
    if (returnLocalStorage) {
      localStorageTables = JSON.parse(returnLocalStorage) as IObjectTable[]
    } else {
     
      localStorageTables = [{
        id: "0",
        salary: "0,00",
        monthTable: dayTime(),
        itensTable: []
      }] as IObjectTable[]
    }
    return localStorageTables
  }
  static getPeriodItens() {
    const returnLocalStorage = localStorage.getItem("PeriodItens")
    let localStoragePeriodItens
    if (returnLocalStorage) {
      localStoragePeriodItens = JSON.parse(returnLocalStorage) as IPeriodsItens[]
    } else {
      localStoragePeriodItens = [] as IPeriodsItens[]
    }
    return localStoragePeriodItens
  }
  static saveTablesInformations(localStorager: IObjectTable[]) {
    return localStorage.setItem("Tables", JSON.stringify(localStorager))
    //return localStorage.setItem("Tables", JSON.stringify(deleteTablesUnused(localStorager)))
  }
  static savePeriodItens(localStorager: IPeriodsItens[]) {
    return localStorage.setItem("PeriodItens", JSON.stringify(localStorager))
    //return localStorage.setItem("Tables", JSON.stringify(deleteTablesUnused(localStorager)))
  }
}