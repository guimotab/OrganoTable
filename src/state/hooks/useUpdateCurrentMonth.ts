import { useSetRecoilState } from "recoil"
import { currentTableMonth } from "../atom"

export const useUpdateCurrentMonth = () => {
    const setCurrenteMonth = useSetRecoilState<string>(currentTableMonth)
    return (event: string) => {
      return setCurrenteMonth(event)
    }
  }