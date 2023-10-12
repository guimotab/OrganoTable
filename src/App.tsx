import { RecoilRoot } from 'recoil'
import Header from './components/Header';
import InputSalary from './components/InputSalary';
import Table from './components/Table';
function App() {
  return (
    <RecoilRoot>
      <div className='flex flex-col w-screen items-center'>
        <Header />
        <InputSalary />
        <Table />
      </div>
    </RecoilRoot>
  );
}

export default App;
