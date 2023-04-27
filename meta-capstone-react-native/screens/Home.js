import { Image, SectionList, StyleSheet, Text, TouchableOpacity, View } from "react-native"

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
        backgroundColor: 'green',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
      },
});

const Filters = ({ onChange, selections, sections }) => {
    return (
      <View style={styles.filtersContainer}>
        {sections.map((section, index) => (
          <TouchableOpacity
            onPress={() => {
              onChange(index);
            }}
            style={{
              flex: 1 / sections.length,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 16,
              backgroundColor: selections[index] ? '#EE9972' : '#495E57',
              borderWidth: 1,
              borderColor: 'white',
            }}>
            <View>
              <Text style={{ color: selections[index] ? 'black' : 'white' }}>
                {section}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

const Item = ({ title, price }) => (
    <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.title}>${price}</Text>
    </View>
);
const sections = ['Appetizers', 'Salads', 'Beverages'];
const API_URL =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/menu-items-by-category.json';

export default HomeScreen = () => {
    const [data, setData] = useState([]);
    const [searchBarText, setSearchBarText] = useState('');
    const [query, setQuery] = useState('');
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
        let results = json.menu.map((value) => {
            let val = value;
            val.category = value.category.title;
            return val;
        });
        return results;
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

            const sectionListData = getSectionListData(menuItems);
            setData(sectionListData);
            } catch (e) {
            // Handle error
            Alert.alert(e.message);
            }
        })();
        }, []);

        useUpdateEffect(() => {
        (async () => {
            const activeCategories = sections.filter((s, i) => {
            // If all filters are deselected, all categories are active
            if (filterSelections.every((item) => item === false)) {
                return true;
            }
            return filterSelections[i];
            });
            try {
            const menuItems = await filterByQueryAndCategories(
                query,
                activeCategories
            );
            const sectionListData = getSectionListData(menuItems);
            setData(sectionListData);
            } catch (e) {
            Alert.alert(e.message);
            }
        })();
        }, [filterSelections, query]);

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
        {/* <Searchbar
            placeholder="Search"
            placeholderTextColor="white"
            onChangeText={handleSearchChange}
            value={searchBarText}
            style={styles.searchBar}
            iconColor="white"
            inputStyle={{ color: 'white' }}
            elevation={0}
        /> */}
        <Filters
            selections={filterSelections}
            onChange={handleFiltersChange}
            sections={sections}
        />
        <SectionList
            style={styles.sectionList}
            sections={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <Item title={item.title} price={item.price} />
            )}
            renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.header}>{title}</Text>
            )}
        />
    </View>
}