import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { ListPullRequestsStore } from './store/list-pull-requests.store'
import { handleError } from './utils/error-handler'
import { format } from 'date-fns'
import { get } from 'lodash'

import ReactTable from 'react-table'
import 'react-table/react-table.css'

type ListPullRequestProps = {
  listPullRequestsStore?: ListPullRequestsStore
}

export const ListPullRequest = inject('listPullRequestsStore')(
  observer(
    class extends Component<ListPullRequestProps> {
      render() {
        return (
          <div className="list-pull-requests">
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
            <div>
              <ReactTable
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
                    Header: 'Updated',
                    id: 'updated',
                    maxWidth: 100,
                    accessor: d => format(d.updated_on || new Date(), 'YYYY-MM-DD')
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
