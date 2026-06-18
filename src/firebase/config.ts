'use client';

/**
 * @fileOverview Firebase configuration object.
 * ข้อมูลการเชื่อมต่อที่ได้รับจาก Firebase Console
 */
export const firebaseConfig = {
  apiKey: "AIzaSyCpH7mMRr4vVir-DxfmAvOmo4Ho1GOdusw",
  authDomain: "studio-1612102279-12835.firebaseapp.com",
  projectId: "studio-1612102279-12835",
  storageBucket: "studio-1612102279-12835.firebasestorage.app",
  messagingSenderId: "660938042571",
  appId: "1:660938042571:web:80c1f5007f3d7e47b27f4e"
};

/**
 * ตรวจสอบว่ามีการระบุ API Key หรือไม่
 */
export const isFirebaseConfigured = () => {
  return !!firebaseConfig.apiKey && firebaseConfig.apiKey !== "";
};
