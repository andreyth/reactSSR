import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { loadInit } from 'client/ducks/teste'

class Teste extends PureComponent {
  componentDidMount () {
    this.props.dispatch(loadInit())
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
