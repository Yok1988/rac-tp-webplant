import React, { useState } from 'react';
import { View, Text, FlatList, Image, Alert, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getSalesService } from '@/services/sales-service';
import * as FileSystem from 'expo-file-system';
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

  const saveSelectedImagesAsZip = async () => {
    if (selectedImages.length === 0) {
      Alert.alert('No selection', 'Please select at least one image.');
      return;
    }

    try {
      const zipFolder = FileSystem.documentDirectory + 'selected_images/';
      await FileSystem.deleteAsync(zipFolder, { idempotent: true }); // ลบโฟลเดอร์เก่าก่อนสร้างใหม่
      await FileSystem.makeDirectoryAsync(zipFolder, { intermediates: true });

      const downloadedFiles = [];
      for (const imageUrl of selectedImages) {
        const fileName = imageUrl.split('/').pop();
        if (!fileName) continue;

        const fileUri = zipFolder + fileName;
        const downloadedFile = await FileSystem.downloadAsync(imageUrl, fileUri);

        if (downloadedFile.status === 200) {
          downloadedFiles.push(fileUri);
        }
      }

      if (downloadedFiles.length === 0) {
        Alert.alert('Error', 'No files were downloaded successfully.');
        return;
      }

      const zipFilePath = FileSystem.documentDirectory + 'selected_images.zip';
      await FileSystem.deleteAsync(zipFilePath, { idempotent: true }); // ลบ ZIP ไฟล์เก่าก่อนสร้างใหม่
      await zip(zipFolder, zipFilePath);

      const fileInfo = await FileSystem.getInfoAsync(zipFilePath);
      if (fileInfo.exists) {
        await Sharing.shareAsync(zipFilePath);
      } else {
        Alert.alert('Error', 'Failed to create ZIP file.');
      }
    } catch (error) {
      console.error('Error creating ZIP:', error);
      Alert.alert('Error', 'Failed to create ZIP file.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="🔍 Filter by Order No (DONo)" value={searchDONo} onChangeText={setSearchDONo} />
      <TextInput style={styles.input} placeholder="📅 Filter by Date (DD/MM/YYYY)" value={searchDPDate} onChangeText={setSearchDPDate} />
      <TextInput style={styles.input} placeholder="👤 Filter by Customer No (CustNo)" value={searchCustNo} onChangeText={setSearchCustNo} />

      <View style={styles.selectAllContainer}>
        <Checkbox value={selectAll} onValueChange={toggleSelectAll} color={selectAll ? '#6200ea' : undefined} />
        <Text style={styles.selectAllText}>Select All</Text>
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.DONo}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Checkbox
              value={selectedImages.includes(item.URL_FILE)}
              onValueChange={() => toggleSelection(item.URL_FILE)}
            />
            <Text>📦 Order No: {item.DONo}</Text>
            <Text>📅 Date: {new Date(item.DPDate).toLocaleDateString()}</Text>
            <Text>👤 Customer No: {item.CustNo}</Text>
            {item.URL_FILE && <Image source={{ uri: item.URL_FILE }} style={styles.image} resizeMode="contain" />}
          </View>
        )}
      />

      {selectedImages.length > 0 && (
        <TouchableOpacity style={styles.saveButton} onPress={saveSelectedImagesAsZip}>
          <Text style={styles.saveButtonText}>📦 Save as Zip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 10 },
  input: { backgroundColor: '#fff', padding: 10, marginVertical: 5, borderRadius: 8, fontSize: 16 },
  card: { backgroundColor: '#fff', padding: 15, marginVertical: 5, borderRadius: 8 },
  image: { width: '100%', height: 200, marginTop: 10, borderRadius: 10 },
  saveButton: { backgroundColor: '#6200ea', padding: 15, borderRadius: 10, margin: 10, alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  selectAllContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  selectAllText: { fontSize: 16, marginLeft: 10, color: '#333' }
});



