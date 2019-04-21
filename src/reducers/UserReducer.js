import JWT_SECRET from "../secrets/jwt_secret";

const jwt = require("jsonwebtoken");

export default (state = {}, action) => {
  switch (action.type) {
    case "USER_AUTH": {
      console.log(action.payload);
      return {
        ...action.payload,
        ...state,
        isAuth: !(action.payload.index === -1)
      };
    }
    case "SIGNUP_USER": {
      if (action.payload.isAuth) {
        document.cookie = `token=${jwt.sign(action.payload.email, JWT_SECRET)}`;
        return {
          ...state,
          ...action.payload,
          isAuth: true
        };
      }
      return { ...state, login: action.payload };
    }
    case "LOGIN_USER": {
      if (action.payload.isAuth) {
        document.cookie = `token=${jwt.sign(action.payload.email, JWT_SECRET)}`;
        return {
          ...state,
          ...action.payload,
          isAuth: true
        };
      }
      return { ...state, login: action.payload };
    }
    default: {
      return state;
    }
  }
};
