import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import * as Pages from '../pages'
import { AdminLayout } from '../components'

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Pages.Login />} />
        <Route path="/register" element={<Pages.Register />} />
        <Route path="/" element={<AdminLayout />}>
          <Route path="/" element={<Navigate to="home" />} />
          <Route path="home" element={<Pages.Home />} />
          <Route path="deposit" element={<Pages.Deposit />} />
          <Route path="item" element={<Pages.MyItem />} />
          <Route path="item/new" element={<Pages.CreateItem />} />
          <Route path="item/detail/:id" element={<Pages.DetailItem />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default AppRouter
