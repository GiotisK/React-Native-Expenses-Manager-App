import React from 'react';
import { Text, View } from 'react-native';
import Icon from 'react-native-ionicons';
import { CalendarList, Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-community/async-storage';



//import InputScreen from './src/tabs/InputScreen'



//let markedDays={} 

class CalendarScreen extends React.Component {
  constructor(props) {
    super(props)   
    this.state = {
      //markedDays: {'2019-06-30': {dots: [vacation,workout], selected: true, selectedColor: '#3949ab'}}
      markedDays: {'2011-04-30':{dots:[{},{}]}}
    }
    /*trick to 
     *put dots on backpress
     */
    this.reRenderMarks = this.props.navigation.addListener('willFocus', () => {
      this.getMarkedDaysFromAsyncStorage()
    });
  }
    /*trick to 
     *put dots on backpress
     */
  componentWillUnmount() {
    this.reRenderMarks;
  }

 
  getMarkedDaysFromAsyncStorage = async()=>{
    try{
      let value = await AsyncStorage.getItem('markedDays')
      if(value!==null){
        value = JSON.parse(value)
        this.setState({
          markedDays: value
        })
      }
      
    }catch(error){
     console.log("getMarkedDays:  error")
    }
  }

  onDaySelect = (day) => 
  {
    const selectedDay = day.dateString
    let marked = true;
    if (this.state.markedDays[selectedDay]) {
      // Already in marked dates, so reverse current marked state
      marked = !this.state.markedDays[selectedDay].marked;
    }
    const updatedMarkedDays = {...this.state.markedDays, ...{ [selectedDay]: { 'marked': marked } } }
    console.debug("sdadsdsa")
    // Triggers component to render again, picking up the new state
    this.setState({ markedDays: updatedMarkedDays });
  };
  

  render() {  
    const {navigate} = this.props.navigation;
    return (   
      <CalendarList
        //onDayPress={this.onDaySelect}
        
        onDayPress={(day) => {navigate('Second',{day: day})}}
        markingType={'multi-dot'}
        markedDates={this.state.markedDays}

        minDate={'2019-01-01'} 
        horizontal={true}
        pagingEnabled={true}
        hideArrows={false}
        firstDay={1}
        hideExtraDays={true}
        markingType={'multi-dot'}
        theme={{ 
          arrowColor: 'gray',
          dayTextColor: 'gray',
          textDayFontSize: 20,
          textSectionTitleColor: '#3949ab',
          todayTextColor: '#3949ab',
          'stylesheet.calendar.header': {
            monthText:{
              paddingTop:40,
              paddingBottom:20,
              fontSize: 25,
              color:'#3949ab'
            },
            arrow: {
              paddingTop:30
            },
          }
        }}
      />
    );
  }
}
  
  CalendarScreen.navigationOptions = { 
    tabBarIcon: ({tintColor, focused}) => (
      <Icon 
            name = "calendar"
            size = {28}
            color = {tintColor}
            inactiveTintColor="black"
       />
    )
  }



  export default CalendarScreen;