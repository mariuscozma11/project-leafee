import {
  Clock,
  Droplets,
  Pencil,
  Play,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Readings {
  umSol: string;
  umAer: string;
  lum: string;
  temp: string;
}
const Plantcard = ({
  openModalProgramare,
  openSettingsModal,
  plantData
}: {
  openModalProgramare: () => void;
  openSettingsModal: () => void;
  plantData: any
}) => {
  const [readings, setReadings] = useState<Readings>({
    umSol: "-",
    umAer: "-",
    lum: "-",
    temp: "-",
  });
  
  const ws = useRef<WebSocket | null>(null); 
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      console.log("Connection Established!");
    };
    ws.onmessage = (event) => {
      const response = JSON.parse(event.data);
      const soilValue = Math.round(
        ((4095 - response.soil) / (4095 - 100)) * 100
      ).toString();

      console.log(response);
      setReadings({
        umSol: soilValue,
        umAer: response.hum,
        lum: response.lux,
        temp: response.temp,
      });
    };
    ws.onclose = () => {
      console.log("Connection Closed!");
      setReadings({
        umSol: "-",
        umAer: "-",
        lum: "-",
        temp: "-",
      });
    };

    ws.onerror = () => {
      console.log("WS Error");
    };

 

    return () => {
      ws.close();
    };
  }, []);
  const sendPump = (state:string) => {
  if (ws.current && ws.current.readyState === 1) {
    ws.current.send(state);
  }
};
     
  return (
    <View style={styles.plantCard}>
      <Image source={{ uri: plantData.image }} style={styles.plantImage} />

      <View style={styles.contentContainer}>
        <Text style={styles.plantName}>{plantData.name}</Text>

        <View style={styles.parameterList}>
          <View style={styles.parameter}>
            <Droplets size={20} color="#4A90E2" />
            <Text style={styles.parameterText}>
              {plantData.humidity.min}%-{plantData.humidity.max}% :{" "}
              {readings.umSol}%
            </Text>
          </View>

          <View style={styles.parameter}>
            <Wind size={20} color="#4A90E2" />
            <Text style={styles.parameterText}>
              {plantData.airHumidity.min}%-{plantData.airHumidity.max}% :{" "}
              {readings.umAer}%
            </Text>
          </View>

          <View style={styles.parameter}>
            <Sun size={20} color="#FFB800" />
            <Text style={styles.parameterText}>
              {plantData.brightness.min}-{plantData.brightness.max} Lum :{" "}
              {readings.lum} Lum
            </Text>
          </View>

          <View style={styles.parameter}>
            <Thermometer size={20} color="red" />
            <Text style={styles.parameterText}>
              {plantData.temperature.min}°C-{plantData.temperature.max}°C :{" "}
              {readings.temp} °C
            </Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={openModalProgramare}
            style={styles.editButton}
          >
            <Clock size={20} color="#4A90E2" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={openSettingsModal}
            style={styles.editButton}
          >
            <Pencil size={20} color="#4A90E2" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playButton}  onPressIn={()=>{sendPump("1")}}
              onPressOut={()=>{sendPump("0")}}>
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
