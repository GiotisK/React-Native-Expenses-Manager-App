import React from 'react';
import { Text, View, Dimensions } from 'react-native';
import Table from 'react-native-simple-table'
import AsyncStorage from '@react-native-community/async-storage';





const columns = [
  {
    title: 'Description',
    dataIndex: 'description',
    width: Dimensions.get('window').width/3
  },
  {
    title: 'Category',
    dataIndex: 'category',
    width: Dimensions.get('window').width/3
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    width: Dimensions.get('window').width/3
  },

];

class OutcomeTab extends React.Component {
  constructor(){
    super();
    this.state ={
      data: [],
      totalOutcome: 0
      
    }
  }

  componentDidMount(){
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      this.getRowsFromAsyncStorage()
    })
  }

  getRowsFromAsyncStorage = async() => {
    let value = await AsyncStorage.getItem("2019")
    value = JSON.parse(value)
    let arr = []
    let totalOutcome = 0
    for(var i in value["May"]["18"]['data'] ){
      let row = value["May"]["18"]['data'][i]
      if(row.category !=='' && row.amount !=''){
        if(row.description == ''){
          arr.push({description: 'No descr.', category: row.category, amount: row.amount})
        }else{
          arr.push({description: row.description, category: row.category, amount: row.amount})
        } 
        totalOutcome += parseFloat(row.amount) 
      }
    }

    this.setState({
      data: arr,
      totalOutcome
    })
  }

  render() {
    return (
      <View style={{justifyContent:'center', alignItems:'center'}}>
          <Table 
          columns={columns} 
          dataSource={this.state.data}        
          />
      </View>   
    );
  }

}

OutcomeTab.navigationOptions = {
  header:null
}


const styles = {
    ViewStyle:{
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center'
    }
}


export default OutcomeTab;