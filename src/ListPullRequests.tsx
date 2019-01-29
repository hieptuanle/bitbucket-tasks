import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { ListPullRequestsStore } from './store/list-pull-requests.store'
import { handleError } from './utils/error-handler'
import { format } from 'date-fns'
import { get } from 'lodash'
import { MyPullRequest } from './store/list-pull-requests.store'
import { omit } from 'lodash'
import DatePicker from 'react-datepicker'

import ReactTable, { Instance } from 'react-table'
import 'react-table/react-table.css'
import { toast } from 'react-toastify'

type ListPullRequestProps = {
  listPullRequestsStore?: ListPullRequestsStore
}

export const ListPullRequest = inject('listPullRequestsStore')(
  observer(
    class extends Component<ListPullRequestProps> {
      state = {
        clipboardText: ''
      }
      textarea: HTMLTextAreaElement | null = null
      reactTable: Instance<MyPullRequest> | null = null

      render() {
        return (
          <div className="list-pull-requests">
            <div>
              <DatePicker
                selectsStart
                selected={this.props.listPullRequestsStore!.startDate}
                startDate={this.props.listPullRequestsStore!.startDate}
                endDate={this.props.listPullRequestsStore!.endDate}
                onChange={data => {
                  if (data) {
                    this.props.listPullRequestsStore!.setStartDate(data)
                  }
                }}
              />
              <DatePicker
                selectsEnd
                selected={this.props.listPullRequestsStore!.endDate}
                startDate={this.props.listPullRequestsStore!.startDate}
                endDate={this.props.listPullRequestsStore!.endDate}
                onChange={data => {
                  if (data) {
                    this.props.listPullRequestsStore!.setEndDate(data)
                  }
                }}
              />
            </div>
            <button
              className="button"
              onClick={() => {
                try {
                  this.props.listPullRequestsStore!.getPullRequests()
                } catch (e) {
                  handleError(e)
                }
              }}
            >
              Load Pull Requests
            </button>
            <button
              onClick={() => {
                if (this.reactTable) {
                  const state = this.reactTable.getResolvedState()
                  const text =
                    `index\trepo\tid\tlink\tstate\tuser\ttitle\tcreated\tevaluated\thardnessPoints\ttestPoints\n` +
                    state.sortedData
                      .map((data: any) => {
                        return omit(data, ['_original', '_nestingLevel'])
                      })
                      .map((row: any) => {
                        return [
                          row._index,
                          row.repo,
                          row.id,
                          row.link,
                          row.state,
                          row.user,
                          row.title,
                          row.created,
                          row.evaluated,
                          row.hardnessPoints,
                          row.testPoints
                        ].join('\t')
                      })
                      .join('\n')
                  this.setState(
                    {
                      clipboardText: text
                    },
                    () => {
                      if (this.textarea) {
                        this.textarea.select()
                        document.execCommand('copy')
                        toast.success('Đã copy bảng vào clipboard')
                      }
                    }
                  )
                }
              }}
            >
              Copy TSV
            </button>
            <div>
              <ReactTable
                ref={ref => {
                  this.reactTable = ref as Instance<MyPullRequest>
                }}
                data={this.props.listPullRequestsStore!.pullRequests}
                filterable
                defaultFilterMethod={(filter, row) => String(row[filter.id]).includes(filter.value)}
                columns={[
                  {
                    Header: '',
                    id: 'row',
                    maxWidth: 50,
                    filterable: false,
                    Cell: row => {
                      return <div>{row.index}</div>
                    }
                  },
                  {
                    Header: 'Repo',
                    id: 'repo',
                    maxWidth: 120,
                    accessor: d => get(d, 'source.repository.name', '')
                  },
                  {
                    Header: 'PR ID',
                    id: 'id',
                    maxWidth: 50,
                    accessor: d => d.id
                  },
                  {
                    Header: 'Link',
                    id: 'link',
                    maxWidth: 50,
                    accessor: d => get(d, 'links.html.href', ''),
                    Cell: row => {
                      return (
                        <div>
                          {row.value !== '' && (
                            <a target="_blank" href={row.value}>
                              Link
                            </a>
                          )}
                        </div>
                      )
                    }
                  },
                  {
                    Header: 'State',
                    id: 'state',
                    maxWidth: 80,
                    accessor: d => d.state,
                    Cell: row => {
                      return (
                        <div
                          style={{
                            color: row.value === 'MERGED' ? 'limegreen' : 'lightcoral'
                          }}
                        >
                          {row.value}
                        </div>
                      )
                    }
                  },
                  {
                    Header: 'User',
                    id: 'user',
                    filterable: true,
                    maxWidth: 150,
                    accessor: d => d.author!.nickname
                  },
                  {
                    Header: 'Title',
                    id: 'title',
                    accessor: d => d.title
                  },
                  {
                    Header: 'Created',
                    id: 'created',
                    maxWidth: 100,
                    accessor: d => format(d.created_on || new Date(), 'YYYY-MM-DD')
                  },
                  {
                    Header: 'Eval',
                    id: 'evaluated',
                    maxWidth: 50,
                    accessor: d => (d.evaluated ? 'x' : '')
                  },
                  {
                    Header: 'Độ khó',
                    id: 'hardnessPoints',
                    maxWidth: 60,
                    accessor: d => d.hardnessPoints
                  },
                  {
                    Header: 'Test',
                    id: 'testPoints',
                    maxWidth: 60,
                    accessor: d => d.testPoints
                  }
                ]}
                defaultPageSize={10}
                className="-striped -highlight"
              />
            </div>
            <div>
              <textarea
                readOnly
                ref={textarea => (this.textarea = textarea)}
                value={this.state.clipboardText}
              />
            </div>
            {/* <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>ID</th>
                  <th>User</th>
                  <th>Title</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {this.props.listPullRequestsStore!.pullRequests.map((pullRequest, index) => (
                  <tr key={pullRequest.id}>
                    <td>{index + 1}.</td>
                    <td>{pullRequest.id}</td>
                    <td>{pullRequest.author!.nickname}</td>
                    <td>{pullRequest.title}</td>
                    <td>{pullRequest.updated_on}</td>
                  </tr>
                ))}
              </tbody>
            </table> */}
          </div>
        )
      }
    }
  )
)
