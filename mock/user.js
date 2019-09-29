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
      if (authorization === 'Lian-med _4dff587dffd5_888rrrrrsdvsd1212154dfgd_') {
        user = { id: '20080808007', name: 'admin', nickname: 'admin' };
      }
      if (authorization === 'Lian-med _4dff587dffd5_888rrrrrsdvsd1212154dfgd__') {
        user = { id: '20080808008', name: 'user', nickname: 'user' };
      }
      return res.json(
        mockjs.mock({
          desc: '账户信息',
          data: {
            id: '@id',
            name: '@name',
            nickname: '@cname',
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
  },
  1500,
);