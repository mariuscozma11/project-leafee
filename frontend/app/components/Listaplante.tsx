import { Droplets, Sun, Thermometer, Trash, Wind } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Listaplante = ({ refresh }: { refresh: boolean }) => {
  const deletePlanta = async (id: string | number) => {
    try {
      const deletePlanta = await fetch(
        `http://192.168.1.128:5000/api/plante/${id}`,
        {
          method: "DELETE",
        }
      );
      getPlante();
    } catch (err) {
      console.error(err);
    }
  };

  type Planta = {
    plante_id: string | number;
    nume: string;
    imagine: string;
    umiditate_sol: { min: string; max: string };
    umiditate_aer: { min: string; max: string };
    luminozitate: { min: string; max: string };
    temperatura: { min: string; max: string };
  };

  const [plante, setPlante] = useState<Planta[]>([]);

  const getPlante = async () => {
    try {
      const response = await fetch("http://192.168.1.128:5000/api/plante");
      const jsonData = await response.json();
      setPlante(jsonData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPlante();
  }, [refresh]);

  return (
    <ScrollView style={styles.container}>
      {plante.map((planta) => (
        <View style={styles.programareRow} key={planta.plante_id}>
          <Image style={styles.image} source={{ uri: planta.imagine }} />
          <View style={styles.textBox}>
            <Text style={styles.plantName}>{planta.nume}</Text>
            <View style={styles.parameterList}>
              <View style={styles.parameter}>
                <Droplets size={20} color="#4A90E2" />
                <Text style={styles.parameterText}>
                  {planta.umiditate_sol.min}% - {planta.umiditate_sol.max}%
                </Text>
              </View>
              <View style={styles.parameter}>
                <Wind size={20} color="#4A90E2" />
                <Text style={styles.parameterText}>
                  {planta.umiditate_aer.min}% - {planta.umiditate_aer.max}%
                </Text>
              </View>
              <View style={styles.parameter}>
                <Sun size={20} color="#FFB800" />
                <Text style={styles.parameterText}>
                  {planta.luminozitate.min} - {planta.luminozitate.max} lux
                </Text>
              </View>
              <View style={styles.parameter}>
                <Thermometer size={20} color="red" />
                <Text style={styles.parameterText}>
                  {planta.temperatura.min}°C - {planta.temperatura.max}°C
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deletePlanta(planta.plante_id)}
          >
            <Trash size={22} color={"white"} />
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

export default Listaplante;

const styles = StyleSheet.create({
  parameterList: {
    
  },
  plantParams: {
    fontFamily: "Quicksand",
    marginBottom: 5,
  },
  plantName: {
    fontFamily: "Quicksand-bold",
    marginBottom: 5,
    fontSize: 18,
  },
  textBox: {
    flex: 1,
    justifyContent: "flex-start",
    alignContent: "flex-start",
    height: "100%",
    paddingLeft: 10,
  },
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 11,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 22,
    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  programareRow: {
    maxHeight: 200,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    elevation: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  parameter: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  parameterText: {
    fontFamily: "Quicksand",
    marginLeft: 5,
  },
});
