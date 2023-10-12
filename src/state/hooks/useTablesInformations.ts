import { useRecoilValue } from "recoil"
import { tablesInformations } from "../atom"

const useTablesInformations = () => {
    return useRecoilValue(tablesInformations)
}
export default useTablesInformations