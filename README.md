#HOW TO INSTALL
1.	Download Kale’s folder;
2.	Install nodeJS (We advice you install it to ‘npm’  --> [www.npmjs.com](https://www.npmjs.com))
3.	Start command promp and get to kale’s folder;
4.	Digit ‘npm install’;
5.	Digit ‘npm start’;
6.	Open ‘localhost:3000’ in  browser.


#DOCUMENTATION
Before you start reading this document, we advise the reader to inspect programming languages as JavaScript , jQuery , JSON and basic features of the framework nodeJS , particularly ExpressJS. Also, please read the documentation of the JavaScript’s plug-in: DataTables and Google Chart.

The folder is divided into several sections. Each of which addresses a different aspect of the application.


+ *lib/utils.js -->* In this file there is the module that creates the basic structure on which the application is built. It presents a function that takes as input a file JSON work out by an external application and analyzes the different fields.
The function creates a JavaScript object that represent a group of tables, each of which is denoted by a key (filepath). The object will be sent to client in JSON format.
A group of variables is delivered to a key, as:
	+ _data:_ is composed by arrays that represent the rows of the table;
	+ _header:_ is composed by a map that represent the title of columns;
	+ _headerString:_is composed by headers that have 'String' as values;
	+ _headerNumeri:_is composed by headers that have 'Numeric' as values;
	+ _hAxis:_ represents the index of column that will be used for the horizontal-axis of chart;
	+ _stringColumns:_ represent the string’s value that will be matched with each name of columns and it will be used to group the result for the chart.
	
+ *node_modules -->* In this folder there are all modules that the application  uses  in its various tasks. For more advice we invite to read documentation of nodeJS.

+ *public/js/ui.js -->* In this file there are all functions (in JavaScript) and libraries that the application uses during execution.
	
	+ **_setHeightWindows() -->:_** It is used for a dynamic responsive page and it sets the max-height of ’#listingTag\_body’, ’#selectedTag\_body’ and ’#listingColumns\_body’:

	+ **_calcHeightWindow(id) -->_** It returns the height of ‘id’.
	
	+ **_selectionTag(id) -->_** It checks if the name of tag’s button that is selected is in the variable ‘listingTag’:

	+ **_deleteTag(idBtn) -->_** it removes name of tag in table ‘#selectedTag_body_table’ and this name is removed from variable ‘listingTag’ and his button’s background is restored:
	
	+ **_sendiList() -->_** This function reads and controls input string in ‘#globalSearchForm’ and sets values that will be sent to the server.

	+ **_hideGlobalSearchWarning() -->_** This function hides ‘#globalSearchWarning’.

	+ **_resetVariableAndDiv() -->_** It resets all divisions and variables that are used in the last search.

	+ **_setStringOfKeys(inputValueSplit) -->_** It sets the string that will be sent to the server.

	+ **_deleteLastThreeCharacters(string) -->_** It deletes the last three characters in the input string (‘%20’).
	
	+ **_createResults(tables) -->_** It makes all divisions and sets all parameters for display results.

	+ **_tableToDataTable(dataTable) -->_** It returns the object made up results of ‘tableToDataTableBody(dataTable)’ and ‘tableToDataTableHeader(dataTable)’ and it attributes them respectively to variables ‘data’ and ‘columns’.
	
	+ **_tableToDataTableBody(dataTable) -->_** It returns the variable ‘data’ of the result send by the server.
	
	+ **_tableToDataTableHeader(dataTable) -->_** This function returns the variable ‘header’ send by the server.

	+ **_createResultTab(id, show_id) -->_** It makes a new tab in ‘#sectionResult\_body\_tab’ and a new content in ‘#sectionResult\_body\_content’.
	
	+ **_createResultTable(table, id) -->_** This function makes the table in ‘#sectionResult\_body\_content\_id’.
	
	+ **_createDivChart(table, id) -->_** It makes the division of chart in  ‘#sectionResult\_body\_content_id’.
	
	+ **_createColumnsSides(table, id) -->_** It makes division in ‘#listingColumns_body’.

	+ **_createSectionColumnsForChart(table,id) -->_** This function makes a division in ‘#selectColumnsForChart\_body’, where the user can choose how elements are displayed in chart.

	+ **_hideColumnsFormWarning(id) -->_** This function hides the error input's warning in #sectionColumnsForChart_id
	
	+ **_showDivOfFirstKey() -->_** This function displays divisions of the first result’s element (‘#indexColumn’,’#sectionColumnForChart’,’#sectionResult\_body\_content\_li’,’#sectionResult\_body\_content’, ‘#sectionResult\_header\_switchSection\_table’) and it calls ‘switchContent("content0")’.
	
	+ **_hideShowColumnTable(id) -->_** It is called when user selects a column’s name in ‘ListingColumns’. If the respective table is displayed, the function visualizes or hides the respective column. Otherwise, it calls ‘switchTableChart(id)’.
	
	+ **_drawGoogleChart(table, id) -->_** This function makes chart of result.
	
	+ **_filterColumnsForChart(table, id, indexHaxis, substring) -->_** It controls which columns of table will be plot.

	+ **_generateHeaderForChart(table, id, columnIndexes) -->_** It returns names of columns whose index is contained in ‘columnIndexes’.
	
	+ **_generateRowsForChart(table, id, columnIndexes) -->_** It returns, for each row, elements whose index is contained in ‘columnIndexes’.
	
	+ **_changeRowsFromStringToNumber(rows) -->_** It changes the type of elements in rows from String to Numeric only if the index of the element is not equal to 0.
	
	+ **_dataTableToGoogleChartDataTable(header, rows, id) -->_** It concatenates variables ‘header’ and ‘rows’.
	
	+ **_switchTableChart(id) -->_** It is called when the user wants to pass from table’s view to chart’s view and reverse.
	
	+ **_switchContent(id) -->_** It is called when the user switches between the tabs of results.

	+ **_setValueInSelectColumnsForChart(id, hAxisForm,ColumnsForm) -->_** This function visualizes  current values of variables ‘hAxis’ and ‘ColumnsString’ in respective forms in ‘#selectColumnsForChart\_id’.
	
	+ **_filterDivColumnForChart(table, id, indexHaxis, substring) -->_** This function controls in which elements of table’s columns the string ‘substring’ is contained and if respective value in the first row is not ‘Number’.

	+ **_sendStringsForChart() -->_** This function controls input values in ‘#selectColumnForChart\_body’ and sets variable ‘hAxis’ a ‘stringColumns’ with these values.
	
	+ **_setIndexOfHaxisValue(id,filepath) -->_** It sets ‘hAxis’ of the current table with the value in ‘#selectColumnsForChart\_body\_haxisForm\_id’.

	+ **_setStringOfColumnsChart(id, filepath) -->_** It controls value in ‘#selectColumnsForChart\_body\_columnsForm\_id’.
	
	+ **_showErrorInputColumnsForm(id,filepath) -->_** This function hides all elements of the current result #selectColumnsForChart_body_columnsForm_Warning_id is show and value of 'stringColumns' is set equal to 'null'. 


+ *routes/index.js -->* In this file there is the part of code that initialize the application. This function renders in ‘localhost:3000/’ the structure contained in ‘views/index.jade’.

+ *routes/services.js -->* In this file there are a series of function that respond with static examples of JSON file when the client gets a request to the server.

+ *view/index.jade -->* In this file there is the basic structure of user interface that is set to the client. When the program is initialized, this file is parsed into an HTML file.
