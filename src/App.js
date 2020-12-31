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

  model = {
    headers: [
      { title: 'نام تغییر دهنده', accessor: 'name', index: 0 },
      { title: 'تاریخ', accessor: 'date', index: 1 },
      { title: 'نام آگهی', accessor: 'title', index: 2 },
      { title: 'فیلد', accessor: 'field', index: 3 },
      { title: 'مقدار قدیمی', accessor: 'old_value', index: 4 },
      { title: 'مقدار جدید', accessor: 'new_value', index: 5 },
    ],
    data: mock
  }

  state = { table: this.model };

  render() {
    return (
      <div className="App">
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
