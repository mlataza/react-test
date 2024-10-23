import logo from './logo.svg';
import './App.css';
import EditableTable from './EditableTable';

function App() {
  return (
    <div className="App">
      <EditableTable 
        columns={['first name', 'last name']} 
        initialData={[['Mikhael Glen', 'Lataza'], ['Marigold', 'Caitor']]} 
        onUpdate={(data) => console.log(data)}/>
    </div>
  );
}

export default App;
