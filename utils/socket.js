'use client';

const initializeWebSocket = async (feedToken, setBankNiftyPrice, setNiftyPrice, setIsClosed, setLivePrices, additionalTokens = []) => {
  if (typeof window !== 'undefined' && feedToken) {
    const webSocketUrl = 'wss://smartapisocket.angelone.in/smart-stream';
    const clientCode = 'HEEB1159';
    const apiKey = '58gaUP75';

    const socket = new WebSocket(
      `${webSocketUrl}?clientCode=${clientCode}&feedToken=${feedToken}&apiKey=${apiKey}`
    );
    socket.binaryType = 'arraybuffer';

    const defaultTokens = ['99926000', '99926009'];
    const tokenList = [...defaultTokens, ...additionalTokens];

    socket.onopen = () => {
      const param = {
        correlationID: clientCode,
        action: 1,
        params: {
          mode: 1,
          tokenList: [
            {
              exchangeType: 1,
              tokens: tokenList
            }
          ]
        }
      };
      socket.send(JSON.stringify(param));
      if (!additionalTokens.length) {
        setIsClosed(false); 
      }
    };

    socket.onmessage = (event) => {
      const arrayBuffer = event.data;
      const dataView = new DataView(arrayBuffer);
      const dataLength = dataView.byteLength;

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

      if (additionalTokens.length) {
        setLivePrices((prevPrices) => ({
          ...prevPrices,
          [token]: lastTradedPrice / 100
        }));
      }
        if (token === '99926009') {
          setBankNiftyPrice(lastTradedPrice / 100);
        } else if (token === '99926000') {
          setNiftyPrice(lastTradedPrice / 100);
        }
      }
    };

    socket.onclose = () => {
      if (!additionalTokens.length) {
        setIsClosed(true); 
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  };


export { initializeWebSocket };
