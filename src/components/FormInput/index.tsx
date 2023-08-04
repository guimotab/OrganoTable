
interface FormInputCellProps {
    label: string
    type: string
    value: number | string
    onChange: React.Dispatch<React.SetStateAction<string>>
    onBlur?: (event: React.FocusEvent<HTMLInputElement, Element>)=> void
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
    function transformValueInput(event: React.FocusEvent<HTMLInputElement, Element>){
        if(onBlur){
            onBlur(event) 
        }
    }

    return (
        <div className="flex items-center justify-between gap-2 ml-5 mr-5 px-2 ">
            <label className="text-white font-medium">{label}</label>
            <div className="flex items-center w-44">
                {tagP ? <p className="text-white font-medium">{tagP}</p> : ""}
                <input
                    type={type}
                    onBlur={event=>transformValueInput(event)}
                    minLength={minLength}
                    maxLength={maxLength}
                    onChange={event => changeSetProps(event)}
                    value={value}
                    pattern={pattern}
                    required={required}
                    onInvalid={event=>event.preventDefault()}
                    className="h-9 w-full bg-transparent text-white text-base border-b-2 border-b-cor-primaria px-1 font-semibold placeholder:text-black focus:outline-none"
                />
            </div>
        </div>
    )
}

export default FormInput