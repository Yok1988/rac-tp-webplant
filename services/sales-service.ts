import axios from "axios";
// ตรวจสอบหน้า Postman
export async function getSalesService(){
 return await axios.get('http://192.168.3.7:4000/sales');
}
//Detail
export async function getSalesDetailService(id :number){ 
    return await axios.get('http://192.168.3.7:4000/sales/' + id.toString());
}

///sales-order HC AX
export async function getSalesOrderHCService(){ 
    return await axios.get('http://192.168.3.7:4000/sales-order');
}
///Custtable HC AX
export async function getCustService(){ 
    return await axios.get('http://192.168.3.7:4000/cust');
}
///Items HC AX
export async function getInventService(){ 
    return await axios.get('http://192.168.3.7:4000/invent');
}