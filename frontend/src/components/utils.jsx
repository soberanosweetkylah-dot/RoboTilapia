// All utilies will be stored here
import { useState, useEffect, useCallback } from "react";

export function useAnimatedToggle(duration = 300) {
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);
  const open = useCallback(() => {
    setVisible(true);
    setAnimating(true);
  }, []);
  const close = useCallback(() => {
    setAnimating(false);
    setTimeout(() => setVisible(false), duration);
  }, [duration]);
  const shouldRender = visible || animating;
  return { visible, animating, open, close, shouldRender };
}

// Read data from firebase Realtime Database
import app from "../firebase.js";
import { getDatabase, ref, get } from "firebase/database";

export function useReadDatabase() {
  const [readings, setReadings] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getDatabase(app);
        const dbRef = ref(db, "dht11");
        const snapshot = await get(dbRef);
        if (!snapshot.exists()) throw new Error("Error getting database");
        setReadings(snapshot.val());
        console.log(snapshot.val());
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [readings]);

  return { readings, setReadings };
}
