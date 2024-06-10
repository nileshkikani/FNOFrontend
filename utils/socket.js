// 'use client';

// // let socket;
// let token = '';

// let { SmartAPI, WebSocketClient, WebSocket } = require('smartapi-javascript');

// const initializeWebSocket = async (feedToken) => {
//   console.log('Initializing WebSocket with token:', feedToken);
//   token = feedToken;

//   if (typeof window !== 'undefined' && token) {
//     const webSocketUrl = 'wss://smartapisocket.angelone.in/smart-stream';
//     const clientCode = 'METD1460';
//     const apiKey = 'mFDgvhuI';

//     // let socket = new WebSocket({
//     //   client_code: 'METD1460', // Your client code
//     //   feed_token: token
//     // });
//     let socket = new WebSocketClient({
//       clientcode: 'METD1460', // Your client code
//       jwttoken: token,
//       apikey: 'mFDgvhuI'
//     });

//     console.log('COnnecting socket-----', socket);
//     await socket
//       .connect()
//       .then(async () => {
//         console.log('socket connected');
//         // socket.runScript('nse_cm|2885', 'mw'); // SCRIPT: nse_cm|2885, mcx_fo|222900  TASK: mw|sfi|dp
//         // socket.fetchData('ACTION_TYPE', 'FEED_TYPE'); // ACTION_TYPE: subscribe | unsubscribe FEED_TYPE: order_feed
//         // await socket.fetchData('subscribe', 'order_feed');
//         // setTimeout(function () {
//         //   socket.
//         // }, 60000);
//       })
//       .catch(() => {
//         console.log('socket connection error');
//       });

//     await socket.on('tick', receiveTick);
//     function receiveTick(data) {
//       console.log('receiveTick:::::', data);
//     }
//   }
//   const subscribeToChannels = () => {
//     // Define the subscription messages
//     const subscriptions = [
//       { channel: 'live_bank_nifty' },
//       { channel: 'bank_nifty_adr' },
//       { channel: 'bank_nifty_decline' },
//       { channel: 'bank_nifty_advance' },
//       { channel: 'nifty_advance' },
//       { channel: 'nifty_decline' },
//       { channel: 'live_nifty' },
//       { channel: 'nifty_adr' }
//     ];

//     // Send the subscription messages
//     subscriptions.forEach((subscription) => {
//       socket.send(
//         JSON.stringify({
//           action: 'subscribe',
//           channel: subscription.channel
//         })
//       );
//     });
//   };
// };

// export { initializeWebSocket };
'use client';

// let socket;
let token = '';
let isOpen = false;

let { SmartAPI, WebSocketClient } = require('smartapi-javascript');

const initializeWebSocket = (feedToken, setBankNiftyPrice, setNiftyPrice) => {
  console.log('Initializing WebSocket with token:', feedToken);
  token = feedToken;

  if (typeof window !== 'undefined' && token) {
    const webSocketUrl = 'wss://smartapisocket.angelone.in/smart-stream';
    const clientCode = 'METD1460';
    const apiKey = 'mFDgvhuI';

    let socket = new WebSocket(`${webSocketUrl}?clientCode=${clientCode}&feedToken=${token}&apiKey=${apiKey}`);
    console.log(
      '`${webSocketUrl}?clientCode=${clientCode}&feedToken=${token}&apiKey=${apiKey}`',
      `${webSocketUrl}?clientCode=${clientCode}&feedToken=${token}&apiKey=${apiKey}`
    );

    socket.binaryType = 'arraybuffer';

    socket.onopen = (event) => {
      // console.log('WebSocket connection opened', event);
      console.log('socket---', socket.CONNECTING);
      console.log('socket---');
      const param = {
        correlationID: 'METD1460',
        action: 1,
        params: {
          mode: 1,
          tokenList: [
            {
              exchangeType: 1,

              tokens: ['99926000', '99926009']
            }
          ]
        }
      };
      console.log('param', param);
      socket.send(JSON.stringify(param));
      // socket.
    };

    // socket.onmessage = (event) => {
    //   console.log('WebSocket message received:', event);

    //   // event.target.onmessage = (event) => {
    //   //   console.log('WebSocket  received:', event);
    //   // };
    // };

    socket.onmessage = (event) => {
      const arrayBuffer = event.data;
      const dataView = new DataView(arrayBuffer);
      const dataLength = dataView.byteLength;

      // Check if the data length matches the expected length
      const parseData = (offset, length, method, littleEndian = true) => {
        if (offset + length > dataLength) {
          console.warn(`Cannot read ${method} at offset ${offset}, data length is ${dataLength}`);
          return null;
        }
        const value = dataView[method](offset, littleEndian);
        // console.log(`Parsed ${method} at offset ${offset}:`, value); // Added detailed logging
        return value;
      };

      const subscriptionMode = parseData(0, 1, 'getUint8');

      const exchangeType = parseData(1, 1, 'getUint8');

      const tokenBytes = [];
      for (let i = 0; i < 25; i++) {
        const byte = parseData(2 + i, 1, 'getUint8');
        if (byte !== null) {
          tokenBytes.push(byte);
        }
      }

      let bankNiftyPrice;
      let niftyPrice;
      const token = String.fromCharCode(...tokenBytes).replace(/\u0000/g, '');
      // console.log('token:', token); // Inline logging

      const sequenceNumber = parseData(27, 8, 'getInt32');
      // console.log('sequenceNumber:', sequenceNumber); // Inline logging

      const exchangeTimestamp = parseData(35, 8, 'getBigUint64');
      // console.log('exchangeTimestamp:', exchangeTimestamp); // Inline logging

      const lastTradedPrice = parseData(43, 8, 'getUint32');
      // console.log('lastTradedPrice:', lastTradedPrice); // Inline logging

      const lastTradedQuantity = parseData(51, 8, 'getInt32');
      // console.log('lastTradedQuantity:', lastTradedQuantity); // Inline logging

      const averageTradedPrice = parseData(59, 8, 'getInt32');
      // console.log('averageTradedPrice:', averageTradedPrice); // Inline logging

      const volumeTradedForTheDay = parseData(67, 8, 'getInt32');
      // console.log('volumeTradedForTheDay:', volumeTradedForTheDay); // Inline logging

      const totalBuyQuantity = parseData(75, 8, 'getFloat64');
      // console.log('totalBuyQuantity:', totalBuyQuantity); // Inline logging

      const totalSellQuantity = parseData(83, 8, 'getFloat64');
      // console.log('totalSellQuantity:', totalSellQuantity); // Inline logging

      const openPriceOfTheDay = parseData(91, 8, 'getFloat64');
      // console.log('openPriceOfTheDay:', openPriceOfTheDay); // Inline logging

      const highPriceOfTheDay = parseData(99, 8, 'getInt32');
      // console.log('highPriceOfTheDay:', highPriceOfTheDay); // Inline logging

      const lowPriceOfTheDay = parseData(107, 8, 'getInt32');
      // console.log('lowPriceOfTheDay:', lowPriceOfTheDay); // Inline logging

      const closePrice = parseData(115, 8, 'getInt32');
      // console.log('closePrice:', closePrice); // Inline logging

      const openInterest = parseData(123, 8, 'getBigUint64');
      if (token === '99926009') {
        setBankNiftyPrice(lastTradedPrice / 100);
      } else if (token === '99926000') {
        setNiftyPrice(lastTradedPrice / 100);
      }
      const parsedResult = {
        subscriptionMode,
        exchangeType,
        token,
        sequenceNumber,
        exchangeTimestamp: exchangeTimestamp ? exchangeTimestamp.toString() : null,
        lastTradedPrice,
        lastTradedQuantity,
        averageTradedPrice,
        volumeTradedForTheDay,
        totalBuyQuantity,
        totalSellQuantity,
        openPriceOfTheDay,
        highPriceOfTheDay,
        lowPriceOfTheDay,
        closePrice,
        openInterest: openInterest ? openInterest.toString() : null
      };

      // console.log('Parsed Data:', parsedResult?.lastTradedPrice);
      // const reader = new FileReader();
      // reader.onload = function () {
      //   const arrayBuffer = reader.result;
      //   const dataView = new DataView(arrayBuffer);

      //   // Assuming your binary data represents a single 32-bit integer
      //   const intValue = dataView.getInt32(4, true); // true indicates Little Endian byte order
      //   const lastTradedTimestamp = dataView.getBigInt64(8, true); // true indicates Little Endian byte order
      //   const subscriptionMode = dataView.getInt32(16, true); // true indicates Little Endian byte order

      //   console.log('Received integer value:', intValue);
      //   console.log('Received integer value subscriptionMode:', subscriptionMode);
      //   console.log('Received integer value: lastTradedTimestamp', lastTradedTimestamp);
      // };
      // reader.readAsArrayBuffer(event.data);
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed', event);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }
};

export { initializeWebSocket };
