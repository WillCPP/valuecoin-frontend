<template v-show="transactions.length >= 0">
    <v-expansion-panels>
      <v-expansion-panel> 
          <v-expansion-panel-header>{{title}}</v-expansion-panel-header>
          <v-expansion-panel-content  v-for="transaction in transactions"
          :key="transaction.fromAddress">
            <v-divider class="pb-2"/>
            <p>From: {{transaction.fromAddress}}</p>
            <p>To: {{transaction.toAddress}}</p>
            <p>Amount: {{transaction.amount}}</p>
          </v-expansion-panel-content>
      </v-expansion-panel> 
    </v-expansion-panels>  
</template>

<script>
export default {
  props: ['transactions', 'title']
};
</script>