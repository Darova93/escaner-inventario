export default class CodeStorage {
    static instance = null;
    codesList = [];

    static getInstance() {
        if(CodeStorage.instance == null) {
            CodeStorage.instance = new CodeStorage();
        }
        return this.instance;
    }

    addCode(code) {
        const codeIndex = this.codesList.map(e => e.data).indexOf(code.data);
        var newCodeList = [...this.codesList];
        if (codeIndex > -1) {
            newCodeList[codeIndex].count++;
        }
        else {
            newCodeList.push({id: this.codesList.length, count: 1, date: this.getCurrentDate(), ...code});
        }
        this.codesList = newCodeList;
    };

    removeCode(code) {
        const codeIndex = this.codesList.map(e => e.data).indexOf(code.data);
        var newCodeList = [...this.codesList];
        if (codeIndex > -1) {
            if (newCodeList[codeIndex].count > 1) {
                newCodeList[codeIndex].count--;
            }
            else {
                newCodeList.splice(codeIndex, 1);
            }
        }
        this.codesList = newCodeList;
    }

    getCodeList() {
        return this.codesList;
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