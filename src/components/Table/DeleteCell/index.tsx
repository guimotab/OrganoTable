import { useState } from "react"
import { BsTrash3Fill } from "react-icons/bs"
import WarningDeleteCell from "../WarningDeleteCell"

interface DeleteCellProps {
    //setIconDeleteCell: React.Dispatch<React.SetStateAction<boolean>>
    idCell: string
    //repeatCell: boolean
    textP: string

}

const DeleteCell = ({ textP, idCell }: DeleteCellProps) => {
    const [showWarningDelete, setShowWarningDelete] = useState(false)
    return (
        <div className='absolute flex flex-col justify-center'>
            <div className='flex justify-end'>
                <div onMouseLeave={event => setShowWarningDelete(false)} className='text-cor-terciaria px-4'>
                    <BsTrash3Fill
                        size={21}
                        className='hover:text-cor-erro'
                        onClick={event => setShowWarningDelete(true)}
                    />
                </div>
            </div>
            {showWarningDelete ?
                <WarningDeleteCell
                    idCell={idCell}
                    //repeat={repeatCell}
                    textP={textP}
                    setShowWarningDelete={setShowWarningDelete}
                />
                : <></>
            }
        </div>
    )

}

export default DeleteCell