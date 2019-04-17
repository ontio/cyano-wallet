export const loginAsInvestor = ({ password, userName }) => {
  if (password.length > 3) {
    return new Promise(resolve => {
      setTimeout(() => resolve({ cookie: "dfssdf342423nfdsfds" }), 500);
    });
  } else {
    return new Promise((resolve, reject) => {
      setTimeout(() => reject("username or password is not correct"), 500);
    });
  }
};
