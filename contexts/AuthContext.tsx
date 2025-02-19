// import { createContext, useContext, useEffect, useState } from "react";
// import AsyncStorage from '@react-native-async-storage/async-storage'; // ✅ ใช้กับ React Native
// import axios from "axios";

// export const AuthStoreContext = createContext<any>(null);

// const AuthStoreProvider = ({ children }: any) => {
//   // Global State
//   const [isAuth, setIsAuth] = useState(false);
//   const [profile, setProfile] = useState(null);
//   const [isAuthLoading, setIsAuthLoading] = useState(true);

//   // ✅ โหลด Token จาก Storage และเช็คสถานะ
//   const initAuth = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token"); // 🔹 โหลด Token

//       if (token) {
//         axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

//         // 🔹 ดึงข้อมูล Profile
//         const { data } = await axios.get("http://192.168.3.7:4000/profile");
//         setProfile(data);
//         setIsAuth(true);
//       } else {
//         setIsAuth(false);
//       }
//     } catch (error) {
//       setIsAuth(false); // 401 Token หมดอายุ
//     } finally {
//       setIsAuthLoading(false);
//     }
//   };

//   useEffect(() => {
//     initAuth();
//   }, []);

//   // ✅ Login & เก็บ Token
//   const onLogin = async (userid: string, employeeid: string) => {
//     try {
//       const { data } = await axios.post("http://192.168.3.7:4000/login", {
//         Userid: userid,
//         EMployeeid: employeeid,
//       });

//       if (data.success) {
//         await AsyncStorage.setItem("token", data.token); // 🔹 บันทึก Token
//         axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
//         setProfile(data.profile);
//         setIsAuth(true);
//       }
//     } catch (error) {
//       console.error("Login failed:", error);
//       setIsAuth(false);
//     }
//   };

//   // ✅ Logout
//   const onLogout = async () => {
//     await AsyncStorage.removeItem("token"); // ลบ Token
//     setIsAuth(false);
//     setProfile(null);
//     delete axios.defaults.headers.common["Authorization"];
//   };

//   // 🔹 ส่งค่า Context ออกไป
//   const authStoreData = {
//     isAuth,
//     isAuthLoading,
//     profile,
//     onLogin,
//     onLogout,
//   };

//   return (
//     <AuthStoreContext.Provider value={authStoreData}>
//       {children}
//     </AuthStoreContext.Provider>
//   );
// };

// export default AuthStoreProvider;


import { createContext, useContext, useEffect, useState } from "react";

export  const AuthStoreContext = createContext<any>(null) ;
//const {profile} = useContext(AuthStoreContext);

const AuthStoreProvider = ({children}:any) =>{
//global state (varible)
const[isAuth,setIsAuth] = useState(false); //(false);
const[profile,setProfile] = useState(false); 
const [isAuthLaoding,setIsAuthLaoding]= useState(true)

const initAuth = async() =>
{
  try{    

    //setIsAuth(false);

  }catch(error){
    setIsAuth(false);//401 token หมดอายุ
  }finally{
    setIsAuthLaoding(false);
  }
}

useEffect(()=>{
  initAuth();
},[]);


const onLogout =() =>{
  setIsAuth(false)
  setProfile(null!)
}

const authStoreData = {
    isAuth:isAuth,
    isAuthLoading : isAuthLaoding,
    onLogout:onLogout
  }
  
  return(
    <AuthStoreContext.Provider value={authStoreData}>
      {children}
    </AuthStoreContext.Provider>
  );

}
export default AuthStoreProvider;
