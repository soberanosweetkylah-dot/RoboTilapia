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
import {
  getDatabase,
  ref,
  get,
  set,
  onValue,
  update,
  remove,
  Database,
} from "firebase/database";


export function useReadDatabase() {
  const [readings, setReadings] = useState(null);

  useEffect(() => {
    const db = getDatabase(app);
    const dbRef = ref(db, "/sensors");

    const unsubscribe = onValue(dbRef, (snapshot) => {
      setReadings(snapshot.val());
    });

    return () => unsubscribe();  
  }, []);

  return { readings, setReadings };
}