<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Value</span>
        <span class="font-weight-light">Coin</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-dialog v-model="transactionDialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">
            <span class="mr-2">New Transaction</span>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">New Transaction</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="fromAddress" label="From" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="toAddress" label="To" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field v-model="amount" label="Amount" type="number" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="transactionDialog = false;">Cancel</v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="transactionDialog = false; newTransaction();"
            >Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="mineDialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">
            <span class="mr-2">Mine Block</span>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Mine Block</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="minersAddress" label="Miner's Address" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="mineDialog = false;">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="mineDialog = false; mineBlock();">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-btn text>
        <span class="mr-2" @click="validateChain()">Validate Chain</span>
      </v-btn>

      <v-dialog v-model="validateDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Validate Chain</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field readonly v-model="validateMsg" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="validateDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- <v-btn text>
        <span class="mr-2" @click="checkBalance()">Check Balance</span>
      </v-btn>-->

      <v-dialog v-model="balanceDialog" persistent max-width="600px">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">
            <span class="mr-2">Check Balance</span>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Check Balance</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="balanceAddress" label="Address" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="balanceDialog = false;">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click="balanceDialog = false; checkBalance();">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="balanceResultDialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">Balance</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field readonly v-model="balanceResult" required></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="balanceResultDialog = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <v-content>
      <TransactionsView
        :transactions="blockChain.data.PendingTransactions"
        title="Pending Transactions"
      />
    </v-content>

    <v-content>
      <BlockView :chain="blockChain.data.Chain" />
    </v-content>
  </v-app>
</template>

<script>
import BlockView from "./components/BlockView";
import TransactionsView from "./components/TransactionsView";
import Blockchain from "./scripts/blockchain";
// import { isNull } from 'util';

export default {
  name: "App",
  components: {
    BlockView,
    TransactionsView
  },
  data: () => ({
    info: {},
    blockChain: { data: {} },
    transactionDialog: false,
    fromAddress: "",
    toAddress: "",
    amount: 0,
    mineDialog: false,
    minersAddress: "",
    validateDialog: false,
    validateMsg: "",
    balanceDialog: false,
    balanceAddress: "",
    balanceResultDialog: false,
    balanceResult: 0
  }),
  methods: {
    newTransaction: function() {
      var transaction = {
        fromAddress: this.fromAddress,
        toAddress: this.toAddress,
        amount: parseInt(this.amount)
      };
      Blockchain.newTransaction(transaction)
        .then(response => (this.info = response))
        .then(this.getBlockchain());
    },
    mineBlock: function() {
      var minersAddress = { walletAddress: this.minersAddress };
      Blockchain.mineBlock(minersAddress)
        .then(response => (this.info = response))
        .then(this.getBlockchain());
    },
    validateChain: async function() {
      var isValid = null;
      await Blockchain.validateChain()
        .then(response => (this.info = response))
        .then(response => (isValid = response.data.blockchainIsValid));
      if (isValid) {
        this.validateMsg = "Blockchain is valid.";
      } else {
        this.validateMsg = "Blockchain is invalid.";
      }
      this.validateDialog = true;
    },
    checkBalance: async function() {
      var address = { walletAddress: this.balanceAddress };
      await Blockchain.checkBalance(address)
        .then(response => (this.info = response))
        .then(response => (this.balanceResult =response.data.balance));
      this.balanceResultDialog = true;
    },
    getBlockchain: function() {
      Blockchain.getBlockchain().then(response => (this.blockChain = response));
    }
  },
  beforeMount() {
    this.getBlockchain();
  }
};
</script>
