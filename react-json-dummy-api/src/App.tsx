import './App.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; // or another theme
import 'primereact/resources/primereact.min.css';                 
import 'primeicons/primeicons.css';                               
import 'primeflex/primeflex.css';

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
        
const App: React.FC = () => {
  const [users,setUsers]=useState({"users":[]})
  const [selectedUsers,setSelectedUsers]=useState<any>(null)
  useEffect(()=>{
    handleFetch()
},[])

const handleSubmit=(event)=>{
  event.preventDefault();
  const fd = new FormData(event.target);
  const name = fd.get("name")
  fetch(`https://dummyjson.com/users/search?q=${name}`)
  .then(res => res.json())
  .then(user=>setUsers(user));
}
const handleFetch=()=>{
  fetch(`https://dummyjson.com/users`)
  .then(res => res.json())
  .then(user=>setUsers(user));
  setSelectedUsers(null)
}
const handleFilter=(event)=>{
  event.preventDefault();
  const fd = new FormData(event.target);
  const key = fd.get("key")
  const value = fd.get("value")
  fetch(`https://dummyjson.com/users/filter?key=${key}&value=${value}`)
.then(res => res.json())
.then(user=>setUsers(user));
}
const handleSelection=(event)=>{ 
  fetch(`https://dummyjson.com/users/${event.data.id}`)
  .then(res => res.json())
.then((user)=>setSelectedUsers(user));}

const handleDelete=(id)=>{ 
  fetch(`https://dummyjson.com/users/${id}`, {
    method: 'DELETE',
  })
   .then(res => res.json());
   setUsers((prevUsers) => ({
    users: prevUsers.users.filter((user: any) => user.id !== id),
  }));
  setSelectedUsers(null);
}
  return (
    <>
    <div>
      <Button label="Show all Users" onClick={handleFetch} />
          <h3>Search User </h3>
          <form onSubmit={handleSubmit}>
          <label>First name </label>
          <InputText placeholder='Write First name' name='name'/>
          <Button label='Search'/><br/>
          </form>
          <h3>Apply Filter</h3>
          <form onSubmit={handleFilter}>
          <label>Property </label>
          <InputText placeholder='Property' name='key'/>
          <label> Value </label>
          <InputText placeholder='value' name='value'/>
          <Button label='Filter'/>
          </form>
          <h3>List of Users </h3>
        <DataTable value={selectedUsers?[selectedUsers]:users.users} tableStyle={{minWidth: "50rem"}} selectionMode="single" dataKey="id" onRowSelect={handleSelection}>
        <Column field="id" header="ID"></Column>
        <Column field="username" header="Username"></Column>
        <Column field="email" header="E-mail"></Column>
        <Column field="firstName" header="First Name"></Column>
        <Column field="lastName" header="Last Name"></Column>
        <Column field="gender" header="Gender"></Column>
        <Column field="image" header="Image"></Column>
        <Column header="Actions" body={(rowData) => (
            <Button 
                   icon="pi pi-trash" 
                   className="p-button-danger" 
                   onClick={() => handleDelete(rowData.id)} 
                   />
              )}/>
        </DataTable>
    </div>
    </>
  );
};


export default App;
