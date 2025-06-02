import {
    Clock,
    Droplets,
    Pencil,
    Play,
    Sun,
    Thermometer,
    Wind
} from "lucide-react-native";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
interface PlantData {
  name: string;
  image: string;
  humidity: {
    min: string;
    max: string;
  };
  airHumidity: {
    min: string;
    max: string;
  };
  brightness: string;
  temperature: {
    min: string;
    max: string;
  };
}

const Plantcard = ({openModalProgramare, openSettingsModal}:{openModalProgramare:() => void, openSettingsModal:()=>void}) => {
  const [plantData, setPlantData] = useState<PlantData>({
    name: "Monstera Deliciosa",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=800",
    humidity: { min: "60", max: "80" },
    airHumidity: { min: "40", max: "60" },
    brightness: "800",
    temperature: { min: "20", max: "25" },
  });
  return (
    <View style={styles.plantCard}>
      <Image source={{ uri: plantData.image }} style={styles.plantImage} />

      <View style={styles.contentContainer}>
        <Text style={styles.plantName}>{plantData.name}</Text>

        <View style={styles.parameterList}>
          <View style={styles.parameter}>
            <Droplets size={20} color="#4A90E2" />
            <Text style={styles.parameterText}>
              {plantData.humidity.min}%-{plantData.humidity.max}% : -%
            </Text>
          </View>

          <View style={styles.parameter}>
            <Wind size={20} color="#4A90E2" />
            <Text style={styles.parameterText}>
              {plantData.airHumidity.min}%-{plantData.airHumidity.max}% : -%
            </Text>
          </View>

          <View style={styles.parameter}>
            <Sun size={20} color="#FFB800" />
            <Text style={styles.parameterText}>
              {plantData.brightness} Lum : - Lum
            </Text>
          </View>

          <View style={styles.parameter}>
            <Thermometer size={20} color="red" />
            <Text style={styles.parameterText}>
              {plantData.temperature.min}°C-{plantData.temperature.max}°C : - °C
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={openModalProgramare} style={styles.editButton}>
            <Clock size={20} color="#4A90E2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={openSettingsModal} style={styles.editButton}>
            <Pencil size={20} color="#4A90E2" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playButton}>
            <Play size={20} color="#34C759" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Plantcard;

const styles = StyleSheet.create({
  plantCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  plantImage: {
    width: "100%",
    height: 200,
    borderRadius: 15,
    marginBottom: 15,
  },
  contentContainer: {
    position: "relative",
  },
  plantName: {
    fontFamily: "Quicksand-Bold",
    fontSize: 22,
    color: "#67AE6E",
    marginBottom: 15,
  },
  parameterList: {
    gap: 10,
    marginBottom: 40,
  },
  parameter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  parameterText: {
    fontFamily: "Quicksand-Regular",
    fontSize: 16,
    color: "#666",
  },
  buttonContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    padding: 8,
  },
  playButton: {
    padding: 8,
  },
});
