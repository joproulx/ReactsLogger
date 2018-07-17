import * as React from 'react';
import './App.css';
import * as ReactDataGrid from  'react-data-grid';
import * as elasticsearch from 'elasticsearch';
import * as addons from 'react-data-grid-addons';





class App extends React.Component {
   
   _columns: any;
   _rows: any;
   constructor(props, context) {
       super(props, context);
        //this.createRows();

		this._columns = [
		  { key: 'id', name: 'ID', width: 75, resizable: true },
		  { key: 'timestamp', name: 'Timestamp', width: 300, resizable: true },
		  { key: 'message', name: 'Message', resizable: true, filterable: true}];
			
			this.state = { rows: [], filters: {} };	

		let rows: any[];
		rows = [];
		this._rows = rows;
		 
		var client = new elasticsearch.Client({
		  host: 'localhost:9200',
		  log: 'trace'
		});
			var that = this;  	
		client.search({
		  index: 'logstash-2018.04.13',
		  sort: "id:asc",
		  q: '*.*',
		  size: 1000
		}).then(function (body) {
		 console.trace('This is the body:' + body.hits.hits.length);
		
		
		  let rows: any[];
				rows = [];
		  body.hits.hits.forEach((i, index) =>
		  {
		      console.trace('Test' + i._source.id);
			  rows.push({
					id: i._source.id,
					message: i._source.message,
					timestamp: i._source.timestamp.substring(11, 23)
				  });
		  
		  });
		  
		  that._rows = rows;
		that.setState( {rows:that._rows} );  
		  
		 
		  
		  /*let rows: any[];
				rows = [];
				for (let i = 1; i < 1000; i++) {
				  rows.push({
					id: i,
					title: 'Title ' + i,
					count: i * 1000
				  });
				}

				this._rows = rows;*/
		  
		  
		  
		}, function (error) {
		  console.trace(error.message);
		});  
		  
		  
	}

    createRows = () => {
		let rows: any[];
		rows = [];
		for (let i = 1; i < 1000; i++) {
		  rows.push({
			id: i,
			title: 'Title ' + i,
			count: i * 1000
		  });
		}

		this._rows = rows;
	  };
	rowGetter = (i) => {
    return addons.Data.Selectors.getRows(this.state)[i];
	};
	rowsCount = () => {
    return addons.Data.Selectors.getRows(this.state).length;
  };
	handleFilterChange = (filter) => {
    let newFilters = Object.assign({}, this.state['filters']);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }
    this.setState({ filters: newFilters });
  };

  getValidFilterValues = (columnId) => {
    let values = this.state['rows'].map(r => r[columnId]);
    return values.filter((item, i, a) => { return i === a.indexOf(item); });
  };

  handleOnClearFilters = () => {
    this.setState({ filters: {} });
  };

  render() {
    
    return (
        <div >
            <ReactDataGrid 		toolbar={<addons.Toolbar enableFilter={true}/>}	   columns={this._columns}			   rowGetter={this.rowGetter}			   rowsCount={this.rowsCount()}		 minHeight={this.rowsCount()*25 + 50}	minColumnWidth={120}    	  onAddFilter={this.handleFilterChange}       getValidFilterValues={this.getValidFilterValues}        onClearFilters={this.handleOnClearFilters}   />
			</div>
      
    );
  }
}

export default App;
