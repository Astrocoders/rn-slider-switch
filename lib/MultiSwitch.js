import React, { Component } from 'react'
import { Animated, Dimensions, PanResponder, View, Text, Platform } from 'react-native'
import Button from './Button'
import styles from './styles'
const { width } = Dimensions.get('window')
import PropTypes from 'prop-types'

export default class MultiSwitch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isComponentReady: false,
      position: new Animated.Value(0),
      posValue: 0,
      selectedPosition: 0,
      duration: 100,
      mainWidth: width - 30,
      switcherWidth: width / 2.7,
      thresholdDistance: width - 8 - width / 2.4,
    }
    this.isParentScrollDisabled = false
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: () => {
        // disable parent scroll if slider is inside a scrollview
        if (!this.isParentScrollDisabled) {
          this.props.disableScroll(false)
          this.isParentScrollDisabled = true
        }
      },

      onPanResponderMove: (evt, gestureState) => {
        let finalValue = gestureState.dx + this.state.posValue
        if (finalValue >= 0 && finalValue <= this.state.thresholdDistance)
          this.state.position.setValue(this.state.posValue + gestureState.dx)
      },

      onPanResponderTerminationRequest: () => true,

      onPanResponderRelease: (evt, gestureState) => {
        let finalValue = gestureState.dx + this.state.posValue
        this.isParentScrollDisabled = false
        this.props.disableScroll(true)
        if (gestureState.dx > 0) {
          if (finalValue >= 0 && finalValue <= 30) {
            this.firstSelected()
          } else if (finalValue >= 30 && finalValue <= 121) {
            this.secondSelected()
          } else if (finalValue >= 121 && finalValue <= 280) {
            if (gestureState.dx > 0) {
              this.thirdSelected()
            } else {
              this.secondSelected()
            }
          }
        } else {
          if (finalValue >= 78 && finalValue <= 175) {
            this.secondSelected()
          } else if (finalValue >= -100 && finalValue <= 78) {
            this.firstSelected()
          } else {
            this.thirdSelected()
          }
        }
      },

      onPanResponderTerminate: () => {},
      onShouldBlockNativeResponder: () => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true
      },
    })
  }

  firstSelected = () => {
    if (this.state.selectedPosition === 0) return

    Animated.timing(this.state.position, {
      toValue: Platform.OS === 'ios' ? -2 : 0,
      duration: this.state.duration,
    }).start()
    setTimeout(() => {
      this.setState({
        posValue: Platform.OS === 'ios' ? -2 : 0,
        selectedPosition: 0,
      })
    }, 100)
    if (this.state.isComponentReady) this.props.onStatusChanged(this.props.firstButton.value)
  }

  secondSelected = () => {
    if (this.state.selectedPosition === 1) return

    Animated.timing(this.state.position, {
      toValue: this.state.mainWidth / 2 - this.state.switcherWidth / 2,
      duration: this.state.duration,
    }).start()
    setTimeout(() => {
      this.setState({
        posValue: this.state.mainWidth / 2 - this.state.switcherWidth / 2,
        selectedPosition: 1,
      })
    }, 100)
    if (this.state.isComponentReady) this.props.onStatusChanged(this.props.secondButton.value)
  }

  thirdSelected = () => {
    if (this.state.selectedPosition === 2) return

    Animated.timing(this.state.position, {
      toValue:
        Platform.OS === 'ios'
          ? this.state.mainWidth - this.state.switcherWidth
          : this.state.mainWidth - this.state.switcherWidth - 2,
      duration: this.state.duration,
    }).start()
    setTimeout(() => {
      this.setState({
        posValue:
          Platform.OS === 'ios'
            ? this.state.mainWidth - this.state.switcherWidth
            : this.state.mainWidth - this.state.switcherWidth - 2,
        selectedPosition: 2,
      })
    }, 100)
    if (this.state.isComponentReady) this.props.onStatusChanged(this.props.thirdButton.value)
  }

  getStatus = () => {
    switch (this.state.selectedPosition) {
      case 0:
        return this.props.firstButton.value
      case 1:
        return this.props.secondButton.value
      case 2:
        return this.props.thirdButton.value
    }
  }

  getButton = () => {
    switch (this.state.selectedPosition) {
      case 0:
        return this.props.firstButton
      case 1:
        return this.props.secondButton
      case 2:
        return this.props.thirdButton
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          label={this.props.firstButton.label}
          type={this.props.firstButton.value}
          onPress={this.firstSelected}
        />
        <Button
          label={this.props.secondButton.label}
          type={this.props.secondButton.value}
          onPress={this.secondSelected}
        />
        <Button
          label={this.props.thirdButton.label}
          type={this.props.thirdButton.value}
          onPress={this.thirdSelected}
        />
        <Animated.View
          {...this._panResponder.panHandlers}
          style={[
            styles.switcher,
            {
              transform: [{ translateX: this.state.position }],
            },
          ]}
        >
          <Button
            label={this.getButton().label}
            type={this.getStatus()}
            active={true}
            activeColor={this.props.activeColor}
          />
        </Animated.View>
      </View>
    )
  }
}

MultiSwitch.propTypes = {
  disableScroll: PropTypes.func,
  onStatusChanged: PropTypes.func.isRequired,
  activeColor: PropTypes.string,
  firstButton: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  secondButton: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  thirdButton: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
}

MultiSwitch.defaultProps = {
  disableScroll: () => {},
  activeColor: '#38AD02',
}
