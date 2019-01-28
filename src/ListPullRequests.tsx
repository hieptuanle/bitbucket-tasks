import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { ListPullRequestsStore } from './store/list-pull-requests.store'
import { handleError } from './utils/error-handler'

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
              Reload
            </button>
            <div>
              <ReactTable
                data={this.props.listPullRequestsStore!.pullRequests}
                columns={[
                  {
                    Header: 'id',
                    id: 'id',
                    accessor: d => d.id
                  },
                  {
                    Header: 'User',
                    id: 'user',
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
                    accessor: d => d.updated_on
                  },
                  {
                    Header: 'Created',
                    id: 'date',
                    accessor: d => d.created_on
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
