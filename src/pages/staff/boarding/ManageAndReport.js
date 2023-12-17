import React, { useEffect, useState } from "react";
import styles from "./ManageAndReport.module.scss";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/axios";
import { message, Select } from "antd";
const ManageAndReport = () => {
  const [cageList, setCageList] = useState([]);
  const navigate = useNavigate();

  const fetchCage = async () => {
    try {
      const response = await api.get(`/cage/`);
      console.log("response:", response.data.data);
      setCageList(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCage();
  }, []);

  const handleCageClick = (cage) => {
    if (cage.boarding_id) {
      navigate(`/manage-report/${cage.boarding_id || "default"}`);
    } else {
      message.error("Lồng trống");
    }
  };

  const [selectedSize, setSelectedSize] = useState("");
  const filteredCageList = cageList.filter((cage) => {
    if (selectedSize === "") {
      return true;
    } else {
      // Adjust this condition based on your data structure
      return cage.size === selectedSize;
    }
  });

  const activeCagesCount = filteredCageList.filter(
    (cage) => cage.status === "not_empty"
  ).length;
  const cagesCount = filteredCageList.filter((cage) => cage.cage_id).length;

  return (
    <div className={styles.container}>
      {/* <div className={styles.headerContent}>
        <div className={styles.left}>QUẢN LÝ LỒNG</div>
        <div className={styles.center}>
          <select
            className={styles.selectCenter}
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="SZ001">Rất nhỏ</option>
            <option value="SZ002">Nhỏ</option>
            <option value="SZ003">Vừa</option>
            <option value="SZ004">Lớn</option>
          </select>
        </div>
        <div className={styles.right}>
          <div className={styles.btnSearch}>
            <SearchOutlined />
          </div>
          <input type="text" placeholder="Tìm kiếm" name="search" />
        </div>
      </div> */}
      <div className={styles.headerContent}>
        <div style={{ marginRight: "auto" }}>
          <h1 className={styles.headerTitle}>QUẢN LÝ VÀ BÁO CÁO</h1>
        </div>
        <div style={{ width: "20%" }}>
          {/* <Search size="large" placeholder="Tìm kiếm lịch hẹn..." enterButton /> */}
          <Select
            onChange={(value) => setSelectedSize(value)}
            name="size"
            // className={styles.selectCenter}
            style={{
              width: '100%',
            }}
            defaultValue={""}
          >
            <Select.Option
              key={1}
              value={""}
              selected={true}
            >
              Tất cả
            </Select.Option>
            <Select.Option
              key={2}
              value={"SZ001"}
            >
              Rất nhỏ
            </Select.Option>
            <Select.Option
              key={3}
              value={"SZ002"}
            >
              Nhỏ
            </Select.Option>
            <Select.Option
              key={4}
              value={"SZ003"}
            >
              Vừa
            </Select.Option>
            <Select.Option
              key={5}
              value={"SZ004"}
            >
              Lớn
            </Select.Option>
          </Select>
        </div>
      </div>
      <div className={styles.cageChosen}>
        {filteredCageList.map((cage, index) => (
          <div
            key={cage.id || index}
            className={`${styles.cageItem} ${
              cage.status === "not_empty" ? styles.active : styles.inactive
            }`}
            onClick={() => handleCageClick(cage)}
          >
            <div className={styles.topCage}>
              <p>{`L.${cage.cage_id}`}</p>
              <p className={styles.pEnd}>
                {cage.bird_size.size.replace(/\s*\(.*?\)\s*/, "")}
              </p>
            </div>
            <span>{`${cage.bird_id ? cage.boarding_id : "Trống"}`}</span>
          </div>
        ))}
      </div>
      <div
        className={styles.footerContent}
      >{`${activeCagesCount}/${cagesCount} sức chứa`}</div>
    </div>
  );
};

export default ManageAndReport;
