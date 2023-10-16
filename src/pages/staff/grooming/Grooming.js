import React, { useState } from "react";
import styles from "./Grooming.module.scss";
import ExaminationModal from "../../../components/modals/ExaminationModal";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { RiDeleteBinLine } from "react-icons/ri";
import "flatpickr/dist/flatpickr.css";
import Flatpickr from "react-flatpickr";
import ProfileBirdModal from "../../../components/modals/ProfileBirdModal";
import {AiOutlineDown} from "react-icons/ai";
import { useDropzone } from 'react-dropzone';
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5"

const Grooming = () => {
  const [tab, setTab] = useState(1);
  const [openModalProfile, setOpenModalProfile] = useState(false);

  //
  const [showInfo, setShowInfo] = useState(false);

  const [sizeBird, setSizeBird] = useState(1);
  const [service, setService] = useState();

  const [showInfo1, setShowInfo1] = useState(false);
  const [showInfo2, setShowInfo2] = useState(false);

  const toggleInfo1 = () => {
    setShowInfo1(!showInfo1);
  };
  const toggleInfo2 = () => {
    setShowInfo2(!showInfo2);
  };
////////////
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);

  const onDrop1 = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage1(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const onDrop2 = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage2(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const onDrop3 = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage3(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };
  const onDrop4 = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage4(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps: getRootProps1, getInputProps: getInputProps1 } = useDropzone({ onDrop: onDrop1 });
  const { getRootProps: getRootProps2, getInputProps: getInputProps2 } = useDropzone({ onDrop: onDrop2 });
  const { getRootProps: getRootProps3, getInputProps: getInputProps3 } = useDropzone({ onDrop: onDrop3 });
  const { getRootProps: getRootProps4, getInputProps: getInputProps4 } = useDropzone({ onDrop: onDrop4 });

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
                Thực hiện
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
              <div className={styles.grooming}>
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
              <div className={styles.groomingChosen}>
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
                      <h5>Cắt tỉa cánh</h5>
                      <div className={styles.serviceDesc}>
                        Lorem Ipsum has been the industry's standard
                      </div>
                      <span className={styles.price}>
                        95,000<sup className={styles.unitPrice}>vnđ</sup>
                      </span>
                      <br></br>
                      <button>Thêm</button>
                    </div>
                    <div className={styles.serviceItem}>
                      <h5>Cắt móng</h5>
                      <div className={styles.serviceDesc}>
                        Lorem Ipsum has been the industry's standard
                      </div>
                      <span className={styles.price}>
                        125,000<sup className={styles.unitPrice}>vnđ</sup>
                      </span>
                      <br></br>
                      <button>Thêm</button>
                    </div>
                    <div className={styles.serviceItem}>
                      <h5>Cắt mỏ</h5>
                      <div className={styles.serviceDesc}>
                        Lorem Ipsum has been the industry's standard
                      </div>
                      <span className={styles.price}>
                        85,000<sup className={styles.unitPrice}>vnđ</sup>
                      </span>
                      <br></br>
                      <button>Thêm</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {tab == 3 && (
              <div className={styles.perform}>
                <div className={styles.services}>
                  <span className={styles.txtService}>1.Dịch vụ cắt tỉa cánh</span>
                  <span className={styles.boxService}>
                    <input type="checkbox" name="temperature" />
                    <label for="temperature">Hoàn thành</label>
                  </span>
                  <span className={styles.dropService}>
                    <AiOutlineDown onClick={toggleInfo1}/>
                    {showInfo1 && (
                      <div className={styles.DropAndDrag}>
                        <div>
                          <div {...getRootProps1()} className={styles.dropzone}>
                            <input {...getInputProps1()} />
                            {image1 ? (
                              <img src={image1} alt="Dropped Image" className={styles.showimage}/>
                            ) : (
                              <p>Kéo và thả tệp hình ảnh vào đây hoặc nhấn để chọn tệp</p>
                            )}
                          </div>
                          <div className={styles.BAGrooming}>Trước grooming</div>
                        </div>
                        <div>
                          <div {...getRootProps2()} className={styles.dropzone}>
                            <input {...getInputProps2()} />
                            {image2 ? (
                              <img src={image2} alt="Dropped Image" className={styles.showimage}/>
                            ) : (
                              <p>Kéo và thả tệp hình ảnh vào đây hoặc nhấn để chọn tệp</p>
                            )}
                          </div>
                          <div  className={styles.BAGrooming}>Sau grooming</div>
                        </div>
                      </div>
                    )}
                  </span>
                </div>
                <div className={styles.services}>
                  <span className={styles.txtService}>2.Dịch vụ cắt tỉa Lông</span>
                  <span className={styles.boxService}>
                    <input type="checkbox" name="temperature" />
                    <label for="temperature">Hoàn thành</label>
                  </span>
                  <span className={styles.dropService}>
                    <AiOutlineDown onClick={toggleInfo2}/>
                    {showInfo2 && (
                      <div className={styles.DropAndDrag}>
                        <div>
                          <div {...getRootProps3()} className={styles.dropzone}>
                            <input {...getInputProps3()} />
                            {image3 ? (
                              <img src={image3} alt="Dropped Image" className={styles.showimage}/>
                            ) : (
                              <p>Kéo và thả tệp hình ảnh vào đây hoặc nhấn để chọn tệp</p>
                            )}
                          </div>
                          <div className={styles.BAGrooming}>Trước grooming</div>
                        </div>
                        <div>
                          <div {...getRootProps4()} className={styles.dropzone}>
                            <input {...getInputProps4()} />
                            {image4 ? (
                              <img src={image4} alt="Dropped Image" className={styles.showimage}/>
                            ) : (
                              <p>Kéo và thả tệp hình ảnh vào đây hoặc nhấn để chọn tệp</p>
                            )}
                          </div>
                          <div  className={styles.BAGrooming}>Sau grooming</div>
                        </div>
                      </div>
                    )}
                  </span>
                </div>
              </div>
            )}
            {tab == 4 && (
              <div className={styles.completed}>
                <div className={styles.completedinf}>
                  <div className={styles.txtCompleted}>Khách hàng:</div>
                  <div className={styles.txtInf}>Phạm Ngọc Long</div>
            
                  <div className={styles.txtCompleted}>Tên chim:</div>
                  <div className={styles.txtInf}>Alex</div>
                </div>
                <div className={styles.completedinf}>
                  <div className={styles.txtCompleted}>Số điện thoại:</div>
                  <div className={styles.txtInf}>0909191919</div>
            
                  <div className={styles.txtCompleted}>Loài:</div>
                  <div className={styles.txtInf}>Chim vẹt</div>
                </div>
                <div className={styles.completedinf}>
                  <div className={styles.txtCompleted}>Dịch vụ:</div>
                  <div>
                    <div className={styles.txtInfSV}>Bird Wing Repair - 100.000đ</div>
                    <div className={styles.txtInfSV}>Feather Transplants (Imping) - 100.000đ</div>
                  </div>
                </div>
                <div className={styles.imageCompleted}>
                  <div className={styles.Completedimage}>
                    <img src="https://vcdn-vnexpress.vnecdn.net/2023/03/22/chim-toucan-9479-1679447208.jpg" alt="Trước grooming" />
                    <div className={styles.txtCompletedimage}>Trước grooming</div>
                  </div>
                  <div className={styles.Completedimage}>
                    <img src="https://vcdn-vnexpress.vnecdn.net/2023/03/22/chim-toucan-9479-1679447208.jpg" alt="Sau grooming" />
                    <div className={styles.txtCompletedimage}>Sau grooming</div>
                  </div>
                </div>
                <button
                    className={styles.btnConfirm}
                    onClick={() => setTab(5)}
                  >
                    Hoàn tất
                </button>
              </div>
            )}
            {tab == 5 && (
              <div className={styles.infConfirm}>
                <IoCheckmarkDoneCircleSharp  className={styles.iconConfirm}/>
                <div className={styles.txtConfirm}>Bạn đã hoàn thành tất cả các bước.</div>
                <div className={styles.txtConfirmBack}>Bạn có thể quay lại để chỉnh sửa</div>
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

export default Grooming;
