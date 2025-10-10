import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React from 'react'

type Props = {
    size: "small" | "large";
    color: string
};

const Loader = ({size,color}: Props) => {
  return (
    <View>
        <ActivityIndicator size={size} color={color} />
    </View>
  )
}

export default Loader

const styles = StyleSheet.create({})