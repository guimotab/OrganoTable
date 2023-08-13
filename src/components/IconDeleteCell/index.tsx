import { BsTrash3Fill } from "react-icons/bs"
import WarningDeleteCell from "../WarningDeleteCell"
import { IObjectTable } from "../../shared/IObjectTable"
import { useState } from "react"

interface IconDeleteCell {
    // setPeriodItens?: React.Dispatch<React.SetStateAction<IPeriodsItens[]>>
    table: IObjectTable
    tables: IObjectTable[]
    setAllTables: (value: React.SetStateAction<IObjectTable[]>) => void
    optionsButtons: boolean
    setOptionsButtons: React.Dispatch<React.SetStateAction<boolean>>
    idCell: string
    repeatCell: boolean
    textP: string
}

const IconDeleteCell = ({ table, tables, setAllTables, optionsButtons, setOptionsButtons, idCell, repeatCell, textP }: IconDeleteCell) => {
    
    const [showWarningDelete, setShowWarningDelete] = useState(false)
    return (
        <>
            {optionsButtons ?
                <div className='flex flex-col justify-center'>
                    <div className='flex justify-end w-12' onMouseEnter={event => setOptionsButtons(true)} onMouseLeave={event => setOptionsButtons(false)}>
                        <div onMouseLeave={event => setShowWarningDelete(false)} className='text-cor-terciaria pb-1 px-3'>
                            <BsTrash3Fill
                                size={21}
                                className='hover:text-cor-erro'
                                onClick={event => setShowWarningDelete(true)}
                            />
                        </div>
                    </div>
                    {showWarningDelete ?
                        <WarningDeleteCell
                            id={idCell}
                            repeat={repeatCell}
                            textP={textP}
                            table={table}
                            tables={tables}
                            setTables={setAllTables}
                            setOptionsButtons={setOptionsButtons}
                            setShowWarningDelete={setShowWarningDelete}
                        />
                        : <></>
                    }
                </div>
                :
                <div className='w-12'></div>
            }
        </>
    )
}

export default IconDeleteCell