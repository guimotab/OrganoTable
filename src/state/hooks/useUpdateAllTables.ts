import { useSetRecoilState } from "recoil"
import { IObjectTable } from "../../shared/interfaces/IObjectTable"
import { tablesInformations } from "../atom"

export const useUpdateAllTables = () =>{
    const setTableList = useSetRecoilState<IObjectTable[]>(tablesInformations)
    return (event: IObjectTable[]) => {
      return setTableList(event)
    }
 }