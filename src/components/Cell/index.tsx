interface CellProps {
    constCell: string
    justifyCell: string
    tagP?: string
}

const Cell = ({ constCell, tagP, justifyCell }: CellProps) => {
    return (
        
        <div className={`flex items-center ${justifyCell} pl-4 pr-3 w-full`}>
            <div className="flex">
                <p className="font-medium">{tagP}</p>
                <h3 className='font-medium'>{constCell}</h3>
            </div>
        </div>
    )
}

export default Cell