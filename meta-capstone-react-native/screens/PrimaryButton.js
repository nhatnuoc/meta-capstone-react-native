import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'rgb(243, 199, 61)',
        borderRadius: 8,
        paddingVertical: 12,
        borderColor: 'rgb(185, 107, 58)'
    },
    text: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    }
});

export default PrimaryButton = (props) => {
    const { text, onPress } = props;
    return <TouchableOpacity onPress={onPress}>
        <View style={styles.button}>
            <Text style={styles.text}>{text}</Text>
        </View>
    </TouchableOpacity>
}