import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";
import Clients from "./Clients";
import Accounts from "./Accounts";
import Retainers from "./Retainers";
import ClientInfo from "./ClientInfo";
import RetainerInfo from "./RetainerInfo";
import EditAccount from "./EditAccount";
import Login from "./Login";
import ClientPage from "./ClientPage";
import ProfileClient from "./ProfileClient";
import RetainerPage from "./RetainerPage";
import ProfileRetainer from "./ProfileRetainer";
import ProfileAdmin from "./ProfileAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/clientpage' element={<ClientPage />}></Route>
        <Route path='/retainerpage' element={<RetainerPage />}></Route>
        <Route path='/clients' element={<Clients />}></Route>
        <Route path='/retainers' element={<Retainers />}></Route>
        <Route path='/accounts' element={<Accounts />}></Route>
        <Route path='/profileclient' element={<ProfileClient />}></Route>
        <Route path='/profileretainer' element={<ProfileRetainer />}></Route>
        <Route path='/profileadmin' element={<ProfileAdmin />}></Route>
        <Route path='/retainerinfo/:id' element={<RetainerInfo/>}></Route>
        <Route path='/editaccount/:id' element={<EditAccount/>}></Route>
        <Route path='/clientinfo/:id' element={<ClientInfo />} /></Routes>
    </BrowserRouter>
  )
}

export default App;
