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
  const [showInfo, setShowInfo] = useState([]);

  // Hàm toggleInfo1 nhận một tham số là serviceIndex để xác định dịch vụ nào đang được thao tác
  const toggleInfo1 = (serviceIndex) => {
    // Tạo một mảng mới từ mảng cũ để tránh thay đổi trực tiếp trạng thái
    const newShowInfo = [...showInfo];
    newShowInfo[serviceIndex] = !newShowInfo[serviceIndex];
    setShowInfo(newShowInfo);
  };

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
      console.log('createdResponse', createdResponse);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Assuming you have file input elements with the ids "file1" and "file2"
    const fileInput1 = document.getElementById("file1");
    const fileInput2 = document.getElementById("file2");

    // Get the selected files
    const file1 = fileInput1.files[0];
    const file2 = fileInput2.files[0];

    // Iterate over each selected service and upload images
    for (const serviceId of selectedServices) {
      // Get the selected service details
      const selectedService = packageInfo.find((service) => service.service_package_id === serviceId);

      // Create FormData for the first image
      const formData1 = new FormData();
      formData1.append("image", file1);
      formData1.append("type", "service_form_details"); // Use the service name as type
      formData1.append("type_id", serviceId); // Use serviceId as type_id
      formData1.append("type_service", serviceId); // Replace with the actual type_service
      formData1.append("is_before", true);

      // Create FormData for the second image
      const formData2 = new FormData();
      formData2.append("image", file2);
      formData2.append("type", "service_form_details"); // Use the service name as type
      formData2.append("type_id", serviceId); // Use serviceId as type_id
      formData2.append("type_service", serviceId); // Replace with the actual type_service
      formData2.append("is_after", true);

      try {
        // Use axios to post the first image
        const response1 = await api.post("/media", formData1, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Use axios to post the second image
        const response2 = await api.post("/media", formData2, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        // Additional logic or state updates can be added here
        message.success("Tải ảnh thành công");
      } catch (error) {
        // Handle errors if any
        message.error("Tải ảnh thất bại");
        console.error("Error:", error);
      }
    }
  };

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
              >
                Thông tin
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span
                className={`${tab === 2 ? styles.active : ""}`}
              >
                Chọn dịch vụ
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span
                className={`${tab === 3 ? styles.active : ""}`}
              >
                Thực hiện
              </span>
              <ion-icon name="chevron-forward-outline"></ion-icon>
              <span
                className={`${tab === 4 ? styles.active : ""}`}
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
                  {selectedServices.map((serviceId, index) => {
                    const selectedService = packageInfo.find((service) => service.service_package_id === serviceId);

                    return (
                      <div key={index} className={styles.mainServiceImg}>
                        <span className={styles.txtService}>{index + 1}. {selectedService.package_name}</span>
                        <span className={styles.dropService}>
                          <AiOutlineDown onClick={() => toggleInfo1(index)} />
                          {showInfo[index] && (
                            <div className={styles.DropAndDrag}>
                              <div className={styles.FILEContent}>
                                <input type="file" name="file1" id="file1" className={styles.FILEGrooming} />
                                <div className={styles.BAGrooming}>Trước grooming</div>
                              </div>
                              <div className={styles.FILEContent}>
                                <input type="file" name="file2" id="file2" className={styles.FILEGrooming} />
                                <div className={styles.BAGrooming}>Sau grooming</div>
                              </div>
                            </div>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <button onClick={handleSubmit} className={styles.btnSubmit}>
                  Gửi
                </button>
              </div>
            )}
            {tab == 4 && (
              <div className={styles.completed}>
                <div className={styles.completedFirst}>
                  <div className={styles.completedLeft}>
                    <h1>Thông tin</h1>
                    <h4>Khách hàng và chim</h4>
                  </div>
                  <div className={styles.completedRight}>
                    <div className={styles.completedRightOne}>
                      <div className={styles.completedinf}>
                        <div className={styles.txtCompleted}>KHÁCH HÀNG</div>
                        <div className={styles.txtInf}>{customerProfile.name}</div>
                      </div>
                      <div className={styles.completedinf}>
                        <div className={styles.txtCompleted}>TÊN CHIM</div>
                        <div className={styles.txtInf}>{birdProfile.name}</div>
                      </div>
                    </div>
                    <div className={styles.completedRightTwo}>
                      <div className={styles.completedinf}>
                        <div className={styles.txtCompleted}>SĐT</div>
                        <div className={styles.txtInf}>{customerProfile.phone}</div>
                      </div>
                      <div className={styles.completedinf}>
                        <div className={styles.txtCompleted}>LOẠI</div>
                        <div className={styles.txtInf}>{birdProfile.breed}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.completedSecond}>
                  <div className={styles.completedLeft}>
                    <h1>Dịch vụ</h1>
                    <h4>Các dịch vụ đã chọn</h4>
                  </div>
                  <div className={styles.completedSecondService}>
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
        {tab !== 5 && (
          <button
            className={styles.btnCont}
            onClick={() => setTab((tab) => tab + 1)}
          >
            Tiếp tục
          </button>
        )}
      </div>
    </div>
  );
};

export default Grooming;
