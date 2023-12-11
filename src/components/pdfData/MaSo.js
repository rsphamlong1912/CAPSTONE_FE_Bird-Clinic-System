import React, { useState, useEffect } from "react";
import styles from "./MaSo.module.scss";
import useCurrentDate from "../../hooks/useCurrentDate";

export const MaSo = React.forwardRef(({bookingInfo}, ref) => {

  return (
    <div ref={ref} className={styles.container}>
    <div className={styles.code}>
    {bookingInfo?.booking_id}
    </div>
      
    </div>
  );
});