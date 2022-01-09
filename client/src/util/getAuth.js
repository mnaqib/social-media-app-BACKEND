import jwtDecode from 'jwt-decode'

function getAuth(
  initialState = {
    user: null,
  }
) {
  if (localStorage.getItem('jwtToken')) {
    const decodedToken = jwtDecode(localStorage.getItem('jwtToken'))

    if (decodedToken.exp * 1000 < Date.now()) {
      localStorage.removeItem('jwtToken')
    } else {
      initialState.user = {
        ...decodedToken,
        token: localStorage.getItem('jwtToken'),
      }
    }
  }
  return initialState
}

export default getAuth
