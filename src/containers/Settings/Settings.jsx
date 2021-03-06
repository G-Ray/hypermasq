import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import { Button, TextField } from 'qwant-research-components'

import { updateUser } from '../../actions'
import { Avatar } from '../../components'

import './Settings.css'

class Settings extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      image: '',
      lastname: '',
      firstname: '',
      username: ''
    }

    this.hasChanged = false
    this.validate = this.validate.bind(this)
    this.isValid = this.isValid.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  componentDidMount () {
    const { user } = this.props
    if (!user) return

    this.setState({
      image: user.image,
      lastname: user.lastname,
      firstname: user.firstname,
      username: user.username
    })
  }

  isValid (fieldName) {
    if (fieldName === 'image') return true
    return this.state[fieldName].length > 0
  }

  onChange (field, event) {
    const value = event.target.value.trim()
    this.hasChanged = true
    this.setState({
      [field]: value
    })
  }

  onImageChange (event) {
    const reader = new window.FileReader()
    const file = event.target.files[0]
    if (!file) {
      return
    }

    reader.addEventListener('load', () => {
      this.hasChanged = true
      this.setState({ image: reader.result })
    })
    reader.readAsDataURL(file)
  }

  validate () {
    if (!this.hasChanged) {
      return
    }

    // Every fields should be valid
    const isValid = Object.keys(this.state).every(key => this.isValid(key))
    // If invalid, return
    if (!isValid) {
      // forceUpdate to show errors
      return this.forceUpdate()
    }

    this.props.updateUser(this.props.user.id, this.state)
    this.hasChanged = false
  }

  handleKeyUp (e) {
    if (e.key === 'Enter') {
      this.validate()
    }
  }

  render () {
    if (!this.props.user) return <Redirect to='/' />

    return (
      <div className='Settings'>
        <div>
          <div className='title-container'>
            <p className='title'>Your profile</p>
            <p className='subtitle'>Edit your personal informations</p>
          </div>

          <div className='profile'>
            <Avatar upload image={this.state.image} onChange={(e) => this.onImageChange(e)} />
            <div className='inputs'>
              <TextField
                label={'Last Name'}
                error={!this.isValid('lastname')}
                onKeyUp={this.handleKeyUp}
                defaultValue={this.state.lastname} onChange={(e) => this.onChange('lastname', e)}
              />
              <TextField
                label={'First Name'}
                error={!this.isValid('firstname')}
                onKeyUp={this.handleKeyUp}
                defaultValue={this.state.firstname} onChange={(e) => this.onChange('firstname', e)}
              />
              <TextField
                label={'Username (displayed)'}
                error={!this.isValid('username')}
                onKeyUp={this.handleKeyUp}
                defaultValue={this.state.username} onChange={(e) => this.onChange('username', e)}
              />
            </div>
          </div>
        </div>

        <div className='sidebar'>
          <Button width={200} secondary={!this.hasChanged} label='SAUVEGARDER' onClick={this.validate} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  user: state.masq.currentUser
})

const mapDispatchToProps = dispatch => ({
  updateUser: (id, user) => dispatch(updateUser(id, user))
})

Settings.propTypes = {
  user: PropTypes.object.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
