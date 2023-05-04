import { StyleSheet, Text, View } from "react-native"
import InputForm from "./InputForm";
import { Checkbox, Button } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./Onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700'
    },
    checkboxLabel: {
        textAlign: 'left',
        fontSize: 14
    },
    inputForm: {
        marginVertical: 12
    },
    buttonSaveContainer: {
        flexDirection: 'row',
        marginVertical: 20,
        justifyContent: 'space-around'
    }
});

export default ProfileScreen = () => {
    const { signOut } = useContext(AuthContext);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const getProfile = async () => {
        let name = await AsyncStorage.getItem('name');
        console.log(name);
        let splitName = name.split(' ');
        console.log(splitName);
        setFirstName(name.split(' ').slice(0, 1).join(' '));
        setLastName(name.split(' ').slice(0, -1).join(' '));
        let email = await AsyncStorage.getItem('email');
        setEmail(email);
        let phoneNumber = await AsyncStorage.getItem('phone');
        setPhone(phoneNumber);
    }
    useEffect(getProfile, []);
    return <View style={styles.container}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <InputForm title={"First name"} style={styles.inputForm} text={firstName} onChangeText={setFirstName}/>
        <InputForm title={"Last name"} style={styles.inputForm} text={lastName} onChangeText={setLastName}/>
        <InputForm title={"Email"} style={styles.inputForm} text={email} onChangeText={setEmail}/>
        <InputForm title={"Phone number"} style={styles.inputForm} text={phone} onChangeText={setPhone}/>
        <Text style={styles.sectionTitle}>Email notifications</Text>
        <Checkbox.Item 
            status="checked" 
            mode="android" 
            position="leading" 
            label="Order statuses" 
            labelStyle={styles.checkboxLabel}
            color="rgb(64, 84, 77)"
        />
        <Checkbox.Item 
            status="checked" 
            mode="android" 
            position="leading" 
            label="Password changes" 
            labelStyle={styles.checkboxLabel}
            color="rgb(64, 84, 77)"
        />
        <Checkbox.Item 
            status="checked" 
            mode="android" 
            position="leading" 
            label="Special offers" 
            labelStyle={styles.checkboxLabel}
            color="rgb(64, 84, 77)"
        />
        <Checkbox.Item 
            status="checked" 
            mode="android" 
            position="leading" 
            label="Newsletter" 
            labelStyle={styles.checkboxLabel}
            color="rgb(64, 84, 77)"
        />
        <Button 
            buttonColor="rgb(243, 199, 61)" 
            textColor="rgb(0, 0, 0)" 
            mode="text" 
            onPress={() => {
                signOut();
            }}>
            Log out
        </Button>
        <View style={styles.buttonSaveContainer}>
            <Button mode="outlined" onPress={getProfile}>
                Discard changes
            </Button>
            <Button mode="elevated" buttonColor="rgb(64, 84, 77)" textColor="white" onPress={() => {
                // AsyncStorage.setItem('name', `${firstName} ${lastName}`);
                // AsyncStorage.setItem('email', email);
                // AsyncStorage.setItem('phone', phone);
                AsyncStorage.multiSet([
                    ['name', `${firstName ?? ""} ${lastName ?? ""}`],
                    ['email', email ?? ""],
                    ['phone', phone ?? ""]
                ])
            }}>
                Save changes
            </Button>
        </View>
    </View>
}