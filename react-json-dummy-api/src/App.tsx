import React, { useEffect, useState, FormEvent } from 'react';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; // or another theme
import 'primereact/resources/primereact.min.css';                 
import 'primeicons/primeicons.css';                               
import 'primeflex/primeflex.css';

import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
//import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { fetchUsers } from "./sevices/userServices";

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  phone: string;
}

const App: React.FC = () => {
  const [users,setUsers]=useState<User[]>([])
  const [selectedUsers,setSelectedUsers]=useState<User | null>(null)
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(()=>{
    handleFetch()
},[])

const handleSubmit=(event: FormEvent)=>{
  event.preventDefault();
  const fd = new FormData(event.target as HTMLFormElement);
  const name = fd.get("name")as string
  fetch(`https://dummyjson.com/users/search?q=${name}`)
  .then(res => res.json())
  .then(user=>setUsers(user));
}

// This function is triggered to fetch users and update component state
const handleFetch = async () => {
  try {
    // Call the service function to get user data
    const userData = await fetchUsers("/users");

    // Update the state with the fetched users
    setUsers(userData);

    // Optionally reset the selected users state
    setSelectedUsers(null);
  } catch (error) {
    // Handle any errors that occurred during the fetch
    console.error('Error fetching users:', error);
  }
};

const handleFilter=(event: FormEvent)=>{
  event.preventDefault();
  const fd = new FormData(event.target as HTMLFormElement);
  const key = fd.get("key")as string;
  const value = fd.get("value")as string;
  fetch(`https://dummyjson.com/users/filter?key=${key}&value=${value}`)
.then(res => res.json())
.then(user=>setUsers(user));
}

const handleSelection=(event: { data: User })=>{ 
  fetch(`https://dummyjson.com/users/${event.data.id}`)
  .then(res => res.json())
.then((user)=>setSelectedUsers(user));
}

const handleDelete=(id: string)=>{ 
  fetch(`https://dummyjson.com/users/${id}`, {
    method: 'DELETE',
  })
   .then(res => res.json());
   setUsers((prevUsers) => ({
    users: prevUsers.users.filter((user: any) => user.id !== id)
  }));
  setSelectedUsers(null);
}

const authUsers=()=>{
  const token = localStorage.getItem('token');
  console.log('Token:', token);
    if (!token) return;

    fetch('https://dummyjson.com/user/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((user) => {
        if (!user.id) {
          user.id = Date.now().toString();
        }
        setSelectedUsers(user);
      })
      .catch((error) => {
        console.error('Error fetching authenticated user:', error);
        alert('Failed to fetch authenticated user. Please login again.');
      });
}

 async function handleLogin(){
  const res=await fetch('https://dummyjson.com/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'emilys',
      password: 'emilyspass',
      expiresInMins: 60, // optional, defaults to 60
    }),
  })

  const data = await res.json()
  console.log(data);
  if (res.ok) {
    console.log('Login successful:', data);
    localStorage.setItem('token', data.accessToken);
    alert('Login Successful');
  } else {
    console.error('Login failed:', data);
    alert('Login Failed');
  }
}

const handleAddUser=(event: FormEvent)=>{
  event.preventDefault()
  const fd=new FormData(event.target as HTMLFormElement)
  const email=fd.get("email")
  const username=fd.get("username")
  const fname=fd.get("fname")
  const lname=fd.get("lname")
  const gender=fd.get("gender")
  const age=fd.get("age")
  const phone=fd.get("phone")
  fetch('https://dummyjson.com/users/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          "firstName": `${fname}`,
          "lastName": `${lname}`,
          "userName": `${username}`,
          "age": `${age}`,
          "gender": `${gender}`,
          "email": `${email}`,
          "phone": `${phone}`,
      })
    })
    .then(res => res.json())
    .then(newUser => {
      // Update the users state by adding the newly created user to the existing list
      setUsers((prevUsers) => ({
        users: [...prevUsers.users, newUser] // Add new user to the existing list of users
      }));
      setShowAddUserForm(false); // Hide the form after adding the user
    });
}
const handleUpdate=(userdata)=>{
  setSelectedUser(userdata);  // Set the user details in state
  setShowUpdateForm(true);  // Show the update form
}
const handleUpdateSubmit = (event) => {
  event.preventDefault();
  const fd = new FormData(event.target);
  const updatedUser = {
    id: selectedUser.id,
    email: fd.get("email"),
    username: fd.get("username"),
    firstName: fd.get("fname"),
    lastName: fd.get("lname"),
    gender: fd.get("gender"),
    age: fd.get("age"),
    phone: fd.get("phone"),
  };

  // Make PUT request to update the user on the server
  fetch(`https://dummyjson.com/users/${selectedUser.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedUser),
  })
    .then((res) => res.json())
    .then((updatedUserData) => {
      // Update the users state with the new user data
      setUsers((prevUsers) => ({
        users: prevUsers.users.map((user: any) =>
          user.id === selectedUser.id ? updatedUserData : user
        ),
      }));
      setShowUpdateForm(false); // Hide the update form after updating
      setSelectedUser(null); // Reset selected user
    });
};

  return (
    <>
    <div>
      <Button label="Login " onClick={handleLogin} /><br/>
      {!showAddUserForm && <><Button label="ADD User " onClick={()=>setShowAddUserForm(prevState => !prevState)} /><br/></>}
      {showAddUserForm && <form onSubmit={handleAddUser}>
        <label>E-mail</label>
        <InputText name='email'></InputText><br/>
        <label>UserName</label>
        <InputText name='username'></InputText><br/>
        <label>First Name</label>
        <InputText name='fname'></InputText><br/>
        <label>Last Name</label>
        <InputText name='lname'></InputText><br/>
        <label>Gender</label>
        <InputText name='gender'></InputText><br/>
        <label>Age</label>
        <InputNumber name='age'></InputNumber><br/>
        <label>Phone Number</label>
        <InputNumber name='phone'></InputNumber><br/>
        <Button>ADD USER</Button><br/>
    </form>}
  
      <Button label="Show all Users" onClick={handleFetch} /><br/>
      <Button label="Show all Authenticated Users" onClick={authUsers} />
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
          {showUpdateForm && selectedUser && (
        <form onSubmit={handleUpdateSubmit}>
          <h3>Update User</h3>
          <label>Email</label>
          <InputText name="email" defaultValue={selectedUser.email} />
          <br />
          <label>Username</label>
          <InputText name="username" defaultValue={selectedUser.username} />
          <br />
          <label>First Name</label>
          <InputText name="fname" defaultValue={selectedUser.firstName} />
          <br />
          <label>Last Name</label>
          <InputText name="lname" defaultValue={selectedUser.lastName} />
          <br />
          <label>Gender</label>
          <InputText name="gender" defaultValue={selectedUser.gender} />
          <br />
          <label>Age</label>
          <InputNumber name="age" defaultValue={selectedUser.age} />
          <br />
          <label>Phone</label>
          <InputNumber name="phone" defaultValue={selectedUser.phone} />
          <br />
          <Button type="submit" label="Update User" />
        </form>
      )}

          <h3>List of Users </h3>
        <DataTable value={selectedUsers?[selectedUsers]:users.users} tableStyle={{minWidth: "50rem"}} selectionMode="single" onRowSelect={handleSelection}>
        <Column field="id" header="ID"></Column>
        <Column field="username" header="Username"></Column>
        <Column field="email" header="E-mail"></Column>
        <Column field="firstName" header="First Name"></Column>
        <Column field="lastName" header="Last Name"></Column>
        <Column field="age" header="Age"></Column>
        <Column field="gender" header="Gender"></Column>
        <Column field="phone" header="Phone Number"></Column>
        <Column header="Delete" body={(rowData) => (
            <Button 
                   icon="pi pi-trash" 
                   className="p-button-danger" 
                   onClick={() => handleDelete(rowData.id)} 
                   />
              )}/>
        <Column header="Update" body={(rowData) => (
              <Button label="Update" icon="pi pi-pencil" onClick={()=> handleUpdate(rowData)} />
              )}/>
        </DataTable>
    </div>
    </>
  );
};


export default App;
