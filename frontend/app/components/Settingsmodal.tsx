import React, { useEffect } from "react";
import {
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
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

const Settingsmodal = ({
  settingsModal,
  closeSettingsModal,
}: {
  settingsModal: boolean;
  closeSettingsModal: () => void;
}) => {
 
  const handleSave = async () => {
    
  };


  //LOGICA ANIMATIE DESCHIDERE MODAL
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const overlayOpacity = useSharedValue(0);

  useEffect(() => {
    if (settingsModal) {
      // Open animation
      overlayOpacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 50 });
    }
  }, [overlayOpacity, settingsModal, translateY]);
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
        if (settingsModal) {
          runOnJS(closeSettingsModal)();
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
    closeSettingsModal();
  };
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={settingsModal}
      onRequestClose={closeSettingsModal}
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

export default Settingsmodal;
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
