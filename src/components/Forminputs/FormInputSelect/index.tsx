interface FormInputSelectProps {
    label: string
    colStart: string
    widthClassName: string
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
    checkRepeat?: boolean
}

const FormInputSelect = ({ label, colStart, widthClassName, onChange, checkRepeat }: FormInputSelectProps) => {
    let selectInputOrInstallments
    if (label === "Parcelado") {
        if (checkRepeat) {
            selectInputOrInstallments = [
                { label: "1/1" }
            ]
        } else {
            selectInputOrInstallments = [
                { label: "1/1" },
                { label: "1/2" },
                { label: "1/3" },
                { label: "1/4" },
                { label: "1/5" },
                { label: "1/6" },
                { label: "1/7" },
                { label: "1/8" },
                { label: "1/9" },
                { label: "1/10" },
                { label: "1/11" },
                { label: "1/12" }
            ]
        }
    } else {
        selectInputOrInstallments = [
            { label: "Despesas" },
            { label: "Investimento" },
            { label: "Beleza" },
            { label: "Saúde" },
            { label: "Outros" }
        ]
    }
    return (
        <div className={`flex col-start-${colStart} row-start-2 items-center justify-start gap-2 pb-4`}>
            <label className='font-medium'>{label}: </label>
            <select
                onChange={event => onChange(event)}
                className={`${widthClassName} rounded-md border-2 border-gray-300 font-medium focus:border-cor-secundaria outline-none`}>
                {selectInputOrInstallments.map((option, index) =>
                    <option key={index} className='font-medium'>{option.label}</option>
                )}
            </select>
        </div>
    )
}

export default FormInputSelect