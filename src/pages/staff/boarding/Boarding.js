import React, { useState } from "react";
import styles from "./Boarding.module.scss";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { RiDeleteBinLine } from "react-icons/ri";
import "flatpickr/dist/flatpickr.css";
import Flatpickr from "react-flatpickr";
import ProfileBirdModal from "../../../components/modals/ProfileBirdModal";

const cageApi = Array(20).fill(null);
const Boarding = () => {
  const [tab, setTab] = useState(1);
  const [openModalProfile, setOpenModalProfile] = useState(false);

  //
  const [showInfo, setShowInfo] = useState(false);

  const [sizeBird, setSizeBird] = useState(1);
  const [cageList, setCageList] = useState(cageApi);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.left}>
            <ion-icon name="chevron-back-outline"></ion-icon>
            <span>Thoát</span>
          </div>
          <div className={styles.right}>
            <div className={styles.nameCustomer}>KH: Nguyễn Trí Công</div>
          </div>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.content}>
            <div className={styles.procedureTab}>
              <span
                className={`${tab === 1 ? styles.active : ""}`}
                onClick={() => setTab(1)}
              >
                Thông tin
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span
                className={`${tab === 2 ? styles.active : ""}`}
                onClick={() => setTab(2)}
              >
                Chọn dịch vụ
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span
                className={`${tab === 3 ? styles.active : ""}`}
                onClick={() => setTab(3)}
              >
                Chọn lồng
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span
                className={`${tab === 4 ? styles.active : ""}`}
                onClick={() => setTab(4)}
              >
                Hoàn tất
              </span>
            </div>
            {tab == 1 && (
              <div className={styles.boarding}>
                <div className={styles.customerInfo}>
                  <h4 className={styles.title}>Thông tin khách hàng</h4>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Tên khách hàng:</span>
                    <span>Nguyễn Trí Công</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Số điện thoại:</span>
                    <span>0333198224</span>
                  </div>
                </div>
                <div className={styles.birdInfo}>
                  <h4 className={styles.title}>Thông tin chim</h4>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Mã số:</span>
                    <span>BCS_5F2YNK</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Tên chim:</span>
                    <span>Con vẹt xanh</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Ngày nở:</span>
                    <span>23/09/2022</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Giới tính:</span>
                    <span>Đực</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Size:</span>
                    <span>Vừa</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Giống:</span>
                    <span>Không</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Microchip:</span>
                    <span>Không</span>
                  </div>
                </div>
              </div>
            )}
            {tab == 2 && (
              <div className={styles.boardingChosen}>
                <div className={styles.sizeBirdChosen}>
                  <h4 className={styles.title}>Chọn size chim: </h4>
                  <div className={styles.sizeBirdWrapper}>
                    <div
                      className={`${
                        sizeBird === 1
                          ? styles.sizeBirdItemActive
                          : styles.sizeBirdItem
                      }`}
                      onClick={() => setSizeBird(1)}
                    >
                      <p>Cực nhỏ</p>
                      <span>(chim ruồi, chim ác là phương nam,...)</span>
                    </div>
                    <div
                      className={`${
                        sizeBird === 2
                          ? styles.sizeBirdItemActive
                          : styles.sizeBirdItem
                      }`}
                      onClick={() => setSizeBird(2)}
                    >
                      <p>Nhỏ</p>
                      <span>(vành khuyên, chích choè đất, hút mật,...)</span>
                    </div>
                    <div
                      className={`${
                        sizeBird === 3
                          ? styles.sizeBirdItemActive
                          : styles.sizeBirdItem
                      }`}
                      onClick={() => setSizeBird(3)}
                    >
                      <p>Vừa</p>
                      <span>(chích choè lửa, chích choè than, hoạ mi,...)</span>
                    </div>
                    <div
                      className={`${
                        sizeBird === 4
                          ? styles.sizeBirdItemActive
                          : styles.sizeBirdItem
                      }`}
                      onClick={() => setSizeBird(4)}
                    >
                      <p>Lớn</p>
                      <span>(diều hâu, đại bàng, vẹt,...)</span>
                    </div>
                  </div>
                </div>
                <div className={styles.serviceChosen}>
                  <h4 className={styles.title}>Chọn dịch vụ: </h4>
                  <div className={styles.serviceWrapper}>
                    <div className={styles.serviceItem}>
                      <h5>Tiêu chuẩn</h5>
                      <div className={styles.serviceDesc}>
                        Lorem Ipsum has been the industry's standard
                      </div>
                      <span className={styles.price}>
                        95,000<sup className={styles.unitPrice}>vnđ</sup>
                        <sub>/ngày</sub>
                      </span>
                      <br></br>
                      <button>Thêm</button>
                    </div>
                    <div className={styles.serviceItem}>
                      <h5>VIP</h5>
                      <div className={styles.serviceDesc}>
                        Lorem Ipsum has been the industry's standard
                      </div>
                      <span className={styles.price}>
                        125,000<sup className={styles.unitPrice}>vnđ</sup>
                        <sub>/ngày</sub>
                      </span>
                      <br></br>
                      <button>Thêm</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {tab == 3 && (
              <div className={styles.cageChosen}>
                {cageList.map((item, index) => (
                  <div className={styles.cageItem} onClick={() => {}}>
                    <p>L.101</p>
                    <span>BCS_2FEVGF</span>
                  </div>
                ))}
              </div>
            )}
            {tab == 4 && (
              <div className={styles.confirm}>
                <div className={styles.confirmLeft}>
                  <h3 className={styles.title}>Hình ảnh tiếp nhận</h3>
                  <img
                    src="https://allbirdclinic.net/uploads/3/5/0/0/35002604/7700720.jpg"
                    alt=""
                    className={styles.image}
                  />
                  <button className={styles.btnUpload}>Tải ảnh lên</button>
                </div>
                <div className={styles.confirmRight}>
                  <h3 className={styles.title}>Xác nhận thông tin</h3>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Mã số:</span>
                    <span>BCS_5F2YNK</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Tên chim:</span>
                    <span>Con vẹt xanh</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Ngày nở:</span>
                    <span>23/09/2022</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Giới tính:</span>
                    <span>Đực</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Size:</span>
                    <span>Vừa</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Giống:</span>
                    <span>Không</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Microchip:</span>
                    <span>Không</span>
                  </div>
                </div>
              </div>
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
            <button className={styles.btnComplete}>Hoàn thành</button>
          </div>
        </div>
      </div>
      <ProfileBirdModal
        open={openModalProfile}
        onClose={() => setOpenModalProfile(false)}
      />
      <div className={styles.footerContent}>
        {tab !== 1 && (
          <button
            className={styles.btnBack}
            onClick={() => setTab((tab) => tab - 1)}
          >
            Quay lại
          </button>
        )}

        <button
          className={styles.btnCont}
          onClick={() => setTab((tab) => tab + 1)}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default Boarding;
