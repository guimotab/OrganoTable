import useCurrentMonth from "../../state/hooks/useCurrentTableMonth"
import useTablesInformations from "../../state/hooks/useTablesInformations"
import RemainingSalary from "../RemainingSalary"
import findCurrentTable from "../../utils/findCurrentTable"
import { ITableItens } from "../../shared/interfaces/ITableItens"
import TableItensCells from "./TableItensCells"
import IPeriodsItens from "../../shared/interfaces/IPeriodsItens"
import PeriodItensCells from "./PeriodItensCells"
import usePeriodItens from "../../state/hooks/usePeriodItens"

const Table = () => {
    const allTables = useTablesInformations()
    const dateCurrent = useCurrentMonth()
    const currentTable = findCurrentTable(allTables, dateCurrent)
    const periodItens = usePeriodItens()
    const titlesTable = [
        { name: "Nome", width: "flex text-gray-600 justify-start w-[18rem] font-medium pl-3" },
        { name: "Valor", width: "flex text-gray-600 justify-start w-60 font-medium pl-3" },
        { name: "Parcela", width: "flex text-gray-600 justify-start w-28 font-medium pl-3" },
        { name: "Tipo", width: "flex text-gray-600 justify-start w-44 font-medium pl-3" },
        { name: "Pago", width: "flex text-gray-600 justify-start w-24 font-medium pl-2" },
    ]

    return (
        <div className='relative flex flex-col gap-1 w-full max-w-6xl px-10'>
            <div className='flex flex-col gap-1 w-full scrollbar'>
                <div className='flex py-1'>
                    {titlesTable.map((title, index) => <div className={title.width} key={index}>{title.name}</div>)}
                </div>
                <section className='flex flex-col gap-1 max-h-[27rem] overflow-auto '>
                    {currentTable.itensTable.map((tableItens: ITableItens) =>
                        !tableItens.repeat ?
                            <TableItensCells key={tableItens.id} tableItens={tableItens} />
                            : <></>
                    )}
                    {periodItens[0] ?
                        periodItens.map((periodItens: IPeriodsItens) =>
                            <PeriodItensCells key={periodItens.id} periodItens={periodItens} />)
                        : ""}
                </section>
            </div>
            <RemainingSalary />
        </div>
    )
}


export default Table