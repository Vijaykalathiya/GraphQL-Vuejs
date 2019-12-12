import { setContext } from 'apollo-link-context'

const authLink = setContext((_, { headers }) => {
    // get the authentication token from localstorage if it exists
    let userDetails = JSON.parse(localStorage.getItem('useDetails'));
    let token = null
    if(userDetails) {
      token = userDetails.token;
    }
    // return the headers to the context so httpLink can read them
    if (token) {
      return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : null
        }
      }
    }
    return {
      headers: {
          ...headers
      }
  }


});

export default authLink;
