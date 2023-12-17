import React, { useEffect, useState } from "react";
import styles from "./Report.module.scss";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { MdOutlineDone } from "react-icons/md";
import ProfileBirdModal from "../../../components/modals/ProfileBirdModal";
import { AiOutlinePrinter } from "react-icons/ai";
import { api } from "../../../services/axios";
import { useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";
import { toast } from "react-toastify";
import { Modal, Popconfirm, message } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const socket = io("https://clinicsystem.io.vn/");

let chatID;
let customerID;

const Report = () => {
  const { boarding_id } = useParams();
  const [boardingInfo, setBoardingInfo] = useState();
  const [bookingInfo, setBookingInfo] = useState();
  const [birdInfo, setBirdInfo] = useState();
  const [serviceFormList, setServiceFormList] = useState();
  const [serviceFormSelect, setServiceFormSelect] = useState();
  const [serviceFormDetailList, setServiceFormDetailList] = useState();
  const [serviceFormDetailArr, setServiceFormDetailArr] = useState();
  const [openModalProfile, setOpenModalProfile] = useState(false);
  const [chatContent, setContentChat] = useState([]);
  const [message, setMessage] = useState();
  const [open, setOpen] = useState(false);
  const [openBoardingInfo, setOpenBoardingInfo] = useState();
  const [modalService, setModalService] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [load, setLoad] = useState(false);

  const navigate = useNavigate();

  function convertToHHMM(dateTimeString) {
    const date = new Date(dateTimeString);
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    return formattedTime;
  }

  // Hàm chuyển đổi định dạng ngày tháng
  const convertDateFormat = (inputDate) => {
    // Tách chuỗi ngày tháng thành mảng [year, month, day]
    const [year, month, day] = inputDate.split("-");

    // Định dạng lại thành ngày/tháng/năm
    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
  };

  // Tạo một đối tượng Date đại diện cho ngày hiện tại
  const currentDate = new Date();

  // Định dạng ngày thành chuỗi theo định dạng YYYY-MM-DD
  const formattedDate = currentDate.toISOString().split("T")[0];

  const getChatContent = async () => {
    try {
      const responseChatContent = await api.get(
        `content-chat/?chat_id=${chatID}&user1=clinic&user2=${customerID}`
      );
      setContentChat(responseChatContent.data.data);
      console.log("fetch chat ne", responseChatContent.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getBoardingInfo = async () => {
    try {
      const responseBoarding = await api.get(`/boarding/${boarding_id}`);
      // setChatId(responseBoarding.data.data.chats.chat_id);
      // setCustomerId(responseBoarding.data.data.chats.customer_id);
      chatID = responseBoarding.data.data.chats.chat_id;
      customerID = responseBoarding.data.data.chats.customer_id;
      if (responseBoarding) {
        setBoardingInfo(responseBoarding.data.data);
        console.log("boarding info", responseBoarding.data.data);
        getChatContent();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const fetchServiceForm = async () => {
    try {
      const responseServiceForm = await api.get(
        `/service-form/?booking_id=${boarding_id}`
      );
      if (responseServiceForm) {
        console.log("service form list ne: ", responseServiceForm.data.data);
        setServiceFormList(responseServiceForm.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const fetchServiceFormDetail = async () => {
    try {
      const responseServiceFormDetail = await api.get(
        `/service-form-detail/?booking_id=${boarding_id}`
      );
      if (responseServiceFormDetail) {
        console.log(
          "service form list arr ne: ",
          responseServiceFormDetail.data.data
        );
        setServiceFormDetailArr(responseServiceFormDetail.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getBookingInfo = async () => {
    try {
      const responseBooking = await api.get(`/booking/${boarding_id}`);
      setBookingInfo(responseBooking.data.data);
      if(responseBooking.data.data){
        const responseBird = await api.get(`/bird/${responseBooking.data.data.bird_id}`);
        if(responseBird.data.data) setBirdInfo(responseBird.data.data)
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBoardingInfo();
    fetchServiceForm();
    getBookingInfo();
    fetchServiceFormDetail();
  }, [load]);

  const sendMessage = async (textChat) => {
    console.log("text chat", textChat);
    try {
      const responsePost = await api.post(`content-chat/`, {
        user1: "clinic",
        user2: customerID,
        message: message,
        type: "sent",
        chat_id: chatID,
      });

      const responsePost2 = await api.post(`content-chat/`, {
        user1: customerID,
        user2: "clinic",
        message: message,
        type: "receive",
        chat_id: chatID,
      });

      if (responsePost.status === 200 && responsePost2.status === 200) {
        console.log("Cả hai message đã được gửi thành công");
        console.log("socket id khi gửi: ", socket.id);
        socket.emit("client-sent-message", {
          user1: "clinic",
          user2: customerID,
          message: textChat,
          type: "sent",
          chat_id: chatID,
        });
        setMessage("");
      } else {
        console.log("Có lỗi khi gửi một hoặc cả hai message");
      }
    } catch (error) {
      console.log("Đã xảy ra lỗi khi gửi tin nhắn:", error);
    }
  };

  const sendImage = async (textChat) => {
    try {
      const fileInput = document.getElementById("file");
      const file = fileInput.files[0];

      if (!file) {
        console.error("Please select a file.");
        return;
      }
      if (selectedFile) {
        // Thực hiện upload hình ảnh ở đây
        console.log("Đã upload:", selectedFile);
      }

      const formDataSent = new FormData();
      formDataSent.append("image", selectedFile);
      formDataSent.append("user1", "clinic");
      formDataSent.append("user2", customerID);
      formDataSent.append("type", "sent");
      formDataSent.append("chat_id", chatID);

      const formDataReceived = new FormData();
      formDataReceived.append("image", selectedFile);
      formDataReceived.append("user1", customerID);
      formDataReceived.append("user2", "clinic");
      formDataReceived.append("type", "receive");
      formDataReceived.append("chat_id", chatID);

      const sendImage = async (formData) => {
        try {
          const response = await api.post("/content-chat/img", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          return response;
        } catch (error) {
          throw new Error("Failed to send image.");
        }
      };

      // Sending image as 'sent'
      const responseSent = await sendImage(formDataSent);

      // Sending image as 'received'
      const responseReceived = await sendImage(formDataReceived);

      if (responseSent && responseReceived) {
        document.getElementById("file").value = null;
        socket.emit("client-sent-message", {
          user1: "clinic",
          user2: customerID,
          message: selectedFile,
          type: "sent",
          chat_id: chatID,
        });

        console.log("Message sent successfully.");
        setMessage("");
        setSelectedFile(null)
        getChatContent();
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    socket.emit("login", { account_id: "clinic" });

    socket.on("server-send-data_seft", (message) => {
      console.log("send data seft ♥: ", message);
      getChatContent();
      // setContentChat((chatContent) => [...chatContent, message]);
    });

    socket.on("server-send-data", (message) => {
      // console.log("message", message);
      // message.type = "receive";
      console.log("send data♥: ", message);
      getChatContent();
      // setContentChat((chatContent) => [...chatContent, message]);
    });
    return () => {
      if (socket) {
        // socket.disconnect();
        console.log("Disconnect thành công ♥ !");
      }
    };
  }, []);

  const handleFetchServiceDetail = async (item) => {
    setServiceFormSelect(item.service_form_id);
    setServiceFormDetailList({
      flag: item.veterinarian_referral ? true : false,
      list: item.service_form_details,
    });

    const responseServiceForm = await api.get(
      `/service-form/?booking_id=${boarding_id}`
    );
    if (responseServiceForm) {
      console.log("service form list ne: ", responseServiceForm.data.data);
      setServiceFormList(responseServiceForm.data.data);
    }
  };

  const handleDoneService = async (item) => {
    const responseHandleDone = await api.put(
      `/service-form-detail/${item.service_form_detail_id}`,
      {
        status: "done",
      }
    );

    //TĂNG SERVICE HAS DONE LÊN 1
    const serviceFormId = item.service_form_id;
    // Lấy thông tin hiện tại của service form
    const serviceFormResult = await api.get(`/service-form/${serviceFormId}`);
    // Lấy giá trị hiện tại của num_ser_has_done từ response

    const currentNumSerHasDone =
      serviceFormResult.data.data[0].num_ser_has_done;
    // Tăng giá trị lên 1
    const updatedNumSerHasDone = currentNumSerHasDone + 1;

    const isDone =
      serviceFormResult.data.data[0].num_ser_must_do === updatedNumSerHasDone;

    // Gửi yêu cầu PUT để cập nhật giá trị num_ser_has_done
    const increaseResponse = await api.put(`/service-form/${serviceFormId}`, {
      num_ser_has_done: updatedNumSerHasDone,
      status: isDone ? "done_not_paid" : "pending",
    });
    handleFetchServiceDetail(serviceFormSelect);
    if (responseHandleDone) {
      toast.success("Thay đổi trạng thái thành công!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleCheckout = async () => {
    try {
      const responseUpdateBoarding = await api.put(
        `/boarding/${boardingInfo.boarding_id}`,
        {
          act_departure_date: formattedDate, //lay ngay hien tai
        }
      );
      console.log("done update boarding", responseUpdateBoarding.data);

      const responseDoneBooking = await api.put(
        `/booking/${boardingInfo.boarding_id}`,
        {
          status: "finish",
        }
      );
      console.log("done booking", responseDoneBooking.data);

      const responseResetCage = await api.put(`/cage/${boardingInfo.cage_id}`, {
        boarding_id: null,
        bird_id: null,
        status: "empty",
      });
      console.log("reset cage", responseResetCage);

      for (const item of serviceFormList) {
        try {
          const responseHandleDone = await api.put(
            `/service-form/${item.service_form_id}`,
            {
              status: "done",
            }
          );
          console.log("set done sf", responseHandleDone);
        } catch (error) {}
      }

      for (const item of serviceFormDetailArr) {
        try {
          const responseHandleDoneDetail = await api.put(
            `/service-form-detail/${item.service_form_detail_id}`,
            {
              status: "done",
            }
          );
          console.log("set done sfd", responseHandleDoneDetail);
        } catch (error) {}
      }

      if (responseUpdateBoarding && responseDoneBooking && responseResetCage) {
        toast.success("Checkout thành công", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
      setOpen(false);
      navigate("/manage-report");
    } catch (error) {
      console.log(error);
    }
  };

  function formatTimeCreate(timeCreate) {
    let p = new Date(timeCreate);
    return (
      p.getHours() +
      ":" +
      p.getMinutes() +
      ", " +
      p.getDate() +
      "/" +
      (p.getMonth() + 1) +
      "/" +
      p.getFullYear()
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.headerContent}>
        <div className={styles.left} onClick={() => navigate(`/manage-report`)}>
          <ion-icon name="chevron-back-outline"></ion-icon>
          <h4>THOÁT</h4>
        </div>
        <div className={styles.right}>
          <div className={styles.nameCustomer}>
            KH: {bookingInfo?.customer_name}
          </div>
        </div>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.content}>
          <div className={styles.headerContentBoarding}>
            <div className={styles.roomNumber}>L.{boardingInfo?.cage_id}</div>
            <div className={styles.nestedCode}>{boarding_id}</div>
          </div>
          <div className={styles.bodyContent}>
            <div className={styles.contentReports}>
              <div className={styles.headerReports}>Nội dung báo cáo</div>
              <div className={styles.chatContainer}>
                <div className={styles.chatMessages}>
                  {chatContent &&
                    chatContent.length > 0 &&
                    chatContent.map((message, index) => (
                      <div
                        key={index}
                        className={`${
                          message.type === "sent"
                            ? styles.clinic
                            : styles.customer
                        }`}
                      >
                        {message.img_link && (
                          <img
                            key={message.content_chat_id}
                            className={styles.imgChat}
                            src={
                              message.img_link
                                ? message.img_link
                                : "https://limosa.vn/wp-content/uploads/2023/08/Loading-la-gi.jpg"
                            }
                            alt=""
                          />
                        )}
                        {message.message && (
                          <div key={message.content_chat_id}>
                            {message.message}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className={styles.contentServices}>
              <img
                src={ birdInfo ?  birdInfo?.image : "https://media.istockphoto.com/id/1370544962/vi/anh/n%E1%BB%81n-gi%E1%BA%A5y-tr%E1%BA%AFng-k%E1%BA%BFt-c%E1%BA%A5u-b%C3%ACa-c%E1%BB%A9ng-s%E1%BB%A3i-%C4%91%E1%BB%83-c%E1%BA%A1o-r%C3%A2u.jpg?s=612x612&w=0&k=20&c=7fuXKUP3PkMIZhFg4MWyov7kxvVh2oFSQ3qBmhtvodw="}
                alt=""
              />
              <button
                className={styles.nameBird}
                onClick={() => {
                  getChatContent();
                }}
              >
                {birdInfo?.name}
              </button>
              <button
                className={styles.services}
                onClick={() => {
                  setModalService(true);
                  setLoad(!load);
                }}
              >
                <ion-icon name="layers-outline"></ion-icon>
                Dịch vụ
              </button>
              {/* <Popup
                modal
                trigger={<button className={styles.services}>
                  <ion-icon name="layers-outline"></ion-icon>
                  Dịch vụ</button>
                  }
              > */}
              <Modal
                centered
                open={modalService}
                onOk={() => setModalService(false)}
                onCancel={() => setModalService(false)}
                cancelText="Đóng"
                width={1000}
              >
                <div className={styles.popup}>
                  <div className={styles.headerPopup}>
                    <span>DỊCH VỤ</span>
                    <span>CHI TIẾT DỊCH VỤ</span>
                  </div>
                  <div className={styles.bodyPopup}>
                    <div className={styles.addPopup}>
                      {serviceFormList &&
                        serviceFormList.length > 0 &&
                        serviceFormList.map((item, index) => (
                          <>
                            <div
                              className={styles.serviceItem}
                              onClick={() => handleFetchServiceDetail(item)}
                              key={index}
                            >
                              <span
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <ion-icon name="reader-outline"></ion-icon>
                                {item.service_form_id}
                              </span>
                              <span>{formatTimeCreate(item.time_create)}</span>
                            </div>
                          </>
                        ))}
                    </div>
                    <div className={styles.tablePopup}>
                      <table>
                        <tr>
                          <th>Tên gói dịch vụ</th>
                          <th>Trạng thái</th>
                        </tr>
                        {serviceFormDetailList &&
                          serviceFormDetailList.list?.length > 0 &&
                          serviceFormDetailList.list.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td style={{ width: 270 }}>{item.note}</td>
                                {item.status === "done" ? (
                                  <td className={styles.flexStatus}>
                                    <ion-icon name="checkmark-circle"></ion-icon>
                                    <span>Đã hoàn thành</span>
                                  </td>
                                ) : (
                                  <Popconfirm
                                    title="Xác nhận"
                                    description="Hoàn thành gói dịch vụ này ?"
                                    okText="OK"
                                    cancelText="Đóng"
                                    onConfirm={() => {
                                      if (!serviceFormDetailList.flag) {
                                        handleDoneService(item);
                                      } else {
                                        toast.error(
                                          "Không thể hoàn thành gói dịch vụ này ở đây!",
                                          {
                                            position: "top-right",
                                            autoClose: 5000,
                                            hideProgressBar: false,
                                            closeOnClick: true,
                                            pauseOnHover: true,
                                            draggable: true,
                                            progress: undefined,
                                            theme: "light",
                                          }
                                        );
                                      }
                                    }}
                                    icon={
                                      <QuestionCircleOutlined
                                        style={{
                                          color: "#32b768",
                                        }}
                                      />
                                    }
                                  >
                                    <td
                                      className={styles.flexStatus}
                                      // onClick={() => {
                                      //   if (!serviceFormDetailList.flag)
                                      //     handleDoneService(item);
                                      // }}
                                    >
                                      <ion-icon name="checkmark-circle-outline"></ion-icon>
                                      <span>Đang tiến hành</span>
                                    </td>
                                  </Popconfirm>
                                )}
                              </tr>
                            );
                          })}
                      </table>
                    </div>
                  </div>
                </div>
              </Modal>
              {/* </Popup> */}
            </div>
          </div>
          <div className={styles.chatInput}>
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <input
              type="file"
              name="file"
              id="file"
              onChange={handleFileChange}
            />
            <button
              onClick={() => {
                if (selectedFile) {
                  sendImage(message);
                } else {
                  sendMessage(message);
                }
              }}
            >
              Gửi
            </button>
          </div>
        </div>
        <div className={styles.metaContent}>
          <div className={styles.boxData}>
            <div>
              <div
                className={styles.boxDataItem}
                onClick={() => setOpenModalProfile(true)}
              >
                <ion-icon name="calendar-clear-outline"></ion-icon>
                <span>Hồ sơ chim nội trú</span>
              </div>
              <div
                className={styles.boxDataItem}
                onClick={() => setOpenBoardingInfo(true)}
              >
                <ion-icon name="reader-outline"></ion-icon>
                <span>Nội dung nội trú</span>
              </div>
            </div>
          </div>
          <button className={styles.btnComplete} onClick={() => setOpen(true)}>
            Hoàn thành
          </button>
          {/* MODAL CONFIRM  */}
          <Modal
            centered
            open={open}
            onOk={() => handleCheckout()}
            onCancel={() => setOpen(false)}
            cancelText="Đóng"
            width={600}
          >
            <div>
              <div className={styles.headerConfirm}>
                XÁC NHẬN HOÀN TẤT NỘI TRÚ
              </div>
              {boardingInfo?.departure_date == formattedDate ? (
                <div className={styles.headerTxtFirst}>
                  Hoàn thành quá trình nội trú cho thú cưng của khách hàng
                </div>
              ) : (
                <div className={styles.headerTxtFirst}>
                  Lưu ý: Bạn có muốn hoàn tất nội sớm hơn lịch dự kiến cho Khách
                  hàng
                </div>
              )}

              <div className={styles.headerTxtSecond}>
                {bookingInfo?.customer_name}
              </div>

              <div className={styles.headerTxtThird}>
                Vui lòng nhấn OK để xác nhận.
              </div>
            </div>
          </Modal>
          {/* MODAL BORADING INFO  */}
          <Modal
            title="Nội dung nội trú"
            centered
            open={openBoardingInfo}
            onOk={() => setOpenBoardingInfo(false)}
            onCancel={() => setOpenBoardingInfo(false)}
            width={500}
          >
            <div className={styles.lineItem}>
              <span className={styles.label}>Ngày bắt đầu:</span>
              <span>{boardingInfo && convertDateFormat(boardingInfo?.arrival_date)}</span>
            </div>
            <div className={styles.lineItem}>
              <span className={styles.label}>Ngày kết thúc:</span>
              <span>{boardingInfo && convertDateFormat(boardingInfo?.departure_date)}</span>
            </div>
            <div className={styles.lineItem}>
              <span className={styles.label}>Phòng:</span>
              <span>{boardingInfo?.room_type}</span>
            </div>
          </Modal>
        </div>
      </div>
      <ProfileBirdModal
        open={openModalProfile}
        birdProfile={birdInfo}
        onClose={() => setOpenModalProfile(false)}
      />
    </div>
  );
};

export default Report;
