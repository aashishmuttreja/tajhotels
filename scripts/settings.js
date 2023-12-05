'use strict';

/**
 * Set client auth mode - true to enable client auth, false to disable it.
 *
 * Disabling authentication is preferred for initial integration of the SDK with the web app.
 *
 * When client authentication has been disabled, only connections made from unblocked lists (allowed domains) are
 * allowed at the server. This use case is recommended when the client application cannot generate a signed JWT (because
 * of a static website or no authentication mechanism for the web/mobile app) but requires ODA integration. It can also
 * be used when the chat widget is already secured and visible to only authenticated users in the client platforms (web
 * application with the protected page).
 *
 * For other cases, it is recommended that client auth enabled mode is used when using the SDK for production as it adds
 * another layer of security when connecting to a DA/skill.
 *
 * When client authentication has been enabled, client authentication is enforced by signed JWT tokens in addition to
 * the unblocked lists. When the SDK needs to establish a connection with the ODA server, it first requests a JWT token
 * from the client and then sends it along with the connection request. The ODA server validates the token signature and
 * obtains the claim set from the JWT payload to verify the token to establish the connection.
 *
 * The Web channel in ODA must also be enabled to accept client auth enabled connections.
 */
let isClientAuthEnabled = false;

/**
 * Initializes the SDK and sets a global field with passed name for it the can
 * be referred later
 *
 * @param {string} name Name by which the chat widget should be referred
 */
function initSdk(name) {
    // Retry initialization later if the web page hasn't finished loading or the WebSDK is not available yet
    if (!document || !document.body || !WebSDK) {
        setTimeout(function () {
            initSdk(name);
        }, 2000);
        return;
    }

    if (!name) {
        name = 'Bots';          // Set default reference name to 'Bots'
    }

    let Bots;

    /**
     * SDK configuration settings
     *
     * Other than URI, all fields are optional with two exceptions for auth modes:
     *
     * In client auth disabled mode, 'channelId' must be passed, 'userId' is optional
     * In client auth enabled mode, 'clientAuthEnabled: true' must be passed
     */
    const chatWidgetSettings = {
        URI: 'idcs-oda-e4968d3ea0674eb99c574e18fee9d64a-da3.data.digitalassistant.oci.oraclecloud.com',                               // ODA URI, only the hostname part should be passed, without the https://
        clientAuthEnabled: isClientAuthEnabled,     // Enables client auth enabled mode of connection if set true, no need to pass if set false
        channelId: 'cf7d0393-99d8-4e5c-b03a-724d4c8481b4',                   // Channel ID, available in channel settings in ODA UI, optional if client auth enabled
        //userId: '<userID>',                         // User ID, optional field to personalize user experience
        enableAutocomplete: true,                   // Enables autocomplete suggestions on user input
        enableBotAudioResponse: true,               // Enables audio utterance of skill responses
        enableClearMessage: true,                   // Enables display of button to clear conversation
        enableSpeech: true,                         // Enables voice recognition
        showConnectionStatus: true,                 // Displays current connection status on the header
        height: '100vh', //layout modification property
        width: '30vw',  //layout modification property
		i18n: {                                     // Provide translations for the strings used in the widget
            en: {                                   // en locale, can be configured for any locale
                chatTitle: 'Taj Hotels'       // Set title at chat header
            }
        },
        timestampMode: 'relative',                  // Sets the timestamp mode, relative to current time or default (absolute)
        theme: WebSDK.THEME.DEFAULT,                // Redwood dark theme. The default is THEME.DEFAULT, while older theme is available as THEME.CLASSIC
        icons: {
            logo: null,
            avatarAgent: '<svg xmlns="http://www.w3.org/2000/svg" height="32" width="32"><path fill="black" d="M12 2c5.523 0 10 4.477 10 10a9.982 9.982 0 01-3.804 7.85L18 20a9.952 9.952 0 01-6 2C6.477 22 2 17.523 2 12S6.477 2 12 2zm2 16h-4a2 2 0 00-1.766 1.06c1.123.6 2.405.94 3.766.94s2.643-.34 3.765-.94a1.997 1.997 0 00-1.616-1.055zM12 4a8 8 0 00-5.404 13.9A3.996 3.996 0 019.8 16.004L10 16h4c1.438 0 2.7.76 3.404 1.899A8 8 0 0012 4zm0 2c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4zm0 2c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z" fill="#100f0e" fill-rule="evenodd"/></svg>',
            avatarUser: '<svg xmlns="http://www.w3.org/2000/svg" height="32" width="32"><path fill="black" d="M12 2c5.523 0 10 4.477 10 10a9.982 9.982 0 01-3.804 7.85L18 20a9.952 9.952 0 01-6 2C6.477 22 2 17.523 2 12S6.477 2 12 2zm2 16h-4a2 2 0 00-1.766 1.06c1.123.6 2.405.94 3.766.94s2.643-.34 3.765-.94a1.997 1.997 0 00-1.616-1.055zM12 4a8 8 0 00-5.404 13.9A3.996 3.996 0 019.8 16.004L10 16h4c1.438 0 2.7.76 3.404 1.899A8 8 0 0012 4zm0 2c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4zm0 2c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z" fill="#100f0e" fill-rule="evenodd"/></svg>',
            avatarBot: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36" fill="none"><path d="M0 0h36v36H0V0z" fill="#C74634"/><path fill-rule="evenodd" clip-rule="evenodd" d="M7.875 8.625a2.25 2.25 0 00-2.25 2.25v16c0 .621.504 1.125 1.125 1.125h.284c.298 0 .585-.119.796-.33l2.761-2.76a2.25 2.25 0 011.59-.66h15.944a2.25 2.25 0 002.25-2.25V10.875a2.25 2.25 0 00-2.25-2.25H7.875zM24.75 18a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5zm-4.5-2.25a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-9 2.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" fill="#fff"/></svg>',
			launch: 'https://cdn.yellowmessenger.com/oZ8HkXHxbbzl1621245087520.png'
		}
    };

	
	// Enable custom rendering for cards, Make it `true` to enable custom rendering demo
    let enableCustomCards = true;
	
    if (enableCustomCards) { 
        chatWidgetSettings.delegate = {
            render: (message) => {
                if (message.messagePayload.type === "card") {
                    const msgElem = document.getElementById(message.msgId);
                    // Create custom styles
                    const styles = `
                        .custom-card {
                            background-color: white;
                            width: 100%;
                            max-width: 100%;
                            border-radius: 10px;
                            margin: 2px 0 0;
                        }
                        
                        .custom-card ul {
                            list-style: none;
                            padding: 0;
                            margin: 0;
                        }
                        
                        .custom-card li {
                            display: flex;
                            justify-content: space-between;
                            padding: 10px;
                            border-bottom: thin solid #f5f4f2;
                        }
                        
                        .custom-card li:last-child {
                            border-bottom: none;
                        }
                        
                        .custom-card button {
                            align-self: start;
                        }
                        
                        .actions-wrapper {
                            margin-top: 8px;
                        }`;

                    // Create custom template
                    const styleElem = document.createElement('style');
                    styleElem.innerText = styles;
                    document.head.appendChild(styleElem);
					
                    const cardElem = document.createElement('div');
                    cardElem.classList.add('custom-card');
                    const cardList = document.createElement('ul');
                    const cards = message.messagePayload.cards;
                    cards.forEach(card => {
                        const liElem = document.createElement('li');
                        const titleElem = document.createElement('div');
						
                        titleElem.innerText = card.title;
                        liElem.appendChild(titleElem);
                        const button = document.createElement('button');
                        button.innerText = card.actions[0].label;
                        button.addEventListener('click', () => {
                            actionHandler(card.actions[0]);
                        });
                        liElem.appendChild(button);
                        cardList.appendChild(liElem);
                    });
                    cardElem.appendChild(cardList);
                    msgElem.appendChild(cardElem);
					
                    const actions = message.messagePayload.actions;
                    const actionsElem = document.createElement('div');
                    actionsElem.classList.add('actions-wrapper');
                    if (actions && actions.length) {
                        actions.forEach(action => {
                            const button = document.createElement('button');
							//alert(action.label);
                            button.innerText = action.label;
                            actionsElem.appendChild(button);
                            button.addEventListener('click', () => {
                                actionHandler(action);
                            });
                        });
                    }
                    msgElem.appendChild(actionsElem);
                    // Return `true` for customizing rendering for cards
                    return true;
                }
                // Return `false` for all other payloads to continue with WebSDK rendering
                return false;
            }
        }
    } 
		
	

    // Initialize SDK
    if (isClientAuthEnabled) {
        Bots = new WebSDK(chatWidgetSettings, generateToken);
    } else {
        Bots = new WebSDK(chatWidgetSettings);
    }

    // Connect to skill when the widget is expanded for the first time
    let isFirstConnection = true;

    Bots.on(WebSDK.EVENT.WIDGET_OPENED, function () {
		
        if (isFirstConnection) {
            Bots.connect();
			
            isFirstConnection = false;
        }
    });
	
	Bots.on(WebSDK.EVENT.WIDGET_CLOSED,function(){
		  let chatMess = Bots.getConversationHistory();
		  
		  var childpolicy = "";
		  var bookaroom = "";
		  var reservetable = "";
		  var cbmobile = "";
		  var cbrecommend = "";
		  
		  console.log(chatMess.messages.length);
		  console.log('LocalStorage' + localStorage)
		  for (let i = 0; i < chatMess.messages.length-2; i++) {
			//console.log(chatMess.messages[i].messagePayload.text);
			
			if(chatMess.messages[i].messagePayload.type === "text" || chatMess.messages[i].messagePayload.type === "postback"){
				let cmess = chatMess.messages[i].messagePayload.text.toLowerCase();
				
				if (cmess.search("room") >= 0) {
					//bookaroom = "Y";
					getChatHistory('bookaroom');
					break;
				} else if (cmess.search("child") >= 0) {
					//childpolicy = "Y";
					getChatHistory('childpolicy');
					break;
				} else if (cmess.search("table") >= 0){
					//reservetable = "Y";
					getChatHistory('reservetable');
					break;
				} else{
					console.log("leave");
				} 	
			}
		  }
			
			});
	
	function getChatHistory(x) {
		let gchatMess = Bots.getConversationHistory();
		let cbname = "";
		let cbemail = "kumar.rp1215@gmail.com";
		let cbmobile = "";
		let cbenquire = x;
		let cbcusttype ="";
		let cbpropertyname = "";
		let cbreservationdate = "";
		let cbreservationtime = "";
		let cbpeoplecount = "";
		let cbpaymentstatus = "";
		let cblocation = "";
		
		console.log("function call");
        for (let i = 0; i < gchatMess.messages.length; i++) {
			//if (!(gchatMess.messages[i].hasOwnProperty('source'))){
			if(gchatMess.messages[i].messagePayload.type === "text" || gchatMess.messages[i].messagePayload.type === "postback"){
				//alert("bookaroom");
				if (gchatMess.messages[i].messagePayload.text.search("name") >= 0){
					console.log(gchatMess.messages[i + 1].messagePayload.text + "-" + i);
					cbname = gchatMess.messages[i + 1].messagePayload.text;
				}else if (gchatMess.messages[i].messagePayload.text.search("phone number") >= 0){
					console.log(gchatMess.messages[i + 1].messagePayload.text + "-" + i);
					cbmobile = gchatMess.messages[i + 1].messagePayload.text;
				}else if (gchatMess.messages[i].messagePayload.text.search("location") >= 0){
					console.log(gchatMess.messages[i + 1].messagePayload.text + "-" + i);
					cblocation = gchatMess.messages[i + 1].messagePayload.text;
				}else if (gchatMess.messages[i].messagePayload.text.search("date") >= 0){
					console.log(gchatMess.messages[i + 1].messagePayload.text + "-" + i);
					cbreservationdate = gchatMess.messages[i + 1].messagePayload.text;
				}else if (gchatMess.messages[i].messagePayload.text.search("time for your reservation") >= 0){
					console.log(gchatMess.messages[i + 1].messagePayload.text + "-" + i);
					cbreservationtime = gchatMess.messages[i + 1].messagePayload.text;
				}else if (gchatMess.messages[i].messagePayload.text.search("Customer") >= 0){
					console.log(gchatMess.messages[i + 1].messagePayload.text + "-" + i);
					cbcusttype = gchatMess.messages[i].messagePayload.text;
				}else if (gchatMess.messages[i].messagePayload.text.search("Please select an hotel") >= 0){
					console.log(gchatMess.messages[i + 1].messagePayload.text + "-" + i);
					cbpropertyname = gchatMess.messages[i + 1].messagePayload.text;
				}else if (gchatMess.messages[i].messagePayload.text.search("number of people") >= 0){
					console.log(gchatMess.messages[i + 1].messagePayload.text + "-" + i);
					cbpeoplecount = gchatMess.messages[i + 1].messagePayload.text;
				}
			
			}
			
				//console.log(gchatMess.messages[i].messagePayload.text);
			//}
		}
		
		ORA.click({
					"sendSessionInfo": true,
					"data": {
					  "ora.z_action": "chatbot",
					  "ora.z_email":  "kumar.rp1215@gmail.com", 
					  "ora.z_mobile": cbmobile,
					  "ora.z_enquire": cbenquire,
					  "ora.z_custtype": cbcusttype,
					  "ora.z_location": cblocation,
					  "ora.z_propertyname": cbpropertyname,
					  "ora.z_reservationdate": cbreservationdate,
					  "ora.z_reservationtime": cbreservationtime,
					  "ora.z_peoplecount": cbpeoplecount,
					  "ora.z_fName": cbname,
					  "ora.z_paymentstatus": "",
					}
					});
		
    }

    function actionHandler(action) {
        console.log(action);
		Bots.sendMessage(action);
		
    }

    // Create global object to refer Bots
    window[name] = Bots;
}

/**
 * Function to generate JWT tokens. It returns a Promise to provide tokens.
 * The function is passed to SDK which uses it to fetch token whenever it needs
 * to establish connections to chat server
 *
 * @returns {Promise} Promise to provide a signed JWT token
 */
function generateToken() {
    return new Promise(function (resolve) {
        mockApiCall('https://mockurl').then(function (token) {
            resolve(token);
        });
    });
}

/**
 * A function mocking an endpoint call to backend to provide authentication token
 * The recommended behaviour is fetching the token from backend server
 *
 * @returns {Promise} Promise to provide a signed JWT token
 */
function mockApiCall() {
    return new Promise(function (resolve) {
        setTimeout(function () {
            const now = Math.floor(Date.now() / 1000);
            const payload = {
                iat: now,
                exp: now + 3600,
                channelId: '<channelID>',
                userId: '<userID>'
            };
            const SECRET = '<channel-secret>';

            // An unimplemented function generating signed JWT token with given header, payload, and signature
            const token = generateJWTToken({ alg: 'HS256', typ: 'JWT' }, payload, SECRET);
            resolve(token);
        }, Math.floor(Math.random() * 1000) + 1000);
    });
}

/**
 * Unimplemented function to generate signed JWT token. Should be replaced with
 * actual method to generate the token on the server.
 *
 * @param {object} header
 * @param {object} payload
 * @param {string} signature
 */
function generateJWTToken(header, payload, signature) {
    throw new Error('Method not implemented.');
}
