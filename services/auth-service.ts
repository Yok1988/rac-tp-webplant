//#ไม่ใช้ Token login Login Without Token
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from 'expo-secure-store';
const API_URL = 'http://192.168.3.7:4000/login-erp'; // เปลี่ยนเป็น URL จริงของคุณ

//#Token Login With out no Token
export const loginService = async (userid: string, password: string) => {
    try {
        const response = await axios.post(API_URL, { Userid: userid, EMployeeid: password }); 
        return response.data;
    } catch (error) {
        throw error;
    }
};

//#Token Login With Token
export const loginInServiceToken = async (userid: string, password: string) => {
    try {
      const response = await fetch("http://192.168.3.7:4000/login", { // ใช้ IP เดียวกับใน Postman
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Userid: userid, password: password }),
      });
  
      console.log("📡 Request Body:", JSON.stringify({ Userid: userid, password: password }));
  
      if (!response.ok) {
        console.error("❌ HTTP Error:", response.status);
        return { success: false, message: `HTTP Error: ${response.status}` };
      }
  
      const data = await response.json();
      console.log("✅ Login Success:", data);
  
      if (data.success) {
        await AsyncStorage.setItem("token", data.token);
        return { success: true, token: data.token,Userid: data.Userid };
      }
  
      return { success: false, message: "Invalid credentials" };
    } catch (error) {
      console.error("❌ Login Error:", error);
      return { success: false, message: "Network Error" };
    }
  };
  


export const loginToken = async (userid: string, password: string) => {
    try {
        const response = await fetch("http://192.168.3.7:4000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ Userid: userid, password: password }),
        });
        
        // ✅ Debug ค่าที่ส่งไปยัง API
      console.log("📌 Request Body:", JSON.stringify({ Userid: userid, password: password }));
        const data = await response.json();
        if (data.success) {
            console.error("🟢🟢 Login :", data.token);
            await AsyncStorage.setItem("token", data.token);
            const storedToken = await AsyncStorage.getItem("token");
            console.log("✅ Token in AsyncStorage:", storedToken);
            return data;
        }
        return { success: false };
    } catch (error) {
        console.error("❌ Login Error:", error);
        return { success: false };
    }
};

export async function loginServiceTP(userid: string, password: string) {
    try {
      const res = await axios.post('http://192.168.3.7:4000//login', {
        userid: userid,
        password: password,
      });
      await SecureStore.setItemAsync('token', JSON.stringify(res.data));
      console.error("🟢🟢 Login :", res.data.token);
    } catch (error) {
      throw error;
    }
  }

export async function logoutService() {
    await SecureStore.deleteItemAsync('token');
    await AsyncStorage.removeItem('token');
    
  }