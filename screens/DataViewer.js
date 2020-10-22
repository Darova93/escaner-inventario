import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import AppButton from '../components/AppButton';

import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';

import CodeStorage from './CodeStorage';
import PropTypes from 'prop-types';


export default class DataViewer extends React.Component {
    constructor(props) {
        super(props);
        this.codeList = CodeStorage.getInstance().getCodeList();
    }

    exportCSV = () => {
        let csvContent = this.codeList.map(e => e.id + "," + e.name + "," + e.type + "," + e.data + "," + e.count + "," + e.date).join("\n");
        FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "productos.csv", csvContent);  
    };

    sendCSV = () => {
        this.exportCSV();
        if(!MailComposer.isAvailableAsync()) {
            alert("No está disponible el servicio de correos");
        }
        else {
            MailComposer.composeAsync({
                recipients:['darova93@gmail.com'],
                subject: 'Archivo de códigos',
                body: '',
                isHTML: false,
                attachments: [FileSystem.documentDirectory + "productos.csv"]
            });
        }
    };

    render() {
        const { isFocused } = this.props;

        return (
            <View style={styles.container}>
                <StatusBar style={styles.statusBar} />
                <FlatList 
                    style={styles.list}
                    data={this.codeList}
                    keyExtractor={item => item.data}
                    renderItem={({item}) => <Text style={styles.item}>Id: {item.id} Name: {item.name} Code: {item.data} Count: {item.count}</Text>}
                >  
                </FlatList>
                <View style={styles.options}>
                    <AppButton
                        text="Enviar"
                        onPress={this.sendCSV}
                    />
                </View>
            </View>
        );
    }
}

AppButton.propTypes = {
    isFocused: PropTypes.bool,
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    statusBar: {
        backgroundColor: 'black',
    },
    list: {
        flex: 1,
        margin: 10,
    },
    item: {
        paddingHorizontal: 10,
        paddingBottom: 5,
        fontSize: 16,
    }
});