
interface FormInputCellProps {
    label: string
    type: string
    value: number | string
    onChange: React.Dispatch<React.SetStateAction<string>>
    onBlur?: (event: React.FocusEvent<HTMLInputElement, Element>) => void
    pattern?: string
    required: boolean
    minLength?: number
    maxLength?: number
    tagP?: string
}

const FormInput = ({ label, type, value, onBlur, onChange, minLength, maxLength, pattern, required, tagP }: FormInputCellProps) => {
    function changeSetProps(event: React.ChangeEvent<HTMLInputElement>) {
        onChange(event.target.value)
    }
    function transformValueInput(event: React.FocusEvent<HTMLInputElement, Element>) {
        if (onBlur) {
            onBlur(event)
        }
    }

    return (
            <div className="flex items-center justify-start gap-2 mr-5 pb-4 ">
                <label className="font-medium">{label}</label>
                <div className="flex items-center w-44 gap-2">
                    {tagP ? <p className="font-medium">{tagP}</p> : ""}
                    <input
                        type={type}
                        onBlur={event => transformValueInput(event)}
                        minLength={minLength}
                        maxLength={maxLength}
                        onChange={event => changeSetProps(event)}
                        value={value}
                        pattern={pattern}
                        required={required}
                        onInvalid={event => event.preventDefault()}
                        className="h-9 w-full border-2 border-gray-300 rounded-md px-1 font-semibold placeholder:text-black focus:outline-cor-secundaria"
                    />
                </div>
            </div>
    )
}

export default FormInput