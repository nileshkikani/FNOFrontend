'use client';

const initializeWebSocket = (feedToken, setBankNiftyPrice, setNiftyPrice) => {
  if (typeof window !== 'undefined' && feedToken) {
    const webSocketUrl = 'wss://smartapisocket.angelone.in/smart-stream';
    const clientCode = 'METD1460';
    const apiKey = 'mFDgvhuI';

    let socket = new WebSocket(`${webSocketUrl}?clientCode=${clientCode}&feedToken=${feedToken}&apiKey=${apiKey}`);

    socket.binaryType = 'arraybuffer';

    socket.onopen = (event) => {
      // console.log('WebSocket connection opened', event);

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

      socket.send(JSON.stringify(param));
      // socket.
    };

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

      const token = String.fromCharCode(...tokenBytes).replace(/\u0000/g, '');

      const lastTradedPrice = parseData(43, 8, 'getUint32');

      if (token === '99926009') {
        setBankNiftyPrice(lastTradedPrice / 100);
      } else if (token === '99926000') {
        setNiftyPrice(lastTradedPrice / 100);
      }
    };

    socket.onclose = (event) => {
      console.log('WebSocket connection closed');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:');
    };
  }
};

export { initializeWebSocket };
