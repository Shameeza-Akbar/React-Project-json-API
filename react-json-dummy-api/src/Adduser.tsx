import 'primereact/resources/themes/lara-light-indigo/theme.css'; // or another theme
import 'primereact/resources/primereact.min.css';                 
import 'primeicons/primeicons.css';                               
import 'primeflex/primeflex.css';

import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';

const AddUser=()=>{
    const handleSubmit=(event)=>{
        event.preventDefault()
        const fd=new FormData(event.target)
        const id=fd.get("id")
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
                "id": `${id}`,
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
          .then(console.log);
    }
    return<>
    <form onSubmit={handleSubmit}>
        <label>ID</label>
        <InputNumber name='id'></InputNumber>
        <label>E-mail</label>
        <InputText name='email'></InputText>
        <label>UserName</label>
        <InputText name='username'></InputText>
        <label>First Name</label>
        <InputText name='fname'></InputText>
        <label>Last Name</label>
        <InputText name='lname'></InputText>
        <label>Gender</label>
        <InputText name='gender'></InputText>
        <label>Age</label>
        <InputNumber name='age'></InputNumber>
        <label>Phone Number</label>
        <InputNumber name='phone'></InputNumber>
        <Button>ADD USER</Button>
    </form>
    </>
}
export default AddUser;