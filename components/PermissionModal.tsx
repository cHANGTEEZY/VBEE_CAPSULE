import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const PermissionModal = () => {
    const [showModal,setShowModal]= React.useState(false);

  return (
    <Modal animationType="slide" onDismiss={()=> setShowModal(false)} visible={showModal}>
      <View>
        <Text></Text>
        <TouchableOpacity>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default PermissionModal

const styles = StyleSheet.create({})