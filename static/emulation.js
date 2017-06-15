if (location.href.match('emulation')) {
	var EMULATION = 'ios';

	(function () {
		var actor = {
			toggleNavigation: function (params) {
				params = JSON.parse(params);
				console.log((params.isShow ? 'show' : 'hide') + ' nav');
			},
			setTitle: function (params) {
				params = JSON.parse(params);
				console.log('title has changed to ' + params.title);
			},
			showMessage: function (params) {
				params = JSON.parse(params);
				console.log(params.message)
			},
      showButton: function (params) {
        params = JSON.parse(params);
        console.log(params.text)
      },
      jumpToPage: function (params) {
        params = JSON.parse(params)
        console.log(params)
      },
			obtainParams: function (params) {
				params = JSON.parse(params)
			}

		}

		switch (EMULATION)
		{
			case 'ios':
				window.toggleNavigation = actor.toggleNavigation;
				window.setTitle = actor.setTitle;
				window.showMessage = actor.showMessage;
        window.showButton = actor.showButton;
        window.jumpToPage = actor.jumpToPage;
        window.obtainParams = actor.obtainParams;
				break;
			case 'android':
				window.android = actor;
				break;
			default:
				break;
		}
	})();
}
