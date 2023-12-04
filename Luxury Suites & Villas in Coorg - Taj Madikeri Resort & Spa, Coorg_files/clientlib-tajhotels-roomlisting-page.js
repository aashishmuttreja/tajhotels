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


//var FP_ID_MISS_ERR = "Please enter your registered Email id or your Membership id";
var FP_ID_MISS_ERR = "Please enter your registered Email id or your Membership id";
var FP_ID_MISS_ERR_IHCLCB = "Please enter your registered Email id";
var FP_GEN_ERR = "There seems be an error fetching your details, please try again";
var RP_TOKEN_MISS_ERR = "Please enter the dynamic token sent to your registered id";
var RP_GEN_ERR = "There seems be an error resetting your password please try again";
$(document).ready(
    function () {
        var entityLogin = typeof(isIHCLCBSite) == 'undefined' ? false : isIHCLCBSite();
        var signinPopup = $('#signin-popup');
        var forgotPasswordContainer = $(signinPopup).find('.member-forgot-password');
        var forgotPasswordInputWrapper = $(forgotPasswordContainer).find('.forgot-password-input-wrapper');
        var forgotPasswordConfirmEmailWrapper = $(forgotPasswordContainer).find(
            '.forgot-password-confirm-email-wrapper');
        var forgotPasswordTokenInputWrapper = $(forgotPasswordContainer).find(
            '.forgot-password-token-input-wrapper');
        var forgotPasswordConfirmationWrapper = $(forgotPasswordContainer).find(
            '.forgot-password-confirmation-wrapper');
        var currentEmailId;

        $('body').on('taj:forgot-password', function () {
            $('body').trigger('taj:reset-fp-form');
            forgotPasswordContainer.show();
            forgotPasswordInputWrapper.show();
        });

        $('body').on('taj:reset-fp-form', function () {
            forgotPasswordInputWrapper.hide();
            forgotPasswordTokenInputWrapper.hide();
            forgotPasswordConfirmationWrapper.hide();
            forgotPasswordConfirmEmailWrapper.hide();
        });

        $("#fp-pre-confirm-submit").on('click', function () {
            var registeredId = $('#fp-pre-confirm-input').val();
            if(entityLogin) {
                if (validateEmailInput(registeredId)) {
                    $('.forgot-password-confirm-email').click();
                } else {
                    showForgotPasswordWarning(FP_ID_MISS_ERR_IHCLCB);
                }
            } else {
                if (validateForgotPasswordInput(registeredId)) {
                    requestForgotPasswordToken(registeredId);
                } else {                   
                    showForgotPasswordWarning(FP_ID_MISS_ERR);
                }
            }            
        });

        $(".forgot-password-confirm-email").on('click', function () {
            var registeredId = $('#fp-pre-confirm-input').val();
            sendDAC(registeredId);
        });

        $(".forgot-password-cancel-email").on('click', function () {
            $('.generic-signin-close-icon').trigger("click");
        });

        $(".forgot-password-back-email").on('click', function () {
            forgotPasswordConfirmEmailWrapper.hide();
            forgotPasswordInputWrapper.show();
        });

        $(".fp-back-token").on('click', function () {
            if(entityLogin) {
                forgotPasswordInputWrapper.show();
            } else {
                forgotPasswordConfirmEmailWrapper.show();                
            }
            forgotPasswordTokenInputWrapper.hide();

        });
        forgotPasswordContainer.find("input").keyup(function () {
            $(".forgot-password-message").hide();
        });

        $("#fp-token-submit").on('click', function () {
            var token = $('#fp-token').val();
            if (token) {
                requestPasswordReset(token);
            } else {
                showResetPasswordError(RP_TOKEN_MISS_ERR);
            }
        });

        $("#fp-confirm-done").on("click", function (e) {
            e.stopPropagation();
            $('body').trigger('taj:reset-fp-form');
            forgotPasswordContainer.hide();
            signinPopup.hide();
            window.location.reload();
        });

        function validateForgotPasswordInput(fpInput) {
            var flag = false;
            if (fpInput && typeof fpInput == 'string') {
                var regex = /^[a-zA-Z\d-]+$/;
                flag = regex.test(fpInput);
            }

            return flag;
        }

        function showConfirmWrapper(email) {
            currentEmailId = email;
            $('body').trigger('taj:reset-fp-form');
            forgotPasswordConfirmEmailWrapper.show();
            var re = /([^@]+)@([^@]+)$/;
            var emailDivide = email.match(re);
            if (emailDivide[1].length > 3) {
                forgotPasswordConfirmEmailWrapper.find(".forgot-password-confirm-email-input").text(
                    emailDivide[1].slice(0, 2) + '*******' + emailDivide[1].slice(-2) + '@' + emailDivide[2]);
            } else {
                forgotPasswordConfirmEmailWrapper.find(".forgot-password-confirm-email-input").text(
                    emailDivide[1].slice(0, 1) + '*******' + emailDivide[1].slice(-1) + '@' + emailDivide[2]);
            }
        }

        // TODO: remove useless
        function requestTokenError(message) {
            console.log(message);
            console.log("Error while requesting token for forgot password");
            if(entityLogin) {
                showForgotPasswordWarning(message.message);
            }
        }

        function sendDAC(loginId) {
            showLoader();
            var dataInput = {
                username: loginId
            };
            $.ajax({
                type: 'GET',
                cache: false,
                url: '/bin/send-activation-code',
                data: dataInput,
                contentType: "application/json"
            }).done(function (res) {
                if (res && res.status && res.status.toUpperCase() == "SUCCESS") {
                    requestTokenSuccess();
                } else {
                    requestTokenError(res);
                }
            }).fail(function (response) {
                requestTokenError();
            }).always(function () {
                hideLoader();
            });
        }

        function requestForgotPasswordToken(loginId) {
            var isFetchEmailCalled = false;
            showLoader();
            $.ajax({
                type: "GET",
                cache: false,
                url: "/bin/password/request-token?login=" + loginId,
                contentType: "application/json"
            }).done(function (res) {
                if (res && res.status === "SUCCESS") {
                    var responseValue = res.responseValue;
                    var email = responseValue.email;
                    showConfirmWrapper(email);
                } else if (res && res.status === "FAILURE") {
                    isFetchEmailCalled = true;
                    fetchEmailId(loginId);
//                    var error = res.errorText;
//                    showForgotPasswordWarning(error);
                }
            }).fail(function (response) {
                showForgotPasswordWarning();
            }).always(function () {
                if (!isFetchEmailCalled) {
                    hideLoader();
                }
            });
        }

        function requestPasswordReset(token) {
            var registeredId = $('#fp-pre-confirm-input').val();
            var passwordResetInput = {
                login: registeredId,
                token: token
            };
            showLoader();
            $.ajax({
                type: "POST",
                cache: false,
                url: "/bin/password/reset",
                data: JSON.stringify(passwordResetInput),
                contentType: "application/json"
            }).done(function (res) {
                if (res && res.status === "SUCCESS") {
                    passwordResetSuccess();
                } else if (res && res.status === "FAILURE") {
                    var error = res.errorText;
                    showResetPasswordError(error);
                }
            }).fail(function () {
                passwordResetError();
            }).always(function () {
                hideLoader();
            });
        }

        function passwordResetSuccess() {
            $('body').trigger('taj:reset-fp-form');
            forgotPasswordConfirmationWrapper.show();
        }

        function showResetPasswordError(message) {
            var error = message || RP_GEN_ERR;
            var forgotPasswordMessage = $('.fp-token-error');
            forgotPasswordMessage.html(error);
            forgotPasswordMessage.show();
        }

        function requestTokenSuccess() {
            $('body').trigger('taj:reset-fp-form');
            forgotPasswordTokenInputWrapper.show();
        }

        function showLoader() {
            $('body').showLoader();
        }

        function hideLoader() {
            $('body').hideLoader();
        }
    });

function showForgotPasswordWarning(message) {
    var error = message || FP_GEN_ERR;
    var forgotPasswordMessage = $('.forgot-password-message');
    forgotPasswordMessage.html(error);
    forgotPasswordMessage.show();
}

$(document).ready(function() {
    var activateaccountpopup = $('#activateonlinepopup');
    var activateaccountContainer = $(activateaccountpopup).find('.member-account-activate');
    var activateaccountInputWrapper = $(activateaccountContainer).find('.account-activate-input-wrapper');
    var signinPopup = $(".generic-signin-popup");
    var signupPopup = $(".member-signup-wrapper");

    $(activateaccountpopup).hide();
    $('body').on('taj:account-activate', function(e, username) {
        $('body').trigger('taj:otp-activate-init', [ username ]);
        $(activateaccountpopup).show();
        activateaccountContainer.show();
        activateaccountInputWrapper.show();
        signupPopup.hide();
    });

    $(activateaccountpopup).find('#resend-submit').on('click', function(e) {
        e.stopPropagation();
        sendDynamicAccessCode();
    });

    $(activateaccountpopup).find('#acc-submit').on('click', function(e) {
        e.stopPropagation();
        validateDynamicAccessCode();
    });

    $(activateaccountpopup).find('.change-close-icon').on('click', function(e) {
        e.stopPropagation();
        $(activateaccountpopup).hide();
    });
});

var offlineSignUpDetails = {};
var registeredEmailId;
var ID_FETCH_ERR = "There seems to be an error fetching your details, kindly try again later";
var signinPopup;
var forgotPasswordContainer;
var genericMemberSignin;
var activateofflineaccountpopup;
var resendSuccess;
var activateofflineaccountContainer;
var activateofflineaccountInputWrapper;
var activateUserConfirmDetailsPopup;
var signupPopup;
var emailFetcherDiv;
var emailConfWrp;
$(document).ready(function () {
    signinPopup = $("#signin-popup");
    forgotPasswordContainer = $(signinPopup).find('.member-forgot-password');
    genericMemberSignin = signinPopup.find('.generic-member-signin');
    activateofflineaccountpopup = $('#activateofflinepopup');
    resendSuccess = $('.account-offline-otp-wrapper').find('.resend-success-message');
    activateofflineaccountContainer = activateofflineaccountpopup.find('.member-activate-offline');
    activateofflineaccountInputWrapper = activateofflineaccountContainer.find('.account-offline-input-wrapper');
    activateUserConfirmDetailsPopup = $('.validate-details-input-wrapper');
    signupPopup = $(".member-signup-wrapper");
    emailFetcherDiv = $('.email-fetcher');
    emailConfWrp = $('.fetch-email-wrapper');
    $('body').on('taj:account-activate-offline', function () {
        activateofflineaccountpopup.show();
        activateofflineaccountContainer.show();
        activateofflineaccountInputWrapper.show();
        resendSuccess.hide();
        emailFetcherDiv.hide();
        signupPopup.hide();
    });
    $('body').on('taj:otp-activate-submit', function (e, componentId, otp) {
        if (componentId === "act-offline-otp" && otp) {   /*call reset password in background*/
            if(isIHCLCBSite()) {
                if(!registeredEmailId) {
                    registeredEmailId = $('#membershipNumber').val();
                }
            }
            var passwordResetInput = {
                login: registeredEmailId,
                token: otp
            };
            $.ajax({
                type: "POST",
                url: "/bin/password/reset",
                data: JSON.stringify(passwordResetInput),
                contentType: "application/json"
            }).done(function (res) {
                if (res && res.status === "FAILURE") {   /*reset failure*/
                }
            }).fail(function () {   /*reset failure*/
            })
        }
    });
    $('.sub-form-input-element#membershipNumber').keyup(function () {
        activateofflineaccountpopup.find('[data-form-id="account-offline-details-error"]').hide();
    });
    $('[data-form-id="validate-user-gender"]').on("change",
        function () {
            $(this).removeClass('invalid-input');
        });   /* method to remove invalid input from a field if state has changed*/
    $('.validate-profile-submit-btn').on('click',
        function (e) {   /* logic to reset inalid input class if input is provided*/
            if (validateProfileDetails()) {
                var profileForm = $('.profile-validate-form');
                offlineSignUpDetails.gender = profileForm.find('[data-form-id="validate-user-gender"]').val();
                createUser(autoInvokeActivateAccount);
            }
        });
    activateofflineaccountpopup.find('#tic-offline-membership-next').on('click',
        function (e) {
            if ($('.sub-form-input-element#membershipNumber').hasClass('invalid-input')) {
                $(this).focus();
            } else {
                var membershipId = $('#membershipNumber').val();
                if (membershipId.length) {
                    if (isIHCLCBSite()) {
                        if (validateEmailInput(membershipId)) {
                            $('body').trigger('taj:otp-activate-init', [ membershipId ]);
                            activateofflineaccountpopup.find('.tic-online-resend-otp').click();                        
                        } else {
                            console.log("========== Not an Email ============");
                        }
                    } else {
                        fetchEmailId(membershipId);
                    }
                }
            }
        });
    activateofflineaccountpopup.find('.change-close-icon').on('click',
        function (e) {
            e.stopPropagation();
            activateofflineaccountpopup.hide();
            signinPopup.hide();
        });
    activateofflineaccountpopup.find('#tic-offline-otp-next').on('click',
        function (e) {
            createUser();
        });
    var titleDropDown = $('.profile-validate-form').find('[data-form-id="validate-user-title"]');
    var genderDropDown = $('.profile-validate-form').find('[data-form-id="validate-user-gender"]');
    genderDropDown.prop('disabled',
        true);
    titleDropDown.selectBoxIt().change(function () {
        var titleVal = $(this).val();
        if (titleVal == 'Mr.') {
            genderDropDown.data("selectBox-selectBoxIt").remove().add({
                value: "M",
                text: "Male"
            });
        } else {
            genderDropDown.data("selectBox-selectBoxIt").remove().add({
                value: "F",
                text: "Female"
            });
        }
    });
});

function createUser(dataInput) {
    showLoader();
    $.ajax({
        type: 'POST',
        cache: false,
        url: '/bin/tic/create-syzygy-profile',
        data: dataInput,
        error: function (response) {
            activateofflineaccountpopup.find('[data-form-id="account-offline-details-error"]').show();
        },
        success: function (response) {
            var responseJsonString = response.responseJSON;
			if(responseJsonString) {
				responseJson = JSON.parse(responseJsonString)
				if (responseJson.status == "SUCCESS") {
					autoInvokeActivateAccount(responseJson.newAccount.membershipId);
				} else {
					var errors = responseJson.errorTokenList;
					var firstError = errors[0];
					console.log(firstError);
					warningBox({
						description: firstError.message
					});
				}
			}
        },
        complete: function () {
        }
    })
}

function fetchEmailId(membershipId) {
    var sendPasswordFlag = false;
    var dataInput = {
        membershipId: membershipId
    }
    $('#fp-pre-confirm-submit').attr("disabled", true);
    $('#fp-pre-confirm-submit').text("Please wait...");
    $('#fp-pre-confirm-submit').css({
        "opacity": 0.4
    });
    showLoader();
    $.ajax({
        type: 'GET',
        cache: false,
        url: '/bin/tic/get-member-email',
        data: dataInput,
        error: function (response) {
            activateofflineaccountpopup.find('[data-form-id="account-offline-details-error"]').show();
            hideLoader();
        },
        success: function (response) {
            activateofflineaccountpopup.find('[data-form-id="account-offline-details-error"]').hide();
            let responseData = response.data;
            if (responseData) {
                var emailAddress = responseData.emailAddress;
                verifySyzygyProfileExists(dataInput);
            } else {
                handleAccDetailsFailure(response.message);
                showForgotPasswordWarning(response.message);
            }
            hideLoader();
        },
        complete: function () {
        }
    });

    function verifySyzygyProfileExists(dataInput) {
        showLoader();
        $.ajax({
            type: 'GET',
            cache: false,
            url: '/bin/profile/validate-email',
            data: dataInput,
            error: function (response) {
                activateofflineaccountpopup.find('[data-form-id="account-offline-details-error"]').show();
                hideLoader();
            },
            success: function (response) {
                if (response.message == 'SUCCESS') {
                    var duplicateProfileError = "Email id is already registered with another account. Please contact Taj InnerCircle Member Services";
                    handleAccDetailsFailure(duplicateProfileError);
                    showForgotPasswordWarning(duplicateProfileError);
                } else {
                    createUser(dataInput);
                }
                hideLoader();
            },
            complete: function () {
            }
        });

    }
}

function validateDetails(dataInput) {

    if (offlineSignUpDetails.membershipId != null && offlineSignUpDetails.title != null
        && offlineSignUpDetails.firstName != null && offlineSignUpDetails.lastName != null
        && offlineSignUpDetails.email != null && offlineSignUpDetails.loginId != null
        && offlineSignUpDetails.password != null && offlineSignUpDetails.countryCode != null
        && offlineSignUpDetails.mobile != null && offlineSignUpDetails.gender != null
        && !offlineSignUpDetails.mobile.includes('+')
        && ((offlineSignUpDetails.gender.localeCompare('F') == 0 || offlineSignUpDetails.gender.localeCompare('M') == 0)
            && offlineSignUpDetails.gender.length == 1)) {
        return true;
    } else {
        if (offlineSignUpDetails.mobile.includes('+')) {
            offlineSignUpDetails.mobile = offlineSignUpDetails.mobile.replace('+', '');
            return true;
        }
    }
    return false;

}

function showValidateDetailsForm() {
    autoFillProfileValidateForm();
    $(forgotPasswordContainer).hide();
    activateUserConfirmDetailsPopup.removeClass('d-none');
    hideLoader();
}

function autoFillProfileValidateForm() {   /* logic to auto populate form and disable the req fields*/
    injectValueToDropDownInput('validate-user-title',
        offlineSignUpDetails.title);
    injectValueToTextTypeInput('validate-user-firstname',
        offlineSignUpDetails.firstName);
    injectValueToTextTypeInput('validate-user-lastname',
        offlineSignUpDetails.lastName);
    injectValueToDropDownInput('validate-user-gender',
        offlineSignUpDetails.gender);
    injectValueToTextTypeInput('validate-user-email',
        offlineSignUpDetails.email);
    injectValueToTextTypeInput('validate-user-mobile',
        offlineSignUpDetails.mobile);
}

function validateProfileDetails() {
    var flag = true;
    $('.profile-validate-form').find('input.sub-form-mandatory,select.sub-form-mandatory').each(function () {
        if ($(this).val() == "" || $(this).hasClass('invalid-input')) {
            $(this).addClass('invalid-input');
            flag = false;
            invalidWarningMessage($(this));
        }
    });
    return flag;
}

function handleEmailSuccess(email) {
    $('.account-offline-input-wrapper').hide();
    var re = /([^@]+)@([^@]+)$/;
    var emailDivide = email.match(re);
    var maskedEmail;
    if (emailDivide[1].length > 3) {
        maskedEmail = emailDivide[1].slice(0,
            2) + '*******' + emailDivide[1].slice(-2) + '@' + emailDivide[2];
    } else {
        maskedEmail = emailDivide[1].slice(0,
            1) + '*******' + emailDivide[1].slice(-1) + '@' + emailDivide[2];
    }
    $('.fetch-emailid').text(maskedEmail);
    $('.fetch-email-wrapper').show();
    $(".account-offline-input-wrapper #membershipNumber").val("");
}

function handleAccDetailsFailure(message) {
    if (message) {
        activateofflineaccountpopup.find('[data-form-id="account-offline-details-error"]').text(message);
    }
    activateofflineaccountpopup.find('[data-form-id="account-offline-details-error"]').show();
}

function autoInvokeActivateAccount(membershipId) {
    $(forgotPasswordContainer).hide();
    $(activateofflineaccountContainer).hide();
    invokeActivateAccount(membershipId);
}

function invokeActivateAccount(username) {
    genericMemberSignin.hide();
    activateUserConfirmDetailsPopup.addClass('d-none');
    $('body').trigger('taj:account-activate',
        [username]);
}

function injectValueToTextTypeInput(selector,
                                    value) {
    if (value != null && value != "") {
        $('[data-form-id="' + selector + '"]').val(value);
    }
}

function injectValueToDropDownInput(selector,
                                    value) {
    if (value != null && value != "") {
        var $selectBox = $('[data-form-id="' + selector + '"]');
        var $selectBoxRef = $selectBox.data("selectBoxIt");
        if ($selectBoxRef) {
            $selectBoxRef.selectOption(value);
        } else {
            $selectBox.find('option').removeAttr('selected');
            var selectedText = $selectBox.find('option[value="' + value + '"]').attr('selected',
                'selected').text();
            $selectBox.find('.selectboxit-text').text(selectedText);
        }
    }
}

function showLoader() {
    $('body').showLoader();
}

function hideLoader() {
    $('body').hideLoader();
}

$(document).ready(
        function() {  
			// for open signin popup on unauthorized logout
            checkForSigninParameter();
            var GEN_SIGNIN_ERR = "There seems to be an error during your login. Please try again.";

            var signinPopup = $('#signin-popup');
            var genericSigninContentHolder = signinPopup.find('.generic-signin-content-holder');
            var genericMemberSignin = signinPopup.find('.generic-member-signin');
            var memberSignupWrapper = signinPopup.find('.member-signup-wrapper');
            var socialSignupWrapper = signinPopup.find('.social-signup-wrapper');
            var memberSignupConfirmationWrapper = signinPopup.find('.member-signup-confirmation-wrapper');
            var errorOverlay = signinPopup.find('.generic-signin-error-wrapper');
            var globalSignUpEmail;
            var preventPageScrollInitial;
            var incorrectLoginCount = 0;
            var verifyUserName;
            var verifyPassword;
            var generalSignInPassword;
            var maxFailAttempts;
            var recaptchaDom = $('#recaptcha');
            if (recaptchaDom) {
                var dataAttr = recaptchaDom.attr("data-noOfAttempts");
                if (dataAttr) {
                    maxFailAttempts = parseInt(dataAttr);
                }
            }
            maxFailAttempts = isNaN(maxFailAttempts) ? 3 : maxFailAttempts;
            var forgotPasswordLinkWrp = signinPopup.find('.forgot-pass-wrp');
            var entityLogin = $('#corporate-booking-login').attr('data-corporate-isCorporateLogin') == "true";            

            $('.generic-input-wrp input').blur(validateLogin);
            /*tdl sso changes start */
           $('body').on('taj:sign-in', function() {
			     console.log("inside sign in function");
			   var currentUrl = window.location.href; 
               var encodedUri = encodeURIComponent(currentUrl);
              // console.log("Encoded uri ",encodedUri);
			   var clientID = document.querySelector("meta[name='tdl-sso-client_id']").getAttribute("content");
			//   console.log("cureenturl: "+currentUrl+ "clientId "+clientID)
			if(!userLoggedIn()){
                trigger_signin('TIC_FormLogin_SignIn_HomePage_Login', {});
                var signInLink = $('#sign-in-btn a').attr('data-component-id');	
				if(signInLink != undefined || signInLink != null){
				$('#sign-in-btn > .nav-link').attr('href',signInLink+'?clientId='+clientID+'&redirectURL='+encodedUri); 
				}
				else{
					$('#sign-in-btn > .nav-link').attr('href', 'https://members.tajhotels.com/v2/?clientId='+clientID+'&redirectURL='+encodedUri); 
				}
				/*if(window.location.href.indexOf("rooms-and-suites") != -1){*/
					var popupParams = {
						title: 'Login to avail this offer. Not a member yet? <a class="signupanchor" style="text-decoration: underline;color: var(--primaryColor);">Sign Up</a> now',
						description: '',
					    callBack : redirectToSignIn,
						callBackSecondary : reloadRoomPage,
					    needsCta : true,
					}
                        successBox( popupParams );
					if($('.successBoxRemoveRef') && $('.successBoxRemoveRef').length > 0) {
						$($($('.successBoxRemoveRef')[$('.successBoxRemoveRef').length - 1]).find('.warning-proceed-btn span')[0]).html('Login');
						$($($('.successBoxRemoveRef')[$('.successBoxRemoveRef').length - 1]).find('.cm-warning-box-logo-con')[0])
						.html('<img src="/content/dam/tic/tataneu/logo/220216-NEUPASS-Identity-RGB-Positive.jpg" width="120" style="margn-bottom: 10px;">');		
						$($($('.successBoxRemoveRef')[$('.successBoxRemoveRef').length - 1]).find('.cm-success-box-heading-text')[0]).css('font-size', '18px');
						$($($('.successBoxRemoveRef')[$('.successBoxRemoveRef').length - 1]).find('.signupanchor')[0]).attr("href", $('#sign-in-btn > .nav-link').attr('href').replace('login', ''));
					}
					function redirectToSignIn(){
						window.location.href = $('#sign-in-btn > .nav-link').attr('href');
					}					
					function reloadRoomPage(){
						//window.location.reload();
						$('.checkout-anchor').attr("href","/en-in/booking-cart/");
					}
				/*}
				else{
				window.location.href = $('#sign-in-btn > .nav-link').attr('href');
				}*/
                $('.checkout-anchor').attr("href",$('#sign-in-btn > .nav-link').attr('href'));
			}
			else{
				 document.location.reload();
			}
			   
		   });

            /*--tdl sso changes end */

            $('body').on('taj:reset-password', function() {
                resetSiginPopupToDefaultState();
            });

            $('body').on('taj:perform-login', function(e, username, password) {
                performLogin(username, password);
            });

            $('body').on('taj:invoke-fb-login', function() {
                performFbLogin();
            });

            $('body').on('taj:signup-flow', function() {
                showSignupForm();
                signinPopup.show();
            });

            $('body').on('taj:external-forgot-password', function() {
                signinPopup.show();
                genericMemberSignin.hide();
                $('body').trigger('taj:forgot-password');
            });
            $('body').on('taj:tier', function() {
                queryMemberUsingNumber();
            });

            function queryMemberUsingNumber() {

                var userData = getUserData();
                var formData=new FormData();
                formData.append("membershipId", userData.membershipId);
                $.ajax({
                    type : 'POST',
                    contentType: false,
                    processData: false,
                    cache : false,
                    url : '/bin/tic/member-tier',
                    data: formData
                    
                }).done(function(res) {
                    if (res.ErrorMsg) {
                        // unable to get Tier
                        console.log("not able to get the tier ::" + res.ErrorMsg)
                    } else {
                        fetchMemberTier(res);

                    }
                }).fail(function() {
                    $('body').trigger('taj:loginFailed', [ GEN_SIGNIN_ERR ]);
                })

            }
            function fetchMemberTier(res) {
                var userDetails = dataCache.local.getData("userDetails");
            	userDetails.tier = res.data.tier;
                if(userDetails && userDetails.card &&userDetails.card.tier)
                	{
            			console.log('tier', userDetails.card.tier);
            			userDetails.tier = userDetails.card.tier;
                	}
            	dataCache.local.setData("userDetails", userDetails);
            }
            signinPopup.find('.generic-member-signin-container, .generic-signin-close-icon, .generic-signin-done-btn, .fp-pre-confirm-cancel')
                    .click(function(e) {
                        e.stopPropagation();
                        signinPopup.hide();
                        resetSiginPopupToDefaultState();
                        if (!preventPageScrollInitial) {
                            $(".cm-page-container").removeClass('prevent-page-scroll');
                            $('.the-page-carousel').css('-webkit-overflow-scrolling', 'touch');
                        }
                        // added for ihclcb
                        if(entityLogin) {
                            signinPopup.addClass('ihclcb-remove-overlay').show();
                            genericMemberSignin.show();
                        }                        
                    });

            genericSigninContentHolder.on('click', function(e) {
                e.stopPropagation();
            });

            signinPopup.find('.forgot-password-button').on('click', function(e) {
                e.stopPropagation();  
                if(!entityLogin) {
                    genericMemberSignin.hide();
                } else {
                    $('body').trigger('taj:sign-in');
                }
                $('body').trigger('taj:forgot-password');

                // added by sarath
                signinPopup.removeClass('ihclcb-remove-overlay');
            });

            signinPopup.find('[data-component-id="create-account"]').on('click', function(e) {
                e.stopPropagation();
                showSignupForm();
            });

            $('body').on(
                    'taj:fetch-profile-details',
                    function(event, loginButtonClicked) {
                        var userData = getUserData();
                        if (userData && userData.membershipId) {
                            var membershipId = userData.membershipId;
                            var authToken = userData.authToken;
                            var fetchDataRequestJson = {
                                "membershipId" : membershipId,
                                "authToken" : authToken
                            };
                            var profileDetailsDeferred = fetchLoyaltyMemberProfileDetails(fetchDataRequestJson,
                                    loginButtonClicked);
                            var pointsDeferred = fetchMemberPoints(membershipId);
                            $.when(profileDetailsDeferred, pointsDeferred).done(function() {
                                $('body').trigger('taj:login-fetch-complete');
                            });
                        }
                    });

            var validateLogin = function() {
                $(".login-error").hide();
                $(".login-error span").text("");
                var flag = true;
                $('.generic-input-wrp input').each(function() {
                    if ($(this).val().trim() == "") {
                        $(this).addClass('invalid-input');
                        var text = $(this).attr("placeholder");
                        flag ? text : text = $(".login-error span").text() + " and " + text;
                        $(".login-error span").text(text);
                        $(".login-error").show();
                        flag = false;
                    }
                });
                return flag;
            }

            function showSignupForm() {
                genericMemberSignin.hide();
                memberSignupWrapper.show();
            }

            function resetSiginPopupToDefaultState() {
                genericMemberSignin.show();
                memberSignupWrapper.hide();
                memberSignupConfirmationWrapper.hide();
                genericSigninContentHolder.removeClass('signup-confirmation-content-holder');
                socialSignupWrapper.hide();
                $('body').trigger('taj:reset-fp-form');

                // added by aravind

                $(signinPopup).find(".account-offline-otp-wrapper").hide();
                $(signinPopup).find(".fetch-email-wrapper").hide();
                $(signinPopup).find(".member-activate-offline").hide();
                $(signinPopup).find(".generic-signin-error-wrapper").hide();
                $(signinPopup).find(".user-creation").hide();
                $(signinPopup).find(".member-signup-confirmation-wrapper").hide();
                $(signinPopup).find(".member-signup-wrapper").hide();
                $(signinPopup).find(".member-forgot-password").hide();
                $(signinPopup).find('.resend-success-message').hide();
                $(signinPopup).find(".member-activate-online").hide();
                $(signinPopup).find('.validate-details-input-wrapper').addClass('d-none');
                $(signinPopup).find(".account-offline-input-wrapper").show();
                // reset forgot password popup to initial state
                $('#fp-pre-confirm-submit').attr("disabled", false);
                $('#fp-pre-confirm-submit').text("Submit");
                $('#fp-pre-confirm-submit').css({
                    "opacity" : 1
                });
            }

            // - Google login -
            /*
             * loadGapi(attachSignin);
             * 
             * function attachSignin() { var element = document.getElementById('google-login');
             * auth2.attachClickHandler(element, {}, function(googleUser) { var userProfile =
             * googleUser.getBasicProfile(); // transform user data to common structure var userData =
             * mapUserData(userProfile.getEmail(), userProfile.getGivenName(), userProfile .getFamilyName(), null, null,
             * null, userProfile.getId()); socialLoginGoogle(userData); }, function(error) {
             * console.error(JSON.stringify(error, undefined, 2)); }); }
             */

            function socialLoginGoogle(userProfile) {
                showLoader();
                $.ajax({
                    type : "POST",
                    cache : false,
                    url : "/bin/social-signin?googleId=" + userProfile.googleId,
                    contentType : "application/json"
                }).done(function(res) {
                    if (res.errorCode === "INVALID_LOGIN" && res.status === "404") {
                        // user does not exist, create user
                        showSocialSignupForm(userProfile);
                    } else {
                        loginRespHandler(res, userProfile.loginId);
                    }
                }).fail(function() {
                    $('body').trigger('taj:loginFailed', [ GEN_SIGNIN_ERR ]);
                }).always(function() {
                    hideLoader();
                });
            }
            // - Google login -

            // - Facebook login -
            $('#facebook-login').on(
                    'click',
                    function(e) {
                        e.stopPropagation();
                        performFbLogin(function(response) {
                            var userData = mapUserData(response.email, response.first_name, response.last_name, null,
                                    null, response.id, null);
                            socialLoginFb(userData);
                        });
                    });

            // unotech fb login
            function socialLoginFb(userProfile) {
                showLoader();
                $.ajax({
                    type : "POST",
                    url : "/bin/social-signin?facebookId=" + userProfile.facebookId,
                    contentType : "application/json"
                }).done(function(res) {
                    if (res.errorCode === "INVALID_LOGIN" && res.status === "404") {
                        // user does not exist, create user
                        showSocialSignupForm(userProfile);
                    } else {
                        loginRespHandler(res, userProfile.loginId);
                    }
                }).fail(function() {
                    $('body').trigger('taj:loginFailed', [ GEN_SIGNIN_ERR ]);
                }).always(function() {
                    hideLoader();
                });
            }
            // - Facebook login -

            function mapUserData(email, firstName, lastName, mobile, gender, facebookId, googleId) {
                return {
                    firstName : firstName,
                    middleName : "",
                    lastName : lastName,
                    email : email,
                    countryCode : "91",
                    mobile : mobile,
                    gender : gender,
                    loginId : email,
                    facebookId : facebookId,
                    googleId : googleId
                };
            }

            function showSocialSignupForm(userData) {
                // show signup fields
                genericMemberSignin.hide();
                socialSignupWrapper.show();
                $('body').trigger('taj:social-signup', [ userData ]);
            }

            function loginSuccessHandler(accessToken, userInfo) {
              //  saveUserDetails(accessToken, userDetails);
			  console.log("inside login successfull method");
                var name = userInfo.firstName;
				console.log("username "+name);
               /* $('.generic-signin-close-icon').trigger("click");
                resetSiginPopupToDefaultState();*/
                $('body').trigger('taj:loginSuccess', [ name ]);

             /*   if (id) {
                    $('body').trigger('taj:fetch-profile-details', [ true ]);
                } else {
                    $('body').trigger('taj:login-fetch-complete');
                } */
                if(!entityLogin) { // added by sarath
                    $('body').trigger('taj:tier');
                } else {
                    // fetchEntityDetails();
                    redirectUser();
                }
            }

            signinPopup.find("[data-form-id='login-btn']").click(function(e) {
                e.stopPropagation();
                if (validateLogin()) {
                    if (incorrectLoginCount >= maxFailAttempts) {
                        console.log("Incorrect Login Attempt No Exceeded : Invisible Google reCAPTCHA Enabled ");
                        grecaptcha.execute();
                    } else {
                        getTdlSsoToken();
                        initiateLogin();
                    }
                } else {
                    $('.generic-input-wrp input.invalid-input').eq(0).focus();
                }
                e.preventDefault(); // avoid to execute the actual submit of the form.
            }); 

            window.onSuccessCallBackRecaptcha = function() {
                console.log("Invisible reCAPTCHA Passed");
                grecaptcha.reset();
                initiateLogin();
            }

            function initiateLogin() {
                var username = signinPopup.find('[data-form-id="login-id"]').val();
                var password = signinPopup.find('[data-form-id="login-pass"]').val();
                generalSignInPassword = password;
                performLogin(username, password);
            }

            function performLogin(username, password) {
                showLoader();
                if(entityLogin) {
                    forgotPasswordLinkWrp.hide() 
                }
                    console.log('perform login::');
				// add data to datalayer
                trigger_signin('TIC_FormLogin_SignIn_HomePage_Login', {username: username});

                    globalSignUpEmail = username;                
                    var loginDetails = {
                        username : username,
                        password : password
                    };
                    $.ajax({
                        type : "POST",
                        url : "/bin/signin",
                        data : JSON.stringify(loginDetails),
                        contentType : "application/json"
                    }).done(function(res) {
                        console.log('login success:  ', res);
                        if(entityLogin) {
                           $('.ihclcb-login-error').hide();
                        }
                        loginRespHandler(res, username);
                    }).fail(function(res) {
                        console.log('login error:  ', res);
                        if(res.status === 401){
							forceLogoutAfterUnauthorized();
                        }
                        else if (entityLogin) {
                            $('.ihclcb-login-error').text('Something went wrong!').show();
                        } 
                        else {
                            $('body').trigger('taj:loginFailed', [ GEN_SIGNIN_ERR ]);
                        }
                    }).always(function() {
                        console.log('always');
                        hideLoader();
                        if(entityLogin) {
                            forgotPasswordLinkWrp.show();
                        }
                });
            }

            function loginRespHandler(res, username) {
                if (res.authToken) {
                    var userDetails = res.userDetails;
                    var authToken = res.authToken;
                    incorrectLoginCount = 0;
                    loginSuccessHandler(authToken, userDetails);
                } else if (res.errorCode === "INVALID_USER_STATUS" && res.status === "504") {
                    // user activation flow
                    if(entityLogin) {
                        $('.ihclcb-login-error').text(res.error).show();
                        invokeActivateAccountIHCLCB();
                    } else {
                        invokeActivateAccount(username);
                    }
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
                    } else {
                        var error = res.error || GEN_SIGNIN_ERR;
                        $('body').trigger('taj:loginFailed', [ error ]);                        
                    }
                    verifyIncorrectAttempts(username);
                }
            }
            function verifyIncorrectAttempts(username) {
                if (!verifyPassword) {
                    verifyPassword = generalSignInPassword;
                }
                if (!verifyUserName) {
                    verifyUserName = username;
                }
                if (verifyUserName !== username) {
                    verifyUserName = username;
                    incorrectLoginCount = 0;
                    if (verifyPassword !== generalSignInPassword) {
                        verifyPassword = generalSignInPassword;
                        incorrectLoginCount++;
                    } else {
                        incorrectLoginCount++;
                    }
                } else {
                    if (verifyPassword !== generalSignInPassword) {
                        verifyPassword = generalSignInPassword;
                        incorrectLoginCount++;
                    } else {
                        incorrectLoginCount++;
                    }
                }
                console.log("Incorrect Login Attempt No ", incorrectLoginCount);
            }

            // this will store all user details to session
            function saveUserDetails(authToken, userDetails) {
                var user = {
                    authToken : authToken,
                    name : userDetails.name,
                    firstName : userDetails.firstName,
                    lastName : userDetails.lastName,
                    gender : userDetails.gender,
                    email : userDetails.email,
                    mobile : userDetails.mobile,
                    cdmReferenceId : userDetails.cdmReferenceId,
                    membershipId : userDetails.membershipId,
                    googleLinked : userDetails.googleLinked,
                    facebookLinked : userDetails.facebookLinked,
                    title : userDetails.title
                };
                if(entityLogin) {
                    user.partyId = userDetails.cdmReferenceId
                }
                dataCache.local.setData("userDetails", user);
                ssoDetailsForDomains(entityLogin, authToken);
            }

            function saveMemberPointInfo(epicurePoints, ticPoints) {
                var userData = getUserData();
                userData.epicurePoints = epicurePoints;
                userData.ticPoints = ticPoints;
                dataCache.local.setData("userDetails", userData);
            }

            function showSignUpConfirmation(accountDetails) {
                memberSignupConfirmationWrapper.find(".first-name").text(accountDetails.firstName);
                memberSignupConfirmationWrapper.find(".last-name").text(accountDetails.lastName);
                memberSignupConfirmationWrapper.find(".TIC-ID-value").text(accountDetails.email);
                memberSignupConfirmationWrapper.show();
                genericSigninContentHolder.addClass('signup-confirmation-content-holder');
            }

            function showLoader() {
                $('.generic-login-btn').hide();
                $('.generic-login-loader').show();
            }

            function hideLoader() {
                $('.generic-login-loader').hide();
                $('.generic-login-btn').show();
            }

            $('body').on('taj:loginFailed', function(event, error, errorButtonText, errorButtonHandler) {
                signinErrorHandler(error, errorButtonText, errorButtonHandler);
            });

            function signinErrorHandler(error, buttonText, buttonHandler) {
                if (signinPopup.is(':visible')) {
                    $(errorOverlay).find(".error-message").text(error);
                    if (buttonText) {
                        $(errorOverlay).find(".error-cta").text(buttonText);
                    }
                    $(errorOverlay).find('.error-cta').on('click', function() {
                        if (buttonHandler) {
                            buttonHandler();
                        }
                        removeError();
                    });
                    $(errorOverlay).show();
                }
            }

            function removeError() {
                $(errorOverlay).hide();
            }

            function saveMemberPointInfo(epicurePoints, ticPoints, tapPoints, tappmePoints) {
                var userData = getUserData();
                userData.epicurePoints = epicurePoints;
                userData.ticPoints = ticPoints;
                userData.tapPoints = tapPoints;
                userData.tappmePoints = tappmePoints;
                setUserData(userData);
                $('body').trigger('taj:pointsUpdated');
            }

            function fetchLoyaltyMemberProfileDetails(fetchDataRequestJson, loginButtonClicked) {
                return $.ajax({
                    type : 'POST',
                    cache : false,
                    url : '/bin/tic/account-details',
                    data : fetchDataRequestJson,
                    error : function(response) {
                        console.error(response);
                        if(response.status === 401){
							forceLogoutAfterUnauthorized();
                        }
                    },
                    success : function(response) {
                        if (response.data) {
                            var memberData = response.data;
                            var userData = getUserData();
                            userData.emailAddresses = memberData.emailAddresses;
                            userData.alternatePhoneNumbers = memberData.alternatePhoneNumbers;
                            userData.addresses = memberData.addresses;
                            userData.card = getCurrentCardDetails(memberData.loyaltyCards);
                            userData.dob = memberData.dob;
                            /*
                             * if (userData.card) { userData.tier = userData.card.tier; }
                             */
                            userData.cards = memberData.loyaltyCards;
                            userData.contactId = memberData.contactId;
                            setUserData(userData);
                            // [TIC-DATA-LAYER]
                            if (loginButtonClicked) {
                                prepareLoginJsonAfterSumbitClick('TICLogin', userData);
                            }
                            // Do Not Change
                            $('body').trigger('taj:profile-fetch-success');
                        }
                    }
                });
            }

            function getCurrentCardDetails(cardList) {
                var sortedCardList = cardList.sort(function(a, b) {
                    var startDateA = moment(a.startDate, "MM/DD/YYYY HH:mm:ss");
                    var startDateB = moment(b.startDate, "MM/DD/YYYY HH:mm:ss");
                    if (startDateA.isBefore(startDateB)) {
                        return 1;
                    }
                    if (startDateA.isAfter(startDateB)) {
                        return -1;
                    }
                    return 0;
                });
                return sortedCardList[0];
            }

            function invokeActivateAccount(username) {
                genericMemberSignin.hide();
                $('body').trigger('taj:account-activate', [ username ]);
            }
            
            function invokeActivateAccountIHCLCB(username) {
                openActivatePopupIHCLCB();
                openOTPInputScreenIHCLCB();
            }

            signinPopup.find('.activate-offline-account').on('click', function(e) {
                e.stopPropagation();
                genericMemberSignin.hide();
                $('body').trigger('taj:account-activate-offline');
            });

//          IHCLCB Activate Account
            signinPopup.find('.ihclcb-activate-account').on('click', function(e) {
                e.stopPropagation();
                openActivatePopupIHCLCB();                
            });
//          IHCLCB Activate Account ends
            
            function openActivatePopupIHCLCB() {
                signinPopup.removeClass('ihclcb-remove-overlay');
                $('body').trigger('taj:account-activate-offline');
            }

            // Used in migrated user flow
            function invokeForgotPassword() {
                $('body').trigger('taj:external-forgot-password');
            }

            $('body').trigger('taj:fetch-profile-details');
            

            function redirectUser() {
                // [IHCL_CB] this can be changed to better code.
                window.location.href = $("[data-form-id='login-btn']").attr("data-login-success-url");
            }
        });

function validateEmailInput(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test( email );
}

function openOTPInputScreenIHCLCB() {
    $('#activateofflinepopup .account-offline-otp-wrapper').show();
    $('#activateofflinepopup .account-offline-input-wrapper').hide();
}


function checkForSigninParameter(){
    var queryString = window.location.search;
    //var urlParams = new URLSearchParams(queryString);
    if(window.location.search.indexOf('popup') > -1){
    	console.log(queryString);
        refinedUrl = window.location.href.slice(0, window.location.href.indexOf("?popup"));
		signinPopup.show();
        window.history.replaceState({}, document.title, refinedUrl);
    }
}


function ssoDetailsForDomains(entityLogin, authToken) {
    if (!entityLogin) {
        if (authToken) {
            if($.cookie) {
                $.cookie($(".single-sign-on-sevlet-param-name").text() || 'ihcl-sso-token', authToken,
                         {
                            expires : $("single-sign-on-cookie-expires").text() || 7,
                            path : '/',
                            domain : location.hostname
                    });
            } else {
                var expiresIn = $("single-sign-on-cookie-expires").text() || 7
				setIhclToken('ihcl-sso-token', authToken, expiresIn, location.hostname);
            }
    	}
        var imgTagForCookieCalls = $('#single-sign-on');
        $(".sso-urls-to-set-cookie").each( 
            function() {
                var indTagForCookieCall = '<img src="'
                + $(this).text()
                + $('.single-sign-on-sevlet-uri').text()
                + '?'
                + $(".single-sign-on-sevlet-param-name").text()
                + '='
                + encodeURIComponent(authToken)
                + '" style="display: none !important; width: 1px !important; height: 1px !important; opacity: 0 !important; pointer-events: none !important;"></img>';
                imgTagForCookieCalls.append(indTagForCookieCall);
            });
        $('#single-sign-on').html(imgTagForCookieCalls);
        //console.log('single-sign-on: saveUserDetails() and entityLogin: ' + !entityLogin);
	}
}


function setIhclToken(cname, cvalue, exdays, domain) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/" + ";domain=" + domain;
}

function registerOtpComp(componentId) {
    $(document).ready(function() {
        var GEN_OTP_ERR = "An error occurred while validating OTP, please check the OTP and try again";
        var OTP_SIZE_ERR = "Please enter valid OTP";
        var component = $('#' + componentId);
        var successSection = $('[data-component-id="' + componentId + '-otp-success"]');
        var currentUsername;
        $('body').on('taj:otp-activate-init', function(e, username) {
            currentUsername = username;
            $(component).find('[data-form-id="online-otp-input"]').val("");
            $(successSection).hide();
        });
        $(component).find('[data-form-id="signup-otp-next"]').on('click', function(e) {
            e.stopPropagation();
            var otpInput = $(component).find('[data-form-id="online-otp-input"]');
            handleOtpInput(otpInput, currentUsername);
        });

        $(component).find('.tic-online-resend-otp').on('click', function(e) {
            e.stopPropagation();
            handleResendOtp(currentUsername);
        });

        function handleOtpInput(inputEl, email) {
            var otp = $(inputEl).val();

            if (otp.length > 3) {
                $(inputEl).removeClass('invalid-input');
                $(inputEl).siblings('.sub-form-input-warning').html('').hide();
                $('body').showLoader();
                $('body').trigger('taj:otp-activate-submit', [ componentId, otp ]);
                validateOtp(otp, email).done(function(res) {
                    if (res.status === "success") {
                        otpValidateSuccess();
                    } else {
                        warningBox({
                            description : GEN_OTP_ERR
                        });
                    }
                }).fail(function() {
                    warningBox({
                        description : GEN_OTP_ERR
                    });
                }).always(function() {
                    $('body').hideLoader();
                });
            } else {
                $(inputEl).addClass('invalid-input');
                $(inputEl).siblings('.sub-form-input-warning').html(OTP_SIZE_ERR).show();
            }
        }

        function handleResendOtp(email) {
            $('body').showLoader();
            sendOtp(email).done(function(res) {
                if (isIHCLCBSite()) {
                    validateResponseForSendingOtp(res);
                } else {
                    $(component).find('.account-online-otp-wrapper .resend-fail-message').hide();
                    $(component).find('.account-online-otp-wrapper .resend-success-message').show();
                }
            }).fail(function() {
                if (isIHCLCBSite()) {
                    $('[data-form-id="account-offline-details-error"]').text("There seems to be an error fetching your details, kindly try again later").show();
                } else {
                    $(component).find('.account-online-otp-wrapper .resend-success-message').hide();
                    $(component).find('.account-online-otp-wrapper .resend-fail-message').show();
                }
            }).always(function() {
                $('body').hideLoader();
            });
        }
        
        function validateResponseForSendingOtp(res) {
            if(res && res.status.toLowerCase() == "success") {
                openOTPInputScreenIHCLCB(); 
                $('[data-form-id="account-offline-details-error"]').text('').hide();
            } else {
                $('[data-form-id="account-offline-details-error"]').text(res.message).show();
            }
        }

        function otpValidateSuccess() {
            $(component).hide();
            $('.account-activate-heading').hide();
            $(successSection).find('[data-form-id="validate-otp-done"]').on("click", function() {
                window.location.reload();
            });
            $(successSection).show();
            $('body').trigger('taj:otp-activate-success', [ componentId ]);
        }
    });
}

/*
by Srikanta@moonraft  
open weather api to fetch weather-forcastv1.0.0

 */

$(document).ready(function() {
    setCurrentDateInBanner();
});
(function() {
    var apiKey = $('.banner-container').data('apikey');
    var lat = $('#hotel-banner-temperature').data('lat');
    var lon = $('#hotel-banner-temperature').data('lon');
    var hotellat = $('#hotel-banner-temperature').data('hotellat');
    var hotellon = $('#hotel-banner-temperature').data('hotellon');

    if (lat == undefined && hotellat != undefined) {
        lat = hotellat;
        lon = hotellon;
    }
    if (lat != undefined && lon != undefined) {
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid="
                + apiKey + "&units=metric";

        $.getJSON(queryURL, function(data) {
            // var location = data.id.name; // not returned in response
            var temp = data.main.temp;

            var tempRound = parseFloat(temp).toFixed();
            if (tempRound != 'NaN') {
                $('#weather-update').append(tempRound);
            } else {
                $('.hotel-banner-temperature').hide();
                $('.hotel-banner-date').removeClass('inline-block');
            }
        });
    } else {
        console.log("Lat and long can't found")
        $('.banner-label-below-title-sm').hide();
        $('.banner-btn-con.inline-block').hide()
    }
}());

function setCurrentDateInBanner() {
    var currentDate = new Date();
    currentDate = moment(currentDate).format('Do MMM YYYY');
    console.log("Todays Date ", currentDate);
    var systemDateDom = $.find('.system-date')[0];
    if (systemDateDom) {
        $(systemDateDom).text(currentDate);
    }
}

document.addEventListener( 'DOMContentLoaded', function() {
	if(dataCache.session.getData("holidayTheme")){		
		if((window.location.href).indexOf('rooms-and-suites')!=-1)
			$('.offers-deals-container').hide();
	}
	var locator = location.href;
	var midStr = 'meeting/meeting-request-quote.html?';
	var laststr = locator.lastIndexOf("?");
	var dynamicStr = locator.substring(laststr+1);
	var finalStr = midStr + dynamicStr ;
	var formatedURL = locator.toString().replace(finalStr, 'meeting.html');
	injectHotelNameForMobileView();
	var entierUrl=locator.split("?");
    locator=entierUrl[0]; 
	
	$( '.tab-child-container' ).each( function() {
	    
        $( this ).removeClass( 'selected' );
        var id = $( this ).text();
        if (document.getElementById(id) && ((document.getElementById(id).href === locator) ||(document.getElementById(id).href === formatedURL))) {
            $( this ).addClass( 'selected' );
        } 
    });

    
    
    if($(window).width() < 992) {
        var tabCount = $('.cm-nav-tab-con .tab-child-container').length;
        if(tabCount < 3) {
            $('.more-container-mobile').hide();
        }
        $('.more-tab-child-container > a').each( function() {
            var id = $( this ).text();
            if (document.getElementById(id).href === locator) {
                $('.more-container-mobile').addClass('selected');
                $('.more-container-mobile').html('<span>'+$(this).text()+'</span><img src="/content/dam/tajhotels/icons/style-icons/drop-down-arrow-white.svg" alt  = "drop-down-arrow-white-icon"/>' );
                $(this).css('display', 'none');
                if ($(window).width() > 767) {
                    var selTab = $('.tab-child-container:eq(2)').text();
                   if (id == selTab) {
                       $('.more-container-mobile').html('<span>More</span><img src="/content/dam/tajhotels/icons/style-icons/drop-down-arrow.svg" alt = "drop-down-arrow-icon"/>');
                       $('.more-container-mobile').removeClass('selected');
                   }
               }
             }           
        })
    }
    
    $( '.more-container-mobile' ).click( function() {
        $( '.more-content-wrap' ).css( 'display', 'block' );
    } );

    $( '.more-content-heading .icon-prev-arrow' ).click( function() {
        $( '.more-content-wrap' ).css( 'display', 'none' );
    } );
	
	function injectHotelNameForMobileView() {
		
		var hotelName = getHotelNameFromDom();
		var mobileViewDomArray = $.find("[data-injector-key='hotel-name']");
		var mobileViewConatiner ="";
		if (mobileViewDomArray != undefined) {
			mobileViewConatiner = mobileViewDomArray[0];
		}
		if( hotelName != undefined) {
			$(mobileViewConatiner).text(hotelName);
		}
	}
	
	function getHotelNameFromDom() {
		var hotelNameDomArray = $.find("[data-hotel-name]");
		var hotelNameContainer ="";
		if(hotelNameDomArray.length > 0){
//		if(hotelNameDomArray != undefined) {
			hotelNameContainer=hotelNameDomArray[0];
			if($(hotelNameContainer).data()) {
			    return $(hotelNameContainer).data().hotelName; 
			}
		}
		
	}
    if(window.location.href.includes("drivecation")){
		console.log("Js working");
		var elem = document.querySelector(".tab-child-container.selected");
        elem.style.setProperty("--primaryColorLight", "#0c5d90");
		elem.style.setProperty("--primaryColor", "#002b49");
        elem.style.setProperty("--primaryColorDark", "#002b49");
    }

    if(window.innerWidth >=991){
        var locationImgJson = $('#hotelnavbarimg').val();updateImageInTabs(locationImgJson);
	}

});

function updateImageInTabs(locationImgJson){
    if(!locationImgJson){return;}
    locationImgJson = JSON.parse(locationImgJson);
    Object.keys(locationImgJson).forEach(function(key) {
		$('.hotel-navigation a:contains("'+key+'")').prepend('<img src="'+ locationImgJson[key] +'" class="hotel-nav-img" height="80px" width="100px" >');
		$('.hotel-navigation a:contains("'+key+'")').addClass('hotel-nav-a');
	})
}

$(document).ready(function() {   
	$( ".title-descriptor").each(function( index ) {
        var showMore = $($( ".title-descriptor")[index]).find('#showMoreEnabled').val();
        if(showMore == "true"){
            var charLimit = $($( ".title-descriptor")[index]).find('#hotelLongDescCharLimit').val();
            if(!charLimit || charLimit == ""){
                charLimit =  200;
            }else{
                charLimit =  parseInt(charLimit);
            }
    
            $($( ".title-descriptor")[index]).find('.description-text').cmToggleText({
                charLimit : charLimit,
                showVal : "Show More",
                hideVal : "Show Less",
            });
        }

	});	
});




/*document.addEventListener( 'DOMContentLoaded', function() {
	
	$('.placeholder-header-title').each(function() {
       $(this).cmToggleText({
           charLimit: 500,
       })
   });
	
});
*/
$( document ).ready( function() {
	/*var couponCodesList = getCouponCodeFromData();
	if(JSON.parse(couponCodesList).length == 0){
		dataCache.session.setData( "couponCodes" , JSON.parse(couponCodesList) );
	}*/
	setCouponCodeToCache();
} );

function getCouponCodeFromData() {
    var couponCodeList = $( $.find( "[data-coupon-code]" )[ 0 ] ).data();
    if ( couponCodeList ) {
        return couponCodeList.couponCode.couponCodes;
    }
    return null;
}

function setCouponCodeToCache(){
	var couponCodeList = getCouponCodeFromData();
	if(couponCodeList){
		dataCache.session.setData( "couponCodes" , couponCodeList );
	}
}

var ROOM_OCCUPANCY_RESPONSE;
var multiOfferCodes;
var adjacentHotelCount = 0;
var rateTabCode = "";
var targetRoomNumforSeb = 1 ;
var isUserLoggedIn = false;
/**Member tier specific filters*/
var tierRateMemberFilter = "NP";
$(document).ready(function(){
	// saving voucherRedemption Data in session object
    dataCache.session.setData('voucherRedemption', getQueryParameter('voucherRedemption'));
	dataCache.session.setData('bookforSomeoneElse', getQueryParameter('bookforOthers'));
	dataCache.session.setData('vouchershareholderflow', getQueryParameter('vouchershareholderflow'));
	dataCache.session.setData('qcvoucherCode', getQueryParameter('qcvoucherCode'));
	dataCache.session.setData('qcvoucherpin', getQueryParameter('qcvoucherpin'));
	
	if(getQueryParameter('gravtyVoucherSelected')){
		sessionStorage.setItem('gravtyVoucherSelected', getQueryParameter('gravtyVoucherSelected'));
		sessionStorage.setItem('gravtyVoucherprivilegeCode', getQueryParameter('gravtyVoucherprivilegeCode'));
		sessionStorage.setItem('gravtyVoucherbitid', getQueryParameter('gravtyVoucherbitid'));
		sessionStorage.setItem('gravtyVoucherpin', getQueryParameter('gravtyVoucherpin')); 
		sessionStorage.setItem('gravtyMemberNumber', getQueryParameter('gravtyMemberNumber')); 
		sessionStorage.setItem('memberType', getQueryParameter('memberType')); 
		sessionStorage.setItem('gravtySessionLogin', decodeURI(getQueryParameter('gravtySessionLogin')));
	};
	
	if(getQueryParameter('offerRateCode') == 'null' || getQueryParameter('offerRateCode') == ''){
		$('div.rate-tab[data-offer-rate-code]').remove();
	}
    if(getQueryParameter('voucherRedemption')){
		dataCache.session.setData('voucherRedemptionShowPrice', getQueryParameter('voucherPrice'));
	}
	if(getQueryParameter('isTajSats')){
		dataCache.session.setData('isTajSats', getQueryParameter('isTajSats'));
	}
    if(getQuerySebRedemption() == undefined || getQuerySebRedemption() == null)
        dataCache.session.setData('sebObject', JSON.parse(getQueryParameter('sebObject')));
    
        var sebObject = getQuerySebRedemption();
    if(sebObject && sebObject != null && sebObject != undefined  && sebObject.sebRedemption == "true"){
        verifySebNights();
        sebHideDivs();
    
     var sebDiscount = sebObject.discountRate;
     var discount = sebObject.discount;
    if(sebDiscount != discount){
        setQuerySebRedemptionDiscount(discount)

    }
    
    }
   
    showAllTabs();
    dataCache.session.setData('PayOnlineDisabled', $('.PayOnlineDisabled').text());

    /*const urlParams = new URLSearchParams(window.location.search);
	const publicRates = urlParams.get('publicRates');
	console.log(publicRates);
	if(publicRates =="hide"){
		hideOtherRateTabs();
	}*/
	
	
	 $('body').on('taj:loginSuccess', function() {
		loggedInRateTabUpdate();
	 });

    /*To avoid goung to different domain on cart*/
    if(dataCache.session.getData('modifyBookingState') && dataCache.session.getData('modifyBookingState') != ""){
        $('.checkout-anchor').attr("href", "https://" + window.location.hostname + "/en-in/booking-cart/");
    }

});

window.addEventListener('load', function () {
    var locator = location.href;
    var selectedTab = locator.split("#").pop();

    roomHotelId = $($.find('[data-hotel-id]')[0]).data('hotel-id');
    hotelName = $($.find('[data-hotel-name]')[0]).data('hotel-name');

    roomDetailsShowHide();
    onlyBungalowsShowHide();

    checkInCheckOutTime();
    // following function call makes analytics data ready
    // for each room clicked
    $('.more-rates-button').click(function () {
        prepareRoomsJsonForClick($(this).closest('.rate-card-wrap'));
    });

});

/*
 * This function fetches checkInDate,checkOutDate,roomOccupancy from QueryParameters, if the parameters are missing
 * session storage values are picked up Sample Query Paramter that needs to passed are as follows
 * checkInDate=10/05/2019&checkOutDate=13/05/2019 Both checkInDate & checkOutDate needs to be passed , validation is
 * done on that nights ie the difference between checkOutDate & checkInDate is calculated if its greater than zero,
 * subsequently values are picked up for the AJAX call
 */
function fetchRoomsQueryParameters() {
    var bookingOptions = getBookingOptionsSessionData();
    var checkInDate = getQueryParameter('from') ? decodeURIComponent(getQueryParameter('from')) : null;
    var checkOutDate = getQueryParameter('to') ? decodeURIComponent(getQueryParameter('to')) : null;
    var rooms = getQueryParameter('rooms');
    var adults = getQueryParameter('adults');
    var children = getQueryParameter('children');
    var nights = getQueryParameter('nights');
    var promoCode = getQueryParameter('promoCode');
    if (checkInDate && nights && !checkOutDate) {
        if (nights > 0) {
            var sessionCheckInDate = moment(bookingOptions.fromDate, "MMM Do YY");
            var queryParamCheckInDate = moment(checkInDate, 'DD/MM/YYYY');
            if (queryParamCheckInDate >= sessionCheckInDate) {
                checkInDate = moment(checkInDate, 'DD/MM/YYYY').format('MMM Do YY');
                var toDate = moment(checkInDate, 'MMM Do YY').add(parseInt(nights), 'days').format("MMM Do YY");
                bookingOptions.fromDate = checkInDate;
                bookingOptions.toDate = toDate;
                bookingOptions.nights = parseInt(nights);
            } else {
                var fromDate = moment(bookingOptions.fromDate, 'MMM Do YY').format('MMM Do YY');
                var toDate = moment(fromDate, 'MMM Do YY').add(parseInt(nights), 'days').format('MMM Do YY');
                bookingOptions.fromDate = fromDate;
                bookingOptions.toDate = toDate;
                bookingOptions.nights = parseInt(nights);
            }
        }
    } else if (checkInDate && checkOutDate && !nights) {
        if (verifyFromAndToDate(checkInDate, checkOutDate)) {
            var nights = moment(checkOutDate, "DD.MM.YYYY").diff(moment(checkInDate, "DD.MM.YYYY"), 'days');
            checkInDate = moment(checkInDate, 'DD/MM/YYYY').format('MMM Do YY');
            checkOutDate = moment(checkOutDate, 'DD/MM/YYYY').format('MMM Do YY');
            bookingOptions.fromDate = checkInDate;
            bookingOptions.toDate = checkOutDate;
            bookingOptions.nights = parseInt(nights)
        }
    } else if(!checkInDate && !checkOutDate && nights){
        var fromDate = moment(bookingOptions.fromDate, 'MMM Do YY').format('MMM Do YY');
        var toDate = moment(fromDate, 'MMM Do YY').add(parseInt(nights), 'days').format('MMM Do YY');
        bookingOptions.fromDate = fromDate;
        bookingOptions.toDate = toDate;
        bookingOptions.nights = parseInt(nights);
    }
    if (rooms && adults && children) {
        if (validateRoomsQueryParams(rooms, adults, children)) {
            var roomOptions = [];
            var adultsArr = adults.split(",");
            var childArr = children.split(",");
            for (var index = 0; index < rooms; index++) {
                roomOptions.push({
                    "adults": adultsArr[index],
                    "children": childArr[index],
                    "initialRoomIndex": index
                });
            }
            bookingOptions.roomOptions = roomOptions;
            bookingOptions.rooms=rooms;
        }
    }
    var redirectFromAmp = getQueryParameter('redirectFromAmp');
    if(redirectFromAmp) {
        var promoCode =getQueryParameter('promoCode');
        var hotelId =getQueryParameter('hotelId');
        var targetEntity =getQueryParameter('targetEntity');
        var isAvailabilityChecked =getQueryParameter('isAvailabilityChecked');
        var onlyBungalows =getQueryParameter('onlyBungalows');
        if(!promoCode){
            promoCode = "";
        }
        bookingOptions.promoCode = promoCode;
        if(!hotelId){
            hotelId = null;
        }
        bookingOptions.hotelId = hotelId;
        if(!targetEntity){
            targetEntity = null;
        }
        bookingOptions.targetEntity = targetEntity;
        if(!isAvailabilityChecked){
            isAvailabilityChecked = false;
        }
        bookingOptions.isAvailabilityChecked = isAvailabilityChecked;
        if(!onlyBungalows){
            bookingOptions.BungalowType = "IndividualRoom";
        }else {
            bookingOptions.BungalowType = "onlyBungalow";
        }     
    }
    dataCache.session.setData('bookingOptions', bookingOptions);
    removeDateOccupancyParamFromUrl();
}

/*
 * This function validates the rooms,adults,children String passed in the query parameters, Validation is done for
 * number of rooms ie min value is 5 , no of adults for each room is limited to 7 and min value 1 , no of children for
 * each room is limited to 7 and min value is 0 & also validation is done on adults,children,rooms mapping if the
 * validation fails defaults session storage values are picked up sample query parameter that needs to passed is
 * rooms=3&adults=1,2,1&children=0,1,2 So room1 will have 1 adult & 0 children ,room2 will have 2 adults and 1 children ,
 * room3 will have 1 adult and 2 children
 */
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
    var isValid = occupants.split(",").every(function (x) {
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

function isInt(value) {
    return !isNaN(value) && (function (x) {
        return (x | 0) === x;
    })(parseFloat(value))
}

function verifyFromAndToDate(checkInDate, checkOutDate) {

    var bookingOptions = getBookingOptionsSessionData();
    var overrideSessionDates = getQueryParameter('overrideSessionDates');
    var sessionCheckInDate = moment(bookingOptions.fromDate, "MMM Do YY");
    var nights = moment(checkOutDate, "DD.MM.YYYY").diff(moment(checkInDate, "DD.MM.YYYY"), 'days');
    var queryParamCheckInDate = moment(checkInDate, 'DD/MM/YYYY');
    if (nights > 0) {
        if (queryParamCheckInDate >= sessionCheckInDate) {
            console.log("Date Validation Successfull");
            return true;
        } else {
            if (overrideSessionDates === "true") {
                console.log("Overriding sessionCheckInDate with passedCheckInDate")
                return true;
            }
            console.error("Passed CheckInDate is before SessionCheckInDate");
            return false;
        }
    } else {
        console.error("CheckOutDate is before CheckInDate");
        return false;
    }
}

function registerFilterTabClick() {
    // 1. for rate filter
    $('.rate-tab').click(function () {
        prepareRoomsImpression();
    });
}

$(window).load(function () {
    checkLoginWithMemberRate();
	getRateTabCode();
});

function promptTicLogin() {
    if (shouldPromptTicLogin()) {
        $('body').trigger('taj:sign-in');
        registerLoginListener(function () {
            //refreshPage();
        });
    }
}

function refreshPage() {
    if (window.location) {
        window.location.reload(true);
    } else if (location) {
        location.reload(true);
    }
}

function shouldPromptTicLogin() {
    var url = window.location.href;
    //if (url.indexOf('tajinnercircle.com') != -1) {
        if (!getUserData()) {
            return true;
        }
    //}
    return false;
}

$(document).ready(function () {
    $(".room-list-close").click(function () {
        $(".cm-sold-out-wrap").removeClass("active");
    });
    hideBreadcrumbAndNavigationBar();
    checkHolidayThemeOnLoad();
    fetchRoomsQueryParameters();
    try{
    checkForCurrencyStringInCache();
    }catch(err){
        console.log('failed to fetch currency',err);
    }
    var currencySelected;
    var previousCurrency1 = getCurrencyCache();
    $(document)
        .on(
            'currency:changed',
            function (e, currency) {
                var popupParams = {
                    title: 'Booking Alert!',
                    description: 'Showing currency is Hotel Default currency. Now You will not be  allowed to change Currency. ',
                };
                warningBox(popupParams);
                if (previousCurrency1 != undefined) {
                    dataCache.session.setData('currencyCache', previousCurrency1);
                    setActiveCurrencyInDom(previousCurrency1.currencySymbol,
                        previousCurrency1.currency, previousCurrency1.currencyId);
                }
            });
    // [TIC-FLOW]
    ticRoomListFlow();
    getSelectedCurrencySymbol();
    var globalRateFilters;
    var globalDom;
    setupCarousel();
    setupPromoCodeTab();
    setupNegotiatedRateTab();
    setupRateTab();
    setCurrencyStringInRateTab();
    expandViewDetailsIfSpecified();
    invokeRoomFetchAjaxCall();
    trimServiceAmenityText();
    ShowMoreShowLessRateDescription();
    ShowMoreShowRateCardRoomDescription();
    ShowMoreShowRateCardRoomDetailsDescription();
    // allHotelsUnderDestination();

    // [TIC-FLOW]
    $(".rate-tab").click(
        function () {
            var pointsMsg = $('.points-redeemption-msg');
            var taxDisclaimer = $('.rate-class-disclaimer');
            ($(this).text().includes("ROOM REDEMPTION RATES") || $(this).text().includes(
                "TAJ HOLIDAY PACKAGES")) ? pointsMsg.show() : (pointsMsg.hide() , taxDisclaimer.show());
        });

    function hideBreadcrumbAndNavigationBar() {
        if (window.location.href.includes('tajinnercircle.com')) {
            $('.cm-nav-tab-con').hide();
            $('.specific-hotels-breadcrumb').hide();
        }
    }

});

function checkingCart() {
    var bookingOptions = getBookingOptionsSessionData();
    return dataCache.session.getData('bookingOptions').selection.length;
}

function getCurrencyCache() {
    return dataCache.session.getData('currencyCache');
}

function checkForCurrencyStringInCache() {
    var bookingOptions = getBookingOptionsSessionData();
    if (bookingOptions && bookingOptions.currencySelected === undefined) {
        setCurrencyInSessionStorage(getCurrentCurrencyInHeader());
    }
}

function getCurrentCurrencyInHeader() {
    return $($.find("[data-selected-currency]")[0]).data().selectedCurrency;
}

function ShowMoreShowLessRateDescription() {
    $('.rate-plan-description-txt').cmToggleText({
        charLimit: 125,
        showVal: 'Show More',
        hideVal: 'Show Less',
    });
}

function setCurrencyInSessionStorage(currency) {
    var bookingOptions = getBookingOptionsSessionData();
    bookingOptions.currencySelected = currency;
    dataCache.session.setData("selectedCurrencyString", currency);
    dataCache.session.setData("bookingOptions", bookingOptions);
}

function trimRoomDescriptions() {
    $.each($('.rate-card-room-description'), function (i, value) {
        $(value).cmTrimText({
            charLimit: 125,
        });
    });
}

function trimServiceAmenityText() {
    $.each($('.rate-card-room-details .rate-card-room-facilities span span'), function (i, value) {
        $(value).cmTrimText({
            charLimit: 25,
            ellipsisText: '..',
        });
    });
}

function setupCarousel() {
    var carouselDisplayTriggerElements = $.find('[data-gallery-display-trigger]');

    for (var index in carouselDisplayTriggerElements) {
        var carouselDisplayTriggerDom = $(carouselDisplayTriggerElements).get(index);
        var carouselDisplayData = $(carouselDisplayTriggerDom).data('gallery-display-trigger');
        var carouselDom = $.find('[data-gallery-carousel-overlay=\'' + carouselDisplayData + '\']');
        addCarouselDisplayListenerTo($(carouselDisplayTriggerDom), carouselDom);
    }
}

function setupPromoCodeTab() {
    var promoCode = getPromoCode();
    var promoCodeName = getPromoCodeName();
    // remove any existing promo tab
    $('[data-promo-code]').remove();
    if (promoCode) {
        var promoTab = '<div data-promo-code=\'' + promoCode + '\' class=\'rate-tab\'>' + '<div>' + promoCodeName
        + '</div>' + '<div class="starting-from" style="visibility:hidden"><p style=\'display: inline; color: #9b9b9b;\'>From '
        + '<div data-rate-filter-price style=\'display: inline;\'></div> <span data-injector-key="currency-string"></span><span class="per-night-text"> per night </span></p></div></div> ';
        $('#rate-tab-container').prepend(promoTab);
    }
}

function setupOfferCodeTab() {
    var offerCode = getOfferCode();
	var offerName = getOfferName();
    // remove any existing promo tab
    $('[data-offer-rate-code]').remove();
    if (offerCode && offerCode != 'null' && offerCode != '') {
        var offerTab = '<div data-offer-rate-code=\'' + offerCode + '\' class=\'rate-tab\'>' + '<div>' + offerName
        + '</div>' + '<div class="starting-from" style="visibility:hidden"><p style=\'display: inline; color: #9b9b9b;\'>From '
        + '<div data-rate-filter-price style=\'display: inline;\'></div> <span data-injector-key="currency-string"></span><span class="per-night-text"> per night </span></p></div></div> ';
        $('#rate-tab-container').prepend(offerTab);
    }
}

function setupNegotiatedRateTab() {
    var negotiatedCode = getNegotiatedCode();
    var negotiatedRateTabName = "Negotiated Rates";
    // remove any existing promo tab
    $('[data-negotiation-code]').remove();
    if (negotiatedCode) {
        var negotiationRatesTab = '<div data-negotiation-code=\'' + negotiatedCode + '\' class=\'rate-tab\'>' + '<div>' + negotiatedRateTabName
            + '</div>' + '<div class="starting-from" style="visibility:hidden"><p style=\'display: inline; color: #9b9b9b;\'>From '
            + '<div data-rate-filter-price style=\'display: inline;\'></div> <span data-injector-key="currency-string"></span> per night </p></div></div> ';
        $('#rate-tab-container').prepend(negotiationRatesTab);
    }
}

function getNegotiatedCode(){
    var ihclCbUserDetails = dataCache.local.getData("userDetails");
    if(ihclCbUserDetails && (ihclCbUserDetails.selectedEntity || ihclCbUserDetails.selectedEntityAgent)){
        if (ihclCbUserDetails.selectedEntity && ihclCbUserDetails.selectedEntity.partyNumber) {
            return ihclCbUserDetails.selectedEntity.partyNumber;
        } else {
            return ihclCbUserDetails.selectedEntityAgent.partyNumber;
        }
    }
    return "";
}

function setupRateTab() {
    
    $rateTabElement = $('.rate-tab:visible');
    $rateTabElement.click(function () {
        $(this).siblings().removeClass('tab-selected');
        $(this).addClass('tab-selected');

        var tempRetIndexVal = roomIndexForCurrentPackage();
        var nextRoomNumber = parseInt(tempRetIndexVal.initialRoomIndex) + 1;

        if (ROOM_OCCUPANCY_RESPONSE[nextRoomNumber]) {
            processRoomOccupancyRates(nextRoomNumber);
        }

    });
    $rateTabElement.first().addClass('tab-selected');

    // For voucherRedemption only show offer rate code tab
	var voucherRedemption = getQueryVoucherRedemption();
	if(voucherRedemption && voucherRedemption == 'true'){
		hideOtherRateTabs();
    }
    var sebRedemption = getQuerySebRedemption();
    if(sebRedemption && sebRedemption != null && sebRedemption != undefined && sebRedemption.sebRedemption == 'true'){
		setupOfferCodeTab();
		hideOtherRateTabs();
		}
	var showAllTab = showAllTabs();
	if(showAllTab && showAllTab == 'true'){
		$rateTabElement.not(":eq(0)").hide();
	}
	 var offerTickerName = getQueryParameter('offerTickerName');
	 var offerRateCode = getQueryParameter('offerRateCode');
	 if(offerRateCode && offerTickerName){
		$('#rate-tab-container [data-offer-rate-code]').addClass('offerticker').attr('data-ticker', offerTickerName);
		$('.offerticker').show();
		$('#rate-tab-container [data-rate-filter-code="TIC"]').addClass('rateTickerHide');
	 }
}

function successHandler(response, isError) {
    if (!isError)
        console.info('Ajax call for servlet succeeded');
    else {
        console.info('Error Fetching rates');
    }
    if (response.responseCode.toLowerCase() == 'success') {
		//To hide show the tier specific rate codes
		/*if(response['1'] && response['1'].rateFilters.TIC){
			response['1'].rateFilters.TIC = adjustMemberRatesTierWise(response['1'].rateFilters.TIC);
		}*/
        injectResponseToSelector(response);
        setButtonPositionValue();
        // Analytic data call
        pushEvent("rooms", "rooms", prepareGlobalHotelListJS())
        if (globalBookingOption.selection != undefined) {
            var selectionArr1 = globalBookingOption.selection;
            selectionArr1.forEach(function (item, index) {
                selectionAr = selectionArr1[index] || item;
                prepareOnRoomSelect(ViewName, event);
            })
        }

        prepareRoomsImpression();
        registerFilterTabClick();
        $('.rate-tab:visible').first().click();
        getRateTabCode();

    } else {
        handleFailureToFetchRates();
    }
    setDefaultRateFilerAfterRateFetch();
    checkHolidayThemeAfterRateFetch();
    showBookedRoomType();
    const urlParams = new URLSearchParams(window.location.search);
	const publicRates = urlParams.get('publicRates');
	console.log(publicRates);
	if(publicRates =="hide"){
		hideOtherRateTabs();
	}
	const onlyRedemption = urlParams.get('redemptionOnly');
	if(onlyRedemption){
		hideNonRedemptionTabs();
	}

	/*set session value for gso corporate booking flow*/
	const gsobooking = urlParams.get('gsoCorporateBooking');
	gsobooking == 'true' ?  sessionStorage.setItem('employeeGSCBookingFlow','true') : sessionStorage.removeItem('employeeGSCBookingFlow');

    const onlyMemberRates = urlParams.get('onlyMemberRates');
    if(onlyMemberRates =="show"){
		functShowOnlyMemberRates();
	}
}

/*
To hide and show the tier specific rate codes
*/
function adjustMemberRatesTierWise(rateTiCArr){
	var roomRatesArrayTIC = [];
	var roomRatesArrayTIC = rateTiCArr[roomHotelId]['roomsAvailability'];
	if(dataCache.local.getData("userDetails")){
		var currentSlab =  (dataCache.local.getData("userDetails").loyaltyInfo[0]).currentSlab
	}
	var goldPlatinumRateCodes = ['NJTC', 'NJTCB'];
	for (var key of Object.keys(roomRatesArrayTIC)) {
		console.log(key + " -> " + roomRatesArrayTIC[key])
		for(var i=0;i<roomRatesArrayTIC[key]['rooms'].length; i++){
			var roomPriceObj = roomRatesArrayTIC[key]['rooms'][i];
			var ratePlanCode = roomPriceObj.ratePlanCode;
			if(goldPlatinumRateCodes.indexOf(ratePlanCode) != -1 && currentSlab != 'Gold' && currentSlab != 'Platinum'){
				delete roomRatesArrayTIC[key]['rooms'][i]
				roomRatesArrayTIC[key]['rooms'].splice( i,1 );
				i--;				
			}
		}
	}
	rateTiCArr[roomHotelId]['roomsAvailability'] = roomRatesArrayTIC;
	return rateTiCArr;
}

function hideOtherRateTabs(){
	$('[data-rate-filter-code="STD"]').hide();
	$('[data-rate-filter-code="TIC"]').hide();
	$('[data-rate-filter-code="PKG"]').hide();
    $('[data-rate-tic-filter-code="TIC ROOM REDEMPTION RATES"]').hide();
}

function hideNonRedemptionTabs(){
	$('[data-rate-filter-code="STD"]').hide();
	$('[data-rate-filter-code="TIC"]').hide();
	$('[data-rate-filter-code="PKG"]').hide();
}

function functShowOnlyMemberRates() {
	let offerRateTab = $('[data-rate-filter-code="TIC"]');
    offerRateTab.css("border-left-color", "rgba(215, 39, 65, 0.2)");
    $('[data-rate-filter-code="TIC"]').click();
	$('[data-rate-filter-code="STD"]').show();
	$('[data-offer-rate-code]').hide();
	$('[data-rate-filter-code="PKG"]').show();
	$('[data-rate-filter-code="TIC"]').show();
}

function invokeRoomFetchAjaxCall() {
    var requestData = {};

    var rateFilters = getAllRateFilters();
    var promoCode = getPromoCode();
    var negotiatedRateCode= getNegotiatedCode();
    var rateCodes = getAllRatePlanCodes();
    multiOfferCodes = rateCodes;
    promoCode ? requestData.promoCode = promoCode : '';
    negotiatedRateCode ? requestData.corporateCode = negotiatedRateCode :'';

    var cacheJson = '';
    if (requestData.promoCode || requestData.corporateCode) {
        cacheJson = 'ratesCache' + '/';
    } else {
        cacheJson = 'ratesCache';
    }

    trigger_hotelSearch(getBookingOptionsSessionData());
    console.info('Attempting to invoke ajax call with data. ');

    ROOM_OCCUPANCY_RESPONSE = {};
    if($('#synxis-downtime-check').val() == "true"){
        $('.rate-card-wait-spinner').hide();
        
        $('.room-rate-unavailable').addClass('visible');
        
        var bo = dataCache.session.getData('bookingOptions');
        var checkInDate = moment(bo.fromDate, "MMM Do YY").format("YYYY-MM-DD");
        var checkOutDate = moment(bo.toDate, "MMM Do YY").format("YYYY-MM-DD");
        var currentHotelId = bo.hotelId;
       
        var roomOptions = bo.roomOptions;
        var roomOptionsLength = roomOptions.length;
        var adults, children;
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
        var synxisRedirectLink = 'https://be.synxis.com/?' + 'arrive=' + checkInDate + '&depart='
        + checkOutDate + '&rooms=' + roomOptionsLength + '&adult=' + adults + '&child=' + children
        + '&hotel=' + currentHotelId + '&chain=21305' + '&currency=' + '&level=chain' + '&locale=en-US'
        + '&sbe_ri=0';
        
        $('.rate-tab-container').hide();
        $('.room-rate-wrap').addClass('visible');
        $('.rate-card-actual-rate').addClass('hidden');
        $('.rate-card-striked-rate').addClass('hidden');
        $('.rate-card-text-container').addClass('hidden');
        
        $($('.more-rates-button')).click( function() {
            window.location.href = synxisRedirectLink;
        });
    }else{
        $.ajax({
            type: 'GET',
            url: '/bin/room-rates/rooms-availability.rates/' + getHotelCode() + '/' + getCheckInDateInDisplay() + '/'
                + getCheckOutDateInDisplay() + '/' + getShortCurrencyStringInDisplay() + '/' + getRoomOccupantOptions()
                + '/' + JSON.stringify(rateFilters) + '/' + JSON.stringify(rateCodes) + '/' + cacheJson,
            dataType: 'json',
            data: requestData,
            error: handleFailureToFetchRates,
            success: successHandler
        });
    }
}

function handleFailureToFetchRates(response) {
    console.error("Ajax call was successful, but the server returned a failure for room rates.");
    pushEvent("rooms_unavailable", "rooms_unavailable", prepareGlobalHotelListJS())
    $('.rate-card-wait-spinner').hide();
    $('.room-rate-wrap').removeClass('visible');
    $('.room-rate-unavailable').addClass('visible');
    checkHolidayThemeAfterRateFetch();
    checkMemberTypeAfterRateFetch();
    if(response && response.status && response.status == 412){
        var redirectLink = $.find('.synxis-configurations .redirect-page-path');
        if(redirectLink != undefined){
            if(redirectLink instanceof Array){
                $(redirectLink)[0].click();
            }else {
                $(redirectLink).click();
            }
        }
    } else {
        if($(".cm-page-container").hasClass("ama-theme")){
            setWarningInDom("Rates are not available for the your particular request. Please try again or after some time.");
        }else{
           // setWarningInDom("Oops! Something went wrong. Please Try Again");
        }
    }
}

function injectResponseToSelector(response) {
    ROOM_OCCUPANCY_RESPONSE = response;
    /* processRoomOccupancyRates(response); */
    var roomNumber = getRoomNumberToBeShown();
    //processRoomOccupancyRates(roomNumber);
    processRoomOccupancyRates(1);
}

function processRoomOccupancyRates(targetRoomNum) {
    /* var index = getRoomNumberToBeShown(); */
    /* var roomOccupancyRates = ROOM_OCCUPANCY_RESPONSE[index]; */
    targetRoomNumforSeb = targetRoomNum;
    var roomOccupancyRates = ROOM_OCCUPANCY_RESPONSE[targetRoomNum];
    if (roomOccupancyRates) {
        injectLowestPrice(roomOccupancyRates.rateFilters, roomOccupancyRates.rateCodes, roomOccupancyRates.promoCode);
        showRateCardsIfHidden();
        processSelectedRateTab(roomOccupancyRates.rateFilters, roomOccupancyRates.rateCodes,
            roomOccupancyRates.promoCode);
        showSoldOutMessage(roomOccupancyRates);
        roomFirstClick();
    } else {
        handleFailureToFetchRates();
    }
}

function getRoomNumberToBeShown() {
    var bookingOptions = getBookingOptionsSessionData();
	modifyBookingState == 'modifyRoomType' && bookingOptions.rooms == 0 ? bookingOptions.rooms = 1 : '';
    var currentSelectionLength = bookingOptions.selection.length || bookingOptions.roomOptions.length;
    return currentSelectionLength >= bookingOptions.rooms ? currentSelectionLength : currentSelectionLength + 1;
}

function showErrors(errors) {
    var outString = "";
    errors.forEach(function (error) {
        outString += (error + "\n");
    });
    setWarningInDom(outString);
}

var roomCurCheck;

function injectLowestPrice(rateFilterInfo, rateCodesInfo, promoCodeInfo) {
    try {
        var voucherRedemption = getQueryVoucherRedemption();		
		var voucherShowPrice = getQueryVoucherPrice();
        var sebRedemption = getQuerySebRedemption();
        var rateFilterTabs = $.find('[data-rate-filter-code]');
        var currencyForHeader;
        var numOfRateFilters = rateFilterTabs.length;
		var hideOtherTabs = getParamToHideOtherTabs();
        // this condition is for handleling voucher redemption
        
        if(!((sebRedemption && sebRedemption != null && sebRedemption != undefined && sebRedemption.sebRedemption == 'true') ||(voucherRedemption && voucherRedemption == 'true') || (hideOtherTabs && hideOtherTabs == 'true'))) {
            for (var k = 0; k < numOfRateFilters; k++) {
                var rateFilterTab = rateFilterTabs[k];
                var rateFilterCode = $(rateFilterTab).attr('data-rate-filter-code');
				
				/**For tier specific member rate filters */
				if(rateFilterCode == 'TIC'){
					rateFilterCode = tierRateMemberFilter;
				}
				
                var rateFilterRates = rateFilterInfo[rateFilterCode];
                if (!rateFilterRates || !rateFilterRates[getHotelCode()]) {
                    $(rateFilterTab).hide();
                    continue;
                }
                var hotelRates = rateFilterRates[getHotelCode()];
                var lowestPrice;
                if ($('.cm-page-container').hasClass('ama-theme')) {
                    var query = window.location.search;
                    var lowestRoomCode = $('#lowestRoomCode').val();
                    var bungalowCode = $('#bungalowCode').val();
                    var roomRateCode = hotelRates.roomsAvailability[lowestRoomCode];
                    var bungalowRateCode = hotelRates.roomsAvailability[bungalowCode];
                    if (roomRateCode && !query.includes('onlyBungalows')) {
                        if (roomRateCode.lowestDiscountedPrice == 0) {
                            lowestPrice = roomRateCode.lowestPrice;
                        } else {
                            lowestPrice = roomRateCode.lowestDiscountedPrice;
                        }
                    } else if (bungalowRateCode && query.includes('onlyBungalows')) {
                        if (bungalowRateCode.lowestDiscountedPrice == 0) {
                            lowestPrice = bungalowRateCode.lowestPrice;
                        } else {
                            lowestPrice = bungalowRateCode.lowestDiscountedPrice;
                        }
                    }
                } else {
                    if (hotelRates.lowestDiscountedPrice == 0 || hotelRates.lowestDiscountedPrice > hotelRates.lowestPrice) {
                        lowestPrice = hotelRates.lowestPrice;
                    } else {
                        lowestPrice = hotelRates.lowestDiscountedPrice;
                    }
                }
    
                var currencyString = hotelRates.currencyString;
    
                if (currencyString) {
                    currencyForHeader = currencyString;
                    $(rateFilterTab).find('[data-injector-key]').text(currencyString);
                    $(rateFilterTab).find('[data-rate-filter-price]').text(getCommaFormattedNumber(lowestPrice));
                    $(rateFilterTab).show();
                } else {
                    $(rateFilterTab).hide();
					if($(rateFilterTab).attr('data-rate-filter-code') == "TIC"){
						$('div.tic-room-redemption-tier').hide();						
					}
                }
                $(rateFilterTab).find('.starting-from').css('visibility', 'visible');
    
            }

            previousCurrency1 = getCurrencyCache();

        }
		// handle voucher redemption rate code
		            
            if (rateCodesInfo) {
                var offerRateTab = $('[data-offer-rate-code]')[0];
                var offerRateCode = $(offerRateCode).data('offerRateCode');
                var offerRates = rateCodesInfo[getHotelCode()];
                var roomsAvailability = offerRates.roomsAvailability;
                var multiOfferCheck = false;
                for (var r in roomsAvailability) {
                    if (roomsAvailability[r].rooms && !multiOfferCheck
                        && (multiOfferCodes.length == roomsAvailability[r].rooms.length)) {
                        multiOfferCheck = true;
                    }
        
                }
				multiOfferCheck = true;
                if (!multiOfferCheck) {
                    offerRates.currencyString = null
                    offerRates.roomsAvailability = {};
                    offerRates.lowestPrice = 0
                    offerRates.lowestDiscountedPrice = 0
                }
        
                /*
                 * offerRates.forEach(function(data, index) { console.log(offerRates.rooms); })
                 */
        
                var offerRatesCurrency = offerRates.currencyString;
                if (offerRatesCurrency) {
                    currencyForHeader = offerRatesCurrency;
                    $(offerRateTab).find('.starting-from').css('visibility', 'visible');
                } else {
                    $(offerRateTab).find('.starting-from').css('visibility', 'hidden');
                }
				if(voucherRedemption && voucherRedemption == 'true' && !voucherShowPrice){
					rateCodesInfo = makeAvailabilityAsPerVoucher(rateCodesInfo)
                    textChangesForVoucherRedemotion();
                }else{
					$('.redeem-voucher').addClass('d-none');
				}
                if(sebRedemption && sebRedemption != null && sebRedemption != undefined && sebRedemption.sebRedemption == 'true'){
					rateCodesInfo = makeAvailabilityAsPerSEB(rateCodesInfo)
                  //  textChangesForVoucherRedemotion();
                }
                processNonFilterTab(offerRateTab, rateCodesInfo);
            }



        // handle voucher redemption

        if (promoCodeInfo) {
            var negotiationTab = $('[data-negotiation-code]')[0];
            var promoTab = $('[data-promo-code]')[0];
            var promoCurrencyType = promoCodeInfo[getHotelCode()].currencyString;
            if(negotiationTab){
                processNonFilterTab(negotiationTab, promoCodeInfo);
                if(promoCurrencyType){ 
                    currencyForHeader = promoCurrencyType;
                    $(negotiationTab).find('.starting-from').css('visibility', 'visible');
                }
            }else{
                // Voucher related handle for amount
				//console.log('before', promoCodeInfo[getHotelCode()]);
                if(voucherRedemption && voucherRedemption == 'true' && !voucherShowPrice){
					promoCodeInfo = makeAvailabilityAsPerVoucher(promoCodeInfo)
                    textChangesForVoucherRedemotion();
                }
                if(sebRedemption && sebRedemption != null && sebRedemption != undefined && sebRedemption.sebRedemption == 'true'){
					rateCodesInfo = makeAvailabilityAsPerSEB(rateCodesInfo)
                  //  textChangesForVoucherRedemotion();
                }
                //console.log('after', promoCodeInfo[getHotelCode()]);

                processNonFilterTab(promoTab, promoCodeInfo);
                if(promoCurrencyType){
                    $(promoTab).find('.starting-from').css('visibility', 'visible');
                }
            }
        }
        
        if (currencyForHeader) {
            roomCurCheck = setActiveCurrencyWithResponseValue(currencyForHeader);
        }
        
    } catch (error) {
        console.error(error);
    }
}

function processRateFilterTab(dom, code, info) {
    var filterRate = info[code];
    return processNonFilterTab(dom, filterRate);
}

function processNonFilterTab(dom, info) {
    try {
    var voucherRedemption = getQueryVoucherRedemption();
	var voucherShowPrice = getQueryVoucherPrice();
    var sebRedemption = getQuerySebRedemption();
    var hotelId = getHotelCode();
    var lPrice;
    if (info[hotelId].lowestDiscountedPrice == 0) {
        lPrice = info[hotelId].lowestPrice;
    } else {
        lPrice = info[hotelId].lowestDiscountedPrice;
    }
    
    if($('.cm-page-container').hasClass('ama-theme')){
        var hotelRates = info[hotelId];
        var query = window.location.search;
        var lowestRoomCode = $('#lowestRoomCode').val();
        if(hotelRates){
            var roomRateCode = hotelRates.roomsAvailability[lowestRoomCode];
            if (roomRateCode && query.includes('offerRateCode')) {
                if (roomRateCode.lowestDiscountedPrice == 0) {
                    lPrice = roomRateCode.lowestPrice;
                } else {
                    lPrice = roomRateCode.lowestDiscountedPrice;
                }
    		}
    	}
    }
    if (info[hotelId].currencyString) {
        $(dom).find('[data-injector-key]').text(info[hotelId].currencyString);
    } else {
        $(dom).find('[data-injector-key]').text("");
    }
	if(voucherRedemption && voucherRedemption == 'true' && !voucherShowPrice){
        var tabElement = $('.rate-tab.tab-selected')
		$(dom).find('[data-injector-key]').text("");
		tabElement.find('p').hide();
		$(dom).find('[data-injector-key]').closest('span').hide();
		return $($(dom).find("[data-rate-filter-price]")[0]).text('Redeem Voucher');
	}

    return $($(dom).find("[data-rate-filter-price]")[0]).text(getCommaFormattedNumber(lPrice));
    }catch(error){
        console.error('error in method processNonFilterTab ');
        console.error(error);
    }
}

function setWarningInDom(warning) {
    tajToaster(warning);
}

function showRateCardsIfHidden() {
    
        $('.rate-card-wait-spinner').hide();
        $('.room-rate-wrap').addClass('visible');
        $('.room-rate-unavailable').removeClass('visible');
    if(!getQueryVoucherRedemption()){
        $('.redeem-voucher').addClass('d-none');
        $('.redeem-voucher-room').addClass('d-none');
    }
    
}

function processSelectedRateTab(rateFilters, rateCodesPrices, promoCodePrices) {
    $('.rate-card-wrap').find('.rate-card-more-rates-section').remove();
    var rateTabInDisplay = getRateTabInDisplay();
    var rates;
    var hotelCode = getHotelCode();
    if (isOfferRateSelected()
        || (userIsTicBased() && ((rateTabInDisplay === 'TIC ROOM REDEMPTION RATES')
            || (rateTabInDisplay === 'TAP ROOM REDEMPTION RATES')
            || (rateTabInDisplay === 'TAPPMe ROOM REDEMPTION RATES')
            || (rateTabInDisplay === 'TAJ HOLIDAY PACKAGES')))) {
        rates = rateCodesPrices;
    } else if (isPromoTabSelected()) {
        rates = promoCodePrices;
    } else if (isNegotiationRateTabSelected()){
        rates = promoCodePrices;
    } else {
        rates = rateFilters[rateTabInDisplay];
    }

    if (!rates) {
        handleFailureToFetchRates();
    }

    var hotelRoot = rates[hotelCode];

    /*if (hotelRoot.error && hotelRoot.error.length) {
        showErrors(hotelRoot.error);
    }*/

    /*if (hotelRoot.warning && hotelRoot.warning.length) {
        showErrors(hotelRoot.warning);
    }*/
    var roomsAvailability = hotelRoot['roomsAvailability'];
    var sebRedemption = getQuerySebRedemption();
    if(sebRedemption && sebRedemption != null && sebRedemption != undefined && sebRedemption.sebRedemption == 'true'){
        roomsAvailability = modifyAvailabilityAsPerSEB(roomsAvailability)
     
    }
    injectValuesForRoomCards(roomsAvailability);
    setupListenerForAddRoom();
}

function isOfferRateSelected() {
    var selectedTabs = $('.rate-tab-wrap').find('.tab-selected')
    if (selectedTabs.length == 0) {
        selectedTabs = $('.rate-tab[data-offer-rate-code]').addClass('tab-selected');
    }else if($(selectedTabs).first().attr('data-offer-rate-code') == 'null' ||  $(selectedTabs).first().attr('data-offer-rate-code') == ''){
		$('.rate-tab[data-offer-rate-code]').removeClass('tab-selected');
		return false
	}
    return $(selectedTabs).first().attr('data-offer-rate-code');
}

function isNegotiationRateTabSelected() {
    var selectedTabs = $('.rate-tab-wrap').find('.tab-selected')
    return $(selectedTabs).first().attr('data-negotiation-code');
}

function isPromoTabSelected() {
    var selectedTabs = $('.rate-tab-wrap').find('.tab-selected')
    return $(selectedTabs).first().attr('data-promo-code');
}

function injectValuesForRoomCards(roomsAvailabilityData) {
    var allRoomContainersInDom = getAllRoomContainersFromDom();
    $(allRoomContainersInDom).each(
        function (key, roomContainerInDom) {
            try {
                var roomBedTypeMap = $(this).data("bed-room-map");
                var kingBedRoomAvail = roomsAvailabilityData[roomBedTypeMap.king];
                var doubleBedRoomAvail = roomsAvailabilityData[roomBedTypeMap.double];
                var queenBedRoomAvail = roomsAvailabilityData[roomBedTypeMap.queen];
                var twinBedRoomAvail = roomsAvailabilityData[roomBedTypeMap.twin];
                var availableBedOptions = updateBedTypeAvailability(roomBedTypeMap, kingBedRoomAvail, doubleBedRoomAvail,
                    queenBedRoomAvail, twinBedRoomAvail);
                $(this).attr("data-bed-type-opts", JSON.stringify(availableBedOptions));
                var onlineAvailable = $($($(this)).find('.rate-card-room-rate-container')).data(
                    "online-booking-available");
                if (onlineAvailable == undefined) {
                    $(this).find('.room-rate-wrap').removeClass('visible');
                    showElementUnderWithClass($(this), '.online-booking-unavailable');
                    $(this).data('sort-order', 9999999999999999999999999999 + key);
                    removeRoomUnavailability($(this));
                } else if (kingBedRoomAvail || doubleBedRoomAvail || queenBedRoomAvail || twinBedRoomAvail) {
                    injectIntoRoomContainer(this, kingBedRoomAvail || doubleBedRoomAvail || queenBedRoomAvail || twinBedRoomAvail);
                    // $(this).show();
                    removeRoomUnavailability($(this));
                } else {
                    $(this).find('.room-rate-wrap').removeClass('visible');
                    setRoomUnavailability($(this));
                    $(this).data('sort-order', 99999999999999999999999999999 + key);
                }
            } catch (error) {
                console.error(error);
            }
        }).sort(function (a, b) {
        if ($(a).data('sort-order') === $(b).data('sort-order')) {
            return 0;
        }
        return $(a).data('sort-order') > $(b).data('sort-order') ? 1 : -1;
    }).detach().appendTo('.rate-cards-container.cm-content-blocks .cm-room-options').show();
    onlyBungalowsShowHide();
}

function onlyBungalowsShowHide() {
    var parameters = window.location.search;
    if (parameters) {
        var query = parameters.split('?');
        var param = query[1];
        if (param.includes('onlyBungalows')) {
            $('.rate-card-wrap').each(function() {
                if(!$(this).attr('data-room-type')) {
                    $(this).hide();
                }
            });
        }
    }
}

function removeRoomUnavailability(roomCard) {
    var amaTheme = $('.cm-page-container').hasClass('ama-theme');
    if (amaTheme) {
        var soldOut = $(roomCard).find('.rate-card-main-section');
        soldOut.removeClass('soldOut');
    }
}

function setRoomUnavailability(roomCard) {
    var rateContainer = $(roomCard).find('.rate-card-room-rate-container');
    var onlineAvailable = $(rateContainer).data("online-booking-available");
    var amaTheme = $('.cm-page-container').hasClass('ama-theme');
    if (onlineAvailable == undefined) {
        showElementUnderWithClass(roomCard, '.online-booking-unavailable');
    } else if (isSelectionLessThanMinimum(rateContainer)) {
        showElementUnderWithClass(roomCard, '.minimum-booking-days');
    } else {
        showElementUnderWithClass(roomCard, '.room-rate-unavailable');
        if (amaTheme) {
            var soldOut = $(roomCard).find('.rate-card-main-section');
            $(roomCard).find('.room-rate-unavailable').removeClass('visible');
            soldOut.addClass('soldOut');
        }
    }

    // Analytics Data For AMA
    AvailRooms = 0;
    var rooms = $(".rate-card-wrap");
    rooms.each(function () {
        if(!$(this).children().hasClass("soldOut")){
            AvailRooms++;
        };
    });
    try {
        amaDataLayerData.AvailRooms = AvailRooms;
    } catch (e) { }
}

function showElementUnderWithClass(element, cssClass) {
    var onlineUnavailableDom = $(element).find(cssClass);
    $(onlineUnavailableDom).addClass('visible');
    $(onlineUnavailableDom).removeClass('hidden');
}

function isSelectionLessThanMinimum(rateContainer) {
    var minDaysForBooking = $(rateContainer).data("min-days-for-booking");
    var checkInDate = getCheckInDateInDisplay();
    var checkOutDate = getCheckOutDateInDisplay();
    var numOfDaysSelected = moment(checkOutDate).diff(moment(checkInDate), 'days');

    return numOfDaysSelected < minDaysForBooking;
}

function injectIntoRoomContainer(roomContainer, data) {
    injectPricesToRoomContainer(roomContainer, data);
    var numOfAvailableUnits = data.availableUnits;
    setAvailabilityExpression(roomContainer, numOfAvailableUnits);
    injectRatePlansToRoomContainer(roomContainer, data["rooms"], numOfAvailableUnits);
}

function setAvailabilityExpression(roomContainer, numOfAvailableUnits) {
    var availabilityContainer = $(roomContainer).find('[data-injector-key="availability-expression"]');
    if (numOfAvailableUnits < 5) {
        $(availabilityContainer).show();
        $(availabilityContainer).removeClass("hidden");
    } else {
        $(availabilityContainer).hide();
        $(availabilityContainer).addClass("hidden");
    }
}

function findDataInjectionContainerUnder(key, root) {
    if (root == undefined) {
        root = $('body');
    }
    var container = $(root).find('[data-injection-container=\'' + key + '\']');
    return container;
}

function findRatePlanCardsContainer() {
    var ratePlansContainer = $.find("[data-injection-container='" + "rate-plan-cards-container" + "']");
    return ratePlansContainer;
}

function injectRatePlansToRoomContainer(container, ratePlanData, numOfAvailableUnits) {
    var ratePlansContainerElement = getRatePlansContainerElement();
    var ratePlanDomTemplate = getRatePlanTemplateUnder(ratePlansContainerElement);
    var shouldIncludeTax = $("#room-list").data("tax");
    for (index in ratePlanData) {
        var ratePlan = ratePlanData[index];
        var ratePlanCard = ratePlanDomTemplate.clone();
        injectValuesToRatePlanCard(ratePlanCard, ratePlan, shouldIncludeTax);
        setAvailabilityExpression(ratePlanCard, numOfAvailableUnits);
        $(ratePlansContainerElement).append(ratePlanCard);
    }
    $(container).append(ratePlansContainerElement);
}

function getRatePlanTemplateUnder(container) {
    var domElement = $(container).find('[data-injection-container=\'rate-plan-card\']');
    var ratePlanDomTemplate = cloneFirstElementIn(domElement);
    $(domElement).remove();
    var ratePlanAmenities = findDataInjectionContainerUnder('rate-plan-amenities', ratePlanDomTemplate);
    $(ratePlanAmenities).children().remove();
    return ratePlanDomTemplate;
}

function getRatePlansContainerElement() {
    var ratePlanCardsContainer = findRatePlanCardsContainer();
    var ratePlanCardsContainerTemplate = cloneFirstElementIn(ratePlanCardsContainer);
    return ratePlanCardsContainerTemplate;
}

function injectValuesToRatePlanCard(ratePlanCard, ratePlan, shouldIncludeTax) {

    checkTicFlow(ratePlanCard);

    setTextInDom(ratePlanCard, "rate-plan-title", ratePlan.ratePlanTitle);
    setTextInDom(ratePlanCard, "cancellation-policy", ratePlan.cancellationPolicy);
    var ratePlanTitleDom = $(ratePlanCard).find(".more-rate-title");
    $(ratePlanTitleDom).attr('data-rate-plan-code', ratePlan.ratePlanCode);

    var basePriceForCart;

    if ((ratePlan.discountedPrice != ratePlan.price) && (ratePlan.discountedPrice > 0)) {
        basePriceForCart = displayDiscountedPrice(ratePlanCard, ratePlan, shouldIncludeTax);
    } else {
        basePriceForCart = displayPrice(ratePlanCard, ratePlan, shouldIncludeTax, false);
    }

    var nightlyRates;
    if (ratePlan.nightlyRates && ratePlan.nightlyRates != null) {
        nightlyRates = JSON.stringify(ratePlan.nightlyRates);
    }

    var discountedNightlyRates;
    if (ratePlan.discountedNightlyRates && ratePlan.discountedNightlyRates != null) {
        discountedNightlyRates = JSON.stringify(ratePlan.discountedNightlyRates);
    }

    var taxes;
    if (ratePlan.taxes && ratePlan.taxes != null) {
        taxes = JSON.stringify(ratePlan.taxes);
    }

    setTextInDom(ratePlanCard, 'base-price', basePriceForCart, ratePlan.currencyString);
    setTextInDom(ratePlanCard, 'tax', ratePlan.tax, ratePlan.currencyString);
    setHtmlInDom(ratePlanCard, 'rate-description', ratePlan.rateDescription);
    setTextInDom(ratePlanCard, 'taxes', taxes, ratePlan.currencyString);
    setTextInDom(ratePlanCard, 'nightly-rates', nightlyRates, ratePlan.currencyString);
    setTextInDom(ratePlanCard, 'discounted-nightly-rates', discountedNightlyRates, ratePlan.currencyString)
    setTextInDom(ratePlanCard, 'avg-taxes', ratePlan.avgTax, ratePlan.currencyString)
    setTextInDom(ratePlanCard, 'guarantee-code', ratePlan.guaranteeCode);
    setHtmlInDom(ratePlanCard, 'credit-card-required', ratePlan.creditCardRequired);
    setTextInDom(ratePlanCard, 'guarantee-amount', ratePlan.guaranteeAmount);
    setTextInDom(ratePlanCard, 'guarantee-percentage', ratePlan.guaranteePercentage);
    setTextInDom(ratePlanCard, 'guarantee-description', ratePlan.guaranteeDescription);
    setHtmlInDom(ratePlanCard, 'guarantee-amount-tax-inclusive', ratePlan.guaranteeAmountTaxInclusive);
    setTextInDom(ratePlanCard, 'taxes', taxes, ratePlan.currencyString);
    setTextInDom(ratePlanCard, 'nightly-rates', nightlyRates, ratePlan.currencyString);
    setTextInDom(ratePlanCard, 'discounted-nightly-rates', discountedNightlyRates, ratePlan.currencyString)
    setTextInDom(ratePlanCard, 'avg-taxes', ratePlan.avgTax, ratePlan.currencyString)
    injectAmenitiesToRatePlan(ratePlanCard, ratePlan.ratePlanAmenities);
}

function setHtmlInDom(container, injectorKey, htmlData) {
    var domElement = $(container).find('[data-injector-key=' + injectorKey + ']');
    $(domElement).html(htmlData);
}

function injectAmenitiesToRatePlan(ratePlanCard, ratePlanAmenities) {
    var amenitiesContainer = findDataInjectionContainerUnder('rate-plan-amenities', ratePlanCard);
    var numOfAmenities = ratePlanAmenities.length;
    for (var i = 0; i < numOfAmenities; i++) {
        var amenity = ratePlanAmenities[i];
        var amenityRoot = $('<div>');
        $(amenityRoot).addClass('amenities-avail-list');

        var amenityImage = $('<img>');
        $(amenityImage).attr('src', amenity.amenityIconPath);
        $(amenityImage).addClass('amenities-list-icon');
        $(amenityRoot).append(amenityImage);

        var amenityName = $('<div>');
        $(amenityName).addClass('amenities-list-label');
        $(amenityName).text(amenity.amenityName);
        $(amenityName).addClass('amenities-list-label');
        $(amenityRoot).append(amenityName);

        $(amenitiesContainer).append(amenityRoot);
    }
}

function displayDiscountedPrice(ratePlanCard, ratePlan, shouldIncludeTax) {
    var tax = 0;
    if (shouldIncludeTax) {
        tax = ratePlan.tax;
    }
    var discountedPrice = ratePlan.discountedPrice
    var inclusiveOfTax = discountedPrice + tax;
    var basePriceForCart = ratePlan.totalPrice + tax;
    setTextInDom(ratePlanCard, 'price', ratePlan.price + tax);
    setTextInDom(ratePlanCard, 'discounted-price', inclusiveOfTax);
    return basePriceForCart;
}

function displayPrice(ratePlanCard, ratePlan, shouldIncludeTax, isDiscountAvailable) {
    var basePriceForCart;
    var tax = 0;
    if (shouldIncludeTax) {
        tax = ratePlan.tax;
    }
    if (isDiscountAvailable) {
        setTextInDom(ratePlanCard, 'price', ratePlan.price + tax);
        basePriceForCart = ratePlan.discountedPrice;
        showStrikedPrice(ratePlanCard);
    } else {
        setTextInDom(ratePlanCard, "discounted-price", ratePlan.price + tax);
        basePriceForCart = ratePlan.totalPrice;
        hideStrikedPrice(ratePlanCard);
    }
    return basePriceForCart;
}

function cloneFirstElementIn(elements) {
    return $(elements).first().clone();
}

function injectAmenitiesToRatePlan(ratePlanCard, ratePlanAmenities) {
    var amenitiesContainer = findDataInjectionContainerUnder('rate-plan-amenities', ratePlanCard);
    var numOfAmenities = ratePlanAmenities.length;
    for (var i = 0; i < numOfAmenities; i++) {
        var amenity = ratePlanAmenities[i];
        var amenityRoot = $('<div>');
        $(amenityRoot).addClass('amenities-avail-list');

        var amenityImage = $('<img>');
        $(amenityImage).attr('src', amenity.amenityIconPath);
        $(amenityImage).addClass('amenities-list-icon');
        $(amenityRoot).append(amenityImage);

        var amenityName = $('<div>');
        $(amenityName).addClass('amenities-list-label');
        $(amenityName).text(amenity.amenityName);
        $(amenityName).addClass('amenities-list-label');
        $(amenityRoot).append(amenityName);

        $(amenitiesContainer).append(amenityRoot);
    }
}

function displayDiscountedPrice(ratePlanCard, ratePlan, shouldIncludeTax) {
    var tax = 0;
    if (shouldIncludeTax) {
        tax = ratePlan.tax;
    }
    var discountedPrice = ratePlan.discountedPrice
    var inclusiveOfTax = discountedPrice + tax;
    var basePriceForCart = ratePlan.totalPrice + tax;
    setTextInDom(ratePlanCard, 'price', ratePlan.price + tax);
    setTextInDom(ratePlanCard, 'discounted-price', inclusiveOfTax);
    return basePriceForCart;
}

function displayPrice(ratePlanCard, ratePlan, shouldIncludeTax, isDiscountAvailable) {
    var basePriceForCart;
    var tax = 0;
    if (shouldIncludeTax) {
        tax = ratePlan.tax;
    }
    if (isDiscountAvailable) {
        setTextInDom(ratePlanCard, 'price', ratePlan.price + tax);
        basePriceForCart = ratePlan.discountedPrice;
        showStrikedPrice(ratePlanCard);
    } else {
        if (ratePlan
            && ratePlan.ratePlanTitle
            && (ratePlan.ratePlanTitle.indexOf('TIC Room Redemption Points') != -1
                || ratePlan.ratePlanTitle.indexOf('TAP and TAPPMe Room Redemptions') != -1
                || ratePlan.ratePlanTitle.indexOf('Taj Holidays Redemption') != -1)) {
            setTextInDom(ratePlanCard, "discounted-price", ratePlan.price + ratePlan.avgTax, ratePlan.currencyString);
        } else {
            setTextInDom(ratePlanCard, "discounted-price", ratePlan.price + tax);
        }
        basePriceForCart = ratePlan.totalPrice;
        hideStrikedPrice(ratePlanCard);
    }
    return basePriceForCart;
}

function cloneFirstElementIn(elements) {
    return $(elements).first().clone();
}

function injectPricesToRoomContainer(roomContainer, data) {
    // [TIC-FLOW]
    checkTicFlow(roomContainer);
    var rateTabInDisplay = getRateTabInDisplay();
    var discountedPrice = data.lowestDiscountedPrice;
    var lowestPrice =data.lowestPrice;

    // handle voucher redemption price

	var voucherRedemption = getQueryVoucherRedemption();
	if(voucherRedemption && voucherRedemption == 'true'){
	}


    if ((lowestPrice != discountedPrice) && (discountedPrice > lowestPrice)){
        [discountedPrice, lowestPrice] = [lowestPrice, discountedPrice];
        if ((rateTabInDisplay === 'TIC ROOM REDEMPTION RATES') || (rateTabInDisplay === 'TAP ROOM REDEMPTION RATES')
            || (rateTabInDisplay === 'TAPPMe ROOM REDEMPTION RATES') || rateTabInDisplay === 'TAJ HOLIDAY PACKAGES') {
            var price = discountedPrice;
            if (data.lowestPriceTax) {
                price = price + data.lowestPriceTax;
            }
            setTextInDom(roomContainer, "lowest-discounted-price", discountedPrice);
        } else {
            setTextInDom(roomContainer, "lowest-discounted-price", discountedPrice);
        }
        hideStrikedPrice(roomContainer);
        $(roomContainer).data('sort-order', discountedPrice);
    }else if ((lowestPrice != discountedPrice) && (discountedPrice > 0)) {
        if ((rateTabInDisplay === 'TIC ROOM REDEMPTION RATES') || (rateTabInDisplay === 'TAP ROOM REDEMPTION RATES')
            || (rateTabInDisplay === 'TAPPMe ROOM REDEMPTION RATES') || rateTabInDisplay === 'TAJ HOLIDAY PACKAGES') {
            var price = discountedPrice;
            if (data.lowestPriceTax) {
                price = price + data.lowestPriceTax;
            }
            setTextInDom(roomContainer, "lowest-discounted-price", discountedPrice);
        } else {
            setTextInDom(roomContainer, "lowest-discounted-price", discountedPrice);
        }
        showStrikedPrice(roomContainer);
        $(roomContainer).data('sort-order', discountedPrice);
        setPriceMicroData(roomContainer, "lowest-discounted-price", discountedPrice);
        setTextInDom(roomContainer, "lowest-price", lowestPrice, data.currencyString);
        setPriceMicroData(roomContainer, "lowest-price", lowestPrice);
    }
    else{
        if ((rateTabInDisplay === 'TIC ROOM REDEMPTION RATES') || (rateTabInDisplay === 'TAP ROOM REDEMPTION RATES')
            || (rateTabInDisplay === 'TAPPMe ROOM REDEMPTION RATES') || rateTabInDisplay === 'TAJ HOLIDAY PACKAGES') {
            setTextInDom(roomContainer, "lowest-discounted-price", lowestPrice + data.lowestPriceTax,
                data.currencyString);
            setPriceMicroData(roomContainer, "lowest-discounted-price", lowestPrice + data.lowestPriceTax);
        } else {
            setTextInDom(roomContainer, "lowest-discounted-price", lowestPrice, data.currencyString);
            setPriceMicroData(roomContainer, "lowest-discounted-price", lowestPrice);
        }
        hideStrikedPrice(roomContainer);
        $(roomContainer).data('sort-order', lowestPrice);
    }
    setCurrencySymbolInDoms(data);
}

function setCurrencySymbolInDoms(roomData) {
    var currencySymbolDomList = $.find("[data-injector-key='currency-symbol']");
    var currencySymbol;
    if (roomCurCheck) {
        currencySymbol = getCurrencyCache().currencySymbol.trim();
    } else {
        currencySymbol = roomData.currencyString;
    }
    for (i in currencySymbolDomList) {
        var currencySymbolDom = currencySymbolDomList[i];
        $(currencySymbolDom).text(currencySymbol);
    }
}

function setCurrencyStringInRateTab() {
    var rateFilterDomList = $.find("[data-injector-key='currency-string']");
    var currencyString = getCurrencyStringInDisplay();
    for (i in rateFilterDomList) {
        var rateFilterDom = rateFilterDomList[i];
        $(rateFilterDom).text(currencyString);
    }
}

function showStrikedPrice(container) {
    $(container).find('.rate-card-striked-rate').show();
}

function hideStrikedPrice(container) {
    $(container).find('.rate-card-striked-rate').hide();
}

function setTextInDom(container, injectorKey, text, currencyString) {
    var domElement = $(container).find('[data-injector-key=\'' + injectorKey + '\']');
    $(domElement).text(getCommaFormattedNumber(text));

    // [TIC-FLOW]
    var userDetails = getUserData();
    var rateTabInDisplay = getRateTabInDisplay();
    if (userDetails
        && userDetails.brandData 
        && userDetails.loyaltyInfo 
        && userDetails.loyaltyInfo[0].currentSlab
        && ((rateTabInDisplay === 'TIC ROOM REDEMPTION RATES')
            || (rateTabInDisplay === 'TAP ROOM REDEMPTION RATES')
            || (rateTabInDisplay === 'TAPPMe ROOM REDEMPTION RATES') || rateTabInDisplay === 'TAJ HOLIDAY PACKAGES')) {

        if (currencyString && (currencyString != 'INR' && currencyString != '₹')) {
            var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
            if (ticRoomRedemptionObjectSession && ticRoomRedemptionObjectSession.currencyRateConversionString) {
                var currencyRateConversionString = ticRoomRedemptionObjectSession.currencyRateConversionString;
                var conversionRate = parseFloat(currencyRateConversionString[currencyString + '_INR']);
                text = Math.round(text) * conversionRate;
            }

        }

        $(container).find('.rate-card-actual-rate').find('.tic-points').html(getCommaFormattedNumber(Math.round(text)));
        $(container).find('.rate-card-actual-rate').find('.epicure-points').html(
            getCommaFormattedNumber(Math.round(text / 2)));
        $(container).find('.rate-card-actual-rate').find('.tap-points').html(getCommaFormattedNumber(Math.round(text)));
        $(container).find('.rate-card-actual-rate').find('.tappme-points').html(getCommaFormattedNumber(Math.round(text)));
        // this is for rate card section
        if (injectorKey === 'discounted-price') {
            // Since only one rate code will come for TIC for each room
            $(container).find('.more-rate-info-wrp').find('.rate-info-wrp').find('.present-rate').find('.tic-points')
                .html(getCommaFormattedNumber(Math.round(text)));
            $(container).find('.more-rate-info-wrp').find('.rate-info-wrp').find('.present-rate').find(
                '.epicure-points').html(getCommaFormattedNumber(Math.round(text / 2)));
            $(container).find('.more-rate-info-wrp').find('.rate-info-wrp').find('.present-rate').find('.tap-points')
                .html(getCommaFormattedNumber(Math.round(text)));
            $(container).find('.more-rate-info-wrp').find('.rate-info-wrp').find('.present-rate')
                .find('.tappme-points').html(getCommaFormattedNumber(Math.round(text)));

        }
    }
}

function setPriceMicroData(container, injectorKey, price) {
    var domElement = $(container).find('[data-injector-key=\'' + injectorKey + '\']');
    $(domElement).attr("itemprop", "price");
    $(domElement).attr("content", price);
}

function getCommaFormattedNumber(number) {
    var formattedNumber;
    if (isNaN(number)) {
        formattedNumber = number;
    } else {
        number = Math.round(number);
        formattedNumber = number.toLocaleString('en-IN')
    }
    return formattedNumber;
}

function getAllRoomContainersFromDom() {
    return $.find('[data-component-id="room-card"]');
}

function getRoomContainersFromDom(roomIdentifier) {
    return $.find("[data-room-type-name='" + roomIdentifier + "']");
}

function getRateTabInDisplay() {
    var rateTabInDisplay = "";
    var selectedTabs = $('.rate-tab-wrap').find('.tab-selected')
    // [TIC-FLOW]
    var userDetails = getUserData();
    if ($(selectedTabs).first().attr("data-rate-tic-filter-code") && userDetails && userDetails.brandData 
    && userDetails.loyaltyInfo && userDetails.loyaltyInfo[0].currentSlab) {
        rateTabInDisplay = $(selectedTabs).first().data("rate-tic-filter-code");
		//$('#member-rate-title').text();
    } else {
        rateTabInDisplay = $(selectedTabs).first().data("rate-filter-code");
    }
	/**For tier specific member rate filters */
	if(rateTabInDisplay == 'TIC'){
		rateTabInDisplay = tierRateMemberFilter;
	}
    return rateTabInDisplay;
}

function getHotelCode() {
    var hotelIdDomArray = $.find("[data-hotel-id]");
    var hotelIdContainer = "";
    if (hotelIdDomArray != undefined) {
        hotelIdContainer = hotelIdDomArray[0];
    }
    return $(hotelIdContainer).data().hotelId;
}

function getCheckInDateInDisplay() {
    var sessionData = getBookingOptionsSessionData();
    var fromDate=undefined;
    if(sessionData){
        fromDate = moment(sessionData.fromDate, 'MMM Do YY').format('YYYY-MM-DD');
    }
    return fromDate;
}

function getCheckOutDateInDisplay() {
    var sessionData = getBookingOptionsSessionData();

        var fromDate = moment(sessionData.toDate, 'MMM Do YY').format('YYYY-MM-DD');
        return fromDate;



}

function getRoomOccupantOptions() {
    var sessionData = getBookingOptionsSessionData();
    var roomOptions = [];

    sessionData.roomOptions.forEach(function (value) {
        roomOptions.push(value.adults);
        roomOptions.push(value.children)
    });
    // return sessionData.roomOptions;
    return roomOptions;
}

function getShortCurrencyStringInDisplay() {
    var sessionData = getBookingOptionsSessionData();
    return sessionData.currencySelected;
}

function getCurrencyStringInDisplay() {
    var sessionData = getBookingOptionsSessionData();
    return sessionData.currencySelected;
}

function getSelectedCurrencySymbol() {
    var sessionData = getBookingOptionsSessionData();
    key = sessionData.currencySelected;
    var parentCurrencyContainer = $.find("[data-currency-id='" + key + "']")[0];
    var currencySymbolDom = $(parentCurrencyContainer).find('.header-dd-option-currency')[0];
    var selectedCurrencySymbol = $(currencySymbolDom).text();
    return selectedCurrencySymbol;
}

function expandViewDetailsIfSpecified() {
    var roomIdentifier = getParameterByName3('room-name');
    if (roomIdentifier) {
        var roomContainerDom = getRoomContainersFromDom(roomIdentifier);
        var viewDetailsButton = $(roomContainerDom).find(".rate-card-view-detials-container");
        onClickViewDetailsButton(viewDetailsButton);
    }
}

function getParameterByName3(name) {
    var paramValue = '';
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results != null) {
        paramValue = decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    return paramValue;
}

function getAllRateFilters() {
    var allRateFilters = [];
    var allRateFiltersInDom = $.find("[data-rate-filter-code]");
    for (index in allRateFiltersInDom) {
        var rateFilterDom = $(allRateFiltersInDom).get(index);
        var rateFilterCode = $(rateFilterDom).data("rate-filter-code");	
		/**For tier specific member rate filters */
		if(rateFilterCode == 'TIC'){
			rateFilterCode =  'NP';
			var userDetails = getUserData();
			if (userDetails  && userDetails.loyaltyInfo && userDetails.loyaltyInfo[0].currentSlab){
				var slab = userDetails.loyaltyInfo[0].currentSlab;
				if(slab == "Copper" ||  slab == "Copper*"){ rateFilterCode = "NPC";}
				if(slab == "Silver"){ rateFilterCode = "NPS";}
				if(slab == "Gold"){ rateFilterCode = "NPG";}
				if(slab == "Platinum"){ rateFilterCode = "NPP";}	
				tierRateMemberFilter = rateFilterCode;
				isUserLoggedIn = true;
			}else if(userDetails){
				isUserLoggedIn = true;
				rateFilterCode = "NPC";
			}
		}
		/**/	
        allRateFilters.push(rateFilterCode);
    }
    return allRateFilters;
}

/*
 * This function is modified to fetch all the offerRateCode which are comma-separated in query parameter and is
 * subsequently converted to JS array and is passed in to the RommsAvailabilityFetchServlet
 */

function getAllRatePlanCodes() {
    var ratePlanArray = [];
    var allOfferRateTabsInDom = $.find("[data-offer-rate-code]");
    var rateplanCodes = $(allOfferRateTabsInDom).data("offerRateCode");
    if (rateplanCodes) {
        rateplanCodes = new String(rateplanCodes);
        ratePlanArray = rateplanCodes.split(",");
    } 
    return ratePlanArray;
}

function getPromoCode() {
    return getQueryParameter('promoCode');
}

function getPromoCodeName() {
    return $("#promo-rate-tab-name").text() || "PROMOTIONAL RATES";
}

function getOfferCode() {
	var sebObject = getQuerySebRedemption();
    if(sebObject && sebObject != null && sebObject != undefined  && sebObject.sebRedemption == "true"){
		return "NSEB";
	}else
		return (getQueryParameter('offerRateCode') == 'null'  || getQueryParameter('offerRateCode') == '') ?  null : getQueryParameter('offerRateCode');
}

function getOfferName() {
    return "OFFER RATES";
}

function getBookingOptionsSessionData() {
    return dataCache.session.getData("bookingOptions");
}

function refreshRoomAvailability(e, bookingOptions) {
    setupPromoCodeTab();
    setupNegotiatedRateTab();
    setupRateTab();
    invokeRoomFetchAjaxCall();
}

function ShowMoreShowRateCardRoomDescription() {
    $.each($('.rate-card-room-description'), function (i, value) {
        $(value).cmToggleText({
            charLimit: 170,
            showVal: 'Show More',
            hideVal: 'Show Less',
        })
    })
};

function ShowMoreShowRateCardRoomDetailsDescription() {
    $.each($('.rate-card-room-details-wrap .content'), function (i, value) {
        $(value).cmToggleText({
            charLimit: 220,
            showVal: 'Show More',
            hideVal: 'Show Less',
        });
    })
};

function updateBedTypeAvailability(roomBedTypeMap, kingBedRoomAvail, doubleBedRoomAvail, queenBedRoomAvail, twinBedRoomAvail) {
    var obj = {};
    if (kingBedRoomAvail)
        obj.king = roomBedTypeMap.king;
    if (doubleBedRoomAvail)
        obj.double = roomBedTypeMap.double;
    if (queenBedRoomAvail)
        obj.queen = roomBedTypeMap.queen;
    if (twinBedRoomAvail)
        obj.twin = roomBedTypeMap.twin;
    return obj;
}

var isHolidayTheme = false;

function checkHolidayThemeOnLoad() {
    isHolidayTheme = getQueryParameter('holidaysOffer');
    if (isHolidayTheme) {
        $('.rate-tab-container').hide();
    }
}

function setDefaultRateFilerAfterRateFetch() {
    var selectDefaultRateFilter = getQueryParameter('rateTab');
    if(selectDefaultRateFilter) {
        switch (selectDefaultRateFilter)
        {
            case 'PKG':
                $("[data-rate-filter-code='PKG']:visible").trigger('click');
                break;
            case 'STD':
                $("[data-rate-filter-code='STD']:visible").trigger('click');
                break;
            case 'TIC':
                $("[data-rate-filter-code='TIC']:visible").trigger('click');
                $('[data-rate-filter-code="PKG"]').remove();
                break;
            case 'PROMOCODE':
                $("[data-promo-code]:visible").trigger('click');
                break;
        }
    }
    var showTabsFilter = getQueryParameter('showTabs');
    if(showTabsFilter) {
        switch (showTabsFilter)
        {
            case 'STD,PROMOCODE':
                $("[data-promo-code]:visible").trigger('click');
                setTimeout(function(){ 
                    $("[data-rate-filter-code='STD']").show();
                },500);
                break;
        }
    }
}

function checkHolidayThemeAfterRateFetch() {
    if (isHolidayTheme) {
        $('.rate-tab-container').show();
        if ($('[data-offer-rate-code]').length > 0) {
            $('.rate-tab').not('[data-offer-rate-code]').hide();
        } else if ($("[data-rate-filter-code='PKG']:visible").length > 0) {
            $("[data-rate-filter-code='PKG']:visible").trigger('click');
            $('.rate-tab').not('[data-rate-filter-code="PKG"]').hide();
        } else {
            $('.rate-tab').not('[data-rate-filter-code="STD"]').hide();
        }
    }
}

function checkMemberTypeAfterRateFetch() {
    var member = getUserData();

    if (member) {
        if (member.card && member.card.type) {
            var memberType = member.card.type;
            if (memberType && (memberType === "TAP" || memberType === "TAPPMe" || memberType.indexOf('TIC') != -1)) {
                console.log("member logged in, removing unrelated tabs");
                $('[data-rate-filter-code="PKG"]').remove();
                $('[data-rate-filter-code="STD"]').remove();
                $('[data-rate-filter-code="TIC"]').remove();
            }
        }
    }
}

function checkTicFlow(roomContainer) {
    // [TIC-FLOW]
    var userDetails = getUserData();
    var rateTabInDisplay = getRateTabInDisplay();

    if (userDetails && userDetails.brandData && userDetails.loyaltyInfo && userDetails.loyaltyInfo[0].currentSlab
        && (rateTabInDisplay === 'TIC ROOM REDEMPTION RATES' || rateTabInDisplay === 'TAJ HOLIDAY PACKAGES')) {
        // Show/Hide of Room CARDS
        $(roomContainer).find('.rate-card-actual-rate').find('.current-currency-symbol').addClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.current-currency-value').addClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.rate-highlight').addClass('hidden');
        // for TIC flow, we dont need striked Prices
        $(roomContainer).find('.rate-card-actual-rate').find('.rate-card-striked-rate').removeClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.tic-points').removeClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.epicure-points').removeClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.tic').removeClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.epicure').removeClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.slash').removeClass('hidden');

        // Show/Hide of Rate CARDS
        $(roomContainer).find('.rate-info-wrp').find('.rc-selected-currency').addClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.rc-total-amount').addClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.rate-asterik').addClass('hidden');

        $(roomContainer).find('.rate-info-wrp').find('.rate-card-striked-rate').removeClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.tic-points').removeClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.epicure-points').removeClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.tic').removeClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.epicure').removeClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.slash').removeClass('hidden');

        $('.points-redeemption-msg').show();
        $('.rate-class-disclaimer').hide();
        $('.cm-page-container').addClass("tic-room-redemption-fix");

    } else if (userDetails && userDetails.brandData && userDetails.loyaltyInfo && userDetails.loyaltyInfo[0].currentSlab
        && rateTabInDisplay === 'TAP ROOM REDEMPTION RATES') {

        $(roomContainer).find('.rate-card-actual-rate').find('.current-currency-symbol').addClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.current-currency-value').addClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.rate-highlight').addClass('hidden');

        // for TAP flow, we don't need striked Prices
        $(roomContainer).find('.rate-card-actual-rate').find('.rate-card-striked-rate').removeClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.tap-points').removeClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.tap').removeClass('hidden');

        // Show/Hide of Rate CARDS
        $(roomContainer).find('.rate-info-wrp').find('.rc-selected-currency').addClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.rc-total-amount').addClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.rate-asterik').addClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.rate-card-striked-rate').removeClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.tap-points').removeClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.tap').removeClass('hidden');
        $('.points-redeemption-msg').remove();
        $('.cm-page-container').addClass("tic-room-redemption-fix");
    } else if (userDetails && userDetails.brandData && userDetails.loyaltyInfo && userDetails.loyaltyInfo[0].currentSlab
        && rateTabInDisplay === 'TAPPMe ROOM REDEMPTION RATES') {
        $(roomContainer).find('.rate-card-actual-rate').find('.current-currency-symbol').addClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.current-currency-value').addClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.rate-highlight').addClass('hidden');

        // for TAP flow, we don't need striked Prices
        $(roomContainer).find('.rate-card-actual-rate').find('.rate-card-striked-rate').removeClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.tappme-points').removeClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.tappme').removeClass('hidden');

        // Show/Hide of Rate CARDS
        $(roomContainer).find('.rate-info-wrp').find('.rc-selected-currency').addClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.rc-total-amount').addClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.rate-asterik').addClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.rate-card-striked-rate').removeClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.tappme-points').removeClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.tappme').removeClass('hidden');
        $('.points-redeemption-msg').remove();
        $('.cm-page-container').addClass("tic-room-redemption-fix");
    } else {
        // Show/Hide of Room CARDS
        $(roomContainer).find('.rate-card-actual-rate').find('.current-currency-symbol').removeClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.current-currency-value').removeClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.rate-highlight').removeClass('hidden');
        // for NON TIC flow, we need striked Prices
        $(roomContainer).find('.rate-card-actual-rate').find('.rate-card-striked-rate').addClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.tic-points').addClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.epicure-points').addClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.tic').addClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.epicure').addClass('hidden');
        $(roomContainer).find('.rate-card-actual-rate').find('.slash').addClass('hidden');

        // Show/Hide of Rate CARDS
        $(roomContainer).find('.rate-info-wrp').find('.rc-selected-currency').removeClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.rc-total-amount').removeClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.rate-asterik').removeClass('hidden');

        $(roomContainer).find('.rate-info-wrp').find('.rate-card-striked-rate').addClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.tic-points').addClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.epicure-points').addClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.tic').addClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.epicure').addClass('hidden');
        $(roomContainer).find('.rate-info-wrp').find('.slash').addClass('hidden');
        $('.cm-page-container').removeClass("tic-room-redemption-fix");
    }
}

// [TIC-FLOW]
function ticRoomListFlow() {
    // [TIC-FLOW]
    var userDetails = getUserData();
    var url = window.location.href;

    // [TIC-FLOW]
    // this is for TIC holidays flow
    var tajHolidayRedemption = false;
    if (url && url.indexOf('taj-holiday-redemption') != -1) {
        tajHolidayRedemption = true;
    }
    var globalBookingOption = dataCache.session.getData("bookingOptions");
    var userDetails = getUserData();
    if (globalBookingOption && userDetails && userDetails.brandData && userDetails.loyaltyInfo && userDetails.loyaltyInfo[0].currentSlab && tajHolidayRedemption) {
        globalBookingOption.flow = "taj-holiday-redemption";
        dataCache.session.setData("bookingOptions", globalBookingOption);
    } else {
        globalBookingOption.flow = "";
        dataCache.session.setData("bookingOptions", globalBookingOption);
    }

    var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');

    globalBookingOption = dataCache.session.getData("bookingOptions");
    var ticRoomRedemptionObject = {};
    var isTicRoomRedemptionFlow = false;
    if (globalBookingOption && globalBookingOption.selection) {
        globalBookingOption.selection
            .forEach(function (item, index) {
                if (item.selectedFilterTitle
                    && ((item.selectedFilterTitle === 'TIC ROOM REDEMPTION RATES')
						|| (item.selectedFilterTitle === 'ROOM REDEMPTION RATES')
                        || (item.selectedFilterTitle === 'TAP ROOM REDEMPTION RATES')
                        || (item.selectedFilterTitle === 'TAPPMe ROOM REDEMPTION RATES') || (item.selectedFilterTitle === 'TAJ HOLIDAY PACKAGES'))) {
                    isTicRoomRedemptionFlow = true;
                    if (ticRoomRedemptionObjectSession && ticRoomRedemptionObjectSession.currencyRateConversionString) {
                        ticRoomRedemptionObject.currencyRateConversionString = ticRoomRedemptionObjectSession.currencyRateConversionString;
                    }
                    $(".cm-page-container").addClass('tic-room-redemption-fix');
                }
            });
    }
	
	/*Ama hotels not to have redemption rates*/
	/*if(isAmaTheme)
		return true;*/
		
    /*if ((url.indexOf('offerRateCode') != -1) || !userDetails) {
        $(".tic-room-redemption-tier").hide();
        $(".tic-room-redemption-rates").remove();
    } else */
	if (userDetails && userDetails.brandData && userDetails.loyaltyInfo && userDetails.loyaltyInfo[0].currentSlab
        && globalBookingOption.flow === 'taj-holiday-redemption') {
        $('#member-rate-title').text("TAJ HOLIDAY PACKAGES");
        $(".tic-room-redemption-tier").removeClass('d-none')
        $(".tic-room-redemption-tier-silver").remove();
        $(".tic-room-redemption-tier-gold").remove();
        $(".tic-room-redemption-tier-copper").remove();
        $(".tic-room-redemption-tier-platinum").remove();
        $(".tic-room-redemption-tier-tap").remove();
        $(".tic-room-redemption-tier-tappme").remove();
    } else if (userDetails && userDetails.brandData && 
	(userDetails.loyaltyInfo && userDetails.loyaltyInfo[0].currentSlab === 'Copper' || userDetails.loyaltyInfo && userDetails.loyaltyInfo[0].currentSlab === 'Copper*')) {
        $(".tic-room-redemption-tier").removeClass('d-none');
        $(".tic-room-redemption-tier-silver").remove();
        $(".tic-room-redemption-tier-gold").remove();
        $(".tic-room-redemption-tier-platinum").remove();
        $(".tic-room-redemption-tier-tap").remove();
        $(".tic-room-redemption-tier-tappme").remove();
        $(".tic-room-redemption-tier-hoilday-redemption").remove();
    } else if (userDetails && userDetails.brandData && userDetails.loyaltyInfo && userDetails.loyaltyInfo[0].currentSlab === 'Silver') {
        $(".tic-room-redemption-tier").removeClass('d-none')
        $(".tic-room-redemption-tier-copper").remove();
        $(".tic-room-redemption-tier-gold").remove();
        $(".tic-room-redemption-tier-platinum").remove();
        $(".tic-room-redemption-tier-tap").remove();
        $(".tic-room-redemption-tier-tappme").remove();
        $(".tic-room-redemption-tier-hoilday-redemption").remove();
    } else if (userDetails && userDetails.brandData && userDetails.loyaltyInfo && userDetails.loyaltyInfo[0].currentSlab === 'Gold') {
        $(".tic-room-redemption-tier").removeClass('d-none')
        $(".tic-room-redemption-tier-silver").remove();
        $(".tic-room-redemption-tier-copper").remove();
        $(".tic-room-redemption-tier-platinum").remove();
        $(".tic-room-redemption-tier-tap").remove();
        $(".tic-room-redemption-tier-tappme").remove();
        $(".tic-room-redemption-tier-hoilday-redemption").remove();
    } else if (userDetails && userDetails.brandData && userDetails.loyaltyInfo && userDetails.loyaltyInfo[0].currentSlab === 'Platinum') {
        $(".tic-room-redemption-tier").removeClass('d-none')
        $(".tic-room-redemption-tier-silver").remove();
        $(".tic-room-redemption-tier-gold").remove();
        $(".tic-room-redemption-tier-copper").remove();
        $(".tic-room-redemption-tier-tap").remove();
        $(".tic-room-redemption-tier-tappme").remove();
        $(".tic-room-redemption-tier-hoilday-redemption").remove();
    } else if (userDetails && userDetails.brandData && userDetails.loyaltyInfo && userDetails.loyaltyInfo[0].currentSlab === 'Blue') {
        if (userDetails && userDetails.card && userDetails.card.type === 'TAP') {
            $('#member-rate-title').text("TAP ROOM REDEMPTION RATES");
            $(".tic-room-redemption-tier").removeClass('d-none')
            $(".tic-room-redemption-tier-silver").remove();
            $(".tic-room-redemption-tier-gold").remove();
            $(".tic-room-redemption-tier-copper").remove();
            $(".tic-room-redemption-tier-platinum").remove();
            $(".tic-room-redemption-tier-tappme").remove();
            $(".tic-room-redemption-tier-hoilday-redemption").remove();
        } else {
            $('#member-rate-title').text("TAPPMe ROOM REDEMPTION RATES");
            $(".tic-room-redemption-tier").removeClass('d-none')
            $(".tic-room-redemption-tier-silver").remove();
            $(".tic-room-redemption-tier-gold").remove();
            $(".tic-room-redemption-tier-copper").remove();
            $(".tic-room-redemption-tier-platinum").remove()
            $(".tic-room-redemption-tier-tap").remove();
            $(".tic-room-redemption-tier-hoilday-redemption").remove();
        }
    } else {
        if(userDetails){
			$(".tic-room-redemption-tier").removeClass('d-none');
        } else {
        	$(".tic-room-redemption-tier").hide();
        }
        $(".tic-room-redemption-rates").remove();
    }
	
	/*Hide teh redemption tab since rate code is open for redemption for all rate codes*/
	$(".tic-room-redemption-tier").hide();
	
	if(userDetails){
		$("div.rate-tab[data-rate-filter-code='STD']").insertAfter("div.rate-tab[data-rate-filter-code='TIC']");
	}

    ticRoomRedemptionObject.isTicRoomRedemptionFlow = isTicRoomRedemptionFlow;
    ticRoomRedemptionObject.selection = {};
    dataCache.session.setData("ticRoomRedemptionObject", ticRoomRedemptionObject);

    getCurrencyConversion();
}

// [TIC-FLOW]
function userIsTicBased() {
    var userDetails = getUserData();
    if (userDetails && userDetails.brandData && userDetails.loyaltyInfo && userDetails.loyaltyInfo[0].currentSlab) {
        return true;
    }
    return false;
}

function getCurrencyConversion() {
    var ticRoomRedemptionObjectSession = dataCache.session.getData('ticRoomRedemptionObject');
    if (ticRoomRedemptionObjectSession && ticRoomRedemptionObjectSession.currencyRateConversionString === undefined) {
        /* var clientID = document.querySelector("meta[name='tdl-sso-client_id']").getAttribute("content");
		var accesstkn = localStorage.getItem("access_token");
		var currency = "USD";
		console.log("accesstkn ",accesstkn);
		console.log("clientID ",clientID);
		
       $.ajax({
           type : "GET",
           url : "https://sapi.tatadigital.com/api/v1/loyalty/frontend/exchangeRate?currencyCode=USD",
            crossDomain : true,
            headers: {
                   'client_id':  clientID, 
                   'Authorization':  'Bearer ' +accesstkn,
                   'Ocp-Apim-Subscription-Key': '1',
                    },

       }).done(function(data) {

          console.log("Response from exchangeRate customer api",data);

       }).fail(function(error) {

          console.log("error in exchangeRate customer api",error);
       });*/
	   //commenting it for td exchangeRate Conversion Api
        $.ajax({
            type: 'GET',
            url: "/bin/getCurrencyRateConversion",
            success: function (data) {
                ticRoomRedemptionObjectSession.currencyRateConversionString = data;
                dataCache.session.setData("ticRoomRedemptionObject", ticRoomRedemptionObjectSession);
            }
        });
    }
}

function disablePackageInTicRoomRedemption() {
    var rateTabInDisplay = getRateTabInDisplay();
    // [TIC-FLOW]
    var tabInDisplay = '';
    if (rateTabInDisplay) {
        tabInDisplay = rateTabInDisplay.replace(/ /g, "-");
        $('.rate-cards-container').attr('class', 'rate-cards-container cm-content-blocks');
        $('.rate-cards-container').addClass(tabInDisplay);
    }
    var userDetails = getUserData();
    var url = window.location.href;
    var ticRoomRateSelected = false;
    var otherRateSelected = false;
    var selectedRateTitle = "";
    if (userDetails && userDetails.brandData && userDetails.loyaltyInfo && userDetails.loyaltyInfo[0].currentSlab && tabInDisplay.length > 0) {
        var globalBookingOption = dataCache.session.getData("bookingOptions");
        globalBookingOption.selection.forEach(function (item, index) {
            if (item.selectedFilterTitle && ((item.selectedFilterTitle === 'TIC ROOM REDEMPTION RATES')
				|| (item.selectedFilterTitle === 'ROOM REDEMPTION RATES')
                || (item.selectedFilterTitle === 'TAP ROOM REDEMPTION RATES')
                || (item.selectedFilterTitle === 'TAPPMe ROOM REDEMPTION RATES')
                || (item.selectedFilterTitle === 'TAJ HOLIDAY PACKAGES'))) {
                ticRoomRateSelected = true;
                selectedRateTitle = item.selectedFilterTitle.replace(/ /g, "-");
            } else {
                // for other flow , we are using selectedFilterCode instead of selectedFilterTitle
                otherRateSelected = true;
                selectedRateTitle = item.selectedFilterCode.replace(/ /g, "-");
            }
        });
        if (url.indexOf('offerRateCode') != -1) {
            $('.' + tabInDisplay + ' .more-rates-select-btn').prop('disabled', false);
            $('.' + tabInDisplay + ' .more-rates-select-btn').css('opacity', '1');
        } else if (ticRoomRateSelected && tabInDisplay != selectedRateTitle) {
            $('.' + tabInDisplay + ' .more-rates-select-btn').prop("disabled", true);
            $('.' + tabInDisplay + ' .more-rates-select-btn').css('opacity', '0.5');
        } else if (otherRateSelected && ((tabInDisplay === 'TIC-ROOM-REDEMPTION-RATES')
            || (tabInDisplay === 'TAP-ROOM-REDEMPTION-RATES')
            || (tabInDisplay === 'TAPPMe-ROOM-REDEMPTION-RATES')
            || (tabInDisplay === 'TAJ-HOLIDAY-PACKAGES'))) {
            $('.' + tabInDisplay + ' .more-rates-select-btn').prop('disabled', true);
            $('.' + tabInDisplay + ' .more-rates-select-btn').css('opacity', '0.5');
        } else {
            $('.' + tabInDisplay + ' .more-rates-select-btn').prop('disabled', false);
            $('.' + tabInDisplay + ' .more-rates-select-btn').css('opacity', '1');
        }
    }
}

function showSoldOutMessage(roomOccupancyRates) {
    var rateCodeLength = 0;
    var rateFiltersLength = 0;
    var promoCodeLength = 0;
    var zeroRoomsAvailabilityCount = 0;
    var hotelCode = getHotelCode();
    var roomCount = 0;
    for (var data in roomOccupancyRates.rateCodes) {
        rateCodeLength++;
        if (roomOccupancyRates.rateCodes[data].roomsAvailability) {
            roomCount = 0;
            for (var room in roomOccupancyRates.rateCodes[data].roomsAvailability) {
                roomCount++;
            }
            if (roomCount === 0) {
                zeroRoomsAvailabilityCount++;
            }
        }
    }

    for (var data in roomOccupancyRates.rateFilters) {
        rateFiltersLength++;
        if (roomOccupancyRates.rateFilters[data][hotelCode]
            && roomOccupancyRates.rateFilters[data][hotelCode].roomsAvailability) {
            roomCount = 0;
            for (var room in roomOccupancyRates.rateFilters[data][hotelCode].roomsAvailability) {
                roomCount++;
            }
            if (roomCount === 0) {
                zeroRoomsAvailabilityCount++;
            }
        }
    }
    
    for (var data in roomOccupancyRates.promoCode) {
        promoCodeLength++;
        if (roomOccupancyRates.promoCode[data].roomsAvailability) {
            roomCount = 0;
            for (var room in roomOccupancyRates.promoCode[data].roomsAvailability) {
                roomCount++;
            }
            if (roomCount === 0) {
                zeroRoomsAvailabilityCount++;
            }
        }
    }

    var totalFilters = rateCodeLength + rateFiltersLength + promoCodeLength;
    if($(".hotels-under-destination").hasClass('empty')){
        $(".hotels-under-destination").removeClass('empty');
        allHotelsUnderDestination(zeroRoomsAvailabilityCount, totalFilters);
    }
}

function allHotelsUnderDestination(zeroRoomsAvailabilityCount, totalFilters) {

    var urlPathName = window.location.pathname;

    if($(".cm-page-container").hasClass("ama-theme")){
        urlPathName = "ama" + urlPathName;
    }

    var requestData = {
        url: urlPathName
    };

    $
        .ajax({
            type: "GET",
            url: "/bin/hotelsUnderDestination",
            data: requestData,
            contentType: "application/json"
        })
        .done(
            function (res) {
                $
                    .each(
                        res,
                        function (i, item) {
                            if (item.destinationName) {
                                $(".destination-name").append(item.destinationName);
                            } else if (item.baseHotelName) {
                                $(".hotel-name").append(item.baseHotelName);
                            } else if (item.baseBrand){
								if (item.baseBrand.length){
									$('.same-brand-hotels-msg').removeClass('d-none');
								}
								$.each(item.baseBrand, function (j, itemBase) {
								adjacentHotelCount++;
                                var redirectUrl = "";
                                if(itemBase.hotelShortUrl){
                                    redirectUrl = itemBase.hotelShortUrl;
                                }else if (itemBase.brand === 'seleqtions' || itemBase.brand === 'vivanta') {
                                    redirectUrl = "https://www." + itemBase.brand + "hotels.com/en-in/" + itemBase.hotelNodeName+"/rooms-and-suites";
                                } else if(itemBase.brand === 'taj' || itemBase.brand === 'gateway'){
                                    redirectUrl = "https://www.tajhotels.com/en-in/" + itemBase.brand + '/' + itemBase.hotelNodeName+"/rooms-and-suites";
                                }else if(itemBase.brand === 'ama'){
                                    redirectUrl = "https://www.amastaysandtrails.com/en-in/" + itemBase.hotelNodeName+"/accommodations";
                                }else {
                                    redirectUrl = "/en-in/" + itemBase.brand + '/' + itemBase.hotelNodeName+"/rooms-and-suites";
                                }
								if(itemBase.hotelName && itemBase.hotelNodeName) {
									var html = '<div class="row"><div class="col-md-2 hotel-img-wrp"> <img alt = "hotel image" src="'
										+ itemBase.imagePath
										+ '" /> </div> <div class="col-md-10  details-wrp"> <span class="hotel-title">'
										+ itemBase.hotelName
										+ '</span> <div class="hotel-details"><span class="hotel-area">'
										+ itemBase.hotelArea
										+ ' '
										+ itemBase.hotelCity
										+ ' '
										+ itemBase.hotelPinCode
										+ '</span></div><div class="hotel-link-btn-wrp"><a href="'
										+ redirectUrl
										+ '"class="hotel-links cm-btn-secondary">View Hotel</a></div></div></div>';
									// console.log(itemBase);
									$(".same-brand-hotels").append(html);
								}
								})

                            }
							else if (item.otherBrand){
								if (item.otherBrand.length){
									$('.other-brands-hotels-msg').removeClass('d-none');
								}
								$.each(item.otherBrand, function (k, itemBase) {
								adjacentHotelCount++;
                                var redirectUrl = "";
                                if(itemBase.hotelShortUrl){
                                    redirectUrl = itemBase.hotelShortUrl;
                                }else if (itemBase.brand === 'seleqtions' || itemBase.brand === 'vivanta') {
                                    redirectUrl = "https://www." + itemBase.brand + "hotels.com/en-in/" + itemBase.hotelNodeName+"/rooms-and-suites";
                                } else if(itemBase.brand === 'taj' || itemBase.brand === 'gateway'){
                                    redirectUrl = "https://www.tajhotels.com/en-in/taj/" + itemBase.hotelNodeName+"/rooms-and-suites";
                                }else if(itemBase.brand === 'ama'){
                                    redirectUrl = "https://www.amastaysandtrails.com/en-in/" + itemBase.hotelNodeName+"/accommodations";
                                }
								else {
                                    redirectUrl = "/en-in/" + itemBase.brand + '/' + itemBase.hotelNodeName+"/rooms-and-suites";
                                }
								if(itemBase.hotelName && itemBase.hotelNodeName) {
									var html = '<div class="row"><div class="col-md-2 hotel-img-wrp"> <img alt = "hotel image" src="'
										+ itemBase.imagePath
										+ '" /> </div> <div class="col-md-10  details-wrp"> <span class="hotel-title">'
										+ itemBase.hotelName
										+ '</span> <div class="hotel-details"><span class="hotel-area">'
										+ itemBase.hotelArea
										+ ' '
										+ itemBase.hotelCity
										+ ' '
										+ itemBase.hotelPinCode
										+ '</span></div><div class="hotel-link-btn-wrp"><a href="'
										+ redirectUrl
										+ '"class="hotel-links cm-btn-secondary">View Hotel</a></div></div></div>';
									// console.log(itemBase);
									$(".other-brands-hotels").append(html);
								}
								})

                            }
								else if (item.similarDestination){
								if (item.similarDestination.length){
									$('.similar-property-hotels-msg').removeClass('d-none');
								}
								$.each(item.similarDestination, function (l, itemBase) {
								adjacentHotelCount++;
                                var redirectUrl = "";
                                if(itemBase.hotelShortUrl){
                                    redirectUrl = itemBase.hotelShortUrl;
                                }else if (itemBase.brand === 'seleqtions' || itemBase.brand === 'vivanta') {
                                    redirectUrl = "https://www." + itemBase.brand + "hotels.com/en-in/" + itemBase.hotelNodeName+"/rooms-and-suites";
                                } else if(itemBase.brand === 'taj' || itemBase.brand === 'gateway'){
                                    redirectUrl = "https://www.tajhotels.com/en-in/" + itemBase.brand + '/' + itemBase.hotelNodeName+"/rooms-and-suites";
                                }else if(itemBase.brand === 'ama'){
                                    redirectUrl = "https://www.amastaysandtrails.com/en-in/" + itemBase.hotelNodeName+"/accommodations";
                                }else {
                                    redirectUrl = "/en-in/" + itemBase.brand + '/' + itemBase.hotelNodeName+"/rooms-and-suites";
                                }
								if(itemBase.hotelName && itemBase.hotelNodeName) {
									var html = '<div class="row"><div class="col-md-2 hotel-img-wrp"> <img alt = "hotel image" src="'
										+ itemBase.imagePath
										+ '" /> </div> <div class="col-md-10  details-wrp"> <span class="hotel-title">'
										+ itemBase.hotelName
										+ '</span> <div class="hotel-details"><span class="hotel-area">'
										+ itemBase.hotelArea
										+ ' '
										+ itemBase.hotelCity
										+ ' '
										+ itemBase.hotelPinCode
										+ '</span></div><div class="hotel-link-btn-wrp"><a href="'
										+ redirectUrl
										+ '"class="hotel-links cm-btn-secondary">View Hotel</a></div></div></div>';
									// console.log(itemBase);
									$(".similar-property-hotels").append(html);
								}
								})

                            }
                        });

                if (zeroRoomsAvailabilityCount === totalFilters && adjacentHotelCount > 0) {
                    $('#sold-out').addClass('active');
                }

            }).fail(function () {
    });
}

function roomFirstClick(){
    $(".ama-theme .cm-room-options .rate-card-wrap:first-child .more-rates-button").trigger('click');
}
function checkInCheckOutTime(){
    var checkInTime = $(".check-in-time").val();
    var checkOutTime =$(".check-out-time").val();
    var bookDetails =dataCache.session["data"];
    bookDetails.checkInTime =checkInTime;
    bookDetails.checkOutTime=checkOutTime;
    dataCache.session.setData(bookDetails); 
}

function roomDetailsShowHide() {
    try{
    if($('.cm-page-container').hasClass('ama-theme')){
        $('.rate-card-disclaimer').text('Excluding taxes and Fees');
        $('.last-few-room-text').addClass('last-few-rooms-text');
        $('.last-few-rooms-text').removeClass('last-few-room-text');
        $('.last-few-rooms-text').text('Excluding taxes and Fees');
        $('.last-few-rooms-icon').hide();
    }
    }catch(err){
        console.error('caught exception in roomDetailsShowHide function');
        console.error(err);
    }
}

function checkLoginWithMemberRate() {
    $('.rate-tab').on('click', function() {
		getRateTabCode();
    });
}

function getRateTabCode() {
    var selectedTab = $('.rate-tab.tab-selected');
    rateTabCode = selectedTab.attr("data-rate-filter-code");
    var memberOnlyOffer = dataCache.session.getData("memberOnlyOffer");
    if(!rateTabCode && selectedTab.attr("data-offer-rate-code") && memberOnlyOffer && (memberOnlyOffer == "true")){
        rateTabCode = "TIC";
    }
   
}

// Check for voucher redemptoin parameter in query based on that will only display offer tab
function getQueryVoucherRedemption() {
	return dataCache.session.getData('voucherRedemption');
}

function getQueryVoucherPrice(){
	return dataCache.session.getData('voucherRedemptionShowPrice');
}

function getQuerySebRedemption() {
	return dataCache.session.getData('sebObject');
}
function getQuerySebRedemptionDiscount() {
	return dataCache.session.getData('sebRedemptionDiscount');
}
function getQuerySebNights() {
	return dataCache.session.getData('sebNights');
}

function setQuerySebRedemptionDiscount(val) {
    var sebObject =  dataCache.session.getData('sebObject');
    sebObject.discountRate = val;
    dataCache.session.setData('sebObject',sebObject);
}
function getQuerySebDiscount() {
	return dataCache.session.getData('sebDiscount');
}
function getQuerySebRedemptionMaxNights() {
	return dataCache.session.getData('sebRedemptionNights');
}

function getParamToHideOtherTabs() {
	return dataCache.session.getData('hideAllTabs');
}


// Handle Voucher Redemption price 
function makeAvailabilityAsPerVoucher(promoCodeInfo) {
    
    var promoCodeResp = promoCodeInfo[getHotelCode()];
    
    promoCodeResp.lowestPrice = 0;
	promoCodeResp.lowestDiscountedPrice = 0;
    for(var key in promoCodeResp.roomsAvailability){
        promoCodeResp.roomsAvailability[key].lowestPrice = 0;
		promoCodeResp.roomsAvailability[key].lowestDiscountedPrice = 0;
        var roomsArray = promoCodeResp.roomsAvailability[key].rooms;
        if(roomsArray && roomsArray.length){
            for(var i=0; i<roomsArray.length; i++){
                roomsArray[i].totalPrice = 0;
                roomsArray[i].price = 0;
				roomsArray[i].totalDiscountedPrice = 0;
				roomsArray[i].discountedPrice = 0;
                var nightlyRates = roomsArray[i].nightlyRates;
                if(nightlyRates && nightlyRates.length){
                    for(var j=0; j<nightlyRates.length; j++){
                        nightlyRates[j].priceWithFeeAndTax = nightlyRates[j].tax;
                        nightlyRates[j].price = 0;
                    }
                	roomsArray[i].nightlyRates = nightlyRates;
                }
            }
        	promoCodeResp.roomsAvailability[key].rooms = roomsArray;
        }
    }
    promoCodeInfo[getHotelCode()] = promoCodeResp;
    return promoCodeInfo;
}

// Handle SEB price 
function makeAvailabilityAsPerSEB(promoCodeInfo) {
    $('.checkout-anchor').attr("href","/en-in/booking-cart/");
    var sebObject = getQuerySebRedemption();
    var sebDiscount = sebObject.discountRate;
    //var sebDiscount = getQuerySebRedemptionDiscount();
    var discount = sebObject.discount;
    sebDiscount = Number(sebDiscount)/100;
    var priceMultiplier = 1 - sebDiscount;
    setQuerySebRedemptionDiscount(0);
    var promoCodeResp = promoCodeInfo[getHotelCode()];
     promoCodeResp.lowestPrice *=  priceMultiplier;
	 promoCodeResp.lowestDiscountedPrice *=  priceMultiplier;
    for(var key in promoCodeResp.roomsAvailability){
        promoCodeResp.roomsAvailability[key].lowestPrice *= priceMultiplier;
		promoCodeResp.roomsAvailability[key].lowestDiscountedPrice *= priceMultiplier;
        var roomsArray = promoCodeResp.roomsAvailability[key].rooms;
        if(roomsArray && roomsArray.length){
            for(var i=0; i<roomsArray.length; i++){
              
                roomsArray[i].totalPrice *= priceMultiplier;
                roomsArray[i].price *= priceMultiplier;
				roomsArray[i].totalDiscountedPrice *= priceMultiplier;
                roomsArray[i].discountedPrice *= priceMultiplier;
                              
                var nightlyRates = roomsArray[i].nightlyRates;
                if(nightlyRates && nightlyRates.length){
                    for(var j=0; j<nightlyRates.length; j++){
                      
                        nightlyRates[j].price *= priceMultiplier;
                        nightlyRates[j].priceWithFeeAndTax = parseInt(nightlyRates[j].tax) + parseInt(nightlyRates[j].price);
             
                    }
                	roomsArray[i].nightlyRates = nightlyRates;
                }
            }
        	promoCodeResp.roomsAvailability[key].rooms = roomsArray;
        }
    }
    promoCodeInfo[getHotelCode()] = promoCodeResp;
    return promoCodeInfo;
}
function modifyAvailabilityAsPerSEB(roomsAvailability) {
    if(targetRoomNumforSeb > 1){
   // $('.checkout-anchor').attr("href","/en-in/booking-cart/");
    var sebObject = getQuerySebRedemption();
    var sebDiscount = sebObject.discountRate;
    //var sebDiscount = getQuerySebRedemptionDiscount();
    var discount = sebObject.discount;
    sebDiscount = Number(discount)/100;
    var priceMultiplier = 1 - sebDiscount;
    setQuerySebRedemptionDiscount(0);
    
    for(var key in roomsAvailability){
        roomsAvailability[key].lowestPrice *= priceMultiplier;
		roomsAvailability[key].lowestDiscountedPrice *= priceMultiplier;
        var roomsArray = roomsAvailability[key].rooms;
        if(roomsArray && roomsArray.length){
            for(var i=0; i<roomsArray.length; i++){
              
                roomsArray[i].totalPrice *= priceMultiplier;
                roomsArray[i].price *= priceMultiplier;
				roomsArray[i].totalDiscountedPrice *= priceMultiplier;
                roomsArray[i].discountedPrice *= priceMultiplier;
                              
                var nightlyRates = roomsArray[i].nightlyRates;
                if(nightlyRates && nightlyRates.length){
                    for(var j=0; j<nightlyRates.length; j++){
                      
                        nightlyRates[j].price *= priceMultiplier;
                        nightlyRates[j].priceWithFeeAndTax = parseInt(nightlyRates[j].tax) + parseInt(nightlyRates[j].price);
             
                    }
                	roomsArray[i].nightlyRates = nightlyRates;
                }
            }
        	roomsAvailability[key].rooms = roomsArray;
        }
    }
    
    }
    return roomsAvailability;
}

function textChangesForVoucherRedemotion() {
    $("[data-injector-key='lowest-discounted-price']:visible").each(function(){
		$(this).hide();
	});
    $('.rate-info-label').each(function(){
		$(this).text('Taxes Extra');
    });
    $('.rate-highlight:visible').each(function(){
        $(this).hide();
    });
    $('.rate-card-text-container:visible').each(function(){
        $(this).text('Taxes Extra');
    });
    $('.rate-asterik').each(function(){
		$(this).hide();
    });
    $("[data-injector-key='discounted-price']").each(function(){
		$(this).hide();
	});
    $('[data-injector-key="currency-symbol"]:visible').each(function(){
		$(this).hide();
    });
    $('.redeem-voucher').each(function(){
		$(this).removeClass('d-none');
    });
    $('[data-injector-key="currency-symbol"]').each(function(){
		$(this).hide();
	});
    $('.redeem-voucher-room').each(function(){
		$(this).removeClass('d-none');
	});
    $('.per-night-text:visible').hide();
}
function showAllTabs() {
	return dataCache.session.getData('hideAllTabs');
}
function verifySebNights(){
    var bookingOptions = getBookingOptionsSessionData();
    // var sessionCheckInDate = moment(bookingOptions.fromDate, "MMM Do YY");
    // var sessionCheckOutDate = moment(bookingOptions.toDate, "MMM Do YY");
    // var nights = moment(sessionCheckOutDate, "DD.MM.YYYY").diff(moment(sessionCheckInDate, "DD.MM.YYYY"), 'days');
    var nights = parseInt(bookingOptions.nights) * parseInt(bookingOptions.rooms);
    var sebObject = getQuerySebRedemption();
    if(sebObject && sebObject != null && sebObject != undefined)
        var sebNights = parseInt(sebObject.sebEntitlement);
    else
        var sebNights = 0;    
    if (nights > sebNights) {
       
        showNightsLimitExceeded()
    } else {
       
    }
}
function showNightsLimitExceeded() {
    try {
        
			var popupParams = {
					title : 'Your maximum nights limit is exceeded.',
					description : 'Your maximum nights limit is exceeded',
					 callBack : modifySebNights,
					 needsCta : true,
					isWarning : true
			}

        warningBox(popupParams);
        $('#ca-global-re-direct').attr('href', "#");
              
    } catch (error) {
        console.log(error);
    }
};
function modifySebNights(){
    $('.book-stay-btn').trigger('click');   
}
function sebHideDivs(){
    if ($('.offers-deals-container').length){
		$('.offers-deals-container').hide();
    }

	if ($('.hotel_navigation').length){
		$('.hotel_navigation').hide();
		$('.specific-hotels-breadcrumb').hide();	
    }
    if ($('.navbar-collapse-inner').length){
		$('.nav-item').css("visibility", "hidden");
        console.log("debug");
        $('.navbar-brand').css("visibility", "hidden");
        $('.cm-btn-secondary .book-stay-btn').show();
        $('.navbar-toggler').hide();
        $('.book-a-stay-con').css("visibility", "visible");


    }
}


function loggedInRateTabUpdate(){
	if(!isUserLoggedIn){
		isUserLoggedIn = true;
		location.reload();
	}
}

var bookedRoomType;
$(document).ready(function(){	
	bookedRoomType ={};
	bookedRoomType.value =false;	
	var modifyBookingState = dataCache.session.getData('modifyBookingState');
	if(modifyBookingState=='modifyRoomType'){
		var bookingOptionsCache = dataCache.session.getData('bookingOptions');
		delete bookingOptionsCache.roomOptions[0].userSelection;
		bookingOptionsCache.selection = [];
		dataCache.session.setData('bookingOptions',bookingOptionsCache);
		var bookedOptions = JSON.parse(dataCache.session.getData('bookingDetailsRequest'));
		bookedRoomType.value = bookedOptions.roomTypeName;
		var $checkAvailabilityContainer = $('.check-availability-main-wrap');
		var $editBookingDetailsIcon = $('.btn-edit-booking-details');
		var $bookStayButton = $('.book-stay-btn');
		$checkAvailabilityContainer.css('pointer-events','none');
		$editBookingDetailsIcon.hide();
		$bookStayButton.hide();
	}else{
		console.log("Booking modification is not invoked")
	}	
});
function showBookedRoomType(){
	if(bookedRoomType && bookedRoomType.value){        
        var roomTypeName = bookedRoomType.value;
        roomTypeName = roomTypeName.replace('Edit','');
        roomTypeName = roomTypeName.replace('King Bed','');
        roomTypeName = roomTypeName.replace('Twin Bed','');
        roomTypeName = $.trim(roomTypeName);
		var $bookedRoom = $('.rate-card-wrap[data-room-type-name="'+roomTypeName+'"]');
        if($bookedRoom.length>0){
			$bookedRoom.addClass('booked-room-style');
            var parentOffset = $( '.cm-page-container' ).offset();
            var targetOffset = $bookedRoom.offset();
            $( 'html, body' ).animate( {
                scrollTop: ( parentOffset.top * -1 ) + targetOffset.top - 100
            }, 'slow' );
        }
	}	
}
$(document).ready(function(){
   $('.rooms-and-suites-card .room-description').each(function(){
       $(this).cmToggleText({
           charLimit :135
       });
   });
});
document
		.addEventListener(
				'DOMContentLoaded',
				function() {
					if($('.rate-card-view-detials-container').attr('data-room-details') == 'open'){
                        $('.rate-card-view-detials-container').attr('data-room-details','close');
                        $('.rate-card-view-detials-container').click(function(e) {
                            onClickViewDetailsButton(this, e);
                        })
                    }
                    else{
						$('.rate-card-view-detials-container').attr('data-room-details','open');
                    }
                    if($('.more-rates-button').attr('data-view-details') == 'open'){
                        $('.more-rates-button').attr('data-view-details','close');
						$('.more-rates-button')
							.click(
									function(e) {
										e.stopPropagation();
										$(this).toggleClass(
												'more-rates-button-selected');
										$(this)
												.parents()
												.eq(3)
												.siblings(
														'.rate-card-more-rates-section')
												.toggleClass('visible');
										$(this).parents().eq(3).toggleClass('select-border');
										$(this).find('.icon-drop-down-arrow-white').toggleClass('cm-rotate-icon-180');										
										$(this).parents().eq(3).siblings(
												'.rate-card-details-section')
												.removeClass('visible-table');
										$('.rate-card-view-detials-container')
												.removeClass(
														'rate-card-view-detials-selected')
									})
                    }
                    else{
						$('.more-rates-button').attr('data-view-details','open');
                    }
					$('.service-details-subsection-show-more')
							.click(
									function(e) {
										e.stopPropagation();
										if ($(this).text() == "Show More") {
											$(this).text("Show Less");
											$(this)
													.siblings(
															'.service-details-subsection-container')
													.css('display', 'block');
										} else {
											$(this).text("Show More");
											$(this)
													.siblings(
															'.service-details-subsection-container')
													.css('display', 'none');
										}
									});

					$(
							'.rate-card-details-section, .rate-card-more-rates-section')
							.click(function(e) {
								e.stopPropagation();
							})

					$('.room-details-show-more').click(function() {
						$('.content').css('max-height', 'none');
						$(this).css('display', 'none');
						$('.room-details-show-less').css('display', 'block');
					})
					$('.room-details-show-less').click(function() {
						$('.content').css('max-height', '78px');
						$(this).css('display', 'none');
						$('.room-details-show-more').css('display', 'block');
					})
					
					 /*$.each($('.rate-card-room-description'), function(i, value) {
					        $(value).cmTrimText({
					            charLimit : 150,
					        });
					    });*/
				});

function addCarouselDisplayListenerTo(triggerer, carouselOverlayDom) {
	$(triggerer).click(function() {
		displayCarouselOverlayDom(carouselOverlayDom);
	})
}

function displayCarouselOverlayDom(carouselOverlayDom) {
	$(carouselOverlayDom).removeClass('mr-overlay-initial-none');
	$(carouselOverlayDom).find(".carousel-item").removeClass('active');
	$(carouselOverlayDom).find(".carousel-item").first().addClass('active');
}

function onClickViewDetailsButton(viewDetailsButton, e) {
	if (e != undefined) {
		e.stopPropagation();
	}
	$(viewDetailsButton).toggleClass('rate-card-view-detials-selected');
	var $content = $(viewDetailsButton).parents().eq(2).siblings(
			'.rate-card-details-section');
	$content.toggleClass('visible-table');
	$(viewDetailsButton).parents().eq(2).siblings(
			'.rate-card-more-rates-section').removeClass('visible');
	$('.more-rates-button').removeClass('more-rates-button-selected');
	if(!isIHCLCBSite()) {
	    $('.more-rates-button')
			.html(
					'VIEW RATES<img src="/content/dam/tajhotels/icons/style-icons/drop-down-arrow-white.svg" alt = "drop down arrow white icon">');
	}
	var parentOffset = $('.cm-page-container').offset();
	var targetOffset = $(viewDetailsButton).offset();
	$('body').animate({
		scrollTop : (parentOffset.top * -1) + targetOffset.top
	}, 'slow');
	
	if ($(viewDetailsButton).hasClass('rate-card-view-detials-selected')) {
		$(viewDetailsButton).parents().eq(2).addClass('select-border');
	} else {
		$(viewDetailsButton).parents().eq(2).removeClass('select-border');
	}

}

$(document).ready(function(){
   $('.offers-card-title').each(function(){
       $(this).cmToggleText({
           charLimit :25,
           showVal:""
       });
   });
   $('.offers-card-description').each(function(){
       $(this).cmToggleText({
           charLimit :90
       });
   });
});
function onOfferSelection(navPath, offerRateCode, offerRoundTheYear, offerTitle, noOfNights, offerStartDate,
        offerEndDate, comparableOfferRateCode, offerType) {
    try {
		// test
        // offer details functionality
        var ROOMS_PATH = "";
        var nights = '';
        var startsFrom = '';
        var endsOn = '';
        var today = moment().format('MMM Do YY');
        var tomorrow = '';
        var dayAfterTomorrow = '';
        var hotelPath = $("[data-hotel-path]").data("hotel-path");

        if ($('.cm-page-container').hasClass('ama-theme')) {
            ROOMS_PATH = "accommodations.html";
        } else {
            ROOMS_PATH = "rooms-and-suites.html";
        }

        if (noOfNights && noOfNights != "" && noOfNights != '0') {
            nights = noOfNights;
        } else {
            nights = 1;
        }
        // override default t+15 booking date for custom start and end dates and adding nights
        if (offerRateCode && !offerRoundTheYear) {
            if (comparableOfferRateCode) {
                offerRateCode = offerRateCode + ',' + comparableOfferRateCode;
            }
            if (offerStartDate && offerEndDate) {
                startsFrom = moment(offerStartDate).format('MMM Do YY');
                endsOn = moment(offerEndDate).format('MMM Do YY');
                if (moment(startsFrom, 'MMM Do YY').isSameOrBefore(moment(today, 'MMM Do YY'))
                        && moment(today, 'MMM Do YY').isSameOrBefore(moment(endsOn, 'MMM Do YY'))) {
                    tomorrow = moment().add(1, 'days').format('D/MM/YYYY');
                    dayAfterTomorrow = moment(tomorrow, "D/MM/YYYY").add(parseInt(nights), 'days').format("D/MM/YYYY");
                }
            } else if (!offerStartDate && offerEndDate) {
                endsOn = moment(offerEndDate).format('MMM Do YY');
                if (moment(today, 'MMM Do YY').isSameOrBefore(moment(endsOn, 'MMM Do YY'))) {
                    tomorrow = moment().add(1, 'days').format('D/MM/YYYY');
                    dayAfterTomorrow = moment(tomorrow, "D/MM/YYYY").add(parseInt(nights), 'days').format("D/MM/YYYY");
                }

                // default t+1 booking dates and adding nights
            } else {
                tomorrow = moment().add(1, 'days').format('D/MM/YYYY');
                dayAfterTomorrow = moment(tomorrow, "D/MM/YYYY").add(parseInt(nights), 'days').format('D/MM/YYYY');
            }

            // round the year offer with t+1 dates and nights
        } else {
            tomorrow = moment().add(1, 'days').format('D/MM/YYYY');
            dayAfterTomorrow = moment(tomorrow, "D/MM/YYYY").add(parseInt(nights), 'days').format('D/MM/YYYY');
        }
        if (hotelPath) {
            navPath = hotelPath.replace(".html", "");
            navPath = navPath + ROOMS_PATH;
            navPath = updateQueryString("overrideSessionDates", "true", navPath);
            navPath = updateQueryString("from", tomorrow, navPath);
            navPath = updateQueryString("to", dayAfterTomorrow, navPath);
            navPath = updateQueryString("offerRateCode", offerRateCode, navPath);
            navPath = updateQueryString("offerTitle", offerTitle, navPath);
        }

        // creating the URL for the button
        if (navPath != "" && navPath != null && navPath != undefined) {
            navPath = navPath.replace("//", "/");
        }
        if ((!navPath.includes("http://") && navPath.includes("http:/"))
                || (!navPath.includes("https://") && navPath.includes("https:/"))) {
            navPath = navPath.replace("http:/", "http://").replace("https:/", "https://");
        }
		if(offerType != undefined && offerType != null && offerType.indexOf("taj-innercircle-special-offer") != -1 && !getUserData()){
			 $('body').trigger('taj:sign-in');
		}
		else{
        window.location.href = navPath;
		}
    } catch (err) {
        console.error('error caught in function onOfferSelection');
        console.error(err);
    }
}

function onOfferViewDetailsSelection(offerDetailsPath, offerRateCode, offerTitle, noOfNights, startsFrom,
        comparableOfferRateCode,offerType) {
    try {
        // code replaced to navigate to rooms page instead of view details
        if (offerRateCode) {
            navigateToRooms(offerDetailsPath, offerRateCode, offerTitle, noOfNights, startsFrom,
                    comparableOfferRateCode);
        } else {

            window.location.href = offerDetailsPath;

        }
		console.log("offer");
    } catch (err) {
        console.error('error caught in function onOfferViewDetailsSelection');
        console.error(err);
    }
}

function navigateToRooms(offerDetailsPath, offerRateCode, offerTitle, noOfNights, startsFrom, comparableOfferRateCode) {
    try {
        var hotelPath = offerDetailsPath.split("offers-and-promotions")[0];
        var ROOMS_PATH = "rooms-and-suites.html";
        var navPath = hotelPath.replace(".html", "");
        navPath = navPath + ROOMS_PATH;
        if (navPath != "" && navPath != null) {
            navPath = navPath.replace("//", "/");
        }
        if (offerRateCode) {
            if (comparableOfferRateCode) {
                offerRateCode = offerRateCode + ',' + comparableOfferRateCode;
            }
            navPath = updateQueryString("offerRateCode", offerRateCode, navPath);
            navPath = updateQueryString("offerTitle", offerTitle, navPath);
        }
        navPath = navPath.replace("//", "/");
        if ((!navPath.includes("http://") && navPath.includes("http:/"))
                || (!navPath.includes("https://") && navPath.includes("https:/"))) {
            navPath = navPath.replace("http:/", "http://").replace("https:/", "https://");
        }
        // console.log(navPath)
        window.location.href = navPath;
    } catch (err) {
        console.error('error caught in function navigateToRooms');
        console.error(err);
    }
}

$(document).ready(
        function() {
            try {

                if($("#isOnlyBungalow").text()){
					var bookingOptions = dataCache.session.getData("bookingOptions");
                    bookingOptions.isOnlyBungalowPage = true;
                    dataCache.session.setData("bookingOptions", bookingOptions);
                }
                amaBookingObject = getInitialBookAStaySessionObject();
                amaBookingObject.isAmaCheckAvailabilitySelected = false;
                amaBookingObject.roomType = "room";
                var $guestDropdownWrp = $('.guests-dropdown-wrap');
                autoPopulateBannerBookAStay();

                $guestDropdownWrp.on('click', '.roomHeading', function() {
                    $(this).parent().toggleClass('hideDiv');

                });

                var shouldInvokeCalendarApi = false;
                if(document.getElementById("shouldInvokeCalendarApi"))
					var shouldInvokeCalendarApi = document.getElementById("shouldInvokeCalendarApi").value;
				var checkoutCalendarCAbinded = false;
				if(shouldInvokeCalendarApi){
                    //***Removing Ama Calendar rates****///
					amacacalendarPricing();
				}					
                $('.check-avblty-guests-input').click(function() {
                    showGuestSelectionDropdown();
                    $('.check-avblty-guests-input').toggleClass('eNone');
                });
                var isEndDateTriggered;
                $('#ama-cal-img-to').on('click', function() {
                    $('#input-box-to').focus();
                    $('#input-box-to').click();
                });
                $('#ama-cal-img-from').on('click', function() {
                    $('#input-box-from').focus();
                    $('#input-box-from').click();
                });
                $('#input-box-from').on('change', function(e) {
                    var $nextInput = $('.input-box-ama.date-explore').not($(this));
                    var currVal = $(this).val();
                    var nextVal = $nextInput.val();
                    amaBookingObject.fromDate = moment(new Date(currVal)).format('MMM D YY');
                    amaBookingObject.isAmaCheckAvailabilitySelected = true;
					
					addOfferCalendarLoader();
					setTimeout(function(){ $('.datepicker-loader').remove();},150);					
                    setTimeout(function() {
                        $(this).blur();
                        $('#input-box-to').focus();
                        $('#input-box-to').click();
                        $('.bas-left-date-wrap-ama').removeClass('active');
                        $nextInput.focus();
                        if ($('#input-box-from').datepicker('getDate') >= $('#input-box-to').datepicker('getDate')) {
                            var nextDate = moment((new Date(currVal)).setDate((new Date(currVal)).getDate() + 1)).format('MMM D YY');
                            $nextInput.datepicker('setDate', new Date(nextDate));
                            isEndDateTriggered = true;
                            amaBookingObject.toDate = moment(new Date(nextDate)).format('MMM D YY');
                            amaBookingObject.isAmaCheckAvailabilitySelected = true;
                        }
                        CloseDatePickerIfRequired();
						if(!checkoutCalendarCAbinded){
                            //***Removing Ama Calendar rates****///
							amacacalendarPricing();
							bindNextPrevClickAmaCa();													
							checkoutCalendarCAbinded = true;
						}	
						$('.check-in-check-out-input-wrap').trigger('click');												
                    }, 100);
                });

                $('#input-box-to').on('change', function(e) {
                    setTimeout(function() {
                        if (isEndDateTriggered) {
                            isEndDateTriggered = false;
                        } else {
                            $(this).blur();
                            $('.check-avblty-input-wrap .input-daterange#ama-ca-datepicker input').each(function() {
                                $(this).blur();
                            });
                            $('.input-box-wrapper-ama').hide();
                            $(document).click();
                        }
                        amaBookingObject.toDate = moment(new Date($('#input-box-to').val())).format('MMM D YY');
                        amaBookingObject.isAmaCheckAvailabilitySelected = true;
                        CloseDatePickerIfRequired();
                    }, 100);
                });
                // function in book a stay js
                initializeDatepickerForBookAStay($('.check-avblty-input-wrap .input-daterange#ama-ca-datepicker'),
                        $('.input-box-wrapper-ama'));

                $('#input-box-from').on('click', function() {
                    showCalenderCheckAvailAma($(this), $('.bas-left-date-wrap-ama'));
                });

                $('#input-box-to').on('click', function() {
                    showCalenderCheckAvailAma($(this), $('.bas-right-date-wrap-ama'));
                });

                function showCalenderCheckAvailAma(_this, checkinoutCont) {
                    _this.focus();
                    checkinoutCont.addClass('active').siblings('.bas-single-wrap').removeClass('active');
                    $('.input-box-wrapper-ama').show();
                    $('.bas-calander-container-ama').css('display', 'flex');
                }

                $guestDropdownWrp.on('click', ' .adult-dec, .child-dec, .adult-inc, .child-inc',
                        function() {
                            var item = $(this);
                            var parentItem = item.parent().parent();
                            var count = item.siblings('.counter').text();
                            var isAdultWrp = parentItem.hasClass('adult-wrap');
                            if (item.attr('class').includes('inc')) {
                               if (isBungalowSelected()) {
                                    if ((isAdultWrp && (count > 0 && count < 16))
                                            || (!isAdultWrp && (count > -1 && count < 8))) {
                                        changeGuestCounter(item);
                                    }
                                } else {
                                    if ((isAdultWrp && (count > 0 && count < 16))
                                            || (!isAdultWrp && (count > -1 && count < 7))) {
                                        changeGuestCounter(item);
                                    }
                                }
                            } else if (item.attr('class').includes('dec')) {
                                if ((isAdultWrp && count > 1) || (!isAdultWrp && count > 0)) {
                                    changeGuestCounter(item);
                                }
                            }
                            updateIndividualRoomGuestCount($(this));
                            updateGuestPlaceholder();
                            amaBookingObject.isAmaCheckAvailabilitySelected = true;
                            amaBookingObject.roomOptions = getRoomOptionsSelectedAma();

                        });

                var $guestDropdwnAddBtn = $('.add-room-button');
                $guestDropdownWrp.on('click', '.close-current-room', function() {
                    var roomCounter = $('.guests-dropdown-wrap .guest-room-header').length;
                    var deletedRoom = $(this).closest(".guest-room-header");
                    var deletedRoomIndex = deletedRoom.index();
                    deleteRoomInCartAndUpdateSelectionData(deletedRoomIndex);
                    deletedRoom.nextAll('.guest-room-header').each(function() {
                        deletedRoomIndex++;
                        var _this = $(this);
                        _this.attr('id', 'roomGuestDetails' + deletedRoomIndex);
                        _this.attr('data-room-index', deletedRoomIndex);
                        _this.find('.guest-room-count').text(deletedRoomIndex);
                    });
                    deletedRoom.remove();
                    if (deletedRoomIndex < 5) {
                        $guestDropdwnAddBtn.removeClass('add-room-button-remove');
                    }
                    updateGuestPlaceholder();
                    amaBookingObject.isAmaCheckAvailabilitySelected = true;
                    amaBookingObject.roomOptions = getRoomOptionsSelectedAma();
                });

                $('#addButton').on('click', function() {
                    var roomCounter = $('.guests-dropdown-wrap .guest-room-header').length;
                    if (roomCounter < 5) {
                        roomCounter++;
                        var roomGuestDetails = $(this).prev();
                        var clonedRoomGuestDetails = roomGuestDetails.clone();
                        clonedRoomGuestDetails.find('.noOfPeople').text("(1 Guest)");
                        roomGuestDetails.after(clonedRoomGuestDetails);
                        var cloned = $(this).prev();
                        cloned.find('.guest-room-count').text(roomCounter);
                        cloned.find('.adult-wrap .counter').text(1);
                        cloned.find('.children-wrap .counter').text(0);
                        cloned.attr('data-room-index', roomCounter);
                        cloned.attr('id', 'roomGuestDetails' + roomCounter)
                        cloned.find('.close-current-room').removeClass('display-none');
                    }
                    if (roomCounter > 4) {
                        $guestDropdwnAddBtn.addClass('add-room-button-remove');
                    }
                    updateGuestPlaceholder();

                    amaBookingObject.isAmaCheckAvailabilitySelected = true;
                    amaBookingObject.roomOptions = getRoomOptionsSelectedAma();
                });

                $('#checkAvailability').click(function() {
                    var path = $(this).attr('hrefvalue');
                    isAmaCheckAvailability = true;
                    if (path) {
                        if (numberOfNightsSelectedCheck()) {
                            onClickOnCheckAvailabilty();
                        } else {
                            numberOfNightsExcessWarning(); // function in book a stay js
                        }
                    }

                });

                setTimeout(function() {
                    /* Dropdown Menu */
                    $('.ama-check-availability .dropdown').click(function() {
                        $(this).attr('tabindex', 1).focus();
                        $(this).toggleClass('active');
                        $(this).find('.dropdown-menu').slideToggle(300);
                    });
                    $('.ama-check-availability .dropdown').focusout(function() {
                        $(this).removeClass('active');
                        $(this).find('.dropdown-menu').slideUp(300);
                    });
                    /* End Dropdown Menu */
                }, 3000);

                $('.check-avblty-wrap').on('click', '.dest-item, .hotel-item', function() {
                    updateDestination($(this)); // function in searchBar js
                });

                // radio button click events
                $('.check-avblty-container .radio-container input[type=radio]').change(function() {
                    bungalowRadioSelector();
                    resetAdultChildCount('1', '0');
                });

                $('.book-stay-popup-radio-btn #onlyBungalowBtn').change(function() {
                    // function in book a stay js
                    removePopulatedRoomsBookAStay($(".bas-room-no"));
                    removePopulatedRoomsBookAStay($(".bas-room-details"));
                    $(".bas-room-no").click();
                    selectedRoomsCount = $('.fc-add-package-con').length;
                    if (selectedRoomsCount > 1) {
                        deleteSeletedRoomsInCartAma();
                    }
                });

                disableRoomsRadioBtnInBungalowPage();

            } catch (err) {
                console.error('caught exception in ama checkAvailability js', err);
            }

        });

function disableRoomsRadioBtnInBungalowPage() {
    var isOnlyBungalow = isOnlyBungalowAvailable();
    var currentURL = window.location.pathname;
    if (currentURL.includes('accommodations')) {
        if (isOnlyBungalow) {
            updateOnlyBungalowInSession(true);
            updateBungalowGuest();
        } else {
            updateOnlyBungalowInSession(false);
            updateGuests();
        }
    } else if ($('.cm-page-container').hasClass('home-page-layout') || $('.cm-page-container').hasClass('specific-hotels-page')) {
        updateOnlyBungalowInSession(false);
        updateGuests();
    }
    updateRadioBtnStatus();
    updateGuestPlaceholder();
}

function updateBungalowGuest() {
    amaBookingObject.isAmaCheckAvailabilitySelected = false;
    var bookingOptions = dataCache.session.getData('bookingOptions');
    resetAdultChildCount(bookingOptions.roomOptions[0].adults, bookingOptions.roomOptions[0].children);
}
function updateRadioBtnStatus() {
    if (isOnlyBungalowPageInSession()) {
        $('#onlyRoom, #onlyRoomBtn').parent('.radio-container').addClass('disable-radiobtn');
        $('.check-avblty-container .radio-container #onlyBungalow, .book-stay-popup-radio-btn #onlyBungalowBtn')
                .click();
    } else {
        $('#onlyRoom, #onlyRoomBtn').parent('.radio-container').removeClass('disable-radiobtn');
    }
}

function updateOnlyBungalowInSession(isOnlyBungalow) {
    var bookingOptions = dataCache.session.getData("bookingOptions");
    if (bookingOptions) {
        bookingOptions.isOnlyBungalowPage = isOnlyBungalow;
        if (isOnlyBungalow) {
            bookingOptions.BungalowType = "onlyBungalow";
            if (bookingOptions.previousDates) {
                bookingOptions.previousDates.BungalowType = "onlyBungalow";
            }
            bookingOptions.rooms = 1;
            var roomOptions = changeRoomGuestToBungalow(bookingOptions.roomOptions);
            bookingOptions.roomOptions = [ roomOptions ];
        }
        dataCache.session.setData("bookingOptions", bookingOptions);
    }
}

function isOnlyBungalowPageInSession() {
    var bookingOptions = dataCache.session.getData("bookingOptions");
    if (bookingOptions && bookingOptions.isOnlyBungalowPage) {
        return true;
    }
    return false;
}

function autoPopulateBannerBookAStay() {
    updateDate();
    populateRadioButton();
    // updateGuests();
    // updateGuestPlaceholder();
}

function deleteSeletedRoomsInCartAma() {
    var bookingOptions = dataCache.session.getData("bookingOptions");
    bookingOptions.selection = [];
    bookingOptions.rooms = 1;
    bookingOptions.roomOptions = getInitialRoomOption();
    dataCache.session.setData("bookingOptions", bookingOptions);
    $('.fc-add-package-con').each(function() {
        $(this).remove();
    });
    var floatingCartAma = $('.book-ind-container');
    floatingCartAma.find('.checkout-num').text('0');
    floatingCartAma.find('.cart-total-price').text('0');
    floatingCartAma.css('display', 'none');
    $('.cm-bas-con .cm-bas-content-con').css('bottom', '4%');
}

function getRoomOptionsSelectedAma() {
    var roomsSelector = $('.guests-dropdown-wrap .guest-room-header');
    var roomOptions = [];
    roomsSelector.each(function() {
        var $this = $(this);
        var index = parseInt($this.data('room-index')) - 1;
        roomOptions.push({
            "adults" : $this.find('.adult-wrap .counter').text(),
            "children" : $this.find('.children-wrap .counter').text(),
            "initialRoomIndex" : index
        });
    });
    return roomOptions;
}

function CloseDatePickerIfRequired() {
    if (!$('.input-box-wrapper-ama').is(':visible')) {
        $('.bas-calander-container-ama').css('display', 'none');
    }
}

function updateIndividualRoomGuestCount(_this) {
    var room = _this.closest('.guest-room-header');
    var count = parseInt(room.find('.adult-wrap .counter').text())
            + parseInt(room.find('.children-wrap .counter').text());
    room.find('.noOfPeople').text('(' + count + ' ' + createGuestWordAma(+count, 'Guest') + ')');
}

function changeGuestCounter(element) {
    var counter = element.siblings('.counter').text();
    if (element.attr('class').includes('inc')) {
        counter++;
    } else if (element.attr('class').includes('dec')) {
        counter--;
    }
    element.siblings('.counter').text(counter);
    var currentAdult = $('.adult-wrap .counter').text();
    var currentChild = $('.children-wrap .counter').text();
    var guestUpdate = element.parent().parent().parent().siblings(".roomHeading").children(".noOfPeople");
    var totalGuest = parseInt(currentAdult) + parseInt(currentChild);
}

function updateDate() {
    var bookedOptions = fetchBookAStayDataToPopulate();
    if (bookedOptions) {
        var bookedCheckInDate = moment(bookedOptions.fromDate, "MMM Do YY").format("DD MMM YYYY");
        var bookedCheckOutDate = moment(bookedOptions.toDate, "MMM Do YY").format("DD MMM YYYY");
        $('#input-box-from').val(bookedCheckInDate);
        $('#input-box-to').val(bookedCheckOutDate);
    }

}

function updateGuests() {
    var bookingOptions = fetchBookAStayDataToPopulate();
    var adults;
    var children;
    var rooms = bookingOptions.roomOptions.length;
    removePopulatedRoomsBookAStay($('.check-avblty-wrap .guest-room-header'));
    if (rooms > 1) {
        var index = 1;
        adults = bookingOptions.roomOptions[index - 1].adults;
        children = bookingOptions.roomOptions[index - 1].children;
        $('.guests-dropdown-wrap .adult-wrap .counter').text(adults);
        $('.guests-dropdown-wrap .children-wrap .counter').text(children);
        while (index < rooms) {
            var roomGuestDetails = $('#addButton').prev();
            roomGuestDetails.after(roomGuestDetails.clone());
            adults = bookingOptions.roomOptions[index].adults;
            children = bookingOptions.roomOptions[index].children;
            var cloned = $('#addButton').prev();
            index++;
            cloned.attr("id", "roomGuestDetails" + index);
            cloned.find('.guest-room-count').text(index);
            cloned.find('.adult-wrap .counter').text(adults);
            cloned.find('.children-wrap .counter').text(children);
            cloned.attr('data-room-index', index);
            cloned.find('.close-current-room').removeClass('display-none');
            var guestCountOfThisRoom = +adults + +children;
            cloned.find('.noOfPeople').text(
                    '(' + guestCountOfThisRoom + ' ' + createGuestWordAma(+guestCountOfThisRoom, 'Guest') + ')');

        }
        if (rooms == 5) {
            $('.check-avblty-wrap #addButton').addClass('add-room-button-remove');
        } else {
            $('.check-avblty-wrap #addButton').removeClass('add-room-button-remove');
        }
    } else {
        adults = bookingOptions.roomOptions[0].adults;
        children = bookingOptions.roomOptions[0].children;
        resetAdultChildCount(adults, children);
    }
}

function fetchBookAStayDataToPopulate() {
    return amaBookingObject.isAmaCheckAvailabilitySelected ? amaBookingObject : dataCache.session
            .getData('bookingOptions');
}

function showGuestSelectionDropdown() {
    $('.guests-dropdown-wrap').toggleClass('display-block');
    $('.check-avblty-guests-input .icon-drop-down-arrow').toggleClass('rotate-arrow');
}

function updateGuestPlaceholder() {
    var roomGuestDetails = $('.guests-dropdown-wrap .guest-room-header');
    var rooms = roomGuestDetails.length;
    var adults = 0;
    var children = 0;
    roomGuestDetails.each(function() {
        adults = adults + parseInt($(this).find('.adult-wrap .counter').text());
        children = children + parseInt($(this).find('.children-wrap .counter').text());
    })
    var guests = adults + children;
    if (isBungalowSelected()){
        var guestsCount = guests + ' ' + createGuestWordAma(guests, "Guest");
    }
    else{
    var guestsCount = guests + ' ' + createGuestWordAma(guests, "Guest") + ' ' + rooms + ' '
            + createGuestWordAma(guests, "Room");
    }
    $('.guest-title-wrap').text(guestsCount);
}

function createGuestWordAma(count, word) {
    if (count > 1) {
        return word + 's';
    }
    return word;
}

function parseDate(selectedDateValue) {
    return moment(selectedDateValue).format("MMM Do YY");
}

function bungalowRadioSelector() {
    var roomHeading = $('.check-avblty-wrap .roomHeading');
    var addRoom = $('.check-avblty-wrap #addButton');
    var roomElements = $('.guests-dropdown-wrap .guest-room-header');
    amaBookingObject.isAmaCheckAvailabilitySelected = true;
    if (isBungalowSelected()) {
        amaBookingObject.roomType = "onlyBungalow";
        roomHeading.hide();
        addRoom.addClass('add-room-button-remove');
        var selectedRoomsCount = $('.fc-add-package-con').length;
        if (selectedRoomsCount > 1) {
            deleteSeletedRoomsInCartAma()
        }
        if (roomElements) {
            removePopulatedRoomsBookAStay(roomElements); // function present in book a stay js
        }
    } else {
        amaBookingObject.roomType = "IndividualRoom";
        roomHeading.show();
        addRoom.removeClass('add-room-button-remove');
    }
    setTimeout(function() {
        updateGuestPlaceholder();
    }, 100);
}

function resetAdultChildCount(adults, children) {
    $('.adult-wrap .counter').text(adults);
    $('.children-wrap .counter').text(children);
}

function populateRadioButton() {
    var bookingOptions = fetchBookAStayDataToPopulate();
    var bungalow = $('.check-avblty-container .radio-container #onlyBungalow, .book-stay-popup-radio-btn #onlyBungalowBtn');
    var room = $('.check-avblty-container .radio-container #onlyRoom, .book-stay-popup-radio-btn #onlyRoomBtn');
    var addRoom = $('.check-avblty-wrap #addButton');
    if (bookingOptions && bookingOptions["BungalowType"] && bookingOptions["BungalowType"] == "onlyBungalow") {
        bungalow.click();
        addRoom.addClass('add-room-button-remove');
    } else {
        room.click();
        addRoom.removeClass('add-room-button-remove');
    }
}

function numberOfNightsSelectedCheck() {
    var currentDate = parseSelectedDate($("#input-box-from").datepicker("getDate"));
    var nextDate = parseSelectedDate($("#input-box-to").datepicker("getDate"));
    var numberOFNights = moment(nextDate, "MMM Do YY").diff(moment(currentDate, "MMM Do YY"), 'days');
    if (numberOFNights > 10 && $('#checkAvailability').hasClass('enabled'))
        return false;
    else
        return true;
}

function isOnlyBungalowAvailable() {
    var roomsList = $('.rate-cards-container .rate-card-wrap');
    var roomIterator = 0;
    var roomCount = roomsList.length;
    if (!roomCount) {
        return false;
    }
    for (roomIterator = 0; roomIterator < roomCount; roomIterator++) {
        if ($(roomsList[roomIterator]).attr('data-room-type') != "bungalow") {
            return false;
        }
    }
    return true;
}

//***Removing Ama Calendar rates****//
function amacacalendarPricing(){
    //var isCalendarPricing = document.getElementById("isCalendarPricing").value;
    var isCalendarPricing = true;
	checkoutCalendarCAbinded = false;
    if( isCalendarPricing == true){	
	
	if(checkoutCalendarCAbinded)
		return;
	
	$('.check-in-check-out-input-wrap').click(function(e) {
		e.stopImmediatePropagation();
		e.stopPropagation()
        currentCalendarInputDate = new Date($($(e.currentTarget).find('input')[0]).val());

		if(!($($(e.currentTarget).find('input')[0]).val()) && $($(e.currentTarget).find('input')[0]).hasClass('enquiry-from-value')){
			currentCalendarInputDate = new Date();
		}
		if(!($($(e.currentTarget).find('input')[0]).val()) && $($(e.currentTarget).find('input')[0]).hasClass('enquiry-to-value')){
			currentCalendarInputDate = moment($($(e.currentTarget).closest('.row').find('.enquiry-from-value')[0]).val(), "DD/MM/YYYY")._i;
		}
        var currentCalendarMonthName = monthOfferNames[currentCalendarInputDate.getMonth()];
        var currentCalendarYear = currentCalendarInputDate.getFullYear();
		var  currentCalendarMonthLastDay = new Date(currentCalendarYear, monthOfferNames.indexOf(currentCalendarMonthName) + 1, 0);
                    
        caSelectedHotel = $("#hotelIdFromSearch").text() || pageLevelData.hotelCode;
        var monthJsonCheck = monthAvailability[caSelectedHotel] && monthAvailability[caSelectedHotel][currentCalendarMonthName + currentCalendarYear];
		
         if(!monthJsonCheck || (monthJsonCheck && new Date(monthJsonCheck[monthJsonCheck.length - 1].end) < currentCalendarMonthLastDay)){
			$('td.day').attr('data-custom', '');
			caSelectedFromdate = caSelectedTodate ? new Date((caSelectedTodate.getTime() +  (1 * 24 * 60 * 60 * 1000))) : new Date();
            caSelectedTodate =  new Date((caSelectedFromdate.getTime() +  (60 * 24 * 60 * 60 * 1000)));

			var caUrl = "/bin/calendarAvailability.rates/" + caSelectedHotel + "/" +moment(caSelectedFromdate).format('YYYY-MM-DD') + "/" +
			moment(caSelectedTodate).format('YYYY-MM-DD') + '/INR/1,0/["STD"]/[]//P1N/ratesCache.json';
			console.log("check availability URL",caUrl);

			monthExisting = false;
            console.log($('.datepicker-days').find('tbody'));
            $('.datepicker-loader').remove();
			addOfferCalendarLoader();
            $.ajax({
             type : "GET",
             url:   caUrl,
             contentType : "application/json"
             }).done(addPriceDetails1).fail().always(function() {});
			 
             bindNextPrevClickAmaCa();
           

         }else{
             monthExisting = true;
             addPriceDetails1(monthAvailability);
		}
	return false;
	});	 
	}
}

 $('.check-avblty-wrap').on('click', '.dest-item, .hotel-item', function(){
	if(shouldInvokeCalendarApi){
		caSelectedTodate = currentCalendarInputDate;
	}
 });

function bindNextPrevClickAmaCa(){
setTimeout(function(){ $('.datepicker .datepicker-days .next,.datepicker .datepicker-days .prev').click(function(e) {
                setTimeout(function(){
                    console.log("e",e);
                    var currentCalendarMonthName =$($(e.target).closest('tr').find('.datepicker-switch')[0]).text().split(' ')[0];
                	var currentCalendarYear = $($(e.target).closest('tr').find('.datepicker-switch')[0]).text().split(' ')[1].substring(0,4);
                    var  currentCalendarMonthLastDay = new Date(currentCalendarYear, monthOfferNames.indexOf(currentCalendarMonthName) + 1, 0);
                    console.log(currentCalendarMonthName, currentCalendarYear);
                    
                    var monthJsonCheck = monthAvailability[caSelectedHotel] && monthAvailability[caSelectedHotel][currentCalendarMonthName + currentCalendarYear];
                    if(!monthJsonCheck || (monthJsonCheck && new Date(monthJsonCheck[monthJsonCheck.length - 1].end) < currentCalendarMonthLastDay)){

                        caSelectedFromdate = caSelectedTodate ? new Date((caSelectedTodate.getTime() +  (1 * 24 * 60 * 60 * 1000))) : new Date();
                        caSelectedTodate =  new Date((caSelectedFromdate.getTime() +  (60 * 24 * 60 * 60 * 1000)));

                        var caUrl = "/bin/calendarAvailability.rates/" + caSelectedHotel + "/" +moment(caSelectedFromdate).format('YYYY-MM-DD') + "/" +
						moment(caSelectedTodate).format('YYYY-MM-DD') + '/INR/1,0/["STD"]/[]//P1N/ratesCache.json';
						console.log("check availability URL",caUrl);

                        monthExisting = false;
						$('.datepicker-loader').remove();
						addOfferCalendarLoader();
	
                        $.ajax({
                             type : "GET",
                             url : caUrl,
                             contentType : "application/json"
                             }).done(addPriceDetails1).fail().always(function() {});	
                    }else{
                        monthExisting = true;
                        addPriceDetails1(monthAvailability);
                    }
                },500);
            }); }, 500);
}

function addOfferCalendarLoader(){
    var calenderText = "Finding best rates..";
    if($("#showPrice").val()){
		calenderText = "Finding best rates..";
    }
    else{
        calenderText = "Checking Availability..";
    }
	$('.datepicker-days').find('tbody').append(
	'<div  class="datepicker-loader" style=""><p style="opacity: 1;margin-top: 26%; margin-left: 23%;font-size: x-large;">'+calenderText+'</p></div>');
	$('.ama-check-availability .datepicker-loader').attr('style', 'max-width: 165% !important; width:'+$('.ama-check-availability .datepicker .table-condensed').width()  + 'px');
	
}


var caSelectedHotel;
var caSelectedFromdate;
var caSelectedTodate;
var ItineraryDetails;
var currentCalendarInputDate;
var monthExisting;
var monthOfferNames = ["January", "February", "March", "April", "May", "June",
	  "July", "August", "September", "October", "November", "December", "December"];
var monthAvailability = {};  
var monthJson;

function processOfferRatesJSON(rateJson){	
    monthJson = monthJson ? monthJson : {};	
    monthJson[caSelectedHotel] =  monthJson[caSelectedHotel] ? monthJson[caSelectedHotel] : {};
	for(var i=0;i<rateJson.hotelStays.length;i++){
		var startmonth = new Date(rateJson.hotelStays[i].start).getMonth();
		var endmonth = new Date(rateJson.hotelStays[i].end).getMonth();
		var startYear = new Date(rateJson.hotelStays[i].start).getFullYear();
		var endYear = new Date(rateJson.hotelStays[i].end).getFullYear();
		if(!(monthJson[caSelectedHotel] && monthJson[caSelectedHotel][monthOfferNames[startmonth] + startYear]))
			monthJson[caSelectedHotel][monthOfferNames[startmonth]+startYear] = [];

		monthJson[caSelectedHotel][monthOfferNames[startmonth]+ startYear].push(rateJson.hotelStays[i]);
        //startmonth ++;
		var arrayendmonth = endmonth;
		if(endYear > startYear){
			arrayendmonth = startmonth + endmonth + 1
		}
		var thisYear = startYear; 
		while(arrayendmonth >= startmonth){			
			if(!monthJson[caSelectedHotel][monthOfferNames[startmonth] + thisYear])
				monthJson[caSelectedHotel][monthOfferNames[startmonth] + thisYear] = [];
			monthJson[caSelectedHotel][monthOfferNames[startmonth] +thisYear].push(rateJson.hotelStays[i]);
            caSelectedTodate = new Date(rateJson.hotelStays[i].end);
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

//***Removing Ama Calendar rates****//
function addPriceDetails1(response) {
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
	
	monthAvailability = monthExisting ? response : processOfferRatesJSON(response);

	if(!currentCalendarMonthName){
        currentCalendarMonth = currentCalendarInputDate ? currentCalendarInputDate.getMonth() : $("#input-box-from").datepicker("getDate").getMonth();
		//var currentCalendarMonth = $("#input-box1").datepicker("getDate").getMonth();
        if(currentCalendarMonth == undefined || currentCalendarMonth == null){
			var currentDate = new Date();
            currentCalendarMonth = currentDate.getMonth();
        }
		var currentCalendarMonthName = monthOfferNames[currentCalendarMonth];
        var currentCalendarYear = currentCalendarInputDate ? currentCalendarInputDate.getFullYear(): $("#input-box-to").datepicker("getDate").getFullYear();
        if(!currentCalendarYear){
			var currentDate = new Date();
            currentCalendarYear = currentDate.getFullYear();
        }
	}	
	if(monthAvailability[caSelectedHotel] && monthAvailability[caSelectedHotel][currentCalendarMonthName+currentCalendarYear]){
		showPricesOne(monthAvailability[caSelectedHotel][currentCalendarMonthName+currentCalendarYear]);
	}	
}

//***Removing Ama Calendar rates****//
function showPricesOne(currentMonth){
		var localDateTimestamp = "";		var localDateMonth ="" ; var localDateYear = ""; let isCheckInContainer = true;
        $(".datepicker-days td").filter(function() {
				var date = $(this).text();
				return /\d/.test(date);

			}).each(function(){
            	let $currentInputElem = $(this).parents(".jiva-spa-date-section.package-input-wrp");
				if($('.bas-right-date-wrap-ama').hasClass('active'))
					isCheckInContainer = false;
				//localDateTimestamp = new Date(new Date($(this).data('date')).toLocaleDateString()).getTime();
            	localDateTimestamp = new Date(moment(($(this).data('date'))).format("MM/DD/YYYY")).getTime();
				localDateMonth = monthOfferNames[new Date(localDateTimestamp).getMonth()];
				localDateYear = new Date(localDateTimestamp).getFullYear();
				pricemonth = monthAvailability[caSelectedHotel][localDateMonth + localDateYear];

            if(pricemonth){
                	innerloopbas:
				//console.log("pricemonth",pricemonth);
                    for(var i=0;i<pricemonth.length;i++){
                        if(localDateTimestamp <= new Date(pricemonth[i].end).getTime() && localDateTimestamp >= new Date(pricemonth[i].start).getTime()){
                        if(pricemonth[i].status == 'Close'){
							$(this).attr('data-custom', 'X').addClass("disabled");
                            if(!isCheckInContainer && $(this).prev().attr('data-custom') != 'X'){
								$(this).removeClass("disabled");
                            }
                            break;
                        }
					/*else if(pricemonth[i].status == 'Open' || pricemonth[i].status == 'MinStay'){
						var priceStartDate, priceEndDate, price;
						for(var j=0;j<pricemonth[i].prices.length;j++){
						var priceItem = pricemonth[i].prices[j];
						priceStartDate = new Date(priceItem.start).getTime(); 
						priceEndDate = new Date(priceItem.end).getTime(); 
                        //priceItem.currencyCode = priceItem.currencyCode == 'INR' ? '₹' : priceItem.currencyCode;
                        //price = priceItem.currencyCode + parseInt(priceItem.amountBeforeTax) 
						var pricevals = ((parseInt(priceItem.amountBeforeTax)/1000)+'').split('.');
						var decimal= pricevals[1] ? '.'+pricevals[1].substring(0,1)  : '';
						price = '₹' + pricevals[0] + decimal + 'K';
						$(this).attr('data-custom', '');
                            if(localDateTimestamp >= priceStartDate && localDateTimestamp <= priceEndDate){	
						if($("#showPrice").val()){
							$(this).attr('data-custom', price);
                            break innerloopbas;
						  }
						if(isCheckInContainer)
							$(this).removeClass('disabled-checkIn');
						else 
							$(this).removeClass('disabled-checkOut');

						}
                        }
					}*/
                    }					
                    }
        	}
		});		
    }



$(document).mouseup(function(e) {
    var container = $(".guests-dropdown-wrap");
    var datepickerContainer = $(".input-box-wrapper-ama");

    if (datepickerContainer.is(":visible")) {
        if (!datepickerContainer.is(e.target) && datepickerContainer.has(e.target).length === 0) {
            $('.bas-calander-container-ama').css('display', 'none');
        }
    } else {
        $('.bas-calander-container-ama').css('display', 'none');
    }
    // if the target of the click isn't the container nor a descendant of the container
    if (container.is(":visible")) {
        if (!container.is(e.target) && container.has(e.target).length === 0) {
            container.toggleClass('display-block');
            $('.check-avblty-guests-input').toggleClass('eNone');
            $('.check-avblty-guests-input .icon-drop-down-arrow').toggleClass('rotate-arrow');
        }
    }
});

/* START - Banner auto suggest textbox - hotels/destinations search */

$("#dest-banner").click(function(event) {
    event.preventDefault();
    if($("#search-properties").children().length > 1) {
        $("#search-properties").show();
        const myTimeout = setTimeout(regiterRedirectionEvents, 20);
    }
});

function regiterRedirectionEvents() {
    $(".dest-item").click(function() {
        selectDestOrProp($(this));
        //redirectToDestOrHotel($(this).attr("data-redirect-path"));
    });
    $(".hotel-item").click(function() {
        selectDestOrProp($(this));
        /*
        let hotelRedirectionPath = $(this).attr("data-redirect-path");
        if(hotelRedirectionPath.indexOf("accommodations/") == (hotelRedirectionPath.length-15) ) {
            hotelRedirectionPath = hotelRedirectionPath.slice(0, -15);
        }
        redirectToDestOrHotel(hotelRedirectionPath);
        */
    });
}

function selectDestOrProp(selectedElement) {
    $('#dest-banner').val(selectedElement.text());
    $("#search-properties").hide();
    if($('#checkAvailability').hasClass('enabled') == false)
    	$('#checkAvailability').addClass('enabled');
    startOfDataRedirectPath = selectedElement[0].outerHTML.indexOf("data-redirect-path=") + 20;
    selectedHTML = selectedElement[0].outerHTML;
    var reDirectPath = selectedHTML.substring(startOfDataRedirectPath, selectedHTML.indexOf('"', startOfDataRedirectPath));
    //var reDirectPath = selectedElement.children("a").data("redirect-path");
    enableBestAvailableButton(reDirectPath);
}

function redirectToDestOrHotel(dataRedirectPath) {
    document.location.href = dataRedirectPath;
}

$(document).ready(function(){

	$('#onlyBungalow').trigger('click')
    $('.ama-check-availability .radio-button').hide();

    $(window).click(function(e) {
        var id = e.target.id;
        if (id != "dest-banner") {
            if($('#search-properties').is(':visible'))
            {
                $('#search-properties').hide();
            }
        }
    });

    //$(".neupass-benfits").css("margin-top", "45px");

    $("#dest-banner").val("");
});

var destBannerInput = $('#dest-banner');
var SELECT_INPUT_DEBOUNCE_RATE = 1000;
var contentRootPath = $('#contentRootPath').val();

function createDestResult(title, path) {
    return '<li class="dest-item ama-dest-item"><a class="select-result-item" data-redirect-path="' + path + '">' + title
            + '</a></li>';
}
function createHotelResult(title, path, hotelId, isOnlyBungalow) {
    return '<li class="hotel-item"><a class="select-result-item" data-hotelId="' + hotelId
            + '"data-isOnlyBungalow="'+ isOnlyBungalow + '" data-redirect-path="' + path + '">' + title + '</a></li>';
}
function clearSelectResults(){
	$('#search-properties').empty();
    var items = $('.ama-theme .banner-container #search-properties li');
}

function showSelectResults(){
	$('#search-properties').empty();
	if(propertyArray.destination.length){
		$('#search-properties').append('<li class="dest-item property-heading">Destinations</li>');
            var destinations = propertyArray.destination;
            destinations.forEach(function(destination) {
                var destRedirectPath = destination.path;
                var destinationString = destination.title;
                var destHtml = createDestResult(destination.title, destRedirectPath);
                $('#search-properties').append(destHtml);
        });
	}
	
	if(propertyArray.hotel.length){
        $('#search-properties').append('<li class="dest-item property-heading">Hotels</li>');
        propertyArray.hotel.forEach(function(hotel) {
            var hotelDestination = hotel.title.split(', ');

            var reDirectToRoomPath = hotel.path.concat("accommodations/");
            var hotelHtml = createHotelResult(hotel.title, reDirectToRoomPath, hotel.id, hotel.isOnlyBungalowPage);
            $('#search-properties').append(hotelHtml);
            
        });
	}
}

$(".ama-dest-item").click( function() {
	//alert("click");
});

$('#dest-banner').on("keyup", debounce(function(e) {
    e.stopPropagation();
		$('#search-properties')[0].classList.remove("d-none");
        if (destBannerInput.val().length > 0) {
            clearSelectResults();

	        $.ajax({
            method : "GET",
            url : "/bin/search.data/" + contentRootPath.replace(/\/content\//g, ":") + "//" + destBannerInput.val() + "/result/searchCache.json"
			}).done(function(res,count) {
				    if (Object.keys(res.destinations).length) {
						$('#search-properties').append('<li class="dest-item property-heading">Destinations</li>');
						var destinations = res.destinations;
						destinations.forEach(function(destination) {
							var destRedirectPath = destination.path;
							var destinationString = destination.title;
							var destHtml = createDestResult(destination.title, destRedirectPath);
							$('#search-properties').append(destHtml);

						});
					}
					var websiteHotels = res.hotels.website;
					if (Object.keys(websiteHotels).length) {
						$('#search-properties').append('<li class="dest-item property-heading">Hotels</li>');
						websiteHotels.forEach(function(hotel) {
							var hotelDestination = hotel.title.split(', ');

								var reDirectToRoomPath = hotel.path.concat("accommodations/");
								var hotelHtml = createHotelResultOnlyBunglow(hotel.title, reDirectToRoomPath, hotel.id, 
																			hotel.maxGuests, hotel.maxBeds, hotel.isOnlyBungalowPage);
								$('#search-properties').append(hotelHtml);

						});
					}
					if(!(Object.keys(websiteHotels).length) && !(Object.keys(res.destinations).length)){
						$('#search-properties').append('<li>No results found. Please try another keyword</li>');
					}
                $('#search-properties').show();
                regiterRedirectionEvents()

			}).fail(function() {
            console.error('Ajax call failed.')
			});

        } else {
		 	showSelectResults();
            regiterRedirectionEvents();
        }


}, SELECT_INPUT_DEBOUNCE_RATE));

function createHotelResultOnlyBunglow(title, path, hotelId, maxGuests, maxBeds, isOnlyBungalow) {
    return '<li id="' + title + '" class="hotel-item" data-hotelid = "' + hotelId + '" data-max-guests="' 
    		+ maxGuests + '" data-max-beds="' + maxBeds  +  '" data-redirect-path="' + path + '"' 
            + '"data-isOnlyBungalow="true">' + title + '</li>';
}

/* END - Banner auto suggest textbox - hotels/destinations search */

$(document).ready(function() {
    $('.mr-menu-carousel-overlay').addClass('mr-overlay-initial-none');
    $('.mr-carousel-close-icon-wrap').click(function() {
        $('.mr-menu-carousel-overlay').addClass('mr-overlay-initial-none');
        $('.cm-page-container').removeClass("prevent-page-scroll");
    });
});

function showGallery(obj) {
    var presentScroll = $(window).scrollTop();
    var imagesList = $(obj).data("gallery-images");
    var totalImages = imagesList.length;
    var carouselDom = findCarouselOverlayDom();
    insertImagesToDom(imagesList, carouselDom);
    insertIndicatorsToDom(imagesList.length, carouselDom);
    displayCarouselOverlayDomFunc(carouselDom, totalImages);
    $('.cm-page-container').addClass("prevent-page-scroll");
    $('.mr-carousel-close-icon-wrap').click(function() {
        $('.mr-menu-carousel-overlay').addClass('mr-overlay-initial-none');
        $('.cm-page-container').removeClass("prevent-page-scroll");
        $(window).scrollTop(presentScroll);
    });




    var touchXStart = 0;var touchXEnd = 0;
    $( ".gallery-carousel-container .mr-carousel-images-wrap" ).on( "touchstart", function( event ) {
        touchXStart = event.originalEvent.touches[0].clientX;
    });
    $( ".gallery-carousel-container .mr-carousel-images-wrap" ).on( "touchend", function( event ) {
   		 touchXEnd = event.originalEvent.changedTouches[0].clientX;
        if(touchXEnd > touchXStart){
            $('.gallery-carousel-container .mr-carousel-leftArrow').trigger('click');
        }
        if(touchXEnd < touchXStart){
             $('.gallery-carousel-container .mr-carousel-rightArrow').trigger('click');
        }
	});


}

function insertIndicatorsToDom(numOfIndicators, carouselDom) {
    var indicatorsList = $(carouselDom).find("ol.carousel-indicators");
    var existingListItems = $(indicatorsList).find("li");
    $(existingListItems).remove();
    for (var i = 0; i < numOfIndicators; i++) {
        var listItem = constructIndicatorListItem(i);
        $(indicatorsList).append(listItem);
    }
}

function constructIndicatorListItem(index) {
    var item = $("<li>");
    $(item).attr("data-target", "#mr-menu-carousel");
    $(item).attr("data-slide-to", index + "");
    return item;
}

function displayCarouselOverlayDomFunc(carouselOverlayDom, totalImages) {
    setActiveImage(carouselOverlayDom);
    setActiveIndicator(carouselOverlayDom);
    hookCarousel(totalImages);
    $(carouselOverlayDom).removeClass('mr-overlay-initial-none');
}

function setActiveIndicator(carouselOverlayDom) {
    var indicatorList = $(carouselOverlayDom).find("[data-target='#mr-menu-carousel']");
    $(indicatorList).removeClass('active');
    $(indicatorList).first().addClass('active');
}

function setActiveImage(carouselOverlayDom) {
    $(carouselOverlayDom).find(".carousel-item").removeClass('active');
    $(carouselOverlayDom).find(".carousel-item").first().addClass('active');
}

function findCarouselOverlayDom() {
    var carouselContainerDom = $('.gallery-carousel-container');
    if ($(carouselContainerDom.length != undefined)) {
        carouselContainerDom = $(carouselContainerDom).get(0);
    }
    var carouselDom = $(carouselContainerDom).find('.mr-menu-carousel-overlay');
    return carouselDom;
}

function insertImagesToDom(imagesArray, carouselDom) {
    var carouselInnerWrap = $(carouselDom).find('.carousel-inner');
    var existingCarouselItemDom = $(carouselDom).find('.carousel-item');
    $(existingCarouselItemDom).remove();
    for ( var i in imagesArray) {
        var imageJson = imagesArray[i];

        var carouselItemDom = $("<div>");
        $(carouselItemDom).addClass("carousel-item");

        var titleDom = $("<div>");
        $(titleDom).addClass("mr-carousel-title-wrap");
        $(titleDom).text(imageJson["imageTitle"]);
        $(carouselItemDom).append(titleDom);

        var descriptionDom = $("<div>");
        $(descriptionDom).addClass("mr-carousel-Content-wrap");
        $(descriptionDom).text(imageJson["imageDescription"]);
        $(carouselItemDom).append(descriptionDom);

        var carouselImageWrap = $("<div>");
        $(carouselImageWrap).addClass("mr-carousel-images-wrap")

        $(carouselItemDom).append(carouselImageWrap);

        var imageDom = $("<img>");
        $(imageDom).addClass("mr-overlay-carousel-images");
        var imageFormat = getImageExtension(imageJson["imagePath"]);
        var renditionPath = '/jcr:content/renditions/cq5dam.web.756.756.' + imageFormat;
        $(imageDom).attr("src", imageJson["imagePath"] + renditionPath);
        $(carouselImageWrap).append(imageDom);

        $(carouselInnerWrap).append(carouselItemDom);

                //new changes 
        if(window.location.href.includes('st-james-court-a-taj-hotel-london')){
            var titleDomsecond = $("<div>");
            var titleDomsecondtext = "Note: The picture is for representational purposes only, the décor, layout and furnishings may vary between rooms within the same category"
            $(titleDomsecond).addClass("mr-carousel-title-wrap-new");
            $(titleDomsecond).text(titleDomsecondtext);
            $(carouselItemDom).append(titleDomsecond);
        }
    }
}

function getImageExtension(imgPath) {
    var extension = imgPath.trim().split('.').pop().toLowerCase();
    return extension != 'png' ? 'jpeg' : 'png';
}

function hookCarousel(totalImages) {
    var carouselDom = $('#mr-menu-carousel.carousel');
    $(carouselDom).carousel();

    $('.mr-carousel-close-icon-wrap').on('click', function() {
        $('.mr-menu-carousel-overlay').addClass('mr-overlay-initial-none');
        $('.cm-page-container').removeClass("prevent-page-scroll");
    });

    var carouselCount = totalImages, currentCarousel = 0;
    $('.mr-currentCarousel').text('1');
    $('.mr-carouselTotalCount').text(totalImages);
    $('#mr-menu-carousel.carousel').on('slid.bs.carousel', function(e) {
        $('.mr-currentCarousel').text(($('.mr-menu-carousel-indicators ol li.active').data('slideTo')) + 1);
    });
}


var touchXStart = 0;
var touchXEnd = 0;

$(".mr-carousel-images-wrap" ).on( "touchstart", function( event ) {
touchXStart = event.originalEvent.touches[0].clientX;
});

$( ".mr-carousel-images-wrap" ).on( "touchend", function( event ) {
touchXEnd = event.originalEvent.touches[0].clientX;
if(touchXEnd > touchXStart){
$(".gallery-carousel-container .mr-carousel-leftArrow").trigger('click');
}
if(touchXEnd < touchXStart){
$(".gallery-carousel-container .mr-carousel-rightArrow").trigger('click');
}
});

$(document).ready(function() {
    bookingFlow();
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



var contextualBanners;

if(!contextualBanners)
    contextualBanners = [];

$(document).ready(
        function() {
//            ihclImageCarousel();
            hideControlsMobile();
            hideControlsSingleBanner();

            $("#bannerCarousel").on("slid.bs.carousel", "", hideControlsMobile);


                var isSafari = navigator.userAgent.indexOf('Safari') != -1 && navigator.vendor ==  "Apple Computer, Inc.";
                if (isSafari && document.getElementById("videoPlaySafari")){
                    document.getElementById("videoPlaySafari").style.visibility = "visible";
                } 

                var videoPlaySafari = document.getElementById("videoPlaySafari");
                if(videoPlaySafari){
                $("#videoPlaySafari").on("touchstart click",function(){
                    var vid = document.getElementById("videoAudio");
                    //vid.play();
                    document.getElementById("videoPlaySafari").style.display = "none";
                        /*  if(vid.muted){
                        var volumeImage = document.getElementById("muteVideo");
                            volumeImage.src= "/content/dam/tajhotels/icons/style-icons/mute-48.png";
                            vid.muted = false;
                        }else{
                            var volumeImage = document.getElementById("muteVideo");
                            volumeImage.src= "/content/dam/tajhotels/icons/style-icons/volume-up-2-48.png";
                            vid.muted = true;
                        }
                        */
                     var playPromise = vid.play();
                      if (playPromise !== undefined) {
                        playPromise.then(function(d) {
                          document.getElementById("videoPlaySafari").style.display = "none";
                          if(vid.muted){
                        var volumeImage = document.getElementById("muteVideo");
                            volumeImage.src= "/content/dam/tajhotels/icons/style-icons/mute-48.png";
                            vid.muted = false;
                        }else{
                            var volumeImage = document.getElementById("muteVideo");
                            volumeImage.src= "/content/dam/tajhotels/icons/style-icons/volume-up-2-48.png";
                            vid.muted = true;
                        }
                        }, function(err){
							console.log('auto play is muted');
                        })
                    }
                    return false;
                });
                }
    
                var muteVideo = document.getElementById("muteVideo");
                if(muteVideo){
                $("#muteVideo").on("touchstart click",function(){
                    var vid = document.getElementById("videoAudio");
                    vid.play();
                     if(vid.muted){
                        var volumeImage = document.getElementById("muteVideo");
                            volumeImage.src= "/content/dam/tajhotels/icons/style-icons/mute-48.png";
                            vid.muted = false;
                        }else{
                            var volumeImage = document.getElementById("muteVideo");
                            volumeImage.src= "/content/dam/tajhotels/icons/style-icons/volume-up-2-48.png";
                            vid.muted = true;
                        }
                     /*var playPromise = vid.play();
                      if (playPromise !== undefined) {
                        playPromise.then(_ => {
                          if(vid.muted){
                        var volumeImage = document.getElementById("muteVideo");
                            volumeImage.src= "/content/dam/tajhotels/icons/style-icons/mute-48.png";
                            vid.muted = false;
                        }else{
                            var volumeImage = document.getElementById("muteVideo");
                            volumeImage.src= "/content/dam/tajhotels/icons/style-icons/volume-up-2-48.png";
                            vid.muted = true;
                        }
                        })
                        .catch(error => {
                          // Auto-play was prevented
                          // Show paused UI.
                        });
                    }*/
                    return false;
                });
                }

           /* if(document.getElementById("fullHeight")){

			var fullheight= document.getElementById("fullHeight").value;
            console.log(fullheight);
            if( fullheight=="true")
            {
                $(".carousel, .mr-carousel-wrap, .mr-carousel-wrap .banner-carousel-each-wrap .bannerImage img, .mr-carousel-wrap .banner-carousel-each-wrap, .mr-carousel-wrap img.img-hotel, .banner-carousel>.banner-container-wrapper>.hotel-carousel-section .carousel-item").css('height', '93vh');


                $(".carousel",".mr-carousel-wrap",".mr-carousel-wrap .banner-carousel-each-wrap img",
                 ".mr-carousel-wrap .banner-carousel-each-wrap",".mr-carousel-wrap img.img-hotel",
                 "#bannerCarousel .carousel-item").css("height","93vh");


            }

            }*/


            // hide left, right control on mobile viewport
            function hideControlsMobile() {
                var $this = $("#bannerCarousel");
                if (window.matchMedia('(max-width: 767px)').matches) {
                    $this.children(".carousel-control-prev").hide();
                    $this.children(".carousel-control-next").hide();
                }
            }
            ;

            // hide controls if there is a single banner
            function hideControlsSingleBanner() {
                var $this = $("#bannerCarousel");
                var banners = $this.find(".carousel-item");
                var indicators = $this.find(".carousel-indicators");
                if (banners.length === 1) {
                    indicators.hide();
                    $this.children(".carousel-control-prev").hide();
                    $this.children(".carousel-control-next").hide();
                }
            }
			// show controls if there is a single banner
            function showControlsBanner() {
                var $this = $("#bannerCarousel");
                var banners = $this.find(".carousel-item");
                var indicators = $this.find(".carousel-indicators");
                if (banners.length > 1) {
                    indicators.show();
                    $this.children(".carousel-control-prev").show();
                    $this.children(".carousel-control-next").show();
                }
            }
			

            if (contextualBanners.length > 0) {
                profileFetchListener(updateContextualBanner)
                //if (userCacheExists()) {
                    updateContextualBanner();
                //}
            }

            // Login related
            if ($("#bannerCarousel").data("login-support")) {
                //registerLoginListener(updateUserCarousel);
                if (userCacheExists()) {
                    updateUserCarousel();
                }
				showControlsBanner();
            }

            // Update the first banner slide with user name
            function updateUserCarousel() {
                var banner = $("#bannerCarousel");
                var userData = getUserData();
               	var userBannerIndex = 0;
				if(userData && userData.loyalCustomer=='Y'){
						userBannerIndex = 0;												
				}
				var firstSlide = banner.find(".carousel-item").get(userBannerIndex);
				if(userData.nameDetails){
					userData.nameDetails.salutation = userData.nameDetails.salutation ? userData.nameDetails.salutation : "";
					$($(firstSlide).find(".banner-titles .cm-header-label")[0]).text(userData.nameDetails.salutation + ' ' + userData.nameDetails.firstName + ' '+  userData.nameDetails.lastName );
					var userData = getUserData();
					userData.tier = userData.loyaltyInfo && userData.loyaltyInfo.length > 0 ? 
					(userData.loyaltyInfo[0].currentSlab ? userData.loyaltyInfo[0].currentSlab : '') : '';
					userData.tier = userData.tier == "Copper*" ? "Copper": userData.tier;					
					
					if($($(firstSlide).find(".mr-banner-btn-anc")[userBannerIndex])){
						$($(firstSlide).find(".banner-titles .holidays-selection-text")[0]).html("<img src='/content/dam/tajhotels/icons/style-icons/tick.svg' width='20'><span> You are a "+userData.tier+" Member</span>");
						if(window.location.href.indexOf("en-in/tajinnercircle") != -1){
							$($(firstSlide).find(".mr-banner-btn-anc")[0]).attr('href','/en-in/tajinnercircle/My-Profile/');
						}else if(window.location.href.indexOf("en-in/tataneu") != -1 ){
							$($(firstSlide).find(".mr-banner-btn-anc")[0]).attr('href','/en-in/tataneu/my-profile/');
						}else if(window.location.href.indexOf("en-in/neupass") != -1){
							$($(firstSlide).find(".mr-banner-btn-anc")[0]).attr('href','/en-in/neupass/my-profile/');
						}
					}
				}
				$($('.banner-carousel-each-wrap')[userBannerIndex]).find('.mr-innerCircle-member-offers .holidays-selection-text').removeClass('mobile-display-none')
				$('#bannerCarousel').carousel(0);
            }
		

            function updateContextualBanner() {
                var userData = getUserData();
				if(userData){
					userData.tier = userData.loyaltyInfo && userData.loyaltyInfo.length > 0 ? userData.loyaltyInfo[0].currentSlab : '';
					userData.tier = userData.tier == "Copper*" ? "Copper": userData.tier;
				}
                contextualBanners.forEach(function(banner) {
                    if (userData && userData.tier && banner.context.toLowerCase().includes(userData.tier.toLowerCase())) {
                        $("#bannerCarousel .carousel-inner").prepend(banner.dom);
					   //$( banner.dom ).insertAfter($($("#bannerCarousel .carousel-inner").children())[0] ); 
                        var ind = $('#bannerCarousel .carousel-indicators li');
                        $('#bannerCarousel .carousel-indicators').append('<li data-target="#bannerCarousel" data-slide-to="' + (ind.length) + '"></li>');
                    }else if(!banner.context && !userData){
						$("#bannerCarousel .carousel-inner").prepend(banner.dom);
                        var ind = $('#bannerCarousel .carousel-indicators li');
                        $('#bannerCarousel .carousel-indicators').append('<li data-target="#bannerCarousel" data-slide-to="' + (ind.length) + '"></li>');						
					}
                    
					$('#bannerCarousel').carousel(0);
                });
                
            }

            $('body').on('taj:update-banner-onlogin', function() {
                updateContextualBanner();
                updateUserCarousel();
            });


            getBannerDataForDataLayer();
        });

function registerContextualBanner(contextBannerKey, context) {
    var banner = document.getElementById(contextBannerKey);
    var obj = {
        context : context,
        dom : banner
    };
    contextualBanners.push(obj);
}


//updated for global data layer
function getBannerDataForDataLayer(){
    $('.mr-visit-hotel').each(function(){
        $(this).click(function(){
            try {
                var carousalBtnTxt = $(this).text().split(' ').join('');
                var bannerLabel = $(this).parent('a').siblings('.cm-header-label').text().split(' ').join('');
                var eventName =  bannerLabel+'_CarouselBanner_'+carousalBtnTxt+'_HomePage_'+carousalBtnTxt;
                addParameterToDataLayerObj(eventName, {});
            }
            catch(err){
				console.log('error in creating eventName');
            }
        });
	});

}
$(document).ready(function() {
    setDateInBanner();
    setTempInBanner();
});

function setDateInBanner() {
    try {
        var apiKey = $('.hotel-carousel-section').data('apikey');
        var hotellat = $('#banner-temperature').data('hotellat');
        var hotellon = $('#banner-temperature').data('hotellon');

        if (hotellat != undefined && hotellon != undefined) {
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + hotellat + "&lon=" + hotellon
                    + "&appid=" + apiKey + "&units=metric";

            $.getJSON(queryURL, function(data) {
                var temp = data.main.temp;
                var tempRound = parseFloat(temp).toFixed();
                if (tempRound != 'NaN') {
                    $('#bannerCarousel #temperature-update').append(tempRound);
                } else {
                    $('.hotel-banner-temperature').hide();
                }
            });
        }
    } catch (error) {
        console.log("Lat and long can't found.");
    }
}
function setTempInBanner() {
    try {
        var currentDate = moment(new Date()).format('Do MMM YYYY');
        $('#bannerCarousel').find('.banner-date').text(currentDate);
    } catch (error) {
        console.log("Setting Date in banner failed.");
    }
}

