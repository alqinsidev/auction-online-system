import { Button, Card, Col, Row, Space, Table, Tag, Typography } from 'antd'
import { useEffect, useState } from 'react'
import BidServices from '../../services/bid.service'
import HandleError from '../../utils/errorHandler.utils'
import { BidResponse } from '../../common/interface/bid.interface'
import type { ColumnsType } from 'antd/es/table'
import { toCurrency } from '../../utils/currency.utils'
import BidModal from './components/BidModal'
import { CountDown } from '../../components'
import ColorChanging from '../../components/Typograph/ColorChanging/ColorChanging'
import SocketHelper from '../../helpers/socketHelpers'
import SelectInput from '../../components/Input/SelectInput'



interface SelectedBid {
    bid_id: string;
    item_name: string;
    last_price: number;
}
const Home = () => {
    const [bidItemsList, setBidItemList] = useState<BidResponse[]>([])
    const [isBidModalShow, setIsBidModalShow] = useState<boolean>(false)
    const [selectedBid, setSelectedBid] = useState<SelectedBid | null>(null)
    const [showFilter, setShowFilter] = useState<number>(0)

    const tableColumns: ColumnsType<BidResponse> = [
        {
            title: 'Item Name',
            dataIndex: 'name',
            key: 'item-name',
        },
        {
            title: 'Close On',
            dataIndex: 'end_date',
            key: 'time-window',
            render: (data) => <CountDown end_date={data} />
        },
        {
            title: 'Last Bid',
            dataIndex: 'last_price',
            key: 'last-price',
            render: (data) => <ColorChanging>{`$${toCurrency(data)}`}</ColorChanging>
        },
        {
            title: 'Status',
            dataIndex: 'isCompleted',
            key: 'status',
            render: (data) => data ? <Tag color='red'>Completed</Tag> : <Tag color='green'>Ongoing</Tag>
        },
        {
            title: 'Action',
            dataIndex: 'id',
            key: 'id',
            render: (data, row) => {
                const handleSelectItem = () => {
                    setSelectedBid({
                        bid_id: data,
                        item_name: row.name,
                        last_price: row.last_price
                    })
                    setIsBidModalShow(true)
                }
                if (!row.isCompleted) {
                    return (<Button type='primary' onClick={handleSelectItem}>Make Bid</Button>)
                } else {
                    return null
                }
            }
        },
    ]

    const getAuctionList = async (status = 0) => {
        try {
            const getFilter = (input: number)=> {
                switch(input){
                    case 1: 
                        return 'ongoing'
                    case 2:
                        return 'completed'
                        default:
                            return undefined
                }
            }
            const res = await BidServices.getAuctionList(getFilter(status))
            setBidItemList(res.data)

        } catch (error) {
            HandleError(error)
        }

    }

    useEffect(()=>{
        const ws = SocketHelper.getConnection()
        ws.on('AUCTION_EVENT',() => {
            getAuctionList(showFilter)
        })
    },[])

    useEffect(() => {
        getAuctionList()
    }, [])

    return (
        <Row justify={'center'} align={'middle'} style={{ padding: 50 }}>
            <Col md={18} xs={24}>
                <Typography.Title level={3}>
                    Auction Home
                </Typography.Title>
                <Card>
                    <Space direction='vertical' style={{width:'100%'}} size={'large'}>
                    <SelectInput value={showFilter} label='Status Filter' options={[{value:0,label:'Show All'},{value:1,label:'Ongoing'},{value:2,label:'Completed'}]} onChange={(value)=> {
                        setShowFilter(Number(value))
                        getAuctionList(Number(value))
                    }}/>
                    <Table columns={tableColumns} dataSource={bidItemsList} rowKey={(row) => row.id} />
                    </Space>
                </Card>
            </Col>
            {
                // need to set this condition during fail to read props correctly
                selectedBid &&
                <BidModal
                    isVisible={isBidModalShow}
                    handleCancel={() => {
                        setIsBidModalShow(false)
                        getAuctionList()
                        // give a little bit rendering time for component to read props smoothly
                        setTimeout(() =>
                            setSelectedBid(null)
                            , 100)
                    }}
                    item_name={selectedBid?.item_name || ''}
                    bid_id={selectedBid?.bid_id || ''}
                    last_price={selectedBid?.last_price || 0}
                />
            }
        </Row>
    )
}

export default Home