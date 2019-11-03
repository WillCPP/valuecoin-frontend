import axios from 'axios';

// let config = {
//     headers: {
//       "Accept": "application/json",
//       "Content-Type": "application/json"
//     }
//   }

var Blockchain = {
    data: () => ({
        info: []
      }),
    newTransaction(transaction) {
        return axios.post('https://localhost:44329/api/transaction', transaction);
    },
    mineBlock(address) {
        return axios.post('https://localhost:44329/api/mine', address);
    },
    validateChain() {
        return axios.get('https://localhost:44329/api/validate');
    },
    checkBalance(address) {
        return axios.post('https://localhost:44329/api/balance', address);
    },
    getBlockchain() {
        return axios.get('https://localhost:44329/api/blockchain');
    }
}

export default Blockchain;