import { useSetRecoilState } from "recoil"
import { salaryTable } from "../atom"

export const useUpdateSalaryTable = () => {
  const setSalaryTable = useSetRecoilState<string>(salaryTable)
  return (event: string) => {
    return setSalaryTable(event)
  }
}