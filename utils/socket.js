'use client';

const initializeWebSocket = async (feedToken, setBankNiftyPrice, setNiftyPrice, setIsClosed, setLivePrices, additionalTokens) => {
  if (typeof window !== 'undefined' && feedToken) {
    const token = feedToken.feedToken;
    console.log('kokok',token);
    const webSocketUrl = 'wss://smartapisocket.angelone.in/smart-stream';
    const clientCode = 'HEEB1159';
    const apiKey = '58gaUP75';

    const url = `${webSocketUrl}?clientCode=${clientCode}&feedToken=${feedToken.feedToken}&apiKey=${apiKey}`;
    console.log('Attempting to connect to WebSocket URL:', url);

    const socket = new WebSocket(url);
    socket.binaryType = 'arraybuffer';

    socket.onopen = () => {
      console.log('WebSocket connection opened.');
      const param = {
        correlationID: clientCode,
        action: 1,
        params: {
          mode: 1,
          tokenList: [
            {
              exchangeType: 1,
              tokens: additionalTokens
            }
          ]
        }
      };
      console.log('Sending Parameters:', JSON.stringify(param, null, 2));
      socket.send(JSON.stringify(param));
    };

    socket.onmessage = (event) => {
      const arrayBuffer = event.data;
      const dataView = new DataView(arrayBuffer);
      const dataLength = dataView.byteLength;

      console.log('Raw Data Received:', new Uint8Array(arrayBuffer));

      const parseData = (offset, length, method, littleEndian = true) => {
        if (offset + length > dataLength) {
          console.warn(`Cannot read ${method} at offset ${offset}, data length is ${dataLength}`);
          return null;
        }
        return dataView[method](offset, littleEndian);
      };

      const tokenBytes = [];
      for (let i = 0; i < 25; i++) {
        const byte = parseData(2 + i, 1, 'getUint8');
        if (byte !== null) {
          tokenBytes.push(byte);
        }
      }
      const token = String.fromCharCode(...tokenBytes).replace(/\u0000/g, '');

      const lastTradedPrice = parseData(43, 8, 'getUint32');

      console.log('Extracted Token:', token, 'Last Traded Price:', lastTradedPrice / 100);

      if (additionalTokens.includes(token)) {
        console.log('Updating Token:', token, 'Price:', lastTradedPrice / 100);
        if (setLivePrices && typeof setLivePrices === 'function') {
          setLivePrices((prevPrices) => ({
            ...prevPrices,
            [token]: lastTradedPrice / 100
          }));
        }
      }

      if (token === '99926009') {
        // setBankNiftyPrice(lastTradedPrice );
      } else if (token === '99926000') {
        // setNiftyPrice(lastTradedPrice );
      }
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed.');
      // if (!additionalTokens.length) {
        setIsClosed(true);
      // }
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error.message || error);
    };
  }
};

export { initializeWebSocket };
