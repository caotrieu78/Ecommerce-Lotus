import React from 'react';
import { Modal, Row, Col, Input, Select, Card, Button, Typography } from 'antd';
import { TextField } from '@mui/material';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const OrderModal = ({ show, onHide }) => {
    return (
        <Modal
            open={show}
            onCancel={onHide}
            footer={null}
            title="Tạo đơn hàng"
            width={1000}
        >
            <Row gutter={[16, 16]}>
                {/* Sản phẩm */}
                <Col span={16}>
                    <Card title="Sản phẩm" extra={<a>Tạo sản phẩm tuỳ ý</a>}>
                        <Search placeholder="Tìm kiếm sản phẩm" enterButton="Tìm kiếm" />
                    </Card>

                    <Card title="Thanh toán" style={{ marginTop: 16 }}>
                        <div style={{ marginBottom: 8, color: '#999' }}>Thêm khuyến mãi</div>
                        <Row>
                            <Col span={12}>Tiền hàng</Col>
                            <Col span={12} style={{ textAlign: 'right' }}>0 đ</Col>
                        </Row>
                        <Row>
                            <Col span={12}><a href="#">Phí vận chuyển</a></Col>
                            <Col span={12} style={{ textAlign: 'right' }}>0 đ</Col>
                        </Row>
                        <Row style={{ fontWeight: 'bold', marginTop: 8 }}>
                            <Col span={12}>Tổng tiền</Col>
                            <Col span={12} style={{ textAlign: 'right' }}>0 đ</Col>
                        </Row>
                        <div style={{ marginTop: 16 }}>
                            <Button disabled style={{ marginRight: 8 }}>Sao chép link giỏ hàng</Button>
                            <Button type="primary" disabled>Tạo đơn hàng</Button>
                        </div>
                    </Card>
                </Col>

                {/* Thông tin khách hàng */}
                <Col span={8}>
                    <Card title="Khách hàng">
                        <Search placeholder="Tìm kiếm khách hàng" />
                    </Card>

                    <Card title="Thông tin khác" style={{ marginTop: 16 }}>
                        <div style={{ marginBottom: 12 }}>
                            <label>Kênh bán</label>
                            <Select defaultValue="Draft" style={{ width: '100%' }}>
                                <Option value="Draft">Draft</Option>
                            </Select>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <label>Kho bán</label>
                            <Select defaultValue="Tất cả kho" style={{ width: '100%' }}>
                                <Option value="Tất cả kho">Tất cả kho</Option>
                            </Select>
                        </div>
                        <div>
                            <label>Bảng giá</label>
                            <Select defaultValue="Bảng giá mặc định" style={{ width: '100%' }}>
                                <Option value="Bảng giá mặc định">Bảng giá mặc định</Option>
                            </Select>
                        </div>
                    </Card>

                    <Card title="Ghi chú" style={{ marginTop: 16 }}>
                        <TextField
                            fullWidth
                            placeholder="Nhập ghi chú"
                            variant="outlined"
                            multiline
                            rows={3}
                        />
                    </Card>

                    <Card title="Thuộc tính" style={{ marginTop: 16 }}>
                        <Button type="dashed" block>+ Thêm thuộc tính</Button>
                    </Card>
                </Col>
            </Row>
        </Modal>
    );
};

export default OrderModal;
