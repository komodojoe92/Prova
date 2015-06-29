google.load('visualization', '1.1', {packages: ['corechart', 'bar']});
      
      var tagList = [];
      var dati;

      $(document).ready(function() {
        setHeightWindows();
        $.getJSON(webserver +'/tags', function(data){
          $.each(data, function(index,value){
            $("<div class=\"btn btn-default\" id=\""+ value +"\" style=\"margin-bottom:12px;margin-left:12px;\" onclick=\"selectionTag(id)\">" + value +"</div>").appendTo('#listingTag_body');
          })
        })
      });
      
      function setHeightWindows(){
        var hWindow = calcHeightWindow(window);        
        var hNavBar = calcHeightWindow('#navBar');
        var hSectionTab = calcHeightWindow('#sectionTab');
        var hListingTag_header= calcHeightWindow('#listingTag_header');
        var hSelectedTag_header= calcHeightWindow('#selectedTag_header');
        var hSectionResult_header = calcHeightWindow('#sectionResult_header');
        var hListingColumns_header = calcHeightWindow('#listingColumns_header');
        
        var hSelectColumnsForChart = calcHeightWindow('#selectColumnsForChart');
        if(hSelectColumnsForChart <= 0){
          hSelectColumnsForChart = 218;
        }

        var hListingTag_body = hWindow-hNavBar-hSectionTab-hListingTag_header-75;
        var hSelectedTag_body = hWindow-hNavBar-hSectionTab-hSelectedTag_header-75;
        var hListingColumns_body = hWindow-hNavBar-hSectionTab-hSelectColumnsForChart-hListingColumns_header-100;

        $('#listingTag_body').css("max-height", hListingTag_body);
        $('#selectedTag_body').css("max-height",hSelectedTag_body);
        $('#listingColumns_body').css("max-height",hListingColumns_body);
      }

      function calcHeightWindow(id){
        return $(id).height();
      }

      function selectionTag(id){
        var indexOfTagName = tagList.indexOf(id);

        if (indexOfTagName == -1){
          document.getElementById(id).style.background="#ADFF2F";
          tagList.push(id);
          $('#selectedTag_body_table_body').append("<tr id=\"line_"+ id +"\"><td>" + id + "</td><td><div class=\"btn btn-xs btn-danger\" id=\"deleteBtn/" + id +"\" onclick=\"deleteTag(id)\">X</div></td></tr>");
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
        $('#globalSearchWarning').hide();
        
        var inputValue = $('#globalSearchForm').val();
        var inputValueSplit = inputValue.split(" ");

        searchCampString = setStringOfKeys(inputValueSplit);
        listOfTagString = setStringOfKeys(tagList);

        if(searchCampString == ""){
          $('#globalSearchWarning').show();
        }

        else if (listOfTagString == ""){
          stringToServer = "/keys/" + searchCampString;
        }

        else{
          searchCampString = "/keys/" + searchCampString;
          listOfTagString = "/tags/" + listOfTagString;
          stringToServer = listOfTagString + searchCampString;
        }

        $.getJSON(webserver+stringToServer, function(data){
            showTableChart(data);
          });
       } 

      function resetVariableAndDiv(){
        $('#emptyResultWarning').remove();
        $('#sectionResult_header_switchSection_chart').removeClass('active'); 
        $('#sectionResult_body_tab').empty();
        $('#sectionResult_body_content').empty();
        $('#listingColumns_body').empty();
        $('#selectColumnsForChart_body').empty();
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

        $.each(keys, function(index,value){
          var tableName = keys[index];
          var dataTable = tableToDataTable(tables[tableName]);
          
          createResultTab(index, index);
          createResultTable(dataTable, index);
          createResultChart(dataTable, index);
          createColumnsSides(dataTable,index);
          createSectionColumnsForChart(dataTable,index);
        });
        
        $('.myIndexColumn').hide();
        $('.myChart').hide();
        $('.mySectionColumnsForChart').hide();
        
        showDivOfFirstKey();
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
        if(dataTable.header != undefined){
          return dataTable.header.map(function(columnName){
            // console.log(columnName);
            return {title:columnName};
          });
        }
        else{
          $('#sectionResult_body').append('<h1>No result! Try with other params.</h1>');
          return;
        }
      }

      function createResultTab(id, show_id ){
        var hWindow = calcHeightWindow(window);        
        var hNavBar= calcHeightWindow('#navBar');
        var hSectionTab= calcHeightWindow('#sectionTab');
        var hSectionResult_header = calcHeightWindow('#sectionResult_header');

        var hSectionResult_body = hWindow-hNavBar-hSectionTab-hSectionResult_header-158;

        $("<li class=\"text-center\" id=\"sectionResult_body_content_li_"+ id +"\"><a href=\"#sectionResult_body_content_"+ id +"\" data-toggle=\"tab\" id=\"sectionResult_body_content"+ id +"\" onclick=\"switchContent(id)\">"+ show_id +"</a></li>").appendTo('#sectionResult_body_tab');
        $("<div class=\"tab-pane fade in\" style=\"overflow:auto; max-height:"+ hSectionResult_body +"px\" id=\"sectionResult_body_content_"+ id +"\"></div>").appendTo('#sectionResult_body_content'); 
      }

      function createResultTable(table, id){
        $("<div id=\"table_"+id+"\" class=\"myTable\" style=\"overfloaw:auto ; height:100%\"></div>").appendTo('#sectionResult_body_content_'+ id);
        $("<table border=\"3\" class=\"table table-striped table-condensed\" id=\"example"+ id +"\"></table>").appendTo('#table_'+ id);
        $('#example'+ id).dataTable(table);
      }

      function createResultChart(table, id){
        $("<div id=\"chart_"+ id +"\" class=\"myChart\" style=\"height:100% ; width:100%\"></div>").appendTo('#sectionResult_body_content_'+ id);
      }

      function createColumnsSides(table, id){
        $("<div id=\"indexColumn_"+ id +"\" class=\"myIndexColumn\" style=\"margin-left:8px;\"></div>").appendTo('#listingColumns_body');
          
        $.each(table.columns, function(index, value){
          $("<label class=\"checkbox\"><p class=\"myIndexCheckbox\"><input type=\"checkbox\" id=\"indexColumn_"+ id +"_"+ value.title +"_"+ index +"\" onclick=\"hideShowColumnTable(id)\">"+ value.title +"</label>").appendTo('#indexColumn_'+ id);
          $('#indexColumn_'+ id +'_'+value.title +"_"+ index).prop('checked', true);
        });
      }

      function createSectionColumnsForChart(table,id){
        var keys = Object.keys(dati);
        var tableName = keys[id];
        var headers = dati[tableName]['header'];
        var stringColumns = dati[tableName]['stringColumns']

        $("<div id=\"sectionColumnsForChart_"+ id +"\" class=\"mySectionColumnsForChart\"></div>").appendTo('#selectColumnsForChart_body');

        $("<label for=\"selectColumnsForChart_body_haxisForm_"+ id +";\" style=\"height:5px;\">column\'s name</label>").appendTo('#sectionColumnsForChart_'+ id);
        $("<select id=\"selectColumnsForChart_body_haxisForm_"+ id +"\" class=\"form-control\"></select>").appendTo('#sectionColumnsForChart_'+ id);

        $.each(headers, function(index,value){
          var dataElement = table['data'][0][index];
          var elementNumeric = Number(dataElement);
          if( isNaN(elementNumeric) && dataElement!="OK" && dataElement!="-"){
            $("<option>"+ value +"</option>").appendTo('#selectColumnsForChart_body_haxisForm_'+ id);
          }
        });

        $("<label for=\"selectColumnsForChart_body_columnsForm_"+ id +";\" style=\"height:5px;\">substring group</label>").appendTo('#sectionColumnsForChart_'+ id);
        $("<input id=\"selectColumnsForChart_body_columnsForm_"+ id +"\" class=\"form-control\"><span class=\"label label-danger glyphicon glyphicon-remove\" id=\"selectColumnsForChart_body_columnsForm_Warning_"+ id +"\"> inputError.</span></input>").appendTo('#sectionColumnsForChart_'+ id);          
        $('#selectColumnsForChart_body_columnsForm_Warning_'+ id).hide();
        $("#selectColumnsForChart_body_columnsForm_"+ id).val(stringColumns);
        $("<p></p><button id=\"SelectColumnsForChart_body_enterButton"+ id +"\" class=\"btn btn-primary btn-sm\" type=\"button\" style=\"float:right;\" onclick=\"sendStringsForChart()\">Enter</button>").appendTo('#sectionColumnsForChart_'+ id);
      }

      function showDivOfFirstKey(){
        $('#indexColumn_0').show();
        $('#sectionColumnsForChart_0').show();
        $('#sectionResult_body_content_li_0').addClass('active');  
        $('#sectionResult_body_content_0').addClass('active');
        $('#sectionResult_header_switchSection_table').addClass('active');       
        switchContent("content0");
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
        var hsectionResult_body_tab = calcHeightWindow('#sectionResult_body_tab');
        var hMaxListingTag_body = $('#listingTag_body').css('max-height');

        var columnIndexes = filterColumnsForChart(table, id, dati[tableName]['hAxis'], dati[tableName]['stringColumns']);
        var header = generateHeaderForChart(table, id, columnIndexes);
        var rows = generateRowsForChart(table, id, columnIndexes) ;
        rows = changeRowsFromStringToNumber(rows);
        var googleDataTable = dataTableToGoogleChartDataTable(header, rows, id);
        
        var hChart = hMaxListingTag_body.split("px")[0] - hsectionResult_body_tab - 20;
        var wChart = $('#sectionResult_body_content').width() - 20;

        var options = {
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
        var idSectionActive= $('#sectionResult_body_tab').children('.active').attr('id');
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
        $('#sectionResult_header_filepath').empty();
        var index = id.split('content')[1];

        var keys = Object.keys(dati);
        var tableName = keys[index];
        var dataTable = tableToDataTable(dati[tableName]);

        var hAxis = dati[tableName]['hAxis'];
        var stringColumns = dati[tableName]['stringColumns'];
        
        $('#sectionResult_header_filepath').text(tableName);
        $('.myIndexColumn').hide();
        $('.myTable').hide();
        $('.myChart').hide();
        $('.mySectionColumnsForChart').hide();

        if( $('#sectionResult_header_switchSection_chart').is('.active') ){
          $('#chart_'+ index).show();
          $(".myIndexCheckbox").show();

          setValueInSelectColumnsForChart(id, dati[tableName].header[hAxis], stringColumns);
          filterDivColumnForChart(dati[tableName], index, hAxis, stringColumns);
          drawGoogleChart(dataTable,index);
        }
        else{
          $('#table_'+index).show();
          $('.myIndexCheckbox').show();    
        }
        setValueInSelectColumnsForChart(id, dati[tableName].header[hAxis], stringColumns);
        $('#indexColumn_'+ index).show();
        $('#sectionColumnsForChart_'+ index).show();
      }

      function setValueInSelectColumnsForChart(id, hAxisForm,ColumnsForm){
        $('#selectColumnsForChart_body_haxisForm_'+ id).val(hAxisForm);
        $('#selectColumnsForChart_body_columnsForm_'+ id).val(ColumnsForm);  
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
        var idSectionActive= $('#sectionResult_body_tab').children('.active').attr('id');
        var index = idSectionActive.split("_")[4];
        var keys = Object.keys(dati);
        var tableName = keys[index];
        
        setIndexOfHaxisValue(index,tableName);
        setStringOfColumnsChart(index,tableName);
      }

      function setIndexOfHaxisValue(id,filepath){
         var stringHaxis = $('#selectColumnsForChart_body_haxisForm_'+ id).val();
         var headers = dati[filepath]['header'];
         var index = headers.indexOf(stringHaxis);

         dati[filepath]['hAxis'] = index;
      }

      function setStringOfColumnsChart(id, filepath){
        var stringColumns = $('#selectColumnsForChart_body_columnsForm_'+ id).val();
        //var stringOfHaxis = $('#selectColumnsForChart_body_haxisForm_'+ id).val();
        $('#selectColumnsForChart_body_columnsForm_Warning_'+ id).hide();

        if( stringColumns != "" ){
            var matched = false;
            var headers = dati[filepath]['header'];
            var data = dati[filepath]['data'];
            var firstRowData = data[0];
            stringColumns = stringColumns.split(" ")[0];

            $.each(headers, function(index,value){
              var indexMatched = value.search(stringColumns);
              var firstRowDataIndexElement = firstRowData[index];
              var firstRowDataIndexElementNumeric = Number(firstRowDataIndexElement);

              if((indexMatched != -1) && !(isNaN(firstRowDataIndexElementNumeric)) ){
                matched = true;
                return;
              }
            });
            
            if( matched ){
              dati[filepath]['stringColumns'] = stringColumns;
              switchTableChart('sectionResult_header_switchSection_chart');
            }
            else{
              $('#selectColumnsForChart_body_columnsForm_Warning_'+ id).show();
            }
        }
        else{
          $('#selectColumnsForChart_body_columnsForm_Warning_'+ id).show();
          switchTableChart('sectionResult_header_switchSection_chart');
        }
      setHeightWindows();
      }
