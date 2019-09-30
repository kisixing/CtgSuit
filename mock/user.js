import mockjs from 'mockjs';
import { delay } from 'roadhog-api-doc';

export default delay(
  {
    'POST /api/user/account': (req, res) => {
      const { password, username } = req.body;

      if (password === '123456' && username === 'admin') {
        res.send(
          mockjs.mock({
            status: 'success',
            currentAuthority: 'admin',
            'Access-Token': 'Lian-med _4dff587dffd5_888rrrrrsdvsd1212154dfgd_',
            data: {
              id: '2019_00000000000101',
              name: 'Admin',
              nickname: 'Admin',
              createTime: '@time("yyyy-MM-dd HH:mm:ss")',
              'avatar|1': [
                'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
                'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
                'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
                'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
                'https://gw.alipayobjects.com/zos/rmsportal/psOgztMplJMGpVEqfcgF.png',
                'https://gw.alipayobjects.com/zos/rmsportal/ZpBqSxLxVEXfcUNoPKrz.png',
              ],
            },
          })
        );
        return;
      }
      if (password === '123456' && username === 'user') {
        res.send(
          mockjs.mock({
            status: 'success',
            currentAuthority: 'user',
            'Access-Token': 'Lian-med _4dff587dffd5_888rrrrrsdvsd1212154dfgd__',
            data: {
              id: '2019_00000000000102',
              name: 'User',
              nickname: 'User',
              createTime: '@time("yyyy-MM-dd HH:mm:ss")',
              'avatar|1': [
                'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
                'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
                'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
                'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
                'https://gw.alipayobjects.com/zos/rmsportal/psOgztMplJMGpVEqfcgF.png',
                'https://gw.alipayobjects.com/zos/rmsportal/ZpBqSxLxVEXfcUNoPKrz.png',
              ],
            },
          })
        );
        return;
      }
      res.send({
        status: 'error',
        desc: '账号或密码错误，请重新输入！',
      });
    },
    'GET /api/account': (req, res) => {
      const { authorization } = req.headers;
      let user = {};
      if (authorization === 'Lian-med _C11cb3aA-C158-8F4c-c86b-53ef73dd5251') {
        user = { id: 'C11cb3aA-C158-8F4c-c86b-53ef73dd5251', name: 'ADMIN', nickname: '管理员' };
      }
      if (authorization === 'Lian-med _C12cb3aA-C158-8F4c-c86b-53ef73dd5252') {
        user = { name: 'user', nickname: 'user' };
      }
      return res.json(
        mockjs.mock({
          desc: 'user infomation',
          currentAuthority: 'admin', // ['admin', 'user]
          permission: {},
          data: {
            id: '@id',
            name: 'GUEST',
            nickname: 'GUEST',
            ...user,
            createTime: '@time("yyyy-MM-dd HH:mm:ss")',
            'avatar|1': [
              'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
              'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
              'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
              'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
              'https://gw.alipayobjects.com/zos/rmsportal/psOgztMplJMGpVEqfcgF.png',
              'https://gw.alipayobjects.com/zos/rmsportal/ZpBqSxLxVEXfcUNoPKrz.png',
            ],
          },
        }),
      );
    },
    'POST /api/authenticate': (req, res) => {
      // 密码对就行，账户名无所谓
      const { password, username } = req.body;
      if (password === '123456') {
        res.send(
          mockjs.mock({
            username,
            status: 'success',
            currentAuthority: 'admin', // ['admin', 'guest']
            'Access-Token':
              username === 'admin'
                ? 'Lian-med _C11cb3aA-C158-8F4c-c86b-53ef73dd5251'
                : 'Lian-med _C12cb3aA-C158-8F4c-c86b-53ef73dd5252',
          }),
        );
      } else {
        res.send({
          status: 'error',
          desc: '账号或密码错误，请重新输入！',
        });
      }
    }
  },
  1500,
);