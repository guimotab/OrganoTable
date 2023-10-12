import { AiOutlinePlusSquare } from "react-icons/ai"
import PopUpNewCell from "../../PopUpNewCell"
import { useState } from "react"
const CreateTableCell = () => {
    const [openPopUp, setOpenPopUp] = useState(false)
    return (
        <div className='flex flex-col'>
            <button
                onClick={event => setOpenPopUp(true)}
                className='flex gap-1 justify-center items-center bg-cor-secundaria rounded-lg text-white font-medium px-3 py-2'>
                <AiOutlinePlusSquare size={24} strokeWidth={24} color="white" />
                <p className="font-semibold">Criar Nova Célula</p>
            </button>
            {openPopUp ?
                <>
                    <PopUpNewCell
                    //dateCurrent={currentTable.monthTable}
                    />
                    <div className="absolute left-0 top-0 w-screen h-screen" onClick={event=> setOpenPopUp(false)}></div>
                </>
                : <></>
            }
        </div>
    )
}

export default CreateTableCell