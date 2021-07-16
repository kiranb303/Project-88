import AppLoading from 'expo-app-loading';
import * as React from 'react';
import { Text, View, StyleSheet, Platform, StatusBar,Image,TextInput, ScrollView, Dimensions,TouchableOpacity, Alert,Button } from 'react-native';
import * as Font from 'expo-font';
import DropDownPicker from 'react-native-dropdown-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase'

let custom_font = {'Bubbegum-Sans':require('../assets/fonts/BubblegumSans-Regular.ttf')};

export default class CreatePosts extends React.Component{
    constructor(){
        super();
        this.state = {
            fontsLoaded: false,
            previewImage: 'image_1',
            dropdownheight: 40,
            lightTheme: true,
            title: '',
            caption: '',
            profilePic: '',
        };
    }

    async loadFonts(){
        await Font.loadAsync(custom_font);
        this.setState({fontsLoaded: true});
    }

    fetchUser = async ()=>{
      let theme, image;
      await firebase.database().ref("/users/"+firebase.auth().currentUser.uid).on("value",(snapshot)=>{
          theme = snapshot.val().current_theme;
          image = snapshot.val().profile_picture;
          this.setState({lightTheme: theme==="light"?true:false,
                         profilePic: image});
      });
    }

  componentDidMount(){
      this.loadFonts();
      this.fetchUser();
  }

    async submitpost(){
        if(this.state.title.trim() && this.state.caption.trim()){
            let postdata = {
                previewImage: this.state.previewImage,
                title: this.state.title,
                caption: this.state.caption,
                author: firebase.auth().currentUser.displayName,
                created_on: new Date(),
                author_uid: firebase.auth().currentUser.uid,
                likes: 0,
                author_profileImg: this.state.profilePic,
            }
            await firebase.database().ref("/Posts/" + Math.random().toString(36).slice(2)).set(postdata)
            .then(function (snapshot){});
            this.props.setUpdateToTrue()
            this.props.navigation.navigate("Feed");
        }else{
            Alert.alert("Error", "All feilds are required", [{text: 'Ok',onPress: ()=>console.log("ok pressed")}], {cancelable: false})
        }
    }

    render(){
    if(! this.state.fontsLoaded){
        return <AppLoading />
    }else{
        let previewImages = {
            image_1: require('../assets/image_1.jpg'),
            image_2: require('../assets/image_2.jpg'),
            image_3: require('../assets/image_3.jpg'),
            image_4: require('../assets/image_4.jpg'),
            image_5: require('../assets/image_5.jpg'),
            image_6: require('../assets/image_6.jpg'),
            image_7: require('../assets/image_7.jpg'),
        }
        return(
            <View style = {this.state.lightTheme?styles.containerLight:styles.container}>
            <SafeAreaView style = {styles.safeview}/>
            <View style = {styles.appTitle}>
                        <View style = {styles.appIcon}>
                            <Image source = {this.state.lightTheme?require('../assets/Light_Logo.png'):require('../assets/logo.png')} style = {styles.iconImage}/>
                        </View>
                        <View style = {styles.appTitleTextContainer}>
                            <Text style = {this.state.lightTheme?styles.appTitleTextLight:styles.appTitleText}>
                                Spectagram
                            </Text>
                        </View>
                </View>
                    <ScrollView style = {styles.feildContainer}>
                        <View style = {styles.imageContainer}>
                            <View style = {styles.previewContainer}>
                                <Image  source = {previewImages[this.state.previewImage]} 
                                style = {{resizeMode:"contain",
                                          width: Dimensions.get('window').width-40,
                                          height: 250,
                                          borderRadius:10,
                                          marginBottom:10}}/>
                            </View>
                            <View style = {{height: RFValue(this.state.dropdownheight)}}>
                                <DropDownPicker items = {[
                                    {label: 'Image 1', value: 'image_1'},
                                    {label: 'Image 2', value: 'image_2'},
                                    {label: 'Image 3', value: 'image_3'},
                                    {label: 'Image 4', value: 'image_4'},
                                    {label: 'Image 5', value: 'image_5'},
                                    {label: 'Image 6', value: 'image_6'},
                                    {label: 'Image 7', value: 'image_7'}
                                ]}
                                defaultValue = {this.state.previewImage}
                                containerStyle = {{height: 40, borderRadius: 20, marginBottom: 10}}
                                style = {{backgroundColor: 'white'}}
                                onOpen = {()=>{this.setState({dropdownheight: 170})}}
                                onClose = {()=>{this.setState({dropdownheight: 40})}}
                                itemStyle = {{justifyContent:"flex-start"}}
                                dropDownStyle = {{backgroundColor: this.state.lightTheme?"#eee":'#2f345d'}}
                                labelStyle = {this.state.lightTheme?styles.dropDownlabelLight: styles.dropDownLabel}
                                arrowStyle = {this.state.lightTheme?styles.dropDownlabelLight: styles.dropDownLabel}
                                onChangeItem = {item=>this.setState({previewImage: item.value})}
                                />
                            </View>
                            <TextInput onChangeText = {text=>{this.setState({title: text})}}
                                    placeholder = {'Title'}
                                    placeholderTextColor = {this.state.lightTheme?'black':'white'}
                            style = {this.state.lightTheme?styles.inputFontLight:styles.inputFont}></TextInput>

                            <TextInput onChangeText = {text=>{this.setState({caption: text})}}
                                    placeholder = {'Caption'}
                                    placeholderTextColor = {this.state.lightTheme?'black':'white'}
                                    multiline = {true}
                                    numberOfLines = {4}
                                    style={[this.state.lightTheme?styles.inputFontLight:styles.inputFont,,styles.inputFontExtra,styles.inputTextBig]}
                            ></TextInput>
                        </View>
                        <View style = {styles.submitContainer}>
                            <Button title = "SUBMIT" onPress = {()=>this.submitpost()} color = '#f067cb' />
                        </View>
                    </ScrollView>
                </View>
        );
    }
}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "black"
    },
    containerLight: {
      flex: 1,
      backgroundColor: "white"
    },
    safeview: {
      marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
    },
    appTitle: {
      flex: 0.07,
      flexDirection: "row"
    },
    appIcon: {
      flex: 0.3,
      justifyContent: "center",
      alignItems: "center"
    },
    iconImage: {
      width: "100%",
      height: "100%",
      resizeMode: "contain"
    },
    appTitleTextContainer: {
      flex: 0.7,
      justifyContent: "center"
    },
    appTitleText: {
      color: "white",
      fontSize: RFValue(25),
      fontFamily: "Bubblegum-Sans"
    },
    appTitleTextLight: {
      color: "black",
      fontSize: RFValue(25),
      fontFamily: "Bubblegum-Sans"
    },
    feildContainer: {
      flex: 0.85
    },
        previewContainer:{
        width: "93%",
        height: RFValue(250),
        alignSelf: "center",
        borderRadius: RFValue(10),
        marginVertical: RFValue(10),
        resizeMode: "contain"
    },
    inputFont:{
        height: RFValue(40),
        borderColor: "white",
        borderWidth: RFValue(1),
        borderRadius: RFValue(10),
        paddingLeft: RFValue(10),
        color: "white",
        fontFamily: "Bubblegum-Sans"
    },
    inputFontLight:{
      height: RFValue(40),
      borderColor: "black",
      borderWidth: RFValue(1),
      borderRadius: RFValue(10),
      paddingLeft: RFValue(10),
      color: "black",
      fontFamily: "Bubblegum-Sans"
    },
    inputFontExtra: {
      marginTop: RFValue(15)
    },
    inputTextBig: {
      textAlignVertical: "top",
      padding: RFValue(5)
    },
    dropDownLabel:{
      color: 'white',
      fontFamily: 'Bubblegum-Sans'
    },
    dropDownlabelLight:{
      color: 'black',
      fontFamily: 'Bubblegum-Sans'
    },
    submitContainer:{
      justifyContent:"center",
      alignItems:"center",
      marginTop: 20,
    },
  });