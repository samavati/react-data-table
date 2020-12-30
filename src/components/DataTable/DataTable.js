import React from 'react';
import './DataTable.css';

class DataTable extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            headers: props.headers,
            data: props.data,
            sortBy: null,
            descending: false
        }
        this.noData = props.noData || 'داده ای جهت نمایش وجود ندارد!';
        this.width = props.width || '100%';
    }

    renderTableHeader = () => {
        const { headers } = this.state;
        const headerView = headers.map((header, index) => {
            let title = header.title;
            let cleanTitle = header.accessor;
            // let width = header.width;

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
        const { headers, data } = this.state;
        const contentView = data.map((row, dtIndex) => {
            let tds = headers.map((header, index) => <td key={index}>{row[header.accessor]}</td>)

            return (<tr key={dtIndex}>{tds}</tr>);
        })
        return contentView;
    }

    renderNoData = () => {
        return (
            <tr>
                <td colSpan={this.props.headers.length}>
                    {this.noData}
                </td>
            </tr>
        );
    }

    renderTable = () => {
        const { title } = this.props;
        const headerView = this.renderTableHeader();
        const contentView = this.state.data.length > 0 ? this.renderTableContent() : this.renderNoData();

        return (
            <table className="data-inner-table">
                <caption className="data-table-caption">
                    {title}
                </caption>
                <thead onClick={(e) => { this.onSort(e) }}>
                    <tr>
                        {headerView}
                    </tr>
                </thead>
                <tbody>
                    {contentView}
                </tbody>
            </table>
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