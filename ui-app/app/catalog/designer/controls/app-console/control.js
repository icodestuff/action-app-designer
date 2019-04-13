/*
Author: Joseph Francis
License: MIT
*/
(function (ActionAppCore, $) {

	var ControlSpecs = {
		"options": {
			"padding": true
		},
		"content": [
			{
				"ctl": "title",
				"name": "title",
				"size": "large",
				"color": "blue",
				"icon": "globe",
				"text": "Application"
			},
			{
				"ctl": "button",
				"color": "blue",
				pageaction: "openInCode",
				"attr": {
					appname: ""
				},
				text: "Open in VS Code",
				"name": "open-in-vs-code"
			},
			{
				"ctl": "tabs",
				"name": "apptabs",
				"tabs": [
					{
						"label": "Design",
						"name": "apptabs-design",
						"ctl": "tab",
						"content": [
							{
								"ctl": "tabs",
								"name": "apptabs-design-tabs",
								"tabs": [									
									{
										"label": "Pages",
										"name": "apptabs-pages",
										"ctl": "tab",
										"content": [
											
											{
												"ctl": "panel",
												"controlname": "design/ws/get-pages?appname=",
												"name": "pages"
											}
										]
									},
									{
										"label": "Catalog",
										"name": "apptabs-catalog",
										"ctl": "tab",
										"content": [
											{
												"ctl": "pagespot",
												"spotname": "apptabs-catalog",
												"text": "CATALOG GOES HERE"
											}
										]
									}
								]
							}
						]
					},
					{
						"label": "Preview",
						"name": "apptabs-preview",
						"ctl": "tab",
						"content": [
							{
								"ctl": "a",
								"classes": "ui button green",
								"attr": {
									href: "http://localhost:33461/app001",
									target: "app-app001"
								},
								text: "Preview Now",
								"name": "preview-link"
							},							
							{
								"ctl": "button",
								pageaction: "rebuildApp",
								"attr": {
									appname: ""
								},
								text: "Rebuild",
								"name": "rebuild-app"
							}
						]
					},
					{
						"label": "Deploy",
						"name": "apptabs-deploy",
						"ctl": "tab",
						"content": [
							{
								"ctl": "button",
								pageaction: "createAppDeployment",
								"attr": {
									appname: ""
								},
								text: "Build Deployment",
								"name": "build-deploy-app"
							},
							{
								"ctl": "button",
								pageaction: "vscodeDeployment",
								"attr": {
									appname: ""
								},
								text: "Open Deployment in Code",
								"name": "launch-deploy-app"
							}
						]
					},
					{
						"label": "Setup",
						"name": "apptabs-setup",
						"ctl": "tab",
						"content": [
							{
								"ctl": "button",
								"toright": true,
								"color": "blue",
								"size": "large",
								"labeled": true,
								"right": true,
								"icon": "arrow down",
								"onClick": {
									"run": "action",
									"action": "promptAppSetup"
								},
								// pageaction: "promptAppSetup",
								// "attr": {
								// 	appname: ""
								// },
								text: "Edit Setup",
								"name": "edit-app-setup"
							},
							{
								"ctl": "button",
								"size": "large",
								"basic": true,
								"icon": "close",
								hidden: true,
								"onClick": {
									"run": "action",
									"action": "cancelAppSetup"
								},
								// pageaction: "cancelAppSetup",
								// "attr": {
								// 	appname: ""
								// },
								text: "Cancel",
								"name": "cancel-app-setup"
							},
							{
								"ctl": "button",
								"hidden": true,
								"toright": true,
								"color": "green",
								"size": "large",
								"labeled": true,
								"right": true,
								"icon": "save",
								"onClick": {
									"run": "action",
									"action": "saveAppSetup"
								},								
								// pageaction: "saveAppSetup",
								// "attr": {
								// 	appname: ""
								// },
								text: "Save Setup",
								"name": "save-app-setup"
							},
							{
								"ctl": "divider",
								"color": "blue",
								"size": "medium",
								"text": "Welcome",
								"clearing": true
							}
							,
							{
								"ctl": "panel",
								"controlname": "design/ws/panel-app-setup?appname=",
								"name": "setupinfo"
							}
						]
					}
				]
			}
		]
	}

	var ControlCode = {
		// actions: {
		// 	promptAppSetup: promptAppSetup
		// },
		promptAppSetup: promptAppSetup,
		setup: setup,
		refreshPages: refreshPages,
		refreshSetupInfo: refreshSetupInfo,
		getSetupInfo: getSetupInfo,
		cancelAppSetup: cancelAppSetup,
		saveAppSetup: saveAppSetup,
		updateAppSetup: updateAppSetup,
		promptForSetupInfo: promptForSetupInfo
	};

	var ThisControl = { specs: ControlSpecs, options: { proto: ControlCode, parent: ThisApp } };

	function promptAppSetup(theParams, theTarget){
			this.promptForSetupInfo();
			this.setItemDisplay('edit-app-setup', false)
			this.setItemDisplay('save-app-setup', true)
			this.setItemDisplay('cancel-app-setup', true)
	};


	function cancelAppSetup(theParams, theTarget){
			this.setItemDisplay('edit-app-setup', true)
			this.setItemDisplay('save-app-setup', false)
			this.setItemDisplay('cancel-app-setup', false)
			this.parts.setupinfo.refreshUI({readonly:true});
			
	};
	
	function saveAppSetup(theParams, theTarget){
			// var tmpParams = ThisApp.getActionParams(theParams, theTarget, ['appname']);
			var tmpAppName = this.params.appname || '';

			this.setItemDisplay('edit-app-setup', true)
			this.setItemDisplay('save-app-setup', false)
			this.setItemDisplay('cancel-app-setup', false)

			var tmpData = this.getSetupInfo();
			var tmpThis = this;
			this.updateAppSetup(tmpAppName,tmpData).then(function(theReply){
					if( theReply === true ){
						tmpThis.gotoItem("preview-link");
					} else {
							alert("Not Updated, there was a problem", "Did not save", "e")
					}
			})
			
	};
	

	function updateAppSetup(theAppName, theDetails){
			var dfd = jQuery.Deferred();
			
			
		 try {
			var tmpAppName = theAppName;
			if( !(tmpAppName) ){
					throw("No app to open");
			}
			var tmpNewSetupInfo = theDetails;
			if( !(tmpNewSetupInfo) ){
					throw("No details to process");
			}

			console.log( 'tmpThis', tmpThis);
			var tmpThis = this;
			ThisApp.apiCall({
					url: '/design/ws/update-app-setup',
					data: (tmpNewSetupInfo)
			}).then(function(theReply){
				console.log( 'update-app-setup',theReply);
				
					tmpThis.refreshSetupInfo();
					tmpThis.parts.setupinfo.refreshUI({readonly:true});
					tmpThis.publish('update-app-setup', [tmpThis]);
					dfd.resolve(true)
			})
		 } catch (ex) {
				 console.error("Calling app setup update",ex)
				 dfd.resolve(false);
		 }
			
			
			return dfd.promise();
	};
		

	//---- Initial Setup of the control
	function setup(theDetails) {
		var tmpAppName = theDetails.appname || '';
		this.params = this.params || {};
		this.params.appname = tmpAppName;
		var tmpTitle = theDetails.title || heDetails.apptitle || tmpAppName;
		this.controlConfig.index.controls.pages.controlname += tmpAppName
		this.controlConfig.index.controls.setupinfo.controlname += tmpAppName
		var tmpAppTitle = tmpAppName
		if (tmpTitle) {
			tmpAppTitle = '[' + tmpAppName + '] ' + tmpTitle;
		}
		this.controlConfig.index.items.title.text = tmpAppTitle;
		this.controlConfig.index.items["preview-link"].attr = {
			href: "http://localhost:33461/" + tmpAppName,
			target: "app" + tmpAppName
		}
		this.controlConfig.index.items["open-in-vs-code"].attr = {
			appname: tmpAppName
		}
		this.controlConfig.index.items["rebuild-app"].attr = {
			appname: tmpAppName
		}
		this.controlConfig.index.items["edit-app-setup"].attr = {
			appname: tmpAppName
		}
		this.controlConfig.index.items["save-app-setup"].attr = {
			appname: tmpAppName
		}
		this.controlConfig.index.items["cancel-app-setup"].attr = {
			appname: tmpAppName
		}
		
		this.controlConfig.index.items["build-deploy-app"].attr = {
			appname: tmpAppName
		}
		this.controlConfig.index.items["launch-deploy-app"].attr = {
			appname: tmpAppName
		}
		
		 
		

		


	}
	
	function promptForSetupInfo() {
		this.parts.setupinfo.refreshUI({ readonly: false });
		this.gotoItem('setupinfo');
		this.parts.setupinfo.gotoField("appname");
	}

	function refreshPages(){
		this.parts.pages.refreshFromURI();
	}

	function refreshSetupInfo(){
		this.parts.setupinfo.refreshFromURI();
	}
	function getSetupInfo(){
		return this.parts.setupinfo.getData();
	}

	return ThisControl;
})(ActionAppCore, $);

