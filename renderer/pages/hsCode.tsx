import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  message,
  Card,
  Select,
  Divider,
  Button,
  Table,
  Tag,
} from "antd";
import type { SelectProps, TableColumnsType } from "antd";
import {
  SearchOutlined,
  CheckCircleTwoTone,
  RedoOutlined,
  CopyOutlined,
  TableOutlined,
} from "@ant-design/icons";
import { fetchJson } from "../lib/api";
import qs from "qs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { createStyles } from "antd-style";

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

interface DataType {
  key: React.Key;
  value: number;
  label: string;
  cat_code: number;
  tax_cat: string;
  hs_code: number;
  gov_cat: string;
  big_cat: number;
  name_high: string | null;
  name_mid: string | null;
  name_low: string | null;
  name_detail: string | null;
  code_high: string | null;
  code_mid: string | null;
  code_low: number | null;
  code_detail: string | null;
  cp_cat_ref: string | null;
}

const fetch = (
  value: string,
  searchOpt: string,
  networkOpt: string,
  callback: (data: { value: string; text: string }[]) => void
) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  const fake = () => {
    const str = qs.stringify({
      q: value,
      networkOpt: networkOpt,
    });
    fetchJson(`api/searchHsCode?${str}`, {}).then((d: any) => {
      if (currentValue === value) {
        const { result } = d;
        callback(result);
      }
    });
  };
  if (value && value.length > 1) {
    timeout = setTimeout(fake, 300);
  } else {
    callback([]);
  }
};

const { Title, Text } = Typography;

export default function NextPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState<SelectProps["options"]>([]);
  const [hsCodeData, setHsCodeData] = useState<DataType[]>([]);
  const [value, setValue] = useState<number>();
  const [searchOpt, setSearchOpt] = useState<"cp" | "ec">("cp");
  const [networkOpt, setNetworkOpt] = useState<"in" | "out">("in");
  const [selHeight, setSelHeight] = useState<number>();

  useEffect(() => {
    const no = localStorage.getItem("networkOpt");
    setNetworkOpt(no as any);

    const sh = localStorage.getItem("selHeight");
    setSelHeight(Number(sh) as any);
  });

  const handleSearch = (newValue: string) => {
    fetch(newValue, searchOpt, networkOpt, setData as any);
  };

  const handleChange = (newValue: number, option) => {
    console.log(option);

    setHsCodeData([option]);
    setValue(newValue);
  };

  const columns: TableColumnsType<DataType> = [
    {
      title: (
        <Text style={{ color: "#FFEB00", fontFamily: "LINESeedKR-Bd" }}>
          cat_code
        </Text>
      ),
      width: 100,
      dataIndex: "cat_code",
      key: "cat_code",
      fixed: "left",
      render: (text: string) => (
        <CopyToClipboard
          text={text}
          onCopy={() => {
            messageApi.success({
              content: `복사 성공!`,
              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
            });
          }}
        >
          <Tag
            color="geekblue"
            style={{
              fontSize: "15px",
              fontFamily: "LINESeedKR-Bd",
            }}
          >
            {text}
          </Tag>
        </CopyToClipboard>
      ),
    },
    {
      title: "tax_cat",
      width: 100,
      dataIndex: "tax_cat",
      key: "tax_cat",
      render: (text: string) => (
        <CopyToClipboard
          text={text}
          onCopy={() => {
            messageApi.success({
              content: `복사 성공!`,
              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
            });
          }}
        >
          <Text
            style={{
              fontSize: "13px",
            }}
          >
            {text}
          </Text>
        </CopyToClipboard>
      ),
    },
    {
      title: "hs_code",
      width: 100,
      dataIndex: "hs_code",
      key: "hs_code",
      render: (text: string) => (
        <CopyToClipboard
          text={text}
          onCopy={() => {
            messageApi.success({
              content: `복사 성공!`,
              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
            });
          }}
        >
          <Text
            style={{
              fontSize: "13px",
            }}
          >
            {text}
          </Text>
        </CopyToClipboard>
      ),
    },
    {
      title: "gov_cat",
      width: 100,
      dataIndex: "gov_cat",
      key: "gov_cat",
      render: (text: string) => (
        <CopyToClipboard
          text={text}
          onCopy={() => {
            messageApi.success({
              content: `복사 성공!`,
              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
            });
          }}
        >
          <Text
            style={{
              fontSize: "13px",
            }}
          >
            {text}
          </Text>
        </CopyToClipboard>
      ),
    },
    {
      title: "big_cat",
      width: 100,
      dataIndex: "big_cat",
      key: "big_cat",
      render: (text: string) => (
        <CopyToClipboard
          text={text}
          onCopy={() => {
            messageApi.success({
              content: `복사 성공!`,
              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
            });
          }}
        >
          <Text
            style={{
              fontSize: "13px",
            }}
          >
            {text}
          </Text>
        </CopyToClipboard>
      ),
    },
    {
      title: "name_high",
      width: 100,
      dataIndex: "name_high",
      key: "name_high",
      render: (text: string) => (
        <CopyToClipboard
          text={text}
          onCopy={() => {
            messageApi.success({
              content: `복사 성공!`,
              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
            });
          }}
        >
          <Text
            style={{
              fontSize: "13px",
            }}
          >
            {text}
          </Text>
        </CopyToClipboard>
      ),
    },
    {
      title: "name_mid",
      width: 100,
      dataIndex: "name_mid",
      key: "name_mid",
      render: (text: string) => (
        <CopyToClipboard
          text={text}
          onCopy={() => {
            messageApi.success({
              content: `복사 성공!`,
              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
            });
          }}
        >
          <Text
            style={{
              fontSize: "13px",
            }}
          >
            {text}
          </Text>
        </CopyToClipboard>
      ),
    },
    {
      title: "name_low",
      width: 100,
      dataIndex: "name_low",
      key: "name_low",
      render: (text: string) => (
        <CopyToClipboard
          text={text}
          onCopy={() => {
            messageApi.success({
              content: `복사 성공!`,
              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
            });
          }}
        >
          <Text
            style={{
              fontSize: "13px",
            }}
          >
            {text}
          </Text>
        </CopyToClipboard>
      ),
    },
    {
      title: "name_detail",
      width: 100,
      dataIndex: "name_detail",
      key: "name_detail",
      render: (text: string) => (
        <CopyToClipboard
          text={text}
          onCopy={() => {
            messageApi.success({
              content: `복사 성공!`,
              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
            });
          }}
        >
          <Text
            style={{
              fontSize: "13px",
            }}
          >
            {text}
          </Text>
        </CopyToClipboard>
      ),
    },
    {
      title: "code_high",
      width: 100,
      dataIndex: "code_high",
      key: "code_high",
      render: (text: string) => (
        <CopyToClipboard
          text={text}
          onCopy={() => {
            messageApi.success({
              content: `복사 성공!`,
              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
            });
          }}
        >
          <Text
            style={{
              fontSize: "13px",
            }}
          >
            {text}
          </Text>
        </CopyToClipboard>
      ),
    },
    {
      title: "code_mid",
      width: 100,
      dataIndex: "code_mid",
      key: "code_mid",
      render: (text: string) => (
        <CopyToClipboard
          text={text}
          onCopy={() => {
            messageApi.success({
              content: `복사 성공!`,
              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
            });
          }}
        >
          <Text
            style={{
              fontSize: "13px",
            }}
          >
            {text}
          </Text>
        </CopyToClipboard>
      ),
    },
    {
      title: "code_low",
      width: 100,
      dataIndex: "code_low",
      key: "code_low",
      render: (text: string) => (
        <CopyToClipboard
          text={text}
          onCopy={() => {
            messageApi.success({
              content: `복사 성공!`,
              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
            });
          }}
        >
          <Text
            style={{
              fontSize: "13px",
            }}
          >
            {text}
          </Text>
        </CopyToClipboard>
      ),
    },
    {
      title: "code_detail",
      width: 100,
      dataIndex: "code_detail",
      key: "code_detail",
      render: (text: string) => (
        <CopyToClipboard
          text={text}
          onCopy={() => {
            messageApi.success({
              content: `복사 성공!`,
              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
            });
          }}
        >
          <Text
            style={{
              fontSize: "13px",
            }}
          >
            {text}
          </Text>
        </CopyToClipboard>
      ),
    },
    {
      title: (
        <Text style={{ color: "#FFEB00", fontFamily: "LINESeedKR-Bd" }}>
          cp_cat_ref
        </Text>
      ),
      width: 500,
      dataIndex: "cp_cat_ref",
      key: "cp_cat_ref",
      fixed: "right",
      render: (text: string) => (
        <CopyToClipboard
          text={text}
          onCopy={() => {
            messageApi.success({
              content: `복사 성공!`,
              icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
            });
          }}
        >
          <Text
            color="geekblue"
            style={{
              fontSize: "14px",
            }}
          >
            {text}
          </Text>
        </CopyToClipboard>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className="layout-content">
        <Row gutter={[24, 0]}>
          <Col xs={36} sm={36} md={24} lg={24} xl={26} className="mb-24">
            <Card bordered={false} style={{ minHeight: "500px" }}>
              <Row>
                <Col>
                  <Title level={4}>HS CODE</Title>
                </Col>
              </Row>
              <Divider />
              <>
                <Row
                  align="middle"
                  style={{ marginBottom: "10px", marginTop: "28px" }}
                >
                  <Col style={{ marginRight: "5px" }}>
                    <SearchOutlined />
                  </Col>
                  <Col>
                    <Text style={{ fontSize: "14px" }}>쿠팡 카테고리 검색</Text>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col>
                    <Select
                      allowClear
                      style={{ minWidth: "700px" }}
                      size="large"
                      showSearch
                      placeholder="쿠팡 카테고리를 검색해주세요."
                      defaultActiveFirstOption={false}
                      suffixIcon={null}
                      filterOption={false}
                      notFoundContent={null}
                      onSearch={handleSearch}
                      onChange={handleChange}
                      value={value}
                      options={data}
                      listHeight={selHeight}
                    />
                  </Col>
                  <Col>
                    <CopyToClipboard
                      text={
                        data.length > 0 &&
                        data.filter((d) => d.value == value).length > 0
                          ? data.filter((d) => d.value == value)[0]["label"]
                          : null
                      }
                      onCopy={() => {
                        messageApi.success({
                          content: `복사 성공!`,
                          icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
                        });
                      }}
                    >
                      <Button
                        style={{ color: "#73EC8B" }}
                        size="large"
                        type="primary"
                        icon={<CopyOutlined />}
                      >
                        복사
                      </Button>
                    </CopyToClipboard>
                  </Col>
                  <Col>
                    <Button
                      size="large"
                      type="primary"
                      icon={<RedoOutlined />}
                      onClick={() => {
                        setValue(null);
                        setHsCodeData([]);
                      }}
                    >
                      초기화
                    </Button>
                  </Col>
                </Row>
              </>
              <Row
                align="middle"
                style={{ marginBottom: "10px", marginTop: "28px" }}
              >
                <Col style={{ marginRight: "5px" }}>
                  <TableOutlined />
                </Col>
                <Col>
                  <Text style={{ fontSize: "14px" }}>HS CODE 테이블</Text>
                </Col>
              </Row>

              <Row align="middle" style={{ marginBottom: "10px" }}></Row>
              <Table
                columns={columns}
                dataSource={hsCodeData}
                pagination={false}
                loading={isLoading}
                scroll={{ x: "max-content" }}
                size="large"
                bordered
                rowClassName={() => "custom-row"}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
