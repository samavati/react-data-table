import React from 'react';
import './DataTable.css';

class DataTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            headers: props.headers,
            data: props.data,
            sortBy: null,
            descending: false,
            page: 0
        }
        this.noData = props.noData || 'داده ای جهت نمایش وجود ندارد!';
        this.width = props.width || '100%';
    }

    componentDidMount() {
        let queryParams = new URLSearchParams(window.location.search);
        this.onSort(queryParams.get('sort'), queryParams.get('descending') === 'true');
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ data: nextProps.data, page: 0 });
    }

    renderTableHeader = () => {
        const { headers } = this.state;
        const headerView = headers.map((header, index) => {
            let title = header.title;
            let cleanTitle = header.accessor;
            // let width = header.width;

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

    onSort = (colTitle, desc) => {
        if (colTitle) {
            let data = [...this.props.data];
            let descending = desc;
            if (colTitle === this.state.sortBy) {
                descending = !this.state.descending;
            }

            data.sort((a, b) => {
                let sortVal = 0;
                if (a[colTitle] < b[colTitle]) {
                    sortVal = -1;
                } else if (a[colTitle] > b[colTitle]) {
                    sortVal = 1;
                } else {
                    sortVal = 0;
                }
                if (descending) {
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
            queryParams.set("descending", descending);
            window.history.replaceState({}, '', `${window.location.pathname}?${queryParams}`);
            // Manipulate URL SERACH PARAMS

            this.setState({
                data,
                sortBy: colTitle,
                descending
            })
        }
    }

    onPaging = (direction) => {
        const page = this.state.page + direction;
        if (page > -1 && page < Math.ceil(this.state.data.length / 5) + 1) {
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
                    <thead onClick={(e) => { this.onSort(e.target.dataset.col, false) }}>
                        <tr>
                            {headerView}
                        </tr>
                    </thead>
                    <tbody>
                        {contentView}
                    </tbody>
                </table>
                <div>
                    <button type="button" onClick={() => { this.onPaging(1) }}>بعدی</button>
                    {this.state.page + 1}
                    <button type="button" onClick={() => { this.onPaging(-1) }}>قبلی</button>
                </div>
            </>
        );
    }

    render() {
        return (
            <div className={this.props.className}>
                {this.renderTable()}
            </div>
        );
    }
}

export default DataTable;