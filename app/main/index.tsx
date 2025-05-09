import React from 'react';
import { Image, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // For AppBar icons

const App = () => {
  return (
    <View style={styles.container}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <Icon name="menu" size={30} color="#000" />
        <Text style={styles.appBarTitle}>Home</Text>
        <Icon name="person" size={30} color="#000" />
      </View>

      {/* Weather Card */}
      <View style={styles.weatherCard}>
        <Text style={styles.location}>My Location</Text>
        <Text style={styles.weatherInfo}>Montreal</Text>
        <Text style={styles.temperature}>-10°</Text>
        <Text style={styles.weatherStatus}>Partly Cloudy</Text>
      </View>

      {/* Room Section */}
      <View style={styles.roomContainer}>
        <View style={styles.roomCard}>
          {/* <Image source={require('./assets/master-bedroom.jpg')} style={styles.roomImage} /> */}
          <Text style={styles.roomName}>Master Bedroom</Text>
          <View style={styles.deviceCountContainer}>
            <Text style={styles.deviceCount}>4 devices</Text>
            <Switch value={true} />
          </View>
        </View>

        <View style={styles.roomCard}>
          {/* <Image source={require('./assets/living-room.jpg')} style={styles.roomImage} /> */}
          <Text style={styles.roomName}>Living Room</Text>
          <View style={styles.deviceCountContainer}>
            <Text style={styles.deviceCount}>15 devices</Text>
            <Switch value={false} />
          </View>
        </View>
      </View>

      {/* Family Members Section */}
      <View style={styles.familyMembersContainer}>
        <Text style={styles.familyMembersTitle}>Family Members</Text>
        <View style={styles.familyMembersList}>
          {/* Family Member Avatars */}
          <Image source={{ uri: 'https://example.com/image1.jpg' }} style={styles.avatar} />
          <Image source={{ uri: 'https://example.com/image2.jpg' }} style={styles.avatar} />
          <Image source={{ uri: 'https://example.com/image3.jpg' }} style={styles.avatar} />
          <Image source={{ uri: 'https://example.com/image4.jpg' }} style={styles.avatar} />
        </View>
      </View>

      {/* Bottom Navigation with Voice Icon */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.iconContainer}>
          <Icon name="home" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.voiceButton}>
          <Icon name="mic" size={30} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f1f1f1',
  },
  appBarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  weatherCard: {
    backgroundColor: '#e8c1f4',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  location: {
    fontSize: 18,
    color: '#7f7f7f',
  },
  weatherInfo: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  temperature: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  weatherStatus: {
    fontSize: 14,
    color: '#7f7f7f',
  },
  roomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 15,
  },
  roomCard: {
    width: '48%',
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    overflow: 'hidden',
  },
  roomName: {
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  deviceCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  deviceCount: {
    fontSize: 14,
    color: '#7f7f7f',
  },
  familyMembersContainer: {
    margin: 15,
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
  },
  familyMembersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  familyMembersList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3b71f3',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconContainer: {
    padding: 10,
    backgroundColor: '#5a5a5a',
    borderRadius: 50,
  },
  voiceButton: {
    padding: 10,
    backgroundColor: '#ff6363',
    borderRadius: 50,
  },
});

export default App;
