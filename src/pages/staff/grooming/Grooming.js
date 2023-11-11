import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./Grooming.module.scss";
import "reactjs-popup/dist/index.css";
import ProfileBirdModal from "../../../components/modals/ProfileBirdModal";
import { AiOutlineDown } from "react-icons/ai";
import { useDropzone } from 'react-dropzone';
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5"
import { api } from "../../../services/axios";
import { message } from "antd";

const Grooming = () => {
  const { bookingId } = useParams();
  const [birdProfile, setBirdProfile] = useState([]);
  const [customerProfile, setCustomerProfile] = useState([]);
  const [bookingInfo, setBookingInfo] = useState();
  const [sizeInfo, setSizeInfo] = useState();

  const [tab, setTab] = useState(1);
  const [openModalProfile, setOpenModalProfile] = useState(false);
  const [sizeBird, setSizeBird] = useState(1);
  const [showInfo1, setShowInfo1] = useState(false);
  const [showInfo2, setShowInfo2] = useState(false);
  const toggleInfo1 = () => {
    setShowInfo1(!showInfo1);
  };
  const toggleInfo2 = () => {
    setShowInfo2(!showInfo2);
  };
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

  const [packageInfo, setPackageInfo] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();
  const success = () => {
    messageApi.open({
      type: "success",
      content: "Chọn dịch vụ thành công",
    });
  };

  const showError = () => {
    messageApi.open({
      type: "error",
      content: "Vui lòng chọn dịch vụ",
    });
  };

  const [birdSizeId, setBirdSizeId] = useState(null);

  //LẤY THÔNG TIN BOOKING
  useEffect(() => {
    const getBooking = async () => {
      try {
        const response = await api.get(
          `/booking/${bookingId}`
        );
        setBookingInfo(response.data.data);

        if (response.data.data && response.data.data.bird_id) {
          getBirdProfile(response.data.data.bird_id);
        }
        if (response.data.data && response.data.data.account_id) {
          getCustomerProfile(response.data.data.account_id);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const getBirdProfile = async (birdId) => {
      try {
        const response = await api.get(`/bird/${birdId}`);
        setBirdProfile(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getCustomerProfile = async (customerId) => {
      try {
        const response = await api.get(`/customer/${customerId}`);
        setCustomerProfile(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getBirdSize = async () => {
      try {
        const response = await api.get(`/bird_size/`);

        const filteredSizeInfo = response.data.data.filter(item => item.bird_size_id !== 'SZ005');

        setSizeInfo(filteredSizeInfo);

        const firstBirdSize = filteredSizeInfo[0];
        setBirdSizeId(firstBirdSize.bird_size_id);
      } catch (error) {
        console.log(error);
      }
    };

    const getServicePackage = async () => {
      try {
        const response = await api.get(`/servicePackage/`, {
          params: {
            bird_size_id: birdSizeId,
            service_type_id: 'ST002',
          },
        });
        setPackageInfo(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getBirdSize();
    getBooking();
    getServicePackage();
  }, [bookingId]);

  const [selectedServices, setSelectedServices] = useState([]);

  const toggleService = (serviceId) => {
    const selectedService = packageInfo.find((service) => service.service_package_id === serviceId);
    const selectedBirdSizeId = selectedService?.bird_size_id;

    if (
      selectedBirdSizeId &&
      selectedServices.some((id) => {
        const service = packageInfo.find((s) => s.service_package_id === id);
        return service?.bird_size_id !== selectedBirdSizeId;
      })
    ) {
      message.error("Bạn đã chọn dịch vụ của size chim khác");
      return;
    }

    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  useEffect(() => {
    localStorage.setItem('selectedServices', JSON.stringify(selectedServices));
  }, [selectedServices]);

  useEffect(() => {
    const savedSelectedServices = JSON.parse(localStorage.getItem('selectedServices'));
    if (savedSelectedServices) {
      setSelectedServices(savedSelectedServices);
    }
  }, []);

  const createNewServiceForm = async () => {
    try {
      const arrServicePack = selectedServices.map((serviceId) => ({
        service_package_id: serviceId,
      }));

      const totalPrice = selectedServices.reduce((total, serviceId) => {
        const selectedService = packageInfo.find((service) => service.service_package_id === serviceId);
        return total + (selectedService ? parseFloat(selectedService.price) : 0);
      }, 0);

      const createdResponse = await api.post(`/service_Form/`, {
        bird_id: bookingInfo.bird_id,
        booking_id: bookingInfo.booking_id,
        reason_referral: "any",
        status: "pending",
        date: bookingInfo.arrival_date,
        veterinarian_referral: bookingInfo.veterinarian_id,
        total_price: totalPrice,
        qr_code: "any",
        num_ser_must_do: selectedServices.length,
        num_ser_has_done: 0,
        arr_service_pack: arrServicePack,
      });
      success();
    } catch (err) {
      console.log(err);
      showError();
    }
  };

  const [availableServices, setAvailableServices] = useState([]);
  const onSizeBirdSelect = (sizeBirdId) => {
    const servicesForSelectedSize = packageInfo.filter(
      (service) => service.bird_size_id === sizeBirdId
    );

    setAvailableServices(servicesForSelectedSize);
    setSizeBird((prevSizeBird) => {
      return prevSizeBird === sizeBirdId ? prevSizeBird : sizeBirdId;
    });
  }

  

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.headerContent}>
          <div className={styles.left}>
            <ion-icon name="chevron-back-outline"></ion-icon>
            <span>Thoát</span>
          </div>
          <div className={styles.right}>
            <div className={styles.nameCustomer}>KH: {customerProfile.name}</div>
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
                    <span>{customerProfile.name}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Số điện thoại:</span>
                    <span>{customerProfile.phone}</span>
                  </div>
                </div>
                <div className={styles.birdInfo}>
                  <h4 className={styles.title}>Thông tin chim</h4>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Tên chim:</span>
                    <span>{birdProfile.name}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Ngày nở:</span>
                    <span>{birdProfile.hatching_date}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Giới tính:</span>
                    <span>{birdProfile.gender}</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Size:</span>
                    <span>Vừa</span>
                  </div>
                  <div className={styles.lineItem}>
                    <span className={styles.label}>Giống:</span>
                    <span>{birdProfile.breed}</span>
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
                  <div className={styles.displaysizeBird}>
                    {sizeInfo.map((item, index) => (
                      <div className={styles.sizeBirdWrapper} key={index}>
                        <div
                          className={`${styles.sizeBirdItem} ${sizeBird === item.bird_size_id ? styles.sizeBirdItemActive : ""
                            }`}
                          onClick={() => onSizeBirdSelect(item.bird_size_id)}
                        >
                          <p>{item.size}</p>
                          <span>{item.breeds}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.serviceChosen}>
                  <h4 className={styles.title}>Chọn dịch vụ: </h4>
                  <div className={styles.serviceWrapper}>
                    {availableServices.map((service) => (
                      <div
                        className={`${styles.serviceItem} ${selectedServices.includes(service.service_package_id) ? styles.active : ""
                          }`}
                        key={service.service_package_id}
                      >
                        <h5>{service.package_name}</h5>
                        <div className={styles.serviceDesc}>{service.service_description}</div>
                        <span className={styles.price}>
                          {service.price}
                          <sup className={styles.unitPrice}>vnđ</sup>
                        </span>
                        <br />
                        <button onClick={() => toggleService(service.service_package_id)}>Thêm</button>
                      </div>
                    ))}
                  </div>
                </div>
                <button className={styles.printService} onClick={createNewServiceForm} >Xác nhận</button>
                {contextHolder}
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
                    <AiOutlineDown onClick={toggleInfo1} />
                    {showInfo1 && (
                      <div className={styles.DropAndDrag}>
                        <div>
                          <div {...getRootProps1()} className={styles.dropzone}>
                            <input {...getInputProps1()} />
                            {image1 ? (
                              <img src={image1} alt="Dropped Image" className={styles.showimage} />
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
                              <img src={image2} alt="Dropped Image" className={styles.showimage} />
                            ) : (
                              <p>Kéo và thả tệp hình ảnh vào đây hoặc nhấn để chọn tệp</p>
                            )}
                          </div>
                          <div className={styles.BAGrooming}>Sau grooming</div>
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
                    <AiOutlineDown onClick={toggleInfo2} />
                    {showInfo2 && (
                      <div className={styles.DropAndDrag}>
                        <div>
                          <div {...getRootProps3()} className={styles.dropzone}>
                            <input {...getInputProps3()} />
                            {image3 ? (
                              <img src={image3} alt="Dropped Image" className={styles.showimage} />
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
                              <img src={image4} alt="Dropped Image" className={styles.showimage} />
                            ) : (
                              <p>Kéo và thả tệp hình ảnh vào đây hoặc nhấn để chọn tệp</p>
                            )}
                          </div>
                          <div className={styles.BAGrooming}>Sau grooming</div>
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
                  <div className={styles.txtInf}>{customerProfile.name}</div>

                  <div className={styles.txtCompleted}>Tên chim:</div>
                  <div className={styles.txtInf}>{birdProfile.name}</div>
                </div>
                <div className={styles.completedinf}>
                  <div className={styles.txtCompleted}>Số điện thoại:</div>
                  <div className={styles.txtInf}>{customerProfile.phone}</div>

                  <div className={styles.txtCompleted}>Loài:</div>
                  <div className={styles.txtInf}>{birdProfile.breed}</div>
                </div>
                <div className={styles.completedinf}>
                  <div className={styles.txtCompleted}>Dịch vụ:</div>
                  <div>
                    {selectedServices.map((serviceId) => {
                      const selectedService = packageInfo.find((service) => service.service_package_id === serviceId);

                      return (
                        <div key={selectedService.service_package_id} className={styles.txtInfSV}>
                          {selectedService.package_name} - {selectedService.price}<sup className={styles.unitPrice}>vnđ</sup>
                        </div>
                      );
                    })}
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
                <IoCheckmarkDoneCircleSharp className={styles.iconConfirm} />
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
