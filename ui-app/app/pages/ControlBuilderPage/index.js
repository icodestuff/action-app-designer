/*
Author: Joseph Francis
License: MIT
*/
(function (ActionAppCore, $) {

    var SiteMod = ActionAppCore.module("site");

    var thisPageSpecs = {
        pageName: "ControlBuilderPage",
        pageTitle: "Control Builder",
        navOptions: {
            topLink: true,
            sideLink: true
        }
    };

    var pageBaseURL = 'app/pages/' + thisPageSpecs.pageName + '/';


    thisPageSpecs.required = {
        controls: {
            baseURL: pageBaseURL,
            map: {
                "controls/TesterControl": "TesterControl",
                "controls/FormShowFor": "FormShowFor"
            }
        }
    }

    thisPageSpecs.layoutOptions = {
        baseURL: pageBaseURL,
        controls: {
            "north": { partname: "north", control: "north" },
            "center": { partname: "center", control: "center" },
            "east": { partname: "east", control: "east" },
            "west": { partname: "west", control: "west" }
        },
        facetPrefix: thisPageSpecs.pageName,
        north: true,
        south: false,
        west: true,
        east: true
    }

    //--- Customize default layout configuration
    //--- See http://layout.jquery-dev.com/documentation.cfm for details
    thisPageSpecs.layoutConfig = {
        west__size: "20%"
        , east__size: "40%"
    }


    //--- Start with a ase SitePage component
    var ThisPage = new SiteMod.SitePage(thisPageSpecs);

    // .. they happen in this order

    //=== On Application Load ===
    /*
    * This happens when the page is loaded, try to push activity back to when the tab is used
    *    If your component need to do stuff to be availale in the background, do it here
    */
    var actions = ThisPage.pageActions;
    ThisPage._onPreInit = function (theApp) {
        ThisPage._om = theApp.om;

    }
    ThisPage._onInit = function () {

    }

    //=== On Page Activation ===
    /*
    * This happens the first time the page is activated and happens only one time
    *    Do the lazy loaded stuff in the initial activation, then do any checks needed when page is active
    *    Do stuff that needs to be available from this component, such as services, 
    *     that are needed even if the page was not activated yet
    */
    ThisPage._onFirstActivate = function (theApp) {
        //--- This tells the page to layout the page, load templates and controls, et
        ThisPage.initOnFirstLoad().then(
            function () {
                //--- Now your done - READY to do stuff the first time on your page

                loadControlsIndex();

                ThisPage.selectedFieldName = '';
                activeControlName = ThisPage.ns("demo-preview");

                ThisPage.frmPreview$ = ThisPage.spot$('preview-area')
                ThisPage.frmPreview$.on('change', frmPreviewChange)
                ThisPage.frmPreview$.get(0).addEventListener('focus', frmPreviewFocusChange, true)

                //--- ToDo: Use normal field - dropdown - add setFieldList option

                // ThisPage.fieldSelectEl = ThisPage.getByAttr$({ appuse: "field-selection" });
                // ThisPage.fieldSelect = ThisPage.fieldSelectEl.dropdown({
                //     showOnFocus: false,
                //     placeholder: "Select a field",
                //     onChange: function (theValue, theText) {
                //         if (theValue) {
                //             ThisPage.selectedFieldName = theValue || '';
                //         }
                //     },
                //     values: []
                // })
                //     ;

                ThisPage.detailsEditorEl = ThisPage.getSpot$('details-editor')
                console.log('ThisPage.detailsEditorEl', ThisPage.detailsEditorEl);

                ThisPage.detailsEditor = ace.edit(ThisPage.detailsEditorEl.get(0));
                ThisPage.detailsEditor.setTheme("ace/theme/vibrant_ink");
                ThisPage.detailsEditor.setFontSize(16);
                ThisPage.detailsEditor.session.setMode("ace/mode/json");
                ThisPage.detailsEditor.session.setTabSize(2);

                ThisPage.detailsEditor.session.selection.on('changeSelection', detailsEditorSelectionChange);

                ThisPage.detailsEditor.setValue(ThisApp.json({
                    "Controls": [
                        "Loaded Dynamically",
                        "Stored in forms directory",
                        "Create more than one"
                    ]
                }))

                loadAndShow('default');
                //--- Do special stuff on page load here
                //--- Then optionally call the stuff that will happen every time 
                //      the page is activated if not already called by above code
                ThisPage._onActivate();

            }
        );
    }

    ThisPage._onActivate = function () {
        //-- Do refresh / checks here to update when page is activated

    }

    //--- Layout related lifecycle hooks
    ThisPage._onResizeLayout = function (thePane, theElement, theState, theOptions, theName) {


        if (thePane == 'center') {
            var tmpH = ThisPage.layout.panes.center.height()

            if (ThisPage.detailsEditorEl && ThisPage.detailsEditor) {
                ThisPage.detailsEditorEl
                    .css('height', '' + tmpH + 'px')
                    .css('position', 'relative')
                ThisPage.detailsEditor.resize(true);
            }

        } else if (thePane == 'east') {
            if (layoutResponsive) {
                var tmpEast = ThisPage.spot$('preview-area');
                var tmpWidth = tmpEast.width();
                if (tmpWidth < 450) {
                    tmpEast.addClass('mobile');
                } else {
                    tmpEast.removeClass('mobile');
                }
            }
        }
    }

    //--- End lifecycle hooks




    //=== Page Setup
    var index = {}
        , layoutResponsive = true
        , activeControlName = ''
        , activeControl = false;

    //=== Page Setup
    var index = {}
        , layoutResponsive = true
        , activeControlName = ''
        , activeControl = false;

    //=== Page 


    function detailsEditorSelectionChange(theEvent) {
        //console.log( 'detailsEditorSelectionChange', theEvent);
        var tmpSelected = ThisPage.detailsEditor.getSelectedText();
        if (tmpSelected) {
            var tmpLen = tmpSelected.length;

            if (tmpLen > 3 && tmpLen < 200) {
                // console.log( 'tmpLen', tmpLen);
                var tmpItems = tmpSelected.split(':');
                if (tmpItems.length == 2) {
                    tmpSelected = tmpSelected.replace(',', '');
                    try {
                        tmpSelected = ThisApp.json('{' + tmpSelected + '}');
                        // console.log( 'tmpSelected', tmpSelected);
                        if (tmpSelected.ctl) {
                            var tmpCtl = ThisApp.controls.catalog.get(tmpSelected.ctl);
                            // console.log( 'tmpCtl', tmpCtl);
                            if (tmpCtl && tmpCtl.getInfo) {
                                var tmpControlInfo = tmpCtl.getInfo(tmpSelected.ctl);
                                console.log('tmpControlInfo', tmpControlInfo);
                            }
                        }
                    } catch (ex) {
                        //---- not a valid selection
                    }
                }
            }
        }

    }

    ThisPage.loadThisControl = loadThisControl;
    function loadThisControl(theAction, theTarget) {
        var tmpEl = false;
        var tmpName = '';
        if (theTarget) {
            tmpEl = $(theTarget)
            tmpName = tmpEl.attr('name') || '';
        }
        if (!tmpName) {
            alert("No name found")
            return;
        }
        loadAndShow(tmpName)

    };

    ThisPage.loadControlsIndex = loadControlsIndex;
    function loadControlsIndex() {
        showLoading('control-list');
        //--- Clear cached pages
        index = {};

        getControlObject('_index').then(function (theDoc) {
            if (!(theDoc && theDoc.index)) {
                alert("No index found");
            }
            var tmpHTML = [];


            var tmpIndex = theDoc.index;
            tmpHTML.push('<div controls item class=" ui vertical menu slim fluid">')
            for (var aName in tmpIndex) {
                var tmpEntry = tmpIndex[aName];
                if (aName && tmpEntry) {
                    //var tmpTempl = '<div class="ui fluid button" name="THENAME" action="' + ThisPage.ns('loadThisControl') + '">THELABEL</div>';
                    var tmpTempl = '<a name="THENAME" action="' + ThisPage.ns('loadThisControl') + '" controls item class="blue item">THELABEL <i controls item class=" ui icon arrow right blue"></i></a>'
                    tmpTempl = tmpTempl.replace('THENAME', aName).replace('THELABEL', tmpEntry.title || aName)
                    tmpHTML.push(tmpTempl);
                }
            }
            tmpHTML.push('</div>')

            ThisPage.loadPageSpot('control-list', tmpHTML.join(''));

            ThisPage.toTab('control-panel-tabs', 'control-list');


        })
    }
    function getControlObject(theObjectName) {
        var dfd = jQuery.Deferred();
        var tmpObjectName = theObjectName || '';
        if (!tmpObjectName) {
            dfd.resolve(false);
        } else {
            if ((tmpObjectName.indexOf('.') == -1)) {
                tmpObjectName += '.json';
            }
            var tmpDocsList = [tmpObjectName];
            var tmpLocation = ThisApp.common.index.res.panels;
            ThisApp.om.getObjects('[get]:' + tmpLocation, tmpDocsList).then(function (theDocs) {
                var tmpDoc = theDocs[tmpObjectName];
                if (!(tmpDoc)) {
                    alert("No Index found, check controls library for an _index.json");
                    dfd.resolve(false)
                } else {
                    delete (tmpDoc._key);
                    dfd.resolve(tmpDoc);
                }
            });

        }

        return dfd.promise();


    }

    function showLoading(thePageSpot) {
        ThisApp.loadSpot(ThisPage.ns(thePageSpot), '', 'app:page-loading-spinner');
    }
    function loadAndShow(theControlName) {
        if (index[theControlName]) {
            showControl(theControlName, index[theControlName]);
            return;
        }
        var tmpDocsList = [theControlName + '.json'];
        var tmpLocation = ThisApp.common.index.res.panels;
        ThisApp.om.getObjects('[get]:' + tmpLocation, tmpDocsList).then(function (theDocs) {
            var tmpControlDoc = theDocs[theControlName + ".json"];
            if (!(tmpControlDoc)) {
                alert("No Control found: " + theControlName);
            } else {
                index[theControlName] = ThisApp.controls.newControl(tmpControlDoc, { parent: ThisPage });

                showControl(theControlName, index[theControlName]);
            }
        });
    };

    function showControl(theControlName, theControlObj) {
        ThisPage.loadedControlSpec = index[theControlName];

        ThisPage.loadPageSpot('title-bar', theControlName);

        if (activeControl) {
            delete (activeControl)
        }
        //-- ToDo: If active control, destroy it
        activeControl = ThisPage.loadedControlSpec.create(activeControlName);
        activeControl.subscribe('ctl-event', onControlEvent)

        function onControlEvent(theEvent, theControl, theParams, theTarget, theOriginalEvent) {
            console.log("'ctl-event' received in app.  Control is", theControl);
            console.log('arguments', arguments);
            showDetailsJson(theControl.getData())
        }
        activeControl.loadToElement(ThisPage.spot$('preview-area'))

        //--- allow console access for testing
        window.activeControl = activeControl;

        loadFieldList()

        delete (theControlObj.controlConfig._key)
        //--- ,True on json call converts to stringable object
        ThisPage.detailsEditor.setValue(ThisApp.json(theControlObj.controlConfig, true));
        ThisPage.detailsEditor.clearSelection();
    }

    ThisPage.showControlDetails = showControlDetails;
    function showControlDetails() {
        var tmpDetails = activeControl.getControlDetails()
        ThisPage.detailsEditor.setValue(ThisApp.json(tmpDetails.data));
        ThisPage.detailsEditor.clearSelection();
        console.log("Full Details", tmpDetails)
    };


    function showDetailsJson(theObject) {
        ThisPage.detailsEditor.setValue(ThisApp.json(theObject, true));
        ThisPage.detailsEditor.clearSelection();
    }

    ThisPage.showControlSpecConfig = showControlSpecConfig;
    function showControlSpecConfig() {
        showDetailsJson(ThisPage.loadedControlSpec.controlConfig);
    };

    function getTarget(theEvent) {
        var tmpEl = theEvent.target || theEvent.currentTarget || theEvent.delegetTarget || false;
        if (tmpEl) {
            tmpEl = $(tmpEl);
            var tmpName = tmpEl.attr('name');
            if (!(tmpName)) { return false; };
            return { name: tmpName, el: tmpEl };
        }
        return false;
    }

    function frmPreviewFocusChange(theEvent) {
        if (theEvent && theEvent.target) {
            var tmpTarget = $(theEvent.target);
            var tmpFN = tmpTarget.attr('name');
            setSelectedField(tmpFN);
        }
    }
    function frmPreviewChange(theEvent) {
        var tmpTarget = getTarget(theEvent);
        var tmpFN = tmpTarget.name;
        setSelectedField(tmpFN);
    };

    ThisPage.fieldToggleDisplay = fieldToggleDisplay;
    function fieldToggleDisplay() {
        var tmpFN = getSelectedField();
        if (!tmpFN) {
            return alert("Select a field");
        }
        var tmpIsVis = activeControl.getFieldDisplay(tmpFN);
        activeControl.setFieldDisplay(tmpFN, !tmpIsVis)
    };

    ThisPage.fieldSetValue = fieldSetValue;
    function fieldSetValue() {
        var tmpFN = getSelectedField() || '';
        ThisPage.fieldSelect.focus();
        if (!tmpFN) { return alert("Select a field to set first") }

        var tmpDefault = activeControl.getFieldValue(tmpFN);

        ThisApp.input("Enter a new value", "New Value", "Set field value", tmpDefault).then(function (theValue) {
            if (!(theValue)) { return };
            activeControl.setFieldValue(tmpFN, theValue);

        })

    };

    ThisPage.fieldShowSpecs = fieldShowSpecs;
    function fieldShowSpecs() {
        var tmpFN = getSelectedField() || '';
        if (!tmpFN) { return alert("Select a Field") }
        var tmpSpecs = activeControl.getFieldSpecs(tmpFN);
        var tmpCtlName = tmpSpecs.ctl || 'field';

        var tmpCtl = ThisApp.controls.webControls.get(tmpCtlName);
        console.log('tmpCtl', tmpCtl);
        if (tmpCtl && tmpCtl.getInfo) {
            var tmpInfo = tmpCtl.getInfo(tmpCtlName);
            console.log('tmpInfo', tmpInfo);
        } else {
            alert("Not found " + tmpCtlName)
        }

        tmpSpecs.controlDetails = tmpInfo;

        showDetailsJson(tmpSpecs);
    };

    ThisPage.fieldGoto = fieldGoto;
    function fieldGoto() {
        var tmpFN = getSelectedField() || '';
        if (!tmpFN) { return alert("Select a Field") }
        activeControl.gotoField(tmpFN);
    };

    function setSelectedField(theFieldName) {
        //--- ToDo: Field List        
        // ThisPage.fieldSelectEl.dropdown('set exactly', [theFieldName]);
    }
    function getSelectedField() {
        return '';
        //--- ToDo: Field List        
        // var tmpVal = ThisPage.fieldSelectEl.dropdown('get value');
        // return tmpVal
    }

    ThisPage.loadFieldList = loadFieldList;
    function loadFieldList() {
        var tmpConfig = activeControl.getConfig();
        if (!tmpConfig && tmpConfig.index && tmpConfig.index.fields) {
            return alert("No tmpField found in form config index")
        }
        var tmpFieldList = [];
        var tmpFields = tmpConfig.index.fields;
        for (var aField in tmpFields) {
            var tmpField = tmpFields[aField];
            tmpFieldList.push({
                name: tmpField.label || aField,
                value: aField
            });
        }

        //--- ToDo: Make this normal option        
        //ThisPage.fieldSelect.dropdown('change values', tmpFieldList)
        ThisPage.selectedFieldName = '';
    };


    ThisPage.showFieldInfo = showFieldInfo;
    function showFieldInfo(theFieldName) {
        var tmpFN = theFieldName || '';
        if (!tmpFN) {
            return alert("No field name")
        }
        var tmpConfig = activeControl.getConfig();
        if (!tmpConfig && tmpConfig.index && tmpConfig.index.fields) {
            return alert("No tmpField found in form config index")
        }
        var tmpFields = tmpConfig.index.fields;
        var tmpFieldInfo = tmpFields[tmpFN];
        if (!tmpFieldInfo) {
            return alert("No field details")
        }

        showDetailsJson(tmpFieldInfo);

    };

    ThisPage.toggleTitle = toggleTitle;
    function toggleTitle() {

        var tmpIsVis = activeControl.getItemDisplay('title');
        activeControl.setItemDisplay('title', !tmpIsVis)

        tmpIsVis = activeControl.getItemDisplay('options-row');
        activeControl.setItemDisplay('options-row', !tmpIsVis)

        var tmpTopicAvail = activeControl.getFieldDisplay('topic');
        console.log('Is the topic field available on the form?', tmpTopicAvail);
        var tmpTopicVis = activeControl.getFieldVisibility('topic');
        console.log('Can you see the topic?', tmpTopicVis);

    };

    ThisPage.validateActiveControl = validateActiveControl;
    function validateActiveControl() {
        var tmpValidation = activeControl.validate();
        if (!tmpValidation.isValid) {
            //Message shows automatically
            //alert("Not valid, see form for deatils", "Did not pass validation", "i");
        } else {
            alert("Your good", "Passed Validation", "c")
        }
    };



    ThisPage.refreshControlDisplay = refreshControlDisplay;
    function refreshControlDisplay() {
        var tmpObject = ThisPage.detailsEditor.getValue();
        tmpObject = ThisApp.json(tmpObject);
        var tmpName = "_onTheFly";
        if (index[tmpName]) {
            delete index[tmpName];
        }
        index[tmpName] = ThisApp.controls.newControl(tmpObject, { parent: ThisPage });
        showControl(tmpName, index[tmpName])
    };

    ThisPage.runTest = runTest;
    function runTest() {
        alert("Run Test Works!");
    }
    function converToJsonLiveDemo() {
        if (!activeControl) {
            return;
        }
        var tmpFunc = function (theDemo, theTest) {
            console.log('theDemo', theDemo);
            console.log('theTest', theTest);
        }
        var tmpToSave = {
            name: "Test1",
            testFunction: tmpFunc
        }
        var tmpAsStringable = ThisApp.util.convertToJsonLive(tmpToSave);
        console.log('tmpAsStringable', tmpAsStringable);
        var tmpAsString = JSON.stringify(tmpAsStringable);

        console.log('tmpAsString', tmpAsString);

        var tmpFromString = ThisApp.util.convertFromJsonLive(tmpAsString);
        console.log('tmpFromString', tmpFromString);
        tmpFromString.testFunction('one', 'two');


    };

    ThisPage.runTest2 = runTest2;
    function runTest2() {
        if (!activeControl) {
            return;
        }

        activeControl.setFieldMessage("first", '<i class=" loading circle notch icon"></i>&nbsp;Loading ...', { "color": "blue" })

        ThisApp.delay(2000).then(function () {
            activeControl.setFieldMessage("first", "")
        })
        ThisPage.toggleThisField({ fieldname: 'first' });
    };

    ThisPage.promptActiveControl = promptActiveControl;
    function promptActiveControl() {
        ThisPage.loadedControlSpec.prompt().then(function (theReply, theControl) {
            if (theControl) {
                var tmpData = theControl.getData();
                showDetailsJson(tmpData);
                ThisApp.delay(5000).then(function () {
                    showControlSpecConfig();
                })
            }
        })
    };

    ThisPage.toggleThisField = toggleThisField;
    function toggleThisField(theParams, theTarget) {
        var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['fieldname']);
        var tmpFN = tmpParams.fieldname || tmpParams.default || '';
        if (tmpFN) {
            var tmpIsVis = activeControl.getFieldDisplay(tmpFN);
            activeControl.setFieldDisplay(tmpFN, !tmpIsVis);

        }
    };

    ThisPage.showControlInfo = showControlInfo;
    function showControlInfo(theParams, theTarget) {
        var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['controlname'])
        var tmpName = tmpParams.controlname || 'title';
        console.log('tmpName', tmpName);
        var tmpCtl = ThisApp.controls.webControls.get(tmpName);
        console.log('tmpCtl', tmpCtl);
        if (tmpCtl && tmpCtl.getInfo) {
            var tmpInfo = tmpCtl.getInfo(tmpName);
            console.log('tmpInfo', tmpInfo);
        } else {
            alert("Not found " + tmpName)
        }


    };

})(ActionAppCore, $);