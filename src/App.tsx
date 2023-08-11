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
          highestIdInstallment: "",
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
  function newCell() {
    setShowPopUp(true)
  }
  function closePopUpClickOut() {
    if (showPopUp && mouseOutPopUp) {
      setShowPopUp(false)
    }
  }

  return (
    <div className="grid grid-cols-[14rem_auto] h-screen w-screen">
      <Aside closePopUpClickOut={closePopUpClickOut} />
      <div
        onClick={closePopUpClickOut}
        className='col-start-2 flex flex-col pr-20 pt-14 gap-5 overflow-hidden w-[68rem]'>
        <div className='pl-24'>
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
          dateCurrent={dateCurrent}
          expensesTableItems={expensesTableItems}
          expensesPeriodItens={expensesPeriodItens}
          setExpensesPeriodItens={setExpensesPeriodItens}
          setTables={setTables}
          setDateCurrent={setDateCurrent}
          onClick={newCell}
          currentSalary={currentSalary}
        />
        {showPopUp ? <PopUpNewCell
          dateCurrent={dateCurrent}
          tables={tables}
          table={currentTable}
          setMouseOutPopUp={setMouseOutPopUp}
          setTables={setTables} /> : <></>}
      </div>
    </div>
  );
}

export default App;
