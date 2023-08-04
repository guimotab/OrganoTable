import { BiEditAlt } from "react-icons/bi"
import { FaCheck } from "react-icons/fa"

interface EditCellProps {
    editButton: number
    constCell: string
    onStartEditCell: (setEditButton: React.Dispatch<React.SetStateAction<number>>) => void
    onEndEditCell: (event: React.FormEvent<HTMLFormElement>, setEditButton: React.Dispatch<React.SetStateAction<number>>) => void
    setEditButton: React.Dispatch<React.SetStateAction<number>>
    setConstCell: (value: React.SetStateAction<string>) => void
    maxLength: number
    pattern?: string
    tagP?: string
}

const EditCell = ({ editButton, constCell, onStartEditCell, onEndEditCell, setEditButton, setConstCell, maxLength, pattern, tagP }: EditCellProps) => {
    return (
        !editButton ?
            <div className="flex items-center justify-between pl-4 pr-3 w-full">
                <div className="flex">
                    <p className="font-medium">{tagP}</p>
                    <h3 className='font-medium'>{constCell}</h3>
                </div>
                <button
                    onClick={event => onStartEditCell(setEditButton)}
                    className='bg-cor-secundaria rounded-lg text-white h-7 w-fit px-1.5'
                ><BiEditAlt size={18} /></button>
            </div>
            :
            <form
                onSubmit={event => onEndEditCell(event, setEditButton)}
                className="flex justify-between px-3 gap-2 w-full">
                <input
                    type="text"
                    value={constCell}
                    onChange={event => { setConstCell(event.target.value) }}
                    autoFocus={true}
                    className='px-1 w-full font-medium placeholder:font-medium border-cor-outline'
                    placeholder={constCell}
                    maxLength={maxLength}
                    pattern={pattern}
                />
                <button
                    type='submit'
                    className='bg-cor-secundaria rounded-lg text-white h-7 w-fit px-2'>
                    <FaCheck size={14} />
                </button>
            </form>
    )
}


export default EditCell