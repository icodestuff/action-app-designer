/*
Entry point for JSON Template Content
*/
'use strict';

module.exports.setup = function setup(scope) {

    let $ = scope.locals.$;
    //--- Setup app data access entry point using application data scope
    var tmpAppDataConfig = require(scope.locals.path.localSecurity + "/couch-config.js");
    scope.locals.$.AppData = require(scope.locals.path.start + "/lib_AppData.js").setup(scope, tmpAppDataConfig);
    scope.locals.$.AppUtils = require(scope.locals.path.start + "/app/_common/AppUtils.js").setup(scope);

    scope.locals.path.content = scope.locals.path.start + "/content"

    return $.async(function processReq(req, res, next) {
        var tmpAppAreaName = req.path || '';
        if (tmpAppAreaName.charAt(0) == '/') {
            tmpAppAreaName = tmpAppAreaName.substr(1);
        }
        console.log( 'req.params', req.params);
        console.log( 'req', req);
        var tmpType = req.params.type || ''
        var tmpName = req.params.name || ''
        var tmpRet = {}
        
        tmpRet.type = tmpType;
        tmpRet.name = tmpName;
        if( tmpName == 'cardsdemo.json'){
            tmpRet = {
                "content": [
                    {
                        "ctl": "fieldrow",
                        "inline": true,
                        "name": "name-row",
                        "items": [
                            {
                                "ctl": "button",
                                "toright": true,
                                "color": "blue",
                                "fluid": true,
                                "size": "large",
                                "onClick": {
                                    "run": "publish",
                                    "event": "blueButton",
                                    "validate": true
                                },
                                "labeled": true,
                                "right": true,
                                "icon": "arrow right",
                                "name": "btn-blue",
                                "text": "Server Gen Blue"
                            },
                            {
                                "ctl": "button",
                                "toright": true,
                                "color": "green",
                                "fluid": true,
                                "size": "large",
                                "onClick": {
                                    "run": "publish",
                                    "event": "greenButton",
                                    "validate": true
                                },
                                "labeled": true,
                                "right": true,
                                "icon": "arrow right",
                                "name": "btn-green",
                                "text": "Server Gen Green"
                            }
                        ]
                    },
                    {
                        "ctl": "cards",
                        "name": "west-cards",
                        "slim": true,
                        "link": true,
                        "content": [
                            {
                                "ctl": "cardfull"
                                ,"classes":"orange raised tall"
                                ,"attr": {
                                    "pageaction": "runTest",
                                    "testname": "matthew-full"
                                }
                                ,"name": "card-matthew-full"
                                ,"header":"Matt Giampietro"
                                ,"imageSrc": "/images/avatar2/large/matthew.png"
                                ,"meta": "<a>Friends</a>"
                                ,"description": "Matthew is an interior designer living in New York."
                                ,"extraText": "<i class=\"user icon\"></i> 75 Friends"
                                ,"extraTextRight": "Joined in 2013"
                            },
                            {
                                "ctl": "card",
                                "name": "card-matthew",
                                "attr": {
                                    "pageaction": "runTest",
                                    "testname": "matthew"
                                },
                                "content": [
                                    {
                                        "ctl": "image",
                                        "src": "/images/avatar2/large/matthew.png"
                                    },
                                    {
                                        "ctl": "content",
                                        "content": [
                                            {
                                                "ctl": "header",
                                                "text": "Matt Giampietro"
                                            },
                                            {
                                                "ctl": "meta",
                                                "text": "<a>Friends</a>"
                                            },
                                            {
                                                "ctl": "description",
                                                "text": "Matthew is an interior designer living in New York."
                                            }
                                        ]
                                    },
                                    {
                                        "ctl": "extra",
                                        "content": [
                                            {
                                                "ctl": "span",
                                                "classes": "right floated",
                                                "text": "Joined in 2013"
                                            },
                                            {
                                                "ctl": "span",
                                                "text": "<i class=\"user icon\"></i> 75 Friends"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "ctl": "card",
                                "attr": {
                                    "pageaction": "runTest",
                                    "testname": "molly"
                                },
                                "content": [
                                    {
                                        "ctl": "image",
                                        "src": "/images/avatar2/large/molly.png"
                                    },
                                    {
                                        "ctl": "content",
                                        "content": [
                                            {
                                                "ctl": "header",
                                                "text": "Molly McMolly"
                                            },
                                            {
                                                "ctl": "meta",
                                                "text": "<a>Other</a>"
                                            },
                                            {
                                                "ctl": "description",
                                                "text": "Molly is a personal assistant living in Paris"
                                            }
                                        ]
                                    },
                                    {
                                        "ctl": "extra",
                                        "content": [
                                            {
                                                "ctl": "span",
                                                "classes": "right floated",
                                                "text": "Joined in 2011"
                                            },
                                            {
                                                "ctl": "span",
                                                "text": "<i class=\"user icon\"></i> 35 Friends"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "ctl": "card",
                                "attr": {
                                    "pageaction": "runTest",
                                    "testname": "elyse"
                                },
                                "content": [
                                    {
                                        "ctl": "image",
                                        "src": "/images/avatar2/large/elyse.png"
                                    },
                                    {
                                        "ctl": "content",
                                        "content": [
                                            {
                                                "ctl": "header",
                                                "text": "Elyse"
                                            },
                                            {
                                                "ctl": "meta",
                                                "text": "<a>Other</a>"
                                            },
                                            {
                                                "ctl": "description",
                                                "text": "Elyse is the boss"
                                            }
                                        ]
                                    },
                                    {
                                        "ctl": "extra",
                                        "content": [
                                            {
                                                "ctl": "span",
                                                "classes": "right floated",
                                                "text": "Joined in 2008"
                                            },
                                            {
                                                "ctl": "span",
                                                "text": "<i class=\"user icon\"></i> 2035 Friends"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
        try {
           res.json(tmpRet)
        } catch (ex) {
            res.json({status:false, error: ex.toString()})
        }
    });

};
