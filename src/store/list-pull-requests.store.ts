import { decorate, observable, action, runInAction, toJS } from 'mobx'
import { bitbucket } from '../utils/bitbucket'
import Bitbucket from 'bitbucket'
import bluebird from 'bluebird'
import { get } from 'lodash'

async function getPullRequests({
  page = 1,
  q,
  username,
  repoSlug,
  pullRequests,
  onData
}: {
  page?: number
  username: string
  repoSlug: string
  q: string
  pullRequests: MyPullRequest[]
  onData?: (pullRequests: MyPullRequest[]) => void
}) {
  const { data, headers } = await bitbucket.repositories.listPullRequests({
    page: `${page}`,
    repo_slug: repoSlug,
    username: username,
    state: 'MERGED',
    sort: '-updated_on',
    pagelen: 10,
    q
  })

  const withCommentsPullRequests = data.values
    ? await bluebird.mapSeries(data.values, async pullRequest => {
        let comments: Bitbucket.Schema.Comment[] = []
        let hardnessPoints = 0
        let testPoints = 0
        let evaluated = false
        if (pullRequest.comment_count && pullRequest.comment_count > 0 && pullRequest.id) {
          const { data } = await bitbucket.repositories.listPullRequestComments({
            repo_slug: repoSlug,
            username: username,
            pull_request_id: pullRequest.id
          })
          if (data.values && data.values.length) {
            comments = data.values
            const matchComment = comments.find(comment => {
              return comment.content && comment.content.raw
                ? Boolean(
                    comment.content.raw.match(/Độ khó: \d+/i) &&
                      comment.content.raw.match(/Test: \d+/i)
                  )
                : false
            })
            if (matchComment) {
              const hardnessText =
                get(matchComment, 'content.raw', '').match(/Độ khó: (\d+)/)[1] || '0'
              const testText = get(matchComment, 'content.raw', '').match(/Test: (\d+)/)[1] || '0'
              hardnessPoints = parseInt(hardnessText)
              testPoints = parseInt(testText)
              evaluated = true
            }
          }
        }
        return {
          hardnessPoints,
          testPoints,
          comments,
          evaluated,
          ...pullRequest
        }
      })
    : []

  if (onData) {
    onData(withCommentsPullRequests)
  }

  console.log(data)

  if (data.next) {
    await getPullRequests({ page: page + 1, q, pullRequests, onData, username, repoSlug })
  }
}

type MyPullRequest = {
  comments: Bitbucket.Schema.Comment[]
  hardnessPoints: number
  testPoints: number
  evaluated: boolean
} & Bitbucket.Schema.Pullrequest

export class ListPullRequestsStore {
  pullRequests: MyPullRequest[] = []
  async getPullRequests() {
    this.pullRequests = []
    try {
      await getPullRequests({
        q: 'created_on > 2019-01-01T00:00:00+07:00',
        pullRequests: this.pullRequests,
        onData: this.appendPullRequests,
        username: '4handy',
        repoSlug: '4handy-work-2'
      })

      await getPullRequests({
        q: 'created_on > 2019-01-01T00:00:00+07:00',
        pullRequests: this.pullRequests,
        onData: this.appendPullRequests,
        username: '4handy',
        repoSlug: 'savor-pos-mobile'
      })

      await getPullRequests({
        q: 'created_on > 2019-01-01T00:00:00+07:00',
        pullRequests: this.pullRequests,
        onData: this.appendPullRequests,
        username: '4handy',
        repoSlug: 'savor-server'
      })

      await getPullRequests({
        q: 'created_on > 2019-01-01T00:00:00+07:00',
        pullRequests: this.pullRequests,
        onData: this.appendPullRequests,
        username: '4handy',
        repoSlug: 'savor-pos'
      })

      await getPullRequests({
        q: 'created_on > 2019-01-01T00:00:00+07:00',
        pullRequests: this.pullRequests,
        onData: this.appendPullRequests,
        username: '4handy',
        repoSlug: 'savor-tab'
      })

      await getPullRequests({
        q: 'created_on > 2019-01-01T00:00:00+07:00',
        pullRequests: this.pullRequests,
        onData: this.appendPullRequests,
        username: '4handy',
        repoSlug: 'super-savor-web'
      })
    } catch (e) {
      throw e
    }
  }

  appendPullRequests = (pullRequests: MyPullRequest[]) => {
    this.pullRequests = this.pullRequests.concat(pullRequests)
  }
}

decorate(ListPullRequestsStore, {
  pullRequests: observable,
  getPullRequests: action,
  appendPullRequests: action
})
