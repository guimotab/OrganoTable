import { AiOutlinePlusSquare } from "react-icons/ai"


interface CellsProps {
    onClick: () => void
}
const Cells = ({ onClick }: CellsProps) => {
    return (
        <button
            onClick={onClick}
            className='flex gap-1 justify-center items-center bg-cor-secundaria rounded-lg text-white font-medium px-3'>
            <AiOutlinePlusSquare size={24} strokeWidth={24} color="white" />
            <p className="font-semibold">Criar Nova Célula</p>
        </button>
    )
}

export default Cells
