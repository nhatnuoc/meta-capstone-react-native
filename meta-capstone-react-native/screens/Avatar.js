import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Avatar } from "react-native-paper";

const styles = StyleSheet.create({
    avatarText: {
        backgroundColor: 'rgb(85, 212, 188)'
    },
});

export default UserAvatar = ({ style, size }) => {
    const [avatarUri, setAvatarUri] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const getProfile = async () => {
        let profile = await AsyncStorage.multiGet(['avatar', 'name']);
        setAvatarUri(profile[0][1]);
        let name = profile[1][1];
        let splitName = name.split(' ');
        setFirstName(splitName.slice(0, 1).join(' '));
        setLastName(splitName.slice(1).join(' '));
    }
    useEffect(getProfile, []);
    return <View style={style}>
        {
            avatarUri !== undefined && avatarUri !== "" ?
            <Avatar.Image source={{uri: avatarUri}} style={style}/>
            :
            <Avatar.Text 
                label={`${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`} 
                color="white" 
                style={styles.avatarText}
                size={size}
            />
        }
    </View>;
}