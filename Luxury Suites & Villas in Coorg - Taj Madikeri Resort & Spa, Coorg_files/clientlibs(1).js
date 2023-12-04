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
					//amacacalendarPricingBas();
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
				//amacacalendarPricingBas();
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
					//amacacalendarPricingBas();
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
			//addOfferCalendarLoaderBas();
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
						//addOfferCalendarLoaderBas();

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
    //var calenderText = "Finding best rates..";
    //if($("#showPriceBas").val()){
        calenderText = "Finding best rates..";
    //}
    //else{
        //calenderText = "Checking Availability..";
    //}
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

