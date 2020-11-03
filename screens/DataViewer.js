import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import AppButton from '../components/AppButton';
import * as FileSystem from 'expo-file-system';
import * as MailComposer from 'expo-mail-composer';
import CodeStorage from './CodeStorage';

export default function DataViewer({ navigation }) {
    const [codeList, setList] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            (async () => {
                promise = CodeStorage.getInstance().getCodeList();
                promise.then((result) => {
                    setList(result);
                });
            })();
        });
        return unsubscribe;
    }, [navigation]);

    const exportCSV = () => {
        let csvContent = this.codeList.map(e => e.name + "," + e.type + "," + e.data + "," + e.count + "," + e.date).join("\n");
        FileSystem.writeAsStringAsync(FileSystem.documentDirectory + "productos.csv", csvContent);  
    };

    const sendCSV = () => {
        exportCSV();
        if(!MailComposer.isAvailableAsync()) {
            alert("No está disponible el servicio de correos");
        }
        else {
            MailComposer.composeAsync({
                recipients:['solorioe.93@gmail.com'],
                subject: 'Archivo de códigos',
                body: '',
                isHTML: false,
                attachments: [FileSystem.documentDirectory + "productos.csv"]
            });
        }
    };

    const clearCodes = () => {
        CodeStorage.getInstance().removeAllCodes();
    }

    return (
        <View style={styles.container}>
            <StatusBar style={styles.statusBar} />
            <FlatList 
                style={styles.list}
                data={codeList}
                keyExtractor={item => item.data}
                renderItem={({item}) => <Text style={styles.item}> - Name: {item.name} Code: {item.data} Count: {item.count}</Text>}
            >  
            </FlatList>
            <View style={styles.options}>
                <AppButton
                    text="Borrar todo"
                    onPress={clearCodes}
                    style={{backgroundColor:"red"}}
                />
                <AppButton
                    text="Enviar"
                    onPress={sendCSV}
                />
            </View>
        </View>
    );
};

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