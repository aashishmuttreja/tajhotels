function gobackfunction(){
  	  history.back();
  	}
var accountType = "";
$(document).ready(function() {
    changeApplyNow();
    basOpenForTataNeuCheck();

    if($( document ).width() < 425){
        if(window.location.href == 'https://www.tajhotels.com/en-in/' || window.location.href == 'https://www.tajhotels.com/' || 
          window.location.href == 'https://www.seleqtionshotels.com/en-in/' || window.location.href == 'https://www.seleqtionshotels.com/' || 
          window.location.href == 'https://www.vivantahotels.com/en-in/' || window.location.href == 'https://www.vivantahotels.com/' || window.location.href.includes('author-taj-dev65-02.adobecqms.net/content/tajhotels/en-in')){
            $(".cm-page-container .header").css({"position":"fixed","top":"0"});
			$(".banner-container-wrapper").css("margin-top","56px");

        }
    }

    var headerDDInitCon = $('.cm-header-dd-options-con');
    var headerDropdowns = $('.header-warpper .cm-header-dropdowns');
    var headerArrows = $('.header-dropdown-image');
    profileFetchListener(showUserPoints);
	/*To display Tata Neu related header for Loyal customer*/
	displayTataNeuHeaderFooter(); 
 
    var entityLogin = $('#corporate-booking-login').attr('data-corporate-isCorporateLogin') == "true";
    var currentUrl = window.location.href;
    var encodedUri = encodeURIComponent(currentUrl);
   
    var clientID = document.querySelector("meta[name='tdl-sso-client_id']").getAttribute("content");
    if (isCurrencyCacheExists()) {
        var cacheObject = getCurrencyCache()
        setActiveCurrencyInDom(cacheObject.currencySymbol, cacheObject.currency, cacheObject.currencyId);
    } else {
        setActiveCurrencyWithDefaultValues();
    }
    if(window.location.href.indexOf("tajinnercircle") != -1){$(".navbar-expand-lg .navbar-nav .nav-link").css("padding-left","2.1rem");}

	//checkUserDetailsForHeader();

    var urlParams1 = new URLSearchParams(window.location.search);
                    var src1, offer_ID, btype;
    if (urlParams1.has("source")) {
            src1 = urlParams1.get("source");
            offer_ID = urlParams1.get("offerId");
            btype = urlParams1.get("bookingType");     
    }
    if(src1 != null){
        localStorage.setItem("source" , src1);
		sessionStorage.setItem("source" , src1);
        localStorage.setItem("offerId" , offer_ID);
        localStorage.setItem("bookingType" , btype);
    } 
    else if (localStorage.getItem("source") !=null){
        localStorage.setItem("source" , localStorage.getItem("source"));
        localStorage.setItem("offerId" , localStorage.getItem("offerId"));
        localStorage.setItem("bookingType" , localStorage.getItem("bookingType"));
		sessionStorage.setItem("source" , sessionStorage.getItem("source"));
    }                 
    else {               

        localStorage.setItem("bookingType" , "null");
    }

    if(urlParams1.has("utm_source") && urlParams1.has("utm_medium") && urlParams1.has("source") && urlParams1.has("pincode") && 
        urlParams1.has("city") && urlParams1.has("lat") && urlParams1.has("long") ){
            var tataNeuParams = window.location.href.substr(window.location.href.indexOf("utm_source="), window.location.href.indexOf("&long=") + 9);
			tataNeuParams = tataNeuParams.substr(0 , tataNeuParams.indexOf('&authCode'));
            localStorage.setItem("tataNeuParams" , tataNeuParams);
    }



    // --> tdl sso start 
    $('[data-component-id="enrol-btn"]').click(function(){
        //event.preventDefault();
        var signInLink = $('#sign-in-btn a').attr('data-component-id');
        if(signInLink != undefined || signInLink != null){
            $('[data-component-id="enrol-btn"]').attr('href',signInLink+'?clientId='+clientID+'&redirectURL='+encodedUri);
        }else{
            $('[data-component-id="enrol-btn"]').attr('href','https://sit-account.tajhotels.com/login?clientId='+clientID+'&redirectURL='+encodedUri);
        }						

     });
    // --> tdl sso end 
    // --> SSO
    gtmDataLayerFromHeader();

    var user = userCacheExists();
    var isCorporateLogin = false;
    var showSignIN = true;
    hideSignInAndEnroll();
    var ihclSSOToken = $.cookie($(".single-sign-on-sevlet-param-name").text() || 'ihcl-sso-token');
    if (isIHCLCBSite()) {
        console.log('isIHCLCBSite: true');
        if (user && user.isCorporateLogin) {
            isCorporateLogin = user.isCorporateLogin;
            showHeaderUserProfile(user.name);
        } else {
            console.log('user.isCorporateLogin: false');
            dataCache.local.removeData("userDetails");
            clearRoomSelections();
            showSignInAndEnroll();
        }
    } else if (user && user.authToken && !user.isCorporateLogin) {
        console.log('user.authToken: true && isCorporateLogin: false');
        if (user.authToken === ihclSSOToken) {
            console.log('user.authToken === ihclSSOToken: true');
            showHeaderUserProfile(user.name);
        } else if (ihclSSOToken) {
            console.log('ihclSSOToken: true');
            getUserDetailsUsingToken(ihclSSOToken);
        } else {
            console.log('user.authToken === ihclSSOToken: false && ihclSSOToken: false');
            dataCache.local.removeData("userDetails");
            clearSelectionAndLogout();
            showSignInAndEnroll();
        }
    } else if (ihclSSOToken) {
        console.log('ihclSSOToken: true');
        getUserDetailsUsingToken(ihclSSOToken);
    } else {
        console.log('SSO final else condition');
        showSignInAndEnroll();
    }

    function hideSignInAndEnroll() {
        $('.sign-in-btn').addClass('cm-hide');
        $('[data-component-id="enrol-btn"]').addClass('cm-hide');
    }

    function showSignInAndEnroll() {
        $('.sign-in-btn').removeClass('cm-hide');
        $('[data-component-id="enrol-btn"]').removeClass('cm-hide');
        hideProfileDetails();
    }
    function hideProfileDetails(){
      $('.header-profile').addClass('cm-hide').removeClass('cm-show');
     }

    function basOpenForTataNeuCheck(){
        var basVal = (new URLSearchParams(window.location.search)).get('bas');
        if(basVal && basVal.toLowerCase() == 'open'){
            setTimeout(function(){
                if($('.book-stay-btn') && $($('.book-stay-btn')[0])){
                    $($('.book-stay-btn')[0]).trigger('click');
                }
            },1000);

        }
    }

	
	
    function getUserDetailsUsingToken(ihclSSOToken) {
        debugger
        showLoader();
        $.ajax({
            type : "POST",
            url : "/bin/fetchUserDetails",
            data : "authToken=" + encodeURIComponent(ihclSSOToken)
        }).done(function(res) {
            res = JSON.parse(res); 
            if (res.userDetails && res.userDetails.name) {
                updateLoginDetails(res);
                showSignIN = false;
            }
            hideLoader();
        }).fail(function(res) {
        }).always(function() {
            if (showSignIN) {
                showSignInAndEnroll();
            }
            hideLoader();
        });
    }


    function updateLoginDetails(res) {
        if (res.authToken) {
            var userDetails = res.userDetails;
            var authToken = res.authToken;
            incorrectLoginCount = 0;
            successHandler(authToken, userDetails);
        } else if (res.errorCode === "INVALID_USER_STATUS" && res.status === "504" && !entityLogin) {
            // user activation flow
            invokeActivateAccount();
        } else if (res.errorCode === "INVALID_USER_STATUS" && res.status === "506" && !entityLogin) {
            // migrated user
            var error = res.error;
            var errorCtaText = "RESET PASSWORD";
            var errorCtaCallback = invokeForgotPassword;
            $('body').trigger('taj:loginFailed', [ error, errorCtaText, errorCtaCallback ]);
        } else {
            if (entityLogin) {
                forgotPasswordLinkWrp.show();
                $('.ihclcb-login-error').text(res.error).show();
            }
        }
    }
    function successHandler(authToken, userDetails) {
        localUserDetails(authToken, userDetails);
        var id = userDetails.membershipId;
        var name = userDetails.name;
        $('.generic-signin-close-icon').trigger("click");
        $('body').trigger('taj:loginSuccess', [ id, name ]);

        if (id) {
            $('body').trigger('taj:fetch-profile-details', [ true ]);
        } else {
            $('body').trigger('taj:login-fetch-complete');
        }
        if (!entityLogin) { // added by sarath
            $('body').trigger('taj:tier');
        }
        dataToBot();
    }
    function localUserDetails(authToken, userDetails) {
        var user = {
            authToken : authToken,
            name : userDetails.name,
            firstName : userDetails.firstName,
            lastName : userDetails.lastName,
            gender : userDetails.gender,
            email : userDetails.email,
            countryCode : userDetails.countryCode,
            mobile : userDetails.mobile,
            cdmReferenceId : userDetails.cdmReferenceId,
            membershipId : userDetails.membershipId,
            googleLinked : userDetails.googleLinked,
            facebookLinked : userDetails.facebookLinked,
            title : userDetails.title
        };
        if (entityLogin) {
            user.partyId = userDetails.cdmReferenceId
        }
        dataCache.local.setData("userDetails", user);
        if ($('.mr-contact-whole-wrapper').length > 0) {
            window.location.reload();
        }
    }

    // SSO <--

    function isCurrencyCacheExists() {
        var currencyCache = dataCache.session.getData("currencyCache");
        if (!currencyCache)
            return false;
        else
            return true;
    }

    if (deviceDetector.isIE() == "IE11") {
        $(".brand-logo-wrapper img").addClass('.ie-tajLogo-img');
    }

    scrollToViewIn();
    function setActiveCurrencyWithDefaultValues() {
        try {
            var dropDownDoms = $.find('.header-currency-options');
            var individualDropDownDoms = $(dropDownDoms).find('.cm-each-header-dd-item');
            var firstDropDownDom;
            if (individualDropDownDoms && individualDropDownDoms.length) {
                firstDropDownDom = individualDropDownDoms[0];
            }

            var currencyId = $(firstDropDownDom).data().currencyId;
            var currencySymbol = $($(firstDropDownDom).find('.header-dd-option-currency')).text();
            var currency = $($(firstDropDownDom).find('.header-dd-option-text')).text();

            if (currencySymbol != undefined && currency != undefined && currencyId != undefined) {
                setActiveCurrencyInDom(currencySymbol, currency, currencyId);
                setCurrencyCache(currencySymbol, currency, currencyId);
            }
        } catch (error) {
            console.error(error);
        }
    }

    $('.header-warpper .cm-header-dropdowns').each(function() {
        $(this).on('click', function(e) {
            e.stopPropagation();
            var arrow = $(this).closest('.nav-item').find('.header-dropdown-image');
            var target = $(this).closest('.nav-item').find('.cm-header-dd-options-con');
            if (target.hasClass('active')) {
                target.removeClass('active');
                arrow.removeClass('header-dropdown-image-selected');
                $(this).removeClass('nav-link-expanded');
                return;
            }
            headerDropdowns.removeClass('nav-link-expanded')
            headerDDInitCon.removeClass('active');
            headerArrows.removeClass('header-dropdown-image-selected');
            target.addClass('active');
            arrow.addClass('header-dropdown-image-selected');
            $(this).addClass('nav-link-expanded')
        });
    });

    $('body').on('click', function() {
        headerDDInitCon.removeClass('active');
    });

    var windowWidth = $(window).width();
    if (windowWidth < 992) {
        $('.ihcl-header .navbar-toggler').addClass('navbar-dark');
        if (windowWidth < 768) {
            var bookAStayBtn = $('.header-warpper a.book-stay-btn .book-stay-btn')
            if (bookAStayBtn.text().trim() == "Book your dream wedding") {
                bookAStayBtn.text("BOOK A VENUE");
            }
        }
    }

    $('.collapse').on('show.bs.collapse', function() {
        $(".cm-page-container").addClass('prevent-page-scroll');
    });

    $('.header-currency-options').on('click', '.cm-each-header-dd-item', function() {
        try {
            var elDDCurrencySymbol = $(this).find('.header-dd-option-currency');
            var elDDCurrency = $(this).find('.header-dd-option-text');

            var elActiveCurrSymbol = $(this).closest('.nav-item').find('.selected-currency');
            var elActiveCurrency = $(this).closest('.nav-item').find('.selected-txt');

            var currencySymbol = elDDCurrencySymbol.text();
            var currency = elDDCurrency.text();
            var currencyId = $(this).data('currency-id');

            if (currencySymbol != undefined && currency != undefined && currencyId != undefined) {
                setCurrencyCache(currencySymbol, currency, currencyId);
            }

            elActiveCurrSymbol.text(currencySymbol);
            elActiveCurrSymbol.attr("data-selected-currency", currencyId)
            elActiveCurrency.text(currency);
            $(document).trigger('currency:changed', [ currency ]);
        } catch (error) {
            console.error(error);
        }
    });

    $('.profile-name-wrp').click(function(e) {
        e.stopPropagation();
        $('.profile-options').toggle();
        $('.profile-name-wrp .header-dropdown-image').toggleClass('cm-rotate-show-more-icon');
    });

    $('.cm-page-container').click(function() {
        $('.profile-options').hide();
        $('.profile-name-wrp .header-dropdown-image').removeClass('cm-rotate-show-more-icon');
    });

    $('.header-mobile-back-btn').click(function() {
        $('.navbar-collapse').removeClass('show');
        $(".cm-page-container").removeClass('prevent-page-scroll');
    })

    $('.sign-in-btn').click(function() {
        var currentUrl = window.location.href;
        var encodedUri = encodeURIComponent(currentUrl);
        var signInLink = $('#sign-in-btn a').attr('data-component-id');	
        var clientID = document.querySelector("meta[name='tdl-sso-client_id']").getAttribute("content");
        if(!userLoggedIn()){
            if(signInLink != undefined || signInLink != null){
            $('.sign-in-btn > .nav-link').attr('href',signInLink+'?clientId='+clientID+'&redirectURL='+encodedUri); 
            }
            else{
                $('.sign-in-btn > .nav-link').attr('href', selectLoginUrlEnv() + '?clientId='+clientID+'&redirectURL='+encodedUri);  
            }
        }
        else{
            document.location.reload();
        }
    });

    $('body').on('taj:loginSuccess', function(event,uname) {
        showHeaderUserProfile(uname);
    });

    $('body').on('taj:pointsUpdated', function(event) {
        showUserPoints();
    });

    function showHeaderUserProfile(name) {
        $('.sign-in-btn').addClass('cm-hide');
        $('.header-profile').removeClass('cm-hide').addClass('cm-show');
        $('.header-profile .profile-username, .navbar-brand .profile-username').text(name);
        showUserPoints();
    }

    function showUserPoints() {
        var userDetails = dataCache.local.getData("userDetails");
        if (userDetails && userDetails.brandData && userDetails.brandData.ticNumber && userDetails.brandData.ticNumber[0]) {
            $('.header-profile .points-cont').removeClass('d-none');
            $('[data-component-id="enrol-btn"]').remove(); // remove enrol buttons for users having
            // membership id
            $('.header-profile .edit-profile').hide();
            if (userDetails.loyaltyInfo && userDetails.loyaltyInfo[0].currentSlab) {
                $('.header-profile .tic-tier span').text(userDetails.loyaltyInfo[0].currentSlab);
                $('.header-profile .tic-tier').show();
            } else {
                $('.header-profile .tic-tier').hide();
            }
            if (userDetails.loyaltyInfo && userDetails.loyaltyInfo[0].currentSlab) {
            $('.header-profile .tic-points').text(parseInt(userDetails.loyaltyInfo[0].loyaltyPoints));
            }
            
            if (userDetails.brandData) {
                
                accountType = "tic-points";  
                $('.prof-content-value').each(
                        function() {
                            $(this).attr("id") === accountType ? $(this).parent().show() : $(this)
                                    .parent().hide();
                        });

            
                $('.prof-tic-content').show();
            } else {
                console.log("unable to retrieve user card details");
                $('.prof-tic-content').hide();
            }
        } else {
            $('.header-profile .points-cont').addClass('d-none');
        }
		if(sessionStorage.getItem("source") == 'tcp'){
			$('.header-profile #logout-btn').addClass('d-none');
		}
    }
    /*tdl sso changes start */

    $('.header-profile .logout-btn').on('click', function(event) {
        event.stopPropagation();

        checkToClearSelections();
    });


    $('body').on('taj:logout', function() {
        tajLogout();
    });
    $('body').on('taj:sessionLogout', function(){
		logoutWithoutReloding();
    });

    function checkToClearSelections() {
        var bOptions = dataCache.session.getData('bookingOptions');
        if (bOptions.selection && (bOptions.selection.length > 0)) {
            var popupParams = {
                title : $(".sign-out-clear-selections-popupMessage").text()
                || 'Sign Out will clear room slections?',
                callBack : clearSelectionAndLogout.bind(),
                // callBackSecondary: secondaryFn.bind( _self ),
                needsCta : true,
                isWarning : true
            }
            warningBox(popupParams);
        } else {
            tajLogout();
        }
    }

    function clearSelectionAndLogout() {
        clearRoomSelections();
        tajLogout();
    }

    function clearRoomSelections() {
        var boptions = dataCache.session.getData("bookingOptions");
        if (boptions && boptions.roomOptions) {
            var rOptions = boptions.roomOptions;
            var roomOptArray = [];
            for (var d = 0; d < rOptions.length; d++) {
                var roomOpt = {
                    adults : rOptions[d].adults,
                    children : rOptions[d].children,
                    initialRoomIndex : d
                };
                roomOptArray.push(roomOpt);
            }
            boptions.previousRooms = roomOptArray
            boptions.roomOptions = roomOptArray;
            boptions.rooms = boptions.roomOptions.length;
            boptions.selection = [];
            dataCache.session.setData("bookingOptions", boptions);
        }
    }

    function tajLogout() {
        typeof tdlsignOut != 'undefined' ? tdlsignOut() : '';
        typeof logoutBot != 'undefined' ? logoutBot() : '';
        typeof facebookLogout != 'undefined' ? facebookLogout() : '';
        typeof googleLogout != 'undefined' ? googleLogout() : '';
		showSignInAndEnroll();
    }

    function googleLogout() {
        try {
            var auth2 = gapi.auth2.getAuthInstance();
            auth2.signOut().then(function() {
                console.info('User signed out.');
            });
        } catch (error) {
            console.error("Attempt for google logout failed.")
            console.error(error);
        }
    }

    function facebookLogout() {
        try {
            FB.logout(function(response) {
                // user is now logged out
                console.info("user is now logged out");
            });
        } catch (error) {
            console.error("Attempt for facebook logout failed.")
            console.error(error);
        }
    }
    function logoutSuccess1(accessTk) {
        logoutWithoutReloding(accessTk);
        //formTheRedirectionURL(redirectUrl);
        //    document.location.reload();
    }
    function logoutWithoutReloding(accessTkn) {
        var isCorporateLogin = userCacheExists() ? userCacheExists().isCorporateLogin : false;       
        showSignInAndEnroll();
		logoutBot();
		
        if (!isCorporateLogin) {  
            /*tdl sso logout function call*/   
			if(localStorage.getItem("access_token")){
				tdlsignOut();
			}
        } else {
            dataCache.session.removeData("ihclCbBookingObject");
			dataCache.local.removeData("userDetails");
			localStorage.removeItem("access_token");
			localStorage.removeItem("refresh_token");
			localStorage.removeItem("user");
			localStorage.removeItem("auth_code");
			deleteCookiesSSO();
        }
    }

    
    var tdlsignOut = logoutAccessToken => {
				tdlSsoAuth.deleteSession(localStorage.getItem('access_token')).then(function(response){
					console.log("response",response);									
					if (response){ 
						location.reload();						
					}					
				});
				dataCache.local.removeData("userDetails");
				localStorage.removeItem("access_token");
				localStorage.removeItem("refresh_token");
				localStorage.removeItem("user");
				localStorage.removeItem("auth_code");
				if(window.location.href.includes('tataneu/My-Profile') || window.location.href.includes('tataneu/my-profile')){
						window.location.href="https://www.tajhotels.com/en-in/tataneu/";
				}else if(window.location.href.includes('neupass/my-profile')){
						window.location.href="https://www.tajhotels.com/en-in/neupass/";
				}else if(window.location.href.includes('tajinnercircle/My-Profile')|| window.location.href.includes('tajinnercircle/my-profile')){
						window.location.href="https://www.tajhotels.com/en-in/tajinnercircle/";
				}	
				deleteCookiesSSO();			
            }
	const selectEnv = (href) => {
		href =  href ?  href : window.location.href;
		if (href.includes('localhost') || href.includes('0.0.0.0')) return 'http://localhost:8080/api/v1';	
		if (href.includes('taj-dev65-02')) return 'https://ppapi.tatadigital.com/api/v2/sso';
		if (href.includes('dev')) return 'https://ppapi.tatadigital.com/api/v2/sso';
		if (href.includes('stage')) return 'https://sapi.tatadigital.com/api/v1/sso';
		return 'https://api.tatadigital.com/api/v2/sso';
	} 
		
	 

});

	if (typeof selectLoginUrlEnv == 'undefined') {
		const selectLoginUrlEnv = (href) => {
				href =  href ?  href : window.location.href;
				if (href.includes('localhost') || href.includes('0.0.0.0')) return 'https://sit-r2-account.tatadigital.com/v2/';	
				if (href.includes('taj-dev65-02')) return 'https://sit-r2-account.tatadigital.com/v2/';
				if (href.includes('dev')) return 'https://sit-r2-account.tatadigital.com/v2/';
				if (href.includes('stage')) return 'https://sit-r2-account.tatadigital.com/v2/';
				return 'https://members.tajhotels.com/v2/';
		}
	}

function getSelectedCurrency() {
    return dataCache.session.getData("selctedCurrency");
}

function getCurrencyCache() {
    return dataCache.session.getData("currencyCache");
}

function setActiveCurrencyInDom(currencySymbol, currency, currencyId) {

    $($.find("[data-inject-key='currencySymbol']")[0]).text(currencySymbol);
    $($.find("[data-inject-key='currency']")[0]).text(currency);
    $($.find("[data-selected-currency]")[0]).attr("data-selected-currency", currencyId);
}

function setCurrencyCache(currencySymbol, currency, currencyId) {
    var currencyCache = {};
    currencyCache.currencySymbol = currencySymbol;
    currencyCache.currency = currency;
    currencyCache.currencyId = currencyId;
    dataCache.session.setData("currencyCache", currencyCache);
}

function setCurrencyCacheToBookingOptions() {
    var bookingOptions = getBookingOptionsSessionData();
    bookingOptions.currencySelected = dataCache.session.getData('currencyCache').currencyId;
    dataCache.session.setData("bookingOptions", bookingOptions);
}

function setActiveCurrencyWithResponseValue(currencyType) {

    var infor = false;
    var dropDownDoms = $.find('.header-currency-options');
    var individualDropDownDoms = $(dropDownDoms).find('.cm-each-header-dd-item');
    var firstDropDownDom;
    if (individualDropDownDoms && individualDropDownDoms.length) {
        for (var m = 0; m < individualDropDownDoms.length; m++) {
            if ($(individualDropDownDoms[m]).data().currencyId == currencyType) {
                firstDropDownDom = individualDropDownDoms[m];
                infor = true;
            }
        }
    }
    if (firstDropDownDom) {
        var currencyId = $(firstDropDownDom).data().currencyId;
        var currencySymbol = $($(firstDropDownDom).find('.header-dd-option-currency')).text();
        var currency = $($(firstDropDownDom).find('.header-dd-option-text')).text();

        if (currencySymbol != undefined && currency != undefined && currencyId != undefined) {
            setActiveCurrencyInDom(currencySymbol, currency, currencyId);
            setCurrencyCache(currencySymbol, currency, currencyId);
            setCurrencyCacheToBookingOptions();
        }
    }
    return infor;
}

function formTheRedirectionURL(authoredURL) {
    var url = authoredURL;
    if (!isIHCLCBSite() && !url.includes('https')) {
        var url = url + ".html"
    } else if (isIHCLCBSite()) {
        dataCache.session.removeData("ihclCbBookingObject");
    }
    window.location.href = url;
}
function stopAnchorPropNav(obj) {
    if (window.location.href.includes('en-in/taj-air')) {
        var attr = obj.text;
        prepareQuickQuoteJsonForClick(attr);
    }
    return true;
}

function scrollToViewIn() {
    console.log('binded');
    var scrollElem = $(".scrollView");
    if(scrollElem && scrollElem.length > 0) {
        $(".scrollView").each(function(){
            $(this).on('click', function() {
                var classStr = $(this).attr('class').slice(11);
                $('html, body').animate({
                    scrollTop: $('#'+classStr).offset().top
                }, 1000);
            });
        });
    }
}


//updated for global data layer.
function gtmDataLayerFromHeader(){
    $('#navbarSupportedContent .navbar-nav>.nav-item>a').each(function(){
        $(this).click(function(){
            var eventType = "" ;                 
			switch($(this).text().toLowerCase()) {
              	case 'home':
					eventType = 'TopMenu_KnowMore_HomePage_Home';
                	break;
              	case 'benefits':
					eventType = 'TopMenu_KnowMore_HomePage_Benefits';
                	break;
            	case 'epicure':
					eventType = 'TopMenu_KnowMore_HomePage_Epicure';
                	break;
            	case 'redeem':
					eventType = 'TopMenu_KnowMore_HomePage_Redeem';
                	break;
                case 'events':
                    eventType = 'TopMenu_KnowMore_HomePage_Events';
                	break;
                case 'our hotels':
					eventType = 'TopMenu_KnowMore_HomePage_OurHotels';
               		break;
            	case 'help':
					eventType = 'TopMenu_KnowMore_HomePage_Help';
               		break;
            	case 'enrol':
        			eventType = 'TopMenu_Enrollment_HomePage_TICEnrol';
               		break;
            	case 'sign in':
					eventType = 'TopMenu_SignIn_HomePage_SignIn';
               		break;
              	default:
        			eventType = '';
            }
        	if(eventType){
        		addParameterToDataLayerObj(eventType, {});
            }
        });
    });
}

function displayTataNeuHeaderFooter(){
	   var userDetails =getUserData();
		if (userDetails && userDetails.loyalCustomer == 'Y') {
			var tataneuText = ['NeuPass',''];
			var tataneuLinks = ['https://www.tajhotels.com/en-in/neupass/', '']
			$('.NonloyalCustomerData li').each(function(index, value) {
                if($(this).children().text() == 'Taj InnerCircle'){
                    $(this).children().attr('href', tataneuLinks[0]);
					$(this).children().text(tataneuText[0]);
                }
				/*if (index == 0) {
					$(this).children().attr('href', tataneuLinks[index]);
					$(this).children().text(tataneuText[index]);
				}*/
			})
             var url=window.location.href.split('?')[0];

            if(url=="https://www.tajhotels.com/en-in/tajinnercircle/")
            {
                window.location.replace("https://www.tajhotels.com/en-in/neupass/");
            }
			$(".prof-content-title").text("NeuCoins")

			if(window.location.href.includes("tajhotels.com") || window.location.href.includes("seleqtionshotels.com") || 
			window.location.href.includes("vivantahotels.com") || window.location.href.includes("amastaysandtrails.com")){
				$(".loyalCustomerData a").attr('href','https://www.tajhotels.com/en-in/neupass/my-profile/');
				$("#header-profile .profile-default-options a").attr('href','https://www.tajhotels.com/en-in/neupass/my-profile/');
			}else{
				$(".loyalCustomerData a").attr('href','/en-in/neupass/my-profile/');
				$("#header-profile .profile-default-options a").attr('href','/en-in/neupass/my-profile/');
			}
			// && (userDetails.neuPassInfo == null || userDetails.neuPassInfo.status == 'active')
			if(userDetails.isGdprCustomer!= 'true'){
                typeof(showNeupassStrip) != 'undefined' ? showNeupassStrip('NeupassActive') : '';
			}
			else if(userDetails.isGdprCustomer == 'true' && (userDetails.neuPassInfo && userDetails.neuPassInfo.status != 'active')){
                    typeof(showNeupassStrip) != 'undefined' ? showNeupassStrip('NeupassInactive') : ''; 
            }
            if(userDetails && userDetails.neuPassInfo && userDetails.neuPassInfo.status == 'cancelled'){
                 if(sessionStorage.getItem('source') == 'tcp'){
                     if(window.location.href.includes('dev65') || window.location.href.includes('stage65')){
                         	tdlsignOut();
                            setTimeout(function(){window.location.href="https://aem-sit-r2.tatadigital.com/getbacktohomepage";},500);
                        	return;
                        }
                    	tdlsignOut();
                     	setTimeout(function(){window.location.href="https://www.tatadigital.com/getbacktohomepage";},300);
                }else{
                    typeof tdlsignOut === 'function' ?  tdlsignOut() : '';
                }
            }
            if($('.carousel-inner') && $('.carousel-inner').find('[id^="cb-"]') && !$('.carousel-inner').find('[id^="cb-"]').attr('data-context')){
                    if($('.carousel-item[data-context]') && $('.carousel-item[data-context]').length)
                   		 $('body').trigger('taj:update-banner-onlogin');
           }
		}else{
			if(!userDetails){
				typeof(showNeupassStrip) != 'undefined' ? showNeupassStrip('guest') : '';
			}
		}
	}
	function changeApplyNow() {
        console.log("APPLY NOW");
        const allLinks = $('.cm-each-header-dd-item a');

        for (let i = 0 ; i < allLinks.length; i++) {
            if(allLinks[i].innerHTML.toLowerCase() == 'apply now') {
                $(allLinks[i]).attr('target','_blank');
            }
        }
    }


var availabilityObj = {
    initialSelecton : '',
    isCheckParamsUpdated : false,
    isRoomTypeUpdated : false
};
var domainChangeFlag = false;
var isToDateClickedTriggered;
bookedRoomsCount = 0;
var isTajHolidays = false;
var isAmaCheckAvailability = false;
var isAmaSite = false;
var amaBookingObject = {};
var shouldInvokeCalendarApiBas = false;
$('document').ready(
        function() {
            try {
                isAmaSite = $('.cm-page-container').hasClass('ama-theme');

				dataCache.session.setData("sameDayCheckout", $('.mr-hotel-details').attr('data-samedaycheckout'));

//                sameDayCheckout = $('.mr-hotel-details').attr('data-samedaycheckout');
//               console.log("sameDayCheckout::::::::", sameDayCheckout);

                initializeCheckAvailability();
                initializeDatePicker();
                disableBestAvailableButton();
                // setBookAStaySessionObject();
                autoPopulateBookAStayWidget();
                if (!verifyIfRoomsPage()) {
                    fetchDateOccupancyParametersFromURL();
                }

                _globalListOfPromoCode = getPromoCodeFromData();
                var url = window.location.href;
                if (($('#page-scope').attr('data-pagescope') == 'Taj Holidays')
                        || (url && url.indexOf('taj-holiday-redemption') != -1)) {
                    checkHolidayScope()
                    isTajHolidays = true;
                }
                if (dataCache.session.getData('bookingDetailsRequest')) {
                    bookedOptions = JSON.parse(dataCache.session.getData('bookingDetailsRequest'));
                    bookedCheckInDate = moment(bookedOptions.checkInDate, "YYYY-MM-DD").format("MMM Do YY");
                    bookedCheckOutDate = moment(bookedOptions.checkOutDate, "YYYY-MM-DD").format("MMM Do YY");
                    bookedAdultsOccupancy = bookedOptions.roomList[0].noOfAdults;
                    bookedChildrenOccupancy = bookedOptions.roomList[0].noOfChilds;
                    bookedRoomsCount = bookedOptions.roomList.length || 0;
                }
                if ((window.location.href.indexOf('rooms-and-suites') != -1) || isTajHolidays
                        || $('.cm-page-container').hasClass('destination-layout')) {
                    dateOccupancyInfoSticky();
                }

                // [IHCL_CB START]
                initIHCLCBBookAStay();
                // [IHCL_CB ENDS]

            } catch (error) {
                console.error("Error in /apps/tajhotels/components/content/book-a-stay/clientlibs/js/book-a-stay.js ",
                        error.stack);
            }

			
			shouldInvokeCalendarApiBas = false;
            if(document.getElementById("shouldInvokeCalendarApiBas"))
			var shouldInvokeCalendarApiBas = document.getElementById("shouldInvokeCalendarApiBas").value;
				if(shouldInvokeCalendarApiBas){
                    //***Removing Ama Calendar rates modified****///
                    var getPathName = window.location.pathname;
                    var getHostName = window.location.hostname;
                    if(getHostName == 'www.amastaysandtrails.com' || getPathName.includes('/content/ama')){
                        return;
                    } ///*** changes end ****///
					amacacalendarPricingBas();
					bindNextPrevClickAmaBas();
				}
			if($("#hotelIdFromSearch").text() == ''){
				$('.searchbar-input').val("")
			}
        });

function initIHCLCBBookAStay() {
    if (isIHCLCBSite()) {
        fetchIHCLCBEntityDetails();
        addEntityDropDownEventsForIHCLCB();
    }
}

function fetchDateOccupancyParametersFromURL() {
    try {
        var bookingOptions = {};
        var _globalPromoCode = {
            name : null,
            value : null
        };
        var checkInDate = getQueryParameter('from');
        var checkOutDate = getQueryParameter('to');
        var rooms = getQueryParameter('rooms');
        var adults = getQueryParameter('adults');
        var children = getQueryParameter('children');
        if (checkInDate && checkOutDate) {
            var nights = moment(checkOutDate, "DD.MM.YYYY").diff(moment(checkInDate, "DD.MM.YYYY"), 'days');
            checkInDate = moment(checkInDate, 'DD/MM/YYYY').format('MMM Do YY');
            checkOutDate = moment(checkOutDate, 'DD/MM/YYYY').format('MMM Do YY');
            bookingOptions.fromDate = checkInDate;
            bookingOptions.toDate = checkOutDate;
            bookingOptions.nights = parseInt(nights)

        }
        if (rooms && adults && children) {
            if (validateRoomsQueryParams(rooms, adults, children)) {
                var roomOptions = [];
                var adultsArr = adults.split(",");
                var childArr = children.split(",");
                for (var index = 0; index < rooms; index++) {
                    roomOptions.push({
                        "adults" : adultsArr[index],
                        "children" : childArr[index],
                        "initialRoomIndex" : index
                    });
                }
                bookingOptions.roomOptions = roomOptions;
            }
        }
        if (checkInDate && checkOutDate && rooms && adults && children) {
            bookingOptions.isAvailabilityChecked = true;
            if (bookingOptions.rooms == 0) {
                bookingOptions.rooms = 1;
            }
            bookingOptions.previousRooms = bookingOptions.roomOptions;
            bookingOptions.previousDates = {
                fromDate : bookingOptions.fromDate,
                toDate : bookingOptions.toDate
            };
            bookingOptions.selection = [];
            bookingOptions.promoCode = _globalPromoCode.value;
            bookingOptions.promoCodeName = _globalPromoCode.name;
            bookingOptions.hotelChainCode = null;
            bookingOptions.hotelId = null;
            var redirectFromAmp = getQueryParameter('redirectFromAmp');
            if (redirectFromAmp) {
                var promoCode = getQueryParameter('promoCode');
                var hotelId = getQueryParameter('hotelId');
                var targetEntity = getQueryParameter('targetEntity');
                var isAvailabilityChecked = getQueryParameter('isAvailabilityChecked');
                if (!promoCode) {
                    promoCode = "";
                }
                bookingOptions.promoCode = promoCode;
                if (!hotelId) {
                    hotelId = null;
                }
                bookingOptions.hotelId = hotelId;
                if (!targetEntity) {
                    targetEntity = null;
                }
                bookingOptions.targetEntity = targetEntity;
                if (!isAvailabilityChecked) {
                    isAvailabilityChecked = false;
                }
                bookingOptions.isAvailabilityChecked = isAvailabilityChecked;
            }
            dataCache.session.setData('bookingOptions', bookingOptions);
            updateCheckAvailability();
            removeDateOccupancyParamFromUrl();
        }
    } catch (err) {
        console.error(err);
    }
}

function validateRoomsQueryParams(rooms, adults, children) {
    var isValid = false;
    if (isInt(rooms)) {
        if (rooms > 0 && rooms <= 5) {
            if (adults.split(",").length == rooms && children.split(",").length == rooms) {
                if (isOccupantsParamValidFor(adults, 1, 7) && isOccupantsParamValidFor(children, 0, 7)) {
                    isValid = true;
                } else {
                    isValid = false;
                    console
                            .error("Non Integer parameters passed in Adults/Children or Min/Max Adults[1,7]/Childrens[0,7] occupancy validation failed");
                }
            } else {
                isValid = false;
                console.error("No of Adults and Childrens not matching with No of Rooms");
            }
        } else {
            isValid = false;
            console.error("Min/Max No of Rooms [1,5] validation failed");
        }
    } else {
        isValid = false;
        console.error("Invalid Input Parameter passed as rooms");
    }
    return isValid;
}

function isOccupantsParamValidFor(occupants, minValue, maxValue) {
    var isValid = occupants.split(",").every(function(x) {
        if (isInt(x)) {
            if (x >= minValue && x <= maxValue) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    });
    return isValid;
}

function verifyIfRoomsPage() {
    var presentUrl = window.location.href;
    if (presentUrl.includes("rooms-and-suites") || presentUrl.includes("accommodations")
            || presentUrl.includes("booking-cart")) {
        return true;
    }
    return false;
}

function removeDateOccupancyParamFromUrl() {
    /*Check if not Ginger hotels*/
    if(typeof searchHotelId != 'undefined' && searchHotelId != "99999"){
        var presentUrl = window.location.href;
        var paramsToRemoveArr = [ "from", "to", "rooms", "adults", "children", "overrideSessionDates" ];
        var refinedUrl = '';
        paramsToRemoveArr.forEach(function(param, index) {
            presentUrl = removeURLParameter(presentUrl, param);
        });
        refinedUrl = presentUrl;
        window.history.replaceState({}, document.title, refinedUrl);
	}
}

function removeURLParameter(url, parameter) {
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {

        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);

        for (var i = pars.length; i-- > 0;) {
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }
        return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    return url;
}

function isInt(value) {
    return !isNaN(value) && (function(x) {
        return (x | 0) === x;
    })(parseFloat(value))
}

/*
 * If query params contains redirectFromAmp, we initialize the bookingOptions from query params.
 */
function getBookAStayUrlParams() {
    try {
        if (URLSearchParams) {
            var params = new URLSearchParams(location.search);
            if (params.has("redirectFromAmp")) {
                var fromDate = checkFalseString(params.get("fromDate"))
                        || moment(new Date()).add(1, 'days').format("MMM Do YY");
                //var toDate = checkFalseString(params.get("toDate")) || moment(new Date()).add(2, 'days').format("MMM Do YY");

				var toDate = checkFalseString(params.get("toDate")) || initialBookingSetup();

                   bookingOptions = {
                    fromDate : fromDate,
                    toDate : toDate,
                    rooms : 1,
                    nights : moment(toDate, "MMM Do YY").diff(moment(fromDate, "MMM Do YY"), 'days'),
                    roomOptions : [ {
                        adults : checkFalseString(params.get("adults")) || 1,
                        children : checkFalseString(params.get("children")) || 0,
                        initialRoomIndex : 0
                    } ],
                    selection : [],
                    promoCode : checkFalseString(params.get("promoCode")) || "",
                    hotelId : checkFalseString(params.get("hotelId")) || null,
                    targetEntity : checkFalseString(params.get("targetName")) || null,
                    isAvailabilityChecked : false
                };

                dataCache.session.setData("bookingOptions", bookingOptions);
            }
        }
    } catch (error) {
        console.error(error);
    }
}

// Value returned from URLSearchParams can be "null" so explicit check for that.
function checkFalseString(value) {
    if (value !== "null") {
        return value;
    }
    return false;
}

function getPromoCodeFromData() {
    var promoCodeList = $($.find("[data-promo-code]")[0]).data();
    if (promoCodeList) {
        return promoCodeList.promoCode.promoCodes;
    } else {
        $('.bas-specialcode-container').remove();
    }
    return null;
}

function initializeCheckAvailability() {
    $('#cmCheckAvailability, #cmCheckAvailabilitySmallDevice, .book-stay-btn ').off('click').on('click', function(e) {
        e.stopPropagation();
        dataCache.session.setData("sameDayCheckout", $('.mr-hotel-details').attr('data-samedaycheckout'));
        isAmaCheckAvailability = false;
        $('.cm-page-container').addClass("prevent-page-scroll");
        $('.cm-bas-con').addClass('active');
        $(".cm-bas-content-con").css("max-height", 0.95 * (window.innerHeight));
        autoPopulateBookAStayWidget();
        initiateCalender();
        modifyBookingState = dataCache.session.getData('modifyBookingState');
        if (modifyBookingState && modifyBookingState != 'modifyRoomType') {
            modifyBookingInBookAStay(modifyBookingState);
        }
        resetPromoCodeTab();
		if($("#hotelIdFromSearch").text() == ''){
				$('.searchbar-input').val("")
		}
    });

    var openBookAStay = getUrlParameter("openBookAStay")
    if (openBookAStay == "true") {
        $(".book-stay-btn").click();
    }

};

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1), sURLVariables = sPageURL.split('&'), sParameterName, i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function promptToSelectDate() {
    var bookingOptions = dataCache.session.getData("bookingOptions");
    var elDatePrompt = $(".mr-checkIn-checkOut-Date .mr-checkIn-checkOut-Date-hover");
    if (!bookingOptions.isAvailabilityChecked) {
        elDatePrompt.css('display', 'block');
        elDatePrompt.addClass('cm-scale-animation');
    } else {
        elDatePrompt.css('display', 'none');
        elDatePrompt.removeClass('cm-scale-animation');
    }
}

function initializeDatePicker() {
    _globalPromoCode = {
        name : null,
        value : null
    };

     $('.bas-overlay').on('click', function(e) {
        e.stopPropagation();
       // destroyDatepicker(); 
        overlayDestroyDatepicker();
    });

    // pop up close
    $(".bas-close").click(function(e) {
        e.stopPropagation();
        destroyDatepicker();
    });

    $(".trigger-promo-code-input").on("click", function() {
        $(".promo-code-wrap").css("display", "block");
        $(this).parent().hide();
    });

    $(".close-promocode-section").on("click", function() {
        $(".promo-code-wrap").hide();
        $(".bas-have-promo-code").show();
    });

    $('.special-code-wrap .bas-aroow-btn').on('click', function() {
        $('.bas-code-wrap.clearfix').toggleClass('active');
        $(this).toggleClass('arrow-btn');
    });

    $(".input-daterange input").each(function(e) {
        $(this).focus(function(e) {
            $('.bas-calander-container').addClass('active');
            $(".bas-left-date-wrap").removeClass("active");
            $(".bas-right-date-wrap").removeClass("active");
            $(this).parent().parent().addClass("active");
        });
    });

    // adding quantity script starts
    $(".bas-room-details-container").delegate(".quantity-right-plus", "click", incrementSelectionCount);
    // adding quantity script ends

    // subtracting quantity script starts
    $(".bas-room-details-container").delegate(".quantity-left-minus", "click", decrementSelectionCount);
    // subtracting quantity script ends

    // SCRIPT for addroom button starts

    $(".bas-add-room").on('click', function() {
        addRoomModule();
        if (isIHCLCBHomePage()) {
            createguestCountContainer();
            // activate last room
            $('.bas-room-no').last().click();
        }
    });

    // SCRIPT for addroom button ends

    // adding active class when click on room no starts
    $(".bas-room-details-container").on("click", ".bas-room-no", function() {
        makeRoomActiveModule($(this));
    });
    // adding active class when click on room no ends

    // delete button script starts
    $(".bas-room-details-container").on("click", ".bas-room-delete-close", function(e) {
        e.stopPropagation();
        if ($(".bas-room-details").length > 1) {
            var roomDeleteIndex = $(this).closest('.bas-room-no').index('.bas-room-no');
            deleteRoomModule(roomDeleteIndex);
        }
    });

    // script by arvind ends
    $('.input-daterange input').blur(function(e) {
        $('.bas-hotel-details-container').removeClass('active');
    });

    $("#input-box1 , #input-box2").on('change', function(e) {
        updateFinalDatePlanModule();
        amaBookingObject.isAmaCheckAvailabilitySelected = true;
    });

    $('.active #input-box1').on('change', function(e) {
        var $nextInput = $('.input-box.date-explore').not($(this));
        var compareVal = $nextInput.val();

        var $self = $(this);
        var currVal = $(this).val();

        var bookingOptionsSelected = dataCache.session.getData("bookingOptions");
        var fromDateSelecetd = moment(bookingOptionsSelected.fromDate, "MMM Do YY").format("D MMM YY");

        if (currVal == fromDateSelecetd) {
            return;
        }

        setTimeout(function() {
            $(this).blur();
            $('.bas-calander-container').children().remove();
            $('#input-box2').focus();

            //var nextDate = moment(currVal, "D MMM YY").add(1, 'days');
			var nextDate = checkSameDayCheckout(currVal);

            if (isTajHolidays || getQueryParameter('holidaysOffer')) {
                var holidaysNights = 2;
                var holidaysCacheData = dataCache.session.getData('bookingOptions');
                if (holidaysCacheData && holidaysCacheData.nights)
                    holidaysNights = holidaysCacheData.nights;
                nextDate = moment(currVal, "D MMM YY").add(holidaysNights, 'days');
            }

            $nextInput.focus();
            $nextInput.datepicker('setDate', new Date(nextDate.toDate()));
            isToDateClickedTriggered = true;

            var $dateTable = $(".datepicker .datepicker-days table");
            updateFinalDatePlanModule();
			var shouldInvokeCalendarApi = document.getElementById("shouldInvokeCalendarApiBas").value;
			if(shouldInvokeCalendarApi){
                //***Removing Ama Calendar rates modified****//
                var getPathName = window.location.pathname;
                var getHostName = window.location.hostname;
                if(getHostName == 'www.amastaysandtrails.com' || getPathName.includes('/content/ama')){
                    return;
                } ///*** changes end ****///
				amacacalendarPricingBas();
				bindNextPrevClickAmaBas();
				$('#input-box2').trigger('click');						
			}

        }, 100);

    });

    $('#input-box2').on('change', function(e) {
        var $self = $(this);
        var isTargetInput = $self.closest('.bas-right-date-wrap').hasClass('active');
        var $nextInput = $('.input-box.date-explore').not($self);
        var compareVal = $nextInput.val();
        var currVal = $self.val();

        var bookingOptionsSelected = dataCache.session.getData("bookingOptions");
        var toDateSelecetd = moment(bookingOptionsSelected.toDate, "MMM Do YY").format("D MMM YY");

        if (isTargetInput) {

            setTimeout(function() {
                if (!isToDateClickedTriggered) {
                   hideCalenderInBookAStayPopup()
                    $self.parent().parent().removeClass("active");
                } else {
                    isToDateClickedTriggered = false;
                }

                $self.blur();

                if ((compareVal == currVal) && (compareVal != "") && (currVal != "")) {

                    //var nextDate = moment(currVal, "D MMM YY").add(1, 'days');
					var nextDate = checkSameDayCheckout(currVal);

                    if (isTajHolidays || getQueryParameter('holidaysOffer')) {
                        var holidaysNights = 2;
                        var holidaysCacheData = dataCache.session.getData('bookingOptions');
                        if (holidaysCacheData && holidaysCacheData.nights)
                            holidaysNights = holidaysCacheData.nights;
                        nextDate = moment(currVal, "D MMM YY").add(holidaysNights, 'days');
                    }

                    $self.datepicker('setDate', new Date(nextDate.toDate()));

                    var $dateTable = $(".datepicker .datepicker-days table");
                }
				
				
            }, 100);

            updateFinalDatePlanModule();

        }
    });

    // Click on Best available rate to proceed further
    $('.best-avail-rate').on('click', function(e) {
        var noOfNight = numberOfNightsCheck();
        var sebNights = sebNightsCheck();
        if (noOfNight == false) {
            numberOfNightsExcessWarning();
        }else if(sebNights == false){
            numberOfSebNightsExcessWarning();
        } else
            onClickOnCheckAvailabilty();
    });

    // removing links from search suggestion within booking widget
    $('.cm-bas-content-con').find('.suggestions-wrap').find('a').each(function() {
        $(this).removeAttr('href');
    });

    $('.promo-code').on("keyup", function() {
        var promoCodeInput = $(this).val();
        if (promoCodeInput.length > 0) {
            $('.apply-promo-code-btn').show();
            $('.promo-code-clear-input').show();
        } else {
            $('.apply-promo-code-btn').hide();
            $('.promo-code-clear-input').hide();
        }
    });

    $('.apply-promo-code-btn').on("click", function() {
        validatePromocode(_globalPromoCode);
    });

    $('.promo-code-clear-input').on("click", function() {
        $('.promo-code').val("");
        $(this).hide();
        $('.apply-promo-code-btn').hide();
        $('.promocode-status-text').text("");
        _globalPromoCode.value = null;
        _globalPromoCode.name = null;
    });

    $(".cm-bas-content-con .searchbar-input").keyup(function() {
        disableBestAvailableButton();

        $(this).attr("data-selected-search-value", "");
    });

    // Event listeners ends here
}

function numberOfNightsExcessWarning() {
    var popupParams = {
        title : 'Are you sure? You have selected more than 1O night.',
        callBack : onClickOnCheckAvailabilty.bind(),
        // callBackSecondary: secondaryFn.bind( _self ),
        needsCta : true,
        isWarning : true
    }
    warningBox(popupParams);
}
function numberOfSebNightsExcessWarning() {
    var popupParams = {
        title : 'Your maximum nights limit is exceeded.',
        callBack : modifySebNights,
        // callBackSecondary: secondaryFn.bind( _self ),
        needsCta : true,
        isWarning : true
    }
    warningBox(popupParams);
}
function modifySebNights(){
    $('.book-stay-btn').trigger('click');   
}

function navigateToRoomsPage(validationResult, clearExistingCart) {
    if (validationResult) {
        var nextPageHref;
        if (isAmaCheckAvailability) {
            nextPageHref = $('#checkAvailability').attr('hrefvalue');
        } else {
            nextPageHref = $('#global-re-direct').attr('hrefValue');
        }

        var bookingOptions = dataCache.session.getData("bookingOptions");
        if (clearExistingCart) {
            $(bookingOptions.roomOptions).each(function(index) {
                delete bookingOptions.roomOptions[index].userSelection;
            });
            bookingOptions.selection = [];
            $('.book-ind-container').css('display', 'none');
            $('.room-details-wrap, .bic-rooms').html('');
        }
        bookingOptions.isAvailabilityChecked = true;
        if (bookingOptions.rooms == 0) {
            bookingOptions.rooms = 1;
        }
        bookingOptions.previousRooms = bookingOptions.roomOptions;
        var BungalowType = bookingOptions.BungalowType
        if (!BungalowType) {
            BungalowType = null;
        }
        bookingOptions.previousDates = {
            fromDate : bookingOptions.fromDate,
            toDate : bookingOptions.toDate,
            BungalowType : BungalowType
        };
        dataCache.session.setData("bookingOptions", bookingOptions);
        var offerCodeIfAny = null;
        var onlyMemberRatesIfAny = null;
        var offerTitleIfAny = false;
        var holidaysOfferQueryParam = false;
        // [TIC-FLOW]
        //if (!isTicBased()) {
            //offerCodeIfAny = $('[data-offer-rate-code]').data('offer-rate-code');
			offerCodeIfAny = $('[data-offer-rate-code]:not(.tic-room-redemption-rates)').data('offer-rate-code');
        	onlyMemberRatesIfAny = getQueryParameter('onlyMemberRates');
            // HolidayOfferTitle
            offerTitleIfAny = getQueryParameter('offerTitle');
            holidaysOfferQueryParam = getQueryParameter('holidaysOffer');
        //}
        var usedVoucherCode = $('#usedVoucher').text();
        if (usedVoucherCode != undefined && usedVoucherCode != "" && usedVoucherCode != " ") {
            var bookingOptionsCache = dataCache.session.getData('bookingOptions');
            if (bookingOptionsCache.usedVoucherCode == usedVoucherCode) {
                offerCodeIfAny = "X5";
            }

        }
        if ($('#page-scope').attr('data-pagescope') == 'Taj Holidays')
            dataCache.session.setData("checkHolidayAvailability", true);
        else
            dataCache.session.setData("checkHolidayAvailability", false);

        if ($('.rate-code').val() || $('.promo-code').val() || $('.agency-id').val()) {
            var bookingSessionData = dataCache.session.getData("bookingOptions");
            var checkInDate = moment(bookingSessionData.fromDate, "MMM Do YY").format("YYYY-MM-DD");
            var checkOutDate = moment(bookingSessionData.toDate, "MMM Do YY").format("YYYY-MM-DD");

            var roomOptions = bookingSessionData.roomOptions;
            var roomOptionsLength = roomOptions.length;
            var adults, children;
            var searchHotelId = $("#hotelIdFromSearch").text();
            var rateCode = $('.rate-code').val();
            var agencyId = $('.agency-id').val();
            var promoAccessCode = $('.promo-code').val();
            for (var r = 0; r < roomOptionsLength; r++) {
                var adlt = roomOptions[r].adults;
                var chldrn = roomOptions[r].children;
                if (r == 0) {
                    adults = adlt;
                    children = chldrn;
                } else {
                    adults = adults + ',' + adlt;
                    children = children + ',' + chldrn;
                }
            }
         if(!!agencyId){
            var synxisRedirectLink = 'https://be.synxis.com/?' + 'arrive=' + checkInDate + '&depart=' + checkOutDate
            + '&rooms=' + roomOptionsLength + '&adult=' + adults + '&child=' + children + '&hotel='
            + searchHotelId + '&chain=21305' + '&currency=' + '&level=chain' + '&locale=en-US' + '&sbe_ri=0';
            	synxisRedirectLink = synxisRedirectLink + (!!agencyId ? '&agencyid=' + agencyId : '')
            + (!!rateCode ? '&&rate=' + rateCode : '') + (!!promoAccessCode ? '&promo=' + promoAccessCode : '');
            	nextPageHref = synxisRedirectLink;
            }else{
            	nextPageHref = nextPageHref + "?" +(!!rateCode ? '&&offerRateCode=' + rateCode : '') + (!!promoAccessCode ? '&promoCode=' + promoAccessCode : '');

                /*Check if GInger hotels*/
                if(searchHotelId == "99999"){
                    nextPageHref = nextPageHref + "&from=" + checkInDate + "&to=" + checkOutDate + "&rooms=" + roomOptionsLength + 
                        			"&adults=" + adults + "&children=" + children;
                    var tataNeuParams = localStorage.getItem("tataNeuParams");
                    if(tataNeuParams != null){
                    	nextPageHref = nextPageHref + "&" + tataNeuParams;
                	}

                    /* commenting old code 
                    var authCode = localStorage.getItem("authCode");
                    if(authCode != null){
                    	nextPageHref = nextPageHref + "&authCode=" + authCode;
                	}
                    var codeVerifier = localStorage.getItem("codeVerifier");
                    if(codeVerifier != null){
                    	nextPageHref = nextPageHref + "&codeVerifier=" + codeVerifier;
                	}
                    */
                }
			}
        }
        if (isAmaSite) {
            var offerRateCode = $('[data-offer-rate-code]:not(.tic-room-redemption-rates)').data('offer-rate-code');
			var publicRateshide = (getQueryParameter('publicRates')? '&publicRates='+getQueryParameter('publicRates') : '');
            if (offerRateCode) {
                nextPageHref = nextPageHref.concat('?offerRateCode=' + offerRateCode + '&checkAvail=true' + publicRateshide);
            } else if (promoAccessCode == null || promoAccessCode == '') {
                nextPageHref = nextPageHref.concat('?checkAvail=true');
            } else {
                nextPageHref = nextPageHref.concat('&checkAvail=true');
            }
            if(nextPageHref.indexOf("?") != -1) 
				nextPageHref = nextPageHref + checkandAppendOtherQueryParams();
            else
                nextPageHref = nextPageHref + "?" + checkandAppendOtherQueryParams();

            if (isAmaCheckAvailability) {
                if (isBungalowSelected()) {
                    nextPageHref += "&onlyBungalows=true";
                }
            } else {
                if ($('#onlyBungalowBtn').is(':checked')) {
                    nextPageHref += "&onlyBungalows=true";
                }
            }

        } else {
            debugger;
            var promoTabParamIfAny = getQueryParameter('promoCode');
            var rataTabParamIfAny = getQueryParameter('rateTab');
			var publicRateshide = getQueryParameter('publicRates');
            var promoCodeEnabled = $('#promoCode').val();
            if(promoCodeEnabled == 'true'){
                var pageParam = (!!offerCodeIfAny ? 'promoCode=' + offerCodeIfAny : '')
                        + (offerTitleIfAny ? '&offerTitle=' + offerTitleIfAny : '')
                        + (holidaysOfferQueryParam ? '&holidaysOffer=' + holidaysOfferQueryParam : '')
                        + (promoTabParamIfAny ? '&promoCode=' + promoTabParamIfAny : '')
                        + (rataTabParamIfAny ? '&rateTab=' + rataTabParamIfAny : '')
                        + (publicRateshide ? '&publicRates=' + publicRateshide : '');
                }
            else{
					var pageParam = (!!offerCodeIfAny ? 'offerRateCode=' + offerCodeIfAny : '')
                    		+ (onlyMemberRatesIfAny ? '&onlyMemberRates=' + onlyMemberRatesIfAny : '')
                            + (offerTitleIfAny ? '&offerTitle=' + offerTitleIfAny : '')
                            + (holidaysOfferQueryParam ? '&holidaysOffer=' + holidaysOfferQueryParam : '')
                            + (promoTabParamIfAny ? '&promoCode=' + promoTabParamIfAny : '')
                            + (rataTabParamIfAny ? '&rateTab=' + rataTabParamIfAny : '')
                            + (publicRateshide ? '&publicRates=' + publicRateshide : '');
            	}

            if (pageParam) {
                nextPageHref = nextPageHref + "?" + pageParam;
            }

            if(nextPageHref.indexOf("?") != -1) 
				nextPageHref = nextPageHref + checkandAppendOtherQueryParams();
            else
                nextPageHref = nextPageHref + "?" + checkandAppendOtherQueryParams();

        }
        if (nextPageHref.includes('amastaysandtrails.com')) {
            nextPageHref = nextPageHref.replace('rooms-and-suites', 'accommodations');
        }

        /*fixe for Microsite navigation in prod*/
		if(nextPageHref.includes('https://www.tajinnercircle.com')) {
			 nextPageHref = nextPageHref.replace('https://www.tajinnercircle.com/en-in', '/en-in/tajinnercircle');
		}
		if(nextPageHref.includes('https:/www.tajinnercircle.com')) {
			nextPageHref = nextPageHref.replace('https:/www.tajinnercircle.com/en-in', '/en-in/tajinnercircle');
		}

        if (domainChangeFlag) {
            if (nextPageHref.includes("?")) {
                if (nextPageHref.charAt(nextPageHref.length - 1) === "?") {
                    nextPageHref += fetchDateOccupancyAsQueryString();
                } else {
                    nextPageHref += "&" + fetchDateOccupancyAsQueryString();
                }
            } else {
                nextPageHref += "?" + fetchDateOccupancyAsQueryString();
            }
        }

		// handle page refresh for voucher redemption
		var voucherRedemption = dataCache.session.getData('voucherRedemption');
        var voucherShowRates = dataCache.session.getData('voucherRedemptionShowPrice');
		if(voucherRedemption && voucherRedemption == 'true'){
			nextPageHref = nextPageHref + "&voucherRedemption=true";
            if(voucherShowRates){
			nextPageHref = nextPageHref + "&voucherRedemption=true" + "&voucherPrice=true"
			}
		}

		if(modifyBookingState && modifyBookingState != ''){
			nextPageHref = window.location.href.split('?')[0];		
		}

		if(nextPageHref.includes('/ginger/')) {

			var bookingSessionData = dataCache.session.getData("bookingOptions");
            var checkInDate = moment(bookingSessionData.fromDate, "MMM Do YY").format("YYYY-MM-DD");
            var checkOutDate = moment(bookingSessionData.toDate, "MMM Do YY").format("YYYY-MM-DD");

            var roomOptions = bookingSessionData.roomOptions;
            var roomOptionsLength = roomOptions.length;
            var adults, children;
            var searchHotelId = $("#hotelIdFromSearch").text();
            var rateCode = $('.rate-code').val();
            var agencyId = $('.agency-id').val();
            var promoAccessCode = $('.promo-code').val();
            for (var r = 0; r < roomOptionsLength; r++) {
                var adlt = roomOptions[r].adults;
                var chldrn = roomOptions[r].children;
                if (r == 0) {
                    adults = adlt;
                    children = chldrn;
                } else {
                    adults = adults + ',' + adlt;
                    children = children + ',' + chldrn;
                }
            }

            if(getParamFromURL("from", nextPageHref) == null || getParamFromURL("to", nextPageHref) == null
             || getParamFromURL("rooms", nextPageHref) == null || getParamFromURL("adults", nextPageHref) == null 
             || getParamFromURL("children", nextPageHref) == null) {

                if(getParamFromURL("from", nextPageHref) == null)
                     nextPageHref = nextPageHref + "&from=" + checkInDate;

                if(getParamFromURL("to", nextPageHref) == null)
                     nextPageHref = nextPageHref + "&to=" + checkOutDate;

                if(getParamFromURL("rooms", nextPageHref) == null)
                     nextPageHref = nextPageHref + "&rooms=" + roomOptionsLength;

                if(getParamFromURL("adults", nextPageHref) == null)
                     nextPageHref = nextPageHref + "&adults=" + adults;

                if(getParamFromURL("children", nextPageHref) == null)
                     nextPageHref = nextPageHref + "&children=" + children;

                if(getParamFromURL("promoCode", nextPageHref) == null) 
                     nextPageHref = nextPageHref + "&promoCode=" + promoAccessCode;

                if(localStorage.getItem('tataNeuParams') != null){
                    nextPageHref = nextPageHref + "&" + localStorage.getItem('tataNeuParams');
                }
                 /*var authCode = localStorage.getItem("authCode");
                 if(authCode != null){
                     nextPageHref = nextPageHref + "&authCode=" + authCode;
                 }
                 var codeVerifier = localStorage.getItem("codeVerifier");
                 if(codeVerifier != null){
                     nextPageHref = nextPageHref + "&codeVerifier=" + codeVerifier;
                 }*/
            }
		}

        if(nextPageHref.indexOf('/ginger/') != -1 && nextPageHref.indexOf("/en-in/swt/?redirectUrl=") == -1) {
            nextPageHref = "/en-in/swt/?redirectUrl=" + nextPageHref;
        }

        window.location.href = nextPageHref;

        $(".cm-bas-con").removeClass("active");
    }
    $('#book-a-stay').trigger('taj:fetchRates', [ bookingOptions ]);
};

function getParamFromURL(name, customUrl) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(customUrl);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function checkandAppendOtherQueryParams(){
	var queryString = ''
	queryString += (getQueryParameter('gsoCorporateBooking')? '&gsoCorporateBooking='+getQueryParameter('gsoCorporateBooking') : '');
	queryString += (getQueryParameter('vouchershareholderflow')? '&vouchershareholderflow='+getQueryParameter('vouchershareholderflow') : '');
	queryString += (getQueryParameter('rateTab')? '&rateTab='+getQueryParameter('rateTab') : '');
	queryString += (getQueryParameter('qcvoucherCode')? '&qcvoucherCode='+getQueryParameter('qcvoucherCode') : '');
	queryString += (getQueryParameter('qcvoucherpin')? '&qcvoucherpin='+getQueryParameter('qcvoucherpin') : '');
	//queryString += (sessionStorage.getItem('source') != null? '&&source='+sessionStorage.getItem('source') : '');
    // new changes
    queryString += (getQueryParameter('source') != null? '&source='+getQueryParameter('source') : '');
    queryString += (getQueryParameter('utm_source') != null? '&utm_source='+getQueryParameter('utm_source') : '');
    queryString += (getQueryParameter('utm_medium') != null? '&utm_medium='+getQueryParameter('utm_medium') : '');
    queryString += (getQueryParameter('pincode') != null? '&pincode='+getQueryParameter('pincode') : '');
    queryString += (getQueryParameter('city') != null? '&city='+getQueryParameter('city') : '');
    queryString += (getQueryParameter('lat') != null? '&lat='+getQueryParameter('lat') : '');
    queryString += (getQueryParameter('long') != null? '&long='+getQueryParameter('long') : '');

	return queryString;
}

function onClickOnCheckAvailabilty() {
    var validationResult = validateSearchInput();

    if (isIHCLCBHomePage() && !(checkboxCheckedStatus() && isEntitySelected())) {
        return;
    }

    var bookingOptions = updateBookingOptionsInStorage(_globalPromoCode);

    var getHotelId;
    getHotelId = $("#hotelIdFromSearch").text();
    var dataId = dataCheck();
    checkPreviousSelection();
    var cartCheck = cartEmptyCheck();
    var check = false;
    if (getHotelId != dataId) {
        check = true;
    }
    var _self = this;
    if (modifyBookingState == 'modifyDate') {
        var modifiedCheckInDate = moment($('#input-box1').datepicker('getDate')).format("MMM Do YY");
        var modifiedCheckOutDate = moment($('#input-box2').datepicker('getDate')).format("MMM Do YY");
        if (modifiedCheckInDate != bookedCheckInDate || modifiedCheckInDate != bookedCheckOutDate) {
            var warnMsg = 'You have changed Check-In/Check-Out date. Are you sure you want to continue?';
            showWarningMessage(_self, warnMsg, validationResult);
        } else {
            $('.bas-close').trigger('click');
            // or we will redirect to confirmation page with previous
            // booking details
        }
    } else if (modifyBookingState == 'modifyRoomOccupancy') {
        var modifiedAdultsOccupancy = $('.bas-no-of-adults input').val();
        var modifiedChildrenOccupancy = $('.bas-no-of-child input').val();
        if (modifiedAdultsOccupancy != bookedAdultsOccupancy || modifiedChildrenOccupancy != bookedChildrenOccupancy) {
            var warnMsg = 'You have changed Adult/Child occupancy. Are you sure you want to continue?';
            showWarningMessage(_self, warnMsg, validationResult);
        } else {
            $('.bas-close').trigger('click');
            // or we will redirect to confirmation page with previous
            // booking details
        }
    } else if (modifyBookingState == 'modifyAddRoom') {
        var clearExistingCart = true;
        var warnMsg = 'You have added room. Are you sure you want to continue?';
        showWarningMessage(_self, warnMsg, validationResult);
    } else if (!cartCheck && (check || availabilityObj.isCheckParamsUpdated || availabilityObj.isDatesUpdated)) {
        var clearExistingCart = true;
        var warnMsg = 'Your existing cart values, if any, will be lost because you have updated your selection. Do you want to proceed?';
        showWarningMessage(_self, warnMsg, validationResult);
    } else if (isAmaSite && availabilityObj.isRoomTypeUpdated) {
        var warnMsg = 'You have updated your room type. Do you want to proceed?';
        showWarningMessage(_self, warnMsg, validationResult);
    } else {
        navigateToRoomsPage(validationResult);
    }
}

function showWarningMessage(_self, msg, validationResult) {
    var popupParams = {
        title : msg,
        callBack : navigateToRoomsPage.bind(_self, validationResult, true),
        // callBackSecondary: secondaryFn.bind( _self ),
        needsCta : true,
        isWarning : true
    }
    warningBox(popupParams);
}

function updateRoomNumberText() {
    var room = "Room";
    if ($(".bas-room-details").length > 1)
        room = "Rooms";
    else
        room = "Room";
    $(".room-border").text($(".bas-room-details").length + " " + room);
}

function dataCheck() {
    var cartHotelId;
    var bookingData = dataCache.session.getData("bookingOptions");
    if (bookingData && bookingData.selection && (bookingData.selection.length > 0)) {
        cartHotelId = bookingData.selection[0].hotelId;
    }
    return cartHotelId;
}

// _globalListOfPromoCode=['PROMO1','PROMOX'];
function validatePromocode(_globalPromoCode) {
    var promoCodeInput = $('.promo-code').val();
    promoCodeInput = promoCodeInput.toUpperCase();
    var promoCodeStatus = true;
    if (promoCodeStatus) {
        $('.promocode-status-text').text("Promo code selected: " + promoCodeInput);
        _globalPromoCode.value = promoCodeInput;
        _globalPromoCode.name = promoCodeInput;
    } else {
        $('.promocode-status-text').text("Promo code invalid.");
        _globalPromoCode.value = null;
        _globalPromoCode.name = null;
    }
}

function cartEmptyCheck() {
    var dataa = dataCache.session.getData("bookingOptions");
    if (dataa.selection && (dataa.selection.length == 0)) {
        return true;
    } else {
        return false;
    }
}

function incrementSelectionCount(e) {
    // Stop acting like a button
    e.preventDefault();
	e.stopPropagation();
	e.stopImmediatePropagation();
    amaBookingObject.isAmaCheckAvailabilitySelected = true;
    // Get the field name
    var $button = $(this);
    var quantity = parseInt($button.parent().parent().find("input").val());
    ++quantity;
    if (isAmaSite) {
        if ($(".ama-theme .bas-about-room-container").css("display") == "block") {
            if ($button.hasClass('quantity-right-plus1')){
                if (quantity > 10) {
                    quantity = 10;
                }

                }
            else{
					if (quantity > 7) {
                    quantity = 7;
                }
            }

        } else {
            if ($button.hasClass('quantity-right-plus1')) {
                if (quantity > 16) {
                    quantity = 16;
                }
            } else {
                if (quantity > 8) {
                    quantity = 8;
                }
            }
        }
    } else {
        if (quantity > 7) {
            quantity = 7;
        }
    }
    $button.parent().parent().find("input").val(quantity);
    $button.parent().parent().find("input").text(quantity);
    var x = $button.parent().parent().parent().attr("class");
    // script for adult count starts
    updateTotalAdultsCountModule();
    // script for adult count ends
	return false;
};

function decrementSelectionCount(e) {
    // Stop acting like a button
    amaBookingObject.isAmaCheckAvailabilitySelected = true;
    e.preventDefault();
	e.stopPropagation();
	e.stopImmediatePropagation();
    // Get the field name
    var $button = $($(this)[0])
    var quantity = parseInt($button.parent().parent().find("input").val());
    var x = $button.parent().parent().parent().attr("class");
    if (quantity > 0) {
        if (x === "bas-no-of-adults" && quantity == 1) {
            quantity = 2;
        }
        $button.parent().parent().find("input").val(quantity - 1);
    }
    // script for adult count starts
    updateTotalAdultsCountModule();
    // script for adult count ends
};

// module to update total adults count in booking widget
function updateTotalAdultsCountModule() {
    var totalAdultsCount = 0;
    $('.bas-no-of-adults, .bas-no-of-child').find('input').each(function() {
        totalAdultsCount += parseInt($(this).val());
    });
    var guestSuffix = (totalAdultsCount > 1) ? 's' : '';
    $(".bas-count-of-adults").text(totalAdultsCount + " Guest" + guestSuffix);
}

function checkPreviousSelection() {
    var bookingOptions = dataCache.session.getData("bookingOptions");
    if (bookingOptions.isAvailabilityChecked) {
        bookingOptions.previousRooms
                .forEach(function(value, index) {
                    if (bookingOptions.roomOptions[index]
                            && ((value.adults != bookingOptions.roomOptions[index].adults) || (value.children != bookingOptions.roomOptions[index].children))) {
                        availabilityObj.isCheckParamsUpdated = true;
                    }
                });

        if ((bookingOptions.fromDate != bookingOptions.previousDates.fromDate)
                || (bookingOptions.toDate != bookingOptions.previousDates.toDate)) {
            availabilityObj.isDatesUpdated = true;
        }
        if (isAmaSite && bookingOptions.BungalowType && bookingOptions.previousDates
                && bookingOptions.previousDates.BungalowType
                && bookingOptions.previousDates.BungalowType != bookingOptions.BungalowType) {
            availabilityObj.isRoomTypeUpdated = true;
        }

    }
}

// module to add room
function addRoomModule() {

    var room_no = $(".bas-room-no").length + 1;
    if (room_no < 6) {
        $(".bas-add-room")
                .before(
                        '<li class="bas-room-no" id=room'
                                + room_no
                                + '><button class="btn-only-focus" aria-label = "bas room"><span class="bas-room bas-desktop">Room &nbsp</span><span class="bas-span-room-no">'
                                + room_no
                                + '</span></button><div class="bas-room-delete-close"><i class="icon-close"><button class="btn-only-focus" aria-label = "close icon"></button></i></div></li>');

        $($(".bas-room-details")[0]).clone().appendTo(".bas-room-details-container").addClass("bas-hide");

        var x = room_no;
        room_no--;
        $($(".bas-room-details")[room_no]).attr("id", "room" + x + "Details");
        $($(".bas-room-details")[room_no]).find("input").val("1");
        $($($(".bas-room-details")[room_no]).find("input")[1]).val("0");
        updateTotalAdultsCountModule();

        // update text for number of rooms
        updateRoomNumberText();
        var elRoomNumber = $(".bas-about-room-container").find('.bas-room-no');
        if (elRoomNumber.length >= 5) {
            $(".bas-add-room").addClass("bas-hide");
        } else {
            $(".bas-add-room").removeClass("bas-hide");
        }
        // script to make newly added room active

        makeRoomActiveModule($('.bas-room-no').last());
        $('.bas-room-delete-close .icon-close').removeClass('cm-hide');
    }
};

function isIHCLCBHomePage() {
    var currentPage = window.location.pathname;
    return currentPage.includes('/dashboard');
}

function deleteRoomInCartAndUpdateSelectionData(deleteRoomNumber) {
    var deleteRoomIndex = deleteRoomNumber - 1;
    $($('.fc-add-package-con')[deleteRoomIndex]).find('.selection-delete').trigger('click');
    var bookingOptionsInStorage = dataCache.session.getData("bookingOptions");
    var roomOptionsModified = bookingOptionsInStorage.roomOptions;
    roomOptionsModified.splice(deleteRoomIndex, 1);
    bookingOptionsInStorage.roomOptions = roomOptionsModified;
    --bookingOptionsInStorage.rooms;
    dataCache.session.setData("bookingOptions", bookingOptionsInStorage);
    updateCheckAvailability();
    $(".fc-add-package-con").eq(deleteRoomIndex).remove();
    updateRoomIndexForSelectedPackages();
    setCartPanelRoomsConWidth();
    updateSelectionInstruction();
}

function updateRoomIndexForSelectedPackages() {
    var bookingOptionsInStorage = dataCache.session.getData("bookingOptions");
    bookingOptionsInStorage.selection.forEach(function(value, index) {
        value.roomIndex = index;
    });
    dataCache.session.setData("bookingOptions", bookingOptionsInStorage);
}

// module to delete room
function deleteRoomModule(roomDeleteIndex) {
    $('.bas-room-no').eq(roomDeleteIndex).remove();
    $('.bas-room-details').eq(roomDeleteIndex).remove();
    var totalRoomsAfterDeletion = $('.bas-room-details').length;
    if (totalRoomsAfterDeletion < 2) {
        $('.bas-room-delete-close .icon-close').addClass('cm-hide');
    }
    var roomID = 1;
    $('.bas-room-no').each(function() {
        $(this).attr('id', 'room' + roomID);
        $(this).find('.bas-span-room-no').text(roomID);
        ++roomID;
    });
    roomID = 1;
    $('.bas-room-details').each(function() {
        $(this).attr('id', 'room' + roomID + "Details");
        ++roomID;
    });

    if ($('.bas-room-no').hasClass('bas-active') == false) {
        if ($('.bas-room-no').eq(roomDeleteIndex).length > 0) {
            makeRoomActiveModule($('.bas-room-no').eq(roomDeleteIndex));
        } else {
            makeRoomActiveModule($('.bas-room-no').eq(roomDeleteIndex - 1));
        }
    }
    deleteRoomInCartAndUpdateSelectionData(roomDeleteIndex + 1);

    // update for adults count starts
    updateTotalAdultsCountModule();
    // update for adults count ends
    // update text for number of rooms
    updateRoomNumberText();
    $(".bas-add-room").removeClass("bas-hide");
};

// module to make room active
function makeRoomActiveModule(elem) {
    $(".bas-room-no").each(function() {
        $(this).removeClass("bas-active");
    });

    var new_room_no = elem.attr("id") + "Details";

    $(".bas-room-details-container").find("ul").each(function() {
        $(this).addClass("bas-hide");
    });
    $($(".bas-room-details-container").find("ul")[0]).removeClass("bas-hide");
    $(".bas-room-details-container").find("ul#" + new_room_no).removeClass("bas-hide");

    elem.addClass("bas-active");
}

// module to update final date plan
function updateFinalDatePlanModule() {

    var currentDate = moment($("#input-box1").datepicker("getDate")).format("D MMM YY");
    var nextDate = moment($("#input-box2").datepicker("getDate")).format("D MMM YY");
    var finalDatePlan = currentDate + " - " + nextDate;

    $(".final-date-plan").text(finalDatePlan);
};

// module to update booking storage data
function updateBookingOptionsInStorage(_globalPromoCode) {
    var bookingOptions = dataCache.session.getData("bookingOptions") || getInitialBookAStaySessionObject();
    bookingOptions.promoCode = _globalPromoCode.value;
    bookingOptions.promoCodeName = _globalPromoCode.name;
    var currentDate;
    var nextDate;
    var totalRoomsOpted;
    var targetEntity;
    if (isAmaCheckAvailability) {
        var roomsSelector = $('.guests-dropdown-wrap .guest-room-header');
        currentDate = parseDate($("#input-box-from").val());
        nextDate = parseDate($("#input-box-to").val());
        totalRoomsOpted = roomsSelector.length;
        targetEntity = $('.check-avblty-wrap .select-dest-placeholder').text();
        bookingOptions = fetchRoomOptionsSelected(bookingOptions);
        if (isBungalowSelected()) {
            bookingOptions["BungalowType"] = "onlyBungalow";
        } else {
            bookingOptions["BungalowType"] = "IndividualRoom";
        }
    } else {
        currentDate = parseSelectedDate($("#input-box1").datepicker("getDate"));
        nextDate = parseSelectedDate($("#input-box2").datepicker("getDate"));
        if (isIHCLCBSite()) {
            totalRoomsOpted = $('.ihclcb-bas-room-no').length;
        } else {
            totalRoomsOpted = $('.bas-room-no').length;
        }
        targetEntity = $('.searchbar-input').val();
        bookingOptions = fetchRoomOptionsSelected(bookingOptions);
        if (isAmaSite) {
            bookingOptions["BungalowType"] = fetchRadioButtonSelectedAma();
            targetEntity = $('#booking-search .dropdown-input').text();
        }
    }
    if (isAmaSite && bookingOptions.BungalowType && bookingOptions.previousDates
            && bookingOptions.previousDates.BungalowType
            && bookingOptions.BungalowType != bookingOptions.previousDates.BungalowType) {
        bookingOptions.selection = [];
    }
    bookingOptions.fromDate = currentDate;
    bookingOptions.toDate = nextDate;
    bookingOptions.rooms = totalRoomsOpted;
    bookingOptions.targetEntity = targetEntity;
    bookingOptions.nights = moment(nextDate, "MMM Do YY").diff(moment(currentDate, "MMM Do YY"), 'days');
    updateHotelChainCodeAndHoteID(bookingOptions);
    dataCache.session.setData("bookingOptions", bookingOptions);

    // Updates the check availability component's data
    updateCheckAvailability();

    updateFinalDatePlanModule();

    // Update the floating cart values on updation of inputs from BAS widget
    var elFloatingCart = $('.book-ind-container');

    return bookingOptions;
};

function fetchRadioButtonSelectedAma() {
    if ($('.book-stay-popup-radio-btn #onlyBungalowBtn').is(':checked')) {
        return "onlyBungalow";
    }
    return "IndividualRoom";
}

function fetchRoomOptionsSelected(bookingOptions) {
    console.log('Booking Room options '+bookingOptions.roomOptions);
    var selectedRoomOption = bookingOptions.roomOptions ? extractObjectValues(bookingOptions.roomOptions) : [];
    bookingOptions.roomOptions = [];
    var userSelectionList = [];
    $(selectedRoomOption).each(function() {
        userSelectionList.push(this.userSelection);
    });
    if (isAmaSite && isAmaCheckAvailability) {
        return updateRoomOptionsBookAStayAma(bookingOptions, userSelectionList);
    } else {
        return updateRoomOptionsBookAStay(bookingOptions, userSelectionList);
    }


}

function updateRoomOptionsBookAStayAma(bookingOptions, userSelectionList) {
    $('.guests-dropdown-wrap .guest-room-header').each(function(index) {
        var $this = $(this);
        var adultsCount = $this.find('.adult-wrap .counter').text();
        var childrenCount = $this.find('.children-wrap .counter').text();
        var selectedObject = {
            'adults' : adultsCount,
            'children' : childrenCount,
            'initialRoomIndex' : index,
            'userSelection' : userSelectionList[index]
        };
        bookingOptions.roomOptions.push(selectedObject);
        if (bookingOptions.selection && bookingOptions.selection.length > 0 && bookingOptions.selection[index]) {
            bookingOptions.selection[index].adults = adultsCount;
            bookingOptions.selection[index].children = childrenCount;
        }
    });
    return bookingOptions;
}

function updateRoomOptionsBookAStay(bookingOptions, userSelectionList) {
    var $roomDetailsCont = $('.bas-room-details');
    if (isIHCLCBHomePage()) {
        $roomDetailsCont = $('.ihclcb-bas-room-details');
    }
    $roomDetailsCont.each(function(index) {
        var selectedHeadCount = $(this).find('.bas-quantity');
        var adultsCount = selectedHeadCount[0].value;
        var childrenCount = selectedHeadCount[1].value;
        var selectedObject = {
            'adults' : adultsCount,
            'children' : childrenCount,
            'initialRoomIndex' : index,
            'userSelection' : userSelectionList[index]
        };
        bookingOptions.roomOptions.push(selectedObject);
        if (bookingOptions.selection && bookingOptions.selection.length > 0 && bookingOptions.selection[index]) {
            bookingOptions.selection[index].adults = adultsCount;
            bookingOptions.selection[index].children = childrenCount;
        }
    });
    return bookingOptions;
}

function isBungalowSelected() {
    return $('.check-avblty-container .radio-container #onlyBungalow').is(':checked');
}

// ie fall back for object.values
function extractObjectValues(objectName) {
    return (Object.keys(objectName).map(function(objKey) {
        return objectName[objKey]
    }))
}
// changing date to "MMM Do YY" format
function parseSelectedDate(selectedDateValue) {
    var formatedDate = moment(selectedDateValue, "D MMM YY").format("MMM Do YY");
    return formatedDate;
}

function getInitialRoomOption() {
    return [ {
        adults : 1,
        children : 0,
        initialRoomIndex : 0
    } ];
}

// return session Object for book a stay
function getInitialBookAStaySessionObject() {
    var toDateForBooking = initialBookingSetup();
    return {
        fromDate : moment(new Date()).add(1, 'days').format("MMM Do YY"),
        toDate : toDateForBooking,
        rooms : 1,
        nights : 1,
        roomOptions : getInitialRoomOption(),
        selection : [],
        promoCode : null,
        hotelChainCode : null,
        hotelId : null,
        isAvailabilityChecked : false
    };
}

// set book a stay session data
// function setBookAStaySessionObject() {
// var bookingOptionsSelected = dataCache.session.getData("bookingOptions") || getInitialBookAStaySessionObject();
// dataCache.session.setData("bookingOptions", bookingOptionsSelected);
// }

function removePopulatedRoomsBookAStay(_this) {
    _this.each(function(i, ele) {
        if (i > 0) {
            ele.remove();
        }
    });
}

function populateAmaRoomTypeRadioButton(bookingOptionsSelected) {
    var roomType = bookingOptionsSelected.roomType || bookingOptionsSelected.BungalowType;
    if (roomType && roomType == "onlyBungalow") {
        $('#book-a-stay .radio-button #onlyBungalowBtn').click();
    } else {
        $('#book-a-stay .radio-button #onlyRoomBtn').click();
    }
}

// auto updating booking widget with respect to storage data
function autoPopulateBookAStayWidget() {
    var bookingOptionsSelected;
    if (isAmaSite && amaBookingObject.isAmaCheckAvailabilitySelected) {
        bookingOptionsSelected = Object.assign({}, amaBookingObject);
        populateAmaRoomTypeRadioButton(bookingOptionsSelected);		
    } else {
        bookingOptionsSelected = dataCache.session.getData("bookingOptions") || getInitialBookAStaySessionObject();
        populateAmaRoomTypeRadioButton(bookingOptionsSelected);
        updateHotelChainCodeAndHoteID(bookingOptionsSelected);
        dataCache.session.setData("bookingOptions", bookingOptionsSelected);
    }

	
    // var fromDateSelecetd = moment(bookingOptionsSelected.fromDate, "MMM Do YY").format("D MMM YY");
    // var toDateSelecetd = moment(bookingOptionsSelected.toDate, "MMM Do YY").format("D MMM YY");

    // $('#input-box1').val(fromDateSelecetd);
    // $('#input-box2').val(toDateSelecetd);
	

    var roomOptionsSelected = bookingOptionsSelected.roomOptions;

    removePopulatedRoomsBookAStay($(".bas-room-no"));
    removePopulatedRoomsBookAStay($(".bas-room-details"));

    roomOptionsSelected.forEach(function(val, index) {
        if (index > 0) {
            addRoomModule();
        }

        var currentIndexRoom = $($('.bas-room-details')[index]);
        $(currentIndexRoom[0]).find('.bas-no-of-adults input').val(val.adults);
        $(currentIndexRoom[0]).find('.bas-child-no-container input').val(val.children);
    });

    if (bookingOptionsSelected.promoCode) {
        $('.promo-code').val(bookingOptionsSelected.promoCode);
        $('.promocode-status-text').text("Promo code selected: " + bookingOptionsSelected.promoCode);
    }

    if ($('.cm-page-container').hasClass('specific-hotels-page')
            || $('.cm-page-container').hasClass('destination-layout')) {
        var targetEntitySelected = $('.banner-titles .cm-header-label').text();
        $('.specific-hotels-page, .destination-layout').find('.cm-bas-content-con .searchbar-input').val(
                targetEntitySelected);
        var rootPath = fetchRootPath();
        if (rootPath) {
            rootUrl = rootPath;
            if ($.find("[data-hotel-id]")[0]) {
                $('#hotelIdFromSearch').text($($.find("[data-hotel-id]")[0]).data().hotelId);
            }
            enableBestAvailableButton(rootUrl);
        }
        $('.cm-bas-content-con .searchbar-input').attr("data-selected-search-value", targetEntitySelected);
    }

    // Updates the check availability component's data
    updateCheckAvailability();

    makeRoomActiveModule($('.bas-room-no').first());
    promptToSelectDate();

    updateTotalAdultsCountModule();
}

// destroy datepicker
function destroyDatepicker() {
    $('.bas-datepicker-container .input-daterange').datepicker('destroy');
    $(".cm-bas-con").removeClass("active");
    $('.cm-page-container').removeClass("prevent-page-scroll");
	if($('#book-a-stay').data('theme') == 'ama-theme'){
		$('.select-dest-placeholder').val('');
		$('#select-results')[0].classList.add("d-none");
	}
};

//overlay destroy datapicker
function overlayDestroyDatepicker() {
   // $('.bas-datepicker-container .input-daterange').datepicker('destroy');
    $(".cm-bas-con").removeClass("active");
    $('.cm-page-container').removeClass("prevent-page-scroll");
	if($('#book-a-stay').data('theme') == 'ama-theme'){
		$('.select-dest-placeholder').val('');
		$('#select-results')[0].classList.add("d-none");
	}
};

// inititalize calendar
function initiateCalender() {
    availabilityObj = {};
    // calender input date
    var fromDate = dataCache.session.data.bookingOptions.fromDate;
    var toDate = dataCache.session.data.bookingOptions.toDate;
    if (isAmaSite && amaBookingObject.isAmaCheckAvailabilitySelected) {
        fromDate = amaBookingObject.fromDate;
        toDate = amaBookingObject.toDate;
    }
    var storageFromDate = moment(fromDate, "MMM Do YY").toDate() || null;
    var storageToDate = moment(toDate, "MMM Do YY").toDate() || null;

    // var tommorow = moment(new Date()).add(1, 'days')['_d'];
    var d1 = storageFromDate || moment(new Date()).add(1, 'days')['_d'];
    //var d2 = storageToDate || moment(new Date()).add(2, 'days')['_d'];

	var d2 = storageToDate || toDateForBooking();

    // const
    // monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];

    var output1 = moment(d1).format("D MMM YY");
    var output2 = moment(d2).format("D MMM YY");

    initializeDatepickerForBookAStay($('.bas-datepicker-container .input-daterange'), $('.bas-calander-container'));

    $("#input-box1").datepicker("setDate", new Date(moment(output1, "D MMM YY").toDate()));
    $("#input-box2").datepicker("setDate", new Date(moment(output2, "D MMM YY").toDate()));

    setTimeout(function() {
        $("#input-box1").blur();
        $("#input-box2").blur();
    }, 105);
};

function initializeDatepickerForBookAStay(ele, container) {
    ele.datepicker({
        container : container,
        format : 'd M yy',
        startDate : new Date(),
		changeMonth: false,
		changeYear: false,
		stepMonths: 0,
		firstDay: 1,
        templates : {
            leftArrow : '<i class="icon-prev-arrow inline-block"></i>',
            rightArrow : '<i class="icon-prev-arrow inline-block cm-rotate-icon-180 v-middle"></i>'
        }
    });	
}

function hideCalenderInBookAStayPopup() {
    $('.bas-calander-container').removeClass('active');
    $('.bas-calander-container>.datepicker').css('display', 'none');
    $('.bas-hotel-details-container').removeClass('active');
}

function validateSearchInput() {
    // validate using data value in searcbar input
    var searchInputValue = "";
    if ($('#book-a-stay').data('theme') == 'ama-theme') {
        var dropdownText = isAmaCheckAvailability ? $('.check-avblty-wrap .select-dest-placeholder').text() : $(
                '.cm-bas-content-con .dropdown-input').text();
        if (dropdownText != "Select Destinations/Bungalows")
            searchInputValue = dropdownText;
    } else {
        searchInputValue = $('.cm-bas-content-con .searchbar-input').attr("data-selected-search-value");
    }
    if (!searchInputValue) {
        $('.cm-bas-content-con .searchbar-input').effect('shake', {
            "distance" : "5"
        });
        disableBestAvailableButton();
        return false;
    }
    return true;
}

function disableBestAvailableButton() {
    changeBookStayButtonStatus();
    $('.bas-final-detail-wrap').css("display", "none");
    $('#global-re-direct').removeAttr('hrefValue');
}

function changeBookStayButtonStatus() {
    $('.best-avail-rate ').css({
        "opacity" : "0.5"
    });
    $(".best-avail-rate").toggleClass('best-avail-rate-disable', true);
    $(".best-avail-rate").toggleClass('best-avail-rate-enable', false);
}

function getHotelRoomsRootPath() {
    var hiddenDom = $.find("[data-hotel-roomspath]")[0];
    if (hiddenDom != undefined) {
        var hotelRoomspath = $(hiddenDom).data().hotelRoomspath;
        if (hotelRoomspath != undefined && hotelRoomspath.startsWith('https://www.tajhotels.com')) {
            hotelRoomspath = hotelRoomspath.substring(25)
        } else if (hotelRoomspath != undefined && hotelRoomspath.startsWith('https://www.vivantahotels.com')) {
            hotelRoomspath = hotelRoomspath.substring(29)
        } else if (hotelRoomspath != undefined && hotelRoomspath.startsWith('https://www.seleqtionshotels.com')) {
            hotelRoomspath = hotelRoomspath.substring(32)
        }

        return hotelRoomspath;
    }
}

function getDestinationRootPath() {
    var hiddenDom = $.find("[data-destination-rootpath]")[0];
    if (hiddenDom != undefined)
        return $(hiddenDom).data().destinationRootpath
}

function fetchRootPath() {
    var destinationRootPath = getDestinationRootPath();
    var hotelRoomsPath = getHotelRoomsRootPath();
    if (destinationRootPath != undefined)
        return destinationRootPath;

    return hotelRoomsPath;
}

function enableBestAvailableButton(redirectUrl, noUrlStatus) {
    if (!noUrlStatus) {
        $('#global-re-direct, #checkAvailability').attr('hrefValue', redirectUrl);
    }
    if (isAmaSite) {
        $('#checkAvailability').addClass('enabled');
    }
    if (isIHCLCBHomePage() && !(checkboxCheckedStatus() && isEntitySelected())) {
        return;
    }

    $('.best-avail-rate ').css({
        "opacity" : "1",
    });

    $(".best-avail-rate").toggleClass('best-avail-rate-disable', false);
    $(".best-avail-rate").toggleClass('best-avail-rate-enable', true);
    $('.bas-final-detail-wrap').css("display", "inline-block");
    if (retainHolidaysFlow(redirectUrl)) {
        redirectUrl = redirectUrl + "?taj-holiday-redemption";
    }

}

function checkboxCheckedStatus() {
    return $('.ihclcb-checkbox-cont .mr-filter-checkbox').prop("checked");
}

function fetchDateOccupancyAsQueryString() {
    var queryString = '';
    try {
        var bookingOptions = dataCache.session.getData('bookingOptions');
        if(typeof bookingOptions !== 'undefined') { 
            var from = moment(bookingOptions.fromDate, "MMM Do YY").format('DD/MM/YYYY');
            var to = moment(bookingOptions.toDate, "MMM Do YY").format('DD/MM/YYYY');
            var roomOptionArr = bookingOptions.roomOptions;
            var rooms = bookingOptions.roomOptions.length;
            var adults = '';
            var children = '';
            if (roomOptionArr) {
                roomOptionArr.forEach(function(roomObj, index) {
                    adults += roomObj.adults + ",";
                    children += roomObj.children + ",";
                });
                adults = adults.substring(0, adults.length - 1);
                children = children.substring(0, children.length - 1);
            }
            queryString = "from=" + from + "&to=" + to + "&rooms=" + rooms + "&adults=" + adults + "&children=" + children;
        }
    } catch (err) {
        console.error("Error Occured while forming query String using session data ", err);
    }
    return queryString;
}

function retainHolidaysFlow(redirectUrl) {
    var retainHolidays = false;
    var substringUrl = redirectUrl;
    if (redirectUrl && redirectUrl.endsWith(".html")) {
        substringUrl = redirectUrl.substring(0, redirectUrl.length - 5);
    }

    var currentUrl = window.location.href;
    if (currentUrl.indexOf("?taj-holiday-redemption") != -1) {
        if (currentUrl.indexOf(substringUrl) != -1) {
            retainHolidays = true;
        }
    }
    return retainHolidays;
}

function updateHotelChainCodeAndHoteID(bookingOptions) {
    var hotelIdAndChainCodeData = $($.find("[data-hotel-id]")[0]).data();
    if (hotelIdAndChainCodeData) {
        bookingOptions.hotelChainCode = hotelIdAndChainCodeData.hotelChainCode || CHAIN_ID;
        bookingOptions.hotelId = hotelIdAndChainCodeData.hotelId;
    }
}

function numberOfNightsCheck() {
    var currentDate = parseSelectedDate($("#input-box1").datepicker("getDate"));
    var nextDate = parseSelectedDate($("#input-box2").datepicker("getDate"));
    var numberOFNights = moment(nextDate, "MMM Do YY").diff(moment(currentDate, "MMM Do YY"), 'days');
    if (numberOFNights > 10 && $('.best-avail-rate ').hasClass('best-avail-rate-enable'))
        return false;
    else
        return true;

}

function checkHolidayScope() {
    if (!dataCache.session.getData("checkHolidayAvailability")) {
        var bookingOptionsHoliday = dataCache.session.getData("bookingOptions");

        var fromDate = bookingOptionsHoliday.fromDate;
        if (!fromDate || fromDate == '') {
            fromDate = moment(new Date()).add(3, 'days').format("MMM Do YY");
            bookingOptionsHoliday.fromDate = fromDate;
        }

        var toDate = bookingOptionsHoliday.toDate;
        if (!toDate || toDate == '') {
            toDate = moment(new Date()).add(5, 'days').format("MMM Do YY");
            bookingOptionsHoliday.toDate = toDate;
        }

        bookingOptionsHoliday.nights = moment(toDate, "MMM Do YY").diff(moment(fromDate, "MMM Do YY"), 'days');

        var rooms = bookingOptionsHoliday.rooms;
        if (!rooms) {
            rooms = 1;
            bookingOptionsHoliday.rooms = rooms;
        }

        if (!bookingOptionsHoliday.roomOptions) {
            bookingOptionsHoliday.roomOptions = [ {
                adults : 2,
                children : 0,
                initialRoomIndex : 0
            } ];
        }
        dataCache.session.setData("bookingOptions", bookingOptionsHoliday);
        updateCheckAvailability();
    }
}

function dateOccupancyInfoSticky() {
    if ($('.search-container.check-availability-main-wrap').length > 0) {
        var stickyOffset = $('.search-container.check-availability-main-wrap ').offset().top;

        $(window).scroll(function() {
            var sticky = $('.search-container.check-availability-main-wrap '), scroll = $(window).scrollTop();

            if (scroll >= stickyOffset)
                sticky.addClass('mr-stickyScroll');
            else
                sticky.removeClass('mr-stickyScroll');
        });

    }
}

// [TIC-FLOW]
function isTicBased() {
    // checking if any rate code is there in dom which is of TIC Room redemption
    // flow
    var userDetails = getUserData();
    if (userDetails && userDetails.loyaltyInfo && userDetails.loyaltyInfo.length > 0 && $(".tic-room-redemption-rates").length) {
        return true;
    }

    return false;
}

function resetPromoCodeTab() {
    $('.promo-code').val("");
    $('.apply-promo-code-btn').hide();
    $('.promocode-status-text').text("");
    _globalPromoCode = {
        name : null,
        value : null
    };
}

// [IHCL-FLOW]
var entityDetailsObj = new Object();
function fetchIHCLCBEntityDetails() {
    var ihclCbBookingObject = dataCache.session.getData("ihclCbBookingObject");
    if (ihclCbBookingObject && ihclCbBookingObject.isIHCLCBFlow) {
        var entityDetailsData = ihclCbBookingObject.entityDetails;
        if (!entityDetailsData) {
            return;
        }
        for (var entity = 0; entity < entityDetailsData.length; entity++) {
            var partyObj = {};
            var cityObj = {};
            var entityCity = entityDetailsData[entity].city;
            var entityType = entityDetailsData[entity].AccountType_c;
            var entityExisting = entityDetailsObj[entityType];
            if (entityExisting) {
                var exisitingEle = null; // = entityDetailsObj[entityType];
                for ( var cty in entityDetailsObj[entityType]) {
                    if (Object.keys(entityDetailsObj[entityType][cty])[0] == entityCity) {
                        exisitingEle = JSON.parse(JSON.stringify(entityDetailsObj[entityType][cty][entityCity]));
                        break;
                    }
                }
            }
            partyObj['partyName'] = {
                'name' : entityDetailsData[entity].partyName,
                'gstinNo' : entityDetailsData[entity].gSTNTaxID_c,
                'iataNo' : entityDetailsData[entity].iATANumber,
                'partyNo' : entityDetailsData[entity].partyNumber
            }
            // change the names for better reference
            var newArr = [];
            if (exisitingEle) {
                newArr = exisitingEle;
            }
            newArr.push(partyObj);
            cityObj[entityCity] = newArr;
            var existingEntityDetailsObj = entityDetailsObj[entityType] ? JSON.parse(JSON
                    .stringify(entityDetailsObj[entityType])) : null;
            var newEntityDetailsObj = [];
            if (existingEntityDetailsObj) {
                newEntityDetailsObj = existingEntityDetailsObj;
                for ( var cty in existingEntityDetailsObj) {
                    if (Object.keys(existingEntityDetailsObj[cty])[0] == entityCity) {
                        newEntityDetailsObj.splice(cty, 1);
                    }
                }
            }
            newEntityDetailsObj.push(cityObj);
            entityDetailsObj[entityType] = newEntityDetailsObj;
        }
        // console.log(entityDetailsObj);
        populateEntityDropdown(entityDetailsObj);
    }
}

function populateEntityDropdown(entityDetailsObj) {
    var entityType = '';
    Object.keys(entityDetailsObj).forEach(function(entType) {
        entityType += createEntityDropdownList(entType);
        createEntityCityList(entType);
        // createPartyAndGSTNNoDropdown(entType);
    });
    // $('.entity-results#entityDetailsCity').html(entityCity);
    $('.entity-results#entityTypeDetails').html(entityType);
}

function createEntityDropdownList(value) {
    if (value) {
        return '<a class="individual-entity-result">' + value + '</a>';
    }
    return "";
}

function createEntityCityList(entityType, actDrpwn) {
    var entityCity = '';
    entityDetailsObj[entityType].forEach(function(cty) {
        // createEntityCityList(city);
        var extractedCity = Object.keys(cty)[0];
        entityCity += createEntityDropdownList(extractedCity);
        createPartyAndGSTNNoDropdown(cty, actDrpwn);
    });
    if (actDrpwn) {
        $('.active-dropdwn .entity-results#entityDetailsCity').html(entityCity)
    } else {
        $('.entity-results#entityDetailsCity').html(entityCity)
    }
}

function clearEntityDropdown(drpdwnSel) {
    var removableDrpdwn = drpdwnSel.closest('[data-drpdwn-target]').attr('data-drpdwn-target');
    var $caller = $('[data-drpdwn-caller = ' + removableDrpdwn + ']');
    $caller.text($caller.attr('data-entity-category').replace(/([A-Z])/g, ' $1').capitalize());
    $caller.attr('data-entity-selected', '');
    drpdwnSel.html('');
}

function createPartyAndGSTNNoDropdown(city, actDrpwn) {
    var entityPartyName = '';
    var entityGSTNNo = '';
    var entityIATANo = '';
    Object.values(city)[0].forEach(function(obj) {
        entityPartyName += createEntityDropdownList(obj.partyName.name);
        entityGSTNNo += createEntityDropdownList(obj.partyName.gstinNo);
        entityIATANo += createEntityDropdownList(obj.partyName.iataNo);
    });
    if (!actDrpwn) {
        $('.entity-results#entityDetailsPartyName').append(entityPartyName);
        $('.entity-results#entityDetailsGST').append(entityGSTNNo);
        $('.entity-results#entityDetailsIATA').append(entityIATANo);
    } else {
        $('.active-dropdwn .entity-results#entityDetailsPartyName').append(entityPartyName);
        $('.active-dropdwn .entity-results#entityDetailsGST').append(entityGSTNNo);
        $('.active-dropdwn .entity-results#entityDetailsIATA').append(entityIATANo);
    }
}

function isEntitySelected() {
    var userDetailsIHCLCB = dataCache.local.getData("userDetails");
    if (userDetailsIHCLCB
            && ((userDetailsIHCLCB.selectedEntity && userDetailsIHCLCB.selectedEntity.partyName) || (userDetailsIHCLCB.selectedEntityAgent && userDetailsIHCLCB.selectedEntityAgent.partyName))) {
        return true;
    }
    return false;
}

function addEntityDropDownEventsForIHCLCB() {
    try {
        var $entityTypeDropdown = $('#entityTypeDropdownMenu, #entityTypeDropdownMenu1');
        var $entityNameDropdown = $('#entityNameDropdownMenu, #entityNameDropdownMenu1');
        var $entityCityDropdown = $('#entityCityDropdownMenu, #entityCityDropdownMenu1');
        var $iataDropdown = $('#iataDropdownMenu');
        var $gstinDropdown = $('#gstinDropdownMenu, #gstinDropdownMenu1');

        // open popup
        $('[data-drpdwn-caller]').click(
                function(e) {
                    e.stopPropagation();
                    $(this).closest('.ihclcb-book-a-stay-dropdwn-cont').addClass('active-dropdwn').siblings(
                            '.ihclcb-book-a-stay-dropdwn-cont').removeClass('active-dropdwn');
                    var clickedDropdwn = $(this).attr('data-drpdwn-caller');
                    var $drpdwnCont = $('[data-drpdwn-target = ' + clickedDropdwn + ']');
                    $drpdwnCont.closest('.entity-dropdown-cnt-cont').addClass('active-dropdwn').siblings(
                            '.entity-dropdown-cnt-cont').removeClass('active-dropdwn');
                    if ($($drpdwnCont).hasClass('show-dropdown')) {
                        $drpdwnCont.removeClass('show-dropdown');
                    } else {
                        $('[data-drpdwn-target]').removeClass('show-dropdown');
                        $drpdwnCont.addClass('show-dropdown');
                    }
                });

        // disable the entity dropdown for the existing book a stay
        if (!isIHCLCBHomePage()) {
            $('[data-drpdwn-caller].ihclcb-mandetory-field').addClass('entity-dropdown-disabled');
            var userDetailsIHCLCB = dataCache.local.getData('userDetails');
            var selectedEntity = userDetailsIHCLCB.selectedEntity || userDetailsIHCLCB.selectedEntityAgent;
            if (userDetailsIHCLCB && selectedEntity) {
                // var selectedEntity = userDetailsIHCLCB.selectedEntity;
                // if (userDetailsIHCLCB && selectedEntity) {
                $entityTypeDropdown.text(selectedEntity.entityType);
                $entityCityDropdown.text(selectedEntity.city);
                $entityNameDropdown.text(selectedEntity.partyName);
                $gstinDropdown.text(selectedEntity.gSTNTaxID_c);
                // $iataDropdown.text(selectedEntity.iataNumber);
                // }
            }
            return;
        }

        var currentEntityDetails = [];
        var ihclSessionData = dataCache.session.getData("ihclCbBookingObject");
        var relatedPartyNo;
        var extractedObj;
        // get the selected dropdown value
        $('.entity-dropdown-cnt-cont').on(
                'click',
                '.entity-dropdown .individual-entity-result',
                function() {
                    $(this).closest('.entity-dropdown-cnt-cont').addClass('active-dropdwn').siblings(
                            '.entity-dropdown-cnt-cont').removeClass('active-dropdwn')
                    var openedDrpdwn = $(this).closest('.entity-dropdown-container').removeClass('show-dropdown').attr(
                            'data-drpdwn-target');
                    var $dropdwnCalledBy = $('[data-drpdwn-caller = ' + openedDrpdwn + ']');
                    var selectedValue = $(this).text();
                    $dropdwnCalledBy.text(selectedValue);
                    $dropdwnCalledBy.attr('data-entity-selected', selectedValue);

                    var $entityCity = $('.active-dropdwn #entityDetailsCity');
                    var $entityPartyName = $('.active-dropdwn #entityDetailsPartyName');
                    var $entityGSTNNO = $('.active-dropdwn #entityDetailsGST');
                    var $entityIATA = $('.active-dropdwn #entityDetailsIATA');
                    if ($dropdwnCalledBy.attr('data-entity-category') === "entityType") {
                        $entityCityDropdown.closest('.active-dropdwn').find('[data-entity-category="entityCity"]')
                                .removeClass('entity-dropdown-disabled');
                        $entityNameDropdown.closest('.active-dropdwn .ihclcb-book-a-stay-inner-wrp').nextAll().find(
                                '.ihclcb-selected-data').addClass('entity-dropdown-disabled');

                        clearEntityDropdown($entityCity);
                        clearEntityDropdown($entityPartyName);
                        clearEntityDropdown($entityGSTNNO);
                        // clearEntityDropdown($entityIATA);
                        createEntityCityList(selectedValue, true);
                    } else if ($dropdwnCalledBy.attr('data-entity-category') === "entityCity") {
                        $entityNameDropdown.closest('.active-dropdwn').find('[data-entity-category="entityName"]')
                                .removeClass('entity-dropdown-disabled');
                        $entityNameDropdown.closest('.active-dropdwn .ihclcb-book-a-stay-inner-wrp').nextAll().find(
                                '.ihclcb-selected-data').addClass('entity-dropdown-disabled');
                        clearEntityDropdown($entityPartyName);
                        clearEntityDropdown($entityGSTNNO);
                        // clearEntityDropdown($entityIATA);
                        var selectedEntityType = $entityTypeDropdown.closest('.active-dropdwn').find(
                                '[data-entity-category="entityType"]').attr('data-entity-selected');
                        var selectedEntityCity = $entityCityDropdown.closest('.active-dropdwn').find(
                                '[data-entity-category="entityCity"]').attr('data-entity-selected');
                        entityDetailsObj[selectedEntityType].forEach(function(cty) {
                            var extractedCity = Object.keys(cty)[0];
                            if (extractedCity == selectedEntityCity) {
                                extractedObj = Object.assign({}, cty);
                                createPartyAndGSTNNoDropdown(cty, true);
                            }
                        });
                        // createPartyAndGSTNNoDropdown(selectedValue);

                    } else if ($dropdwnCalledBy.attr('data-entity-category') === "entityName") {
                        clearEntityDropdown($entityGSTNNO);
                        // clearEntityDropdown($entityIATA);
                        var name;
                        if (extractedObj) {
                            var data = extractedObj[$entityCityDropdown.closest('.active-dropdwn').find(
                                    '[data-entity-category="entityCity"]').text()];
                        }
                        var clickedEntityNameIndex = $(this).index();
                        for (name = 0; name < data.length; name++) {
                            if (data[name].partyName.name == selectedValue && name == clickedEntityNameIndex) {
                                var gstDropdownList = createEntityDropdownList(data[name].partyName.gstinNo);
                                // var iataDropdownList = createEntityDropdownList(data[name].partyName.iataNo);
                                relatedPartyNo = data[name].partyName.partyNo;
                                if (gstDropdownList) {
                                    $('.entity-results#entityDetailsGST').html(gstDropdownList);
                                    $gstinDropdown.closest('.active-dropdwn').find('[data-entity-category="gstinNo"]')
                                            .removeClass('entity-dropdown-disabled');
                                } else {
                                    $gstinDropdown.addClass('entity-dropdown-disabled');
                                }
                                // if (iataDropdownList) {
                                // $('.entity-results#entityDetailsIATA').html(iataDropdownList);
                                // $iataDropdown.removeClass('entity-dropdown-disabled');
                                // } else {
                                // $iataDropdown.addClass('entity-dropdown-disabled');
                                // }
                                break;
                            }
                        }
                    }

                    var attributeID = $dropdwnCalledBy.attr("id");
                    var selectedEntityType, selectedEntityCity, selectedPartyName, selectedGSTNo;
                    var typeOfEntitySelection;
                    if (attributeID.includes("1")) {
                        typeOfEntitySelection = "agent";
                        selectedEntityType = $('#entityTypeDropdownMenu1').attr('data-entity-selected') || '';
                        selectedEntityCity = $('#entityCityDropdownMenu1').attr('data-entity-selected') || '';
                        selectedPartyName = $('#entityNameDropdownMenu1').attr('data-entity-selected') || '';
                        selectedGSTNo = $('#gstinDropdownMenu1').attr('data-entity-selected');

                        var selectedEntityAgent = new Object();
                        selectedEntityAgent.entityType = selectedEntityType;
                        selectedEntityAgent.city = selectedEntityCity;
                        selectedEntityAgent.partyName = selectedPartyName;
                        selectedEntityAgent.gSTNTaxID_c = selectedGSTNo;
                        selectedEntityAgent.partyNumber = relatedPartyNo;
                        selectedEntityAgent.iataNumber = selectedIATA;

                        addSelectedValueToIHCLCBSession(selectedEntityAgent);
                    } else {
                        typeOfEntitySelection = "corporate";
                        selectedEntityType = $('#entityTypeDropdownMenu').attr('data-entity-selected') || '';
                        selectedEntityCity = $('#entityCityDropdownMenu').attr('data-entity-selected') || '';
                        selectedPartyName = $('#entityNameDropdownMenu').attr('data-entity-selected') || '';
                        selectedGSTNo = $('#gstinDropdownMenu').attr('data-entity-selected');

                        var selectedEntity = new Object();
                        selectedEntity.entityType = selectedEntityType;
                        selectedEntity.city = selectedEntityCity;
                        selectedEntity.partyName = selectedPartyName;
                        selectedEntity.gSTNTaxID_c = selectedGSTNo;
                        selectedEntity.partyNumber = relatedPartyNo;
                        selectedEntity.iataNumber = selectedIATA;

                        addSelectedValueToIHCLCBSession(selectedEntity);
                    }

                    var selectedIATA;
                    // var selectedIATA = $iataDropdown.attr('data-entity-selected') || $iataDropdown.text();
                    // if ($entityNameDropdown.attr('data-entity-selected') ||
                    // $gstinDropdown.attr('data-entity-selected')
                    // || $iataDropdown.attr('data-entity-selected')) {
                    if ($entityTypeDropdown.closest('.active-dropdwn').find('[data-entity-category="entityType"]')
                            .attr('data-entity-selected')
                            && $entityCityDropdown.closest('.active-dropdwn').find(
                                    '[data-entity-category="entityCity"]').attr('data-entity-selected')
                            && $entityNameDropdown.closest('.active-dropdwn').find(
                                    '[data-entity-category="entityName"]').attr('data-entity-selected')) {
                        addSelectedValueToIHCLCBSession(typeOfEntitySelection, selectedEntityType, selectedEntityCity,
                                selectedPartyName, selectedGSTNo, selectedIATA);
                        if (isEntityDropdownSelected() && checkboxCheckedStatus()) {
                            enableBestAvailableButton('', true);
                        }
                    } else {
                        changeBookStayButtonStatus();
                    }
                });

        // close the entity dropdown while clicking outside;
        $(window).click(function(e) {
            var container = $(".entity-dropdown-container");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                $('.show-dropdown').removeClass('show-dropdown');
            }
        });

        function addSelectedValueToIHCLCBSession(entityObject) {

            var userDetails = dataCache.local.getData("userDetails");
            if (userDetails) {
                if (entityObject.entityType === "Travel Agent") {
                    userDetails.selectedEntityAgent = entityObject;
                } else if (entityObject.entityType === "Corporate") {
                    userDetails.selectedEntity = entityObject;
                }
            }
            dataCache.local.setData("userDetails", userDetails);
        }
    } catch (error) {
        console.error("Error in /apps/tajhotels/components/content/book-a-stay/clientlibs/js/book-a-stay.js ",
                error.stack);
    }
}

function isEntityDropdownSelected() {
    var entityDrpDwn = $('.ihclcb-corporate-book-stay .active-dropdwn .ihclcb-mandetory-field');
    var i;
    for (i = 0; i < entityDrpDwn.length; i++) {
        if (!$(entityDrpDwn[i]).attr('data-entity-selected')) {
            return false;
        }
    }
    return true;
}

// [IHCL_CB ENDS]


// check for same day checkin checkout
function checkSameDayCheckout(currVal){
	var sameDayCheckout = dataCache.session.getData("sameDayCheckout");
    if(sameDayCheckout && sameDayCheckout === "true"){
       	return moment(currVal, "D MMM YY");
    } else {
        return moment(currVal, "D MMM YY").add(1, 'days');
    }
}


function initialBookingSetup(){
	var sameDayCheckout = dataCache.session.getData("sameDayCheckout");
    if(sameDayCheckout && sameDayCheckout === "true"){
       	return moment(new Date()).add(1, 'days').format("MMM Do YY");
    } else {
		return moment(new Date()).add(2, 'days').format("MMM Do YY");
    }
}
function sebNightsCheck() {
    var currentDate = parseSelectedDate($("#input-box1").datepicker("getDate"));
    var nextDate = parseSelectedDate($("#input-box2").datepicker("getDate"));
    var numberOFNights = moment(nextDate, "MMM Do YY").diff(moment(currentDate, "MMM Do YY"), 'days');
    var sebObject = getQuerySebRedemption();
    if(sebObject && sebObject != null && sebObject != undefined &&  sebObject.sebRedemption == "true"){
        var sebNights = parseInt(sebObject.sebEntitlement);
        var rooms = $('.bas-room-no').length;
        if(parseInt(numberOFNights) * parseInt(rooms) > parseInt(sebNights))
        return false;
    }
      else
        return true;

}
function getQuerySebRedemption() {
	return dataCache.session.getData('sebObject');
}

	var propertyArray = [];
$('document').ready(
    function() {

        try {
            if ($('#book-a-stay').data('theme') == 'ama-theme') {
				
                createSelectPlaceHolder();
            } else {
                createSearchPlaceHolder();
            }
        } catch (error) {
            console.error("Error in /apps/tajhotels/components/content/book-a-stay/clientlibs/js/searchBar.js ",
                    error.stack);
        }

    });
var amaSearchFlag = false;
function createSelectPlaceHolder() {
	var selectInput = $('.dropdown-input');
	var SELECT_INPUT_DEBOUNCE_RATE = 1000;
	var contentRootPath = $('#contentRootPath').val();
    if($('#book-a-stay').data('theme') == 'ama-theme' && amaSearchFlag){
		return;
	}
    else{
        amaSearchFlag = true;
        $.ajax({
            method : "GET",
            url : "/bin/search.data/" + contentRootPath.replace(/\/content\//g, ":") + "//" + "/result/searchCache.json"
        }).done(function(res,count) {
            // populate search result in banner search bar
			createPropertyArray(res);
            addSelectionResultsInBanner(res);
            updateCheckAvailabilityAma();
        
            // populate search result in book a stay popup
            addSelectionResults(res);
            updateCheckAvailability();
        }).fail(function() {
            console.error('Ajax call failed.')
        });
    }

function createPropertyArray(res) {
	 if (Object.keys(res.destinations).length) {
		var destinationProperty = [];
        var destinations = res.destinations;
        destinations.forEach(function(destination) {
            destinationProperty.push(destination);

        });
		propertyArray.destination = destinationProperty;
    }
	var websiteHotels = res.hotels.website;
	if (Object.keys(websiteHotels).length) {
		var hotelProperty = [];
		websiteHotels.forEach(function(hotel) {
			hotelProperty.push(hotel);			
		});
		propertyArray.hotel = hotelProperty;
	}
}
function addSelectionResults(res) {
	if($('#select-results').is(':empty')){
    if (Object.keys(res.destinations).length) {
		$('#select-results').append('<li class="dest-item property-heading">Destinations</li>');
        var destinations = res.destinations;
        destinations.forEach(function(destination) {
            var destRedirectPath = destination.path;
            var destinationString = destination.title;
            var destHtml = createDestResult(destination.title, destRedirectPath);
            $('#select-results').append(destHtml);

        });
    }
	var websiteHotels = res.hotels.website;
	if (Object.keys(websiteHotels).length) {
		$('#select-results').append('<li class="dest-item property-heading">Hotels</li>');
		websiteHotels.forEach(function(hotel) {
			var hotelDestination = hotel.title.split(', ');
			
				var reDirectToRoomPath = hotel.path.concat("accommodations/");
				var hotelHtml = createHotelResult(hotel.title, reDirectToRoomPath, hotel.id, hotel.isOnlyBungalowPage);
				$('#select-results').append(hotelHtml);

		});
	}
}
}
function updateCheckAvailability() {

    var placeHolder = $("#book-a-stay .dropdown-input").text();
    var items = $('#book-a-stay #select-results li');
    items.each(function() {
        if (placeHolder == $(this).text()) {
            updateDestination($(this).find('a'));
        }
    });
}

function updateCheckAvailabilityAma() {
    var amaTextItem = $('.ama-info-strip').prev();
    if (amaTextItem.hasClass("ama-text")) {
        var placeHolder = amaTextItem.text().trim();
        var parent = $('.check-avblty-wrap .dropdown');

        var items = $('.check-avblty-wrap .dropdown .dropdown-menu li');
        items.each(function() {
            var $this = $(this);
            var itemText = $this.attr('id');
            if ($this.hasClass('hotel-item')) {
                var arr = $this.attr('id').split(',');
                itemText = arr[0];
            }
            if (placeHolder.includes(itemText) ) {
                updateDestination($(this), parent);
            }
        });
    }
}

$(selectInput).on("keyup", debounce(function(e) {
    e.stopPropagation();
		$('#select-results')[0].classList.remove("d-none");
        if (selectInput.val().length > 0) {
            clearSelectResults();


	        $.ajax({
            method : "GET",
            url : "/bin/search.data/" + contentRootPath.replace(/\/content\//g, ":") + "//" + selectInput.val() + "/result/searchCache.json"
			}).done(function(res,count) {
				    if (Object.keys(res.destinations).length) {
						$('#select-results').append('<li class="dest-item property-heading">Destinations</li>');
						var destinations = res.destinations;
						destinations.forEach(function(destination) {
							var destRedirectPath = destination.path;
							var destinationString = destination.title;
							var destHtml = createDestResult(destination.title, destRedirectPath);
							$('#select-results').append(destHtml);

						});
					}
					var websiteHotels = res.hotels.website;
					if (Object.keys(websiteHotels).length) {
						$('#select-results').append('<li class="dest-item property-heading">Hotels</li>');
						websiteHotels.forEach(function(hotel) {
							var hotelDestination = hotel.title.split(', ');

								var reDirectToRoomPath = hotel.path.concat("accommodations/");
								var hotelHtml = createHotelResult(hotel.title, reDirectToRoomPath, hotel.id, hotel.isOnlyBungalowPage);
								$('#select-results').append(hotelHtml);

						});
					}
					if(!(Object.keys(websiteHotels).length) && !(Object.keys(res.destinations).length)){
						$('#select-results').append('<li>No results found. Please try another keyword</li>');
					}

			}).fail(function() {
            console.error('Ajax call failed.')
			});

        } else {

		 showSelectResults();
        }


}, SELECT_INPUT_DEBOUNCE_RATE));

function clearSelectResults(){
	$('#select-results').empty();
    var items = $('#book-a-stay #select-results li');
   // items.each(function(item){ 
	//if(!(this.classList.contains("property-heading"))){
     //   this.classList.add("d-none");
	//}
    //});
}

function showSelectResults(){
	$('#select-results').empty();
	if(propertyArray.destination && propertyArray.destination.length){
		$('#select-results').append('<li class="dest-item property-heading">Destinations</li>');
						var destinations = propertyArray.destination;
						destinations.forEach(function(destination) {
							var destRedirectPath = destination.path;
							var destinationString = destination.title;
							var destHtml = createDestResult(destination.title, destRedirectPath);
							$('#select-results').append(destHtml);

						});
	}
	
		if(propertyArray.hotel && propertyArray.hotel.length){
								$('#select-results').append('<li class="dest-item property-heading">Hotels</li>');
						propertyArray.hotel.forEach(function(hotel) {
							var hotelDestination = hotel.title.split(', ');
							
								var reDirectToRoomPath = hotel.path.concat("accommodations/");
								var hotelHtml = createHotelResult(hotel.title, reDirectToRoomPath, hotel.id, hotel.isOnlyBungalowPage);
								$('#select-results').append(hotelHtml);
							
						});
	}
	
}

function addSelectionResultsInBanner(res) {
    if (Object.keys(res.destinations).length) {
		var destArray = [];
		var countDest = 0;
        var destinations = res.destinations;
        destinations.forEach(function(destination) {

            var websiteHotels = res.hotels.website;
            if (Object.keys(websiteHotels).length) {
				var hotelArray = [];
				var count = 0;
                websiteHotels.forEach(function(hotel) {

                    var hotelDestination = hotel.title.split(', ');
                    if (hotelDestination[1] == destination.title) {
						hotelArray[count] = hotel;
						count++;

                    }
                });


				hotelArray.sort(function(a, b) {
				  var nameA = a.title.toUpperCase(); // ignore upper and lowercase
				  var nameB = b.title.toUpperCase(); // ignore upper and lowercase
				  if (nameA < nameB) {
					return -1;
				  }
				  if (nameA > nameB) {
					return 1;
				  }

				  return 0;
				});
				destination.hotelArray = hotelArray;
				destArray[countDest] = destination;
				countDest++;


            }
        });
			destArray.sort(function(a, b) {
			  var nameA = a.title.toUpperCase(); // ignore upper and lowercase
			  var nameB = b.title.toUpperCase(); // ignore upper and lowercase
			  if (nameA < nameB) {
				return -1;
			  }
			  if (nameA > nameB) {
				return 1;
			  }

			  // names must be equal
			  return 0;
			});

			destArray.forEach(function(destination) {
			var destHtml = createDestResultBanner(destination.title, destination.path);
            $('.destination-hotels').append(destHtml);
			$('#search-properties').append(destHtml);

			var hotelArr = destination.hotelArray;
			hotelArr.forEach(function(hotel) {
			var reDirectToRoomPath = hotel.path.concat("accommodations/");	
			var hotelHtml = createHotelResultBanner(hotel.title, reDirectToRoomPath, hotel.id,
							hotel.maxGuests, hotel.maxBeds, hotel.id);

			$('.destination-hotels').append(hotelHtml);	
			$('#search-properties').append(hotelHtml);	
				});
			});
    }
}
function createDestResult(title, path) {
    return '<li class="dest-item ama-dest-item"><a class="select-result-item" data-redirect-path="' + path + '">' + title
            + '</a></li>';
}
function createHotelResult(title, path, hotelId, isOnlyBungalow) {
    return '<li class="hotel-item"><a class="select-result-item" data-hotelId="' + hotelId
            + '"data-isOnlyBungalow="'+ isOnlyBungalow + '" data-redirect-path="' + path + '">' + title + '</a></li>';
}

function createDestResultBanner(title, path) {
    return '<li id="' + title + '" class="dest-item" data-redirect-path="' + path + '">' + title + '</li>';
}

function createHotelResultBanner(title, path, hotelId, maxGuests, maxBeds, hotelId) {
    return '<li id="' + title + '" class="hotel-item" data-hotelid = "' + hotelId + '" data-max-guests="'
            + maxGuests + '" data-max-beds="' + maxBeds  +  '" data-redirect-path="' + path + '">' + title + '</li>';
}

$('.search-bar-wrapper-container').click(function() {
    $(this).toggleClass('rotate-arrow');
    if(!($('#book-a-stay .suggestions-wrap').is(':visible')))
		$('#book-a-stay .suggestions-wrap').toggle();
    if(!($('.suggestions-wrap').is(':visible')))
		$('.suggestions-wrap').toggle();
    if(!($('#select-results').is(':visible'))) 
		$('#select-results')[0].classList.remove("d-none");

});
$('window').click(function() {

    if($('.suggestions-wrap').is(':visible'))
		$('.suggestions-wrap').toggle();
});

$('.bas-date-container-main-wrap, .bas-best-available-rate-container clearfix').click(function() {
    $('.suggestions-wrap').hide();
});

$('#bas-checkbox').click(function() {
    var $this = $(this);
    if (!$this.attr('checked')) {
        $this.attr('checked', true);
    } else {
        $this.removeAttr('checked');
    }
});

$('#book-a-stay').on('click', 'a.select-result-item', function() {
    updateDestination($(this));
});
}
function updateDestination(el) {
var amaSearchResult = $('.select-dest-placeholder');
var selectedLocation = el.text();
var selectedHotelId = '';
var subtitlePlaceholder = $('#checkAvailSubtitle');
var isOnlyBungalow= false;
subtitlePlaceholder.text('');
amaSearchResult.text(selectedLocation);
amaSearchResult.val(selectedLocation);
if (el.attr('data-hotelid')) {
    selectedHotelId = el.attr('data-hotelid');
}

var reDirectPath = el.data("redirect-path");
amaSearchResult.attr('data-selected-search-value', selectedLocation);
$("#hotelIdFromSearch").text(selectedHotelId);
$('.suggestions-wrap').hide();
$('.search-bar-wrapper-container').removeClass('rotate-arrow');
if (el.data('max-guests') && el.data('max-beds')) {
    var subtitleText = el.data('max-guests') + ' | ' + el.data('max-beds');
    subtitlePlaceholder.text(subtitleText);
}
enableBestAvailableButton(reDirectPath);
}

function createSearchPlaceHolder() {
var searchSelector = "#booking-search";
var searchWidget = $(searchSelector);
var searchInput = $(searchSelector).find(".searchbar-input");
var searchBarWrap = searchInput.closest(".searchBar-wrap");
var suggestionsContainer = searchBarWrap.siblings('.suggestions-wrap');
var suggestionsWrapper = suggestionsContainer.find('.suggestions-container');
var searchSuggestionsContainer = suggestionsWrapper.children('.search-suggestions-container');
var trendingSuggestionsContainer = suggestionsWrapper.children('.trending-suggestions-container');
var wholeWrapper = searchBarWrap.closest('.search-and-suggestions-wrapper');
var closeIcon = searchInput.siblings('.close-icon');
var hotelResultCont = searchWidget.find('#hotel-result-cont');
var hotelResults = hotelResultCont.find('#hotel-result');
var websiteHotelResults = hotelResultCont.find('#website-hotel-result');
var otherHotelResults = hotelResultCont.find('#others-hotel-result');
var destResultCont = searchWidget.find('#dest-result-cont');
var destResults = destResultCont.find('#dest-result');
var restaurantResultCont = searchWidget.find('#restrnt-result-cont');
var restaurantResults = restaurantResultCont.find('#restrnt-result');
var nosearchTextBooking = $('#booking-search').find('#NoResults');
var isTic = $('.cm-page-container').hasClass('tic');
var keys = {
    37 : 1,
    38 : 1,
    39 : 1,
    40 : 1,
    32 : 1,
    33 : 1,
    34 : 1,
    35 : 1,
    36 : 1
};

var holidayResultsCont = searchWidget.find('#holiday-result-cont');
var holidayResults = holidayResultsCont.find('#holiday-result');
var pageScopeData = $('#page-scope').attr('data-pagescope');

var holidayHotelResultsCont = searchWidget.find('#holiday-hotel-result-cont');
var holidayHotelResults = holidayHotelResultsCont.find('#holiday-hotel-result');

var SEARCH_INPUT_DEBOUNCE_RATE = 1000;

var preventDefault = function(e) {
    e = e || window.event;
    if (e.preventDefault)
        e.preventDefault();
    e.returnValue = false;
}

var preventDefaultForScrollKeys = function(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function hideSuggestionsContainer() {
    if (!$(suggestionsContainer).hasClass('display-none')) {
        $(suggestionsContainer).addClass('display-none');
    }
    $(document).off("keyup", searchSelector);
    $(document).off("click", searchSelector);
}

function showSuggestionsContainer() {
    $(suggestionsContainer).removeClass('display-none');
    $(document).on("keyup", searchSelector, function(e) {
        // Esc pressed
        if (e.keyCode === 27) {
            $(searchInput).blur();
            hideSuggestionsContainer();
        }
    });

    $(document).on("click", searchSelector, function(e) {
        e.stopPropagation();
        hideSuggestionsContainer();
        if (!$(searchSuggestionsContainer).hasClass('display-none')) {
            $(searchSuggestionsContainer).addClass('display-none');
        }
        if (!$(trendingSuggestionsContainer).hasClass('display-none')) {
            $(trendingSuggestionsContainer).addClass('display-none');
        }
        $(wholeWrapper).removeClass('input-scroll-top');
    });
}

$(suggestionsWrapper).on("click", function(event) {
    event.stopPropagation();
});

$(closeIcon).on("click", function(e) {
    e.stopPropagation();
    $(wholeWrapper).removeClass('input-scroll-top');
    $(closeIcon).addClass('display-none');
    $(closeIcon).css("display", "none");
    if (!$(trendingSuggestionsContainer).hasClass('display-none')) {
        $(trendingSuggestionsContainer).addClass('display-none');
    }
    if (!$(searchSuggestionsContainer).hasClass('display-none')) {
        $(searchSuggestionsContainer).addClass('display-none');
    }
    hideSuggestionsContainer();
});

$(searchInput).on('click', function(e) {
    e.stopPropagation();
});

$(searchInput).on("keyup", debounce(function(e) {
    e.stopPropagation();
    if (e.keyCode !== 27 && e.keyCode !== 9 && e.keyCode !== 40 && e.keyCode !== 38 && e.keyCode !== 13) {
        if (searchInput.val().length > 1) {
            clearSearchResults();
            performSearch(searchInput.val()).done(function() {
                showSuggestionsContainer();
                if (!$(trendingSuggestionsContainer).hasClass('display-none')) {
                    $(trendingSuggestionsContainer).addClass('display-none');
                }
                $(searchSuggestionsContainer).removeClass('display-none');
            });
        } else {
            nosearchTextBooking.hide();
            hideSuggestionsContainer();
            if (!$(searchSuggestionsContainer).hasClass('display-none')) {
                $(searchSuggestionsContainer).addClass('display-none');
            }
            $(trendingSuggestionsContainer).removeClass('display-none');
        }
    } else {
        chooseDownUpEnterList(e);
    }
    if (window.matchMedia('(max-width: 767px)').matches) {
        $(closeIcon).removeClass('display-none');
        $(closeIcon).css('display', 'inline-block');
    }
}, SEARCH_INPUT_DEBOUNCE_RATE));




// Seach List to key up, down to show
function chooseDownUpEnterList(e) {
    var $listItems = $('.individual-trends:visible');
    var $selected = $listItems.filter('.active');
    var $current = $selected;
    var currentIndex = 0;
    var listLength = $listItems.length;
    if (e.keyCode == 40) {
        $listItems.removeClass('active');
        if ($selected.length == 0) {
            $current = $listItems.first();
        } else {
            currentIndex = $listItems.index($current);
            currentIndex = (currentIndex + 1) % listLength;
            $current = $listItems.eq(currentIndex);
        }
        $current.addClass('active');
        $(".suggestions-container").scrollTop(0);
        $(".suggestions-container").scrollTop($($current).offset().top - $(".suggestions-container").height());
    }
    if (e.keyCode == 38) {
        $listItems.removeClass('active');
        if ($selected.length == 0) {
            $current = $listItems.last();
        } else {
            currentIndex = $listItems.index($current);
            currentIndex = (currentIndex - 1) % listLength;
            $current = $listItems.eq(currentIndex);
        }
        $current.addClass('active');
        $(".suggestions-container").scrollTop(0);
        $(".suggestions-container").scrollTop($($current).offset().top - $(".suggestions-container").height());
    }
    if (e.keyCode == 13) {
        if ($current.hasClass("active")) {
            $($current).focus().trigger('click');
            // var getText = $($current).text();
            // $(searchInput).val(getText);
        }
    }
}

function performSearch(key) {

    var contentRootPath = $('#contentRootPath').val();
    var otherWebsitePath = $('#basOtherWebsitePath').val();
    var appendDestName = $('#appendDestName').val();

    var ihclCbBookingObject = dataCache.session.getData("ihclCbBookingObject");
    if (ihclCbBookingObject) {
        if (ihclCbBookingObject.isIHCLCBFlow) {
            contentRootPath = '/content/ihclcb';
            otherWebsitePath = otherWebsitePath + '_:ihclcb';
        }
    }

    return $.ajax(
            {
                method : "GET",
                url : "/bin/search.data/" + contentRootPath.replace(/\/content\//g, ":") + "/"
                        + otherWebsitePath.replace(/\/content\//g, ":").replace(",", "_") + "/" + key
                        + "/result/searchCache.json"
            }).done(function(res) {

        // [TIC-FLOW]
        var userDetails = getUserData();
        var bookingOptionsSessionData = dataCache.session.getData("bookingOptions");
        if (userDetails && userDetails.tier && bookingOptionsSessionData && bookingOptionsSessionData.flow) {
            bookingOptionsSessionData.flow = '';
            dataCache.session.setData("bookingOptions", bookingOptionsSessionData);
        }

        clearSearchResults();
        removeRedirectionForBestAvailableRatesButton();
        addHotelSearchResults(res.hotels,contentRootPath,otherWebsitePath);
        if (!isTic) {
            addDestSearchResults(res.destinations);
        }
        addHolidaySearchResults(res.holidays);
        addHolidayHotelSearchResults(res.holidayHotels);
        holidayFunction(res);
    }).fail(function() {
        clearSearchResults();
    });
}

function isHolidayResultAvailable() {
    if (holidayResults.children().length > 0) {
        return true;
    } else {
        return false;
    }
}

function isHolidayHotelResultAvailable() {
    if (holidayHotelResults.children().length > 0) {
        return true;
    } else {
        return false;
    }
}

function holidayFunction(res) {
    if (pageScopeData == "Taj Holidays") {
        // hide all tab and restaurant,experience contains in holiday page
        ifHolidayPage = true;
        if (isHolidayResultAvailable() || isHolidayHotelResultAvailable()) {
            holidayResultsCont.show();
            holidayHotelResultsCont.show();

            hotelResultCont.hide();
            destResultCont.hide();

            if (!isHolidayResultAvailable())
                holidayResultsCont.hide();

            else if (!isHolidayHotelResultAvailable())

                holidayHotelResultsCont.hide();

        }
        showNoResultsHoliday(res);

    } else {
        showNoResults(res);
    }
}

function showNoResults(res) {
    if ((Object.keys(res.hotels.website).length == 0) && (Object.keys(res.hotels.others).length == 0)
            && (Object.keys(res.destinations).length == 0)) {
        nosearchTextBooking.show();
    } else {
        nosearchTextBooking.hide();
    }
}

function showNoResultsHoliday(res) {
    if ((Object.keys(res.hotels.website).length == 0) && (Object.keys(res.hotels.others).length == 0)
            && (Object.keys(res.destinations).length == 0) && (Object.keys(res.holidays).length == 0)
            && (Object.keys(res.holidayHotels).length == 0)) {
        nosearchTextBooking.show();
    } else {
        nosearchTextBooking.hide();
    }

}

function removeRedirectionForBestAvailableRatesButton() {
    return $("#global-re-direct").removeAttr("href");
}

function clearSearchResults() {
    hotelResultCont.hide();
    otherHotelResults.empty();
    websiteHotelResults.empty();
    destResultCont.hide();
    destResults.empty();
    restaurantResultCont.hide();
    restaurantResults.empty();
    holidayResultsCont.hide();
    holidayResults.empty();
    holidayHotelResultsCont.hide();
    holidayHotelResults.empty();
}

function addHotelSearchResults(hotels,contentRootPath,otherWebsitePath) {
    if (Object.keys(hotels).length) {
        var websiteHotels = hotels.website;
        var otherHotels = hotels.others;
		
		var websiteHotelsGrouped = brandWiseSplitOtherHotels(websiteHotels);
		hotelResultCont.find('.website-result').remove();
			
        if (!isIHCLCBSite()) {
            if (Object.keys(websiteHotels).length) {
			 websiteHotelsGrouped.forEach(function(group) {
				var brandName  = Object.keys(group)[0];
				var brandArray = group[brandName];
				websiteHotelResults.append('<p class="explore-heading website-result"><img class="destination-hotel-icon" src="/content/dam/tajhotels/icons/style-icons/location.svg" alt="Location icon">'+
                                '<span class="trending-explore-taj-text trending-search-text">'+brandName+' Hotels</span></p>');
					brandArray.forEach(function(hotel) {
						var ROOMS_PATH = "rooms-and-suites/";
						var reDirectToRoomPath = hotel.path.replace(".html", "");
						reDirectToRoomPath = reDirectToRoomPath + ROOMS_PATH;
						if (reDirectToRoomPath != "" && reDirectToRoomPath != null && reDirectToRoomPath != undefined) {
							reDirectToRoomPath = reDirectToRoomPath.replace("//", "/");
						}
						if(contentRootPath.indexOf("tajhotels") != -1 && otherWebsitePath.indexOf("taj-inner-circle") != -1){
					   
							//if(hotel.path.indexOf("tajinnercircle") != -1){
								var resultHtml = createSearchResult(hotel.title, reDirectToRoomPath, hotel.id, hotel.sameDayCheckout);
								websiteHotelResults.append(resultHtml);
							//}
						}
						else if(contentRootPath.indexOf("tajhotels") != -1 && !(otherWebsitePath.indexOf("taj-inner-circle") != -1)){
							if(!(hotel.path.indexOf("tajinnercircle") != -1)){
                                if(hotel.id == "99999" && window.location.href.includes('//taj-dev65-02.adobecqms.net')){
                                    let tajhotelsDomainURL_1 = "https:/www.tajhotels.com";
                                    let tajhotelsDomainURL_2 = "https://www.tajhotels.com";
                                    if(reDirectToRoomPath.startsWith(tajhotelsDomainURL_1)){
                                        reDirectToRoomPath = reDirectToRoomPath.substr(tajhotelsDomainURL_1.length);
                                    }
                                    if(reDirectToRoomPath.startsWith(tajhotelsDomainURL_2)){
                                        reDirectToRoomPath = reDirectToRoomPath.substr(tajhotelsDomainURL_2.length);
                                    }
                                	reDirectToRoomPath = "/en-in/swt/?redirectUrl=" + hotel.path;
                                }
								var resultHtml = createSearchResult(hotel.title, reDirectToRoomPath, hotel.id, hotel.sameDayCheckout);
								websiteHotelResults.append(resultHtml);
							}
						}
						else{
						var resultHtml = createSearchResult(hotel.title, reDirectToRoomPath, hotel.id, hotel.sameDayCheckout);
						websiteHotelResults.append(resultHtml);
					}
						hotelResultCont.find('.website-result').show();
					});
				});
            }
			otherHotelsGrouped = brandWiseSplitOtherHotels(otherHotels);
			
            if (otherHotels && Object.keys(otherHotels).length) {
				hotelResultCont.find('.others-result').remove();
                otherHotelsGrouped.forEach(function(group) {
					var brandName  = Object.keys(group)[0];
					var brandArray = group[brandName];
					otherHotelResults.append('<p class="explore-heading others-result"><img class="destination-hotel-icon" src="/content/dam/tajhotels/icons/style-icons/location.svg" alt="Location icon">'+
                                '<span class="trending-explore-taj-text trending-search-text">'+brandName+' Hotels</span></p>');
					brandArray.forEach(function(hotel) {
						var ROOMS_PATH = "rooms-and-suites/";
						var reDirectToRoomPath = hotel.path.replace(".html", "");
						reDirectToRoomPath = reDirectToRoomPath + ROOMS_PATH;
						if (reDirectToRoomPath != "" && reDirectToRoomPath != null && reDirectToRoomPath != undefined) {
							if (!reDirectToRoomPath.includes('https')) {
								reDirectToRoomPath = reDirectToRoomPath.replace("//", "/");
							}
						}
						if(!(hotel.path.indexOf("tajinnercircle") != -1)){
                            if(hotel.id == "99999" && window.location.href.includes('//taj-dev65-02.adobecqms.net')){
                                let tajhotelsDomainURL_1 = "https:/www.tajhotels.com";
                                let tajhotelsDomainURL_2 = "https://www.tajhotels.com";
                                if(hotel.path.startsWith(tajhotelsDomainURL_1)){
                                    hotel.path = hotel.path.substr(tajhotelsDomainURL_1.length);
                                }
                                if(hotel.path.startsWith(tajhotelsDomainURL_2)){
                                    hotel.path = hotel.path.substr(tajhotelsDomainURL_2.length);
                                }
                                hotel.path = "/en-in/swt/?redirectUrl=" + hotel.path;
                            }
                            // starts-new changes for IHCL CrossBrand
                            let seleqtionsDomainURL_1 = "https://www.seleqtionshotels.com";
                            let vivantaDomainURL_1 = "https://www.vivantahotels.com";
                            let amaDomainURL_1 = "https://www.amastaysandtrails.com";
                            let tajDomainURL_1 = "https://www.tajhotels.com";
                                if((localStorage.getItem("access_token") != null && localStorage.getItem("access_token") != undefined) && (hotel.path.startsWith(tajDomainURL_1) || hotel.path.startsWith(seleqtionsDomainURL_1) || hotel.path.startsWith(vivantaDomainURL_1) || hotel.path.startsWith(amaDomainURL_1))){
                                    reDirectToRoomPath = "/en-in/swt/?redirectUrl=" + reDirectToRoomPath;
                             }
                     // ends-new changes for IHCL CrossBrand
							var resultHtml = createSearchResult(hotel.title, reDirectToRoomPath, hotel.id, hotel.sameDayCheckout);
							otherHotelResults.append(resultHtml);
						}
						hotelResultCont.find('.others-result').show();
					});
				});
            }
        } else if (isIHCLCBSite() && otherHotels && Object.keys(otherHotels).length) {
            // [IHCLCB]iterating over result.
            otherHotels.forEach(function(hotel) {
                var ROOMS_PATH = "rooms-and-suites/";
                var reDirectToRoomPath = hotel.path.replace(".html", "");
                reDirectToRoomPath = reDirectToRoomPath + ROOMS_PATH;
                if (reDirectToRoomPath != "" && reDirectToRoomPath != null && reDirectToRoomPath != undefined
                        && reDirectToRoomPath.includes('/corporate-booking/')
                        && !reDirectToRoomPath.includes('/ama-trails/')) {
                    if (!reDirectToRoomPath.includes('https')) {
                        reDirectToRoomPath = reDirectToRoomPath.replace("//", "/");
                    }
                    var resultHtml = createSearchResult(hotel.title, reDirectToRoomPath, hotel.id, hotel.sameDayCheckout);
                    websiteHotelResults.append(resultHtml);
                    hotelResultCont.find('.website-result').show();
                }
                // [IHCLCB]this is intentional hide for ihclccb
                hotelResultCont.find('.others-result').hide();
            });
        }
        if (websiteHotels && Object.keys(websiteHotels).length == 0) {
            hotelResultCont.find('.website-result').hide();
        }
        if (otherHotels && Object.keys(otherHotels).length == 0) {
            hotelResultCont.find('.others-result').hide();
        }
        hotelResultCont.show();
    }
}

function getBrand(hotelContentPath){
		if(hotelContentPath.indexOf('/gateway/') != -1)
			return 'Gateway';
		if(hotelContentPath.indexOf('/ginger/') != -1)
			return 'Ginger';
		if(hotelContentPath.indexOf('tajhotels') != -1 || hotelContentPath.indexOf('taj/') != -1 )
			return 'Taj';		
		if(hotelContentPath.indexOf('seleqtions') != -1)
			return 'SeleQtions';
		if(hotelContentPath.indexOf('vivanta') != -1)
			return 'Vivanta';
		if(hotelContentPath.indexOf('/ama/') != -1 || hotelContentPath.indexOf('amastaysandtrails') != -1)
			return 'Ama';
	}
	
	
	function brandWiseSplitOtherHotels(otherHotels){
		var vivantaArray = [];var tajArray = [];var seleqtionsArray = []; var amaArray = []; var gatewayArray = [];var gingerArray = [];
		var arraygroup= [];
		 if (otherHotels && Object.keys(otherHotels).length) {
                otherHotels.forEach(function(hotel) {
				if(hotel.path.indexOf('/gateway/') != -1 || (hotel.title && hotel.title.indexOf('The Gateway') != -1))
					gatewayArray.push(hotel);	
				else if(hotel.path.indexOf('ginger') != -1 || hotel.path.indexOf('/ginger/') != -1)
					gingerArray.push(hotel);
				else if(hotel.path.indexOf('tajhotels') != -1 || hotel.path.indexOf('/taj/') != -1)
					tajArray.push(hotel);
				else if(hotel.path.indexOf('vivanta') != -1 || (hotel.title && hotel.title.indexOf('Vivanta') != -1))
					vivantaArray.push(hotel);
				else if(hotel.path.indexOf('seleqtions') != -1 || (hotel.title && hotel.title.indexOf('SeleQtions') != -1))
					seleqtionsArray.push(hotel);
				else if(hotel.path.indexOf('amastays') != -1 || hotel.path.indexOf('/ama/') != -1)
					amaArray.push(hotel);
				});
		}
		if(tajArray.length>0)
			arraygroup.push({'Taj': tajArray});			
		if(seleqtionsArray.length>0)
			arraygroup.push({'SeleQtions': seleqtionsArray});		
		if(vivantaArray.length>0)
			arraygroup.push({'Vivanta': vivantaArray});
		if(gingerArray.length>0)
			arraygroup.push({'Ginger': gingerArray});
		if(gatewayArray.length>0)
			arraygroup.push({'Gateway': gatewayArray});
		if(amaArray.length>0)
			arraygroup.push({'Ama Stays & Trails': amaArray});

		return arraygroup;
	}
	
	
function addDestSearchResults(dests) {
    var destinationObject = [];
    if (Object.keys(dests).length) {
        dests.forEach(function(dest) {
            var destRedirectPath = dest.path;
            console.log(dest);
            if (isIHCLCBSite() && dest && dest.ihclOurHotelsBrand) {
                if (dest.path.includes('/corporate-booking/')) {
                    var destinationFlag = false;
                    for (var i = 0; i < destinationObject.length; i++) {
                        if (destinationObject[i] === dest.path) {
                            destinationFlag = true;
                            break;
                        }
                    }
                    if (!destinationFlag) {
                        destinationObject.push(dest.path);
                        var resultHtml = createSearchResult(dest.title, destRedirectPath);
                        destResults.append(resultHtml);
                    }
                }
            } else {
                if(!(dest.path.indexOf("tajinnercircle") != -1)){
                    var resultHtml = createSearchResult(dest.title, destRedirectPath);
                destResults.append(resultHtml);
                }
                
            }
        });
        destResultCont.show();
    }
}

function addHolidaySearchResults(holidays) {
    if (Object.keys(holidays).length) {
        holidays.forEach(function(holidays) {
            if (holidays.title != null) {
                var resultHtml = createSearchResult(holidays.title, holidays.path);
                holidayResults.append(resultHtml);
            }
        });
    }
}

function addHolidayHotelSearchResults(holidayHotel) {
    if (Object.keys(holidayHotel).length) {
        holidayHotel.forEach(function(holidayHotel) {
            var resultHtml = createSearchResult(holidayHotel.title, holidayHotel.path);
            holidayHotelResults.append(resultHtml);
        });
    }
}

function createSearchResult(title, path, hotelId, sameDayCheckout) {
    /*Check if not GInger hotels*/
    if(hotelId == "99999" && window.location.href.includes('//taj-dev65-02.adobecqms.net')){
        let tajhotelsDomainURL_1 = "https:/www.tajhotels.com";
        let tajhotelsDomainURL_2 = "https://www.tajhotels.com";
        if(path.startsWith(tajhotelsDomainURL_1)){
			path = path.substr(tajhotelsDomainURL_1.length);
        }
        if(path.startsWith(tajhotelsDomainURL_2)){
			path = path.substr(tajhotelsDomainURL_2.length);
        }
    }
    if(hotelId == "99999"){
        if(path.indexOf("/en-in/swt/?redirectUrl=") == -1) {
        	path = "/en-in/swt/?redirectUrl=" + path;
        }
    }


    /*if(path.startsWith('/en-in/ginger/')) {
        var authCodeLocal = localStorage.getItem("authCode");
        var codeVerifierLocal = localStorage.getItem("codeVerifier");
        path = path + "?authCode=" +  authCodeLocal + "&codeVerifier=" + codeVerifierLocal;
    }*/
    
    return '<a class="individual-trends" data-hotelId="' + hotelId + '" data-redirect-path="' + path + '" data-sameDayCheckout="' + sameDayCheckout + '">' + title
            + '</a>';
}

$('#booking-search .trending-search').on("click", '.individual-trends', function() {
    hideSuggestionsContainer();
    if ($(this).parents('.trending-searches-in-taj').attr('id') == 'others-hotel-result') {
        domainChangeFlag = true;
    } else {
        domainChangeFlag = false;
    }
    var selectedLocation = $(this).text();
    var selectedHotelId = "";
    if ($(this).attr('data-hotelid') != 'undefined') {
        selectedHotelId = $(this).attr('data-hotelid');
    }
    dataCache.session.setData("sameDayCheckout", $(this).attr('data-sameDayCheckout'));
    setHotelIdFromSearch(selectedHotelId);
    setSearchBarText(selectedLocation);
    var reDirectPath = $(this).data("redirect-path");
    searchInput.attr('data-selected-search-value', selectedLocation);
    enableBestAvailableButton(reDirectPath);
});

function setSearchBarText(textValue) {
    return searchInput.val(textValue);

}

function setHotelIdFromSearch(hotelId) {
    $("#hotelIdFromSearch").text(hotelId);
}
}

var initiateNavPreloginSearch = function() {
var navPreloginSearch = $('.header-nav-prelogin-search');
$('.gb-search-con').click(function() {
    navPreloginSearch.show().promise().then(function() {
        navPreloginSearch.find('.searchbar-input').click();
    });
});
$('.nav-prelogin-close, .closeIconImg ,.cm-overlay').click(function() {
    navPreloginSearch.hide();
});
}

initiateNavPreloginSearch();

$('document').ready(function() {

    var spaButtons = $('.jiva-spa-details-book-btn');
    spaButtons.each(function() {
        $(this).on('click', function() {
            setSpaAndHotelDataInSession($(this));
        });
    });
    $('.events-cards-request-btn').each(function(element) {
        $(this).hide();
    });
    var requestQuote = $('.events-cards-request-btn, .meeting-request-quote-btn');
    requestQuote.each(function() {
        $(this).on('click', function() {
            setRequestQuoteDataInSession($(this));
        });
    });
    $('.meeting-card-wait-spinner').each(function(element) {
        $(this).hide();
    });
    $('.events-cards-request-btn').each(function(element) {
        $(this).show();
    });
});

function setRequestQuoteDataInSession(clickEvent) {
    var meetingRequestQuoteData = {};

    var ind = $(clickEvent).closest(".events-pg-filter-inner-wrap");

    // Hotel properties
    var requestQuoteEmailId = $(ind).find(".request-quote-email-id").text();

    meetingRequestQuoteData.requestQuoteEmailId = requestQuoteEmailId;
    dataCache.session.setData('meetingRequestQuoteData', meetingRequestQuoteData);
}

function setSpaAndHotelDataInSession(clickEvent) {
    var spaOptions = {};

    var ind = $(clickEvent).closest(".jiva-spa-card-details-wrap");
    var spaName = $(ind).find(".jiva-spa-details-heading").text();
    var spaDuration = $(ind).find(".spa-duration").text();
    var spaCurr = $(ind).find(".spaCurr").text();
    var spaAmount = $(ind).find(".spaAmount").text();
    var spaAmountDetails = spaCurr + spaAmount;

    // Hotel properties
    var hotelName = $(ind).find(".hotel-name").text();
    var hotelCity = $(ind).find(".hotel-city").text();
    var hotelEmailId = $(ind).find(".hotel-email-id").text();
    var jivaSpaEmailId = $(ind).find(".jiva-spa-email-id").text();
    var requestQuoteEmailId = $(ind).find(".request-quote-email-id").text();
    spaOptions.spaName = spaName;
    spaOptions.spaDuration = spaDuration;
    spaOptions.spaAmount = spaAmountDetails;
    spaOptions.hotelName = hotelName;
    spaOptions.hotelCity = hotelCity;
    spaOptions.hotelEmailId = hotelEmailId;
    spaOptions.jivaSpaEmailId = jivaSpaEmailId;
    spaOptions.requestQuoteEmailId = requestQuoteEmailId;
    dataCache.session.setData('spaOptions', spaOptions);
}

$(document).ready(function(){		
	modifyBookingState = dataCache.session.getData('modifyBookingState');
	var modifyBookingQuery = getQueryParameter('modifyBooking');
	if( modifyBookingQuery =="true" && modifyBookingState){		
	 	if(modifyBookingState!='modifyRoomType'){					
			$('.book-stay-btn').trigger('click');
		}		
	}else{
		console.log("Booking modification is not invoked")
	}
	if(modifyBookingState && modifyBookingState!='modifyAddRoom'){
		$('.cart-room-delete-icon, .cart-addRoom').remove();
	}
	if(modifyBookingState && modifyBookingState == 'modifyGuest'){
		updateBookedRoom();
    }
    if (window.location.href.indexOf("en-in/booking-cart") > -1 && modifyBookingState!='modifyAddRoom') {
        updateBookedRoom();
	}
	$('.carts-book-now').on('click',updateBookedRoom);
});

function updateBookedRoom(){
	if(modifyBookingState){
		var bookedRoomsModify ={};
		var modifiedBookingOptions = dataCache.session.getData('bookingOptions');
		var selection = modifiedBookingOptions.selection;
		var bookedRoomsData = modifiedBookingOptions.bookedRoomsModify;
		if(modifyBookingState == 'modifyGuest'){bookedRoomsData = modifiedBookingOptions.roomOptions;}
        var modifiedCheckInDate = moment(modifiedBookingOptions.fromDate,"MMM Do YY").format("YYYY-MM-DD");
        var modifiedCheckOutDate = moment(modifiedBookingOptions.toDate,"MMM Do YY").format("YYYY-MM-DD");
		var totalAmountAfterTax = 0;
		var totalAmountBeforeTax = 0;
		$(selection).each(function(index,data){
			var reservationNumber = bookedRoomsData[index].reservationNumber;
			var modifiedRoomData = {
				bedType: data.roomBedType,
				bookingStatus: true,
				cancellable: true,
				cancellationPolicy: "Staggered cancel policy",
				discountedNightlyRates: null,
				hotelId: data.hotelId,
				modifyRoom: false,
				nightlyRates: data.nightlyRates,
				noOfAdults: parseInt(data.adults),
				noOfChilds: parseInt(data.children),
				petPolicy: null,
				promoCode: null,
				rateDescription: data.rateDescription,
				ratePlanCode: data.ratePlanCode,
				resStatus: "Committed",
				reservationNumber: reservationNumber,
				roomCostAfterTax: data.roomTaxRate + data.roomBaseRate,
				roomCostBeforeTax: data.roomBaseRate,
				roomTypeCode: data.roomTypeCode,
				roomTypeDesc: "",
				roomTypeName: data.title
			}	
			bookedRoomsModify[reservationNumber] = modifiedRoomData;			
		});
		var bookingDetailsResponse = JSON.parse(dataCache.session.getData('bookingDetailsRequest'));
		bookingDetailsResponse.checkInDate = modifiedCheckInDate;
		bookingDetailsResponse.checkOutDate = modifiedCheckOutDate;
		var bookingRoomList = bookingDetailsResponse.roomList;
        //var roomListUpdated = bookingDetailsResponse.roomList;
        var ival = 0;
		$(bookingRoomList).each(function(index){
            index = index - ival;
			var reservationNumber = this.reservationNumber;			
			if(bookedRoomsModify[reservationNumber]){
				bookingRoomList[index] = bookedRoomsModify[reservationNumber];
			}else if(bookingRoomList[index].resStatus == 'Cancelled'){
                bookingRoomList.splice(index, 1);
                ival++;
                //--index;
			}
			
			totalAmountBeforeTax += parseFloat(this.roomCostBeforeTax);
			totalAmountAfterTax += parseFloat(this.roomCostAfterTax);
		});
		bookingDetailsResponse.roomList = bookingRoomList;
		bookingDetailsResponse.totalAmountBeforeTax = totalAmountBeforeTax;
		bookingDetailsResponse.totalAmountAfterTax = totalAmountAfterTax;
		dataCache.session.setData('bookingDetailsRequest',JSON.stringify(bookingDetailsResponse));
	}	
}
function modifyBookingInBookAStay(modifyBookingState){
	var bookedOptions = JSON.parse(dataCache.session.getData('bookingDetailsRequest'));
	var $bookingSearchContainer = $('#booking-search');
	var $basDateOccupancyPromoWrapper = $('.bas-date-container-main-wrap');
	var $basDateContainer = $('.bas-date-container-main');
	var $basOccupancyContainer = $('.bas-hotel-details-container');
	var $basPromoCodeContainer = $('.bas-specialcode-container');
    var $basDatepickerContainer = $('.bas-date-container-main');
	var $basAddRoomOption = $('.bas-add-room');
	$basAddRoomOption.addClass('bas-hide');
	$bookingSearchContainer.addClass('modify-booking-disabled-state');
    $basDatepickerContainer.addClass('modify-booking-disabled-state');
	$basDateOccupancyPromoWrapper.children().addClass('modify-booking-disabled-state');
	if(modifyBookingState == 'modifyDate'){
		$basDateContainer.removeClass('modify-booking-disabled-state');				
	}else if(modifyBookingState == 'modifyRoomOccupancy'){
		$basOccupancyContainer.removeClass('modify-booking-disabled-state');
	}else if(modifyBookingState == 'modifyAddRoom'){
		$basOccupancyContainer.removeClass('modify-booking-disabled-state');
		$basAddRoomOption.removeClass('bas-hide');
	}
}
$("document").ready(function() {
    try {
        var bungalows = getUrlParameter('onlyBungalows');
        var checkAvail = getUrlParameter('checkAvail');
        var themeAma = $('.cm-page-container').hasClass('ama-theme');
        if (themeAma) {
			/*$(".ama-theme .bas-about-room-container").css("display", "block");
			$('.cm-bas-content-con').css('height','560px');*/
            if (!bungalows && bungalows == "" && checkAvail) {
                $("#onlyRoom").trigger("click");
                $(".ama-theme .bas-about-room-container").css("display", "block");
            } else {
                $("#onlyBungalow").trigger("click");
                $(".ama-theme .bas-about-room-container").css("display", "none");
            }

            $('.ama-theme .bas-date-container-main-wrap input[type="radio"]').click(function() {

                var adultCountReset = $(".ama-theme  .bas-quantity").parent().parent().hasClass("bas-no-of-adults");
                var childCountReset = $(".ama-theme  .bas-quantity").parent().parent().hasClass("bas-no-of-child");
                if (adultCountReset) {
                    $(".ama-theme  .bas-quantity").closest(".bas-no-of-adults .bas-quantity").val(1);
                }
                if (childCountReset) {
                    $(".ama-theme  .bas-quantity").closest(".bas-no-of-child .bas-quantity").val(0);
                }
                if ($(this).hasClass("activeRadioButton")) {
                    $(".ama-theme .bas-about-room-container").css("display", "block");
                } else if (!$(this).hasClass("activeRadioButton")) {
                    $(".ama-theme .bas-about-room-container").css("display", "none");
                }

            });

            $(".ama-theme .bas-close.icon-close").click(function() {

                // if (!bungalows && bungalows == "" && checkAvail) {
                // $("#onlyRoom").trigger("click");
                // } else {
                // $("#onlyBungalow").trigger("click");
                // }

                amaBookingObject = fetchRoomOptionsSelected(amaBookingObject);
                amaBookingObject.fromDate = moment(new Date($("#input-box1").val())).format('MMM D YY');
                amaBookingObject.toDate = moment(new Date($("#input-box2").val())).format('MMM D YY');
                amaBookingObject.rooms = $('.bas-room-no').length;
                amaBookingObject.BungalowType = fetchRadioButtonSelectedAma();
                typeof autoPopulateBannerBookAStay != 'undefined' ? autoPopulateBannerBookAStay() : '';
            });
            var shouldInvokeCalendarApiBas = false;
            if(document.getElementById("shouldInvokeCalendarApiBas"))
					var shouldInvokeCalendarApiBas = document.getElementById("shouldInvokeCalendarApiBas").value;
				if(shouldInvokeCalendarApiBas){
					amacacalendarPricingBas();
					bindNextPrevClickAmaBas();
				}				
        }

        $(".ama-theme .bas-date-container-main-wrap #onlyBungalow").click(function() {
            $(".bas-room-delete-close").trigger("click");
        });

        setTimeout(updateBasPlaceholder, 1000);

        function updateBasPlaceholder() {
            var isDestinationPage = $(".cm-page-container").hasClass("destination-layout");
            var isHotelPage = $(".cm-page-container").hasClass("specific-hotels-page");
            if (themeAma & !isDestinationPage & !isHotelPage) {
                $('#book-a-stay .dropdown-input').text("Select Destinations/Bungalows");
            } else if (themeAma & (isDestinationPage || isHotelPage)) {
                var destinationName = $('.specific-hotels-breadcrumb .breadcrumb-item:last-child').text().trim();
                $('#book-a-stay .dropdown-input').text(destinationName);
                $('#global-re-direct').attr('hrefvalue', window.location.href);
            }
        }
    } catch (error) {
        console.error('Error occurred in ama-bookastay', error);
    }


    /* is only bunglow check in home page*/
	isOnlyBunglowInHome();


});


var basSelectedHotel;
var basSelectedFromdate;
var basSelectedTodate;
var ItineraryDetails;
var currentCalendarInputDate;
var monthExisting;
var monthOfferNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December", "December"];
var monthAvailability = {};  
var monthJson;

function amacacalendarPricingBas(){

    basSelectedHotel = $("#hotelIdFromSearch").text() || pageLevelData.hotelCode;

    //var isCalendarPricing = document.getElementById("isCalendarPricing").value;
    var isCalendarPricing = true;
    if( isCalendarPricing == true){

	$('.input-box-wrapper').click(function(e) {
		e.stopImmediatePropagation();
		e.stopPropagation();
        //***Removing Ama Calendar rates modified****///
        var getPathName = window.location.pathname;
        var getHostName = window.location.hostname;
        if(getHostName == 'www.amastaysandtrails.com' || getPathName.includes('/content/ama')){
            return;
        } ///*** changes end ****///
		if($("#hotelIdFromSearch").text() == '' || basSelectedHotel == "99999"){
			return;
		}
        currentCalendarInputDate = new Date($(e.currentTarget).find('input').val());

		if(!($($(e.currentTarget).find('input')[0]).val()) && $($(e.currentTarget).find('input')[0])){
			currentCalendarInputDate = new Date();
		}
		if(!($($(e.currentTarget).find('input')[0]).val()) && $($(e.currentTarget).find('input')[0])){
			currentCalendarInputDate = moment($($(e.currentTarget).closest('.row').find('.enquiry-from-value')[0]).val(), "DD/MM/YYYY")._i;
		}

		var monthYearStr = $($($('.bas-calander-container').find('.datepicker-days')[$('.bas-calander-container').find('.datepicker-days').length-1]).find('thead .datepicker-switch')[0]).html();
		if(monthYearStr){
			var currentCalendarMonthName = monthYearStr.split(' ')[0];
			var currentCalendarYear =  monthYearStr.split(' ')[1];				
		}else{
			var currentCalendarMonthName = monthOfferNames[currentCalendarInputDate.getMonth()];
			var currentCalendarYear = currentCalendarInputDate.getFullYear();
		}
		var  currentCalendarMonthFirstDay = new Date(currentCalendarYear, monthOfferNames.indexOf(currentCalendarMonthName),1);
		var  currentCalendarMonthLastDay = new Date(currentCalendarYear, monthOfferNames.indexOf(currentCalendarMonthName) + 1, 0);

        basSelectedHotel = $("#hotelIdFromSearch").text() || pageLevelData.hotelCode;
		basSelectedFromdate = currentCalendarMonthFirstDay;
		basSelectedTodate = new Date((basSelectedFromdate.getTime() +  (60 * 24 * 60 * 60 * 1000)));
		if(!monthAvailability[basSelectedHotel]){
			monthAvailability = {};
			//basSelectedTodate = currentCalendarMonthFirstDay;
			//basSelectedFromdate = new Date((basSelectedTodate.getTime() +  (1 * 24 * 60 * 60 * 1000)));
		}
        monthAvailability = {};
        var monthJsonCheck = monthAvailability[basSelectedHotel] && monthAvailability[basSelectedHotel][currentCalendarMonthName + currentCalendarYear];

        if((!monthJsonCheck || (monthJsonCheck && new Date(monthJsonCheck[monthJsonCheck.length - 1].end) < currentCalendarMonthLastDay)) && basSelectedHotel != "99999" ){
			$('td.day').attr('data-custom', '');		
			//basSelectedFromdate = basSelectedTodate ? new Date() : new Date();
			//basSelectedTodate =  new Date((basSelectedFromdate.getTime() +  (60 * 24 * 60 * 60 * 1000)));
			var basUrl = "/bin/calendarAvailability.rates/" + basSelectedHotel + "/" +moment(basSelectedFromdate).format('YYYY-MM-DD') + "/" +
			moment(basSelectedTodate).format('YYYY-MM-DD') + '/INR/1,0/["STD"]/[]//P1N/ratesCache.json';
			console.log("check availability URL",basUrl);

			monthExisting = false;
            console.log($('.datepicker-days').find('tbody'));
            $('.datepicker-loader').remove();
			addOfferCalendarLoaderBas();
            $.ajax({
             type : "GET",
             url:   basUrl,
             contentType : "application/json"
             }).done(addPriceDetailsBas).fail().always(function() {});

			bindNextPrevClickAmaBas();

         }else{
             monthExisting = true;
             addPriceDetailsBas(monthAvailability);
		}
	return false;
	});
	}
}

function bindNextPrevClickAmaBas(){
	setTimeout(function(){ $('.datepicker .datepicker-days .next,.datepicker .datepicker-days .prev').click(function(e) {
				if($("#hotelIdFromSearch").text() == '' || basSelectedHotel == "99999"){
                	$('.datepicker-loader').remove();
					return;
				}
                setTimeout(function(){
                    console.log("e",e);
                    var currentCalendarMonthName =$($(e.target).closest('tr').find('.datepicker-switch')[0]).text().split(' ')[0];
                	var currentCalendarYear = $($(e.target).closest('tr').find('.datepicker-switch')[0]).text().split(' ')[1].substring(0,4);
                    var  currentCalendarMonthLastDay = new Date(currentCalendarYear, monthOfferNames.indexOf(currentCalendarMonthName) + 1, 0);
                    var  currentCalendarMonthFirstDay = new Date(currentCalendarYear, monthOfferNames.indexOf(currentCalendarMonthName),1);
					console.log(currentCalendarMonthName, currentCalendarYear);                    

                    var monthJsonCheck = monthAvailability[basSelectedHotel] && monthAvailability[basSelectedHotel][currentCalendarMonthName + currentCalendarYear];
                    if(!monthJsonCheck || (monthJsonCheck && new Date(monthJsonCheck[monthJsonCheck.length - 1].end) < currentCalendarMonthLastDay)){
						if(basSelectedFromdate > currentCalendarMonthLastDay){
							basSelectedFromdate = currentCalendarMonthFirstDay;
							basSelectedTodate = currentCalendarMonthLastDay
						}else{
							basSelectedFromdate = basSelectedTodate ? basSelectedTodate : new Date();
							basSelectedTodate =  new Date((basSelectedFromdate.getTime() +  (60 * 24 * 60 * 60 * 1000)));

						}

                        var basUrl = "/bin/calendarAvailability.rates/" + basSelectedHotel + "/" +moment(basSelectedFromdate).format('YYYY-MM-DD') + "/" +
						moment(basSelectedTodate).format('YYYY-MM-DD') + '/INR/1,0/["STD"]/[]//P1N/ratesCache.json';
						console.log("check availability URL",basUrl);

                        monthExisting = false;
						$('.datepicker-loader').remove();
						addOfferCalendarLoaderBas();

                        $.ajax({
                             type : "GET",
                             url : basUrl,
                             contentType : "application/json"
                             }).done(addPriceDetailsBas).fail().always(function() {});	
                    }else{
                        monthExisting = true;
                        addPriceDetailsBas(monthAvailability);
                    }
                },500);
            }); }, 500);
}

function processOfferRatesJSONBas(rateJson){	
    monthJson = monthJson ? monthJson : {};	
    monthJson[basSelectedHotel] =  monthJson[basSelectedHotel] ? monthJson[basSelectedHotel] : {};
	for(var i=0;i<rateJson.hotelStays.length;i++){
		var startmonth = new Date(rateJson.hotelStays[i].start).getMonth();
		var endmonth = new Date(rateJson.hotelStays[i].end).getMonth();
		var startYear = new Date(rateJson.hotelStays[i].start).getFullYear();
		var endYear = new Date(rateJson.hotelStays[i].end).getFullYear();
		if(!(monthJson[basSelectedHotel] && monthJson[basSelectedHotel][monthOfferNames[startmonth] + startYear]))
			monthJson[basSelectedHotel][monthOfferNames[startmonth]+startYear] = [];

		monthJson[basSelectedHotel][monthOfferNames[startmonth]+ startYear].push(rateJson.hotelStays[i]);
        //startmonth ++;
		var arrayendmonth = endmonth;
		if(endYear > startYear){
			arrayendmonth = startmonth + endmonth + 1
		}
		var thisYear = startYear; 
		while(arrayendmonth >= startmonth){			
			if(!monthJson[basSelectedHotel][monthOfferNames[startmonth] + thisYear])
				monthJson[basSelectedHotel][monthOfferNames[startmonth] + thisYear] = [];
			monthJson[basSelectedHotel][monthOfferNames[startmonth] +thisYear].push(rateJson.hotelStays[i]);
            basSelectedTodate = new Date(rateJson.hotelStays[i].end);
			startmonth ++;	
			if(endYear > startYear && startmonth == 12 ){
				startmonth = 0;
				thisYear = endYear;
				arrayendmonth = endmonth;
			}
		}
	}


	console.log("FINAL JSON", monthJson);
	return monthJson;
}

function showPricesBas(currentMonth){
		var localDateTimestamp = "";		var localDateMonth ="" ; var localDateYear = ""; let isCheckInContainer = true;
        $(".datepicker-days td").filter(function() {

				var date = $(this).text();
				return /\d/.test(date);

			}).each(function(){
            	let $currentInputElem = $(this).parents(".jiva-spa-date-section.package-input-wrp");
				if($('.bas-right-date-wrap-ama').hasClass('active') || $('.bas-right-date-wrap').hasClass('active'))
					isCheckInContainer = false;
				localDateTimestamp = new Date(new Date($(this).data('date')).toLocaleDateString('en-US')).getTime();
				localDateMonth = monthOfferNames[new Date(localDateTimestamp).getMonth()];
				localDateYear = new Date(localDateTimestamp).getFullYear();
				pricemonth = currentMonth ? currentMonth : monthAvailability[basSelectedHotel][localDateMonth + localDateYear];

            if(pricemonth){
					innerloopbas:
                    for(var i=0;i<pricemonth.length;i++){
                        if(localDateTimestamp <= new Date(pricemonth[i].end).getTime() && localDateTimestamp >= new Date(pricemonth[i].start).getTime()){
                        if(pricemonth[i].status == 'Close'){
							$(this).attr('data-custom', 'X').addClass("disabled");
                            if(!isCheckInContainer){
								$(this).removeClass("disabled");
                            }
							
                            break;
                        }
						else if(pricemonth[i].status == 'Open' || pricemonth[i].status == 'MinStay'){
                            var getPathName = window.location.pathname;
                            var getHostName = window.location.hostname;
                            if(getHostName == 'www.amastaysandtrails.com' || getPathName.includes('/content/ama')){
                                return;
                            }
							var priceStartDate, priceEndDate, price;
							for(var j=0;j<pricemonth[i].prices.length;j++){
							var priceItem = pricemonth[i].prices[j];
							priceStartDate = new Date(priceItem.start).getTime(); 
							priceEndDate = new Date(priceItem.end).getTime(); 
							var pricevals = ((parseInt(priceItem.amountBeforeTax)/1000)+'').split('.');
							var decimal= pricevals[1] ? '.' + pricevals[1].substring(0,1) : '';
							if(priceItem.currencyCode == 'INR')
								price = getCurrencySymbol(priceItem.currencyCode) + pricevals[0] + decimal + 'K';
							else
								price ='';
								
							$(this).attr('data-custom', '');
							if(localDateTimestamp >= priceStartDate && localDateTimestamp <= priceEndDate){									
								if($("#showPriceBas").val()){
									$(this).attr('data-custom', price);	
									  break innerloopbas; 
								  }								  
								  isCheckInContainer ? $(this).removeClass('disabled-checkIn') : $(this).removeClass('disabled-checkOut'); 
								}
							}
						}
                    }					
                    }
        	}
		});		
    }

function getCurrencySymbol(inputSymbol){
	if(inputSymbol == 'INR')
		return '₹';
	else if(inputSymbol == 'USD')
		return '$';
	else if(inputSymbol == 'MYR')
		return 'RM';
	else if(inputSymbol == 'ZAR')
		return 'R';
	else if(inputSymbol == 'AED')
		return 'AED';
	else if(inputSymbol == 'GBP')
		return '£';
	else if(inputSymbol == 'EUR')
		return '€';
	else 
		return inputSymbol;		
}


function addPriceDetailsBas(response) {
	$('.datepicker-loader').remove();	
	var data= response;	
	console.log('JSON response', response);	
	
	if(response.errorMessage && response.errorMessage.indexOf('Invalid Promotion Code') != -1){
		warningBox({
					title : '',
					description : 'The selected hotel is not participating in this offer.',
					callBack : null,
					needsCta : false,
					isWarning : true
			});
			return;
	}
	
	monthAvailability = monthExisting ? response : processOfferRatesJSONBas(response);	

	var monthYearStr = $($($('.bas-calander-container').find('.datepicker-days')[$('.bas-calander-container').find('.datepicker-days').length-1]).find('thead .datepicker-switch')[0]).html();
		if(monthYearStr){
			var currentCalendarMonthName = monthYearStr.split(' ')[0];
			var currentCalendarYear =  monthYearStr.split(' ')[1];				
		}else{
			var currentCalendarMonthName = monthOfferNames[currentCalendarInputDate.getMonth()];
			var currentCalendarYear = currentCalendarInputDate.getFullYear();
	}
	
	if(monthAvailability[basSelectedHotel] && monthAvailability[basSelectedHotel][currentCalendarMonthName+currentCalendarYear]){
		showPricesBas(monthAvailability[basSelectedHotel][currentCalendarMonthName+currentCalendarYear]);
	}	
}

function addOfferCalendarLoaderBas(){
    var calenderText = "Finding best rates..";
    if($("#showPriceBas").val()){
        calenderText = "Finding best rates..";
    }
    else{
        calenderText = "Checking Availability..";
    }
    $('.datepicker-days').find('tbody').append('<div  class="datepicker-loader" style="left:0px;"><p>'+calenderText+'</p></div>')
	$('.datepicker-loader').css({'width': $('.datepicker-days tbody').width() +'px', 'max-width': $('.datepicker-days tbody').width() +'px','height': $('.datepicker-days tbody').height() + 'px'});
    }

function isOnlyBunglowInHome() {
	$('#select-results').on('click', function(ev){
        if($(ev.target).parent('li').hasClass('hotel-item')){
			console.log($(ev.target).attr('data-isonlybungalow'));
            var btnElem = $("#onlyRoomBtn");
            if($(ev.target).attr('data-isonlybungalow')==="true")
            {
                $(btnElem).prop("disabled", true);
				$(btnElem).parent('.radio-container').css('opacity', '0.5');
            	$("#onlyBungalowBtn").prop("checked", true);

            }
            else
            {
                $(btnElem).prop("disabled", false);
				$(btnElem).parent('.radio-container').css('opacity', '1');
            }

        }
	});
}

$(document).ready(function() {

    // Hide apply coupon code for voucher redemption
	handleCouponCodeField();

    var bOptions = dataCache.session.getData("bookingOptions");

    if (bOptions && bOptions.selection && (bOptions.selection.length > 0)) {
        checkAvailabilityInCartPage();
    }

    $('.price-warning-box-close').on("click", function() {
        $('.cart-price-diff-bar').hide('slow');
    });

    var sebObject = getQuerySebRedemption();
    if(sebObject && sebObject != null && sebObject != undefined){
        verifySebNights();
    }

});

function addAnotherRoom() {
    var dataBooking = dataCache.session.getData("bookingOptions");
    var bookingSelection = [];

    var roomcount = dataBooking.roomCount;
    for (var m = 0; m < dataBooking.selection.length; m++) {
        if (dataBooking.selection[m].soldout) {
            delete dataBooking.roomOptions[m].userSelection;
            roomcount = roomcount - 1
        } else {
            bookingSelection.push(dataBooking.selection[m]);
        }
    }
    dataBooking.roomCount = roomcount;
    dataBooking.selection = bookingSelection;
    dataCache.session.setData("bookingOptions", dataBooking);

    var guestSoldOutRoomPath = dataCache.session.getData("guestRoomPath") || "#";
    window.location.href = guestSoldOutRoomPath;
}

function checkAvailabilityInCartPage() {
    var cartPageBookingOptions = dataCache.session.getData("bookingOptions");
    var checkInDate = moment(cartPageBookingOptions.fromDate, "MMM Do YY").format("YYYY-MM-DD");
    var checkOutDate = moment(cartPageBookingOptions.toDate, "MMM Do YY").format("YYYY-MM-DD");
    var selection = cartPageBookingOptions.selection;
    var selectionHotelId;
    var roomDetailsList = [];
    for (var i = 0; i < selection.length; i++) {
        var roomDetail = {};
        var roomOccupants = {};
        roomOccupants["numberOfAdults"] = selection[i].adults;
        roomOccupants["numberOfChildren"] = selection[i].children;
        roomDetail["roomOccupants"] = roomOccupants;

        selectionHotelId = selection[i].hotelId;
        roomDetail["roomTypeCode"] = selection[i].roomTypeCode;
        roomDetail["ratePlanCode"] = selection[i].ratePlanCode;

        roomDetailsList.push(roomDetail);
    }

    $('body').showLoader(true);

    $.ajax({
        type : 'post',
        url : '/bin/bookCartAvailabilityServlet',
        data : 'hotelId=' + selectionHotelId + '&checkInDate=' + checkInDate + '&checkOutDate=' + checkOutDate
                + '&roomDetailsList=' + JSON.stringify(roomDetailsList),
        success : function(returnmessage) {
            $('body').hideLoader(true);
            if (returnmessage == undefined || returnmessage == "" || returnmessage.length == 0) {
                var popupParams = {
                    title : 'Availability Failed!',
                    description : 'Something went Wrong. Refreshing Page'
                }
                warningBox(popupParams);
            } else if (returnmessage.includes("success\":")) {
                maintainAjaxSuccess(returnmessage)
            } else {
                var warningPopupParams = {
                    title : 'Availability Failed!',
                    description : returnmessage,
                }
                warningBox(warningPopupParams);
            }
        },
        fail : function(rrr) {
            $('body').hideLoader(true);
            var popupParams = {
                title : 'Availability Failed!',
                description : 'Availability service calling failed. Please try again later.',

            }
            warningBox(popupParams);
        },
        error : function(xhr) {
            $('body').hideLoader(true);
            var popupParams = {
                title : 'Availability Error!',
                description : 'Error occured while calling  availability service. Please try aftersome time.',

            }
            $('body').hideLoader(true);
            warningBox(popupParams);
        }
    });
}

function maintainAjaxSuccess(response) {
    console.log('AJAX Response: ', response);
    var returnResponseJSON = JSON.parse(response);
    var voucherRedemption = dataCache.session.getData('voucherRedemption');
	var voucherShowRates = dataCache.session.getData('voucherRedemptionShowPrice');
    var sebRedemption = getQuerySebRedemption();
    if(sebRedemption && sebRedemption != null && sebRedemption != undefined){
        sebRedemption = sebRedemption.sebRedemption;
    }
    else{
        sebRedemption = "false" ;
    }
	if(voucherRedemption && voucherRedemption == 'true' && !voucherShowRates){
		returnResponseJSON = makeAvailabilityAsPerVoucher(returnResponseJSON);
    }
    if( sebRedemption == 'true'){
		returnResponseJSON = makeAvailabilityAsPerSeb(returnResponseJSON);
	}
    roomAvailabilityCheck(returnResponseJSON);
}

function roomAvailabilityCheck(responseJSON) {
    var falseCheck = false;
    var indexesOfRooms = [];
    for (var h = 0; h < responseJSON.length; h++) {
        if (responseJSON[h].success) {
            doIfRoomAvailabilityStatusTRUE(responseJSON[h], h);
            indexesOfRooms.push(false);
        } else {
            doIfRoomAvailabilityStatusFALSE(responseJSON[h], h);
            indexesOfRooms.push(true);
            falseCheck = true;
        }
    }

    var bookCache = dataCache.session.getData("bookingOptions");
    for (var d = 0; d < indexesOfRooms.length; d++) {
        bookCache.selection[d].soldout = indexesOfRooms[d];
    }
    dataCache.session.setData("bookingOptions", bookCache);

    if (falseCheck) {
        $('.summary-charges-div').hide();
        $('.summary-soldout-message').show();
        $('.cart-footer-fixed-total-price').hide();
        $('.total-prize-confirm').hide();
        $('.total-prize-con').hide();
        $('.total-price-deal-section').hide();
    }
    updateSummaryAndOther();
}

function updateSummaryAndOther() {

    var _globals = intGlobals();
    serveSummaryCard(_globals);
    showNightlyRates();
    showAllTypeOfTaxes();
}

function doIfRoomAvailabilityStatusTRUE(indResObject, indResObjectIndex) {
    var cartBookingOptions = dataCache.session.getData("bookingOptions");
    var indSelectionObj = cartBookingOptions.selection[indResObjectIndex];

    console.log("indSelectionObj.selectedRate: " + Number(indSelectionObj.selectedRate).toFixed()
            + ", indResObject.totalPrice: " + Number(indResObject.totalPrice).toFixed()
            + "|| indSelectionObj.totalTax: " + Number(indSelectionObj.roomTaxRate).toFixed()
            + ", indResObject.roomTaxRate: " + Number(indResObject.totalTax).toFixed());

    if ((Number(indSelectionObj.selectedRate).toFixed() != Number(indResObject.totalPrice).toFixed())
            || (Number(indSelectionObj.roomTaxRate).toFixed() != Number(indResObject.totalTax).toFixed())) {

        console.log("totalPrice or totalTax had a difference");
        var currentCard = $('.cart-selected-rooms-card')[indResObjectIndex];
        $(currentCard).find('.room-amount').text(roundPrice(Math.ceil(indResObject.totalPrice))).digits();
        updatingPriceDiffInCartRoom(indSelectionObj, indResObject, indResObjectIndex);
        $('.cart-price-diff-bar').show('slow');
        purgeRateCache();
    }
}

function purgeRateCache() {
    try {
        var bookingOptions = dataCache.session.getData("bookingOptions");
        if (bookingOptions) {
            var hotelId = bookingOptions.hotelId;
            if (hotelId) {
                $.ajax({
                    type : 'get',
                    url : '/bin/refreshRateCache',
                    data : 'hotelId=' + hotelId,
                    success : function(successData) {
                        console.log("RateCache has been refreshed successfully");
                    },
                    fail : function(failData) {
                        console.error("Failure while purging cache");
                    },
                    error : function(errData) {
                        console.error("Error occured while purging cache");
                    }
                });
            }
        }
    } catch (err) {
        console.error("Error occured while purging cache ", err);
    }
}

function updatingPriceDiffInCartRoom(indSelectionObj, indResObject, indResObjectIndex) {
    indSelectionObj.currencyString = indResObject.currencyString;
    indSelectionObj.dailyNightlyRate = roundPrice(indResObject.averagePrice);
    indSelectionObj.dailyNightlyRateWithTax = indResObject.averagePrice + indResObject.averageTax;
    indSelectionObj.nightlyRates = indResObject.nightlyRates;
    indSelectionObj.roomBaseRate = indResObject.totalPrice;
    indSelectionObj.roomTaxRate = indResObject.totalTax;
    indSelectionObj.selectedRate = indResObject.totalPrice;
    indSelectionObj.taxes = indResObject.taxes;
    var bookingOptionData = dataCache.session.getData("bookingOptions");
    bookingOptionData.selection[indResObjectIndex] = indSelectionObj;
    dataCache.session.setData("bookingOptions", bookingOptionData);

}

function doIfRoomAvailabilityStatusFALSE(indResObject, indResObjectIndex) {
    // deleteCartRoomAfterAvailabilityCheck(indResObjectIndex + 1);

    var currentCard = $('.cart-selected-rooms-card')[indResObjectIndex];
    $(currentCard).find('.cart-room-cost').text("Sold out");
    var soldoutRoomName = '<div class="soldout-room-name">' + $(currentCard).find('.cart-amenities-title').text()
            + '</div>';
    $('.summary-of-soldout-rooms').append(soldoutRoomName);
    $(currentCard).find('.cart-selected-info-wrp').text("");
    $(currentCard).find('.cart-selected-info-wrp').append(
            '<div class="soldout-room-name">' + $('.soldout-summary-info').text() + '<br><br></div>'
                    + '<div class="sold-out-addRoom" onclick="addAnotherRoom()">' + '<a href="#">'
                    + '<button class="cm-btn-primary sold-out-add-room-button">'
                    + $($('.sold-out-add-room-button')[0]).text() + '</button>' + '</a>' + '</div>');

}

function deleteCartRoomAfterAvailabilityCheck(deletingCardindex) {

    var _globals = intGlobals();

    var currenctCard = $('.cart-selected-rooms-card')[deletingCardindex];

    $(currenctCard).hide('slow', function() {
        var thisCardInitialRoomIndex = _globals.bookingSelections.selection[deletingCardindex].initialRoomIndex;
        droppingRoomFromCart(dataCache.session.getData("bookingOptions"), deletingCardindex);
        $('.cart-room-number:gt(' + deletingCardindex + ')').each(function() {
            var currentRoomNumber = $(this).find("span").text();
            --currentRoomNumber;
            $(this).find("span").html(currentRoomNumber);
        });
        $(this).remove();
        delete _globals.bookingSelections.roomOptions[thisCardInitialRoomIndex].userSelection;
        _globals.bookingSelections.selection.splice(deletingCardindex, 1);
        /*
         * _globals.bookingSelections.roomOptions.splice( deletingCardindex, 1 );
         */
        _globals.bookingSelections.roomCount = _globals.bookingSelections.roomCount - 1;

        updateAddRoomBtnVisibility(_globals);

        checkForEmptyCart(_globals);

        // Update the selections on the summary cards and
        // then browser cache from there
        serveSummaryCard(_globals);
        // dataCache.session.setData( "bookingOptions",
        // _globals.bookingSelections );
        showNightlyRates();
        showAllTypeOfTaxes();
    });
    addRoomButtonVisibility();
}


// handle voucher redemption prices
function makeAvailabilityAsPerVoucher(returnResponseJSON) {
	if(returnResponseJSON && returnResponseJSON.length){
		for(var i=0; i<returnResponseJSON.length; i++) {
			returnResponseJSON[i].averagePrice = 0;
			returnResponseJSON[i].totalPrice = 0;
			returnResponseJSON[i].averageDiscountedPrice = 0;
			returnResponseJSON[i].totalDiscountedPrice = 0;
			var nightlyRates = returnResponseJSON[i].nightlyRates;
			if(nightlyRates && nightlyRates.length) {
				for(let j=0; j<nightlyRates.length; j++){
					nightlyRates[j].price = 0;
					nightlyRates[j].priceWithFeeAndTax = nightlyRates[j].tax;
				}
			}
			returnResponseJSON[i].nightlyRates = nightlyRates;
		}
	}
	return returnResponseJSON;
}

function makeAvailabilityAsPerSeb(returnResponseJSON) {
    
    var sebDiscount = getQuerySebRedemption().discountRate;
    var discount = getQuerySebRedemption().discount;
    if(sebDiscount != discount){
        setQuerySebRedemptionDiscount(discount)
        sebDiscount = discount;
    }
    sebDiscount = Number(sebDiscount)/100;
    var priceMultiplier = 1 - sebDiscount;
    
     
	if(returnResponseJSON && returnResponseJSON.length){
		for(var i=0; i<returnResponseJSON.length; i++) {
			returnResponseJSON[i].averagePrice *=  priceMultiplier;
			returnResponseJSON[i].totalPrice *=  priceMultiplier;
			// returnResponseJSON[i].averageDiscountedPrice = 0;
			// returnResponseJSON[i].totalDiscountedPrice = 0;
			var nightlyRates = returnResponseJSON[i].nightlyRates;
			if(nightlyRates && nightlyRates.length) {
				for(let j=0; j<nightlyRates.length; j++){
					nightlyRates[j].price *=  priceMultiplier;
					nightlyRates[j].priceWithFeeAndTax = nightlyRates[j].price + parseInt(nightlyRates[j].tax);
				}
			}
			returnResponseJSON[i].nightlyRates = nightlyRates;
		}
	}
	return returnResponseJSON;
}


// handle coupon code for voucher redemption flow
function handleCouponCodeField() {
	var voucherRedemption = dataCache.session.getData('voucherRedemption');
    if(voucherRedemption && voucherRedemption == 'true'){
		$('.coupon-hide-on-checkout-page').hide();
    }
}

function getQuerySebRedemption() {
	return dataCache.session.getData('sebObject');
}
function getQuerySebDiscount() {
	return dataCache.session.getData('sebDiscount');
}
function setQuerySebRedemptionDiscount(val) {
    var sebObject =  dataCache.session.getData('sebObject');
    sebObject.discountRate = val;
    dataCache.session.setData('sebObject',sebObject);
}
function getQuerySebNights() {
	return dataCache.session.getData('sebNights');
}
function getBookingOptionsSessionData() {
    return dataCache.session.getData("bookingOptions");
}
function verifySebNights(){
    var bookingOptions = getBookingOptionsSessionData();
    // var sessionCheckInDate = moment(bookingOptions.fromDate, "MMM Do YY");
    // var sessionCheckOutDate = moment(bookingOptions.toDate, "MMM Do YY");
    // var nights = moment(sessionCheckOutDate, "DD.MM.YYYY").diff(moment(sessionCheckInDate, "DD.MM.YYYY"), 'days');
    var nights = parseInt(bookingOptions.nights) * parseInt(bookingOptions.rooms);
    var sebNights = parseInt(getQuerySebRedemption().sebEntitlement);
    if (nights > sebNights) {
        console.log("NOT OK");
    } else {
        console.log("OK");
    }
}
var neucoinsHtml;
var availableNeuCoins;
var hotelPrice;
var redeemClicked = true;
var confirmButtonCliked = false;

$(document).ready(function () {
    neucoinsHtml = $('.neucoins-container') ? $('.neucoins-container').prop('outerHTML') : '';
    $('.neucoins-container') ? $('.neucoins-container').remove() : '' ;
});

$('.ihclcb-payment-opt-btn .payment-radio-btn').change(function(){
    if (this.id=="PAYATHOTEL") {
        $('.pay-now-button').css('display','block');
    } else if (confirmButtonCliked == true) {
        $('.pay-now-button').css('display','none');
    }
});

function callNeuCoinsIntegration() {
    confirmButtonCliked = true;
    availableNeuCoins = JSON.parse(localStorage.getItem('tajData')).userDetails ? parseInt(JSON.parse(localStorage.getItem('tajData')).userDetails.loyaltyInfo[0].loyaltyPoints) : 0;
    $('.neucoins-text-container .available-neucoins p span').html(availableNeuCoins);
    document.querySelector(".mr-neucoins-checkbox").checked = true;

    let urlPath = window.location.pathname;
    if (urlPath.includes('booking-cart')) {
        let NoOfRooms = JSON.parse(sessionStorage.getItem("tajData")).bookingOptions.selection.length;
        hotelPrice = 0;
        for (let i = 0; i < NoOfRooms; i++) {
            let NoOfNights = JSON.parse(sessionStorage.getItem("tajData")).bookingOptions.selection[i].nightlyRates.length;
            for (let j = 0; j < NoOfNights; j++) {
                hotelPrice += parseFloat(JSON.parse(sessionStorage.getItem("tajData")).bookingOptions.selection[i].nightlyRates[j].priceWithFeeAndTax);
            }
        }
        hotelPrice = Math.round(hotelPrice);

        $('.pay-now-button').css('display','none');
        $(".neucoins-input-container input").val(availableNeuCoins >= hotelPrice ? hotelPrice : availableNeuCoins);
		$('.neucoins-inner-container .remaining-amount span').html(hotelPrice - parseInt($(".neucoins-input-container input").val()));
        setTimeout(() => {
			 document.querySelector('.payment-details-wrp').scrollIntoView();
        }, 1000);
    } else if (urlPath.includes('epicureprogram')) {
        /*$('.signup-submit-btn').css('display','none');
        setAmountInEpicure();
        setTimeout(() => {
			 document.querySelector('.epicure-neucoins').scrollIntoView();
        }, 1000);*/
    }

    function setAmountInEpicure() {
		var selectedMemValue = $('select[data-form-id="enroll-type"]').val();
        if (selectedMemValue.toUpperCase() == 'PRIVILEGED') {
            hotelPrice = sessionStorage.getItem('PrivilegedAmount') ? sessionStorage.getItem('PrivilegedAmount').split('|')[2] : '';
			$(".neucoins-input-container input").val(availableNeuCoins >= hotelPrice ? hotelPrice : availableNeuCoins);
            $('.neucoins-inner-container .remaining-amount span').html(parseInt(hotelPrice) - parseInt($(".neucoins-input-container input").val()));
        } else if (selectedMemValue.toUpperCase() == 'PREFERRED') {
            hotelPrice = sessionStorage.getItem('PreferredAmount') ? sessionStorage.getItem('PreferredAmount').split('|')[2] : '';
			$(".neucoins-input-container input").val(availableNeuCoins >= hotelPrice ? hotelPrice : availableNeuCoins);
            $('.neucoins-inner-container .remaining-amount span').html(parseInt(hotelPrice) - parseInt($(".neucoins-input-container input").val()));
        }
    }

	document.querySelector(".neucoins-input-container input") ? document.querySelector(".neucoins-input-container input").addEventListener("input", () => {
        if (parseInt($(".neucoins-input-container input").val()) > parseInt(availableNeuCoins) || parseInt($(".neucoins-input-container input").val()) > parseInt(hotelPrice)) {
            $(".neucoins-inner-container.redeemed-msg-container").css("display", "block");
            $(".neucoins-inner-container.redeemed-msg-container .input-error").html(`NeuCoins to be redeemed should be lesser than or equal to ${availableNeuCoins >= hotelPrice ? hotelPrice : availableNeuCoins} NeuCoins`);
        	$(".neucoins-inner-container.redeemed-msg-container .input-error").css("display", "block");
			$('.neucoins-inner-container .remaining-amount span').html(hotelPrice);
			$(".paynow-button").attr("disabled", "disabled");
        } else {
        	$(".neucoins-inner-container.redeemed-msg-container .input-error").css("display", "none");
            $('.neucoins-inner-container .remaining-amount span').html($(".neucoins-input-container input").val() ? parseInt(hotelPrice) - parseInt($(".neucoins-input-container input").val()) : parseInt(hotelPrice));
			$(".paynow-button").removeAttr("disabled");
        }
	}) : '';

	document.querySelector(".mr-neucoins-checkbox") ? document.querySelector(".mr-neucoins-checkbox").addEventListener('change', function() {
    	if (this.checked) {
      		$(".neucoins-input-container input").removeAttr("disabled");
            $(".neucoins-input-container input").val(availableNeuCoins >= hotelPrice ? hotelPrice : availableNeuCoins);
            $('.neucoins-inner-container .remaining-amount span').html(parseInt(hotelPrice) - parseInt($(".neucoins-input-container input").val()));
    	} else {
            $(".neucoins-input-container input").val('');
      		$(".neucoins-input-container input").attr("disabled", "disabled");
            $(".neucoins-inner-container.redeemed-msg-container").css("display", "none");
            $(".neucoins-inner-container.redeemed-msg-container .input-error").css("display", "none");
            $('.neucoins-inner-container .remaining-amount span').html(hotelPrice);
    	}
    }) : '';

    document.querySelector(".paynow-button") ? document.querySelector(".paynow-button").addEventListener("click", () => {

        // Neucoins Checkbox is checked
		if (document.querySelector(".mr-neucoins-checkbox").checked) {
            if ($(".neucoins-input-container input").val() > 0) {
                if (parseInt($(".neucoins-input-container input").val()) <= parseInt(availableNeuCoins) && parseInt($(".neucoins-input-container input").val()) <= parseInt(hotelPrice)) {
                    if (window.location.pathname.includes("epicureprogram")){
                        /*$('body').css('overflow','hidden');
                        let neucoinsLoader = document.createElement('div');
                        neucoinsLoader.className = 'neucoins-loader';
                        neucoinsLoader.innerHTML = `<div class="taj-loader pay-now-spinner" style="display: block;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);">
                                                        <div class="taj-loader-circle"></div>
                                                        <div class="taj-loader-circle"></div>
                                                        <div class="taj-loader-circle"></div>
                                                    </div>`
                        $('body').append(neucoinsLoader);

                        let epicure = JSON.parse(sessionStorage.getItem("epicure"));
                        let redeemPoints = $(".neucoins-input-container input").val();
                        let accessToken =  localStorage.getItem("access_token");
                        let memberNumber = JSON.parse(localStorage.getItem("tajData")).userDetails.tcpNumber;
                        let epicureRedeemCoins = {"epicureRedeemCoins":
                                                    {
                                                        "authToken":accessToken,
                                                        "redeemPoints":redeemPoints,
                                                        "MemberNumber":memberNumber
                                                    }
                                                };

                        let object = JSON.parse(sessionStorage.getItem("formData"));
                        let inputAppended = { "epicure":{...epicure, ...epicureRedeemCoins} , ...object};

                        $.ajax({
                            type: 'post',
                            url : '/bin/epicure-redeem/tataneucoins',
                            data: JSON.stringify(inputAppended),
                            contentType : 'application/json',
                            dataType : 'json',
                            success: function(output) {
                                $('.neucoins-loader').remove();
                                $('body').css('overflow','auto');
                                if(output!==null && !output.addonEnrollResponse && output.payload) {              
                                    $(".neucoins-input-container input").attr("disabled", "disabled");
                                    $(".mr-neucoins-checkbox").attr("disabled", "disabled");
                                    $(".paynow-button").remove();
                                    $(".neucoins-checkbox-container").css("display","none");
                                    $(".neucoins-inner-container .redeemed-msg span").html($(".neucoins-input-container input").val());
                                    $(".neucoins-inner-container.redeemed-msg-container").css("display", "block");
                                    $(".neucoins-inner-container.redeemed-msg-container .redeemed-msg").css("display", "block");
                                    $(".neucoins-inner-container .remaining-amount span").html(hotelPrice - $(".neucoins-input-container input").val());
                                    validateJsonSignature = JSON.parse(output.payload).opelBundle;
                                    loadPaymentIframe();

                                    if (getQueryParameter('primaryNo') != null && getQueryParameter('primaryNo') != "") {
                                        sessionStorage.setItem("Primary Membership", getQueryParameter('primaryNo'));
                                        sessionStorage.setItem("Add-on Membership", getQueryParameter('spouseNo'));
                                    }
                                } else if(output!= null && output.addonEnrollResponse){
                                    sessionStorage.setItem("addonEnrollResponse",output.addonEnrollResponse);
                                    sessionStorage.setItem("transcationId",output.redemptionId);
                                    sessionStorage.setItem("paymentStatus",output.paymentStatus);
                                    window.location.href = output.redirectionUrl + ".html";
                                }
                            },
                            fail: function(rrr){
                                $('.neucoins-loader').remove();
                                $('body').css('overflow','auto');
                                console.log(rrr);
                            }
                        });*/
                    } else if(window.location.pathname.includes("booking-cart")){
                        redeemCoinsAndGeneratePayload(true, true);
                    }
                } else if (parseInt($(".neucoins-input-container input").val()) > parseInt(availableNeuCoins) || parseInt($(".neucoins-input-container input").val()) > parseInt(hotelPrice)) {
                    $(".neucoins-inner-container.redeemed-msg-container").css("display", "block");
                    $(".neucoins-inner-container.redeemed-msg-container .input-error").html(`NeuCoins to be redeemed should be lesser than or equal to ${availableNeuCoins >= hotelPrice ? hotelPrice : availableNeuCoins} NeuCoins`);
                    $(".neucoins-inner-container.redeemed-msg-container .input-error").css("display", "block");
                }
            } else {
                $(".neucoins-inner-container.redeemed-msg-container").css("display", "block");
                $(".neucoins-inner-container.redeemed-msg-container .input-error").html("Please enter atleast <span>1</span> NeuCoin to redeem");
                $(".neucoins-inner-container.redeemed-msg-container .input-error").css("display", "block");
            }
		}
        else {
			// Neucoins Checkbox is not checked
            if (window.location.pathname.includes("epicureprogram")){
                /*epicureEnrollLogoutModeOrPaynow();*/
            } else if (window.location.pathname.includes("booking-cart")){
                redeemClicked = false;
                $(".neucoins-input-container input").val('');
                redeemCoinsAndGeneratePayload(false, true);
            }
        }
	}) : '';
}

function redeemCoinsAndGeneratePayload(isRedeemCoins, isLoggedIn) {
    $('body').css('overflow','hidden');
    let neucoinsLoader = document.createElement('div');
    neucoinsLoader.className = 'neucoins-loader';
    neucoinsLoader.innerHTML = `<div class="taj-loader pay-now-spinner" style="display: block;position: absolute;top: 50%;left: 50%;transform: translate(-50%, -50%);">
                                    <div class="taj-loader-circle"></div>
                                    <div class="taj-loader-circle"></div>
                                    <div class="taj-loader-circle"></div>
                                </div>`
    $('body').append(neucoinsLoader);

    var input = JSON.parse(localStorage.getItem("bookingReqJson"));
    var inputAppended;
    if(isRedeemCoins) {
        var redeemPoints = $(".neucoins-input-container input").val();
        var accessToken =  localStorage.getItem("access_token");
        var memberNumber = JSON.parse(localStorage.getItem("tajData")).userDetails.tcpNumber;   
        let customerHash = JSON.parse(localStorage.getItem("tajData")).userDetails.customerHash;   
        var redeemCoins = {"redeemCoins":{"authToken":accessToken,
                                          "redeemPoints":redeemPoints,
                                          "MemberNumber":memberNumber,
                                          "customerHash":customerHash}};
        inputAppended = { ...input, ...redeemCoins };
    } else {
        inputAppended = input;
    }

    $.ajax({
        type: 'post',
        url : '/bin/redeem/tataneucoins', 
        data: JSON.stringify(inputAppended),
        contentType : 'application/json',
        dataType : 'json',
        success: function(output) {
            $('.neucoins-loader').remove();
            $('body').css('overflow','auto');
            if(output!==null && !output.bookingDetailsRequest && output.payload) {
                $(".paynow-button").remove();
                $(".neucoins-input-container input").attr("disabled", "disabled");
                $(".mr-neucoins-checkbox").attr("disabled", "disabled");
                $(".neucoins-checkbox-container").css("display","none");
                if (redeemClicked) {
                    $(".neucoins-inner-container .redeemed-msg span").html($(".neucoins-input-container input").val());
                    $(".neucoins-inner-container.redeemed-msg-container").css("display", "block");
                    $(".neucoins-inner-container.redeemed-msg-container .redeemed-msg").css("display", "block");
                }
                $(".neucoins-inner-container .remaining-amount span").html(Math.round(JSON.parse(JSON.parse(output.payload).opelBundle).payload.amount));          
                var payloadJson = output.payload;
                generateSignature(JSON.parse(payloadJson).opelBundle);
            } else if (output!==null && output.bookingDetailsRequest) {
                sessionStorage.setItem('bookingDetailsRequest', output.bookingDetailsRequest);
                sessionStorage.setItem('status', JSON.stringify(output.confirmationStatus));
                sessionStorage.setItem('paymentType', 'payonline');
                window.location.href = output.redirectUrl + ".html";
            }
        },
        fail: function(error){
            $('.neucoins-loader').remove();
            $('body').css('overflow','auto');
            console.log(error);
        }
    });
}

	var corporateBooking = false;
	var guaranteedByCreditCard = false;
	var paymentOptValue="Pay at hotel";
	var guaranteeAmount = 0;
	var partialBookingResponse;
	var returnmessage ;
	var bookForSelf= true;
	var isIHCLCBSiteFlag;
	$( document ).ready( function() {

		/*For ama nooking checkOut Page*/
		window.onload = function(e){ 
			if($(".cm-page-container").hasClass("ama-theme")) {

			   $('.pay-now-button ').css({ "opacity" : 1 });
			  $('.pay-now-button').attr("disabled", false);

		} 
            /*$('#PAYATHOTEL').prop('checked', 'true');*/
            /**Pay online as the default option */
            	$('#PAYONLINENOW').prop('checked', 'true');
            	$('.payment-radio-content').addClass('cm-hide');

			populateCartTotalAmount();
			handleGuaranteePayment();
			decideBookOnlineVisibility();
		var sebObject = dataCache.session.getData('sebObject');
		var bookForOtherEnable = dataCache.session.getData('bookforSomeoneElse');
		var sebRedemption = "false";
			if(sebObject && sebObject != null && sebObject != undefined){
				sebRedemption = sebObject.sebRedemption;
			}
			if(sebRedemption == "true"){
				$('#bookingGuestTitle').selectBoxIt('selectOption', sebObject.salutation);
				$('#guest-firstName').val(sebObject.firstName);
				$('#guest-lastName').val(sebObject.lastName);
				$('#guest-Email').val(sebObject.emailID);
				$('#guest-PhoneNumber').val(sebObject.mobileNumber);
				$('#sebEmployeeNumber').val(sebObject.employeeNumber);
				$('#guest-firstName').prop('disabled', true);
				$('#guest-lastName').prop('disabled', true);
				$('#guest-Email').prop('disabled', true);
				$('#guest-PhoneNumber').prop('disabled', false);
				$('.sebEmployeeNumberDiv').show();
				$('.guest-MembershipNumber').parent().hide();   
				$(".book-for-tic-wrp").addClass('d-none');	
                $('#PAYONLINENOW').parent().parent().remove();
                $('#PAYATHOTEL').prop("checked", true);
			}else if(sessionStorage.getItem('gravtyVoucherSelected') == "true"){
				var gravtyUserSession = JSON.parse(sessionStorage.getItem('gravtySessionLogin')) ;
				$('#bookingGuestTitle').selectBoxIt('selectOption', gravtyUserSession.title);
				$('#guest-firstName').val(gravtyUserSession.firstName);
				$('#guest-lastName').val(gravtyUserSession.lastName);
				$('#guest-Email').val(gravtyUserSession.email);
				$('#bookingGuestCountry').val(gravtyUserSession.countryName + " (+"+ gravtyUserSession.countryCode+")");
				$('#guest-PhoneNumber').val(gravtyUserSession.phoneNum);
				$('#guest-firstName').prop('disabled', true);
				$('#guest-lastName').prop('disabled', true);
				$('#guest-Email').prop('disabled', true);
				$('#guest-PhoneNumber').prop('disabled', false);
				$('.guest-MembershipNumber').parent().show();  
				$('#guest-MembershipNumber').val(sessionStorage.getItem('gravtyMemberNumber'));
				$('#guest-Email').prop('disabled', true);
				$('#guest-MembershipNumber').removeClass('invalid-input');
			}
			if(bookForOtherEnable == "false" || bookForOtherEnable == false){
				$(".book-for-tic-wrp").addClass('d-none');
			}
			if(dataCache.session.getData('modifyBookingState')){
				$('#PAYONLINENOW').closest('.ihclcb-payment-opt-btn').hide();
				if(dataCache.session.getData('modifyBookingState') == 'modifyGuest'){
					$('.payment-details-wrp').hide();
					$('.checkout-enter-details-header.payment').hide();
					}
			}
			if( sessionStorage.getItem('gravtyVoucherSelected') == "true" ) {hidePaymentVoucherRedemption();}
			if( dataCache.session.getData('vouchershareholderflow') == "true" ) {hidePaymentVoucherRedemption();}
			if(dataCache.session.getData('voucherRedemption') && dataCache.session.getData('voucherRedemption') == 'true') {
					$('#GUARANTEEONENIGHTDEPOSIT').closest('.ihclcb-payment-opt-btn').remove();							
			}
	}

		// [IHCLCB start]
		isIHCLCBSiteFlag = isIHCLCBSite();
		if(isIHCLCBSiteFlag) {
			// set active status Bill to company
			$("#BILLTOCOMPANY").closest('.ihclcb-payment-opt-btn').addClass('selected-ihclcb-payment-btn')

			 // payment option card active status change
			$('.ihclcb-payment-opt-btn .payment-radio-btn').change(function(){
				$(this).closest('.ihclcb-payment-opt-btn').addClass('selected-ihclcb-payment-btn').siblings().removeClass('selected-ihclcb-payment-btn');
			});
		}

		// [IHCLCB end]


		var contentRootPath = $('#content-root-path').val();
		if (contentRootPath == "" || contentRootPath == null || contentRootPath == 'undefined') {
			contentRootPath = "/content/tajhotels";
		}

		$('#bookingalert').hide();
		$('#cancel-spin').hide();
		

		// payment type button listener
		$( '.payment-radio-btn' ).change( function() {

			if($("#PAYATHOTEL").is(":checked")){
				$('.payment-radio-content').addClass('cm-hide');
				$('.credit-card-payment-wrp').removeClass('cm-hide');
			}else if($("#GUARANTEEPAYMENT").is(":checked")){
				$('.payment-radio-content').addClass('cm-hide');
				$('.guarantee-payment-wrp').removeClass('cm-hide');
				$('.guarantee-amount').text(roundPrice(guaranteeAmount));
			}else if($("#GUARANTEEONENIGHTDEPOSIT").is(":checked")){
				$('.payment-radio-content').addClass('cm-hide');
				//$('.guarantee-payment-wrp').removeClass('cm-hide');
                //$('.guarantee-payment-wrp ').addClass('cm-hide');
				//$('.guarantee-amount').text(roundPrice(guaranteeAmount));
			}else if($("#PAYONLINENOW").is(":checked")){
				$('.payment-radio-content').addClass('cm-hide');
				// [IHCLCB-FLOW]
			}else if($("#BILLTOCOMPANY").is(":checked")){
				$('.payment-radio-content').removeClass('cm-hide');
				// $('.credit-card-payment-wrp').addClass('cm-hide');
				$('.gift-card-payment-wrp').addClass('cm-hide');
			}
			// [IHCLCB-END]
			// var selectedIndex = $( this ).index( '.payment-radio-btn' );
			// $( '.payment-radio-content' ).addClass( 'cm-hide' );
			// $( $( '.payment-radio-content' )[ selectedIndex ] ).removeClass( 'cm-hide' );

			/*
			 * if($("#PAYONLINENOW").is(":checked")){ $('.pay-now-button ').css({ "opacity" : 1 });
			 * $('.pay-now-button').attr("disabled", false); }else { $('.pay-now-button ').css({ "opacity" : 0.33 });
			 * $('.pay-now-button').attr("disabled", true); }
			 */

			if(!guaranteedByCreditCard){
				$('.payment-radio-content').addClass('cm-hide');
			}

		} );



		// preventing propagation within signin form
		$( '.checkout-member-signin-container' ).click( function( e ) {
			e.stopPropagation();
		} );

		// booking for someone else checkbox handler

		$( '.booking-others-checkbox' ).change( function() {

			if ( this.checked ) {
				$( '.biller-details-wrp' ).show();
			} else {

				$( '.biller-details-wrp' ).hide().find( '.sub-form-mandatory' ).removeClass( 'invalid-input' );
			}
		} );

		
		var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
		checkMemberTypeforPaymentOptions();

		// [TIC-FLOW]
		var userDetails = getUserData();
		$( '.booking-others-tic-checkbox' ).change( function() {
			if ( this.checked ) {
				if(!isIHCLCBSiteFlag) {
					ticRoomRedemptionObjectSession ? ticRoomRedemptionObjectSession.isTicBookForSomeoneElse = true : '';
					$('#bookingGuestTitle').prop('disabled', false).val('');
					$('#bookingGuestTitleSelectBoxIt #bookingGuestTitleSelectBoxItText').html('')
					$('#guest-firstName').prop('disabled', false).val('');
					$('#guest-lastName').prop('disabled', false).val('');
					$('#guest-Email').prop('disabled', false).val('');
					$('#guest-PhoneNumber').prop('disabled', false).val('');
					$('#guest-MembershipNumber').prop('disabled', false).val('');
					$('#guest-MembershipNumber').addClass('d-none');
					$('.guest-MembershipNumber').addClass('d-none');
					dataCache.session.setData("ticRoomRedemptionObject", ticRoomRedemptionObjectSession);
				} else {
				 // [IHCLCB]
		
					$('#tic-member-id-ihclcb').prop('disabled',true).val("");            
					inputFieldDisabler(false);
				}
				bookForSelf = false;
			}else{
				if(!isIHCLCBSiteFlag) {                
					if (userDetails.nameDetails.salutation) {
						if(userDetails.nameDetails.salutation.indexOf('.') == -1){
								userDetails.nameDetails.salutation = userDetails.nameDetails.salutation+'.';
						}
						$('#bookingGuestTitle').selectBoxIt('selectOption', userDetails.nameDetails.salutation);
						$('#bookingGuestTitle').prop('disabled', true);
					}
					if(userDetails.nameDetails && userDetails.nameDetails.firstName){
						$('#guest-firstName').prop('disabled', true);
						$('#guest-firstName').val(userDetails.nameDetails.firstName);
					}
					if(userDetails.nameDetails && userDetails.nameDetails.lastName){
						$('#guest-lastName').prop('disabled', true);
						$('#guest-lastName').val(userDetails.nameDetails.lastName);
					}
					if(userDetails.primaryEmailId){
						$('#guest-Email').prop('disabled', true);
						$('#guest-Email').val(userDetails.primaryEmailId);
					}                
					if(userDetails.primaryMobile && userDetails.primaryMobile.phoneNumber && userDetails.primaryMobile.phoneNumber.length > 0 ){
						$('#guest-PhoneNumber').prop('disabled', true);
						$('#guest-PhoneNumber').val(userDetails.primaryMobile.phoneNumber);
					}
					$('#guest-MembershipNumber').prop('disabled', true);
					if(userDetails.brandData.ticNumber)
						$('#guest-MembershipNumber').val(userDetails.brandData.ticNumber[userDetails.brandData.ticNumber.length - 1]);
					$('#guest-MembershipNumber').removeClass('d-none');
					$('.guest-MembershipNumber').removeClass('d-none');
					ticRoomRedemptionObjectSession.isTicBookForSomeoneElse = false;
					dataCache.session.setData("ticRoomRedemptionObject", ticRoomRedemptionObjectSession);
				} else {
					// [IHCLCB]
					$('#tic-member-id-ihclcb').prop('disabled',false).val("");
					inputFieldDisabler(true);
				}
				bookForSelf = true;
			}
		} );
		
		function inputFieldDisabler(flag) {
			$('.guest-detail-ihclcb' ).find('.sub-form-mandatory' ).removeClass( 'invalid-input' );
			$("#tic-member-id-ihclcb").removeClass('invalid-input');
			$('#corporate-ihclcb-checkout #bookingGuestTitle').prop('disabled', flag);
			$('#corporate-ihclcb-checkout #guest-firstName').prop('disabled', flag).val("");
			$('#corporate-ihclcb-checkout #guest-lastName').prop('disabled', flag).val("");
			$('#corporate-ihclcb-checkout #guest-Email').prop('disabled', flag).val("");
			$('#corporate-ihclcb-checkout #guest-PhoneNumber').prop('disabled', flag).val("");
		}


		// validateEnterDetailsElements
		var validateEnterDetailsElements = function() {
			var flag = true;
			if($('#guest-VoucherCode:visible') && $('#guest-VoucherCode:visible').length > 0){
				if($('#guest-VoucherCode').val().length<16&&$('#guest-VoucherCode').val().length>0){
					console.log($('#guest-VoucherCode').val().length);
					$('#guest-VoucherCode').addClass( 'invalid-input' );
					invalidWarningMessage( $('#guest-VoucherCode') );
				}
				if($('#guest-VoucherPin').val().length<6&&$('#guest-VoucherPin').val().length>0){
					console.log($('#guest-VoucherPin').val().length);
					$('#guest-VoucherPin').addClass( 'invalid-input' );
					invalidWarningMessage( $('#guest-VoucherPin') );
				}
			}
			if ( $( '.booking-others-checkbox' )[ 0 ].checked ) {
				$( '.guest-details-wrp, .biller-details-wrp' ).find( '.sub-form-mandatory:visible' ).each( function() {
					if ( $( this ).val() == "" ) {
						$( this ).addClass( 'invalid-input' );
						flag = false;
						invalidWarningMessage( $( this ) );
					}
				} );
			} else {
				$( '.guest-details-wrp .sub-form-mandatory:visible' ).each( function() {
					if ( $( this ).val() == "" ) {
						$( this ).addClass( 'invalid-input' );
						flag = false;
						invalidWarningMessage( $( this ) );
					}
				} );
                if ($(".invalid-input").length > 0){
                    	$("html, body").animate({ scrollTop: ($('.invalid-input').offset().top - 300) }, "linear");
                    }
			}
			var privacyCheckBox = $('input[name="privacyPolicy"]');
			var privacyCheckBoxValue = $('input[name="privacyPolicy"]').is(':checked');
			if(privacyCheckBoxValue==false){
				flag = false;
				privacyCheckBox.closest('.policy-terms-external-wrapper').find('.policy-terms-warning-message').show();
                if ($(".invalid-input").length < 1){
					$("html, body").animate({ scrollTop: ($('.policy-terms-external-wrapper').offset().top - 300) }, "linear");
                 }
			}
			var termsCheckBox = $('input[name="termsAndConditions"]');
			var termsCheckBoxValue = $('input[name="termsAndConditions"]').is(':checked');
			if(termsCheckBoxValue==false){
				flag = false;
				termsCheckBox.closest('.policy-terms-external-wrapper').find('.policy-terms-warning-message').show();
                if ($(".invalid-input").length < 1){
					$("html, body").animate({ scrollTop: ($('.policy-terms-external-wrapper').offset().top - 300) }, "linear");
                 }
			}

			if(isIHCLCBSiteFlag) {
				return flag;
			}

			var $guestTitleDD = $( '#bookingGuestTitle' );
			var $countryDD = $( '#bookingGuestCountry' );
			if(!$guestTitleDD.val() || $guestTitleDD.val() == "") {
				flag = false;
				$guestTitleDD.closest('.sub-form-input-wrp').find('.dd-error-msg').css('display', 'block');
				$guestTitleDD.closest('.sub-form-input-element').addClass('invalid-input');
			}else{
				$guestTitleDD.closest('.sub-form-input-element').removeClass('invalid-input');
			}

			if($countryDD.length && !$countryDD.val() || $countryDD.val() == "") {
				flag = false;
				$countryDD.closest('.sub-form-input-wrp').find('.dd-error-msg').css('display', 'block');
				$countryDD.closest('.sub-form-input-element').addClass('invalid-input');
			}else{
				$countryDD.closest('.sub-form-input-element').removeClass('invalid-input');
			}

			var $membershipNumberInput = $('[name="guestMembershipNumber"]');
			if($membershipNumberInput.val()) {
				var userloggedin=getUserData();
				if(userloggedin && userloggedin.loyaltyInfo[0].currentSlab && userloggedin.brandData && sessionStorage.getItem('gravtyVoucherSelected') != "true"){                       
					// && userloggedin.card.type.includes("TIC")
					//old regex before TCP: (/^101\d{9}$/)
					if(!(/^\d{9,18}$/).test($membershipNumberInput.val())) {
						$membershipNumberInput.addClass("invalid-input");
						$membershipNumberInput.next().html("Please enter a valid number");
						flag = false;
					} else {
						$membershipNumberInput.removeClass("invalid-input");
					}
				}
				else{
					if((!(/^\d{9,18}$/).test($membershipNumberInput.val())) && sessionStorage.getItem('gravtyVoucherSelected') != "true") {
						$membershipNumberInput.addClass("invalid-input");
						$membershipNumberInput.next().html("Please enter a valid number");
						flag = false;
					} else {
						$membershipNumberInput.removeClass("invalid-input");
					}
				}

			} else {
				$membershipNumberInput.removeClass("invalid-input");
			}

			return flag;
		}

		// proceed button validation
		$( '.proceed-payment-button' ).click( function() {

			if(validateEnterDetailsElements()){
				if ( $( '.sub-form-input-element' ).hasClass( 'invalid-input' ) ) {
					$( '.invalid-input' ).first().focus();
					var billerDetailsHasInvalidInput = ( $( '.biller-details-wrp .sub-form-input-element' ).hasClass( 'invalid-input' ) );
					if ( billerDetailsHasInvalidInput == false ) {
						if ( ( $( '#bookingGuestTitle' )[ 0 ].value == "" ) ) {
							$( '.selectboxit' ).trigger( 'click' );
						}
					}
				} else {         
					var voucherRedemption = dataCache.session.getData('voucherRedemption');
					var voucherValidationEnable = document.getElementById('voucher-validation-enable').value;
					if(voucherRedemption && voucherRedemption == 'true' && voucherValidationEnable && sessionStorage.getItem('gravtyVoucherSelected') != 'true'){
						validateVoucherwithQC();
					}else{
						var userloggedin=getUserData();
						if(userloggedin && userloggedin.nameDetails && 
						(!userloggedin.nameDetails.firstName || !userloggedin.nameDetails.lastName || !userloggedin.nameDetails.primaryEmailId)){
							if(ticRoomRedemptionObjectSession && !ticRoomRedemptionObjectSession.isTicBookForSomeoneElse)
								updateProfileWhileBooking();
						}
						proceedCheckoutWithPaymentOptions();
					}  
				}
			}
		} );
		
		function proceedCheckoutWithPaymentOptions(){
			var bookingData=JSON.parse(extractBookingDetails());
			var guestDetails=extractGuestDetails();
			trigger_guestDetails(bookingData,guestDetails);
			dataCache.session.setData('bookingGuestDetails',JSON.stringify(guestDetails));

					// registering an event for following function
					$('#PAYATHOTEL,#PAYONLINENOW').click(function() {
						paymentOptValue= $(this).val();
					});
					var roomsData= dataCache.session.getData( "bookingOptions" );
					/*
					 * This function pushes the analytics data to dataLayer this is the guest details validation step ("1")
					 */
					payingAtCart(roomsData, "1");

					if(isIHCLCBSiteFlag){
						$("#BILLTOCOMPANY").prop("checked", true);
					 // set active status Bill to company
						$("#BILLTOCOMPANY").closest('.ihclcb-payment-opt-btn').addClass('selected-ihclcb-payment-btn').siblings().removeClass('selected-ihclcb-payment-btn');
					}
					else{
						var voucherRedemption = dataCache.session.getData('voucherRedemption');
						var voucherShowRates = dataCache.session.getData('voucherRedemptionShowPrice');
						var sebObject = dataCache.session.getData('sebObject');
					var sebRedemption = "false";
					if(sebObject && sebObject != null && sebObject != undefined){
						sebRedemption = sebObject.sebRedemption;
					}
						if(voucherRedemption && voucherRedemption == 'true' && !voucherShowRates) {
							hidePaymentVoucherRedemption();
						}else if( sebRedemption == 'true') {
							hidePaymentVoucherRedemption();
						}else if( sessionStorage.getItem('gravtyVoucherSelected') == "true" ) {
							hidePaymentVoucherRedemption();
							/*Pay online to be hidden for voucher redemption and tax to be allowed to be paid online - pay online disabled*/
							 //$('#PAYONLINENOW').prop('checked', 'true');
							 //$('.payment-radio-content').addClass('cm-hide');
						}else if(voucherRedemption && voucherRedemption == 'true') {
							$('#GUARANTEEONENIGHTDEPOSIT').closest('.ihclcb-payment-opt-btn').remove();							
						}else {
							//$('#PAYATHOTEL').prop("checked", true);
							$('.payment-radio-content').addClass('cm-hide');
						}
					}

					/* $('.payment-radio-btn').first().attr("checked",true); */
					// $( '.booking-details-wrp' ).hide();
					// $( '#PAYONLINENOW' ).hide();
					$( '.payment-details-wrp' ).show();
					$('.checkout-enter-details-header.payment').removeClass('cm-hide');
					// $('.checkout-enter-details-header.booking').addClass(' cm-hide');
					// $('.payMethod').html($("input[name='payment-method']:checked").val());
					var totalCartPrice = dataCache.session.getData( "bookingOptions" ).totalCartPrice;
					var totalCartTax = dataCache.session.getData( "bookingOptions" ).totalCartTax;

					// Removing PAYATHOTEL if Guarantee payment required
					

					// [TIC-FLOW]
					var userDetails = getUserData();
					var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
					var userSelectedCurrency =  dataCache.session.getData("selectedCurrency");
					if (userDetails && userDetails.brandData && userDetails.loyaltyInfo[0].currentSlab && ticRoomRedemptionObjectSession && ticRoomRedemptionObjectSession.isTicRoomRedemptionFlow) {
						var totalCartTax  = 0;
						roomsData.selection.forEach(function(item, index) {
							totalCartTax = totalCartTax + item.roomTaxRate;
						})

						if (userSelectedCurrency != 'INR' && userSelectedCurrency != '₹') {
							var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
							if (ticRoomRedemptionObjectSession && ticRoomRedemptionObjectSession.currencyRateConversionString) {
								var currencyRateConversionString = ticRoomRedemptionObjectSession.currencyRateConversionString;
								var conversionRate = parseFloat(currencyRateConversionString[userSelectedCurrency + '_INR']);
								totalCartPrice = Math.round(totalCartPrice * conversionRate);
								totalCartTax  = Math.round(totalCartTax * conversionRate);
							}

						}

						$( '.credit-card-total-amount' ).html(roundPrice(Math.ceil(totalCartPrice- totalCartTax)) +" TIC/ "+ roundPrice(Math.ceil(totalCartPrice- totalCartTax) /2)+" EPICURE");
						$( '.rupee-symbol' ).html(' ');
					}else{
						$( '.credit-card-total-amount' ).html( roundPrice(totalCartPrice) ).digits();
					}

					$([document.documentElement, document.body]).animate({
						scrollTop: $(".checkout-payment-details-container ").offset().top
					}, 600);

					$( '.checkout-form-step-wrp' ).css( 'pointer-events', 'auto' );

					if(dataCache.session.getData('modifyBookingState')=="modifyAddRoom" || dataCache.session.getData('modifyBookingState')=="modifyRoomOccupancy"){
						hidePaymentVoucherRedemption();
					}
				}





		function validateVoucherwithQC(){		
				var vCode = $('#guest-VoucherCode').val();
				var vPin = $('#guest-VoucherPin').val();
				var requestString = "cardNumber=" + vCode + "&cardPin=" + vPin;
				$('body').showLoader();
				$.ajax({
						method : "POST",
						cache : false,
						url : "/bin/buy-prepaid-epicure/balance",
						dataType : 'json',
						data : requestString
					}).done(function(response) {	
						$('body').hideLoader();
						 if (response.status == false) {
							warningBox({title : "Your voucher code or PIN does not exist or has been redeemed."});
						 }else{
							if (response.message == "Transaction successful.") {
								var buyPrepaidEpicure = response.buyPrepaidEpicure;
								buyPrepaidEpicure = JSON.parse(buyPrepaidEpicure);
								if(buyPrepaidEpicure.amount == "0.0"){
									warningBox({title : "Voucher number entered is already used and cannot be processed further."});
								}else{
									proceedCheckoutWithPaymentOptions();
								}					
							}
						}						
					}).fail(function(){				
							$('body').hideLoader();     
							if (response.status == 504) {                                
								setWarningInDom("TIMEOUT ERROR OCCURED WHILE VALIDATING VOUCHER");
							} else {
								setWarningInDom("VOUCHER VALIDATION FAILED");
							}
					});	
			}

		// redeem points checkbox handler

		$( '.redeem-points-checkbox' ).change( function() {
			if ( this.checked ) {
				$( '.redeem-checkbox-wrp' ).addClass( 'redeem-points-checked' );
			} else {
				$( '.redeem-checkbox-wrp' ).removeClass( 'redeem-points-checked' );
			}
		} );


		/*
		 * $('.payMethod').html($("input[name='payment-method']:checked").val());
		 * $('input[type=radio][name=payment-method]').change(function() { $('.payMethod').html(this.value); });
		 */

		// Booking guest dropdown
		var options = {};
		var $bookingGuestTitle = $( '#bookingGuestTitle' );
		var $redeemTicDropdown = $( '#redeemTicDropdown' );
		var $bookingGuestCountry = $('#bookingGuestCountry');
		var $membershipNumberInput = $('[name="guestMembershipNumber"]');

		var dropDowns = {
				titles: {
					options: [ ],
					elem: $bookingGuestTitle,
					default: '',
					selected: null,
					dependent: {
						elem: null
					}
				},
				tic: {
					options: [ 'TIC plus Credit Card', 'Epicure plus Credit Card' ],
					elem: $redeemTicDropdown,
					default: '',
					selected: null,
					dependent: {
						elem: null
					}
				},
				country: {
					options: (getCountryList()).map(countryWithCodes),
					elem: $bookingGuestCountry,
					default: '',
					selected: null,
					dependent: {
						elem: null
					}
				}
		}


		function countryWithCodes(countries) {
			var countryNCodeVal =  countries.name + " (+"+ countries.code+")";
			return countryNCodeVal;
		}

		function initbookingGuestTitle() {
			// receiving titles from AEM Author

			var bookingGuestTitle = new initDropdown( $bookingGuestTitle,dropDowns.titles );
			bookingGuestTitle.initialize();

			var countryList = new initDropdown( $bookingGuestCountry, dropDowns.country );
			countryList.initialize();
				  
			selectCountryDropdown($bookingGuestCountry);  
			
			// var redeemTicDropdown = new initDropdown( $redeemTicDropdown,
			// dropDowns.tic ); redeemTicDropdown.initialize();

		};

		function selectCountryDropdown($ele, value) {
			if($ele.length!=0){
				$ele.val(value || 'India (+91)');
				$ele.data("selectBox-selectBoxIt").refresh();
			} 
		}
		
		function initCountryDropdown($ele, value) {
			var countries=getCountryList();
			$.each(countries,function(index,country){
				$ele.append($('<option value="'+country.name+'">'+country.name+'</option>'));
			});
			$ele.selectBoxIt();
			selectCountryDropdown($ele, 'India');        
		}

		initbookingGuestTitle();
		initCountryDropdown($('#FTOCountry'));

		// Title dropdown change
		$bookingGuestTitle.on('change', function() {
			if(!$(this).val() || $(this).val() == "" ){

				if($(this).parent().find('.dd-error-msg').length > 0){
					$(this).parent().find('.dd-error-msg').css('display', 'block');
					$(this).closest('.sub-form-input-element').addClass('invalid-input');
				}
				else{
					$(this).parent().siblings('.dd-error-msg').css('display', 'block');
					$(this).closest('.sub-form-input-element').addClass('invalid-input');
				}
			} else {
				if($(this).parent().find('.dd-error-msg').length > 0){
					$(this).parent().find('.dd-error-msg').css('display', 'none');
					$(this).closest('.sub-form-input-element').removeClass('invalid-input');
				}
				else{
					$(this).parent().siblings('.dd-error-msg').css('display', 'none');
					$(this).closest('.sub-form-input-element').removeClass('invalid-input');
				}
			}
		});

		// Country dropdown change
		$bookingGuestCountry.on('change', function() {
			if(!$(this).val() || $(this).val() == "" ){
				$(this).parent().find('.dd-error-msg').css('display', 'block');
				$(this).closest('.sub-form-input-element').addClass('invalid-input');
			} else {
				$(this).parent().find('.dd-error-msg').css('display', 'none');
	// getCountryDetail('name');
	// getCountryDetail('code');
				$(this).closest('.sub-form-input-element').removeClass('invalid-input');
			}
		});

		// Validating the membership number \\&& userloggedin.card.type.includes("TIC")
		$membershipNumberInput.on('keyup', function() {
			if($membershipNumberInput.val()) {
				var userloggedin=getUserData();
				if(userloggedin && userloggedin.loyaltyInfo[0].currentSlab && userloggedin.brandData){
					//old regex before TCP: (/^101\d{9}$/)
					if(!(/^\d{9,18}$/).test($membershipNumberInput.val())) {
						$membershipNumberInput.addClass("invalid-input");
						$membershipNumberInput.next().html("Please enter a valid number");
					} else {
						$membershipNumberInput.removeClass("invalid-input");
					}
				}
				else{
					if(!(/^\d{9,18}$/).test($membershipNumberInput.val())) {
						$membershipNumberInput.addClass("invalid-input");
						$membershipNumberInput.next().html("Please enter a valid number");
					} else {
						$membershipNumberInput.removeClass("invalid-input");
					}
				}

			} else {
				$membershipNumberInput.removeClass("invalid-input");
			}
		});

		var cardType = "";
		// credit card type identifier
		$( '.credit-card-number' ).on( "keyup focusin", function() {
			var cardNumber = $( this ).val();
			var creditCardType = getCreditCardType( cardNumber );
			if ( creditCardType ) {
				var code = creditCardTypeCode( creditCardType.type );
				if( code == ""){
					$( '.credit-card-type' ).html( "This credit card is not accepted. Please use Amex/Diners/Master/Visa." );
				}else{
					cardType = code;
					$( '.credit-card-type' ).html( creditCardType.type );
					$( this ).removeClass( "invalid-input" );
					$( '.credit-card-type.sub-form-input-warning' ).html( creditCardType.type ).show().removeClass( "cm-scale-animation" );
				}

			} else {
				$( this ).addClass( "invalid-input" );
				invalidWarningMessage( $( this ) );
				$( '.credit-card-type.sub-form-input-warning' ).html( "Please enter a valid credit card number." ).addClass( "cm-scale-animation" );
			}
		} );

		function validatePaymentInputFields() {
			// [TIC-FLOW]
			var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
			if(ticRoomRedemptionObjectSession && ticRoomRedemptionObjectSession.isTicRoomRedemptionFlow){
				return true;
			}

			var contentToValidate = false;
			if(!guaranteedByCreditCard || $( '#PAYONLINENOW').is(':checked') || $( '#GUARANTEEPAYMENT').is(':checked') || $( '#GUARANTEEONENIGHTDEPOSIT').is(':checked')){
				return true;
			}else{
				contentToValidate = $('.credit-card-payment-wrp');
			}
			if(contentToValidate){
				contentToValidate.find( '.sub-form-mandatory' ).each( function() {
					console.log( $( this ) );
					if ( $( this ).val() == "" ) {
						$( this ).addClass( "invalid-input" );
						invalidWarningMessage( $( this ) );
					}
				} );
				return (contentToValidate.find( '.sub-form-mandatory.invalid-input' ).length == 0)
			}
			return contentToValidate;
		}

		$('.policy-terms-external-wrapper .mr-filter-checkbox').change(function(){
			if($(this).is(':checked')){
				$(this).closest('.policy-terms-external-wrapper').find('.policy-terms-warning-message').hide();
			}
		});

		var creditCardStartDate = new Date();
		var bookingOptionCache = dataCache.session.getData( "bookingOptions" );
		if(bookingOptionCache){
			creditCardStartDate = moment(creditCardStartDate,"MMM Do YY")["_d"];
		}

		$( "#creditCardExpiryDate" ).datepicker( {
			container:$('.cm-page-container'),        
			format: 'mm/yy',
			viewMode: "months",
			minViewMode: "months",
			startDate: "-0m",
			forceParse: false
		} ).on( 'changeDate', function( ev ) {

			$( this ).datepicker( 'hide' );
			$( "#creditCardExpiryDate" ).removeClass( 'invalid-input' );
		} );

		$( "#creditCardExpiryDate" ).on( "keyup paste", validateCreditCardInput );

		function validateCreditCardInput() {
			var creditCardValue = $( "#creditCardExpiryDate" ).val();
			var creditCardRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
			if ( creditCardRegex.test( creditCardValue ) ) {
				var selectedDate = moment( creditCardValue, "MM/YY" )[ "_d" ];
				$( this ).datepicker( "setDate", selectedDate );
				if ( $( this ).datepicker( "getDate" ) ) {
					$( this ).removeClass( 'invalid-input' );
					return;
				}
			}
			$( this ).addClass( 'invalid-input' );
			invalidWarningMessage( $( this ) );
		}
		$( '.form-step' ).on( "click", function() {
			var formIndex = $( this ).index();
			if ( formIndex == 1 ) {
				$( '.proceed-payment-button' ).trigger( "click" );
			} else {
				$( '.form-step-content' ).hide();
				$( $( '.form-step-content' )[ formIndex ] ).show();
				$( '.checkout-enter-details-header' ).addClass( 'cm-hide' );
				$( $( '.checkout-enter-details-header' )[ formIndex ] ).removeClass( 'cm-hide' );
			}
		} );

		$( '.special-flight-common-header' ).on( 'click', function() {
			$( this ).siblings( '.special-flight-common-content' ).toggle();
			$( this ).find( '.special-flight-arrow' ).toggleClass( 'cm-rotate-show-more-icon' );
		} );

		$( '#creditCardExpiryDate' ).on( 'keyup', function( e ) {
			var inputLength = $( this ).val().length;
			if ( e.keyCode == 8 || e.which == 8 ) {
				// when input is backspace
				if ( inputLength == 3 ) {
					$( this ).val( $( this ).val().slice( 0, -1 ) );
				}
			} else {
				if ( inputLength == 2 ) {
					$( this ).val( $( this ).val() + "/" );
				}
			}
		} );
	// //////////////////////// Modified Here ////////////////////////////////


		function payingAtCart(roomsData, step){
			var ecommerce= {};
			// var roomsData= dataCache.session.getData( "bookingOptions" );

			var checkout = {}
			var actionField = {};
			actionField.step= step;

			if(step === "2"){
				if(paymentOptValue=="Pay at hotel"){

					actionField.option= "VISA"
				}else if(paymentOptValue=="Pay Online now"){

					actionField.option= "PAY_ONLINE"
				}else {
					actionField.option= paymentOptValue;
				}
			}
			checkout.actionField=actionField;
			checkout.products=prepareJsonRoom(roomsData);
			ecommerce.checkout= checkout;
			pushRoomsJsonOnClick("checkout", ecommerce);

		}


		function prepareJsonRoom(roomsData){

			var products =[];

			var count= 0;
			var variant;

			roomDataArray= roomsData.selection;
			$(roomDataArray).each(function(index){
				var roomCardObj= {};

				roomCardObj.name=this.title;
				roomCardObj.id= roomsData.hotelId+"-"+this.roomTypeCode+"-"+this.ratePlanCode;
				roomCardObj.price=this.selectedRate;
				roomCardObj.brand= roomsData.targetEntity+"-"+roomsData.hotelId+"-"+"Indian Hotels Company Limited&quot";
				variant= $($(roomsData.selection[count].details).find('.more-rate-amenities .more-rate-title')).text();
				roomCardObj.category="Rooms/"+variant+"/"+this.title;
				roomCardObj.variant = variant;
				roomCardObj.quantity=count+1;
				count++;
				products.push(roomCardObj);

			});

			return products;


		}
		$('#PAYATHOTEL').click(function(){
			if ($("#PAYATHOTEL").prop("checked")) {
				 // alert("hii"); // do something
				 $(".iframe-container").css('display' , 'none');
				$('.pay-now-button-wrp').show();
						}});
		$('#PAYONLINENOW').click(function(){
			if ($("#PAYONLINENOW").prop("checked")) {
					// alert("hii"); // do something
				if($('#juspay_iframe').find('iframe#juspay_iframe').length !== 0){
					$('.pay-now-button-wrp').hide();
					}
					$(".iframe-container").css('display' , 'block'); 
						}});                

		 var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
		 var userDetails= getUserData();
		 if(userDetails){
		 var loyalCustomer = userDetails.loyalCustomer;
		 }
		if (ticRoomRedemptionObjectSession && ticRoomRedemptionObjectSession.isTicRoomRedemptionFlow && 
		userDetails && loyalCustomer =="Y") {
			var paymentClassName = ".pay-now-button, .pay-points-plus-cash, .pay-points-only, .proceed-payment-button";
		} else {
			var paymentClassName = ".pay-now-button, .pay-points-plus-cash, .pay-points-only";
		}
		$(paymentClassName).click(function() {
			$( '.proceed-payment-button' ).trigger( "click" );
			//if($(this).hasClass('proceed-payment-button') && !validateEnterDetailsElements())
			if ($("#PAYATHOTEL").length && $("#PAYATHOTEL").prop("checked")) {$('.credit-card-payment-wrp').removeClass('cm-hide')}
				
			if(!validateEnterDetailsElements()){
				return false;
			}
			var onlineBook = false;
			var tcpsourceflag = sessionStorage.getItem("source");
			var userDetails= getUserData();
			var loyalCustomer = "";
			if(userDetails){
			 loyalCustomer = userDetails.loyalCustomer;
			}
			// [TIC-FLOW]
			if(!ticPaymentFlow(this)){
				return;
			}

			if ($("#PAYONLINENOW").prop("checked")) {
				onlineBook = true;
				}

			// [TIC-FLOW]
			var bookOptionsSession = dataCache.session.getData("bookingOptions");
			var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
			var successRedirctUrl ="";
			var userDetails = getUserData();
			if(ticRoomRedemptionObjectSession && ticRoomRedemptionObjectSession.isTicRoomRedemptionFlow && 
				(userDetails && userDetails.loyalCustomer != "Y" )){
				successRedirctUrl  = "/bin/redeemtransaction";
			}

		   
			var roomsData= dataCache.session.getData( "bookingOptions" );

			if(validatePaymentInputFields()){
				/*
				 * This function pushes the analytics data to dataLayer this is the payment option step ("2")
				 */
				payingAtCart(roomsData, "2");

				$( '.pay-now-button, .pay-points-plus-cash, .pay-points-only' ).hide();
				$( '.pay-now-spinner' ).show();
				// [TIC-FLOW LOADER]
				$('body').showLoader();
				var modifyBookingState = dataCache.session.getData('modifyBookingState');
				if(modifyBookingState && modifyBookingState!='modifyAddRoom'){
					var modifiedBookingOptions = dataCache.session.getData('bookingDetailsRequest');
					modifiedBookingOptions = deleteCancelledBookingFromModification(modifiedBookingOptions);
                    modifiedBookingOptions = JSON.parse(modifiedBookingOptions);
					var guest = modifiedBookingOptions.guest;
					guest.title = document.getElementById("bookingGuestTitle").value;
					guest.firstName = document.getElementById("guest-firstName").value;
					guest.lastName = document.getElementById("guest-lastName").value;
					guest.email = document.getElementById("guest-Email").value;
					guest.country = document.getElementById("bookingGuestCountry").value;
					guest.phoneNumber = document.getElementById("guest-PhoneNumber").value;
					guest.membershipNo = document.getElementById("guest-MembershipNumber").value;
					guest.gstNumber = document.getElementById("guest-GSTNumber").value;
					guest.specialRequests = modifyBookingExistingComments + ' , '+ document.getElementById("special-request").value;

					modifiedBookingOptions.guest = guest;
                    dataCache.session.setData('itineraryNumber',modifiedBookingOptions.itineraryNumber);
                    sessionStorage.setItem('itineraryNumber',modifiedBookingOptions.itineraryNumber);

					modifiedBookingOptions = JSON.stringify(modifiedBookingOptions);

					$.ajax({
						type: 'POST',
						url: '/bin/modifyReservation',
						data: {
							'modifyJson': modifiedBookingOptions
						},
						success: function (data) {
							console.log(typeof data);
							console.log(data); 
							try{
								var responseObject = (data != undefined && data.length != 0) ? JSON.parse(data) : ''; 
							} catch (e) {
								var popupParams = {
										title : 'Booking modification failed.',
										description : '',
										isWarning : true
								}
								warningBox(popupParams);
							}
							if(data == undefined || data == "" || data.length == 0){
									var popupParams = {
											title: 'Booking modification failed.',
										description: 'Modify Booking response is empty.',
									}
								warningBox( popupParams );
								hideSpinShowPaynowBTN();	
							}else if(responseObject.success){                                                    
								dataCache.session.setData('bookingDetailsRequest',JSON.stringify(responseObject));
								window.location.assign("https://"+window.location.host+"/en-in/booking-confirmation?fromFindReservation=true");
							} else if(!responseObject.success){
								var res = JSON.parse(data);

								var popupParams = {
										title: 'Edit Booking Failed!',
										description: res.errorMessage,
								}
								warningBox( popupParams );
								hideSpinShowPaynowBTN();
							}                     
						},
						fail: function(rrr){
							var popupParams = {
									title: 'Edit Booking Failed!',
									description: 'Modify Booking service calling failed. Please try again later.',

							}
							warningBox( popupParams );
							hideSpinShowPaynowBTN();
							console.error("failed to call ajax post");
						},
						error: function(xhr){
							var popupParams = {
									title: 'Edit Booking Failed!',
									description: 'Error occured while calling modifying service. Please try aftersome time.',

							}
							warningBox( popupParams );
							hideSpinShowPaynowBTN();
						}           
					});
				}else{                
					var failure = function(err) {
						alert("Unable to retrive data "+err);
					};

					var billerDetails=extractBillerDetails();
					var guestDetails=extractGuestDetails();
					var paymentsDetails=extractPaymentDetails();
					var flightDetails=extractFlightDetails();
					var ticpoints=extractTicPointsData();

					paymentsDetails.ticpoints = ticpoints;

					var bookingDetailsRequest = {};
					bookingDetailsRequest.billerDetails = billerDetails;
					bookingDetailsRequest.guestDetails = guestDetails;
					bookingDetailsRequest.paymentsDetails = paymentsDetails;
					var cacheText = JSON.stringify(dataCache.session.getData( "bookingOptions" ));

					// converting text to JSON
					var cacheJSONData = JSON.parse(cacheText);
					paymentsDetails.currencyCode= cacheJSONData.currencySelected !=null ? cacheJSONData.currencySelected : 'INR' ;
					// paymentsDetails.totalCartPrice= cacheJSONData.totalCartPrice;
					var checkInDate = moment(cacheJSONData.fromDate,"MMM Do YY").format("YYYY-MM-DD");
					var checkOutDate = moment(cacheJSONData.toDate,"MMM Do YY").format("YYYY-MM-DD");
					var rooms = cacheJSONData.rooms;
					var totalCartPrice = cacheJSONData.totalCartPrice;
					var targetEntity = cacheJSONData.targetEntity;
					var selectionCount = cacheJSONData.selectionCount;
					var roomCount = cacheJSONData.roomCount;
					var selection = cacheJSONData.selection;
					var hotelChainCode = cacheJSONData.hotelChainCode;
					var hotelId = cacheJSONData.hotelId;
					var promotionCode= '' ;
					var appiedCoupon=cacheJSONData.couponCode !=null ? cacheJSONData.couponCode : '' ;
					var roomDetails = [];
					var hotelLocationId='';
					var isTicRoomRedemptionFlow = ticRoomRedemptionObjectSession.isTicRoomRedemptionFlow;
					for (var i = 0; i < selection.length; i++) {
						var roomDetail = {};
						hotelId = selection[i].hotelId;
						roomDetail["hotelId"] = selection[i].hotelId;
						hotelLocationId = selection[i].hotelLocationId;
						roomDetail["noOfAdults"] = selection[i].adults;
						roomDetail["noOfChilds"] = selection[i].children;
						roomDetail["roomTypeCode"] = selection[i].roomTypeCode;
						roomDetail["roomCostAfterTax"] = selection[i].selectedRate;
						roomDetail["bedType"] = selection[i].roomBedType;
						roomDetail["roomTypeName"] = selection[i].title;
						roomDetail["ratePlanCode"] = selection[i].ratePlanCode;
						roomDetail["guaranteeCode"] = selection[i].guaranteeCode;
						// [TIC-FLOW]
						if(selection[i].selectedFilterTitle === 'TIC ROOM REDEMPTION RATES' ||
							selection[i].selectedFilterTitle === 'ROOM REDEMPTION RATES' || selection[i].selectedFilterTitle === 'TAJ HOLIDAY PACKAGES'){
							if(selection[i].ratePlanCode === 'NTCC'){
								roomDetail["ratePlanCode"] = 'H00M';
								roomDetail["promoCode"] = 'H00M';
							}else if(selection[i].ratePlanCode === 'NTMS'){
								roomDetail["ratePlanCode"] = 'H00N';
								roomDetail["promoCode"] = 'H00N';
							}else if(selection[i].ratePlanCode === 'NTMG'){
								roomDetail["ratePlanCode"] = 'H00O';
								roomDetail["promoCode"] = 'H00O';
							}else if(selection[i].ratePlanCode === 'NTMP'){
								roomDetail["ratePlanCode"] = 'H00P';
								roomDetail["promoCode"] = 'H00P';
							}else if(selection[i].ratePlanCode === 'NTMH'){
								roomDetail["ratePlanCode"] = 'H0SN';
								roomDetail["promoCode"] = 'H0SN';
							}
						}else if(selection[i].selectedFilterTitle === 'TAP ROOM REDEMPTION RATES'){
							if(selection[i].ratePlanCode === 'NTAP'){
								roomDetail["ratePlanCode"] = 'XO9';
								roomDetail["promoCode"] = 'XO9';
							}
						}else if(selection[i].selectedFilterTitle === 'TAPPMe ROOM REDEMPTION RATES'){
								if(selection[i].ratePlanCode === 'NTAP'){
									roomDetail["ratePlanCode"] = 'XO9';
									roomDetail["promoCode"] = 'XO9';
								}
						}else{
							roomDetail["promoCode"] = selection[i].promoCode;
						}
						roomDetails.push(roomDetail)
					}

					var loggedInUser;
					if(getUserData()){
						loggedInUser = loggedInUserDetailsToGuest(getUserData());
						// For Booker Profile Id
						if((getUserData()).brandData && (getUserData()).brandData.ihclMembership && (getUserData()).brandData.ihclMembership[0]){
							loggedInUser.profileId = (getUserData()).brandData.ihclMembership[0].partyId;
						}
					}

					var voucherCode = cacheJSONData.usedVoucherCode;
					// invoking datalayer call for tracking
					trigger_bookingCheckout(cacheJSONData,guestDetails,paymentsDetails);
					// alert('roomDetails:-> : '+ JSON.stringify(roomDetails));
					var guest = guestDetailsToGuest(guestDetails);
					var itineraryNumber = '';
					if(modifyBookingState=='modifyAddRoom'){
						var modifiedBookingOptions = JSON.parse(dataCache.session.getData('bookingDetailsRequest'));
						itineraryNumber = modifiedBookingOptions.itineraryNumber;
					}
					// [TIC-FLOW]
					var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
					var userSelectedCurrency = dataCache.session.getData("selectedCurrency");
					if(ticRoomRedemptionObjectSession &&  ticRoomRedemptionObjectSession.isTicRoomRedemptionFlow){
						var bookingOptionsSessionData = dataCache.session.getData("bookingOptions");
						if(bookingOptionsSessionData && bookingOptionsSessionData.selection){
							ticRoomRedemptionObjectSession.selection = bookingOptionsSessionData.selection;
							ticRoomRedemptionObjectSession.ticpoints = ticpoints ;
							var userdata=getUserData();
							ticRoomRedemptionObjectSession.currencySelected = userSelectedCurrency;
							dataCache.session.setData("ticRoomRedemptionObject", ticRoomRedemptionObjectSession);
						}
					}
					// commenting to pass location Id for TD redemption
			   /* var ticSession = dataCache.session.getData("ticRoomRedemptionObject");
					if((ticSession && ticSession.isTicRoomRedemptionFlow)){
						hotelLocationId = "";
					}
					
					if(hotelId == hotelLocationId){
						console.log("HotelId and LocationId both are same.");
						hotelLocationId = "";
					}*/
					if(isIHCLCBSiteFlag){
						corporateBooking = true;
					}
					
					if(!loggedInUser){
						loggedInUser = {};
					}
                     // to solve the issue of iFrame Fnf ccAvenue page load
                    var isIFrameFnfJourney = false;
                     if(document.location.ancestorOrigins && document.location.ancestorOrigins[0] && document.location.ancestorOrigins[0].includes("mytaj.tajhotels") && document.location.ancestorOrigins[0].indexOf("mytaj.tajhotels") !== -1) {
                         isIFrameFnfJourney = true;
					}


                    paymentsDetails.currencyCode = roomsData.selection[0].currencyString || cacheJSONData.currencySelected;

					$.ajax({
						type: 'post',
						url : '/bin/bookHotelInitiateServlet', 
						data: 'guestDetails='+JSON.stringify(guest)
						+'&paymentsDetails='+JSON.stringify(paymentsDetails)
						+"&roomDetails="+JSON.stringify(roomDetails)
						+"&flightDetails="+JSON.stringify(flightDetails)
						+"&checkInDate="+checkInDate
						+"&checkOutDate="+checkOutDate
						+"&hotelId="+hotelId
						+"&hotelLocationId="+hotelLocationId
						+"&hotelChainCode="+hotelChainCode
						+"&promotionCode="+promotionCode
						+"&appliedCoupon="+appiedCoupon
						+"&voucherCode="+voucherCode
						+"&corporateBooking="+corporateBooking
						+"&itineraryNumber="+itineraryNumber
						+"&successRedirctUrl="+successRedirctUrl
						+"&source="+tcpsourceflag
						+"&loggedInUser="+JSON.stringify(loggedInUser)
						+"&isTicRoomRedemptionFlow="+isTicRoomRedemptionFlow
					   // +"&isTicRoomRedemptionFlow=true"
						+"&loyalCustomer="+loyalCustomer					
						+"&rateFilterRoomsSelected="+sessionStorage.getItem('rateFilterRoomSelection')
                        +"&isIFrameJourney="+isIFrameFnfJourney
						+"&isBookingForSelf="+bookForSelf,
						success: function(returnmessage){
							console.log('vouchershareholderflow '+dataCache.session.getData('vouchershareholderflow'));
							if(returnmessage == undefined || returnmessage == "" || returnmessage.length == 0){
								var message = 'Something went Wrong. Refreshing Page';
								var popupParams = {
										title: 'Booking Failed!',
										description: message
								}
								warningBox( popupParams );
								hideSpinShowPaynowBTN();
								location.reload();
							///}else if(returnmessage.includes('opelBundle')  && !JSON.parse(returnmessage).partialBooking){
                               }else if(!returnmessage.includes("form action")  && !JSON.parse(returnmessage).partialBooking && JSON.parse(returnmessage).payments.payOnlineNow){
								var reqJson = JSON.parse(returnmessage);
								var returnCheck;
								if(voucherCode){
									bookInitiateResponse = returnmessage;
									redeemVoucherAjaxCall();
									/*if(returnCheck){
										var $form=$(returnmessage);
										$('body').append($form);
										$form.submit();
									}*/
								}else if(sessionStorage.getItem('gravtyVoucherSelected') == 'true' && sessionStorage.getItem("gravtyVoucherRedeem") != 'true'){
										bookInitiateResponse = returnmessage;
										sendOTPRedemption();
								}
								else {
									$('body').hideLoader();
									hideSpinShowPaynowBTN();
								   //generateSignature(reqJson.opelBundle);
                                   localStorage.setItem("bookingReqJson" , JSON.stringify(reqJson));
                                   if (JSON.parse(localStorage.getItem("tajData")).userDetails && JSON.parse(localStorage.getItem("tajData")).userDetails !== null) {
                                    $(neucoinsHtml).insertBefore("#juspay_iframe");
                                       callNeuCoinsIntegration();
                                       //$(".neucoins-container").css("display", "block");
                                       $('.cm-page-container').removeClass("prevent-page-scroll");
                                   } else {
                                       redeemCoinsAndGeneratePayload(false,false);
                                   }
								}
							}else if(returnmessage.includes("form action")){
								/*This would get executed for tokenisation pay at hotel*/
								if(voucherCode){									
										bookInitiateResponse = returnmessage;
										$('#paymentid').val(returnmessage);
										redeemVoucherAjaxCall();                                   
								} else if(sessionStorage.getItem('gravtyVoucherSelected') == 'true' && sessionStorage.getItem("gravtyVoucherRedeem") != 'true'){
										bookInitiateResponse = returnmessage;
										$('#paymentid').val(returnmessage);
										sendOTPRedemption();
								} else{
									var $form=$(JSON.parse(returnmessage).tokenForm);
									$('body').append($form);
									$form.submit();
								}

							}else if((JSON.parse(returnmessage).bookingObjectResponse && JSON.parse(returnmessage).bookingObjectResponse.includes("success\":true")) ||
							(JSON.parse(returnmessage).success)){ 
								 if(JSON.parse(returnmessage).partialBooking){
									dataCache.session.setData("partialBooking",true);
									var returnJson = JSON.parse(JSON.parse(returnmessage).bookingObjectResponse);
									//partialBookingResponse = returnmessage;
									localStorage.setItem("bookingReqJson" , JSON.stringify(returnJson));
									$('#paymentid').val(JSON.parse(returnmessage).bookingObjectResponse);
									var roomStatustoJson = JSON.parse(JSON.parse(returnmessage).bookingObjectResponse );

									var rooms = [];
									var sebavailable=0;
									roomStatustoJson.roomList.forEach( function( value ) {

										var roomType = "";
										if(value.roomTypeName){
											roomType = value.roomTypeName;
										}else{
											roomType = value.roomTypeCode;
										}

										var statusValue = "";
										if(value.bookingStatus){
											sebavailable=sebavailable+1;
											statusValue = "AVAILABLE";
										}else{
											statusValue = "UNAVAILABLE";
										}
										rooms.push( {
											'type': roomType,
											'status': statusValue,
											'adults': value.noOfAdults,
											'children': value.noOfChilds

										} );
									} );
                                     dataCache.session.setData("partialbookingrooms",rooms);

									dataCache.session.setData("sebAvailable",sebavailable);
									var popupParams = {
											title: 'Not all the rooms are Available. Would you like to continue with this booking?',
											//callBack: paymentProcessOfVoucher.bind(),
                                            callBack: paymentProcessOfRedeemCoins.bind(),
											callBackSecondary: ignoreBooking.bind(),
											needsCta: true,
											isForRoomAvailability: true,
											rooms: rooms
									}
									warningBox( popupParams );
								}else if(!JSON.parse(returnmessage).partialBooking){
									var returnJson = JSON.parse(returnmessage);
									if(voucherCode){
										bookInitiateResponse = returnmessage;
										$('#paymentid').val(returnmessage);
										redeemVoucherAjaxCall();
									} else if(sessionStorage.getItem('gravtyVoucherSelected') == 'true' && sessionStorage.getItem("gravtyVoucherRedeem") != 'true'){
										bookInitiateResponse = returnmessage;
										sendOTPRedemption();
									}
								 else if(dataCache.session.getData('vouchershareholderflow') == "true" ){
                                     console.log('Inside If--> vouchershareholderflow '+dataCache.session.getData('vouchershareholderflow'));
									bookInitiateResponse = returnmessage;
									voucherRedeemFromQwikCilver();
									}
                                    else{
										if(returnJson.payments.payAtHotel){
											$('#paymentid').val(returnmessage);
											doCommit();
										}
									}

								}else {
									/* alert(returnmessage); */
									var popupParams = {
											title: 'Booking Failed!',
											description: returnmessage,
									}
									warningBox( popupParams );
									hideSpinShowPaynowBTN();
								}
							}else if(returnmessage.includes("success\":false")){
								var returnJSON = JSON.parse(returnmessage);
								var warningPopUP = {
										title: 'Booking Failed!'
								}
								if(returnJSON.warnings){
									warningPopUP.description = returnJSON.warnings;
								}else {
									warningPopUP.description = 'All Rooms are unavailable. Please try after sometime.';
								}
								warningBox( warningPopUP );
								hideSpinShowPaynowBTN();
							}else{
								var exceptionPopupParams = {
										title: 'Booking Failed!',
										description: returnmessage,
								}
								warningBox( exceptionPopupParams );
								hideSpinShowPaynowBTN();
							}
						},
						fail: function(rrr){
							var popupParams = {
									title: 'Booking Failed!',
									description: 'Booking service calling failed. Please try again later.',

							}
							warningBox( popupParams );
							hideSpinShowPaynowBTN();
							console.error("failed to call ajax post");
						},
						error: function(xhr){
							var popupParams = {
									title: 'Booking Failed!',
									description: 'Error occured while calling  booking service. Please try aftersome time.',

							}
							warningBox( popupParams );
							hideSpinShowPaynowBTN();
						}
					});
				}
			}
		});

	// ////////////////////////Modified Till Here ////////////////////////////////
		function getCountryDetail(value) {
		   // var selectedValue = $( '#bookingGuestCountry' ).length ? $( '#bookingGuestCountry' ).val() : '';
			var selectedValue = $bookingGuestCountry.length ? $bookingGuestCountry.val() : '';
			var selectedValueLength = selectedValue.length;
			var indexOfPlus = selectedValue.indexOf('+');
			var countryName = selectedValue.substr(0,indexOfPlus-1).trim();
			var countryCode = selectedValue.substr(indexOfPlus,selectedValueLength).replace(')','');
			if(value=='name')
				return countryName;
			if(value == 'code')
				return countryCode;
			return '';
		}

		function extractBookingDetails(value)
		{
			return JSON.stringify(dataCache.session.getData( "bookingOptions" ));
		}

		function extractGuestDetails()
		{
			var guestTitle = $('#bookingGuestTitle option:selected').text();
			var guestFirstName = $('input[name=guestFirstName]').val() ;
			var guestLastName = $('input[name=guestLastName]').val() ;
			var guestEmail = $('input[name=guestEmail]').val() ;
			var guestPhoneNumber = getCountryDetail('code') + $('input[name=guestPhoneNumber]').val() ;
			var guestGSTNumber = $('input[name=guestGSTNumber]').val() ;
			/* var guestCountry = $('input[name=guestCountry]').val() ; */
			var guestCountry = getCountryDetail('name');
			var guestMembershipNumber = $('input[name=guestMembershipNumber]').val()
			var specialRequest = "";
			var sebObject = dataCache.session.getData('sebObject');
			if($('textarea[name=foodRequest-data]:visible').val()!=undefined && $('input[name=iaiaNumber]').val()!=undefined){
				specialRequest = "#Special Requests#"+$('textarea[name=specialRequest-data]').val().trim() +", #Food Preferences#"+$('textarea[name=foodRequest-data]:visible').val()+", #Travel Agent IATA#"+$('#iaiaNumber:visible').val();
			}else if(sebObject && sebObject != null && sebObject != undefined && sebObject.sebRedemption == "true"){
				specialRequest = "#Special Requests#"+$('textarea[name=specialRequest-data]').val().trim() +", #Booking made by Employee Number#"+sebObject.employeeNumber;
			}
			else if(sessionStorage.getItem('employeeGSCBookingFlow') == 'true'){
				specialRequest = "#Special Requests#"+$('textarea[name=specialRequest-data]').val().trim()  +
				" , Employee Name# " + $('#employee-Name').val() + " , Employee email# " + $('#employee-email').val()+ + " , Employee Phone# " + $('#employee-phone').val()+
				" , Company name/city# " + $('#sales-office').val() +" , SFAID# " + $('#sfa-id').val();

			}else if(sessionStorage.getItem('gravtyVoucherSelected') == 'true'){
				specialRequest = "#Special Requests#"+"Gravty Voucher redemption booking- Voucher Id" + sessionStorage.getItem('gravtyVoucherprivilegeCode');
			}
			else{
				specialRequest = $('textarea[name=specialRequest-data]').val().trim();
			}

            specialRequest = specialRequest.replaceAll('&', " and ");

            // [IHCLCB START]
			var paymentNotes = getTextValueOf('.ihclcb-payment-notes-text-area');
			if(isIHCLCBSiteFlag) {
				userDetails = getUserData();
				if($('#sendNotificationToId').is(':checked')) {
					storeGuestEmailToSession(guestEmail, false);
				} else {
					storeGuestEmailToSession(guestEmail, true);
				}
				guestEmail = userDetails.email;
			}
			var trimmedPaymentNotes = paymentNotes.trim();
			if(trimmedPaymentNotes){
				specialRequest = specialRequest + ' ' + trimmedPaymentNotes;
				if(isIHCLCBSiteFlag) {
					specialRequest += ' ' + $('#FTO-comment').val().trim() + ' ' + $('#FTOCountry').val();
				}
			}
			var autoEnrollCheckbox = $('input[name=autoEnrollCheckbox]').is( ":checked" );
			var gdprCheckbox = $('input[name=gdprCheckbox]').is( ":checked" );
			var airportPickupCheckbox = $('input[name=airportPickupCheckbox]').is( ":checked" );
			var redeemTicOrEpicurePoints = $('input[name=redeemTicOrEpicurePoints]').is( ":checked" );
			var ticValue = $("#ticValue").text();
			var epicureValue = $('#epicureValue').text();
			var guestDetails = {};
			guestDetails.guestTitle = guestTitle;
			guestDetails.guestFirstName = guestFirstName;
			guestDetails.guestLastName = guestLastName;
			guestDetails.guestEmail = guestEmail;
			guestDetails.guestPhoneNumber = guestPhoneNumber;
			guestDetails.guestGSTNumber = guestGSTNumber;
			guestDetails.guestCountry = guestCountry;
			guestDetails.guestMembershipNumber = guestMembershipNumber;
			guestDetails.specialRequests=specialRequest;
			guestDetails.autoEnrollTic=autoEnrollCheckbox;
			guestDetails.gdpr=gdprCheckbox;
			guestDetails.airportPickup=airportPickupCheckbox;
			return guestDetails;
		}

		function storeGuestEmailToSession(email, emailToOthersOnly) {
		   var ihclCbBookingObject = dataCache.session.getData("ihclCbBookingObject");
		   if(ihclCbBookingObject) {
			   ihclCbBookingObject.sendNotification = email;
			   ihclCbBookingObject.emailToOthersOnly = emailToOthersOnly;
			   dataCache.session.setData("ihclCbBookingObject",ihclCbBookingObject);
		   }
		}

		function getTextValueOf(cssSelelctor) {
			var textValue = "";
			var domElement = $(cssSelelctor);
			if(domElement) {
				var domElementValue = domElement.val();
				if(domElementValue) {
					textValue = domElementValue;
				}
			}
			return textValue;
		}

		function guestDetailsToGuest(guestDetails){
			var guest = {};
			guest.title = guestDetails.guestTitle;
			guest.firstName = guestDetails.guestFirstName;
			guest.lastName =  guestDetails.guestLastName;
			guest.email = guestDetails.guestEmail;
			guest.phoneNumber = guestDetails.guestPhoneNumber;
			guest.gstNumber = guestDetails.guestGSTNumber;
			guest.country = guestDetails.guestCountry;
			guest.membershipId = guestDetails.guestMembershipNumber;
			guest.specialRequests=guestDetails.specialRequests;
			guest.autoEnrollTic=guestDetails.autoEnrollCheckbox;
			guest.gdpr=guestDetails.gdprCheckbox;
			guest.airportPickup=guestDetails.airportPickupCheckbox;

			// For Booker Id::
			if(window.location.pathname.search('corporate-booking') > -1){
				if(getUserData() && (getUserData()).profileId) {
					guest.specialRequests = guest.specialRequests + ',profileId:' + (getUserData()).profileId;
				}
				var adminElem = $('#adminEmail');
				if(adminElem && adminElem.text()) {
					guest.email = guest.email + ',' + adminElem.text();
				}
			}

			// handel voucher code and voucher pin input in special request
			var voucherRedemption = dataCache.session.getData('voucherRedemption');
			if(dataCache.session.getData('vouchershareholderflow') == "true" ){
				var cardNumber = dataCache.session.getData('qcvoucherCode');
				var cardPin = dataCache.session.getData('qcvoucherpin');
				guest.specialRequests = guest.specialRequests
				+'Voucher redeemed from website with Qwiksilver: VoucherNumber -' + cardNumber ;
			} else if(voucherRedemption && voucherRedemption == 'true' && sessionStorage.getItem('gravtyVoucherSelected') != 'true'){
				var vCode = $('#guest-VoucherCode').val();
				var vCodeRegex = new RegExp(/(\d{4})(\d{4})(\d{4})(\d{0,4})/);
				var vCodewithChar = vCode.replace(vCodeRegex, "$1/$2/$3/$4");
				guest.specialRequests = guest.specialRequests
				+';voucherCode:'+vCodewithChar+';voucherPin:'+$('#guest-VoucherPin').val();
			}
			return guest;
		}

		function loggedInUserDetailsToGuest(guestDetails){
			var accessToken = localStorage.getItem("access_token");
			var userData = getUserData();
			var customerHash = userData.customerHash;
			var guest = {};
			if(guestDetails.firstName){
				guest.firstName = guestDetails.nameDetails.firstName;
				guest.lastName = guestDetails.nameDetails.lastName;
			}else if(guestDetails.name){
				guest.lastName = guestDetails.nameDetails.lastName;
			}
			guest.email = guestDetails.primaryEmailId;
			guest.phoneNumber = guestDetails.primaryMobile.phoneNumber;
			guest.country = "India";
			guest.authToken = accessToken;
			guest.customerHash = customerHash;
			if(guestDetails.brandData && guestDetails.brandData.ihclMembership && guestDetails.brandData.ihclMembership[0]){
				guest.cdmReferenceId = guestDetails.brandData.ihclMembership[0].partyId;
			}
			return guest;
		}

		function extractBillerDetails()
		{
			var bookingDetailsCheckbox = $('input[name=bookingOthersCheckbox]').is( ":checked" )
			var billerName = $('input[name=billerName]').val() ;
			var billerEmail = $('input[name=billerEmail]').val() ;
			var billerPhoneNumber = $('input[name=billerPhoneNumber]').val() ;
			var billerGstNumber = $('input[name=billerGstNumber]').val() ;
			var billerDetails = {};
			billerDetails.billerName = billerName;
			billerDetails.billerEmail = billerEmail;
			billerDetails.billerPhoneNumber = billerPhoneNumber;
			billerDetails.billerGstNumber = billerGstNumber;
			return billerDetails;

		}

		function extractPaymentDetails()
		{
			// ///// Payment RadioButton - fields //////
			var paymentMethod = $('input[name = payment-method]:checked').val();
			// [TIC-FLOW]
			var bookingOptionsSessionData = dataCache.session.getData("bookingOptions");
			var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
			var payAtHotel = false;
			var payOnlineNow = false;
			var payGuaranteeAmount = false;
			var payUsingGiftCard = false;
			var payUsingCreditCard = false;
			var payGuaranteeNightDeposit = false;
			var userDetails= getUserData();
			var loyalCustomer ="";
			  if(userDetails){
				  loyalCustomer = userDetails.loyalCustomer;
			   }

			// [TIC-FLOW]
			if(ticRoomRedemptionObjectSession && ticRoomRedemptionObjectSession.isTicRoomRedemptionFlow && loyalCustomer == "N"){
				var ticFlowSelectedRadioId = $('input[type=radio][name=room-redeemption]:checked').attr('id');
				if(ticFlowSelectedRadioId === 'redeem-with-point'){
					payAtHotel = true;
				}else if(ticFlowSelectedRadioId === 'redeem-with-point-plus-cash'){
					payOnlineNow = true;
				}
			}else if((dataCache.session.getData('voucherRedemption') && dataCache.session.getData('voucherRedemption') == 'true') || sessionStorage.getItem('gravtyVoucherSelected') == 'true'){
				payOnlineNow = false;payAtHotel = true;
			}
			else{
				payAtHotel = $("#PAYATHOTEL").is(":checked");
				payOnlineNow = $("#PAYONLINENOW").is(":checked") || $("#GUARANTEEPAYMENT").is(":checked") || $("#GUARANTEEONENIGHTDEPOSIT").is(":checked");
				payGuaranteeAmount = $("#GUARANTEEPAYMENT").is(":checked");
				payUsingGiftCard = $("#PAYUSINGGIFTCARD").is(":checked");
				payUsingCreditCard = $("#PAYUSINGCREDITCARD").is(":checked");
				payGuaranteeNightDeposit = $("#GUARANTEEONENIGHTDEPOSIT").is(":checked");
				if($("#BILLTOCOMPANY").is(":checked")){
					payAtHotel = $("#BILLTOCOMPANY").is(":checked");
				}
			}

			// ///// Payment card Details - fields //////
			var nameOnCard = $('input[name=nameOnCard]').val() ;
			var numberOncard = $('input[name=numberOncard]').val() ;
			var expiryDateOnCard = $('input[name=expiryDateOnCard]').val() ;
			var cardCvv = $('input[name=cardCvv]').val() ;

			var paymentsDetails = {};
			// paymentsDetails.paymentMethod = paymentMethod;
			paymentsDetails.payAtHotel = payAtHotel;
			paymentsDetails.payOnlineNow = payOnlineNow;
			paymentsDetails.payGuaranteeAmount = payGuaranteeAmount;
			paymentsDetails.payGuaranteeNightDeposit = payGuaranteeNightDeposit;
			paymentsDetails.payUsingGiftCard = payUsingGiftCard;
			paymentsDetails.payUsingCerditCard = payUsingCreditCard;
			paymentsDetails.creditCardRequired = guaranteedByCreditCard;
			paymentsDetails.cardType = cardType;
			paymentsDetails.nameOnCard = nameOnCard;
			paymentsDetails.cardNumber = numberOncard;
			paymentsDetails.expiryMonth = expiryDateOnCard;
			paymentsDetails.cardCvv = cardCvv;
			return paymentsDetails;
		}

		function extractFlightDetails(){
			var arrivalFlightNo=$('input[name=flightNumber]').val() ;
			var flightArrivalTime=$('input[name=flightArrivalTime]').val() ;
			var arrivalAirportName=$('input[name=airportName]').val() ;
			var flightDetails={};

			flightDetails.arrivalFlightNo=arrivalFlightNo;
			flightDetails.flightArrivalTime=flightArrivalTime;
			flightDetails.arrivalAirportName=arrivalAirportName;
			return flightDetails;
		}
		// [TIC-FLOW] Updating DOM WITH TIC AND EPICURE POINTS
		updateTICandEPICURE();
		ticRoomRedemptionTranscation();
	/*
	 * // [TIC-FLOW] $('input[type=redeemTicInput]').blur(function (e) { var bookOptions =
	 * dataCache.session.getData("bookingOptions"); var totalCostOfReservationWithoutTax = 0;
	 * bookOptions.selection.forEach(function(item, index) { totalCostOfReservationWithoutTax =
	 * totalCostOfReservationWithoutTax + item.roomBaseRate; }) });
	 *
	 * $('input[type=redeemEpicureInput]').blur(function (e) { var bookOptions =
	 * dataCache.session.getData("bookingOptions"); var totalCostOfReservationWithoutTax = 0;
	 * bookOptions.selection.forEach(function(item, index) { totalCostOfReservationWithoutTax =
	 * totalCostOfReservationWithoutTax + item.roomBaseRate; }) });
	 */


		// [TIC-FLOW]
		ticPaymentDetailsFlow();

		var ItineraryDetails = dataCache.session.getData('ItineraryDetails');

		if(ItineraryDetails){
			$(".pay-now-button").hide();
		}else{
			$(".book-itinerary").hide();
		}

		$(".book-itinerary").click(function(){
		  bookItinerary();
		});
	function bookItinerary(){

		if ( $( '.sub-form-input-element:visible' ).hasClass( 'invalid-input' ) ) {
				$( '.invalid-input' ).first().focus();
				console.log($('#guest-VoucherCode').val().length());
				console.log($('#guest-VoucherPin').val().length());
				var billerDetailsHasInvalidInput = ( $( '.biller-details-wrp .sub-form-input-element:visible' ).hasClass( 'invalid-input' ) );
				if ( billerDetailsHasInvalidInput == false ) {
					if ( ( $( '#bookingGuestTitle' )[ 0 ].value == "" ) ) {
						$( '.selectboxit' ).trigger( 'click' );
					}
				}
			}

		var ItineraryDetails =dataCache.session.getData('ItineraryDetails');
		var promoCode = ItineraryDetails.packageData.promoCode;
		var cartData = ItineraryDetails.cartData;
		var allHotelsData = ItineraryDetails.allHotelsData;
		var roomDetails = [];
		for(let i=0;i<cartData.length;i++){
			var roomDetail = {};
			roomDetail.hotelId = cartData[i].hotelIds;
			roomDetail.roomTypeCode = cartData[i].roomTypeCode;
			roomDetail.roomCostAfterTax = cartData[i].room.ratePlans[0].tax;
			roomDetail.bedType = "";
			roomDetail.noOfAdults=ItineraryDetails.occupancyDetails.adults;
			roomDetail.noOfChilds=ItineraryDetails.occupancyDetails.children;
			roomDetail.roomTypeName = cartData[i].room.title;
			roomDetail.ratePlanCode = cartData[i].room.ratePlans[0].code;
			roomDetail.promoCode = "";
			roomDetail.checkInDate = cartData[i].checkInDate;
			roomDetail.checkOutDate = cartData[i].checkOutDate;
			for(let j=0;j<allHotelsData.length;j++){
				if(allHotelsData[j].hotelIds == cartData[i].hotelIds)
					roomDetail.hotelLocationId = allHotelsData[j].locationId;
			}
			roomDetails.push(roomDetail);
			//setting it true for itinerary bookings only ------ to resolve booking issue in itinerary
			guaranteedByCreditCard = true;
		}
		console.log(roomDetails);

		var loggedInUser;
					if(getUserData()){
						loggedInUser = loggedInUserDetailsToGuest(getUserData());
						// For Booker Profile Id
						loggedInUser.profileId = (getUserData()).profileId;
					}
		var guestDetails=extractGuestDetails();
		var guest = guestDetailsToGuest(guestDetails);
		var paymentsDetails=extractPaymentDetails();
		var flightDetails=extractFlightDetails();
		var itineraryNumber="";
		var hotelChainCode = "21305";
		var promotionCode = promoCode;
		var voucherCode = "";
		var successRedirctUrl = "";
		var basePath = ItineraryDetails.packageData.basePath;
		var bookInitiateData = 'guestDetails='+JSON.stringify(guest)
						+'&paymentsDetails='+JSON.stringify(paymentsDetails)
						+"&roomDetails="+JSON.stringify(roomDetails)
						+"&flightDetails="+JSON.stringify(flightDetails)
						+"&hotelChainCode="+hotelChainCode
						+"&promotionCode="+promotionCode
						+"&voucherCode="+voucherCode
						+"&corporateBooking="+false	//false
						+"&itineraryNumber="+itineraryNumber
						+"&successRedirctUrl="+successRedirctUrl
						+"&loggedInUser="+JSON.stringify(loggedInUser);
						+"&path="+basePath  +"&source=organic";
		$('body').showLoader();
		$.ajax({
						type: 'post',
						url : '/bin/bookItineraryInitiateServlet',
						data: bookInitiateData,
						success: function(returnmessage){
							if(returnmessage == undefined || returnmessage == "" || returnmessage.length == 0){
								var message = 'Something went Wrong. Refreshing Page';
								var popupParams = {
										title: 'Booking Failed!',
										description: message
								}
								warningBox( popupParams );
								hideSpinShowPaynowBTN();
								location.reload();
								$('body').hideLoader();
							}else if(returnmessage.includes("form action")){
								var returnCheck;
								if(voucherCode){
									returnCheck=redeemVoucherAjaxCall();
									if(returnCheck){
										var $form=$(returnmessage);
										$('body').append($form);
										$form.submit();
									}
								}else {
									var $form=$(returnmessage);
									$('body').append($form);
									$form.submit();
								}
							}else if(returnmessage.includes("success\":true")){
								var returnJson = JSON.parse(returnmessage)
								if(returnJson.partialBooking){
									var roomStatustoJson = returnJson;S
									var rooms = [];
									var NaHotelId = "";
									roomStatustoJson.roomList.forEach( function( value ) {

										var roomType = "";
										if(value.roomTypeName){
											roomType = value.roomTypeName;
										}else{
											roomType = value.roomTypeCode;
										}

										var statusValue = "";
										if(value.bookingStatus){
											statusValue = "AVAILABLE";
										}else{
											statusValue = "UNAVAILABLE";
										}
										if(statusValue=="UNAVAILABLE"){
											NaHotelId = NaHotelId+", " + value.hotelId;
										}
										rooms.push( {
											'type': roomType,
											'status': statusValue,
											'adults': value.noOfAdults,
											'children': value.noOfChilds
										} );
									} );
									var popupParams = {
											title: 'Not all the rooms are Available.',
											description :'Room not available for :'+NaHotelId,
											callBack: paymentProcessOfVoucher.bind(),
											callBackSecondary: ignoreBooking.bind(),
											needsCta: false,
											isForRoomAvailability: true,
											rooms: rooms
									}
									warningBox( popupParams );
								}else if(!returnJson.partialBooking){
									if(voucherCode){
										if(redeemVoucherAjaxCall()){
											if(returnJson.payments.payAtHotel){
												$('#paymentid').val(returnmessage);
												//doCommit();
											}
										}
									}else{
										if(returnJson.payments.payAtHotel){
											$('#paymentid').val(returnmessage);
											//doCommit();
										}
									}

								}else {
									/* alert(returnmessage); */
									var popupParams = {
											title: 'Booking Failed!',
											description: returnmessage,
									}
									warningBox( popupParams );
									hideSpinShowPaynowBTN();
								}
							}else if(returnmessage.includes("success\":false")){
								var returnJSON = JSON.parse(returnmessage);
								var warningPopUP = {
										title: 'Booking Failed!'
								}
								if(returnJSON.warnings){
									warningPopUP.description = returnJSON.warnings;
								}else {
									warningPopUP.description = 'All Rooms are unavailable. Please try after sometime.';
								}
								warningBox( warningPopUP );
								hideSpinShowPaynowBTN();
							}else{
								var exceptionPopupParams = {
										title: 'Booking Failed!',
										description: returnmessage,
								}
								warningBox( exceptionPopupParams );
								hideSpinShowPaynowBTN();
							}
						},
					   fail: function(rrr){
							var popupParams = {
									title: 'Booking Failed!',
									description: 'Booking service calling failed. Please try again later.',

							}
							warningBox( popupParams );
							hideSpinShowPaynowBTN();
							console.error("failed to call ajax post");
						},
						error: function(xhr){
							var popupParams = {
									title: 'Booking Failed!',
									description: 'Error occured while calling  booking service. Please try aftersome time.',

							}
							warningBox( popupParams );
							hideSpinShowPaynowBTN();
						}
					});
				}

			/* to show the tokenisation and non-tokenisation class in case currency code is not INR*/
            populateCardDetailsForForeignCurrency();

			/* to display the warning box if the tokenization API status is Failed.*/
		  	tokenTxnFailedPopup();

	} );
	function sebbooking(paymentObject)
	{
     			var sebObject = dataCache.session.getData('sebObject');
     			var cacheText = JSON.stringify(dataCache.session.getData( "bookingOptions" ));
         		// converting text to JSON
         		var cacheJSONData = JSON.parse(cacheText);
         		var paymentJSONObject =JSON.parse(paymentObject);
     			var roomsbooked=cacheJSONData.rooms;
     			if (dataCache.session.getData('partialBooking'))
     			{
     					roomsbooked=dataCache.session.getData("sebAvailable");
     			}
     			var selection = cacheJSONData.selection;

     			// paymentsDetails.totalCartPrice= cacheJSONData.totalCartPrice;
     			var checkInDate = moment(cacheJSONData.fromDate,"MMM Do YY").format("YYYY-MM-DD");
     			var checkOutDate = moment(cacheJSONData.toDate,"MMM Do YY").format("YYYY-MM-DD");
         		var hono_hr_transaction_date = new Date().toISOString().slice(0, 10);

     				var requestParams={
     					comp_code:"mytajsats",
     					itinerary_number:paymentJSONObject.itineraryNumber,
                         currency_code: paymentJSONObject.currencyCode,
                         hotel_id:paymentJSONObject.hotelId,
     					employee_number:sebObject.employeeNumber,
     					reqid:sebObject.myTajREQID,
     					eid:sebObject.employeeID,
     					from_date:checkInDate,
     					to_date:checkOutDate,
     					transaction_date: hono_hr_transaction_date,
     					amount:cacheJSONData.totalCartPrice,
     					no_of_days:cacheJSONData.nights,
     					adults:cacheJSONData.roomOptions[0].adults,
     					children:cacheJSONData.roomOptions[0].children,
     					rooms:roomsbooked,
     					hotal:cacheJSONData.targetEntity
     				}

     				console.log("requestParams  days"+ requestParams.no_of_days +" adults "+requestParams.adults+" children  "+requestParams.children+" rooms "+requestParams.rooms);

     			$.ajax({
     				type : 'post',
     				cache: false,
     				url : 'https://mytajsats.honohr.com/integration/BookingConfirm/booking',
     				data : requestParams,
     				error : function(response) {
     					console.log("Error "+response);
                         $( '.pay-now-spinner' ).hide();
                         var popupParams = {
                                 title: 'Booking Failed!',
                                 description: 'Booking Failed. Please check with support team.',
                         }
                         if(gravtyVoucherRedeem){
                                 unredeemGravtyVoucher();
                         }
                         warningBox( popupParams );
                         sendIgnore(paymentObject,bookingFailedURL);
     				},
     				success : function(response) {
     					if (response) {
     					   console.log("Success");
                             sessionStorage.setItem('bookingDetailsRequest', paymentObject);
                             if(gravtyVoucherRedeem){
                                 //removeVoucherFromSession
                                 sessionStorage.removeItem('gravtyVoucherprivilegeCode');
                                 sessionStorage.removeItem('gravtyVoucherSelected');
                                 sessionStorage.removeItem('gravtyVoucherpin');
                                 sessionStorage.removeItem('gravtyVoucherbitid');
                             }
                             //window.location.assign(bookingConfirmationURL);
                            // window.location.assign("https://"+window.location.host+"/en-in/booking-confirmation");
                         }
     				}
     			});

	}

    function populateCardDetailsForForeignCurrency() {                
        var tokenizationBookingOptions = JSON.stringify(dataCache.session.getData( "bookingOptions" ));                
        // converting text to JSON                
        var tokenizationBookingOptionsJSONData = JSON.parse(tokenizationBookingOptions);   
        if(sessionStorage.getItem('gravtyVoucherSelected') == 'true' && sessionStorage.getItem("gravtyVoucherRedeem") != 'true') {
            if( tokenizationBookingOptionsJSONData.currencySelected != 'INR'){
                $(".credit-card-guarantee-text-tokenisation").addClass('cm-hide');                    
                $(".tokenization-intl-pay-at-hotel").removeClass('cm-hide');                
            }
            else{
                $(".credit-card-guarantee-text-tokenisation").removeClass('cm-hide');
                $(".tokenization-intl-pay-at-hotel").addClass('cm-hide');
                $(".tokenization-intl-pay-at-hotel").remove();
            }
        }
        else if(tokenizationBookingOptionsJSONData.selection[0] 
				&& tokenizationBookingOptionsJSONData.selection[0].currencyString == ''
                && tokenizationBookingOptionsJSONData.selection[0].guaranteeCode != "GCO"
               	&& (tokenizationBookingOptionsJSONData.selection[0].ratePlanCode == "TPPB" ||
               		tokenizationBookingOptionsJSONData.selection[0].ratePlanCode == "TAIGL" ||
               tokenizationBookingOptionsJSONData.selection[0].ratePlanCode == "TPPS" ||
               tokenizationBookingOptionsJSONData.selection[0].ratePlanCode == "TPCB" ||
               tokenizationBookingOptionsJSONData.selection[0].ratePlanCode == "TWPTIHCL" ||
               tokenizationBookingOptionsJSONData.selection[0].ratePlanCode == "TWPPIHCL" ||
               tokenizationBookingOptionsJSONData.selection[0].ratePlanCode == "TAIG" ||
               tokenizationBookingOptionsJSONData.selection[0].ratePlanCode == "TTAI" ||
               tokenizationBookingOptionsJSONData.selection[0].ratePlanCode == "TSWP" ||
               tokenizationBookingOptionsJSONData.selection[0].ratePlanCode == "TSWP1" ||
               tokenizationBookingOptionsJSONData.selection[0].ratePlanCode == "TNQB"||
               tokenizationBookingOptionsJSONData.selection[0].ratePlanCode == "TNQS")){
            // World of  Privilidges Journey - Show Tokenization
            $(".credit-card-guarantee-text-tokenisation").removeClass('cm-hide');
            $(".tokenization-intl-pay-at-hotel").addClass('cm-hide');
            $(".tokenization-intl-pay-at-hotel").remove();                         
        }
        else if(tokenizationBookingOptionsJSONData.selection[0] 
				&& tokenizationBookingOptionsJSONData.selection[0].currencyString != 'INR'
                && tokenizationBookingOptionsJSONData.selection[0].guaranteeCode != "GCO"){
            // Normal journey with Interational Booking - Gurantee by Credit Card (GCC)
            $(".credit-card-guarantee-text-tokenisation").addClass('cm-hide');                    
            $(".tokenization-intl-pay-at-hotel").removeClass('cm-hide');                
        }
        else if(tokenizationBookingOptionsJSONData.selection[0] 
				&& tokenizationBookingOptionsJSONData.selection[0].currencyString == 'INR'
                && tokenizationBookingOptionsJSONData.selection[0].guaranteeCode != "GCO"){
            // Normal journey with Domestic Booking - Gurantee by Credit Card (GCC)
            $(".credit-card-guarantee-text-tokenisation").removeClass('cm-hide');
            $(".tokenization-intl-pay-at-hotel").addClass('cm-hide');
            $(".tokenization-intl-pay-at-hotel").remove();              
        }
        else if(tokenizationBookingOptionsJSONData.selection[0] 
				&& tokenizationBookingOptionsJSONData.selection[0].guaranteeCode == "GCO"){
            // Normal journey with Domestic Booking - Gurantee by Company (GCO)
            // Show direct confirm button
            $(".credit-card-guarantee-text-tokenisation").addClass('cm-hide');
            $(".tokenization-intl-pay-at-hotel").addClass('cm-hide');
            $(".credit-card-guarantee-text-tokenisation").remove();
            $(".tokenization-intl-pay-at-hotel").remove();              
        }
        else{
            $(".credit-card-guarantee-text-tokenisation").removeClass('cm-hide');
            $(".tokenization-intl-pay-at-hotel").addClass('cm-hide');
            $(".tokenization-intl-pay-at-hotel").remove();
        }
    }




	function hideSpinShowPaynowBTN(){
		$('body').hideLoader();
		$( '.pay-now-spinner' ).hide();
		$( '.pay-now-button, .pay-points-plus-cash, .pay-points-only ' ).show();
	}

	function paymentProcessOfVoucher()
	{
		if(getIhclIssuedVoucherNumber()){
			if(redeemVoucherAjaxCall()){
				paymentProcess();
			}
		}else{
			paymentProcess();
		}
	}

	function paymentProcessOfRedeemCoins()
    {
        var paymentobject=$('input[name=paymentid]').val();
        if(paymentobject.includes("payAtHotel\":true")){
            doCommit();
        } else {
            if (JSON.parse(localStorage.getItem("tajData")).userDetails && JSON.parse(localStorage.getItem("tajData")).userDetails !== null) {
                $(neucoinsHtml).insertBefore("#juspay_iframe");
                callNeuCoinsIntegration();
                //$(".neucoins-container").css("display", "block");
                $('.cm-page-container').removeClass("prevent-page-scroll");
            } else {
                redeemCoinsAndGeneratePayload(false,false);
            }
        }
        hideSpinShowPaynowBTN();
    }

	function paymentProcess(){
		var paymentobject=$('input[name=paymentid]').val();

		if(paymentobject.includes("payAtHotel\":true")){
			doCommit();
		}else{
		   /* var dataForPayment = encodeURIComponent(paymentobject);
			$.ajax({
				type: 'post',
				url : '/bin/paymentProcessing',
				data: 'bookingDetailsRequest='+dataForPayment,
				success: function(returnmessage){
					if(returnmessage == undefined || returnmessage == "" || returnmessage.length == 0){
						var message = 'Something went Wrong. Refreshing Page';
						var popupParams = {
								title: 'Payment process Failed!',
								description: message
						}
						warningBox( popupParams );
					}else if(returnmessage.includes("form")){
						var $form=$(returnmessage);
						$('body').append($form);
						$form.submit();
					}else{
						var popupParams = {
								title: 'Payment process Failed!',
								description: 'Something went wrong. Please try again later'
						}
						warningBox( popupParams );
					}
				},
				fail: function(rrr){
					console.error("failed to call ajax post");
					var popupParams = {
							title: 'Payment process Failed!',
							description: 'Call to service failed. Please try again later.',

					}
					warningBox( popupParams );
				},
				error: function(xhr){
					var popupParams = {
							title: 'Payment process Failed!',
							description: 'Error occured while calling service. Please try aftersome time.'

					}
					warningBox( popupParams );
				}
			});*/
			hideSpinShowPaynowBTN();
			generateSignature(JSON.parse(JSON.parse(partialBookingResponse).finalBundle).opelBundle);
		}
	}

	function doCommit(){
		var paymentObject=$('input[name=paymentid]').val();
		var bookingConfirmationURL = $('.booking-confirmation').attr("data-bookingConfirmationURL");
		if(bookingConfirmationURL == undefined || bookingConfirmationURL == "" || bookingConfirmationURL.length == 0) {
			bookingConfirmationURL = "/en-in/booking-confirmation";
		}
		var bookingFailedURL = $('.booking-cart').attr("data-bookingFailedURL");
		if(bookingFailedURL == undefined || bookingFailedURL == "" || bookingFailedURL.length == 0) {
			bookingFailedURL = "/en-in/booking-cart";
		}
		if(dataCache.session.getData('modifyBookingState')=="modifyAddRoom" || dataCache.session.getData('modifyBookingState')=="modifyRoomOccupancy"){
			var paymentJSONObject = JSON.parse(paymentObject);
			paymentJSONObject.itineraryNumber= null;
			paymentObject = JSON.stringify(paymentJSONObject);
			hidePaymentVoucherRedemption();
		}
		var postPaymentURL = '/bin/postPaymentServlet';
		if(corporateBooking){
			postPaymentURL = '/bin/corporatePostPaymentServlet';
		}
         var dataForAjax = encodeURIComponent(paymentObject);
		$.ajax({
			type : 'POST',
			url : postPaymentURL,
			data: "bookingObjectRequest="+dataForAjax,
			dataType:'text',
			beforeSend: function(){
				$( '.pay-now-spinner' ).show();
			},
			success: function(returnmessage){
				$( '.pay-now-spinner' ).hide();
				if(returnmessage == undefined || returnmessage == "" || returnmessage.length == 0){
					var popupParams = {
							title: 'Something went Wrong!',
							description: 'Could not find confirmation details.',
					}
					warningBox( popupParams );
					if(gravtyVoucherRedeem){
						unredeemGravtyVoucher();
					}
					sendIgnore(paymentObject,bookingFailedURL);
				}else if(returnmessage.includes('ExceptionFound')){
					var popupParams = {
							title: 'Booking Failed!',
							description: 'Booking service calling failed. Please try again later.',

					}
					warningBox( popupParams );
					hideSpinShowPaynowBTN();
					if(gravtyVoucherRedeem){
						unredeemGravtyVoucher();
					}
				}else{
					sessionStorage.setItem('bookingDetailsRequest', returnmessage);

					if(gravtyVoucherRedeem){
						//removeVoucherFromSession
						sessionStorage.removeItem('gravtyVoucherprivilegeCode');
						sessionStorage.removeItem('gravtyVoucherSelected');
						sessionStorage.removeItem('gravtyVoucherpin');
						sessionStorage.removeItem('gravtyVoucherbitid');
					}
					if(dataCache.session.getData('isTajSats') && dataCache.session.getData('isTajSats') != "false"){
				        sebbooking(paymentObject);
					}
					window.location.assign(bookingConfirmationURL);
				}

			},
			error: function(errormessage){
				$( '.pay-now-spinner' ).hide();
				var popupParams = {
						title: 'Booking Failed!',
						description: 'Booking Failed. Please check with support team.',
				}
                if(gravtyVoucherRedeem){
						unredeemGravtyVoucher();
				}
				warningBox( popupParams );
				sendIgnore(paymentObject,bookingFailedURL);
			}
		});

  }

	function ignoreBooking(){

		$('#Cancelbooking').hide();
		$('#cancel-spin').show();
		var bookingFailedURL = $('.booking-cart').attr("data-bookingFailedURL");
		if(bookingFailedURL == undefined || bookingFailedURL == "" || bookingFailedURL.length == 0) {
			bookingFailedURL = "/en-in/booking-cart";
		}
		var paymentobject=$('input[name=paymentid]').val();
		sendIgnore(paymentobject,bookingFailedURL);
	}

	function sendIgnore(ignoreObject, afterRedirectUrl){
		var dataForIgnore = encodeURIComponent(ignoreObject)
		var status="pass";
		$.ajax({
			type : 'POST',
			url : '/bin/bookHotelIgnoreServlet',
			data: 'bookingDetailsRequest='+dataForIgnore,
			success: function(returnmessage){
				$('#cancel-spin').hide();
			},
			fail: function(rrr){
				status="fail";
			},
			error: function( xhr){
				status="fail";
			} ,
			complete: function(data){
				window.location.assign(afterRedirectUrl);
			}
		});

		if(status.localeCompare("fail")==0){
			console.warn("Ignore Request failed");
		}
	}


	// following 2 functions are made for analytics code
	function payingAtCart(roomsData, step){
		var ecommerce= {};
		var checkout = {}
		var actionField = {};
		actionField.step= step;

		if(step === "2"){
			if(paymentOptValue=="Pay at hotel"){

				actionField.option= "VISA"
			}else if(paymentOptValue=="Pay Online now"){

				actionField.option= "PAY_ONLINE"
			}else {
				actionField.option= paymentOptValue;
			}
		}
		checkout.actionField=actionField;
		checkout.products=prepareJsonRoom(roomsData);
		ecommerce.checkout= checkout;
		pushRoomsJsonOnClick("checkout", ecommerce);

	}


	function prepareJsonRoom(roomsData){
		var products =[];
		var count= 0;
		var variant;
		roomDataArray= roomsData.selection;

		$(roomDataArray).each(function(index){
			var roomCardObj= {};
			roomCardObj.name=this.title;
			roomCardObj.id= roomsData.hotelId+"-"+this.roomTypeCode+"-"+this.ratePlanCode;
			roomCardObj.price=this.selectedRate;
			roomCardObj.brand= roomsData.targetEntity+"-"+roomsData.hotelId+"-"+"Indian Hotels Company Limited";
			variant= $($(roomsData.selection[count].details).find('.more-rate-amenities .more-rate-title')).text();
			roomCardObj.category="Rooms/"+variant+"/"+this.title;
			roomCardObj.variant = variant;
			roomCardObj.quantity=count+1;
			count++;
			products.push(roomCardObj);

		});
		return products;
	}
	function getIhclIssuedVoucherNumber() {
		var bookingOptionsCache = dataCache.session.getData('bookingOptions');
		var ihclIssuedVoucherNumber = bookingOptionsCache.usedVoucherCode;
		return ihclIssuedVoucherNumber;
	}

	/**
	 * @returns
	 */
	function redeemVoucherAjaxCall(){
		var returnCheck = false;
		var voucherCheck=false;
		var returnData= returnMessage ? JSON.parse(returnMessage) : JSON.parse(bookInitiateResponse);
		if(returnData.opelBundle && JSON.parse(JSON.parse(returnData.opelBundle).payload.orderDetails)){
			if(JSON.parse(JSON.parse(returnData.opelBundle).payload.orderDetails).udf7.indexOf('X5') != -1){
					voucherCheck=true;
				}
		}else if(returnData && returnData.roomList && returnData.roomList.length!=0){
			for(var p=0;p<returnData.roomList.length;p++)
			{
				if(returnData.roomList[p].ratePlanCode =='X5'){
					voucherCheck=true;
				}
			}
		}else if(dataCache.session.getData( "bookingOptions" ) && dataCache.session.getData( "bookingOptions" ).selection &&
			dataCache.session.getData( "bookingOptions" ).selection[0].ratePlanCode){
				var rateplan = dataCache.session.getData( "bookingOptions" ).selection[0].ratePlanCode;
				if (rateplan == 'X5') {
					voucherCheck = true;
				}
		}

		if(voucherCheck){
			$.ajax({

				type : 'GET',
				url : '/bin/redeemVouchers',
				data : "offerId=" + (getIhclIssuedVoucherNumber()).trim()
					   + "&customerHash="+ getUserData().customerHash
					   + "&authToken="+ localStorage.getItem("access_token"),

				success : function(res) {
					var redeemDetails = JSON.parse(res);
					if (redeemDetails.message) {
						returnCheck = true;
						var popupParams = {
								title : 'You have successfully redeemed the voucher'
									+ (redeemDetails.data[0].ihclissuedVoucherNumber || getIhclIssuedVoucherNumber())
						};
						warningBox(popupParams);
						$(".cm-warning-box").addClass("hide-warn-symbol");
						handleTDVoucehrRedemption(returnCheck);
					} else {
						warningBox({
							title : 'Something went wrong while redeeming'
						});
					}
				},
				error : function(res) {
					warningBox({
						title : 'Something went wrong while calling the redeem service'
					});
				}
			});

		}
	}

	var handleTDVoucehrRedemption = function(returnCheck){
		if( returnCheck){
			var returnData = JSON.parse(bookInitiateResponse)
			if(returnData.payments && returnData.payments.payAtHotel){			
				doCommit();
			}else if(returnData.opelBundle)	{
				hideSpinShowPaynowBTN();
				generateSignature(returnData.opelBundle);
				closeWarningPopup();
			}else if(returnData.tokenForm){
				var $form=$(JSON.parse(returnmessage).tokenForm);
				$('body').append($form);
				$form.submit();		
			}			
	   }
	}

	var voucherRedeemFromQwikCilver = function() {
		$('body').showLoader();
		var cardNumber = dataCache.session.getData('qcvoucherCode');
		var cardPin = dataCache.session.getData('qcvoucherpin');
		var requestString = "cardNumber=" + cardNumber + "&cardPin=" + cardPin;
		$.ajax({
		method : "POST",
		cache : false,
		url : "/bin/buyAmazonCard/redeem",
		dataType : 'json',
		data : requestString,
		error : function(){
		var popupParams = {
					title : 'Voucher Redemption Failed',
					description : 'Please connect with customer support to continue booking.',
				    isWarning : true
			}

        warningBox(popupParams);
		},
		success : function(data){
			if(data.status){
			var returnData = JSON.parse(bookInitiateResponse);
			if(returnData.payments && returnData.payments.payAtHotel){	
				$('#paymentid').val(bookInitiateResponse);				
				doCommit();
			}else if(returnData.opelBundle)	{
				hideSpinShowPaynowBTN();
				generateSignature(returnData.opelBundle);
				closeWarningPopup();
			}else if(returnData.tokenForm){
				var $form=$(JSON.parse(returnmessage).tokenForm);
				$('body').append($form);
				$form.submit();
			}			
		} else{
			var popupParams = {
					title : 'Voucher Redemption Failed',
					description : 'Please connect with customer support to continue booking.',
				    isWarning : true
			}
			warningBox(popupParams);
            $('body').hideLoader();
            allowPageScroll();
		}
	 }
	});
	}
	var sendOTPRedemption = function() {
		var memberType = sessionStorage.getItem('memberType'); 
		$.ajax({
			//type: "GET",
			//url: "/bin/OtpGravtyServlet?membershipNo=" + sessionStorage.getItem('gravtyMemberNumber') + 
			//'&actionType=sendOTP&flowType=REDEMPTION_OTP&memberType='+memberType,
            method: 'POST',
            url: '/bin/OtpGravtyServlet',
            data: {
                membershipNo: sessionStorage.getItem('gravtyMemberNumber'),
                actionType: 'sendOTP',
                flowType: "REDEMPTION_OTP",
                memberType: memberType
            },
            dataType: "json",
			success: function(data, textStatus, jqXHR) {			
				if (data && JSON.parse(data) && JSON.parse(data).message == "Success") {
					console.log("OTP send Successfully");
					//show otp enter screen
					showEnterOtp(JSON.parse(sessionStorage.getItem('gravtySessionLogin')).email);
				} else {
					console.log("Could not trigger OTP for redemption");
					showRedemptionFailedPopup();
				}
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log("Could not trigger OTP for redemption");
				showRedemptionFailedPopup();
			}
		});
	}

	function showEnterOtp(primaryEmail) {
		var popupParams = {
						title: '',
						description: 'An OTP has been sent to your registered email ID: <b>' + hideemail(primaryEmail),
						isWarning: false
					}
					warningBox(popupParams);
					$('.icon-warning').hide();
					 $('body').hideLoader();
		$('.warning-box-close-icon').hide();
		$('body').hideLoader();
		$("<div class='digits'><input type='password' class='password-digit' maxlength='1' name='digit1'/>"+
		   "<input type='password'  class='password-digit' maxlength='1' name='digit2' />"+
		   "<input type='password'  class='password-digit' maxlength='1' name='digit3' />"+
		   "<input type='password'  class='password-digit' maxlength='1' name='digit4' />"+
		  "<input type='password'  class='password-digit' maxlength='1' name='digit5' />"+
		  "<input type='password'  class='password-digit' maxlength='1' name='digit6' />"+
		  "<br><div class='cm-warning-box-btns' style='display: block;'><div class='cm-warning-box-proceed-btn'>"+
		  "<span id='invalid-otp-message' style='vertical-align:10px;font-size: 12px;color: red;float: right;font-weight: 600;'></span>"+
		 "</div></div>"+
		"<input type='hidden' id='email-otp' class='member-password form-control sub-form-input-element sub-form-mandatory' /></div>"+
		"<div class='cm-warning-box-btns' style='display: block;'><div class='cm-warning-box-proceed-btn'>"+
		"<div class='taj-loader' id='gravty-ot-loader' style='display: none;'><div class='taj-loader-circle'></div><div class='taj-loader-circle'></div>"+
		"<div class='taj-loader-circle'></div></div><br>"+
		"<button class='cm-btn-secondary warning-proceed-btn' id='submitOtp'><span style='vertical-align:10px;'>Verify OTP</span>"+
		"<span class='dummy-to-middle-align'></span></button><button id='resendOtp' class='cm-btn-secondary warning-proceed-btn' style='margin-left: 20px;vertical-align: 10px;'>"+
		"<span>Resend-OTP</span></button></div></div></div>").insertAfter('.cm-warning-box-description-text');

		if(sessionStorage.getItem("memberType") == "Epicure"){
			$("<div style='font-size: 16px;color: #323232;padding-bottom: 2rem;line-height: 1.2;'>If you do not receive the OTP, click on RESEND or you can contact us at epicure@ihcltata.com or call on 18001026080</div>").insertAfter(".digits");
		}else if(sessionStorage.getItem("memberType") == "Chambers"){
			$("<div style='font-size: 16px;color: #323232;padding-bottom: 2rem;line-height: 1.2;'>If you do not receive the OTP, click on RESEND or you can contact us at thechambers@tajhotels.com or call on 18003093300</div>").insertAfter(".digits");
		}
		passwordDigitValidateButton();
		$('#submitOtp').click(function(e) {
			e.preventDefault();
			e.stopImmediatePropagation();
			$('#gravty-ot-loader').show();
			redeemVoucherGravtyCall($('input#email-otp').val());
			return false;
		});
		$( "input.password-digit" ).on( "change", function() {
            $('.cm-warning-box-proceed-btn #invalid-otp-message')[0].textContent = "";
        } );
		$('#resendOtp').click(function(e) {
			closeWarningPopup();
			$('body').showLoader();
			sendOTPRedemption();
		});

	}


	function showRedemptionFailedPopup(){
		var popupParams = {
						title: 'Voucher redemption failed. Could not proceed with booking',
						needsCta: true
				}
		warningBox( popupParams );								
	}

	var bookInitiateResponse;
	var gravtyVoucherRedeem = false;var gravtyVoucherRedeemBitID;var gravtyVoucherRedeemSponsorID;


	function unredeemGravtyVoucher(){
		gravtyVoucherRedeem = sessionStorage.getItem("gravtyVoucherRedeem");
		if(!gravtyVoucherRedeem)
			return;
		var memberType = sessionStorage.getItem('memberType'); 
		gravtyVoucherRedeemSponsorID = sessionStorage.getItem("gravtyVoucherRedeemSponsorID");
		gravtyVoucherRedeemBitID = sessionStorage.getItem('gravtyVoucherRedeemBitID');
		var booking_details_msg = bookInitiateResponse ? "Booking Commit Failed after redemtion, booking id:"+JSON.parse(bookInitiateResponse).itineraryNumber : "Booking Failed";
		var dataForUnRedeem = "h_member_id="+sessionStorage.gravtyMemberNumber+"&h_sponsor_id="+gravtyVoucherRedeemSponsorID+"&cancel_bit_id="+gravtyVoucherRedeemBitID+
		"&h_comment="+booking_details_msg + "&memberType="+memberType;
		$('body').showLoader(true);
	  $.ajax({
				type : 'POST',
				url : '/bin/unredeemVouchersByGravty',
				data : dataForUnRedeem,
				success : function(res) {
					var redeemDetails = JSON.parse(res);
					if (redeemDetails.message.toLowerCase() == "success") {
						returnCheck = true;
						gravtyVoucherRedeem = false;
						sessionStorage.setItem("gravtyVoucherRedeem", gravtyVoucherRedeem);
						sessionStorage.removeItem("gravtyVoucherRedeemBitID");
						sessionStorage.removeItem("gravtyVoucherRedeemSponsorID");
						closeWarningPopup();
						var popupTitle = bookInitiateResponse ? 'Something went wrong': '';
						var popupParams = {
								title: popupTitle,
								description : 'We have unredeemed your voucher '+sessionStorage.gravtyVoucherprivilegeCode+'. You can use it again for your future bookings.' 
						};
						warningBox(popupParams);
						$(".cm-warning-box").addClass("hide-warn-symbol");   
						$('body').hideLoader(true);  					
					} else {
						warningBox({
							title: 'Something went wrong',
							description : 'We could not unredeem your voucher '+sessionStorage.gravtyVoucherprivilegeCode+'. Please reach out to customer service.'						
						});
					}
				},
				error : function(res) {
					warningBox({
						title : 'Something went wrong while redeeming your voucher'
					});
				}
			});
	}

	function redeemVoucherGravtyCall(otp){
		var returnCheck = false;
		var gravtyvoucherCheck=false;
		var returnData= JSON.parse(bookInitiateResponse);
		if (returnData.opelBundle && JSON.parse(JSON.parse(returnData.opelBundle).payload.orderDetails)) {
			var udf7OfferVal = JSON.parse(JSON.parse(returnData.opelBundle).payload.orderDetails).udf7;
				console.log('Offer Code '+udf7OfferVal);
			if (udf7OfferVal.indexOf('TECR') != -1 || udf7OfferVal.indexOf('TEP20') != -1 || udf7OfferVal.indexOf('TES20') != -1 || udf7OfferVal.indexOf('TEG20') != -1 ||
				udf7OfferVal.indexOf('TCSR') != -1) {
				gravtyvoucherCheck = true;
			}
		}else if (returnData && returnData.roomList && returnData.roomList.length != 0) {
			for (var p = 0; p < returnData.roomList.length; p++) {
			if (returnData.roomList[p].ratePlanCode == 'TECR' || returnData.roomList[p].ratePlanCode == 'TEP20' || returnData.roomList[p].ratePlanCode == 'TES20' ||
				returnData.roomList[p].ratePlanCode == 'TEG20' || returnData.roomList[p].ratePlanCode == 'TCSR') {
				gravtyvoucherCheck = true;
			}
		  }
		}else if(dataCache.session.getData( "bookingOptions" ) && dataCache.session.getData( "bookingOptions" ).selection &&
			dataCache.session.getData( "bookingOptions" ).selection[0].ratePlanCode){
				var rateplan = dataCache.session.getData( "bookingOptions" ).selection[0].ratePlanCode;
				if (rateplan == 'TECR' || rateplan == 'TEP20' || rateplan == 'TES20' ||
					rateplan == 'TEG20' || rateplan == 'TCSR' || rateplan == 'TECRN') {
					gravtyvoucherCheck = true;
				}
		}

        console.log('Gravty Voucher check '+gravtyvoucherCheck);

		if(!gravtyvoucherCheck){
			var popupParams = {
								title:'Redemption Failed.',
								description : 'The offer selected is not applicable for voucher redemption booking.' 
			};
			warningBox(popupParams);
			return;
		}

		var rateplanapplied,billNumber, itineraryNumber, hotelId, checkInDate, checkOutDate;
		if(returnData.opelBundle){
			returnData.totalAmountAfterTax = JSON.parse(returnData.opelBundle).payload.amount;
			rateplanapplied = JSON.parse(JSON.parse(returnData.opelBundle).payload.orderDetails)['metadata.CCAVENUE_V2:merchant_param4'];
			billNumber = JSON.parse(JSON.parse(returnData.opelBundle).payload.orderDetails).udf1.split(' ')[1];
			itineraryNumber= JSON.parse(JSON.parse(returnData.opelBundle).payload.orderDetails).order_id;
			hotelId = JSON.parse(JSON.parse(returnData.opelBundle).payload.orderDetails).udf5.split('$')[0];
			checkInDate = JSON.parse(JSON.parse(returnData.opelBundle).payload.orderDetails).udf3.split(' ')[0];
			checkOutDate = JSON.parse(JSON.parse(returnData.opelBundle).payload.orderDetails).udf3.split(' ')[1];
		}else if(returnData.tokenForm){
			var bookingResp = JSON.parse(returnData.bookinitiateresponse);
			rateplanapplied = bookingResp.roomList[0].ratePlanCode;
			billNumber = bookingResp.roomList[0].reservationNumber;
			itineraryNumber= bookingResp.itineraryNumber;
			hotelId = bookingResp.hotelId;
			checkInDate = bookingResp.checkInDate;
			checkOutDate = bookingResp.checkOutDate;		
			returnData.totalAmountAfterTax = bookingResp.totalAmountAfterTax;			
		}else{
			rateplanapplied = returnData.roomList[0].ratePlanCode;
			billNumber = returnData.roomList[0].reservationNumber;
			itineraryNumber= returnData.itineraryNumber;
			hotelId = returnData.hotelId;
			checkInDate = returnData.checkInDate;
			checkOutDate = returnData.checkOutDate;
		}
		var gravtySession = sessionStorage.gravtySessionLogin;
		var dataForRedemption = "memberId="+sessionStorage.gravtyMemberNumber+"&voucherCode="+sessionStorage.gravtyVoucherprivilegeCode+"&pin="+sessionStorage.gravtyVoucherpin+
		"&otp="+otp+"&orderAmount="+returnData.totalAmountAfterTax+"&rateCode="+rateplanapplied+
		"&billNumber="+billNumber+"&checkInDate="+checkInDate+
		"&checkOutDate="+checkOutDate+"&folioNo="+1231456321+ "&bookingId="+itineraryNumber+ "&bookingDate="+new Date().toISOString()+
		"&hotelId="+hotelId+"&memberType="+sessionStorage.memberType; // membertype added;

		if(gravtyvoucherCheck){
			$.ajax({
				type : 'POST',
				url : '/bin/redeemVouchersByGravty',
				data : dataForRedemption,
                headers: {
                    memberTokenGravty: sessionStorage.getItem("token"),
                },
				success : function(res) {
					var redeemDetails = JSON.parse(res);
					if (redeemDetails.status.toLowerCase() == "success") {
						returnCheck = true;
						gravtyVoucherRedeem = true;
						debugger; //TODO : Correct the params RHS after api update
						gravtyVoucherRedeemBitID = redeemDetails.bit_id;
						gravtyVoucherRedeemSponsorID = redeemDetails.h_sponsor_id;
						sessionStorage.setItem("gravtyVoucherRedeem", gravtyVoucherRedeem);
						sessionStorage.setItem("gravtyVoucherRedeemSponsorID", gravtyVoucherRedeemSponsorID);
						sessionStorage.setItem("gravtyVoucherRedeemBitID", gravtyVoucherRedeemBitID);
						closeWarningPopup();
						$('#gravty-ot-loader').hide();
						var popupParams = {
								title:'',
								description : 'You have successfully redeemed the voucher'
									+ sessionStorage.gravtyVoucherprivilegeCode + '.<br>Please wait. Your booking is being processed.' 
						};
						warningBox(popupParams);
						$(".icon-warning").hide();
						$(".cm-warning-box").addClass("hide-warn-symbol");     
						if(returnData.payments && returnData.payments.payAtHotel){
							$('#paymentid').val(bookInitiateResponse);
							doCommit();
						}else if(returnData.opelBundle)	{
							closeWarningPopup();
							hideSpinShowPaynowBTN();
							generateSignature(returnData.opelBundle);
						}else if(returnData.tokenForm){
							var $form=$(returnData.tokenForm);
							$('body').append($form);
							$form.submit();	
						}				
					} else {
						$('.cm-warning-box-proceed-btn #invalid-otp-message')[0].textContent = redeemDetails.ResponseMessage ? redeemDetails.ResponseMessage : 'Something went wrong while redeeming'
                        /*warningBox({
                            title : redeemDetails.ResponseMessage ? redeemDetails.ResponseMessage : 'Something went wrong while redeeming'
                                //title : 'Something went wrong while redeeming'
                        });*/
                        $('#gravty-ot-loader').hide();
                        hideSpinShowPaynowBTN();
					}
				},
				error : function(res) {
					warningBox({
						title : 'Something went wrong while redeeming your voucher'
					});
				}
			});

		}
	}


	// [TIC-FLOW]
	function updateTICandEPICURE(){
		var userDetails =  getUserData();
		var bookingOptionsSession = dataCache.session.getData( "bookingOptions" );
		var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
		var userSelectedCurrency = dataCache.session.getData("selectedCurrency");
		if(userDetails && userDetails.brandData && userDetails.loyaltyInfo && userDetails.loyaltyInfo.length && userDetails.loyaltyInfo[0].currentSlab && ticRoomRedemptionObjectSession &&  ticRoomRedemptionObjectSession.isTicRoomRedemptionFlow){
			var membertype="TIC";
			 var loyalCustomer = userDetails.loyalCustomer;
			if(membertype == "TIC"){
			$('.paynow-paylater-block').hide();
				if(loyalCustomer == "Y"){
						 $('.redeem-checkbox-wrp').hide();
				}
			$(".tic-point-value").html(userDetails.loyaltyInfo[0].loyaltyPoints);
			$(".epicure-point-value").html(userDetails.epicurePoints);
	 }else if(membertype === "TAP"){
				$(".tic-point-value").html(userDetails.tapPoints); // shows users available tap points
			}else if(membertype === "TAPPMe"){
				$(".tic-point-value").html(userDetails.tappmePoints);// shows user's available tapp me points
			}else{
				console.log("Unknown Member Type");
			}
			$('input[name=redeemTicOrEpicurePoints]').prop('checked', true);
			$('.redeem-checkbox-wrp').addClass('redeem-points-checked');

			var totalReservationCost = 0;
			bookingOptionsSession.selection.forEach(function(item, index) {
				totalReservationCost = totalReservationCost + item.roomBaseRate + item.roomTaxRate;
			})

			if (userSelectedCurrency != 'INR' && userSelectedCurrency != '₹') {
				var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
				if (ticRoomRedemptionObjectSession && ticRoomRedemptionObjectSession.currencyRateConversionString) {
					var currencyRateConversionString = ticRoomRedemptionObjectSession.currencyRateConversionString;
					var conversionRate = parseFloat(currencyRateConversionString[userSelectedCurrency + '_INR']);
					totalReservationCost = Math.round(totalReservationCost * conversionRate);
				}

			}


			var totalTicPointsNeededForReservation = Math.ceil(totalReservationCost);
			var totalEpicurePointsNeededForReservation = Math.ceil(totalReservationCost / 2);
			$(".tic-point-value-redeemable").html(totalTicPointsNeededForReservation);
			$(".epicure-point-value-redeemable").html(totalEpicurePointsNeededForReservation);
		}else{
			$('.redeem-checkbox-wrp').hide();
		}
	}

	// [TIC-FLOW]
	function ticRoomRedemptionTranscation(){

		var bookingOptionsSessionData = dataCache.session.getData("bookingOptions");
		var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
		if(ticRoomRedemptionObjectSession && ticRoomRedemptionObjectSession.isTicRoomRedemptionFlow){
			$('.payment-type-radio-wrp').hide();
			$('.payment-radio-content').hide();
			$('.pay-now-button-wrp').hide();

			$("#redeem-with-point").prop("checked", true);
			$("#redeem-with-tic-point").prop("checked", true);
			$("#redeem-with-tic-point-plus-cash").prop("checked", true);
			$('.room-redeemption').change( function() {
				if(this.id == 'redeem-with-point'){
					$(".tic-room-redemption-points-selection").removeClass('d-none');
					$(".tic-room-redemption-points-plus-cash-selection").addClass('d-none');
					validatePointsRequiredForBooking();
				}else{
					$(".tic-room-redemption-points-selection").addClass('d-none');
					$(".tic-room-redemption-points-plus-cash-selection").removeClass('d-none');
					validatePointsAndCashBooking();
					$('[value=TIC-Point-Cash]').trigger('click');
					$('[value=TIC-Point-Cash]').trigger('change');
				}
			} );

			setDefaultTicRoomRedemptionValue();
			validatePointsRequiredForBooking();
			validatePointsAndCashBooking();
			checkPointsPlusCachedClick();
		}
	}

	function validatePointsRequiredForBooking() {
		$(".pay-points-only").prop("disabled",false);
		$(".pay-points-only").css({ "opacity" : 1 });
		$("#message-for-less-points").addClass('d-none');

		var availableTicValue = parseFloat($("#ticValue").text());
		var availableEpicureValue = parseFloat($("#epicureValue").text());
		var ticPointsNeededForReservation = parseFloat($(".tic-point-value-redeemable").html());
		var epicurePointsNeededForReservation = parseFloat($(".epicure-point-value-redeemable").html());

		if($('#redeem-with-tic-point').prop('checked')) {
			if(ticPointsNeededForReservation > availableTicValue) {
				$(".pay-points-only").prop("disabled",true);
				$(".pay-points-only").css({ "opacity" : 0.5 });
				$("#message-for-less-points").removeClass('d-none');
				$("#message-for-less-points").text("You don't have sufficient TIC points, select Point + Cash option instead.");
			}
			$( "#redeemTicInput" ).keyup();
		}

		if($('#redeem-with-epicure-point').prop('checked')) {
			if(epicurePointsNeededForReservation > availableEpicureValue) {
				$(".pay-points-only").prop("disabled",true);
				$(".pay-points-only").css({ "opacity" : 0.5 });
				$("#message-for-less-points").removeClass('d-none');
				$("#message-for-less-points").text("You don't have sufficient Epicure points, select Point + Cash option instead.");
			}
			$( "#redeemEpicureInput" ).keyup();
		}
	}

	function validatePointsAndCashBooking() {
		$(".pay-points-plus-cash").prop("disabled",false);
		$(".pay-points-plus-cash").css({ "opacity" : 1 });
		$("#message-for-less-points-and-cash").addClass('d-none');

		var availableTicValue = parseFloat($("#ticValue").text());
		var availableEpicureValue = parseFloat($("#epicureValue").text());
		var ticPointsAndCashNeededForReservation = parseFloat($("#redeemTicInput").val());
		var epicurePointsAndCashNeededForReservation = parseFloat($("#redeemEpicureInput").val());

		if($('#redeem-with-tic-point-plus-cash').prop('checked')) {
			if(ticPointsAndCashNeededForReservation >= availableTicValue) {
				$(".pay-points-plus-cash").prop("disabled",true);
				$(".pay-points-plus-cash").css({ "opacity" : 0.5 });
				$("#message-for-less-points-and-cash").removeClass('d-none');
				$("#message-for-less-points-and-cash").text("You don't have sufficient TIC points.");
			}
			$( "#redeemTicInput" ).keyup();
		}

		if($('#redeem-with-epciure-point-plus-cash').prop('checked')) {
			if(epicurePointsAndCashNeededForReservation >= availableEpicureValue) {
				$(".pay-points-plus-cash").prop("disabled",true);
				$(".pay-points-plus-cash").css({ "opacity" : 0.5 });
				$("#message-for-less-points-and-cash").removeClass('d-none');
				$("#message-for-less-points-and-cash").text("You don't have sufficient Epicure points.");
			}
			$( "#redeemEpicureInput" ).keyup();
		}
	}

	function extractTicPointsData(){
		var bookOptions = dataCache.session.getData("bookingOptions");
		var userSelectedCurrency = dataCache.session.getData("selectedCurrency");
		var redeemTicOrEpicurePoints = $('input[name=redeemTicOrEpicurePoints]').is( ":checked" );
		var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
	var membertype=getUserData();
	var ticpoints={};
	if(membertype && membertype.brandData){
		var ticValue = $("#ticValue").text();
		var epicureValue = $('#epicureValue').text();
		var ticpoints={};
		ticpoints.redeemTicOrEpicurePoints = redeemTicOrEpicurePoints;
		ticpoints.ticPlusCreditCard = ticValue;
		ticpoints.epicurePlusCreditCard = epicureValue;
		ticpoints.pointsPlusCash = false;
		ticpoints.currencyConversionRate = 1;
		var ticFlowSelectedRadioId = $('input[type=radio][name=room-redeemption]:checked').attr('id');
		if(ticFlowSelectedRadioId === 'redeem-with-point'){
			var ticFlowRedeemWithPointRadioId = $('input[type=radio][name=redeem-with-point]:checked').attr('id');
			if(ticFlowRedeemWithPointRadioId === 'redeem-with-tic-point'){
				ticpoints.pointsType = 'TIC';
				ticpoints.noTicPoints = parseFloat($('.tic-point-value-redeemable').html());;
			}else if(ticFlowRedeemWithPointRadioId === 'redeem-with-epicure-point'){
				ticpoints.pointsType = 'EPICURE';
				ticpoints.noEpicurePoints = parseFloat($('.epicure-point-value-redeemable').html());;
			}
			ticpoints.pointsPlusCash = false;
		}else if(ticFlowSelectedRadioId === 'redeem-with-point-plus-cash'){
			var ticFlowRedeemWithPointPlusCashRadioId = $('input[type=radio][name=redeem-with-point-plus-cash]:checked').attr('id');
			if(ticFlowRedeemWithPointPlusCashRadioId === 'redeem-with-tic-point-plus-cash'){
				ticpoints.pointsType = 'TIC';
				ticpoints.noTicPoints = $('#redeemTicInput').val();;
			}else if(ticFlowRedeemWithPointPlusCashRadioId === 'redeem-with-epciure-point-plus-cash'){
				ticpoints.pointsType = 'EPICURE';
				ticpoints.noEpicurePoints = $('#redeemEpicureInput').val();
			}
			ticpoints.pointsPlusCash  = true;
		}
	  }else if(membertype && membertype.card && membertype.card.type === "TAP"){
			ticpoints.pointsType = 'TAP';
			ticpoints.noTicPoints = parseFloat($('.tic-point-value-redeemable').html());
		}else if(membertype && membertype.card && membertype.card.type === "TAPPMe"){
			ticpoints.pointsType = 'TAPPMe';
			ticpoints.noTicPoints = parseFloat($('.tic-point-value-redeemable').html());
		}else{
			console.log("Unknown Member Type");
		}

		if (userSelectedCurrency != 'INR' && userSelectedCurrency != '₹') {
			if (ticRoomRedemptionObjectSession && ticRoomRedemptionObjectSession.currencyRateConversionString) {
				var currencyRateConversionString = ticRoomRedemptionObjectSession.currencyRateConversionString;
				var conversionRate = parseFloat(currencyRateConversionString[userSelectedCurrency + '_INR']);
				ticpoints.currencyConversionRate = conversionRate;
			}

		}



		return ticpoints;
	}

	function getTotalTicFlowRoomPrice(){
		var bookOptionsSessionData = dataCache.session.getData("bookingOptions");
		var userSelectedCurrency = dataCache.session.getData("selectedCurrency");
		var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
		var totalCardPrice = 0;
		if(bookOptionsSessionData && bookOptionsSessionData.selection){
			for (var i = 0; i < bookOptionsSessionData.selection.length; i++) {
				var roomData = bookOptionsSessionData.selection[i];
				totalCardPrice = totalCardPrice + roomData.roomBaseRate + roomData.roomTaxRate;
			}
		}

		if ( (userSelectedCurrency != 'INR' && userSelectedCurrency != '₹' ) && ticRoomRedemptionObjectSession && ticRoomRedemptionObjectSession.currencyRateConversionString) {
				var currencyRateConversionString = ticRoomRedemptionObjectSession.currencyRateConversionString;
				var conversionRate = parseFloat(currencyRateConversionString[userSelectedCurrency + '_INR']);
				totalCardPrice = Math.round(totalCardPrice * conversionRate);
		}

		return Math.round(totalCardPrice);
	}

	function setDefaultTicRoomRedemptionValue(){
		var totalTicMoneyCharged = 0;
		var totalEpicureMoneyCharged = 0;
		var totalTicCartCharged = getTotalTicFlowRoomPrice();
		var totalEpicureCartCharged = Math.ceil(totalTicCartCharged/2);

		totalTicMoneyCharged  = totalTicCartCharged - Math.ceil(totalTicCartCharged/2);
		totalEpicureMoneyCharged = totalEpicureCartCharged - Math.ceil(totalEpicureCartCharged/2);

		$(".required-tic").html(totalTicCartCharged);
		$(".entered-tic").html(Math.ceil(totalTicCartCharged/2));
		$("#redeemTicInput").val(Math.ceil(totalTicCartCharged/2));
		$(".tic-cash-adjusted").html(totalTicMoneyCharged * 1);
		$(".required-epicure").html(totalEpicureCartCharged);
		$(".entered-epicure").html(Math.ceil(totalEpicureCartCharged/2));
		$(".epicure-cash-adjusted").html(totalEpicureMoneyCharged * 10);
		$("#redeemEpicureInput").val(Math.ceil(totalTicCartCharged/4));


		$( "#redeemTicInput" ).bind("keyup change", function() {
			var ticValueEntered = Math.ceil($("#redeemTicInput").val());
			$(".entered-tic").html(ticValueEntered);
			totalTicMoneyCharged  = totalTicCartCharged - ticValueEntered;
			$(".tic-cash-adjusted").html(totalTicMoneyCharged * 1);
			if(ticValueEntered <0){
				$(".tic-room-redemption-error").addClass('d-none');
				$("#tic-higher-points").removeClass('d-none');
				$(".pay-points-plus-cash").prop("disabled",true).css("opacity","0.5");
			}else if(totalTicCartCharged < ticValueEntered){
				$(".tic-room-redemption-error").addClass('d-none');
				$("#tic-lesser-points").removeClass('d-none');
				$(".pay-points-plus-cash").prop("disabled",true).css("opacity","0.5");
			}else if(!ticValueEntered){
				$(".tic-room-redemption-error").addClass('d-none');
				$("#tic-no-points").removeClass('d-none');
				$(".pay-points-plus-cash").prop("disabled",true).css("opacity","0.5");
			}else if(Math.ceil(totalTicCartCharged/2) > ticValueEntered){
				$(".tic-room-redemption-error").addClass('d-none');
				$("#tic-half-points").removeClass('d-none');
				$(".pay-points-plus-cash").prop("disabled",true).css("opacity","0.5");
			}else if(Math.ceil(totalTicCartCharged/2) <= ticValueEntered){
				if(ticValueEntered > $("#ticValue").text() ) {
					$(".tic-room-redemption-error").addClass('d-none');
					$(".pay-points-plus-cash").prop("disabled",true).css("opacity","0.5");
				}
				else {
					$(".tic-room-redemption-error").addClass('d-none');
					$(".pay-points-plus-cash").prop("disabled",false).css("opacity","1");
				}
			}else if(Math.ceil(totalTicMoneyCharged) === 0) {
				$(".tic-room-redemption-error").addClass('d-none');
				$("#tic-zero-cash").removeClass('d-none');
				$(".pay-points-plus-cash").prop("disabled",true).css("opacity","0.5");
			}
			else{
				$(".tic-room-redemption-error").addClass('d-none');
				$(".pay-points-plus-cash").prop("disabled",false).css("opacity","1");
			}

		});

		$( "#redeemEpicureInput" ).bind("keyup change click", function() {
			var epicureValueEntered = Math.ceil($("#redeemEpicureInput").val());
			$(".entered-epicure").html(epicureValueEntered);
			totalEpicureMoneyCharged = totalEpicureCartCharged - epicureValueEntered;
			$(".epicure-cash-adjusted").html(totalEpicureMoneyCharged * 10);

			if(epicureValueEntered <0){
				$(".tic-room-redemption-error").addClass('d-none');
				$("#epicure-higher-points").removeClass('d-none');
				$(".pay-points-plus-cash").prop("disabled",true).css("opacity","0.5");
			}else if(totalEpicureCartCharged < epicureValueEntered){
				$(".tic-room-redemption-error").addClass('d-none');
				$("#epicure-lesser-points").removeClass('d-none');
				$(".pay-points-plus-cash").prop("disabled",true).css("opacity","0.5");
			}else if(!epicureValueEntered){
				$(".tic-room-redemption-error").addClass('d-none');
				$("#epicure-no-points").removeClass('d-none');
				$(".pay-points-plus-cash").prop("disabled",true).css("opacity","0.5");
			}else if(Math.ceil(totalEpicureCartCharged/2) > epicureValueEntered){
				$(".tic-room-redemption-error").addClass('d-none');
				$("#epicure-half-points").removeClass('d-none');
				$(".pay-points-plus-cash").prop("disabled",true).css("opacity","0.5");
			}else if(Math.ceil(totalEpicureCartCharged/2) <= epicureValueEntered){
				if(epicureValueEntered > $("#epicureValue").text() ) {
					$(".tic-room-redemption-error").addClass('d-none');
					$(".pay-points-plus-cash").prop("disabled",true).css("opacity","0.5");
				}
				else {
					$(".tic-room-redemption-error").addClass('d-none');
					$(".pay-points-plus-cash").prop("disabled",true).css("opacity","1");
				}
			}else if(Math.ceil(totalEpicureMoneyCharged) === 0) {
				$(".tic-room-redemption-error").addClass('d-none');
				$("#epicure-zero-cash").removeClass('d-none');
				$(".pay-points-plus-cash").prop("disabled",true).css("opacity","0.5");
			}else{
				$(".tic-room-redemption-error").addClass('d-none');
				$(".pay-points-plus-cash").prop('disabled',false).css("opacity","1");
			}

		});

		$( ".quantity-left-minus , .quantity-right-plus" ).bind("click", function() {
			var minusPlus = $(this);
			var className = minusPlus.attr('class');
			var id = minusPlus.closest('.card-input').find("input:first").attr('id');
			if(id === 'redeemEpicureInput' || id === 'redeemTicInput'){
				var valueDom = minusPlus.closest('.card-input').find("input.bas-quantity");
				var boxValue = parseInt($(valueDom).val(), 10);
				if(className.indexOf('quantity-left-minus') != -1){
					valueDom.val(boxValue - 1).change();
				}else if(className.indexOf('quantity-right-plus') != -1){
					valueDom.val(boxValue + 1).change();
				}
			}
		});

	}


	function ticPaymentFlow(button){

		// [TIC-FLOW]
		var memberType=getUserData();
		if(memberType && memberType.brandData){
			if(button.className.indexOf('pay-points-plus-cash') != -1){
				if (!$('.points-plus-cash-t-and-c').is(":checked")){
					$('.points-plus-cash-t-and-c-error').removeClass('d-none');
					return false;
				}else{
					$('.points-plus-cash-t-and-c-error').addClass('d-none');
				}
			}
		}

		return true;
	}

	// [TIC-FLOWs]
	function ticPaymentDetailsFlow(){
		var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
		if(ticRoomRedemptionObjectSession && ticRoomRedemptionObjectSession.isTicRoomRedemptionFlow){
			$(".cm-page-container").addClass('tic-room-redemption-fix');
		}

		$(".Terms-cond-head-wrapper").click(function(){
			$(this).siblings(".terms-desc").toggle();
			$(this).find('.image-view').toggleClass("terms-drop-rotate");
		});

	}

	function checkMemberTypeforPaymentOptions(){
		var userDetails=getUserData();
		if(userDetails && userDetails.brandData){
			var membertype="TIC";
			if(membertype === "TIC"){
				$( "#tap-redeem" ).remove();
				$( "#tappme-redeem" ).remove();
			}else if(membertype === "TAP"){
				$( "#tic-redeem" ).remove();
				$( "#tappme-redeem" ).remove();
			}else if(membertype === "TAPPMe"){
				$( "#tic-redeem" ).remove();
				$( "#tap-redeem" ).remove();
			}else{
				console.log("Unknown Member Type");
			}
		}
	}


	function checkPointsPlusCachedClick(){    
		$('input[type=radio][name=redeem-with-point-plus-cash]').change( function() {
			var ticFlowSelectedRadioId = $(this).attr('id');
			if(ticFlowSelectedRadioId === 'redeem-with-tic-point-plus-cash'){
				$(".redeem-with-tic-point-plus-cash-info-bar").removeClass('d-none');
				$(".redeem-with-epicure-point-plus-cash-info-bar").addClass('d-none');
			}else if(ticFlowSelectedRadioId === 'redeem-with-epciure-point-plus-cash'){
				$(".redeem-with-tic-point-plus-cash-info-bar").addClass('d-none');
				$(".redeem-with-epicure-point-plus-cash-info-bar").removeClass('d-none');
			}
		});
	}


	// Hide all other payment methods except pay at hotel
	function hidePaymentVoucherRedemption() {
		$('.redeem-checkbox-wrp').hide();
		$('#PAYONLINENOW').closest('.ihclcb-payment-opt-btn').remove();
		$('#GUARANTEEONENIGHTDEPOSIT').closest('.ihclcb-payment-opt-btn').remove();
		$('#PAYATHOTEL').prop('checked', 'true');
		$('.payment-radio-content').addClass('cm-hide');
		$('.credit-card-payment-wrp').removeClass('cm-hide');
	}

	function updateProfileWhileBooking(){
		var reqData = {"nameDetails": {
			"salutation": $( '#bookingGuestTitle' ).val(),
			"firstName": $('#guest-firstName').val(),
			"middleName": "",
			"lastName": $('#guest-lastName').val()
		  },
		  "primaryEmailId": $('#guest-Email').val()
		}
		var accesstkn = localStorage.getItem("access_token");;
		$('body').showLoader(true);
		$.ajax({
				method : 'POST',
				url : '/bin/tdl/updateprofile',
				data : {
				  req_data : JSON.stringify(reqData),
				  authToken : accesstkn
				},
				dataType : "json",
			}).done(function(data) {
				$('body').hideLoader(true);			        
			});
	}

	function deleteCancelledBookingFromModification(modifyObj){
		modifyObj = JSON.parse(modifyObj)
		var roomArrayLength = modifyObj.roomList.length;
		for(var i=0;i<roomArrayLength; i++){
			if(modifyObj.roomList[i].resStatus == "Cancelled"){
				modifyObj.roomList.splice(i, 1);
				console.log("i::",i,"roomlength::", roomArrayLength)
				--roomArrayLength; --i;
			}
		}

		return JSON.stringify(modifyObj);
	}

	function handleGuaranteePayment(){
		var roomsData= dataCache.session.getData( "bookingOptions" );
		var roomDataSelection = roomsData.selection;
		var payFullGuaranteeAmount = true;
		var isGuaranteePaymentRequired = false;
		for(var mm = 0; mm < roomDataSelection.length; mm++){
			if(roomDataSelection[mm].currencyString == "INR" && (roomDataSelection[mm].guaranteeAmount || roomDataSelection[mm].guaranteePercentage)){
				console.log("index: " + mm + ", guaranteeAmount: " + roomDataSelection[mm].guaranteeAmount + ", guaranteePercentage: " + roomDataSelection[mm].guaranteePercentage);
				isGuaranteePaymentRequired = true;

				if(roomDataSelection[mm].guaranteePercentage != 100){
					payFullGuaranteeAmount = false;
					guaranteeAmount = guaranteeAmount + parseFloat(roomDataSelection[mm].guaranteeAmount);
				}else if(roomDataSelection[mm].guaranteeAmount){
					guaranteeAmount = guaranteeAmount + parseFloat(roomDataSelection[mm].roomBaseRate) + parseFloat(roomDataSelection[mm].roomTaxRate);
				}
			}else{
				payFullGuaranteeAmount = false;
			}
			if(roomDataSelection[mm].isCreditCardRequired ){
				guaranteedByCreditCard = true;
			}
		}

		if(isGuaranteePaymentRequired){
			if(payFullGuaranteeAmount){  
				$("#PAYONLINENOW").prop("checked", true);
				$("#GUARANTEEPAYMENT").parent().parent().remove();
			}else{
				$('#PAYATHOTEL').parent().parent().remove();
				$("#GUARANTEEONENIGHTDEPOSIT").parent().parent().remove();
			}
			if(isIHCLCBSiteFlag){
				$("#PAYONLINENOW").closest('.ihclcb-payment-opt-btn').addClass('selected-ihclcb-payment-btn').siblings().removeClass('selected-ihclcb-payment-btn');
			}
			$('.payment-radio-content').addClass('cm-hide');
			$('#PAYATHOTEL').parent().parent().remove();
			$("#GUARANTEEONENIGHTDEPOSIT").parent().parent().remove();
		}else{
			$("#GUARANTEEPAYMENT").parent().parent().remove();
		}

		if(!guaranteedByCreditCard){
			$('.payment-radio-content').addClass('cm-hide');
		}
	}
	function decideBookOnlineVisibility(){
		var payOnlineDisabled = dataCache.session.getData("PayOnlineDisabled");
				if (payOnlineDisabled == undefined){payOnlineDisabled = false;}
				// getting the booking data				
				var roomsData= dataCache.session.getData( "bookingOptions" );
				var ihclCbBookingObject= dataCache.session.getData("ihclCbBookingObject")
				if(roomsData && roomsData.selection && roomsData.selection[0] && roomsData.selection[0].currencyString){
					if(roomsData.selection[0].currencyString != "INR" ){
						// [IHCLCB start]
						if(ihclCbBookingObject!=undefined && ihclCbBookingObject.isIhclCbBookingFlow){
								 $('#PAYONLINENOW').parent().parent().remove();
							} 
						// [IHCLCB end]
						$('#PAYONLINENOW').parent().parent().remove();

					}else{
						if(payOnlineDisabled == "true"){
							$('#PAYONLINENOW').parent().parent().remove();
						}
					}
				}
			}
			function populateCartTotalAmount(){
				var totalCartPrice = dataCache.session.getData( "bookingOptions" ).totalCartPrice;
				$( '.credit-card-total-amount' ).html( roundPrice(totalCartPrice) ).digits();
			}


			function tokenTxnFailedPopup(){

				if (window.location.href.indexOf("booking-cart") > -1 && getQueryParameter('status') && getQueryParameter('status') == 'Transaction_Cancelled') {

						var message = 'The transaction could not be processed. Please enter valid credit card details and accept the terms and conditions for tokenisation, to guarantee your reservation';
                        var popupParams = {
                                title: 'Transaction Failed!',
                                description: message
                            }
                            warningBox(popupParams);
				}
            }

function setPaymentOptionsNamePAH() {
    if($(".tokenization-intl-pay-at-hotel").length == 1) {
        console.log("tokenization-intl-pay-at-hotel");
        $(".payment-options-name").each(function( i ) {
            if ( $(this).text() == "Pay at hotel (Master and Visa)" ) {
                $(this).text("Pay at hotel");
            }
        });
    }
}

$(document).ready( function() {
    setPaymentOptionsNamePAH();
});

$( 'document' ).ready( function() {


      $(".checkout-enter-details-header.payment").click(function(){
    	$(".payment-details-wrp.form-step-content").slideToggle();
    	//For 205158
    	$('.price-summary-wrapper').addClass('pos-fix-mod').css('bottom', (footerHeight+100)+'px');
  	});
    $(".checkout-enter-details-header.booking").click(function(){
    	$(".booking-details-wrp.form-step-content").slideToggle();
  	});




//    [IHCLCB start] 
    if($(window).width() < 767) {
        $('.ihcl-theme .cart-selected-rooms-card-container').on('click', '.cart-room-number', function() {       
            $(this).closest('.cart-selected-rooms-card').toggleClass('selected-rooms-cart-open-accr');
        });


        //move price summary below rooms for mobile view
        setTimeout(function(){
            var priceSummary = $('.price-summary-wrapper');
        	$('.cart-selected-rooms-addons-container').append(priceSummary);
        },2000);

        //$('.price-summary-wrapper').get(0).remove();

    }
    setTimeout( function(){ $('.rate-description .rate-plan-description-txt').cmToggleText({
            charLimit:80,
            showVal:'Show More',
            hideVal:'Show less'
        })

                          },1000);
//    [IHCLCB End]
});
function selectedRoomDelete(){
	var deleteWarningData = $($.find("[data-warning-type='DELETEPOPUP']")[0]);
	 var popupParams = {
        title: deleteWarningData.data("warning-heading") || "Are you sure you want to delete this Room?",
        description: deleteWarningData.data("warning-description") || null,
    }
	return popupParams;
}

window.setTimeout( function() {
  showInactivityPopup();
}, 600000);


function showInactivityPopup()
{
	var message = 'You have been away for a while! Please continue your booking';
	var popupParams = { title: 'Session is about to expire !', description: message, callBack : refreshCartPage, needsCta : true}
    successBox( popupParams );
    $($('.cm-warning-box button.warning-proceed-btn span')[0]).html('CONTINUE');
    $('.cm-warning-box div.cm-warning-box-cancel-btn').hide();
     $('.cm-warning-box span.icon-close').hide();


}

function refreshCartPage(){
	window.location.reload();
}

$(document).ready(function() {
    var data = JSON.parse(sessionStorage.getItem("tajData"));
    var modifyState = data.modifyBookingState;
    if(modifyState=="modifyGuest"){
        var bookingDetailsRequest = JSON.parse(data.bookingDetailsRequest);
        var hotelImagePath = bookingDetailsRequest.hotel.hotelBannerImagePath;
	$(".hotel-image").attr('src', hotelImagePath);
    }
    setTimeout(function(){
        if(modifyState == "modifyRoomType" || modifyState == "modifyRoomOccupancy" || modifyState == "modifyAddRoom"){
		$('#bookingGuestCountry').val("India (+91)");
    }
    },1500);

	$("#iaiaNumber").parent().hide();
    $('.summary-soldout-message').hide();
    if($('.cm-page-container').hasClass('ama-theme')){
        if(dataCache.session["data"]["bookingOptions"]["selection"][0]["isBungalow"] == true){
			$(".ama-theme .carts-add-room").hide();
        }
    }
    if(dataCache.session["data"]["checkInTime"] && dataCache.session["data"]["checkOutTime"]){
        var dataCheckIn =dataCache.session["data"]["checkInTime"];
        var dataCheckOut  =dataCache.session["data"]["checkOutTime"];
        if( dataCheckIn != "" &&  dataCheckOut != ""){
            $(".checkInTime ").text("Check-in("+dataCheckIn+")");
            $(".checkOutTime").text(" Check-out("+dataCheckOut+")");
        }
    }

    // [IHCLCB]
    // summary details card accordion
    if ($(window).width() < 768) {
        $('.ihcl-theme .summary-room-title, .ihcl-theme .summary-charges-heading').click(function() {
            $(this).parent().toggleClass('ihclcb-open-checkout-accordion');
        });
    }
	var ItineraryDetails = dataCache.session.getData('ItineraryDetails');

    if(ItineraryDetails){
		$('#iaiaNumber').parent().show();
    }

    if(ItineraryDetails && ItineraryDetails.onlyOnlineBooking){
        //$(".checkout-hotel-card-container").hide();
        $(".cart-empty-state-con").hide();
        $(".summary-card-wrap").hide();
        $(".checkout-page-back-link").hide();
        $("#PAYATHOTEL").parents(".ihclcb-payment-opt-btn").css("display","none");
        $($(".checkout-form-step-wrp span")[3]).hide()
        $('#btn-proceed').hide();
    	bookingItinerarySummary(ItineraryDetails);
    }
    else{
        $(".itinerary-data").hide();
        $(".book-itinerary").hide();
        $(".special-food-preference").hide();
        $(".special-food-input-wrp").hide();
	}

    $( '.itineraryBack' ).click( function( e ) {
        window.history.back();
    } );
    // summary details card accordion ends
});

function cartSumaryCardComponent() {
    var couponCode = {
        value : null
    }

    $('.summary-card-arrow').click(function(e) {
        e.stopPropagation();
        $(this).toggleClass('expanded');
        $('.summary-room-exp').toggleClass('visible');
        $('.summary-charges').toggleClass('visible');
        $('.summary-room-mobile').toggleClass('hidden');
    });

    $('.summary-charges, .summary-room-exp').click(function(e) {
        e.stopPropagation();
    })

    $('body').click(function(e) {
        $('.summary-card-arrow').removeClass('expanded');
        $('.summary-room-exp').removeClass('visible');
        $('.summary-charges').removeClass('visible');
        $('.summary-room-mobile').removeClass('hidden');
    })

    $('.coupon-code').on("keyup", function() {
        var couponCodeInput = $(this).val();
        if (couponCodeInput.length > 0) {
            $('.apply-coupon-code-btn').show();
            $('.coupon-code-clear-input').show();
        } else {
            $('.apply-coupon-code-btn').hide();
            $('.coupon-code-clear-input').hide();
        }
    });

    $('.apply-coupon-code-btn').on("click", function() {
        validateCouponcode(couponCode);
    });

    $('.coupon-code-clear-input').on("click", function() {
        $('.coupon-code').val("");
        $(this).hide();
        $('.apply-coupon-code-btn').hide();
        $('.couponcode-status-text').text("");
        couponCode.value = null;
        dataCache.session.data.bookingOptions.couponCode = null;
    });
    var couponCodeSelected = dataCache.session.data.bookingOptions.couponCode;
    if (couponCodeSelected) {
        $('.checkout-layout .coupon-show-on-checkout-page').removeClass('cm-hide');
        $('.summary-applied-coupn').text(couponCodeSelected);
    } else {
        $('.checkout-layout .coupon-show-on-checkout-page').addClass('cm-hide');
    }
}

function showNightlyRates() {

    $(".nightly-rates").html("");
    var previousCurrencySymbol = dataCache.session.getData('selectedCurrency');
    var sessionData = dataCache.session.getData("bookingOptions");
    var userData = getUserData();
    var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
    if (sessionData.selection[0]) {
        var currencySymbol;
        if (previousCurrencySymbol != undefined) {
            currencySymbol = previousCurrencySymbol.trim();
        }
        for (var s = 0; s < sessionData.selection.length; s++) {

            var roomNumber = s + 1;

            var roomHtml = '<div class="room-nightly-rates"> <span class="room-info"> Room ' + roomNumber + '</span>';

            for (var i = 0; i < sessionData.selection[s].nightlyRates.length; i++) {

                var indNightRateData = sessionData.selection[s].nightlyRates[i];

                var rateAfter = '';
                // [TIC-FLOW]
                if (ticRoomRedemptionObjectSession && ticRoomRedemptionObjectSession.isTicRoomRedemptionFlow) {

                    if (previousCurrencySymbol != 'INR' && previousCurrencySymbol != '₹') {
                        var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
                        if (ticRoomRedemptionObjectSession
                                && ticRoomRedemptionObjectSession.currencyRateConversionString) {
                            var currencyRateConversionString = ticRoomRedemptionObjectSession.currencyRateConversionString;
                            var conversionRate = parseFloat(currencyRateConversionString[previousCurrencySymbol
                                    + '_INR']);
                            indNightRateData.priceWithFeeAndTax = Math.round(Math
                                    .ceil(indNightRateData.priceWithFeeAndTax)
                                    * conversionRate);
                        }

                    }
                    if (userData && userData.card && userData.card && userData.card.type) {
                        if (userData.card.type.includes("TIC")) {
                            rateAfter = roundPrice(Math.round(indNightRateData.priceWithFeeAndTax)) + ' TIC Points';
                        } else if (userData.card.type === "TAP") {
                            rateAfter = roundPrice(Math.round(indNightRateData.priceWithFeeAndTax)) + " TAP";
                        } else if (userData.card.type === "TAPPMe") {
                            rateAfter = roundPrice(Math.round(indNightRateData.priceWithFeeAndTax)) + " TAPP Me";
                        }
                    }
                    currencySymbol = '';
                } else {
                    rateAfter = Number(indNightRateData.price).toFixed(2);
                }

                var indNightRateHtml = '<div class="ind-nightly-rate">' + '<span class="ind-night-date">'
                        + moment(indNightRateData.date, "MM/DD/YYYY").format("DD MMM YYYY") + '</span>'
                        + '<span class="ind-night-rate">' + currencySymbol + ' ' + rateAfter + '</span>' + '</div>';

                roomHtml = roomHtml + indNightRateHtml;
            }
            roomHtml = roomHtml + '</div>';

            $('.nightly-rates').append(roomHtml);

        }
    }
}
function showAllTypeOfTaxes() {

    $(".all-type-of-taxes").html("");
    var previousCurrencySymbol = dataCache.session.getData('selectedCurrency');
    var sessionData = dataCache.session.getData("bookingOptions");

    if (sessionData && sessionData.selection[0]) {
        var currencySymbol;
        if (previousCurrencySymbol != undefined) {
            currencySymbol = previousCurrencySymbol.trim();
        }
        for (var s = 0; s < sessionData.selection.length; s++) {

            var roomNumber = s + 1;

            var roomTaxHtml = '<div class="room-level-tax"> <span class="room-info"> Room ' + roomNumber + '</span>';

            for (var i = 0; sessionData.selection[s].taxes && i < sessionData.selection[s].taxes.length; i++) {

                var indTaxData = sessionData.selection[s].taxes[i];

                var price = Number(indTaxData.taxAmount).toFixed(2);

                var indTaxHtml = '<div class="ind-tax-Details">' + '<span class="ind-tax-name">' + indTaxData.taxName
                        + '</span>' + '<span class="ind-tax-amount">' + currencySymbol + ' ' + price + '</span>'
                        + '</div>';

                roomTaxHtml = roomTaxHtml + indTaxHtml;
            }
            roomTaxHtml = roomTaxHtml + '</div>';

            $('.all-type-of-taxes').append(roomTaxHtml);

        }
    }
}

function getCouponCodeFromCache() {
    var couponCodeList = $($.find("[data-coupon-code]")[0]).data();
    // var couponCodeList = dataCache.session.getData( "couponCodes");
    if (couponCodeList) {
        return couponCodeList;
    }
    return couponCodeList ? couponCodeList : [ 'KOOPON' ];
}

// ie fall back for object.values
function extractObjectValues(objectName) {
    return (Object.keys(objectName).map(function(objKey) {
        return objectName[objKey]
    }))
}

function validateCouponcode(couponCode) {
    var couponCodeInput = $('.coupon-code').val();
    var couponCodeStatus = false;
    var couponCodeList = getCouponCodeFromCache();
    if ((couponCodeList != '') && (extractObjectValues(couponCodeList).indexOf(couponCodeInput) != -1)) {
        couponCodeStatus = true;
    }
    if (couponCodeStatus) {
        $('.couponcode-status-text').text("Coupon code selected: " + couponCodeInput);
        couponCode.value = couponCodeInput;
        dataCache.session.data.bookingOptions.couponCode = couponCode.value;
    } else {
        $('.couponcode-status-text').text("Coupon code invalid.");
        couponCode.value = null;
        dataCache.session.data.bookingOptions.couponCode = null;
    }
}

function bookingItinerarySummary(ItineraryDetails){
    var totalPrice = 0;
    var totalTax = 0;
    var grandTotal = 0;
    var cartJson = ItineraryDetails.cartJson;
    var hotelData = ItineraryDetails.cartData;
    var enquiryDetails = ItineraryDetails.enquiryDetails;
    var totalNoOfRooms = ItineraryDetails.occupancyDetails.quantity;
    var totalNoOfNights = 0;
    hotelData.sort(function(a, b){
    var dateA=new Date(a.checkInDate), dateB=new Date(b.checkInDate)
    return dateA-dateB //sort by date ascending
})
    $(".package-name").text(enquiryDetails.packageName);
    for(var i=0;i<hotelData.length;i++){
        var ulObj = $('<ul id="hotelRoomListing'+i+'" ></ul>')
        ulObj.appendTo($('.booking-summary')[0]);	
        var Difference_In_Time = (new Date(hotelData[i].checkOutDate)).getTime() - (new Date(hotelData[i].checkInDate)).getTime(); 
        var noOfNights = Difference_In_Time / (1000 * 3600 * 24);
		totalNoOfNights += noOfNights;
        console.log('noOfNights', noOfNights);
        if(hotelData[i].room){
            var liObj = $('<li class="itinerary-room-card"><h3 class="summary-room-title" style="margin-bottom: 1.25rem; font-size: 1.55rem;">'
                          +hotelData[i].hotelName+'</h3><p><span style="margin-right: 12px; font-size: large;"><b>Check-in :</b></span><span style="border-right: 1px solid black; padding: 1px 20px 1px 0;">'
                          +hotelData[i].checkInDate+'</span>'+ '<span style="margin-right: 20px; font-size: large; padding-left: 12px;"><b>Check-out :</b></span><span>'
            +hotelData[i].checkOutDate+'</span></p>' + '<p><b>Room: </b>'+hotelData[i].room.title+ ' - <b style="padding-left:20px">' +noOfNights+'</b> Nights </p></li>');
            liObj.appendTo($('#hotelRoomListing'+i));
        }
    }

    for(var j =0;j< cartJson.length; j++){
        for(var k =0;k<cartJson[j].nightlyRates.length; k++){
            totalPrice += parseFloat(cartJson[j].nightlyRates[k].price);
            totalTax += parseFloat(cartJson[j].nightlyRates[k].tax);
            grandTotal += parseFloat(cartJson[j].nightlyRates[k].priceWithFeeAndTax);
        }
    }
    totalPrice = isNaN(totalPrice) ? Math.round(totalPrice) : Math.round(totalPrice).toLocaleString('en-IN');
    totalTax = isNaN(totalTax) ? Math.round(totalTax) : Math.round(totalTax).toLocaleString('en-IN');
    grandTotal = isNaN(grandTotal) ? Math.round(grandTotal) : Math.round(grandTotal).toLocaleString('en-IN');


    var priceObj = $('<div class="summary-charges-item-name row">Price: <span class="cart-currency-symbol px-2 d-flex" style="flex:1;">( ' +totalNoOfRooms+ ' Room X ' +totalNoOfNights+ ' Night )</span><span style="padding-right: 7px">₹</span>'+totalPrice+'</div>');
    var taxObj = $('<div class="summary-charges-item-con summary-charges-tax-con d-flex">Taxes and fees <span class="cart-currency-symbol  px-2 d-flex justify-content-end" style="flex:1;">₹</span>'+totalTax+'</div>');
    var totalObj = $('<div class="summary-charges-item-name summary-charges-item-con d-flex">Total: <span class="cart-currency-symbol px-2 d-flex" style="flex:1;">( ' +totalNoOfRooms+ ' Room X ' +totalNoOfNights+ ' Night )</span><span style="padding-right: 7px">₹</span>'+grandTotal+'</div>');
    priceObj.appendTo($('.priceDisplay'));
    taxObj.appendTo($('.priceDisplay'));
    totalObj.appendTo($('.priceDisplay'));

	$('#day-night-span').append((totalNoOfNights+1) + 'Days & '+ totalNoOfNights + ' Nights');
}

if($('.price-summary-wrapper').length){
    var priceSummary = $('.price-summary-wrapper').offset();
    var endOfPageContentElement = $('.hotel-footer').offset();
    var footerHeight = $('.hotel-footer').height();
    
    
    $(window).scroll(function(){
    
          if($(window).scrollTop() >= priceSummary.top && !$('.price-summary-wrapper').hasClass('position-fix')){
             $('.price-summary-wrapper').addClass('position-fix');
          } 
          else if($(window).scrollTop() < priceSummary.top) {
             $('.price-summary-wrapper').removeClass('position-fix').css('bottom', 'auto');
          }
    
          if($(window).scrollTop() >= ($('.hotel-footer').offset().top)-360){
              $('.price-summary-wrapper').addClass('pos-fix-mod').css('bottom', (footerHeight+100)+'px');
          }else{
              $('.price-summary-wrapper').removeClass('pos-fix-mod');
          }
    
    });
}



var modifyBookingExistingComments = "";
$(document).ready(
        function() {
            $('#guest-firstName').parent().removeClass('col-md-4').addClass('col-md-5');
            $('#guest-lastName').parent().removeClass('col-md-4').addClass('col-md-5');
            $('#guest-Email').parent().removeClass('col-md-4').addClass('col-md-5');
            $('#bookingGuestCountry').parent().parent().removeClass('col-md-4').addClass('col-md-3');
            //$('#guest-PhoneNumber').parent().removeClass('col-md-4').addClass('col-md-3');
            $('#guest-MembershipNumber').parent().removeClass('col-md-4').addClass('col-md-6');
            $('#guest-GSTNumber').parent().removeClass('col-md-4').addClass('col-md-6');


            (typeof(PIL) != 'undefined') ? PIL.load("1") : '';

            // Handle voucher related fields
            var voucherRedemptions = dataCache.session.getData('voucherRedemption');
            if(voucherRedemptions && voucherRedemptions == 'true' && sessionStorage.getItem('gravtyVoucherSelected') != 'true'){
                $('#guest-VoucherCode').parent('.col-md-4.sub-form-input-wrp').show();
                $('#guest-VoucherPin').parent('.col-md-4.sub-form-input-wrp').show();
            }

            if (dataCache.session.getData('bookingOptions') === null
                    && sessionStorage.getItem('bookingOptions') === null) {
                console.info('reservation details not found');
            } else {
                if ($('#corporate-ihclcb-checkout').attr('data-corporate-checkout') == 'false'
                        || !$('#corporate-ihclcb-checkout').attr('data-corporate-checkout')) {
                    // $('.guest-detail-ihclcb').remove();
                    buildGuestPage();
                } else {
                    ihclcbBuildGuestPage();
                }
            }
            // Populate Booker ID in form
            var bookingDetailsBooker = getUserData();
            if(bookingDetailsBooker && bookingDetailsBooker.profileId) {
				$("#tic-booker-id-ihclcb").val(bookingDetailsBooker.profileId);
            }
			 employeeGSCBookingFlow();
        });
		
function employeeGSCBookingFlow(){
            if (sessionStorage.getItem('employeeGSCBookingFlow') == 'true') {
                                $( '#employee-details-checkOut' ).show();
                                $( '#sales-office-wrp' ).show();
                $('input[id="employee-Number"]').on('input', function() {        
                    var employeeNum = this.value.split("-").join("");        
                    if (employeeNum.length > 3) {        
                       employeeNum = employeeNum.substring(0,3) + "-" + employeeNum.substring(3);        
                       }        
                                 this.value = employeeNum;        
                                    });
                        } else {
                                   $( '#employee-details-checkOut' ).hide();
                $( '#sales-office-wrp' ).hide();
                        }
}

function buildGuestPage() {
    try {
        var reservationDetailsJson = dataCache.session.getData('bookingOptions');
        var modifyBookingState = dataCache.session.getData('modifyBookingState');
        var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');

        var contentRootPath = $('#content-root-path').val();
        if (contentRootPath == "" || contentRootPath == null || contentRootPath == 'undefined') {
            contentRootPath = "/content/tajhotels";
        }
        if (reservationDetailsJson != 'null') {

            var guestDetails = reservationDetailsJson.guest;
            if (guestDetails) {
                $('#bookingGuestTitle').find('option[value="' + guestDetails.title + '"]').attr('selected', 'selected');
                $('#bookingGuestTitle').data("selectBox-selectBoxIt").refresh();
                $('#guest-firstName').val(guestDetails.firstName);
                $('#guest-lastName').val(guestDetails.lastName);
                $('#guest-Email').val(guestDetails.email);
                $('#bookingGuestCountry').val(guestDetails.country);
                $('#guest-PhoneNumber').val(guestDetails.phoneNumber);
                $('#guest-MembershipNumber').val(guestDetails.membershipNo);
                $('#special-request').val(guestDetails.specialRequests);
                if (typeof guestDetails.gstNumber != 'udefined' || guestDetails.gstNumber != '') {
                    $('#guest-GSTNumber').val(guestDetails.gstNumber);
                }
            }

            if(modifyBookingState){
                $('#special-request').val("");
                modifyBookingExistingComments = guestDetails.specialRequests;
            }
            
            // [TIC-FLOW]
            var userDetails = getUserData();
            var booking_type = localStorage.getItem("bookingType");			
            if(booking_type == "null" || booking_type == "self"){
                if (userDetails) {
				
					$(".book-for-tic-wrp").removeClass('d-none');
					
                    if (userDetails.nameDetails.salutation) {                        
						if(userDetails.nameDetails.salutation.indexOf('.') == -1){
							userDetails.nameDetails.salutation = userDetails.nameDetails.salutation+'.';
						}
						 $('#bookingGuestTitle').selectBoxIt('selectOption', userDetails.nameDetails.salutation);
						 $('#bookingGuestTitle').prop('disabled', true);                        
						if(!($('#bookingGuestTitle').selectBoxIt('selectOption').val()) || $('#bookingGuestTitle').selectBoxIt('selectOption').val().length== 0){
							$('#bookingGuestTitle').prop('disabled', false);
						}                        
                    }
					
                    if (userDetails.nameDetails && userDetails.nameDetails.firstName) {
                        $('#guest-firstName').val(userDetails.nameDetails.firstName);
                        $('#guest-firstName').prop('disabled', true);
                    }
                    if (userDetails.nameDetails && userDetails.nameDetails.lastName) {
                        $('#guest-lastName').val(userDetails.nameDetails.lastName);
                        $('#guest-lastName').prop('disabled', true);
                    }
                    if (userDetails.primaryEmailId) {
                        $('#guest-Email').val(userDetails.primaryEmailId);
                        $('#guest-Email').prop('disabled', true);
                    } 
                    if (userDetails.primaryMobile && userDetails.primaryMobile.phoneNumber) {
                        // $('#bookingGuestCountry').val(userDetails.country);
                        $('#guest-PhoneNumber').val(userDetails.primaryMobile.phoneNumber);
                        $('#guest-PhoneNumber').prop('disabled', true);
                    }
                    if (userDetails.brandData && userDetails.brandData.ticNumber) {

						$('#guest-MembershipNumber').val(userDetails.brandData.ticNumber[userDetails.brandData.ticNumber.length - 1]);
						$('#guest-MembershipNumber').prop('disabled', true);
                    }
				/*	else if(userDetails.tcpNumber){
						$('#guest-MembershipNumber').val(userDetails.tcpNumber);
                        $('#guest-MembershipNumber').prop('disabled', true);
					}*/
                    if (userDetails.card && userDetails.card.type) {
                        var membership = userDetails.card.type;
                        if (membership === "TAP") {
                            $('.guest-MembershipNumber ').text("TAP Membership Number");
                        } else if (membership === "TAPPMe") {
                            $('.guest-MembershipNumber ').text("TAPP Me Membership Number");
                        }
                    }
					
					//TODO: Gravty
					if (sessionStorage.getItem('gravtyVoucherSelected') == "true") {
                        var membership = sessionStorage.getItem('memberType');
                        if (membership === "Epicure") {
                            $('.guest-MembershipNumber ').text("Epicure Membership Number");
                        } else if (membership === "Chambers") {
                            $('.guest-MembershipNumber ').text("Chambers Membership Number");
                        }
						$('#guest-MembershipNumber').val(sessionStorage.getItem('gravtyMemberNumber'));
						$('#guest-MembershipNumber').prop('disabled', true);
                    }

                    if (ticRoomRedemptionObjectSession && ticRoomRedemptionObjectSession.isTicRoomRedemptionFlow) {
                        $(".tic-info-label").removeClass('d-none');
                        $(".book-for-tic-wrp").removeClass('d-none');
                        $(".cm-page-container").addClass('tic-room-redemption-fix');
                    }
					else{
						var roomSelections = ticRoomRedemptionObjectSession.selection;
						var selectedFilterCode = [];
						for(var i=0;i<roomSelections.length;i++){
							if(selectedFilterCode.indexOf(roomSelections[i].selectedFilterCode) == -1){
								selectedFilterCode.push(roomSelections[i].selectedFilterCode);	}						
						}
						if(selectedFilterCode.length > 0 && selectedFilterCode.indexOf("TIC") != -1){
							if(userDetails.loyaltyInfo){
								$(".book-for-tic-wrp").addClass('d-none');
							}
						}
					}
                }
            }


            if (modifyBookingState == "modifyGuest") {
                $('.policy-terms-external-wrapper').hide();
                $("#btn-save").html("SAVE");
                var button = document.getElementById("btn-save");
                button.style.display = "inline-block";
                $('#btn-proceed').hide();

                // ajax call to save the modified the guestDetails

                $("#btn-save")
                        .click(
                                function() {
                                    $(this).hide();
                                    $(this).siblings('.taj-loader').show();
                                    var jsonObject = JSON.parse(dataCache.session.getData('bookingDetailsRequest'));
                                    console.log('Get Json Object --- '+jsonObject);
                                    var guest = jsonObject.guest;
                                    guest.title = document.getElementById("bookingGuestTitle").value;
                                    guest.firstName = document.getElementById("guest-firstName").value;
                                    guest.lastName = document.getElementById("guest-lastName").value;
                                    guest.email = document.getElementById("guest-Email").value;
                                    guest.country = document.getElementById("bookingGuestCountry").value;
                                    guest.phoneNumber = document.getElementById("guest-PhoneNumber").value;
                                    guest.membershipNo = document.getElementById("guest-MembershipNumber").value;
                                    guest.gstNumber = document.getElementById("guest-GSTNumber").value;
                                    guest.specialRequests = modifyBookingExistingComments + ' , '+ document.getElementById("special-request").value;

                                    jsonObject.guest = guest;
									dataCache.session.setData('itineraryNumber',jsonObject.itineraryNumber);
									sessionStorage.setItem('itineraryNumber',jsonObject.itineraryNumber);

                                    $.ajax({
                                                cache: false,
                                                type : 'POST',
                                                url : '/bin/modifyReservation',
                                                data : {
                                                    'modifyJson' : JSON.stringify(jsonObject),
                                                    'contentRootPath' : contentRootPath
                                                },
                                                success : function(data) {
													var cancelJson = data;
                                                    if(data != undefined && data != '')
                                                    	dataCache.session.setData('bookingDetailsRequest', data);
													try{
														JSON.parse(data);
														window.location.assign("https://"+window.location.host+"/en-in/booking-confirmation?fromFindReservation=true");
													} catch (e) {
														var popupParams = {
																title : 'Booking modification failed.',
																description : '',
																isWarning : true
														}
														warningBox(popupParams);
													}                                                    
												},
                                                failure : function(data) {
                                                    console.log('failure');
                                                    $('.statusdetails').html("<strong>XML not updated</strong>");
                                                    $(this).show();
                                                    $(this).siblings('.taj-loader').hide();
                                                    var popupParams = {
                                                        title : 'Guest Details Not Updated. Try again.',
                                                        callBack : '',
                                                        needsCta : false,
                                                        isWarning : true
                                                    }
                                                    warningBox(popupParams);
                                                }
                                            });
                                });
            }
        }
    } catch (error) {
        console.error(error);
    }
}

function ihclcbBuildGuestPage() {

    // $('.guest-detail-non-ihclcb').remove();
    var userDetailsIhclcb = getUserData();
    // if (userDetailsIhclcb && userDetailsIhclcb.email) {
    // $('.ihclcb-booker-email').text(userDetailsIhclcb.email);
    // }
    var userDetailsIHCLCB = getUserData();
    var isIhclcbFlagSet = dataCache.session.getData("ihclCbBookingObject");
    var $membershipIdInput = $("#tic-member-id-ihclcb")
    $membershipIdInput.prop('disabled', false);

    if (userDetailsIHCLCB && isIhclcbFlagSet && isIhclcbFlagSet.isIHCLCBFlow) {
        try {
            $('.guest-detail-ihclcb #bookingGuestTitle').prop('disabled', true);
            $('.guest-detail-ihclcb #bookingGuestTitle').selectBoxIt('selectOption', 1);
            $('.guest-detail-ihclcb #guest-firstName').prop('disabled', true);
            $('.guest-detail-ihclcb #guest-lastName').prop('disabled', true);
            $('.guest-detail-ihclcb #guest-Email').prop('disabled', true);
            $('.guest-detail-ihclcb #guest-PhoneNumber').prop('disabled', true);

            $membershipIdInput.blur(function() {

                var enteredValue = $(this).val();
                if (enteredValue === "" || enteredValue == undefined || enteredValue == null) {
                    return;
                }
                // var userDetailsIHCLCB = getUserData();
                // if (userDetailsIHCLCB) {
                if (userDetailsIHCLCB.enteredMemberShipId && userDetailsIHCLCB.enteredMemberShipId == enteredValue) {
                    autoFillData(userDetailsIHCLCB.enteredGuestDetails);
                    return;
                }
                // }

                var custLoyaltyJSON = {
                    "CustLoyalty" : enteredValue
                }

                var ihclcbB2CHostApiUrl = $('.Ihclcb-Corporate-Booking-GuestApi').attr('data-ihclcbApiHostUrl')
                var ihclcbB2CEndpointUrl = $('.Ihclcb-Corporate-Booking-GuestApi').attr('data-ihclcbGuestApiUrl');

                $('body').showLoader();
                $.ajax({

                    url : ihclcbB2CHostApiUrl + ihclcbB2CEndpointUrl,
                    headers : {
                        "Authorization" : "Basic cmFqLnNyaW5pdmFzYW5AaW5ub3ZhY3guY29tOlNtaWxlQDI1",
                        "content-Type" : "application/json; charset=UTF-8"
                    },
                    type : "POST",
                    dataType : 'json',
                    data : JSON.stringify(custLoyaltyJSON),
                }).done(
                        function(res) {
                            if (res && res.GuestDetails && res.GuestDetails[0]) {
                                $membershipIdInput.removeClass('invalid-input');
                                storeGuestDetailsInLocal(res.GuestDetails[0], enteredValue);
                                autoFillData(res.GuestDetails[0]);
                            } else {
                                $membershipIdInput.addClass('invalid-input');
                                clearGuestData();
                                console.log('Sorry! Cant fetch the data for entered input');
                                $('#tic-member-id-ihclcb + .sub-form-input-warning').text(
                                        'Sorry! Cant fetch the data for entered input');
                            }
                        }).fail(function(res) {
                    clearGuestData();
                    $membershipIdInput.addClass('invalid-input');
                }).always(function() {
                    $('body').hideLoader();
                    $([ document.documentElement, document.body ]).animate({
                        scrollTop : $(".checkout-payment-details-container ").offset().top
                    }, 600);
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    function clearGuestData() {
        $('#corporate-ihclcb-checkout #bookingGuestTitle').prop('disabled', true);
        $('#corporate-ihclcb-checkout #guest-firstName').prop('disabled', true).val("");
        $('#corporate-ihclcb-checkout #guest-lastName').prop('disabled', true).val("");
        $('#corporate-ihclcb-checkout #guest-Email').prop('disabled', true).val("");
        $('#corporate-ihclcb-checkout #guest-PhoneNumber').prop('disabled', true).val("");
    }

    function storeGuestDetailsInLocal(res, enteredMemberShipId) {
        var userDetailsIHCLCB = getUserData();
        if (userDetailsIHCLCB) {
            var enteredGuestDetails = new Object();
            enteredGuestDetails.FirstName = res.FirstName;
            enteredGuestDetails.LastName = res.LastName;
            enteredGuestDetails.Email = res.Email;
            enteredGuestDetails.Phone = res.Phone;
            enteredGuestDetails.title = res.SalutoryIntroduction;
            userDetailsIHCLCB.enteredGuestDetails = enteredGuestDetails;
            userDetailsIHCLCB.enteredMemberShipId = enteredMemberShipId;
            dataCache.local.setData("userDetails", userDetailsIHCLCB);
        }
    }

    function autoFillData(guestDetails) {
        try {
            var title = guestDetails.title || guestDetails.SalutoryIntroduction;
            if (title) {
                $('.guest-detail-ihclcb #bookingGuestTitle').selectBoxIt('selectOption', title);
                $('.guest-detail-ihclcb #bookingGuestTitle').prop('disabled', true);
            }
            if (guestDetails.FirstName) {
                $('.guest-detail-ihclcb #guest-firstName').prop('disabled', true).val(guestDetails.FirstName);
            }

            if (guestDetails.LastName) {
                $('.guest-detail-ihclcb #guest-lastName').prop('disabled', true).val(guestDetails.LastName);
            }
            if (guestDetails.Email) {
                for (var i = 0; i < guestDetails.Email.length; i++) {
                    if (guestDetails.Email[i].PrimaryFlag && guestDetails.Email[i].EmailAddress) {
                        $('.guest-detail-ihclcb #guest-Email').prop('disabled', true).val(
                                guestDetails.Email[i].EmailAddress);
                    }
                }
            }
            if (guestDetails.Phone) {
                for (var j = 0; j < guestDetails.Phone.length; j++) {
                    if (guestDetails.Phone[j].PrimaryFlag && guestDetails.Phone[j].PhoneNumber) {
                        $('.guest-detail-ihclcb #guest-PhoneNumber').prop('disabled', true).val(
                                guestDetails.Phone[j].PhoneNumber);
                    }
                }
            } else {
                $('.guest-detail-ihclcb #guest-PhoneNumber').prop('disabled', false);
            }
        } catch (error) {
            console.error(error);
        }
    }
}

$(document).ready(function() {
    var userDetails = dataCache.local.getData("userDetails")
    var ihclCbBookingObject = dataCache.session.getData("ihclCbBookingObject");
    $('#corporate-ihclcb-resetpopup').css('display', 'none');

    if (userDetails && ihclCbBookingObject && ihclCbBookingObject.isIHCLCBFlow) {

        var entitySessionDetails = {}
        if (userDetails) {
            if (userDetails.selectedEntity) {
                selectedEntity = userDetails.selectedEntity;
            } else {
                selectedEntity = userDetails.selectedEntityAgent;
            }
        }
        console.log("entitySessionDetails:", selectedEntity);

        if (selectedEntity) {
            if (selectedEntity.partyName) {
                $('.cart-entity-details span').append(selectedEntity.partyName)
            }

            if (selectedEntity.city) {
                $('.cart-city-details span').append(selectedEntity.city)
            }
            if (selectedEntity.gSTNTaxID_c) {
                $('.cart-gstin-details span').append(selectedEntity.gSTNTaxID_c)
            }
            if (selectedEntity.iataNumber) {
                $('.cart-iata-details span').append(selectedEntity.iataNumber)
            }

        }
    }

});

document
        .addEventListener(
                'DOMContentLoaded',
                function() {

                   $('.footer-destination-expand-button').click(function(e) {
                        if ($(this).text().trim() == '+') {
                            $('.footer-destination-list').slideDown(100);
                            $(this).text('-');
                        } 
                        else {
                            $(this).text('+');
                            $('.footer-destination-list').slideUp(100);
                        }
					   e.stopImmediatePropagation();
                       return false;
                    });


                    $('.footer-tic-expand-button').click(function(e) {
                        if ($(this).find('button').text() == '+') {
                            $('.footer-brands-list').slideDown(100);
                            $(this).find('button').text('-');
                        } else {
                            $(this).find('button').text('+');
                            $('.footer-brands-list').slideUp(100);
                        }
                        e.stopImmediatePropagation();
                        return false;
                    });

                    if($('#scrollview')){
                        bindScrollFunction();
                    }

                    $('#newsletter').click(function() {

                    });
                    updateBrandSpecificSocialLinks();
                     //below code is for changing the tataneu related content

					updateFooterForTataNeu();
					 
					 
                    // The below function call is declared at dining-filter js
                    try {
                        populateFilterFromHtml();
                    } catch (e) {
                        // Dining filter is not available in the page
                        // console.log("The function[populateFilterFromHtml()]
                        // can't be called. Dining filter is not available in
                        // the page ")
                    }
                    toggleFooterPadding();
                });

function updateBrandSpecificSocialLinks() {
    var $pageContainer = $('.cm-page-container');
    var $facebookLink = $('.facebook-redirect');
    var $instagramLink = $('.instagram-redirect');
    var $twitterLink = $('.twitter-redirect');
    var $youtubeLink = $('.youtube-redirect')
    if ($pageContainer.hasClass('vivanta-theme')) {
        $facebookLink.attr('href', 'https://www.facebook.com/VivantaHotels');
        $instagramLink.attr('href', 'https://www.instagram.com/vivantahotels');
        $twitterLink.attr('href', 'https://twitter.com/vivantahotels');
        $youtubeLink.attr('href', 'https://www.youtube.com/user/VivantabyTaj');
    } else if ($pageContainer.hasClass('gateway-theme')) {
        $facebookLink.attr('href', 'https://www.facebook.com/TheGatewayHotel');
        $instagramLink.attr('href', 'https://www.instagram.com/thegatewayhotels');
        $twitterLink.attr('href', 'https://twitter.com/TheGatewayHotel');
        $youtubeLink.attr('href', 'https://www.youtube.com/user/TheGatewayHotel');
    }
}

function toggleFooterPadding(){
	if($('.book-ind-container').length!=0){
		$('.footer').addClass('footer-padding-for-cart-info');
	}
}

function bindScrollFunction(){
    $('.scrollview').click(function(){
        document.getElementById("scrollTarget").scrollIntoView();
    });

}

function updateFooterForTataNeu(){
 var userDetails =getUserData();
	if (userDetails && userDetails.loyalCustomer == 'Y') {
		var tataneuText = ['NeuPass Home', '', 'NeuPass Participating Hotels', ''];
		var tataneuLinks = ['https://www.tajhotels.com/en-in/neupass/', '', 'https://www.tajhotels.com/en-in/our-hotels/', '']
		$('.footer-brands-list li').each(function(index, value) {
			if (index == 0 || index == 2) {
				$(this).children().attr('href', tataneuLinks[index]);
				$(this).children().text(tataneuText[index]);
			}


		})
	}
}


var w1 = window.outerWidth;
var w2 = window.innerWidth;
var dollarRate = document.getElementById("dollarRate") ? document.getElementById("dollarRate").value : '75';

if (window.XMLHttpRequest) {
    xhttp = new window.XMLHttpRequest();
} else { // Internet Explorer 5/6
    xhttp = new ActiveXObject("Microsoft.XMLHTTP");
}
xhttp.open("GET", "/content/dam/list/airrates.xml?a=1", false);
xhttp.send("");
// alert("else");
xmlDoc1 = xhttp.responseXML;
var getQuoteObj = {};
// reset funxtion
function Resetfn() {
    try {
        var dropDown = document.getElementById("journey");
        dropDown.selectedIndex = 0;
        document.getElementById("squery").options.length = 0;
        document.getElementById("squery").options[0] = new Option("SELECT", "0");
        document.getElementById("mquery").value = ""; // new Option("-------Select---------","0");
        document.getElementById("returnRadio").selected = false;
        // document.getElementById("oneRadio").selected = true;
        // document.getElementById("oneRadio").options[0] = new Option("oneway", "0");
        // document.getElementById("oneRadio").selectedIndex = 0;
        document.getElementById("resultDiv").innerHTML = "";
        $('#quoteDiv #squery').data("selectBox-selectBoxIt").refresh();
        $('#quoteDiv #mquery').data("selectBox-selectBoxIt").refresh();
    } catch (error) {
        console.error("Error in taj-air-quotation.js ", error);
    }
}

$(document)
        .ready(
                function() {

                    $('.pricing-card-details-wrap').hide();

                    // onlclick-quick-quote-open-overlay-code
                    $(".quick-quote-btn").click(function() {
                        $(".quickQuoteMain").show();

                        prepareQuickQuoteJsonForClick("QuickQuote");
                    });

                    // close-button-code
                    $(".fa-remove").click(function() {
                        $(".quickQuoteMain").hide();
                    });

                    if ($(".quickQuoteMain").display == "block") {
                        $("body").click(function() {
                            $(".quickQuoteMain").hide();
                        });
                    }

                    $(".travelDetails").hide();

                    $("#getQuoteBtn").click(function() {
                        // $(".travelDetails").slideUp("fast");
                        if (!validateMe()) {
                            $(".travelDetails").slideUp("fast");
                            return false;
                        }

                        // for analytics
                        getQuoteObj.tripType = $('#journey').val();
                        prepareQuickQuoteJsonAfterClick("GetQuote", getQuoteObj);
                        // analytics end

                        $(".travelDetails").slideDown("fast");
                    });

                    $(".resetBtn").click(function() {
                        $(".travelDetails").slideUp("fast");
                    });

                    $('.pricing-expl').click(function() {
                        $('#screen, #modal').show();
                    });

                    $('#screen, #close-price-expl').click(function() {
                        $('#screen, #modal').hide();
                    });

                    $('.myButtonWalkthru').click(function() {
                        $('#screen-walkthru, #modal-walkthru').show();
                    });

                    $('#screen-walkthru, #close-walkthru').click(function() {
                        $('#screen-walkthru, #modal-walkthru').hide();
                    });

                    $('.pricing-expl').click(function() {
                        $('.pricing-card-details-wrap').show();
                    });

                    $('.pricing-details-close').click(function() {
                        $('.pricing-card-details-wrap').hide();
                    });

                    $("#bookajet, .requestQuote").click(function() {
                        var d1 = $("#mquery").val();
                        d1 = d1.split("[");
                        d1 = d1[0].trim(" ");
                        var d2 = $("#squery").val();
                        d2 = d2.split("[");
                        d2 = d2[0].trim(" ");
                        var d3 = $("#journey").val();

                        if (typeof (Storage) !== "undefined") {
                            localStorage.setItem("departureCity", d1);
                            localStorage.setItem("destinationCity", d2);
                            localStorage.setItem("flightType", d3);
                        } else {
                            alert('Please update your Browser.');
                        }
                        getQuoteObj.flight_tripPriceUSD = $(document).find('.secondary-rupee-ui').text();
                        getQuoteObj.flight_tripPriceINR = $(document).find('.primary-rupee-ui').text();
                        prepareQuickQuoteJsonAfterClick("BookJet_QuoteSeen", getQuoteObj);
                    });

                    $("#quoteDiv,.flight-journey-details-cnt")
                            .on(
                                    'click keyup keydown change ',
                                    '#mquery, #cityName option',
                                    function(event) {
                                        try {
                                            init = 1;
                                            // alert("clalled on");

                                            document.getElementById("squery").options.length = null;
                                            var cityarr = new Array();
                                            var cnt = 0;

                                            if ($(this).val() == "" || $(this).val() == undefined) {
                                                document.getElementById("squery").options[0] = new Option("SELECT", "0");
                                            } else {

                                                var xmlCity = xmlDoc1.getElementsByTagName("tajairrates");
                                                var xmlCity1 = xmlCity[0].getElementsByTagName("Flight");

                                                for (f = 0; f < xmlCity1.length; f++) {

                                                    if (xmlCity1[f].getAttribute("Enable") == 1) {

                                                        xmlItm1 = xmlCity1[f].getElementsByTagName("item")
                                                        for (m = 0; m < xmlItm1.length; m++) {

                                                            if (xmlItm1[m].getElementsByTagName("from")[0].childNodes[0].nodeValue
                                                                    .toLowerCase() == $(this).val().toLowerCase()) {

                                                                if (cityarr.length > 0) {

                                                                    if (cityarr
                                                                            .valueOf()
                                                                            .toString()
                                                                            .indexOf(
                                                                                    xmlItm1[m]
                                                                                            .getElementsByTagName("to")[0].childNodes[0].nodeValue) == -1) {
                                                                        cityarr[cnt] = xmlItm1[m]
                                                                                .getElementsByTagName("to")[0].childNodes[0].nodeValue;
                                                                        cnt++;
                                                                    }

                                                                } else {
                                                                    cityarr[cnt] = xmlItm1[m]
                                                                            .getElementsByTagName("to")[0].childNodes[0].nodeValue;
                                                                    cnt++;
                                                                }

                                                            }
                                                        }
                                                    }
                                                }
                                                cityarr.sort();
                                                var cmb = $(this).closest('.single-flight-journey-detail-wrp').find(
                                                        '#squery')[0];
                                                // var cmb = document.getElementById( 'squery' );
                                                cmb.options[0] = new Option("SELECT", "SELECT");
                                                if (cityarr.length > 0) {
                                                    for (f = 0; f < cityarr.length; f++) {
                                                        cmb.options[init] = new Option(cityarr[f].toUpperCase(),
                                                                cityarr[f].toUpperCase());
                                                        init++;
                                                    }
                                                }
                                                cmb.options[0].selected = true;
                                                $(this).closest('.single-flight-journey-detail-wrp').find(
                                                        '#squerySelectBoxItContainer').remove();
                                                $(this).closest('.single-flight-journey-detail-wrp').find('#squery')
                                                        .data("selectBox-selectBoxIt").refresh();
                                            }
                                        } catch (error) {
                                            console.error("Error in taj-air-quotation.js ", error);
                                        }
                                    });

                });

// function change() {
// $("#mquery").keyup( function() {
// $(document.body).delegate('#mquery', 'change', function() {

// $("#mquery").onSelect( function(e) {

function validateMe() {
    try {
        if (document.getElementById("mquery").value == "" || document.getElementById("mquery").value == undefined) {
            alert("Please select the origin and destination to get a quick quote");
            document.getElementById("mquery").focus();
            return false;
        }

        if (document.getElementById("squery").options[document.getElementById("squery").selectedIndex].text == "SELECT"
                || document.getElementById("squery").options[document.getElementById("squery").selectedIndex].value == "0") {
            alert("Please select the destination to get a quick quote");
            document.getElementById("squery").focus();
            return false;
        }

        var departureFrom = document.getElementById("mquery").value;

        var matches1 = departureFrom.match(/\[(.*?)\]/);
        if (matches1) {
            var submatch1 = matches1[1];
        }

        var arrivingAt = document.getElementById("squery").options[document.getElementById("squery").selectedIndex].value;
        var matches = arrivingAt.match(/\[(.*?)\]/);

        if (matches) {
            var submatch = matches[1];
        }

        getQuoteObj.flight_ToCity = submatch;
        getQuoteObj.flight_FromCity = submatch1;
        // getFlightDetails(document.getElementById("mquery").options[document.getElementById("mquery").selectedIndex].value,document.getElementById("squery").options[document.getElementById("squery").selectedIndex].value,"INR");
        // setTimeout("getFlightDetails('" + document.getElementById("mquery").value + "','"
        // + document.getElementById("squery").options[document.getElementById("squery").selectedIndex].value
        // + "','INR');", 500);
        setTimeout("getFlightDetails('" + departureFrom + "','" + arrivingAt + "','INR');", 500);
        return true;
        // var winname1 = "loadme.asp?" + "mquery=" +
        // document.getElementById("mquery").options[document.getElementById("mquery").selectedIndex].value + "&squery="
        // +
        // document.getElementById("squery").options[document.getElementById("squery").selectedIndex].value +
        // "&rdJourney="
        // + document.support.rdJourney.value + "&rdPay"

        // window.open()
    } catch (error) {
        console.error("Error in taj-air-quotation.js ", error);
    }

}

var strResf = null;
var strRes = null;

function getFlightDetails() {
    try {
        strRes = null;

        // if ( window.XMLHttpRequest ) {
        // xhttp = new window.XMLHttpRequest();
        // } else { // Internet Explorer 5/6
        // xhttp = new ActiveXObject( "Microsoft.XMLHTTP" );
        // }
        // xhttp.open( "GET", "/content/dam/list/airrates.xml", false );
        // xhttp.send( "" );
        // xmlDoc = xhttp.responseXML;
        var xmlItem1 = xmlDoc1.getElementsByTagName("tajairrates");
        var xmlItem = xmlItem1[0].getElementsByTagName("Flight");

        for (f = 0; f < xmlItem.length; f++) {

            if (xmlItem[f].getAttribute("Enable") == 1) {

                xmlItm = xmlItem[f].getElementsByTagName("item")
                for (m = 0; m < xmlItm.length; m++) {

                    if (xmlItm[m].getElementsByTagName("from")[0].childNodes[0].nodeValue.toLowerCase() == arguments[0]
                            .toLowerCase()
                            && xmlItm[m].getElementsByTagName("to")[0].childNodes[0].nodeValue.toLowerCase() == arguments[1]
                                    .toLowerCase()) {
                        strRes = "<div class='jet-name'>" + xmlItem[f].getAttribute("name") + "</div>";
                        strRes += "<div class='jet-description'>"
                                + xmlItm[m].getElementsByTagName("description")[0].childNodes[0].nodeValue + "</div>";
                        if (arguments[2] == "INR") {
                            if (strRes != null)
                                strRes += "<div class=\"inr\"><div class=\"div1 text-right\">"
                                        + "<span class='primary-rupee-ui'><span class='rupee'>&#x20B9;</span> "
                                        + calculateAmt(
                                                xmlItm[m].getElementsByTagName("rupees")[0].childNodes[0].nodeValue,
                                                xmlItm[m].getElementsByTagName("mins")[0].childNodes[0].nodeValue,
                                                xmlItm[m].getElementsByTagName("from")[0].childNodes[0].nodeValue
                                                        .toLowerCase(),
                                                xmlItm[m].getElementsByTagName("to")[0].childNodes[0].nodeValue
                                                        .toLowerCase(), xmlItm)
                                        + "</span><span class='secondary-rupee-ui'>US$ "
                                        + calculateAmtUSD(
                                                xmlItm[m].getElementsByTagName("rupees")[0].childNodes[0].nodeValue,
                                                xmlItm[m].getElementsByTagName("mins")[0].childNodes[0].nodeValue,
                                                xmlItm[m].getElementsByTagName("from")[0].childNodes[0].nodeValue
                                                        .toLowerCase(),
                                                xmlItm[m].getElementsByTagName("to")[0].childNodes[0].nodeValue
                                                        .toLowerCase(), xmlItm) + "</span></div>";
                            else
                                strRes = "<div class=\"inr\"><div class=\"div1 text-right\">"
                                        + "<span class='primary-rupee-ui'><span class='rupee'>&#x20B9;</span> "
                                        + calculateAmt(
                                                xmlItm[m].getElementsByTagName("rupees")[0].childNodes[0].nodeValue,
                                                xmlItm[m].getElementsByTagName("mins")[0].childNodes[0].nodeValue,
                                                xmlItm[m].getElementsByTagName("from")[0].childNodes[0].nodeValue
                                                        .toLowerCase(),
                                                xmlItm[m].getElementsByTagName("to")[0].childNodes[0].nodeValue
                                                        .toLowerCase(), xmlItm)
                                        + "</span><span class='secondary-rupee-ui'>US$ "
                                        + calculateAmtUSD(
                                                xmlItm[m].getElementsByTagName("rupees")[0].childNodes[0].nodeValue,
                                                xmlItm[m].getElementsByTagName("mins")[0].childNodes[0].nodeValue,
                                                xmlItm[m].getElementsByTagName("from")[0].childNodes[0].nodeValue
                                                        .toLowerCase(),
                                                xmlItm[m].getElementsByTagName("to")[0].childNodes[0].nodeValue
                                                        .toLowerCase(), xmlItm) + "</span></div>";
                        } else {
                            if (strRes != null)
                                strRes += "<div class=\"inr\"><div class=\"div1 text-right\">"
                                        + "<span class='primary-rupee-ui'>US$ "
                                        + calculateAmt(
                                                xmlItm[m].getElementsByTagName("rupees")[0].childNodes[0].nodeValue,
                                                xmlItm[m].getElementsByTagName("mins")[0].childNodes[0].nodeValue,
                                                xmlItm[m].getElementsByTagName("from")[0].childNodes[0].nodeValue
                                                        .toLowerCase(),
                                                xmlItm[m].getElementsByTagName("to")[0].childNodes[0].nodeValue
                                                        .toLowerCase(), xmlItm) + "</span></div>";
                            else
                                strRes = "<div class=\"inr\"><div class=\"div1 text-right\">"
                                        + "<span class='primary-rupee-ui'>US$ "
                                        + calculateAmt(
                                                xmlItm[m].getElementsByTagName("rupees")[0].childNodes[0].nodeValue,
                                                xmlItm[m].getElementsByTagName("mins")[0].childNodes[0].nodeValue,
                                                xmlItm[m].getElementsByTagName("from")[0].childNodes[0].nodeValue
                                                        .toLowerCase(),
                                                xmlItm[m].getElementsByTagName("to")[0].childNodes[0].nodeValue
                                                        .toLowerCase(), xmlItm) + "</span></div>";
                        }
                        strRes += "</div>";
                    }

                }

            }

        }

        if (strRes != null)
            document.getElementById("resultDiv").innerHTML = strRes;
        else
            document.getElementById("resultDiv").innerHTML = "No results found for searched criteria.";
    } catch (error) {
        console.error("Error in taj-air-quotation.js ", error);
    }
}

function calculateAmt() {
    try {
        var amt = arguments[0];
        var hrs = arguments[1];
        var from = arguments[2];
        var to = arguments[3];
        var xmlIt = arguments[4];
        var valmins = parseInt(hrs) + parseInt(hrs)
        var calculatedAmt;
        // alert("hrs=" + hrs);
        // alert("valmin=" + valmins);
        // if(document.getElementById("oneRadio").checked)
        if (from == "mumbai [bom]") {
            if (valmins < 60)
                valmins = 60;
            // alert(valmins);
            // alert(parseInt(amt)/ 60);
            calculatedAmt = Math.floor(valmins * (parseInt(amt) / 60))
        } else if (to == "mumbai [bom]") {
            if (!document.getElementById("returnRadio").selected) {
                if (valmins < 60)
                    valmins = 60
                else
                    valmins = hrs
                calculatedAmt = Math.floor(valmins * ((parseInt(amt) * 2) / 60))
                // strResult = "INR " & clng((cdbl(valmins) * cdbl(objHdl.childNodes(3).text) * 2) / 60)

            } else {
                if ((parseInt(hrs) * 4) < 60)
                    valmins = 60;
                else
                    valmins = parseInt(hrs);
                calculatedAmt = Math.floor(valmins * ((parseInt(amt) * 4) / 60))

                // strResult = "INR " & clng((cdbl(valmins) * cdbl(objHdl.childNodes(3).text) * 4) / 60)
            }

        } else {
            var getminutes = null; // Get the traveling time between mumbai and selected city
            var getminutes1 = null;

            for (g = 0; g < xmlIt.length; g++) {
                if (xmlIt[g].getElementsByTagName("from")[0].childNodes[0].nodeValue.toLowerCase() == "mumbai [bom]"
                        && xmlIt[g].getElementsByTagName("to")[0].childNodes[0].nodeValue.toLowerCase() == from) {
                    getminutes = xmlIt[g].getElementsByTagName("mins")[0].childNodes[0].nodeValue
                    // alert('from mumbai [bom] to ' + from + "=" + getminutes);
                    break;
                }

            }

            for (g = 0; g < xmlIt.length; g++) {

                if (xmlIt[g].getElementsByTagName("from")[0].childNodes[0].nodeValue.toLowerCase() == "mumbai [bom]"
                        && xmlIt[g].getElementsByTagName("to")[0].childNodes[0].nodeValue.toLowerCase() == to) {
                    getminutes1 = xmlIt[g].getElementsByTagName("mins")[0].childNodes[0].nodeValue
                    // alert('from '+ to +' to mumbai [bom]=' + getminutes1);
                    break;
                }

            }

            if (!document.getElementById("returnRadio").selected) {

                valmins = parseInt(getminutes) + parseInt(hrs) + parseInt(getminutes1);
                // alert('onewayvalmin=' +valmins );
                if (valmins < 60)
                    valmins = 60;
                calculatedAmt = Math.floor((valmins * parseInt(amt)) / 60)
            } else {
                valmins = (parseInt(getminutes) + parseInt(hrs)) * 2;
                // alert("getminutes=" + getminutes);
                if (valmins < 60)
                    valmins = 60;
                else
                    valmins = parseInt(getminutes) + parseInt(hrs);
                // alert('returnvalmin=' +valmins );
                calculatedAmt = Math.floor(((valmins * parseInt(amt)) * 2) / 60)

            }

        }

        // alert("amt=" + amt);
        // alert("'"+calculatedAmt+".00'");
        var ammt = calculatedAmt.toString() + ".00";
        // alert(ammt);
        calculatedAmt = CommaFormatted(ammt);
        // alert("calamt=" + calculatedAmt);
        return calculatedAmt;
    } catch (error) {
        console.error("Error in taj-air-quotation.js ", error);
    }
}

function calculateAmtUSD() {
    try {
        var amt = arguments[0];
        var hrs = arguments[1];
        var from = arguments[2];
        var to = arguments[3];
        var xmlIt = arguments[4];
        var valmins = parseInt(hrs) + parseInt(hrs)
        var calculatedAmt;
        // alert("hrs=" + hrs);
        // alert("valmin=" + valmins);
        // if(document.getElementById("oneRadio").checked)
        if (from == "mumbai [bom]") {
            if (valmins < 60)
                valmins = 60;
            // alert(valmins);
            // alert(parseInt(amt)/ 60);
            calculatedAmt = Math.floor(valmins * (parseInt(amt) / 60))
        } else if (to == "mumbai [bom]") {
            if (!document.getElementById("returnRadio").selected) {
                if (valmins < 60)
                    valmins = 60
                else
                    valmins = hrs
                calculatedAmt = Math.floor(valmins * ((parseInt(amt) * 2) / 60))
                // strResult = "INR " & clng((cdbl(valmins) * cdbl(objHdl.childNodes(3).text) * 2) / 60)

            } else {
                if ((parseInt(hrs) * 4) < 60)
                    valmins = 60;
                else
                    valmins = parseInt(hrs);
                calculatedAmt = Math.floor(valmins * ((parseInt(amt) * 4) / 60))

                // strResult = "INR " & clng((cdbl(valmins) * cdbl(objHdl.childNodes(3).text) * 4) / 60)
            }

        } else {
            var getminutes = null; // Get the traveling time between mumbai and selected city
            var getminutes1 = null;

            for (g = 0; g < xmlIt.length; g++) {
                if (xmlIt[g].getElementsByTagName("from")[0].childNodes[0].nodeValue.toLowerCase() == "mumbai [bom]"
                        && xmlIt[g].getElementsByTagName("to")[0].childNodes[0].nodeValue.toLowerCase() == from) {
                    getminutes = xmlIt[g].getElementsByTagName("mins")[0].childNodes[0].nodeValue
                    // alert('from mumbai [bom] to ' + from + "=" + getminutes);
                    break;
                }

            }

            for (g = 0; g < xmlIt.length; g++) {

                if (xmlIt[g].getElementsByTagName("from")[0].childNodes[0].nodeValue.toLowerCase() == "mumbai [bom]"
                        && xmlIt[g].getElementsByTagName("to")[0].childNodes[0].nodeValue.toLowerCase() == to) {
                    getminutes1 = xmlIt[g].getElementsByTagName("mins")[0].childNodes[0].nodeValue
                    // alert('from '+ to +' to mumbai [bom]=' + getminutes1);
                    break;
                }

            }

            if (!document.getElementById("returnRadio").selected) {

                valmins = parseInt(getminutes) + parseInt(hrs) + parseInt(getminutes1);
                // alert('onewayvalmin=' +valmins );
                if (valmins < 60)
                    valmins = 60;
                calculatedAmt = Math.floor((valmins * parseInt(amt)) / 60)
            } else {
                valmins = (parseInt(getminutes) + parseInt(hrs)) * 2;
                // alert("getminutes=" + getminutes);
                if (valmins < 60)
                    valmins = 60;
                else
                    valmins = parseInt(getminutes) + parseInt(hrs);
                // alert('returnvalmin=' +valmins );
                calculatedAmt = Math.floor(((valmins * parseInt(amt)) * 2) / 60)

            }

        }
        // alert("amt=" + amt);
        // alert("'"+calculatedAmt+".00'");
        var ammt = calculatedAmt.toString() + ".00";
        // alert(ammt);
        // alert("calamt=" + (parseInt(calculatedAmt) / 54));
        // calculatedAmt = CommaFormatted(ammt);
        // calculatedAmt = Math.floor(parseInt(calculatedAmt) / 65);
        calculatedAmt = Math.floor(parseInt(calculatedAmt) / dollarRate);
        calculatedAmt = CommaFormatted(calculatedAmt.toString() + ".00");
        return calculatedAmt;
    } catch (error) {
        console.error("Error in taj-air-quotation.js ", error);
    }
}

function CommaFormatted(amount) {
    try {
        var delimiter = ","; // replace comma if desired
        var a = amount.split('.', 2)
        var d = a[1];
        var i = parseInt(a[0]);
        if (isNaN(i)) {
            return '';
        }
        var minus = '';
        if (i < 0) {
            minus = '-';
        }
        i = Math.abs(i);
        var n = new String(i);
        var a = [];
        while (n.length > 3) {
            var nn = n.substr(n.length - 3);
            a.unshift(nn);
            n = n.substr(0, n.length - 3);
        }
        if (n.length > 0) {
            a.unshift(n);
        }
        n = a.join(delimiter);
        if (d.length < 1) {
            amount = n;
        } else {
            amount = n;
        }
        amount = minus + amount;
        return amount;
    } catch (error) {
        console.error("Error in taj-air-quotation.js ", error);
    }
}

$(document).ready(function() {
    initCartPage();
});

