import { Card, Col, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BidServices from '../../services/bid.service';
import HandleError from '../../utils/errorHandler.utils';
import { BidHistory, BidResponse } from '../../common/interface/bid.interface';
import moment from 'moment';
import { toCurrency } from '../../utils/currency.utils';

const DetailItem = () => {
    const {id} = useParams()
    
    const [bidItem, setBidItem] = useState<BidResponse | null>(null)

    const tableColumns = [
        {
            title:'Bidder',
            key: 'user',
            dataIndex:'user',
            render: (data: any) => data.full_name
        },
        {
            title:'Bid Amount',
            key: 'bid_amount',
            dataIndex:'bid_amount',
            render: (data: number) => `$${toCurrency(data)}`
        },
        {
            title:'Bid Date',
            key: 'created_at',
            dataIndex:'created_at',
            render: (data:string) => moment(data).format(`DD/MM/YY HH:mm`)
        },
    ]
    
    const getDetailItem = async ()=> {
        try {
            const item = await BidServices.getBidHistory(id || '')
            setBidItem(item.data)
        } catch (error) {
            HandleError(error)
        }
    }
    useEffect(()=>{
        getDetailItem()
    },[])
    
  return (
    <Row justify={'center'} align={'middle'} style={{ padding: 50 }}>
    <Col md={18} xs={24}>
        <Typography.Title level={3}>
            Item Detail's
        </Typography.Title>
        <Card>
            <Row gutter={12}>
                <Col span={4}>
                    <Statistic title={'Item Name'} value={bidItem?.name}/>
                </Col>
                <Col span={4}>
                    <Statistic title={'Base Price'} value={`$${toCurrency(bidItem?.start_price || 0)}`}/>
                </Col>
                <Col span={4}>
                    <Statistic title={'Last Bid'} value={bidItem?.bid_history?.length || 0 > 0 ? `$${toCurrency(bidItem?.last_price || 0)}` : '-'}/>
                </Col>
                <Col span={4}>
                    <Statistic title={'Status'} valueRender={()=> bidItem?.isCompleted ? <Tag color='red'>Completed</Tag> : <Tag color='green'>ongoing</Tag> }/>
                </Col>
                <Col span={4}>
                    <Statistic title={'Duration'} valueRender={()=> `${bidItem?.time_window}h`}/>
                </Col>
                <Col span={4}>
                    <Statistic title={'Winner'} value={bidItem?.winner?.full_name || '-'}/>
                </Col>
            </Row>
            <Space direction='vertical' style={{ width: '100%' }}>
                <Typography.Title level={5}>
                    Bid History
                </Typography.Title>
                {
                    bidItem &&
                    <Table pagination={false} columns={tableColumns} dataSource={bidItem.bid_history} rowKey={(row: BidHistory) => row.user_id} />
                }
            </Space>
        </Card>
    </Col>
</Row>
  )
}

export default DetailItem