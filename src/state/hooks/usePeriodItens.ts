import { useRecoilValue } from "recoil"
import { periodItensInformations } from "../atom"

const usePeriodItens = () => {
    return useRecoilValue(periodItensInformations)
}
export default usePeriodItens