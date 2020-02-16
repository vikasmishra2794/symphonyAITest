import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      fileData: [],
      delimiter: ",",
      lines: "2",
      isFileUploaded: false
    }
  }

  handleFileChange = (event) => {
    this.setState({
      selectedFile: event.target.files[0]
    });
  };

  handleUpload = (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append('file', this.state.selectedFile, this.state.selectedFile.name);
    axios.post('http://localhost:8080/upload', data).then((res) => {
      const { data: { fileData = [] } } = res;
      this.setState({ fileData, isFileUploaded: true });
    });
  };
  
  handleInputChange = (e) => {
    const target = e.target;
    const value = target.value;
    const name = target.name;
    this.setState({
        [name]: value
    });
  };
  getFormattedTableData = () => {
    const { lines, fileData } = this.state;
    return fileData.slice(0, lines);
  }
  render() {
    const { delimiter=",", lines, isFileUploaded } = this.state;
    const tableData = this.getFormattedTableData();
  return (
    <div className="App">
      {!isFileUploaded && <form className="App" onSubmit={this.handleUpload}>
        <input type="file" name="file" onChange={this.handleFileChange} />
        <button onClick={this.handleUpload}>Upload</button>
      </form>}
      {isFileUploaded && <div className="table-container">
        <div className="filter">  
        <label className="filter-child">
          Delimiter:
          <input type="text" name="delimiter" onChange={this.handleInputChange} value={delimiter}/>
        </label>
        <label>
          Lines:
          <input type="text" name="lines" onChange={this.handleInputChange} value={lines}/>
          </label>
          </div>
        <table className="table">
          <tbody>
        {tableData.map((line, index) => {
          const colums = line.split(delimiter);
          return <tr key={index}>
            <td>{colums[0]}</td>
            <td>{colums[1]}</td>
            <td>{colums[2]}</td>
            <td>{colums[3]}</td>
          </tr>
        })
        }
        </tbody>    
        </table>
      </div>
      }
    </div>
  );
}
}

export default App;
