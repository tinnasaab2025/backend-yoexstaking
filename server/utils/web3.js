import Web3 from 'web3';

const web3 = new Web3("https://bsc-dataseed.binance.org/");

export const getTransactionDetails = async (txHash) => {
  console.log('txHash:', txHash);  // 🐛 Log input

  if (!txHash || typeof txHash !== 'string' || !txHash.startsWith('0x') || txHash.length !== 66) {
    return { error: 'Invalid transaction hash format' };
  }

  try {
 const receipt = await web3.eth.getTransactionReceipt(txHash);
    if (!receipt) return { error: 'Transaction not found' };

    const receiptCleaned = JSON.parse(
      JSON.stringify(receipt, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return { receipt: receiptCleaned };
  } catch (err) {
    return { error: err.message };
  }
};



