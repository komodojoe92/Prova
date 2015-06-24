google.load('visualization', '1.1', {packages: ['corechart', 'bar']});
      
      var tagList=[];
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
        var hNavBar = calcHeightWindow('#navBar');
        var hSectionTab = calcHeightWindow('#sectionTab');
        var hListingTag_header= calcHeightWindow('#listingTag_header');
        var hSelectedTag_header= calcHeightWindow('#SelectedTag_header');
        var hSectionResult_header = calcHeightWindow('#sectionResult_header');
        var hSelectedColumns_header = calcHeightWindow('#SelectedColumns_header');
        var hSelectColumnsForChart = 180;

        var hListingTag_Body = hWindow-hNavBar-hSectionTab-hListingTag_header-75;
        var hSelectedTag_Body = hWindow-hNavBar-hSectionTab-hSelectedTag_header-75;
        var hSelectedColumns_Body = hWindow-hNavBar-hSectionTab-hSelectColumnsForChart-hSelectedColumns_header-113;

        $('#listingTag_Body').css("max-height", hListingTag_Body);
        $('#SelectedTag_Body').css("max-height",hSelectedTag_Body);
        $('#SelectedColumns_Body').css("max-height",hSelectedColumns_Body);
      }

      function calcHeightWindow(id){
        return $(id).height();
      }

      function selectionTag(id){
        var indexOfTagName = tagList.indexOf(id);

        if (indexOfTagName == -1){
          document.getElementById(id).style.background="#ADFF2F";
          tagList.push(id);
          $('#SelectedTag_Body_TableBody').append("<tr id=\"line_"+ id +"\"><td>" + id + "</td><td><div class=\"btn btn-xs btn-danger\" id=\"deleteBtn/" + id +"\" onclick=\"deleteTag(id)\">X</div></td></tr>");
        }
        else{
          $('#line_'+ id).remove();
          $('#'+id).css("background-color", "");
          tagList.splice(indexOfTagName,indexOfTagName+1);
        }
      }

      function deleteTag(idBtn){
        var tagName = idBtn.split("/")[1];
        var indexOfTagName = tagList.indexOf(tagName);

        $('#line_'+tagName).remove();
        $('#'+tagName).css("background-color", "");
        tagList.splice(indexOfTagName,indexOfTagName+1);
      }

      function sendList(){
        var searchCampString = "";
        var listOfTagString = "";
        var stringToServer = "";

        resetVariableAndDiv();
        $('#globalSearchCampWarning').remove();
        
        var inputValue = $('#globalSearchForm').val();
        var inputValueSplit = inputValue.split(" ");

        searchCampString = setStringOfKeys(inputValueSplit);
        listOfTagString = setStringOfKeys(tagList);
        //console.log(searchCampString);
        //console.log(listOfTagString);

        if(searchCampString == ""){
          $("<p id=\"globalSearchCampWarning\"class=\"text-danger small\">*missing string</p>").appendTo('#globalSearch');
        }
        else if (listOfTagString == ""){
          stringToServer = "/keys/" + searchCampString;
        }
        else{
          searchCampString = "/keys/" + searchCampString;
          listOfTagString = "/tags/" + listOfTagString;
          stringToServer = listOfTagString + searchCampString;
        }
        //console.log(stringToServer);
        $.getJSON(webserver+stringToServer, function(data){
            showTableChart(data);
          });
       } 

      function resetVariableAndDiv(){
        $('#emptyResultWarning').remove();
        $('#sectionResult_body_Tab').empty();
        $('#sectionResult_body_Content').empty();
        $('#SelectedColumns_Body').empty();
      }

      function setStringOfKeys(inputValueSplit){
        var stringOfKeys="";

        $.each(inputValueSplit, function(index,value){
          if (value != ""){
            stringOfKeys += value + '%20';
          }
        });

        stringOfKeys = deleteLastThreeCharacters(stringOfKeys);
        return stringOfKeys;
      }

      function deleteLastThreeCharacters(string){
        return string.substring(0, string.length-3);
      }

      function showTableChart(tables){
        dati = tables;
        createResults(tables);
      }

      function createResults(tables){
        var keys = Object.keys(tables);
        if(keys.length == 0){
          //console.log(keys.length);
          $("<p id=\"emptyResultWarning\"class=\"text-danger\">*No result! Please, retry with other params.</p>").appendTo('#sectionResult_body');
          return;
        }
        // console.log(keys);
        // console.log(tables)
        $.each(keys, function(index,value){
          var tableName = keys[index];
          var dataTable = tableToDataTable(tables[tableName]);
          
          createResultTab(index, index);
          createResultTable(dataTable, index);
          createResultChart(dataTable, index);
          createColumnsSides(dataTable,index);
        });
        
        $('.myIndexColumn').hide();
        $('.myChart').hide();
        
        $('#indexColumn_0').show();
        $('#sectionResult_body_Content_li_0').addClass('active');  
        $('#sectionResult_body_Content_0').addClass('active');
        $('#sectionResult_header_switchSection_table').addClass('active');       
        
        $('a[href="#Result"]').tab('show');
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
        });
      }

      function createResultTab(id, show_id ){
        var hWindow = calcHeightWindow(window);        
        var hNavBar= calcHeightWindow('#navBar');
        var hSectionTab= calcHeightWindow('#sectionTab');
        var hSectionResult_header = calcHeightWindow('#sectionResult_header');

        var hSectionResult_body = hWindow-hNavBar-hSectionTab-hSectionResult_header-158;

        $("<li class=\"text-center\" id=\"sectionResult_body_Content_li_"+ id +"\"><a href=\"#sectionResult_body_Content_"+ id +"\" data-toggle=\"tab\" id=\"sectionResult_body_Content"+ id +"\" onclick=\"switchContent(id)\">"+ show_id +"</a></li>").appendTo('#sectionResult_body_Tab');
        $("<div class=\"tab-pane fade in\" style=\"overflow:auto; max-height:"+ hSectionResult_body +"px\" id=\"sectionResult_body_Content_"+ id +"\"></div>").appendTo('#sectionResult_body_Content'); 
      }

      function createResultTable(table, id){
        $("<div id=\"table_"+id+"\" class=\"myTable\" style=\"overfloaw:auto ; height:100%\"></div>").appendTo('#sectionResult_body_Content_'+ id);
        $("<table border=\"3\" class=\"table table-striped table-condensed\" id=\"example"+ id +"\"></table>").appendTo('#table_'+ id);
        $('#example'+ id).dataTable(table);
      }

      function createResultChart(table, id){
        $("<div id=\"chart_"+ id +"\" class=\"myChart\" style=\"height:100% ; width:100%\"></div>").appendTo('#sectionResult_body_Content_'+ id);
      }

      function createColumnsSides(table, id){
          $("<div id=\"indexColumn_"+ id +"\" class=\"myIndexColumn\" style=\"margin-left:8px;\"></div>").appendTo('#SelectedColumns_Body');
          
          $.each(table.columns, function(index, value){
            $("<label class=\"checkbox\"><p class=\"myIndexCheckbox\"><input type=\"checkbox\" id=\"indexColumn_"+ id +"_"+ value.title +"_"+ index +"\" onclick=\"hideShowColumnTable(id)\">"+ value.title +"</label>").appendTo('#indexColumn_'+ id);
            $('#indexColumn_'+ id +'_'+value.title +"_"+ index).prop('checked', true);
          });
      }
  
      function hideShowColumnTable(id){
        var numberOfTable = id.split("_")[1];
        var indexCol = id.substring(id.length-2);
        var index = indexCol.indexOf("_");
        var table = $('#example'+ numberOfTable).DataTable();
        
        if (index > -1){
          indexCol = indexCol.split("_")[1];
        }
        
        if( $('#'+ id).prop("checked") ){
          table.column(indexCol).visible( true );
        }
        else{
          table.column(indexCol).visible( false );
        }
        table.columns.adjust().draw();

        if( $('.myChart').is(':visible') ){
          switchTableChart(id);
        }
      }

      function drawGoogleChart(table, id){
        //dal server, insieme ai dati viene inviato per ciascun grafico, l'indice dell'elemento di riferimento per l'asse x ed la sottostringa degli elementi da graficare nel chartS
        var keys = Object.keys(dati);
        var tableName = keys[id];

        var hsectionResult_body_Tab = calcHeightWindow('#sectionResult_body_Tab');
        var hMaxListingTag_Body = $('#listingTag_Body').css('max-height');

        var columnIndexes = filterColumnsForChart(table, id, dati[tableName]['hAxis'], dati[tableName]['stringColumns']);
        var header = generateHeaderForChart(table, id, columnIndexes);
        var rows = generateRowsForChart(table, id, columnIndexes) ;
        rows = changeRowsFromStringToNumber(rows);
        var googleDataTable = dataTableToGoogleChartDataTable(header, rows, id);
        
        var hChart = hMaxListingTag_Body.split("px")[0] - hsectionResult_body_Tab - 20;
        var wChart = $('#sectionResult_body_Content').width() - 20;

        var options = {
              chart: {
                title: tableName
              },
              height: hChart,
              width: wChart,
              legend: {
                        alignament: "start"
                      }
              };
            
        chart = new google.charts.Bar(document.getElementById('chart_'+ id));
        chart.draw(googleDataTable, options);
      }

      function filterColumnsForChart(table, id, indexHaxis, substring){
        var columnIndexesChecked = [];
        columnIndexesChecked[0] = indexHaxis;

        $('#indexColumn_'+ id).children().children().children().each( function(index,value){
          var substringIsInValue = ( (value.id).search(substring)!= -1 );
          var numericalDataValue = ( Number(table['data'][0][index] ) );
          var numericalDataValueIsNan = isNaN(numericalDataValue);
          
          if( (value.checked) && (substringIsInValue) && (!numericalDataValueIsNan) ){
            columnIndexesChecked.push(index);
          }
        });
        return columnIndexesChecked;
      }

      function generateHeaderForChart(table, id, columnIndexes){
        var header = [];
        $.each(columnIndexes, function(index,value){
          header.push(table.columns[value].title);
        });
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
        var idForSwitchContent = idSectionActive.split("_")[2]+idSectionActive.split("_")[4];
        var buttonName = id.split("_")[3];

        if(buttonName == 'table'){
          $('#sectionResult_header_switchSection_chart').removeClass('active');    
          $('#sectionResult_header_switchSection_table').addClass('active');
        }
        else{
          $('#sectionResult_header_switchSection_table').removeClass('active');    
          $('#sectionResult_header_switchSection_chart').addClass('active');
        }
        switchContent(idForSwitchContent);
      }

      function switchContent(id){
        var index = id.split('Content')[1];

        var keys = Object.keys(dati);
        var tableName = keys[index];
        var dataTable = tableToDataTable(dati[tableName]);

        var hAxis = dati[tableName]['hAxis'];
        var stringColumns = dati[tableName]['stringColumns'];
        
        $('.myIndexColumn').hide();
        $('.myTable').hide();
        $('.myChart').hide();

        if( $('#sectionResult_header_switchSection_chart').is('.active') && (hAxis != undefined) && (stringColumns != undefined) ){
          $('#chart_'+ index).show();
          $(".myIndexCheckbox").show();
          setEmptyWarning();
          setValueInSelectColumnsForChart(dati[tableName].header[hAxis], stringColumns);
          filterDivColumnForChart(dati[tableName], index, hAxis, stringColumns);
          drawGoogleChart(dataTable,index);
        }
        else if ($('#sectionResult_header_switchSection_table').is('.active')){
          //console.log('table');
          $('#table_'+index).show();
          $('.myIndexCheckbox').show();

          setEmptyWarning();
          setValueInSelectColumnsForChart('', '');      
        }
        else{
          setValueInSelectColumnsForChart('', '');
          sendStringsForChart();
        }
        $('#indexColumn_'+ index).show();
      }

      function setValueInSelectColumnsForChart(hAxisForm,ColumnsForm){
        $('#SelectColumnsForChart_Body_HaxisForm').val(hAxisForm);
        $('#SelectColumnsForChart_Body_ColumnsForm').val(ColumnsForm);  
      }

      function setEmptyWarning(){
        $('#SelectColumnsForChart_Body_HaxisForm_Warning').empty();
        $('#SelectColumnsForChart_Body_ColumnsForm_Warning').empty();
      }

      function filterDivColumnForChart(table, id, indexHaxis, substring){
        var columnIndexesChecked = [];
        var fistRowData =  table['data'][0];
        columnIndexesChecked[0] = indexHaxis;

        $('#indexColumn_' +id).children().children().children().each( function(index,value){
          var firstRowDataElementNumeric = Number(fistRowData[index]);
          if( ((value.id).search(substring) == -1) || (isNaN(firstRowDataElementNumeric)) ){
            $(value).parent().hide();
          }
        });
      }

      function sendStringsForChart(){
        var idSectionActive= $('#sectionResult_body_Tab').children('.active').attr('id');
        var index = idSectionActive.split("_")[4];
        var keys = Object.keys(dati);
        var tableName = keys[index];
        //dati[tableName]['hAxis'] = undefined;
        //dati[tableName]['stringColumns'] = undefined;
        
        setEmptyWarning();
        
        setHaxisValue(tableName);
        setStringOfColumns(tableName);
      }

      function setHaxisValue(filepath){
        var stringHaxis = "";

        if( $('#SelectColumnsForChart_Body_HaxisForm').val() != "" ){
          stringHaxis = $('#SelectColumnsForChart_Body_HaxisForm').val();
          stringHaxis = stringHaxis.split(" ")[0];
          var index = (dati[filepath]['header']).indexOf(stringHaxis);

          if( (index != -1) & isNaN(Number(dati[filepath]['data'][0][index])) ){
            dati[filepath]['hAxis'] = index;
          }
          else{
            $('#SelectColumnsForChart_Body_HaxisForm_Warning').text("*Not valid input.");
          }
        }

        else{
          $('#SelectColumnsForChart_Body_HaxisForm_Warning').text("*missing input.");
        }
      }

      function setStringOfColumns(filepath){
        var stringColumns = "";
        if( $('#SelectColumnsForChart_Body_ColumnsForm').val() != "" ){
          stringColumns = $('#SelectColumnsForChart_Body_ColumnsForm').val();
          stringColumns = stringColumns.split(" ")[0];
          var stringOfHaxis = $('#SelectColumnsForChart_Body_HaxisForm').val();
          /*console.log(stringOfHaxis);
          console.log(stringColumns);
          $.each(dati[filepath]['header'], function(index,value){
            console.log(index);
            console.log(value);
          });
          */
          if(stringColumns != stringOfHaxis){
            dati[filepath]['stringColumns'] = stringColumns;
            switchTableChart('sectionResult_header_switchSection_chart');
          }
          else{
            $('#SelectColumnsForChart_Body_ColumnsForm_Warning').text("*Not valid input.");
          }
        }
        else{
          $('#SelectColumnsForChart_Body_ColumnsForm_Warning').text("*missing input.");
        }
      }
