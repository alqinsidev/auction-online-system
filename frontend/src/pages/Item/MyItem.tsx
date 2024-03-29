import { Button, Card, Col, Row, Space, Table, Tag, Typography } from 'antd'
import { useEffect, useState } from 'react'
import BidServices from '../../services/bid.service'
import HandleError from '../../utils/errorHandler.utils'
import { BidResponse } from '../../common/interface/bid.interface'
import type { ColumnsType } from 'antd/es/table'
import { toCurrency } from '../../utils/currency.utils'
import { ConfirmationModal } from '../../components'
import { useNavigate } from 'react-router-dom'
import SocketHelper from '../../helpers/socketHelpers'



const MyItem = () => {
    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [bidItemsList, setBidItemList] = useState<BidResponse[]>([])
    const [selectedBid, setSelectedBid] = useState<string>('')
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState<boolean>(false)
    

    const tableColumns: ColumnsType<BidResponse> = [
        {
            title: 'Item Name',
            dataIndex: 'name',
            key: 'item-name',
        },
        {
            title: 'Start Price',
            dataIndex: 'start_price',
            key: 'start_price',
            render: (data) => `$${toCurrency(data)}`
        },
        {
            title: 'Last Price',
            dataIndex: 'last_price',
            key: 'last_price',
            render: (data) => `$${toCurrency(data)}`
        },
        {
            title: 'Bid Winner',
            dataIndex: 'winner',
            key: 'winner',
            render: (data) => data ? <Tag color='red'>{data.full_name}</Tag> : '-'
        },
        {
            title: 'Status',
            dataIndex: 'isCompleted',
            key: 'status',
            render: (data, row) => {
                if (!row.isDraft) {
                    if (data) {
                        return <Tag color='red'>Completed</Tag>
                    } else {
                        return <Tag color='green'>Ongoing</Tag>
                    }
                } else {
                    return <Tag color='magenta'>Draft</Tag>
                }
            }
        },
        {
            title: 'Action',
            dataIndex: 'id',
            key: 'id',
            render: (data, row) => {
                const handleSelectItem = () => {
                    setSelectedBid(data)
                    setIsConfirmModalVisible(true)
                }
                if (!row.isCompleted && row.isDraft) {
                    return (<Button type='primary' size='small' danger onClick={handleSelectItem}>Publish</Button>)
                } else {
                    return <Button type='primary' size='small' onClick={()=> navigate(`/item/detail/${data}`)}>Detail</Button>
                }
            }
        },
    ]

    const handlePublish = async () => {
        setIsLoading(true)
        try {
            await BidServices.publishBidItem({ bid_id: selectedBid })
        } catch (error) {
            HandleError(error)
        } finally {
            setIsLoading(false)
            setIsConfirmModalVisible(false)
            getBidList()
        }
    }
    const getBidList = async () => {
        try {
            const res = await BidServices.getBidList()
            setBidItemList(res.data)

        } catch (error) {
            HandleError(error)
        }

    }

    useEffect(()=>{
        const ws = SocketHelper.getConnection()
        ws.on('AUCTION_EVENT',() => {
            getBidList()
        })
    },[])

    useEffect(() => {
        getBidList()
    }, [])

    return (
        <Row justify={'center'} align={'middle'} style={{ padding: 50 }}>
            <Col md={18} xs={24}>
                <Typography.Title level={3}>
                    My Item
                </Typography.Title>
                <Card>
                    <Space direction='vertical' style={{ width: '100%' }}>
                        <Button size='middle' type='primary' onClick={()=> navigate('/item/new')}>Create Item</Button>
                        <Table pagination={false} columns={tableColumns} dataSource={bidItemsList} rowKey={(row) => row.id} />
                    </Space>
                </Card>
            </Col>
            <ConfirmationModal isModalVisible={isConfirmModalVisible} handleOk={handlePublish} isLoading={isLoading} handleCancel={() => setIsConfirmModalVisible(false)} />
        </Row>
    )
}

export default MyItem