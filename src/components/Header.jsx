import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import Logo from '../../assets/Logo.png';

const Header = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="arrow-back-ios" size={35} color="black" onPress={() => navigation.goBack()} />
          <Text style={styles.title}>{title}</Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Image source={Logo} style={styles.logo} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    padding: 5,
    backgroundColor: '#ffffff',
    borderBottomColor: '#DDD',
    borderBottomWidth: 1,
  },
  logo: {
    width: 45,
    height: 45,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Header;