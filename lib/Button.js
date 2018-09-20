/* Switch Button Component class
 */
import React from 'react'
import { Image, TouchableOpacity, View, Text } from 'react-native'
import styles from './styles'
import PropTypes from 'prop-types'

const Button = props => {
  return (
    <View>
      <TouchableOpacity onPress={props.onPress} style={styles.buttonStyle}>
        <Text style={[styles.buttonLabel, { color: props.active ? '#38AD02' : '#999999' }]}>
          {props.label}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

Button.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  active: PropTypes.bool,
  onPress: PropTypes.func,
}

Button.defaultProps = {
  active: false,
}

export default Button
