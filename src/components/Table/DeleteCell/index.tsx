import { useState } from "react"
import { BsTrash3Fill } from "react-icons/bs"
import WarningDeleteCell from "../WarningDeleteCell"

interface DeleteCellProps {
    idCell: string
    iconDeleteCell: boolean
    textP: string

}

const DeleteCell = ({ textP, idCell, iconDeleteCell }: DeleteCellProps) => {
    const [showWarningDelete, setShowWarningDelete] = useState(false)
    return (
        <div className="absolute -left-1 flex w-10 h-10 items-center justify-start">
            {iconDeleteCell ?
                <div className='absolute flex flex-col justify-center '>
                    <div onMouseLeave={event => setShowWarningDelete(false)} className='text-cor-terciaria px-4'>
                        <BsTrash3Fill size={21} className='hover:text-cor-erro animate-slideLeftIcon' onClick={event => setShowWarningDelete(true)}
                        />
                    </div>
                    {showWarningDelete ?
                        <WarningDeleteCell idCell={idCell} textP={textP} setShowWarningDelete={setShowWarningDelete} />
                        : <></>
                    }
                </div>
                : <></>
            }
        </div>
    )

}

export default DeleteCell