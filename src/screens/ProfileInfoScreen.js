import React from 'react'
import {StyleSheet, Text, ScrollView, View, TextInput, TouchableOpacity,Picker, Button, Image} from 'react-native'
import { connect } from 'react-redux';
//import { asyncCreateCounselor } from '../actions/counselorActions';
import { asyncGetCounselor } from '../actions/counselorActions';

const iconName = require('../images/ic_face.png');
const iconCpf = require('../images/ic_account_circle.png');
const iconPhone = require('../images/ic_phone.png');
const iconEmail = require('../images/ic_email.png');
const iconJob = require('../images/ic_work.png');
const iconSegment = require('../images/ic_supervisor_account.png');
const iconCAE = require('../images/ic_location_city.png');
const iconCAE_TYPE = require('../images/ic_domain.png');

class ProfileInfoScreen extends React.Component{

    componentWillMount(){
      this.props.getCounselor(this.props.counselor.id);
    }

    verificaCargo() {
      if (this.props.counselor.isPresident){
        return (
          <View style = {styles.field}>
            <Image source={iconJob} style={styles.icon}/>
          <Text>Cargo: Presidente </Text>
          </View>
        );
      }
      return (
        <View style = {styles.field}>
          <Image source={iconJob} style={styles.icon}/>
        <Text>Cargo: Conselheiro </Text>
        </View>
      );
    }


    render() {

        return (
          <ScrollView style={styles.principal}>
            <View style={styles.topo}>
               <Text style={styles.textLogo}>PERFIL</Text>
             </View>
            <View style={styles.conteudo}>
              <Text> </Text>
                <View style = {styles.field}>
                  <Image source={iconName} style={styles.icon}/>
                  <Text>Nome: {this.props.counselor.name}</Text>
                </View>
                <View style = {styles.field}>
                  <Image source={iconCpf} style={styles.icon}/>
                  <Text>CPF: {this.props.counselor.cpf}</Text>
                </View>
                <View style = {styles.field}>
                  <Image source={iconPhone} style={styles.icon}/>
                  <Text>Telefone: {this.props.counselor.phone}</Text>
                </View>
                <View style = {styles.field}>
                  <Image source={iconEmail} style={styles.icon}/>
                  <Text>Email: {this.props.counselor.email}</Text>
                </View>
                {this.verificaCargo()}
                <View style = {styles.field}>
                  <Image source={iconSegment} style={styles.icon}/>
                  <Text>Segmento: {this.props.counselor.segment}</Text>
                </View>
                <View style = {styles.field}>
                  <Image source={iconCAE} style={styles.icon}/>
                  <Text>CAE: {this.props.counselor.CAE}</Text>
                </View>
                <View style = {styles.field}>
                  <Image source={iconCAE_TYPE} style={styles.icon}/>
                  <Text>Tipo do CAE: {this.props.counselor.CAE_Type}</Text>
                </View>
            </View>
          </ScrollView>
        );
    }
}

const mapStateToProps = (state) => {
  console.log(state);
    return{
        counselor: state.counselor
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        getCounselor(id){
            dispatch(asyncGetCounselor(id));
        }

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfoScreen);


const styles = StyleSheet.create({
  topo: {
    flex: 1.2,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#FF9500',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'

    },

    textLogo: {
        fontSize: 30,
        color:'white',
        fontWeight:'bold',
        marginTop:30,
    },

    field: {
        backgroundColor : '#FAFAFA',
        paddingVertical:4,
        borderWidth: 1,
        borderRadius: 7,
        borderColor: 'gray',
        marginHorizontal: 15,
        marginBottom: 30,
        justifyContent: 'flex-start',
        paddingLeft: 2,
        paddingRight: 4,
        flexDirection: 'row',
        alignItems: 'center',
      },

    principal: {
      flex: 1,
    },

    buttonContainer: {
      paddingVertical:10,
      borderWidth: 1,
      borderRadius: 7,
      marginHorizontal: 15,
      marginTop: 30,
      marginBottom: 20,
      backgroundColor: '#FF9500',
      justifyContent: 'flex-end'
    },

    buttonText:{
      textAlign: 'center',
      color: '#FFF'
    },

    conteudo: {
        backgroundColor : 'white',
        marginBottom: 9,
        flex: 6,
        flexDirection: 'column'

    },

    icon: {
         width: 30,
         height: 30,
         margin: 5
     }
});