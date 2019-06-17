import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { loadUsers } from 'client/ducks/teste'

export const initData = loadUsers

class Teste extends PureComponent {
  componentDidMount () {
    this.props.dispatch(initData())
  }

  render () {
    const { props } = this
    return (
      <h1>Hello - {props.teste}</h1>
    )
  }
}

const mapStateToProps = state => {
  return ({
    teste: state.teste
  })
}

export default connect(mapStateToProps)(Teste)
