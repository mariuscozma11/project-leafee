import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

//VARIABILE PENTRU ANIMATIE

const SCREEN_HEIGHT = Dimensions.get("window").height;
const THRESHOLD = 50;

//PROP-URI

interface MarkedDates {
  [key: string]: { selected: boolean; selectedColor: string };
}

interface ScheduleItem {
  date: string;
  hour: number;
  minute: number;
  duration: number;
}

const Programare = ({
  programModal,
  closeProgramModal,
}: {
  programModal: boolean;
  closeProgramModal: () => void;
}) => {
  //LOGICA TRIMITERE DATE CALENDAR
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [hour, setHour] = useState<string>("");
  const [minute, setMinute] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const selectedDates = useMemo(() => {
    return Object.keys(markedDates);
  }, [markedDates]);

  const generateSchedule = () => {
    if (!hour || !minute || !duration || selectedDates.length === 0) {
      alert("Please fill all fields and select at least one date");
      return;
    }

    const schedule: ScheduleItem[] = selectedDates.map((date) => ({
      date,
      hour: parseInt(hour),
      minute: parseInt(minute),
      duration: parseInt(duration),
    }));
    handleCancel();
    setMarkedDates({});
    return schedule;
  };

  const handleSave = async () => {
    const schedule = generateSchedule();
    if (!schedule) return; // dacă lipsește ceva, se oprește

    try {
      console.log("Programări trimise:", schedule);
      const response = await fetch("http://192.168.1.128:5000/api/programari", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schedule),
      });

      const data = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const onDayPress = (day: { dateString: string }) => {
    const updatedMarkedDates = { ...markedDates };

    if (updatedMarkedDates[day.dateString]) {
      delete updatedMarkedDates[day.dateString];
    } else {
      updatedMarkedDates[day.dateString] = {
        selected: true,
        selectedColor: "#8DD8FF",
      };
    }

    setMarkedDates(updatedMarkedDates);
  };

  //LOGICA ANIMATIE DESCHIDERE MODAL
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (programModal) {
      // Open animation
      overlayOpacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 50 });
    }
  }, [overlayOpacity, programModal, translateY]);
  const context = useSharedValue({ y: 0 });
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate((event) => {
      translateY.value = event.translationY + context.value.y;
      translateY.value = Math.max(0, translateY.value);

      // Update overlay opacity based on drag
      const dragProgress = Math.min(translateY.value / SCREEN_HEIGHT, 1);
      overlayOpacity.value = 1 - dragProgress;
    })
    .onEnd(() => {
      if (translateY.value > THRESHOLD) {
        translateY.value = withSpring(SCREEN_HEIGHT, { damping: 50 });
        overlayOpacity.value = withTiming(0, { duration: 200 });
        if (programModal) {
          runOnJS(closeProgramModal)();
        }
      } else {
        translateY.value = withSpring(0);
        overlayOpacity.value = withTiming(1, { duration: 200 });
      }
    });

  const rModalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const rOverlayStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      opacity: overlayOpacity.value,
    };
  });
  const resetAnimation = () => {
    translateY.value = SCREEN_HEIGHT;
    overlayOpacity.value = 0;
  };
  const handleCancel = () => {
    resetAnimation();
    closeProgramModal();
  };
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={programModal}
      onRequestClose={closeProgramModal}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalContainer}>
              <Animated.View style={[styles.modalOverlay, rOverlayStyle]} />
              <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.modalContent, rModalStyle]}>
                  <View style={styles.modalHandle} />
                  <ScrollView bounces={false}>
                    <View style={styles.modalContainer}>
                      <View style={styles.calendarBox}>
                        <Calendar
                          onDayPress={onDayPress}
                          markedDates={markedDates}
                        />
                        <View style={styles.programControls}>
                          <View>
                            <Text style={styles.inputLabel}>Select Time</Text>
                            <View style={styles.timeInputs}>
                              <TextInput
                                style={styles.rangeInput}
                                placeholder="HH"
                                keyboardType="numeric"
                                maxLength={2}
                                onChangeText={setHour}
                                placeholderTextColor={"grey"}
                              />
                              <Text>:</Text>
                              <TextInput
                                style={styles.rangeInput}
                                placeholder="MM"
                                keyboardType="numeric"
                                maxLength={2}
                                onChangeText={setMinute}
                                placeholderTextColor={"grey"}
                              />
                            </View>
                          </View>
                          <View>
                            <Text style={styles.inputLabel}>Duration</Text>
                            <View>
                              <TextInput
                                style={styles.rangeInput}
                                placeholder="SS"
                                keyboardType="numeric"
                                maxLength={2}
                                onChangeText={setDuration}
                                placeholderTextColor={"grey"}
                              />
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={handleCancel}
                      >
                        <Text style={styles.cancelButtonText}>Renuntare</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.saveButton}
                        onPress={() => {
                          handleSave();
                        }}
                      >
                        <Text style={styles.saveButtonText}>Salvare</Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                </Animated.View>
              </GestureDetector>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default Programare;
const styles = StyleSheet.create({
  programControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    marginTop: 20,
  },
  timeInputs: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 5,
  },
  calendarBox: {
    flex: 1,
    width: "80%",
    margin: "auto",
    marginBottom: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: "90%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  inputLabel: {
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  rangeInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    width: 80,
    textAlign: "center",
    fontFamily: "Quicksand-Regular",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 20,
    marginBottom: 30,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#67AE6E",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontFamily: "Quicksand-Bold",
    fontSize: 16,
  },
});
