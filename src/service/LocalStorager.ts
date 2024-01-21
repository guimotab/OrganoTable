import { IObjectTable } from "../shared/interfaces/IObjectTable"
import IPeriodsItens from "../shared/interfaces/IPeriodsItens"
import { dayTime } from "../utils/dayTime"

export class LocalStorager {
  static getTables() {
    let localStorageTables
    if (localStorage.getItem("Tables")) {
      localStorageTables = JSON.parse(localStorage.getItem("Tables")!) as IObjectTable[]
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
    let localStoragePeriodItens
    if (localStorage.getItem("PeriodItens")) {
      localStoragePeriodItens = JSON.parse(localStorage.getItem("PeriodItens")!) as IPeriodsItens[]
    } else {
      localStoragePeriodItens = [] as IPeriodsItens[]
    }
    return localStoragePeriodItens
  }
  static saveTablesInformations(localStorager: IObjectTable[]) {
    return localStorage.setItem("Tables", JSON.stringify(localStorager))
  }
  static savePeriodItens(localStorager: IPeriodsItens[]) {
    return localStorage.setItem("PeriodItens", JSON.stringify(localStorager))
  }
}