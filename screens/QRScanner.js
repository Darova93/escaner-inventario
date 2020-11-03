import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AppButton from '../components/AppButton';
import CodeStorage from './CodeStorage';

export default function QRScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCode, setCurrentCode] = useState({});
  const [newCodeName, onChangeText] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const cancelCode = () => {
    setScanned(false);
    setModalVisible(!modalVisible);
  }

  const addCode = () => {
    CodeStorage.getInstance().addCode({name: newCodeName, ...currentCode});
    setScanned(false);
    setModalVisible(!modalVisible);
    onChangeText('');
  };

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setModalVisible(true);
    setCurrentCode({ type, data });
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Solicitando permisos de camara</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Son necesarios permisos de camara</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style={styles.statusBar} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={cancelCode}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Se escaneó el código {currentCode.data}</Text>
            {
              CodeStorage.getInstance().codeExists(currentCode.data) ? 
              <Text style={styles.modalText}>{CodeStorage.getInstance().getCodeObject(currentCode.data).name}</Text> :
              <TextInput 
                value={newCodeName} 
                style={styles.textInput}
                onChangeText={text => onChangeText(text)}
              />
            }
            <View style={styles.options}>
              <AppButton style={{margin: 8, backgroundColor: 'red'}} text="Cancelar" onPress={cancelCode}/>
              <AppButton style={{margin: 8}} text="Agregar" onPress={addCode}/>
            </View>
          </View>
        </View>
      </Modal>
      <BarCodeScanner
        style={styles.scanner}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBar: {
    backgroundColor: 'black',
  },
  scanner: {
    width: 600,
    height: 700,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  options: {
    flexDirection: 'row',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textInput: {
    flex: 1, 
    alignSelf: 'stretch', 
    marginBottom: 10, 
    padding: 10, 
    maxHeight: 40, 
    borderColor: 'gray', 
    borderWidth: 1,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});