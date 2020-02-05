import React from 'react';
import { Text,View, TouchableOpacity, Button} from 'react-native';
import Modal from "react-native-modal";
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-ionicons'
import { ScrollView } from 'react-native-gesture-handler';
import InputComponent from './InputComponent'
import Slideshow from 'react-native-slideshow';
import IconButton from './IconButton'


let dateJSON; //we need to pass it to the camera screen
let month 
let year 
let day

let photoForDelete = ''

const months={
    1:"Jan.",
    2:"Febr.",
    3:"March",
    4:"April",
    5:"May",
    6:"June",
    7:"July",
    8:"Aug.",
    9:"Sep.",
    10:"Oct.",
    11:"Nov.",
    12:"Dec.",
}
global.months=months

class InputScreen extends React.Component {  

  constructor(){
    super();
  
 
    this.state = { 
        valueArray: [], 
        photos: [],
        numOfPhotos:0,
        slideshowEnabled:false,
        description:"ez",
        amount:'0',income:0,
        outcome:0,
        defaultValues: {},
        modalVisible: false,
    }
    this.index = 0;
  }
  
 
  static navigationOptions = ({ navigation }) => {
    dateJSON = navigation.getParam('dateJSON')
    month = months[dateJSON.month]
    year = dateJSON.year
    day = dateJSON.day

    return {
        title: day+" "+month+" "+year,
        headerTintColor: "#3949ab",
        headerStyle: {
        //backgroundColor: '',
        },
        headerTitleStyle:{
        fontWeight: 'normal',
        display: 'flex',
        flex: 1,
        textAlign: 'center',
      },
      headerRight:(
        <View style={{flex:1,flexDirection:'row'}}>
            <IconButton onPress={navigation.getParam('addMoreIn')} style={{marginRight:5}} name="add-circle" size = {40}  color = '#009688'/>
            <IconButton onPress={navigation.getParam('addMoreOut')} style={{marginRight:5}} name="add-circle" size = {40}  color = '#ff6666'/>
        </View>
      ),   
    }
  }

  componentDidMount() {
    //update photos counter every time u take a picture
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      let num = this.props.navigation.getParam('numOfPhotos')
    
      if(typeof num!='undefined'){
        //console.log("its ok")
            this.setState({
                numOfPhotos: this.state.numOfPhotos+num
            })
        }
      
    })
    this.props.navigation.setParams({ addMoreIn: this._addMoreIn, addMoreOut:this._addMoreOut });
    this.getAsyncStorageRows().then(()=>{
        this.getDefaultValuesFromAsyncStorage()
    })
    this.getIndexValueFromAsyncStorage()
    this.getIncomeOutcomeFromAsyncStorage()
    this.getNumOfPhotos()
  }

  getIncomeOutcomeFromAsyncStorage = async() => {
    try{
        let value = await AsyncStorage.getItem(year.toString())
        value = JSON.parse(value)
        let _income = value[month][day.toString()]['dayIncome']
        let _outcome = value[month][day.toString()]['dayOutcome']
        this.setState({
            income: _income,
            outcome: _outcome
        })
    }catch(error){
      //console.log("getIncomeOutcomeFromAsyncStorage: error")
    }
  }
 
  recalculateIncomesOutcomes = async () =>{
    //try{
    let dayIncome = 0
    let dayOutcome = 0
    let dayFood= 0
    let dayEntertainment= 0
    let dayShopping= 0
    let dayBills= 0
    let dayHealth= 0
    let dayOther= 0
    
    let monthIncome = 0
    let monthOutcome = 0
    let monthFood = 0
    let monthEntertainment = 0
    let monthShopping = 0
    let monthBills = 0
    let monthHealth = 0
    let monthOther = 0

    let yearIncome = 0
    let yearOutcome = 0
    let yearFood = 0
    let yearEntertainment = 0
    let yearShopping = 0
    let yearBills = 0
    let yearHealth = 0
    let yearOther = 0

    let value = await AsyncStorage.getItem(year.toString())
    value = JSON.parse(value)

    for(var index in value[month][day.toString()]['data'] ){
        if(value[month][day.toString()]['data'][index].amount!==''){
            for(var val of this.state.valueArray){
                let category_ = value[month][day.toString()]['data'][index].category
                if(val.isIncome && val.index===value[month][day.toString()]['data'][index].index){
                dayIncome+= parseFloat(value[month][day.toString()]['data'][index].amount)

             

                }else if(!val.isIncome && val.index===value[month][day.toString()]['data'][index].index){
                    dayOutcome+= parseFloat(value[month][day.toString()]['data'][index].amount)

               //category calculations
                if(category_ == "Other"){
                    dayOther +=  parseFloat(value[month][day.toString()]['data'][index].amount)
                }else if(category_ == "Food" ){
                    dayFood += parseFloat(value[month][day.toString()]['data'][index].amount)
                }else if(category_ == "Entertainment"){
                    dayEntertainment += parseFloat(value[month][day.toString()]['data'][index].amount)
                }else if(category_ == "Shopping"){
                    dayShopping += parseFloat(value[month][day.toString()]['data'][index].amount)
                }else if(category_ == "Bills"){
                    dayBills += parseFloat(value[month][day.toString()]['data'][index].amount)
                }else if(category_ == "Health"){
                    dayHealth += parseFloat(value[month][day.toString()]['data'][index].amount)
                }
            }
          }   
        }
      }
     
    value[month][day.toString()]['dayIncome'] = dayIncome
    value[month][day.toString()]['dayOutcome'] = dayOutcome
    value[month][day.toString()]['dayFood'] = dayFood
    value[month][day.toString()]['dayEntertainment'] = dayEntertainment
    value[month][day.toString()]['dayShopping'] = dayShopping
    value[month][day.toString()]['dayBills'] = dayBills
    value[month][day.toString()]['dayHealth'] = dayHealth
    value[month][day.toString()]['dayOther'] = dayOther
      

        for(var day_ in value[month]){
            if(day_!='monthIncome' && day_!='monthOutcome' && day_!="monthFood" && day_!="monthEntertainment" 
            && day_!="monthShopping" && day_!="monthBills" && day_!="monthHealth" && day_!="monthOther"){

                monthIncome += value[month][day_]['dayIncome']
                monthOutcome += value[month][day_]['dayOutcome']
                monthFood += value[month][day_]['dayFood']
                monthEntertainment += value[month][day_]['dayEntertainment']
                monthShopping += value[month][day_]['dayShopping']
                monthBills += value[month][day_]['dayBills']
                monthHealth += value[month][day_]['dayHealth']
                monthOther += value[month][day_]['dayOther']
        }
    }

      value[month]['monthIncome'] = monthIncome
      value[month]['monthOutcome'] = monthOutcome
      value[month]['monthFood'] = monthFood
      value[month]['monthEntertainment'] = monthEntertainment
      value[month]['monthShopping'] = monthShopping
      value[month]['monthBills'] = monthBills
      value[month]['monthHealth'] = monthHealth
      value[month]['monthOther'] = monthOther
      

    for(var _month in value ){
        if(_month!='yearIncome' && _month!='yearOutcome' && _month!='yearFood' && _month!='yearEntertainment'
        && _month!='yearShopping' && _month!='yearBills' && _month!='yearHealth' && _month!='yearOther'){
            yearIncome += value[_month]['monthIncome']
            yearOutcome += value[_month]['monthOutcome']
            yearFood += value[_month]['monthFood']
            yearEntertainment += value[_month]['monthEntertainment']
            yearShopping += value[_month]['monthShopping']
            yearBills += value[_month]['monthBills']
            yearHealth += value[_month]['monthHealth']
            yearOther += value[_month]['monthOther']
          
        }
    }
    value['yearIncome'] = yearIncome
    value['yearOutcome'] = yearOutcome
    value['yearFood'] = yearFood
    value['yearEntertainment'] = yearEntertainment
    value['yearShopping'] = yearShopping
    value['yearBills'] = yearBills
    value['yearHealth'] = yearHealth
    value['yearOther'] = yearOther

    await AsyncStorage.setItem( year.toString(), JSON.stringify(value));
  }

  pushIncomeToAsyncStorage = async(amount)=>{
    try{
      let value = await AsyncStorage.getItem(year.toString())
      value = JSON.parse(value)
      value['yearIncome']+=amount
      value[month]['monthIncome']+=amount
      value[month][day.toString()]['dayIncome']+=amount
      //console.log(value)
      await AsyncStorage.setItem( year.toString(), JSON.stringify(value));
    }catch(error){
      //console.log("PushIncomeToAsyncStorage: error")
    }
  }

  pushOutcomeToAsyncStorage = async (amount) =>{
    try{
      let value = await AsyncStorage.getItem(year.toString())
      value = JSON.parse(value)
      value['yearOutcome']+=amount
      value[month]['monthOutcome']+=amount
      value[month][day.toString()]['dayOutcome']+=amount
      await AsyncStorage.setItem( year.toString(), JSON.stringify(value));
    }catch(error){
      //console.log("PushOutcomeToAsyncStorage: error")
    }
  }

  getIndexValueFromAsyncStorage = async()=>{
    try{
      let value = await AsyncStorage.getItem(year.toString())
      value = JSON.parse(value)
      //console.log(value)
      this.index = value[month][day.toString()]['index']
    }catch{

    }
 
  }
  getDefaultValuesFromAsyncStorage = async() =>{
    try{
      let asyncStorageDefaults= await AsyncStorage.getItem(year.toString())
      asyncStorageDefaults = JSON.parse(asyncStorageDefaults)
      asyncStorageDefaults = asyncStorageDefaults[month][day.toString()]['data'] 
      this.setState({
        defaultValues: asyncStorageDefaults
      })
      
    } catch{
      console.debug("getDefaultValuesFromAsyncStorage:Error")
    } 
  }

  pushDefaultValuesToAsyncStorage = async() =>{
    try{
      let value= await AsyncStorage.getItem(year.toString())
      value = JSON.parse(value)
      let tempobj = {...this.state.defaultValues}
      value[month][day.toString()]['data']=tempobj
      await AsyncStorage.setItem( year.toString(), JSON.stringify(value));
    } catch{
      console.debug("pushDefaultValuesToAsyncStorage:Error")
    } 
  }

  createDefaultInputTextValues = ()=>{
    let arr={}
    this.state.valueArray.forEach(row => {
      arr[row.index]={"index":row.index,"description":"","amount":""}

    });
    this.setState({
      defaultValues:arr
    })
    //console.log("arr:",arr)
  }

  getAsyncStorageRows = async ()=>{
    //console.log(this.state.valueArray)
    try{
      let asyncStorageRows= await AsyncStorage.getItem(year.toString())
      asyncStorageRows = JSON.parse(asyncStorageRows)
      asyncStorageRows = asyncStorageRows[month][day.toString()]['rows']
      //console.log(asyncStorageRows)
      this.setState({
        valueArray: asyncStorageRows
      })

      //console.log(this.state.valueArray)
      
    } catch{
      //console.debug("getAsyncStorageRows:Error")
    } 
  }

  createMarksInDays= async () =>{
    let value
    let markedDays
    try{
       value = await AsyncStorage.getItem(year.toString())
    }catch(error){
      //console.log("createMarksInDays: get Year: error")
    }
    try{
      markedDays = await AsyncStorage.getItem('markedDays')
      if(markedDays===null){
        markedDays={}
      }else{
        markedDays = JSON.parse(markedDays)
      }
    }catch(error){
      //console.log("createMarksInDays: get markedDays: error")
    }
    
    value = JSON.parse(value)
    value = value[month][day.toString()]['rows']
    let foundIncome = false
    let foundOutCome = false
    for(i in value){
      if(value[i].isIncome){
        foundIncome=true
      }else{
        foundOutCome=true
      }

      if(foundIncome && foundOutCome){/*win some iteration time*/ 
        break;
      } 
    }

    if(foundIncome && foundOutCome){
      markedDays[dateJSON.dateJSON]={dots:[{color:'green'},{color:'red'}]}
    }else if(!foundIncome && foundOutCome){
      markedDays[dateJSON.dateString]={dots:[{color:'red'}]}
    }else if(foundIncome && !foundOutCome){
      markedDays[dateJSON.dateString]={dots:[{color:'green'}]}
    }else{/*if both false*/
      delete markedDays[dateJSON.dateString]
      //markedDays[dateString.dateString]={dots:[{}]}
    }
    await AsyncStorage.setItem('markedDays', JSON.stringify(markedDays));
    //console.log('markeddays:',markedDays)
  }

  _addMoreIn = () => {
 
    let newlyAddedValue = { index: this.index, isIncome:true}

    
    this.setState({
      defaultValues: {...this.state.defaultValues, [this.index]:{"index":this.index,"description":"", "amount":"", "category":""}},
      valueArray: [ ...this.state.valueArray, newlyAddedValue ]
    }, () =>
    {
      this.index = this.index + 1;
    })
   /* this.setState({valueArray: [ ...this.state.valueArray, newlyAddedValue ] },  () =>
    {
      this.index = this.index + 1;
    });*/
   
    this.addRowToAsyncStorage(newlyAddedValue).then(()=>{this.pushDefaultValuesToAsyncStorage()}).then(()=>{this.createMarksInDays()})
       
  }

  _addMoreOut=()=>{
    let newlyAddedValue = { index: this.index, isIncome:false}
    this.setState({
      defaultValues: {...this.state.defaultValues, [this.index]:{"index":this.index, "description":"", "amount":"","category":"Other"}},
      valueArray: [ ...this.state.valueArray, newlyAddedValue ]
    }, () =>
    {
      this.index = this.index + 1;
    })

    this.addRowToAsyncStorage(newlyAddedValue).then(()=>{this.pushDefaultValuesToAsyncStorage()}).then(()=>{this.createMarksInDays()})   
  }

  removeRow=(key)=>{
    /*deletes the item 
    *from the defaultValues array
    */
    let tempObj = {...this.state.defaultValues}
    for(const obj in tempObj){
      if(parseInt(obj)===key){
        /*on row remove, update the income,outcome*/
        /*for(var val of this.state.valueArray){
          if(val.isIncome && val.index===key){
            this.setState({
              income: this.state.income-tempObj[obj].amount
            })
            this.pushIncomeToAsyncStorage(-10)     
            break;      
          }else if(!val.isIncome && val.index===key){
            this.setState({
              outcome: this.state.outcome-tempObj[obj].amount
            })
            this.pushOutcomeToAsyncStorage()
            break; 
          }
        }*/
       // console.log('fordelete: ',tempObj[obj])
        delete tempObj[obj]
        
        //console.log(tempObj)
      }
    }
    /*sets state with the
    *new defaultValues
    */
    this.setState({
      valueArray: this.state.valueArray.filter(i => i.index !== key),
      defaultValues: tempObj
      //defaultValues
    },()=>{
      this.removeRowFromAsyncStorage(key).then(()=>{this.pushDefaultValuesToAsyncStorage().then(()=>{this.createMarksInDays();this.recalculateIncomesOutcomes().then(()=>{this.getIncomeOutcomeFromAsyncStorage()})})})
    });
    //this.recalculateIncomesOutcomes()
  }

  removeRowFromAsyncStorage = async (key) =>{
    let value = await AsyncStorage.getItem(year.toString());
    value = JSON.parse(value)
    //console.log(value[month][day.toString()]['rows'] )
    value[month][day.toString()]['rows'] = value[month][day.toString()]['rows'].filter(i => i.index !== key)
    //console.log(value[month][day.toString()]['rows'] )
    await AsyncStorage.setItem( year.toString(), JSON.stringify( value ) );
  }

  getPhotos = async() =>{
    if(!this.state.slideshowEnabled){
      try{
        let value = await AsyncStorage.getItem(year.toString())
        value = JSON.parse(value)
        let storedPhotos=[]
        storedPhotos = value[month][day.toString()]['photos']
        this.setState({slideshowEnabled:true,photos:storedPhotos})
      }catch(error){
        //console.log("getphotos: error")
      }
    }else{
      this.setState({
        slideshowEnabled:false
      })
    }
  }

  getNumOfPhotos = async() =>{
    try{
      let value = await AsyncStorage.getItem(year.toString())
      value = JSON.parse(value)
      let storedPhotos=[]
      storedPhotos = value[month][day.toString()]['photos']
      
      this.setState({numOfPhotos:storedPhotos.length})
      
    }catch(error){
      //console.log("getnumofphotos: error")
    }
  }

  addRowToAsyncStorage =  async (row) => {
    //console.debug(this.state.valueArray)
    console.debug(row)
    try {
      let value = await AsyncStorage.getItem(year.toString());
      
      if (value !== null) {//if year already in. You must check if the month is already in
        value = JSON.parse(value)
        //console.log(value)
        //_month=value[Object.keys(value)[0]]
        if(typeof value[month] === 'undefined'){ //if month isnt in then you must add the month plus the day
          value[month]=
                    {
                      'monthIncome': 0,
                      'monthOutcome': 0,
                      'monthFood': 0,
                      'monthEntertainment': 0,
                      'monthShopping': 0,
                      'monthBills': 0,
                      'monthHealth': 0,
                      'monthOther': 0,
                      [day]:{
                        'dayIncome': 0,
                        'dayOutcome': 0,
                        'dayFood': 0,
                        'dayEntertainment': 0,
                        'dayShopping': 0,
                        'dayBills': 0,
                        'dayHealth': 0,
                        'dayOther': 0,
                        'index': 0,
                        'rows':[],
                        'photos':[],
                        'data':{}
                      }
                    }
          value[month][day.toString()]['rows'].push(row)
          value[month][day.toString()]['index'] =  value[month][day.toString()]['index'] +1
          await AsyncStorage.setItem( year.toString(), JSON.stringify( value ) );
        }else if(typeof value[month][day.toString()] === 'undefined'){ //else if day isnt in, you must add the day
          value[month][day.toString()]=
          {
            'dayIncome': 0,
            'dayOutcome': 0,
            'dayFood': 0,
            'dayEntertainment': 0,
            'dayShopping': 0,
            'dayBills': 0,
            'dayHealth': 0,
            'dayOther': 0,
            'index': 0,
            'rows':[],
            'photos':[],
            'data':{}
          }
          value[month][day.toString()]['rows'].push(row)
          value[month][day.toString()]['index'] =  value[month][day.toString()]['index'] +1
          await AsyncStorage.setItem( year.toString(), JSON.stringify( value ) );
        }else{ //else if everything is in. year and month and day.
          value[month][day.toString()]['rows'].push(row)
          value[month][day.toString()]['index'] =  value[month][day.toString()]['index'] +1
          await AsyncStorage.setItem( year.toString(), JSON.stringify( value ) );
        }
        //console.log(value)
        
      }else{ //add year
        const objlit = {
          //year:{
            'yearIncome': 0,
            'yearOutcome': 0,
            'yearFood': 0,
            'yearEntertainment': 0,
            'yearShopping': 0,
            'yearBills': 0,
            'yearHealth': 0,
            'yearOther': 0,
            [month]:{
              'monthIncome': 0,
              'monthOutcome': 0,
              'monthFood': 0,
              'monthEntertainment': 0,
              'monthShopping': 0,
              'monthBills': 0,
              'monthHealth': 0,
              'monthOther': 0,
              [day]:{
                'dayIncome': 0,
                'dayOutcome': 0,
                'dayFood': 0,
                'dayEntertainment': 0,
                'dayShopping': 0,
                'dayBills': 0,
                'dayHealth': 0,
                'dayOther': 0,
                'index': 0,
                'rows': [],
                'photos':[],
                'data':{}
              }
            }
          //}
        }
        try {
          objlit[month][day.toString()]['rows'].push(row)
          objlit[month][day.toString()]['index'] =  objlit[month][day.toString()]['index'] +1
          await AsyncStorage.setItem(year.toString(), JSON.stringify(objlit));
        } catch (error) {
          //console.log('Error saving data'); 
        }
      }
      let tempDefaultValues=[];
    } catch (error) {
      //console.log('Error retrieving data'); 
    }
  }

  //debugging function
  _storeData = async () => {
    try {
      await AsyncStorage.setItem('kys', 'eleos');
    } catch (error) {
     // console.log('Error saving data'); 
    }
    //console.log('item set done')
  };
  //debugging function
  _getData = async () => {
    try {
      let value = await AsyncStorage.getItem(year.toString());
      if (value !== null) {
        // We have data!!
        //console.log("we have data!")
        //console.log(value);
      }else{
        //console.log('this key doesnt exist')
      }
    } catch (error) {
      //console.log('Error retrieving data'); 
    }
  };
  //debugging function
  removeValue = async () => {
    try {
      await AsyncStorage.removeItem(year.toString())
      await AsyncStorage.removeItem("markedDays")
    } catch(e) {
      // remove error
    } 
    //console.log('Done.')
  }
//debugging function: pushes a "row" in the asyncstorage
  testRow = async () =>{
    try {
      let value = await AsyncStorage.getItem(year.toString());
      value = JSON.parse(value)
      value[month][day.toString()]['rows'].push({ index: 16, isIncome:true })
      value[month][day.toString()]['rows'].push({ index: 15, isIncome:false })  
      await AsyncStorage.setItem(year.toString(), JSON.stringify(value))
      //console.log(value[month][day.toString()]['rows'])
    } catch(e) {
      // remove error
    }
  }

  handleInputText(key,text){
    //console.log(text)
   // console.log(key)
   
  }

/*   getTextStyle = (index) =>{//category-> transparent, all else pure white
    if(this.state.defaultValues[index]['category']===""){
     return {height: 50, width: 120, color:'white'} 
    }else{
      return {height: 50, width: 120, color:'white'} 
    }
  } */

  deletePhoto(){
    var RNFS = require('react-native-fs');
    RNFS.unlink(photoForDelete)
    //console.log(obj)
  }

  deletePhotoFromAsyncStorage = async() =>{
    try{
      var RNFS = require('react-native-fs');
      let value = await AsyncStorage.getItem(year.toString())
      value = JSON.parse(value)

     for(var i=0 ; i<value[month][day.toString()]['photos'].length ; i++){
        //console.log("val: ",value[month][day.toString()]['photos'][i],"delet: ",photoForDelete)
        if(value[month][day.toString()]['photos'][i].url===photoForDelete.url){
          value[month][day.toString()]['photos'].splice(i,1);
          i--;
        }
     }

     let photoz = value[month][day.toString()]['photos']

      await AsyncStorage.setItem( year.toString(), JSON.stringify(value));
      
      RNFS.unlink(photoForDelete.url)

      this.setState({photos:photoz, numOfPhotos:photoz.length, modalVisible:false})
    }catch(error){
     //console.log("deletePhotoFromAsyncStorage: error")
    }
  }


  render(){
   // const xButton = <IconButton name="close-circle-outline" color='red' size={25} touchableStyle={{position:'absolute', marginRight}}/>
    const slideShow =   
      <View>  
        <Slideshow 
          height={300}
          arrowSize = {25}
          onPress={(obj)=>{this.setState({modalVisible:true});photoForDelete=obj.image}}
          dataSource={
            this.state.photos
          }
        />
      </View>
    
    if(Object.keys(this.state.defaultValues).length === 0 ){
      return null;
    }
    //console.log("then:" ,this.state.defaultValues[0]['description'])
  

    const {navigate} = this.props.navigation;
    let newArray = this.state.valueArray.map(( item, key ) =>
    {
      if(item.isIncome === true){
        return(
          <InputComponent
            key = {item.index} 
          /*   onSubmitEditingDescription={()=>{console.log(this.state.description)}}
            onSubmitEditingAmount={()=>{console.log(this.state.amount)}} */

            onChangeTextDescription={(text) => 
              {
                let tempDefaultValues=[];
                //console.log(this.state.defaultValues);
                tempDefaultValues={...this.state.defaultValues};
                tempDefaultValues[item.index]["description"]=text;
                this.setState( {defaultValues:tempDefaultValues} );
                this.pushDefaultValuesToAsyncStorage()
              }
            }  
            
            onChangeTextAmount = {(text) => 
              {
                let tempDefaultValues=[];
                tempDefaultValues={...this.state.defaultValues};
                tempDefaultValues[item.index]["amount"]=text;
                
                if(isNaN(parseFloat(text))){
                  tempDefaultValues[item.index]["amount"]='0';
                  this.setState( {defaultValues:tempDefaultValues, amount: 0} );
                }else{
                  tempDefaultValues[item.index]["amount"]=text
                  this.setState( {defaultValues:tempDefaultValues, amount: parseFloat(text)} );
                }   
                this.pushDefaultValuesToAsyncStorage()
              }
            } 

            onEndEditingAmount = {()=>{
              this.recalculateIncomesOutcomes().then(()=>{this.getIncomeOutcomeFromAsyncStorage()})
             
             /* this.setState( {income: (this.state.income+parseInt(this.state.amount))},()=>{
                this.pushIncomeToAsyncStorage(parseInt(this.state.amount))
              } );*/
              
            }}

            amountValue= {this.state.defaultValues[item.index]['amount'].toString()==='0' ? '' : this.state.defaultValues[item.index]['amount'].toString()}
            descriptionValue={this.state.defaultValues[item.index]['description']}

            //pickerStyle = {this.getTextStyle(item.index)}
            selectedValue = {this.state.defaultValues[item.index]['category']}
            onValueChange = {(itemValue, itemIndex)=>{
              let tempDefaultValues=[];
              tempDefaultValues={...this.state.defaultValues}
              tempDefaultValues[item.index]['category'] = itemValue
              this.setState( {defaultValues:tempDefaultValues} );
              this.pushDefaultValuesToAsyncStorage()

            }   
            }
            //descriptionValue = ''
            //amountValue = {item.amount.toString()}
            //onPressCamera={()=>{navigate('Third',{day: dateString})}} 
            //onPressAlbum={this.getPhotos}
            //onPressRemove={async ()=>{await this.removeRow(item.index); await this.recalculateIncomesOutcomes(); this.getIncomeOutcomeFromAsyncStorage()}}
            //onPressRemove={()=>{this.removeRow(item.index)}}
            onPressRemove={()=>{this.removeRow(item.index)}}
            color='#009688'
            isIncome = {true}
          />
        );
      }else{
        return(
          <InputComponent
            key={item.index}
            //onSubmitEditingDescription={(text)=>{this.handleInputText(key,text)}}
            onChangeTextDescription={(text) => 
              {
                let tempDefaultValues=[];
                //console.log(this.state.defaultValues);
                tempDefaultValues={...this.state.defaultValues};
                tempDefaultValues[item.index]["description"]=text;
                this.setState( {defaultValues:tempDefaultValues} );
                this.pushDefaultValuesToAsyncStorage()
              }
            } 
            
            onChangeTextAmount = {(text) => 
              {
                let tempDefaultValues=[];
                tempDefaultValues={...this.state.defaultValues};
                tempDefaultValues[item.index]["amount"]=text;
                
                if(isNaN(parseFloat(text))){
                  tempDefaultValues[item.index]["amount"]='0';
                  this.setState( {defaultValues:tempDefaultValues, amount: 0} );
                }else{
                  tempDefaultValues[item.index]["amount"]=text
                  this.setState( {defaultValues:tempDefaultValues, amount: parseFloat(text)} );
                }   
                this.pushDefaultValuesToAsyncStorage()
              }
            }
            onEndEditingAmount = {()=>{
              this.recalculateIncomesOutcomes().then(()=>{this.getIncomeOutcomeFromAsyncStorage()})
              
             /* this.setState( {outcome: (this.state.outcome+parseInt(this.state.amount)), amount:'0'} );
              this.pushOutcomeToAsyncStorage()*/
            }}
            amountValue= {this.state.defaultValues[item.index]['amount'].toString()==='0' ? '' : this.state.defaultValues[item.index]['amount'].toString()}
            descriptionValue={this.state.defaultValues[item.index]['description']}

            //pickerStyle = {this.getTextStyle(item.index)}
            selectedValue = {this.state.defaultValues[item.index]['category']}
            onValueChange = {(itemValue, itemIndex)=>{
              let tempDefaultValues=[];
              tempDefaultValues={...this.state.defaultValues}
              tempDefaultValues[item.index]['category'] = itemValue
              this.setState( {defaultValues:tempDefaultValues} );
              this.pushDefaultValuesToAsyncStorage().then(()=>{
                this.recalculateIncomesOutcomes()
              })

            }   
            }

           // onPressRemove={async ()=>{await this.removeRow(item.index); await this.recalculateIncomesOutcomes(); this.getIncomeOutcomeFromAsyncStorage()}}
            onPressRemove={()=>{this.removeRow(item.index)}}
            color='#ff6666'
            isIncome = {false}
          />
        );
      } 
    })


    return(
      <View style={styles.container}>
          <View style = {styles.bottomTextsContainer}>
            <Text style={{flex:1,color:'#009688',fontWeight:'bold'}}>{`Income\n`}{this.state.income.toFixed(2)}</Text>
            <Text style={{flex:1,color:'#ff6666',fontWeight:'bold'}}>{`Outcome\n`}{this.state.outcome.toFixed(2)}</Text>
            <Text style={{flex:1,color:'#3949ab',fontWeight:'bold'}}>{`Balance\n`}{(this.state.income-this.state.outcome).toFixed(2)}</Text>
          </View>
        <View style={{flex:1}}>
          <ScrollView > 
            {newArray}
          </ScrollView>
            <Modal 
              isVisible={this.state.modalVisible} 
              coverScreen={true} 
              onBackButtonPress={()=>{this.setState({modalVisible: false})}}
              style={{flexDirection:'column', justifyContent:'flex-end'}}
              //hideModalContentWhileAnimating={true}
              animationOutTiming={1000}
              //style={{marginBottom:60}}
            >
              <View style={{ flex: 0.3,backgroundColor:'white', marginBottom:"30%" }}>
                <Text style={{fontSize:25,alignSelf:'center'}}>Delete Photo?</Text>
                <View style={{marginTop:10,marginLeft:"30%",marginRight:"30%"}}>
                  <Button
                      title="Yes"
                      color="gray"
                      onPress = {()=>{this.deletePhotoFromAsyncStorage()}}
                  />
                </View>
                <View style={{marginTop:10,marginLeft:"30%",marginRight:"30%"}}>
                  <Button
                    title="No"
                    color="gray"
                    onPress={()=>{this.setState({modalVisible: false})}}
                  />
                </View>
              </View>
            </Modal>
           
          {this.state.slideshowEnabled ? slideShow : null}   
        </View>
        
        <View style={styles.bottomButtonsContainer}>
          {/*<IconButton size={50} name = "camera" style={styles.buttonStyle} />
          <IconButton size={50} name = "md-photos" />*/}
          <View style={{flex:1,borderRightWidth:0.4,borderRightColor:'gray'}}>
            <TouchableOpacity onPress={()=>{navigate('CameraScreen',{dateJSON: dateJSON})}}  >
              <Icon  name='camera' style={{alignSelf:'center'}}/>
            </TouchableOpacity>
          </View>
          <View style={{flex:1}}>
            <TouchableOpacity onPress={()=>{this.getPhotos()}} style={{flexDirection:'row',justifyContent:'center'}}>
              <Icon  name='md-photos' style={{alignSelf:'center'}}/>
              <Text style={{fontSize:16,fontWeight:'bold',marginTop:2.5}}>({this.state.numOfPhotos})</Text>
            </TouchableOpacity>
          </View>
        </View>        
      </View>       
    )        
  } 
}





styles ={
    container:{
        flex: 1,
        flexDirection:'column',
  },
    bottomTextsContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth:0.6,
        borderColor:'gray'
    },
    bottomButtonsContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth:0.6,
        borderColor:'gray'
    },
    buttonView:{
        flex: 1,
    },
    buttonStyle:{
        borderRadius: 10,
        borderWidth: 1,
        borderColor:'red'
    }
}


export default InputScreen;