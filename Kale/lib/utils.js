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
          h['hAxis'] = 3;
          h['stringColumns'] = "FPKM";
          dataTables[filepath] = h;
        }

        var row = [];

        row = record['infos']['header'].map(function(header){
          return record.data[header]
        });

        dataTables[filepath]['data'].push(row);
      }
    } //if bdfResultJson != 0
    return dataTables;
  }

}; //module.exports
