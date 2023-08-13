import { useEffect, useState } from 'react';
import Aside from './components/Aside';
import Table from './components/Table';
import PopUpNewCell from './components/PopUpNewCell';
import { LocalStorager } from './service/LocalStorager';
import InputSalary from './components/InputSalary';
import { dayTime } from './utils/dayTime';
import { IObjectTable } from './shared/IObjectTable';
import deleteTablesUnused from './utils/deleteTablesUnused';

function App() {
  const [tables, setTables] = useState<IObjectTable[]>(LocalStorager.getInformations)
  const [dateCurrent, setDateCurrent] = useState(dayTime())
  const currentTable = constructCurrentTable()
  const [currentSalary, setCurrentSalary] = useState(currentTable.salary)
  const [showPopUp, setShowPopUp] = useState(false)
  const [expensesPeriodItens, setExpensesPeriodItens] = useState<string[]>([])
  const [expensesTableItems, setExpensesTableItems] = useState(createExpensesTableItems())
  const [mouseOutPopUp, setMouseOutPopUp] = useState(true)

  useEffect(() => {
    setExpensesTableItems(createExpensesTableItems())
  }, [tables, dateCurrent, expensesPeriodItens])

  useEffect(() => {
    setCurrentSalary(currentTable.salary)
  }, [dateCurrent])

  function createExpensesTableItems() {
    let expensesItens = 0
    currentTable.itensTable.forEach(expenses => !expenses.repeat ? expensesItens += parseFloat(expenses.value) : "")
    return expensesItens
  }
  function constructCurrentTable() {
    const indexCurrentTable = tables.findIndex((object: IObjectTable) => object.monthTable === dateCurrent)
    if (tables[indexCurrentTable]) {
      return tables[indexCurrentTable]
    } else {
      let currentTable =
        {
          id: "0",
          salary: "0.00",
          monthTable: dateCurrent,
          itensTable: [],
          periodsItens: [{
            id: "",
            periods: {
              type: "",
              days: []
            },
            lastMonthYear: ""
          }]
        } as IObjectTable
      const allTables = [...deleteTablesUnused(tables)]
      allTables.push(currentTable)
      setTables(allTables)
      return currentTable
    }
  }
  function createNewCell() {
    setShowPopUp(true)
  }
  function closePopUpClickOut() {
    if (showPopUp && mouseOutPopUp) {
      setShowPopUp(false)
    }
  }
  return (
    <div className='flex flex-col items-center h-screen w-screen'
      onClick={closePopUpClickOut}>
      <div className='flex justify-center w-full bg-cor-terciaria py-5'>
        <p className='text-white font-bold text-2xl mr-[50rem]'>
          OrganoTable
        </p>
      </div>
      <div className='flex flex-col pt-4 gap-1 overflow-hidden w-[61rem]'>
        <div className='pl-12'>
          <InputSalary
            table={currentTable}
            tables={tables}
            dateCurrent={dateCurrent}
            setTables={setTables}
            currentSalary={currentSalary}
            setCurrentSalary={setCurrentSalary} />
        </div>
        <Table
          table={currentTable}
          tables={tables}
          showPopUp={showPopUp}
          expensesTableItems={expensesTableItems}
          expensesPeriodItens={expensesPeriodItens}
          setMouseOutPopUp={setMouseOutPopUp}
          setExpensesPeriodItens={setExpensesPeriodItens}
          setTables={setTables}
          setDateCurrent={setDateCurrent}
          createNewCell={createNewCell}
          currentSalary={currentSalary}
        />
        
      </div>
    </div>
  );
}

export default App;
