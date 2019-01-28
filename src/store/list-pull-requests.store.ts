import { decorate, observable, action, runInAction } from 'mobx'
import { bitbucket } from '../utils/bitbucket'
import Bitbucket from 'bitbucket'
import bluebird from 'bluebird'

type MyPullRequest = Bitbucket.Schema.Pullrequest

export class ListPullRequestsStore {
  pullRequests: MyPullRequest[] = []
  async getPullRequests() {
    this.pullRequests = []
    try {
      await bluebird.mapSeries(
        [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        async index => {
          console.log(index)
          const { data, headers } = await bitbucket.repositories.listPullRequests({
            repo_slug: '4handy-work-2',
            username: '4handy',
            state: 'MERGED',
            sort: '-updated_on',
            pagelen: 10,
            page: `${index}`
          })
          console.log({ data })
          if (data.values && data.values.length) {
            runInAction(() => {
              this.pullRequests = this.pullRequests.concat(data.values as MyPullRequest[])
            })
          }
        }
      )
    } catch (e) {
      throw e
    }
  }
}

decorate(ListPullRequestsStore, {
  pullRequests: observable,
  getPullRequests: action
})
