'use client';

const initializeWebSocket = async (feedToken, setBankNiftyPrice, setNiftyPrice, setIsClosed) => {
  // console.log('inside-function');
  if (typeof window !== 'undefined' && feedToken) {
    const webSocketUrl = 'wss://smartapisocket.angelone.in/smart-stream';
    const clientCode = 'METD1460';
    const apiKey = 'mFDgvhuI';

    let socket = await new WebSocket(
      `${webSocketUrl}?clientCode=${clientCode}&feedToken=${feedToken}&apiKey=${apiKey}`
    );
    socket.binaryType = 'arraybuffer';

    socket.onopen = (event) => {
      // console.log('WebSocket connection opened', event);
      setIsClosed(false);
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
      // console.log('WebSocket error:');
    };
  }
};

const allStocks = {
  HDFCBANK: "1333",
  RELIANCE: "2885",
  ICICIBANK: "4963",
  INFOSYS: "1594",
  TCS: "11536",
  LT: "11483",
  ITC: "1660",
  AXISBANK: "5900",
  SBIBANK: "3045",
  AIRTEL: "10604",
  BAJAJFINANCE: "317",
  HINDUNILVR: '1394',
  TATAMOTORS: '3456',
  KOTAKBANK: '1922',
  MARUTI: '10999',
  HDFCAMC: '4244',
  INDUSINDBK: '5258',
  ADANIENT: '25',
  TECHM: '13538',
}


// ------------------FOR STOCKS PRICE MATCHING in LIVE------------------
export const socketForStocks = async (feedToken,
  // ...setters
  setHDFC,
  setReliance,
  setIcici,
  setInfosys,
  setTcs,
  setLt,
  setItc,
  setAxisBank,
  setSbi,
  setAirtel,
  setBajajFinance,
  setHindustanUnilever,
  setTataMotors,
  setKotakBank,
  setMaruti,
  setHdfcAmc,
  setIndusindBank,
  setAdaniEnterprise,
  setTechMahindra
) => {
  if (typeof window !== 'undefined' && feedToken) {
    const webSocketUrl = 'wss://smartapisocket.angelone.in/smart-stream';
    const clientCode = 'METD1460';
    const apiKey = 'mFDgvhuI';
    let socket = await new WebSocket(
      `${webSocketUrl}?clientCode=${clientCode}&feedToken=${feedToken}&apiKey=${apiKey}`
    );

    socket.binaryType = 'arraybuffer';
    const stockTokens = Object.values(allStocks);

    socket.onopen = (event) => {
      const param = {
        correlationID: 'METD1460',
        action: 1,
        params: {
          mode: 1,
          tokenList: [
            {
              exchangeType: 1,
              tokens: stockTokens
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
        if (offset + length > dataLength) {
          console.warn(`Cannot read ${method} at offset ${offset}, data length is ${dataLength}`);
          return null;
        }
        const value = dataView[method](offset, littleEndian);
        return value;
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
      // console.log('dttta',lastTradedPrice / 100)
      if (token == '1333') {
        setHDFC(lastTradedPrice / 100);
      }
      else if (token == '2885') {
        setReliance(lastTradedPrice / 100);
      } else if (token == '4963') {
        setIcici(lastTradedPrice / 100);
      } else if (token == '1594') {
        setInfosys(lastTradedPrice / 100);
      } else if (token == '11536') {
        setTcs(lastTradedPrice / 100);
      } else if (token == '11483') {
        setLt(lastTradedPrice / 100);
      } else if (token == '1660') {
        setItc(lastTradedPrice / 100);
      } else if (token == '5900') {
        setAxisBank(lastTradedPrice / 100);
      } else if (token == '3045') {
        setSbi(lastTradedPrice / 100);
      } else if (token == '10604') {
        setAirtel(lastTradedPrice / 100);
      } else if (token == '317') {
        setBajajFinance(lastTradedPrice / 100);
      } else if (token == '1394') {
        setHindustanUnilever(lastTradedPrice / 100);
      } else if (token == '3456') {
        setTataMotors(lastTradedPrice / 100);
      } else if (token == '1922') {
        setKotakBank(lastTradedPrice / 100);
      } else if (token == '10999') {
        setMaruti(lastTradedPrice / 100);
      } else if (token == '4244') {
        setHdfcAmc(lastTradedPrice / 100);
      }
      else if (token == '5258') {
        setIndusindBank(lastTradedPrice / 100);
      }
      else if (token == '25') {
        setAdaniEnterprise(lastTradedPrice / 100);
      }
      else if (token == '13538') {
        setTechMahindra(lastTradedPrice / 100);
      }
      // const tokenMap = allStocks;
      // const setterIndex = tokenMap[token];
      // if (setterIndex !== undefined && setters[setterIndex]) {
      //   setters[setterIndex](lastTradedPrice / 100);
      // }
    }
  };

  socket.onclose = (event) => {
    // console.log('WebSocket connection closed');
    setIsClosed(true);
  };

  socket.onerror = (error) => {
    console.log('WebSocket error:');
  };
};


// ---------------------SOCKET FOR CURRENT OPEN ORDERS------------------

export const socketForOpenOrders = async ()=>{
  try{
    const webSocketUrl = 'wss://algo.satvikacart.com/ws/signals/';
        let socket = await new WebSocket(webSocketUrl);
        console.log("cvccc",socket);

  }catch(error){
    console.error('error connecting socket->',error)
  }
  const response = await new WebSocket()
}


export { initializeWebSocket };
