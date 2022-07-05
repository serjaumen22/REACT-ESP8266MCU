

import React,{isValidElement,useState} from 'react';

import {View, StyleSheet,Text,Switch,Button } from 'react-native';


import init from 'react_native_mqtt';
import  {AsyncStorage}  from '@react-native-async-storage/async-storage';

	init({
	  size: 10000,
	  storageBackend: AsyncStorage,
	  defaultExpires: 1000 * 3600 * 24,
	  enableCache: true,
	  reconnect: true,
	  sync : {
	  }
	});
	

export default class HumidityScreen extends React.Component {
	

	static navigationOptions = {
	    header: null,
	  };


  constructor(props) {
    super(props);
	
    const client = new Paho.MQTT.Client('f3d3c4b4f48d44dcb6d7b74cf08085db.s2.eu.hivemq.cloud',8884,'/');
    client.onConnectionLost = this.onConnectionLost;
    client.onMessageArrived = this.onMessageArrived;
  
    client.connect({
      onSuccess: this.onConnect, 
	  onFailure: this.onConnectionLost,
      userName: 'serjaumen22',
      password : 'Sergio1398',
	  useSSL : true
    });


    this.state = {
		checked:true,
      humidity: '...',
      client,
      loading: true,
      showError: false
    };
	this.Off=this.Off.bind(this);
  }





	onConnectionLost = (responseObject) => 
	{
	  if (responseObject.errorCode !== 0) 
	  {
	    console.log("onConnectionLost:"+responseObject.errorMessage);
	 
	    this.setState({ humidity: '...'})	
	  }
	}

  	onConnect = () => 
	{
	    const { client } = this.state;
	    client.subscribe('bebinski/hp');
	
	    console.log("Conectado al broker")
	
	    this.setState({loading: false})
 	}
 Off() 
	{  const { client } = this.state;
	    this.setState({checked:!this.state.checked})
		if(this.state.checked==false){
			client.send('app','1')
		}else{
			client.send('app','0')
		}
	  
 	}
	
	onMessageArrived = (message) => 
	{  
		
		console.log(message.payloadString)
		try{

		let json = JSON.parse(message.payloadString)

		if( json.code == '1234' )
		{
			console.log("Registro autenticado nuevo")
			console.log("Codigo es",json)
			this.setState({ humidity: json.humidity })
		}

		}catch(e)
		{
			console.log("La informacion no es relevante")
		}
	}




	

  render() 
  { 
   
		return(
			<View style={styles.container}>
		<Text>TERMA</Text>
		
		<Switch
		style={{  marginTop: 50, transform: [{ scaleX: 2 }, { scaleY: 2}] }}
		onValueChange={this.Off}
		value={this.state.checked}
		
		/>
		
		</View>
		)  

  }
}

const styles = StyleSheet.create({
	container: {
	  flex: 1,
	  alignItems: "center",
	  justifyContent: "center"
	}
  });