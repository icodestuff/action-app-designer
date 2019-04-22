'use strict';
const THIS_MODULE_NAME = 'get-ws-outline';
const THIS_MODULE_TITLE = 'Panel: Get outline from workspace';

module.exports.setup = function setup(scope) {
    var config = scope;
    var $ = config.locals.$;

    function Route() {
        this.name = THIS_MODULE_NAME;
        this.title = THIS_MODULE_TITLE;
    }
    var base = Route.prototype;

    var $ = config.locals.$;

    //--- Load the prototype
    base.run = function (req, res, next) {
        var self = this;
        return new Promise($.async(function (resolve, reject) {
            try {

                var tmpBase = {
                    "ctl": "tbl-ol-node",
                    "type": "workspace",
                    "name": "workspace",
                    "item": "workspace",
                    "details": "Workspace",
                    "meta": "&#160;",
                    "classes": "ws-outline",
                    "level": 3,
                    "icon": "hdd outline",
                    "color": "black",
                    "group": "workspace-outline",
                    "content": []
                }

                var tmpAppsNode = $.await(getApplicationsNode());
                tmpBase.content.push(tmpAppsNode);
                var tmpWSNode = $.await(getWSResourcesNode());
                tmpBase.content.push(tmpWSNode);
                var tmpPagesNode = $.await(getPagesNode());
                tmpBase.content.push(tmpPagesNode);

                var tmpRet = {
                    "options": {
                        padding: false,
                        "css": [
                            ".ws-outline table.outline > tbody > tr[oluse=\"select\"] {",
                            "  cursor: pointer;",
                            "}",
                            ".ws-outline table.outline > tbody > tr[oluse=\"collapsable\"] {",
                            "  cursor: pointer;",
                            "}",
                            ".ws-outline table.outline > tbody > tr > td.tbl-label {",
                            "  width:20px;",
                            "  color:black;",
                            "  background-color: #eeeeee;",
                            "}",
                            ".ws-outline table.outline > tbody > tr.active > td.tbl-label {",
                            "  background-color: #777777;",
                            "  color: white;",
                            "}",
                            ".ws-outline table.outline > tbody > tr > td.tbl-icon {",
                            "  width:40px;",
                            "}",
                            ".ws-outline table.outline > tbody > tr > td.tbl-icon2 {",
                            "  width:80px;",
                            "}",
                            ".ws-outline table.outline > tbody > tr > td.tbl-details {",
                            "  font-weight:bolder;",
                            "  overflow:auto;",
                            "  width:auto;",
                            "}",
                            ".ws-outline table.outline > tbody > tr.active[type=\"page\"] > td.tbl-label {",
                            "  background-color: #21ba45;",
                            "}",
                            ".ws-outline table.outline > tbody > tr.active[type=\"app\"] > td.tbl-label {",
                            "  background-color: #2185d0;",
                            "}",
                            ".ws-outline table.outline > tbody > tr.active[type=\"region\"] > td.tbl-label {",
                            "  background-color: #a333c8;",
                            "}"
                        ]
                    },
                    "content": [tmpBase]

                }

                resolve(tmpRet);

            }
            catch (error) {
                console.log('Err : ' + error);
                reject(error);
            }

        }));
    }


    function getApplicationsNode() {
        var self = this;
        return new Promise($.async(function (resolve, reject) {
            try {


                var tmpBase = {
                    "ctl": "tbl-ol-node",
                    "type": "apps",
                    "name": "apps",
                    "item": "apps",
                    "details": "Applications",
                    "meta": "&#160;",
                    "classes": "ws-editor-outline",
                    "level": 2,
                    "icon": "globe",
                    "color": "black",
                    "group": "ws-resources-outline",
                    "content": []
                }

                var tmpWSDir = scope.locals.path.ws.uiApps;

                var tmpFiles = $.await($.bld.getDirFiles(tmpWSDir))

                for (var index in tmpFiles) {
                    var tmpAppName = tmpFiles[index];
                    var tmpAppBase = tmpWSDir + tmpAppName + '/';
                    var tmpAppDetails = $.await($.bld.getJsonFile(tmpAppBase + 'app-info.json'))
                    var tmpAppTitle = tmpAppDetails.title || "(untitled)";

                    var tmpApp = {
                        "ctl": "tbl-ol-node",
                        "type": "app",
                        "name": tmpAppName + "",
                        "item": "ws-" + tmpAppName + "",
                        "details": tmpAppTitle,
                        "meta": "&#160;",
                        rem_attr: {
                            pageaction: 'showAppConsole',
                            apptitle: tmpAppTitle,
                            appname: tmpAppName
                        },
                        "level": 2,
                        "icon": "globe",
                        "color": "blue",
                        "group": "workspace-outline",
                        content: []
                    }

                    var tmpPagesNode = $.await(getPagesNode(tmpAppName + '/app/pages/'));
                    tmpApp.content.push(tmpPagesNode);

                    tmpBase.content.push(tmpApp);

                }



                resolve(tmpBase);

            }
            catch (error) {
                console.log('Err : ' + error);
                reject(error);
            }

        }));



    }

    function getPagesNode(theBaseDir) {
        var self = this;
        return new Promise($.async(function (resolve, reject) {
            try {


                var tmpTitle = "WS Page"

                var tmpPagesDir = scope.locals.path.ws.pages;
                var tmpAppsDir = scope.locals.path.ws.uiApps;

                if (theBaseDir) {
                    tmpTitle = '.../pages';
                    tmpPagesDir = tmpAppsDir + theBaseDir
                }

            //    console.log('tmpTitle tmpPagesDir', tmpTitle, tmpPagesDir);

                var tmpBase = {
                    "ctl": "tbl-ol-node",
                    "type": "pages",
                    "name": "pages",
                    "item": "pages",
                    "details": tmpTitle,
                    "meta": "&#160;",
                    "classes": "page-editor-outline",
                    "level": 2,
                    "icon": "columns",
                    "color": "black",
                    "group": "pages-outline",
                    "content": []
                }


                var tmpFiles = $.await($.bld.getDirFiles(tmpPagesDir))

                for (var index in tmpFiles) {
                    var tmpPageName = tmpFiles[index];
                    var tmpPageBase = tmpPagesDir + tmpPageName + '/';
                    var tmpPageTitle = tmpPageName;

                    var tmpPage = {
                        "ctl": "tbl-ol-node",
                        "type": "app",
                        "name": tmpPageName + "",
                        "item": tmpPageName + "",
                        "details": tmpPageTitle,
                        "meta": "&#160;",
                        attr: {
                            pageaction: 'showPageConsole',
                            pagename: tmpPageName
                        },
                        "level": 1,
                        "icon": "columns",
                        "color": "green",
                        "group": "pages-outline"
                    }
                    
                    tmpBase.content.push(tmpPage);

                }


                resolve(tmpBase);

            }
            catch (error) {
                console.log('Err : ' + error);
                reject(error);
            }

        }));



    }



    function getWSResourcesNode() {
        var self = this;
        return new Promise($.async(function (resolve, reject) {
            try {


                var tmpBase = {
                    "ctl": "tbl-ol-node",
                    "type": "resources",
                    "name": "resources",
                    "item": "resources",
                    "details": "WS Resources",
                    "meta": "&#160;",
                    "classes": "ws-editor-outline",
                    "level": 3,
                    "icon": "box",
                    "color": "black",
                    "group": "ws-resources-outline",
                    "content": []
                }

                var tmpTypes = [
                    { type: 'Controls', dir: "controls", icon: 'newspaper' },
                    { type: 'Panels', dir: "panels", icon: 'newspaper outline' },
                    { type: 'Template', dir: "tpl", icon: 'object group outline' },
                    { type: 'HTML', dir: "html", icon: 'code' }
                ]

                var tmpCatDir = scope.locals.path.ws.catalog;

                for (var iType = 0; iType < tmpTypes.length; iType++) {
                    var tmpType = tmpTypes[iType];

                    var tmpTypeEntry = {
                        "ctl": "tbl-ol-node",
                        "type": "resource-type",
                        "name": tmpType.type + "",
                        "item": tmpType.type + "",
                        "details": tmpType.type,
                        "meta": "&#160;",
                        "level": 2,
                        "icon": tmpType.icon,
                        "color": "black",
                        "group": "ws-resources-outline",
                        "content": []
                    }

                    var tmpBaseDir = tmpCatDir + 'resources/' + tmpType.dir + '/';
                    var tmpFiles = $.await($.bld.getDirFiles(tmpBaseDir));

                    for (var index in tmpFiles) {
                        var tmpFileName = tmpFiles[index];

                        var tmpEntry = {
                            "ctl": "tbl-ol-node",
                            "type": "resource",
                            "name": tmpFileName + "",
                            "item": tmpFileName + "",
                            "details": tmpFileName,
                            "meta": "&#160;",
                            attr: {
                                pageaction: 'showResourceConsole',
                                restype: tmpType.type,
                                resname: tmpFileName
                            },
                            "level": 1,
                            "icon": tmpType.icon,
                            "color": "purple",
                            "group": "ws-resources-outline"
                        }
                        tmpTypeEntry.content.push(tmpEntry);
                    }
                    tmpBase.content.push(tmpTypeEntry);
                }



                resolve(tmpBase);

            }
            catch (error) {
                console.log('Err : ' + error);
                reject(error);
            }

        }));



    }




    //====== IMPORTANT --- --- --- --- --- --- --- --- --- --- 
    //====== End of Module / setup ==== Nothing new below this
    return $.async(function processReq(req, res, next) {
        try {
            var tmpRoute = new Route();
            var tmpResults = $.await(tmpRoute.run(req, res, next));

            //--- Getting documents to use directly by source, 
            //    .. do not wrap the success flag
            res.json(tmpResults)
        } catch (ex) {
            res.json({ status: false, error: ex.toString() })
        }
    })
};





