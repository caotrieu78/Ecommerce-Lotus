import React, { useEffect, useState } from 'react';
import {
    Button, InputNumber, Select, Upload, Space, Divider, Typography, Row, Col
} from 'antd';
import { UploadOutlined, MinusCircleOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons';
import SizeService from '../../../services/sizeService';
import ColorService from '../../../services/colorService';

const { Text } = Typography;

const ATTRIBUTE_OPTIONS = [
    { label: 'Kích thước', value: 'size' },
    { label: 'Màu sắc', value: 'color' },
];

const ProductVariantsForm = ({ value = [], onChange }) => {
    const [sizes, setSizes] = useState([]);
    const [colors, setColors] = useState([]);
    const [selectedAttributes, setSelectedAttributes] = useState([]); // e.g. ['size', 'color']

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [sizeData, colorData] = await Promise.all([
                    SizeService.getAll(),
                    ColorService.getAll()
                ]);
                setSizes(sizeData);
                setColors(colorData);
            } catch (err) {
                console.error(err);
            }
        };
        fetchOptions();
    }, []);

    const handleChange = (index, field, val) => {
        const newList = [...value];
        newList[index][field] = val;
        onChange(newList);
    };

    const addVariant = () => {
        onChange([
            ...value,
            { SizeID: null, ColorID: null, Price: 0, StockQuantity: 0, Image: null }
        ]);
    };

    const removeVariant = (index) => {
        const newList = value.filter((_, i) => i !== index);
        onChange(newList);
    };

    const handleAddAttribute = (val) => {
        if (!selectedAttributes.includes(val)) {
            setSelectedAttributes([...selectedAttributes, val]);
        }
    };

    const handleRemoveAttribute = (attr) => {
        setSelectedAttributes(selectedAttributes.filter(a => a !== attr));
    };

    return (
        <div className="bg-light p-3 rounded mb-3">
            <Divider orientation="left">Biến thể sản phẩm</Divider>

            {value.map((v, i) => (
                <div key={i} className="mb-4 border p-3 rounded">
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        {selectedAttributes.includes('size') && (
                            <div>
                                <Row justify="space-between" align="middle">
                                    <Col><Text strong>Kích thước</Text></Col>
                                    <Col>
                                        <Button
                                            type="text"
                                            icon={<CloseOutlined />}
                                            onClick={() => handleRemoveAttribute('size')}
                                            size="small"
                                        />
                                    </Col>
                                </Row>
                                <Select
                                    placeholder="Chọn size"
                                    value={v.SizeID}
                                    onChange={(val) => handleChange(i, 'SizeID', val)}
                                    options={sizes.map(s => ({ label: s.SizeName, value: s.SizeID }))}
                                    allowClear
                                    style={{ width: '100%' }}
                                />
                            </div>
                        )}

                        {selectedAttributes.includes('color') && (
                            <div>
                                <Row justify="space-between" align="middle">
                                    <Col><Text strong>Màu sắc</Text></Col>
                                    <Col>
                                        <Button
                                            type="text"
                                            icon={<CloseOutlined />}
                                            onClick={() => handleRemoveAttribute('color')}
                                            size="small"
                                        />
                                    </Col>
                                </Row>
                                <Select
                                    placeholder="Chọn màu"
                                    value={v.ColorID}
                                    onChange={(val) => handleChange(i, 'ColorID', val)}
                                    options={colors.map(c => ({ label: c.ColorName, value: c.ColorID }))}
                                    allowClear
                                    style={{ width: '100%' }}
                                />
                            </div>
                        )}

                        <div>
                            <Text strong>Giá biến thể</Text>
                            <InputNumber
                                placeholder="Giá"
                                value={v.Price}
                                onChange={(val) => handleChange(i, 'Price', val)}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <div>
                            <Text strong>Tồn kho</Text>
                            <InputNumber
                                placeholder="Tồn kho"
                                value={v.StockQuantity}
                                onChange={(val) => handleChange(i, 'StockQuantity', val)}
                                style={{ width: '100%' }}
                            />
                        </div>

                        <Upload
                            beforeUpload={(file) => {
                                handleChange(i, 'Image', file);
                                return false;
                            }}
                            maxCount={1}
                            fileList={v.Image ? [{ uid: '-1', name: v.Image.name, status: 'done' }] : []}
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>

                        <Button icon={<MinusCircleOutlined />} danger onClick={() => removeVariant(i)}>
                            Xoá biến thể
                        </Button>
                    </Space>
                </div>
            ))}

            <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                    <Button icon={<PlusOutlined />} type="dashed" onClick={addVariant} block>
                        Thêm biến thể
                    </Button>

                    <Select
                        placeholder="Thêm thuộc tính"
                        style={{ width: 200 }}
                        onSelect={handleAddAttribute}
                        value={null}
                        options={ATTRIBUTE_OPTIONS.filter(opt => !selectedAttributes.includes(opt.value))}
                    />
                </div>
            </Space>
        </div>
    );
};

export default ProductVariantsForm;
