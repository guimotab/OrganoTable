interface AsideProps{
    closePopUpClickOut: ()=> void
}

const Aside = ({closePopUpClickOut}: AsideProps) => {
    return (
        <div onClick={event=>closePopUpClickOut()} className='flex flex-col items-center pt-40 bg-cor-aside gap-8'>
            <button className="font-semibold w-32 text-lg bg-white px-5 py-1 rounded-lg">Operação</button>
            <button className="font-semibold w-32 text-lg bg-white px-5 py-1 rounded-lg">Simulação</button>
            <button className="font-semibold w-32 text-lg bg-white px-5 py-1 rounded-lg">Opções</button>
        </div>
    )
}

export default Aside