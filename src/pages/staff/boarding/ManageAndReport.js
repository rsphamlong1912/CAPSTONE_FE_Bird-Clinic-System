import React, { useState } from "react";
import styles from "./ManageAndReport.module.scss";
import { SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const ManageAndReport = () => {
    const cageApi = Array(30).fill(null);
    const [cageList, setCageList] = useState(cageApi);
    const navigate = useNavigate();
    return (
        <div className={styles.container}>
            <div className={styles.headerContent}>
                <div className={styles.left}>QUẢN LÝ LỒNG</div>
                <div className={styles.right}>
                    <div className={styles.btnSearch}>
                        <SearchOutlined />
                    </div>
                    <input type="text" placeholder="Tìm kiếm khách hàng" name="search" />
                </div>
            </div>
            <div className={styles.cageChosen}>
                {cageList.map((item, index) => (
                    <div className={styles.cageItem} onClick={() => navigate("/manage-report/1")}>
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
