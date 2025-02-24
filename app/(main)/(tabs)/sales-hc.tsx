import React, { useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getSalesOrderHCService } from "@/services/sales-service";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useEffect } from 'react';
import { DrawerActions } from '@react-navigation/native';

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

  
const SalesHCScreen: React.FC = () => {
  
const navigation = useNavigation(); //  แฮมเบอร์กอร์
useEffect(()=> {
  navigation.setOptions({
    title: '💰 Sales Order',headerShown:true,
    headerLeft:() => ( <MaterialIcons.Button name= "menu" backgroundColor ="#3399FF" onPress={ ()=>{navigation.dispatch(DrawerActions.openDrawer())} } />),
    headerStyle : { backgroundColor : "#3399FF"},
    headerTintColor : 'white',
    headerTitleStyle : {fontWeight :'bold'}
  });
},[navigation]
);

const [viewType, setViewType] = useState<"table" | "card" | "grid">("table");

  const { data: sales, isLoading } = useQuery({
    queryKey: ["salesDataHC"],
    queryFn: async () => {
      const response = await getSalesOrderHCService();
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={sales}
      key={viewType}
      keyExtractor={(item) => item.SALESID}
      numColumns={viewType === "grid" ? 2 : 1}
      ListHeaderComponent={
        <View>
          {/* <Text style={styles.title}>💰 Sales Order</Text> */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => setViewType("table")} style={styles.button}>
              <Text style={styles.buttonText}>Table View</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewType("card")} style={styles.button}>
              <Text style={styles.buttonText}>Card View</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setViewType("grid")} style={styles.button}>
              <Text style={styles.buttonText}>Grid View</Text>
            </TouchableOpacity>
          </View>

          {viewType === "table" && (
            <View style={styles.rowHeader}>
              <Text style={styles.cellHeader}>Sales ID</Text>
              <Text style={styles.cellHeader}>DP No</Text>
              <Text style={styles.cellHeader}>Customer</Text>
              <Text style={styles.cellHeader}>Name</Text>
              <Text style={styles.cellHeader}>Item</Text>
              <Text style={styles.cellHeader}>Price</Text>
              <Text style={styles.cellHeader}>Qty</Text>
              <Text style={styles.cellHeader}>Text</Text>
            </View>
          )}
        </View>
      }
      renderItem={({ item }) =>
        viewType === "table" ? (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.SALESID}</Text>
            <Text style={styles.cell}>{item.TPI_DP_NO}</Text>
            <Text style={styles.cell}>{item.CUSTACCOUNT}</Text>
            <Text style={styles.cell}>{item.CUSTNAME}</Text>
            <Text style={styles.cell}>{item.ITEMNAME}</Text>
            <Text style={styles.cell}>{item.SALESPRICE}</Text>
            <Text style={styles.cell}>{item.SALESQTY}</Text>
            <Text style={styles.cell}>{item.TPI_TXT}</Text>
          </View>
        ) : (
          <View style={[styles.card, viewType === "grid" ? styles.gridItem : null]}>
            <Text style={styles.cardTitle}>{item.ITEMNAME}</Text>
            <Text style={styles.cardDetail}>Sales ID: {item.SALESID}</Text>
            <Text style={styles.cardDetail}>Customer: {item.CUSTNAME}</Text>
            <Text style={styles.cardDetail}>Price: ${item.SALESPRICE}</Text>
            <Text style={styles.cardDetail}>Quantity: {item.SALESQTY}</Text>
            <Text style={styles.cardDetail}>Date: {formatDate(item.TPI_DPBUSDATE)}</Text>
          </View>
        )
      }
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f0f4f8" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "#222" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
  buttonContainer: { flexDirection: "row", justifyContent: "space-around", marginBottom: 15 },
  button: { backgroundColor: "#007bff", padding: 12, borderRadius: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  row: { flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#ddd", padding: 12, backgroundColor: "#fff", borderRadius: 8, marginVertical: 4 },
  cell: { flex: 1, textAlign: "center", color: "#333", fontSize: 14 },
  card: { backgroundColor: "#fff", padding: 18, marginVertical: 6, borderRadius: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 6 },
  cardTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8, color: "#007bff" },
  cardDetail: { fontSize: 14, color: "#555", marginBottom: 4 },
  cellHeader: { flex: 1, fontWeight: "bold", color: "#fff", textAlign: "center" },
  rowHeader: { flexDirection: "row", backgroundColor: "#007bff", padding: 10 },
  gridItem: { 
    flex: 1, 
    margin: 8,
    padding: 12, 
    backgroundColor: "#fff", 
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});

export default SalesHCScreen;
