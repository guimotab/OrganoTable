interface FormInputTextProps {
    label: string
    value: number | string
    setValue: React.Dispatch<React.SetStateAction<string>>
    pattern?: string
    minLength?: number
    maxLength?: number
    tagP?: string
}

const FormInputText = ({ label, value, setValue, minLength, maxLength, pattern, tagP }: FormInputTextProps) => {
    function transformValueInput(event: React.FocusEvent<HTMLInputElement, Element>) {
        if (tagP) {
            let targetValue = event.target.value
            if (targetValue !== "") {
                setValue(parseFloat(targetValue.replace(',', '.')).toFixed(2).replace('.', ','))
            }
        }
    }
    return (
        <div className="flex items-center justify-start gap-2 mr-5 pb-4 ">
            <label className="font-medium">{label}</label>
            <div className="flex items-center w-44 gap-2">
                {tagP ? <p className="font-medium">{tagP}</p> : ""}
                <input
                    type="text"
                    onBlur={event => transformValueInput(event)}
                    minLength={minLength}
                    maxLength={maxLength}
                    onChange={event => setValue(event.target.value)}
                    value={value}
                    pattern={pattern}
                    required={true}
                    onInvalid={event => event.preventDefault()}
                    className="h-9 w-full border-2 border-gray-300 rounded-md px-1 font-semibold placeholder:text-black focus:outline-cor-secundaria"
                />
            </div>
        </div>
    )
}

export default FormInputText