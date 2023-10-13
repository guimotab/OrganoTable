import { RecoilRoot } from 'recoil'
import Header from './components/Header';
import InputSalary from './components/InputSalary';
import Table from './components/Table';
import TableCurrentMonth from './components/Table/TableCurrentMonth';
import CreateTableCell from './components/Table/CreateTableCell';
function App() {
  return (
    <RecoilRoot>
      <div className='flex flex-col w-screen items-center'>
        <Header />
        <InputSalary />
        <div className='flex w-full max-w-6xl px-10 justify-between h-fit'>
          <TableCurrentMonth />
          <CreateTableCell />
        </div>
        <Table />
      </div>
    </RecoilRoot>
  );
}

export default App;
