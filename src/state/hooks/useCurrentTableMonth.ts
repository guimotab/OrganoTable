import { useRecoilValue } from "recoil"
import { currentTableMonth } from "../atom"

const useCurrentMonth = () => {
    return useRecoilValue(currentTableMonth)
}
export default useCurrentMonth