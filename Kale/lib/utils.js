module.exports = {
/*
  Convert an array of results in an hash with key = the name of the file and values the rows of data belonging to head file.
*/
  bdfQueryToTables: function(bdfResultJson){
    var dataTables = {};
 
    // counts the number of results returned by biodatafinder
    var resultsLength = bdfResultJson['objs'].length;
    
    if( resultsLength != 0){
      //iterate over the objs array which contains {:infos, :data}
      var filepath = '';
      var record = undefined;
      var header_name = undefined;
      
      for (i=0 ; i<resultsLength ; i++){
        record = bdfResultJson.objs[i];
        filepath = record.infos.filepath;
        // in case the filepath (key for a dataset) is not present, creates a new array of elements for that key
        if(dataTables[filepath] == undefined){
          var h = {};
          
          h['data'] = [];
          h['header'] = record.infos.header;
          h['hAxis'] = 3;     //it sets the default value of hAxis
          h['stringColumns'] = "FPKM";    //it sets the default value of stringColumns
          dataTables[filepath] = h;
        }

        var row = [];

        row = record['infos']['header'].map(function(header){
          return record.data[header]
        });

        dataTables[filepath]['data'].push(row);
      }
    } //if bdfResultJson != 0

    createHeaderStringAndHeaderNumeric(dataTables);

    return dataTables;
  }

}; //module.exports

/* THIS FUNCTION CONTROLLS IF HEADERS OF TABLES HAVE TYPE OF VALUES EQUAL TO 'STRING' OR 'NUMERIC' AND IT MAKES DIFFERENT VARIBALES FOR BOTH TYPE */
function createHeaderStringAndHeaderNumeric(dataTables){
  var keys = Object.keys(dataTables);

    for (i=0 ; i<keys.length ; i++){
      var tableName = keys[i];
      var table = dataTables[tableName];
      var firstRow = table['data'][0];  //it controls the first row of the table
      var isString = [];
      var isNumeric = [];

      for (j=0 ; j<firstRow.length ; j++){  //for each value in firstRow it controls if value is String or Numeric
        var elementNumeric = Number(firstRow[j]);

        if ( isNaN(elementNumeric) && (firstRow[j] != "OK") && (firstRow[j] != "-") ){
          isString.push(table['header'][j]);
        }
        else if ( !isNaN(elementNumeric) ){
          isNumeric.push(table['header'][j]);
        }
      }
      table['headerString'] = isString;
      table['headerNumeric'] = isNumeric;
    }
}
