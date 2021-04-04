import React ,{Component} from 'react';
import {View,Text,StyleSheet,TouchableOpacity} from 'react-native';
import {Avatar} from 'react-native-elements';
import {DrawerItems} from 'react-navigation-drawer';
import db from '../config';
import firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions'; 

export default class CustomSideBarMenu extends Component{
    constructor(){
        super()
        this.state={
          name:'',
          docId:'',
          image:'#',
          userId:firebase.auth().currentUser.email
        }
    }
    
    fetchImage=(imageName)=>{
        var storageRef= firebase.storage().ref().child('user_profiles/'+imageName);
        storageRef.getDownloadURL().then((uri)=>{
          this.setState({
            image:uri
          })
        })
        .catch((error)=>{
          this.setState({
            image:'#'
          })
        })
    }
    
    uploadImage=async(uri,imageName)=>{
        var responce = await fetch(uri)
        var blob = await responce.blob()
        var ref = firebase.storage().ref().child('user_profiles/'+imageName);
        return ref.put(blob).then((responce)=>{
          this.fetchImage(imageName)
        })
    }
    
    selectPicture = async()=>{
        const {cancelled,uri} = await ImagePicker.launchImageLibraryAsync({
          mediaTypes:ImagePicker.MediaTypeOptions.All,
          allowsEditing:true,
          aspect:[4,3],
          quality:1
        })
        if(!cancelled){
          this.uploadImage(uri,this.state.userId)
        }
    }
    
    getUserProfile(){
        db.collection('users').where('email_address','==',this.state.userId).onSnapshot((querySnapShot)=>{
          querySnapShot.forEach((doc)=>{
            this.setState({
              name:doc.data().first_name+' '+doc.data().last_name,
              docId:doc.id,
              image:doc.data().image
            })
          })
        })
    }
    
    componentDidMount(){
        this.fetchImage(this.state.userId)
        this.getUserProfile()
    }
    render(){
        return(
            <View style = {{flex:1}}>
                <View style = {{flex:0.5,alignItems:'center',backgroundColor:'lightblue'}}>
                    <Avatar rounded
                    source = {{
                    uri:this.state.image
                    }}
                    size='medium'
                    containerStyle = {styles.imageContainer}
                    onPress={()=>{
                    this.selectPicture()
                    }}
                    showEditButton
                    />
                    <View style = {{flex:0.5}}>
                        <Text style = {{padding:10,fontSize:20,fontWeight:'bold',color:'black'}}>{this.state.name}</Text>
                    </View>
                </View>
                <View style = {styles.drawerItemsContainer}>
                  <DrawerItems {...this.props}/>
                </View>
                <View style = {styles.logOutContainer}>
                    <TouchableOpacity style = {styles.logOutButton}
                    onPress = {()=>{
                        this.props.navigation.navigate('SignupLoginScreen')
                        firebase.auth().signOut()
                    }}>
                        <Text>LOG OUT</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
      flex:1
    },
    drawerItemsContainer:{
      flex:0.8
    },
    logOutContainer : {
      flex:0.2,
      justifyContent:'flex-end',
      paddingBottom:30
    },
    logOutButton : {
      justifyContent:'center',alignItems:'center',padding:10,height:30,width:'80%',backgroundColor:'orange',borderRadius:10,marginLeft:25
    },
    logOutText:{
      fontSize: 30,
      fontWeight:'bold'
    },
    imageContainer:{
      flex:0.75,
      width:'40%',
      height:'20%',
      marginLeft:20,
      marginTop:30,
      borderRadius:40
    }
  })
  