import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./DoneDetail.module.scss";
import "reactjs-popup/dist/index.css";
import ProfileBirdModal from "../../../components/modals/ProfileBirdModal";
import { api } from "../../../services/axios";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import LoadingSkeleton from "../../../components/loading/LoadingSkeleton";
import io from "socket.io-client";
import Popup from "reactjs-popup";
import { Modal } from "antd";
const socket = io("https://clinicsystem.io.vn");

const ResultTestingDetail = () => {
  const { serviceFormDetailId } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [openModalProfile, setOpenModalProfile] = useState(false);
  const [medicalRecord, setMedicalRecord] = useState();
  const [imgUrl, setImgUrl] = useState();
  const [serviceFormDetailInfo, setServiceFormDetailInfo] = useState()

  const fetchMedicalRecord = async () => {
    try {
      const responseRecord = await api.get(
        `/medical-record/?service_form_detail_id=${serviceFormDetailId}`
      );
      console.log("ket qua ne", responseRecord.data.data[0]);
      setMedicalRecord(responseRecord.data.data[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchFileImg = async () => {
    try {
      const responseImgUrl = await api.get(
        `/media/?type=service_form_details&type_id=${serviceFormDetailId}`
      );
      if (responseImgUrl.data.data[0]?.link) {
        setImgUrl(responseImgUrl.data.data[0]?.link);
      } else {
        setImgUrl(
          "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Flag_of_None.svg/1024px-Flag_of_None.svg.png"
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchServiceFormDetail = async () => {
    try {
      const responseServiceFormDetail = await api.get(
        `/service-form-detail/${serviceFormDetailId}`
      );
      setServiceFormDetailInfo(responseServiceFormDetail.data.data[0])
      
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    fetchMedicalRecord();
    fetchFileImg();
    fetchServiceFormDetail()
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div
            className={styles.left}
            onClick={() => navigate(`/done-retesting`)}
          >
            <ion-icon name="chevron-back-outline"></ion-icon>
            <span>Trở về</span>
          </div>
          <div className={styles.right}>
            <div className={styles.nameCustomer}>
               KH: {serviceFormDetailInfo?.customer_name} 
            </div>
          </div>
        </div>
        {loading && <Loading></Loading>}
        {!loading && (
          <div className={styles.mainContent}>
            <div className={styles.content}>
              <table>
                <tbody>
                  <tr>
                    <th>Triệu chứng</th>
                    <td>{medicalRecord?.symptom}</td>
                  </tr>
                  <tr>
                    <th>Chẩn đoán</th>
                    <td>{medicalRecord?.diagnose}</td>
                  </tr>
                  <tr>
                    <th>Lời khuyên</th>
                    <td>{medicalRecord?.recommendations}</td>
                  </tr>
                </tbody>
              </table>
              <span style={{ display: "inline-block", marginTop: "5px", fontWeight: "bold" }}>
                Hình ảnh kết quả
              </span>
              {imgUrl && (
                <img src={imgUrl} alt="" className={styles.imgResult} />
              )}
            </div>
            <div className={styles.metaContent}>
              <div className={styles.boxData}>
                <div
                  className={styles.boxDataItem}
                  onClick={() => setOpenModalProfile(true)}
                >
                  <ion-icon name="calendar-clear-outline"></ion-icon>
                  <span>Hồ sơ chim khám</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ProfileBirdModal
        open={openModalProfile}
        onClose={() => setOpenModalProfile(false)}
      />

      <div className={styles.footerContent}>
        <button className={styles.btnBack} onClick={() => navigate(`/track`)}>
          Quay lại
        </button>
      </div>
    </div>
  );
};

const Loading = () => {
  return (
    <div className={styles.mainContent}>
      <div className={styles.content}>
        <div className={styles.InfText}>Thông tin cuộc hẹn</div>
        <div className={styles.element}>
          <h5>
            <LoadingSkeleton></LoadingSkeleton>
          </h5>
          <table>
            <tbody>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <td>
                  <LoadingSkeleton></LoadingSkeleton>
                </td>
              </tr>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <td>
                  <LoadingSkeleton></LoadingSkeleton>
                </td>
              </tr>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <td>
                  <LoadingSkeleton></LoadingSkeleton>
                </td>
              </tr>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <td>
                  <LoadingSkeleton></LoadingSkeleton>
                </td>
              </tr>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <td>
                  <LoadingSkeleton></LoadingSkeleton>
                </td>
              </tr>
              <tr>
                <th>
                  <LoadingSkeleton></LoadingSkeleton>
                </th>
                <select className={styles.selectVet}>
                  <LoadingSkeleton></LoadingSkeleton>
                </select>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.history}>
          <div className={styles.image}>
            <LoadingSkeleton height={"100%"}></LoadingSkeleton>
          </div>
        </div>
      </div>
      <div className={styles.metaContent}>
        <div className={styles.boxData}>
          <div className={styles.boxDataItem}>
            <ion-icon name="calendar-clear-outline"></ion-icon>
            <span>Hồ sơ chim khám</span>
          </div>
        </div>
        <button className={styles.btnComplete}>Check-in</button>
      </div>
    </div>
  );
};

export default ResultTestingDetail;
