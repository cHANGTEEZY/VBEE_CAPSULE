import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { CameraView, CameraType,  } from 'expo-camera'
import { router, useLocalSearchParams } from 'expo-router'
import Ionicons from "@expo/vector-icons/Ionicons"

const Camera = () => {
  const params = useLocalSearchParams<{ returnTo?: string }>();
  const [facing, setFacing] = React.useState<CameraType>("back");
  const [flashEnabled, setFlashEnabled] = React.useState(false);

  const cameraRef= React.useRef<CameraView | null>(null)

  const handleCapture = async () => {
    if(cameraRef.current){
        const photo = await cameraRef.current.takePictureAsync()
        
        if(photo && photo.uri) {
          const returnRoute = params.returnTo;
          
          router.replace({
            pathname: returnRoute as any,
            params: { photoUri: photo.uri }
          })
        }
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === "back" ? "front" : "back"));
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} flash={flashEnabled ? "on" : "off"} ref={cameraRef}>
        <View style={styles.bottomCameraControls}>
          <Pressable style={styles.closeButton} onPress={()=> setFlashEnabled(!flashEnabled)}>
            <Ionicons name={flashEnabled ? "flash" : "flash-off-outline"} size={20} color={"white"} />
          </Pressable>
          <Pressable style={styles.captureButton} onPress={handleCapture}>
            <View style={styles.captureButtonInner} />
          </Pressable>
          <Pressable style={styles.flipButton} onPress={toggleCameraFacing}>
            <Ionicons name='camera-reverse' size={20} color={"white"} />
          </Pressable>
        </View>
      </CameraView>
    </View>
  )
}

export default Camera

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  topCameraControls: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },

  bottomCameraControls: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 20,
    paddingBottom: 40,
  },
  closeButton: {
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
  },
  flipButton: {
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "#000",
  },
})