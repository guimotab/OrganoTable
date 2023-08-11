import { BiEditAlt } from "react-icons/bi"
import { FaCheck } from "react-icons/fa"

interface EditCellProps {
    installmentCell: string
    editButton: boolean
    constCell: string
    setAllertUnsavedChange: React.Dispatch<React.SetStateAction<boolean>>
    onStartEditCell: (setEditButton: React.Dispatch<React.SetStateAction<boolean>>) => void
    onEndEditCell: (event: React.FormEvent<HTMLFormElement> | React.FocusEvent<HTMLInputElement, Element>, setEditButton: React.Dispatch<React.SetStateAction<boolean>>) => void
    setEditButton: React.Dispatch<React.SetStateAction<boolean>>
    setConstCell: (value: React.SetStateAction<string>) => void
    maxLength: number
    pattern?: string
    tagP?: string
}

const EditCell = ({ installmentCell, editButton, constCell, setAllertUnsavedChange, onStartEditCell, onEndEditCell, setEditButton, setConstCell, maxLength, pattern, tagP }: EditCellProps) => {
    function blurEditButton(event: React.FocusEvent<HTMLInputElement, Element>){
        setAllertUnsavedChange(false)
        onEndEditCell(event, setEditButton)
    }
    return (
        !editButton ?
            <div className="flex items-center justify-between pl-4 pr-3 w-full">
                <div className="flex">
                    <p className="font-medium">{tagP}</p>
                    <h3 className='font-medium'>{constCell}</h3>
                </div>
                {installmentCell === "1/1" ?
                    <button
                        onClick={event => onStartEditCell(setEditButton)}
                        className='bg-cor-secundaria rounded-lg text-white h-7 w-fit px-1.5'>
                        <BiEditAlt size={18} />
                    </button>
                    : <></>
                }
            </div>
            :
            <form
                onSubmit={event => onEndEditCell(event, setEditButton)}
                className="flex justify-between px-3 gap-2 w-full">
                <input
                    type="text"
                    value={constCell}
                    onChange={event => { setConstCell(event.target.value) }}
                    onBlur={event=> blurEditButton(event)}
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