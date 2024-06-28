import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Home from './pages/Home'
import { Login,Signup,Donations,Campaigns,Donors,Setting,Donate,NewCampaign } from './pages'
import { ThemeProvider } from "../components/themeprovider"

const App = () => {
  return (
    <div className='App'>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/donations' element={<Donations/>}/>
        <Route path='/campaigns' element={<Campaigns/>}/>
        <Route path='/donors' element={<Donors/>}/>
        <Route path='/settings' element={<Setting/>}/>
        <Route path='/donate/:id' element={<Donate/>}/>
        <Route path='/new' element={<NewCampaign/>}/>
      </Routes>
      </ThemeProvider>
    </div>
  )
}

export default App