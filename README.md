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
	+ _hAxis:_ represents the index of column that will be used for the horizontal-axis of chart;
	+ _stringColumns:_ represent the string’s value that will be matched with each name of columns and it will be used to group the result for the chart.
+ *node_modules-->* In this folder there are all modules that the application  uses  in its various tasks. For more advice we invite to read documentation of nodeJS.
+ *public/js/ui.js-->* In this file there are all functions (in JavaScript) and libraries that the application uses during execution.
	+ ```google.load('visualization', '1.1', {packages: ['corechart', 'bar']})``` loads the version 1.1 of the Google’s API named ‘visualization’, with ‘corechart’ and ‘bar’ as optional packages.
	

		When HTML page is load, function: ‘setHeightWindows()’ is called and a request for the list of tags , is sent to the server.
		The server responds with the list and for each element is called a function that makes a button  in ‘#ListingTag_body’:

	+ *setHeightWindows()-->* It is used for a dynamic responsive page and it sets the max-height of ’#listingTag_body’, ’#selectedTag_body’ and ’#listingColumns_body’:

	+ *calcHeightWindow(id)-->* It returns the height of ‘id’.
	+ *selectionTag(id)-->* It checks if the name of tag’s button that is selected is in the variable: ‘listingTag’:

		If there isn’t and the value of variable ‘indexOfTagName’ is ‘-1’, the background’s color of the selected button became green, the id is added to ‘listingTag’ and the name of tag is added to the table ’#selectedTag_body_table_body'. Otherwise, the character '/' is added before the id and it is passed to function ‘deleteTag(idBtn)’.

	+ *deleteTag(idBtn)-->* it removes name of tag in table ‘#selectedTag_body_table’ and this name is removed from variable ‘listingTag’ and his button’s background is restored:
	+ *sendiList()-->* This function reads and controls input string in ‘#globalSearchForm’ and sets values that will be sent to the server.
		The function hides the possible input error made in previous search.
		If the result of ‘setStringOfKeys(inputValueSplit)’ is empty, for example because the input string is a sequence of blank space, ‘#gloablSearchWarning’ is show and the function’s execution end.

		>The server accepts two kinds of request: 
		/keys/key1%20…keyN’ or ‘/tags/tag1%20…tagN/keys/key1%20…keyN’. The first when one or more tags are not selected and the second when there are both tags and keys.
		
		The end part of code administrates these cases, it sends the request to the server and calls ‘showTableChart(tables)’ with the response.

	+ *resetVariableAndDiv()-->* It resets all divisions and variables that are used in the last search.
	+ *setStringOfKeys(inputValueSplit)-->* It sets the string that will be sent to the server.

		For all elements in ‘inputValueSplit’, this function controls if it is different from the null character and concatenates them to each other followed by the characters ‘%20’.
		The result will be sent to ‘deleteLastThreeCharacters(string)’.

	+ *deleteLastThreeCharacters(string)-->* It deletes the last three characters in the input string (‘%20’).
	+ *createResults(tables) -->* It makes all divisions and sets all parameters for display results.
	
		It controls if the list of keys in ‘tables’ is empty. If are not element, the function produces an error string in ‘#sectionResult_body’ and the execution is ended. Otherwise, it runs a sequence of functions for each key. It hides elements earlier generated and calls ‘showDivOfFirstKey()’. At the end of the function the Result’s section is show.

	+ *tableToDataTable(dataTable) -->* It returns the object made up results of ‘tableToDataTableBody(dataTable)’ and ‘tableToDataTableHeader(dataTable)’ and it attributes them respectively to variables ‘data’ and ‘columns’.
	+ *tableToDataTableBody(dataTable) -->* It returns the variable ‘data’ of the result send by the server.
	+ *tableToDataTableHeader(dataTable) -->* This function returns the variable ‘header’ send by the server.
	
		It controls if there are elements in ‘header’. If there are, it returns a map of them, else it displays a string of error in ‘#sectionResult_body’

	+ *createResultTab(id, show_id) -->* It makes a new tab in ‘#sectionResult_body_tab’ and a new content in ‘#sectionResult_body_content’.
	+ *createResultTable(table, id) -->* This function makes the table in ‘#sectionResult_body_content_id’.
	
	+ *createResultChart(table, id) -->* It makes the division of chart in  ‘#sectionResult_body_content_id’.
	+ *createColumnsSides(table, id) -->* It makes division in ‘#listingColumns_body’.

		The code makes a checked checkbox for each title in variable ‘columns’ and it puts them in division newly created.
	+ *createSectionColumnsForChart(table,id) -->* This function makes a division in ‘#selectColumnsForChart_body’, where the user can choose how elements are displayed in chart.
	
		It makes a form (#selectColumnsForChart_body_haxisForm_id) with a label, and for each element in ‘columns’, it controls if respective element in the first row is not a number and is different by ‘OK’ and ‘-‘. The name of the elements that satisfy these conditions is put as option in a slide window.
		Then this function makes a paragraph with an error string (selectColumnsForChart_body_columnsForm_Warning_id) and hides it, also make an input forms where the default value of ‘stringColumns’ is put and at the end the function makes a button.

	+ *showDivOfFirstKey()-->* This function displays divisions of the first result’s element (‘#indexColumn’,’#sectionColumnForChart’,’#sectionResult_body_content_li’,’#sectionResult_body_content’, ‘#sectionResult_header_switchSection_table’) and it calls ‘switchContent("content0")’.
	+ *hideShowColumnTable(id) -->* It is called when user selects a column’s name in ‘ListingColumns’. If the respective table is displayed, the function visualizes or hides the respective column. Otherwise, it calls ‘switchTableChart(id)’.
	
	+ *drawGoogleChart(table, id) -->* This function makes chart of result.
	+ *filterColumnsForChart(table, id, indexHaxis, substring) -->* It controls which columns of table will be plot.

		This function controls which checkbox are checked in ‘#indexColumn_id’, if the value of checkbox contains the input string (substring) and if the type of respective element in the first row is Numeric, index is pushed in variable ‘columnIndexChecked’.

	+ *generateHeaderForChart(table, id, columnIndexes) -->* It returns names of columns whose index is contained in ‘columnIndexes’.
	+ *generateRowsForChart(table, id, columnIndexes) -->* It returns, for each row, elements whose index is contained in ‘columnIndexes’.
	
	+ *changeRowsFromStringToNumber(rows) -->* It changes the type of elements in rows from String to Numeric only if the index of the element is not equal to 0.
	+ *dataTableToGoogleChartDataTable(header, rows, id) -->* It concatenates variables ‘header’ and ‘rows’.
	
	+ *switchTableChart(id) -->* It is called when the user wants to pass from table’s view to chart’s view and reverse.
	+ *switchContent(id) -->* It is called when the user switches between the tabs of results.

		The function puts the name of the current key in ‘#sectionResult_header_filepath’ and hides all divisions that are made in ’createResult()’.
		If the division that is displayed is ‘chart’: ‘#chart_index’ and ’#indexCheckbox’ of relative active tab are show and the function calls ‘setValueInSelectColumnsForChart(id, hAxisForm,ColumnsForm)’, ‘filterDivColumnForChart(table, id, indexHaxis, substring)’ and ‘drawGoogleChart(dataTable,Index)’. 
		Else function displays ‘#table_index’ and ‘#indexCheckhbox’.
		At the end, the function ‘setValueInSelectColumnsForChart(id, hAxisForm,ColumnsForm)’ is called, divisions ‘#indexColumns_index’ and ‘#sectionColumnsForChart_index’ are displayed.
	+ *setValueInSelectColumnsForChart(id, hAxisForm,ColumnsForm) -->* This function visualizes  current values of variables ‘hAxis’ and ‘ColumnsString’ in respective forms in ‘#selectColumnsForChart_id’.
	
	+ *filterDivColumnForChart(table, id, indexHaxis, substring) -->* This function controls in which elements of table’s columns the string ‘substring’ is contained and if respective value in the first row is not ‘Number’.
	+ *sendStringsForChart() -->* This function controls input values in ‘#selectColumnForChart_body’ and sets variable ‘hAxis’ a ‘stringColumns’ with these values.
	
	+ *setIndexOfHaxisValue(id,filepath) -->* It sets ‘hAxis’ of the current table with the value in ‘#selectColumnsForChart_body_haxisForm_ id’.
	+ *setStringOfColumnsChart(id, filepath) -->* It controls value in ‘#selectColumnsForChart_body_columnsForm_id’.

		If the input value doesn’t exist, ‘#selectColumnsForChart_body_columnsForm_Warning_id’ is show, else the function controls for each table’s column if the input value is present. 
		If the string is present at least one of columns’ name and the respective value in the first row of the current table is a number, string becomes the value of ‘stringColumns’ and the function calls ‘switchTableChart('sectionResult_header_switchSection_chart')’. Else ‘#selectColumnsForChart_body_columnsForm_Warning_id’ is show.

	+ *hideGlobalSearchWarning()-->* This function hides ‘#globalSearchWarning’.
+ *routes/index.js-->* In this file there is the part of code that initialize the application. This function renders in ‘localhost:3000/’ the structure contained in ‘views/index.jade’.

+ *routes/services.js-->* In this file there are a series of function that respond with static examples of JSON file when the client gets a request to the server.

+ *view/index.jade-->* In this file there is the basic structure of user interface that is set to the client. When the program is initialized, this file is parsed into an HTML file.
