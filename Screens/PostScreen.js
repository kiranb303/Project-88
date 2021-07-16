import AppLoading from 'expo-app-loading';
import * as React from 'react';
import { Text, View, StyleSheet, Platform, StatusBar,Image } from 'react-native';
import * as Font from 'expo-font';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RFValue } from 'react-native-responsive-fontsize';
import Ionicons from 'react-native-vector-icons/Ionicons'
import StackNavigator from '../Navigators/StackNavigator'

let custom_font = {'Bubblegum-Sans':require('../assets/fonts/BubblegumSans-Regular.ttf')}

export default class PostScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            fontsLoaded: false,
            speakerColor: 'gray',
            speakerIcon: 'volume-high-outline',
            lightTheme: true,
        };
    }
    async loadFonts(){
        await Font.loadAsync(custom_font);
        this.setState({fontsLoaded: true});
    }

    componentDidMount(){
        this.loadFonts();
    }

  async initiateTTS(title, author, caption, created_on){
      const currentColor = this.state.speakerColor;
      this.setState({speakerColor: currentColor==='gray'?'#ee8249':'gray'});
      if(currentColor === 'grey'){
          Speech.speak(title + 'by' + author);
          Speech.speak(caption);
          Speech.speak("Post created on");
          Speech.speak(created_on);
      }else{
          Speech.stop();
      }
  }

    render(){
      if(! this.props.route.params){
        this.props.navigation.navigate('Home');
    }else if(! this.state.fontsLoaded){
            return <AppLoading />
        }
        else{
            return(
                <View style = {styles.container}>
                    <View style = {styles.cardContainer}>
                        <View style = {styles.profile}>
                        <Image source = {require('../assets/profile_img.png')} style = {styles.profileImage} />
                        <Text style = {[styles.titleText, {marginLeft: 60, bottom: 50}]}>
                                {this.props.route.params.post.author}
                        </Text>
                        </View>
                        <View style = {styles.postContainer}>
                        <ScrollView style = {styles.postCard}>
                            <Image source = {require('../assets/image_1.jpg')} style = {styles.image} />
                            <View style = {styles.dataContainer}>
                                <View style = {styles.titleTextContainer}>
                                    <Text style = {styles.postTitleText}>{this.props.route.params.post.title}</Text>
                                    <Text style = {styles.postTitleText}>{this.props.route.params.post.caption}</Text>
                                    <Text style = {styles.postTitleText}>{this.props.route.params.post.created_on}</Text>
                                </View>
                                <View style = {styles.iconContainer}>
                                    <TouchableOpacity onPress = {()=>{this.initiateTTS(
                                        this.props.route.params.post.title,
                                        this.props.route.params.post.author,
                                        this.props.route.params.post.created_on,
                                        this.props.route.params.post.caption,
                                    )}}>
                                    <Ionicons name = {this.state.speakerIcon} size = {RFValue(30)} color = {this.state.speakerColor} style = {{margin: RFValue(15)}}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style = {styles.actionContainer}>
                                   <View style = {styles.likeButton}>
                                      <Ionicons name = {"heart"} size = {RFValue(25)} color = "white" />
                                          <Text style = {styles.likeText}>
                                              12K
                                          </Text>
                                  </View>
                              </View>
                        </ScrollView>
                    </View>
                    </View>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#15193c"
      },
      cardContainer: {
        flex: 0.93
      },
      profile:{
        height: 60,
        borderRadius: 20,
        backgroundColor: '#272C59'
    },
    profileImage: {
        width: 48,
        height: 48,
        bottom: -2,
        resizeMode: "contain"
    },
    titleText: {
        color: "white",
        fontSize: RFValue(28),
        fontFamily: "Bubblegum-Sans"
      },
      postContainer: {
        flex: 1
      },
      postCard: {
        margin: RFValue(20),
        backgroundColor: "#2f345d",
        borderRadius: RFValue(20)
      },
      image: {
        width: "100%",
        alignSelf: "center",
        height: RFValue(200),
        borderTopLeftRadius: RFValue(20),
        borderTopRightRadius: RFValue(20),
        resizeMode: "contain"
      },
      dataContainer: {
        flexDirection: "row",
        padding: RFValue(20)
      },
      titleTextContainer: {
        flex: 0.8
      },
      postTitleText: {
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(25),
        color: "white"
      },
      postAuthorText: {
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(18),
        color: "white"
      },
      iconContainer: {
        flex: 0.2
      },
      actionContainer: {
        justifyContent: "center",
        alignItems: "center",
        margin: RFValue(10)
      },
      likeButton: {
        width: RFValue(160),
        height: RFValue(40),
        flexDirection: "row",
        backgroundColor: "#eb3948",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: RFValue(30)
      },
      likeText: {
        color: "white",
        fontFamily: "Bubblegum-Sans",
        fontSize: RFValue(25),
        marginLeft: RFValue(5)
      },
  });