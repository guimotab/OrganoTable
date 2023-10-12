import { useRecoilValue } from "recoil"
import { salaryTable } from "../atom"

const useSalaryTable = () => {
    return useRecoilValue(salaryTable)
}
export default useSalaryTable