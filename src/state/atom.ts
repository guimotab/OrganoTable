import { LocalStorager } from "../service/LocalStorager";
import { IObjectTable } from "../shared/interfaces/IObjectTable";
import { atom } from "recoil";
import { dayTime } from "../utils/dayTime";
import IPeriodsItens from "../shared/interfaces/IPeriodsItens";
export const tablesInformations = atom<IObjectTable[]>({
    key: 'tablesInformations',
    default: LocalStorager.getTables()
})
export const currentTableMonth = atom<string>({
    key: 'monthCurrentTable',
    default: dayTime()
})
export const periodItensInformations = atom<IPeriodsItens[]>({
    key: 'periodItensInformations',
    default: LocalStorager.getPeriodItens()
})
export const salaryTable = atom<string>({
    key: 'salaryTable',
    default: '0,00'
})
