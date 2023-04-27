import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import InputForm from "./InputForm"
import { createContext, useContext, useState } from "react";
import PrimaryButton from "./PrimaryButton";

const styles = StyleSheet.create({
    nameForm: {
        margin: 12
    },
    emailForm: {
        margin: 12
    },
    heroView: {
        padding: 12,
        backgroundColor: 'rgb(64, 84, 77)',
    },
    heroViewContent: {
        flexDirection: 'row'
    },
    heroViewHeading: {
        flex: 1,
        marginRight: 12
    },
    heroViewImage: {
        width: 120, height: 120,
        borderRadius: 20
    },
    heroViewHeadingName: {
        fontSize: 45,
        fontFamily: 'MarkaziText',
        color: 'rgb(243, 199, 61)', 
    },
    heroViewSubHeading: {
        fontFamily: 'MarkaziText',
        color: 'white',
        fontSize: 30,
        marginBottom: 12
    },
    heroViewAbout: {
        fontFamily: 'Karla',
        color: 'white',
        fontSize: 18
    },
    buttonNextContainer: {
        marginHorizontal: 12,
        marginTop: 30
    }
});

export const AuthContext = createContext();

export default OnboardingScreen = (props) => {
    const { signIn } = useContext(AuthContext);
    let [name, setName] = useState("");
    let [email, setEmail] = useState("");

    return <View>
        <View style={styles.heroView}>
            <Text style={styles.heroViewHeadingName}>Little Lemon</Text>
            <View style={styles.heroViewContent}>
                <View style={styles.heroViewHeading}>
                    <Text style={styles.heroViewSubHeading}>Chicago</Text>
                    <Text style={styles.heroViewAbout}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
                </View>
                <Image source={require('../assets/Hero_image.png')} style={styles.heroViewImage}/>
            </View>
        </View>
        <InputForm title={'Name *'} style={styles.nameForm} onChangeText={setName} text={name}/>
        <InputForm title={'Email *'} style={styles.emailForm} onChangeText={setEmail} text={email}/>
        {
            name !== "" && email !== "" && <View style={styles.buttonNextContainer}>
                <PrimaryButton text={"Next"} onPress={() => {
                    console.log('name', name, 'email', email);
                    signIn(name, email);
                }}/>
            </View>
        }
    </View>
}