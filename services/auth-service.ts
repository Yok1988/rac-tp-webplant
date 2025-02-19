import axios from 'axios';

const API_URL = 'http://192.168.3.7:4000/login-erp'; // เปลี่ยนเป็น URL จริงของคุณ

export const loginService = async (userid: string, password: string) => {
    try {
        const response = await axios.post(API_URL, { Userid: userid, EMployeeid: password }); 
        return response.data;
    } catch (error) {
        throw error;
    }
};

// import AsyncStorage from "@react-native-async-storage/async-storage";

// export const loginService = async (userid: string, password: string) => {
//     try {
//         const response = await fetch("http://localhost:4000/login", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ Userid: userid, Employeeid: password }),
//         });

//         const data = await response.json();
//         if (data.success) {
//             await AsyncStorage.setItem("token", data.token);
//             return data;
//         }
//         return { success: false };
//     } catch (error) {
//         console.error("❌ Login Error:", error);
//         return { success: false };
//     }
// };



