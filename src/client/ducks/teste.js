const Types = {
  USER: 'teste/USER'
}

export default function testeReducer (state = 'casa', action) {
  switch (action.type) {
    case Types.USER:
      return action.payload
    default:
      return state
  }
}

const loadUsers = () => {
  return {
    type: Types.USER,
    payload: 'ANDREY'
  }
}

export const loadInit = loadUsers
