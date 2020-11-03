import { StyleSheet, TouchableOpacity, Text } from "react-native";
import React from 'react';
import PropTypes from 'prop-types';

export default class AppButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity 
                style={{...styles.appButtonContainer, ...this.props.style}}
                onPress={this.props.onPress}
            >
                <Text style={styles.appButtonText}>{this.props.text}</Text>
            </TouchableOpacity>
        );
    }
}

AppButton.propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    style: PropTypes.object,
}

const styles = StyleSheet.create({
    appButtonContainer: {
        backgroundColor: 'green',
        padding: 16,
        borderRadius: 4,
        flex: 1,
    },
    appButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "bold",
        alignSelf: "center",
    }
});