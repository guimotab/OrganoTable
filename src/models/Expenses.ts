export class Expenses{
    private _expenses: string[] = []
    constructor(){
    }

    setExpensesPeriodItens(setExpenses: React.Dispatch<React.SetStateAction<string[]>>){
        setExpenses(this.expenses)
    }

    set expenses(newValue: string[]){
        this._expenses.push(...newValue)
    }
    get expenses(): string[]{
        return this._expenses
    }
}