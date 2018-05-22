import React from 'react';
import PropTypes from 'prop-types';
import {
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Picker,
  Alert,
  KeyboardAvoidingView,
  Keyboard,
  BackHandler,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import Header from '../components/Header';
import {
  REGISTER_FAIL_TITLE,
  TITULAR_COUNSELOR,
  SURROGATE_COUNSELOR,
  MUNICIPAL_COUNSELOR_CAE,
  STATE_COUNSELOR_CAE,
  PRESIDENT_COUNSELOR,
  COMMON_COUNSELOR,
  EXECUTIVE_POWER,
  EDUCATION_WORKERS,
  STUDENT_PARENTS,
  CIVILIAN_ENTITIES,
} from '../constants/generalConstants';
import { logInfo } from '../../logConfig/loggers';
import brazilianStates from '../constants/brazilianStates';
import GenericField from '../components/GenericField';
import DropdownComponent from '../components/DropdownComponent';
import MunicipalDistrict from '../components/MunicipalDistrict';
import ButtonWithActivityIndicator from '../components/ButtonWithActivityIndicator';
import { backHandlerPop } from '../NavigationFunctions';

import styles from '../Styles/RegisterStyles';
import regex from '../../src/RegexList';

const FILE_NAME = 'RegisterScreen.js';

const UfInitials = (CAE_UF) => {
  if (CAE_UF !== '') {
    return CAE_UF.substr(0, 2);
  }

  return '';
};

export default class RegisterScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      name: '',
      password: '',
      profile: {
        cpf: '',
        phone: '',
        isPresident: '',
        presidentChecked: false,
        counselorType: '',
        segment: '',
        CAE_Type: '',
        CAE_UF: '',
        CAE_municipalDistrict: '',
        CAE: '',
      },
      passwordCompared: '',
    };

    this.register = this.register.bind(this);
    this.checkEqualPassword = this.checkEqualPassword.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', backHandlerPop);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', backHandlerPop);
  }

  checkEqualPassword(toCompare) {
    return toCompare === this.state.password;
  }

  // Verify if there's a error in some field form.
  register() {
    let error = false;
    const errorMessage = 'Por favor, verifique os dados se todos os dados foram inseridos e são válidos!';

    // Validation for form fields using GenericField
    if (!this.state.name ||
      !this.state.profile.cpf ||
      !this.state.email ||
      !this.state.profile.phone ||
      !this.state.password ||
      !this.state.passwordCompared) {
      console.warn('Erro no registro');
      error = true;
    }

    // Validating CAE information input
    if (this.state.profile.isPresident === '' ||
    this.state.profile.counselorType === '' ||
    this.state.profile.segment === '' ||
    this.state.profile.CAE_Type === '' ||
    this.state.profile.CAE_UF === '' ||
    (this.state.profile.CAE_Type === MUNICIPAL_COUNSELOR_CAE &&
      this.state.profile.CAE_municipalDistrict === '')) {
      error = true;
    }

    // Checking if was found a irregularity in register fields.
    if (error === false) {
      this.props.asyncRegisterCounselor(this.state);
    } else {
      Alert.alert(REGISTER_FAIL_TITLE, errorMessage);
    }
  }

  render() {
    logInfo(FILE_NAME, 'render()',
      `State of register page: ${JSON.stringify(this.state, null, 2)}`);

    return (
      <View style={styles.principal}>
        <Header />
        <KeyboardAvoidingView style={styles.content} behavior="padding">
          <ScrollView>
            <View style={{ paddingHorizontal: 15 }}>

              {/* Name Field */}
              <GenericField
                header="Nome"
                placeholderMessage="Qual o seu nome?"
                icon="user"
                setStateValue={newValue => this.setState({ name: newValue })}
                regexInput={regex.nameRegex}
                errorMessage="Por favor, digite um nome compatível."
              />

              {/* CPF Field */}
              <GenericField
                header="CPF"
                placeholderMessage="Informe o seu CPF"
                icon="id-card"
                setStateValue={newValue =>
                  this.setState({ profile: { ...this.state.profile, cpf: newValue } })}
                keyboardType="numeric"
                regexInput={regex.cpfRegex}
                errorMessage="Por favor, informe um CPF válido."
              />

              {/* Email Field */}
              <GenericField
                header="Email"
                placeholderMessage="Informe um email que você tenha acesso"
                icon="at"
                setStateValue={newValue => this.setState({ email: newValue })}
                keyboardType="email-address"
                regexInput={regex.emailRegex}
                errorMessage="Por favor, informe um email válido."
              />

              {/* Password Field */}
              <GenericField
                header="SENHA"
                placeholderMessage="Informe uma senha para acesso"
                icon="unlock-alt"
                setStateValue={newValue => this.setState({ password: newValue })}
                regexInput={regex.passwordRegex}
                secureInput
                maxSize={30}
                errorMessage="Sua senha deve ter no mínimo 6 digitos e nenhum espaço"
              />

              {/* Password Confirmation Field */}
              <GenericField
                header="VALIDAR SENHA"
                placeholderMessage="Informe novamente a senha digitada acima"
                icon="unlock-alt"
                setStateValue={newValue => this.setState({ passwordCompared: newValue })}
                regexInput={regex.passwordRegex}
                customValidator={this.checkEqualPassword}
                secureInput
                maxSize={30}
                errorMessage="As senhas não são iguais"
              />

              {/* Phone Field */}
              <GenericField
                header="TELEFONE"
                placeholderMessage="Informe o seu telefone"
                icon="phone"
                setStateValue={newValue =>
                  this.setState({ profile: { ...this.state.profile, phone: newValue } })}
                keyboardType="phone-pad"
                regexInput={regex.phoneRegex1}
                errorMessage="Por favor, digite um telefone válido (DDD Telefone)."
              />

              <Text>Cargo</Text>
              <DropdownComponent
                selectedValue={this.state.profile.isPresident}
                callback={isPresidentChecked =>
                  this.setState(
                    { profile: { ...this.state.profile, isPresident: isPresidentChecked } },
                  )}
                pickerTitle={[
                  <Picker.Item value="" label="Escolha seu cargo" color="#95a5a6" />,
                ]}
                pickerBody={[
                  <Picker.Item value label={PRESIDENT_COUNSELOR} />,
                  <Picker.Item value={false} label={COMMON_COUNSELOR} />,
                ]}
              />

              <Text>Tipo de Conselheiro</Text>
              <DropdownComponent
                selectedValue={this.state.profile.counselorType}
                callback={counselorTypeChecked => this.setState(
                  { profile: { ...this.state.profile, counselorType: counselorTypeChecked } },
                )}
                pickerTitle={[
                  <Picker.Item value="" label="Escolha seu cargo" color="#95a5a6" />,
                ]}
                pickerBody={[

                  <Picker.Item value={TITULAR_COUNSELOR} label={TITULAR_COUNSELOR} />,
                  <Picker.Item value={SURROGATE_COUNSELOR} label={SURROGATE_COUNSELOR} />,
                ]}
              />

              <Text>Segmento</Text>
              <DropdownComponent
                selectedValue={this.state.profile.segment}
                callback={segmentChecked => this.setState({
                  profile: {
                    ...this.state.profile,
                    segment: segmentChecked,
                  },
                })}
                pickerTitle={[
                  <Picker.Item value="" label="Escolha seu segmento" color="#95a5a6" />,
                ]}
                pickerBody={[
                  <Picker.Item value={EXECUTIVE_POWER} label={EXECUTIVE_POWER} />,
                  <Picker.Item value={EDUCATION_WORKERS} label={EDUCATION_WORKERS} />,
                  <Picker.Item value={STUDENT_PARENTS} label={STUDENT_PARENTS} />,
                  <Picker.Item value={CIVILIAN_ENTITIES} label={CIVILIAN_ENTITIES} />,
                ]}
              />

              <Text>Tipo do CAE</Text>
              <DropdownComponent
                selectedValue={this.state.profile.CAE_Type}
                callback={caeType => (
                  caeType === STATE_COUNSELOR_CAE ?
                    this.setState({
                      profile: {
                        ...this.state.profile,
                        CAE_Type: caeType,
                        CAE_municipalDistrict: '',
                        CAE: `${UfInitials(this.state.profile.CAE_UF)}`.trim(),
                      },
                    })
                    :
                    this.setState({
                      profile: {
                        ...this.state.profile,
                        CAE_Type: caeType,
                        CAE: `${this.state.profile.CAE_municipalDistrict} ${UfInitials(this.state.profile.CAE_UF)}`.trim(),
                      },
                    })
                )}
                pickerTitle={[
                  <Picker.Item value="" label="Escolha o Tipo do seu CAE" color="#95a5a6" />,
                ]}
                pickerBody={[
                  <Picker.Item value={MUNICIPAL_COUNSELOR_CAE} label={MUNICIPAL_COUNSELOR_CAE} />,
                  <Picker.Item value={STATE_COUNSELOR_CAE} label={STATE_COUNSELOR_CAE} />,
                ]}
              />

              <Text>UF do CAE</Text>
              <DropdownComponent
                selectedValue={this.state.profile.CAE_UF}
                callback={checkedUf => this.setState({
                  profile: {
                    ...this.state.profile,
                    CAE_UF: checkedUf,
                    CAE_municipalDistrict: '',
                    CAE: `${this.state.profile.CAE_municipalDistrict} ${checkedUf.substr(0, 2)}`.trim(),
                  },
                })}
                pickerTitle={[
                  <Picker.Item value="" label="Escolha a UF do seu CAE" color="#95a5a6" />,
                ]}
                pickerBody={
                  brazilianStates.estados.map(
                    item => (<Picker.Item label={item} value={item} color="#000000" />))}
              />

              {this.state.profile.CAE_Type === MUNICIPAL_COUNSELOR_CAE && this.state.profile.CAE_UF !== '' && (
                <MunicipalDistrict
                  selectedValue={this.state.profile.CAE_municipalDistrict}
                  callback={checkedValue => this.setState({
                    profile: {
                      ...this.state.profile,
                      CAE_municipalDistrict: checkedValue,
                      CAE: `${checkedValue} ${UfInitials(this.state.profile.CAE_UF)}`.trim(),
                    },
                  })}
                  UfInitials={UfInitials(this.state.profile.CAE_UF)}
                />
              )}

              <Text>CAE</Text>
              <View style={[styles.InputFieldStyle, { justifyContent: 'center' }]}>
                <Text>
                  {this.state.profile.CAE_municipalDistrict} {UfInitials(this.state.profile.CAE_UF)}
                </Text>
              </View>

              <ButtonWithActivityIndicator
                activityIndicatorStyle={{ marginTop: 15, marginBottom: 15 }}
                onPress={() => {
                  Keyboard.dismiss();
                  this.register();
                }}
                isLoading={this.props.isLoading}
                buttonKey="userCreation"
                buttonText="Concluir"
                buttonStyle={styles.buttonContainer}
              />

            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => Actions.loginScreen()}
          >
            <Text>Já tem um cadastro?
              <Text style={{ color: 'blue' }}> Entrar</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    );
  }
}

RegisterScreen.propTypes = {
  asyncRegisterCounselor: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
