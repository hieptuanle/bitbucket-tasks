import Bitbucket from 'bitbucket'
import store from 'store'

export const bitbucket = new Bitbucket()

export function reauthenticate() {
  if (store.get('username') && store.get('password')) {
    bitbucket.authenticate({
      type: 'basic',
      username: store.get('username') || '',
      password: store.get('password') || ''
    })
  }
}

reauthenticate()
