import { decorate, observable, action, runInAction, toJS, computed } from 'mobx'
import { bitbucket, reauthenticate } from '../utils/bitbucket'
import Bitbucket from 'bitbucket'
import bluebird from 'bluebird'
import { get } from 'lodash'
import { format, startOfMonth, endOfMonth } from 'date-fns'

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
    sort: '-created_on',
    pagelen: 50,
    q
  })

  const withCommentsPullRequests = data.values
    ? await bluebird.mapSeries(data.values, async pullRequest => {
        console.log({ pullRequest })
        let comments: Bitbucket.Schema.Comment[] = []
        let hardnessPoints = 0
        let testPoints = 0
        let evaluated = false
        if (pullRequest.comment_count && pullRequest.comment_count > 0 && pullRequest.id) {
          const { data } = await bitbucket.repositories.listPullRequestComments({
            repo_slug: repoSlug,
            username: username,
            pull_request_id: pullRequest.id,
            pagelen: 50
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

export type MyPullRequest = {
  comments: Bitbucket.Schema.Comment[]
  hardnessPoints: number
  testPoints: number
  evaluated: boolean
} & Bitbucket.Schema.Pullrequest

function formatDate(date: Date) {
  return format(date, 'YYYY-MM-DDTHH:mm:ss') + '+07:00'
}

const CONDITION =
  'created_on > 2019-01-01T00:00:00+07:00 AND created_on < 2019-01-29T00:00:00+07:00'
export class ListPullRequestsStore {
  pullRequests: MyPullRequest[] = []
  startDate?: Date = startOfMonth(new Date())
  endDate?: Date = endOfMonth(new Date())
  get condition() {
    if (this.startDate && this.endDate) {
      return `created_on > ${formatDate(this.startDate)} AND created_on < ${formatDate(
        this.endDate
      )}`
    }
    return `created_on > ${formatDate(startOfMonth(new Date()))} AND created_on < ${formatDate(
      endOfMonth(new Date())
    )}`
  }

  async getPullRequests() {
    reauthenticate()
    this.pullRequests = []
    try {
      await getPullRequests({
        q: this.condition,
        pullRequests: this.pullRequests,
        onData: this.appendPullRequests,
        username: '4handy',
        repoSlug: '4handy-work-2'
      })

      await getPullRequests({
        q: this.condition,
        pullRequests: this.pullRequests,
        onData: this.appendPullRequests,
        username: '4handy',
        repoSlug: 'savor-pos-mobile'
      })

      await getPullRequests({
        q: this.condition,
        pullRequests: this.pullRequests,
        onData: this.appendPullRequests,
        username: '4handy',
        repoSlug: 'savor-server'
      })

      await getPullRequests({
        q: this.condition,
        pullRequests: this.pullRequests,
        onData: this.appendPullRequests,
        username: '4handy',
        repoSlug: 'savor-pos'
      })

      await getPullRequests({
        q: this.condition,
        pullRequests: this.pullRequests,
        onData: this.appendPullRequests,
        username: '4handy',
        repoSlug: 'savor-tab'
      })

      await getPullRequests({
        q: this.condition,
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

  setStartDate(date: Date) {
    this.startDate = date
  }
  setEndDate(date: Date) {
    this.endDate = date
  }
}

decorate(ListPullRequestsStore, {
  pullRequests: observable,
  startDate: observable,
  endDate: observable,
  condition: computed,
  setStartDate: action,
  setEndDate: action,
  getPullRequests: action,
  appendPullRequests: action
})
