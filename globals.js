/**
 * Used by the methods svy_utl_setRowIdentifierArray, svy_utl_getRowIdentifierName
 *
 * @properties={typeid:35,uuid:"48d9008a-4423-465c-bc97-67784ca98309",variableType:-4}
 */
var svy_utl_arrayRowIdentifiers;

/**
 * @type {String}
 *
 * Used by  svy_utl_open_file
 *
 * @properties={typeid:35,uuid:"b2151e83-e637-40e7-a81e-eb900c4b93bc"}
 */
var svy_utl_temp_file_path = '';

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"63A2501C-F482-4079-A870-2AD5B33B72AE"}
 */
var svy_utl_tempFileLocation = null;

/**
 * Used by svy_utl_writeTempFile, svy_utl_removeTempFiles to keep track of temp files
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"c88d4177-c7ab-4343-adc4-0ed4fa5bcd3a",variableType:-4}
 */
var svy_utl_tempFiles;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"A798F484-9C14-4EAA-BE09-207412D3D4F9"}
 */
var svy_utl_version = '6.0.1.86';

/**
 * @properties={typeid:24,uuid:"54ffe188-4075-468d-a337-f0c3b1a67346"}
 */
function __solutionInfo_svy_utilities() {
	/*
	 Releases:
	 Version 1.0 RC1
	 Main programmer: Paul Bakker
	 Date: April 20th 2007
	 Description: First Release. Taken the existing Utilities module, added a few new functions

	 Todo's for this release:

	 Changes:

	 Improvements:
	 - Added get/setUserProperties
	 - Added save/setSplitPaneDividerPosition
	 - Added getElementType
	 - Added initSplitPane
	 - Added init/saveTableViewPersistance
	 - Added getDateFromWeekYear
	 - Added getWeekNr
	 - Added arraySort

	 Bugfixes:

	 Release Notes:

	 Feature Requests:

	 Known bugs:

	 Todo's:
	 - Try to remove test methods and forms from the module
	 - Test all existing functions
	 - Check WebClient support
	 - Check i18n support
	 - Try basing the two forms (if forms are needed at all) on table svy_dummy
	 - Check all functions for dependancies on tables. If dependancies found: try to remove
	 - Merge functions from svyCoreFunctions
	 */
}

/**
 *	Compares two arrays
 *
 * @author Joas de Haan
 * @since 2007-11-04
 * @param {Array}	_a1
 * @param {Array} _a2
 * @return  {Boolean} true if the arrays are the same, otherwise false
 *
 * @properties={typeid:24,uuid:"640e075f-7559-41c3-b75d-813e031479cc"}
 */
function svy_utl_compareArrays(_a1, _a2) {

	if (_a1 == null && _a2 == null) {
		return true;
	}

	if ( (_a1 == null && _a2 != null) || (_a2 == null && _a1 != null) || (_a1.length != _a2.length)) {
		return false;
	}

	for (var i = 0; i < _a1.length; i++) {
		if (_a1[i] != _a2[i]) {
			return false;
		}
	}

	return true;
}

/**
 *	Concatenate to datasets together
 *
 * @author Joas de Haan
 * @since 2007-11-04
 * @param {JSDataSet} main
 * @param {JSDataSet} add
 * @return {JSDataSet}
 *
 * @properties={typeid:24,uuid:"bd508a5e-5415-427e-91fd-5765b1af4be1"}
 */
function svy_utl_concatenateDataSets(main, add) {
	if (!main || !add) return main;

	if (main.getMaxColumnIndex() != add.getMaxColumnIndex()) {
		return main;
	}

	var row = new Array(main.getMaxColumnIndex());
	for (var i = 1; i <= add.getMaxRowIndex(); i++) {
		for (var j = 1; j <= main.getMaxColumnIndex(); j++) {
			row[j] = add.getValue(i, j);
		}
		main.addRow(row);
	}
	return main
}

/**
 *	Copy's one foundset to an other foundset without loosing the shared foundset.
 *
 * @author Sanneke Aleman
 * @since 2007-11-04
 * @param {String}	_form_from formname form
 * @param {String} _form_to formname to
 * @return  none
 *
 * @properties={typeid:24,uuid:"8e32d302-da73-4cd6-9d40-25f66b69884c"}
 */
function svy_utl_copyFoundset(_form_from, _form_to) {
	var _id = globals['svy_nav_getRowIdentifierValues'](_form_from)

		//1 get SQL + parameters
	var sql_statement = databaseManager.getSQL(forms[_form_from].foundset)
	var _parameters = databaseManager.getSQLParameters(forms[_form_from].foundset)

		//2 load al records
	forms[_form_to].foundset.loadAllRecords();

	//3 load records on to form
	forms[_form_to].foundset.loadRecords(sql_statement, _parameters);

	//4 set selected record.
	forms[_form_to].foundset.selectRecord(_id);

}

/**
 *	Makes a object form a dataset
 *
 * @author Paul Bakker
 * @since 2007-11-04
 * @param {JSDataSet}	_dataset
 * @param {Number} [_keyColumn] Optional, will default to 1 if not specified
 * @param {Number} [_valueColumn] Optional, will default to 2 if not specified
 * @return  {Object}
 *
 * @properties={typeid:24,uuid:"e0158f07-bb19-4f9b-808e-d7389e6d93e4"}
 */
function svy_utl_dataset2ObjectArray(_dataset, _keyColumn, _valueColumn) {
	if (!_dataset) return -1;
	if (_keyColumn == undefined) _keyColumn = 1;
	if (_valueColumn == undefined) _valueColumn = 2;

	var _ObjectArray = new Object();
	for (var i = 1; i <= _dataset.getMaxRowIndex(); i++) {
		_ObjectArray[_dataset.getValue(i, _keyColumn)] = _dataset.getValue(i, _valueColumn);
	}
	return _ObjectArray;
}

/**
 *	Counts days to a date
 *
 * @author Sanneke Aleman
 * @since 2006-11-04
 * @param {Date} _date
 * @param {Number} _numberOfDays  can be negative
 * @return {Date} date + nr of days (attention, time will be set to 0)
 *
 * @properties={typeid:24,uuid:"69a69258-d6bd-40e4-8856-221ef953fb77"}
 */
function svy_utl_datePlusDays(_date, _numberOfDays) {
	var _millisPerDay = 86400000
	if (_date.getHours() + _date.getMinutes() + _date.getSeconds() + _date.getMilliseconds() != 0) {
		_date.setHours(0)
		_date.setMinutes(0)
		_date.setSeconds(0)
		_date.setMilliseconds(0)
	}

	var _millis = _date.valueOf() + _numberOfDays * _millisPerDay + 60 * 60 * 1000 // add 1 hour summertime
	var _returnDate = new Date(_millis)

	_returnDate.setHours(0)
	_returnDate.setMinutes(0)
	_returnDate.setSeconds(0)
	_returnDate.setMilliseconds(0)

	return _returnDate
}

/**
 *	 Set time part to 00:00:00.000
 *
 * @author Sanneke Aleman
 * @since 2006-11-04
 * @param {Date} _dateTime
 * @return  {Date}
 *
 * @properties={typeid:24,uuid:"9abcc8ec-7800-4361-96e9-3a42762efb8c"}
 */
function svy_utl_dateTimeSetDayBegin(_dateTime) {

	if (_dateTime) {
		_dateTime.setHours(0)
		_dateTime.setMinutes(0)
		_dateTime.setSeconds(0)
		_dateTime.setMilliseconds(0)
	}

	return _dateTime
}

/**
 *	  Set time part to 23:59:59.999
 *
 * @author Sanneke Aleman
 * @since 2006-11-04
 * @param {Date} _dateTime
 * @return  {Date}
 *
 * @properties={typeid:24,uuid:"b0fb5c55-01cc-4a2b-822b-98a087c52c23"}
 */
function svy_utl_dateTimeSetDayEnd(_dateTime) {
	if (_dateTime) {
		_dateTime.setHours(23)
		_dateTime.setMinutes(59)
		_dateTime.setSeconds(59)
		_dateTime.setMilliseconds(999)
	}

	return _dateTime
}

/**
 *	  Returns HTML from a dataset with datasetColumnNames as first Column,
 *			   and an additional column for each row.  Basically, a pivot of
 *			   getDatasetAsHTML.
 *
 * @author Sanneke Aleman
 * @since 2006-11-04
 * @param {JSDataSet} _dataset
 * @return  {String} HTML from a dataset
 *
 * @properties={typeid:24,uuid:"3c37c8e5-1213-4990-8fec-222021f31206"}
 */
function svy_utl_getDatasetAsHTMLColumns(_dataset) {
	var _myReturn = "<TABLE BORDER=1 CELLPADDING=1 CELLSPACING=0>"

		//loop through columns
	for (var i = 1; i <= _dataset.getMaxColumnIndex(); i++) {
		_myReturn += "<tr><td><b>" + _dataset.getColumnName(i) + "</b></td>"

		//loop through rows
		for (var j = 1; j <= _dataset.getMaxRowIndex(); j++) {
			_myReturn += "<td>" + _dataset.getValue(j, i) + "</td>"
		}

		_myReturn += "</tr>"
	}

	_myReturn += "</TABLE>"

	return _myReturn;
}

/**
 *	  Returns a data form a day week and year
 *
 * @author Sanneke Aleman
 * @since 2006-11-04
 * @param {Number} _year
 * @param {Number} _week
 * @param {Number} _day
 * @return  {Date} date
 *
 * @properties={typeid:24,uuid:"7dcb4280-1d67-4ca7-b396-ff7ec6987154"}
 */
function svy_utl_getDateFromWeekYear(_year, _week, _day) {
	var _firstYearDay = new Date(_year, 0);
	var _firstDay = _firstYearDay.getDay();

	if (_firstDay > 4) {
		_firstDay -= 7;
	}
	_firstDay--;
	_firstDay--;

	var _date = new Date(_year, 0)
	_date.setDate( (_week - 1) * 7 + _day - _firstDay);

	return _date

}

/**
 *	Returns the type of an element
 *
 * @author Paul Bakker
 * @since 2006-11-04
 * @param {String} _form name of the form
 * @param {String} _element name of the element
 * @return  {String} type of the element
 *
 * @properties={typeid:24,uuid:"c4b6bb98-2dd9-4d52-83b6-f9e4530b6fbe"}
 */
function svy_utl_getElementType(_form, _element) {
	if (!_form || !_element) {
		application.output('utl_getElementType called without mandatory params', LOGGINGLEVEL.ERROR);
		return 'false';
	}
	if (forms[_form].elements[_element].getElementType) {
		return forms[_form].elements[_element].getElementType();
	} else if (forms[_form].elements[_element].getUIClassID) {
		return forms[_form].elements[_element].getUIClassID();
	} else {
		try {
			//	var packageName = stringRep.substring(0,stringRep.indexOf('[',0));
			//	return packageName.substr(packageName.lastIndexOf('.')+1);
		} catch (e) {
			application.output('utl_getElementType: cant determine element type: ' + _form + '.' + _element, LOGGINGLEVEL.ERROR);
			return 'false';
		}
	}
	return 'false'
}

/**
 *	The method trigger form name _only if_ no form is passed otherwise returns the form name passed
 *
 * @author Unknown
 * @since Unknown
 * @param {String} [_FormName] name of the form
 * @param {JSEvent} [_event]
 * @return  {String} _formname name of the form
 *
 * @properties={typeid:24,uuid:"d7609d07-3054-4f23-a11c-df7cac42a6f5"}
 */
function svy_utl_getMethodTriggerFormName(_FormName, _event) {
	if (!forms[_FormName]) {

		_FormName = _event.getFormName();
	}

	return _FormName;
}

/**
 *	The row identifier for the table of vFormName from globals.svy_utl_arrayRowIdentifiers
 *
 * @author Sanneke Aleman
 * @since 2006-11-05
 * @param {String} _FormName name of the form
 * @return  {String} _RowIdentifier
 *
 * @properties={typeid:24,uuid:"adf39cf9-ee3c-4c39-bfed-6a082f2f7a0b"}
 */
function svy_utl_getRowIdentifierName(_FormName) {
	_FormName = globals.svy_utl_getMethodTriggerFormName(_FormName);
	var _RowIdentifier;


	// only execute if form is valid
	if (forms[_FormName]) {

		// get server and table name on form
		
		var _dataSource = forms[_FormName].controller.getDataSource();

		// make sure there's a table assigned to form
		if (_dataSource) {

			var jsTable = databaseManager.getTable(_dataSource)
			_RowIdentifier = jsTable.getRowIdentifierColumnNames()[0]

		} else {

			// no table assigned to form debugger output
			application.output('[svy_utl_getRowIdentifiername] invalid for form:' + _FormName, LOGGINGLEVEL.ERROR);
		}
	}

	return _RowIdentifier;
}

/**
 *	Currently selected row identifier value on form
 *
 * @author Sanneke Aleman
 * @since 2006-11-05
 * @param {String} _FormName name of the form
 * @return  {String} Row Identifier Value
 *
 * @properties={typeid:24,uuid:"df15d957-7cbe-437c-86a6-924527e641ae"}
 */
function svy_utl_getRowIdentifierValue(_FormName) {

	_FormName = globals.svy_utl_getMethodTriggerFormName(_FormName);
	var _RowIdentifier = globals.svy_utl_getRowIdentifierName(_FormName);
	return forms[_FormName][_RowIdentifier];

}

/**
 *	Get a property from the user properties
 *
 * @author Sanneke Aleman
 * @since 2006-11-05
 * @param {String} _propertyName name of the property
 * @return  {Object} value of the property
 *
 * @properties={typeid:24,uuid:"c4097b79-2c5f-4f29-912c-b3f633baed51"}
 */
function svy_utl_getUserProperty(_propertyName) {
	_propertyName = _propertyName.replace(/\s/g,"_");

	if (!_propertyName) {
		application.output('utl_getUserProperty called without mandatory params', LOGGINGLEVEL.ERROR);
		return null;
	}
	return application.getUserProperty(_propertyName) + '';
}

/**
 *	Gives the weeknr of a date
 *
 * @author Vincent Schuurhof
 * @since 2011-04-19
 * @param {Date} date
 * @return {Number} weekNumber
 *
 * @properties={typeid:24,uuid:"35aafabc-f9f0-49ea-962e-ac6b3687d6c3"}
 */
function svy_utl_getWeekNr(date) {
	date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	var day = date.getDay();
	if(day == 0) {
		day = 7;
	}
	date.setDate(date.getDate() + (4 - day));
	
	return 1 + Math.floor((Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 1, -6)) / 86400000)) / 7);
}

/**
 *	Checks if column does exist in table connected to form
 *
 * @author Sanneke Aleman
 * @since 2006-11-05
 * @param {String} _form name of the form
 * @param {String} _column_name  name of the column
 * @return  {Boolean} true if column exist in table
 *
 * @properties={typeid:24,uuid:"f65ee908-6da8-41fd-bffe-8ee50aa94592"}
 */
function svy_utl_hasFormColumn(_form, _column_name) {
	_column_name = _column_name.toLowerCase()

	var _jstable = databaseManager.getTable(forms[_form].controller.getDataSource());
	var _columns = _jstable.getColumnNames()

	for (var i = 0; i < _columns.length; i++) {
		if (_columns[i].toLowerCase() == _column_name) {
			return true;
		}
	}

	return false
}

/**
 *
 * @properties={typeid:24,uuid:"156A98C1-F885-463C-92B0-F77CDE9842D0"}
 */
function svy_utl_initSplitTab(_form, _element, _resizeWeight, _dividerLocation, _dividerSize, _continuousLayout, _bgColor) {
	if (!_form || !_element) {
		return
	}
	/** @type {RuntimeSplitPane} */
	var _splitTab = forms[_form].elements[_element]
	if (_resizeWeight) _splitTab.resizeWeight = _resizeWeight
	if (_dividerLocation) globals.svy_utl_setSplitTabDividerPosition(_form, _element, _dividerLocation)
	if (_dividerSize)_splitTab.dividerSize = _dividerSize
	if (_continuousLayout)_splitTab.continuousLayout = _continuousLayout
	if (_bgColor) _splitTab.bgcolor = _bgColor
}

/**
 *	Checks if email address is valid
 *
 * @author Sanneke Aleman
 * @since 2006-11-05
 * @param {String} _adr emailaddress
 * @return  {Boolean} true if emailaddress is valid
 *
 * @properties={typeid:24,uuid:"d7227a60-29cf-4af2-ab66-5a4a18ef44d6"}
 */
function svy_utl_isEmailAddressValid(_adr) {
	//separate < > if present
	var _re = /^[^<]*</;
	var _result1 = _adr.replace(_re, "");
	_re = />[^>]*$/;
	var _result2 = _result1.replace(_re, "");
	_re = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
	var _found = _result2.match(_re);
	if (_found == null) {
		return false;
	} else {
		return true;
	}
}

/**
 *	Checks if client is java client
 *
 * @author Sanneke Aleman
 * @since 2006-11-05
 * @return  {Boolean} true if java client
 *
 * @properties={typeid:24,uuid:"d3adef68-adf4-447d-9206-ccaea2704b9d"}
 */
function svy_utl_isJavaClient() {
	if (application.getApplicationType() == 5/*WebClient*/ ||
	application.getApplicationType() == 4 /*Headless Client*/) {
		return false;
	}
	return true;
}

/**
 *	Determine if operating system is Mac or Windows
 *
 * @author Sanneke Aleman
 * @since 2006-11-05
 * @return  {Boolean} true=mac, false=windows
 *
 * @properties={typeid:24,uuid:"90c41fe6-70f6-4a68-bf94-0109f3783294"}
 */
function svy_utl_isMacOS() {
	//TODO: is this correct? What about Linux for example?
	if (utils.stringMiddle(application.getOSName(), 1, 7) == "Windows") {
		return false
	} else {
		return true
	}
}

/**
 *	Returns first instance of array index where searchValue is in arrayToSearch
 *
 * @author Sanneke Aleman
 * @since 2006-11-05
 * @param {Array} _Array arrayToSearch
 * @param {Number} _Value number to search for
 * @return  {Number} index, -1 if not in array
 *
 * @properties={typeid:24,uuid:"d8059047-837a-48bb-84ef-0468b732dbbb"}
 */
function svy_utl_isValueInArrayNumber(_Array, _Value) {
	var _Index = -1;

	if (_Array != undefined && _Value != undefined) {

		var _ArrayLength = _Array.length;

		// search array
		for (var i = 0; i < _ArrayLength; i++) {

			var _ArrayCell = _Array[i];

			// does value match array cell
			if (_ArrayCell == _Value) {

				_Index = i;
				break;
			}
		}
	}

	return _Index;
}

/**
 *	Returns first instance of array index where searchValue is in arrayToSearch
 *
 * @author Sanneke Aleman
 * @since 2006-11-05
 * @param {Array} _Array arrayToSearch
 * @param {String} _Value Sring to search for
 * @param {Boolean} _IsCaseSensitive
 * @return  {Number} index, -1 if not in array
 *
 * @properties={typeid:24,uuid:"c3ad8fbd-d1ad-4b25-96a0-760d1b160eb6"}
 */
function svy_utl_isValueInArrayString(_Array, _Value, _IsCaseSensitive) {
	//TODO: Check new Array functions
	var _Index;

	if (_Array != undefined && _Value != undefined) {
		var _ArrayLength = _Array.length;

		// default case sensitivity is false
		if (_IsCaseSensitive != true) {
			_IsCaseSensitive = false;
		}

		// search array
		for (var i = 0; i < _ArrayLength; i++) {
			/** @type {String} */
			var _ArrayCell = _Array[i];

			// check for case sensitivity
			if (!_IsCaseSensitive) {
				_ArrayCell = _ArrayCell.toLowerCase();
				_Value = _Value.toLowerCase();
			}

			// does value match array cell
			if (_ArrayCell == _Value) {
				_Index = i;
				break;
			}
		}
	}

	return _Index;
}

/**
 *	Creates a object from an array
 *
 * @author Paul Bakker
 * @since 2006-11-05
 * @param {Array} JSArray
 * @return  {Object} ObjectArray
 *
 * @properties={typeid:24,uuid:"f59127d5-7aa1-40db-9994-c9b6034605d4"}
 */
function svy_utl_JSArray2ObjectArray(JSArray) {
	if (!JSArray) return null;

	var ObjectArray = new Object();
	for (var i = 0; i < JSArray.length; i++) {
		ObjectArray[JSArray[i]] = '';
	}

	return ObjectArray;
}

/**
 *	Merges sequentialdataset
 *
 * @author Paul Bakker
 * @since 2006-11-05
 * @param {JSDataSet} dataset
 * @param {Number} ident_column
 * @param {Number} concat_column
 * @return  {JSDataSet} dataset
 *
 * @properties={typeid:24,uuid:"45e82d29-37c9-4388-88e0-0ab9d688da48"}
 */
function svy_utl_mergeSequentialDataSet(dataset, ident_column, concat_column) {
	if (!dataset) return null;
	if (dataset.getMaxColumnIndex() < ident_column ||
	dataset.getMaxColumnIndex() < concat_column) return dataset;

	for (var i = 1; i <= dataset.getMaxRowIndex(); i++) {
		while (dataset.getValue(i, ident_column) == dataset.getValue(i + 1, ident_column) &&
		i < dataset.getMaxRowIndex()) {
			dataset.setValue(i, concat_column, dataset.getValue(i, concat_column) + dataset.getValue(i + 1, concat_column));
			dataset.removeRow(i + 1);
		}
	}
	return dataset;
}

/**
 *	Makes a array from a object
 *
 * @author Paul Bakker
 * @since 2006-11-05
 * @param {Object} ObjectArray
 * @return  {Object} JSArray
 *
 * @properties={typeid:24,uuid:"ff264069-247f-488d-81d4-1b39487018e4"}
 */
function svy_utl_objectArray2JSArray(ObjectArray) {
	if (!ObjectArray) return null;

	var JSArray = new Array();
	var count = 0;
	for (var i in ObjectArray) {
		JSArray[count] = i;
		count += 1;
	}

	return JSArray;
}

/**
 * Opens a file from the file system in the OS default way. (.txt with editor, .pdf with pdf reader, .doc with word, etc.)
 *
 * @author Joas de Haan
 * @since 2011-08-11
 * @param {plugins.file.JSFile} _jsFile The file that will be opened
 *
 * @properties={typeid:24,uuid:"FB669EA5-8E36-4E12-81A5-E511B44E8C1B"}
 * @SuppressWarnings(deprecated)
 */
function svy_utl_openFileInOS(_jsFile) {
	var _OS = application.getOSName();
	if (/Windows/.test(_OS)) {
		application.executeProgram('rundll32', 'url.dll,FileProtocolHandler', _jsFile);
	} else if (/Linux|Freebsd/.test(_OS)) {
		application.executeProgram('mozilla', _jsFile);
	} else if (/Mac/.test(_OS)) {
		application.executeProgram('open', _jsFile);
	}
}

/**
 *	Opens a file from database
 *
 * @author Sanneke Aleman
 * @since 2006-11-05
 * @param {String} _name filename
 * @param {String} _file_ext fileextention
 * @param {String} _text  text (you have to give this or 3 blob)
 * @param {Array<byte>} _blob  blob (you have to give this or 2 text)
 * @return  none
 *
 * @properties={typeid:24,uuid:"31a76c4e-b9c7-4595-8bfa-b4696dbd114a"}
 * @SuppressWarnings(unused)
 * @SuppressWarnings(deprecated)
 */
function svy_utl_open_file(_name, _file_ext, _text, _blob) {
	var _tempFilePath
	if (utils.stringPatternCount(_file_ext, '.') < 1) {
		_file_ext = '.' + _file_ext
	}
	if(application.getApplicationType() == APPLICATION_TYPES.WEB_CLIENT)
	{
		plugins.file.writeFile(_name , _blob)
		return
	}
	//open document
	var _tempFile = plugins.file.createTempFile(_name, _file_ext)

	if (_blob == undefined) {
		_tempFilePath = plugins.file.writeTXTFile(_tempFile, _text)
	} else {
		_tempFilePath = plugins.file.writeFile(_tempFile, _blob)
	}

	//save tempfile path in global for saving check
	globals.svy_utl_temp_file_path = _tempFile.getPath()

	
	
	if (utils.stringMiddle(application.getOSName(), 1, 7) == "Windows") {
		application.executeProgram('rundll32', 'url.dll,FileProtocolHandler', _tempFile)
	} else if (utils.stringMiddle(application.getOSName(), 1, 3) == "Mac") {
		application.executeProgram('open', _tempFile);
	}
}

/**
 * Combines query and arguments into 1 string
 *
 * @author Joas de Haan
 * @since 2011-07-11
 * @param {String} _query
 * @param {Array} _args
 * @return {String} _query including arguments
 *
 * @properties={typeid:24,uuid:"8E03B3C9-D178-41A2-94A2-CEE2A129F033"}
 * @SuppressWarnings(wrongparameters)
 */
function sql(_query, _args) {
	if (_args == null) {
		return _query;
	}

	if (_args.length != utils.stringPatternCount(_query, "?")) {
		return "-ERROR- args: " + _args.length + "; query: " + utils.stringPatternCount(_query, "?") + ";";
	}

	var _val;

	for (var i = 0; i < _args.length; i++) {
		switch (typeof _args[i]) {
		case "string":
			_val = "'" + _args[i] + "'";
			break;
		case "object": //date
			_val = "'" + utils.parseDate(_args[i], "yyyy-MM-dd HH:mm:ss:SSS") + "'";
			break;
		default: //number, integer
			_val = _args[i];
		}
		_query = _query.replace(/\?{1}/, _val);
	}
	
	//format the query a little
	_query = _query.replace(/\t+/g, " ").replace(/(FROM|WHERE|AND|OR|GROUP|ORDER)/g, "\n$1").replace(/\n+/g, "\n");

	return _query;
}

/**
 * Combines query and arguments into 1 string
 *
 * @deprecated use globals.sql() instead
 * 
 * @author Joas de Haan
 * @since 2006-11-05
 * @param {String} _query
 * @param {Array} _args
 * @return {String} _query including arguments
 *
 * @properties={typeid:24,uuid:"6ede5bda-9179-41d3-ae1d-264f01f05ec2"}
 */
function svy_utl_queryParser(_query, _args) {
	return sql(_query, _args);
}

/**
 *	 Sets the visibility of all the toolbars at once
 *
 * @author Paul Bakker
 * @since 2007-06-27
 * @param {Boolean} vIsVisible
 * @return none
 *
 * @properties={typeid:24,uuid:"8a5a5830-c8af-4f2d-a6d2-23f713e61512"}
 */
function svy_utl_setAllToolbarsVisibility(vIsVisible) {
	if (vIsVisible == true) {

		// show toolbars
		application.setToolbarVisible('align', true);
		application.setToolbarVisible('design', true);
		application.setToolbarVisible('distribute', true);
		application.setToolbarVisible('draw', true);
		application.setToolbarVisible('edit', true);
		application.setToolbarVisible('text', true);

	} else {

		// hide toolbars
		application.setToolbarVisible('align', false);
		application.setToolbarVisible('design', false);
		application.setToolbarVisible('distribute', false);
		application.setToolbarVisible('draw', false);
		application.setToolbarVisible('edit', false);
		application.setToolbarVisible('text', false);
	}
}

/**
 *	 Creates an array map of the solution's row identifiers
 *		map: serverName.tableName=rowIdentifierColumnName
 *		stored in globals.svy_utl_arrayRowIdentifiers
 * @author Paul Bakker
 * @since 2007-06-27
 *
 * @properties={typeid:24,uuid:"8b045859-6526-497a-8e9b-f87bafdda069"}
 */
function svy_utl_setRowIdentifierArray() {
	globals.svy_utl_arrayRowIdentifiers = new Array;
	var vPrimaryKeyCount = 0;

	// get all servers used with solution
	var vSolutionServerNames = databaseManager.getServerNames();
	var vSolutionServerCount = vSolutionServerNames.length;

	// for each server name
	for (var i = 0; i < vSolutionServerCount; i++) {
		// get server name
		var vServerName = vSolutionServerNames[i];

		// get table names for server
		var vTableNames = databaseManager.getTableNames(vServerName);
		var vTableCount = vTableNames.length;

		// for each table name
		for (var j = 0; j < vTableCount; j++) {
			// get the JS Table
			var vJSTable = databaseManager.getTable(vServerName, vTableNames[j]);

			// get the column names for the JS Table
			var vColumnNames = vJSTable.getColumnNames();
			var vColumnCount = vColumnNames.length;

			// for each column name
			for (var k = 0; k < vColumnCount; k++) {
				// get the JS Column
				var vJSColumn = vJSTable.getColumn(vColumnNames[k]);

				// is the column the row identifier?
				if (vJSColumn.getRowIdentifierType()!= JSColumn.NONE) {
					globals.svy_utl_arrayRowIdentifiers[vSolutionServerNames[i] + '.' + vTableNames[j]] = vColumnNames[k];
					vPrimaryKeyCount = vPrimaryKeyCount + 1;
					break;
				}

			} // end for each column
		} // end for each table
	} // end for each server

}

/**
 *	 Selects a record
 *
 * @author Unknow
 * @since Unknow
 * @param {String} vWhichRecord (next|prev|first|last)
 * @param {String} [vFormName] name of the form
 * @return none
 *
 * @properties={typeid:24,uuid:"c05b3cc9-8b27-4ffb-b749-271eba39002f"}
 */
function svy_utl_setSelectedIndex(vWhichRecord, vFormName) {
	
	vFormName = globals.svy_utl_getMethodTriggerFormName(vFormName);
	
	if (vWhichRecord != undefined) {

		// get current record index
		var vNewIndex = forms[vFormName].controller.getSelectedIndex();

		// get new index of selected record
		switch (vWhichRecord) {
		case 'next':
			vNewIndex = vNewIndex + 1;
			break;

		case 'prev':
			vNewIndex = vNewIndex - 1;
			break;

		case 'first':
			vNewIndex = 1;
			break;

		case 'last':
			vNewIndex = databaseManager.getFoundSetCount(forms[vFormName].foundset)

			break;
		}

		// go to record
		forms[vFormName].foundset.getRecord(vNewIndex)
		forms[vFormName].controller.setSelectedIndex(vNewIndex);

		// get primary key of selected record
		//vRowIdentifierValue = globals.svy_utl_getRowIdentifierValue(vFormName);

	} else {

		application.output('[scCore_setSelectedRecord] invalid index choice:' + vWhichRecord, LOGGINGLEVEL.ERROR);
	}

	//return vRowIdentifierValue;
}

/**
 *	 Goes to first record in foundset on a form
 *
 * @author Unknow
 * @since Unknow
 * @param {String} [vFormName] name of the form
 * @return none
 *
 * @properties={typeid:24,uuid:"11e1cd63-66d9-44aa-bd17-7851ff41aeb0"}
 */
function svy_utl_setSelectedIndexFirst(vFormName) {
	return globals.svy_utl_setSelectedIndex("first", vFormName);
}

/**
 *	 Goes to last record in foundset on a form, the actual last record, not 200
 *
 * @author Unknow
 * @since Unknow
 * @param {String} [vFormName] name of the form
 * @return row identifier for the newly selected record
 *
 * @properties={typeid:24,uuid:"363ff333-c067-495e-9816-4d2852ca2774"}
 */
function svy_utl_setSelectedIndexLast(vFormName) {

	return globals.svy_utl_setSelectedIndex("last", vFormName);
}

/**
 *	 Goes to next record in foundset on a form
 *
 * @author Unknow
 * @since Unknow
 * @param {String} [vFormName] name of the form
 * @return row identifier for the newly selected record
 *
 * @properties={typeid:24,uuid:"3b7e8788-65af-4de2-ad52-4ede18dd5ce2"}
 */
function svy_utl_setSelectedIndexNext(vFormName) {
	return globals.svy_utl_setSelectedIndex("next", vFormName);
}

/**
 *	 Goes to previous record in foundset on a form
 *
 * @author Unknow
 * @since Unknow
 * @param {String} [vFormName] name of the form
 * @return row identifier for the newly selected record
 *
 * @properties={typeid:24,uuid:"321b31ab-c897-4ef2-a9bf-6146b7e80b12"}
 */
function svy_utl_setSelectedIndexPrevious(vFormName) {

	return globals.svy_utl_setSelectedIndex("prev", vFormName);
}

/**
 *	 Sets a user property
 *
 * @author  Paul Bakker
 * @since 2007-11-09
 * @param {String} _propertyName
 * @param {String} _propertyValue
 * @return none
 *
 * @properties={typeid:24,uuid:"d484fcf3-0675-45cc-887d-9ec4412e52e1"}
 */
function svy_utl_setUserProperty(_propertyName, _propertyValue) {
	_propertyName = _propertyName.replace(/\s/g,"_");
	
	if (!_propertyName || (!_propertyValue == null && _propertyValue != 0)) {
		application.output('utl_saveUserProperty called without mandatory params', LOGGINGLEVEL.ERROR);
		return;
	}
	
	application.setUserProperty(_propertyName, _propertyValue);
	
}

/**
 * @param {Array<byte>} _blob
 * @param {String} _name
 * @return {plugins.file.JSFile} path of the file
 * 
 * @properties={typeid:24,uuid:"f932c44e-f280-412e-974f-8f59b1f4c939"}
 */
function svy_utl_writeTempFile(_blob,_name)
{
	var _prefix = _name.replace(/\.\w*$/, "");
 	var _suffix = _name.replace(/^\w*/, "");
	var _tmp_file = plugins.file.createTempFile(_prefix,_suffix)
	plugins.file.writeFile(_tmp_file, _blob,utils.stringReplace(_suffix,'.',''))
	return _tmp_file;
}

/**
 *	This Function gives you the type of a object
 *
 * @author  adBloks
 * @since -
 * @param {Array} oObject
 * @return none
 *
 * @properties={typeid:24,uuid:"6f91ba30-a617-43e4-8c27-378276e0e4e2"}
 */
function svy_utl_getTypeOf(oObject) {
	var sTemp;

	if (oObject == undefined) return 'Undefined';

	try {
		if (oObject.toString) {
			sTemp = (oObject.toString());

			if (sTemp) {
				sTemp = sTemp.split(':')[0];

				if (sTemp && sTemp == 'JSDataSet') return 'JSDataSet';
			}
		}
	} catch (e) {
		/*do nothing*/
	}

	if (oObject instanceof Array) return 'Array';

	//oObject instanceof Date
	if (oObject['__proto__'] == 'Invalid Date') return 'Date';

	/** @type {String} */
	var sType;

	try {
		sType = typeof oObject;
	} catch (e) {
		sType = Object.prototype.toString.apply(this,oObject);
		sType = sType.substring(8, (sType.length - 1));
	}

	//If it is of type 'object' find the class of of object.
	if (sType == "object") {
		sType = Object.prototype.toString.apply(this,oObject)
		sType = sType.substring(8, (sType.length - 1));
	}

	return sType;

}

/**
 *	Return the begin and end position of a form part
 *
 * @author  Sanneke Aleman
 * @since 16-11-2009
 * @param {String} _formname name of the form
 * @param {Number} _part [JSPart.TITLE_HEADER, JSPart.HEADER, JSPart.LEADING_GRAND_SUMMARY, JSPart.LEADING_SUBSUMMARY, JSPart.BODY, JSPart.TRAILING_SUBSUMMARY, JSPart.TRAILING_GRAND_SUMMARY, JSPart.FOOTER, JSPart.TITLE_FOOTER]
 * @return (JSObject) _formpart _formpart.begin with the begin position _formpart.end with the end position
 *
 *
 * @properties={typeid:24,uuid:"D48A4D55-C5F8-4B54-A358-FEF67A1DFAE3"}
 */
function svy_utl_getBeginEndPosFormPart(_formname, _part) {
	var allPartTypes = [JSPart.TITLE_HEADER, JSPart.HEADER, JSPart.LEADING_GRAND_SUMMARY, JSPart.LEADING_SUBSUMMARY, JSPart.BODY, JSPart.TRAILING_SUBSUMMARY, JSPart.TRAILING_GRAND_SUMMARY, JSPart.FOOTER, JSPart.TITLE_FOOTER]
	var _formpart = new Object()
	_formpart.begin = 0
	_formpart.end = 0
	var _formArray = [_formname];

	getFormArray(_formname)

	function getFormArray(_formName) {
		/** @type {JSForm} */
		var JSFORM = solutionModel.getForm(_formName)
		if (JSFORM.extendsForm) {
			_formArray[_formArray.length] = JSFORM.extendsForm.name;
			getFormArray(JSFORM.extendsForm.name);
		}
	}

	for (var i = 0; i < allPartTypes.length; i++) {

		for (var j = 0; j < _formArray.length; j++) {
			var _JSForm = solutionModel.getForm(_formArray[j])
			var JSPART = _JSForm.getPart(allPartTypes[i])
			if (JSPART) {
				if (JSPART.getPartType())
					_formpart.begin = _formpart.end
				_formpart.end += JSPART.height
			}

		}
		if (allPartTypes[i] == _part) {
			return _formpart
		}
	}

	return _formpart

}

/**
 *
 * @properties={typeid:24,uuid:"49DC4B35-8D2C-4580-9726-98863B5BAA4D"}
 */
function svy_utl_saveSplitTabDividerPosition(_form, _element) {
	if (!_form || !_element) {
		application.output('svy_utl_saveSplitTabDividerPosition called without mandatory params', LOGGINGLEVEL.ERROR);
		return;
	}
	var pos = forms[_form].elements[_element].dividerLocation;
	svy_utl_setUserProperty(application.getSolutionName() + '.' + _form + '.' + _element + '.divLoc', pos)
}

/**
 *
 * @properties={typeid:24,uuid:"2928F288-1F0D-4AB2-BDDC-9D28C15C135F"}
 */
function svy_utl_setSplitTabDividerPosition(_form, _element, _pos) {
	if (!_form || !_element) {
		application.output('svy_utl_setSplitTabDividerPosition called without mandatory params', LOGGINGLEVEL.ERROR);
		return;
	}
	var pos = svy_utl_getUserProperty(application.getSolutionName() + '.' + _form + '.' + _element + '.divLoc');
	if (pos) {
		forms[_form].elements[_element]['dividerLocation'] = pos;
	} else if (_pos) {
		forms[_form].elements[_element]['dividerLocation'] = _pos;
	}
}

/**
 * get a record by giving a record id and table name
 * @return {JSRecord} _record
 * @properties={typeid:24,uuid:"806AD13C-5BED-4949-925E-DC73F3DA16D9"}
 */
function svy_utl_getRecord(_id, _table, _database) {
	//check arguments
	if(!_id || !_table) return null
	/** @type {JSFoundset} */
	var _fs = databaseManager.getFoundSet(_database,_table)
	_fs.loadRecords(_id)
	
	//could not select the record
	if(_fs.getSize() != 1) return null
	
	return  _fs.getRecord(1)


}

/**
 * Return the a random generated password
 *
 * @author  Sanneke Aleman / Joas de Haan
 * @since 21-12-2009
 * @param {Number} _length Lenght of the password you want
 * @return {String} a password
 * 
 * @properties={typeid:24,uuid:"41D83473-8F59-45B5-BF32-E58556716434"}
 */
function svy_utl_getPassword(_length) {
	var _symbols = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
	                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
	                '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
	
	var _pw = "";
	var _random_position
	for (var i = 0; i < _length; i++) {
		_random_position = Math.round(Math.random() * (_symbols.length-1));
		_pw = _pw.concat(_symbols[_random_position]);
	}
	
	return _pw;
}

/**
 * @author  Sanneke Aleman
 * @since 23-01-2011
 * @return {Boolean} _isIphoneIpad
 * @properties={typeid:24,uuid:"B4847ECF-FEB0-417E-A43C-EA3A8C9CC30A"}
 */
function svy_utl_OsIsIphoneIpad() {
	if(application.getApplicationType() == APPLICATION_TYPES.WEB_CLIENT)
	{
		/** @type {Packages.org.apache.wicket.protocol.http.request.WebClientInfo} */
		var _clientInfo = Packages.org.apache.wicket.Session.get().getClientInfo()
		var _userAgent = _clientInfo.getUserAgent()
		if(utils.stringPatternCount(_userAgent,'iPhone') || utils.stringPatternCount(_userAgent,'iPad'))
		{
			return true
		}
	}
	//no iphone/ipad
	return false
}

/**
 * Clones a form but also will make clone forms for the tabs on the forms.
 * 
 * @param {String} _newFormname
 * @param {JSForm} _cloneFormObject
 * @author  Sanneke Aleman
 * @since 23-02-2011
 * @properties={typeid:24,uuid:"5552552A-57FC-47CC-86D0-FFEEDAFB85D1"}
 */
function svy_utl_cloneForm(_newFormname, _cloneFormObject) {
	
	solutionModel.cloneForm(_newFormname, _cloneFormObject)
	var _newForm = solutionModel.getForm(_newFormname)
	var _tabpannels = _newForm.getTabPanels()
	for (var i = 0; i < _tabpannels.length; i++) {
		var _tabs = _tabpannels[i].getTabs()
		for (var j = 0; j < _tabs.length; j++) {
			var _form = _tabs[j].containsForm.name + application.getUUID()
			svy_utl_cloneForm(_form, _tabs[j].containsForm)
			_tabs[j].containsForm = solutionModel.getForm(_form)
		}
	}
	return _newFormname
}

/**
 * @properties={typeid:24,uuid:"005C3B3A-EA21-4E9A-8A7E-23B3B3C56C7F"}
 */
function svy_utl_getFormHeight(_form) {

	var _jsForm = solutionModel.getForm(_form);

	//Determine height and original height of the form using it's parts
	var _jsParts = _jsForm.getParts();
	var _org_height = 0;

	var _part_type;
	for (var j = 0; j < _jsParts.length; j++) {
		var _partHeight = _jsParts[j].height + _jsParts[j].getPartYOffset();
		if (_partHeight > _org_height) {
			_org_height = _partHeight;
			_part_type = _jsParts[j].getPartType();

		}
	}
	var _height = forms[_form].controller.getPartHeight(_part_type) + forms[_form].controller.getPartYOffset(_part_type);
	return _height
}

/**
 * @properties={typeid:24,uuid:"4512B9ED-0D72-4763-B59A-46A8C39B0024"}
 */
function svy_utl_getFormWidth(_form) {
	//Determine width and original width of the form
	var _jsForm = solutionModel.getForm(_form);
	return _jsForm.width;
}

/**
 * @properties={typeid:24,uuid:"CE4B2C04-AA28-4BCE-8CA0-E5F2365A9FC5"}
 */
function svy_utl_setButtonsDisabled(_formName) {
	var _elements = forms[_formName].elements.allnames;
	var _element;

	for (var i = 0; i < _elements.length; i++) {
		_element = forms[_formName].elements[_elements[i]]
		if (_element.getElementType() == "LABEL") {
			_element.enabled = false;
		} else if (_element.getElementType() == "TABPANEL") {
			/** @type {RuntimeTabPanel} */
			var _tab = _element
			for (var j = 1; j <= _tab.getMaxTabIndex(); j++) {
				svy_utl_setButtonsDisabled(_tab.getTabFormNameAt(j));
			}
		}
	}
}

/**
 *	Method to set you background color in a table, returns the color of the cell
 *
 * @author Sanneke Aleman
 * @since 2009-11-04
 * @param {Number}	_rowindex
 * @param {Boolean} _isSelected
 * @param {String} _field_type
 * @param {String} _dataproviderid
 * @param {String} _form_name
 * @param {Object} _state
 * @param {Object} _edited
 * @return  {String} color, like #FF0000
 *
 * @properties={typeid:24,uuid:"954f70bd-53af-42ad-a3d8-8ecf0819a3ba"}
 */
function svy_utl_bgCalculation(_rowindex, _isSelected, _field_type, _dataproviderid, _form_name, _state, _edited) {

	if (_isSelected) {
		if (globals.nav && (globals.nav.mode == 'add' || globals.nav.mode == 'edit') && _form_name == globals.nav.form_view_01) {
			return globals.bg_row_edited
		} else if (application.getOSName() == "Mac OS X" && forms[_form_name].controller.view == 3 && (_field_type == "COMBOBOX" || _field_type == "BUTTON")) {
			if (_rowindex % 2 == 0) {
				return globals.bg_row_even
			} else {
				return globals.bg_row_odd
			}
		} else {
			return globals.bg_row_selected
		}
	} else if (_rowindex % 2 == 0) {
		return globals.bg_row_even
	} else {
		return globals.bg_row_odd
	}
}

/**
 * Method to duplicate a record including its related records
 * 
 * @author Vincent Schuurhof
 * @since 2011-06-14
 * @param {JSFoundset} _fs foundset
 * @param {Array} _relatedFsArray all relations for which copies of records should be created
 * 
 * @properties={typeid:24,uuid:"1803F2E5-B6CE-4AAA-9663-C4A5D288304D"}
 */
function svy_utl_duplicateRelatedRecords(_fs, _relatedFsArray) {
	var _dup = _fs.getRecord(_fs.duplicateRecord(false, false));

	for (var k = 0; k < _relatedFsArray.length; k++) {
		
		/** @type {JSFoundset} */
		var _related = _fs[_relatedFsArray[k]];
		for (var i = 1; i <= _related.getSize(); i++) {
			var _relatedOriginal = _related.getRecord(i);
			var _relatedDub = _dup[_relatedFsArray[k]].getRecord(_dup[_relatedFsArray[k]].newRecord(false, false));
			databaseManager.copyMatchingFields(_relatedOriginal, _relatedDub);
		}
	}
}

/**
 * Convert a string according to the application type, i.e. adding html tags if in web client.
 * 
 * @param {String} string the string to convert
 * 
 * @return {String} the converted string
 *
 * @properties={typeid:24,uuid:"AA38B49D-2856-44AA-8A22-ED5B452D73FC"}
 */
function convertString(string)
{
	if(application.getApplicationType() === APPLICATION_TYPES.WEB_CLIENT)
		return svy_utl_formatForHtml(string);
	
	return string;
}

/**
 * @param {String} string
 *
 * @properties={typeid:24,uuid:"27ECE7B6-0A1A-4FD8-9A43-70F9C2837542"}
 */
function svy_utl_formatForHtml(string)
{
	if(string && typeof(string) === 'string')
	{
		var split = string.split('\n');
		if(split.length > 1)
			string = split.join('<br/>');
		
		return '<html>' + string + '</html>';
	}
	
	return null;
}

/**
 * Copy the source foundset's filter to the destination foundset. No check is made on the already existing filters
 * 
 * @param {JSFoundset} from
 * @param {JSFoundset} to
 * @param {Boolean} [reset]
 * 
 * @return {JSFoundset} the destination foundset
 * 
 * @properties={typeid:24,uuid:"902FC216-0F28-4620-B41E-7CDE076B8400"}
 */
function svy_utl_copyFoundSetFilters(from, to, reset)
{
	if(from.getDataSource() !== to.getDataSource())
		throw new Error("Source and destination datasources must be the same");
	
	var filters = from.getFoundSetFilterParams();
	for(var f = 0; f < filters.length; f++)
	{
		if(reset)
			to.removeFoundSetFilterParam(filters[f][4]);
		
		to.addFoundSetFilterParam(filters[f][1], filters[f][2], filters[f][3], filters[f][4]);
	}
	
	return to;
}
