'use client';
import { API_ROUTER } from '@/services/apiRouter';
import axiosInstance from '@/utils/axios';
import React, { createContext, useReducer, useCallback, useMemo, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store';

export const MultiStrikeContext = createContext({});

const initialState = {
  data: [],
  isLoading: true,
  strikes: [],
  selectedStrikes: [],
  strikePrice1: [],
  strikePrice1IsChecked: false,
  strikePrice2: [],
  strikePrice2IsChecked: false,
  strikePrice3: [],
  strikePrice3IsChecked: false,
  strikePrice4: [],
  strikePrice4IsChecked: false,
  strikePrice4: [],
  strikePrice4IsChecked: false,
  strikePrice5: [],
  strikePrice5IsChecked: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_IS_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_STRIKES':
      return { ...state, strikes: action.payload };
    case 'SET_STRIKE_1':
      return { ...state, strikePrice1: action.payload.strike1Data, strikePrice1IsChecked: action.payload.status };
    case 'SET_STRIKE_2':
      return { ...state, strikePrice2: action.payload.strike2Data, strikePrice2IsChecked: action.payload.status };
    case 'SET_STRIKE_3':
      return { ...state, strikePrice3: action.payload.strike3Data, strikePrice3IsChecked: action.payload.status };
    case 'SET_STRIKE_4':
      return { ...state, strikePrice4: action.payload.strike4Data, strikePrice4IsChecked: action.payload.status };
    case 'SET_STRIKE_5':
      return { ...state, strikePrice5: action.payload.strike5Data, strikePrice5IsChecked: action.payload.status };
    // case "SET_SELECTED_STRIKES":
    //   return { ...state, selectedStrikes: action.payload };
    default:
      return state;
  }
};

export const MultiStrikeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [checkedStrikes, setCheckedStrikes] = useState([]);

  const router = useRouter();
  const authState = useAppSelector((state) => state.auth.authState);
  const checkUserIsLoggedIn = useAppSelector((state) => state.auth.isUser);

  const {
    strikes,
    selectedStrikes,
    data,
    strikePrice1,
    strikePrice2,
    strikePrice3,
    strikePrice4,
    strikePrice5,
    strikePrice1IsChecked,
    strikePrice2IsChecked,
    strikePrice3IsChecked,
    strikePrice4IsChecked,
    strikePrice5IsChecked
  } = state;

  // ----------------API CALL-----------------
  const multiStrikeAPiCall = async (selectedStrike) => {
    dispatch({ type: 'SET_IS_LOADING', payload: true });
    if (!authState && checkUserIsLoggedIn) {
      return router.push('/login');
    }
    try {
      let apiUrl = API_ROUTER.MULTI_STRIKE;
      if (selectedStrike && selectedStrike.length > 0) {
        const strikesString = selectedStrike.join(',');
        apiUrl += `?strikes=${strikesString}`;
      }
      const response = await axiosInstance.get(apiUrl, {
        headers: { Authorization: `Bearer ${authState.access}` }
      });

      if (response.status === 200) {
        selectedStrike
          ? dispatch({ type: 'SET_DATA', payload: response?.data })
          : dispatch({
              type: 'SET_STRIKES',
              payload: response?.data.strike_prices
            });
        dispatch({ type: 'SET_IS_LOADING', payload: false });
      } else {
        router.push('/login');
      }
    } catch (err) {
      toast.error('Error getting multistrike api');
      console.log('Error getting multistrike api, check::', err);
    }
  };

  // ----------------SELECT STRIKE CHECKBOX------------
  const setStrikeDate = (event) => {
    const d = event.target.value;
    if (selectedStrikes.includes(d)) {
      const arrIndex = selectedStrikes.indexOf(d);
      selectedStrikes.splice(arrIndex, 1);
    } else {
      selectedStrikes.push(d);
    }
    // multiStrikeAPiCall(selectedStrikes);
  };

  const TEST_ARRAY = [
    {
      created_at: '2024-05-15T10:12:25.054629+05:30',
      live_nifty: '22181.75',
      strike_price: '22100.00',
      call_net_oi: 100186,
      put_net_oi: 197124
    },
    {
      created_at: '2024-05-15T09:22:24.921559+05:30',
      live_nifty: '22256.10',
      strike_price: '22100.00',
      call_net_oi: 90156,
      put_net_oi: 196147
    },
    {
      created_at: '2024-05-15T09:22:24.921625+05:30',
      live_nifty: '22256.10',
      strike_price: '22150.00',
      call_net_oi: 38928,
      put_net_oi: 70733
    },
    {
      created_at: '2024-05-15T09:22:24.921685+05:30',
      live_nifty: '22256.10',
      strike_price: '22200.00',
      call_net_oi: 161725,
      put_net_oi: 157034
    },
    {
      created_at: '2024-05-15T09:22:24.921751+05:30',
      live_nifty: '22256.10',
      strike_price: '22250.00',
      call_net_oi: 125413,
      put_net_oi: 98527
    },
    {
      created_at: '2024-05-15T09:22:24.921813+05:30',
      live_nifty: '22256.10',
      strike_price: '22300.00',
      call_net_oi: 226637,
      put_net_oi: 82688
    },
    {
      created_at: '2024-05-15T09:27:25.147107+05:30',
      live_nifty: '22265.40',
      strike_price: '22100.00',
      call_net_oi: 89031,
      put_net_oi: 208775
    },
    {
      created_at: '2024-05-15T09:27:25.147169+05:30',
      live_nifty: '22265.40',
      strike_price: '22150.00',
      call_net_oi: 39759,
      put_net_oi: 76447
    },
    {
      created_at: '2024-05-15T09:27:25.147221+05:30',
      live_nifty: '22265.40',
      strike_price: '22200.00',
      call_net_oi: 168284,
      put_net_oi: 186830
    },
    {
      created_at: '2024-05-15T09:27:25.147263+05:30',
      live_nifty: '22265.40',
      strike_price: '22250.00',
      call_net_oi: 141847,
      put_net_oi: 122010
    },
    {
      created_at: '2024-05-15T09:27:25.147406+05:30',
      live_nifty: '22265.40',
      strike_price: '22300.00',
      call_net_oi: 257545,
      put_net_oi: 97538
    },
    {
      created_at: '2024-05-15T09:32:28.090678+05:30',
      live_nifty: '22252.85',
      strike_price: '22100.00',
      call_net_oi: 90426,
      put_net_oi: 210523
    },
    {
      created_at: '2024-05-15T09:32:28.090726+05:30',
      live_nifty: '22252.85',
      strike_price: '22150.00',
      call_net_oi: 42763,
      put_net_oi: 79256
    },
    {
      created_at: '2024-05-15T09:32:28.090773+05:30',
      live_nifty: '22252.85',
      strike_price: '22200.00',
      call_net_oi: 175307,
      put_net_oi: 190041
    },
    {
      created_at: '2024-05-15T09:32:28.090823+05:30',
      live_nifty: '22252.85',
      strike_price: '22250.00',
      call_net_oi: 150177,
      put_net_oi: 124758
    },
    {
      created_at: '2024-05-15T09:32:28.090868+05:30',
      live_nifty: '22252.85',
      strike_price: '22300.00',
      call_net_oi: 274588,
      put_net_oi: 98692
    },
    {
      created_at: '2024-05-15T09:37:27.117177+05:30',
      live_nifty: '22254.80',
      strike_price: '22100.00',
      call_net_oi: 91505,
      put_net_oi: 211478
    },
    {
      created_at: '2024-05-15T09:37:27.117228+05:30',
      live_nifty: '22254.80',
      strike_price: '22150.00',
      call_net_oi: 44220,
      put_net_oi: 87106
    },
    {
      created_at: '2024-05-15T09:37:27.117277+05:30',
      live_nifty: '22254.80',
      strike_price: '22200.00',
      call_net_oi: 188755,
      put_net_oi: 198998
    },
    {
      created_at: '2024-05-15T09:37:27.117327+05:30',
      live_nifty: '22254.80',
      strike_price: '22250.00',
      call_net_oi: 155038,
      put_net_oi: 131493
    },
    {
      created_at: '2024-05-15T09:37:27.117374+05:30',
      live_nifty: '22254.80',
      strike_price: '22300.00',
      call_net_oi: 300350,
      put_net_oi: 101426
    },
    {
      created_at: '2024-05-15T09:42:27.588697+05:30',
      live_nifty: '22263.80',
      strike_price: '22100.00',
      call_net_oi: 93307,
      put_net_oi: 210721
    },
    {
      created_at: '2024-05-15T09:42:27.588741+05:30',
      live_nifty: '22263.80',
      strike_price: '22150.00',
      call_net_oi: 46423,
      put_net_oi: 90510
    },
    {
      created_at: '2024-05-15T09:42:27.588784+05:30',
      live_nifty: '22263.80',
      strike_price: '22200.00',
      call_net_oi: 196393,
      put_net_oi: 208124
    },
    {
      created_at: '2024-05-15T09:42:27.588827+05:30',
      live_nifty: '22263.80',
      strike_price: '22250.00',
      call_net_oi: 166842,
      put_net_oi: 136612
    },
    {
      created_at: '2024-05-15T09:42:27.588870+05:30',
      live_nifty: '22263.80',
      strike_price: '22300.00',
      call_net_oi: 314581,
      put_net_oi: 109670
    },
    {
      created_at: '2024-05-15T09:47:28.614393+05:30',
      live_nifty: '22291.75',
      strike_price: '22100.00',
      call_net_oi: 92510,
      put_net_oi: 213710
    },
    {
      created_at: '2024-05-15T09:47:28.614453+05:30',
      live_nifty: '22291.75',
      strike_price: '22150.00',
      call_net_oi: 46356,
      put_net_oi: 93940
    },
    {
      created_at: '2024-05-15T09:47:28.614495+05:30',
      live_nifty: '22291.75',
      strike_price: '22200.00',
      call_net_oi: 195413,
      put_net_oi: 211829
    },
    {
      created_at: '2024-05-15T09:47:28.614533+05:30',
      live_nifty: '22291.75',
      strike_price: '22250.00',
      call_net_oi: 166586,
      put_net_oi: 139271
    },
    {
      created_at: '2024-05-15T09:47:28.614571+05:30',
      live_nifty: '22291.75',
      strike_price: '22300.00',
      call_net_oi: 312858,
      put_net_oi: 111973
    },
    {
      created_at: '2024-05-15T09:52:25.593199+05:30',
      live_nifty: '22286.15',
      strike_price: '22100.00',
      call_net_oi: 92016,
      put_net_oi: 216449
    },
    {
      created_at: '2024-05-15T09:52:25.593248+05:30',
      live_nifty: '22286.15',
      strike_price: '22150.00',
      call_net_oi: 46071,
      put_net_oi: 106658
    },
    {
      created_at: '2024-05-15T09:52:25.593291+05:30',
      live_nifty: '22286.15',
      strike_price: '22200.00',
      call_net_oi: 192583,
      put_net_oi: 218821
    },
    {
      created_at: '2024-05-15T09:52:25.593334+05:30',
      live_nifty: '22286.15',
      strike_price: '22250.00',
      call_net_oi: 167762,
      put_net_oi: 150916
    },
    {
      created_at: '2024-05-15T09:52:25.593373+05:30',
      live_nifty: '22286.15',
      strike_price: '22300.00',
      call_net_oi: 312538,
      put_net_oi: 130047
    },
    {
      created_at: '2024-05-15T09:57:28.430642+05:30',
      live_nifty: '22285.15',
      strike_price: '22100.00',
      call_net_oi: 92924,
      put_net_oi: 223301
    },
    {
      created_at: '2024-05-15T09:57:28.430687+05:30',
      live_nifty: '22285.15',
      strike_price: '22150.00',
      call_net_oi: 46934,
      put_net_oi: 109583
    },
    {
      created_at: '2024-05-15T09:57:28.430754+05:30',
      live_nifty: '22285.15',
      strike_price: '22200.00',
      call_net_oi: 199283,
      put_net_oi: 227806
    },
    {
      created_at: '2024-05-15T09:57:28.430828+05:30',
      live_nifty: '22285.15',
      strike_price: '22250.00',
      call_net_oi: 176510,
      put_net_oi: 152319
    },
    {
      created_at: '2024-05-15T09:57:28.430889+05:30',
      live_nifty: '22285.15',
      strike_price: '22300.00',
      call_net_oi: 332634,
      put_net_oi: 137611
    },
    {
      created_at: '2024-05-15T10:02:26.597106+05:30',
      live_nifty: '22231.35',
      strike_price: '22100.00',
      call_net_oi: 92293,
      put_net_oi: 225104
    },
    {
      created_at: '2024-05-15T10:02:26.597175+05:30',
      live_nifty: '22231.35',
      strike_price: '22150.00',
      call_net_oi: 46812,
      put_net_oi: 109195
    },
    {
      created_at: '2024-05-15T10:02:26.597248+05:30',
      live_nifty: '22231.35',
      strike_price: '22200.00',
      call_net_oi: 200122,
      put_net_oi: 229009
    },
    {
      created_at: '2024-05-15T10:02:26.597294+05:30',
      live_nifty: '22231.35',
      strike_price: '22250.00',
      call_net_oi: 169994,
      put_net_oi: 147536
    },
    {
      created_at: '2024-05-15T10:02:26.597340+05:30',
      live_nifty: '22231.35',
      strike_price: '22300.00',
      call_net_oi: 322556,
      put_net_oi: 142371
    },
    {
      created_at: '2024-05-15T10:07:29.957367+05:30',
      live_nifty: '22201.45',
      strike_price: '22100.00',
      call_net_oi: 97706,
      put_net_oi: 200335
    },
    {
      created_at: '2024-05-15T10:07:29.957409+05:30',
      live_nifty: '22201.45',
      strike_price: '22150.00',
      call_net_oi: 51223,
      put_net_oi: 86696
    },
    {
      created_at: '2024-05-15T10:07:29.957464+05:30',
      live_nifty: '22201.45',
      strike_price: '22200.00',
      call_net_oi: 216586,
      put_net_oi: 217456
    },
    {
      created_at: '2024-05-15T10:17:30.165823+05:30',
      live_nifty: '22171.55',
      strike_price: '22100.00',
      call_net_oi: 109730,
      put_net_oi: 175055
    },
    {
      created_at: '2024-05-15T10:17:30.165880+05:30',
      live_nifty: '22171.55',
      strike_price: '22150.00',
      call_net_oi: 68998,
      put_net_oi: 95488
    },
    {
      created_at: '2024-05-15T10:17:30.165935+05:30',
      live_nifty: '22171.55',
      strike_price: '22200.00',
      call_net_oi: 286720,
      put_net_oi: 210104
    },
    {
      created_at: '2024-05-15T10:17:30.165992+05:30',
      live_nifty: '22171.55',
      strike_price: '22250.00',
      call_net_oi: 211027,
      put_net_oi: 76176
    },
    {
      created_at: '2024-05-15T10:17:30.166050+05:30',
      live_nifty: '22171.55',
      strike_price: '22300.00',
      call_net_oi: 361581,
      put_net_oi: 93643
    },
    {
      created_at: '2024-05-15T10:22:26.267859+05:30',
      live_nifty: '22185.90',
      strike_price: '22100.00',
      call_net_oi: 114169,
      put_net_oi: 184805
    },
    {
      created_at: '2024-05-15T10:22:26.267895+05:30',
      live_nifty: '22185.90',
      strike_price: '22150.00',
      call_net_oi: 79782,
      put_net_oi: 103098
    },
    {
      created_at: '2024-05-15T10:22:26.267930+05:30',
      live_nifty: '22185.90',
      strike_price: '22200.00',
      call_net_oi: 307221,
      put_net_oi: 218040
    },
    {
      created_at: '2024-05-15T10:22:26.267967+05:30',
      live_nifty: '22185.90',
      strike_price: '22250.00',
      call_net_oi: 215622,
      put_net_oi: 68092
    },
    {
      created_at: '2024-05-15T10:22:26.268001+05:30',
      live_nifty: '22185.90',
      strike_price: '22300.00',
      call_net_oi: 373234,
      put_net_oi: 92201
    },
    {
      created_at: '2024-05-15T10:27:25.662953+05:30',
      live_nifty: '22184.70',
      strike_price: '22100.00',
      call_net_oi: 117180,
      put_net_oi: 187353
    },
    {
      created_at: '2024-05-15T10:27:25.663032+05:30',
      live_nifty: '22184.70',
      strike_price: '22150.00',
      call_net_oi: 88064,
      put_net_oi: 105979
    },
    {
      created_at: '2024-05-15T10:27:25.663094+05:30',
      live_nifty: '22184.70',
      strike_price: '22200.00',
      call_net_oi: 325271,
      put_net_oi: 221367
    },
    {
      created_at: '2024-05-15T10:27:25.663137+05:30',
      live_nifty: '22184.70',
      strike_price: '22250.00',
      call_net_oi: 219663,
      put_net_oi: 67794
    },
    {
      created_at: '2024-05-15T10:27:25.663179+05:30',
      live_nifty: '22184.70',
      strike_price: '22300.00',
      call_net_oi: 381967,
      put_net_oi: 92146
    },
    {
      created_at: '2024-05-15T10:32:26.386431+05:30',
      live_nifty: '22160.40',
      strike_price: '22100.00',
      call_net_oi: 118823,
      put_net_oi: 190090
    },
    {
      created_at: '2024-05-15T10:32:26.386478+05:30',
      live_nifty: '22160.40',
      strike_price: '22150.00',
      call_net_oi: 91765,
      put_net_oi: 111312
    },
    {
      created_at: '2024-05-15T10:32:26.386525+05:30',
      live_nifty: '22160.40',
      strike_price: '22200.00',
      call_net_oi: 326764,
      put_net_oi: 218303
    },
    {
      created_at: '2024-05-15T10:32:26.386574+05:30',
      live_nifty: '22160.40',
      strike_price: '22250.00',
      call_net_oi: 219686,
      put_net_oi: 68319
    },
    {
      created_at: '2024-05-15T10:32:26.386622+05:30',
      live_nifty: '22160.40',
      strike_price: '22300.00',
      call_net_oi: 382744,
      put_net_oi: 92715
    },
    {
      created_at: '2024-05-15T10:37:28.921946+05:30',
      live_nifty: '22172.20',
      strike_price: '22100.00',
      call_net_oi: 124853,
      put_net_oi: 192931
    },
    {
      created_at: '2024-05-15T10:37:28.921993+05:30',
      live_nifty: '22172.20',
      strike_price: '22150.00',
      call_net_oi: 103621,
      put_net_oi: 119450
    },
    {
      created_at: '2024-05-15T10:37:28.922040+05:30',
      live_nifty: '22172.20',
      strike_price: '22200.00',
      call_net_oi: 340018,
      put_net_oi: 213335
    },
    {
      created_at: '2024-05-15T10:37:28.922090+05:30',
      live_nifty: '22172.20',
      strike_price: '22250.00',
      call_net_oi: 224163,
      put_net_oi: 63973
    },
    {
      created_at: '2024-05-15T10:37:28.922132+05:30',
      live_nifty: '22172.20',
      strike_price: '22300.00',
      call_net_oi: 392232,
      put_net_oi: 91490
    },
    {
      created_at: '2024-05-15T10:42:25.987917+05:30',
      live_nifty: '22161.40',
      strike_price: '22100.00',
      call_net_oi: 131650,
      put_net_oi: 190935
    },
    {
      created_at: '2024-05-15T10:42:25.987981+05:30',
      live_nifty: '22161.40',
      strike_price: '22150.00',
      call_net_oi: 112760,
      put_net_oi: 117973
    },
    {
      created_at: '2024-05-15T10:42:25.988044+05:30',
      live_nifty: '22161.40',
      strike_price: '22200.00',
      call_net_oi: 349375,
      put_net_oi: 211856
    },
    {
      created_at: '2024-05-15T10:42:25.988110+05:30',
      live_nifty: '22161.40',
      strike_price: '22250.00',
      call_net_oi: 226055,
      put_net_oi: 61839
    },
    {
      created_at: '2024-05-15T10:42:25.988174+05:30',
      live_nifty: '22161.40',
      strike_price: '22300.00',
      call_net_oi: 397241,
      put_net_oi: 90542
    },
    {
      created_at: '2024-05-15T10:47:28.476972+05:30',
      live_nifty: '22179.45',
      strike_price: '22100.00',
      call_net_oi: 134282,
      put_net_oi: 192389
    },
    {
      created_at: '2024-05-15T10:47:28.477017+05:30',
      live_nifty: '22179.45',
      strike_price: '22150.00',
      call_net_oi: 116462,
      put_net_oi: 125199
    },
    {
      created_at: '2024-05-15T10:47:28.477063+05:30',
      live_nifty: '22179.45',
      strike_price: '22200.00',
      call_net_oi: 353192,
      put_net_oi: 210272
    },
    {
      created_at: '2024-05-15T10:47:28.477110+05:30',
      live_nifty: '22179.45',
      strike_price: '22250.00',
      call_net_oi: 227440,
      put_net_oi: 61745
    },
    {
      created_at: '2024-05-15T10:47:28.477156+05:30',
      live_nifty: '22179.45',
      strike_price: '22300.00',
      call_net_oi: 399131,
      put_net_oi: 91729
    },
    {
      created_at: '2024-05-15T10:52:27.720322+05:30',
      live_nifty: '22175.65',
      strike_price: '22100.00',
      call_net_oi: 137611,
      put_net_oi: 191400
    },
    {
      created_at: '2024-05-15T10:52:27.720402+05:30',
      live_nifty: '22175.65',
      strike_price: '22150.00',
      call_net_oi: 125403,
      put_net_oi: 126726
    },
    {
      created_at: '2024-05-15T10:52:27.720469+05:30',
      live_nifty: '22175.65',
      strike_price: '22200.00',
      call_net_oi: 364050,
      put_net_oi: 205668
    },
    {
      created_at: '2024-05-15T10:52:27.720525+05:30',
      live_nifty: '22175.65',
      strike_price: '22250.00',
      call_net_oi: 228405,
      put_net_oi: 61585
    },
    {
      created_at: '2024-05-15T10:52:27.720567+05:30',
      live_nifty: '22175.65',
      strike_price: '22300.00',
      call_net_oi: 402140,
      put_net_oi: 90596
    },
    {
      created_at: '2024-05-15T10:57:27.395239+05:30',
      live_nifty: '22186.95',
      strike_price: '22100.00',
      call_net_oi: 135268,
      put_net_oi: 194850
    },
    {
      created_at: '2024-05-15T10:57:27.395380+05:30',
      live_nifty: '22186.95',
      strike_price: '22150.00',
      call_net_oi: 124157,
      put_net_oi: 127608
    },
    {
      created_at: '2024-05-15T10:57:27.395447+05:30',
      live_nifty: '22186.95',
      strike_price: '22200.00',
      call_net_oi: 363695,
      put_net_oi: 203141
    },
    {
      created_at: '2024-05-15T10:57:27.395512+05:30',
      live_nifty: '22186.95',
      strike_price: '22250.00',
      call_net_oi: 227162,
      put_net_oi: 61115
    },
    {
      created_at: '2024-05-15T10:57:27.395583+05:30',
      live_nifty: '22186.95',
      strike_price: '22300.00',
      call_net_oi: 400794,
      put_net_oi: 89756
    },
    {
      created_at: '2024-05-15T11:02:26.710893+05:30',
      live_nifty: '22241.15',
      strike_price: '22100.00',
      call_net_oi: 132106,
      put_net_oi: 194009
    },
    {
      created_at: '2024-05-15T11:02:26.710967+05:30',
      live_nifty: '22241.15',
      strike_price: '22150.00',
      call_net_oi: 121758,
      put_net_oi: 125456
    },
    {
      created_at: '2024-05-15T11:02:26.711026+05:30',
      live_nifty: '22241.15',
      strike_price: '22200.00',
      call_net_oi: 357793,
      put_net_oi: 204370
    },
    {
      created_at: '2024-05-15T11:02:26.711086+05:30',
      live_nifty: '22241.15',
      strike_price: '22250.00',
      call_net_oi: 222887,
      put_net_oi: 60609
    },
    {
      created_at: '2024-05-15T11:02:26.711144+05:30',
      live_nifty: '22241.15',
      strike_price: '22300.00',
      call_net_oi: 398042,
      put_net_oi: 89533
    },
    {
      created_at: '2024-05-15T11:07:27.370364+05:30',
      live_nifty: '22243.55',
      strike_price: '22100.00',
      call_net_oi: 112305,
      put_net_oi: 205082
    },
    {
      created_at: '2024-05-15T11:07:27.370405+05:30',
      live_nifty: '22243.55',
      strike_price: '22150.00',
      call_net_oi: 85179,
      put_net_oi: 117163
    },
    {
      created_at: '2024-05-15T11:07:27.370446+05:30',
      live_nifty: '22243.55',
      strike_price: '22200.00',
      call_net_oi: 294474,
      put_net_oi: 236231
    },
    {
      created_at: '2024-05-15T11:07:27.370486+05:30',
      live_nifty: '22243.55',
      strike_price: '22250.00',
      call_net_oi: 201506,
      put_net_oi: 73983
    },
    {
      created_at: '2024-05-15T11:07:27.370527+05:30',
      live_nifty: '22243.55',
      strike_price: '22300.00',
      call_net_oi: 345066,
      put_net_oi: 91160
    },
    {
      created_at: '2024-05-15T11:12:26.333660+05:30',
      live_nifty: '22225.90',
      strike_price: '22100.00',
      call_net_oi: 110418,
      put_net_oi: 215768
    },
    {
      created_at: '2024-05-15T11:12:26.333714+05:30',
      live_nifty: '22225.90',
      strike_price: '22150.00',
      call_net_oi: 83007,
      put_net_oi: 120368
    },
    {
      created_at: '2024-05-15T11:12:26.333768+05:30',
      live_nifty: '22225.90',
      strike_price: '22200.00',
      call_net_oi: 282782,
      put_net_oi: 247210
    },
    {
      created_at: '2024-05-15T11:12:26.333821+05:30',
      live_nifty: '22225.90',
      strike_price: '22250.00',
      call_net_oi: 207013,
      put_net_oi: 82518
    },
    {
      created_at: '2024-05-15T11:12:26.333874+05:30',
      live_nifty: '22225.90',
      strike_price: '22300.00',
      call_net_oi: 346337,
      put_net_oi: 96463
    },
    {
      created_at: '2024-05-15T11:17:25.736572+05:30',
      live_nifty: '22230.55',
      strike_price: '22100.00',
      call_net_oi: 107135,
      put_net_oi: 211389
    },
    {
      created_at: '2024-05-15T11:17:25.736638+05:30',
      live_nifty: '22230.55',
      strike_price: '22150.00',
      call_net_oi: 78454,
      put_net_oi: 124558
    },
    {
      created_at: '2024-05-15T11:17:25.736690+05:30',
      live_nifty: '22230.55',
      strike_price: '22200.00',
      call_net_oi: 271666,
      put_net_oi: 263883
    },
    {
      created_at: '2024-05-15T11:17:25.736746+05:30',
      live_nifty: '22230.55',
      strike_price: '22250.00',
      call_net_oi: 209514,
      put_net_oi: 86817
    },
    {
      created_at: '2024-05-15T11:17:25.736816+05:30',
      live_nifty: '22230.55',
      strike_price: '22300.00',
      call_net_oi: 340803,
      put_net_oi: 96292
    },
    {
      created_at: '2024-05-15T11:22:25.939602+05:30',
      live_nifty: '22225.90',
      strike_price: '22100.00',
      call_net_oi: 105569,
      put_net_oi: 217434
    },
    {
      created_at: '2024-05-15T11:22:25.939656+05:30',
      live_nifty: '22225.90',
      strike_price: '22150.00',
      call_net_oi: 76959,
      put_net_oi: 126908
    },
    {
      created_at: '2024-05-15T11:22:25.939705+05:30',
      live_nifty: '22225.90',
      strike_price: '22200.00',
      call_net_oi: 269074,
      put_net_oi: 260505
    },
    {
      created_at: '2024-05-15T11:22:25.939758+05:30',
      live_nifty: '22225.90',
      strike_price: '22250.00',
      call_net_oi: 207277,
      put_net_oi: 90062
    },
    {
      created_at: '2024-05-15T11:22:25.939813+05:30',
      live_nifty: '22225.90',
      strike_price: '22300.00',
      call_net_oi: 340689,
      put_net_oi: 98416
    },
    {
      created_at: '2024-05-15T11:27:25.970537+05:30',
      live_nifty: '22216.90',
      strike_price: '22100.00',
      call_net_oi: 105468,
      put_net_oi: 219078
    },
    {
      created_at: '2024-05-15T11:27:25.970584+05:30',
      live_nifty: '22216.90',
      strike_price: '22150.00',
      call_net_oi: 76617,
      put_net_oi: 123770
    },
    {
      created_at: '2024-05-15T11:27:25.970626+05:30',
      live_nifty: '22216.90',
      strike_price: '22200.00',
      call_net_oi: 273973,
      put_net_oi: 258582
    },
    {
      created_at: '2024-05-15T11:27:25.970668+05:30',
      live_nifty: '22216.90',
      strike_price: '22250.00',
      call_net_oi: 210074,
      put_net_oi: 92142
    },
    {
      created_at: '2024-05-15T11:27:25.970712+05:30',
      live_nifty: '22216.90',
      strike_price: '22300.00',
      call_net_oi: 341709,
      put_net_oi: 98674
    },
    {
      created_at: '2024-05-15T11:32:25.262604+05:30',
      live_nifty: '22180.50',
      strike_price: '22100.00',
      call_net_oi: 105265,
      put_net_oi: 222288
    },
    {
      created_at: '2024-05-15T11:32:25.262668+05:30',
      live_nifty: '22180.50',
      strike_price: '22150.00',
      call_net_oi: 76463,
      put_net_oi: 121161
    },
    {
      created_at: '2024-05-15T11:32:25.262728+05:30',
      live_nifty: '22180.50',
      strike_price: '22200.00',
      call_net_oi: 273479,
      put_net_oi: 260192
    },
    {
      created_at: '2024-05-15T11:32:25.262780+05:30',
      live_nifty: '22180.50',
      strike_price: '22250.00',
      call_net_oi: 208317,
      put_net_oi: 89243
    },
    {
      created_at: '2024-05-15T11:32:25.262839+05:30',
      live_nifty: '22180.50',
      strike_price: '22300.00',
      call_net_oi: 338683,
      put_net_oi: 95211
    },
    {
      created_at: '2024-05-15T11:37:25.230890+05:30',
      live_nifty: '22187.85',
      strike_price: '22100.00',
      call_net_oi: 111348,
      put_net_oi: 191694
    },
    {
      created_at: '2024-05-15T11:37:25.230967+05:30',
      live_nifty: '22187.85',
      strike_price: '22150.00',
      call_net_oi: 85993,
      put_net_oi: 111249
    },
    {
      created_at: '2024-05-15T11:37:25.231043+05:30',
      live_nifty: '22187.85',
      strike_price: '22200.00',
      call_net_oi: 304471,
      put_net_oi: 225863
    },
    {
      created_at: '2024-05-15T11:37:25.231120+05:30',
      live_nifty: '22187.85',
      strike_price: '22250.00',
      call_net_oi: 204678,
      put_net_oi: 69057
    },
    {
      created_at: '2024-05-15T11:37:25.231194+05:30',
      live_nifty: '22187.85',
      strike_price: '22300.00',
      call_net_oi: 343750,
      put_net_oi: 89833
    },
    {
      created_at: '2024-05-15T11:42:40.933738+05:30',
      live_nifty: '22183.60',
      strike_price: '22100.00',
      call_net_oi: 112169,
      put_net_oi: 186980
    },
    {
      created_at: '2024-05-15T11:42:40.933798+05:30',
      live_nifty: '22183.60',
      strike_price: '22150.00',
      call_net_oi: 88352,
      put_net_oi: 113382
    },
    {
      created_at: '2024-05-15T11:42:40.933841+05:30',
      live_nifty: '22183.60',
      strike_price: '22200.00',
      call_net_oi: 307679,
      put_net_oi: 223696
    },
    {
      created_at: '2024-05-15T11:42:40.933884+05:30',
      live_nifty: '22183.60',
      strike_price: '22250.00',
      call_net_oi: 207868,
      put_net_oi: 65199
    },
    {
      created_at: '2024-05-15T11:42:40.933927+05:30',
      live_nifty: '22183.60',
      strike_price: '22300.00',
      call_net_oi: 348059,
      put_net_oi: 91849
    },
    {
      created_at: '2024-05-15T11:47:28.777833+05:30',
      live_nifty: '22182.15',
      strike_price: '22100.00',
      call_net_oi: 112898,
      put_net_oi: 188548
    },
    {
      created_at: '2024-05-15T11:47:28.777877+05:30',
      live_nifty: '22182.15',
      strike_price: '22150.00',
      call_net_oi: 91364,
      put_net_oi: 116808
    },
    {
      created_at: '2024-05-15T11:47:28.777923+05:30',
      live_nifty: '22182.15',
      strike_price: '22200.00',
      call_net_oi: 317492,
      put_net_oi: 224458
    },
    {
      created_at: '2024-05-15T11:47:28.777970+05:30',
      live_nifty: '22182.15',
      strike_price: '22250.00',
      call_net_oi: 209929,
      put_net_oi: 64553
    },
    {
      created_at: '2024-05-15T11:47:28.778016+05:30',
      live_nifty: '22182.15',
      strike_price: '22300.00',
      call_net_oi: 356167,
      put_net_oi: 92117
    },
    {
      created_at: '2024-05-15T11:52:29.188282+05:30',
      live_nifty: '22193.55',
      strike_price: '22100.00',
      call_net_oi: 113089,
      put_net_oi: 190150
    },
    {
      created_at: '2024-05-15T11:52:29.188346+05:30',
      live_nifty: '22193.55',
      strike_price: '22150.00',
      call_net_oi: 93255,
      put_net_oi: 119905
    },
    {
      created_at: '2024-05-15T11:52:29.188404+05:30',
      live_nifty: '22193.55',
      strike_price: '22200.00',
      call_net_oi: 321770,
      put_net_oi: 223550
    },
    {
      created_at: '2024-05-15T11:52:29.189136+05:30',
      live_nifty: '22193.55',
      strike_price: '22250.00',
      call_net_oi: 213045,
      put_net_oi: 63775
    },
    {
      created_at: '2024-05-15T11:52:29.189240+05:30',
      live_nifty: '22193.55',
      strike_price: '22300.00',
      call_net_oi: 349885,
      put_net_oi: 91902
    },
    {
      created_at: '2024-05-15T12:02:30.189083+05:30',
      live_nifty: '22214.70',
      strike_price: '22100.00',
      call_net_oi: 110799,
      put_net_oi: 186042
    },
    {
      created_at: '2024-05-15T12:02:30.189161+05:30',
      live_nifty: '22214.70',
      strike_price: '22150.00',
      call_net_oi: 87497,
      put_net_oi: 112146
    },
    {
      created_at: '2024-05-15T12:02:30.189242+05:30',
      live_nifty: '22214.70',
      strike_price: '22200.00',
      call_net_oi: 313154,
      put_net_oi: 219776
    },
    {
      created_at: '2024-05-15T12:02:30.189320+05:30',
      live_nifty: '22214.70',
      strike_price: '22250.00',
      call_net_oi: 207583,
      put_net_oi: 64971
    },
    {
      created_at: '2024-05-15T12:02:30.189403+05:30',
      live_nifty: '22214.70',
      strike_price: '22300.00',
      call_net_oi: 340860,
      put_net_oi: 91101
    },
    {
      created_at: '2024-05-15T12:07:28.008063+05:30',
      live_nifty: '22210.35',
      strike_price: '22100.00',
      call_net_oi: 108393,
      put_net_oi: 196121
    },
    {
      created_at: '2024-05-15T12:07:28.008153+05:30',
      live_nifty: '22210.35',
      strike_price: '22150.00',
      call_net_oi: 83738,
      put_net_oi: 118607
    },
    {
      created_at: '2024-05-15T12:07:28.008257+05:30',
      live_nifty: '22210.35',
      strike_price: '22200.00',
      call_net_oi: 299339,
      put_net_oi: 225564
    },
    {
      created_at: '2024-05-15T12:07:28.008304+05:30',
      live_nifty: '22210.35',
      strike_price: '22250.00',
      call_net_oi: 206042,
      put_net_oi: 67249
    },
    {
      created_at: '2024-05-15T12:07:28.008347+05:30',
      live_nifty: '22210.35',
      strike_price: '22300.00',
      call_net_oi: 335937,
      put_net_oi: 90129
    },
    {
      created_at: '2024-05-15T12:12:26.453857+05:30',
      live_nifty: '22211.55',
      strike_price: '22100.00',
      call_net_oi: 108725,
      put_net_oi: 196571
    },
    {
      created_at: '2024-05-15T12:12:26.453923+05:30',
      live_nifty: '22211.55',
      strike_price: '22150.00',
      call_net_oi: 84199,
      put_net_oi: 119429
    },
    {
      created_at: '2024-05-15T12:12:26.453979+05:30',
      live_nifty: '22211.55',
      strike_price: '22200.00',
      call_net_oi: 301438,
      put_net_oi: 222606
    },
    {
      created_at: '2024-05-15T12:12:26.454042+05:30',
      live_nifty: '22211.55',
      strike_price: '22250.00',
      call_net_oi: 207820,
      put_net_oi: 67874
    },
    {
      created_at: '2024-05-15T12:12:26.454104+05:30',
      live_nifty: '22211.55',
      strike_price: '22300.00',
      call_net_oi: 335103,
      put_net_oi: 90313
    },
    {
      created_at: '2024-05-15T12:17:27.713715+05:30',
      live_nifty: '22205.20',
      strike_price: '22100.00',
      call_net_oi: 110212,
      put_net_oi: 198128
    },
    {
      created_at: '2024-05-15T12:17:27.713764+05:30',
      live_nifty: '22205.20',
      strike_price: '22150.00',
      call_net_oi: 84111,
      put_net_oi: 117035
    },
    {
      created_at: '2024-05-15T12:17:27.713806+05:30',
      live_nifty: '22205.20',
      strike_price: '22200.00',
      call_net_oi: 310985,
      put_net_oi: 223995
    },
    {
      created_at: '2024-05-15T12:17:27.714414+05:30',
      live_nifty: '22205.20',
      strike_price: '22250.00',
      call_net_oi: 213666,
      put_net_oi: 67988
    },
    {
      created_at: '2024-05-15T12:17:27.714494+05:30',
      live_nifty: '22205.20',
      strike_price: '22300.00',
      call_net_oi: 342056,
      put_net_oi: 89568
    },
    {
      created_at: '2024-05-15T12:22:31.084825+05:30',
      live_nifty: '22195.55',
      strike_price: '22100.00',
      call_net_oi: 110590,
      put_net_oi: 195390
    },
    {
      created_at: '2024-05-15T12:22:31.084864+05:30',
      live_nifty: '22195.55',
      strike_price: '22150.00',
      call_net_oi: 83612,
      put_net_oi: 117234
    },
    {
      created_at: '2024-05-15T12:22:31.084903+05:30',
      live_nifty: '22195.55',
      strike_price: '22200.00',
      call_net_oi: 314020,
      put_net_oi: 227497
    },
    {
      created_at: '2024-05-15T12:22:31.084946+05:30',
      live_nifty: '22195.55',
      strike_price: '22250.00',
      call_net_oi: 213091,
      put_net_oi: 68641
    },
    {
      created_at: '2024-05-15T12:22:31.084988+05:30',
      live_nifty: '22195.55',
      strike_price: '22300.00',
      call_net_oi: 344094,
      put_net_oi: 89475
    },
    {
      created_at: '2024-05-15T12:27:27.277495+05:30',
      live_nifty: '22200.45',
      strike_price: '22100.00',
      call_net_oi: 109582,
      put_net_oi: 192256
    },
    {
      created_at: '2024-05-15T12:27:27.277561+05:30',
      live_nifty: '22200.45',
      strike_price: '22150.00',
      call_net_oi: 85943,
      put_net_oi: 117095
    },
    {
      created_at: '2024-05-15T12:27:27.277624+05:30',
      live_nifty: '22200.45',
      strike_price: '22200.00',
      call_net_oi: 320336,
      put_net_oi: 224274
    },
    {
      created_at: '2024-05-15T12:27:27.277716+05:30',
      live_nifty: '22200.45',
      strike_price: '22250.00',
      call_net_oi: 216375,
      put_net_oi: 64837
    },
    {
      created_at: '2024-05-15T12:27:27.277810+05:30',
      live_nifty: '22200.45',
      strike_price: '22300.00',
      call_net_oi: 347251,
      put_net_oi: 88856
    },
    {
      created_at: '2024-05-15T12:32:26.296054+05:30',
      live_nifty: '22209.30',
      strike_price: '22100.00',
      call_net_oi: 111196,
      put_net_oi: 190558
    },
    {
      created_at: '2024-05-15T12:32:26.296100+05:30',
      live_nifty: '22209.30',
      strike_price: '22150.00',
      call_net_oi: 85728,
      put_net_oi: 114346
    },
    {
      created_at: '2024-05-15T12:32:26.296157+05:30',
      live_nifty: '22209.30',
      strike_price: '22200.00',
      call_net_oi: 323136,
      put_net_oi: 222437
    },
    {
      created_at: '2024-05-15T12:32:26.296204+05:30',
      live_nifty: '22209.30',
      strike_price: '22250.00',
      call_net_oi: 215537,
      put_net_oi: 64616
    },
    {
      created_at: '2024-05-15T12:32:26.296248+05:30',
      live_nifty: '22209.30',
      strike_price: '22300.00',
      call_net_oi: 351156,
      put_net_oi: 89681
    },
    {
      created_at: '2024-05-15T12:37:25.690078+05:30',
      live_nifty: '22200.80',
      strike_price: '22100.00',
      call_net_oi: 110450,
      put_net_oi: 193707
    },
    {
      created_at: '2024-05-15T12:37:25.690124+05:30',
      live_nifty: '22200.80',
      strike_price: '22150.00',
      call_net_oi: 85108,
      put_net_oi: 117261
    },
    {
      created_at: '2024-05-15T12:37:25.690165+05:30',
      live_nifty: '22200.80',
      strike_price: '22200.00',
      call_net_oi: 327662,
      put_net_oi: 229423
    },
    {
      created_at: '2024-05-15T12:37:25.690263+05:30',
      live_nifty: '22200.80',
      strike_price: '22250.00',
      call_net_oi: 216665,
      put_net_oi: 66081
    },
    {
      created_at: '2024-05-15T12:37:25.690321+05:30',
      live_nifty: '22200.80',
      strike_price: '22300.00',
      call_net_oi: 347943,
      put_net_oi: 88152
    },
    {
      created_at: '2024-05-15T12:42:29.043937+05:30',
      live_nifty: '22210.20',
      strike_price: '22100.00',
      call_net_oi: 109762,
      put_net_oi: 195403
    },
    {
      created_at: '2024-05-15T12:42:29.043996+05:30',
      live_nifty: '22210.20',
      strike_price: '22150.00',
      call_net_oi: 83583,
      put_net_oi: 119271
    },
    {
      created_at: '2024-05-15T12:42:29.044064+05:30',
      live_nifty: '22210.20',
      strike_price: '22200.00',
      call_net_oi: 323092,
      put_net_oi: 231431
    },
    {
      created_at: '2024-05-15T12:42:29.044113+05:30',
      live_nifty: '22210.20',
      strike_price: '22250.00',
      call_net_oi: 213370,
      put_net_oi: 64676
    },
    {
      created_at: '2024-05-15T12:42:29.044176+05:30',
      live_nifty: '22210.20',
      strike_price: '22300.00',
      call_net_oi: 346711,
      put_net_oi: 88882
    },
    {
      created_at: '2024-05-15T12:47:28.628955+05:30',
      live_nifty: '22197.60',
      strike_price: '22100.00',
      call_net_oi: 110366,
      put_net_oi: 198981
    },
    {
      created_at: '2024-05-15T12:47:28.629004+05:30',
      live_nifty: '22197.60',
      strike_price: '22150.00',
      call_net_oi: 83227,
      put_net_oi: 116678
    },
    {
      created_at: '2024-05-15T12:47:28.629061+05:30',
      live_nifty: '22197.60',
      strike_price: '22200.00',
      call_net_oi: 330351,
      put_net_oi: 231692
    },
    {
      created_at: '2024-05-15T12:47:28.629107+05:30',
      live_nifty: '22197.60',
      strike_price: '22250.00',
      call_net_oi: 215439,
      put_net_oi: 65249
    },
    {
      created_at: '2024-05-15T12:47:28.629153+05:30',
      live_nifty: '22197.60',
      strike_price: '22300.00',
      call_net_oi: 349624,
      put_net_oi: 87125
    },
    {
      created_at: '2024-05-15T12:52:27.631057+05:30',
      live_nifty: '22196.95',
      strike_price: '22100.00',
      call_net_oi: 109607,
      put_net_oi: 195650
    },
    {
      created_at: '2024-05-15T12:52:27.631102+05:30',
      live_nifty: '22196.95',
      strike_price: '22150.00',
      call_net_oi: 83304,
      put_net_oi: 124671
    },
    {
      created_at: '2024-05-15T12:52:27.631173+05:30',
      live_nifty: '22196.95',
      strike_price: '22200.00',
      call_net_oi: 325639,
      put_net_oi: 234429
    },
    {
      created_at: '2024-05-15T12:52:27.631220+05:30',
      live_nifty: '22196.95',
      strike_price: '22250.00',
      call_net_oi: 207402,
      put_net_oi: 64249
    },
    {
      created_at: '2024-05-15T12:52:27.631284+05:30',
      live_nifty: '22196.95',
      strike_price: '22300.00',
      call_net_oi: 347550,
      put_net_oi: 86899
    },
    {
      created_at: '2024-05-15T12:57:29.511032+05:30',
      live_nifty: '22195.60',
      strike_price: '22100.00',
      call_net_oi: 110925,
      put_net_oi: 195238
    },
    {
      created_at: '2024-05-15T12:57:29.511100+05:30',
      live_nifty: '22195.60',
      strike_price: '22150.00',
      call_net_oi: 83928,
      put_net_oi: 126285
    },
    {
      created_at: '2024-05-15T12:57:29.511169+05:30',
      live_nifty: '22195.60',
      strike_price: '22200.00',
      call_net_oi: 332820,
      put_net_oi: 234208
    },
    {
      created_at: '2024-05-15T12:57:29.511235+05:30',
      live_nifty: '22195.60',
      strike_price: '22250.00',
      call_net_oi: 209619,
      put_net_oi: 64401
    },
    {
      created_at: '2024-05-15T12:57:29.511367+05:30',
      live_nifty: '22195.60',
      strike_price: '22300.00',
      call_net_oi: 348292,
      put_net_oi: 87240
    },
    {
      created_at: '2024-05-15T13:02:26.682191+05:30',
      live_nifty: '22194.65',
      strike_price: '22100.00',
      call_net_oi: 112259,
      put_net_oi: 196472
    },
    {
      created_at: '2024-05-15T13:02:26.682231+05:30',
      live_nifty: '22194.65',
      strike_price: '22150.00',
      call_net_oi: 85542,
      put_net_oi: 125879
    },
    {
      created_at: '2024-05-15T13:02:26.682271+05:30',
      live_nifty: '22194.65',
      strike_price: '22200.00',
      call_net_oi: 333134,
      put_net_oi: 236099
    },
    {
      created_at: '2024-05-15T13:02:26.682313+05:30',
      live_nifty: '22194.65',
      strike_price: '22250.00',
      call_net_oi: 211358,
      put_net_oi: 64756
    },
    {
      created_at: '2024-05-15T13:02:26.682356+05:30',
      live_nifty: '22194.65',
      strike_price: '22300.00',
      call_net_oi: 347933,
      put_net_oi: 87961
    },
    {
      created_at: '2024-05-15T13:07:26.575525+05:30',
      live_nifty: '22215.95',
      strike_price: '22100.00',
      call_net_oi: 112529,
      put_net_oi: 198695
    },
    {
      created_at: '2024-05-15T13:07:26.575950+05:30',
      live_nifty: '22215.95',
      strike_price: '22150.00',
      call_net_oi: 85429,
      put_net_oi: 129436
    },
    {
      created_at: '2024-05-15T13:07:26.576026+05:30',
      live_nifty: '22215.95',
      strike_price: '22200.00',
      call_net_oi: 338603,
      put_net_oi: 239348
    },
    {
      created_at: '2024-05-15T13:07:26.576076+05:30',
      live_nifty: '22215.95',
      strike_price: '22250.00',
      call_net_oi: 213854,
      put_net_oi: 63568
    },
    {
      created_at: '2024-05-15T13:07:26.576122+05:30',
      live_nifty: '22215.95',
      strike_price: '22300.00',
      call_net_oi: 350264,
      put_net_oi: 88621
    },
    {
      created_at: '2024-05-15T13:12:26.596307+05:30',
      live_nifty: '22198.40',
      strike_price: '22100.00',
      call_net_oi: 112478,
      put_net_oi: 196904
    },
    {
      created_at: '2024-05-15T13:12:26.596344+05:30',
      live_nifty: '22198.40',
      strike_price: '22150.00',
      call_net_oi: 84448,
      put_net_oi: 127224
    },
    {
      created_at: '2024-05-15T13:12:26.596379+05:30',
      live_nifty: '22198.40',
      strike_price: '22200.00',
      call_net_oi: 335971,
      put_net_oi: 236605
    },
    {
      created_at: '2024-05-15T13:12:26.596414+05:30',
      live_nifty: '22198.40',
      strike_price: '22250.00',
      call_net_oi: 213051,
      put_net_oi: 64629
    },
    {
      created_at: '2024-05-15T13:12:26.596451+05:30',
      live_nifty: '22198.40',
      strike_price: '22300.00',
      call_net_oi: 354745,
      put_net_oi: 85893
    },
    {
      created_at: '2024-05-15T13:17:26.477216+05:30',
      live_nifty: '22191.75',
      strike_price: '22100.00',
      call_net_oi: 112687,
      put_net_oi: 195467
    },
    {
      created_at: '2024-05-15T13:17:26.477252+05:30',
      live_nifty: '22191.75',
      strike_price: '22150.00',
      call_net_oi: 84555,
      put_net_oi: 126578
    },
    {
      created_at: '2024-05-15T13:17:26.477288+05:30',
      live_nifty: '22191.75',
      strike_price: '22200.00',
      call_net_oi: 339197,
      put_net_oi: 235988
    },
    {
      created_at: '2024-05-15T13:17:26.477323+05:30',
      live_nifty: '22191.75',
      strike_price: '22250.00',
      call_net_oi: 215313,
      put_net_oi: 64220
    },
    {
      created_at: '2024-05-15T13:17:26.477358+05:30',
      live_nifty: '22191.75',
      strike_price: '22300.00',
      call_net_oi: 356828,
      put_net_oi: 86015
    },
    {
      created_at: '2024-05-15T10:12:25.054686+05:30',
      live_nifty: '22181.75',
      strike_price: '22150.00',
      call_net_oi: 53754,
      put_net_oi: 85269
    },
    {
      created_at: '2024-05-15T10:12:25.054742+05:30',
      live_nifty: '22181.75',
      strike_price: '22200.00',
      call_net_oi: 237472,
      put_net_oi: 212096
    },
    {
      created_at: '2024-05-15T10:12:25.054797+05:30',
      live_nifty: '22181.75',
      strike_price: '22250.00',
      call_net_oi: 201379,
      put_net_oi: 100293
    },
    {
      created_at: '2024-05-15T10:12:25.054852+05:30',
      live_nifty: '22181.75',
      strike_price: '22300.00',
      call_net_oi: 354195,
      put_net_oi: 109135
    },
    {
      created_at: '2024-05-15T13:22:26.596225+05:30',
      live_nifty: '22196.40',
      strike_price: '22100.00',
      call_net_oi: 112503,
      put_net_oi: 200353
    },
    {
      created_at: '2024-05-15T13:22:26.596265+05:30',
      live_nifty: '22196.40',
      strike_price: '22150.00',
      call_net_oi: 86909,
      put_net_oi: 129154
    },
    {
      created_at: '2024-05-15T13:22:26.596314+05:30',
      live_nifty: '22196.40',
      strike_price: '22200.00',
      call_net_oi: 343961,
      put_net_oi: 237467
    },
    {
      created_at: '2024-05-15T13:22:26.596377+05:30',
      live_nifty: '22196.40',
      strike_price: '22250.00',
      call_net_oi: 216767,
      put_net_oi: 64946
    },
    {
      created_at: '2024-05-15T13:22:26.596437+05:30',
      live_nifty: '22196.40',
      strike_price: '22300.00',
      call_net_oi: 357740,
      put_net_oi: 88101
    },
    {
      created_at: '2024-05-15T13:27:26.532507+05:30',
      live_nifty: '22205.50',
      strike_price: '22100.00',
      call_net_oi: 113719,
      put_net_oi: 202044
    },
    {
      created_at: '2024-05-15T13:27:26.532580+05:30',
      live_nifty: '22205.50',
      strike_price: '22150.00',
      call_net_oi: 87920,
      put_net_oi: 129093
    },
    {
      created_at: '2024-05-15T13:27:26.532654+05:30',
      live_nifty: '22205.50',
      strike_price: '22200.00',
      call_net_oi: 351049,
      put_net_oi: 228068
    },
    {
      created_at: '2024-05-15T13:27:26.532721+05:30',
      live_nifty: '22205.50',
      strike_price: '22250.00',
      call_net_oi: 216993,
      put_net_oi: 63541
    },
    {
      created_at: '2024-05-15T13:27:26.532763+05:30',
      live_nifty: '22205.50',
      strike_price: '22300.00',
      call_net_oi: 359262,
      put_net_oi: 83831
    },
    {
      created_at: '2024-05-15T13:32:27.886545+05:30',
      live_nifty: '22176.70',
      strike_price: '22100.00',
      call_net_oi: 115793,
      put_net_oi: 203574
    },
    {
      created_at: '2024-05-15T13:32:27.886591+05:30',
      live_nifty: '22176.70',
      strike_price: '22150.00',
      call_net_oi: 89283,
      put_net_oi: 127846
    },
    {
      created_at: '2024-05-15T13:32:27.886637+05:30',
      live_nifty: '22176.70',
      strike_price: '22200.00',
      call_net_oi: 347289,
      put_net_oi: 228102
    },
    {
      created_at: '2024-05-15T13:32:27.886680+05:30',
      live_nifty: '22176.70',
      strike_price: '22250.00',
      call_net_oi: 220503,
      put_net_oi: 63110
    },
    {
      created_at: '2024-05-15T13:32:27.886735+05:30',
      live_nifty: '22176.70',
      strike_price: '22300.00',
      call_net_oi: 358098,
      put_net_oi: 84341
    },
    {
      created_at: '2024-05-15T13:37:27.911076+05:30',
      live_nifty: '22190.45',
      strike_price: '22100.00',
      call_net_oi: 120023,
      put_net_oi: 202783
    },
    {
      created_at: '2024-05-15T13:37:27.911116+05:30',
      live_nifty: '22190.45',
      strike_price: '22150.00',
      call_net_oi: 93461,
      put_net_oi: 124982
    },
    {
      created_at: '2024-05-15T13:37:27.911158+05:30',
      live_nifty: '22190.45',
      strike_price: '22200.00',
      call_net_oi: 351597,
      put_net_oi: 221353
    },
    {
      created_at: '2024-05-15T13:37:27.911201+05:30',
      live_nifty: '22190.45',
      strike_price: '22250.00',
      call_net_oi: 220446,
      put_net_oi: 62620
    },
    {
      created_at: '2024-05-15T13:37:27.911242+05:30',
      live_nifty: '22190.45',
      strike_price: '22300.00',
      call_net_oi: 358756,
      put_net_oi: 83446
    },
    {
      created_at: '2024-05-15T13:42:27.434920+05:30',
      live_nifty: '22177.50',
      strike_price: '22100.00',
      call_net_oi: 120749,
      put_net_oi: 202376
    },
    {
      created_at: '2024-05-15T13:42:27.434972+05:30',
      live_nifty: '22177.50',
      strike_price: '22150.00',
      call_net_oi: 95049,
      put_net_oi: 124662
    },
    {
      created_at: '2024-05-15T13:42:27.435020+05:30',
      live_nifty: '22177.50',
      strike_price: '22200.00',
      call_net_oi: 356572,
      put_net_oi: 222100
    },
    {
      created_at: '2024-05-15T13:42:27.435068+05:30',
      live_nifty: '22177.50',
      strike_price: '22250.00',
      call_net_oi: 220657,
      put_net_oi: 62295
    },
    {
      created_at: '2024-05-15T13:42:27.435118+05:30',
      live_nifty: '22177.50',
      strike_price: '22300.00',
      call_net_oi: 362133,
      put_net_oi: 83157
    },
    {
      created_at: '2024-05-15T13:47:27.068370+05:30',
      live_nifty: '22181.45',
      strike_price: '22100.00',
      call_net_oi: 121700,
      put_net_oi: 202232
    },
    {
      created_at: '2024-05-15T13:47:27.068411+05:30',
      live_nifty: '22181.45',
      strike_price: '22150.00',
      call_net_oi: 98875,
      put_net_oi: 128012
    },
    {
      created_at: '2024-05-15T13:47:27.068451+05:30',
      live_nifty: '22181.45',
      strike_price: '22200.00',
      call_net_oi: 370809,
      put_net_oi: 222909
    },
    {
      created_at: '2024-05-15T13:47:27.068493+05:30',
      live_nifty: '22181.45',
      strike_price: '22250.00',
      call_net_oi: 224039,
      put_net_oi: 62115
    },
    {
      created_at: '2024-05-15T13:47:27.068539+05:30',
      live_nifty: '22181.45',
      strike_price: '22300.00',
      call_net_oi: 363044,
      put_net_oi: 82424
    },
    {
      created_at: '2024-05-15T13:52:26.641485+05:30',
      live_nifty: '22177.50',
      strike_price: '22100.00',
      call_net_oi: 122796,
      put_net_oi: 201840
    },
    {
      created_at: '2024-05-15T13:52:26.641552+05:30',
      live_nifty: '22177.50',
      strike_price: '22150.00',
      call_net_oi: 102177,
      put_net_oi: 128345
    },
    {
      created_at: '2024-05-15T13:52:26.641605+05:30',
      live_nifty: '22177.50',
      strike_price: '22200.00',
      call_net_oi: 377407,
      put_net_oi: 222867
    },
    {
      created_at: '2024-05-15T13:52:26.641687+05:30',
      live_nifty: '22177.50',
      strike_price: '22250.00',
      call_net_oi: 226941,
      put_net_oi: 61070
    },
    {
      created_at: '2024-05-15T13:52:26.641754+05:30',
      live_nifty: '22177.50',
      strike_price: '22300.00',
      call_net_oi: 363531,
      put_net_oi: 80515
    },
    {
      created_at: '2024-05-15T13:57:27.412615+05:30',
      live_nifty: '22187.95',
      strike_price: '22100.00',
      call_net_oi: 122668,
      put_net_oi: 197851
    },
    {
      created_at: '2024-05-15T13:57:27.412661+05:30',
      live_nifty: '22187.95',
      strike_price: '22150.00',
      call_net_oi: 107339,
      put_net_oi: 130315
    },
    {
      created_at: '2024-05-15T13:57:27.412706+05:30',
      live_nifty: '22187.95',
      strike_price: '22200.00',
      call_net_oi: 379015,
      put_net_oi: 221345
    },
    {
      created_at: '2024-05-15T13:57:27.412750+05:30',
      live_nifty: '22187.95',
      strike_price: '22250.00',
      call_net_oi: 229154,
      put_net_oi: 59982
    },
    {
      created_at: '2024-05-15T13:57:27.412794+05:30',
      live_nifty: '22187.95',
      strike_price: '22300.00',
      call_net_oi: 365324,
      put_net_oi: 79150
    },
    {
      created_at: '2024-05-15T14:02:26.743766+05:30',
      live_nifty: '22190.75',
      strike_price: '22100.00',
      call_net_oi: 122081,
      put_net_oi: 197347
    },
    {
      created_at: '2024-05-15T14:02:26.743808+05:30',
      live_nifty: '22190.75',
      strike_price: '22150.00',
      call_net_oi: 107000,
      put_net_oi: 131151
    },
    {
      created_at: '2024-05-15T14:02:26.743857+05:30',
      live_nifty: '22190.75',
      strike_price: '22200.00',
      call_net_oi: 379693,
      put_net_oi: 218889
    },
    {
      created_at: '2024-05-15T14:02:26.743911+05:30',
      live_nifty: '22190.75',
      strike_price: '22250.00',
      call_net_oi: 226995,
      put_net_oi: 60271
    },
    {
      created_at: '2024-05-15T14:02:26.743953+05:30',
      live_nifty: '22190.75',
      strike_price: '22300.00',
      call_net_oi: 362961,
      put_net_oi: 77934
    },
    {
      created_at: '2024-05-15T14:07:26.652162+05:30',
      live_nifty: '22201.25',
      strike_price: '22100.00',
      call_net_oi: 120297,
      put_net_oi: 197523
    },
    {
      created_at: '2024-05-15T14:07:26.652213+05:30',
      live_nifty: '22201.25',
      strike_price: '22150.00',
      call_net_oi: 100833,
      put_net_oi: 130743
    },
    {
      created_at: '2024-05-15T14:07:26.652258+05:30',
      live_nifty: '22201.25',
      strike_price: '22200.00',
      call_net_oi: 379044,
      put_net_oi: 223098
    },
    {
      created_at: '2024-05-15T14:07:26.652498+05:30',
      live_nifty: '22201.25',
      strike_price: '22250.00',
      call_net_oi: 223012,
      put_net_oi: 59877
    },
    {
      created_at: '2024-05-15T14:07:26.652674+05:30',
      live_nifty: '22201.25',
      strike_price: '22300.00',
      call_net_oi: 367870,
      put_net_oi: 77584
    },
    {
      created_at: '2024-05-15T14:12:28.116025+05:30',
      live_nifty: '22201.20',
      strike_price: '22100.00',
      call_net_oi: 118928,
      put_net_oi: 195368
    },
    {
      created_at: '2024-05-15T14:12:28.116065+05:30',
      live_nifty: '22201.20',
      strike_price: '22150.00',
      call_net_oi: 99008,
      put_net_oi: 131035
    },
    {
      created_at: '2024-05-15T14:12:28.116106+05:30',
      live_nifty: '22201.20',
      strike_price: '22200.00',
      call_net_oi: 375731,
      put_net_oi: 223182
    },
    {
      created_at: '2024-05-15T14:12:28.116147+05:30',
      live_nifty: '22201.20',
      strike_price: '22250.00',
      call_net_oi: 218238,
      put_net_oi: 59744
    },
    {
      created_at: '2024-05-15T14:12:28.116189+05:30',
      live_nifty: '22201.20',
      strike_price: '22300.00',
      call_net_oi: 364544,
      put_net_oi: 77053
    },
    {
      created_at: '2024-05-15T14:17:28.429926+05:30',
      live_nifty: '22210.00',
      strike_price: '22100.00',
      call_net_oi: 118692,
      put_net_oi: 196167
    },
    {
      created_at: '2024-05-15T14:17:28.429970+05:30',
      live_nifty: '22210.00',
      strike_price: '22150.00',
      call_net_oi: 102740,
      put_net_oi: 130356
    },
    {
      created_at: '2024-05-15T14:17:28.430012+05:30',
      live_nifty: '22210.00',
      strike_price: '22200.00',
      call_net_oi: 375905,
      put_net_oi: 226388
    },
    {
      created_at: '2024-05-15T14:17:28.430055+05:30',
      live_nifty: '22210.00',
      strike_price: '22250.00',
      call_net_oi: 219457,
      put_net_oi: 60863
    },
    {
      created_at: '2024-05-15T14:17:28.430112+05:30',
      live_nifty: '22210.00',
      strike_price: '22300.00',
      call_net_oi: 361152,
      put_net_oi: 76543
    },
    {
      created_at: '2024-05-15T14:22:27.715824+05:30',
      live_nifty: '22196.30',
      strike_price: '22100.00',
      call_net_oi: 116745,
      put_net_oi: 196768
    },
    {
      created_at: '2024-05-15T14:22:27.715862+05:30',
      live_nifty: '22196.30',
      strike_price: '22150.00',
      call_net_oi: 93066,
      put_net_oi: 128121
    },
    {
      created_at: '2024-05-15T14:22:27.715897+05:30',
      live_nifty: '22196.30',
      strike_price: '22200.00',
      call_net_oi: 358908,
      put_net_oi: 226305
    },
    {
      created_at: '2024-05-15T14:22:27.715933+05:30',
      live_nifty: '22196.30',
      strike_price: '22250.00',
      call_net_oi: 222602,
      put_net_oi: 65119
    },
    {
      created_at: '2024-05-15T14:22:27.715983+05:30',
      live_nifty: '22196.30',
      strike_price: '22300.00',
      call_net_oi: 350989,
      put_net_oi: 78205
    },
    {
      created_at: '2024-05-15T14:27:26.702163+05:30',
      live_nifty: '22185.10',
      strike_price: '22100.00',
      call_net_oi: 117445,
      put_net_oi: 204019
    },
    {
      created_at: '2024-05-15T14:27:26.702204+05:30',
      live_nifty: '22185.10',
      strike_price: '22150.00',
      call_net_oi: 93205,
      put_net_oi: 126957
    },
    {
      created_at: '2024-05-15T14:27:26.702251+05:30',
      live_nifty: '22185.10',
      strike_price: '22200.00',
      call_net_oi: 360593,
      put_net_oi: 229171
    },
    {
      created_at: '2024-05-15T14:27:26.702488+05:30',
      live_nifty: '22185.10',
      strike_price: '22250.00',
      call_net_oi: 223002,
      put_net_oi: 65777
    },
    {
      created_at: '2024-05-15T14:27:26.702746+05:30',
      live_nifty: '22185.10',
      strike_price: '22300.00',
      call_net_oi: 354316,
      put_net_oi: 78158
    },
    {
      created_at: '2024-05-15T14:32:31.850145+05:30',
      live_nifty: '22193.25',
      strike_price: '22100.00',
      call_net_oi: 117845,
      put_net_oi: 206272
    },
    {
      created_at: '2024-05-15T14:32:31.850395+05:30',
      live_nifty: '22193.25',
      strike_price: '22150.00',
      call_net_oi: 93665,
      put_net_oi: 128735
    },
    {
      created_at: '2024-05-15T14:32:31.850511+05:30',
      live_nifty: '22193.25',
      strike_price: '22200.00',
      call_net_oi: 355429,
      put_net_oi: 238258
    },
    {
      created_at: '2024-05-15T14:32:31.850585+05:30',
      live_nifty: '22193.25',
      strike_price: '22250.00',
      call_net_oi: 223192,
      put_net_oi: 67148
    },
    {
      created_at: '2024-05-15T10:07:29.957514+05:30',
      live_nifty: '22201.45',
      strike_price: '22250.00',
      call_net_oi: 190407,
      put_net_oi: 112397
    },
    {
      created_at: '2024-05-15T10:07:29.957583+05:30',
      live_nifty: '22201.45',
      strike_price: '22300.00',
      call_net_oi: 344751,
      put_net_oi: 115424
    },
    {
      created_at: '2024-05-15T14:37:29.943758+05:30',
      live_nifty: '22204.60',
      strike_price: '22100.00',
      call_net_oi: 117266,
      put_net_oi: 209897
    },
    {
      created_at: '2024-05-15T14:37:29.943810+05:30',
      live_nifty: '22204.60',
      strike_price: '22150.00',
      call_net_oi: 94171,
      put_net_oi: 127323
    },
    {
      created_at: '2024-05-15T14:37:29.943861+05:30',
      live_nifty: '22204.60',
      strike_price: '22200.00',
      call_net_oi: 357451,
      put_net_oi: 237061
    },
    {
      created_at: '2024-05-15T14:37:29.943914+05:30',
      live_nifty: '22204.60',
      strike_price: '22250.00',
      call_net_oi: 221837,
      put_net_oi: 66844
    },
    {
      created_at: '2024-05-15T14:37:29.943964+05:30',
      live_nifty: '22204.60',
      strike_price: '22300.00',
      call_net_oi: 354142,
      put_net_oi: 74608
    },
    {
      created_at: '2024-05-15T14:42:29.233723+05:30',
      live_nifty: '22209.10',
      strike_price: '22100.00',
      call_net_oi: 115859,
      put_net_oi: 219190
    },
    {
      created_at: '2024-05-15T14:42:29.233783+05:30',
      live_nifty: '22209.10',
      strike_price: '22150.00',
      call_net_oi: 91976,
      put_net_oi: 126513
    },
    {
      created_at: '2024-05-15T14:42:29.233829+05:30',
      live_nifty: '22209.10',
      strike_price: '22200.00',
      call_net_oi: 359339,
      put_net_oi: 238903
    },
    {
      created_at: '2024-05-15T14:42:29.233895+05:30',
      live_nifty: '22209.10',
      strike_price: '22250.00',
      call_net_oi: 222925,
      put_net_oi: 68126
    },
    {
      created_at: '2024-05-15T14:42:29.233939+05:30',
      live_nifty: '22209.10',
      strike_price: '22300.00',
      call_net_oi: 355854,
      put_net_oi: 74719
    },
    {
      created_at: '2024-05-15T14:47:26.610726+05:30',
      live_nifty: '22208.80',
      strike_price: '22100.00',
      call_net_oi: 115720,
      put_net_oi: 216892
    },
    {
      created_at: '2024-05-15T14:47:26.610788+05:30',
      live_nifty: '22208.80',
      strike_price: '22150.00',
      call_net_oi: 89658,
      put_net_oi: 128371
    },
    {
      created_at: '2024-05-15T14:47:26.610855+05:30',
      live_nifty: '22208.80',
      strike_price: '22200.00',
      call_net_oi: 356906,
      put_net_oi: 242441
    },
    {
      created_at: '2024-05-15T14:47:26.610925+05:30',
      live_nifty: '22208.80',
      strike_price: '22250.00',
      call_net_oi: 222583,
      put_net_oi: 66397
    },
    {
      created_at: '2024-05-15T14:47:26.610987+05:30',
      live_nifty: '22208.80',
      strike_price: '22300.00',
      call_net_oi: 354867,
      put_net_oi: 77448
    },
    {
      created_at: '2024-05-15T14:52:26.891848+05:30',
      live_nifty: '22222.95',
      strike_price: '22100.00',
      call_net_oi: 111400,
      put_net_oi: 218982
    },
    {
      created_at: '2024-05-15T14:52:26.891911+05:30',
      live_nifty: '22222.95',
      strike_price: '22150.00',
      call_net_oi: 86650,
      put_net_oi: 134564
    },
    {
      created_at: '2024-05-15T14:52:26.891974+05:30',
      live_nifty: '22222.95',
      strike_price: '22200.00',
      call_net_oi: 342150,
      put_net_oi: 245818
    },
    {
      created_at: '2024-05-15T14:52:26.892037+05:30',
      live_nifty: '22222.95',
      strike_price: '22250.00',
      call_net_oi: 217427,
      put_net_oi: 68071
    },
    {
      created_at: '2024-05-15T14:52:26.892100+05:30',
      live_nifty: '22222.95',
      strike_price: '22300.00',
      call_net_oi: 345388,
      put_net_oi: 78620
    },
    {
      created_at: '2024-05-15T14:57:27.606497+05:30',
      live_nifty: '22217.95',
      strike_price: '22100.00',
      call_net_oi: 109510,
      put_net_oi: 217877
    },
    {
      created_at: '2024-05-15T14:57:27.606539+05:30',
      live_nifty: '22217.95',
      strike_price: '22150.00',
      call_net_oi: 85473,
      put_net_oi: 140867
    },
    {
      created_at: '2024-05-15T14:57:27.606583+05:30',
      live_nifty: '22217.95',
      strike_price: '22200.00',
      call_net_oi: 334860,
      put_net_oi: 250669
    },
    {
      created_at: '2024-05-15T14:57:27.606627+05:30',
      live_nifty: '22217.95',
      strike_price: '22250.00',
      call_net_oi: 218053,
      put_net_oi: 70433
    },
    {
      created_at: '2024-05-15T14:57:27.606669+05:30',
      live_nifty: '22217.95',
      strike_price: '22300.00',
      call_net_oi: 346262,
      put_net_oi: 78477
    },
    {
      created_at: '2024-05-15T15:02:27.514399+05:30',
      live_nifty: '22214.05',
      strike_price: '22100.00',
      call_net_oi: 108195,
      put_net_oi: 202373
    },
    {
      created_at: '2024-05-15T15:02:27.514577+05:30',
      live_nifty: '22214.05',
      strike_price: '22150.00',
      call_net_oi: 82003,
      put_net_oi: 143405
    },
    {
      created_at: '2024-05-15T15:02:27.514633+05:30',
      live_nifty: '22214.05',
      strike_price: '22200.00',
      call_net_oi: 323693,
      put_net_oi: 272335
    },
    {
      created_at: '2024-05-15T15:02:27.514678+05:30',
      live_nifty: '22214.05',
      strike_price: '22250.00',
      call_net_oi: 214345,
      put_net_oi: 74027
    },
    {
      created_at: '2024-05-15T15:02:27.514724+05:30',
      live_nifty: '22214.05',
      strike_price: '22300.00',
      call_net_oi: 336689,
      put_net_oi: 75948
    },
    {
      created_at: '2024-05-15T15:07:27.103270+05:30',
      live_nifty: '22186.80',
      strike_price: '22100.00',
      call_net_oi: 103570,
      put_net_oi: 206494
    },
    {
      created_at: '2024-05-15T15:07:27.103310+05:30',
      live_nifty: '22186.80',
      strike_price: '22150.00',
      call_net_oi: 76336,
      put_net_oi: 149155
    },
    {
      created_at: '2024-05-15T15:07:27.103584+05:30',
      live_nifty: '22186.80',
      strike_price: '22200.00',
      call_net_oi: 291578,
      put_net_oi: 265835
    },
    {
      created_at: '2024-05-15T15:07:27.103631+05:30',
      live_nifty: '22186.80',
      strike_price: '22250.00',
      call_net_oi: 205991,
      put_net_oi: 73825
    },
    {
      created_at: '2024-05-15T15:07:27.103673+05:30',
      live_nifty: '22186.80',
      strike_price: '22300.00',
      call_net_oi: 324988,
      put_net_oi: 75441
    },
    {
      created_at: '2024-05-15T15:12:28.975180+05:30',
      live_nifty: '22208.60',
      strike_price: '22100.00',
      call_net_oi: 104136,
      put_net_oi: 194689
    },
    {
      created_at: '2024-05-15T15:12:28.975220+05:30',
      live_nifty: '22208.60',
      strike_price: '22150.00',
      call_net_oi: 77952,
      put_net_oi: 141848
    },
    {
      created_at: '2024-05-15T15:12:28.975289+05:30',
      live_nifty: '22208.60',
      strike_price: '22200.00',
      call_net_oi: 297042,
      put_net_oi: 248920
    },
    {
      created_at: '2024-05-15T15:12:28.975477+05:30',
      live_nifty: '22208.60',
      strike_price: '22250.00',
      call_net_oi: 207494,
      put_net_oi: 69965
    },
    {
      created_at: '2024-05-15T15:12:28.975550+05:30',
      live_nifty: '22208.60',
      strike_price: '22300.00',
      call_net_oi: 325717,
      put_net_oi: 71370
    },
    {
      created_at: '2024-05-15T15:17:27.700498+05:30',
      live_nifty: '22196.90',
      strike_price: '22100.00',
      call_net_oi: 101196,
      put_net_oi: 197042
    },
    {
      created_at: '2024-05-15T15:17:27.700565+05:30',
      live_nifty: '22196.90',
      strike_price: '22150.00',
      call_net_oi: 74529,
      put_net_oi: 133631
    },
    {
      created_at: '2024-05-15T15:17:27.700637+05:30',
      live_nifty: '22196.90',
      strike_price: '22200.00',
      call_net_oi: 293515,
      put_net_oi: 240267
    },
    {
      created_at: '2024-05-15T15:17:27.700705+05:30',
      live_nifty: '22196.90',
      strike_price: '22250.00',
      call_net_oi: 210077,
      put_net_oi: 64304
    },
    {
      created_at: '2024-05-15T15:17:27.700771+05:30',
      live_nifty: '22196.90',
      strike_price: '22300.00',
      call_net_oi: 330489,
      put_net_oi: 69231
    },
    {
      created_at: '2024-05-15T15:22:27.686285+05:30',
      live_nifty: '22198.90',
      strike_price: '22100.00',
      call_net_oi: 99622,
      put_net_oi: 191767
    },
    {
      created_at: '2024-05-15T15:22:27.686343+05:30',
      live_nifty: '22198.90',
      strike_price: '22150.00',
      call_net_oi: 70240,
      put_net_oi: 130038
    },
    {
      created_at: '2024-05-15T15:22:27.686389+05:30',
      live_nifty: '22198.90',
      strike_price: '22200.00',
      call_net_oi: 288472,
      put_net_oi: 240432
    },
    {
      created_at: '2024-05-15T15:22:27.686433+05:30',
      live_nifty: '22198.90',
      strike_price: '22250.00',
      call_net_oi: 206821,
      put_net_oi: 59740
    },
    {
      created_at: '2024-05-15T15:22:27.686506+05:30',
      live_nifty: '22198.90',
      strike_price: '22300.00',
      call_net_oi: 329056,
      put_net_oi: 67560
    },
    {
      created_at: '2024-05-15T15:27:26.879878+05:30',
      live_nifty: '22203.30',
      strike_price: '22100.00',
      call_net_oi: 95660,
      put_net_oi: 185075
    },
    {
      created_at: '2024-05-15T15:27:26.879924+05:30',
      live_nifty: '22203.30',
      strike_price: '22150.00',
      call_net_oi: 65371,
      put_net_oi: 119072
    },
    {
      created_at: '2024-05-15T15:27:26.879968+05:30',
      live_nifty: '22203.30',
      strike_price: '22200.00',
      call_net_oi: 287169,
      put_net_oi: 235281
    },
    {
      created_at: '2024-05-15T15:27:26.880014+05:30',
      live_nifty: '22203.30',
      strike_price: '22250.00',
      call_net_oi: 194916,
      put_net_oi: 54308
    },
    {
      created_at: '2024-05-15T15:27:26.880059+05:30',
      live_nifty: '22203.30',
      strike_price: '22300.00',
      call_net_oi: 316726,
      put_net_oi: 60887
    },
    {
      created_at: '2024-05-15T15:32:29.628768+05:30',
      live_nifty: '22210.20',
      strike_price: '22100.00',
      call_net_oi: 91263,
      put_net_oi: 185037
    },
    {
      created_at: '2024-05-15T15:32:29.628830+05:30',
      live_nifty: '22210.20',
      strike_price: '22150.00',
      call_net_oi: 59038,
      put_net_oi: 115793
    },
    {
      created_at: '2024-05-15T15:32:29.628892+05:30',
      live_nifty: '22210.20',
      strike_price: '22200.00',
      call_net_oi: 275190,
      put_net_oi: 229042
    },
    {
      created_at: '2024-05-15T15:32:29.628955+05:30',
      live_nifty: '22210.20',
      strike_price: '22250.00',
      call_net_oi: 187556,
      put_net_oi: 48733
    },
    {
      created_at: '2024-05-15T15:32:29.629015+05:30',
      live_nifty: '22210.20',
      strike_price: '22300.00',
      call_net_oi: 304361,
      put_net_oi: 58264
    },
    {
      created_at: '2024-05-15T14:32:31.850655+05:30',
      live_nifty: '22193.25',
      strike_price: '22300.00',
      call_net_oi: 354926,
      put_net_oi: 75145
    }
  ];

  // ---temporary for testing---
  useEffect(() => {
    const uniqueStrikePrices = [...new Set(TEST_ARRAY.map((item) => item?.strike_price))];
    dispatch({ type: 'SET_STRIKES', payload: uniqueStrikePrices });
  }, []);

  // -------storing selected strike---------
  const checkSelectedStrike = (e, identifier) => {
    // console.log("inside checkbox function")
    e.preventDefault();
    const selectedCheckboxValue = e.target.value;
    const isChecked = e.target.checked;
    const filteredData = TEST_ARRAY.filter((itm) => itm?.strike_price === `${selectedCheckboxValue}.00`);

    if (isChecked) {
      setCheckedStrikes(prevState => [...prevState, identifier]);
    } else {
      setCheckedStrikes(prevState => prevState.filter(item => item !== identifier));
    }

    switch (identifier) {
      case 1:
        // setStrikePrice1(filteredData);
        dispatch({ type: 'SET_STRIKE_1', payload: { strikePrice1: filteredData, status: !strikePrice1IsChecked } });
        console.log('1 status', strikePrice1IsChecked);
        break;
      case 2:
        dispatch({ type: 'SET_STRIKE_2', payload: { strikePrice2: filteredData, status: !strikePrice2IsChecked } });
        console.log('2 status', strikePrice2IsChecked);
        break;
      case 3:
        dispatch({ type: 'SET_STRIKE_3', payload: { strikePrice3: filteredData, status: !strikePrice3IsChecked } });
        console.log('3 status', strikePrice3IsChecked);
        break;
      case 4:
        dispatch({ type: 'SET_STRIKE_4', payload: { strikePrice4: filteredData, status: !strikePrice4IsChecked } });
        console.log('4 status', strikePrice4IsChecked);
        break;
      case 5:
        dispatch({ type: 'SET_STRIKE_5', payload: { strikePrice5: filteredData, status: !strikePrice5IsChecked } });
        console.log('5 status', strikePrice5IsChecked);
        break;
      default:
        break;
    }
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      data,
      strikes,
      multiStrikeAPiCall,
      setStrikeDate,
      selectedStrikes,
      checkedStrikes,
      checkSelectedStrike,
      strikePrice1,
      strikePrice2,
      strikePrice3,
      strikePrice4,
      strikePrice5,
      strikePrice1IsChecked,
      strikePrice2IsChecked,
      strikePrice3IsChecked,
      strikePrice4IsChecked,
      strikePrice5IsChecked
    }),
    [
      state,
      strikes,
      multiStrikeAPiCall,
      setStrikeDate,
      data,
      selectedStrikes,
      checkedStrikes,
      checkSelectedStrike,
      strikePrice1,
      strikePrice2,
      strikePrice3,
      strikePrice4,
      strikePrice5,
      strikePrice1IsChecked,
      strikePrice2IsChecked,
      strikePrice3IsChecked,
      strikePrice4IsChecked,
      strikePrice5IsChecked
    ]
  );

  return <MultiStrikeContext.Provider value={contextValue}>{children}</MultiStrikeContext.Provider>;
};

export default MultiStrikeContext;
