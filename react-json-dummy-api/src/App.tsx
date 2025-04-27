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
import { InputNumber } from 'primereact/inputnumber';
        
const App: React.FC = () => {
  const [users,setUsers]=useState([])
  useEffect(()=>{
    async function handleFetch() {
      const response=await fetch('https://dummyjson.com/users')
      const data = await response.json()
      setUsers(data)
    }
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

const handleFilter=(event)=>{
  event.preventDefault();
  const fd = new FormData(event.target);
  const key = fd.get("key")
  const value = fd.get("value")
  fetch(`https://dummyjson.com/users/filter?key=${key}&value=${value}`)
.then(res => res.json())
.then(user=>setUsers(user));
}
const handleDetail=(event)=>{
  event.preventDefault();
  const fd = new FormData(event.target);
  const id = fd.get("userId")
  fetch(`https://dummyjson.com/users/filter?key=id&value=${id}`)
.then(res => res.json())
.then(user=>setUsers(user));}
  return (
    <>
    <div>
      <Button label="Search User" icon="pi pi-check" onClick={() => console.log('Clicked!')} />
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
          <h3>Search details of user by ID </h3>
          <form onSubmit={handleDetail}>
          <label>ID </label>
          <InputNumber placeholder='Write ID' name='userId'/>
          <Button label='Detail'/><br/>
          </form>
          <h3>List of Users </h3>
        <DataTable value={users.users} tableStyle={{minWidth: "50rem"}}>
        <Column field="id" header="ID"></Column>
        <Column field="username" header="Username"></Column>
        <Column field="email" header="E-mail"></Column>
        <Column field="firstName" header="First Name"></Column>
        <Column field="lastName" header="Last Name"></Column>
        <Column field="gender" header="Gender"></Column>
        <Column field="image" header="Image"></Column>
        </DataTable>
    </div>
    </>
  );
};


export default App;
