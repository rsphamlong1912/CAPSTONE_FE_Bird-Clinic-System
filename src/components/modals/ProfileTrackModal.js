import React, { useState, useEffect } from "react";
import styles from "./ProfileTrackModal.module.scss";
import { api } from "../../services/axios";

const ProfileTrackModal = ({ open, onClose, birdProfile, birdProfileBreed, bookingID }) => {
    const [serviceFormData, setServiceFormData] = useState([]);
    const [packageDetails, setPackageDetails] = useState([]);

    useEffect(() => {
        const getServiceFormDetails = async () => {
            try {
                const response = await api.get(`/service-form/?booking_id=${bookingID}`);
                setServiceFormData(response.data.data);
            } catch (error) {
                console.log(error);
            }
        };

        const getPackageDetails = async () => {
            try {
                const response = await api.get(`/service-package`);
                const packageData = response.data.data;
                const details = {};

                packageData.forEach((packageInfo) => {
                    details[packageInfo.service_package_id] = packageInfo.package_name;
                });

                setPackageDetails(details);
            } catch (error) {
                console.log(error);
            }
        };
        // Check if the modal is open before fetching data
        if (open) {
            getServiceFormDetails();
            getPackageDetails();
        }
    }, [open, bookingID]);
    if (!open) {
        return null;
    }
    // console.log("serviceFormDetails", formDetailId)
    return (
        <div onClick={onClose} className={styles.overlay}>
            <div
                onClick={(e) => {
                    e.stopPropagation();
                }}
                className={styles.modalContainer}
            >
                <p className={styles.closeBtn} onClick={onClose}>
                    X
                </p>
                <div className={styles.container}>
                    <div className={styles.InfText}>Hồ sơ chim</div>
                    <div className={styles.element}>
                        <h5>THÔNG TIN CHIM</h5>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Tên</th>
                                    <td>{birdProfile?.name}</td>
                                </tr>
                                <tr>
                                    <th>Ngày nở</th>
                                    <td>{birdProfile?.hatching_date}</td>
                                </tr>
                                <tr>
                                    <th>Giới tính</th>
                                    <td>{birdProfile?.gender}</td>
                                </tr>
                                <tr>
                                    <th>Màu sắc</th>
                                    <td>{birdProfile?.color}</td>
                                </tr>
                                <tr>
                                    <th>Microchip</th>
                                    <td>{birdProfile?.ISO_microchip}</td>
                                </tr>
                                <tr>
                                    <th>Giống</th>
                                    <td>{birdProfileBreed}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.history}>
                        <img
                            src={birdProfile?.image}
                            className={styles.image}
                            alt={birdProfile?.name}
                        />
                        <div className={styles.historyText}>Lịch sử tiếp nhận</div>
                        <div className={styles.scrollableblock}>
                            {serviceFormData.length > 0 && serviceFormData.map((service, index) => (
                                <>
                                    <div key={index} className={styles.infSF}>
                                        <p className={styles.infSFId}>{`${index + 1}. ${service.service_form_id}`}</p>
                                        <p className={styles.infSFDate}>{service.date}</p>
                                    </div>
                                    {service.service_form_details.map((service, index) => (
                                        <div key={index} className={styles.infSFD}>
                                            <p className={styles.infSFDName}>{`${packageDetails[service.service_package_id] || 'Unknown Package'}`}</p>
                                        </div>
                                    ))}
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTrackModal;
