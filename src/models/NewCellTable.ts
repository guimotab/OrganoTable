import { INewCell } from "../shared/INewCell"

export default class NewCellTable{
    private _name: string
    private _value: string
    private _installment: string
    private _repeat: boolean
    private _type: string
    private _paid: boolean
    private _id: string

    constructor({name, value, installment, repeat, type, paid, id}: INewCell){
        this._name = name
        this._value = value
        this._installment = installment
        this._repeat = repeat
        this._type = type
        this._paid = paid
        this._id = id
    }

    returnInformations(){
        return{
            name: this._name,
            value: this._value,
            installment: this._installment,
            repeat: this._repeat,
            type: this._type,
            paid: this._paid,
            id: this._id,
        }
    }

    get name(){
        return this._name
    }
    get value(){
        return this._value
    }
    get installment(){
        return this._installment
    }
    get repeat(){
        return this._repeat
    }
    get type(){
        return this._type
    }
    get paid(){
        return this._paid
    }
    get id(){
        return this._id
    }
    set name(newName: string){
        this._name = newName
    }
    set value(newValue: string){
        this._value = newValue
    }
    set installment(newInstallment: string){
        this._installment = newInstallment
    }
    set repeat(newRepeat: boolean){
        this._repeat = newRepeat
    }
    set type(newType: string){
        this._type = newType
    }
    set paid(newPaid: boolean){
        this._paid = newPaid
    }
    set id(newId: string){
        this._id = newId
    }

}