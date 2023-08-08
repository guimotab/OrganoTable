import './App.css';
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

  const [showPopUp, setShowPopUp] = useState(false)

  const [dateCurrent, setDateCurrent] = useState(dayTime())

  const [expensesPeriodItens, setExpensesPeriodItens] = useState<string[]>([])

  const [mouseOutPopUp, setMouseOutPopUp] = useState(true)


  let currentTable

  const indexCurrentTable = tables.findIndex((object: IObjectTable) => object.monthTable == dateCurrent)

  if (tables[indexCurrentTable]) {
    currentTable = tables[indexCurrentTable]
  } else {
    const lastIndexTable = parseFloat(tables[tables.length - 1].id)
    currentTable =
    {
      id: `${0}`,
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
    const allTables = [...deleteTablesUnused(tables)]
    allTables.push(currentTable)
    setTables(allTables)
  }

  function newCell() {
    setShowPopUp(true)
  }
  function hiddenCell() {
    setShowPopUp(false)
  }
  function closePopUpClickOut() {
    if (showPopUp && mouseOutPopUp) {
      setShowPopUp(false)
    }
  }

  return (
    <div className="grid grid-cols-[14rem_auto] h-screen w-screen">
      {/* <button onClick={event => console.log(dayTime(dateCurrent))}>Teste</button> */}
        <Aside closePopUpClickOut={closePopUpClickOut}/>
      <div className='col-start-2 flex flex-col px-24 pt-14 gap-5 w-full overflow-hidden'>
        <div onClick={closePopUpClickOut}>
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

        </div>
        {showPopUp ? <PopUpNewCell
          dateCurrent={dateCurrent}
          tables={tables}
          table={currentTable}
          expensesPeriodItens={expensesPeriodItens}
          setMouseOutPopUp={setMouseOutPopUp}
          setExpensesPeriodItens={setExpensesPeriodItens}
          hidden={hiddenCell}
          setTables={setTables} /> : <></>}
      </div>
    </div>
  );
}

export default App;
