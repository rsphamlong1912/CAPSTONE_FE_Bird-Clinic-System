import React, { useEffect, useState } from "react";
import styles from "./ManageAndReport.module.scss";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { api } from "../../../services/axios";

const ManageAndReport = () => {
  const [cageList, setCageList] = useState([]);
  const navigate = useNavigate();

  const getCages = async () => {
    try {
      const responseCages = await api.get(`/cage`);
      setCageList(responseCages.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCages();
    console.log("fs");
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.headerContent}>
        <div className={styles.left}>QUẢN LÝ LỒNG</div>
      </div>
      <div className={styles.cageChosen}>
        {cageList.length > 0 &&
          cageList.map((item, index) => (
            <div
              key={index}
              className={styles.cageItem}
              onClick={() => navigate(`/manage-report/${item.boarding_id}`)}
            >
              <p>L.101</p>
              <span>BCS_2FEVGF</span>
            </div>
          ))}
      </div>
      <div className={styles.footerContent}>30/30 sức chứa</div>
    </div>
  );
};

export default ManageAndReport;
