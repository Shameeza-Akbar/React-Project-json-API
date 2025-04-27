import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // or another theme
import 'primereact/resources/primereact.min.css';                 
import 'primeicons/primeicons.css';                               
import 'primeflex/primeflex.css';

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
const App: React.FC = () => {
  return (
    <div>
      <Button label="Click Me" icon="pi pi-check" onClick={() => console.log('Clicked!')} />
    </div>
  );
};


export default App;
