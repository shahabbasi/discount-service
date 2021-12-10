module.exports = (accessType) => {
  const authFunctions = {
    user: async (req, res, next) => {
      const access = req.getHeader('x-user-access');
      if (access === 'user-zz-token') {
        req.userIdentity = 'zz';
      } else {
        if (!access) {
          return res.status(401).send('Unauthorized');
        } else {
          return res.status(403).send('Unauthenticated');
        }
      }
    },
    merchant: async (req, res, next) => {
      const access = req.getHeader('x-merchant-access');
      if (access === 'merchant-xx-token') {
        req.userIdentity = 'xx';
      } else {
        if (!access) {
          return res.status(401).send('Unauthorized');
        } else {
          return res.status(403).send('Unauthenticated');
        }
      }
    }
  }
  return authFunctions[accessType];
}
