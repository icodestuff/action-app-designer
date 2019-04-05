/*
Entry point for this applications APIs
*/
'use strict';

module.exports.setup = function setup(scope) {

    let $ = scope.locals.$;
    //--- Setup app data access entry point using application data scope
    var tmpAppDataConfig = require(scope.locals.path.localSecurity + "/couch-config.js");
    scope.locals.$.AppData = require(scope.locals.path.start + "/lib_AppData.js").setup(scope, tmpAppDataConfig);
    scope.locals.$.AppUtils = require(scope.locals.path.start + "/api/_common/AppUtils.js").setup(scope);

    return $.async(function processReq(req, res, next) {
        var tmpAppAreaName = req.path || '';
        if (tmpAppAreaName.charAt(0) == '/') {
            tmpAppAreaName = tmpAppAreaName.substr(1);
        }

        try {
            //--- Assure application setup object is laoded one time
            var tmpAppSetup = $.await(scope.locals.$.AppUtils.getAppSetup());
            var tmpAppAreaName = scope.locals.path.start + '/api/' + tmpAppAreaName + '.js';
            var tmpAppReq = require(tmpAppAreaName);

            if (typeof(tmpAppReq.setup) == 'function') {
                var tmpToRun = tmpAppReq.setup(scope);
                tmpToRun(req, res, next);
                return
            } else {
                res.json({status:false, error: "Could not find application area " + tmpAppAreaName})
                return
            }
        } catch (ex) {
            res.json({status:false, error: ex.toString()})
        }
    });

};