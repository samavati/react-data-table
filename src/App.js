import React from 'react';
import './App.css';
import { BinarySearchTree } from './BinarySerachTree';
import DataTable from './components/DataTable/DataTable';
import mock from './full-data.json';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.tree = new BinarySearchTree();
    mock.forEach(data => {
      this.tree.insert(data, data.date);
    });
  }

  tableHeaders = [
    { title: 'نام تغییر دهنده', accessor: 'name', index: 0 },
    { title: 'تاریخ', accessor: 'date', index: 1 },
    { title: 'نام آگهی', accessor: 'title', index: 2 },
    { title: 'فیلد', accessor: 'field', index: 3 },
    { title: 'مقدار قدیمی', accessor: 'old_value', index: 4 },
    { title: 'مقدار جدید', accessor: 'new_value', index: 5 },
  ];
  tableData = mock;

  state = {
    table: {
      headers: this.tableHeaders,
      data: this.tableData
    },
    name: '',
    date: '',
    title: '',
    field: ''
  };

  componentDidMount() {
    this.search();
  }

  onSearchText = (text, column) => {
    // Manipulate URL SERACH PARAMS
    let queryParams = new URLSearchParams(window.location.search);
    for (let key of queryParams.keys()) {
      queryParams.set(key, queryParams.get(key))
    }
    queryParams.set(column, text);
    window.history.replaceState({}, '', `${window.location.pathname}?${queryParams}`);
    // Manipulate URL SERACH PARAMS

    this.search();
  }

  search = () => {
    let queryParams = new URLSearchParams(window.location.search);
    let newData = [...mock];
    // Search in DATES trought BST
    const query = queryParams.get('date');
    if (query) {
      const result = this.tree.find(query);
      if (result === -1) {
        newData = [];
      } else {
        newData = [...result];
      }
      this.setState({ date: query });
    }
    // Search in DATES trought BST

    // Serach All Parameters Except date --------------------------
    for (let key of queryParams.keys()) {
      const query = queryParams.get(key);
      if ((key === 'name') || (key === 'title') || (key === 'field')) {
        newData = [...newData.filter((el) => el[key].toLowerCase().indexOf(query.toLowerCase()) !== -1)];
        this.setState({ [key]: query });
      }
    }
    // Serach All Parameters Except date --------------------------

    this.setState({ table: { header: this.tableHeaders, data: newData } });
  }

  render() {
    return (
      <div className="App">
        <div className="search-bar">
          <div>
            <label htmlFor="name">نام تغییر دهنده</label>
            <input className="input" id="name" type="text" value={this.state.name} onChange={(e) => { this.onSearchText(e.target.value, 'name') }} />
          </div>
          <div>
            <label htmlFor="date">تاریخ</label>
            <input className="input" id="date" type="text" value={this.state.date} onChange={(e) => { this.onSearchText(e.target.value, 'date') }} />
          </div>
          <div>
            <label htmlFor="title">نام آگهی</label>
            <input className="input" id="title" type="text" value={this.state.title} onChange={(e) => { this.onSearchText(e.target.value, 'title') }} />
          </div>
          <div>
            <label htmlFor="field">فیلد</label>
            <input className="input" id="field" type="text" value={this.state.field} onChange={(e) => { this.onSearchText(e.target.value, 'field') }} />
          </div>
        </div>
        <DataTable
          className="data-table"
          title="لیست تغییرات انجام شده در اپلیکیشن دیوار"
          pagination={{
            enabled: true,
            pageLenght: 5,
          }}
          width="100%"
          headers={this.state.table.headers}
          data={this.state.table.data}
          noData="داده ای جهت نمایش وجود ندارد!"
        />
      </div>
    );
  }
}

export default App;
