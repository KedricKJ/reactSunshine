import decode from "jwt-decode";

class Auth {
  login = (email, password) => {};

  static authenticateUser(token) {
    localStorage.setItem("token", token);
  }

  static isUserAuthenticated() {
    return localStorage.getItem("token") !== null;
  }

  static deauthenticateUser() {
    localStorage.removeItem("token");
  }

  static setToken(token) {
    // Saves user token to localStorage
    localStorage.setItem("token", token);
  }

  static getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("token");
  }

  static getProfile() {
    // Using jwt-decode npm package to decode the token
    return decode(this.getToken());
    /* return {
      name: "Admin",
      role: "SYS_ADMIN"
    }; */
  }

  static isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        // Checking if token is expired. N
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
    //return false;
  }

  static loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken(); // GEtting token from localstorage
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  static hasRole = (user, roles) => {
    return roles.some(role => user.roles.includes(role));
  };
}

export default Auth;
