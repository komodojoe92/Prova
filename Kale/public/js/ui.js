/*
OBJECT: in this file there are all functions and libraries that the application uses during execution. There are any parts of code that require knowledge of JQuery and Bootstrap.
LAST REVISION: 03-07-2015
*/

google.load('visualization', '1.1', {packages: ['corechart', 'bar']});  //it loads th versione 1.1 of Google's API named 'visualization' and with 'corechart' and 'bar' as optional packages
/*global variables ---DON'T DELATE!---*/
var tagList = [];   //this varibale contains tags that are selected
var dati;   //will be used to keep in memory server's result

/* When HTML page is loaded, the programme makes buttons of tags */
$(document).ready(function() {
  setHeightWindows();
  $.getJSON(webserver +'/tags', function(data){   //require to the server an array with tag's name
    $.each(data, function(index,value){
      /* THE STRUCTURE IS: <div class="class1 class2" id="value" style="element1:value1;element2:value2;" onclick="function()"> valueDisplayed </div> */
      $("<div class=\"btn btn-default\" id=\""+ value +"\" style=\"margin-bottom:12px;margin-left:12px;\" onclick=\"selectionTag(id)\">" + value +"</div>").appendTo('#listingTag_body');
    })
  })
});

/* THIS FUNCTION IS USED FOR A RESPONSIVE PAGE'S SIZE */
function setHeightWindows(){
  var hWindow = calcHeightWindow(window);        
  var hNavBar = calcHeightWindow('#navBar');
  var hSectionTab = calcHeightWindow('#sectionTab');
  var hListingTag_header= calcHeightWindow('#listingTag_header');
  var hSelectedTag_header= calcHeightWindow('#selectedTag_header');
  var hSectionResult_header = calcHeightWindow('#sectionResult_header');
  var hListingColumns_header = calcHeightWindow('#listingColumns_header');
  
  var hSelectColumnsForChart = calcHeightWindow('#selectColumnsForChart');  // #selectColumnsForChart is not displayed in the first page. For this reason is height is equal to -2 at the first time
  if(hSelectColumnsForChart <= 0){
    hSelectColumnsForChart = 218;   //the height of #selectColumnsForChart. It's a static div
  }
  // -75, -75 and -100 are the fixed heights of the spaces between the div
  var hListingTag_body = hWindow-hNavBar-hSectionTab-hListingTag_header-75;
  var hSelectedTag_body = hWindow-hNavBar-hSectionTab-hSelectedTag_header-75;
  var hListingColumns_body = hWindow-hNavBar-hSectionTab-hSelectColumnsForChart-hListingColumns_header-100;

  $('#listingTag_body').css("max-height", hListingTag_body);
  $('#selectedTag_body').css("max-height",hSelectedTag_body);
  $('#listingColumns_body').css("max-height",hListingColumns_body);
}

/*THIS FUNCTION CALCULATES THE HEIGHT OF 'ID'*/
function calcHeightWindow(id){
  return $(id).height();
}

/* ADD/REMOVE TAG(id) FROM tagList */
function selectionTag(id){
  var indexOfTagName = tagList.indexOf(id);   //it controls if 'id' is in tagList (an array) and returns it index

  if (indexOfTagName == -1){  //if index there isn't (value equal to -1) button's background become GREEN, 'id' is added to array (tagList) and a new row displays in #selectedTag_body_table_body
    document.getElementById(id).style.background="#ADFF2F";
    tagList.push(id);
    /* THE STRUCTURE IS: <tr id="line_id"><td> id </td><td><div class="class1 class2 class3" id="deleteBtn/id" onclick="deleteTag(id)"> X </td><tr> 
       'tr' can be interpreted as 'row' and 'td' as 'division/column' */
    $("<tr id=\"line_"+ id +"\"><td>" + id + "</td><td><div class=\"btn btn-xs btn-danger\" id=\"deleteBtn/" + id +"\" onclick=\"deleteTag(id)\">X</div></td></tr>").appendTo('#selectedTag_body_table_body');
  }
  else{   //else if 'id' is in tagList, the code simulates a call from a tag's button
    var idForDeleteTag = "/"+ id;
    deleteTag(idForDeleteTag);
  }
}

/* THIS FUNCTION DELETE TAG FROM tagList AND FROM #selectedTag_body_table_body*/
function deleteTag(idBtn){
  var tagName = idBtn.split("/")[1];    //as 'split-character' is used '/' because tags can have '_' or '-' within the name
  var indexOfTagName = tagList.indexOf(tagName);    //it controls if 'tagName' is in tagList (an array) and returns it index

  $('#line_'+ tagName).remove();    //it removes all structure in #selectedTag_body_table_body
  $('#'+ tagName).css("background-color", "");    //the background of tag's button is set on default parameters
  tagList.splice(indexOfTagName,indexOfTagName + 1);    //tag's name is deleted from tagList
}

/* THIS FUNCTION SENDS TO SERVER THE STRING FOR RESULT'S REQUEST */
function sendList(){
  var searchCampString = "";
  var listOfTagString = "";
  var stringToServer = "";

  resetVariableAndDiv();    //it remove all results of the last search
  $('#globalSearchWarning').hide();   //string of input error for #globalSearchForm (empty-string) is hidden
  
  var inputValue = $('#globalSearchForm').val();    //it gets value in #globalSearchForm
  var inputValueSplit = inputValue.split(" ");    //it split inputValue in case of there are multiple string as input or if there are a sequence of blank character

  searchCampString = setStringOfKeys(inputValueSplit);
  listOfTagString = setStringOfKeys(tagList);

  if(searchCampString == ""){   //if there isn't an input string, an error string is displayed and the execution of the function end
    $('#globalSearchWarning').text("inputError.");
    $('#globalSearchWarning').show();
    return;
  }
  /* SERVER ACCEPTS TWO KIND OF REQUEST: 
  1. IF THERE ARE ONLY INPUT STRINGS ---> /keys/key1%20...keyN
  2. IF THERE ARE BOTH INPUT STRINGS AND TAGS ---> /tags/tag1%20...tagN/keys/key1%20...keyN */
  else if (listOfTagString == ""){
    stringToServer = "/keys/" + searchCampString;
  }

  else{
    searchCampString = "/keys/" + searchCampString;
    listOfTagString = "/tags/" + listOfTagString;
    stringToServer = listOfTagString + searchCampString;
  }

  $.getJSON(webserver+stringToServer, function(data){   //the request is sent to server and the function: createResult(tables) is called with results
      createResults(data);
    });
 } 

/* THIS FUNCTION DELETE ALL DIV THAT IS MADE BY LAT SEARCH */
function resetVariableAndDiv(){
  $('#emptyResultWarning').remove();
  $('#sectionResult_header_switchSection_chart').removeClass('active'); 
  $('#sectionResult_body_tab').empty();
  $('#sectionResult_body_content').empty();
  $('#listingColumns_body').empty();
  $('#selectColumnsForChart_body').empty();
  $('#sectionResult_header_filepath').empty();
  $('#globalSearchWarning').empty();
}

/* THIS FUNCTION CONCATENATES ALL ELEMENT IN inputValueSplit AND EACH ONE IS FOLLOWED BY '%20' */
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

/*THIS FUNCTION DELETES THE LAST 3 CHARACTERS IN string*/
function deleteLastThreeCharacters(string){
  return string.substring(0, string.length-3);
}

/* THIS FUNCTION CREATES ALL DIV AND ALL ELEMENT FOR DISPLAY RESULT THAT THE SERVER RETURN */
function createResults(tables){
  dati = tables;    //sets global variable (dati) with server's result
  var keys = Object.keys(tables);   //it gets all keys of result
  
  if(keys.length == 0){   //if there aren't results an error string is made in #sectionResult_body and the execution ends.
    //console.log(keys.length);
    $("<p id=\"emptyResultWarning\"class=\"text-danger\">*No result! Please, retry with other params.</p>").appendTo('#sectionResult_body');
    return;
  }
  /* for each key a series of functions are called for display result */
  $.each(keys, function(index,value){
    var tableName = keys[index];  //keys[index] correspondes to filepath of table
    var dataTable = tableToDataTable(tables[tableName]);  //it makes result for DataTable() from the structure of result that is sent by the server
    
    createResultTab(index, index);    //it  makes a new TAB for the table
    createResultTable(dataTable, index);    //it makes a new TABLE
    createDivChart(dataTable, index);    //it makes a new CHART
    createColumnsSides(dataTable, index);   //it create a list of checkbox with names of column as values
    createSectionColumnsForChart(dataTable, index);   //it create a div for choose elements that will be shown
  });
  /* this part of function hide all div just made and show the first element's divs  */
  $('.myIndexColumn').hide();
  $('.myChart').hide();
  $('.mySectionColumnsForChart').hide();
  
  showDivOfFirstKey();
  $('a[href="#Result"]').tab('show');   //it displays Result's section
}

/* THIS FUNCTION RETURNS A JAVASCRIPT OBJECT WITH FIELDS 'data' AND 'columns' */
function tableToDataTable(dataTable){
  return {data:tableToDataTableBody(dataTable), columns:tableToDataTableHeader(dataTable)};
}

/* THIS FUNCTION RETURNS VARIABLE 'data' OF OBJECT 'dataTable' */
function tableToDataTableBody(dataTable){
  return dataTable.data;
}

/* THIS FUNCTION RETURNS A MAP WITH  ELEMENT (title) OF 'dataTable.header' */
function tableToDataTableHeader(dataTable){
  if(dataTable.header != undefined){    //if there is at least an element in dataTable.header
    return dataTable.header.map(function(columnName){
      return {title:columnName};    //it returns value associated to 'title'
    });
  }
  else{   //if there isn't variable 'header', function makes an error string in #sectionResult_body and ends execution
    $('<h1>No result! Try with other params.</h1>').appendTo('#sectionResult_body');
    return;
  }
}

/* THIS FUNCTION MAKES A NEW TAB IN #sectionResult_body_tab AND A NEW DIV IN #sectionResult_body_content FOR DISPLAY RESULT */
function createResultTab(id, show_id ){
  var hWindow = calcHeightWindow(window);        
  var hNavBar= calcHeightWindow('#navBar');
  var hSectionTab= calcHeightWindow('#sectionTab');
  var hSectionResult_header = calcHeightWindow('#sectionResult_header');

  var hSectionResult_body = hWindow-hNavBar-hSectionTab-hSectionResult_header-158;    //-158 is the fixed heights of the spaces between the div
  /* THE STRUCTURE IS: <li class="class1" id="sectionResult_body_content_li_id">
                        <a href="#sectionResult_body_content_id" data-toggle="tab" id="sectionResult_body_contentid" onclick="switchContent(id)">
                          show_id
                        </a>
                       </li> */
  $("<li class=\"text-center\" id=\"sectionResult_body_content_li_"+ id +"\"><a href=\"#sectionResult_body_content_"+ id +"\" data-toggle=\"tab\" id=\"sectionResult_body_content"+ id +"\" onclick=\"switchContent(id)\">"+ show_id +"</a></li>").appendTo('#sectionResult_body_tab');
  /* THE STRUCTURE IS: <div class="class1" style="overflow:auto; max-height:hSectionResult_bodypx" id="sectionResult_body_content_id"> </div> 
      href of <li> and id of <div> must have the same name!*/
  $("<div class=\"tab-pane fade in\" style=\"overflow:auto; max-height:"+ hSectionResult_body +"px\" id=\"sectionResult_body_content_"+ id +"\"></div>").appendTo('#sectionResult_body_content'); 
}

/* THIS FUNCTION MAKES A DIV IN sectionResult_body_content_id AND MAKES THE TABLE OF RESULT IN IT */
function createResultTable(table, id){
  /* THE STRUCTURE IS: <div id="table_id" class="myTable" style="overflow:auto; height:100%"> </div> */
  $("<div id=\"table_"+id+"\" class=\"myTable\" style=\"overfloaw:auto ; height:100%\"></div>").appendTo('#sectionResult_body_content_'+ id);
  /* THE STRUCTURE IS: <table border="3" class="class1 class2 class3" id="exampleid"> </table> */
  $("<table border=\"3\" class=\"table table-striped table-condensed\" id=\"example"+ id +"\"></table>").appendTo('#table_'+ id);
  $('#example'+ id).dataTable(table);   //table is made with the structure that dataTable() wants in input. This line sends it and the response is put in "exampleid".
  //For more information please read the documentation of dataTable()
}

/* THIS FUNCTION MAKES A DIV FOR THE CHART OF the table in sectionResult_body_content_id*/
function createDivChart(table, id){
  /* THE STRUCTURE IS: <div id="chart_id" class="myChart" style="height:100%; width:100%"> </div> */
  $("<div id=\"chart_"+ id +"\" class=\"myChart\" style=\"height:100% ; width:100%\"></div>").appendTo('#sectionResult_body_content_'+ id);
}

/* THIS FUNCTION MAKES A DIV IN #listingColumns_body AND POPULATES IT WITH THE LIST OF COLUMNS' NAME */
function createColumnsSides(table, id){
  /* THE STRUCTURE IS: <div id="indexColumn_id" class="myIndexColumn" style="margin-left:8px"> </div> */
  $("<div id=\"indexColumn_"+ id +"\" class=\"myIndexColumn\" style=\"margin-left:8px;\"></div>").appendTo('#listingColumns_body');
    
  $.each(table.columns, function(index, value){
    /* THE STRUCTURE IS: <label class="checkbox">
                          <p class="myIndexCheckbox">
                            <input type="checkbox" id="indexColumn_id_columnName_index" onclick="hideShowColumnTable(id)">
                              value.title
                            </input>
                          </p>
                         </label> */
    $("<label class=\"checkbox\"><p class=\"myIndexCheckbox\"><input type=\"checkbox\" id=\"indexColumn_"+ id +"_"+ value.title +"_"+ index +"\" onclick=\"hideShowColumnTable(id)\">"+ value.title +"</input></p></label>").appendTo('#indexColumn_'+ id);
    $('#indexColumn_'+ id +'_'+value.title +"_"+ index).prop('checked', true);    //thi line checks all element in #indexColumn_id
  });
}

/* THIS FUNCTION MAKES A DIV IN #selectColumnsForChart_body AND POPULATES IT WITH 2 INPUT LABEL AND THE RESPECTIVE PARAGRAPH FOR ERRORS OF INPUT */
function createSectionColumnsForChart(table,id){
  var keys = Object.keys(dati);
  var tableName = keys[id];
  var headers = dati[tableName]['header'];
  var stringColumns = dati[tableName]['stringColumns']
  /* THE STRUCTURE IS: <div id="sectionColumnsForChart_id" class="mySectionColumnsForChart"> </div>*/
  $("<div id=\"sectionColumnsForChart_"+ id +"\" class=\"mySectionColumnsForChart\"></div>").appendTo('#selectColumnsForChart_body');
  /* THE STRUCTURE IS: <label for="selectColumnsForChart_body_haxisForm_id;" style="height:5px;"> ... </label> */
  $("<label for=\"selectColumnsForChart_body_haxisForm_"+ id +";\" style=\"height:5px;\">column\'s name</label>").appendTo('#sectionColumnsForChart_'+ id);
  /* THE STRUCTURE IS: <select id="selectColumnsForChart_body_haxisForm_id" class="form.control"> </select> */
  $("<select id=\"selectColumnsForChart_body_haxisForm_"+ id +"\" class=\"form-control\"></select>").appendTo('#sectionColumnsForChart_'+ id);

  $.each(headers, function(index,value){    //it controls for each element if value is a string different from "OK" and "-" and it makes a new option value in #sectionColumnsForChart_body_haxisForm_id
    var dataElement = table['data'][0][index];    //the first row of the table
    var elementNumeric = Number(dataElement);
    if( isNaN(elementNumeric) && dataElement!="OK" && dataElement!="-"){    //elements must be string different from "OK" and "-"
      $("<option>"+ value +"</option>").appendTo('#selectColumnsForChart_body_haxisForm_'+ id);
    }
  });
  /* THE STRUCTURE IS: <label for="selectColumnsForChart_body_columnsForm_id;" style="height:5px;"> ... </label> */
  $("<label for=\"selectColumnsForChart_body_columnsForm_"+ id +";\" style=\"height:5px;\">matchingString</label>").appendTo('#sectionColumnsForChart_'+ id);
  /* THE STRUCTURE IS: <input id="selectColumnsForChart_body_columnsForm_id" class="form-control">
                         <span class="class1 class2 class3 class4" id="selectColumnsForChart_body_columnsForm_Warning_id"> ... </span>
                       </input>*/
  $("<input id=\"selectColumnsForChart_body_columnsForm_"+ id +"\" class=\"form-control\"><span class=\"label label-danger glyphicon glyphicon-remove\" id=\"selectColumnsForChart_body_columnsForm_Warning_"+ id +"\"> inputError.</span></input>").appendTo('#sectionColumnsForChart_'+ id);          
  $('#selectColumnsForChart_body_columnsForm_Warning_'+ id).hide();   //hide the error input's string
  $("#selectColumnsForChart_body_columnsForm_"+ id).val(stringColumns);   //it pastes the current value of variable 'stringolumns' of the table in #selectColumnsForChart_body_columnsForm_id
  /* THE STRUCTURE IS: <p></p>
                       <button id="selectColumnsForChart_body_eneterButtonid" class="class2 class2 class3" type="button" style="float:right;" onclick="sendStringForChart()">
                        Enter
                       </button> */
  $("<p></p><button id=\"selectColumnsForChart_body_enterButton"+ id +"\" class=\"btn btn-primary btn-sm\" type=\"button\" style=\"float:right;\" onclick=\"sendStringsForChart()\">Enter</button>").appendTo('#sectionColumnsForChart_'+ id);
}
/* THIS FUNCTION SHOWS DIVISIONS AND SELECT SECTION OF THE FIRST KEY OF RESULTS */
function showDivOfFirstKey(){
  $('#indexColumn_0').show();
  $('#sectionColumnsForChart_0').show();
  $('#sectionResult_body_content_li_0').addClass('active');  
  $('#sectionResult_body_content_0').addClass('active');
  $('#sectionResult_header_switchSection_table').addClass('active');       
  switchContent("content0");
}

/* THIS FUNCTION HIDE OR SHOW THE COLUMN OF THE TABLE THAT IS (DE)SELECTED IN #listingColumn */
function hideShowColumnTable(id){
  /* THE STRUCTURE OF ID IS: 'indexColumn_indexTable_columnName_indexColumn' */
  var numberOfTable = id.split("_")[1];
  var indexCol = id.substring(id.length-2);
  var index = indexCol.indexOf("_");
  var table = $('#example'+ numberOfTable).DataTable();
  
  if (index > -1){    //it controls if column's index is a double digit. For example, if it isn't a double digit, 'indexCol' is: _1. 
    indexCol = indexCol.split("_")[1];
  }
  
  if( $('#'+ id).prop("checked") ){   //It controls if checkbox of 'id' is checked and in this case the relative column in the table is show
    table.column(indexCol).visible( true );
  }
  else{   //else the column in the table is hide
    table.column(indexCol).visible( false );
  }
  table.columns.adjust().draw();  //changes are applayed in the table

  if( $('.myChart').is(':visible') ){   //if chart is displayed, it is remade
    switchTableChart(id);
  }
}

/* THIS FUNCTION MAKES CHART IN DIV chart_id */
function drawGoogleChart(table, id){
  var keys = Object.keys(dati);
  var tableName = keys[id];
  var hsectionResult_body_tab = calcHeightWindow('#sectionResult_body_tab');
  var hMaxListingTag_body = $('#listingTag_body').css('max-height');

  var columnIndexes = filterColumnsForChart(table, id, dati[tableName]['hAxis'], dati[tableName]['stringColumns']);
  var header = generateHeaderForChart(table, id, columnIndexes);    //filepath of the current result is show in #sectionResult_header_filepath
  var rows = generateRowsForChart(table, id, columnIndexes);    //it sets the rows of server's result to be sent to GoogleChart
  rows = changeRowsFromStringToNumber(rows);    //it changes type of element in rows, from string to numeric
  var googleDataTable = dataTableToGoogleChartDataTable(header, rows, id);    //it concatenates header with rows
  
  var hChart = hMaxListingTag_body.split("px")[0] - hsectionResult_body_tab - 20; //-20 is the fixed space between #hsectionResult_body_tab and the body of results
  var wChart = $('#sectionResult_body_content').width() - 20;   //-20 is the space of the scroll-y lateral bar
  /* in this part of the code there are option elements for draw the chart. For more informations please to reade the GoogleChart's documentation */
  var options = {
    height: hChart,
    width: wChart,
    legend: {
      alignament: "start"
    }
  };
      
  chart = new google.charts.Bar(document.getElementById('chart_'+ id));   //it initializes a new Google.chart.bar object
  chart.draw(googleDataTable, options);   //it draws chart
}

/* THIS FUNCTION CHOOSES HOW ELEMENT OF THE TABLE ARE DISPLAYED IN CHART, 'indexHaxis' and 'substring' orient the choice */
function filterColumnsForChart(table, id, indexHaxis, substring){
  var columnIndexesChecked = [];
  columnIndexesChecked[0] = indexHaxis;   //indexHaxis in put in first position because GoogleChart wants there the index of the element that is choosen for horizontal-Axis 

  $('#indexColumn_'+ id).children().children().children().each( function(index,value){    //we remind you to see the structure of #indexColumn_id, it presents 3 subdivisions (one for each CHILDREN())
    var substringIsInValue = ( (value.id).search(substring)!= -1 );   //it controls if substring is in value's id
    var numericalDataValue = ( Number(table['data'][0][index] ) );    //it changes the type of the element in the first rows of table
    var numericalDataValueIsNan = isNaN(numericalDataValue);    //it controls if values of the current column is a string
    
    if( (value.checked) && (substringIsInValue) && (!numericalDataValueIsNan) ){
      columnIndexesChecked.push(index);
    }
  });
  return columnIndexesChecked;
}

/*THIS FUNCTION SETS THE HEADER OF COLUMNS IN CHART*/
function generateHeaderForChart(table, id, columnIndexes){
  var header = [];
  $.each(columnIndexes, function(index,value){    //for each index in columnIndexes, it gets the value of 'title' in variable columns of table
    header.push(table.columns[value].title);
  });
  return header;
}

/* THIS FUNCTION SETS ROWS FOR CHART */
function generateRowsForChart(table, id, columnIndexes){
  return table.data.map(function(row_data, row_index, row){
    return columnIndexes.map(function(col_index, index, columns){
      return row_data[col_index];
    });
  });
}

/* THIS FUNCTION CHANGES THE TYPE OF ROWS, FROM STRING TO NUMBER */
function changeRowsFromStringToNumber(rows){
  $(rows).each(function(indexRow,value){
    $(value).each(function(indexElement,val){
      if(indexElement != 0){    //the first element od indexElement must be a string
        rows[indexRow][indexElement] = Number(val);
      }
    });       
  });
  return rows;
}

/* THIS FUNCTION MAKES CHART OF CURRENT RESULT */
function dataTableToGoogleChartDataTable(header, rows, id){
  return google.visualization.arrayToDataTable([header].concat(rows));
}

/* THIS FUNCTION HIDE AND SHOW THE ELEMENTS OF RESULT'S SECTION IN BASE OF THE BUTTON THAT IS SELECTED (table/chart)*/
function switchTableChart(id){
  var idSectionActive= $('#sectionResult_body_tab').children('.active').attr('id');   //it controls how result is displayed
  var idForSwitchContent = idSectionActive.split("_")[2]+idSectionActive.split("_")[4];   //
  var buttonName = id.split("_")[3];    //structure of id is: sectionResult_header_switchSection_ButtonName

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

/* THIS FUNCTION HIDE ALL ELEMENTS OF ALL DIVISIONS AND SHOW ELEMENTS OF THE CURRENT TAB THAT IS SELECTED */
function switchContent(id){
  $('#sectionResult_header_filepath').empty();    //string in #sectionResult_header_filepath is removed
  var index = id.split('content')[1];   //'id' has this structure: Content+NumberOfResult

  var keys = Object.keys(dati);
  var tableName = keys[index];
  var dataTable = tableToDataTable(dati[tableName]);

  var hAxis = dati[tableName]['hAxis'];
  var stringColumns = dati[tableName]['stringColumns'];
  
  $('#sectionResult_header_filepath').text(tableName);    //filepath of current result is show in #sectionResult_header_filepath
  $('.myIndexColumn').hide();
  $('.myTable').hide();
  $('.myChart').remove();
  $('.mySectionColumnsForChart').hide();

  if( $('#sectionResult_header_switchSection_chart').is('.active') ){   //if button of chart is selected, the code makes a new chart's div and draw chart
    createDivChart(dataTable, index);
    $(".myIndexCheckbox").show();

    setValueInSelectColumnsForChart(id, dati[tableName].header[hAxis], stringColumns);    //it sets value in #selectColumnsForChart's forms with the current values of 'hAxis' and 'stringColumns'
    filterDivColumnForChart(dati[tableName], index, hAxis, stringColumns);    //it hides the checkbox value of the list in #listingColumns that aren't dispalyed in chart
    drawGoogleChart(dataTable,index);
  }
  else{   //if button of table is selected
    $('#table_'+index).show();
    $('.myIndexCheckbox').show();    
  }
  setValueInSelectColumnsForChart(id, dati[tableName].header[hAxis], stringColumns);    //it sets value in #selectColumnsForChart's forms with the current values of 'hAxis' and 'stringColumns'
  $('#indexColumn_'+ index).show();
  $('#sectionColumnsForChart_'+ index).show();
}

/* THIS FUNCTION SET VALUES IN #selectColumnsForChart WITH CURRENT ELEMENTS OF 'hAxis' AND 'stringColumns' */
function setValueInSelectColumnsForChart(id, hAxisForm,ColumnsForm){
  $('#selectColumnsForChart_body_haxisForm_'+ id).val(hAxisForm);
  $('#selectColumnsForChart_body_columnsForm_'+ id).val(ColumnsForm);  
}

/* THIS FUNCTION HIDES THE CHECKBOX VALUE OF THE LIST IN #listingColumns THAT ARE NOT DISPLAYED IN CHART*/
function filterDivColumnForChart(table, id, indexHaxis, substring){
  var columnIndexesChecked = [];
  var fistRowData =  table['data'][0];
  columnIndexesChecked[0] = indexHaxis;   //the first index must be the index of column that is used to chart's horizontal-axis

  $('#indexColumn_' +id).children().children().children().each( function(index,value){     //we remind you to see the structure of #indexColumn_id, it presents 3 subdivisions (one for each CHILDREN())
    var firstRowDataElementNumeric = Number(fistRowData[index]);    //it changes the type of the element in the first rows of table
    if( ((value.id).search(substring) == -1) || (isNaN(firstRowDataElementNumeric)) ){    //it controls if 'substring' isn't equal to the current element's id or if the rispective element in the first row is a string
      $(value).parent().hide();
    }
  });
}

/* THIS STRUCTURE SETS 'hAxis' AND 'stringColumns' WITH THE CURRENT VALUE IN #selectColumnsForChart_body_haxisForm_id AND #selectColumnsForChart_body_columnsForm_id */
function sendStringsForChart(){
  var idSectionActive= $('#sectionResult_body_tab').children('.active').attr('id');
  var index = idSectionActive.split("_")[4];
  var keys = Object.keys(dati);
  var tableName = keys[index];
  
  setIndexOfHaxisValue(index,tableName);
  setStringOfColumnsChart(index,tableName);
}

/* THIS FUNCTION SETS THE VALUE OF 'hAxis' OF THE CURRENT RESULT */
function setIndexOfHaxisValue(id,filepath){
   var stringHaxis = $('#selectColumnsForChart_body_haxisForm_'+ id).val();
   var headers = dati[filepath]['header'];
   var index = headers.indexOf(stringHaxis);

   dati[filepath]['hAxis'] = index;
}

/* THIS FUNCTION SETS THE VALUE OF 'stringColumns' OF THE CURRENT RESULT */
function setStringOfColumnsChart(id, filepath){
  var stringColumns = $('#selectColumnsForChart_body_columnsForm_'+ id).val();

  $('#selectColumnsForChart_body_columnsForm_Warning_'+ id).hide();   //it hides the div of #selectColumnsForChart_body_columnsForm_Warning_id's input error 

  if( stringColumns != "" ){  //if the form isn't empty the code controls if input string is at least in one of the column's value of the current table
      var matched = false;
      var headers = dati[filepath]['header'];
      var data = dati[filepath]['data'];
      var firstRowData = data[0];
      stringColumns = stringColumns.split(" ")[0];

      $.each(headers, function(index,value){    //for each column of the table, it searches if the value is present and if its respective value in the first row is a number
        var indexMatched = value.search(stringColumns);
        var firstRowDataIndexElement = firstRowData[index];
        var firstRowDataIndexElementNumeric = Number(firstRowDataIndexElement);

        if((indexMatched != -1) && !(isNaN(firstRowDataIndexElementNumeric)) ){
          matched = true;
          return;
        }
      });
      
      if( matched ){    //if stringColumns is present, the functions sets it as 'stringColumns' and draws the chart
        dati[filepath]['stringColumns'] = stringColumns;
        switchTableChart('sectionResult_header_switchSection_chart');
      }
      else{   //else error input's string is show and all elements is hide
        $('#selectColumnsForChart_body_columnsForm_Warning_'+ id).show();
        $('.myIndexColumn').hide();
        $('.myTable').hide();
        $('.myChart').hide();
      }
  }
  else{   //else error input's string is show and all elements is hide
    $('#selectColumnsForChart_body_columnsForm_Warning_'+ id).show();
    $('.myIndexColumn').hide();
    $('.myTable').hide();
    $('.myChart').hide();
  }
setHeightWindows();   //at the end, function recalculates the height of divisions
}

/* THIS FUNCTION HIDES #globalSearchWarning*/
function hideGlobalSearchWarning(){
  $('#globalSearchWarning').hide();
}
