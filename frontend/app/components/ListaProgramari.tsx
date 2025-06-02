import { Calendar, Hourglass, Trash } from "lucide-react-native";
import React, { Fragment, useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Programare = {
  programari_id: string | number;
  date: string;
  hour: string;
  minute: string;
  duration: string;
};

const ListaProgramari = () => {
  const [programari, setProgramari] = useState<Programare[]>([]);
  const deleteProgramare = async (id:string | number) => {
    try {
      const deleteProgramare = await fetch(`http://192.168.1.128:5000/api/programari/${id}`,{
        method: "DELETE",

      });
      console.log(deleteProgramare);
      getProgramari();
    } catch (err) {
      console.error(err);
    }
  };
  const getProgramari = async () => {
    try {
      const response = await fetch("http://192.168.1.128:5000/api/programari");
      const jsonData = await response.json();
      setProgramari(jsonData);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getProgramari();
  }, [getProgramari()]);

  return (
    <Fragment>
      <Text style={{ textAlign: "center", fontWeight: "bold", color: "green", fontSize: 20, marginVertical: 10 }}>
        Programari
      </Text>
      {programari.map((programare) => (
        <View style={styles.programareRow} key={programare.programari_id}>
          <View style={styles.leftGroup}>
            <View style={styles.programareCell}>
              <Calendar size={24} color={"green"} />
              <Text style={styles.programareText}>
                {programare.date}, {programare.hour}:{programare.minute}
              </Text>
            </View>
            <View style={styles.programareCell}>
              <Hourglass size={22} color={"green"} />
              <Text style={styles.programareText}>{programare.duration}</Text>
            </View>
          </View>
          <View style={styles.rightGroup}>
            <View style={styles.programareCell}>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteProgramare(programare.programari_id)}
              >
                <Trash size={22} color={"white"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </Fragment>
  );
};

export default ListaProgramari;

const styles = StyleSheet.create({
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "green",
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
  programareText: {
    fontSize: 18,
    marginLeft: 5,
    lineHeight: 22,
  },
  programareRow: {
    maxHeight:50,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    marginTop: 5,
    marginBottom: 5,
  },
  programareCell: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
});
