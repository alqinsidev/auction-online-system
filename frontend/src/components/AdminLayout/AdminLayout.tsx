import { Dropdown, Layout, MenuProps, Tag, Typography } from 'antd'
import React, { useEffect } from 'react'
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/Hook'
import { resetAuth } from '../../redux/Slice/AuthSlice'
import { toCurrency } from '../../utils/currency.utils'
import DepositServices from '../../services/deposit.service'
import SocketHelper from '../../helpers/socketHelpers'
const { Header, Content } = Layout

const AdminLayout: React.FC = () => {
    const auth = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const dropdownMenu: MenuProps['items'] = [
        {
            key: '1',
            label: <a target='_blank' onClick={() => navigate('/item')}>My Item</a>
        },
        {
            key: '2',
            label: <a target='_blank' onClick={() => navigate('/deposit')}>Deposit</a>
        },
        {
            key: '3',
            label: <a target='_blank' onClick={() => dispatch(resetAuth())} style={{ fontWeight: 'bold' }}>Logout</a>
        },
    ]

    useEffect(()=>{
        const socket = SocketHelper.getConnection()
        socket.on('DEPOSIT_EVENT', ()=>{
            DepositServices.getMyDeposit()
        })
    },[])
    useEffect(()=>{
        DepositServices.getMyDeposit()
    },[])
    if (!auth.isLoggedIn) {
        return <Navigate to='/login' replace />
    }


    return (
        <Layout>
            <Header>
                <Link to={'/home'}>
                <div style={{ float: 'left', fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                    Padlan's Auction
                </div>
                </Link>
                <div style={{ float: 'right' }}>
                    <Typography.Text style={{ color: 'white', marginRight: 16 }}>Balance: <Tag color='blue'>${toCurrency(auth.user?.deposit.amount || 0)}</Tag></Typography.Text>
                    <Dropdown menu={{ items: dropdownMenu }}>
                        <Typography.Text style={{ color: 'white', fontWeight: 'bold' }}>{auth.user?.full_name || ''}</Typography.Text>
                    </Dropdown>
                </div>
            </Header>
            <Content style={{ minHeight: 'calc(100vh - 64px' }}>
                <Outlet />
            </Content>
        </Layout>
    )
}

export default AdminLayout