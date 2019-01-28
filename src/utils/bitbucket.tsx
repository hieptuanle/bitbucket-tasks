import Bitbucket from 'bitbucket'

export const bitbucket = new Bitbucket()

bitbucket.authenticate({
  type: 'basic',
  username: process.env.REACT_APP_BITBUCKET_USERNAME || '',
  password: process.env.REACT_APP_BITBUCKET_PASSWORD || ''
})
