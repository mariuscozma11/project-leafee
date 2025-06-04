import { useFonts } from "expo-font";
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ListaProgramari from "../components/ListaProgramari";
import Plantcard from "../components/Plantcard";
import Programare from "../components/Programare";
import Settingsmodal from "../components/Settingsmodal";
export default function Index() {
  const [fontsLoaded] = useFonts({
    "Quicksand-Regular": require("../../assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-Bold": require("../../assets/fonts/Quicksand-Bold.ttf"),
  });
  const [modalProgramare, setModalProgramare] = useState(false);
  const openModalProgramare = () => setModalProgramare(true);
  const closeModalProgramare = () => setModalProgramare(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const openSettingsModal = () => setSettingsModal(true);
  const closeSettingsModal = () => setSettingsModal(false);
  const [plantData, setPlantData] = useState({
    name: "Monstera Deliciosa",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
    humidity: { min: "60", max: "80" },
    airHumidity: { min: "40", max: "60" },
    brightness: { min: "800", max: "1000" },
    temperature: { min: "20", max: "25" },
  });
  const updatePlantData = (newData: any) => {
    setPlantData(newData);
  };

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>leafee</Text>

      <Plantcard
        plantData={plantData}
        openModalProgramare={openModalProgramare}
        openSettingsModal={openSettingsModal}
      />
      <ListaProgramari />
      <Programare
        programModal={modalProgramare}
        closeProgramModal={closeModalProgramare}
      />
      <Settingsmodal
        settingsModal={settingsModal}
        closeSettingsModal={closeSettingsModal}
        plantData={plantData}
        onSave={updatePlantData}
  
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
