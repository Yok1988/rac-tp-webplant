import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Alert, TouchableOpacity, TextInput } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getSalesService } from '@/services/sales-service';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { zip } from 'react-native-zip-archive';
import Checkbox from 'expo-checkbox';

export default function App() {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [searchDONo, setSearchDONo] = useState('');
  const [searchDPDate, setSearchDPDate] = useState('');
  const [searchCustNo, setSearchCustNo] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  const { data } = useQuery({
    queryKey: ['salesData'],
    queryFn: async () => {
      const response = await getSalesService();
      return response.data;
    },
  });

  // กรองข้อมูลตามค่าที่ป้อน
  const filteredData = data?.filter((item: { DONo: string | string[]; DPDate: string | number | Date; CustNo: string | string[]; }) => {
    const matchesDONo = searchDONo ? item.DONo.includes(searchDONo) : true;
    const matchesDPDate = searchDPDate ? new Date(item.DPDate).toLocaleDateString().includes(searchDPDate) : true;
    const matchesCustNo = searchCustNo ? item.CustNo.includes(searchCustNo) : true;
    return matchesDONo && matchesDPDate && matchesCustNo;
  });

  const toggleSelection = (imageUrl: string) => {
    setSelectedImages((prev) =>
      prev.includes(imageUrl) ? prev.filter((url) => url !== imageUrl) : [...prev, imageUrl]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedImages([]);
    } else {
      setSelectedImages(filteredData?.map((item: { URL_FILE: any; }) => item.URL_FILE) || []);
    }
    setSelectAll(!selectAll);
  };

  // 🔹 บันทึกไฟล์เดี่ยวลง Gallery
  const saveSelectedImagesIndividually = async () => {
    if (selectedImages.length === 0) {
      Alert.alert('No selection', 'Please select at least one image.');
      return;
    }

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to save files.');
      return;
    }

    try {
      if (!FileSystem.documentDirectory) {
        console.error("Error: FileSystem.documentDirectory is null");
        return;
      }

      for (const imageUrl of selectedImages) {
        const fileName = imageUrl.split('/').pop();
        const fileUri = FileSystem.documentDirectory + fileName;
        const downloadedFile = await FileSystem.downloadAsync(imageUrl, fileUri);

        if (downloadedFile.status === 200) {
          await MediaLibrary.saveToLibraryAsync(fileUri);
        }
      }

      Alert.alert('Success', 'Images saved to gallery.');
    } catch (error) {
      console.error('Error saving images:', error);
      Alert.alert('Error', 'Failed to save images.');
    }
  };

  // 🔹 บันทึกเป็นไฟล์ ZIP
  const saveSelectedImagesAsZip = async () => {
    if (selectedImages.length === 0) {
      Alert.alert('No selection', 'Please select at least one image.');
      return;
    }

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to save files.');
      return;
    }

    try {
      const downloadDir = FileSystem.documentDirectory + 'downloads/';
      await FileSystem.deleteAsync(downloadDir, { idempotent: true }); // ลบโฟลเดอร์เก่าก่อนสร้างใหม่
      await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });

      const downloadedFiles: string[] = [];
      for (const imageUrl of selectedImages) {
        const fileName = imageUrl.split('/').pop();
        if (!fileName) continue;

        const fileUri = downloadDir + fileName;
        const downloadedFile = await FileSystem.downloadAsync(imageUrl, fileUri);

        if (downloadedFile.status === 200) {
          downloadedFiles.push(fileUri);
        }
      }

      const zipFilePath = FileSystem.documentDirectory + 'selected_images.zip';
      await FileSystem.deleteAsync(zipFilePath, { idempotent: true }); // ลบ ZIP ไฟล์เก่าก่อนสร้างใหม่
      await zip(downloadDir, zipFilePath);

      if (await FileSystem.getInfoAsync(zipFilePath)) {
        await Sharing.shareAsync(zipFilePath);
      }
    } catch (error) {
      console.error('Error creating ZIP:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔍 ฟิลเตอร์ค้นหา */}
      <TextInput style={styles.input} placeholder="🔍 Filter by Order No (DONo)" value={searchDONo} onChangeText={setSearchDONo} />
      <TextInput style={styles.input} placeholder="📅 Filter by Date (DD/MM/YYYY)" value={searchDPDate} onChangeText={setSearchDPDate} />
      <TextInput style={styles.input} placeholder="👤 Filter by Customer No (CustNo)" value={searchCustNo} onChangeText={setSearchCustNo} />

      <View style={styles.selectAllContainer}>
        <Checkbox value={selectAll} onValueChange={toggleSelectAll} color={selectAll ? '#6200ea' : undefined} />
        <Text style={styles.selectAllText}>Select All</Text>
      </View>

      {/* รายการที่กรองแล้ว */}
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => item.DONo || index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Checkbox
                value={selectedImages.includes(item.URL_FILE)}
                onValueChange={() => toggleSelection(item.URL_FILE)}
                color={selectedImages.includes(item.URL_FILE) ? '#6200ea' : undefined}
              />
              <Text style={styles.title}>📦 Order No: {item.DONo}</Text>             
            </View> 
            <Text style={styles.detail}>📦 S/O No: {item.SPONo}</Text>          
            <Text style={styles.detail}>📅 Date: {new Date(item.DPDate).toLocaleDateString()}</Text>
            <Text style={styles.detail}>👤 Customer No: {item.CustNo}</Text>
            {item.URL_FILE && <Image source={{ uri: item.URL_FILE }} style={styles.image} resizeMode="contain" />}
          </View>
        )}
      />

      {/* ปุ่มบันทึก */}
      {selectedImages.length > 0 && (
        <View>
          <TouchableOpacity style={styles.saveButton} onPress={saveSelectedImagesIndividually}>
            <Text style={styles.saveButtonText}>📥 Save Images</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={saveSelectedImagesAsZip}>
            <Text style={styles.saveButtonText}>📦 Save as Zip</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );  
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  input: { backgroundColor: '#fff', padding: 10, marginVertical: 5, borderRadius: 8, fontSize: 16 },
  card: { backgroundColor: '#fff', padding: 15, marginVertical: 5, borderRadius: 8 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 10 },
  detail: { fontSize: 16, color: '#555', marginBottom: 4 },
  image: { width: '100%', height: 200, marginTop: 10, borderRadius: 10 },
  saveButton: { backgroundColor: '#6200ea', padding: 15, borderRadius: 10, margin: 10, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  selectAllContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  selectAllText: { fontSize: 16, marginLeft: 10, color: '#333' }
});


// import React, { useState } from 'react';
// import { View, Text, StyleSheet, FlatList, Image, Alert, TouchableOpacity, TextInput } from 'react-native';
// import { useQuery } from '@tanstack/react-query';
// import { getSalesService } from '@/services/sales-service';
// import * as FileSystem from 'expo-file-system';
// import * as MediaLibrary from 'expo-media-library';
// import * as Sharing from 'expo-sharing';
// import { zip } from 'react-native-zip-archive';
// import Checkbox from 'expo-checkbox';

// export default function App() {
//   const [selectedImages, setSelectedImages] = useState<string[]>([]);
//   const [searchDONo, setSearchDONo] = useState('');
//   const [searchDPDate, setSearchDPDate] = useState('');
//   const [searchCustNo, setSearchCustNo] = useState('');

//   const { data } = useQuery({
//     queryKey: ['salesData'],
//     queryFn: async () => {
//       const response = await getSalesService();
//       return response.data;
//     },
//   });

//   // กรองข้อมูลตามค่าที่ป้อน
//   const filteredData = data?.filter((item: { DONo: string | string[]; DPDate: string | number | Date; CustNo: string | string[]; }) => {
//     const matchesDONo = searchDONo ? item.DONo.includes(searchDONo) : true;
//     const matchesDPDate = searchDPDate ? new Date(item.DPDate).toLocaleDateString().includes(searchDPDate) : true;
//     const matchesCustNo = searchCustNo ? item.CustNo.includes(searchCustNo) : true;
//     return matchesDONo && matchesDPDate && matchesCustNo;
//   });

//   const toggleSelection = (imageUrl: string) => {
//     setSelectedImages((prev) =>
//       prev.includes(imageUrl) ? prev.filter((url) => url !== imageUrl) : [...prev, imageUrl]
//     );
//   };

//   const saveSelectedImagesAsZip = async () => {
//     if (selectedImages.length === 0) {
//       Alert.alert('No selection', 'Please select at least one image.');
//       return;
//     }

//     const { status } = await MediaLibrary.requestPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission required', 'Please allow access to save files.');
//       return;
//     }

//     try {
//       const downloadDir = FileSystem.documentDirectory + 'downloads/';
//       await FileSystem.makeDirectoryAsync(downloadDir, { intermediates: true });

//       const downloadedFiles: string[] = [];
//       for (const imageUrl of selectedImages) {
//         const fileName = imageUrl.split('/').pop();
//         if (!fileName) continue;

//         const fileUri = downloadDir + fileName;
//         const downloadedFile = await FileSystem.downloadAsync(imageUrl, fileUri);

//         if (downloadedFile.status === 200) {
//           downloadedFiles.push(fileUri);
//         }
//       }

//       const zipFilePath = FileSystem.documentDirectory + 'selected_images.zip';
//       await zip(downloadDir, zipFilePath);

//       if (await FileSystem.getInfoAsync(zipFilePath)) {
//         await Sharing.shareAsync(zipFilePath);
//       }
//     } catch (error) {
//       console.error('Error creating ZIP:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* 🔍 ฟิลเตอร์ค้นหา */}
//       <TextInput
//         style={styles.input}
//         placeholder="🔍 Filter by Order No (DONo)"
//         value={searchDONo}
//         onChangeText={setSearchDONo}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="📅 Filter by Date (DD/MM/YYYY)"
//         value={searchDPDate}
//         onChangeText={setSearchDPDate}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="👤 Filter by Customer No (CustNo)"
//         value={searchCustNo}
//         onChangeText={setSearchCustNo}
//       />

//       {/* รายการที่กรองแล้ว */}
//       <FlatList
//         data={filteredData}
//         keyExtractor={(item, index) => item.DONo || index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <View style={styles.row}>
//               <Checkbox
//                 value={selectedImages.includes(item.URL_FILE)}
//                 onValueChange={() => toggleSelection(item.URL_FILE)}
//                 color={selectedImages.includes(item.URL_FILE) ? '#6200ea' : undefined}
//               />
//               <Text style={styles.title}>📦 Order No: {item.DONo}</Text>
//             </View>
//             <Text style={styles.detail}>📅 Date: {new Date(item.DPDate).toLocaleDateString()}</Text>
//             <Text style={styles.detail}>👤 Customer No: {item.CustNo}</Text>

//             {item.URL_FILE && <Image source={{ uri: item.URL_FILE }} style={styles.image} resizeMode="contain" />}
//           </View>
//         )}
//       />

//       {/* ปุ่มบันทึกเป็น ZIP */}
//       {selectedImages.length > 0 && (
//         <TouchableOpacity style={styles.saveButton} onPress={saveSelectedImagesAsZip}>
//           <Text style={styles.saveButtonText}>📥 Save {selectedImages.length} as Zip</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
//   input: {
//     backgroundColor: '#fff',
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 8,
//     fontSize: 16,
//   },
//   card: { backgroundColor: '#fff', padding: 15, marginVertical: 5, borderRadius: 8 },
//   row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
//   title: { fontSize: 18, fontWeight: 'bold', color: '#333', marginLeft: 10 },
//   detail: { fontSize: 16, color: '#555', marginBottom: 4 },
//   image: { width: '100%', height: 200, marginTop: 10, borderRadius: 10 },
//   saveButton: { backgroundColor: '#6200ea', padding: 15, borderRadius: 10, margin: 20, alignItems: 'center' },
//   saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
// });

//=========================================
// import React, { useState } from 'react';
// import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
// import { useQuery } from '@tanstack/react-query';
// import { getSalesService } from '@/services/sales-service';
// import * as FileSystem from 'expo-file-system';
// import * as MediaLibrary from 'expo-media-library';
// import Checkbox from 'expo-checkbox';

// export default function App() {
//   const [orderNo, setOrderNo] = useState('');
//   const [custNo, setCustNo] = useState('');
//   const [date, setDate] = useState('');
//   const [selectedImages, setSelectedImages] = useState<string[]>([]);
//   const { data, isLoading, error } = useQuery({
//     queryKey: ['salesData'],
//     queryFn: async () => {
//       const response = await getSalesService();
//       return response.data;
//     },
//     staleTime: 1000 * 60 * 5,
//   });

//   const toggleSelection = (imageUrl: string) => {
//     setSelectedImages((prev) => {
//       const updatedSelection = Array.isArray(prev) ? [...prev] : [];
//       return updatedSelection.includes(imageUrl)
//         ? updatedSelection.filter((url) => url !== imageUrl)
//         : [...updatedSelection, imageUrl];
//     });
//   };
  
//   const saveSelectedImages = async () => {
//     if (selectedImages.length === 0) {
//       Alert.alert('No selection', 'Please select at least one image.');
//       return;
//     }

//     const { status } = await MediaLibrary.requestPermissionsAsync();
//     if (status !== 'granted') {
//       Alert.alert('Permission required', 'Please allow access to save images.');
//       return;
//     }

//     try {
//       if (!FileSystem.documentDirectory) {
//         console.error("Error: FileSystem.documentDirectory is null");
//         return;
//       }
    
//       for (const imageUrl of selectedImages) {
//         const fileName = imageUrl.split('/').pop(); // ดึงชื่อไฟล์จาก URL
//         if (!fileName) continue;
    
//         const fileUri = FileSystem.documentDirectory + fileName;
//         const downloadedFile = await FileSystem.downloadAsync(imageUrl, fileUri);
    
//         if (downloadedFile.status === 200) {
//           await MediaLibrary.createAssetAsync(downloadedFile.uri);
//         }
//       }
//     } catch (error) {
//       console.error("Error saving images:", error);
//     }
    
//   };

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={data}
//         keyExtractor={(item, index) => item.DONo || index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <View style={styles.row}>
//               <Checkbox
//                 value={selectedImages.includes(item.URL_FILE)}
//                 onValueChange={() => toggleSelection(item.URL_FILE)}
//                 color={selectedImages.includes(item.URL_FILE) ? '#6200ea' : undefined}
//               />
//               <Text style={styles.title}>📦 Order No: {item.DONo}</Text>
//             </View>
//             <Text style={styles.title}>📦 S/O No: {item.SPONo}</Text>
//             <Text style={styles.detail}>📅 Date: {new Date(item.DPDate).toLocaleDateString()}</Text>
//             <Text style={styles.detail}>👤 Customer No: {item.CustNo}</Text>
//             <Text style={styles.detail}>🎁 ItemNo: {item.ItemNo}</Text>
//             <Text style={styles.detail}>📈 Quantity: {item.Qty}</Text>
//             <Text style={styles.detail}>💰 Price: {item.Price ? item.Price.toFixed(2) : 'N/A'} Baht</Text>

//             {item.URL_FILE && (
//               <Image source={{ uri: item.URL_FILE }} style={styles.image} resizeMode="contain" />
//             )}
//           </View>
//         )}
//       />

//       {selectedImages.length > 0 && (
//         <TouchableOpacity style={styles.saveButton} onPress={saveSelectedImages}>
//           <Text style={styles.saveButtonText}>📥 Save {selectedImages.length} Images</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 20,
//     marginVertical: 10,
//     marginHorizontal: 20,
//     borderRadius: 15,
//     elevation: 5,
//   },
//   row: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginLeft: 10,
//   },
//   detail: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 4,
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     marginTop: 10,
//     borderRadius: 10,
//   },
//   saveButton: {
//     backgroundColor: '#6200ea',
//     padding: 15,
//     borderRadius: 10,
//     margin: 20,
//     alignItems: 'center',
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });



//============================
// import React, { useState } from 'react';
// import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TextInput } from 'react-native';
// import { useQuery } from '@tanstack/react-query';
// import { getSalesService } from '@/services/sales-service';

// export default function App() {
//   const [orderNo, setOrderNo] = useState('');
//   const [custNo, setCustNo] = useState('');
//   const [date, setDate] = useState('');

//   // ใช้ React Query เพื่อดึงข้อมูลจาก API
//   const { data, isLoading, error, refetch } = useQuery({
//     queryKey: ['salesData'],
//     queryFn: async () => {
//       const response = await getSalesService();
//       console.log("Fetched Data:", response.data);
//       return response.data;
//     },
//     staleTime: 1000 * 60 * 5, // ตั้งค่าให้ข้อมูลไม่รีเฟรชบ่อยเกินไป
//   });

//   console.log("Error:", error);

//   // ฟิลเตอร์ข้อมูลตามเงื่อนไขที่กรอก
//   const filteredData = Array.isArray(data) ? data.filter(item => {
//     const matchesOrderNo = orderNo ? item.DONo?.includes(orderNo) : true;
//     const matchesCustNo = custNo ? item.CustNo?.includes(custNo) : true;
//     const matchesDate = date ? new Date(item.DPDate).toLocaleDateString().includes(date) : true;
//     return matchesOrderNo && matchesCustNo && matchesDate;
//   }) : [];

//   if (isLoading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#6200ea" />
//         <Text style={styles.loadingText}>🔍⏳ Loading sales data...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.errorText}>⚠️ Error loading data: {error.message}</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* ฟิลเตอร์ */}
//       <View style={styles.filterContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="🔍 Filter by Order No"
//           value={orderNo}
//           onChangeText={setOrderNo}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="🔍 Filter by Customer No"
//           value={custNo}
//           onChangeText={setCustNo}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="🔍 Filter by Date (MM/DD/YYYY)"
//           value={date}
//           onChangeText={setDate}
//         />
//       </View>

//       {/* รายการคำสั่งซื้อ */}
//       <FlatList
//         data={filteredData}
//         keyExtractor={(item, index) => item.DONo || index.toString()}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Text style={styles.title}>📦 Order No: {item.DONo}</Text>
//             <Text style={styles.title}>📦 S/O No: {item.SPONo}</Text>
//             <Text style={styles.detail}>📅 Date: {new Date(item.DPDate).toLocaleDateString()}</Text>
//             <Text style={styles.detail}>👤 Customer No: {item.CustNo}</Text>
//             <Text style={styles.detail}>🎁 ItemNo: {item.ItemNo}</Text>
//             <Text style={styles.detail}>📈 Quantity: {item.Qty}</Text>
//             <Text style={styles.detail}>💰 Price: {item.Price ? item.Price.toFixed(2) : 'N/A'} Baht</Text>
//             {item.URL_FILE ? (
//               <Image
//                 source={{ uri: item.URL_FILE }}
//                 style={styles.image}
//                 resizeMode="contain"
//               />
//             ) : null}
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   center: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: 16,
//     color: '#6200ea',
//     fontWeight: 'bold',
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   filterContainer: {
//     padding: 10,
//     backgroundColor: '#fff',
//     margin: 10,
//     borderRadius: 10,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   input: {
//     height: 40,
//     borderColor: '#6200ea',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//     fontSize: 16,
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 20,
//     marginVertical: 10,
//     marginHorizontal: 20,
//     borderRadius: 15,
//     elevation: 5,
//     shadowColor: '#000',
//     shadowOpacity: 0.2,
//     shadowRadius: 8,
//     shadowOffset: { width: 0, height: 2 },
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 8,
//   },
//   detail: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 4,
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     marginTop: 15,
//     borderRadius: 10,
//   },
// });


//============================================================== 2
/* import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TextInput } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Fetch sales data from API
const fetchSalesData = async () => {
  const response = await axios.get('http://192.168.3.7:4000/sales-erp');
  console.log("Fetched Data:", response.data);
  return response.data;
}; 

export default function App() {
  const [orderNo, setOrderNo] = useState('');
  const [custNo, setCustNo] = useState('');
  const [date, setDate] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['salesData'],
    queryFn: fetchSalesData
  });
  
  console.log("Fetched Data:", data);
  console.log("Error:", error);

  const filteredData = Array.isArray(data) ? data.filter(item => {
    const matchesOrderNo = orderNo ? item.DONo.includes(orderNo) : true;
    const matchesCustNo = custNo ? item.CustNo.includes(custNo) : true;
    const matchesDate = date ? new Date(item.DPDate).toLocaleDateString().includes(date) : true;
    return matchesOrderNo && matchesCustNo && matchesDate;
  }) : [];

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6200ea" />
        <Text style={styles.loadingText}>🔍⏳ Loading sales data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>⚠️ Error loading data: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="🔍 Filter by Order No"
          value={orderNo}
          onChangeText={setOrderNo}
        />
        <TextInput
          style={styles.input}
          placeholder="🔍 Filter by Customer No"
          value={custNo}
          onChangeText={setCustNo}
        />
        <TextInput
          style={styles.input}
          placeholder="🔍 Filter by Date (MM/DD/YYYY)"
          value={date}
          onChangeText={setDate}
        />
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>📦 Order No: {item.DONo}</Text> 
            <Text style={styles.title}>📦 Order No: {item.SPONo}</Text> 
            <Text style={styles.detail}>📅 Date: {new Date(item.DPDate).toLocaleDateString()}</Text>
            <Text style={styles.detail}>👤 Customer No: {item.CustNo}</Text>
            <Text style={styles.detail}>🎁 ItemNo: {item.ItemNo}</Text>
            <Text style={styles.detail}>📈 Quantity: {item.Qty}</Text>
            <Text style={styles.detail}>💰 Price: {item.Price.toFixed(2)} Baht</Text>
            <Image
              source={{ uri: item.URL_FILE }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#6200ea',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  filterContainer: {
    padding: 10,
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    height: 40,
    borderColor: '#6200ea',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 15,
    borderRadius: 10,
  },
});
function getProductService() {
  throw new Error('Function not implemented.');
}

 */