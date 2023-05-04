import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, FlatList, Image, SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useUpdateEffect, getSectionListData } from "../utils/utils";
import debounce from 'lodash.debounce';
import { Searchbar } from 'react-native-paper';
import { Alert } from "react-native";
import { createTable, getMenuItems, filterByQueryAndCategories, saveMenuItems } from '../utils/database';

const styles = StyleSheet.create({
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
    filtersContainer: {
        marginVertical: 16,
      },
    filtersTitle: {
        marginLeft: 16,
        fontSize: 16,
        fontWeight: '700',
        color: '#282828'
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        flex: 1
    },
    itemInfoContainer: {
        flex: 1
    },
    itemName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    itemDescription: {
        color: '#495e56'
    },
    itemPrice: {
        color: '#4a5f58',
        fontWeight: 'bold'
    },
    itemImage: {
        width: 60,
        height: 60,
        marginLeft: 5
    },
    searchBar: {
        margin: 12
    },
    categoryItemContainer: {
        backgroundColor: '#edefee',
        padding: 10,
        borderRadius: 16
    },
    categoryItemText: {
        fontWeight: '700',
        fontSize: 17,
        color: '#495e57'
    },
    categoryContentContainer: {
        padding: 10
    }
});

const Filters = ({ onChange, selections, sections }) => {
    return (
      <View style={styles.filtersContainer}>
        <Text style={styles.filtersTitle}>ORDER FOR DELIVERY!</Text>
        <FlatList
            contentContainerStyle={styles.categoryContentContainer}
            renderItem={({ item, index }) => {
                return <TouchableOpacity onPress={() => {
                    onChange(index);
                }}>
                    <View style={styles.categoryItemContainer}>
                        <Text style={styles.categoryItemText}>{item}</Text>
                    </View>
                </TouchableOpacity>
            }}
            ItemSeparatorComponent={(<View style={{marginHorizontal: 10}}/>)}
            data={sections}
            horizontal={true}
        />
      </View>
    );
  };

const Item = ({ name, price, description, image }) => {
    
    return (
        <View style={styles.item} key={name}>
            <View style={styles.itemInfoContainer}>
                <Text style={styles.itemName} numberOfLines={1}>{name}</Text>
                <Text style={styles.itemDescription} numberOfLines={2}>{description}</Text>
                <Text style={styles.itemPrice}>$ {price}</Text>
            </View>
            <Image 
                source={{uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${image}?raw=true`}}
                style={styles.itemImage}
                />
        </View>
    );
};
const API_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json';

export default HomeScreen = () => {
    const [data, setData] = useState([]);
    const [searchBarText, setSearchBarText] = useState('');
    const [query, setQuery] = useState('');
    const [sections, setSections] = useState([]);
    const [filterSelections, setFilterSelections] = useState(
        sections.map(() => false)
    );
    const fetchData = async() => {
        // 1. Implement this function
        
        // Fetch the menu from the API_URL endpoint. You can visit the API_URL in your browser to inspect the data returned
        // The category field comes as an object with a property called "title". You just need to get the title value and set it under the key "category".
        // So the server response should be slighly transformed in this function (hint: map function) to flatten out each menu item in the array,
        let response = await fetch(API_URL);
        let json = await response.json();
        return json.menu;
    }

    useEffect(() => {
        (async () => {
            try {
                await createTable();
                let menuItems = await getMenuItems();

                // The application only fetches the menu data once from a remote URL
                // and then stores it into a SQLite database.
                // After that, every application restart loads the menu from the database
                if (!menuItems.length) {
                    menuItems = await fetchData();
                    await saveMenuItems(menuItems);
                }
                // let menuItems = await fetchData();
                let listCategory = [...new Set(menuItems.map(e => e.category))];
                setSections(listCategory);
                setFilterSelections(listCategory.map(() => false));
                setData(menuItems);
            } catch (e) {
            // Handle error
                Alert.alert(e.message);
            }
        })();
    }, []);

    // useUpdateEffect(() => {
    //     (async () => {
    //         const activeCategories = sections.filter((s, i) => {
    //         // If all filters are deselected, all categories are active
    //         if (filterSelections.every((item) => item === false)) {
    //             return true;
    //         }
    //         return filterSelections[i];
    //         });
    //         try {
    //         const menuItems = await filterByQueryAndCategories(
    //             query,
    //             activeCategories
    //         );
    //         const sectionListData = getSectionListData(menuItems);
    //         setData(sectionListData);
    //         } catch (e) {
    //         Alert.alert(e.message);
    //         }
    //     })();
    //     }, [filterSelections, query]);

    const lookup = useCallback((q) => {
        setQuery(q);
    }, []);

    const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

    const handleSearchChange = (text) => {
        setSearchBarText(text);
        debouncedLookup(text);
    };
    const handleFiltersChange = async (index) => {
        const arrayCopy = [...filterSelections];
        arrayCopy[index] = !filterSelections[index];
        setFilterSelections(arrayCopy);
      };
    return <View style={{flex: 1}}>
        <FlatList 
            ListHeaderComponent={(<View>
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
                <Searchbar
                    placeholder="Search"
                    placeholderTextColor="black"
                    onChangeText={handleSearchChange}
                    value={searchBarText}
                    style={styles.searchBar}
                    iconColor="black"
                    inputStyle={{ color: 'black' }}
                    elevation={0}
                />
                <Filters
                    sections={sections}
                    selections={filterSelections}
                    onChange={handleFiltersChange}
                />
            </View>)}
            data={data}
            renderItem={({ item }) => (
                <Item price={item.price} description={item.description} image={item.image} name={item.name}/>
            )}
        />
    </View>
}