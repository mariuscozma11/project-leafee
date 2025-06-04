import { FAB } from "@rneui/themed";
import { useFonts } from "expo-font";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Addplantmodal from "../components/Addplantmodal";
import Listaplante from "../components/Listaplante";

export default function AboutScreen() {
  const [fontsLoaded] = useFonts({
    "Quicksand-Regular": require("../../assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-Bold": require("../../assets/fonts/Quicksand-Bold.ttf"),
  });
  const [libraryModal, setLibraryModal] = useState(false);
  const [refresh, setRefresh] = useState(true);

  const handleCloseLibraryModal = () => {
    setLibraryModal(false);
    setRefresh(r => !r);
  };

  if (!fontsLoaded) return null;
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>leafee</Text>
      <Listaplante
      refresh={refresh}
      />
      <Addplantmodal
        libraryModal={libraryModal}
        closeLibraryModal={handleCloseLibraryModal}
      />
      <FAB
        visible={true}
        size="large"
        icon={{ name: "add", color: "white" }}
        color="green"
        placement="right"
        onPress={() => setLibraryModal(true)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  header: {
    fontFamily: "Quicksand-Bold",
    fontSize: 56,
    color: "#67AE6E",
    marginBottom: 5,
    fontWeight: "600",
  },
});
