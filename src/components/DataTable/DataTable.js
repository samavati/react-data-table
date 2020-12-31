import React from 'react';
import './DataTable.css';

class DataTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            headers: props.headers,
            data: props.data,
            sortBy: null,
            descending: null,
            page: 0
        }
        this.noData = props.noData || 'داده ای جهت نمایش وجود ندارد!';
    }

    componentWillReceiveProps(nextProps) {
        const queryParams = new URLSearchParams(window.location.search);
        const sortColumn = queryParams.get('sort');
        let descending = queryParams.get('descending');
        if (descending !== null) {
            descending = descending === 'true';
        }
        this.setState({
            data: sortColumn !== null ? this.onSort(nextProps.data, sortColumn, descending) : nextProps.data,
            sortBy: sortColumn,
            descending,
            page: 0
        });
    }

    renderTableHeader = () => {
        const { headers } = this.state;
        const headerView = headers.map((header, index) => {
            let title = header.title;
            let cleanTitle = header.accessor;

            if (this.state.sortBy === header.accessor) {
                title += this.state.descending ? '\u2193' : '\u2191';
            }
            return (
                <th key={cleanTitle} data-col={cleanTitle}>
                    <span data-col={cleanTitle} className="header-cell">
                        {title}
                    </span>
                </th>
            );
        })

        return headerView;
    }

    renderTableContent = () => {
        const { headers, data, page } = this.state;
        const paginatedData = data.slice(page * 5, page * 5 + 5);
        const contentView = paginatedData.map((row, dtIndex) => {
            let tds = headers.map((header, index) => <td key={index}>{row[header.accessor]}</td>)

            return (<tr key={dtIndex}>{tds}</tr>);
        })
        return contentView;
    }

    renderNoData = () => {
        return (
            <tr>
                <td colSpan={this.state.headers.length}>
                    {this.noData}
                </td>
            </tr>
        );
    }

    onSort = (oldData, colTitle, desc) => {
        if (colTitle) {
            let data = [...oldData];

            data.sort((a, b) => {
                let sortVal = 0;
                if (a[colTitle] < b[colTitle]) {
                    sortVal = -1;
                } else if (a[colTitle] > b[colTitle]) {
                    sortVal = 1;
                } else {
                    sortVal = 0;
                }
                if (desc) {
                    sortVal = sortVal * -1;
                }
                return sortVal;
            });

            // Manipulate URL SERACH PARAMS
            let queryParams = new URLSearchParams(window.location.search);
            for (let key of queryParams.keys()) {
                queryParams.set(key, queryParams.get(key))
            }
            queryParams.set("sort", colTitle);
            queryParams.set("descending", desc);
            window.history.replaceState({}, '', `${window.location.pathname}?${queryParams}`);
            // Manipulate URL SERACH PARAMS

            return data;
        }
    }

    onPaging = (direction) => {
        const page = this.state.page + direction;
        if (page > -1 && page < Math.ceil(this.state.data.length / this.props.pageLength)) {
            this.setState({ page })
        }
    }

    renderTable = () => {
        const { title } = this.props;
        const headerView = this.renderTableHeader();
        const contentView = this.state.data.length > 0 ? this.renderTableContent() : this.renderNoData();

        return (
            <>
                <table className="data-inner-table">
                    <caption className="data-table-caption">
                        {title}
                    </caption>
                    <thead onClick={(e) => {
                        if (e.target.dataset.col === this.state.sortBy) {
                            this.setState({
                                data: this.onSort(this.state.data, e.target.dataset.col, !this.state.descending),
                                sortBy: e.target.dataset.col,
                                descending: !this.state.descending
                            })
                        } else {
                            this.setState({
                                data: this.onSort(this.state.data, e.target.dataset.col, false),
                                sortBy: e.target.dataset.col,
                                descending: !this.state.descending
                            })
                        }
                    }}>
                        <tr>
                            {headerView}
                        </tr>
                    </thead>
                    <tbody>
                        {contentView}
                    </tbody>
                </table>
                <div className="pagination">
                    <div>
                        <button type="button" onClick={() => { this.onPaging(1) }}>بعدی</button>
                        {this.state.page + 1}
                        <button type="button" onClick={() => { this.onPaging(-1) }}>قبلی</button>
                    </div>
                    <div>
                        نمایش {this.state.page * 5 + 1} تا {this.state.data.length > this.props.pageLength ? (this.state.page * 5 + +this.props.pageLength) : this.state.data.length} از {this.state.data.length}
                    </div>
                </div>
            </>
        );
    }

    render() {
        return (
            <div className="data-table">
                {this.renderTable()}
            </div>
        );
    }
}

export default DataTable;