google.load('visualization', '1', {packages: ['corechart', 'bar']});
      
      var tagList=[];
      var searchCamp="";
      var hash = new Object();
      var arrayNaN=[];
      var supportoNaN=[];
      var indexGene=[];
      var rows=[];
      var charts=[];
      var dati=[];
      var papa = [];

      $(document).ready(function() {
        $.getJSON(webserver+'/tags', function(data){
          $.each(data, function(index,value){
            $("<div class=\"btn btn-default\" id=\""+ value +"\" style=\"margin-bottom:12px;margin-left:12px;\" onclick=\"selectionTag(id)\">" + value +"</div>").appendTo('#listingTag_Body');
          })
        })
      });

      function deleteTag(idBtn){
      $('#line_'+ idBtn.split("_")[1]).remove();
      $('#'+idBtn.split("_")[1]).css("background-color", "");
      tagList.splice(tagList.indexOf(idBtn.split("_")[1]),tagList.indexOf(idBtn.split("_")[1])+1);
      }

      function sendList(){
        searchCamp="";
        var string="";
        $('#sectionResult_body_Tab').empty();
        $('#sectionResult_body_Content').empty();
        $('#SelectedFile_Body').empty();
        if ($('#globalSearchForm').val() != ""){
          var inputSplit = $('#globalSearchForm').val().split(" ")
          $.each(inputSplit, function(){
            if (this != ""){
              searchCamp += this + '%20';
            }
          })
          searchCamp = searchCamp.substring(0,searchCamp.length-3);
        }
        else{
          alert("input errato!");
          return;
        }
        if((tagList.length == undefined) || (tagList.length == 0)){
          string = "/keys/"+searchCamp;
          $.getJSON(webserver+string, function(data){
          showTableChart(data);
          })
        }
        else{
          string = "/tags/";
          $.each(tagList, function(){
            string += this + '%20'
          })
          string = string.substring(0, string.length-3);
          var uri = webserver+ string +'/keys/'+ searchCamp;
          console.log(uri);
          $.getJSON( uri, function(data){
            console.log(data);
            showTableChart(data);
          })
        }
      }


        /*
  datasetName is the filepath/key to access the record data
  */
  function tableToDataTableHeader(dataTable){
   
    console.log(dataTable);
    dataTable.header.map(function(column_name){
      var h=[];
      h['title']=column_name;
      return h;
    })
  }

  function tableToDataTableBody(dataTable){
    dataTable.rows;
  }

  function tableToDataTable(dataTable){
    var h = [];
    h['data']=tableToDataTableBody(dataTable);
    h['columns']=tableToDataTableHeader(dataTable);
    return h;
  }

      function showTableChart(tables){

        createResults(tables);
      }


      function createResults(tables){
        var keys = Object.keys(tables)
        console.log(keys);
        console.log(tables)
        for (var i = 0; i < keys.length; i++) {
          var tableName = keys[i];
          console.log(tableName)
          var dataTable = tableToDataTable(tables[tableName]);
          // console.log(dataTable);
          createResultTab(i, i);
          createResultTable(dataTable, i);
          createResultChart(dataTable, i);
        }
        $('.myChart').hide();
        $('.myTable').show();
        $('#sectionResult_body_Content_'+0).addClass('active');
        $('a[href="#Result"]').tab('show');
      }

      function createResultTab(id, show_id ){
        $("<li class=\"text-center\"><a href=\"#sectionResult_body_Content_"+id+"\" data-toggle=\"tab\" id=\"#sectionResult_body_Content_"+id+"\" onclick=\"switchContent(id)\">"+show_id+"</a></li>").appendTo('#sectionResult_body_Tab');
        $("<div class=\"tab-pane fade in\" id=\"sectionResult_body_Content_"+id+"\"></div>").appendTo('#sectionResult_body_Content');        
      }

      function createResultTable(table, id){
        $("<div id=\"table_"+id+"\" class=\"myTable\"></div>").appendTo('#sectionResult_body_Content_'+id);
        $("<table border=\"3\" class=\"table table-striped table-condensed\" id=\"example"+ id +"\"></table>").appendTo('#table_'+id);
        $('#example'+id).dataTable(table);
      }

      function createResultChart(table, id){
        $("<div id=\"chart_"+id+"\" class=\"myChart\">"+id+"</div>").appendTo('#sectionResult_body_Content_'+id);
      }


      // function showTableChart(obj){

      //   for(i=0 ; i<Object.keys(hash).length ; i++){
  
      //     if(count == 0){
      //       $("<li class=\"active text-center\"><a href=\"#sectionResult_body_Content_"+count+"\" data-toggle=\"tab\" id=\"#sectionResult_body_Content_"+count+"\" onclick=\"switchContent(id)\">"+count+"</a></li>").appendTo('#sectionResult_body_Tab');
      //       $("<div class=\"tab-pane fade in active\" id=\"sectionResult_body_Content_"+count+"\"></div>").appendTo('#sectionResult_body_Content');
      //     }
      //     else{
      //       $("<li class=\"text-center\"><a href=\"#sectionResult_body_Content_"+count+"\" data-toggle=\"tab\" id=\"#sectionResult_body_Content_"+count+"\" onclick=\"switchContent(id)\">"+count+"</a></li>").appendTo('#sectionResult_body_Tab');
      //       $("<div class=\"tab-pane fade in\" id=\"sectionResult_body_Content_"+count+"\"></div>").appendTo('#sectionResult_body_Content');
      //     }
      //     $("<div id=\"table_"+count+"\" class=\"myTable\"></div>").appendTo('#sectionResult_body_Content_'+count);
      //     $("<div id=\"chart_"+count+"\" class=\"myChart\">"+count+"</div>").appendTo('#sectionResult_body_Content_'+count);
      //     $("<div id=\"indexColumn_"+count+"\" class=\"myIndexColumn\"></div>").appendTo(SelectedFile_Body);
      //     for(index=0;index<papa[count].length;index++){
      //       $("<label class=\"checkbox\"><p><input type=\"checkbox\" id=\"indexColumn"+count+"_"+papa[count][index]['title']+"\">"+papa[count][index]['title']+"</label>").appendTo('#indexColumn_'+count);
      //     }
      //     if(count!=0){
      //       $('#indexColumn_'+count).hide();
      //     }
      //   }
      //   // arrayNaN=[];
      //   // supportoNaN=[];
      //   // indexGene=[];
      //   // rows=[];
      //   // charts=[];
      //   // dati=[];
      //   // for(i=0 ; i<papa.length ; i++){
      //   //   arrayNaN=[];
      //   //   for(k=0 ; k<hash[Object.keys(hash)[i]][0].length ; k++){
      //   //     supportoNaN=[];
      //   //     if((isNaN(Number(hash[Object.keys(hash)[i]][0][k]))) && (papa[i][k]['title'].search("_short_name")==-1)){
      //   //       supportoNaN.push(k);
      //   //     }
      //   //     else if((isNaN(Number(hash[Object.keys(hash)[i]][0][k]))) && (papa[i][k]['title'].search("_short_name")!=-1)){
      //   //       indexGene[i] = k;
      //   //     }
      //   //     if((isNaN(Number(hash[Object.keys(hash)[i]][0][k]))) && (papa[i][k]['title'].search("_symbol")==-1)){
      //   //       supportoNaN.push(k);
      //   //     }
      //   //     else if((isNaN(Number(hash[Object.keys(hash)[i]][0][k]))) && (papa[i][k]['title'].search("_symbol")!=-1)){
      //   //       indexGene[i] = k;
      //   //     }
      //   //   }
      //   //   arrayNaN.push(supportoNaN); 
      //   // }
      //   // google.setOnLoadCallback(drawCharts()); 
      //   // $('.myChart').hide();
      //   $('.myTable').show();
      //   $('a[href="#Result"]').tab('show');
      // }

      function drawCharts(){  //viene chiamata solo alla fine dell'esecuzione di tutta la funzione
        for(i=0 ; i<papa.length ; i++){
          if(indexGene[i] != undefined){
            dati[i] = new google.visualization.DataTable();
            dati[i].addColumn('string', String(papa[i][indexGene[i]]['title'])); 
            
            for(j=0 ; j<papa[i].length ; j++){  
              if((arrayNaN[0].indexOf(j)==-1) && (papa[i][j]['title'].search("_short_name")==-1)){
                dati[i].addColumn('number', String(papa[i][j]['title']));
              }
              else if((arrayNaN[0].indexOf(j)==-1) && (papa[i][j]['title'].search("_symbol")==-1)){
                dati[i].addColumn('number', String(papa[i][j]['title']));
              }
            }

            for(j=0 ; j<hash[Object.keys(hash)[i]].length ; j++){
              rows=[];
              rows.push(hash[Object.keys(hash)[i]][j][indexGene[i]]);
              for(k=0 ; k<hash[Object.keys(hash)[i]][j].length ; k++){
                if((arrayNaN[0].indexOf(k)==-1) && (papa[i][k]['title'].search("_short_name")==-1)){
                  rows.push(Number(hash[Object.keys(hash)[i]][j][k]));
                }
                else if((arrayNaN[0].indexOf(k)==-1) && (papa[i][k]['title'].search("_symbol")==-1)){
                  rows.push(Number(hash[Object.keys(hash)[i]][j][k]));
                }
              }
              dati[i].addRow(rows);
            }

            var options = {
              height: 300,
              width: 600,     
            };
            
            charts[i] = new google.charts.Bar(document.getElementById('chart_'+i));
            charts[i].draw(dati[i], options);
            // console.log(dati[i]);
            // console.log('i='+i+' chart made!');
          }
          else{ //se indexGene[i] è undefined
            // console.log('i='+i+' chart Not made!');
            $("<p>NoChart!</p>").appendTo('#chart_'+i);
          }
        }
      }

      function selectionTag(id){
        if (tagList.indexOf(id)==-1){
          document.getElementById(id).style.background="#ADFF2F";
          tagList.push(id);
          $('#SelectedTag_Body_TableBody').append("<tr id=\"line_"+ id +"\"><td>" + id + "</td><td><div class=\"btn btn-xs btn-danger\" id=\"deleteBtn_" + id +"\" onclick=\"deleteTag(id)\">X</div></td></tr>");
        }
        else{
          $('#line_'+ id).remove();
          $('#'+id).css("background-color", "");
          tagList.splice(tagList.indexOf(id),tagList.indexOf(id)+1);
        }
      }

      function switchTableChart(id){
        var str = id.substring(id.length-5, id.length);
        $(id).class="active";
        if(str == 'table'){
          $('.myChart').hide();
          $('.myTable').show();
        }
        else{
          $('.myTable').hide();
          $('.myChart').show();
        }
      }

      function switchContent(id){
        // console.log(id);
        var index = id.substring(id.length-1,id.length);
        // console.log(index);
        $('.myIndexColumn').hide();
        $('#indexColumn_'+index).show();
      }