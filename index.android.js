/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import MapView from 'react-native-maps';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Fumi } from 'react-native-textinput-effects';
import axios from 'axios';

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';
console.disableYellowBox = true;
let email = "";
class DriverApp extends Component {

    constructor(props){
        super(props);

        this.verifyDriver = this.verifyDriver.bind(this);
        this.onChangeCode = this.onChangeCode.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
            this.state = {email : "",
            code : "", verified:false,}
    }

    verifyDriver(e){

          if(this.state.email != null && this.state.code != null){
             data={email:this.state.email,
                    code: this.state.code
                    }
              email = this.state.email;
             fetch('http://192.168.1.59:3001/api/verifyDriver', {
               method: 'POST',
               headers: {
                 'Accept': 'application/json',
                 'Content-Type': 'application/json',
               },
               body: JSON.stringify({
                 email: this.state.email,
                 key: this.state.code,
               })
             })
              .then((response) => response.json())

              .then((responseJson) => {
                    if(responseJson.message){
                        this.setState({
                        verified : true,});

                    }
                    })
              .catch((error) => {
                    console.error(error);
                    });
                }
    }
    onChangeCode(text){

        this.setState({
            code: text,
        });

    }

    onChangeEmail(text){

        this.setState({
            email : text,
        });
    }

    render(){
        let component = null;
        if(this.state.verified){
                component = <View style ={styles.container}>
                                <Map/>
                            </View>
        }
        else{
              component=          <View style={styles.container2}>
                                                        <Fumi style={styles.mail}
                                                        label={'Your Email'}
                                                        iconClass={MaterialIcons}
                                                        iconName={'email'}
                                                        iconColor={'#f95a25'}
                                                        onChangeText = {this.onChangeEmail}
                                                        />
                                                        <Fumi style={styles.mail}
                                                        label={'Secqurity Code sent to your email'}
                                                        iconClass={MaterialIcons}
                                                        iconName={'grain'}
                                                        iconColor={'#f95a25'}
                                                        onChangeText = {this.onChangeCode}
                                                        />
                                                        <Button onPress={this.verifyDriver} title="start Tracking"/>
                                                    </View>
        }
        return(
            <View  style={styles.container} >
                {component}
            </View>
        );
    }

}
const styles = StyleSheet.create({

  container: {
    ...StyleSheet.absoluteFillObject,
    height: 600,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor:'#3b5998',

  },
  container2: {
    ...StyleSheet.absoluteFillObject,
    height: 350,
    width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor:'#3b5998',

  },
  map:{
    ...StyleSheet.absoluteFillObject,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  title:{
    fontWeight: '500',
  },
  mail:{
    height: 60,
    width:  360,
    marginBottom: 15,
    fontSize: 20,
    fontWeight: 'bold',
    opacity: 0.8,
  }
});


class Map extends Component{

  constructor(props) {
    super(props);
          this.onButtonPress = this.onButtonPress.bind(this);
          this.state ={ region:  {
                                   latitude: 6.6253,
                                   longitude: 80.065218,
                                   latitudeDelta: 0.5,
                                   longitudeDelta: 0.9,
                                 }
                     }
  }

   onButtonPress(){
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log("getCurrentPosition Success");
            this.setState({
              region: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                speed : position.coords.speed,
              }
            });
          },
          (error) => {
            this.props.displayError("Error dectecting your location");
            alert(JSON.stringify(error))
          },
          {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );

        let data = {email : email,
                    lat : this.state.region.latitude,
                    lang : this.state.region.longitude,
                    speed : this.state.region.speed,
        }
        axios.post('http://192.168.1.59:3001/api/sendCordinates', data)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });


      }



render(){
    const { region } = this.props;
    console.log(region);
    return (
      <View style ={styles.container}>
      <MapView
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          region={{
            latitude: 6.9271,
            longitude: 79.8612,
            latitudeDelta: 0.5,
            longitudeDelta: 0.9,
          }}
        >
        <MapView.Marker
              coordinate={{latitude:this.state.region.latitude,
                            longitude:this.state.region.longitude,}}
              title = "userPosition"
              description = "wada karapan"
              />
        </MapView>
        <Button onPress = {this.onButtonPress}title="Press Me" accessibilityLabel="See an informative alert" />
        <Text style={styles.title}>
            <Text>
                {this.state.region.latitude}
            </Text>
            <Text>
                {this.state.region.longitude}
            </Text>
        </Text>
      </View>
    );
  }
  }



AppRegistry.registerComponent('DriverApp', () => DriverApp);


//                    onChangeText ={(text)=>{this.setState({this.state.code})}}