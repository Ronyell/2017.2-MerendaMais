import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Text, View, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import styles from '../Styles/GeneralStyles';

export default class GenericField extends Component {
  constructor(props) {
    super(props);

    this.state = {
      styleInUse: styles.genericViewSection,
      errorTextArea: <Text />,
      text: '',
    };
  }

  // This calls the appropriate function to validate text
  handleInput(newText) {
    if (this.props.customValidator === undefined) {
      this.setState({ text: newText.trim() }, () => {
        this.validateByRegex(this.state.text, this.props.regexInput);
      });
    } else {
      this.setState({ text: newText.trim() }, () => {
        this.validateByCustom(this.state.text);
      });
    }
  }

  // This is called after validateText() evaluation, if success
  handleValidText() {
    this.setState({ errorTextArea: <Text /> });
    this.setState({ styleInUse: [styles.InputFieldStyle, { borderColor: '#80FF80', backgroundColor: '#d1ffd1', borderWidth: 2 }] });
  }

  // This is called after validateText() evaluation, if failed
  handleInvalidText() {
    this.setState({ errorTextArea: <Text>{this.props.errorMessage}</Text> });
    this.setState({ styleInUse: [styles.InputFieldStyle, { borderColor: '#FF9999', backgroundColor: '#ffd6d6', borderWidth: 2 }] });
  }

  // This is called after checking if a text is valid or not
  validateText(text, isTextValid) {
    if (isTextValid) {
      // setStateValue is the function in props at the component creation
      this.props.setStateValue(this.state.text);
      this.handleValidText();
    } else if (!isTextValid && text === '') {
      // This case is for empty text
      this.setState({ styleInUse: styles.genericViewSection });
    } else {
      this.handleInvalidText();
      this.props.setStateValue('');
    }
  }

  // Validates the text by regex and calls validateText()
  validateByRegex(text, regexTest) {
    if (regexTest.global) {
      console.warn('validateText()', 'RegExp using global flag! The results may be wrong.');
    }

    const isTextValid = regexTest.test(text) && text.length <= this.props.maxSize;
    this.validateText(text, isTextValid);
  }

  // Validates the text by a custom function and calls validateText()
  // OBS: You should provide a boolean function at component props instance!
  validateByCustom(text) {
    const isTextValid = this.props.customValidator(text);
    this.validateText(text, isTextValid);
  }

  render() {
    return (
      <View>
        <Text> {this.props.header.toUpperCase().trim()} </Text>
        <View style={this.state.styleInUse}>
          <FontAwesome name={this.props.icon} style={styles.icon} size={26} color="black" />
          <TextInput
            style={styles.InputStyle}
            placeholder={this.props.placeholderMessage.trim()}
            placeholderTextColor="#565454"
            value={this.state.test}
            keyboardType={this.props.keyboardType}
            underlineColorAndroid="transparent"
            secureTextEntry={this.props.secureInput}
            onChangeText={text => this.handleInput(text)}
          />
        </View>

        {this.state.errorTextArea}
      </View>
    );
  }
}

GenericField.propTypes = {
  header: PropTypes.string.isRequired,
  placeholderMessage: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  setStateValue: PropTypes.func.isRequired,
  regexInput: PropTypes.string.isRequired,
  customValidator: PropTypes.any, // eslint-disable-line
  maxSize: PropTypes.number,
  keyboardType: PropTypes.string,
  secureInput: PropTypes.bool,
  errorMessage: PropTypes.string.isRequired,
};

GenericField.defaultProps = {
  secureInput: false,
  keyboardType: 'default',
  maxSize: 300,
  customValidator: undefined,
};

// export default GenericField;
