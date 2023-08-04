import './App.css';
import { useEffect, useState } from 'react';
import Aside from './components/Aside';
import Table from './components/Table';
import PopUpNewCell from './components/PopUpNewCell';
import { LocalStorager } from './service/LocalStorager';
import InputSalary from './components/InputSalary';
import { dayTime } from './utils/dayTime';
import { IObjectTable } from './shared/IObjectTable';

function App() {
  const [tables, setTables] = useState(LocalStorager.getInformations)

  const [showPopUp, setShowPopUp] = useState(false)

  const [dateCurrent, setDateCurrent] = useState(dayTime())

  const [expensesPeriodItens, setExpensesPeriodItens] = useState<string[]>([])

  let currentTable

  const indexCurrentTable = tables.findIndex((object: IObjectTable) => object.monthTable == dateCurrent)

  if (tables[indexCurrentTable]) {
    currentTable = tables[indexCurrentTable]
  } else {
    const lastIndexTable = parseFloat(tables[tables.length - 1].id)
    currentTable =
    {
      id: `${lastIndexTable + 1}`,
      salary: "",
      monthTable: dateCurrent,
      itensTable: [],
      periodsItens: [{
        id: "",
        periods: {
          type: "",
          days: []
        }
      }]
    }
    const allTables = [...tables]
    allTables.push(currentTable)
    setTables(allTables)
  }

  function newCell() {
    setShowPopUp(true)
  }
  function hiddenCell() {
    setShowPopUp(false)
  }

  return (
    <div className="grid grid-cols-[14rem_auto] h-screen w-screen">
      {/* <button onClick={event => console.log(dayTime(dateCurrent))}>Teste</button> */}
      <Aside />
      <div className='col-start-2 flex flex-col px-20 pt-12 gap-5 w-full'>
        <InputSalary table={currentTable} tables={tables} dateCurrent={dateCurrent} setTables={setTables} />
        <Table
          table={currentTable}
          tables={tables}
          dateCurrent={dateCurrent}
          expensesPeriodItens={expensesPeriodItens}
          setExpensesPeriodItens={setExpensesPeriodItens}
          setTables={setTables}
          setDateCurrent={setDateCurrent}
          onClick={newCell} />

        {showPopUp ? <PopUpNewCell
          dateCurrent={dateCurrent}
          tables={tables}
          table={currentTable}
          expensesPeriodItens={expensesPeriodItens}
          setExpensesPeriodItens={setExpensesPeriodItens}
          hidden={hiddenCell}
          setTables={setTables} /> : <></>}
      </div>
    </div>
  );
}

export default App;
