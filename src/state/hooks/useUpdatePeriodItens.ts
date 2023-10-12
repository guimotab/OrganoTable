import { useSetRecoilState } from "recoil"
import { periodItensInformations } from "../atom"
import IPeriodsItens from "../../shared/interfaces/IPeriodsItens"

export const useUpdatePeriodItens = () =>{
    const setPeriodItens = useSetRecoilState<IPeriodsItens[]>(periodItensInformations)
    return (event: IPeriodsItens[]) => {
      return setPeriodItens(event)
    }
 }