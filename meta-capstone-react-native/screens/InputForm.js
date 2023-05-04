import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native"

const styles = StyleSheet.create({
    input: {
      height: 40,
      borderWidth: 1,
      padding: 10,
      borderColor: 'rgb(191, 192, 203)',
      borderRadius: 8
    },
    title: {
        marginBottom: 4,
        color: 'rgb(138, 138, 138)',
        fontSize: 14,
        fontWeight: '600'
    },
    container: {
    }
  });

export default InputForm = ({ title, style, onChangeText, text }) => {
    let [name, onChangeName] = useState("");
    return <View style={[styles.container, style]}>
        <Text style={styles.title}>{title}</Text>
        <TextInput value={text} onChangeText={onChangeText} style={styles.input}/>
    </View>
}