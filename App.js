import React, { useEffect, useState } from "react";
import { View, 
         Text,
         SafeAreaView, 
         TextInput, 
         StyleSheet, 
         ActivityIndicator, 
         FlatList, 
         Image } from 'react-native';
         import filter from "lodash.filter";

const API_ENDPOINT = 'https://randomuser.me/api/?results=30'

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [fullData, setFullData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchData(API_ENDPOINT);
  }, []);

  const fetchData = async(url) => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      setData(json.results);

      console.log(json.results)
      setFullData(json.results)
      setIsLoading(false)

    } catch(error){
      setError(error);
      console.log(error);
    }
  }

  const handleSearch = (query) => {
    setSearchQuery(query);
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(fullData, (user) => {
      return contains(user, formattedQuery);
    });
    setData(filteredData);
  };

  const contains = ({ name, email }, query) => {
    const { first, last } = name;
    if (first.includes(query) || last.includes(query) || email.includes(query)) {
      return true;
    }
    return false;
  };
  if( isLoading ) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
      <ActivityIndicator size={'large'} color={'#5500dc'}/>
      </View>
    )
  }

  if( error) {
    return (
    <View>
    <Text>Error in fetching data... </Text>
    </View>)
  }
  return(
    <SafeAreaView style={{flex:1, marginHorizontal:20,}}>
      <TextInput 
            placeholder="Search"
            style={style.inputbox}
              value={searchQuery}
              onChangeText={(query) => handleSearch(query)}
            />

            <FlatList 
            data={data}
            keyExtractor={(item) => item.login.username}
            renderItem={({item}) => (
              <View style={style.itemContainer}>
                <Image style={style.image} source={{uri: item.picture.thumbnail}}/>
                <View style={style.textName}>
                  <Text>{item.name.first} {item.name.last}</Text>
                  <Text >{item.email}</Text>
                </View> 
              </View>
            )}
            />
            
    </SafeAreaView>
  )
}

export default App;


const style = StyleSheet.create({
  inputbox:{
    borderWidth : 1,
    borderColor:'#ccc',
    margin:10,
    borderRadius:8,
    
  },
  itemContainer: {
    flexDirection:"row",
    alignItems:'center',
    marginLeft:10,
    marginTop:10,
  },
  image: {
    width:50, height:50, borderRadius:25,
  },
  textName: {
    fontSize:17,
    marginLeft:10,
  },
  textEmail: {
    fontSize:14,
    marginLeft:10,
    color:'grey'
  }
})