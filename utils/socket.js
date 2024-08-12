'use client';
const initializeWebSocket = async (feedToken, setBankNiftyPrice, setNiftyPrice, setIsClosed) => {
  // console.log('inside-function');
  if (typeof window !== 'undefined' && feedToken) {
    const webSocketUrl = 'wss://smartapisocket.angelone.in/smart-stream';
    const clientCode = 'HEEB1159';
    const apiKey = '58gaUP75';

    let socket = await new WebSocket(
      `${webSocketUrl}?clientCode=${clientCode}&feedToken=${feedToken}&apiKey=${apiKey}`
    );
    socket.binaryType = 'arraybuffer';

    socket.onopen = (event) => {
      // console.log('WebSocket connection opened', event);
      setIsClosed(false);
      const param = {
        correlationID: 'HEEB1159',
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
        // console.log('insidePARSData')
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

      // console.log('fdfaoooooood',lastTradedPrice/100)
      if (token === '99926009') {
        setBankNiftyPrice(lastTradedPrice / 100);
      } else if (token === '99926000') {
        // console.log('nifty',lastTradedPrice / 100)
        setNiftyPrice(lastTradedPrice / 100);
      } else if (token === '1333') {
        // console.log('fdfdaaxcaa', lastTradedPrice / 100)
        // let hdfcPrice = lastTradedPrice/100;
        // jd(lastTradedPrice / 100);
      }
    };

    socket.onclose = (event) => {
      // console.log('WebSocket connection closed');
      // setIsClosed(true);
    };

    socket.onerror = (error) => {
      // console.log('index WebSocket error:',error);
    };
  }
};



// ------------------SOCKET FOR DISPLAYING OPEN ORDERS LIVE PRICE------------------
export const socketForStocks = async (feedToken,setLivePrices,...tokenList) => {
  // console.log('tokenFromSOCKET',tokenList)
  if (typeof window !== 'undefined' && feedToken) {
    const webSocketUrl = 'wss://smartapisocket.angelone.in/smart-stream';
    const clientCode = 'HEEB1159';
    const apiKey = '58gaUP75';
    let socket = await new WebSocket(
      `${webSocketUrl}?clientCode=${clientCode}&feedToken=${feedToken}&apiKey=${apiKey}`
    );

    socket.binaryType = 'arraybuffer';

    socket.onopen = (event) => {
      const param = {
        correlationID: 'HEEB1159',
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
    };
    socket.onmessage = (event) => {
      const arrayBuffer = event.data;
      const dataView = new DataView(arrayBuffer);
      const dataLength = dataView.byteLength;

      const parseData = (offset, length, method, littleEndian = true) => {
        // console.log('insidePARSData')
        if (offset + length > dataLength) {
          console.warn(`Cannot read ${method} at offset ${offset}, data length is ${dataLength}`);
          return null;
        }
        const value = dataView[method](offset, littleEndian);
        // console.log('vallll',value)
        return value;
      };
      const tokenBytes = [];
      // console.log('bytesss',tokenBytes)
      for (let i = 0; i < 25; i++) {
        const byte = parseData(2 + i, 1, 'getUint8');
        // console.log('ddsdsds',byte)
        if (byte !== null) {
          tokenBytes.push(byte);
        }
      }
      const token = String.fromCharCode(...tokenBytes).replace(/\u0000/g, '');
      const lastTradedPrice = parseData(43, 8, 'getUint32');

      // --------------SETTING LIVE PRICE FROM HERE-----------
  // console.log('fromSOCKETsss',token);
  // console.log('insideSOkcet')

      setLivePrices((prevPrices) => ({
        ...prevPrices,
        [token]: lastTradedPrice
      }));

      // console.log('fromSocketFIle',lastTradedPrice)
    }
    
    socket.onclose = (event) => {
      // console.log('WebSocket connection closed');
      // setIsClosed(true);
    };

    // console.log('Socket readyState:', socket.readyState);

    
    socket.onerror = (error) => {
      console.log('WebSocket errorrr:',error);
    };
  };
};


// ---------------------SOCKET FOR CURRENT OPEN ORDERS------------------

// export const socketForOpenOrders = async ()=>{
//   try{
//     const webSocketUrl = 'wss://algo.satvikacart.com/ws/signals/';
//         let socket = await new WebSocket(webSocketUrl);
//         console.log("cvccc",socket);

//   }catch(error){
//     console.error('error connecting socket->',error)
//   }
//   const response = await new WebSocket()
// }


export { initializeWebSocket };
