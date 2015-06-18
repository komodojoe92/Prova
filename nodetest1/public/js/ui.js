google.load('visualization', '1.1', {packages: ['corechart', 'bar']});
      
      var tagList=[];
      var searchCamp="";
      var dati;

      $(document).ready(function() {
        setHeightWindows();
        $.getJSON(webserver+'/tags', function(data){
          $.each(data, function(index,value){
            $("<div class=\"btn btn-default\" id=\""+ value +"\" style=\"margin-bottom:12px;margin-left:12px;\" onclick=\"selectionTag(id)\">" + value +"</div>").appendTo('#listingTag_Body');
          })
        })
      });
      
      function setHeightWindows(){
        var hWindow = calcHeightWindow(window);        
        var hNavBar= calcHeightWindow('#navBar');
        var hSectionTab= calcHeightWindow('#sectionTab');
        var hListingTag_header= calcHeightWindow('#listingTag_header');
        var hSelectedTag_header= calcHeightWindow('#SelectedTag_header');
        var hSectionResult_header = calcHeightWindow('#sectionResult_header');
        var hSelectedColumns_header= calcHeightWindow('#SelectedColumns_header');

        var hListingTag_Body = hWindow-hNavBar-hSectionTab-hListingTag_header-75;
        var hSelectedTag_Body = hWindow-hNavBar-hSectionTab-hSelectedTag_header-75;
        var hSelectedColumns_Body = hWindow-hNavBar-hSectionTab-hSelectedColumns_header-75;

        $('#listingTag_Body').css("max-height", hListingTag_Body);
        $('#SelectedTag_Body').css("max-height",hSelectedTag_Body);
        $('#SelectedColumns_Body').css("max-height",hSelectedColumns_Body);
      }

      function calcHeightWindow(id){
        return $(id).height();
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
        $('#SelectedColumns_Body').empty();
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
          // console.log(uri);
          $.getJSON( uri, function(data){
            // console.log(data);
            showTableChart(data);
          })
        }
      }

      function showTableChart(tables){
        dati=tables;
        createResults(tables);
      }

      function createResults(tables){
        var keys = Object.keys(tables);
        if(keys.length == 0){
          console.log(keys.length);
          alert('No Result! Try with other param(s)!');
          return;
        }
        // console.log(keys);
        // console.log(tables)
        for (var i = 0; i < keys.length; i++) {
          var tableName = keys[i];
          // console.log(tableName);
          var dataTable = tableToDataTable(tables[tableName]);
          // console.log(dataTable);
          createResultTab(i, i);
          createResultTable(dataTable, i);
          createResultChart(dataTable, i);
          createColumnsSides(dataTable,i);
          //drawGoogleChart(dataTable,i);
        }
        $('.myIndexColumn').hide();
        $('.myChart').hide();
        $('#indexColumn_0').show();
        $('#sectionResult_body_Content_li_0').addClass('active');  
        $('#sectionResult_body_Content_0').addClass('active');        
        $('a[href="#Result"]').tab('show');
        // google.setOnLoadCallback(drawCharts()); 
      }

      function tableToDataTable(dataTable){
        return {data:tableToDataTableBody(dataTable), columns:tableToDataTableHeader(dataTable)};
      }

      function tableToDataTableBody(dataTable){
        return dataTable.data;
      }

      function tableToDataTableHeader(dataTable){
        // console.log(dataTable);
        return dataTable.header.map(function(columnName){
          // console.log(columnName);
          return {title:columnName};
        })
      }

      function createResultTab(id, show_id ){
        var hWindow = $(window).height();        
        var hNavBar= $('#navBar').height();
        var hSectionTab= $('#sectionTab').height();
        var hSectionResult_header = $('#sectionResult_header').height();

        var hSectionResult_body = hWindow-hNavBar-hSectionTab-hSectionResult_header-158;

        $("<li class=\"text-center\" id=\"sectionResult_body_Content_li_"+id+"\"><a href=\"#sectionResult_body_Content_"+id+"\" data-toggle=\"tab\" id=\"sectionResult_body_Content"+id+"\" onclick=\"switchContent(id)\">"+show_id+"</a></li>").appendTo('#sectionResult_body_Tab');
        $("<div class=\"tab-pane fade in\" style=\"overflow:auto; max-height:"+(hSectionResult_body)+"px\" id=\"sectionResult_body_Content_"+id+"\"></div>").appendTo('#sectionResult_body_Content');        
      }

      function createResultTable(table, id){
        $("<div id=\"table_"+id+"\" class=\"myTable\" style=\"overfloaw:auto ; height:100%\"></div>").appendTo('#sectionResult_body_Content_'+id);
        $("<table border=\"3\" class=\"table table-striped table-condensed\" id=\"example"+ id +"\"></table>").appendTo('#table_'+id);
        $('#example'+id).dataTable(table);
      }

      function createResultChart(table, id){
        $("<div id=\"chart_"+id+"\" class=\"myChart\" style=\"height:100% ; width:100%\"></div>").appendTo('#sectionResult_body_Content_'+id);
      }

      function createColumnsSides(table, id){

          $("<div id=\"indexColumn_"+id+"\" class=\"myIndexColumn\" style=\"margin-left:8px;\"></div>").appendTo('#SelectedColumns_Body');
          for(index=0;index<table.columns.length; index++){
            $("<label class=\"checkbox\"><p><input type=\"checkbox\" id=\"indexColumn_"+id+"_"+table.columns[index].title+"_"+index+"\" onclick=\"hideShowColumnTable(id)\">"+table.columns[index].title+"</label>").appendTo('#indexColumn_'+id);
            $('#indexColumn_'+id+'_'+table.columns[index].title+"_"+index).prop('checked', true);
          }
      }
  
      function hideShowColumnTable(id){
        var numberOfTable=id.split("_")[1];
        var indexCol=id.substring(id.length-2);
        var i=indexCol.indexOf("_");
        if (i > -1){
          indexCol=indexCol.split("_")[1];
        }
        var table = $('#example'+numberOfTable).DataTable();
        
        if( $('#'+id).prop("checked") ){
          table.column( indexCol ).visible( true );
        }
        else{
          table.column( indexCol ).visible( false );
        }
        table.columns.adjust().draw();
      }

      function drawGoogleChart(table, id){
        var columnIndexes = filterColumnsForChart(table, id);

        var header = generateHeaderForChart(table, id, columnIndexes);

        var rows = generateRowsForChart(table, id, columnIndexes) ;
        
        rows = changeRowsFromStringToNumber(rows);
        var googleDataTable = dataTableToGoogleChartDataTable(header, rows, id);
        var options = {
              height: 450,
              width: 900,
              legend: {
                        alignament: "start"
                      },
              };
            
        chart = new google.charts.Bar(document.getElementById('chart_'+id));
        chart.draw(googleDataTable, options);

      }

      function filterColumnsForChart(table, id){
        var columnIndexesChecked = [];
        //columnIndexes[0]=4;
        columnIndexesChecked[0]=4;
        $('#indexColumn_'+id).children().children().children().each(function(index,value){
          //console.log(value.id);
          if((value.checked) && ((value.id).search("_FPKM")!= -1)){
            columnIndexesChecked.push(index);
          }
        });
        console.log(columnIndexesChecked);
        
        /*for(i=0; i < table.columns.length; i++){
          if (table.columns[i].title.search("_FPKM") != -1){
            columnIndexes.push(i);
          }

        }*/
        return columnIndexesChecked;
      }

      function generateHeaderForChart(table, id, columnIndexes){
        var header = [];
        for(i=0; i<columnIndexes.length; i++){
          header.push(table.columns[columnIndexes[i]].title);
        }
        return header;
      }

      function generateRowsForChart(table, id, columnIndexes){
        return table.data.map(function(row_data, row_index, row){
          return columnIndexes.map(function(col_index, index, columns){
            return row_data[col_index];
          });

        });
      }
      
      function changeRowsFromStringToNumber(rows){
        $(rows).each(function(indexRow,value){
          $(value).each(function(indexElement,val){
            if(indexElement != 0){
              rows[indexRow][indexElement] = Number(val);
            }
          });       
        });
        return rows;
      }

      function dataTableToGoogleChartDataTable(header, rows, id){
        return google.visualization.arrayToDataTable([header].concat(rows));
      }

      function switchTableChart(id){
        var idSectionActive= $('#sectionResult_body_Tab').children('.active').attr('id');
        //console.log(idSectionActive);
        var i = idSectionActive.split("_")[4];
        //console.log(i);
        var keys = Object.keys(dati);
        var tableName = keys[i];
        var dataTable = tableToDataTable(dati[tableName]);
        
        var str = id.substring(id.length-5, id.length);
        $(id).prop="active";
        if(str == 'table'){
          $('.myChart').hide();
          $('.myTable').show();
        }
        else{
          $('.myTable').hide();
          $('.myChart').show();
          drawGoogleChart(dataTable,i);
        }
      }

      function switchContent(id){
        // console.log(id);
        var index = id.substring(id.length-1,id.length);
        // console.log(index);
        $('.myTable').show();
        $('.myIndexColumn').hide();
        $('.myChart').hide();
        $('#indexColumn_'+index).show();
      }
