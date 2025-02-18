import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Typography,
  message,
  Card,
  Select,
  Divider,
  Input,
  Button,
  Popconfirm,
  Tag,
} from "antd";
import type { SelectProps } from "antd";
import {
  SearchOutlined,
  LinkOutlined,
  CloudUploadOutlined,
  DatabaseOutlined,
  CheckCircleTwoTone,
  WarningTwoTone,
  CloudDownloadOutlined,
  RedoOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { fetchJson } from "../lib/api";
import qs from "qs";
import { byteCount } from "../lib/etc";
import { log } from "node:console";

let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const fetch = (
  value: string,
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
    fetchJson(`api/searchKwd?${str}`, {}).then((d: any) => {
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
  const [value, setValue] = useState<string>();
  const [uploadValue, setUploadValue] = useState<string>();
  const [savePath, setSavePath] = useState<string>();
  const [networkOpt, setNetworkOpt] = useState<"in" | "out">("in");
  const [config, setConfig] = useState();

  const handleClose = (removedTag: string) => {
    const newTags = value.split(",").filter((tag) => tag !== removedTag);
    console.log(newTags);
    setValue(newTags.join(","));
  };

  const forMap = (tag: string, tagNumber: number = value.split(",").length) => {
    let tagLimit = 10;

    const tagElem = (
      <Tag
        color="#211C6A"
        closable
        style={{
          fontSize: "14px",
          paddingTop: "3px",
          paddingBottom: "3px",
          margin: "3px",
          color: "#F5F5F5",
          fontFamily: "LINESeedKR-Rg",
        }}
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );

    if (tagNumber < tagLimit) {
      return (
        <span key={tag} style={{ display: "inline-block" }}>
          {tagElem}
        </span>
      );
    } else if (tagNumber === tagLimit) {
      return (
        <span key={"extra"} style={{ display: "inline-block" }}>
          <Tag
            color="#77E4C8"
            style={{
              fontSize: "14px",
              paddingTop: "3px",
              paddingBottom: "3px",
              margin: "3px",
              color: "#C7253E",
              fontFamily: "LINESeedKR-Rg",
            }}
          >
            {`10개 초과 ..`}
          </Tag>
        </span>
      );
    }
  };

  useEffect(() => {
    const p = localStorage.getItem("savePath");
    setSavePath(p);

    const no = localStorage.getItem("networkOpt");
    setNetworkOpt(no as any);

    (window as any).electron.ipcRenderer.invoke("get-config").then((c) => {
      localStorage.setItem("config", JSON.stringify(c));
      setConfig(c);

      if (Object.values(c).includes(null)) {
        messageApi.error({
          content: `CONFIG 설정이 끝나지 않았습니다!`,
          style: { color: "#B82132", fontSize: "18px" },
          icon: <WarningTwoTone twoToneColor="#BE3144" />,
          duration: null,
        });
      }
    });
  }, []);

  const handleSearch = (newValue: string) => {
    fetch(newValue, networkOpt, setData as any);
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
    console.log(newValue);
  };

  return (
    <>
      {contextHolder}
      <div className="layout-content">
        <Row gutter={[24, 0]}>
          <Col xs={36} sm={36} md={24} lg={24} xl={26} className="mb-24">
            <Card bordered={false} style={{ minHeight: "500px" }}>
              <Row>
                <Col>
                  <Title level={4}>키워드 추가</Title>
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
                    <Text style={{ fontSize: "14px" }}>기존 키워드 검색</Text>
                  </Col>
                </Row>
                <Row gutter={8}>
                  <Col>
                    <Select
                      style={{ minWidth: "700px" }}
                      size="large"
                      showSearch
                      placeholder="기존 키워드를 검색해주세요."
                      defaultActiveFirstOption={false}
                      suffixIcon={null}
                      filterOption={false}
                      notFoundContent={null}
                      onSearch={handleSearch}
                      onChange={handleChange}
                      options={data}
                      allowClear
                    />
                  </Col>
                  <Col>
                    <Button
                      size="large"
                      type="primary"
                      icon={<RedoOutlined />}
                      onClick={() => {
                        setValue(null);
                        setUploadValue(null);
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
                  <LinkOutlined />
                </Col>
                <Col>
                  <Text style={{ fontSize: "14px" }}>연관키워드 매칭</Text>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col>
                  <Input
                    style={{ width: "160px" }}
                    size="large"
                    value={uploadValue}
                    onChange={(nv) => {
                      setUploadValue(nv.target.value);
                    }}
                    allowClear
                  />
                </Col>
                <Col>
                  <Input
                    style={{ minWidth: "800px" }}
                    size="large"
                    placeholder="연관키워드를 ' , '로 구분하여 입력해주세요."
                    value={value}
                    onChange={(nv) => {
                      setValue(
                        nv.target.value
                          .split(",")
                          .filter((d) => d.length <= 20)
                          .join(",")
                      );
                    }}
                    allowClear
                  />
                </Col>
              </Row>
              <Row style={{ marginTop: "12px" }}>
                {value ? value.split(",").map(forMap) : <></>}
              </Row>
              <Row>
                {value ? (
                  <Row style={{ marginTop: "12px" }} gutter={12} align="middle">
                    <Col>
                      <Row align={"middle"} gutter={3}>
                        <Col>
                          <Text
                            style={{
                              fontSize: "14px",
                              marginRight: "5px",
                              fontFamily: "LINESeedKR-Rg",
                            }}
                          >
                            키워드수:
                          </Text>
                        </Col>
                        <Col>
                          <Text
                            style={
                              value.split(",").length <= 10
                                ? {
                                    fontSize: "22px",
                                    fontFamily: "LINESeedKR-Bd",
                                    color: "#0D7C66",
                                  }
                                : {
                                    fontSize: "22px",
                                    fontFamily: "LINESeedKR-Bd",
                                    color: "#C7253E",
                                  }
                            }
                          >
                            {value.split(",").length}
                          </Text>
                        </Col>
                        <Col>
                          <Text
                            style={{
                              fontSize: "16px",
                              fontFamily: "LINESeedKR-Bd",
                            }}
                          >
                            개
                          </Text>
                        </Col>
                      </Row>
                    </Col>
                    <Divider
                      type="vertical"
                      style={{ marginRight: "15px", marginLeft: "15px" }}
                    />
                    <Col>
                      <Row align={"middle"} gutter={3}>
                        <Col>
                          <Text
                            style={{
                              fontSize: "14px",
                              marginRight: "5px",
                              fontFamily: "LINESeedKR-Rg",
                            }}
                          >
                            글자수:
                          </Text>
                        </Col>
                        <Col>
                          <Text
                            style={
                              value.length <= 100
                                ? {
                                    fontSize: "22px",
                                    fontFamily: "LINESeedKR-Bd",
                                    color: "#0D7C66",
                                  }
                                : {
                                    fontSize: "22px",
                                    fontFamily: "LINESeedKR-Bd",
                                    color: "#C7253E",
                                  }
                            }
                          >
                            {`${value.length} / 100`}
                          </Text>
                        </Col>
                        <Col>
                          <Text
                            style={{
                              fontSize: "16px",
                              fontFamily: "LINESeedKR-Bd",
                            }}
                          >
                            자
                          </Text>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                ) : (
                  <></>
                )}
              </Row>

              <Row
                align="middle"
                style={{ marginBottom: "10px", marginTop: "40px" }}
              >
                <Col style={{ marginRight: "5px" }}>
                  <CloudUploadOutlined />
                </Col>
                <Col>
                  <Text style={{ fontSize: "14px" }}>키워드 업로드</Text>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button
                    size="large"
                    type="primary"
                    icon={<DatabaseOutlined />}
                    disabled={!value || !uploadValue}
                    loading={isLoading}
                    onClick={async () => {
                      setIsLoading(true);

                      const r = await fetchJson("/api/uploadKwd", {
                        method: "POST",
                        body: JSON.stringify({
                          kwd: uploadValue,
                          related_kwd: value,
                          networkOpt: networkOpt,
                        }),
                      });

                      if (!r.result) {
                        if (r.errorLog.includes("Duplicate")) {
                          messageApi.error({
                            content: "중복되는 카테고리 값이 존재합니다!",
                            icon: <WarningTwoTone twoToneColor="#C70039" />,
                          });
                        } else if (r.errorLog.includes("Data too long")) {
                          messageApi.error({
                            content: "키워드가 100자를 초과하였습니다!",
                            icon: <WarningTwoTone twoToneColor="#C70039" />,
                          });
                        } else {
                          messageApi.error({
                            content: "에러 발생! 문의요망",
                            icon: <WarningTwoTone twoToneColor="#C70039" />,
                          });
                        }
                      } else {
                        if (r.errorLog === "update") {
                          messageApi.success({
                            content: `기존 카테고리 업데이트 성공!`,
                            icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
                          });
                        } else {
                          messageApi.success({
                            content: `카테고리 업로드 성공!`,
                            icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
                          });
                        }
                      }

                      console.log(r);

                      setIsLoading(false);
                    }}
                  >
                    DB 업로드
                  </Button>
                </Col>
              </Row>
              <Row
                align="middle"
                style={{ marginBottom: "10px", marginTop: "40px" }}
              >
                <Col style={{ marginRight: "5px" }}>
                  <CloudDownloadOutlined />
                </Col>
                <Col>
                  <Text style={{ fontSize: "14px" }}>키워드 다운로드</Text>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col>
                  <Input
                    size="large"
                    value={savePath}
                    status="warning"
                    style={{ minWidth: "700px" }}
                    placeholder="저장경로를 입력해주세요."
                    onChange={(e) => {
                      const cv = e.target.value;
                      setSavePath(cv);
                      localStorage.setItem("savePath", cv);
                    }}
                  />
                </Col>
                <Col>
                  <Popconfirm
                    title="카테고리 다운로드"
                    description="최신화된 카테고리를 다운로드 하시겠습니까?"
                    okText="다운로드"
                    cancelText="종료"
                    onConfirm={async () => {
                      setIsLoading(true);

                      const r = await fetchJson("/api/downloadKwd", {
                        method: "POST",
                        body: JSON.stringify({
                          savePath: savePath,
                          networkOpt: networkOpt,
                        }),
                      });

                      if (!r.result) {
                        if (r.errorLog.includes("Unrecognized")) {
                          messageApi.error({
                            content: "엑셀 파일 확장자가 올바르지 않습니다!",
                            icon: <WarningTwoTone twoToneColor="#C70039" />,
                          });
                        } else {
                          messageApi.error({
                            content: "존재하지 않는 파일 경로 입니다!",
                            icon: <WarningTwoTone twoToneColor="#C70039" />,
                          });
                        }
                      } else {
                        messageApi.success({
                          content: `카테고리 다운로드 성공!`,
                          icon: <CheckCircleTwoTone twoToneColor="#508D69" />,
                        });
                      }

                      setIsLoading(false);
                    }}
                  >
                    <Button
                      type="primary"
                      size="large"
                      icon={<CloudDownloadOutlined />}
                      style={{ color: "#FABC3F" }}
                    >
                      다운로드
                    </Button>
                  </Popconfirm>
                </Col>
              </Row>
              <Row
                align="middle"
                style={{ marginBottom: "10px", marginTop: "40px" }}
              ></Row>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
