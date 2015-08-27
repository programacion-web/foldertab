/*
 * ***** ABOUT BLOCK *****
 *
 * Raul Espinosa
 *
 * raul@ninja-code.de
 *
 * It is block is developer for panel folder tools like to firefox plugin.
 * ***** END ABOUT BLOCK *****
 */
com_zimbra_folderana_HandlerObject = function() {};
com_zimbra_folderana_HandlerObject.prototype = new ZmZimletBase;
com_zimbra_folderana_HandlerObject.prototype.constructor =
	com_zimbra_folderana_HandlerObject;

/**
 * Double clicked.
 */
com_zimbra_folderana_HandlerObject.prototype.doubleClicked =
	function() {
		this.singleClicked();
	};

/**
 * Single clicked.
 */
com_zimbra_folderana_HandlerObject.prototype.singleClicked =
	function() {
		this._setFolderBtnListener();
	};

/**
 * Get all folders
 */
com_zimbra_folderana_HandlerObject.prototype._setFolderBtnListener =
	function() {
		if (!this._chooseFolderDialog) {
			AjxDispatcher.require("Extras");
			this._chooseFolderDialog = new ZmChooseFolderDialog(appCtxt.getShell());
		}
		this._chooseFolderDialog.reset();
		this._chooseFolderDialog.registerCallback(DwtDialog.OK_BUTTON, this._chooseFolderOkBtnListener,
			this, this._chooseFolderDialog);
		// This doesn't show trash and spam folder
		var omitParam = {};
		omitParam[ZmFolder.ID_TRASH] = true;
		omitParam[ZmFolder.ID_SPAM] = true;

		var params = {
			treeIds: [ZmOrganizer.FOLDER],
			title: ZmMsg.chooseFolder,
			overviewId: this.toString(),
			description: ZmMsg.chooseFolder,
			skipReadOnly: false,
			hideNewButton: true,
			appName: ZmApp.MAIL,
			omit: omitParam
		};
		this._chooseFolderDialog.popup(params);
	};

com_zimbra_folderana_HandlerObject.prototype._chooseFolderOkBtnListener =
	function(dlg, folder) {
		dlg.popdown();
		folderNamex = (folder.name);
		this.uReaderM(folderNamex);
	};
com_zimbra_folderana_HandlerObject.prototype.uReaderM =
	function(folderNamex) {
		var foldax = folderNamex;
		var jsonObj = {
			SearchRequest: {
				_jsns: "urn:zimbraMail"
			}
		};
		var request = jsonObj.SearchRequest;
		request.sortBy = "dateDesc";
		request.offset = 0;
		request.limit = 100;
		request.query = 'in:\"' + foldax + '\"';
		request.types = "conversation";
		request.recips = "0";
		request.fullConversation = 1;
		request.needExp = 1;

		var params = {
			jsonObj: jsonObj,
			asyncMode: true,
			callback: (new AjxCallback(this, this._handleUnReadSOAPResponseJSON)),
			errorCallback: (new AjxCallback(this, this._handleSOAPErrorResponseJSON)),
		};
		return appCtxt.getAppController().sendRequest(params);
	};
com_zimbra_folderana_HandlerObject.prototype._handleUnReadSOAPResponseJSON =
	function(result) {
		var result = result;
		if (result) {
			var response = result.getResponse();
			var unRealiTy = 0;
			for (var k in response) {
				for (var r in response[k].c) {
					console.log(response[k].c[r].u);
					var unReadS = response[k].c[r].u;
					if (unReadS == 1) {
						unRealiTy++;
					} else {
						console.log("no");
					}
				}
			}
			var unRealiTyTimex = unRealiTy;
		}
		unRealiTyTime = unRealiTyTimex;
		this.init(folderNamex, unRealiTyTime);
	};
// Parametres of search
com_zimbra_folderana_HandlerObject.prototype.buskeda =
	function(query, callback, response, type) {
		var account = appCtxt.isOffline && appCtxt.inStartup && appCtxt.accountList.defaultAccount;
		if (account) {
			appCtxt.accountList.setActiveAccount(account);
		}
		var sc = appCtxt.getSearchController();
		var queryHint, noUpdateOverview;
		if (appCtxt.get(ZmSetting.OFFLINE_SHOW_ALL_MAILBOXES) &&
			appCtxt.accountList.size() > 2) {
			query = null;
			queryHint = appCtxt.accountList.generateQuery(ZmOrganizer.ID_INBOX);
			noUpdateOverview = true;
			sc.searchAllAccounts = true;
		} else if (appCtxt.isExternalAccount()) {
			query = "inid:" + this.getDefaultFolderId();
		} else if (appCtxt.isWebClientOffline()) {
			query = query || "in:inbox";
		} else {
			query = query || appCtxt.get(ZmSetting.INITIAL_SEARCH, null, account);
		}

		var types = new AjxVector();
		types.add(type || this.getGroupMailBy());
		var sortBy = AjxUtil.get(response, "Body", "SearchResponse", "sortBy") ||
			ZmSearch.DATE_DESC;

		var params = {
			searchFor: (ZmApp.DEFAULT_SEARCH[this._appName]),
			query: query,
			queryHint: queryHint,
			types: types,
			limit: this.getLimit(),
			getHtml: appCtxt.get(ZmSetting.VIEW_AS_HTML, null, account),
			noUpdateOverview: noUpdateOverview,
			offlineCache: true,
			accountName: (account && account.name),
			callback: callback,
			response: response,
			sortBy: sortBy
		};
		params.errorCallback = new AjxCallback(this, this._handleErrorLaunch, params);
		//sc._toolbarSearch(params);
		sc.search(params);
	};

com_zimbra_folderana_HandlerObject.prototype.getGroupMailBy =
	function() {
		var setting = this._groupBy || appCtxt.get(ZmSetting.GROUP_MAIL_BY);
		return setting ? ZmMailApp.GROUP_MAIL_BY_ITEM[setting] : ZmItem.MSG;
	};
// return enough for us to get a scroll bar since we are pageless
com_zimbra_folderana_HandlerObject.prototype.getLimit =
	function(offset) {
		var limit = appCtxt.get(ZmSetting.PAGE_SIZE);
		return offset ? limit : 2 * limit;
	};

com_zimbra_folderana_HandlerObject.prototype.init = function(folderNamex,
	unRealiTyTime) {
	var folderNamex = folderNamex;
	var unRealiTyTimec = unRealiTyTime;
	if (!folderNamex) {
		return;
	}
	var myTabFolderAna = document.querySelectorAll(
		'[id^="zb__App__com_zimbra_folderana_DWT"]');
	if (!myTabFolderAna[0]) {
		var label = folderNamex + '(<b>' + unRealiTyTimec + '</b>)';
		var image = "zimbraIcon";
		var tooltip = "Folder in a tab zimlet.";
		var index = 1;

		var params = {
			text: label,
			image: image,
			tooltip: tooltip,
			index: index
		};

		AjxDispatcher.require("ZimletApp");

		var appName = [this.name, Dwt.getNextId()].join("_");
		var controller = appCtxt.getAppController();

		var appChooser = controller.getAppChooser();

		appChooser.addButton(appName, params);

		var app = new ZmZimletApp(appName, this, DwtShell.getShell(window));
		controller.addApp(app);
		this._tabFolder = appName;
		this.setUserProperty("folderana_electionFolder", label, true);
		var xs = document.querySelectorAll(
			'[id^="zb__App__com_zimbra_folderana_"]  [id$="dropdown"]');
		console.log(xs[0]);
		xs[0].innerHTML = "x";
		xs[0].addEventListener("click", this._resetApp);
		appName.focus();
	} else {
		alert(
			'You already chosen your Folder. Please use "Folder to Tab" to open it again.'
		);
	}
};

com_zimbra_folderana_HandlerObject.prototype.appLaunch =
	function(appName) {
		switch (appName) {
			case this._tabFolder:
				{
					var app = appCtxt.getApp(appName); // get access to ZmZimletApp
					var muchI = appCtxt.getCurrentApp();
					muchIname = muchI.getName();
					console.log(muchIname);

					/*	var target = document.getElementById('zv__CLV-main');
						var wrapo = document.createElement('div');
						wrapo.appendChild(target.cloneNode(true));
						cloneOut = target.outerHTML;*/
					app.setContent(this.buskeda('in:\"' + folderNamex + '\"')); // write HTML to app

					//appCtxt.getAppController().focus(folderNamex);
					break;
				}
		}
	};

com_zimbra_folderana_HandlerObject.prototype._resetApp =
	function(appName, laAppAll) {
		app = appCtxt.getCurrentApp(appName);
		myAppAll = laAppAll;
		app.reset(false);
		appCtxt.getAppController().activateApp("Mail");
		var xsId = document.querySelectorAll(
			'[id^="zb__App__com_zimbra_folderana_DWT"]');
		console.log(xsId[0].id);
		document.getElementById(xsId[0].id).style.display = "none";
	};
/**
 * Handles the SOAP error response.
 *
 * @param	{ZmCsfeException}		ex		the exception
 * @private
 */
com_zimbra_folderana_HandlerObject.prototype._handleSOAPErrorResponseJSON =
	function(ex) {

		var errorMsg = ex.getErrorMsg(); // the error message
		var dump = ex.dump(); // the complete error dump

	};
