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
import { Modal } from "antd";
const socket = io("https://clinicsystem.io.vn/");

const Report = () => {
  const { boarding_id } = useParams();
  const [boardingInfo, setBoardingInfo] = useState();
  const [bookingInfo, setBookingInfo] = useState();
  const [serviceFormList, setServiceFormList] = useState();
  const [serviceFormSelect, setServiceFormSelect] = useState();
  const [serviceFormDetailList, setServiceFormDetailList] = useState();
  const [serviceFormDetailArr, setServiceFormDetailArr] = useState();
  const [openModalProfile, setOpenModalProfile] = useState(false);
  const [chatId, setChatId] = useState();
  const [customerId, setCustomerId] = useState();
  const [chatContent, setContentChat] = useState([]);
  const [message, setMessage] = useState();
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  let chatID;
  let customerID;

  const navigate = useNavigate();

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
      setChatId(responseBoarding.data.data.chats.chat_id);
      setCustomerId(responseBoarding.data.data.chats.customer_id);
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
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBoardingInfo();
    fetchServiceForm();
    getBookingInfo();
    fetchServiceFormDetail();
  }, []);

  const sendMessage = async (textChat) => {
    console.log("text chat", textChat);
    try {
      const responsePost = await api.post(`content-chat/`, {
        user1: "clinic",
        user2: customerId,
        message: message,
        type: "sent",
        chat_id: chatId,
      });

      const responsePost2 = await api.post(`content-chat/`, {
        user1: customerId,
        user2: "clinic",
        message: message,
        type: "receive",
        chat_id: chatId,
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
      formDataSent.append("user2", customerId);
      formDataSent.append("type", "sent");
      formDataSent.append("chat_id", chatId);

      const formDataReceived = new FormData();
      formDataReceived.append("image", selectedFile);
      formDataReceived.append("user1", customerId);
      formDataReceived.append("user2", "clinic");
      formDataReceived.append("type", "receive");
      formDataReceived.append("chat_id", chatId);

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
        socket.emit("client-sent-message", {
          user1: "clinic",
          user2: customerId,
          message: selectedFile,
          type: "sent",
          chat_id: chatId,
        });

        console.log("Message sent successfully.");
        setMessage("");
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
  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.left} onClick={() => navigate("/manage-report")}>
          <ion-icon name="chevron-back-outline"></ion-icon>
          <span>Trở về</span>
        </div>
        <div className={styles.right}>
          <div className={styles.nameCustomer}>KH: Nguyễn Trí Công</div>
        </div>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.content}>
          <div className={styles.headerContent}>
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
                src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Mimus_polyglottus1_cropped.png"
                alt=""
              />
              <Popup
                modal
                trigger={<button className={styles.services}>Dịch vụ</button>}
              >
                <div className={styles.popup}>
                  <div className={styles.headerPopup}>
                    <span>Dịch vụ</span>
                    <span>Dịch vụ chi tiết</span>
                  </div>
                  <div className={styles.bodyPopup}>
                    <div className={styles.addPopup}>
                      {serviceFormList &&
                        serviceFormList.length > 0 &&
                        serviceFormList.map((item, index) => (
                          <div
                            className={styles.serviceItem}
                            onClick={() => handleFetchServiceDetail(item)}
                            key={index}
                          >
                            {index + 1}. <span>{item.service_form_id}</span>
                          </div>
                        ))}
                    </div>
                    <div className={styles.tablePopup}>
                      <table>
                        <tr>
                          <th>Tên dịch vụ</th>
                          <th>Trạng thái</th>
                        </tr>
                        {serviceFormDetailList &&
                          serviceFormDetailList.list?.length > 0 &&
                          serviceFormDetailList.list.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>{item.note}</td>
                                {item.status === "done" ? (
                                  <td className={styles.flexStatus}>
                                    <ion-icon name="checkmark-circle"></ion-icon>
                                    <span>Đã hoàn thành</span>
                                  </td>
                                ) : (
                                  <td
                                    className={styles.flexStatus}
                                    onClick={() => {
                                      if (!serviceFormDetailList.flag)
                                        handleDoneService(item);
                                    }}
                                  >
                                    <ion-icon name="checkmark-circle-outline"></ion-icon>
                                    <span>Đang tiến hành</span>
                                  </td>
                                )}
                              </tr>
                            );
                          })}
                      </table>
                    </div>
                  </div>
                </div>
              </Popup>
            </div>
          </div>
          <div className={styles.chatInput}>
            <input
              type="text"
              placeholder="Nhập tin nhắn của bạn..."
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
            <div
              className={styles.boxDataItem}
              onClick={() => setOpenModalProfile(true)}
            >
              <ion-icon name="calendar-clear-outline"></ion-icon>
              <span>Hồ sơ chim khám</span>
            </div>
          </div>
          <button className={styles.btnComplete} onClick={() => setOpen(true)}>
            Hoàn thành
          </button>
          <Modal
            centered
            open={open}
            onOk={() => handleCheckout()}
            onCancel={() => setOpen(false)}
            width={600}
          >
            <div>
              <div className={styles.headerConfirm}>Xác nhận Checkout</div>
              {boardingInfo?.departure_date == formattedDate ? (
                <div className={styles.headerTxtFirst}>
                  Hoàn thành quá trình nội trú cho thú cưng của khách hàng
                </div>
              ) : (
                <div className={styles.headerTxtFirst}>
                  Lưu ý: Bạn có muốn checkout sớm hơn lịch dự kiến cho
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
        </div>
      </div>
    </div>
  );
};

export default Report;
