import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons';

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Rain: "rains",
  Snow: "snow",
  Drizzle: "rain",
  Thunderstorm: "lightning", 
  Atmosphere: "cloudy-gusts",
}


export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    console.log(granted);
    if (!granted) {
      setOk(false);
    } else {
      setOk(true);
    }

    const location2 = await Location.getCurrentPositionAsync({accuracy:5});
    console.log(location2);
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    console.log(latitude, longitude);
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    console.log(location);
    setCity(location[0].city); // android SDK49 can't use useGoogleMaps.

    // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`);
    // const json = await response.json();
    // console.log(json.weather[0].description);
    // console.log(json.main.temp);

    // const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}`);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    // setDays(json.daily);
    // console.log(json.list);
    // console.log(json.list[0].main.temp);
    // console.log(json.list[0].weather[0].description);
    setDays(json.list);
  }
  useEffect(() => {
    getWeather();
  }, []);

  return (
    <View style={styles.container} >
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled
        horizontal
        contentContainerStyle={styles.weather}
      >
        {days.length === 0 ? (
          <View style={{ ...styles.day, alignItems: "center" }}>
            <ActivityIndicator color="gray" size="large" style={{ marginTop: 10 }} />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View style={{ flexDirection:"row", alignItems: "flex-end", justifyContent: "space-between", width: "100%" }}>
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                </Text>
                <Text>
                  <Fontisto name={icons[day.weather[0].main]} size={68} color="black" />
                </Text>
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          ))
        )}
      </ScrollView>
      <StatusBar style="dark"></StatusBar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "yellow",
  },
  city: {
    flex: 1,
    // backgroundColor: "orange",
    justifyContent: "center", // vertical-center
    alignItems: "center", // horizontal-center
  },
  cityName: {
    color: "black",
    fontSize: 48,
    fontWeight: "600"
  },
  weather: {
    // flex: 3,
    // backgroundColor: "teal",
  },
  day: {
    // flex: 1,
    // justifyContent: "center",
    width: SCREEN_WIDTH,
    alignItems: "center",
    // backgroundColor: "gray"
  },
  temp: {
    marginTop: 50,
    fontWeight: "600",
    fontSize: 100,
    color: "black",
  },
  description: {
    marginTop: -10,
    fontSize: 30,
    color: "black",
    fontWeight: "500",
  },
  tinyText: {
    marginTop: -5,
    fontSize: 25,
    color: "black",
    fontWeight: "500",
  },
})