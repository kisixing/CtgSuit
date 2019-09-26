export default {
  namespace: 'archives',
  state: {
    dataSource: [
      {
        'NO': '001',
        checkNumber: 2,
        name: '李希',
        gestweek: '10+2',
        patientNumber: 'pppppppppppppppp',
        AD: 'dhhdhad7878778',
        bedNumber: '201908071723',
        date: '2019-08-09:10:24',
        'GP': '1/3',
        comment: '十多个发生地方开公司风科技股份SDK分公司的股份',
      },
      {
        'NO': '002',
        checkNumber: 2,
        name: '李希',
        gestweek: '10+2',
        patientNumber: 'pppppppppppppppp',
        AD: 'dhhdhad7878778',
        bedNumber: '201908071723',
        date: '2019-08-09:10:24',
        'GP': '1/3',
        comment: '十多个发生地方开公司风科技股份SDK分公司的股份',
      },
      {
        'NO': '003',
        name: '李希',
      },
      {
        'NO': '004',
        name: '李希',
      },
      {
        'NO': '005',
        name: '李希',
      },
      {
        'NO': '006',
        name: '李希',
      },
      {
        'NO': '007',
        name: '李希',
      },
      {
        'NO': '008',
        name: '李希',
      },
    ],
    current: {},
  },
  effects: {},
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
