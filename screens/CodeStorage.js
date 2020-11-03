import * as SQLite from 'expo-sqlite';

export default class CodeStorage {
    static instance = null;
    static database = null;
    codeDictionary = {};

    static getInstance() {
        if(CodeStorage.instance == null) {
            CodeStorage.database = SQLite.openDatabase('productos');
            CodeStorage.database.transaction(
                (tx) => {
                    tx.executeSql(
                        `CREATE TABLE IF NOT EXISTS codigos (
                            data TEXT PRIMARY KEY,
                            type TEXT NOT NULL,
                            name TEXT DEFAULT '',
                            count INTEGER DEFAULT 1,
                            date TEXT NOT NULL
                        );`,
                        [],
                        (success, result) => { },
                        (error) => { },
                    );
                },
                (error) => { },
                (success) => { },
            );
            CodeStorage.instance = new CodeStorage();
            CodeStorage.database.transaction(
                (tx) => {
                    tx.executeSql(
                        'SELECT * FROM codigos;',
                        [],
                        (success, resultSet) => { 
                            CodeStorage.instance.codeDictionary = resultSet.rows._array.reduce((map, obj) => {
                                map[obj.data] = obj;
                                return map;
                            }, {});
                        },
                        (error, e) => { }   
                    );
                },
                (error) => { },
                (success) => { },
            );
            
        }
        return this.instance;
    }

    addCode(codeObject) {
        if(codeObject.data in this.codeDictionary) {
            this.codeDictionary[codeObject.data].count++;
            CodeStorage.database.transaction(
                (tx) => {
                    tx.executeSql(
                        `UPDATE codigos 
                        SET count = count + 1
                        WHERE data = ?`,
                        [codeObject.data],
                        (success) => { },
                        (error, e) => { console.log("Error"); console.log(error) },
                    );
                },
                (error) => { },
                (success) => { },
            );
        }
        else {
            this.codeDictionary[codeObject.data] = {count: 1, date: this.getCurrentDate(), ...codeObject};
            CodeStorage.database.transaction(
                (tx) => {
                    tx.executeSql(
                        `INSERT INTO codigos (data, type, name, count, date)
                        VALUES(?, ?, ?, ?, ?);`,
                        [
                            this.codeDictionary[codeObject.data].data,
                            this.codeDictionary[codeObject.data].type,
                            this.codeDictionary[codeObject.data].name,
                            this.codeDictionary[codeObject.data].count,
                            this.codeDictionary[codeObject.data].date
                        ],
                        (success) => { },
                        (error, e) => { }
                    );
                },
                (error) => { },
                (success) => { }
            );
        }
    };

    codeExists(codeValue) {
        return this.codeDictionary.hasOwnProperty(codeValue);
    }

    removeCode(codeValue) {
        delete this.codeDictionary[codeValue];
    }

    removeAllCodes() {
        this.codeDictionary = {};     
        CodeStorage.database.transaction(
            (tx) => {
                tx.executeSql(
                    `DROP TABLE IF EXISTS codigos;`,
                    [],
                    (success, result) => { },
                    (error) => { },
                );
            },
            (error) => { },
            (success) => { },
        );
    }

    getCodeObject(codeValue) {
        return this.codeDictionary[codeValue];
    }

    getCodeList() {
        return new Promise(
            (resolve, reject) => {
                CodeStorage.database.transaction(
                    (tx) => {
                        tx.executeSql(
                            'SELECT * FROM codigos;',
                            [],
                            (success, resultSet) => { 
                                resolve(resultSet.rows._array);
                            },
                            (error, e) => { 
                                console.log("Error");
                                console.log(e);
                                reject(e);
                            }   
                        );
                    },
                    (error) => { },
                    (success) => { },
                )
            }
        );
        // return Object.values(this.codeDictionary);
    }

    getCurrentDate(){
        const date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();
  
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        return year + '-' + month + '-' + day + "T" + hours + ":" + minutes + ":" + seconds; //format: dd-mm-yyyy 12:20:10;
    }
}