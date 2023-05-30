import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { CreateItem, Home, Login, Register, StoreDeposit, MyItem, DetailItem } from '../pages'
import { AdminLayout } from '../components'


const AppRouter: React.FC = () => {



    return (
        <Router>
            <Routes>
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/' element={<AdminLayout />}>
                    <Route path='home' element={<Home />} />
                    <Route path='deposit' element={<StoreDeposit />} />
                    <Route path='item' element={<MyItem />} />
                    <Route path='item/new' element={<CreateItem />} />
                    <Route path='item/detail/:id' element={<DetailItem />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default AppRouter