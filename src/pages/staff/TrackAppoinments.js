import React from "react";
import { SearchOutlined } from "@ant-design/icons";
import "./styles/TrackAppoinments.scss";

const TrackAppoinments = () => {
  return (
    <div className="container">
      <div className="header-content">
        <div className="left"></div>
        <div className="middle">
          <span className="active">06/10</span>
          <span>07/10</span>
          <span>08/10</span>
          <span>09/10</span>
          <span>10/10</span>
        </div>
        <div className="right">
          <div className="btn-search">
            <SearchOutlined />
          </div>
          <input type="text" placeholder="Tìm kiếm khách hàng" name="search" />
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th> STT</th>
            <th> Khách hàng</th>
            <th> Chim</th>
            <th> Dịch vụ</th>
            <th> Giờ đặt</th>
            <th> Giờ checkin</th>
            <th> Bác sĩ phụ trách</th>
            <th> Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td> 1 </td>
            <td>Nguyễn Trí Công</td>
            <td>Sáo nâu</td>
            <td>Khám tổng quát</td>
            <td>09:30</td>
            <td>09:36</td>
            <td>
              <strong>Phạm Ngọc Long</strong>
            </td>
            <td>
              <p class="status being">Đang khám</p>
            </td>
          </tr>
          <tr>
            <td> 2 </td>
            <td>Lê Hũu</td>
            <td>Vẹt xanh</td>
            <td>Lưu trú</td>
            <td>10:30</td>
            <td>10:42</td>
            <td>
              <strong>Hải Nam</strong>
            </td>
            <td>
              <p class="status checkin">Đã checkin</p>
            </td>
          </tr>
          <tr>
            <td> 3 </td>
            <td>Nobi Nobita</td>
            <td>Chích choè</td>
            <td>Khám tổng quát</td>
            <td>10:45</td>
            <td>10:45</td>
            <td>
              <strong>Hải Nam</strong>
            </td>
            <td>
              <p class="status pending">Chờ kết quả</p>
            </td>
          </tr>
          <tr>
            <td> 4 </td>
            <td>Sakura Chan</td>
            <td>Vành khuyên</td>
            <td>Khám tổng quát</td>
            <td>11:30</td>
            <td>11:38</td>
            <td>
              <strong>Phạm Ngọc Long</strong>
            </td>
            <td>
              <p class="status has-result">Đã có kết quả</p>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="footer-content">
        <div className="number-result">4 kết quả</div>
      </div>
    </div>
  );
};

export default TrackAppoinments;
