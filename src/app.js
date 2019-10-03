export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error('app--', err.message);
    },
  },
};
